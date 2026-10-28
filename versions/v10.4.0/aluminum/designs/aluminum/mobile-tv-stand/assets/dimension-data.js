// Shared by all three aluminum projects; kept in the registered asset bundle.
// Dimensions are derived from the same geometry used by the live models.
const norm = v => Math.hypot(...v);
const delta = (a, b) => b.map((v, i) => v - a[i]);
const fmt = v => Number(Number(v).toFixed(2));
const section = a => [...a].sort((x, y) => x - y);
function member(prefix, index, name, group, a, b, cross, extra = {}) {
  return { id: `${prefix}-${String(index + 1).padStart(3, '0')}`, name, group, start: [...a], end: [...b], section: section(cross), length: norm(delta(a, b)), ...extra };
}
function boxMember(prefix, index, name, group, center, size, extra = {}) {
  const axis = size.indexOf(Math.max(...size)), a = [...center], b = [...center];
  a[axis] -= size[axis] / 2; b[axis] += size[axis] / 2;
  return member(prefix, index, name, group, a, b, size.filter((_, i) => i !== axis), extra);
}
const row = (name, value, basis) => ({ name, value: String(value), basis });
const range = (name, start, end, note = '') => ({ name, start, end, note });

function mirror(frame) {
  const { dimensions: d, storagePlan: s, drawerPlan: drawer, slidePlan: slide, pegPlan: peg, topPlan: top } = frame;
  const profiles = [];
  for (const p of frame.parts) {
    const m = p.meta;
    const group = /活动前框|洞洞板框/.test(p.name) ? '滑动前框' : /展示|连接承梁|轨道带|固定端宽向承梁/.test(p.name) ? '顶部展示与承梁' : /层板|中层|底部上沿/.test(p.name) ? '层板及器材区支承' : '主体框架';
    if (m.length && m.section) profiles.push(member('M', profiles.length, p.name, group, m.start, m.end, [m.section, m.section], { source: p.name }));
    else if (/承梁占位/.test(p.name) && m.size) profiles.push(boxMember('M', profiles.length, p.name, group, m.center, m.size, { source: p.name, note: '承梁占位，具体型材及节点待核定' }));
  }
  return {
    id: 'mirror', title: '客厅镜柜 · 方案二详细尺寸', source: '方案二实时几何 / 修订12', profiles,
    coordinate: '闭合状态坐标：X左右，Y离地，Z前后；原柜体背面Z=-250，前面Z=250。运动不改变杆件长度。',
    metrics: [row('闭合总外廓', `${d.width} × ${d.displayDepth} × ${d.height}`, '宽 × 总深 × 高，含镜框和洞洞板框'), row('固定柜体', `${d.width} × ${d.depth} × ${d.bodyHeight}`, '不把前方滑动层计入柜内净深'), row('储物板面有效净深', s.effectiveDepth, '500−前后型材各30−板面退让各10'), row('主体外截面', `${d.section} × ${d.section}`, '3030；槽宽、壁厚、孔径仍按实物选型')],
    spaces: [row('固定柜体结构净深', d.depth - 2 * d.section, '500−30−30=440；前后梁内表面Z=-220 / 220'), row('储物平台有效净深', s.effectiveDepth, '板面Z=-210 / 210；结构净深440再各退10'), row('每侧正面净宽', s.bayWidth, '(1000−3×30)÷2=455；左右梁间开口'), row('顶部展示实际净空', `940 × 600 × ${d.displayNetHeight}`, '宽×深×高；X=-470…470、Z=-220…380、Y=1870…2270'), row('展示区外廓', `1000 × 660 × ${d.displayHeight}`, '498=承梁带60+底板8+净高400+顶框30'), row('镜框 / 洞洞板框', `${slide.frameWidth} × ${slide.frameHeight} × 30`, '每层外框；框底8、框顶1794'), row('镜面内嵌面', `940 × ${peg.panelHeight}`, '内嵌宽=1000−2×30；内嵌高=1786−2×30'), row('两前框净间距', peg.frameGap, '镜框前表面330至洞洞板框后表面380；局部联动耳另计'), row('抽屉箱体外尺寸', '405 × 350 × 126', '宽×前后深×高；模块高度150不等于箱体净高'), row('抽屉内部净尺寸', '381 × 326 × 118', '已扣箱板；面板447×142；模型行程260'), row('展开横向占用', '2000', '主体宽1000＋向右单向行程1000；右侧须有活动空间')],
    panels: [row('储物层板 / 器材垫', '18 / 8', '板上表面及垫面作为净高起点'), row('展示底板 / 透明罩', '8 / 4', '顶罩内嵌顶框；底板上表面1870至顶罩下表面2270净400'), row('镜片 / 镜背板', '5 / 8', '建模占位；实际镜子总成待核定'), row('洞洞板', `940 × ${peg.panelHeight} × 2`, '孔径8、孔距25为设计占位，未作为采购规格'), row('伸缩轨占位', '5组；各闭合1000、行程1000', '镜框上下2、洞洞板上下2、中部防摆1；轨道不计型材根数，五金型号及额定载荷待定')],
    depths: [{ title: '闭合深度分解：500 + 50 + 30 + 50 + 30 = 660', min: -250, max: 410, rows: [range('固定柜体 · 深500', -250, 250), range('梁间结构净深440', -220, 220), range('储物板面有效净深420', -210, 210), range('柜体至镜框间隙50', 250, 300), range('镜框厚30', 300, 330), range('两框净间距50', 330, 380), range('洞洞板框厚30', 380, 410), range('展示结构净深600', -220, 380)] }],
    heights: [row('最下排净高', '418', '地板面56至上方承梁底474'), row('器材上排净高', '300', '530—830'), row('抽屉模块 / 箱体内净高', '150 / 118', '模块878—1028；不得把模块高度当箱体净空'), row('左上储物 / 右上储物', '230×3 / 354×2', '板厚18，起止标高见既有分区图'), row('展示净高', '400', '1870—2270，扣底板、顶罩后的真正净空')],
    notice: '总深660不含洞洞板挂钩和悬挂物前突。滑轨1000为占位长度和行程，不能据此认定承载；型材表是模型几何长度，连接方式、孔位、端部加工与下料公差尚需核定。',
    plan: 'mirror',
  };
}

