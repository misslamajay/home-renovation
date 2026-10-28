import { model as frame } from './geometry.js';

const shelfSpecs = [
  ['鞋类收纳', 160], ['拖鞋', 160], ['休闲鞋', 170],
  ['休闲鞋', 170], ['休闲鞋', 170], ['小平板鞋', 130],
  ['高筒鞋', 260], ['鞋类收纳', 160], ['鞋类收纳', 160],
];
const baseFloor = 48, supportHeight = 30, boardThickness = 18, seatThickness = 24;
const dividerTop = baseFloor + shelfSpecs[0][1] + supportHeight + boardThickness;
const leftSecondTop = dividerTop + shelfSpecs[1][1] + supportHeight + boardThickness;
const dividerBottom = dividerTop - boardThickness;
const upperTrayFloor = dividerTop + 2;
const upperTrayNetHeight = 160, supportBottom = upperTrayFloor + 12 + upperTrayNetHeight;
const seatTop = supportBottom + supportHeight + seatThickness;
export const bench = Object.freeze({
  seatTop, seatThickness, seatBottom: seatTop - seatThickness, seatWidth: 920, seatDepth: 400,
  zMin: 400, zMax: 1320, supportY: supportBottom + supportHeight / 2, supportBottom, dividerBottom, dividerTop,
  travel: 300, drawerWidth: 850, drawerDepth: 300, wallThickness: 12,
  faceWidth: 888, faceCenterZ: 872, faceZMin: 428, faceThickness: 12, faceBack: 370, faceFront: 382, frontHeight: 40, rimHeight: 40,
  drawers: [
    { id: 'used', label: '下层 · 穿过的鞋', floor: 56, height: 52, faceBottom: 56, faceTop: 96, matThickness: 2, insideHeight: dividerBottom - 70, railY: 84, padY: 72 },
    { id: 'slippers', label: '上层 · 拖鞋', floor: upperTrayFloor, height: 52, faceBottom: upperTrayFloor, faceTop: upperTrayFloor + 40, matThickness: 0, insideHeight: supportBottom - upperTrayFloor - 12, railY: upperTrayFloor + 28, padY: upperTrayFloor + 16 },
  ],
});
export const lightbox = Object.freeze({
  text: '怪兽小屋', width: 920, height: 180, depth: 80,
  bottom: 2140, top: 2320, front: 370, zMin: 400, zMax: 1320,
  faceWidth: 900, faceHeight: 160, color: '暖白',
});
const pegBottom = bench.seatTop + 3, pegTop = lightbox.bottom - 3;
const pegWidth = bench.seatWidth, pegHeight = pegTop - pegBottom, pegPitch = 25, pegMargin = 20;
const pegColumns = Math.floor((pegWidth - 2 * pegMargin) / pegPitch) + 1;
const pegRows = Math.floor((pegHeight - 2 * pegMargin) / pegPitch) + 1;
export const pegboard = Object.freeze({
  width: pegWidth, height: pegHeight, thickness: 2, bottom: pegBottom, top: pegTop,
  zMin: bench.zMin, zMax: bench.zMax, back: 20, front: 22, standOff: 20,
  holeDiameter: 8, pitch: pegPitch, columns: pegColumns, rows: pegRows,
  firstY: pegBottom + (pegHeight - (pegRows - 1) * pegPitch) / 2,
  firstZ: bench.zMin + (pegWidth - (pegColumns - 1) * pegPitch) / 2,
  finish: '白色喷粉金属', provisional: true,
});
let shelfFloor = baseFloor;
const layers = shelfSpecs.map(([label, netHeight], index) => {
  const floor = shelfFloor, ceiling = floor + netHeight;
  shelfFloor = ceiling + supportHeight + boardThickness;
  return Object.freeze({ id: index + 1, label, netHeight, floor, ceiling, clearWidth: ceiling > bench.seatTop ? 950 : 1320, supportBottom: ceiling, boardBottom: ceiling + supportHeight, boardTop: shelfFloor });
});
export const leftStorage = Object.freeze({
  layers, baseBoardBottom: 30, baseFloor, boardThickness, supportHeight,
  boardWidth: 1380, boardDepth: 400, clearWidth: 1320, mainClearWidth: 950, clearDepth: 340,
  reserveFloor: shelfFloor, reserveCeiling: 2320, reserveHeight: 2320 - shelfFloor,
});
export const cornerStorage = Object.freeze({
  openingBottom: bench.seatTop, openingTop: 2320, openingWidth: 340, clearDepth: 340,
  dividerX: 391, dividerThickness: 18, direction: '从换鞋凳侧取物',
  compartments: [...layers, { id: 'reserve', label: '顶部收纳', floor: shelfFloor, ceiling: 2320 }]
    .filter(layer => layer.ceiling > bench.seatTop)
    .map(layer => ({ id: layer.id, label: layer.label, floor: layer.floor, ceiling: layer.ceiling, openingBottom: Math.max(bench.seatTop, layer.floor), openingHeight: layer.ceiling - Math.max(bench.seatTop, layer.floor) })),
});
const members = [...frame.members];
const bar = (id, axis, center, size) => members.push({ id, kind: 'bench-support', group: 'bench', axis, center, size });
for (const x of [15, 385]) bar('seat-long-' + x, 2, [x, bench.supportY, 860], [30, 30, 920]);
for (const z of [415, 860, 1305]) bar('seat-cross-' + z, 0, [200, bench.supportY, z], [340, 30, 30]);
for (const z of [415, 1305]) bar('bench-base-' + z, 0, [200, 15, z], [340, 30, 30]);
const sideHeight = bench.supportBottom - 30, sideCenter = (bench.supportBottom + 30) / 2;
bar('seat-rear-leg', 1, [15, sideCenter, 860], [30, sideHeight, 30]);
const fixtures = [
  { id: 'seat-board', center: [200, (bench.seatTop + bench.seatBottom) / 2, 860], size: [400, bench.seatThickness, 920], color: [.8, .71, .56] },
  ...[409, 1311].map(z => ({ id: 'bench-side-' + z, center: [200, sideCenter, z], size: [340, sideHeight, 18], color: [.78, .75, .68] })),
  { id: 'drawer-divider', center: [200, (bench.dividerBottom + bench.dividerTop) / 2, 860], size: [340, 18, 884], color: [.8, .78, .71] },
  ...[2145, 2315].map(y => ({ id: 'lightbox-rim-' + y, center: [330, y, 860], size: [80, 10, 920], color: [.29, .35, .37] })),
  ...[405, 1315].map(z => ({ id: 'lightbox-side-' + z, center: [330, 2230, z], size: [80, 160, 10], color: [.29, .35, .37] })),
  { id: 'lightbox-back', center: [293, 2230, 860], size: [6, 160, 900], color: [.36, .41, .43] },
  { id: 'lightbox-diffuser', center: [368, 2230, 860], size: [4, 160, 900], color: [1, .97, .86] },
];
const postByID = Object.fromEntries(frame.posts.map(p => [p.id, p]));
for (const layer of layers) {
  for (const [from, to] of [['A', 'C'], ['C', 'D'], ['D', 'E'], ['H', 'E'], ['H', 'A']]) {
    const a = postByID[from], b = postByID[to], axis = a.x === b.x ? 2 : 0;
    const size = [30, 30, 30]; size[axis] = Math.abs(axis === 0 ? b.x - a.x : b.z - a.z) - 30;
    members.push({ id: `left-shelf-${layer.id}-${from}${to}`, kind: 'shelf-support', group: 'left-storage', axis, center: [(a.x + b.x) / 2, layer.ceiling + 15, (a.z + b.z) / 2], size });
  }
}
// Six non-overlapping rectangles form one notched panel around the five posts.
const panelSegments = [
  [690, 200, 1320, 340], [690, 15, 1320, 30],
  [200, 385, 340, 30], [875, 385, 950, 30],
  [15, 200, 30, 340], [1365, 200, 30, 340],
];
for (const [index, bottom] of [leftStorage.baseBoardBottom, ...layers.map(l => l.boardBottom)].entries()) {
  for (const [segment, [x, z, width, depth]] of panelSegments.entries()) {
    fixtures.push({ id: `left-board-${index}-${segment}`, kind: 'shelf-board', layer: index, center: [x, bottom + 9, z], size: [width, 18, depth], color: [.8, .78, .71] });
  }
}
for (const compartment of cornerStorage.compartments) {
  const bottom = compartment.openingBottom, top = compartment.ceiling;
  fixtures.push({ id: 'corner-divider-' + compartment.id, kind: 'corner-divider', center: [cornerStorage.dividerX, (bottom + top) / 2, 200], size: [18, top - bottom, 340], color: [.125, .153, .145] });
}
export const model = Object.freeze({
  ...frame, name: '电梯鞋柜 · 两侧拖鞋净高160与白色洞洞板', revision: 16,
  members, fixtures, bench, lightbox, pegboard, leftStorage, cornerStorage,
  alignment: { dividerTop: layers[0].boardTop, leftShelfTop: leftSecondTop, seatTop, heightDifference: seatTop-leftSecondTop },
  measurement: `左右上层均为实际净高160；第一层板面和中隔板同高${dividerTop}；左第二层板面${leftSecondTop}、凳面${seatTop}，因托盘与承梁扣除不同而相差${seatTop-leftSecondTop}；下层托盘净高${bench.drawers[0].insideHeight}`,
});

