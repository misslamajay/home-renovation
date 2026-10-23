import { bench, model } from './bench-geometry.js';

export function drawLeftStorageElevation() {
  const storage = model.leftStorage, ox = 180, oy = 130, height = model.dimensions.height;
  const rect = (x, bottom, width, high, color) => `<rect x="${ox + x}" y="${oy + height - bottom - high}" width="${width}" height="${high}" fill="${color}"/>`;
  const label = (x, y, text, size = 40, color = '#53616b') => `<text x="${ox + x}" y="${oy + height - y}" text-anchor="middle" dominant-baseline="central" style="font-size:${size}px;fill:${color}">${text}</text>`;
  function dim(x, low, high, text) {
    const a = oy + height - high, b = oy + height - low;
    return `<path d="M${x} ${a}V${b}M${x - 7} ${a + 7}l14 -14M${x - 7} ${b + 7}l14 -14" stroke="#8796a1" fill="none"/><rect x="${x - 65}" y="${(a + b) / 2 - 28}" width="130" height="56" fill="white"/><text x="${x}" y="${(a + b) / 2}" text-anchor="middle" dominant-baseline="central" style="font-size:40px">${text}</text>`;
  }
  document.getElementById('left-drawing').innerHTML = `<svg viewBox="0 0 1760 2700" role="img" aria-label="左侧九层鞋区：从下到上净高120、130、170、170、170、260、160、160、160毫米；层板18、支承型材30，顶部剩余净高340毫米">
    <style>#left-drawing text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;fill:#53616b}#left-drawing path,#left-drawing rect{vector-effect:non-scaling-stroke}</style>
    ${rect(980, 0, 400, height, '#edf5f8')}
    ${rect(0, 0, 1380, 30, '#aebbc4')}${rect(0, height - 30, 1380, 30, '#aebbc4')}
    ${rect(0, storage.baseBoardBottom, 1380, storage.boardThickness, '#ccc7b5')}
    ${storage.layers.map(l => `${rect(0, l.supportBottom, 1380, storage.supportHeight, '#aebbc4')}${rect(0, l.boardBottom, 1380, storage.boardThickness, '#ccc7b5')}${label(490, (l.floor + l.ceiling) / 2, `${l.label} · 净高${l.netHeight}`, 36)}${dim(1615, l.floor, l.ceiling, String(l.netHeight))}`).join('')}
    ${[0, 980, 1350].map(x => rect(x, 0, 30, height, x === 980 ? '#40899e' : '#aebbc4')).join('')}
    ${label(490, (storage.reserveFloor + storage.reserveCeiling) / 2 + 50, '上部预留', 46)}${label(490, (storage.reserveFloor + storage.reserveCeiling) / 2 - 50, `净高${storage.reserveHeight}`, 46)}
    ${label(1180, 2120, '共用转角', 34, '#17667d')}
    ${dim(70, 0, height, '2350')}${dim(1615, storage.reserveFloor, storage.reserveCeiling, String(storage.reserveHeight))}
    <path d="M${ox} 2580H${ox + 1380}" stroke="#8796a1"/><rect x="${ox + 570}" y="2552" width="240" height="56" fill="white"/><text x="${ox + 690}" y="2580" text-anchor="middle" dominant-baseline="central" style="font-size:48px">1380</text>
    ${label(690, -180, '标注为净高，已扣除层板与承梁', 32)}
  </svg>`;
  const schedule = document.getElementById('left-shelf-schedule');
  if (schedule) schedule.innerHTML = `<table><caption>左柜从下往上 · 单位 mm</caption><thead><tr><th>层位</th><th>用途</th><th>净高</th><th>净空离地范围</th></tr></thead><tbody>${storage.layers.map(l => `<tr><td>第${l.id}层</td><td>${l.label}</td><td>${l.netHeight}</td><td>${l.floor}—${l.ceiling}</td></tr>`).join('')}<tr><td>上部预留</td><td>后续细化</td><td>${storage.reserveHeight}</td><td>${storage.reserveFloor}—${storage.reserveCeiling}</td></tr></tbody></table>`;
}

