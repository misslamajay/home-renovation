// Parametric L-cabinet geometry, mm. Model lengths are not approved cutting lengths.
const S=30,T=18,P=S+T,L=1380,R=1350,H=2350,LD=460,RD=410,C=H-S;
const silver=[.72,.78,.82],black=[.125,.153,.145],blue=[0,.557,1],board=[.8,.78,.71];
export const dimensions=Object.freeze({left:L,right:R,height:H,depth:LD,leftDepth:LD,rightDepth:RD,leftClearDepth:400,rightClearDepth:350,section:S,netHeight:H-2*S});
const posts=[{id:'A',x:15,z:15},{id:'B',x:RD-15,z:15},{id:'C',x:L-15,z:15},{id:'D',x:L-15,z:LD-15},{id:'E',x:RD-15,z:LD-15},{id:'F',x:RD-15,z:R-15},{id:'G',x:15,z:R-15},{id:'H',x:15,z:LD-15}].map(p=>({...p,group:['B','E','H'].includes(p.id)?'corner':p.id==='C'||p.id==='D'?'left':'right'}));
const edges=[['A','B'],['B','C'],['C','D'],['D','E'],['E','F'],['F','G'],['G','H'],['H','A'],['H','E'],['B','E']];
const footprint=[[0,0],[L,0],[L,LD],[RD,LD],[RD,R],[0,R]];
const members=[],fixtures=[],byId=Object.fromEntries(posts.map(p=>[p.id,p]));
const bar=(id,axis,center,size,group='storage-support',kind='storage-support')=>members.push({id,axis,center,size,group,kind});
const panel=(id,center,size,color=board,extra={})=>fixtures.push({id,center,size,color,kind:'storage-board',...extra});
function edge(id,a,b,y,group,kind){const p=byId[a],q=byId[b],axis=p.x===q.x?2:0,size=[S,S,S];size[axis]=Math.abs(axis===0?p.x-q.x:p.z-q.z)-S;bar(id,axis,[(p.x+q.x)/2,y,(p.z+q.z)/2],size,group,kind);}
for(const p of posts)bar('post-'+p.id,1,[p.x,H/2,p.z],[S,H,S],p.group,'post');
for(const [level,y]of [['bottom',15],['top',H-15]])for(const [a,b]of edges)if(level!=='bottom'||a+b!=='DE')edge(level+'-'+a+b,a,b,y,'base',level);

