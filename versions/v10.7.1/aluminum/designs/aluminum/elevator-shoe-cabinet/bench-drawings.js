import { bench, model } from './bench-geometry.js';

export function drawLeftStorageElevation() {
  const storage = model.leftStorage, ox = 180, oy = 130, height = model.dimensions.height;
  const rect = (x, bottom, width, high, color) => `<rect x="${ox + x}" y="${oy + height - bottom - high}" width="${width}" height="${high}" fill="${color}"/>`;
  const label = (x, y, text, size = 40, color = '#53616b') => `<text x="${ox + x}" y="${oy + height - y}" text-anchor="middle" dominant-baseline="central" style="font-size:${size}px;fill:${color}">${text}</text>`;
  function dim(x, low, high, text) {
    const a = oy + height - high, b = oy + height - low;
    return `<path d="M${x} ${a}V${b}M${x - 7} ${a + 7}l14 -14M${x - 7} ${b + 7}l14 -14" stroke="#8796a1" fill="none"/><rect x="${x - 65}" y="${(a + b) / 2 - 28}" width="130" height="56" fill="white"/><text x="${x}" y="${(a + b) / 2}" text-anchor="middle" dominant-baseline="central" style="font-size:40px">${text}</text>`;
  }
  document.getElementById('left-drawing').innerHTML = `<svg viewBox="0 0 1760 2700" role="img" aria-label="左侧九层鞋区：从下到上净高${storage.layers.map(l => l.netHeight).join('、')}毫米；第一层板面${bench.dividerTop}与右侧中隔板同高，第二层板面${model.alignment.leftShelfTop}；层板18、支承型材30，顶部净高${storage.reserveHeight}毫米">
    <style>#left-drawing text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;fill:#53616b}#left-drawing path,#left-drawing rect{vector-effect:non-scaling-stroke}</style>
    ${rect(980, 0, 400, height, '#edf5f8')}
    ${rect(0, 0, 1380, 30, '#aebbc4')}${rect(0, height - 30, 1380, 30, '#aebbc4')}
    ${rect(0, storage.baseBoardBottom, 1380, storage.boardThickness, '#ccc7b5')}
    ${storage.layers.map(l => `${rect(0, l.supportBottom, 1380, storage.supportHeight, '#aebbc4')}${rect(0, l.boardBottom, 1380, storage.boardThickness, '#ccc7b5')}${label(490, (l.floor + l.ceiling) / 2, `${l.label} · 净高${l.netHeight}`, 36)}${dim(1615, l.floor, l.ceiling, String(l.netHeight))}`).join('')}
    ${[0, 980, 1350].map(x => rect(x, 0, 30, height, x === 980 ? '#40899e' : '#aebbc4')).join('')}
    ${label(490, (storage.reserveFloor + storage.reserveCeiling) / 2 + 50, '上部预留', 46)}${label(490, (storage.reserveFloor + storage.reserveCeiling) / 2 - 50, `净高${storage.reserveHeight}`, 46)}
    ${label(1180, 2120, '转角凳侧取', 32, '#17667d')}
    ${dim(70, 0, height, '2350')}${dim(1615, storage.reserveFloor, storage.reserveCeiling, String(storage.reserveHeight))}
    <path d="M${ox} 2580H${ox + 1380}" stroke="#8796a1"/><rect x="${ox + 570}" y="2552" width="240" height="56" fill="white"/><text x="${ox + 690}" y="2580" text-anchor="middle" dominant-baseline="central" style="font-size:48px">1380</text>
    ${label(690, -180, '标注为净高，已扣除层板与承梁', 32)}
  </svg>`;
  const schedule = document.getElementById('left-shelf-schedule');
  if (schedule) schedule.innerHTML = `<table><caption>左柜从下往上 · 单位 mm</caption><thead><tr><th>层位</th><th>用途</th><th>净高</th><th>主鞋区净宽</th><th>净空离地范围</th></tr></thead><tbody>${storage.layers.map(l => `<tr><td>第${l.id}层</td><td>${l.label}</td><td>${l.netHeight}</td><td>${l.clearWidth}</td><td>${l.floor}—${l.ceiling}</td></tr>`).join('')}<tr><td>上部预留</td><td>后续细化</td><td>${storage.reserveHeight}</td><td>950</td><td>${storage.reserveFloor}—${storage.reserveCeiling}</td></tr></tbody></table>`;
}

