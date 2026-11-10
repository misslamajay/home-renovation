import {model} from './storage-geometry.js';
import {slotReference as p,slotFit} from './slot-profile.js';
const $=s=>document.querySelector(s),side=$('#slot-side'),input=$('#slot-request');
const fits={left:slotFit(model.dimensions.leftDepth),right:slotFit(model.dimensions.rightDepth)};
let currentSVG='';
const text=(x,y,t,fill='#486878',size=15)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,PingFang SC,sans-serif" fill="${fill}" font-size="${size}">${t}</text>`;
const line=(x1,y1,x2,y2,c='#8ba3b1',dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
function diagram(f){
  const sc=1.65,x=z=>150+z*sc,w=f.outerDepth*sc,base=210;
  const dim=(a,b,y,t,c='#486878')=>line(x(a),y,x(b),y,c)+line(x(a),y-5,x(a),y+5,c)+line(x(b),y-5,x(b),y+5,c)+text((x(a)+x(b))/2,y-10,t,c);
  const profile=(mirror=false)=>{const pts=[[0,0],[30,0],[30,11],[21,11],[21,19],[30,19],[30,30],[0,30]].map(([a,b])=>[x(mirror?f.outerDepth-a:a),base+b*sc]);return `<polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="#b7c6cc" stroke="#708994"/>`;};
  let s=text(500,34,`${p.model} · 前后截面与入槽板件`, '#244b5d',23)+text(500,65,`槽口8 / 槽内深9 / 板厚5 / 每边底部间隙1`, '#486878',16);
  s+=dim(0,f.outerDepth,112,'外廓总深 '+f.outerDepth)+dim(15,f.outerDepth-15,158,'中心线间距 '+f.centerDistance);
  s+=profile()+profile(true);
  s+=`<rect x="${x(f.panelStart)}" y="${base+14*sc}" width="${f.panelDepth*sc}" height="${5*sc}" fill="#5c9eaf" stroke="#17667d"/>`;
  for(const a of [15,f.outerDepth-15])s+=line(x(a),180,x(a),base+75,'#8ba3b1','4 4');
  for(const [a,b]of [[21,30],[f.outerDepth-30,f.outerDepth-21]])s+=line(x(a),base+11*sc,x(b),base+11*sc,'#c78b30');
  s+=text(x(15),base+82,'前型材30')+text(x(f.outerDepth-15),base+82,'后型材30');
  s+=dim(30,f.outerDepth-30,base+130,'露出净深 '+f.innerDepth)+dim(f.panelStart,f.panelEnd,base+179,'整块板深 '+f.panelDepth+'（含埋边8×2）','#17667d');
  const start=(f.outerDepth-f.requestedPanelDepth)/2,end=f.outerDepth-start,color=f.fits?'#17667d':'#b24a35';
  s+=line(x(start),base+235,x(end),base+235,color)+line(x(start),base+227,x(start),base+243,color)+line(x(end),base+227,x(end),base+243,color)+text(500,base+268,`试放板深${f.requestedPanelDepth}：需每边插入${f.requiredInsertion}；本基准允许8`,color,17);
  s+=text(500,base+300,'薄板匹配与装配示意；内部空腔、圆角和夹条细部省略。并非承载验算或加工图。','#687b83',13);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 545" role="img" aria-label="${f.outerDepth}外框，${f.panelDepth}板深，${f.innerDepth}露出净深"><rect width="1000" height="545" fill="#fafcfd"/>${s}</svg>`;
}
function render(){
  const f=slotFit(fits[side.value].outerDepth,Number(input.value));
  $('#slot-outer').textContent=f.outerDepth+' mm';$('#slot-panel').textContent=f.panelDepth+' mm';$('#slot-clear').textContent=f.innerDepth+' mm';
  currentSVG=diagram(f);$('#slot-chart').innerHTML=currentSVG;
  const status=$('#slot-status');status.dataset.fit=String(f.fits);
  status.textContent=f.fits?`试放${f.requestedPanelDepth} mm板件：每边插入${f.requiredInsertion} mm，满足本页端部几何条件；板厚、夹条及四角避让另核。`:`试放${f.requestedPanelDepth} mm板件不符合本基准：需每边插入${f.requiredInsertion} mm，允许8 mm。若维持该板深，按同一装配关系外框应为${f.outerForPanel} mm；如果${f.requestedPanelDepth}指型材内边露出净深，外框应为${f.outerForClear} mm。`;
  document.dispatchEvent(new Event('slot-fit-rendered'));report();
}
const rows=[['固定框架总深','outerDepth'],['型材中心线间距','centerDistance'],['型材内边露出净深','innerDepth'],['整块板深（含埋边）','panelDepth'],['每边实际插入','insertion']];
$('#slot-summary').innerHTML=rows.map(([label,key])=>`<tr><td>${label}</td><td>${fits.left[key]} mm</td><td>${fits.right[key]} mm</td></tr>`).join('')+'<tr><td>板厚 / 夹条名义厚度</td><td>5 / 3 mm</td><td>5 / 3 mm</td></tr>';
side.onchange=()=>{input.value=fits[side.value].panelDepth;render();};input.oninput=()=>{if(Number(input.value)>0)render();};
$('#slot-standard').onclick=()=>{input.value=fits[side.value].panelDepth;render();};$('#slot-400').onclick=()=>{input.value=400;render();};
$('#slot-svg').onclick=()=>{const url=URL.createObjectURL(new Blob([currentSVG],{type:'image/svg+xml'})),a=document.createElement('a');a.href=url;a.download=`鞋柜-${side.value}-入槽截面-基准示意.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function report(){if(parent!==window)parent.postMessage({type:'zhuji-design-size',height:Math.ceil(document.body.getBoundingClientRect().bottom+scrollY)+8},location.origin);}
render();new ResizeObserver(report).observe(document.body);addEventListener('load',report);
