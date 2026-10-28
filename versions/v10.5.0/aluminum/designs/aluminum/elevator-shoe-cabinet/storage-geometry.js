import {model as original} from './bench-geometry.js';
import {enclosure as originalEnclosure,enclosureParts as originalEnclosureParts} from './enclosure-geometry.js';

export const stoolBay=Object.freeze({clearWidth:350,clearDepth:340,clearHeight:634,zMin:970,zMax:1320,xMin:30,xMax:370,floor:0,ceiling:634,roofTop:682,roofBoardThickness:18,floorRiser:0,stackHeight:530,headroom:104,mushroomDiameter:330,mushroomHeight:260,cubeSize:270,provisional:true});
export const lightbox=Object.freeze({text:'怪兽小屋',kind:'cantilever-blade',provisional:true,width:320,height:140,depth:60,bottom:2000,top:2140,front:1450,back:1390,zMin:385,zMax:705,faceWidth:300,faceHeight:120,color:'暖白双面',sheetThickness:3,diffuserThickness:4,projectionFromBodyFront:305,sideOverhang:70,mount:'左外角固定立柱，双3030短臂与6厚连接板；五金和实际承载待核'});
const shelfTops=[...original.leftStorage.layers.map(l=>l.floor),original.leftStorage.reserveFloor].filter(h=>h>=stoolBay.roofTop);
const linkedShelves=Object.freeze(shelfTops.map((floor,i)=>({id:'linked-'+i,floor,ceiling:i<shelfTops.length-1?shelfTops[i+1]-48:2320,netHeight:(i<shelfTops.length-1?shelfTops[i+1]-48:2320)-floor})));
export const shoeZone=Object.freeze({clearWidth:470,clearDepth:340,zMin:452,zMax:922,ground:{floor:0,ceiling:200,netHeight:200},middle:{floor:248,ceiling:398,netHeight:150},upper:{floor:446,ceiling:634,netHeight:188},lowerBeam:{bottom:200,top:230,section:30},lowerBoard:{bottom:230,top:248,thickness:18},upperBeam:{bottom:398,top:428,section:30},upperBoard:{bottom:428,top:446,thickness:18},fixed:true,linkedToLeft:false});
const members=original.members.filter(p=>!/^seat-|^bench-base-|^bottom-EF$/.test(p.id));
const fixtures=original.fixtures.filter(p=>!/^seat-board$|^bench-side-|^drawer-divider$|^corner-divider-|^lightbox-/.test(p.id));
const bar=(id,axis,center,size)=>members.push({id,axis,center,size,group:'right-storage',kind:'storage-support'});
const panel=(id,center,size,color=[.8,.78,.71])=>fixtures.push({id,center,size,color,kind:'storage-board'});
for(const y of [2025,2115])bar('blade-support-arm-'+y,0,[1418,y,370],[64,30,30]);
const signPart=(id,center,size,color)=>fixtures.push({id:'blade-'+id,center,size,color,kind:'lightbox-case'});
const metal=[.45,.52,.56],glow=[1,.97,.86];
signPart('mount-plate',[1383,2070,380],[6,160,50],metal);
for(const y of [2001.5,2138.5])signPart('shell-'+y,[1420,y,545],[60,3,320],metal);
for(const z of [386.5,703.5])signPart('end-'+z,[1420,2070,z],[60,134,3],metal);
for(const x of [1392,1448])signPart('diffuser-'+x,[x,2070,545],[4,134,314],glow);
// Split the front base rail around the floor shoe bay; retain the rear tie and upper cross frame.
bar('bottom-EF-near',2,[385,15,417],[30,30,34]);
bar('bottom-EF-far',2,[385,15,946],[30,30,48]);
for(const [name,y]of [['fixed-lower',215],['storage-low',413]]){
  for(const x of [15,385])bar(name+'-long-'+x,2,[x,y,670],[30,30,540]);
  for(const z of [467,907])bar(name+'-cross-'+z,0,[200,y,z],[340,30,30]);
}
bar('storage-base-cross',0,[200,15,415],[340,30,30]);
for(const x of [15,385])bar('storage-divider-post-'+x,1,[x,332,955],[30,604,30]);
for(const x of [15,385])bar('storage-roof-long-'+x,2,[x,649,860],[30,30,920]);
for(const z of [415,955,1305])bar('storage-roof-cross-'+z,0,[200,649,z],[340,30,30]);
for(const top of shelfTops.slice(1)){
  for(const x of [15,385])bar('linked-'+top+'-long-'+x,2,[x,top-33,860],[30,30,920]);
  for(const z of [415,955,1305])bar('linked-'+top+'-cross-'+z,0,[200,top-33,z],[340,30,30]);
  panel('linked-board-'+top,[200,top-9,860],[400,18,920]);
}
panel('fixed-middle-board',[200,239,687],[400,18,470]);
panel('storage-low-top',[200,437,687],[400,18,470]);
panel('storage-roof',[200,673,860],[400,18,920]);
panel('stool-bay-divider',[200,317,961],[340,634,18],[.125,.153,.145]);
// Continuous side panels isolate all three open bays from the left cabinet.
for(const z of [443,931]){
  panel('storage-shoe-side-'+z,[200,317,z],[340,634,18]);
  for(const [i,a,b]of [[0,0,200],[1,230,398],[2,428,634]]){
    const backBottom=Math.max(30,a),frontBottom=z===931?Math.max(30,a):a;
    panel('shoe-side-back-strip-'+z+'-'+i,[15,(backBottom+b)/2,z],[30,b-backBottom,18]);
    panel('shoe-side-front-strip-'+z+'-'+i,[385,(frontBottom+b)/2,z],[30,b-frontBottom,18]);
  }
}
const bench=Object.freeze({...original.bench,seatTop:446,seatThickness:18,seatBottom:428,supportY:413,supportBottom:398,dividerBottom:200,dividerTop:248,seatWidth:540,zMax:940,drawerWidth:434,faceWidth:434,faceCenterZ:687,faceZMin:470,drawers:[{...original.bench.drawers[0],ground:true,floor:0,insideHeight:200},{...original.bench.drawers[1],ground:true,fixed:true,label:'中层固定格',floor:248,insideHeight:150}]});
const pegBottom=685,pegTop=2317,pegHeight=pegTop-pegBottom,rows=Math.floor((pegHeight-40)/25)+1;
const pegboard=Object.freeze({...original.pegboard,bottom:pegBottom,top:pegTop,height:pegHeight,rows,firstY:pegBottom+(pegHeight-(rows-1)*25)/2,segments:linkedShelves.map(l=>({bottom:l.floor+3,top:l.ceiling-3}))});
const cornerStorage=Object.freeze({...original.cornerStorage,openingBottom:682,compartments:linkedShelves.map(l=>({...l,label:'L形贯通收纳',openingBottom:l.floor,openingHeight:l.netHeight})),continuous:true});
export const model=Object.freeze({...original,name:'电梯鞋柜 · 门板到顶与横向侧挂灯箱',revision:22,members,fixtures,bench,lightbox,pegboard,cornerStorage,stoolBay,shoeZone,rightStorage:{fixedLowTop:446,upperFloor:682,upperCeiling:2320,upperClearHeight:1638,shoeBayWidth:540,extraLowClearHeight:188,linkedShelves,lowerOpen:true,fixedLowerShelves:true},measurement:'原顶部灯箱取消，右门延至2317；左外角侧挂灯箱暂定320×140×60，下沿2000，前伸305。下部三格200/150/188及落地凳位保持。'});

