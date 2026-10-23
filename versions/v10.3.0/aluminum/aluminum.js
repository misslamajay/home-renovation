// Furniture projects have their own navigation; they are not purchase records.
const designDirectory = "./designs/aluminum";
const space = { id: 'aluminum', name: '铝型材' };
export const aluminumProjects = [
  {
    id: 'living-mirror-cabinet', name: '客厅镜柜', option: '方案二',
    description: '方案二 · 3030 铝型材', revision: 12,
    directory: `${designDirectory}/living-mirror-cabinet`, frameID: 'cabinet-model',
    summary: '1000 × 660 × 2300', dimensionNote: '宽 × 整体深 × 总高（含展示层）',
    dimensions: [['宽', 1000], ['整体深', 660], ['总高', 2300], ['展示净高', 400]],
    spec: '方案二说明.md', specName: '客厅镜柜-方案二说明.md',
    views: [
      { id: 'model', name: '三维图', icon: 'box', detail: '旋转查看 · 镜子与洞洞板滑动', description: '拖动旋转，滚轮缩放；镜子与洞洞板可独立右移或联动。' },
      { id: 'layout', name: '分区尺寸', icon: 'grid', detail: '内部净空与抽屉布局' },
      { id: 'bottom-plan', name: '底部尺寸', icon: 'materials', detail: '安全用品与健身器材预留' },
      { id: 'dimensions', name: '主体尺寸', icon: 'note', detail: '正视、侧视、背视及俯视' },
    ],
  },
  {
    id: 'mobile-tv-stand', name: '移动电视支架', option: 'V9',
    description: 'V9 · 85 寸电视 · 银色铝型材', revision: 9,
    directory: `${designDirectory}/mobile-tv-stand`, frameID: 'tv-stand-model',
    summary: '2400 × 800 × 1880', dimensionNote: '宽 × 深 × 总高（含脚轮及装饰杆）',
    dimensions: [['宽', 2400], ['深', 800], ['总高', 1880]],
    spec: 'README.md', specName: '移动电视支架-V9说明.md',
    views: [
      { id: 'model', name: '三维图', icon: 'box', file: 'index.html', detail: '旋转查看 · 桥梁拉线与双层收纳', description: '拖动旋转，滚轮缩放；可切换框架、设备、尺寸标注及开启洞洞板。下方保留客厅效果图。' },
      { id: 'dimensions', name: '尺寸图', icon: 'grid', file: 'dimensions.html', detail: '六张结构图 · 支持放大与下载 SVG' },
      { id: 'materials', name: '材料清单', icon: 'materials', file: 'materials.html', detail: '材料、连接节点、核对记录及 Excel 下载', description: '保留 V9 材料清单和核对记录，可搜索材料、按类别筛选并下载 Excel。' },
    ],
  },
  {
    id: 'elevator-shoe-cabinet', name: '电梯鞋柜', option: 'L形框架与换鞋凳',
    description: '左侧九层鞋区 · 新增三层净高160', revision: 8,
    directory: `${designDirectory}/elevator-shoe-cabinet`, frameID: 'shoe-cabinet-model',
    summary: '左 1380 / 右 1350', dimensionNote: '深 400 · 高 2350 mm · 坐面500',
    dimensions: [['左侧长', 1380], ['右侧长', 1350], ['直柜深', 400], ['高', 2350]],
    spec: 'README.md', specName: '电梯鞋柜-L形换鞋凳说明.md',
    views: [
      { id: 'model', name: '三维图', icon: 'box', file: 'index.html', detail: '左侧九层鞋区 · 灯箱与换鞋凳', description: '左侧在原六层上方新增三层净高160 mm，共九层；顶部预留340 mm。右侧拖鞋抽净高150、换下的鞋182 mm；顶部为“怪兽小屋”暖白灯箱。' },
      { id: 'dimensions', name: '分区尺寸', icon: 'grid', file: 'dimensions.html', detail: '九层净高表、灯箱与踢脚抽剖面', description: '左柜九层净高已扣18 mm层板和30 mm型材承梁；新增第7—9层各160 mm，附逐层离地位置。右侧拖鞋150 / 换下的鞋182，坐面顶高500 mm。' },
    ],
  },
];