function shoe(frame) {
  const d = frame.dimensions, b = frame.bench, s = frame.leftStorage, c = frame.cornerStorage, parts = frame.measurementParts;
  const groups = { 'left-storage': '左柜层板承梁', bench: '换鞋凳承梁', corner: '主体框架', left: '主体框架', right: '主体框架' };
  const names = { post: '立柱', top: '顶框', bottom: '底框', 'shelf-support': '层板承梁', 'bench-support': '换鞋凳支承' };
  const profiles = frame.members.map((p, i) => boxMember('S', i, `${names[p.kind] || p.kind} · ${p.id}`, groups[p.group] || '主体框架', p.center, p.size, { source: p.id, note: p.cuts ? '含切面定义，端部加工须复核' : '' }));
  for (const p of parts.doors.filter(p => p.kind === 'door')) profiles.push(boxMember('S', profiles.length, `${p.group === 'red' ? '红门' : '黄门'} · ${/stile/.test(p.id) ? '边立框' : '上下横框'}`, '20系列门框', p.center, p.size, { source: p.id }));
  const lower = b.drawers[0], upper = b.drawers[1], p = frame.pegboard;
  return {
    id: 'shoe', title: '电梯鞋柜 · 详细尺寸与逐根型材', source: `鞋柜实时几何 / 修订${frame.revision}`, profiles,
    coordinate: '同一墙角为X/Z原点：左臂沿X=0…1380，右臂沿Z=0…1350，Y为离地标高；门框端点取闭合状态。',
    metrics: [row('L形沿墙总长 / 总高', `${d.left} / ${d.right} / ${d.height}`, '两条臂均从同一墙角量起，共用400×400转角'), row('直柜框架总深', d.depth, '400为框架外廓，不能用作柜内净深'), row('结构有效净深', s.clearDepth, '裸框及凳下400−前后30×30型材=340；凳上洞洞板前方净深另计'), row('闭合左门框 / 铰链最前沿', '422 / 425', '距左臂后方墙面；L形总包围盒仍由1380和1350两沿墙尺寸决定')],
    spaces: [row('凳上洞洞板至前梁净深', 370-p.front, '洞洞板前表面X='+p.front+'至前型材内表面370；不含挂钩和挂物前突'), row('凳面至洞洞板可用坐深', b.seatDepth-p.front, '从洞洞板前表面到坐板前沿400；坐板外深仍为400'), row('底部两层整板内净宽', 1320, '1380−左右两端型材各30；不等于正面开口宽'), row('左柜正面开口净宽', 950, '共享转角立柱内侧X=400至外端立柱内侧1350'), row(`${b.seatTop}以上主鞋区净宽`, s.mainClearWidth, '纵隔板外侧X=400至外端内侧1350'), row('转角柜内净宽 / 侧口净宽', '352 / 340', '柜内X=30…382；侧口受两根立柱限制为X=30…370'), row('转角侧取净深', c.clearDepth, `Z=30…370；从凳面${b.seatTop}以上取物`), row('座板有效板面', `${b.seatWidth} × ${b.seatDepth}`, '920×400，位于型材上方；与凳下340净深分开标注'), row('右侧托盘箱体外廓', `${b.drawerWidth} × ${b.drawerDepth} × 52`, '宽850×深300×高52；不含前挡边、踢脚条'), row('托盘内部可用宽×深', '826 × 276', '两侧12：850−24；前后12：300−24'), row('托盘含前挡边 / 踢脚条深', '312 / 314', 'X=70…382 / 384；柜内安装位置不再额外叠加到400'), row('前挡边宽×高×厚', `${b.faceWidth} × 40 × 12`, 'Z=428…1316，转角端退让24；行程300'), row('左右门扇外廓', '各457 × 2284 × 20', '门框2020；中间色板417×2244×6'), row('90°开门前沿', '距后墙881', '左臂框架前沿400之外需481活动空间；位于L形内侧，不能与伸出的托盘同时占用')],
    panels: [row('白色洞洞板外廓', `${p.width} × ${p.height} × ${p.thickness}`, `宽×高×厚；Z=${p.zMin}…${p.zMax}、Y=${p.bottom}…${p.top}；凳面上和灯箱下各留3`), row('洞洞板孔型', `Ø${p.holeDiameter} / 孔距${p.pitch}`, `${p.columns}列×${p.rows}行；白色喷粉金属；孔型与板厚为设计占位`), row('洞洞板安装空隙', p.standOff, `后墙0至板背${p.back}；板前表面${p.front}，安装位于后型材30厚度带内；6处连接片占位另计`), row('鞋层板 / 转角纵隔板', '18 / 18', '层板按立柱开缺口，纵隔板只在水平板之间分段'), row('坐板 / 右侧中隔板', `${b.seatThickness} / 18`, `坐板${b.seatBottom}—${b.seatTop}；中隔板${b.dividerBottom}—${b.dividerTop}`), row('外侧封板 / 门内色板', '6 / 6', '封板嵌入型材带；外侧蓝色、左红右黄门'), row('透明托盘板 / 前低挡边', '12 / 12', '侧后挡边在底板上方40；前挡边高40'), row('转角收口件', `22×22×${2317 - b.seatTop - 3}；22×2×${b.seatTop - 33}`, '金属收口占位，另列不计入已定义的3030/2020根数'), row('托盘伸缩轨', '两抽各一对，闭合300 / 行程300', '左右侧轨；固定段不动、中段半行程、活动段全行程；五金选型待定')],
    depths: [{ title: '换鞋凳上方：白色洞洞板后的有效深度', min: 0, max: 400, rows: [range('后型材30', 0, 30), range('后墙至板背空隙20', 0, p.back), range('白色洞洞板厚2', p.back, p.front), range('板前至前梁净深348', p.front, 370), range('板前至坐板沿378', p.front, 400)] }, { title: '左臂：柜体400、柜内340、闭合门框422、铰链425', min: 0, max: 425, rows: [range('框架总深400', 0, 400), range('后型材30', 0, 30), range('结构净深340', 30, 370), range('前型材30', 370, 400), range('闭合门框厚20', 402, 422), range('铰链局部至425', 419, 425)] }, { title: '右侧托盘：结构净深340 ≠ 箱体深300 ≠ 内净深276', min: 0, max: 400, rows: [range('框架总深400', 0, 400), range('结构净深340', 30, 370), range('箱体外深300', 70, 370), range('箱内净深276', 82, 358), range('前挡边12', 370, 382), range('踢脚条2', 382, 384)] }],
    heights: [row('第一层板面 / 中隔板', b.dividerTop, '左右第一道板面同高'), row('左第二层板面 / 右凳面', `${frame.alignment.leftShelfTop} / ${b.seatTop}`, `两顶面相差${frame.alignment.heightDifference}；净高相同不等于顶面同高`), row('左右上层拖鞋实际净高', `${s.layers[1].netHeight} / ${upper.insideHeight}`, `左${s.layers[1].floor}—${s.layers[1].ceiling}；右托盘面${upper.floor+12}至承梁底${b.supportBottom}`), row('左柜逐层净高', s.layers.map(x => x.netHeight).join(' / '), '底板面48起；各层扣除30承梁和18板厚'), row('右侧下层净高', lower.insideHeight, `垫面${lower.floor + 14}至中隔板底${b.dividerBottom}`), row('右侧上层净高', upper.insideHeight, `托盘面${upper.floor + 12}至前承梁底${b.supportBottom}；隔板上方名义间隙2`), row('凳面至灯箱底', frame.lightbox.bottom - b.seatTop, `${frame.lightbox.bottom}−${b.seatTop}=${frame.lightbox.bottom - b.seatTop}`), row('顶部预留 / 转角首格', `${s.reserveHeight} / ${c.compartments[0].openingHeight}`, `顶部${s.reserveFloor}—${s.reserveCeiling}；首格${c.compartments[0].openingBottom}—${c.compartments[0].ceiling}`)],
    notice: '白色洞洞板厚2、孔径8和孔距25暂作设计预留；挂钩及连接件按实物选型。门框422与铰链425为左臂截面进深，不能替代L形沿墙占地1380×1350。黄门开启前先收回托盘，抽出前先关黄门。上抽底板与隔板仅2 mm名义间隙，按最终五金和板材公差复核。',
    plan: 'shoe',
  };
}

