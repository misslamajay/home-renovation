const appStorage=window.ZhujiStorage;
import { createAluminumWorkspace } from './aluminum.js';
const $=s=>document.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={house:'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',checklist:'M9 5h12M9 12h12M9 19h12M3 5l1 1 2-3M3 12l1 1 2-3M3 19l1 1 2-3',chevron:'m9 5 7 7-7 7',down:'m5 9 7 7 7-7',plug:'M7 3v5m10-5v5M5 8h14v3a7 7 0 0 1-14 0V8Zm7 10v4',smart:'M3 11 12 3l9 8M5 10v11h14V10M9 12l3-3 3 3-3 3-3-3Z',materials:'m3 7 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 17l9 5 9-5',fridge:'M6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM5 9h14M8 5v1m0 7v4',oven:'M4 3h16v18H4zM4 8h16M8 6h.1M12 6h.1M16 6h.1M7 11h10v7H7zM9 14h6',dishwasher:'M4 3h16v18H4zM4 8h16M8 6h.1M16 6h.1M16 15a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',bed:'M3 18V9h18v9M3 15h18M6 9V5h12v4M3 18v3m18-3v3M8 12h2m4 0h2',table:'M3 8h18v4H3zM5 12v9m14-9v9M8 4h8',sofa:'M4 12V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5M2 12h4v5h12v-5h4v8H2v-8ZM5 20v2m14-2v2',door:'M6 22V2h12v20M3 22h18M14 12h.1',shower:'m6 12 7-7 6 6-7 7-6-6ZM13 5 11 3a4 4 0 0 0-6 4v15m5-3 1 1m2-4 1 1m2-4 1 1m-5 9 1 1m2-4 1 1m2-4 1 1',toy:'M7 5a3 3 0 1 0-3 4m13-4a3 3 0 1 1 3 4M19 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM9 10h.1M15 10h.1M10 14q2 2 4 0M6 17l-2 4h16l-2-4',drop:'M12 2S4 11 4 16a8 8 0 0 0 16 0c0-5-8-14-8-14Z',search:'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',plus:'M12 4v16M4 12h16',circleplus:'M12 8v8m-4-4h8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',sidebar:'M3 4h18v16H3zM9 4v16M5 7h1m-1 4h1m-1 4h1',edit:'m16 3 5 5-11 11-6 1 1-6L16 3ZM14 5l5 5M12 3H3v18h18v-9',box:'m3 7 9-5 9 5v12l-9 4-9-4V7Zm0 0 9 5 9-5m-9 5v11M7 5l10 5',check:'m5 12 4 4L19 6',verified:'m12 2 3 2 4 1 1 4 2 3-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-3 1-4 4-1 3-2Zm-5 10 3 3 7-7',clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2',tag:'M3 3h8l10 10-8 8L3 11V3ZM7 7h.1',calendar:'M4 5h16v17H4zM8 2v6m8-6v6M4 10h16',gift:'M3 9h18v4H3zM5 13v9h14v-9M12 9v13M12 9H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z',photo:'M3 3h18v18H3zM3 17l6-7 5 6 3-3 4 4M16 7h.1',copy:'M9 8h12v14H9zM5 17H3V2h12v2',drive:'M5 3h14l3 15v4H2v-4L5 3ZM2 18h20M6 20h.1m3 0h.1',note:'M4 3h16v18H4zM8 7h8m-8 5h8m-8 5h5',zoom:'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-7-3v6m-3-3h6m2 5 6 6',download:'M12 2v13m-5-5 5 5 5-5M3 17v5h18v-5',dots:'M5 12h.1M12 12h.1M19 12h.1'};
paths.utensils='M4 3v6m3-6v18m3-18v6M4 9h6M20 3c-4 0-5 5-5 9h5V3Zm0 9v9';
paths.robot='M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM8 5h8v4H8zM7 16h10M9 19h6M10 12h4';
const icon=(name,cls='')=>`<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true"><path d="${paths[name]||paths.box}"/></svg>`;
const glyphName=item=>({'冰箱':'fridge','蒸烤箱':'oven','洗碗机':'dishwasher','床垫':'bed','餐桌':'table','扫地机器人':'robot','洗地机':'drop','刀具':'utensils','喷枪':'shower'}[item.kind]||'box');
const roomIcons={entrance:'door',living:'sofa',kitchen:'oven',master:'bed','master-bath':'shower',children:'toy',tatami:'grid',bath:'drop'};
const catIcon=id=>({appliances:'plug',smart:'smart',materials:'materials',kitchenware:'utensils'}[id]||'grid');
const money=n=>n==null?'待记录':`¥${(n/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const evidenceURL=e=>window.ZhujiEvidence.url(e);
const state={space:null,category:null,item:'MD-001',mode:'items',query:'',expanded:new Set(['living','kitchen','children']),sidebar:true,mobileView:'list'};
const key='zhuji-local-preview-v1';
let data,editorContext,viewerContext,toastTimer;
const source=await loadSource();
async function loadSource(){if(!window.ZhujiSource)throw Error('请从管理员入口解锁住记');return window.ZhujiSource()}
try{const saved=JSON.parse(appStorage.getItem(key)||'null');data=saved?.version===source.version&&Array.isArray(saved.items)?mergeLatestEvidence(saved,source):source}catch{data=source}
const categoryTemplates=[{id:'appliances',name:'家电',symbol:'plug'},{id:'smart',name:'智能',symbol:'smart'},{id:'materials',name:'主材',symbol:'materials'}];
for(const item of data.items){
  const space=data.spaces.find(s=>s.id===item.spaceID);
  if(space&&!space.categories.some(c=>c.id===item.categoryID)){
    const category=source.spaces.find(s=>s.id===space.id)?.categories.find(c=>c.id===item.categoryID)||categoryTemplates.find(c=>c.id===item.categoryID);
    if(category)space.categories.push(structuredClone(category));
  }
}
if(data.navigationRevision!==source.navigationRevision){
  for(const space of data.spaces)space.categories=space.categories.filter(c=>data.items.some(i=>i.spaceID===space.id&&i.categoryID===c.id));
  data.navigationRevision=source.navigationRevision;persist();
}

function mergeLatestEvidence(saved,latest){
  for(const fresh of latest.items){
    const current=saved.items.find(i=>i.id===fresh.id);
    if(!current){
      const placeholder=fresh.id==='MD-005'?saved.items.findIndex(i=>i.id==='planned-dishwasher'):-1;
      if(placeholder>=0){const old=saved.items[placeholder];saved.items[placeholder]={...structuredClone(fresh),spaceID:old.spaceID,categoryID:old.categoryID,notes:old.notes||''}}
      else saved.items.push(fresh);
      continue;
    }
    // A replacement order starts with its own facts, evidence and claim progress.
    // Preserve every other browser draft; archive the replaced draft locally.
    if(fresh.recordID==='MD-002'&&fresh.orderNumber!==current.orderNumber){
      const historyKey='zhuji-replaced-orders-v1';
      const history=JSON.parse(appStorage.getItem(historyKey)||'[]');
      if(!history.some(x=>x.item.orderNumber===current.orderNumber))history.push({replacedAt:new Date().toISOString(),item:current});
      appStorage.setItem(historyKey,JSON.stringify(history));
      saved.items[saved.items.findIndex(i=>i.id===fresh.id)]=structuredClone(fresh);
      continue;
    }
    if(fresh.sourceRevision&&fresh.sourceRevision!==current.sourceRevision){
      for(const field of ['specification','shippingNote','promotionSummary','promotionNote','expectedRefundCents','refundTargetCents','sourceRevision'])current[field]=fresh[field];
      for(const field of ['rules','evidence','gifts','tasks']){
        current[field]||=[];
        for(const entry of fresh[field]){
          const index=current[field].findIndex(x=>x.id===entry.id);
          if(index<0)current[field].push(structuredClone(entry));
          else if(field==='tasks'){const old=current[field][index];current[field][index]={...entry,completed:old.completed,completedOn:old.completedOn}}
          else if(field==='gifts'){const old=current[field][index];current[field][index]={...entry,received:old.received}}
          else if(field==='rules')current[field][index]=structuredClone(entry);
        }
      }
    }
    for(const field of ['rules','evidence','gifts']){const ids=new Set((current[field]||[]).map(x=>x.id));current[field]||=[];current[field].push(...fresh[field].filter(x=>!ids.has(x.id)))}
    for(const task of fresh.tasks){const old=current.tasks.find(t=>t.id===task.id);if(!old)current.tasks.push(task);else if(task.detail.includes('活动表写订单须30天内发货'))old.detail=task.detail}
    if(fresh.promotionNote.includes('活动表补充：'))current.promotionNote=fresh.promotionNote;
  }
  return saved;
}
const aluminum=createAluminumWorkspace({state,icon,escape,onNavigate(closeNavigation){render();if(closeNavigation)toggleNavigation(false);syncRoute();$('#detail').scrollTop=0}});
const requestedItem=new URLSearchParams(location.search).get('item');
if(requestedItem){const selected=data.items.find(i=>i.id===requestedItem);if(selected){state.item=selected.id;state.space=selected.spaceID;state.category=selected.categoryID;state.expanded.add(selected.spaceID);state.mobileView='detail'}}
const itemByID=id=>data.items.find(i=>i.id===id);
const spaceByID=id=>data.spaces.find(s=>s.id===id);
const pending=i=>(i.tasks||[]).filter(t=>!t.completed);
const bought=i=>i.paidCents!=null;
const fulfillmentLabel=i=>!bought(i)?'待选购':i.receivedOn||i.confirmedOn?'已收货':i.fulfillment?.includes('待确认收货')?'待确认收货':i.fulfillment?.includes('待核对配送')?'待核对配送':i.id==='MD-003'?'待预约配送':'待发货';
const categoryName=i=>spaceByID(i.spaceID)?.categories.find(c=>c.id===i.categoryID)?.name||'品类';
const spaceName=i=>spaceByID(i.spaceID)?.name||'空间';
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());
function deadline(i,t){
  if(t.windowStartDays!=null&&t.windowEndDays!=null){
    const start=t.deadlineTrigger==='completed'?i.orderCompletedOn:t.deadlineTrigger==='received'?i.receivedOn:i.confirmedOn;
    const trigger=t.deadlineTrigger==='completed'?'订单完成':t.deadlineTrigger==='received'?'实际签收':'确认收货';
    if(!start)return{text:`${trigger}后第${t.windowStartDays}—${t.windowEndDays}天 · 待填${trigger}日期`};
    const dateAt=days=>{const date=new Date(start+'T00:00:00Z');date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10)};
    const first=dateAt(t.windowStartDays),last=dateAt(t.windowEndDays),now=today();
    return{text:`${first}—${last} · ${now<first?'尚未开始':now>last?'已过截止日':'可申请'}`,overdue:now>last};
  }
  const afterReceipt=t.deadlineTrigger==='received';
  const start=afterReceipt?i.receivedOn:t.deadlineTrigger==='confirmed'?i.confirmedOn:null;
  const days=t.afterDays??t.withinDays;
  if(days==null)return null;
  if(!start)return{text:t.afterDays!=null?(afterReceipt?`签收满${days}天后 · 待填签收日期`:`确认收货满${days}天后 · 待填日期`):afterReceipt?`收货后${days}天内 · 待填收货日期`:`确认收货后${days}天内 · 待填日期`};
  const date=new Date(start+'T00:00:00Z');date.setUTCDate(date.getUTCDate()+days);
  if(t.afterDays!=null)return{text:`${date.getUTCMonth()+1}月${date.getUTCDate()}日`+(afterReceipt?'起联系店铺领赠品':'起联系售后核算')};
  return{text:`${date.getUTCMonth()+1}月${date.getUTCDate()}日前办理`,overdue:date.toISOString().slice(0,10)<today()};
}
function persist(){try{data.updatedAt=new Date().toISOString();appStorage.setItem(key,JSON.stringify(data))}catch{toast('浏览器未能保存草稿，请检查存储设置')}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400)}
function filtered(){const q=state.query.trim().toLocaleLowerCase();return data.items.filter(i=>q?[i.name,i.brand,i.model,i.kind,i.orderNumber].some(v=>(v||'').toLocaleLowerCase().includes(q)):(!state.space||i.spaceID===state.space)&&(!state.category||i.categoryID===state.category)).sort((a,b)=>Number(bought(b))-Number(bought(a))||(a.recordID||a.name).localeCompare(b.recordID||b.name))}
function action(name,extra=''){return `data-action="${name}" ${extra}`}
function render(){renderSidebar();renderList();renderDetail();applyWebLayout()}
function renderSidebar(){
  const rooms=data.spaces.map(space=>{
    const count=data.items.filter(i=>i.spaceID===space.id).length;
    const expanded=space.categories.length>0&&state.expanded.has(space.id);
    const categories=expanded?'<div class="categories">'+space.categories.map(category=>{
      const count=data.items.filter(i=>i.spaceID===space.id&&i.categoryID===category.id).length;
      return `<div class="category"><button class="nav-row ${state.space===space.id&&state.category===category.id&&state.mode==='items'?'selected':''}" ${action('category',`data-space="${escape(space.id)}" data-id="${escape(category.id)}"`)}>${icon(catIcon(category.id))}<span>${escape(category.name)}</span><span class="count">${count||''}</span></button><button class="category-edit" ${action('renameCategory',`data-space="${escape(space.id)}" data-id="${escape(category.id)}"`)} aria-label="重命名${escape(category.name)}">编辑</button></div>`;
    }).join('')+'</div>':'';
    return `<button class="space-row ${space.categories.length?'':'empty'}" ${action('space',`data-id="${escape(space.id)}"`)} ${space.categories.length?`aria-expanded="${expanded}"`:''}>${icon(expanded?'down':'chevron','arrow')}${icon(roomIcons[space.id]||'house','space-icon')}<span class="room-name">${escape(space.name)}</span><span class="count">${count||''}</span></button>${categories}`;
  }).join('');
  $('#sidebar').innerHTML=`<div class="identity"><div class="brand-icon">${icon('house')}</div><div><h1>住记</h1><small>装修的每一件小事</small></div></div><nav class="nav-primary"><button class="nav-row ${state.mode==='items'&&!state.space?'selected':''}" ${action('all')}>${icon('grid')}<span>全部设备</span><span class="count">${data.items.length}</span></button><button class="nav-row ${state.mode==='todos'?'selected':''}" ${action('todos')}>${icon('checklist')}<span>待办事项</span><span class="count">${data.items.reduce((a,i)=>a+pending(i).length,0)}</span></button></nav><div class="nav-label"><span>我的空间</span><span>${data.spaces.length}</span></div><div class="spaces">${rooms}</div><div class="save-status">${icon('drive')}<div>保存在当前浏览器<small>更改自动保存 · 可导出台账备份</small></div>${icon('verified','saved-check')}</div>`;
  aluminum.renderSidebar();
}
function renderList(){
  if(aluminum.active()){aluminum.renderList();return}
  const list=filtered(),space=spaceByID(state.space),category=space?.categories.find(c=>c.id===state.category);$('#item-list').innerHTML=`<header class="list-head"><div class="list-eyebrow"><span>${escape(space?.name||'我的家')}</span><button ${action('addCategory')} aria-label="添加品类">${icon('dots')}</button></div><div class="list-heading"><h2>${escape(state.query?'搜索结果':state.mode==='todos'?'全部待办':category?.name||space?.name||'全部设备')}</h2><span class="list-count">${state.mode==='todos'?data.items.reduce((a,i)=>a+pending(i).length,0):list.length}</span></div><label class="search">${icon('search')}<input id="search" placeholder="搜索设备、型号…" aria-label="搜索设备" value="${escape(state.query)}"></label></header><div class="items">${(state.mode==='todos'?data.items.filter(i=>pending(i).length):list).map(i=>`<button class="device-row ${state.item===i.id&&state.mode==='items'?'selected':''}" ${action('item',`data-id="${escape(i.id)}"`)}><div class="glyph">${icon(glyphName(i))}</div><div class="device-text"><div class="device-name">${escape(i.kind)}${bought(i)?'<span class="purchased-dot"></span>':''}</div><div class="device-model">${escape(i.name)}</div>${bought(i)?`<div class="device-amount">${money(i.paidCents)}</div>`:'<div class="device-planned">待选购</div>'}${pending(i).length?`<div class="device-tasks">${pending(i).length} 项待办</div>`:''}</div></button>`).join('')}${state.mode==='items'?`<button class="add-device" ${action('add')}>${icon('circleplus')}添加设备</button>${list.length?'':'<p class="empty-list">这里还没有设备</p>'}`:''}</div><footer class="list-total"><small>${list.filter(bought).length} 件已购 · ${list.filter(i=>!bought(i)).length} 件待选购</small><strong>${money(list.reduce((a,i)=>a+(i.paidCents||0),0))}</strong><small>实付款合计</small></footer>`;
  $('#search').addEventListener('input',e=>{state.query=e.target.value;const list=filtered();if(!list.some(i=>i.id===state.item))state.item=list[0]?.id;renderSidebar();const start=e.target.selectionStart;renderList();$('#search').focus();$('#search').setSelectionRange(start,start);renderDetail()});
}
const metric=(title,value,note)=>`<div class="metric"><div class="metric-label">${escape(title)}</div><div class="metric-value">${escape(value)}</div><div class="metric-note">${escape(title==='返现已到账'&&state.item==='MD-005'?'保价差额待核算':note)}</div></div>`;
function taskHTML(i,t){const date=deadline(i,t);return `<div class="task-row ${t.completed?'done':''}"><button class="task-check ${t.completed?'done':''}" ${action('task',`data-item="${escape(i.id)}" data-id="${escape(t.id)}"`)} aria-label="${t.completed?'取消完成':'标记完成'}：${escape(t.title)}">${t.completed?icon('check'):''}</button><div class="task-copy"><div class="task-title">${escape(t.title)}</div><div class="task-info">${escape(t.detail)}</div>${date&&!t.completed?`<div class="deadline ${date.overdue?'overdue':''}">${icon('clock')}${escape(date.text)}</div>`:''}</div></div>`}
function sourceLinks(i,keys){return `<div class="source-links">${keys.map(k=>{const e=i.evidence.find(e=>e.kind===k);return e?`<button ${action('evidence',`data-item="${escape(i.id)}" data-id="${escape(e.id)}"`)}>${icon('photo')}${escape(e.title)}</button>`:`<span>${icon('note')}${k==='user_note'?'你的文字补充':k==='manual'?'手动补充':escape(k)}</span>`}).join('')}</div>`}
function renderDetail(){
  if(aluminum.active()){aluminum.renderDetail();return}
  if(state.mode==='todos'){renderTodos();return}
  const i=itemByID(state.item);
  if(!i){$('#detail').innerHTML=`<div class="empty-detail">${icon('box')}<h2>把这个空间慢慢填满</h2><p>添加一件设备，开始记录预算、订单和活动权益。</p><button class="primary-button" ${action('add')}>添加设备</button></div>`;return}
  const section=(title,subtitle,body,cta='')=>`<section class="section"><div class="section-title"><h2>${title}</h2>${subtitle?`<span>${subtitle}</span>`:''}${cta}</div>${body}</section>`;
  const edit=`<button class="edit-button" ${action('edit',`data-id="${escape(i.id)}"`)}>${icon('edit')}编辑</button>`;
  const categories=[...new Set(i.rules.map(r=>r.category))];
  const rules=categories.map(category=>`<details class="rule-group"><summary>${escape(category)}<small>${i.rules.filter(r=>r.category===category).length}</small></summary><div class="rule-content">${i.rules.filter(r=>r.category===category).map(r=>`<article class="rule"><strong>${escape(r.title)}</strong><p>${escape(r.content)}</p>${r.note?`<p class="rule-note">${escape(r.note)}</p>`:''}${sourceLinks(i,r.sourceKeys)}</article>`).join('')}</div></details>`).join('');
  const info=(label,value,mono=false)=>value?`<div class="info-line"><span class="info-label">${label}</span><span class="info-value ${mono?'mono':''}">${escape(value)}</span>${label==='订单编号'?`<button class="copy-order" ${action('copy',`data-id="${escape(i.id)}"`)} aria-label="复制订单号">${icon('copy')}</button>`:''}</div>`:'';
  const payment=`<div class="card">${info('店铺',i.shop)}${info('型号',i.model)}${info('订单编号',i.orderNumber,true)}${info('发货原文',i.shippingNote)}${info('状态记录',i.fulfillment)}${info('实际收货',i.receivedOn)}${info('确认收货',i.confirmedOn)}${info('订单完成',i.orderCompletedOn)}${i.paymentLines.length?`<details class="payment-detail"><summary>付款明细</summary><div class="payment-lines">${i.paymentLines.map(p=>`<div class="payment-line"><span>${escape(p.label)}</span><span>${p.deduction?'− ':''}${money(p.cents)}</span></div>`).join('')}<div class="payment-line total"><span>实付款</span><span>${money(i.paidCents)}</span></div><div class="muted">${escape(i.paymentNote)}</div></div></details>`:''}</div>`;
  const evidence=`<div class="evidence-grid">${i.evidence.map(e=>`<button class="evidence-card" ${action('evidence',`data-item="${escape(i.id)}" data-id="${escape(e.id)}"`)}><div class="evidence-thumbnail"><img src="${evidenceURL(e)}" alt="${escape(e.title)}原图" loading="lazy"></div><div class="evidence-caption"><strong>${escape(e.title)}</strong><span>查看原图 ↗</span></div></button>`).join('')}</div><p class="evidence-note">原始文件未裁切、未压缩。点击可放大，也可导出原图。</p>`;
  $('#detail').innerHTML=`<div class="detail-content"><div class="breadcrumb"><span>${escape(spaceName(i))}</span>${icon('chevron')}<span>${escape(categoryName(i))}</span>${icon('chevron')}<span>${escape(i.kind)}</span>${edit}</div><div class="hero"><div class="glyph large">${icon(glyphName(i))}</div><div><h1>${escape(i.name)}</h1><p>${escape([i.brand,i.specification].filter(Boolean).join(' · '))}</p></div></div><div class="pills">${i.queryValid?`<span class="pill green">${icon('verified')}查单有效</span>`:''}<span class="pill">${icon('box')}${escape(fulfillmentLabel(i))}</span>${i.platform?`<span class="pill">${escape(i.platform)}</span>`:''}</div>${i.placementNote?`<p class="placement">${escape(i.placementNote)}</p>`:''}${bought(i)?`<div class="metrics">${metric('实付款',money(i.paidCents),i.paidOn?`${i.paidOn} 付款`:'付款日期待补')}${metric('返现已到账',money(i.cashbackCents),i.refundEstimateNote||(i.expectedRefundCents!=null?`参考可申领 ${money(i.expectedRefundCents)}`:'套购规则待补齐'))}${metric('原图证据',`${i.evidence.length} 张`,'活动 · 付款 · 查单')}</div>${section('接下来要做',`${pending(i).length} 项待办`,`<div class="task-panel">${pending(i).map(t=>taskHTML(i,t)).join('')||'<p class="all-done">✓ 这件好物的待办都完成了</p>'}</div>${i.tasks.some(t=>t.completed)?`<details class="completed-tasks"><summary>已完成 ${i.tasks.filter(t=>t.completed).length} 项</summary>${i.tasks.filter(t=>t.completed).map(t=>taskHTML(i,t)).join('')}</details>`:''}`,`<button class="link" ${action('edit',`data-id="${escape(i.id)}"`)}>记录收货 / 到账</button>`)}${section('活动与返现','',`<div class="card"><div class="promo-heading">${icon('tag')}<span>${escape(i.promotionSummary)}</span></div><p class="promo-note">${escape(i.promotionNote)}</p>${i.activityPeriod?`<div class="period">${icon('calendar')}美的套购活动：${escape(i.activityPeriod)}</div>`:''}${i.cashbackCents!=null?`<div class="net-total"><span>按已到账返现计算净支出</span><strong>${money(i.paidCents-i.cashbackCents)}</strong></div>`:''}</div>`)}${i.gifts.length?section('赠品清单',`${i.gifts.filter(g=>g.received).length} / ${i.gifts.length} 类已收到`,`<div class="card">${i.gifts.map(g=>`<div class="gift-row"><button class="gift-check ${g.received?'done':''}" ${action('gift',`data-item="${escape(i.id)}" data-id="${escape(g.id)}"`)} aria-label="${g.received?'取消收到':'标记收到'}${escape(g.name)}">${g.received?icon('check'):''}</button><span>${escape(g.name)}</span><span class="gift-amount">${g.quantity!=null?'×'+g.quantity+escape(g.unit||''):'数量待核对'}</span>${g.received?'<span class="gift-done">已收到</span>':''}</div>`).join('')}</div>`):`<p class="muted section">${escape(i.giftNote||'赠品信息尚未展示，可在规则中补充。')}</p>`}`:`<div class="card planned-panel"><h3>为这个家留个位置</h3><p>选定型号后，记录实际付款与订单，再把规则和截图收在这里。</p><button class="primary-button" ${action('edit',`data-id="${escape(i.id)}"`)}>录入采购信息</button></div>`}${section('完整规则',`${i.rules.length} 条记录`,rules||'<p class="muted">把赠品、退差或领取期限补充在这里，随时回看。</p>',`<button class="link" ${action('rule',`data-id="${escape(i.id)}"`)}>＋ 补充规则</button>`)}${section('订单与付款','',payment)}${section('原图证据',`${i.evidence.length} 张原图`,evidence)}${i.notes?section('我的备注','',`<div class="card promo-note">${escape(i.notes)}</div>`):''}<div class="footnote">${icon('drive')}住记网页版 · ${escape(i.recordID||'自建项目')} · 原图独立留存</div></div>`;
}
function renderTodos(){const all=data.items.reduce((a,i)=>a+pending(i).length,0);$('#detail').innerHTML=`<div class="detail-content todo-overview"><h1>待办事项</h1><p>让每一份权益都有着落。</p><div class="metrics">${metric('未完成',all+' 项',`分布在 ${data.items.filter(bought).length} 笔采购中`)}${metric('已购实付款',money(data.items.reduce((a,i)=>a+(i.paidCents||0),0)),'返现按实际到账单独记录')}${metric('原图证据',data.items.reduce((a,i)=>a+i.evidence.length,0)+' 张','原始文件已保留')}</div>${data.items.filter(i=>i.tasks.length).map(i=>`<section class="section" id="todo-${escape(i.id)}"><div class="todo-item-header"><div class="glyph">${icon(glyphName(i))}</div><div><strong>${escape(i.name)}</strong><small>${escape(spaceName(i)+' / '+categoryName(i))}</small></div><button class="link" ${action('edit',`data-id="${escape(i.id)}"`)}>更新记录</button></div><div class="card todo-card">${pending(i).map(t=>taskHTML(i,t)).join('')||'<span class="muted">已全部完成</span>'}</div></section>`).join('')}</div>`}
function openModal(title,subtitle,body,context){editorContext=context;$('#editor-form').innerHTML=`<header class="modal-header"><h2>${title}</h2><p>${subtitle}</p></header><div class="form-body">${body}</div><footer class="modal-footer"><span class="form-error" id="form-error"></span><button type="button" class="secondary-button" ${action('closeEditor')}>取消</button><button class="primary-button" type="submit">保存</button></footer>`;$('#editor').showModal()}
function field(label,name,value='',type='text',full=false){return `<label class="field ${full?'full':''}">${label}<input type="${type}" name="${name}" value="${escape(value)}" ${name==='name'||name==='title'?'required':''}></label>`}
function spaceOptions(selected){return data.spaces.map(s=>`<option value="${escape(s.id)}" ${s.id===selected?'selected':''}>${escape(s.name)}</option>`).join('')}
function categoryOptions(space,id){const categories=spaceByID(space)?.categories||[];return (categories.length?categories:categoryTemplates).map(c=>`<option value="${escape(c.id)}" ${c.id===id?'selected':''}>${escape(c.name)}</option>`).join('')}
function editItem(id){const i=id?itemByID(id):{id:crypto.randomUUID(),spaceID:state.space||'kitchen',categoryID:state.category||'appliances',name:'',kind:'设备',brand:'',model:'',specification:'',platform:'',shop:'',orderNumber:'',fulfillment:'待选购',queryValid:false,promotionSummary:'活动规则待补充',promotionNote:'',paymentNote:'',shippingNote:'',notes:'',tasks:[],gifts:[],paymentLines:[],rules:[],evidence:[]};const draft=structuredClone(i);openModal(id?'更新采购记录':'添加设备','按实际情况填写，未到账或未知金额留空。',`${field('设备名称','name',i.name,'text',true)}${field('品种','kind',i.kind)}${field('品牌','brand',i.brand)}<label class="field">空间<select name="spaceID">${spaceOptions(i.spaceID)}</select></label><label class="field">品类<select name="categoryID">${categoryOptions(i.spaceID,i.categoryID)}</select></label>${field('型号','model',i.model)}${field('规格','specification',i.specification)}<div class="form-separator">付款与订单</div>${field('实付款（元）','paid',i.paidCents==null?'':(i.paidCents/100).toFixed(2))}${field('返现已到账（元）','cashback',i.cashbackCents==null?'':(i.cashbackCents/100).toFixed(2))}${field('订单编号','orderNumber',i.orderNumber,'text',true)}${field('平台','platform',i.platform)}${field('付款日期','paidOn',i.paidOn,'date')}<div class="form-separator">收货与期限</div>${field('实际收货日期','receivedOn',i.receivedOn,'date')}${field('平台确认收货日期','confirmedOn',i.confirmedOn,'date')}${i.tasks.some(t=>t.deadlineTrigger==='completed')?field('订单完成日期','orderCompletedOn',i.orderCompletedOn,'date'):''}<div class="field-hint">按各项规则的起算日填写；刀具晒单使用平台订单完成日期。未知日期留空。</div><label class="field full">我的备注<textarea name="notes">${escape(i.notes)}</textarea></label>`,{type:'item',draft});$('#editor-form [name=spaceID]').addEventListener('change',e=>$('#editor-form [name=categoryID]').innerHTML=categoryOptions(e.target.value,''))}
function parseMoney(text){const s=text.trim().replace(/[,¥]/g,'');if(!s)return undefined;if(!/^\d+(\.\d{1,2})?$/.test(s))throw Error('请输入有效的非负金额，最多保留两位小数。');const [a,b='']=s.split('.');const n=Number(a)*100+Number(b.padEnd(2,'0'));if(!Number.isSafeInteger(n)||n>99999999999)throw Error('金额超出可记录范围。');return n}
$('#editor-form').addEventListener('submit',e=>{e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget));try{const c=editorContext;if(c.type==='item'){const i=c.draft;for(const k of ['name','kind','brand','model','specification','orderNumber','platform','notes'])i[k]=values[k]?.trim()||'';if(i.orderNumber&&!/^\d+$/.test(i.orderNumber))throw Error('请按原始数字填写订单号。');i.spaceID=values.spaceID;i.categoryID=values.categoryID;const space=spaceByID(i.spaceID);if(!space)throw Error('请选择空间。');if(!space.categories.some(c=>c.id===i.categoryID)){const category=categoryTemplates.find(c=>c.id===i.categoryID);if(!category)throw Error('请选择品类。');space.categories.push(structuredClone(category))}i.paidCents=parseMoney(values.paid);i.cashbackCents=parseMoney(values.cashback);if(i.cashbackCents!=null&&i.paidCents!=null&&i.cashbackCents>i.paidCents)throw Error('已到账返现不能高于实付款。');for(const k of ['paidOn','receivedOn','confirmedOn'])i[k]=values[k]||undefined;if('orderCompletedOn'in values)i.orderCompletedOn=values.orderCompletedOn||undefined;if(i.receivedOn&&i.confirmedOn&&i.confirmedOn<i.receivedOn)throw Error('确认收货日期不能早于实际收货日期。');if(i.paidCents!=null&&i.fulfillment==='待选购')i.fulfillment='已购买，待补订单状态';const index=data.items.findIndex(x=>x.id===i.id);if(index<0)data.items.push(i);else data.items[index]=i;state.space=i.spaceID;state.category=i.categoryID;state.item=i.id;state.query='';state.mode='items';state.expanded.add(i.spaceID)}else if(c.type==='category'){const space=spaceByID(c.space);const name=values.name.trim();if(space.categories.some(x=>x.name===name&&x.id!==c.id))throw Error('这个空间已有同名品类。');if(c.id)space.categories.find(x=>x.id===c.id).name=name;else space.categories.push({id:crypto.randomUUID(),name,symbol:'grid'});state.expanded.add(c.space)}else if(c.type==='rule'){itemByID(c.item).rules.push({id:crypto.randomUUID(),category:'补充记录',title:values.title.trim(),content:values.content.trim(),note:values.note?.trim()||'',sourceKeys:['manual']})}persist();$('#editor').close();state.mobileView='detail';render();syncRoute();toast('已保存')}catch(error){$('#form-error').textContent=error.message}});
function openViewer(itemID,evidenceID){const item=itemByID(itemID);viewerContext={item,index:Math.max(0,item.evidence.findIndex(e=>e.id===evidenceID)),width:660};renderViewer();$('#viewer').showModal()}
async function renderViewer(){
  const queued=viewerContext,queuedIndex=queued.index;
  $('#viewer').innerHTML='<div class="modal-header"><h2>正在解锁原图…</h2><button class="secondary-button" data-action="closeViewer">完成</button></div>';
  try{await window.ZhujiEvidence.prepare(queued.item.evidence[queuedIndex])}
  catch{if(viewerContext===queued&&queued.index===queuedIndex)$('#viewer').innerHTML='<div class="modal-header"><h2>原图暂时无法载入，请重试</h2><button class="secondary-button" data-action="closeViewer">完成</button></div>';return}
  if(viewerContext!==queued||queued.index!==queuedIndex||!$('#viewer').open)return;
const {item,index,width}=viewerContext,e=item.evidence[index];$('#viewer').innerHTML=`<div class="viewer-shell"><header class="viewer-head"><div class="viewer-title"><h2>${escape(e.title)}</h2><small>${escape(e.originalName)}</small></div><button class="secondary-button" ${action('prev')} ${index===0?'disabled':''}>‹</button><span class="viewer-count">${index+1} / ${item.evidence.length}</span><button class="secondary-button" ${action('next')} ${index===item.evidence.length-1?'disabled':''}>›</button><button class="secondary-button" ${action('closeViewer')}>完成</button></header><div class="viewer-scroll"><img src="${evidenceURL(e)}" alt="${escape(e.title)}原图" style="width:${width}px"></div><footer class="viewer-footer">${icon('zoom')}<input id="zoom" aria-label="原图缩放" type="range" min="300" max="1600" value="${width}"><span>原始截图</span><a class="primary-button download" href="${evidenceURL(e)}" download="${escape(e.originalName)}">导出原图</a></footer></div>`;$('#zoom').addEventListener('input',e=>{viewerContext.width=Number(e.target.value);$('#viewer img').style.width=e.target.value+'px'})}
document.addEventListener('click',async e=>{const target=e.target.closest('[data-action]');if(!target||target.disabled)return;const a=target.dataset.action,id=target.dataset.id;const previous=state.item;switch(a){case'space':if(state.expanded.has(id)){state.expanded.delete(id)}else{state.expanded.add(id)}state.space=id;state.category=spaceByID(id).categories[0]?.id;state.mode='items';state.query='';state.item=filtered()[0]?.id;render();break;case'category':state.space=target.dataset.space;state.category=id;state.mode='items';state.query='';state.item=filtered()[0]?.id;render();break;case'all':state.space=null;state.category=null;state.mode='items';state.query='';state.item=filtered()[0]?.id;render();break;case'todos':state.mode='todos';state.query='';render();break;case'item':if(state.mode==='todos'){$(`#todo-${CSS.escape(id)}`)?.scrollIntoView({block:'start',behavior:'smooth'});break}state.item=id;renderList();renderDetail();break;case'add':editItem();break;case'edit':editItem(id);break;case'task':{const task=itemByID(target.dataset.item).tasks.find(t=>t.id===id);task.completed=!task.completed;task.completedOn=task.completed?today():undefined;persist();const pos=$('#detail').scrollTop;render();$('#detail').scrollTop=pos;break}case'gift':{const gift=itemByID(target.dataset.item).gifts.find(g=>g.id===id);gift.received=!gift.received;persist();const pos=$('#detail').scrollTop;render();$('#detail').scrollTop=pos;break}case'evidence':openViewer(target.dataset.item,id);break;case'copy':try{await navigator.clipboard.writeText(itemByID(id).orderNumber);toast('订单号已复制')}catch{toast('可选中订单号后复制')}break;case'rule':openModal('补充规则','记录店铺补充承诺、领取方式或自己的核对结果。',`${field('规则标题','title','','text',true)}<label class="field full">规则内容<textarea name="content" required></textarea></label>${field('备注或来源','note','','text',true)}`,{type:'rule',item:id});break;case'addCategory':case'renameCategory':{const space=target.dataset.space||state.space||'kitchen';const category=id?spaceByID(space).categories.find(c=>c.id===id):null;openModal(category?'重命名品类':'添加品类',`${escape(spaceByID(space).name)} · 可按采购习惯添加家具、灯具、软装等。`,field('品类名称','name',category?.name||'','text',true),{type:'category',space,id});break}case'closeEditor':$('#editor').close();break;case'closeViewer':$('#viewer').close();break;case'prev':viewerContext.index--;renderViewer();break;case'next':viewerContext.index++;renderViewer();break}if(previous!==state.item&&state.mode==='items')$('#detail').scrollTop=0});
$('#sidebar-toggle').innerHTML=icon('sidebar');$('#search-button').innerHTML=icon('search');$('#add-button').innerHTML=icon('plus');
$('#sidebar-toggle').addEventListener('click',()=>{if(matchMedia('(max-width:1100px)').matches)toggleNavigation();else $('.app-shell').classList.toggle('hide-sidebar');applyWebLayout()});
$('#search-button').addEventListener('click',()=>{state.mobileView='list';applyWebLayout();$('#search')?.focus()});
$('#add-button').addEventListener('click',()=>editItem());
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='f'&&!aluminum.active()){e.preventDefault();$('#search').focus()}if((e.metaKey||e.ctrlKey)&&e.key==='n'&&!aluminum.active()){e.preventDefault();editItem()}if($('#viewer').open&&['ArrowLeft','ArrowRight'].includes(e.key)){const index=viewerContext.index+(e.key==='ArrowLeft'?-1:1);if(index>=0&&index<viewerContext.item.evidence.length){viewerContext.index=index;renderViewer()}}});
function applyWebLayout(){
  const shell=$('.app-shell');shell.dataset.view=state.mobileView||'list';
  document.body.dataset.mobileView=state.mobileView||'list';
  const item=itemByID(state.item);
  $('#page-title').textContent=state.mode==='todos'?'待办事项':state.mobileView==='detail'&&item?item.name:'我的家';
  document.title=(state.mode==='todos'?'待办事项':item?.name||'我的家')+' · 住记';
  $('#sidebar-toggle').setAttribute('aria-expanded',String(matchMedia('(max-width:1100px)').matches?shell.classList.contains('sidebar-open'):!shell.classList.contains('hide-sidebar')));
  aluminum.decorateLayout();
}
function toggleNavigation(open){
  const shell=$('.app-shell'),value=open??!shell.classList.contains('sidebar-open');
  shell.classList.toggle('sidebar-open',value);$('#sidebar-backdrop').classList.toggle('open',value);applyWebLayout();
}
function syncRoute(){
  const url=new URL(location.href);
  if(state.item)url.searchParams.set('item',state.item);else url.searchParams.delete('item');
  if(state.mode==='todos')url.searchParams.set('view','todos');else url.searchParams.delete('view');
  aluminum.writeRoute(url);
  history.pushState({item:state.item,space:state.space,category:state.category,mode:state.mode,mobileView:state.mobileView,project:state.project,designView:state.designView},'',url);
}
$('#sidebar-backdrop').addEventListener('click',()=>toggleNavigation(false));
$('#back-list').addEventListener('click',()=>{state.mobileView='list';applyWebLayout();syncRoute();$('#search')?.focus()});
$('#backup-button').addEventListener('click',()=>{
  const json=JSON.stringify(data,null,2);$('#backup-json').value=json;
  $('#backup-download').href='data:application/json;charset=utf-8,'+encodeURIComponent(json);
  $('#backup-download').download='住记台账备份-'+today()+'.json';$('#backup').showModal();
});
$('#backup-close').addEventListener('click',()=>$('#backup').close());
document.addEventListener('click',event=>{
  const actionName=event.target.closest('[data-action]')?.dataset.action;
  if(['category','all','space'].includes(actionName)){state.mobileView='list';toggleNavigation(false);syncRoute()}
  else if(actionName==='item'&&state.mode==='items'){state.mobileView='detail';toggleNavigation(false);syncRoute()}
  else if(actionName==='todos'){state.mobileView='detail';toggleNavigation(false);syncRoute()}
  applyWebLayout();
});
window.addEventListener('popstate',event=>{
  if(event.state)Object.assign(state,event.state);
  else{state.item=new URLSearchParams(location.search).get('item')||data.items[0]?.id;state.mode='items';state.mobileView='list';aluminum.readRoute(new URLSearchParams(location.search))}
  if(aluminum.active())state.expanded.add('aluminum');
  state.query='';render();
});
window.addEventListener('resize',applyWebLayout);
document.addEventListener('keydown',event=>{if(event.key==='Escape')toggleNavigation(false)});
if(new URLSearchParams(location.search).get('view')==='todos'){state.mode='todos';state.mobileView='detail'}
aluminum.readRoute(new URLSearchParams(location.search));
history.replaceState({item:state.item,space:state.space,category:state.category,mode:state.mode,mobileView:state.mobileView,project:state.project,designView:state.designView},'',location.href);
render();
