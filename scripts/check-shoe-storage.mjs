import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {validateShoePartition} from './check-shoe-partition.mjs';

function overlap(a,b){
  if(Math.min(a.center[1]+a.size[1]/2,b.center[1]+b.size[1]/2)-Math.max(a.center[1]-a.size[1]/2,b.center[1]-b.size[1]/2)<.001)return false;
  const axes=o=>{const t=o.angle||0;return [[Math.cos(t),Math.sin(t)],[-Math.sin(t),Math.cos(t)]];},A=axes(a),B=axes(b),dot=(u,v)=>u[0]*v[0]+u[1]*v[1];
  for(const axis of [...A,...B]){const radius=(o,basis)=>o.size[0]/2*Math.abs(dot(axis,basis[0]))+o.size[2]/2*Math.abs(dot(axis,basis[1]));if(radius(a,A)+radius(b,B)-Math.abs(dot(axis,[a.center[0]-b.center[0],a.center[2]-b.center[2]]))<.001)return false;}
  return true;
}

export async function validateShoeStorage(directory){
  const root=path.join(directory,'aluminum/designs/aluminum/elevator-shoe-cabinet');
  const {model,stoolBay,shoeZone,storageParts,storageEnclosureParts}=await import(pathToFileURL(path.join(root,'storage-geometry.js')).href);
  if(model.revision>=28)return validateShoePartition(directory);
  assert.equal(model.revision,22);assert.equal(model.members.length,117);
  assert.equal(new Set(model.members.map(p=>p.id)).size,117);
  assert.deepEqual(model.leftStorage.layers.map(l=>l.netHeight),[160,160,170,170,170,130,260,160,160]);
  assert.deepEqual([shoeZone.ground.netHeight,shoeZone.middle.netHeight,shoeZone.upper.netHeight],[200,150,188]);
  assert.equal(shoeZone.linkedToLeft,false);assert.equal(storageParts().drawers.length,0);
  assert.deepEqual(storageParts([300,300]),storageParts([0,0]));
  assert.deepEqual([stoolBay.clearWidth,stoolBay.clearDepth,stoolBay.clearHeight,stoolBay.floor],[350,340,634,0]);
  assert(!model.fixtures.some(p=>/^stool-bay-floor$|^stool-floor-riser|^lightbox-/.test(p.id)));
  assert.deepEqual([model.lightbox.width,model.lightbox.height,model.lightbox.depth,model.lightbox.bottom],[320,140,60,2000]);
  assert.equal(model.rightStorage.linkedShelves.at(-1).netHeight,300);
  assert.equal(model.pegboard.segments.at(-1).top,2317);
  const arms=model.members.filter(p=>p.id.startsWith('blade-support-arm'));
  assert.equal(arms.length,2);arms.forEach(p=>assert.deepEqual(p.size,[64,30,30]));
  const first=model.fixtures.find(p=>p.id==='fixed-middle-board'),second=model.fixtures.find(p=>p.id==='storage-low-top');
  assert.deepEqual(first.size,[400,18,470]);assert.deepEqual(second.size,[400,18,470]);
  assert.deepEqual([first.center[1]+9,second.center[1]+9],[248,446]);
  const wall=model.fixtures.find(p=>p.id==='storage-shoe-side-443');assert.deepEqual(wall.center,[200,317,443]);assert.deepEqual(wall.size,[340,634,18]);
  for(const layer of model.rightStorage.linkedShelves){
    const right=model.fixtures.find(p=>p.id===(layer.floor===682?'storage-roof':'linked-board-'+layer.floor));
    const left=model.fixtures.find(p=>p.id.startsWith('left-board-')&&p.center[1]+p.size[1]/2===layer.floor&&p.center[2]===385&&p.center[0]===200);
    assert(right&&left);assert.equal(right.center[1],left.center[1]);assert.equal(right.center[2]-right.size[2]/2,left.center[2]+left.size[2]/2);
  }
  const structure=[...model.members,...model.fixtures],closed=storageEnclosureParts(model,[0,0,0,0]);
  const clear=(a,b)=>assert(!overlap(a,b),a.id+' overlaps '+b.id);
  structure.forEach((a,i)=>structure.slice(i+1).forEach(b=>clear(a,b)));
  closed.fixed.forEach((a,i)=>{structure.forEach(b=>clear(a,b));closed.fixed.slice(i+1).forEach(b=>clear(a,b));});
  closed.hardware.forEach((a,i)=>closed.hardware.slice(i+1).filter(b=>b.group!==a.group).forEach(b=>clear(a,b)));
  for(const layer of [shoeZone.ground,shoeZone.middle,shoeZone.upper]){const box={id:'open-bay',center:[200,(layer.floor+layer.ceiling)/2,687],size:[340,layer.netHeight,470]};[...structure,...closed.fixed].forEach(p=>clear(box,p));}
  const stool={id:'stool-clearance',center:[200,317,1145],size:[340,634,350]};[...structure,...closed.fixed].forEach(p=>clear(stool,p));
  assert.equal(closed.doors.filter(p=>p.kind==='door').length,16);
  for(const p of closed.doors.filter(p=>p.group.startsWith('right')&&p.id.includes('stile'))){assert.equal(p.size[1],1632);assert.equal(p.center[1]+p.size[1]/2,2317);}
  let poses=0;
  for(const a of [0,15,45,90])for(const b of [0,15,45,90])for(const c of [0,15,45,90])for(const d of [0,15,45,90]){
    if(b>0&&c>0)continue;const {doors,fixed}=storageEnclosureParts(model,[a,b,c,d]);poses++;
    doors.forEach((p,i)=>{[...structure,...fixed].forEach(q=>clear(p,q));doors.slice(i+1).filter(q=>q.group!==p.group).forEach(q=>clear(p,q));});
  }
  const html=await fs.readFile(path.join(root,'index.html'),'utf8');assert(html.includes('data-layout="storage"'));
  assert(!html.includes('仅更新本地住记，未发布'));assert(!html.includes('stool-floor-riser'));
  return {layoutRevision:model.revision,assemblyMembers:model.members.length,profileCount:model.members.length+16,leftShelfHeights:model.leftStorage.layers.map(l=>l.netHeight),shelfHeights:[200,150,188],drawerNetHeights:[],stoolClear:[350,340,634],sideLightbox:[320,140,60],doorTop:2317,poses,overlaps:0};
}