function tv(frame) {
  const p = frame.parameters;
  const profiles = frame.profiles().map((m, i) => member('T', i, m.name === '主体与底座' ? (Math.max(m.start[1], m.end[1]) <= 240 ? '底座梁' : m.axis === 1 ? '主立柱 / 支撑短柱' : '主体横梁') : m.name, m.group, m.start, m.end, m.section, { note: m.axis === -1 ? '斜撑轴线长，端面切角与连接余量待定' : '', source: 'beam/strut实时记录' }));
  return {
    id: 'tv', title: '移动电视支架 · V9详细尺寸', source: 'V9实时几何（结构未改）', profiles,
    coordinate: 'X左右，Y离地，Z前后；总外廓以2400×800×1880控制。尺寸表记录闭合装配坐标，刚性斜撑给出轴线几何长度。',
    metrics: [row('整机总外廓', `${p.width} × ${p.depth} × ${p.height}`, '宽×深×高，包含端盖、脚轮、托盘及装饰杆'), row('底座型材外包围', '2390 × 780', '宽：±1175中心+40截面；深：侧纵梁780，不含端盖'), row('上层梁内净深 / 板面深', '380 / 360', '两片板前后各退10；不能把整机深800当可放物深'), row('型材截面', '4080 / 4040 / 3030 / 2020', '从每根模型外截面提取，非单一40系列')],
    spaces: [row('下层格栅平台外廓', `${p.trayWidth} × ${p.trayDepth}`, '1440×600，周边围栏另占空间'), row('围栏内净宽×净深', '1396 × 516', '两侧栏中心±700、前后栏中心±260，栏杆直径4，各内退2'), row('PS5连底座预留', `${p.reserveWidth} × ${p.reserveDepth} × ${p.reserveHeight}`, '500×300×150的预留包络，不是整个平台净尺寸'), row('上层每片亚克力包络', '700 × 360 × 6', '中间楔形缺口；不是完整700×360矩形'), row('每片保守满深矩形区', '640 × 360', '左片X=-720…-80，右片对称；端部楔形另计'), row('上层梁内净深', 380, '后横梁内沿Z=-160、前横梁内沿220'), row('上层实际板面深', p.displayDepth, 'Z=-150…210，前后各留10安装间隙'), row('后洞洞板外廓 / 板厚', '1800 × 900 / 1.5', '三片600宽折边板；折边深18，挂物深度另计'), row('侧托板 / 穿线孔', '240 × 200 × 6 / 14 × 18', '两侧托板；开孔中心随拉线交点确定')],
    panels: [row('上层亚克力', '两片，各700×360×6包络', '异形边界按模型多边形复核，不可当完整矩形下单'), row('设备格栅 / 设备垫', '格栅顶248 / 垫面250', '模型格栅顶为248，设备垫顶面为250'), row('背面交叉扁拉撑', `2条；截面30×3；轴线长${fmt(Math.hypot(2160,880))}`, '材质与端部连接待定，属于扁拉撑，不计入T槽型材44根'), row('四脚轮', '轮径125；安装单元高160', '底座下沿160；回转包络115为模型预留'), row('驻车支脚收起', '底面离地28', '不能把驻车脚当已落地承重')],
    depths: [{ title: '整机深800与上层有效板面深360分开标注', min: -400, max: 400, rows: [range('整机总深800', -400, 400), range('底座型材深780', -390, 390), range('下层平台外深600', -300, 300), range('下层围栏内净深516', -258, 258), range('上层梁内净深380', -160, 220), range('上层板面有效深360', -150, 210)] }],
    heights: [row('底座下沿 / 上沿', '160 / 240', '4080底座高80，脚轮及安装板位于下方'), row('下层设备垫面', p.trayTop, '250；全平台按上横梁最低点500保守预留净高250'), row('设备区局部净高', '262', '避开前后梁后，垫面250至局部2020横撑底512；不能套用于全平台'), row('上层板面 / 电视下沿', `${p.displayTop} / ${p.tvBottom}`, '540至770净230；180高手办上方余50'), row('拉线塔顶 / 电视间隙', `${p.fanTop} / ${p.tvBottom - p.fanTop}`, '740至770间隔30'), row('主体立柱顶 / 总高', '1800 / 1880', '装饰杆顶1880；别把主立柱长度1560当整机高度')],
    notice: '保留V9已有的4处结构干涉核对记录，不在尺寸补标时改变结构。斜撑切角、孔位、挂架、脚轮与连接节点待核定；几何长度及截面汇总不等于已批准下料清单。格栅丝、拉线和轮轴不计入T槽型材根数。',
    plan: 'tv',
  };
}

export function getDimensionData(kind, frame) {
  const data = ({ mirror, shoe, tv })[kind](frame);
  const keys = new Map();
  for (const p of data.profiles) {
    p.length = fmt(p.length);
    const key = p.group + '|' + p.name + '|' + p.section.join('×') + '|' + p.length;
    if (!keys.has(key)) keys.set(key, { ...p, ids: [], quantity: 0 });
    const item = keys.get(key); item.ids.push(p.id); item.quantity++;
  }
  data.stock = [...keys.values()];
  return data;
}