export const storageEnclosure=Object.freeze({...originalEnclosure,revision:6,groups:[...originalEnclosure.groups.map((g,i)=>({...g,label:i?'左柜黄门':'左柜红门'})),{id:'right-red',label:'右上红门',hinge:[422,435],direction:1,span:451,bottom:685,top:2317,color:[.93,.188,.165],postZ:385,normalAxis:0},{id:'right-yellow',label:'右上黄门',hinge:[422,1347],direction:-1,span:461,bottom:685,top:2317,color:[1,.831,0],postZ:1335,normalAxis:0}]});
const rotate=(v,a)=>[v[0]*Math.cos(a)-v[2]*Math.sin(a),v[1],v[0]*Math.sin(a)+v[2]*Math.cos(a)];
export function storageEnclosureParts(current,angles=[0,0,0,0],visible=true){
  const old=originalEnclosureParts(current,angles,visible),silver=[.72,.78,.82],black=[.125,.153,.145];
  const fixed=old.fixed.filter(p=>!/^finish-bench-back-|^finish-corner-trim$|^finish-corner-lower$|^finish-lightbox-back$/.test(p.id)&&!/^pegboard/.test(p.kind||''));
  const add=(list,id,center,size,color=silver,extra={})=>list.push({id,center,size,color,...extra});
  for(const [i,layer]of [shoeZone.ground,shoeZone.middle,shoeZone.upper].entries()){
    const bottom=Math.max(30,layer.floor);
    add(fixed,'storage-shoe-back-'+i,[15,(bottom+layer.ceiling)/2,687],[6,layer.ceiling-bottom,470],black);
  }
  add(fixed,'stool-bay-back',[15,332,1145],[6,604,350],black);
  add(fixed,'storage-corner-cover',[411,1501,417.5],[22,1632,35],silver);
  current.pegboard.segments.forEach((segment,i)=>{
    add(fixed,'linked-pegboard-'+i,[21,(segment.bottom+segment.top)/2,860],[2,segment.top-segment.bottom,920],[.97,.97,.96],{material:'pegboard',kind:'pegboard'});
    for(const z of [412,1308])for(const y of [segment.bottom+20,segment.top-20])add(fixed,'linked-peg-mount-'+i+'-'+z+'-'+y,[10,y,z],[20,24,24],silver,{kind:'pegboard-mount'});
  });
  const doors=[...old.doors],hardware=[...old.hardware];
  storageEnclosure.groups.slice(2).forEach((group,j)=>{
    const index=j+2,theta=Math.max(0,Math.min(90,Number(angles[index])||0))*Math.PI/180,angle=-group.direction*theta,height=group.top-group.bottom,width=group.span-4;
    const center=rotate([-10,0,group.direction*group.span/2],angle).map((n,k)=>n+[group.hinge[0],(group.top+group.bottom)/2,group.hinge[1]][k]);
    const part=(id,offset,size,color,kind='door')=>add(doors,group.id+'-door-'+id,rotate(offset,angle).map((n,k)=>n+center[k]),size,color,{angle,group:group.id,kind,normalAxis:0});
    for(const side of [-1,1])part('stile-'+side,[0,0,side*(width-20)/2],[20,height,20],silver);
    for(const side of [-1,1])part('rail-'+side,[0,side*(height-20)/2,0],[20,20,width-40],silver);
    part('color-panel',[0,0,0],[6,height-40,width-40],group.color,'color-panel');
    part('pull',[5,0,group.direction*(width/2-70)],[3,18,80],[.13,.2,.22],'handle');
    for(const y of [730,1100,1500,1900,2190]){
      const min=Math.min(group.postZ,group.hinge[1])-10,max=Math.max(group.postZ,group.hinge[1])+10;
      add(hardware,group.id+'-hinge-mount-'+y,[401.5,y,(min+max)/2],[3,34,max-min],silver,{kind:'hinge',group:group.id});
      add(hardware,group.id+'-hinge-arm-'+y,[412.5,y,group.hinge[1]],[19,34,6],silver,{kind:'hinge',group:group.id});
      add(hardware,group.id+'-hinge-knuckle-'+y,[422,y,group.hinge[1]],[6,34,6],[.46,.53,.56],{kind:'hinge',group:group.id});
    }
  });
  return {fixed,doors,hardware,boxes:visible?[...fixed,...doors,...hardware]:[]};
}

