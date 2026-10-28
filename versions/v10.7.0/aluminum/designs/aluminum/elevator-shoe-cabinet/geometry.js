export const dimensions = Object.freeze({ left: 1380, right: 1350, depth: 400, height: 2350, section: 30, corner: 400, netHeight: 2290 });
const { left: L, right: R, depth: D, height: H, section: S } = dimensions;
const h = S / 2;
// Local X and Z start at the same wall corner. The left cabinet owns the corner;
// the right cabinet starts at Z=400 and shares posts E and H with the left one.
export const footprint = [[0, 0], [L, 0], [L, D], [D, D], [D, R], [0, R]];
export const posts = [
  { id: 'A', x: h, z: h, group: 'corner' },
  { id: 'C', x: L - h, z: h, group: 'left' },
  { id: 'D', x: L - h, z: D - h, group: 'left' },
  { id: 'E', x: D - h, z: D - h, group: 'corner' },
  { id: 'F', x: D - h, z: R - h, group: 'right' },
  { id: 'G', x: h, z: R - h, group: 'right' },
  { id: 'H', x: h, z: D - h, group: 'corner' },
];
export const edges = [['A', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'A'], ['H', 'E']];
export const cornerLayout = Object.freeze({ type: 'left-through', owner: 'left', sharedPosts: ['E', 'H'], rightSegment: R - D, leftOpening: L - D - S, rightOpening: R - D - S });
// Reference lines are an optional comparison overlay, never physical members.
export const referenceMembers = [
  { id: 'removed-post-B', center: [D - h, H / 2, h], size: [S, H, S] },
  ...[h, H - h].map(y => ({ id: `removed-crossbar-${y}`, center: [D - h, y, D / 2], size: [S, S, D - 2 * S] })),
];
const byID = Object.fromEntries(posts.map(p => [p.id, p]));
export const members = posts.map(p => ({ id: 'post-' + p.id, kind: 'post', group: p.group, axis: 1, center: [p.x, H / 2, p.z], size: [S, H, S] }));
for (const [level, y] of [['bottom', h], ['top', H - h]]) {
  for (const [from, to] of edges) {
    const a = byID[from], b = byID[to], axis = a.x === b.x ? 2 : 0;
    const size = [S, S, S];
    size[axis] = Math.abs(axis === 0 ? b.x - a.x : b.z - a.z) - S;
    members.push({ id: `${level}-${from}${to}`, kind: level, axis, center: [(a.x + b.x) / 2, y, (a.z + b.z) / 2], size });
  }
}
export const model = Object.freeze({ name: '电梯鞋柜 · 左贯通转角框架', revision: 2, dimensions, footprint, posts, edges, members, cornerLayout, referenceMembers, measurement: '两侧从同一个墙角量起；400×400转角归左柜，右柜从400处接入' });
