// Common dimension report for mirror cabinet, TV stand, and L-shaped shoe cabinet.
import { getDimensionData } from './dimension-data.js';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const n = v => Number(Number(v).toFixed(2));
const svg = (w, h, title, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" font-family="-apple-system,BlinkMacSystemFont,PingFang SC,Microsoft YaHei,sans-serif"><title>${esc(title)}</title><rect width="${w}" height="${h}" fill="white"/>${content}</svg>`;
const text = (x, y, value, size = 16, color = '#52616d', more = '') => `<text x="${n(x)}" y="${n(y)}" text-anchor="middle" dominant-baseline="central" font-size="${size}" fill="${color}" style="font-size:${size}px;fill:${color}" ${more}>${esc(value)}</text>`;
const line = (x, y, a, b, color = '#81929e', dash = '') => `<path d="M${n(x)} ${n(y)}L${n(a)} ${n(b)}" fill="none" stroke="${color}" stroke-width="1.2"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const rect = (x, y, w, h, fill, stroke = '#9aabb6') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
function dim(x, y, a, b, value, vertical = false, color = '#52616d') {
  const mx = (x + a) / 2, my = (y + b) / 2, width = String(value).length * 8.5 + 18;
  return line(x,y,a,b,color) + line(x-5,y+5,x+5,y-5,color) + line(a-5,b+5,a+5,b-5,color) + `<g transform="translate(${n(mx)} ${n(my)})${vertical ? ' rotate(-90)' : ''}">${rect(-width/2,-13,width,26,'white','none')}${text(0,0,value,16,color)}</g>`;
}
function depthDrawing(block) {
  const width = 1180, left = 300, plot = 810, span = block.max - block.min, X = v => left + (v-block.min)/span*plot;
  let out = dim(X(block.min), 48, X(block.max), 48, `深向比较范围 ${n(span)} mm`);
  block.rows.forEach((r, i) => {
    const y = 100 + i * 66, color = /净|有效|内/.test(r.name) ? '#17667d' : '#62717c';
    out += text(146,y+13,r.name,16,color) + rect(X(r.start),y,Math.max(2,(r.end-r.start)/span*plot),26,/净|有效|内/.test(r.name)?'#dceef3':'#e6ebef') + dim(X(r.start),y+40,X(r.end),y+40,`${n(r.end-r.start)}`,false,color);
  });
  const h = 140 + block.rows.length * 66;
  out += text(left,h-35,'后 / 靠墙',14) + text(left+plot,h-35,'前 / 取放',14);
  return svg(width,h,block.title+'；单位mm；各条带为不同部件或高度，不相加',out);
}
function mirrorPlan() {
  const ox=145, oy=140, X=x=>ox+x, Z=z=>oy+z;
  let out=rect(X(0),Z(0),1000,500,'#f4f7fa');
  for(const x of [0,485,970])for(const z of [0,470])out+=rect(X(x),Z(z),30,30,'#aebdc6');
  for(const x of [30,515])out+=rect(X(x),Z(40),455,420,'#e7f1f4')+text(X(x+227.5),Z(250),'板面455 × 420',22,'#17667d');
  out+=rect(X(0),Z(550),1000,30,'#e4eef4')+text(X(500),Z(565),'镜框 30',17);
  out+=rect(X(0),Z(630),1000,30,'#e8e3d6')+text(X(500),Z(645),'洞洞板框 30',17);
  out+=dim(X(0),52,X(1000),52,'总宽1000')+dim(X(30),104,X(485),104,'净宽455')+dim(X(515),104,X(970),104,'净宽455');
  out+=dim(1245,Z(0),1245,Z(660),'闭合总深660',true)+dim(1180,Z(0),1180,Z(500),'柜体总深500',true);
  out+=dim(62,Z(40),62,Z(460),'板面有效净深420',true)+dim(112,Z(30),112,Z(470),'梁间净深440',true);
  out+=dim(X(1040),Z(500),X(1040),Z(550),'50',true)+dim(X(1040),Z(580),X(1040),Z(630),'50',true);
  out+=text(X(500),Z(720),'前方 / 取放侧 · 含两层前框，未计挂钩',20)+text(X(500),Z(765),'3030截面30×30；500−30−30=440，板面前后再各退10得420',18);
  return svg(1300,970,'镜柜底部俯视详图：总宽1000、柜体深500、闭合总深660、梁间净深440、平台有效净深420、每侧净宽455、3030型材',out);
}
function crossDrawing(a) {
  const [w,h]=a, s=Math.min(170/w,155/h), ox=160-w*s/2, oy=115-h*s/2;
  return svg(320,250,`型材外截面${w}×${h}毫米；仅标外形，槽宽壁厚待选`,rect(ox,oy,w*s,h*s,'#e3eaf0')+dim(ox,oy-20,ox+w*s,oy-20,String(w))+dim(ox-22,oy,ox-22,oy+h*s,String(h),true)+text(160,218,`${w} × ${h} mm`,18));
}
function profileDrawing(profiles, view='iso') {
  if(!profiles.length)return svg(1180,220,'没有符合条件的型材',text(590,110,'没有符合条件的杆件',20));
  const project = p => view==='front'?[p[0],-p[1]]:view==='side'?[p[2],-p[1]]:view==='top'?[p[0],p[2]]:[p[0]*.86+p[2]*.58,-p[1]+p[0]*.13-p[2]*.24];
  const points=profiles.flatMap(p=>[project(p.start),project(p.end)]),min=[0,1].map(k=>Math.min(...points.map(p=>p[k]))),max=[0,1].map(k=>Math.max(...points.map(p=>p[k])));
  const height=Math.max(890,Math.ceil(profiles.length/2)*22+160);
  const scale=Math.min(520/Math.max(100,max[0]-min[0]),(height-220)/Math.max(100,max[1]-min[1]));
  const to=p=>{const q=project(p);return[590+(q[0]-(min[0]+max[0])/2)*scale,(height-45)/2+(q[1]-(min[1]+max[1])/2)*scale];};
  const colors=['#17667d','#a66720','#6b6288','#48785b'],groups=[...new Set(profiles.map(p=>p.group))];
  const members=profiles.map(p=>{const a=to(p.start),b=to(p.end);return{p,a,b,mid:[(a[0]+b[0])/2,(a[1]+b[1])/2],color:colors[groups.indexOf(p.group)%colors.length]};});
  let out=text(136,30,'编号 · 截面 × 几何长（mm）',14)+text(1044,30,'编号 · 截面 × 几何长（mm）',14);
  for(const m of members)out+=line(...m.a,...m.b,m.color);
  // Separate callout columns keep every label legible, even when members overlap in projection.
  const ordered=[...members].sort((a,b)=>a.mid[0]-b.mid[0]||a.mid[1]-b.mid[1]);
  const split=Math.ceil(ordered.length/2),columns=[ordered.slice(0,split),ordered.slice(split)];
  columns.forEach((column,side)=>{
    column.sort((a,b)=>a.mid[1]-b.mid[1]||a.mid[0]-b.mid[0]);
    column.forEach((m,i)=>{
      const y=column.length===1?(height-70)/2:76+i*(height-190)/(column.length-1),x=side?1044:136,edge=side?928:252,bend=side?904:276;
      out+=line(m.mid[0],m.mid[1],bend,y,'#c7d1d8')+line(bend,y,edge,y,m.color);
      out+=`<circle cx="${n(m.mid[0])}" cy="${n(m.mid[1])}" r="2" fill="${m.color}"/>`;
      out+=rect(x-114,y-9,228,18,'white','none')+text(x,y,`${m.p.id} · ${m.p.section.join('×')} × ${n(m.p.length)}`,12.5,m.color);
    });
  });
  out+=text(590,height-48,'杆件轴线与编号引线 · 闭合装配状态 · mm',15)+text(590,height-24,'密集部位可用安装分组和视角筛选，逐根表与CSV保留全部尺寸',13);
  return svg(1180,height,'全部所选型材逐根编号与尺寸示意；单位mm；投影只示杆件，连接件另计',out);
}
function measureTable(rows) {return `<div class="dd-table-wrap"><table><thead><tr><th>测量项目</th><th>尺寸 / mm</th><th>测量边界与扣除依据</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.name)}</td><td class="dd-value">${esc(r.value)}</td><td class="dd-basis">${esc(r.basis)}</td></tr>`).join('')}</tbody></table></div>`;}
function stockTable(data) {return `<div class="dd-table-wrap"><table><thead><tr><th>安装分组 / 杆件</th><th>截面 × 几何长 / mm</th><th>根数</th><th>对应编号</th></tr></thead><tbody>${data.stock.map(p=>`<tr><td>${esc(p.group)}<br>${esc(p.name)}</td><td class="dd-value">${p.section.join('×')} × ${n(p.length)}</td><td>${p.quantity}</td><td class="dd-ids">${p.ids.join('、')}</td></tr>`).join('')}</tbody></table></div>`;}
const position = p => p.map(n).join(' / ');
function profileRows(profiles) {return profiles.map(p=>`<tr><td>${p.id}</td><td>${esc(p.group)}<br>${esc(p.name)}<small class="dd-basis">${esc(p.source || '')}</small></td><td class="dd-value">${p.section.join('×')} × ${n(p.length)}</td><td>1</td><td class="dd-coordinate">${position(p.start)}<br>→ ${position(p.end)}</td><td class="dd-basis">${esc(p.note || '模型几何长；孔位、端部及加工余量待核定')}</td></tr>`).join('');}
function saveFile(filename,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function csv(data){const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return '\ufeff'+[['编号','分组','杆件名称','截面(mm)','几何长度(mm)','数量','闭合起点X/Y/Z(mm)','闭合终点X/Y/Z(mm)','说明'],...data.profiles.map(p=>[p.id,p.group,p.name,p.section.join('×'),p.length,1,position(p.start),position(p.end),p.note||'未计锯缝、端损及连接加工'])].map(r=>r.map(q).join(',')).join('\r\n');}
function render(target,data){
  const sections=[...new Map(data.profiles.map(p=>[p.section.join('×'),p.section])).values()],groups=[...new Set(data.profiles.map(p=>p.group))],prefix='dd-'+data.id;
  const total=data.profiles.reduce((s,p)=>s+p.length,0)/1000;
  const drawing=(id,title,content,caption='')=>`<figure class="dd-drawing"><div class="dd-drawing-head"><h3>${esc(title)}</h3><button type="button" data-svg="${id}">下载此图SVG</button></div><div id="${id}">${content}</div>${caption?`<figcaption class="dd-caption">${esc(caption)}</figcaption>`:''}</figure>`;
  target.innerHTML=`<header class="dd-head"><div><p class="dd-eyebrow">详细尺寸 · 直接读取当前模型</p><h2>${esc(data.title)}</h2><p>${esc(data.source)} · ${data.profiles.length}根型材 · 几何总长${n(total)} m（未计端损与锯缝）</p></div><span class="dd-unit">全部单位 mm</span></header>
  <div class="dd-metrics">${data.metrics.map(r=>`<div class="dd-metric"><span>${esc(r.name)}</span><strong>${esc(r.value)}</strong><small>${esc(r.basis)}</small></div>`).join('')}</div>
  <nav class="dd-nav" aria-label="详细尺寸导航"><a href="#${prefix}-depth">净深与总深</a><a href="#${prefix}-clear">净空与板厚</a><a href="#${prefix}-profiles">全部型材编号与长度</a></nav>
  <p class="dd-note">${esc(data.notice)}</p>
  <section class="dd-block" id="${prefix}-depth"><h3>总深度与有效净深 · 分开标注</h3>${data.plan==='mirror'?drawing(prefix+'-plan','底部俯视 · 总宽、总深、净深及3030边界',mirrorPlan()):''}${data.depths.map((b,i)=>drawing(prefix+'-depth-'+i,b.title,depthDrawing(b),'条带为同一深向坐标上的不同部件或高度，不相加。局部五金、挂钩和活动范围按各自边界核对。')).join('')}</section>
  <section class="dd-block" id="${prefix}-clear"><h3>有效净空、外尺寸与安装间隙</h3>${measureTable(data.spaces)}<h3 style="margin-top:22px">板材与附件厚度</h3>${measureTable(data.panels)}<h3 style="margin-top:22px">高度与净高的扣除依据</h3>${measureTable(data.heights)}</section>
  <section class="dd-block" id="${prefix}-profiles"><h3>所有型材 · 截面、编号和逐根长度</h3><p>${esc(data.coordinate)}</p><div class="dd-crosses">${sections.map(c=>`<div>${crossDrawing(c)}</div>`).join('')}</div><p class="dd-caption">这里只标外截面，未给定的槽宽、壁厚、内孔及截面惯性矩不从示意图推测。标注长度为模型杆件实体几何长；斜撑为轴线长，端部连接、切角、钻孔及加工公差另定。</p>
  <div class="dd-filters"><label>安装分组<select data-group><option value="">全部型材</option>${groups.map(g=>`<option>${esc(g)}</option>`).join('')}</select></label><label>编号图视角<select data-projection><option value="iso">轴测</option><option value="front">正视</option><option value="side">侧视</option><option value="top">俯视</option></select></label><input type="search" data-search aria-label="搜索型材编号、尺寸或名称" placeholder="搜索编号、名称、长度或截面"><span class="dd-count" aria-live="polite"></span></div>
  ${drawing(prefix+'-map','逐根杆件编号图',profileDrawing(data.profiles),'编号与下方逐根表对应。杆件较密时切换安装分组或视角；SVG可放大查看。图中不计滑轨、板材、格栅丝、拉线、螺栓和连接片。')}
  <div class="dd-actions"><button type="button" data-csv>下载全部型材CSV（${data.profiles.length}根）</button></div>
  <details open><summary>逐根尺寸表 · 共${data.profiles.length}根</summary><div class="dd-details-body"><div class="dd-table-wrap dd-table-scroll"><table><thead><tr><th>编号</th><th>位置 / 杆件</th><th>截面 × 几何长</th><th>数量</th><th>闭合端点 X / Y / Z</th><th>加工说明</th></tr></thead><tbody data-profile-rows>${profileRows(data.profiles)}</tbody></table></div></div></details>
  <details><summary>按用途、截面与长度合并统计 · ${data.stock.length}项</summary><div class="dd-details-body">${stockTable(data)}</div></details></section>`;
  target._dimensionReport=data;target.dataset.profileCount=data.profiles.length;target.dataset.ready='true';
  const update=()=>{const group=target.querySelector('[data-group]').value,search=target.querySelector('[data-search]').value.trim().toLowerCase(),view=target.querySelector('[data-projection]').value,selected=data.profiles.filter(p=>(!group||p.group===group)&&(!search||[p.id,p.name,p.group,p.source,p.length,p.section.join('×')].join(' ').toLowerCase().includes(search)));target.querySelector('[data-profile-rows]').innerHTML=profileRows(selected);target.querySelector('#'+prefix+'-map').innerHTML=profileDrawing(selected,view);target.querySelector('.dd-count').textContent=`当前${selected.length}根 / 全部${data.profiles.length}根`;};
  target.querySelector('[data-group]').addEventListener('change',update);target.querySelector('[data-projection]').addEventListener('change',update);target.querySelector('[data-search]').addEventListener('input',update);update();
  target.addEventListener('click',e=>{const button=e.target.closest('button');if(button?.hasAttribute('data-csv'))saveFile(data.title+'-全部型材.csv',csv(data),'text/csv;charset=utf-8');if(button?.dataset.svg){const s=target.querySelector('#'+button.dataset.svg+' svg');saveFile(data.title+'-'+button.dataset.svg+'.svg',s.outerHTML,'image/svg+xml;charset=utf-8');}});
  target.querySelectorAll('.dd-nav a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();target.querySelector(a.getAttribute('href')).scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
}
function init(){for(const target of document.querySelectorAll('[data-detailed-dimensions]')){
  const kind=target.dataset.project,modelRoot=document.getElementById(kind==='mirror'?'tall-cabinet-frame':kind==='tv'?'bridge-tv-v1':'shoe-cabinet-frame'),frame=kind==='tv'?modelRoot?._tvStand:modelRoot?._frame;
  if(!frame){target.innerHTML='<p class="dd-error">当前模型尚未就绪，请刷新本页。</p>';target.hidden=false;continue;}
  try{render(target,getDimensionData(kind,frame));if(kind==='mirror'){const visibility=()=>{target.hidden=frame.state.mode==='model';};visibility();for(const b of modelRoot.querySelectorAll('[data-mode]'))new MutationObserver(visibility).observe(b,{attributes:true,attributeFilter:['aria-pressed']});}else target.hidden=false;}catch(error){target.innerHTML=`<p class="dd-error">尺寸数据未能生成：${esc(error.message)}</p>`;target.hidden=false;console.error(error);}
}}
if(document.readyState==='complete')init();else addEventListener('load',init,{once:true});