export function storageParts(travels=[0,0],showStools=true){
  const boxes=[],shoes=[],drawers=[];
  const part=(id,center,size,color,travel=0,material)=>boxes.push({id,center:[center[0]+travel,center[1],center[2]],size,color,...(material?{material}:{})});
  for(const z of [594,764]){
    shoes.push({id:'ground-shoe-'+z,center:[215,42,z],radii:[125,42,47],color:[.28,.4,.49]});
    shoes.push({id:'middle-shoe-'+z,center:[255,266,z],radii:[45,18,47],color:[.73,.65,.48]});
  }
  if(showStools){
    const cx=200,cz=1145,base=stoolBay.floor;
    part('stool-cube',[cx,base+135,cz],[270,270,270],[1,.84,.02]);
    for(const [y,z,sy,sz]of [[55,0,14,80],[35,36,44,15],[10,18,14,50],[-10,0,30,15],[-53,0,18,18]])part('stool-question-'+y,[337,base+135+y,cz+z],[4,sy,sz],[1,.97,.83]);
    const floor=base+270;
    shoes.push({id:'mushroom-stem',center:[cx,floor+70,cz],radii:[110,70,110],color:[1,.94,.81]},{id:'mushroom-cap',center:[cx,floor+165,cz],radii:[165,95,165],color:[.82,.11,.09]});
    for(const z of [-80,80])shoes.push({center:[343,floor+180,cz+z],radii:[5,26,26],color:[1,.97,.88]});
    shoes.push({center:[330,floor+225,cz],radii:[5,20,26],color:[1,.97,.88]});
    for(const z of [-36,36])shoes.push({center:[308,floor+66,cz+z],radii:[5,20,10],color:[.12,.13,.13]});
  }
  return {boxes,shoes,drawers,stoolBay,envelopes:showStools?[{id:'cube',min:[65,stoolBay.floor,1010],max:[335,stoolBay.floor+270,1280]},{id:'mushroom',min:[35,stoolBay.floor+270,980],max:[365,stoolBay.floor+530,1310]}]:[]};
}
