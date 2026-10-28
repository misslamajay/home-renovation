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
    id: 'elevator-shoe-cabinet', name: '电梯鞋柜', option: '2350高 · 左右独立收纳',
    description: '18厚纵向隔板 · 交集归右柜', revision: 28,
    directory: `${designDirectory}/elevator-shoe-cabinet`, frameID: 'shoe-cabinet-model',
    summary: '左 1380 / 右 1350', dimensionNote: '总深左460/右410 · 净深400/350 · 灯箱局部765',
    dimensions: [['左侧长',1380],['右侧长',1350],['左总深',460],['右总深',410],['总高',2350]],
    spec: 'README.md', specName: '电梯鞋柜-净深400与350-层数候选.md',
    views: [
      { id: 'model', name: '三维图', icon: 'box', file: 'index.html', detail: '总高2350 · 左净400 / 右净350', description: '新增18厚纵向隔板，使左右完整封隔；交集410×460归右柜，取消左侧取用。隔板按右柜横梁分9片固定，配合框架连续封隔。左顶格198、右顶格328，现有净高和净深保持。柜体总深左460、右410，开口净宽左940、右860。此为 v10.6.0 发布方案。' },
      { id: 'stool-bay', name: '左下开放区', icon: 'box', file: 'index.html', anchor: 'bench', dimensions: [['净宽',940],['净深',400],['凳位净高',350],['开放区上沿',824]], detail: '双凳350 / 拖鞋150 / 穿过鞋180', description: '左下三格净高保持350 / 150 / 180。两凳并排落地，开口净宽940、有效净深400；拖鞋板面398、穿过鞋板面596，上柜板面824。' },
      { id: 'right-shelves', name: '右侧鞋层', icon: 'grid', file: 'index.html', anchor: 'shelves', dimensions: [['开口净宽',860],['有效净深',350],['顶格净高',328]], detail: '八个指定净高＋顶余328', description: '从下往上：300 / 100 / 140 / 180 / 200 / 200 / 220 / 220 / 余328。本次仅第8格从300改220，顶格增加80，其余格保持。门底33、顶2317，门框总深432、五金局部435。' },
      { id: 'linked-shelves', name: '分隔剖视', icon: 'grid', file: 'index.html', anchor: 'linked', detail: '18厚纵向隔板 · 左右不贯通', description: '左上从824板面起：180 / 180 / 200 / 200 / 150 / 100 / 余198。交集归右柜，纵向隔板配合框架从下到上封隔；剖视暂时隐藏门叶，检查完整隔断。' },
      { id: 'corner-divider', name: '转角隔板', icon: 'box', file: 'index.html', anchor: 'corner', dimensions: [['厚',18],['柱间深',400],['封隔高',2350]], detail: '9片组成1面 · 交集归右', description: '隔板安装于X392—410、Z30—430，厚18，按右柜层间分9片。立柱、横梁和层板边缘接续封隔整个2350高的交界面，左柜不能从此取物。' },
      { id: 'lightbox', name: '侧挂灯箱', icon: 'box', file: 'index.html', anchor: 'lightbox', dimensions: [['宽',320],['高',140],['厚',60],['下沿',2000]], detail: '随前柱外移 · 局部总深765', description: '保留怪兽小屋灯箱320×140×60，下沿2000；随左柜加深外移60。向柜前伸305，局部总深765，侧向仍多70。连接固定立柱，五金按实物复核。' },
      { id: 'rendering', name: '效果图', icon: 'photo', file: 'rendering.html', detail: '红黄蓝配色参考 · 查看原图', description: '保留你提供的红黄蓝与银色铝框配色参考。' },
      { id: 'dimensions', name: '分区尺寸', icon: 'grid', file: 'dimensions.html', detail: '净深 / 层高 / 外廓 / 型材 · SVG·CSV', description: '分别标出左总深460与净400、右总深410与净350；2350高的层数压缩方案、板面标高、开启活动范围和灯箱外伸，附当前模型逐根编号、纵向隔板分片表和SVG、CSV下载。' },
    ],
  },];

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
