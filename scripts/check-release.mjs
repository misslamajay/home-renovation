import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const index=JSON.parse(await fs.readFile(path.join(root,'releases.json'),'utf8'));
const dir=path.join(root,'versions',index.latest);
const manifest=JSON.parse(await fs.readFile(path.join(dir,'release.json'),'utf8'));
assert.equal(manifest.defaultEdition,'admin');assert.equal(index.defaultEdition,'admin');
const lines=(await fs.readFile(path.join(dir,'SHA256SUMS'),'utf8')).trim().split('\n');
for(const line of lines){const [hash,name]=line.split('  ');assert.equal(crypto.createHash('sha256').update(await fs.readFile(path.join(dir,name))).digest('hex'),hash,name+' checksum');}
async function walk(directory){return (await Promise.all((await fs.readdir(directory,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(directory,e.name)):[path.join(directory,e.name)]))).flat();}
const files=await walk(dir);
assert(!files.some(f=>/住记数据|自动备份|admin-access|credentials|\.xlsx$/.test(f)));
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
console.log(JSON.stringify({version:index.latest,verifiedFiles:lines.length,publicFiles:publicFiles.length,defaultEdition:'admin',privateData:'encrypted',checks:'passed'}));