export function drawBenchRightElevation() {
  const ox = 180, oy = 130, height = model.dimensions.height;
  const peg = model.pegboard, radius = peg.holeDiameter / 2;
  const rect = (z, low, width, high, color) => `<rect x="${ox + z}" y="${oy + height - low - high}" width="${width}" height="${high}" fill="${color}"/>`;
  function dim(x, y, u, v, label, vertical = false) { return `<g stroke="#8796a1" fill="none"><path d="M${x} ${y}L${u} ${v}"/><path d="M${x - 9} ${y + 9}l18 -18M${u - 9} ${v + 9}l18 -18"/></g><g transform="translate(${(x + u) / 2} ${(y + v) / 2})${vertical ? ' rotate(-90)' : ''}"><rect x="-110" y="-30" width="220" height="60" fill="white"/><text text-anchor="middle" dominant-baseline="central" font-size="48">${label}</text></g>`; }
  document.getElementById('right-drawing').innerHTML = `<svg viewBox="0 0 1730 2700" role="img" aria-label="右侧立面：沿墙总长1350、外高2350；白色洞洞板${peg.width}乘${peg.height}毫米，厚${peg.thickness}；中隔板顶面${bench.dividerTop}、坐面${bench.seatTop}；坐面至灯箱底净空${2140 - bench.seatTop}，下层穿过鞋${bench.drawers[0].insideHeight}、上层拖鞋${bench.drawers[1].insideHeight}">
    <style>#right-drawing text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;fill:#53616b;font-size:40px}#right-drawing path,#right-drawing rect{vector-effect:non-scaling-stroke}</style>
    <defs><pattern id="shoe-peg-holes" x="${ox + peg.firstZ - peg.pitch/2}" y="${oy + height - peg.firstY - peg.pitch/2}" width="${peg.pitch}" height="${peg.pitch}" patternUnits="userSpaceOnUse"><rect width="${peg.pitch}" height="${peg.pitch}" fill="#fafaf7"/><circle cx="${peg.pitch/2}" cy="${peg.pitch/2}" r="${radius}" fill="#b6c5ce"/></pattern></defs>
    ${rect(0, 0, 400, height, '#f1f3f5')}
    ${rect(peg.zMin, peg.bottom, peg.width, peg.height, '#fafaf7')}${rect(peg.firstZ-radius, peg.firstY-radius, (peg.columns-1)*peg.pitch+2*radius, (peg.rows-1)*peg.pitch+2*radius, 'url(#shoe-peg-holes)')}
    ${rect(0, 0, 30, height, '#aebbc4')}${rect(370, 0, 30, height, '#40899e')}${rect(1320, 0, 30, height, '#aebbc4')}
    ${rect(0, height - 30, 1350, 30, '#aebbc4')}${rect(0, 0, 1350, 30, '#aebbc4')}
    ${rect(400, 2140, 920, 180, '#4b595b')}${rect(410, 2150, 900, 160, '#fff6dc')}
    <text x="${ox + 860}" y="${oy + height - 2230}" text-anchor="middle" dominant-baseline="central" style="font-size:72px;font-weight:700;fill:#293b3c;letter-spacing:24px">怪兽小屋</text>
    ${rect(400, bench.seatBottom, 920, bench.seatThickness, '#cbb591')}${rect(400, bench.supportBottom, 920, 30, '#aebbc4')}${rect(418, bench.dividerBottom, 884, 18, '#ccc7b5')}
    ${bench.drawers.map((d, i) => `${rect(bench.faceZMin, d.faceBottom, bench.faceWidth, bench.frontHeight, '#d8eef4')}<rect x="${ox + bench.faceZMin}" y="${oy + height - d.faceTop}" width="${bench.faceWidth}" height="${bench.frontHeight}" fill="none" stroke="#6198a8"/>${rect(bench.faceCenterZ - 70, d.padY - 12, 140, 24, '#537681')}<text x="${ox + 860}" y="${oy + height - d.floor - 12 - d.matThickness - d.insideHeight * .66}" text-anchor="middle">${i ? '上层 · 拖鞋' : '下层 · 穿过的鞋'}</text><text x="${ox + 860}" y="${oy + height - d.floor - 12 - d.matThickness - d.insideHeight * .28}" text-anchor="middle" style="font-size:32px">可用净高${d.insideHeight}</text>`).join('')}
    <text x="${ox + 200}" y="${oy + 180}" text-anchor="middle">左柜占用</text>
    <text x="${ox + 860}" y="${oy + 350}" text-anchor="middle">灯箱920 × 180 × 80</text>
    <text x="${ox + 860}" y="${oy + height - bench.seatTop - 50}" text-anchor="middle" fill="#9a6930">坐面顶高${bench.seatTop}</text>
    ${dim(70, oy, 70, oy + height, '2350', true)}${dim(ox, 2590, ox + 1350, 2590, '1350')}
    ${dim(ox + 860, oy + height - 2140, ox + 860, oy + height - bench.seatTop, '净空' + (2140 - bench.seatTop), true)}${dim(ox + 1430, oy + height - bench.seatTop, ox + 1430, oy + height, String(bench.seatTop), true)}
  </svg>`;
}