export function drawBenchRightElevation() {
  const ox = 180, oy = 130, height = model.dimensions.height;
  const rect = (z, low, width, high, color) => `<rect x="${ox + z}" y="${oy + height - low - high}" width="${width}" height="${high}" fill="${color}"/>`;
  function dim(x, y, u, v, label, vertical = false) { return `<g stroke="#8796a1" fill="none"><path d="M${x} ${y}L${u} ${v}"/><path d="M${x - 9} ${y + 9}l18 -18M${u - 9} ${v + 9}l18 -18"/></g><g transform="translate(${(x + u) / 2} ${(y + v) / 2})${vertical ? ' rotate(-90)' : ''}"><rect x="-110" y="-30" width="220" height="60" fill="white"/><text text-anchor="middle" dominant-baseline="central" font-size="48">${label}</text></g>`; }
  document.getElementById('right-drawing').innerHTML = `<svg viewBox="0 0 1730 2700" role="img" aria-label="右侧立面：沿墙总长1350、外高2350，顶部怪兽小屋灯箱920乘180乘80，底面离地2140；坐面高500，坐面至灯箱底净空1640，下层穿过鞋、上层拖鞋">
    <style>#right-drawing text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;fill:#53616b;font-size:40px}#right-drawing path,#right-drawing rect{vector-effect:non-scaling-stroke}</style>
    ${rect(0, 0, 400, height, '#f1f3f5')}
    ${rect(0, 0, 30, height, '#aebbc4')}${rect(370, 0, 30, height, '#40899e')}${rect(1320, 0, 30, height, '#aebbc4')}
    ${rect(0, height - 30, 1350, 30, '#aebbc4')}${rect(0, 0, 1350, 30, '#aebbc4')}
    ${rect(400, 2140, 920, 180, '#4b595b')}${rect(410, 2150, 900, 160, '#fff6dc')}
    <text x="${ox + 860}" y="${oy + height - 2230}" text-anchor="middle" dominant-baseline="central" style="font-size:72px;font-weight:700;fill:#293b3c;letter-spacing:24px">怪兽小屋</text>
    ${rect(400, 476, 920, 24, '#cbb591')}${rect(400, 446, 920, 30, '#aebbc4')}
    ${bench.drawers.map((d, i) => `${rect(404, d.faceBottom, bench.faceWidth, bench.frontHeight, '#d8eef4')}<rect x="${ox + 404}" y="${oy + height - d.faceTop}" width="${bench.faceWidth}" height="${bench.frontHeight}" fill="none" stroke="#6198a8"/>${rect(790, d.padY - 12, 140, 24, '#537681')}<text x="${ox + 860}" y="${oy + height - d.floor - 112}" text-anchor="middle">${i ? '上层 · 拖鞋' : '下层 · 穿过的鞋'}</text><text x="${ox + 860}" y="${oy + height - d.floor - 66}" text-anchor="middle" style="font-size:32px">可用净高${d.insideHeight}</text>`).join('')}
    <text x="${ox + 200}" y="${oy + 180}" text-anchor="middle">左柜占用</text>
    <text x="${ox + 860}" y="${oy + 350}" text-anchor="middle">灯箱920 × 180 × 80</text>
    <text x="${ox + 860}" y="${oy + 1800}" text-anchor="middle" fill="#9a6930">坐面顶高500</text>
    ${dim(70, oy, 70, oy + height, '2350', true)}${dim(ox, 2590, ox + 1350, 2590, '1350')}
    ${dim(ox + 860, oy + 210, ox + 860, oy + 1850, '净空1640', true)}${dim(ox + 1430, oy + 1850, ox + 1430, oy + height, '500', true)}
  </svg>`;
}

export function drawBenchSection() {
  const host = document.getElementById('bench-section');
  if (!host) return;
  const ox = 130, ground = 650;
  const rect = (x, low, width, height, color, extra = '') => `<rect x="${ox + x}" y="${ground - low - height}" width="${width}" height="${height}" fill="${color}" ${extra}/>`;
  function dim(x, y, u, v, label, vertical = false) {
    return `<g stroke="#8796a1" fill="none"><path d="M${x} ${y}L${u} ${v}"/><path d="M${x - 5} ${y + 5}l10 -10M${u - 5} ${v + 5}l10 -10"/></g><g transform="translate(${(x + u) / 2} ${(y + v) / 2})${vertical ? ' rotate(-90)' : ''}"><rect x="-64" y="-18" width="128" height="36" fill="white"/><text text-anchor="middle" dominant-baseline="central">${label}</text></g>`;
  }
  host.innerHTML = `<svg viewBox="0 0 1060 800" role="img" aria-label="换鞋凳侧剖：坐面顶高500、板厚24、坐深400；透明亚克力托盘12毫米，前挡边高40，踢脚条中心离地下层72、上层300；下层换下的鞋可用净高182，上层拖鞋150，两抽独立移动300毫米">
    <style>#bench-section text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;font-size:22px;fill:#53616b}#bench-section path,#bench-section rect,#bench-section line{vector-effect:non-scaling-stroke}</style>
    <path d="M90 650H1000" stroke="#b9c4cc" stroke-width="1"/>
    ${rect(0, 476, 400, 24, '#cbb591')}${rect(0, 446, 30, 30, '#a8b7c1')}${rect(370, 446, 30, 30, '#a8b7c1')}
    ${rect(30, 30, 340, 416, '#e8e5dc', 'fill-opacity=".35" stroke="#c9cdc9"')}
    ${rect(30, bench.dividerBottom, 340, 18, '#c9c3b0')}${rect(0, 0, 400, 30, '#a8b7c1')}
    ${bench.drawers.map((d, i) => `${rect(70, d.floor, 300, 12, '#d7eef5', 'fill-opacity=".55" stroke="#6a9cab"')}${rect(70, d.floor + 12, 300, 40, '#d7eef5', 'fill-opacity=".22" stroke="#6a9cab"')}${rect(370, d.faceBottom, bench.faceThickness, bench.frontHeight, '#d7eef5', 'fill-opacity=".55" stroke="#6a9cab"')}${rect(bench.faceFront, d.padY - 12, 2, 24, '#537681')}${rect(370, d.floor, 300, d.height, 'none', 'stroke="#17667d" stroke-dasharray="6 4"')}
      <text x="350" y="${ground - d.floor - 100}" text-anchor="middle">${i ? '拖鞋' : '穿过的鞋'}</text>
      ${dim(ox + 440, ground - (i ? 446 : bench.dividerBottom), ox + 440, ground - d.floor - 12 - d.matThickness, String(d.insideHeight), true)}`).join('')}
    ${dim(60, ground - 500, 60, ground, '坐面500', true)}${dim(ox, 90, ox + 400, 90, '坐深400')}
    ${dim(ox + bench.faceFront, 730, ox + bench.faceFront + 300, 730, '行程300')}
    <text x="925" y="200" text-anchor="middle" fill="#17667d">透明亚克力12</text>
    <text x="925" y="240" text-anchor="middle">前挡边高40</text>
    <text x="925" y="300" text-anchor="middle">踢脚条中心离地</text>
    <text x="925" y="340" text-anchor="middle">下层72 / 上层300</text>
    <text x="925" y="420" text-anchor="middle">虚线：完全抽出</text>
    <text x="925" y="460" text-anchor="middle">两抽独立移动</text>
    <text x="510" y="125">板厚24</text>
  </svg>`;
}