export function createAluminumWorkspace({ state, icon, escape, onNavigate }) {
  const active = () => state.mode === 'design';
  const project = () => aluminumProjects.find(p => p.id === state.project) || aluminumProjects[0];
  const view = () => project().views.find(v => v.id === state.designView) || project().views[0];
  const cleanAnchor = value => /^[\w-]+$/.test(value || '') ? value : '';
  const selected = () => {
    state.mode = 'design'; state.space = space.id; state.category = null; state.item = null;
    state.project = project().id; state.designView = view().id; state.query = '';
  };

  function readRoute(params) {
    const requested = params.get('project');
    if (params.get('space') !== space.id || (requested && !aluminumProjects.some(p => p.id === requested))) return false;
    state.project = requested || aluminumProjects[0].id;
    state.designView = params.get('view');
    state.designAnchor = cleanAnchor(location.hash.slice(1));
    selected(); state.expanded.add(space.id); state.mobileView = 'detail';
    return true;
  }

  function writeRoute(url) {
    if (!active()) { url.searchParams.delete('space'); url.searchParams.delete('project'); return; }
    url.searchParams.delete('item');
    url.searchParams.set('space', space.id);
    url.searchParams.set('project', project().id);
    url.searchParams.set('view', view().id);
    url.hash = cleanAnchor(state.designAnchor);
  }

  function renderSidebar() {
    const expanded = state.expanded.has(space.id);
    const count = document.querySelector('#sidebar .nav-label span:last-child');
    count.textContent = String(Number(count.textContent) + 1);
    document.querySelector('#sidebar .spaces').insertAdjacentHTML('afterbegin', `
      <div class="design-space">
        <button class="space-row" data-action="design-space" aria-expanded="${expanded}">
          ${icon(expanded ? 'down' : 'chevron', 'arrow')}${icon('materials', 'space-icon')}
          <span class="room-name">${space.name}</span><span class="count">${aluminumProjects.length}</span>
        </button>
        ${expanded ? `<div class="categories">
          ${aluminumProjects.map(p => `<div class="category"><button class="nav-row ${active() && project().id === p.id ? 'selected' : ''}" data-action="design-project" data-project="${p.id}" ${active() && project().id === p.id ? 'aria-current="page"' : ''}>
            ${icon('box')}<span>${p.name}</span>
          </button></div>`).join('')}
        </div>` : ''}
      </div>`);
  }

  function renderList() {
    const p = project();
    document.querySelector('#item-list').innerHTML = `
      <header class="list-head design-list-head">
        <div class="list-eyebrow"><span>${space.name}</span><span>设计方案</span></div>
        <div class="list-heading"><h2>${p.name}</h2></div><p>${p.description}</p>
      </header>
      <nav class="items design-views" aria-label="${p.name}二级菜单">
        ${p.views.map(v => `<button class="design-view-row ${view().id === v.id ? 'selected' : ''}"
          data-action="design-view" data-view="${v.id}" ${view().id === v.id ? 'aria-current="page"' : ''}>
          ${icon(v.icon, 'design-view-icon')}<span><strong>${v.name}</strong><small>${v.detail}</small></span>
          ${icon('chevron', 'design-view-arrow')}
        </button>`).join('')}
      </nav>
      <footer class="list-total design-list-total">
        <small>当前方案</small><strong>${p.option}</strong>
        <p>${p.summary} <small>mm</small></p><small>${p.dimensionNote}</small>
      </footer>`;
  }

  function renderDetail() {
    const p = project(), current = view();
    const source = current.file
      ? `${p.directory}/${current.file}?embed=1${state.designAnchor ? '#' + cleanAnchor(state.designAnchor) : ''}`
      : `${p.directory}/option-two.html?view=${current.id}`;
    document.querySelector('#detail').innerHTML = `
      <div class="detail-content design-detail">
        <div class="breadcrumb"><span>${space.name}</span>${icon('chevron')}<span>${p.name}</span>${icon('chevron')}<span>${current.name}</span></div>
        <header class="design-detail-head">
          <div><p class="design-eyebrow">${p.option} · ${current.name}</p><h1>${p.name}</h1></div>
          <a class="design-spec-link" href="${p.directory}/${p.spec}" download="${p.specName}">${icon('note')}方案说明</a>
        </header>
        <div class="design-dimensions">${p.dimensions.map(([label, value]) => `<span>${label} <b>${value}</b> mm</span>`).join('')}</div>
        <p class="design-view-description">${current.description || current.detail + ' · 单位 mm'}</p>
        <iframe class="design-model" id="${p.frameID}" title="${p.name}${p.option} · ${escape(current.name)}"
          src="${source}" height="900" allow="fullscreen"></iframe>
      </div>`;
  }

  function decorateLayout() {
    const designing = active(), name = project().name;
    document.querySelector('.app-shell').dataset.workspace = designing ? 'design' : 'purchases';
    document.querySelector('#item-list').setAttribute('aria-label', designing ? `${name}视图菜单` : '设备列表');
    document.querySelector('#detail').setAttribute('aria-label', designing ? `${name}设计方案` : '采购详情');
    document.querySelector('#back-list').setAttribute('aria-label', designing ? `返回${name}视图菜单` : '返回设备列表');
    document.querySelector('#search-button').hidden = designing;
    document.querySelector('#add-button').hidden = designing;
    if (designing) {
      document.querySelector('#page-title').textContent = `${space.name} · ${name}`;
      document.title = `${name} · ${view().name} · 住记`;
    }
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || !['design-space', 'design-project', 'design-view'].includes(target.dataset.action)) return;
    const action = target.dataset.action;
    if (action === 'design-space') {
      if (state.expanded.has(space.id)) state.expanded.delete(space.id); else state.expanded.add(space.id);
    } else state.expanded.add(space.id);
    if (action === 'design-project') {
      if (!aluminumProjects.some(p => p.id === target.dataset.project)) return;
      state.project = target.dataset.project; state.designView = project().views[0].id; state.designAnchor = '';
    }
    if (action === 'design-view') { state.designView = target.dataset.view; state.designAnchor = ''; }
    selected(); state.mobileView = action === 'design-space' ? 'list' : 'detail';
    onNavigate(action !== 'design-space');
  });

  window.addEventListener('message', event => {
    const frame = document.querySelector('.design-model');
    if (!frame || event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (['zhuji-cabinet-size', 'zhuji-design-size'].includes(event.data?.type) && Number.isFinite(event.data.height)) {
      frame.height = String(Math.max(200, Math.min(16000, event.data.height)));
    }
    if (event.data?.type === 'zhuji-design-view' && event.data.project === project().id && project().views.some(v => v.id === event.data.view)) {
      state.designView = event.data.view; state.designAnchor = cleanAnchor(event.data.anchor); onNavigate(true);
    }
  });

  return { active, readRoute, writeRoute, renderSidebar, renderList, renderDetail, decorateLayout };
}
