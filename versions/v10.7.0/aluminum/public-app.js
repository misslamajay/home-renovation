import { createAluminumWorkspace } from './aluminum.js';
const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const paths = { house:'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10', materials:'m3 7 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 17l9 5 9-5', box:'m3 7 9-5 9 5v12l-9 4-9-4V7Zm0 0 9 5 9-5m-9 5v11', grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', note:'M4 3h16v18H4zM8 7h8m-8 5h8m-8 5h5', down:'m5 9 7 7 7-7', chevron:'m9 5 7 7-7 7' };
const icon = (name, cls = '') => `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true"><path d="${paths[name] || paths.box}"/></svg>`;
const state = { mode:'design', space:'aluminum', project:'living-mirror-cabinet', designView:'model', expanded:new Set(['aluminum']), mobileView:'detail' };
const aluminum = createAluminumWorkspace({ state, icon, escape, onNavigate(closeNavigation) { render(); if (closeNavigation) toggleNavigation(false); syncRoute(); $('#detail').scrollTop = 0; } });
function applyLayout() {
  $('.app-shell').dataset.view = state.mobileView; document.body.dataset.mobileView = state.mobileView;
  aluminum.decorateLayout();
}
function render() {
  $('#sidebar').innerHTML = `<div class="identity"><div class="brand-icon">${icon('house')}</div><div><h1>住记</h1><small>铝型材设计分享</small></div></div><div class="nav-label"><span>设计空间</span><span>0</span></div><div class="spaces"></div><div class="save-status"><small>三维图 · 分区尺寸 · 设计说明</small></div>`;
  aluminum.renderSidebar(); aluminum.renderList(); aluminum.renderDetail(); applyLayout();
}
function toggleNavigation(open) {
  const value = open ?? !$('.app-shell').classList.contains('sidebar-open');
  $('.app-shell').classList.toggle('sidebar-open', value); $('#sidebar-backdrop').classList.toggle('open', value); applyLayout();
}
function syncRoute() { const url = new URL(location.href); aluminum.writeRoute(url); history.pushState({ mobileView:state.mobileView }, '', url); }
$('#sidebar-toggle').addEventListener('click', () => { if (matchMedia('(max-width:1100px)').matches) toggleNavigation(); else $('.app-shell').classList.toggle('hide-sidebar'); applyLayout(); });
$('#sidebar-backdrop').addEventListener('click', () => toggleNavigation(false));
$('#back-list').addEventListener('click', () => { state.mobileView = 'list'; applyLayout(); syncRoute(); });
window.addEventListener('resize', applyLayout);
window.addEventListener('popstate', event => { aluminum.readRoute(new URLSearchParams(location.search)); state.mobileView = event.state?.mobileView || 'detail'; render(); });
window.addEventListener('keydown', event => { if (event.key === 'Escape') toggleNavigation(false); });
aluminum.readRoute(new URLSearchParams(location.search));
history.replaceState({ mobileView:state.mobileView }, '', location.href); render();
