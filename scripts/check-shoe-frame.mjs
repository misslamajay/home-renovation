import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
export async function validateShoeFrame(versionDirectory) {
  const file=path.join(versionDirectory,'aluminum/designs/aluminum/elevator-shoe-cabinet/geometry.js');
  const {model,dimensions:d,members,footprint,posts,edges}=await import(pathToFileURL(file).href);
  assert([1,2].includes(model.revision));assert.equal(d.left,1380);assert.equal(d.right,1350);assert.equal(d.depth,400);assert.equal(d.height,2350);assert.equal(d.section,30);
  assert.equal(d.netHeight,d.height-2*d.section);
  const area=Math.abs(footprint.reduce((a,p,i)=>{const q=footprint[(i+1)%footprint.length];return a+p[0]*q[1]-q[0]*p[1];},0))/2;
  assert.equal(area,d.left*d.depth+d.right*d.depth-d.depth*d.depth,'The shared corner is counted once');
  assert.equal(new Set(posts.map(p=>p.x+','+p.z)).size,posts.length,'No duplicated corner posts');
  const bounds=members.map(m=>m.center.map((c,i)=>[c-m.size[i]/2,c+m.size[i]/2]));
  assert.deepEqual([0,1,2].map(i=>Math.min(...bounds.map(b=>b[i][0]))),[0,0,0]);
  assert.deepEqual([0,1,2].map(i=>Math.max(...bounds.map(b=>b[i][1]))),[1380,2350,1350]);
  for(let i=0;i<members.length;i++){
    assert(members[i].size.every(n=>n>0));
    assert(bounds[i][0][1]<=400||bounds[i][2][1]<=400,'All members belong to the L footprint');
    for(let j=i+1;j<members.length;j++){
      const intersects=[0,1,2].every(axis=>Math.min(bounds[i][axis][1],bounds[j][axis][1])-Math.max(bounds[i][axis][0],bounds[j][axis][0])>.001);
      assert(!intersects,members[i].id+' overlaps '+members[j].id);
    }
  }
  const connected=new Set([posts[0].id]);let changed=true;
  while(changed){changed=false;for(const [a,b]of edges)if(connected.has(a)!==connected.has(b)){connected.add(a);connected.add(b);changed=true;}}
  assert.equal(connected.size,posts.length,'One connected frame at both levels');
  const result={members:members.length,posts:posts.length,footprintAreaMm2:area,netHeight:d.netHeight,overlaps:0};
  const layoutFile=path.join(path.dirname(file),'bench-geometry.js');
  if(await fs.access(layoutFile).then(()=>true).catch(()=>false)){
    const {model:layout,benchParts}=await import(pathToFileURL(layoutFile).href);
    assert.equal(layout.revision,8);assert.equal(posts.length,7);
    assert.deepEqual(layout.footprint,footprint);assert.deepEqual(layout.posts,posts);
    const fixed=[...layout.members,...layout.fixtures],box=m=>m.center.map((v,k)=>[v-m.size[k]/2,v+m.size[k]/2]);
    const intersects=(a,b)=>a.every((v,k)=>Math.min(v[1],b[k][1])-Math.max(v[0],b[k][0])>.001);
    for(let i=0;i<fixed.length;i++)for(let j=i+1;j<fixed.length;j++)assert(!intersects(box(fixed[i]),box(fixed[j])),fixed[i].id+' overlaps '+fixed[j].id);
    const expected=[120,130,170,170,170,260,160,160,160];
    assert.deepEqual(layout.leftStorage.layers.map(l=>l.netHeight),expected);
    layout.leftStorage.layers.forEach((layer,i)=>{
      const floor=box(layout.fixtures.find(m=>m.id===`left-board-${i}-0`))[1][1];
      const supports=layout.members.filter(m=>m.id.startsWith(`left-shelf-${i+1}-`));
      assert.equal(supports.length,5);
      assert.equal(Math.min(...supports.map(m=>box(m)[1][0]))-floor,expected[i],'Actual shelf net height');
    });
    const lastTop=box(layout.fixtures.find(m=>m.id==='left-board-9-0'))[1][1];
    assert.equal(d.height-d.section-lastTop,340);
    const closed=benchParts([0,0]).boxes;
    assert.equal(closed.filter(m=>m.material==='acrylic').length,12);
    for(const [i,net]of [182,150].entries()){
      const floor=box(closed.find(m=>m.id===`drawer-${i}-bottom`))[1][1]+(i?0:2);
      const ceiling=i?Math.min(...layout.members.filter(m=>m.id.startsWith('seat-long-')).map(m=>box(m)[1][0])):box(layout.fixtures.find(m=>m.id==='drawer-divider'))[1][0];
      assert.equal(ceiling-floor,net,'Actual drawer net height');
    }
    for(const travel of [[0,0],[300,0],[0,300],[300,300],...Array.from({length:13},(_,i)=>[i*25,i*25])]){
      const moving=benchParts(travel).boxes;
      for(const part of moving)for(const member of fixed)assert(!intersects(box(part),box(member)),part.id+' hits '+member.id);
      for(const a of moving.filter(m=>m.id.startsWith('drawer-0-')))for(const b of moving.filter(m=>m.id.startsWith('drawer-1-')))assert(!intersects(box(a),box(b)),'Drawer collision');
    }
    assert.equal(layout.lightbox.text,'怪兽小屋');assert.equal(layout.lightbox.width,920);assert.equal(layout.lightbox.height,180);assert.equal(layout.lightbox.depth,80);
    assert.equal(layout.lightbox.top,2320);assert.equal(layout.lightbox.bottom,2140);
    Object.assign(result,{layoutRevision:layout.revision,assemblyMembers:layout.members.length,shelfHeights:expected,topReserve:340,drawerNetHeights:[182,150],lightbox:layout.lightbox.text});
  }
  return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),index=JSON.parse(await fs.readFile(path.join(root,'releases.json'),'utf8'));
  console.log(JSON.stringify({version:index.latest,...await validateShoeFrame(path.join(root,'versions',index.latest))}));
}