export function drawBenchSection() {
  const host = document.getElementById('bench-section');
  if (!host) return;
  const ox = 130, ground = 740;
  const rect = (x, low, width, height, color, extra = '') => `<rect x="${ox + x}" y="${ground - low - height}" width="${width}" height="${height}" fill="${color}" ${extra}/>`;
  function dim(x, y, u, v, label, vertical = false) {
    return `<g stroke="#8796a1" fill="none"><path d="M${x} ${y}L${u} ${v}"/><path d="M${x - 5} ${y + 5}l10 -10M${u - 5} ${v + 5}l10 -10"/></g><g transform="translate(${(x + u) / 2} ${(y + v) / 2})${vertical ? ' rotate(-90)' : ''}"><rect x="-64" y="-18" width="128" height="36" fill="white"/><text text-anchor="middle" dominant-baseline="central">${label}</text></g>`;
  }
  host.innerHTML = `<svg viewBox="0 0 1060 920" role="img" aria-label="换鞋凳侧剖：坐面顶高${bench.seatTop}、中隔板顶${bench.dividerTop}、板厚24、坐深400；下层净高${bench.drawers[0].insideHeight}，上层拖鞋${bench.drawers[1].insideHeight}，踢脚条中心离地下层${bench.drawers[0].padY}、上层${bench.drawers[1].padY}，两抽独立移动300毫米">
    <style>#bench-section text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;font-size:22px;fill:#53616b}#bench-section path,#bench-section rect,#bench-section line{vector-effect:non-scaling-stroke}</style>
    <path d="M90 ${ground}H1000" stroke="#b9c4cc" stroke-width="1"/>
    ${rect(0, bench.seatBottom, 400, bench.seatThickness, '#cbb591')}${rect(0, bench.supportBottom, 30, 30, '#a8b7c1')}${rect(370, bench.supportBottom, 30, 30, '#a8b7c1')}
    ${rect(30, 30, 340, bench.supportBottom - 30, '#e8e5dc', 'fill-opacity=".35" stroke="#c9cdc9"')}
    ${rect(30, bench.dividerBottom, 340, 18, '#c9c3b0')}${rect(0, 0, 400, 30, '#a8b7c1')}
    ${bench.drawers.map((d, i) => `${rect(70, d.floor, 300, 12, '#d7eef5', 'fill-opacity=".55" stroke="#6a9cab"')}${rect(70, d.floor + 12, 300, 40, '#d7eef5', 'fill-opacity=".22" stroke="#6a9cab"')}${rect(370, d.faceBottom, bench.faceThickness, bench.frontHeight, '#d7eef5', 'fill-opacity=".55" stroke="#6a9cab"')}${rect(bench.faceFront, d.padY - 12, 2, 24, '#537681')}${rect(370, d.floor, 300, d.height, 'none', 'stroke="#17667d" stroke-dasharray="6 4"')}
      <text x="350" y="${ground - d.floor - 12 - d.matThickness - d.insideHeight / 2}" text-anchor="middle">${i ? '拖鞋' : '穿过的鞋'}</text>
      ${dim(ox + 440, ground - (i ? bench.supportBottom : bench.dividerBottom), ox + 440, ground - d.floor - 12 - d.matThickness, String(d.insideHeight), true)}`).join('')}
    ${dim(60, ground - bench.seatTop, 60, ground, '坐面' + bench.seatTop, true)}${dim(ox, 90, ox + 400, 90, '坐深400')}
    ${dim(ox + bench.faceFront, ground + 80, ox + bench.faceFront + 300, ground + 80, '行程300')}
    <text x="925" y="200" text-anchor="middle" fill="#17667d">透明亚克力12</text>
    <text x="925" y="240" text-anchor="middle">前挡边高40</text>
    <text x="925" y="300" text-anchor="middle">踢脚条中心离地</text>
    <text x="925" y="340" text-anchor="middle">下层${bench.drawers[0].padY} / 上层${bench.drawers[1].padY}</text>
    <text x="925" y="420" text-anchor="middle">虚线：完全抽出</text>
    <text x="925" y="460" text-anchor="middle">两抽独立移动</text>
    <text x="510" y="125">板厚24</text>
  </svg>`;
}

