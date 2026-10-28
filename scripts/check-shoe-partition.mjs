import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

export async function validateShoePartition(directory){
  const root=path.join(directory,'aluminum/designs/aluminum/elevator-shoe-cabinet');
  const {model,stoolBay,shoeZone,storageParts,storageEnclosure,storageEnclosureParts}=await import(pathToFileURL(path.join(root,'storage-geometry.js')).href);
function overlap(a,b){
  if(Math.min(a.center[1]+a.size[1]/2,b.center[1]+b.size[1]/2)-Math.max(a.center[1]-a.size[1]/2,b.center[1]-b.size[1]/2)<.001)return false;
  const axes=o=>{const t=o.angle||0;return [[Math.cos(t),Math.sin(t)],[-Math.sin(t),Math.cos(t)]];},A=axes(a),B=axes(b),dot=(u,v)=>u[0]*v[0]+u[1]*v[1];
  for(const axis of [...A,...B]){const radius=(o,basis)=>o.size[0]/2*Math.abs(dot(axis,basis[0]))+o.size[2]/2*Math.abs(dot(axis,basis[1]));if(radius(a,A)+radius(b,B)-Math.abs(dot(axis,[a.center[0]-b.center[0],a.center[2]-b.center[2]]))<.001)return false;}
  return true;
}
const clear=(a,b)=>assert(!overlap(a,b),a.id+' overlaps '+b.id);
assert.equal(model.revision,28);
assert.deepEqual([model.dimensions.leftDepth,model.dimensions.rightDepth,model.dimensions.leftClearDepth,model.dimensions.rightClearDepth],[460,410,400,350]);
assert.equal(model.leftStorage.reserveHeight,198);
assert.equal(model.posts.length,8);
assert.equal(new Set(model.members.map(p=>p.id)).size,model.members.length);
assert.deepEqual([stoolBay.clearWidth,stoolBay.clearDepth,stoolBay.clearHeight],[940,400,350]);
assert.deepEqual([shoeZone.ground.netHeight,shoeZone.middle.netHeight,shoeZone.upper.netHeight],[350,150,180]);
assert.deepEqual(model.rightStorage.layers.map(l=>l.netHeight),[300,100,140,180,200,200,220,220]);
assert.equal(model.rightStorage.reserveHeight,328);
assert.equal(model.rightStorage.layers.at(-1).netHeight+model.rightStorage.reserveHeight,548);
assert.deepEqual(model.linkedShelves.map(l=>l.floor),[]);
assert.deepEqual(model.leftStorage.layers.map(l=>l.netHeight),[180,180,200,200,150,100]);
assert.equal(model.upperFloor,824);
assert.deepEqual(storageEnclosure.groups.map(g=>g.bottom),[827,827,33,33]);
assert(storageEnclosure.groups.every(g=>g.top===2317));
const closed=storageEnclosureParts(model),structure=[...model.members,...model.fixtures,...closed.fixed];
structure.forEach((a,i)=>structure.slice(i+1).forEach(b=>clear(a,b)));
assert.equal(model.divider.owner,'right');assert.equal(model.cornerStorage.sideAccess,false);
assert.deepEqual([model.divider.thickness,model.divider.depth,model.divider.xMin,model.divider.xMax],[18,400,392,410]);
const panels=model.fixtures.filter(p=>p.kind==='corner-divider');assert.equal(panels.length,9);
assert.deepEqual(model.divider.segments.map(p=>p.height),[300,100,140,180,200,200,220,220,328]);
// Exact cell decomposition checks that the composite partition has no open passage.
const plane=model.dimensions.rightDepth-10;
const bounds=structure.filter(p=>p.center[0]-p.size[0]/2<plane&&p.center[0]+p.size[0]/2>plane).map(p=>({a:Math.max(0,p.center[1]-p.size[1]/2),b:Math.min(2350,p.center[1]+p.size[1]/2),c:Math.max(0,p.center[2]-p.size[2]/2),d:Math.min(460,p.center[2]+p.size[2]/2)})).filter(r=>r.b>r.a&&r.d>r.c);
const ys=[...new Set([0,2350,...bounds.flatMap(r=>[r.a,r.b])])].sort((a,b)=>a-b),zs=[...new Set([0,460,...bounds.flatMap(r=>[r.c,r.d])])].sort((a,b)=>a-b);
let coverageCells=0;
for(let i=0;i<ys.length-1;i++)for(let j=0;j<zs.length-1;j++){const y=(ys[i]+ys[i+1])/2,z=(zs[j]+zs[j+1])/2;assert(bounds.some(r=>y>r.a&&y<r.b&&z>r.c&&z<r.d),'uncovered partition at '+y+','+z);coverageCells++;}

for(const l of [shoeZone.ground,shoeZone.middle,shoeZone.upper]){
  const bay={id:'left-clear-'+l.floor,center:[880,(l.floor+l.ceiling)/2,230],size:[940,l.netHeight,400]};structure.forEach(p=>clear(bay,p));
}
for(const l of [...model.leftStorage.layers,{floor:2122,ceiling:2320,netHeight:198}]){
  const bay={id:'left-upper-clear-'+l.floor,center:[880,(l.floor+l.ceiling)/2,230],size:[940,l.netHeight,400]};structure.forEach(p=>clear(bay,p));
}
for(const l of [...model.rightStorage.layers,{floor:1992,ceiling:2320,netHeight:328}]){
  const bay={id:'right-clear-'+l.floor,center:[205,(l.floor+l.ceiling)/2,890],size:[350,l.netHeight,860]};structure.forEach(p=>clear(bay,p));
}
const motion=storageParts();
assert.equal(motion.drawers.length,0);assert.equal(motion.envelopes.length,2);
assert.deepEqual(motion,storageParts([300,300]));assert.equal(storageParts([0,0],false).envelopes.length,0);
motion.envelopes.forEach(e=>{assert.equal(e.min[1],0);assert(e.max[1]<=350);assert(e.min[0]>=410&&e.max[0]<=1350);assert(e.min[2]>=30&&e.max[2]<=430);});
assert(!model.members.some(p=>p.id==='bottom-DE'));
assert.equal(model.members.length+closed.doors.filter(p=>p.kind==='door').length,137);
let poses=0;
for(const a of [0,15,45,90])for(const b of [0,15,45,90])for(const c of [0,15,45,90])for(const d of [0,15,45,90]){
  if(b>0&&c>0)continue;const {doors}=storageEnclosureParts(model,[a,b,c,d]);poses++;
  doors.forEach((p,i)=>{structure.forEach(q=>clear(p,q));doors.slice(i+1).filter(q=>q.group!==p.group).forEach(q=>clear(p,q));});
}


  const html=await fs.readFile(path.join(root,'index.html'),'utf8');
  assert(!html.includes('仅更新本地住记，未发布'));assert(!html.includes('本地调整 ·'));
  return {members:model.members.length,posts:model.posts.length,footprintAreaMm2:Math.abs(model.footprint.reduce((s,p,i)=>{const q=model.footprint[(i+1)%model.footprint.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2,topReserve:model.leftStorage.reserveHeight,layoutRevision:model.revision,assemblyMembers:model.members.length,profileCount:137,partition:{owner:model.divider.owner,panels:panels.length,coverageCells,fullInterfaceArea:2350*460},leftShelfHeights:model.leftStorage.layers.map(l=>l.netHeight),rightShelfHeights:model.rightStorage.layers.map(l=>l.netHeight),leftTopRemainder:198,rightTopRemainder:328,shelfHeights:[350,150,180],drawerNetHeights:[],stoolClear:[940,400,350],leftDepth:460,rightDepth:410,leftClearDepth:400,rightClearDepth:350,poses,overlaps:0};
}