// Rails and pressure pads illustrate the intended motion; hardware is not selected.
export function benchParts(travels) {
  const boxes = [], shoes = [], drawers = [];
  function part(id, center, size, color, travel = 0, material) {
    boxes.push({ id, center: [center[0] + travel, center[1], center[2]], size, color, ...(material ? { material } : {}) });
  }
  bench.drawers.forEach((drawer, i) => {
    const travel = Math.max(0, Math.min(bench.travel, Number(travels[i]) || 0)), id = 'drawer-' + i;
    const move = (name, center, size, color) => part(id + '-' + name, center, size, color, travel);
    const acrylic = (name, center, size) => part(id + '-' + name, center, size, [.70, .89, .96, .16], travel, 'acrylic');
    const innerFloor = drawer.floor + 12, wallHeight = drawer.height - 12, wallY = innerFloor + wallHeight / 2;
    acrylic('bottom', [220, drawer.floor + 6, 860], [300, 12, 850]);
    for (const z of [441, 1279]) acrylic('side-' + z, [220, wallY, z], [300, wallHeight, 12]);
    for (const x of [76, 364]) acrylic('end-' + x, [x, wallY, 860], [12, wallHeight, 826]);
    acrylic('front', [(bench.faceBack + bench.faceFront) / 2, (drawer.faceTop + drawer.faceBottom) / 2, bench.faceCenterZ], [bench.faceThickness, bench.frontHeight, bench.faceWidth]);
    move('kick-pad', [bench.faceFront + 1, drawer.padY, bench.faceCenterZ], [2, 24, 140], [.28, .42, .48]);
    if (drawer.matThickness) move('washable-mat', [220, innerFloor + 1, 860], [276, 2, 826], [.82, .91, .94, .2]);
    for (const side of [0, 1]) {
      const z = side ? 1293.5 : 426.5;
      part(id + '-rail-spacer-' + side, [220, drawer.railY, side ? 1300.5 : 419.5], [300, 24, 3], [.56, .62, .66]);
      part(id + '-rail-fixed-' + side, [220, drawer.railY, z], [300, 12, 11], [.4, .48, .54]);
      part(id + '-rail-middle-' + side, [220, drawer.railY, side ? 1290 : 430], [300, 10, 6], [.58, .66, .71], travel / 2);
      part(id + '-rail-moving-' + side, [220, drawer.railY, side ? 1286.5 : 433.5], [300, 8, 3], [.72, .78, .8], travel);
    }
    for (const [j, z] of [560, 680, 1040, 1160].entries()) {
      const y = innerFloor + drawer.matThickness;
      move('shoe-sole-' + j, [220, y + (i ? 4 : 5), z], [i ? 250 : 260, i ? 8 : 10, 100], i ? [.83, .8, .7] : [.88, .88, .84]);
      shoes.push({ center: [i ? 255 + travel : 215 + travel, y + (i ? 24 : 50), z], radii: i ? [45, 18, 47] : [125, 42, 47], color: i ? [.73, .65, .48] : j < 2 ? [.28, .4, .49] : [.5, .47, .42] });
    }
    drawers.push({ id: drawer.id, label: drawer.label, travel, insideHeight: drawer.insideHeight, front: bench.faceFront + travel, floor: innerFloor + drawer.matThickness });
  });
  return { boxes, shoes, drawers };
}
