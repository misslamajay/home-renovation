export const enclosure = Object.freeze({
  revision: 3, panelThickness: 6, doorFrame: 20, closedDepth: 422, maxAngle: 90,
  palette: { blue: '#008eff', yellow: '#ffd400', red: '#ed302a', black: '#202725' },
  groups: [
    { id: 'red', label: '左扇红门', hinge: [1347, 422], direction: -1, span: 461, bottom: 33, top: 2317, color: [.93, .188, .165], postX: 1360 },
    { id: 'yellow', label: '右扇黄门', hinge: [425, 422], direction: 1, span: 461, bottom: 33, top: 2317, color: [1, .831, 0], postX: 390 },
  ],
});

const silver = [.72, .78, .82], charcoal = [.125, .153, .145], blue = [0, .557, 1];
const rotate = (v, a) => [v[0] * Math.cos(a) - v[2] * Math.sin(a), v[1], v[0] * Math.sin(a) + v[2] * Math.cos(a)];

export function enclosureParts(model, angles = [0, 0], visible = true) {
  const fixed = [], doors = [], hardware = [];
  const add = (list, id, center, size, color = charcoal, extra = {}) => list.push({ id, center, size, color, ...extra });
  const vertical = [...model.leftStorage.layers, { id: 'reserve', floor: model.leftStorage.reserveFloor, ceiling: model.leftStorage.reserveCeiling }];
  for (const layer of vertical) {
    const y = (layer.floor + layer.ceiling) / 2, h = layer.ceiling - layer.floor;
    add(fixed, 'finish-left-back-' + layer.id, [690, y, 15], [1320, h, 6]);
    add(fixed, 'finish-left-end-' + layer.id, [1365, y, 200], [6, h, 340], blue);
    const closedTop = Math.min(layer.ceiling, model.cornerStorage.openingBottom);
    if (closedTop > layer.floor) add(fixed, 'finish-shared-side-' + layer.id, [200, (layer.floor + closedTop) / 2, 385], [340, closedTop - layer.floor, 6]);
  }
  for (const [a, b] of [[400, 845], [875, 1320]]) add(fixed, 'finish-bench-back-' + a, [15, (model.bench.supportBottom + 30) / 2, (a + b) / 2], [6, model.bench.supportBottom - 30, b - a]);
  const peg = model.pegboard;
  add(fixed, 'finish-upper-back', [(peg.back + peg.front) / 2, (peg.bottom + peg.top) / 2, 860], [peg.thickness, peg.height, peg.width], [.97, .97, .96], { material: 'pegboard', kind: 'pegboard' });
  add(fixed, 'finish-lightbox-back', [15, (model.lightbox.bottom + 2320) / 2, 860], [6, 2320 - model.lightbox.bottom, 920]);
  for (const z of [peg.zMin + 12, peg.zMax - 12]) for (const y of [peg.bottom + 50, (peg.bottom + peg.top) / 2, peg.top - 50]) {
    add(fixed, `pegboard-stand-off-${z}-${y}`, [peg.back / 2, y, z], [peg.standOff, 24, 24], silver, { kind: 'pegboard-mount' });
  }
  add(fixed, 'finish-right-end', [200, 1175, 1335], [340, 2290, 6], blue);
  add(fixed, 'finish-left-roof', [690, 2323, 200], [1320, 6, 340]);
  add(fixed, 'finish-right-roof', [200, 2323, 860], [340, 6, 920]);
  const trimBottom = model.bench.seatTop + 3;
  add(fixed, 'finish-corner-trim', [411, (trimBottom + 2317) / 2, 411], [22, 2317 - trimBottom, 22], silver);
  add(fixed, 'finish-corner-lower', [411, (33 + model.bench.seatTop) / 2, 401], [22, model.bench.seatTop - 33, 2], silver);

  // Independent outer hinges replace the folding joint and its guide track.
  enclosure.groups.forEach((group, index) => {
    const theta = Math.max(0, Math.min(enclosure.maxAngle, Number(angles[index]) || 0)) * Math.PI / 180;
    const angle = group.direction * theta, height = group.top - group.bottom, width = group.span - 4;
    const center = rotate([group.direction * group.span / 2, 0, -10], angle)
      .map((v, k) => v + [group.hinge[0], (group.top + group.bottom) / 2, group.hinge[1]][k]);
    const part = (id, offset, size, color, kind = 'door') => add(doors, group.id + '-door-' + id, rotate(offset, angle).map((v, k) => v + center[k]), size, color, { angle, group: group.id, leaf: 0, kind });
    for (const side of [-1, 1]) part('stile-' + side, [side * (width - 20) / 2, 0, 0], [20, height, 20], silver);
    for (const side of [-1, 1]) part('rail-' + side, [0, side * (height - 20) / 2, 0], [width - 40, 20, 20], silver);
    part('color-panel', [0, 0, 0], [width - 40, height - 40, 6], group.color, 'color-panel');
    part('pull', [group.direction * (width / 2 - 70), 0, 5], [80, 18, 3], [.13, .2, .22], 'handle');
    for (const y of [100, 600, 1175, 1750, 2250]) {
      const minX = Math.min(group.postX, group.hinge[0]) - 10, maxX = Math.max(group.postX, group.hinge[0]) + 10;
      add(hardware, group.id + '-hinge-mount-' + y, [(minX + maxX) / 2, y, 401.5], [maxX - minX, 34, 3], silver, { kind: 'hinge', group: group.id });
      add(hardware, group.id + '-hinge-arm-' + y, [group.hinge[0], y, 412.5], [6, 34, 19], silver, { kind: 'hinge', group: group.id });
      add(hardware, group.id + '-hinge-knuckle-' + y, [group.hinge[0], y, group.hinge[1]], [6, 34, 6], [.46, .53, .56], { kind: 'hinge', group: group.id });
    }
  });
  return { fixed, doors, hardware, boxes: visible ? [...fixed, ...doors, ...hardware] : [] };
}
