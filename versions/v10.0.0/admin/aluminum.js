// Furniture projects have their own navigation; they are not purchase records.
const project = {
  spaceID: 'aluminum',
  spaceName: '铝型材',
  id: 'living-mirror-cabinet',
  name: '客厅镜柜',
  option: '方案二',
  directory: "../aluminum/designs/aluminum/living-mirror-cabinet",
  views: [
    { id: 'model', name: '三维图', icon: 'box', detail: '旋转查看 · 镜子与洞洞板滑动' },
    { id: 'layout', name: '分区尺寸', icon: 'grid', detail: '内部净空与抽屉布局' },
    { id: 'bottom-plan', name: '底部尺寸', icon: 'materials', detail: '安全用品与健身器材预留' },
    { id: 'dimensions', name: '主体尺寸', icon: 'note', detail: '正视、侧视、背视及俯视' },
  ],
};

export function createAluminumWorkspace({ state, icon, escape, onNavigate }) {
  const active = () => state.mode === 'design';
  const view = () => project.views.find(v => v.id === state.designView) || project.views[0];
  const selected = () => {
    state.mode = 'design';
    state.space = project.spaceID;
    state.category = null;
    state.item = null;
    state.project = project.id;
    state.designView = view().id;
    state.query = '';
  };

  function readRoute(params) {
    if (params.get('space') !== project.spaceID ||
        (params.has('project') && params.get('project') !== project.id)) return false;
    state.designView = params.get('view');
    selected();
    state.expanded.add(project.spaceID);
    state.mobileView = 'detail';
    return true;
  }

  function writeRoute(url) {
    if (!active()) {
      url.searchParams.delete('space');
      url.searchParams.delete('project');
      return;
    }
    url.searchParams.delete('item');
    url.searchParams.set('space', project.spaceID);
    url.searchParams.set('project', project.id);
    url.searchParams.set('view', view().id);
  }

  function renderSidebar() {
    const expanded = state.expanded.has(project.spaceID);
    document.querySelector('#sidebar .nav-label span:last-child').textContent =
      String(Number(document.querySelector('#sidebar .nav-label span:last-child').textContent) + 1);
    document.querySelector('#sidebar .spaces').insertAdjacentHTML('beforeend', `
      <div class="design-space">
        <button class="space-row" data-action="design-space" aria-expanded="${expanded}">
          ${icon(expanded ? 'down' : 'chevron', 'arrow')}${icon('materials', 'space-icon')}
          <span class="room-name">${project.spaceName}</span><span class="count">1</span>
        </button>
        ${expanded ? `<div class="categories"><div class="category">
          <button class="nav-row ${active() ? 'selected' : ''}" data-action="design-project" ${active() ? 'aria-current="page"' : ''}>
            ${icon('box')}<span>${project.name}</span>
          </button>
        </div></div>` : ''}
      </div>`);
  }

  function renderList() {
    document.querySelector('#item-list').innerHTML = `
      <header class="list-head design-list-head">
        <div class="list-eyebrow"><span>${project.spaceName}</span><span>设计方案</span></div>
        <div class="list-heading"><h2>${project.name}</h2></div>
        <p>方案二 · 3030 铝型材</p>
      </header>
      <nav class="items design-views" aria-label="客厅镜柜二级菜单">
        ${project.views.map(v => `<button class="design-view-row ${view().id === v.id ? 'selected' : ''}"
          data-action="design-view" data-view="${v.id}" ${view().id === v.id ? 'aria-current="page"' : ''}>
          ${icon(v.icon, 'design-view-icon')}<span><strong>${v.name}</strong><small>${v.detail}</small></span>
          ${icon('chevron', 'design-view-arrow')}
        </button>`).join('')}
      </nav>
      <footer class="list-total design-list-total">
        <small>当前方案</small><strong>${project.option}</strong>
        <p>1000 × 660 × 2300 <small>mm</small></p>
        <small>宽 × 整体深 × 总高（含展示层）</small>
      </footer>`;
  }

  function renderDetail() {
    const current = view();
    document.querySelector('#detail').innerHTML = `
      <div class="detail-content design-detail">
        <div class="breadcrumb"><span>${project.spaceName}</span>${icon('chevron')}<span>${project.name}</span>${icon('chevron')}<span>${current.name}</span></div>
        <header class="design-detail-head">
          <div><p class="design-eyebrow">${project.option} · ${current.name}</p><h1>${project.name}</h1></div>
          <a class="design-spec-link" href="${project.directory}/方案二说明.md" download="客厅镜柜-方案二说明.md">${icon('note')}方案说明</a>
        </header>
        <div class="design-dimensions"><span>宽 <b>1000</b></span><span>整体深 <b>660</b></span><span>总高 <b>2300</b> mm</span><span>展示净高 <b>400</b> mm</span></div>
        <p class="design-view-description">${current.id === 'model' ? '拖动旋转，滚轮缩放；镜子与洞洞板可独立右移或联动。' : current.detail + ' · 单位 mm'}</p>
        <iframe class="design-model" id="cabinet-model" title="客厅镜柜方案二 · ${escape(current.name)}"
          src="${project.directory}/option-two.html?view=${current.id}" height="900" allow="fullscreen"></iframe>
      </div>`;
  }

  function decorateLayout() {
    const designing = active();
    document.querySelector('.app-shell').dataset.workspace = designing ? 'design' : 'purchases';
    document.querySelector('#item-list').setAttribute('aria-label', designing ? '客厅镜柜视图菜单' : '设备列表');
    document.querySelector('#detail').setAttribute('aria-label', designing ? '客厅镜柜设计方案' : '采购详情');
    document.querySelector('#back-list').setAttribute('aria-label', designing ? '返回镜柜视图菜单' : '返回设备列表');
    document.querySelector('#search-button').hidden = designing;
    document.querySelector('#add-button').hidden = designing;
    if (designing) {
      document.querySelector('#page-title').textContent = `${project.spaceName} · ${project.name}`;
      document.title = `${project.name} · ${view().name} · 住记`;
    }
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || !['design-space', 'design-project', 'design-view'].includes(target.dataset.action)) return;
    const action = target.dataset.action;
    if (action === 'design-space') {
      if (state.expanded.has(project.spaceID)) state.expanded.delete(project.spaceID);
      else state.expanded.add(project.spaceID);
    } else state.expanded.add(project.spaceID);
    if (action === 'design-view') state.designView = target.dataset.view;
    selected();
    state.mobileView = action === 'design-space' ? 'list' : 'detail';
    onNavigate(action !== 'design-space');
  });

  window.addEventListener('message', event => {
    const frame = document.getElementById('cabinet-model');
    if (!frame || event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'zhuji-cabinet-size' && Number.isFinite(event.data.height)) {
      frame.height = String(Math.max(200, Math.min(12000, event.data.height)));
    }
  });

  return { active, readRoute, writeRoute, renderSidebar, renderList, renderDetail, decorateLayout };
}
