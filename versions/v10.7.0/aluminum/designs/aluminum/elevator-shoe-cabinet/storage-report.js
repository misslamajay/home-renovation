import {model,stoolBay,shoeZone,storageEnclosure,storageEnclosureParts} from './storage-geometry.js';
const target=document.getElementById('storage-report');
const divider=model.divider;
const geometry=storageEnclosureParts(model,[0,0,0,0],true);
const doorMembers=geometry.doors.filter(p=>p.kind==='door').map(p=>({...p,axis:p.size.indexOf(Math.max(...p.size)),group:'门框'}));
const records=[...model.members,...doorMembers].map((p,i)=>{const start=p.center.slice(),end=p.center.slice();start[p.axis]-=p.size[p.axis]/2;end[p.axis]+=p.size[p.axis]/2;return {...p,number:'SC'+String(i+1).padStart(3,'0'),length:p.size[p.axis],section:p.size.filter((_,j)=>j!==p.axis),start,end};});
const esc=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;'),fmt=n=>Number.isInteger(n)?String(n):n.toFixed(1);
const tx=(x,y,t,size=14,color='#486878',anchor='middle')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-size="'+size+'" font-family="Arial,PingFang SC,sans-serif" fill="'+color+'">'+esc(t)+'</text>';
const rect=(x,y,w,h,fill='#b1c2cc',stroke='none')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" stroke="'+stroke+'"/>';
const line=(a,b,color='#8ca3b2',dash='')=>'<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+color+'" stroke-width="1" '+(dash?'stroke-dasharray="'+dash+'"':'')+'/>';
const dim=(a,b,t,offset=[0,-7])=>line(a,b)+line([a[0]-4,a[1]+4],[a[0]+4,a[1]-4])+line([b[0]-4,b[1]+4],[b[0]+4,b[1]-4])+tx((a[0]+b[0])/2+offset[0],(a[1]+b[1])/2+offset[1],t,13);
const svg=(w,h,label,body)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(label)+'"><rect width="'+w+'" height="'+h+'" fill="#fafcfd"/>'+body+'</svg>';
const maxAxis=(parts,axis)=>Math.max(...parts.flatMap(p=>{const a=p.angle||0,c=Math.cos(a),s=Math.sin(a);return [-1,1].flatMap(x=>[-1,1].map(z=>axis===0?p.center[0]+c*x*p.size[0]/2-s*z*p.size[2]/2:p.center[2]+s*x*p.size[0]/2+c*z*p.size[2]/2));}));
const leftOpened=storageEnclosureParts(model,[90,90,0,0],true),rightOpened=storageEnclosureParts(model,[0,0,90,90],true);
const leftOpenDepth=maxAxis([...leftOpened.doors,...leftOpened.hardware].filter(p=>['red','yellow'].includes(p.group)),2);
const rightOpenDepth=maxAxis([...rightOpened.doors,...rightOpened.hardware].filter(p=>p.group?.startsWith('right-')),0);
const d=model.dimensions,LD=d.leftDepth,RD=d.rightDepth;
const levels=[398,596,824,...model.leftStorage.layers.map(l=>l.boardTop)];
function drawings(){
  const sc=.29,base=870,Y=h=>base-h*sc,lx=x=>95+x*sc,rz=z=>700+z*sc;
  let s=tx(600,35,'无背板 · 左梁内净深360 / 右300 · 总高2350',22)+tx(600,66,'后侧完全开放；30×30主架，总深左420 / 右360；转角18厚纵隔板保留。单位mm',13);
  s+=tx(300,107,'左上：'+model.leftStorage.layers.map(l=>l.netHeight).join(' / ')+' / 余'+model.leftStorage.reserveHeight,13)+tx(925,107,'右：'+model.rightStorage.layers.map(l=>l.netHeight).join(' / ')+' / 余'+model.rightStorage.reserveHeight,12);
  s+=rect(lx(0),Y(d.height),d.left*sc,d.height*sc,'#edf3f6','#b1c2cc')+rect(lx(0),Y(2320),RD*sc,2290*sc,'#e1edf2');
  s+=rect(rz(0),Y(d.height),d.right*sc,d.height*sc,'#edf3f6','#b1c2cc')+rect(rz(0),Y(2320),LD*sc,2290*sc,'#e1edf2');
  const leftAll=[shoeZone.ground,shoeZone.middle,shoeZone.upper,...model.leftStorage.layers,{floor:model.leftStorage.reserveFloor,ceiling:2320,netHeight:model.leftStorage.reserveHeight,label:'顶格余高'}];
  for(const[i,l]of leftAll.entries()){
    s+=rect(lx(RD),Y(l.ceiling),model.leftStorage.clearWidth*sc,l.netHeight*sc,i===0?'#fff1d9':i<3?'#e7f4f7':'#fff');
    s+=tx(lx((RD+d.left-30)/2),Y(i===0?315:(l.floor+l.ceiling)/2)+4,(i===0?'两凳并排':l.label)+' · 净高'+l.netHeight,12);
    s+=dim([lx(1450),Y(l.floor)],[lx(1450),Y(l.ceiling)],String(l.netHeight),[15,3]);
  }
  for(const top of levels)s+=rect(lx(RD),Y(top),(d.left-RD)*sc,18*sc,'#c8bba0')+rect(lx(RD),Y(top-18),(d.left-RD)*sc,30*sc);
  s+=rect(lx(965),Y(270),270*sc,270*sc,'#ffda26')+tx(lx(1100),Y(135)+10,'?',32,'#fff9df');
  s+='<ellipse cx="'+lx(660)+'" cy="'+Y(70)+'" rx="'+110*sc+'" ry="'+70*sc+'" fill="#fff1d8"/><ellipse cx="'+lx(660)+'" cy="'+Y(165)+'" rx="'+165*sc+'" ry="'+95*sc+'" fill="#d9342e"/>';
  s+=line([lx(RD),Y(827)],[lx(d.left-30),Y(827)],'#b77c30','5 4')+tx(lx((RD+d.left-30)/2),Y(827)-8,'左门底827 / 上柜板面824',12,'#956725');
  const rightAll=[...model.rightStorage.layers,{label:'顶格余高',floor:model.rightStorage.reserveFloor,ceiling:2320,netHeight:model.rightStorage.reserveHeight}];
  s+=rect(rz(0),Y(48),d.right*sc,18*sc,'#c8bba0')+rect(rz(0),Y(30),d.right*sc,30*sc)+rect(lx(0),Y(30),RD*sc,30*sc);
  for(const l of rightAll){
    s+=rect(rz(LD),Y(l.ceiling),model.rightStorage.clearWidth*sc,l.netHeight*sc,'#fff')+tx(rz((LD+d.right-30)/2),Y((l.floor+l.ceiling)/2)+4,l.label+' · 净高'+l.netHeight,12)+dim([rz(1410),Y(l.floor)],[rz(1410),Y(l.ceiling)],String(l.netHeight),[15,3]);
    if(l.boardTop)s+=rect(rz(0),Y(l.boardTop),d.right*sc,18*sc,'#c8bba0')+rect(rz(0),Y(l.boardTop-18),d.right*sc,30*sc);
  }
  for(const p of divider.segments)s+=rect(rz(divider.zMin),Y(p.top),divider.depth*sc,p.height*sc,'#d0c1a6');
  for(const[x,w,middle]of [[lx(0),d.left*sc,lx(RD-30)],[rz(0),d.right*sc,rz(LD-30)]]){
    s+=rect(x,Y(d.height),w,30*sc)+rect(x,Y(d.height),30*sc,d.height*sc)+rect(x+w-30*sc,Y(d.height),30*sc,d.height*sc)+rect(middle,Y(d.height),30*sc,d.height*sc);
  }
  s+=dim([lx(0),150],[lx(d.left),150],'总长1380')+dim([rz(0),150],[rz(d.right),150],'总长1350');
  s+=dim([lx(RD),900],[lx(d.left-30),900],'左开口净宽'+model.leftStorage.clearWidth,[0,20])+dim([rz(LD),900],[rz(d.right-30),900],'右开口净宽'+model.rightStorage.clearWidth,[0,20]);
  s+=line([50,Y(d.height)],[50,Y(0)])+'<text transform="translate(37,510) rotate(-90)" text-anchor="middle" font-size="14" fill="#486878">总高2350 · 主架30×30 / 层板18</text>';
  s+=tx(300,958,'左下350 / 150 / 180保持；左上共7格（含余格）',13)+tx(925,958,'右柜共9格（含余格），门底33 / 顶2317',13);
  s+=tx(600,1000,'交集区域归右柜 · 纵向隔板从下到上封隔，左右不贯通',18);
  const plan=q=>[490-q[0]*.25,1050+q[1]*.25];
  s+='<polygon points="'+model.footprint.map(p=>plan(p).join(',')).join(' ')+'" fill="#dcebf1" stroke="#81a5b6"/>';
  s+='<polygon points="'+[[divider.xMin,divider.zMin],[divider.xMax,divider.zMin],[divider.xMax,divider.zMax],[divider.xMin,divider.zMax]].map(p=>plan(p).join(',')).join(' ')+'" fill="#bdab89" stroke="#9d8867"/>'+tx(280,1110,'左总深420',14)+tx(435,1260,'右总深360',14);
  for(const p of model.posts){const q=plan([p.x+15,p.z-15]);s+=rect(q[0],q[1],7.5,7.5,'#839caa');}
  s+=dim([145,1030],[490,1030],'左1380')+dim([525,1050],[525,1387.5],'右1350',[25,0])+tx(295,1430,'转角360×420归右柜；界线处18厚纵向隔板',12);
  const dx=z=>705+z*.5;
  const depthDiagram=(y,total,net,label)=>tx(890,y,label,16)+rect(dx(0),y+20,total*.5,35,'#dcebf1','#81a5b6')+rect(dx(0),y+20,15,35)+rect(dx(total-30),y+20,15,35)+rect(dx(total+2),y+20,10,35,'#b9cad5')+dim([dx(30),y+79],[dx(total-30),y+79],'有效净深'+net)+tx(890,y+105,'柜体总深'+total+' / 门框'+(total+22)+' / 铰链局部'+(total+25),13);
  s+=depthDiagram(1057,LD,d.leftClearDepth,'左：Z30—390，梁内净深360');
  s+=depthDiagram(1210,RD,d.rightClearDepth,'右：X30—330，梁内净深300')+rect(dx(RD-divider.thickness),1230,divider.thickness*.5,35,'#c4b493');
  s+=tx(890,1355,'左门开90°：深'+fmt(leftOpenDepth)+' / 前伸'+fmt(leftOpenDepth-LD),13)+tx(890,1385,'右门开90°：深'+fmt(rightOpenDepth)+' / 前伸'+fmt(rightOpenDepth-RD),13);
  const notes=[
    '纵向隔板使左右完整分隔；转角交集仅从右柜取用。净高保持左顶198、右顶328。',
    '左上闭合：'+model.leftStorage.baseFloor+' + '+model.leftStorage.layers.reduce((s,l)=>s+l.netHeight,0)+' + '+model.leftStorage.layers.length+'×48 + 余'+model.leftStorage.reserveHeight+' = 2320（顶梁底）。',
    '右柜闭合：'+model.rightStorage.baseFloor+' + '+model.rightStorage.layers.reduce((s,l)=>s+l.netHeight,0)+' + '+model.rightStorage.layers.length+'×48 + 余'+model.rightStorage.reserveHeight+' = 2320。',
    '左上板面：824 / '+model.leftStorage.layers.map(l=>l.boardTop).join(' / ')+'。',
    '右柜板面：48 / '+model.rightStorage.layers.map(l=>l.boardTop).join(' / ')+'。',
    '左开口X360—1350=990，右开口Z420—1320=900；转角内梁内宽300、深360另计。',
    '无背板：左420−30−30=360，右360−30−30=300，均量前后主型材内边；不含入槽埋边。',
    '板件外包：左1020×420×18、右360×1350×18，按柱位分片开缺口；梁内板面分别990×360、300×1290。',
    '左下板面398 / 596 / 824；净高350 / 150 / 180。凳子直接落地，无底板或入口门槛。',
    '主架30×30；门框20×20、门芯6。模型'+records.length+'根型材：固定架'+model.members.length+'根，四门框'+doorMembers.length+'根。',
    '隔板9片：深360×净高(300/100/140/180/200/200/220/220/328)×厚18，位置X342—360。',
    '层板18由横梁支承；端封/顶封/门芯6，入槽板厚及槽宽/槽深待选型，板件总深≠可用净深。'
  ];
  notes.forEach((t,i)=>s+=tx(600,1480+i*31,t,12.5));
  s+=tx(600,1900,'“怪兽小屋”侧挂灯箱与当前前柱对齐',20);
  s+=rect(100,1930,320,140,'#7c8d96')+rect(103,1933,314,134,'#fff5d9')+tx(260,2015,'怪 兽 小 屋',29,'#34464a');
  const signNotes=['外壳320×140×60；下沿2000 / 上沿2140','灯箱Z405—725：相对柜前420伸305；侧伸70','局部总深725；全局外廓X1450 / Z1350 / H2350','两根3030短臂L64，6厚连接板，壳3 / 透光板4暂定','固定立柱承接；重量、防转与供电按实物核定'];
  signNotes.forEach((t,i)=>s+=tx(870,1930+i*31,t,13));
  s+=tx(600,2150,'当前发布方案：无背板，左净深360/总深420，右300/360；入槽薄板先按基准截面核定，连接五金及加工余量待核，已发布',13);
  return svg(1200,2190,'左净深360右300，无背板2350高及全部型材尺寸',s);
}
function memberMap(){
  const rows=Math.ceil(records.length/2),height=Math.max(1450,rows*25+180),project=q=>[660+(-q[0]*.58+q[2]*.58)*.36,height*.86-(q[1]*.68+q[0]*.14+q[2]*.14)*.36];
  let s=tx(660,36,'全部 '+records.length+' 根型材 · 包含四扇门框',21);
  for(const r of records)s+=line(project(r.start),project(r.end),'#adc0cc');
  records.map(r=>({r,p:project(r.center)})).sort((a,b)=>a.p[1]-b.p[1]).forEach(({r,p},i)=>{const left=i%2===0,x=left?150:1170,y=100+Math.floor(i/2)*25,turn=left?280:1040;s+='<polyline points="'+p[0]+','+p[1]+' '+turn+','+(y-4)+' '+(x+(left?110:-110))+','+(y-4)+'" fill="none" stroke="#beced8" stroke-width=".5"/>'+tx(x,y,r.number+' '+r.section.join('×')+' L'+fmt(r.length),10);});
  return svg(1320,height,'全部型材编号索引',s+tx(660,height-24,'门框按闭合状态列端点；编号与表格、CSV一致',12));
}
const chart=drawings(),map=memberMap(),stock=new Map();for(const r of records){const k=r.section.slice().sort((a,b)=>a-b).join('×')+' / '+fmt(r.length);stock.set(k,(stock.get(k)||0)+1);}
if(target){
  target.innerHTML='<h2>无背板 · 梁内净深360 / 300 · 总深420 / 360</h2><div class="storage-downloads"><button id="storage-svg">下载尺寸 SVG</button><button id="storage-map-svg">下载编号 SVG</button><button id="storage-csv">下载逐根 CSV</button></div><div class="storage-chart">'+chart+'</div><details><summary>'+records.length+' 根型材 · 分组汇总与逐根编号</summary><p class="storage-stock">'+Array.from(stock,([k,v])=>k+' mm × '+v+' 根').join('　·　')+'</p><div class="storage-chart">'+map+'</div><div class="storage-table"><table><thead><tr><th>编号</th><th>安装位置 / 模型ID</th><th>截面宽×高</th><th>模型几何长</th><th>数量</th><th>端点 X,Y,Z</th></tr></thead><tbody>'+records.map(r=>'<tr><td>'+r.number+'</td><td>'+r.id+'</td><td>'+r.section.join('×')+'</td><td>'+fmt(r.length)+'</td><td>1</td><td>'+r.start.map(fmt).join(',')+' → '+r.end.map(fmt).join(',')+'</td></tr>').join('')+'</tbody></table></div><p>门板、层板、铰链、连接片与螺栓另列；槽口、壁厚、孔位、切角及加工余量待核。模型长度不可直接下料。</p></details>';
  target.querySelector('details').insertAdjacentHTML('beforebegin','<article class="panel-mounting-notes"><h3>无背板与入槽尺寸口径</h3><p>左、转角及右侧背板全部取消，右侧白色洞洞背板和安装垫块也已移除。蓝色端封板、顶封板、水平层板和转角纵隔板保留。</p><p>可用净深量前后30×30型材内边：左Z30—390=360，右X30—330=300。总深分别420和360；门框与铰链前包另计。板件伸入槽内的部分不计为露出的可用净深。</p><p>水平层板和纵隔板18 mm；端封板、顶封板、门芯6 mm为当前模型板厚。水平层板用横梁支承。入槽核定页采用HFS6-3030基准：槽口8、槽深9、板5、夹条3，每端间隙1。主三维图仍保留18 mm托梁层板；它还未转换为入槽薄板。不能将板件总深当成型材内边露出的净深。</p></article>');
  target.querySelector('details').insertAdjacentHTML('beforebegin','<details class="partition-parts"><summary>纵向隔板 · 18厚 · 9片组成同一封隔面</summary><p>隔板安装在X342—360，柱间深Z30—390=360。9片板分别嵌于右柜层间，B/E柱、BE横梁及层板边缘接续封住从地面0到顶2350的交界面。交集归右，不能从左柜侧取。尺寸为深×高×厚，安装间隙和固定五金待核。</p><div class="storage-table"><table><thead><tr><th>板件编号</th><th>离地底—顶</th><th>深×高×厚 mm</th><th>数量</th></tr></thead><tbody>'+divider.segments.map(p=>'<tr><td>'+p.id+'</td><td>'+p.bottom+'—'+p.top+'</td><td>'+p.depth+'×'+p.height+'×'+p.thickness+'</td><td>1</td></tr>').join('')+'</tbody></table></div></details>');
  const save=(name,content,type)=>{const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  document.getElementById('storage-svg').onclick=()=>save('鞋柜-无背板-总深420与360-尺寸.svg',chart,'image/svg+xml');
  document.getElementById('storage-map-svg').onclick=()=>save('鞋柜-无背板-总深420与360-型材编号.svg',map,'image/svg+xml');
  document.getElementById('storage-csv').onclick=()=>{const rows=[['编号','安装位置','截面宽mm','截面高mm','模型几何长mm','数量','起点X','起点Y','起点Z','终点X','终点Y','终点Z','备注'],...records.map(r=>[r.number,r.id,...r.section,r.length,1,...r.start,...r.end,'闭合模型端点；壁厚/槽宽/加工/孔位待核；非批准下料尺寸'])];save('鞋柜-无背板-总深420与360-逐根型材.csv','\uFEFF'+rows.map(a=>a.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n'),'text/csv;charset=utf-8');};
  target._storageReport={records,model,chart,map,doors:storageEnclosure.groups,leftOpenDepth,rightOpenDepth};
}
function report(){if(parent!==window)parent.postMessage({type:'zhuji-design-size',height:Math.ceil(document.body.getBoundingClientRect().bottom+scrollY)+8},location.origin);}
new ResizeObserver(report).observe(document.body);addEventListener('load',report);report();