export const layout=Object.freeze({candidate:true,strategy:'right-owned-separated-corner',requestedLeft:[180,180,200,200,150,100],requestedRight:[300,100,140,180,200,200,220,220],leftHeights:[180,180,200,200,150,100],rightHeights:[300,100,140,180,200,200,220,220],leftOmitted:[],rightOmitted:[],heightKept:H});
const leftWidth=L-RD-S,rightWidth=R-LD-S,leftDepth=LD-2*S,rightDepth=RD-2*S;
export const stoolBay=Object.freeze({side:'left',arrangement:'side-by-side',clearWidth:leftWidth,clearDepth:leftDepth,clearHeight:350,xMin:RD,xMax:L-S,zMin:S,zMax:LD-S,floor:0,ceiling:350,roofTop:398,roofBoardThickness:T,floorRiser:0,mushroomDiameter:330,mushroomHeight:260,cubeSize:270,maxItemHeight:270,headroom:80,provisional:true});
export const shoeZone=Object.freeze({side:'left',clearWidth:leftWidth,clearDepth:leftDepth,xMin:RD,xMax:L-S,zMin:S,zMax:LD-S,ground:{floor:0,ceiling:350,netHeight:350,label:'两凳并排'},middle:{floor:398,ceiling:548,netHeight:150,label:'拖鞋'},upper:{floor:596,ceiling:776,netHeight:180,label:'穿过的鞋'},lowerBeam:{bottom:350,top:380,section:S},lowerBoard:{bottom:380,top:398,thickness:T},upperBeam:{bottom:548,top:578,section:S},upperBoard:{bottom:578,top:596,thickness:T},roofBeam:{bottom:776,top:806,section:S},roofBoard:{bottom:806,top:824,thickness:T},fixed:true,linkedToRight:false});
const upperFloor=824;
function schedule(heights,start,side){let floor=start;const layers=heights.map((netHeight,i)=>{const f=floor,ceiling=f+netHeight;floor=ceiling+P;return Object.freeze({id:side+'-'+(i+1),label:'收纳第'+(i+1)+'层',floor:f,ceiling,netHeight,boardBottom:ceiling+S,boardTop:floor,supportBottom:ceiling,clearWidth:side==='left'?leftWidth:rightWidth,clearDepth:side==='left'?leftDepth:rightDepth});});return Object.freeze({layers,baseFloor:start,boardThickness:T,supportHeight:S,clearWidth:side==='left'?leftWidth:rightWidth,mainClearWidth:side==='left'?leftWidth:rightWidth,clearDepth:side==='left'?leftDepth:rightDepth,reserveFloor:floor,reserveCeiling:C,reserveHeight:C-floor});}
const leftStorage=schedule(layout.leftHeights,upperFloor,'left'),rightStorage=Object.freeze({...schedule(layout.rightHeights,48,'right'),baseBoardBottom:30,lowerOpen:false,fullHeightDoors:true});
const leftTops=[upperFloor,...leftStorage.layers.map(l=>l.boardTop)],rightTops=rightStorage.layers.map(l=>l.boardTop);
const commonTops=leftTops.filter(f=>rightTops.includes(f));
const linkedShelves=Object.freeze(commonTops.map(f=>({id:'linked-'+f,floor:f})));

const midLX=(RD+L-S)/2,midRZ=(LD+R-S)/2;
const leftSegments=[[midLX,LD/2,leftWidth,leftDepth],[midLX,15,leftWidth,S],[midLX,LD-15,leftWidth,S],[L-15,LD/2,S,leftDepth]];
const rightSegments=[[RD/2,R/2,rightDepth,R-2*S],[15,LD/2,S,leftDepth],[15,midRZ,S,rightWidth],[RD-15,LD/2,S,leftDepth],[RD-15,midRZ,S,rightWidth],[RD/2,15,rightDepth,S],[RD/2,R-15,rightDepth,S]];
function boards(id,top,segments){segments.forEach(([x,z,w,d],i)=>panel(id+'-'+i,[x,top-T/2,z],[w,T,d]));}
function leftSupport(top){const y=top-T-S/2;for(const[a,b]of [['B','C'],['C','D'],['D','E']])edge('left-'+top+'-'+a+b,a,b,y,'left-shelves');bar('left-'+top+'-inner-depth',2,[RD+15,y,LD/2],[S,S,leftDepth],'left-shelves');}
function rightSupport(top){const y=top-T-S/2;for(const[a,b]of [['A','B'],['B','E'],['A','H'],['H','E'],['E','F'],['F','G'],['G','H']])edge('right-'+top+'-'+a+b,a,b,y,'right-shelves');}
boards('right-base',48,rightSegments);
for(const top of [398,596,...leftTops]){leftSupport(top);boards('left-board-'+top,top,leftSegments);}
for(const top of rightTops){rightSupport(top);boards('right-board-'+top,top,rightSegments);}
// One opaque separating face: nine 18 mm panels fill the right-hand frame openings.
// B/E posts, BE beams and shelf edges close the bands between panels.
export const divider=Object.freeze({
  id:'corner-divider',owner:'right',thickness:T,xMin:RD-T,xMax:RD,zMin:S,zMax:LD-S,
  depth:leftDepth,bottom:0,top:H,panelBottom:48,panelTop:C,fullHeight:true,opaque:true,
  mount:'B/E共用立柱及右柜BE横梁，按层间开口分片固定，连接五金待核',
  segments:Object.freeze([...rightStorage.layers,{id:'reserve',floor:rightStorage.reserveFloor,ceiling:C}].map((l,i)=>Object.freeze({id:'corner-divider-'+(i+1),bottom:l.floor,top:l.ceiling,height:l.ceiling-l.floor,depth:leftDepth,thickness:T})))
});
for(const p of divider.segments)panel(p.id,[RD-T/2,(p.bottom+p.top)/2,LD/2],[T,p.height,leftDepth],board,{kind:'corner-divider',owner:'right'});