export function drawCornerStorageElevation() {
  const host = document.getElementById('corner-drawing');
  if (!host) return;
  const storage = model.cornerStorage, ox = 150, ground = 2460;
  const rect = (x, low, width, high, color) => `<rect x="${ox + x}" y="${ground - low - high}" width="${width}" height="${high}" fill="${color}"/>`;
  host.innerHTML = `<svg viewBox="0 0 1050 2600" role="img" aria-label="转角凳侧取物立面：凳面${bench.seatTop}以上开口净宽340，深340，新增18毫米纵向分隔板；顶格2140以上受灯箱侧边遮挡80毫米，剩余开口宽260">
    <style>#corner-drawing text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;font-size:32px;fill:#53616b}#corner-drawing path,#corner-drawing rect{vector-effect:non-scaling-stroke}</style>
    ${rect(0, 0, 400, 2350, '#edf5f8')}${rect(30, 30, 340, bench.seatTop - 30, '#293431')}
    ${storage.compartments.map(c => rect(30, c.openingBottom, 340, c.openingHeight, '#fff')).join('')}
    ${model.leftStorage.layers.map(l => rect(30, l.ceiling, 340, 30, '#aebbc4') + rect(30, l.boardBottom, 340, 18, '#ccc7b5')).join('')}
    ${rect(0, 0, 30, 2350, '#aebbc4')}${rect(370, 0, 30, 2350, '#aebbc4')}${rect(0, 2320, 400, 30, '#aebbc4')}
    ${rect(290, 2140, 80, 180, '#4b595b')}
    <path d="M${ox + 400} ${ground - bench.seatTop}h220" stroke="#9a6930" stroke-width="2"/><text x="${ox + 650}" y="${ground - bench.seatTop}" dominant-baseline="central">凳面${bench.seatTop}</text>
    <text x="${ox + 200}" y="${ground - 2050}" text-anchor="middle">开口340</text>
    ${storage.compartments.filter(c => c.id !== 'reserve').map(c => `<text x="${ox + 200}" y="${ground - (c.openingBottom + c.ceiling) / 2}" text-anchor="middle" dominant-baseline="central">开口高${c.openingHeight}</text>`).join('')}
    <text x="${ox + 650}" y="400" text-anchor="middle">纵向分隔板18</text><text x="${ox + 650}" y="460" text-anchor="middle">开口朝换鞋凳</text><text x="${ox + 650}" y="540" text-anchor="middle">顶格高处余宽260</text>
    <text x="${ox + 650}" y="1100" text-anchor="middle">净深340</text><text x="${ox + 650}" y="1160" text-anchor="middle">沿用原层位</text>
  </svg>`;
}

