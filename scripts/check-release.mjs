import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { validateShoeFrame } from './check-shoe-frame.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const index=JSON.parse(await fs.readFile(path.join(root,'releases.json'),'utf8'));
const dir=path.join(root,'versions',index.latest);
const manifest=JSON.parse(await fs.readFile(path.join(dir,'release.json'),'utf8'));
assert.equal(manifest.defaultEdition,'admin');assert.equal(index.defaultEdition,'admin');
const lines=(await fs.readFile(path.join(dir,'SHA256SUMS'),'utf8')).trim().split('\n');
for(const line of lines){const [hash,name]=line.split('  ');assert.equal(crypto.createHash('sha256').update(await fs.readFile(path.join(dir,name))).digest('hex'),hash,name+' checksum');}
async function walk(directory){return (await Promise.all((await fs.readdir(directory,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(directory,e.name)):[path.join(directory,e.name)]))).flat();}
const files=await walk(dir);
const publicWorkbook='aluminum/designs/aluminum/mobile-tv-stand/downloads/tv-stand-v9-materials-audit.xlsx';
assert(!files.some(f=>/住记数据|自动备份|admin-access|credentials/.test(f)));
assert(!files.some(f=>/\.xlsx$/.test(f)&&path.relative(dir,f).split(path.sep).join('/')!==publicWorkbook));
assert.equal(crypto.createHash('sha256').update(await fs.readFile(path.join(dir,publicWorkbook))).digest('hex'),crypto.createHash('sha256').update(await fs.readFile(path.join(root,'versions/v9.0.0/downloads/tv-stand-v9-materials-audit.xlsx'))).digest('hex'),'Only the previously public TV materials workbook may ship');
const publicFiles=await walk(path.join(dir,'aluminum'));
assert(!publicFiles.some(f=>/\/vault\/|\/evidence\/|\/data\//.test(f)));
const publicHTML=await fs.readFile(path.join(dir,'aluminum/index.html'),'utf8');
assert(!/全部设备|待办事项|导出备份|管理员/.test(publicHTML));
const publicApp=await fs.readFile(path.join(dir,'aluminum/public-app.js'),'utf8');
assert(!/api\/data|paidCents|orderNumber|ZhujiSession/.test(publicApp));
const adminApp=await fs.readFile(path.join(dir,'admin/app.js'),'utf8');
assert(!/localStorage\.(getItem|setItem)/.test(adminApp));
assert(adminApp.includes('window.ZhujiSource()'));assert(adminApp.includes('await window.ZhujiEvidence.prepare'));
const model=await fs.readFile(path.join(dir,'aluminum/designs/aluminum/living-mirror-cabinet/option-two.html'),'utf8');
new vm.Script(model.match(/<script>\s*([\s\S]*?)<\/script>/)[1]);
assert(model.includes('displayNetHeight:400'));
const aluminum=await fs.readFile(path.join(dir,'aluminum/aluminum.js'),'utf8');
assert(aluminum.includes("id: 'mobile-tv-stand'"));assert(aluminum.includes("id: 'living-mirror-cabinet'"));
const tvDirectory=path.join(dir,'aluminum/designs/aluminum/mobile-tv-stand');
for(const name of ['index.html','dimensions.html','materials.html']){
  const html=await fs.readFile(path.join(tvDirectory,name),'utf8');
  assert(!html.includes('本地视觉预览 · 尚未发布'));assert(html.includes('assets/zhuji-embed.js'));
  for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
    if(/^[a-z]+:|^\/\//i.test(match[1]))continue;
    const target=path.resolve(tvDirectory,match[1].split(/[?#]/)[0]);
    assert(target.startsWith(tvDirectory+path.sep));await fs.access(target);
  }
}
for(const name of ['model.js','site.js','zhuji-embed.js'])new vm.Script(await fs.readFile(path.join(tvDirectory,'assets',name),'utf8'));
assert(manifest.projects.some(p=>p.id==='elevator-shoe-cabinet'));
const shoeFrame=await validateShoeFrame(dir);
assert.equal(manifest.projects.find(p=>p.id==='elevator-shoe-cabinet').revision,shoeFrame.layoutRevision??1,'Published catalog matches shoe model');
console.log(JSON.stringify({version:index.latest,verifiedFiles:lines.length,publicFiles:publicFiles.length,defaultEdition:'admin',privateData:'encrypted',shoeFrame,checks:'passed'}));