export const lightbox=Object.freeze({text:'怪兽小屋',kind:'cantilever-blade',provisional:true,width:320,height:140,depth:60,bottom:2000,top:2140,front:1450,back:1390,zMin:LD-15,zMax:LD+305,faceWidth:300,faceHeight:120,color:'暖白双面',sheetThickness:3,diffuserThickness:4,projectionFromBodyFront:305,sideOverhang:70,mount:'左外角固定立柱，双3030短臂及6厚板；按实物选五金'});
for(const y of [2025,2115])bar('blade-support-arm-'+y,0,[1418,y,LD-30],[64,S,S],'lightbox-support');
const signPart=(id,center,size,color)=>fixtures.push({id:'blade-'+id,center,size,color,kind:'lightbox-case'});
const metal=[.45,.52,.56],glow=[1,.97,.86],signZ=LD+145;
signPart('mount-plate',[1383,2070,LD-20],[6,160,50],metal);
for(const y of [2001.5,2138.5])signPart('shell-'+y,[1420,y,signZ],[60,3,320],metal);
for(const z of [LD-13.5,LD+303.5])signPart('end-'+z,[1420,2070,z],[60,134,3],metal);
for(const x of [1392,1448])signPart('diffuser-'+x,[x,2070,signZ],[4,134,314],glow);
const pegboard=Object.freeze({bottom:48,top:2317,height:2269,thickness:2,back:20,front:22,width:R-2*S,standOff:20,pitch:25,holeDiameter:8,firstY:70.5,rows:90,firstZ:50,columns:51,segments:[...rightStorage.layers,{floor:rightStorage.reserveFloor,ceiling:C}].map(l=>({bottom:l.floor+3,top:l.ceiling-3}))});
const bench=Object.freeze({seatTop:upperFloor,seatBottom:806,seatThickness:T,supportBottom:776,dividerTop:596,dividerBottom:578,drawers:[{ground:true,fixed:true,insideHeight:0},{ground:true,fixed:true,insideHeight:0}]});
const cornerStorage=Object.freeze({owner:'right',separated:true,openingBottom:0,openingTop:C,openingWidth:0,clearDepth:leftDepth,continuous:false,sideAccess:false,dividerThickness:T,compartments:[],direction:'交集归右，仅从右柜取用'});
export const model=Object.freeze({name:'电梯鞋柜 · 转角纵向隔板与右侧独立收纳',revision:28,dimensions,posts,edges,footprint,members,fixtures,layout,bench,lightbox,pegboard,leftStorage,rightStorage,cornerStorage,divider,stoolBay,shoeZone,linkedShelves,upperFloor,cornerLayout:{type:'right-owned-separated',owner:'right',sharedPosts:['B','E','H'],leftOpening:leftWidth,rightOpening:rightWidth},referenceMembers:[],alignment:{dividerTop:398,leftShelfTop:596,seatTop:824,heightDifference:0},measurement:'总高2350，左净深400/总深460，右净深350/总深410。转角交集归右；18厚纵向隔板配合B/E柱及BE梁连续封隔，左右不贯通。'});