export function drawBottomAlignment() {
  const host = document.getElementById('alignment-drawing');
  if (!host) return;
  const ground = 770, left = 120, right = 1030, width = 560;
  const rect = (x, low, wide, high, fill, extra = '') => `<rect x="${x}" y="${ground - low - high}" width="${wide}" height="${high}" fill="${fill}" ${extra}/>`;
  host.innerHTML = `<svg viewBox="0 0 1740 910" role="img" aria-label="两侧上层拖鞋实际净高均为160毫米。第一层板面和右侧中隔板同高${bench.dividerTop}；左侧第二层板面${model.alignment.leftShelfTop}、右侧凳面${bench.seatTop}，因托盘与承梁结构不同而相差${model.alignment.heightDifference}毫米；右侧下层净高${bench.drawers[0].insideHeight}。">
    <style>#alignment-drawing text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;font-size:28px;fill:#53616b}#alignment-drawing path,#alignment-drawing rect{vector-effect:non-scaling-stroke}</style>
    <text x="${left + width / 2}" y="90" text-anchor="middle">左柜底部两层</text><text x="${right + width / 2}" y="90" text-anchor="middle">右侧换鞋凳</text>
    ${rect(left, 0, width, 30, '#aebbc4')}${rect(left + 30, 30, width - 60, 18, '#ccc7b5')}
    ${model.leftStorage.layers.slice(0, 2).map(l => rect(left, l.supportBottom, width, 30, '#aebbc4') + rect(left, l.boardBottom, width, 18, '#ccc7b5') + `<text x="${left + width / 2}" y="${ground - (l.floor + l.ceiling) / 2}" text-anchor="middle" dominant-baseline="central">${l.label} · 净高${l.netHeight}</text>`).join('')}
    ${rect(left, 0, 30, model.alignment.leftShelfTop, '#aebbc4')}${rect(left + width - 30, 0, 30, model.alignment.leftShelfTop, '#aebbc4')}
    ${rect(right, 0, width, 30, '#aebbc4')}${rect(right, bench.seatBottom, width, bench.seatThickness, '#cbb591')}${rect(right, bench.supportBottom, width, 30, '#aebbc4')}${rect(right + 18, bench.dividerBottom, width - 36, 18, '#ccc7b5')}
    ${rect(right, 30, 18, bench.supportBottom - 30, '#d5d1c7')}${rect(right + width - 18, 30, 18, bench.supportBottom - 30, '#d5d1c7')}
    ${bench.drawers.map(d => rect(right + 35, d.floor, width - 70, 12, '#d8eef4', 'stroke="#77a4b1"') + `<text x="${right + width / 2}" y="${ground - d.floor - 12 - d.matThickness - d.insideHeight / 2}" text-anchor="middle" dominant-baseline="central">${d.label} · 净高${d.insideHeight}</text>`).join('')}
    <path d="M${left-35} ${ground-bench.dividerTop}H${right+width+35}" stroke="#17667d" stroke-dasharray="7 5"/><rect x="770" y="${ground-bench.dividerTop-24}" width="180" height="48" fill="white"/><text x="860" y="${ground-bench.dividerTop}" text-anchor="middle" dominant-baseline="central" style="fill:#17667d">板面高${bench.dividerTop}</text>
    ${[[left, model.alignment.leftShelfTop, '左板面', '#17667d'], [right, bench.seatTop, '右凳面', '#a66720']].map(([x, level, label, color]) => `<path d="M${x-35} ${ground-level}H${x+width+35}" stroke="${color}" stroke-dasharray="7 5"/><text x="${x+width/2}" y="${ground-level-32}" text-anchor="middle" style="fill:${color}">${label}${level}</text>`).join('')}
    <text x="870" y="865" text-anchor="middle">单位mm · 上层净高均160；左板面与凳面相差${model.alignment.heightDifference}，已分别扣除结构厚度</text>
  </svg>`;
}
