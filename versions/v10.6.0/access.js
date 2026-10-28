const $ = selector => document.querySelector(selector);
const encoder = new TextEncoder(), decoder = new TextDecoder();
const draftKey = 'zhuji-encrypted-admin-drafts-v1';
let config;
async function loadConfig() {
  if (config) return config;
  const response = await fetch('./vault/meta.json', { cache: 'no-store' });
  if (!response.ok) throw Error('解锁配置暂时无法载入，请重新尝试。');
  config = await response.json();
  document.querySelectorAll('[data-version]').forEach(e => e.textContent = config.version);
  return config;
}
let sessionKey, manifest, storageValues = {}, draftQueue = Promise.resolve(), blockedDrafts = false;
let generation = 0;
const imageURLs = new Map(), pendingImages = new Map();
const resourceURLs = new Map(), pendingResources = new Map();
const bytesFrom64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
function to64(bytes) {
  let value = '';
  for (let start = 0; start < bytes.length; start += 8192) value += String.fromCharCode(...bytes.subarray(start, start + 8192));
  return btoa(value);
}
function aad(resource) { return encoder.encode(resource); }
async function decrypt(bytes, resource, key = sessionKey) {
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.subarray(0, 12), additionalData: aad(resource), tagLength: 128 }, key, bytes.subarray(12));
}
async function readEncrypted(url, resource, key = sessionKey) {
  const response = await fetch(url);
  if (!response.ok) throw Error('资料暂时无法载入，请稍后重试。');
  return decrypt(new Uint8Array(await response.arrayBuffer()), resource, key);
}
function storeDraft() {
  if (blockedDrafts) throw Error('旧草稿未解锁，已停止覆盖。');
  const snapshot = JSON.stringify(storageValues), key = sessionKey;
  $('#save-state').textContent = '正在保存…';
  draftQueue = draftQueue.catch(() => {}).then(async () => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad(draftKey), tagLength: 128 }, key, encoder.encode(snapshot)));
    const buffer = new Uint8Array(iv.length + encrypted.length); buffer.set(iv); buffer.set(encrypted, iv.length);
    localStorage.setItem(draftKey, to64(buffer));
    $('#save-state').textContent = '草稿已加密保存';
  });
  draftQueue.catch(() => { $('#save-state').textContent = '草稿未保存，请导出备份'; });
}
async function prepareEvidence(evidence) {
  const name = (evidence.imported ? 'imported/' : '') + evidence.filename;
  if (imageURLs.has(name)) return;
  if (pendingImages.has(name)) return pendingImages.get(name);
  const asset = manifest?.evidence[name], key = sessionKey, stamp = generation;
  if (!asset || !key) throw Error('原图未收录在本版本中。');
  const pending = (async () => {
    const bytes = await readEncrypted(new URL(asset.path, location.href), config.version + '/' + asset.path, key);
    if (stamp !== generation || !sessionKey) throw Error('住记已锁定。');
    imageURLs.set(name, URL.createObjectURL(new Blob([bytes], { type: asset.mime })));
  })();
  pendingImages.set(name, pending);
  try { await pending; } finally { pendingImages.delete(name); }
}
async function privateResourceURL(name) {
  if(!sessionKey)throw Error('住记已锁定。');
  if(resourceURLs.has(name))return resourceURLs.get(name);
  if(pendingResources.has(name))return pendingResources.get(name);
  const asset=manifest?.resources?.[name],key=sessionKey,stamp=generation;
  if(!asset)throw Error('本版本未收录此资料。');
  const pending=(async()=>{
    const bytes=await readEncrypted(new URL(asset.path,location.href),config.version+'/'+asset.path,key);
    if(stamp!==generation||!sessionKey)throw Error('住记已锁定。');
    const url=URL.createObjectURL(new Blob([bytes],{type:asset.mime}));resourceURLs.set(name,url);return url;
  })();
  pendingResources.set(name,pending);
  try{return await pending;}finally{pendingResources.delete(name);}
}
$('#show-password').addEventListener('click', () => {
  const show = $('#passphrase').type === 'password';
  $('#passphrase').type = show ? 'text' : 'password';
  $('#show-password').textContent = show ? '隐藏' : '显示';
  $('#show-password').setAttribute('aria-pressed', String(show));
});
$('#unlock-form').addEventListener('submit', async event => {
  event.preventDefault();
  if ($('#unlock').disabled) return;
  $('#unlock').disabled = true; $('#unlock').textContent = '正在解锁…'; $('#unlock-error').textContent = '';
  let password = $('#passphrase').value;
  try {
    if (!crypto.subtle) throw Error('请使用支持安全连接的浏览器打开预览网址。');
    await loadConfig();
    const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    password = ''; $('#passphrase').value = '';
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytesFrom64(config.salt), iterations: config.iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const decoded = JSON.parse(decoder.decode(await readEncrypted('./vault/manifest.bin', config.version + '/manifest', key)));
    if (decoded.version !== config.version) throw Error('版本不一致，请刷新后重试。');
    sessionKey = key; manifest = decoded; generation++; storageValues = {}; blockedDrafts = false;
    const encryptedDraft = localStorage.getItem(draftKey);
    if (encryptedDraft) {
      try { storageValues = JSON.parse(decoder.decode(await decrypt(bytesFrom64(encryptedDraft), draftKey))); }
      catch {
        let migrated = false;
        for (const previous of manifest.draftMigrationKeys || []) {
          try {
            const oldKey = await crypto.subtle.importKey('raw', bytesFrom64(previous.key), 'AES-GCM', false, ['decrypt']);
            storageValues = JSON.parse(decoder.decode(await decrypt(bytesFrom64(encryptedDraft), draftKey, oldKey)));
            migrated = true; storeDraft(); await draftQueue; break;
          } catch {}
        }
        if (!migrated) { blockedDrafts = true; $('#save-state').textContent = '旧草稿未解锁，请从旧版导出'; }
      }
    }
    const api = Object.freeze({
      source: () => { if (!sessionKey) throw Error('住记已锁定。'); return structuredClone(manifest.source); },
      storage: Object.freeze({
        getItem: key => storageValues[key] ?? null,
        setItem(key, value) { if (!sessionKey || blockedDrafts) throw Error('草稿不可写入。'); storageValues[key] = String(value); storeDraft(); },
      }),
      evidence: Object.freeze({
        prepare: prepareEvidence,
        url: evidence => imageURLs.get((evidence.imported ? 'imported/' : '') + evidence.filename) || '',
      }),
      resources: Object.freeze({url:privateResourceURL}),
    });
    window.ZhujiSession = api;
    $('#gate').hidden = true; $('#session').hidden = false;
    $('#admin-app').src = './admin/app.html'; $('#admin-app').hidden = false;
  } catch (error) {
    sessionKey = null; manifest = null; $('#passphrase').value = '';
    $('#unlock-error').textContent = error.name === 'OperationError' ? '管理员口令不正确，请重新输入。' : error.message;
  } finally { password = ''; $('#unlock').disabled = false; $('#unlock').textContent = '解锁住记'; }
});
$('#lock').addEventListener('click', async () => {
  $('#lock').disabled = true;
  try { await draftQueue; } catch { $('#save-state').textContent = '草稿未保存，请先导出备份'; $('#lock').disabled = false; return; }
  generation++; $('#admin-app').removeAttribute('src'); $('#admin-app').hidden = true;
  window.ZhujiSession = undefined; sessionKey = null; manifest = null; storageValues = {};
  imageURLs.forEach(url => URL.revokeObjectURL(url)); imageURLs.clear(); pendingImages.clear();
  resourceURLs.forEach(url=>URL.revokeObjectURL(url));resourceURLs.clear();pendingResources.clear();
  $('#session').hidden = true; $('#gate').hidden = false; $('#save-state').textContent = ''; $('#lock').disabled = false;
  $('#passphrase').focus();
});
window.addEventListener('beforeunload', event => {
  if ($('#save-state').textContent === '正在保存…') { event.preventDefault(); event.returnValue = ''; }
});
$('#unlock').disabled = false;
$('#unlock').textContent = '解锁住记';