const leftNear=RD+25,leftFar=L-33,leftSpan=(leftFar-leftNear)/2,rightNear=LD+35,rightFar=R-3,rightHalf=(rightFar-rightNear)/2;
export const storageEnclosure=Object.freeze({revision:8,panelThickness:6,doorFrame:20,maxAngle:90,groups:[
  {id:'red',label:'左上红门',hinge:[leftFar,LD+22],direction:-1,span:leftSpan,bottom:827,top:2317,color:[.93,.188,.165],postX:L-20},
  {id:'yellow',label:'左上黄门',hinge:[leftNear,LD+22],direction:1,span:leftSpan,bottom:827,top:2317,color:[1,.831,0],postX:RD-10},
  {id:'right-red',label:'右柜红门',hinge:[RD+22,rightNear],direction:1,span:rightHalf-5,bottom:33,top:2317,color:[.93,.188,.165],postZ:LD-15,normalAxis:0},
  {id:'right-yellow',label:'右柜黄门',hinge:[RD+22,rightFar],direction:-1,span:rightHalf+5,bottom:33,top:2317,color:[1,.831,0],postZ:R-15,normalAxis:0}
]});
const rotate=(v,a)=>[v[0]*Math.cos(a)-v[2]*Math.sin(a),v[1],v[0]*Math.sin(a)+v[2]*Math.cos(a)];
export function storageEnclosureParts(current,angles=[0,0,0,0],visible=true){
  const fixed=[],doors=[],hardware=[],add=(list,id,center,size,color=silver,extra={})=>list.push({id,center,size,color,...extra});
  const leftVertical=[shoeZone.ground,shoeZone.middle,shoeZone.upper,...leftStorage.layers,{floor:leftStorage.reserveFloor,ceiling:C}];
  for(const[i,l]of leftVertical.entries()){const b=Math.max(30,l.floor),y=(b+l.ceiling)/2,h=l.ceiling-b;add(fixed,'left-back-'+i,[midLX,y,15],[leftWidth,h,6],black);add(fixed,'left-blue-end-'+i,[L-15,y,LD/2],[6,h,leftDepth],blue);}
  for(const[i,l]of [...rightStorage.layers,{floor:rightStorage.reserveFloor,ceiling:C}].entries()){const y=(l.floor+l.ceiling)/2,h=l.ceiling-l.floor;add(fixed,'right-blue-end-'+i,[RD/2,y,R-15],[rightDepth,h,6],blue);add(fixed,'corner-back-'+i,[RD/2,y,15],[rightDepth,h,6],black);}
  pegboard.segments.forEach((seg,i)=>{for(const[z,w]of [[LD/2,leftDepth],[midRZ,rightWidth]])add(fixed,'right-peg-'+i+'-'+z,[21,(seg.bottom+seg.top)/2,z],[2,seg.top-seg.bottom,w],[.97,.97,.96],{material:'pegboard',kind:'pegboard'});for(const z of [45,LD-55,LD+15,R-42])for(const y of [seg.bottom+20,seg.top-20])add(fixed,'peg-mount-'+i+'-'+z+'-'+y,[10,y,z],[20,24,24],silver,{kind:'pegboard-mount'});});
  add(fixed,'left-roof',[midLX,2323,LD/2],[leftWidth,6,leftDepth],black);add(fixed,'corner-roof',[RD/2,2323,LD/2],[rightDepth,6,leftDepth],black);add(fixed,'right-roof',[RD/2,2323,midRZ],[rightDepth,6,rightWidth],black);
  add(fixed,'upper-corner-cover',[RD+11,(827+2317)/2,LD+17.5],[22,1490,35],silver);
  storageEnclosure.groups.forEach((g,index)=>{const side=index<2,theta=Math.max(0,Math.min(90,Number(angles[index])||0))*Math.PI/180,angle=(side?g.direction:-g.direction)*theta,h=g.top-g.bottom,w=g.span-4,origin=[g.hinge[0],(g.top+g.bottom)/2,g.hinge[1]],offset=side?[g.direction*g.span/2,0,-10]:[-10,0,g.direction*g.span/2],center=rotate(offset,angle).map((v,k)=>v+origin[k]);
    const part=(id,o,size,color=silver,kind='door')=>add(doors,g.id+'-door-'+id,rotate(o,angle).map((v,k)=>v+center[k]),size,color,{angle,group:g.id,kind,...(!side?{normalAxis:0}:{})});
    for(const k of [-1,1])part('stile-'+k,side?[k*(w-20)/2,0,0]:[0,0,k*(w-20)/2],[20,h,20]);for(const k of [-1,1])part('rail-'+k,[0,k*(h-20)/2,0],side?[w-40,20,20]:[20,20,w-40]);
    part('color-panel',[0,0,0],side?[w-40,h-40,6]:[6,h-40,w-40],g.color,'color-panel');part('pull',side?[g.direction*(w/2-70),0,5]:[5,0,g.direction*(w/2-70)],side?[80,18,3]:[3,18,80],[.13,.2,.22],'handle');
    for(const y of side?[900,1250,1600,1950,2250]:[100,600,1175,1750,2250]){if(side){const min=Math.min(g.postX,g.hinge[0])-10,max=Math.max(g.postX,g.hinge[0])+10;add(hardware,g.id+'-hinge-mount-'+y,[(min+max)/2,y,LD+1.5],[max-min,34,3],silver,{kind:'hinge',group:g.id});add(hardware,g.id+'-hinge-arm-'+y,[g.hinge[0],y,LD+12.5],[6,34,19],silver,{kind:'hinge',group:g.id});}else{const min=Math.min(g.postZ,g.hinge[1])-10,max=Math.max(g.postZ,g.hinge[1])+10;add(hardware,g.id+'-hinge-mount-'+y,[RD+1.5,y,(min+max)/2],[3,34,max-min],silver,{kind:'hinge',group:g.id});add(hardware,g.id+'-hinge-arm-'+y,[RD+12.5,y,g.hinge[1]],[19,34,6],silver,{kind:'hinge',group:g.id});}add(hardware,g.id+'-hinge-knuckle-'+y,[g.hinge[0],y,g.hinge[1]],[6,34,6],[.46,.53,.56],{kind:'hinge',group:g.id});}
  });
  return {fixed,doors,hardware,boxes:visible?[...fixed,...doors,...hardware]:[]};
}
export function storageParts(travels=[0,0],showStools=true){
  const boxes=[],shoes=[],drawers=[],envelopes=[],part=(id,center,size,color)=>boxes.push({id,center,size,color});
  for(const x of [640,780,990,1130]){shoes.push({id:'slipper-'+x,center:[x,416,LD/2+45],radii:[47,18,45],color:[.73,.65,.48]});shoes.push({id:'used-shoe-'+x,center:[x,638,LD/2+5],radii:[47,42,125],color:[.28,.4,.49]});}
  if(showStools){const cx=1100,cz=LD/2,mx=660;part('stool-cube',[cx,135,cz],[270,270,270],[1,.84,.02]);for(const[y,x,sy,sx]of [[55,0,14,80],[35,36,44,15],[10,18,14,50],[-10,0,30,15],[-53,0,18,18]])part('stool-question-'+y,[cx+x,135+y,cz+137],[sx,sy,4],[1,.97,.83]);shoes.push({id:'mushroom-stem',center:[mx,70,cz],radii:[110,70,110],color:[1,.94,.81]},{id:'mushroom-cap',center:[mx,165,cz],radii:[165,95,165],color:[.82,.11,.09]});for(const x of [-80,80])shoes.push({center:[mx+x,180,cz+143],radii:[26,26,5],color:[1,.97,.88]});shoes.push({center:[mx,225,cz+130],radii:[26,20,5],color:[1,.97,.88]});for(const x of [-36,36])shoes.push({center:[mx+x,66,cz+108],radii:[10,20,5],color:[.12,.13,.13]});envelopes.push({id:'cube',min:[cx-135,0,cz-135],max:[cx+135,270,cz+135]},{id:'mushroom',min:[mx-165,0,cz-165],max:[mx+165,260,cz+165]});}
  return {boxes,shoes,drawers,stoolBay,envelopes};
}
