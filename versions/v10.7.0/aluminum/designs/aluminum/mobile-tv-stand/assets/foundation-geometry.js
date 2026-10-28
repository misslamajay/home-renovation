// Local frame study. Geometric lengths are not approved cutting dimensions.
export const CASTER_SOURCE='https://www.footmastercasters.com/sub/caster_detail.php?gd_model_type=%ED%8F%89%ED%8C%90%EC%B7%A8%EB%B6%80%ED%98%95&gd_type2=HUP&gm_code=pd01&gs_code=GD&gs_name=GD-80&gs_type=GD';
export const caster=Object.freeze({model:'GD-80-F-HUP',diameter:63,tread:28,plate:90,holeCenters:70,holeDiameter:9,height:103,travel:15,offset:46,singleLoad:550,fourLoad:1100,reserveRadius:90});
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
export function createFoundation(depth=1000){
  if(![800,1000].includes(depth))throw new RangeError('Depth must be 800 or 1000');
  const p={width:2400,depth,rollingTop:1875,parkedLift:5,baseBottom:111,baseTop:191,postX:650,postDepth:80,plateThickness:8,plateSize:160,wheelX:1100,wheelZ:depth/2-120,wheelReserve:90,tvWidth:1890,tvHeight:1101,tvDepth:53,tvCenter:[0,1320.5,90],tvMass:39};
  const profiles=[],hardware=[],joints=[];
  const member=(id,name,group,a,b,section)=>profiles.push({id,name,group,start:a,end:b,section,length:distance(a,b),quantity:1});
  let i=0;
  for(const z of [-depth/2+20,depth/2-20])member('B'+String(++i).padStart(2,'0'),z<0?'后底座纵梁':'前底座纵梁','底座',[ -1200,151,z],[1200,151,z],[80,40]);
  for(const x of [-1180,-1130,-1070,-650,650,1070,1130,1180])member('B'+String(++i).padStart(2,'0'),Math.abs(x)===650?'立柱下承梁':Math.abs(x)===1180?'端部横梁':'轮座双承梁','底座',[x,151,-depth/2+40],[x,151,depth/2-40],[40,80]);
  for(const [n,x]of [-650,650].entries())member('U0'+(n+1),x<0?'左主立柱':'右主立柱','立柱',[x,191,0],[x,1875,0],[40,80]);
  for(const [n,y]of [500,1100,1500,1835].entries())member('T0'+(n+1),[ '下部拉结梁','电视下挂梁','电视上挂梁','顶部拉结梁'][n],'横向连接',[-630,y,0],[630,y,0],[80,40]);
  i=0;
  for(const x of [-650,650])for(const sign of [-1,1]){
    const a=[x,850,65*sign],b=[x,221,(depth/2-100)*sign];
    member('S0'+(++i),(x<0?'左':'右')+(sign<0?'后':'前')+'刚性斜撑','前后斜撑',a,b,[40,40]);
    joints.push({name:'斜撑柱端连接',point:a,side:sign},{name:'斜撑底端连接',point:b,side:sign});
  }
  for(const [n,a,b,z]of [[1,[-650,500],[650,1800],-48],[2,[650,500],[-650,1800],-56]])hardware.push({id:'X0'+n,name:'背面交叉钢扁撑',section:[30,4],start:[a[0],a[1],z],end:[b[0],b[1],z],length:distance(a,b),quantity:1});
  const wheels=[];
  for(const x of [-p.wheelX,p.wheelX])for(const z of [-p.wheelZ,p.wheelZ])wheels.push({id:'F0'+(wheels.length+1),x,z,angle:z<0?Math.PI:0,plate:[160,160,8],attachmentCenters:[60,130],casterCenters:[70,70]});
  let floor=p.baseTop;
  const openings=profiles.filter(m=>m.group==='横向连接').map(m=>{const ceiling=m.start[1]-m.section[0]/2,result={floor,ceiling,height:ceiling-floor};floor=m.start[1]+m.section[0]/2;return result;});
  return {parameters:p,profiles,hardware,joints,wheels,clear:{baseBayWidth:1260,baseBayDepth:depth-80,basePerimeterWidth:2320,postWidth:1260,postHeight:1684,openings},bounds:{fixed:{min:[-1200,0,-depth/2],max:[1200,1880,depth/2]},rollingHeight:1875,parkedHeight:1880,fullAdjustmentHeight:1890,supportWidth:2200,supportDepth:p.wheelZ*2},caster};
}
export function stability(model,{baseMass=35,tvMass=39,push=100,pushHeight=1500,tvOffset=90}={}){
  const vals=[baseMass,tvMass,push,pushHeight,tvOffset];
  if(vals.some(v=>!Number.isFinite(v))||baseMass<0||tvMass<0||push<0||pushHeight<=0)throw new RangeError('Invalid stability inputs');
  const half=model.bounds.supportDepth/2,limit=half-Math.abs(tvOffset),restoring=9.81*(baseMass*half+tvMass*limit)/1000,overturning=push*pushHeight/1000;
  return {baseMass,tvMass,push,pushHeight,tvOffset,margin:limit,restoring,overturning,factor:overturning>0?restoring/overturning:null,criticalPush:restoring/(pushHeight/1000),requiredBaseMass:Math.max(0,(1.5*overturning/9.81*1000-tvMass*limit)/half),referenceTarget:1.5};
}
