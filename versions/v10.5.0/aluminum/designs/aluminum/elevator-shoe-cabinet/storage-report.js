import {model,stoolBay,shoeZone,storageEnclosureParts} from './storage-geometry.js';
const target=document.getElementById('storage-report');
const geometry=storageEnclosureParts(model,[0,0,0,0],true),doorMembers=geometry.doors.filter(p=>p.kind==='door').map(p=>({...p,axis:p.size.indexOf(Math.max(...p.size)),group:'门框'}));
const records=[...model.members,...doorMembers].map((p,i)=>{const start=p.center.slice(),end=p.center.slice();start[p.axis]-=p.size[p.axis]/2;end[p.axis]+=p.size[p.axis]/2;return {...p,number:'SC'+String(i+1).padStart(3,'0'),length:p.size[p.axis],section:p.size.filter((_,j)=>j!==p.axis),start,end};});
const esc=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;'),fmt=n=>Number.isInteger(n)?String(n):n.toFixed(1);
const tx=(x,y,t,size=14,color='#486878',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-family="Arial,PingFang SC,sans-serif" fill="${color}">${esc(t)}</text>`;
const rect=(x,y,w,h,fill='#b1c2cc',stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}"/>`;
const line=(a,b,color='#8ca3b2',dash='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="1" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
const dim=(a,b,t,offset=[0,-7])=>line(a,b)+line([a[0]-4,a[1]+4],[a[0]+4,a[1]-4])+line([b[0]-4,b[1]+4],[b[0]+4,b[1]-4])+tx((a[0]+b[0])/2+offset[0],(a[1]+b[1])/2+offset[1],t,13);
function drawings(){
  const levels=model.rightStorage.linkedShelves;
  let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1960" role="img" aria-label="门板到顶、横向侧挂灯箱及固定开放格尺寸"><rect width="1200" height="1960" fill="#fafcfd"/>'+tx(600,35,'门板到顶 · 灯箱侧挂候选 · 单位 mm',23);
  const x=z=>65+(z-385)*.5,y=h=>720-h*.26,base=stoolBay.floor;
  s+=tx(300,82,'右柜立面 · 隐藏上柜门查看内部',16)+rect(x(385),y(2350),480,611,'#e8f1f4','#b1c2cd');
  s+=rect(x(400),y(682),460,(682-30)*.26,'#e8f8fb');
  for(const l of levels)s+=rect(x(400),y(l.floor),460,4.68,'#cab99b')+rect(x(400),y(l.floor-18),460,7.8)+tx(302,y((l.floor+l.ceiling)/2)+4,'贯通层 · 净高'+l.netHeight,12);
  s+=rect(x(452),y(shoeZone.upper.floor),235,18*.26,'#cbbca3')+rect(x(400),y(shoeZone.upperBeam.top),270,30*.26)+rect(x(940),y(634),15,604*.26);
  s+=rect(x(452),y(shoeZone.middle.floor),235,18*.26,'#cbbca3')+rect(x(400),y(shoeZone.lowerBeam.top),270,30*.26)+tx(x(685),y(323),'固定格净高150',12)+tx(x(685),y(540),'固定格净高188',12)+tx(x(685),y(125),'落地净高200',12);
  for(const z of [594,764])s+='<ellipse cx="'+x(z)+'" cy="'+y(42)+'" rx="23.5" ry="10.92" fill="#526d7e"/>';
  s+=line([x(452),y(0)],[x(922),y(0)],'#638e9b');
  s+=rect(x(1010),y(base+270),135,70.2,'#ffda26','#cdab40')+tx(x(1145),y(base+135)+14,'?',43,'#fff9de');
  s+='<ellipse cx="'+x(1145)+'" cy="'+y(base+340)+'" rx="55" ry="18.2" fill="#fff1d8"/><ellipse cx="'+x(1145)+'" cy="'+y(base+435)+'" rx="82.5" ry="24.7" fill="#d9342e"/>';
  s+=tx(x(1145),y(582),'顶余104',12,'#a67b3d')+dim([x(970),748],[x(1320),748],'净宽350',[0,22])+dim([570,y(base)],[570,y(stoolBay.ceiling)],'净高634',[0,0]);
  s+=line([x(970),y(0)],[x(1320),y(0)],'#638e9b');
  s+=tx(300,800,'左：两块固定层板，三格200 / 150 / 188',14)+tx(300,825,'右凳位直接落地：0 → 梁底634；上板面682',13);
  s+=tx(885,82,'开放叠凳位俯视 · 有效净深',16);
  const px=720,pz=125,sc=.8;
  s+=rect(px,pz,280,272,'#edf3f7','#a7bdca')+rect(px+32,pz+28,216,216,'#ffe478','#c8ad52');
  s+='<circle cx="860" cy="261" r="132" fill="#e3756e" fill-opacity=".45" stroke="#cc6b63"/>';
  s+=dim([px,pz-14],[px+280,pz-14],'净宽350')+dim([1035,pz],[1035,pz+272],'净深340',[0,0]);
  s+=tx(860,425,'直径330：宽余20，深余10；叠高530',13)+tx(860,450,'实物外鼓、公差和接触面稳定需复测',13);
  const notes=['右上门底685 / 顶2317，下部0—682开放','红叶447×1632×20；黄叶457×1632×20','原顶灯箱移除，顶格净高由120恢复300','门板6；右柜门框总深422，局部铰链425','右门90°总深约881，柜前外伸约481','下部两个固定层板，三格与左柜侧封隔开','右凳位无底板、无垫高，入口无底梁'];
  notes.forEach((t,i)=>s+=tx(860,520+i*31,t,13));
  s+=tx(600,878,'上方带门柜体保持L形贯通；下方三格侧封独立',19);
  const plan=q=>[450-q[0]*.25,930+q[1]*.25];
  s+='<polygon points="'+model.footprint.map(p=>plan(p).join(',')).join(' ')+'" fill="#dcebf1" stroke="#81a5b6"/>';
  s+=line(plan([0,400]),plan([400,400]),'#b59b6c','4 3')+tx(260,970,'左柜层板',14)+tx(400,1135,'右柜层板',14)+tx(270,1310,'接缝Z400 · 保留型材立柱承托',13);
  s+=dim([105,908],[450,908],'左1380')+dim([485,930],[485,1267.5],'右1350',[20,0]);
  const detail=['上柜板面：'+levels.map(l=>l.floor).join(' / '),'右上净高：'+levels.map(l=>l.netHeight).join(' / '),'三格侧封板18，不与左柜通；净宽470 / 深340','地面0 → 首梁底200，底格净高200','板面248 → 次梁底398，中格净高150','板面446 → 顶梁底634，上格净高188','固定板400×470×18，两层各设30支撑梁','凳位净350×340×634，上余634−530=104'];
  detail.forEach((t,i)=>s+=tx(860,960+i*40,t,13));
  s+=tx(600,1360,'固定柜体：左1380 / 右1350 × 深400 × 高2350；含侧挂灯箱外廓X1450 / Z1350 / H2350',14);
  s+=tx(600,1392,'左三格闭合：200+48+150+48+188+48=682；凳位地面0至梁底634，无底板',14);
  s+=tx(600,1424,'固定三格净宽922−452=470，梁内净深370−30=340；主架30×30，门框20×20；共'+records.length+'根型材',14);
  s+=tx(600,1456,'槽宽、壁厚、孔位、切角和加工余量待核；模型几何长不是批准下料尺寸',13);
  s+=tx(600,1492,'当前发布方案；叠凳按存放使用，不作叠坐设计',13);
  s+=tx(600,1540,'横向侧挂灯箱候选 · 安装位置与占地待确认',20);
  s+=rect(95,1595,15,178,'#b3c3cc')+rect(120,1610,320,140,'#7c8d96')+rect(123,1613,314,134,'#fff5d9')+tx(280,1695,'怪 兽 小 屋',30,'#34464a');
  s+=line([110,1635],[120,1635],'#6d8390')+line([110,1725],[120,1725],'#6d8390');
  s+=dim([120,1590],[440,1590],'宽320')+dim([480,1610],[480,1750],'高140',[0,0]);
  s+=tx(280,1787,'外壳厚60，壳边3 / 透光板4为示意',13)+tx(280,1818,'下沿2000 / 上沿2140；两根3030短臂L64',13)+tx(280,1850,'固定立柱 → 6厚连接板 → 短臂 → 灯箱壳',13);
  s+=tx(880,1580,'局部俯视 · 灯箱向柜前伸出',15);
  s+=rect(700,1605,120,55,'#dce8ee','#a2bac7')+rect(784,1643.5,36,16.5,'#a9bdc8')+rect(832,1651.75,72,176,'#fff1ce','#91a9b6');
  s+=line([700,1660],[1020,1660],'#a4783f','5 4')+tx(1000,1648,'柜前Z400',12);
  s+=dim([950,1660],[950,1827.75],'前伸305',[0,0])+dim([820,1855],[904,1855],'侧伸70',[0,22])+dim([832,1612],[904,1612],'厚60');
  s+=tx(880,1903,'灯箱最前Z705：局部总深705；侧向多出70',13);
  s+=tx(600,1940,'侧挂灯箱按当前方案示意；按实物重量核定连接板、螺栓、防转及低压供电走线',13);
  return s+'</svg>';
}
function memberMap(){
  const rows=Math.ceil(records.length/2),height=Math.max(1450,rows*25+180),project=q=>[660+(-q[0]*.58+q[2]*.58)*.36,height*.86-(q[1]*.68+q[0]*.14+q[2]*.14)*.36];
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1320 ${height}" role="img" aria-label="全部型材编号索引"><rect width="1320" height="${height}" fill="#fbfcfd"/>`+tx(660,36,'全部 '+records.length+' 根型材 · 包含四扇门框',21);
  for(const r of records)s+=line(project(r.start),project(r.end),'#adc0cc');
  records.map(r=>({r,p:project(r.center)})).sort((a,b)=>a.p[1]-b.p[1]).forEach(({r,p},i)=>{const left=i%2===0,x=left?150:1170,y=100+Math.floor(i/2)*25,turn=left?280:1040;s+=`<polyline points="${p[0]},${p[1]} ${turn},${y-4} ${x+(left?110:-110)},${y-4}" fill="none" stroke="#beced8" stroke-width=".5"/>`+tx(x,y,r.number+' '+r.section.join('×')+' L'+fmt(r.length),10);});
  s+=tx(660,height-24,'门框按闭合状态列端点；编号与表格、CSV一致',12);return s+'</svg>';
}
const chart=drawings(),map=memberMap(),stock=new Map();for(const r of records){const k=r.section.slice().sort((a,b)=>a-b).join('×')+' / '+fmt(r.length);stock.set(k,(stock.get(k)||0)+1);}
if(target){
  target.innerHTML=`<h2>贯通上柜与开放下柜 · 详细尺寸</h2><div class="storage-downloads"><button id="storage-svg">下载尺寸 SVG</button><button id="storage-map-svg">下载编号 SVG</button><button id="storage-csv">下载逐根 CSV</button></div><div class="storage-chart">${chart}</div><details><summary>${records.length} 根型材 · 分组汇总与逐根编号</summary><p class="storage-stock">${Array.from(stock,([k,v])=>k+' mm × '+v+' 根').join('　·　')}</p><div class="storage-chart">${map}</div><div class="storage-table"><table><thead><tr><th>编号</th><th>安装位置 / 模型ID</th><th>截面</th><th>几何长</th><th>数量</th><th>端点 X,Y,Z</th></tr></thead><tbody>${records.map(r=>'<tr><td>'+r.number+'</td><td>'+r.id+'</td><td>'+r.section.join('×')+'</td><td>'+fmt(r.length)+'</td><td>1</td><td>'+r.start.map(fmt).join(',')+' → '+r.end.map(fmt).join(',')+'</td></tr>').join('')}</tbody></table></div><p>含柜架与四扇门的铝型材；门板、层板、铰链、连接片和螺栓另列。槽口、壁厚、孔位、切角和加工余量待核，模型长度不可直接下料。</p></details>`;
  const save=(name,content,type)=>{const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  document.getElementById('storage-svg').onclick=()=>save('鞋柜-贯通收纳与叠凳位-尺寸.svg',chart,'image/svg+xml');
  document.getElementById('storage-map-svg').onclick=()=>save('鞋柜-贯通收纳-全部型材编号.svg',map,'image/svg+xml');
  document.getElementById('storage-csv').onclick=()=>{const rows=[['编号','安装位置','截面A','截面B','模型几何长mm','数量','起点X','起点Y','起点Z','终点X','终点Y','终点Z','备注'],...records.map(r=>[r.number,r.id,...r.section,r.length,1,...r.start,...r.end,'闭合模型端点；壁厚/槽宽/加工/孔位待核；非批准下料尺寸'])];save('鞋柜-贯通收纳-逐根型材.csv','\uFEFF'+rows.map(a=>a.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n'),'text/csv;charset=utf-8');};
  target._storageReport={records,model,chart,map};
}
function report(){if(parent!==window)parent.postMessage({type:'zhuji-design-size',height:Math.ceil(document.body.getBoundingClientRect().bottom+scrollY)+8},location.origin);}
new ResizeObserver(report).observe(document.body);addEventListener('load',report);report();
