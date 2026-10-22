import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; };
const version = option('--version', JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8')).version);
if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('版本号需为 X.Y.Z。');
const tag = 'v' + version, source = path.resolve(option('--source', path.join(root, '../住记/Web')));
const credentialsPath = path.resolve(option('--credentials', path.join(root, '../住记/私密发布/admin-access.json')));
if (credentialsPath.startsWith(root + path.sep)) throw Error('管理员口令必须保存在仓库外。');
const target = path.join(root, 'versions', tag), stage = path.join(root, '.release-build', tag);
const exists = async file => fs.access(file).then(() => true).catch(() => false);
if (await exists(target)) {
  if (!args.includes('--rebuild')) throw Error('版本目录已存在，请递增版本；未发布的构建才可使用 --rebuild。');
  const tags = execFileSync('git', ['tag', '-l', tag], { cwd: root, encoding: 'utf8' }).trim();
  const remoteTags = execFileSync('git', ['ls-remote', '--tags', 'origin', 'refs/tags/' + tag], { cwd: root, encoding: 'utf8' }).trim();
  if (tags || remoteTags) throw Error('已标记的版本不可覆盖。');
}
await fs.rm(stage, { recursive: true, force: true });
await fs.mkdir(stage, { recursive: true });
const template = name => fs.readFile(path.join(root, 'publishing', name), 'utf8');
const write = async (name, bytes) => { const file = path.join(stage, name); await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, bytes); };
const replaceOnce = (text, pattern, replacement, label) => {
  if (!text.match(pattern)) throw Error('源页面结构已改变：' + label);
  return text.replace(pattern, replacement);
};
let credentials;
if (await exists(credentialsPath)) credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
else {
  credentials = { account:'管理员', password:crypto.randomBytes(24).toString('base64url'), salt:crypto.randomBytes(32).toString('base64'), iterations:600000, createdAt:new Date().toISOString() };
  await fs.mkdir(path.dirname(credentialsPath), { recursive:true, mode:0o700 });
  await fs.writeFile(credentialsPath, JSON.stringify(credentials, null, 2) + '\n', { mode:0o600, flag:'wx' });
}
if (typeof credentials.password !== 'string' || credentials.password.length < 20 || !credentials.salt || credentials.iterations < 600000) throw Error('管理员凭证格式无效或口令太短。');
const key = crypto.pbkdf2Sync(credentials.password, Buffer.from(credentials.salt, 'base64'), credentials.iterations, 32, 'sha256');
const encrypt = (bytes, resource) => {
  const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(resource));
  return Buffer.concat([iv, cipher.update(bytes), cipher.final(), cipher.getAuthTag()]);
};
const sourceData = JSON.parse(await fs.readFile(option('--source-data', path.join(source, 'data/住记数据.json')), 'utf8'));
if (!Array.isArray(sourceData.items) || !Array.isArray(sourceData.spaces)) throw Error('台账格式不正确。');
const evidence = {};
for (const item of sourceData.items) for (const entry of item.evidence || []) {
  if (path.basename(entry.filename) !== entry.filename) throw Error('无效的原图文件名。');
  const name = (entry.imported ? 'imported/' : '') + entry.filename;
  if (evidence[name]) continue;
  const file = path.join(source, entry.imported ? 'data/附件' : 'evidence', entry.filename);
  const bytes = await fs.readFile(file), resource = 'vault/' + crypto.randomBytes(16).toString('hex') + '.bin';
  const mime = bytes.subarray(0,8).toString('hex') === '89504e470d0a1a0a' ? 'image/png' : bytes[0] === 0xff && bytes[1] === 0xd8 ? 'image/jpeg' : 'application/octet-stream';
  evidence[name] = { path:resource, mime, sha256:crypto.createHash('sha256').update(bytes).digest('hex') };
  await write(resource, encrypt(bytes, tag + '/' + resource));
}
await write('vault/manifest.bin', encrypt(Buffer.from(JSON.stringify({ version:tag, source:sourceData, evidence })), tag + '/manifest'));
await write('vault/meta.json', JSON.stringify({ version:tag, algorithm:'AES-256-GCM', derivation:'PBKDF2-SHA-256', iterations:credentials.iterations, salt:credentials.salt }, null, 2) + '\n');
key.fill(0);
for (const name of ['access.js', 'access.css']) await write(name, await template(name));
await write('index.html', await template('unlock.html'));
await write('admin/bridge.js', await template('admin-bridge.js'));

