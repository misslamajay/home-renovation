import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
export async function validateShoeFrame(versionDirectory) {
  const file=path.join(versionDirectory,'aluminum/designs/aluminum/elevator-shoe-cabinet/geometry.js');
  const {model,dimensions:d,members,footprint,posts,edges}=await import(pathToFileURL(file).href);
  assert.equal(model.revision,1);assert.equal(d.left,1380);assert.equal(d.right,1350);assert.equal(d.depth,400);assert.equal(d.height,2350);assert.equal(d.section,30);
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
  return{members:members.length,posts:posts.length,footprintAreaMm2:area,netHeight:d.netHeight,overlaps:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),index=JSON.parse(await fs.readFile(path.join(root,'releases.json'),'utf8'));
  console.log(JSON.stringify({version:index.latest,...await validateShoeFrame(path.join(root,'versions',index.latest))}));
}
