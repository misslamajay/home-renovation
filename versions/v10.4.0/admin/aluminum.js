// Furniture projects have their own navigation; they are not purchase records.
const designDirectory = "../aluminum/designs/aluminum";
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
      { id: 'layout', name: '分区尺寸', icon: 'grid', detail: '总深660 / 净深420 · 72根型材逐件标注' },
      { id: 'bottom-plan', name: '底部尺寸', icon: 'materials', detail: '安全用品与健身器材预留' },
      { id: 'dimensions', name: '主体尺寸', icon: 'note', detail: '正视、侧视、背视及俯视' },
    ],
  },
  {
    id: 'mobile-tv-stand', name: '移动电视支架', option: '福马轮基础框架',
    description: '本地候选 · 双立柱与刚性斜撑 · 原 V9 保留', revision: 10,
    directory: `${designDirectory}/mobile-tv-stand`, frameID: 'tv-stand-model',
    summary: '2400 × 1000 × 1880', dimensionNote: '本地候选宽 × 深 × 停放高；可对比原深800',
    dimensions: [['宽', 2400], ['候选深', '800 / 1000'], ['停放高', 1880]],
    spec: 'README.md', specName: '移动电视支架-基础框架与V9说明.md',
    views: [
      { id: 'foundation', name: '基础框架', icon: 'box', file: 'foundation.html', detail: '福马轮 · 深800 / 1000 对比 · 本地候选', description: '先确认基础骨架：4080矩形底座与双立柱、4040前后斜撑、背面钢扁撑、四角福马轮。可切换深800与1000、脚垫落地与轮子接地，查看轮座连接。' },
      { id: 'foundation-dimensions', name: '基础框架尺寸', icon: 'grid', file: 'foundation.html', anchor: 'dimensions', detail: '总外廓 / 梁内净空 / 20根型材 / SVG·CSV', description: '基础框架的完整编号尺寸与静态抗倾覆比较。所有参数随深度候选同步；模型几何长度不是已批准下料尺寸。' },
      { id: 'model', name: '原V9 · 三维图', option: '原 V9 对照', dimensions: [['宽',2400],['深',800],['总高',1880]], icon: 'box', file: 'index.html', detail: '保留桥梁拉线与双层收纳', description: '原 V9 对照，结构尺寸保持不变；仍有4处干涉待修正。拖动旋转，滚轮缩放；下方保留客厅效果图。' },
      { id: 'dimensions', name: '原V9 · 尺寸图', option: '原 V9 对照', dimensions: [['宽',2400],['深',800],['总高',1880]], icon: 'grid', file: 'dimensions.html', detail: '总深、净深与44根型材 · SVG / CSV' },
      { id: 'materials', name: '原V9 · 材料清单', option: '原 V9 对照', dimensions: [['宽',2400],['深',800],['总高',1880]], icon: 'materials', file: 'materials.html', detail: '材料、连接节点、核对记录及 Excel 下载', description: '保留 V9 材料清单和核对记录，可搜索材料、按类别筛选并下载 Excel。' },
    ],
  },
  {
    id: 'elevator-shoe-cabinet', name: '电梯鞋柜', option: 'L形框架与换鞋凳',
    description: '左右上层净高160 · 凳面484 · 白色洞洞板', revision: 16,
    directory: `${designDirectory}/elevator-shoe-cabinet`, frameID: 'shoe-cabinet-model',
    summary: '左 1380 / 右 1350', dimensionNote: '柜体深400 · 含门框约422 · 高2350',
    dimensions: [['左侧长', 1380], ['右侧长', 1350], ['直柜深', 400], ['高', 2350]],
    spec: 'README.md', specName: '电梯鞋柜-L形换鞋凳说明.md',
    views: [
      { id: 'model', name: '三维图', icon: 'box', file: 'index.html', detail: '两侧上层净高160 · 左板464 / 凳面484', description: '左侧拖鞋格和右侧上层托盘均保证实际净高160 mm；中隔板256、左第二板面464、右凳面484 mm。因托盘与支承厚度不同，两顶面相差20 mm。下层托盘净高168；白色洞洞板920×1650、厚2，背后预留20安装空隙。点击“底部对照”查看。' },
      { id: 'rendering', name: '效果图', icon: 'photo', file: 'rendering.html', detail: '红黄蓝配色参考 · 查看原图', description: '你提供的鞋柜效果图，记录银色铝框与红黄蓝、炭黑面板的配色搭配。' },
      { id: 'dimensions', name: '分区尺寸', icon: 'grid', file: 'dimensions.html', detail: '总深 / 净深 / 板厚 · 84根型材逐件标注', description: '详细区分400柜深、340结构净深、门框422与铰链425，托盘外深300、内净深276；附全部84根型材的截面、几何长、数量、闭合端点和编号图。左上层净高160、右上层净高160、下抽168 mm；中隔板256、左第二板面464、凳面484 mm；新增白色洞洞板及其前方348净深、378可用坐深。' },
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
      ? `${p.directory}/${current.file}?embed=1${state.designAnchor || current.anchor ? '#' + cleanAnchor(state.designAnchor || current.anchor) : ''}`
      : `${p.directory}/option-two.html?view=${current.id}`;
    document.querySelector('#detail').innerHTML = `
      <div class="detail-content design-detail">
        <div class="breadcrumb"><span>${space.name}</span>${icon('chevron')}<span>${p.name}</span>${icon('chevron')}<span>${current.name}</span></div>
        <header class="design-detail-head">
          <div><p class="design-eyebrow">${current.option || p.option} · ${current.name}</p><h1>${p.name}</h1></div>
          <a class="design-spec-link" href="${p.directory}/${p.spec}" download="${p.specName}">${icon('note')}方案说明</a>
        </header>
        <div class="design-dimensions">${(current.dimensions || p.dimensions).map(([label, value]) => `<span>${label} <b>${value}</b> mm</span>`).join('')}</div>
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