let app = await fs.readFile(path.join(source, 'app.js'), 'utf8');
app = app.replaceAll('localStorage', 'appStorage');
app = 'const appStorage=window.ZhujiStorage;\n' + app;
app = replaceOnce(app, /^const evidenceURL=.*$/m, 'const evidenceURL=e=>window.ZhujiEvidence.url(e);', '原图地址');
app = replaceOnce(app, /async function loadSource\(\)\{[\s\S]*?\n\}/, "async function loadSource(){if(!window.ZhujiSource)throw Error('请从管理员入口解锁住记');return window.ZhujiSource()}", '载入台账');
app = replaceOnce(app, /function renderViewer\(\)\{/, `async function renderViewer(){
  const queued=viewerContext,queuedIndex=queued.index;
  $('#viewer').innerHTML='<div class="modal-header"><h2>正在解锁原图…</h2><button class="secondary-button" data-action="closeViewer">完成</button></div>';
  try{await window.ZhujiEvidence.prepare(queued.item.evidence[queuedIndex])}
  catch{if(viewerContext===queued&&queued.index===queuedIndex)$('#viewer').innerHTML='<div class="modal-header"><h2>原图暂时无法载入，请重试</h2><button class="secondary-button" data-action="closeViewer">完成</button></div>';return}
  if(viewerContext!==queued||queued.index!==queuedIndex||!$('#viewer').open)return;
`, '原图异步解锁');
await write('admin/app.js', app);
let adminHTML = await fs.readFile(path.join(source, 'index.html'), 'utf8');
adminHTML = adminHTML.replaceAll('href="/', 'href="./').replaceAll('src="/', 'src="./');
adminHTML = replaceOnce(adminHTML, '<script type="module" src="./app.js"></script>', '<script src="./bridge.js"></script><script type="module" src="./app.js"></script>', '管理员启动');
await write('admin/app.html', adminHTML);
const aluminumSource = await fs.readFile(path.join(source, 'aluminum.js'), 'utf8');
for (const [edition, directory] of [['admin', '../aluminum/designs/aluminum/living-mirror-cabinet'], ['aluminum', './designs/aluminum/living-mirror-cabinet']]) {
  const aluminum = replaceOnce(aluminumSource, "directory: '/designs/aluminum/living-mirror-cabinet'", 'directory: ' + JSON.stringify(directory), '设计资源目录');
  await write(edition + '/aluminum.js', aluminum);
  for (const name of ['styles.css', 'web.css', 'aluminum.css']) await write(edition + '/' + name, await fs.readFile(path.join(source, name)));
}
await write('aluminum/index.html', (await template('public.html')).replaceAll('{{VERSION}}', tag));
await write('aluminum/public-app.js', await template('public-app.js'));
await fs.cp(path.join(source, 'designs'), path.join(stage, 'aluminum/designs'), { recursive:true });
await fs.appendFile(path.join(stage, 'aluminum/aluminum.css'), '\n.public-version{font-size:11px;color:#85858d;white-space:nowrap}.window-actions [hidden]{display:none!important}@media(max-width:480px){.public-version{font-size:10px}}\n');
const release = { version:tag, createdAt:new Date().toISOString(), defaultEdition:'admin', modelRevision:12, editions:{ admin:{path:'./',access:'passphrase'}, aluminum:{path:'./aluminum/',access:'public'} }, legacy:{version:'v9.0.0',path:'../../tv-stand.html'} };
await write('release.json', JSON.stringify(release, null, 2) + '\n');
await write('README.txt', '住记 '+tag+'\n默认入口：管理员口令解锁。aluminum/ 为公开铝型材版。\n本包不含管理员口令或明文采购资料。通过 HTTP(S) 服务器预览，不能用 file:// 打开。\n');
async function filesIn(dir) { const entries = await fs.readdir(dir, { withFileTypes:true }); const lists = await Promise.all(entries.map(e => e.isDirectory() ? filesIn(path.join(dir,e.name)) : [path.join(dir,e.name)])); return lists.flat(); }
const checksums = [];
for (const file of (await filesIn(stage)).sort()) checksums.push(crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex') + '  ' + path.relative(stage,file).split(path.sep).join('/'));
await write('SHA256SUMS', checksums.join('\n') + '\n');
if (await exists(target)) await fs.rm(target, { recursive:true });
await fs.mkdir(path.dirname(target), { recursive:true }); await fs.rename(stage,target);
const redirect = (to, title) => '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title></head><body><p><a href="'+to+'">打开'+title+'</a></p><script>location.replace('+JSON.stringify(to)+'+location.search+location.hash)</script></body></html>\n';
await fs.writeFile(path.join(root,'index.html'), redirect('versions/'+tag+'/', '住记管理员入口'));
await fs.mkdir(path.join(root,'aluminum'), { recursive:true });
await fs.writeFile(path.join(root,'aluminum/index.html'), redirect('../versions/'+tag+'/aluminum/', '住记铝型材设计'));
const releaseIndexFile = path.join(root,'releases.json');
const index = await exists(releaseIndexFile) ? JSON.parse(await fs.readFile(releaseIndexFile,'utf8')) : { defaultEdition:'admin', releases:[] };
index.latest = tag; index.releases = [release, ...index.releases.filter(r=>r.version!==tag)];
if(!index.releases.some(r=>r.version==='v9.0.0'))index.releases.push({version:'v9.0.0',path:'versions/v9.0.0/',commit:'6fb048992c1a8216ebdc297fee2a54451fb9346e',legacy:true});
await fs.writeFile(releaseIndexFile, JSON.stringify(index,null,2)+'\n');
const packageFile=path.join(root,'package.json'),packageData=JSON.parse(await fs.readFile(packageFile,'utf8'));
packageData.version=version;await fs.writeFile(packageFile,JSON.stringify(packageData,null,2)+'\n');
const artifacts = path.join(root,'.artifacts',tag); await fs.mkdir(artifacts,{recursive:true});
for(const [name, cwd, entries] of [['zhuji-'+tag+'-admin.zip',target,['.']],['zhuji-'+tag+'-aluminum.zip',path.join(target,'aluminum'),['.']]]) {
  const zip=path.join(artifacts,name); await fs.rm(zip,{force:true});
  execFileSync('zip',['-q','-r',zip,...entries],{cwd,stdio:['ignore','pipe','pipe']});
}
console.log(JSON.stringify({ version:tag, defaultEdition:'admin', directory:target, credentialsFile:credentialsPath, encryptedEvidence:Object.keys(evidence).length, artifacts, sourceRecords:sourceData.items.length }));
