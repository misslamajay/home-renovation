import {createFoundation,stability,CASTER_SOURCE} from './foundation-geometry.js';

const $=s=>document.querySelector(s),canvas=$('#frame-canvas'),ctx=canvas.getContext('2d');
const state={depth:1000,parked:true,tv:false,dims:true,ids:false,yaw:.37,pitch:.18,zoom:1,view:'perspective'};
let model=createFoundation(),faces=[],width=0,height=0,pending=false,svg='';
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>mul(a,1/(Math.hypot(...a)||1));
const colors={metal:[166,183,193],steel:[102,123,137],ivory:[226,224,208],orange:[233,125,42],rubber:[43,55,62],screen:[64,112,142],cap:[76,98,112]};
const fmt=v=>Number.isInteger(v)?String(v):v.toFixed(1),mid=p=>mul(add(p.start,p.end),.5);
function face(points,normal,material='metal',options={}){faces.push({points,normal,material,...options});}
function prism(a,b,section,material='metal',id){
  const direction=norm(sub(b,a));let u,v;
  if(Math.abs(direction[0])>.999){u=[0,1,0];v=[0,0,1];}
  else if(Math.abs(direction[1])>.999){u=[1,0,0];v=[0,0,1];}
  else if(Math.abs(direction[2])>.999){u=[1,0,0];v=[0,1,0];}
  else{u=norm(cross(direction,[0,0,1]));v=norm(cross(direction,u));}
  const c=[[-1,-1],[1,-1],[1,1],[-1,1]],rings=[a,b].map(p=>c.map(([x,y])=>add(add(p,mul(u,x*section[0]/2)),mul(v,y*section[1]/2))));
  face(rings[0],mul(direction,-1),material,{id});face(rings[1],direction,material,{id});
  for(let i=0;i<4;i++){
    const j=(i+1)%4,n=norm(add(mul(u,[0,1,0,-1][i]),mul(v,[-1,0,1,0][i])));
    const options={id};
    if(material==='metal'){
      const centerDir=norm(add(mul(u,(c[i][0]+c[j][0])/2),mul(v,(c[i][1]+c[j][1])/2)));
      options.slot=[add(a,mul(centerDir,(Math.abs(dot(centerDir,u))>.5?section[0]:section[1])/2+.1)),add(b,mul(centerDir,(Math.abs(dot(centerDir,u))>.5?section[0]:section[1])/2+.1))];
    }
    face([rings[0][i],rings[0][j],rings[1][j],rings[1][i]],n,material,options);
  }
}
function box(x,y,z,w,h,d,mat){prism([x,y-h/2,z],[x,y+h/2,z],[w,d],mat);}
function cylinder(x,y,z,r,length,axis,mat){
  const center=[x,y,z],u=(axis+1)%3,v=(axis+2)%3,rings=[];
  for(const s of [-1,1]){const ring=[];for(let i=0;i<16;i++){const p=center.slice(),t=i*Math.PI/8;p[axis]+=s*length/2;p[u]+=Math.cos(t)*r;p[v]+=Math.sin(t)*r;ring.push(p);}rings.push(ring);const n=[0,0,0];n[axis]=s;face(ring,n,mat);}
  for(let i=0;i<16;i++){const j=(i+1)%16,n=[0,0,0],t=(i+.5)*Math.PI/8;n[u]=Math.cos(t);n[v]=Math.sin(t);face([rings[0][i],rings[0][j],rings[1][j],rings[1][i]],n,mat);}
}
function plateYZ(x,points,thickness=8){
  const a=points.map(([y,z])=>[x-thickness/2,y,z]),b=points.map(([y,z])=>[x+thickness/2,y,z]);face(a,[-1,0,0],'steel');face(b,[1,0,0],'steel');
  for(let i=0;i<a.length;i++){const j=(i+1)%a.length;face([a[i],a[j],b[j],b[i]],norm(cross(sub(a[j],a[i]),[1,0,0])),'steel');}
}
function rebuild(){
  faces=[];const lift=state.parked?5:0,p=model.parameters;
  for(const m of model.profiles)prism(add(m.start,[0,lift,0]),add(m.end,[0,lift,0]),m.section,'metal',m.id);
  for(const m of model.hardware){prism(add(m.start,[0,lift,0]),add(m.end,[0,lift,0]),m.section,'steel',m.id);for(const q of [m.start,m.end]){box(q[0],q[1]+lift,-44,60,75,8,'steel');cylinder(q[0],q[1]+lift,-53,5,10,2,'cap');}}
  for(const m of model.profiles.filter(m=>m.group==='横向连接'))for(const sign of [-1,1]){
    const y=m.start[1]+lift-40;
    box(sign*626,y-20,0,8,40,40,'steel');box(sign*606,y-4,0,40,8,40,'steel');
    cylinder(sign*619,y-20,0,5,7,0,'cap');cylinder(sign*606,y-11,0,5,6,1,'cap');
  }
  for(const sign of [-1,1])for(const end of [-1,1]){
    box(sign*1160,194+lift,end*(p.depth/2-40),80,6,80,'steel');
    for(const [xx,zz]of [[1180,p.depth/2-60],[1140,p.depth/2-20]])cylinder(sign*xx,200+lift,end*zz,5,6,1,'cap');
  }
  for(const x of [-650,650]){
    for(const side of [-1,1]){
      plateYZ(x+side*26,[[151+lift,-160],[151+lift,160],[400+lift,40],[400+lift,-40]],8);
      for(const [yy,zz]of [[166,-100],[166,100],[280,0],[355,0]])cylinder(x+side*33,yy+lift,zz,5.5,6,0,'cap');
    }
  }
  for(const j of model.joints){const [x,y,z]=j.point;for(const sign of [-1,1]){box(x+sign*24,y+lift,z,6,80,86,'steel');cylinder(x+sign*29,y+lift,z,5.5,7,0,'cap');}if(j.name.includes('底端'))box(x,206+lift,z,40,30,90,'steel');}
  for(const wheel of model.wheels){
    const {x,z,angle}=wheel,start=faces.length;
    box(x,107+lift,z,160,8,160,'steel');box(x,100.5+lift,z,90,5,90,'metal');
    cylinder(x,86+lift,z,32,24,1,'ivory');box(x,63+lift,z,70,50,65,'ivory');
    cylinder(x,31.5+lift,z+46,31.5,28,0,'rubber');cylinder(x,31.5+lift,z+46,16,30,0,'metal');
    for(const side of [-1,1])box(x+side*18,49+lift,z+40,6,42,41,'ivory');
    cylinder(x,27+lift,z,10,34,1,'metal');
    box(x,51+lift,z-34,38,7,18,'orange');
    const footBottom=state.parked?0:8;cylinder(x,footBottom+5,z,27,10,1,'rubber');
    for(const dx of [-35,35])for(const dz of [-35,35])cylinder(x+dx,96+lift,z+dz,5.5,5,1,'cap');
    for(const dx of [-30,30])for(const dz of [-65,65])cylinder(x+dx,101+lift,z+dz,6,4,1,'cap');
    // Simplified castor body. Exact housing and pad CAD are pending supplier confirmation.
    // Foot is centered on the provisional support datum used in the comparison.
    const cs=Math.cos(angle),sn=Math.sin(angle);
    for(let i=start;i<faces.length;i++){const f=faces[i];if(i<start+12)continue;f.points=f.points.map(q=>{const xx=q[0]-x,zz=q[2]-z;return[x+xx*cs+zz*sn,q[1],z-xx*sn+zz*cs];});f.normal=[f.normal[0]*cs+f.normal[2]*sn,f.normal[1],-f.normal[0]*sn+f.normal[2]*cs];}
  }
  // VESA bars are placeholders, their hole positions depend on the actual television.
  for(const x of [-300,300]){
    box(x,1320.5+lift,52,44,560,12,'steel');
    for(const y of [1100,1500])box(x,y+lift,46,44,38,12,'steel');
  }
}
function project(q){
  const target=state.view==='caster'?[1100,120,model.parameters.wheelZ]:[0,940,0],p=sub(q,target),cy=Math.cos(state.yaw),sy=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch),scale=Math.min((width-55)/2950,(height-70)/2180)*state.zoom;
  return [width/2+(cy*p[0]-sy*p[2])*scale,height*.49-(-sy*sp*p[0]+cp*p[1]-cy*sp*p[2])*scale,sy*cp*p[0]+sp*p[1]+cy*cp*p[2]];
}
function path(ps){ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();}
function line(a,b,color='#899eac',dash=[]){const p=project(a),q=project(b);ctx.beginPath();ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.setLineDash([]);return[p,q];}
function label(text,q,color='#607d90',dy=0){const p=project(q);ctx.font='12px -apple-system,"PingFang SC",sans-serif';const m=ctx.measureText(text).width,x=Math.max(m/2+8,Math.min(width-m/2-8,p[0])),y=Math.max(16,Math.min(height-16,p[1]+dy));ctx.fillStyle='rgba(255,255,255,.93)';ctx.fillRect(x-m/2-5,y-10,m+10,20);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y);}
function dimension(a,b,text,dy=0){const [p,q]=line(a,b);for(const t of [p,q]){ctx.beginPath();ctx.moveTo(t[0]-4,t[1]+4);ctx.lineTo(t[0]+4,t[1]-4);ctx.stroke();}label(text,mul(add(a,b),.5),'#526e83',dy);}
function draw(){
  pending=false;if(!width||!height)return;ctx.clearRect(0,0,width,height);const p=model.parameters,lift=state.parked?5:0;
  path([[-1250,0,-p.depth/2-60],[1250,0,-p.depth/2-60],[1250,0,p.depth/2+60],[-1250,0,p.depth/2+60]].map(project));ctx.fillStyle='#eaf0f4';ctx.globalAlpha=.6;ctx.fill();ctx.globalAlpha=1;
  const view=[Math.sin(state.yaw)*Math.cos(state.pitch),Math.sin(state.pitch),Math.cos(state.yaw)*Math.cos(state.pitch)];
  const visible=faces.filter(f=>dot(f.normal,view)>.001).map(f=>({...f,depth:f.points.reduce((s,q)=>s+project(q)[2],0)/f.points.length})).sort((a,b)=>a.depth-b.depth);
  for(const f of visible){const rgb=colors[f.material],light=.74+Math.max(0,dot(f.normal,[-.35,.75,.54]))*.3;path(f.points.map(project));ctx.fillStyle='rgb('+rgb.map(v=>Math.round(v*light)).join(',')+')';ctx.fill();ctx.lineWidth=.6;ctx.strokeStyle='rgba(52,77,93,.35)';ctx.stroke();if(f.slot){line(f.slot[0],f.slot[1],'rgba(56,78,93,.5)');}}
  if(state.tv){
    const x=p.tvWidth/2,cy=p.tvCenter[1]+lift,hh=p.tvHeight/2,z=p.tvCenter[2]+p.tvDepth/2,ps=[[-x,cy-hh,z],[x,cy-hh,z],[x,cy+hh,z],[-x,cy+hh,z]].map(project);path(ps);ctx.fillStyle='rgba(55,113,148,.11)';ctx.fill();ctx.strokeStyle='#7eacbf';ctx.setLineDash([6,5]);ctx.stroke();ctx.setLineDash([]);label('85 寸电视占位 · 约 39 kg',[0,cy+hh-70,z]);
  }
  if(state.dims&&state.view!=='caster'){
    dimension([-1200,1970,0],[1200,1970,0],'底座外宽 2400');
    if(state.view==='side')dimension([0,0,p.depth/2+60],[0,state.parked?1880:1875,p.depth/2+60],state.parked?'停放总高 1880':'移动总高 1875');
    else dimension([-1300,0,0],[-1300,state.parked?1880:1875,0],state.parked?'1880':'1875');
    dimension([1260,0,-p.depth/2],[1260,0,p.depth/2],'外深 '+p.depth,15);
    if(state.view!=='front'&&state.view!=='rear'){
      const z=p.wheelZ,x=p.wheelX;for(const [a,b]of [[[x,1,-z],[x,1,z]],[[-x,1,z],[x,1,z]],[[-x,1,-z],[x,1,-z]],[[-x,1,-z],[-x,1,z]]])line(a,b,'#c18a43',[5,4]);
      label('支撑跨度 '+model.bounds.supportDepth,[1100,8,0],'#a57638',-15);
    }
  }
  if(state.view==='caster'){
    const x=1100,z=p.wheelZ;label('160 × 160 × 8 钢转接板',[x,125+lift,z+100]);label('GD-80-F-HUP · 安装高 103',[x,55+lift,z-130]);label(state.parked?'脚垫落地 / 轮离地约 5':'脚垫收回 / 轮子接地',[x,0,z+95],'#a27435',20);
  }
  if(state.ids&&state.view!=='caster')for(const m of model.profiles)label(m.id,add(mid(m),[0,lift,0]),'#486e85');
}
function requestDraw(){if(!pending){pending=true;requestAnimationFrame(draw);}}
function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);requestDraw();}
function makeSVG(){
  const p=model.parameters,sc=.19,front=(q)=>[285+q[0]*sc,470-q[1]*sc],side=q=>[865+q[2]*sc,470-q[1]*sc],plan=q=>[285+q[0]*sc,690+q[2]*sc];
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
  const text=(x,y,t,size=12,color='#536f83',anchor='middle')=>`<text x="${x}" y="${y}" font-family="Arial,PingFang SC,sans-serif" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(t)}</text>`;
  const ln=(a,b,color='#9baeb9',w=1)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${w}"/>`;
  const dm=(a,b,t,offset=[0,-7])=>ln(a,b,'#8097a7')+ln([a[0]-4,a[1]+4],[a[0]+4,a[1]-4])+ln([b[0]-4,b[1]+4],[b[0]+4,b[1]-4])+text((a[0]+b[0])/2+offset[0],(a[1]+b[1])/2+offset[1],t);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 1450" role="img" aria-label="电视架总外廓、支撑尺寸、底座与全部20根型材编号图"><rect width="1120" height="1450" fill="#fafcfd"/>`;
  s+=text(560,30,'福马轮基础框架 · '+p.width+' × '+p.depth+' × 1880 mm',19,'#294d64');
  for(const [map,title,tx]of [[front,'正视 · 脚垫落地',285],[side,'侧视 · 立柱前后刚性斜撑',865]]){
    s+=text(tx,64,title,13);
    for(const m of model.profiles){const a=map(add(m.start,[0,5,0])),b=map(add(m.end,[0,5,0]));s+=ln(a,b,'#a5b8c3',m.group==='底座'?12:7);}
    for(const m of model.hardware)s+=ln(map(add(m.start,[0,5,0])),map(add(m.end,[0,5,0])),'#718896',2);
    for(const w of model.wheels){const q=map([w.x,55,w.z]);s+=`<rect x="${q[0]-6}" y="${q[1]-7}" width="12" height="14" rx="3" fill="#e8dfc6"/>`;s+=ln(map([w.x,0,w.z]),map([w.x,10,w.z]),'#566d7a',10);}
  }
  s+=dm(front([-1200,2025,0]),front([1200,2025,0]),'外宽 2400');s+=dm([27,470],[27,112.8],'1880',[0,0]);
  for(const opening of model.clear.openings){const a=front([800,opening.floor+5,0]),b=front([800,opening.ceiling+5,0]);s+=dm(a,b,String(opening.height),[25,3]);}
  s+=dm(side([0,-140,-p.depth/2]),side([0,-140,p.depth/2]),'底座总深 '+p.depth,[0,20]);
  s+=dm(side([0,-300,-p.wheelZ]),side([0,-300,p.wheelZ]),'脚垫基准跨度 '+model.bounds.supportDepth,[0,20]);
  s+=text(285,570,'底座俯视 · 净空与轮座双承梁',13);s+=text(865,570,'轮座连接 · 双面分工',13);
  for(const m of model.profiles.filter(v=>v.group==='底座'))s+=ln(plan(m.start),plan(m.end),'#a5b8c3',8);
  for(const w of model.wheels){const q=plan([w.x,0,w.z]);s+=`<rect x="${q[0]-15.2}" y="${q[1]-15.2}" width="30.4" height="30.4" fill="#f5e5cf" fill-opacity=".6" stroke="#ba9259"/>`+text(q[0],q[1]+4,w.id,9,'#9c783c');}
  s+=dm(plan([-630,0,0]),plan([630,0,0]),'中部梁内净宽 1260');s+=dm([550,690-(p.depth-80)*sc/2],[550,690+(p.depth-80)*sc/2],'梁内净深 '+(p.depth-80),[0,0]);
  const wheelX=865,wheelY=694;
  s+=`<rect x="${wheelX-80}" y="${wheelY-80}" width="160" height="160" fill="#dce7ee" stroke="#627f93"/><rect x="${wheelX-45}" y="${wheelY-45}" width="90" height="90" fill="#f6f0df" stroke="#ad9b72"/>`;
  for(const dx of [-35,35])for(const dz of [-35,35])s+=`<circle cx="${wheelX+dx}" cy="${wheelY+dz}" r="4.5" fill="#758e9e"/>`;
  for(const dx of [-30,30])for(const dz of [-65,65])s+=`<circle cx="${wheelX+dx}" cy="${wheelY+dz}" r="4" fill="#d68234"/>`;
  s+=dm([785,800],[945,800],'钢板 160 × 160 × 8',[0,18]);s+=text(865,841,'灰点：原厂轮板 70 × 70 / Ø9',11);s+=text(865,863,'橙点：型材侧 60 × 130 / M8 暂定',11);s+=text(285,843,'支撑宽 2200 · 两端轮座共 4 处',12);
  s+=text(560,932,'全部型材编号 · 与逐根清单一致',16,'#294d64');
  const iso=q=>[560+(q[0]*.89-q[2]*.45)*.18,1360-(q[1]*.96-q[0]*.10-q[2]*.20)*.18];
  for(const m of model.profiles)s+=ln(iso(m.start),iso(m.end),'#b0c1cc',m.group==='底座'?7:5);
  const ordered=model.profiles.map(m=>({m,q:iso(mid(m))})).sort((a,b)=>a.q[1]-b.q[1]);
  for(const [n,item]of ordered.entries()){
    const left=n%2===0,row=Math.floor(n/2),x=left?110:1010,y=995+row*40,turn=left?260:860,q=item.q;
    s+=`<polyline points="${q[0]},${q[1]} ${turn},${y-4} ${x+(left?12:-12)},${y-4}" fill="none" stroke="#b1c3cd" stroke-width=".8"/><circle cx="${q[0]}" cy="${q[1]}" r="2" fill="#708c9f"/>`;
    s+=text(x,y,item.m.id+' · '+item.m.section.join('×')+' · '+fmt(item.m.length),11,'#44647a');
  }
  s+=text(560,1418,'几何长度 / 非批准下料单 · 轮座外形及脚垫基准待原厂 CAD 复核',11);return s+'</svg>';
}
function updateReport(){
  const p=model.parameters,b=model.bounds;$('#overall-size').textContent='2400 × '+p.depth+' × '+(state.parked?1880:1875);$('#base-summary').textContent='2400 × '+p.depth+' mm';$('#support-summary').textContent='2200 × '+b.supportDepth+' mm';
  $('#size-state').textContent='mm · '+(state.parked?'调平停放状态':'轮子接地移动状态');
  $('#depth-note').textContent=p.depth===1000?'候选方案，比原底座多占 200 mm':'沿用原占地，抗倾覆余量较小';
  $('#frame-status').textContent=state.parked?'停放：四只脚垫落地，轮子离地约 5 mm':'移动：脚垫收回，四只轮子接地';
  svg=makeSVG();$('#dimension-drawing').innerHTML=svg;
  $('#dimension-notes').innerHTML=[['总外廓','宽 2400 × 深 '+p.depth+'；移动高 1875，当前脚垫伸出量下停放高 1880。满行程 15 时总高上限约 1890，须核原厂脚垫压缩量。'],['活动范围','原厂偏距 46 + 轮半径 31.5 = 77.5；模型按半径 90 预留整机回转空间（壳体精确包络待 CAD）。四轮均在底座外廓内，旋钮操作需伸手空间。'],['梁内净空','中部底座梁内净宽 1260（立柱下承梁间）；梁内净深 '+(p.depth-80)+'（总深减前后两根 40 厚底梁）。边框内总宽 2320。'],['净空的边界','本阶段无层板、门及外壳。梁间理论开口净高由下到上 '+model.clear.openings.map(o=>o.height).join(' / ')+'；已扣底梁和横梁，未扣将来板厚。VESA杆、交叉撑与侧面斜撑占用局部空间，不作为整区设备净高。梁内净深也不等于成品收纳有效净深。'],['立柱与挂梁','立柱 40 × 80，几何长 1684；两柱内净宽 1260。4 根横梁各 1260，截面 80（竖向）×40。'],['板与连接','每处轮座钢板 160 ×160 ×8，4 块；原厂轮顶板 90×90。轮侧暂按 M8 螺纹连接至钢板、型材侧四点 M8；螺纹强度、安装孔和沉头形式待核。'],['电视占位','沿用 1890×1101×53、39 kg；停车底边 775、顶边 1876，外廓在框架范围内。VESA 暂以 600×400 示意，实际孔位与挂架待核。'],['轮座支撑基准','脚垫中心暂按安装轴线作模型比较基准，支撑跨度 2200×'+b.supportDepth+'；渲染的壳体、轮叉和脚垫直径仅为示意，须以最终 CAD 修正。']].map(([a,b])=>'<p><b>'+a+'：</b>'+b+'</p>').join('');
  $('#profile-count').textContent=model.profiles.length+' 根型材';
  $('#profile-rows').innerHTML=model.profiles.map(m=>'<tr><td>'+m.id+'</td><td>'+m.name+'</td><td>'+m.section.join(' × ')+'</td><td>'+fmt(m.length)+'</td><td>1</td><td>'+m.start.map(fmt).join(',')+' / '+m.end.map(fmt).join(',')+'</td></tr>').join('');
  const stock=new Map();for(const m of model.profiles){const key=m.group+' / '+m.section.join('×')+' / '+fmt(m.length);stock.set(key,(stock.get(key)||0)+1);}
  $('#stock-summary').innerHTML=Array.from(stock,([k,v])=>'<span>'+k+' mm × '+v+' 根</span>').join('　·　');
  $('#hardware-summary').textContent='另列非型材：X01 / X02 背面 30×4 钢扁撑，几何中心长各 '+fmt(model.hardware[0].length)+' mm；4 块轮座钢板、4 块立柱双面连接板、8 对斜撑耳板、4 只福马轮和连接螺栓。';
  updateStability();notifySize();
}
function updateStability(){
  const input={baseMass:Number($('#base-mass').value),push:Number($('#push-force').value),pushHeight:Number($('#push-height').value)};
  if(!['base-mass','push-force','push-height'].every(id=>$('#'+id).validity.valid)){$('#stability-result').textContent='请填写范围内的质量、推力与高度。';return;}
  const results=[800,1000].map(d=>({d,...stability(createFoundation(d),input)}));
  $('#stability-result').innerHTML='<div class="result-table"><table><thead><tr><th>底座深度</th><th>支撑跨度</th><th>恢复力矩</th><th>倾覆力矩</th><th>静态比值</th><th>示例结果</th></tr></thead><tbody>'+results.map(r=>'<tr><td>'+r.d+(r.d===state.depth?' · 当前':'')+'</td><td>'+createFoundation(r.d).bounds.supportDepth+'</td><td>'+r.restoring.toFixed(1)+' N·m</td><td>'+r.overturning.toFixed(1)+' N·m</td><td>'+r.factor.toFixed(2)+'</td><td class="'+(r.factor>=1.5?'calc-good':'calc-check')+'">'+(r.factor>=1.5?'示例达到比较目标':'需增加深度或低位质量')+'</td></tr>').join('')+'</tbody></table></div>';
  const r=results.find(v=>v.d===state.depth);$('#stability-result').insertAdjacentHTML('beforeend','<p class="calc-comment">当前方案要达到上述静态比较目标，底座低位质量至少需 '+r.requiredBaseMass.toFixed(1)+' kg（不计其他框架自重）；请用实际称重值替换示例。此处不能推导整架额定承重。</p>');
  notifySize();
}
function exportFile(name,content,mime){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
$('#download-svg').addEventListener('click',()=>exportFile('电视架-基础框架-'+state.depth+'-编号尺寸.svg',svg,'image/svg+xml'));
$('#download-csv').addEventListener('click',()=>{const row=v=>v.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(','),rows=[['编号','安装位置','组别','外截面A(mm)','外截面B(mm)','模型几何长度(mm)','数量','起点X','起点Y','起点Z','终点X','终点Y','终点Z','说明'],...model.profiles.map(m=>[m.id,m.name,m.group,...m.section,m.length.toFixed(3),1,...m.start,...m.end,'移动状态坐标；壁厚/槽宽/加工/孔位/余量待核定；非批准下料尺寸'])];exportFile('电视架-基础框架-'+state.depth+'-逐根型材.csv','\uFEFF'+rows.map(row).join('\r\n'),'text/csv;charset=utf-8');});
document.querySelectorAll('[data-depth]').forEach(b=>b.addEventListener('click',()=>{state.depth=+b.dataset.depth;model=createFoundation(state.depth);document.querySelectorAll('[data-depth]').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.depth===state.depth)));rebuild();updateReport();requestDraw();}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;const a={perspective:[.37,.18,1],front:[0,0,1],side:[Math.PI/2,0,1],rear:[Math.PI+.36,.16,1],caster:[.60,.45,4.8]}[state.view];[state.yaw,state.pitch,state.zoom]=a;document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));requestDraw();}));
for(const [id,key]of [['parked','parked'],['show-tv','tv'],['show-dims','dims'],['show-ids','ids']])$('#'+id).addEventListener('change',e=>{state[key]=e.target.checked;rebuild();if(key==='parked')updateReport();requestDraw();});
for(const id of ['base-mass','push-force','push-height'])$('#'+id).addEventListener('input',updateStability);
$('#caster-source').href=CASTER_SOURCE;
document.querySelectorAll('a[href="index.html"]').forEach(a=>a.addEventListener('click',e=>{if(parent===window)return;e.preventDefault();parent.postMessage({type:'zhuji-design-view',project:'mobile-tv-stand',view:'model'},location.origin);}));
let pointer=null;canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointer=[e.pointerId,e.clientX,e.clientY];});canvas.addEventListener('pointermove',e=>{if(!pointer||pointer[0]!==e.pointerId)return;state.yaw-=(e.clientX-pointer[1])*.007;state.pitch=Math.max(-.3,Math.min(1.0,state.pitch+(e.clientY-pointer[2])*.005));pointer=[e.pointerId,e.clientX,e.clientY];requestDraw();});for(const ev of ['pointerup','pointercancel'])canvas.addEventListener(ev,()=>pointer=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(.55,Math.min(7,state.zoom*Math.exp(-e.deltaY*.001)));requestDraw();},{passive:false});
canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();if(e.key.startsWith('Arrow')){state.yaw+=(e.key==='ArrowLeft'?.12:e.key==='ArrowRight'?-.12:0);state.pitch=Math.max(-.3,Math.min(1,state.pitch+(e.key==='ArrowUp'?.08:e.key==='ArrowDown'?-.08:0)));}else state.zoom=Math.max(.55,Math.min(7,state.zoom*(e.key==='+'?1.1:.9)));requestDraw();});
function notifySize(){requestAnimationFrame(()=>parent.postMessage({type:'zhuji-design-size',height:Math.ceil(document.documentElement.getBoundingClientRect().height+8)},location.origin));}
new ResizeObserver(resize).observe(canvas);new ResizeObserver(notifySize).observe(document.body);document.querySelector('details').addEventListener('toggle',notifySize);
window._tvFoundation={get model(){return model;},state,stability:options=>stability(model,options),rebuild,project,faces:()=>faces};
rebuild();updateReport();resize();
if(location.hash==='#dimensions'){
  document.body.classList.add('dimensions-only');
  const controls=$('.toolbar');$('#dimensions').prepend(controls);
  requestAnimationFrame(()=>$('#dimensions').scrollIntoView());
}
