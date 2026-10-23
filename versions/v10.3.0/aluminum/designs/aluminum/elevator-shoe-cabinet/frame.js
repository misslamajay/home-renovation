import { model as originalModel } from './geometry.js';
import { model as benchModel, benchParts } from './bench-geometry.js';
import { drawBenchSection, drawBenchRightElevation, drawLeftStorageElevation } from './bench-drawings.js';
const hasBench = document.body.dataset.layout === 'bench';
const model = hasBench ? benchModel : originalModel;
const { dimensions: d, members, footprint, posts, cornerLayout, referenceMembers } = model;
const root = document.getElementById('shoe-cabinet-frame');
const state = { yaw: -.64, pitch: .3, zoom: 1, view: 'overall', focus: 'all', walls: true, dimensions: true, reference: false, drawerTravel: hasBench ? [220, 120] : [] };
root._frame = { ...model, state, ready: false };
window.shoeCabinet = root._frame;
const embedded = parent !== window && new URLSearchParams(location.search).get('embed') === '1';
let previousHeight = 0;
function reportSize() {
  const height = Math.ceil(document.body.getBoundingClientRect().height);
  if (embedded && height !== previousHeight) { previousHeight = height; parent.postMessage({ type: 'zhuji-design-size', height }, location.origin); }
}
new ResizeObserver(reportSize).observe(document.body);
addEventListener('load', reportSize);

const svgStyle = `<style>text{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;fill:#53616b;font-size:38px}line,path,rect,polygon{vector-effect:non-scaling-stroke}.dim{stroke:#89959f;stroke-width:1;fill:none}.label{fill:#fff;stroke:none}.left{fill:#17667d}.right{fill:#9a6930}</style>`;
function dimension(x1, y1, x2, y2, text, vertical = false) {
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  return `<g class="dim"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><path d="M${x1 - 9},${y1 + 9}l18,-18M${x2 - 9},${y2 + 9}l18,-18"/></g><g transform="translate(${cx},${cy})${vertical ? ' rotate(-90)' : ''}"><rect class="label" x="-130" y="-30" width="260" height="60"/><text text-anchor="middle" dominant-baseline="central" style="font-size:50px">${text}</text></g>`;
}
function drawPlan() {
  const origin = [1550, 200], xy = ([x, z]) => [origin[0] - x, origin[1] + z];
  const polygon = footprint.map(p => xy(p).join(',')).join(' ');
  const bars = members.filter(m => m.kind === 'top').map(m => `<rect x="${origin[0] - m.center[0] - m.size[0] / 2}" y="${origin[1] + m.center[2] - m.size[2] / 2}" width="${m.size[0]}" height="${m.size[2]}" fill="${m.id.endsWith('-HE') ? '#40899e' : '#b0bdc5'}"/>`).join('');
  const columns = posts.map(p => `<rect x="${origin[0] - p.x - 15}" y="${origin[1] + p.z - 15}" width="30" height="30" fill="${cornerLayout.sharedPosts.includes(p.id) ? '#17667d' : '#8f9da7'}"/>`).join('');
  document.getElementById('plan-drawing').innerHTML = `<svg viewBox="0 0 1780 1750" role="img" aria-label="七柱框架俯视：左柜贯通1380，400乘400转角归左柜，右柜从400处接入、独立段外长950毫米，沿墙总长1350毫米">${svgStyle}
    <defs><pattern id="corner-hatch" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M0 26L26 0" stroke="#b4d0da" stroke-width="1"/></pattern><marker id="access-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#17667d"/></marker></defs>
    <path d="M140 178H1572V1580" fill="none" stroke="#c7d0d7" stroke-width="3" stroke-dasharray="8 5"/>
    <polygon points="${polygon}" fill="#f9fbfc" stroke="#b5c1c9" stroke-width="1"/>
    <rect x="1150" y="600" width="400" height="950" fill="#faf5ed"/>
    ${hasBench ? '<rect x="1150" y="600" width="400" height="920" fill="#e1d3b9"/>' : ''}
    <rect x="1150" y="200" width="400" height="400" fill="#edf5f8"/><rect x="1150" y="200" width="400" height="400" fill="url(#corner-hatch)"/>
    ${bars}${columns}<text x="650" y="350" text-anchor="middle" class="left">左柜贯通 1380</text><text x="1350" y="990" text-anchor="middle" class="right">${hasBench ? '换鞋凳' : '右侧独立段'}</text><text x="1350" y="1060" text-anchor="middle" class="right">${hasBench ? '坐面高500' : '外长950'}</text>${hasBench ? '<text x="1350" y="1130" text-anchor="middle" style="font-size:28px">坐板920 × 400</text>' : ''}
    <text x="1350" y="310" text-anchor="middle" style="font-size:32px">转角归左柜</text><text x="1350" y="365" text-anchor="middle" style="font-size:30px">400 × 400</text>
    <path d="M850 720V430H1350" fill="none" stroke="#17667d" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#access-arrow)"/><text x="850" y="795" text-anchor="middle" class="left" style="font-size:32px">从左侧伸手取物</text>
    <circle cx="1550" cy="200" r="7" fill="#17667d"/><text x="1530" y="153" text-anchor="end" style="font-size:30px">共同墙角</text>
    ${dimension(170, 80, 1550, 80, '1380')}${dimension(1660, 200, 1660, 1550, '1350', true)}
    ${dimension(70, 200, 70, 600, '400', true)}${dimension(1150, 1650, 1550, 1650, '400')}${dimension(1050, 600, 1050, 1550, '950', true)}
  </svg>`;
}
function drawElevation(side) {
  if (hasBench && side === 'left') { drawLeftStorageElevation(); return; }
  if (hasBench && side === 'right') { drawBenchRightElevation(); return; }
  const left = side === 'left', length = left ? d.left : d.right, ox = 180, oy = 130;
  const centers = left ? [15, d.left - d.depth + 15, d.left - 15] : [15, d.depth - 15, d.right - 15];
  const cornerX = ox + (left ? length - d.depth : 0), mainX = left ? ox + (length - d.depth) / 2 : ox + d.depth + (length - d.depth) / 2;
  const bars = centers.map((x, i) => `<rect x="${ox + x - 15}" y="${oy}" width="30" height="${d.height}" fill="${left ? i > 0 ? '#40899e' : '#aebbc4' : i === 1 ? '#40899e' : '#aebbc4'}"/>`).join('');
  document.getElementById(side + '-drawing').innerHTML = `<svg viewBox="0 0 ${length + 380} ${d.height + 350}" role="img" aria-label="${left ? '左' : '右'}侧立面：沿墙总长${length}，外高${d.height}，框架内高${d.netHeight}，取物开口净宽${left ? cornerLayout.leftOpening : cornerLayout.rightOpening}毫米">${svgStyle}
    <rect x="${cornerX}" y="${oy}" width="400" height="${d.height}" fill="${left ? '#edf5f8' : '#f1f3f5'}"/>
    ${bars}<rect x="${ox}" y="${oy}" width="${length}" height="30" fill="#aebbc4"/><rect x="${ox}" y="${oy + d.height - d.section}" width="${length}" height="30" fill="#aebbc4"/>
    <text x="${cornerX + 200}" y="${oy + 180}" text-anchor="middle" style="font-size:44px">${left ? '左柜转角' : '左柜占用'}</text>
    ${dimension(70, oy, 70, oy + d.height, String(d.height), true)}${dimension(ox, d.height + 240, ox + length, d.height + 240, String(length))}
    ${dimension(mainX, oy + d.section, mainX, oy + d.height - d.section, String(d.netHeight), true)}
    <text x="${mainX}" y="${oy + 2140}" text-anchor="middle" style="font-size:44px">取物开口 ${left ? cornerLayout.leftOpening : cornerLayout.rightOpening}</text>
    <text x="${cornerX + 200}" y="${oy + 2140}" text-anchor="middle" style="font-size:38px">${left ? '从左侧取物' : '转角 400'}</text>
    <text x="${mainX}" y="${oy + 2020}" text-anchor="middle" style="font-size:36px">${left ? '后梁贯通 1320' : '独立段外长 950'}</text>
  </svg>`;
}

if (document.body.dataset.view === 'dimensions') {
  drawPlan(); drawElevation('left'); drawElevation('right'); if (hasBench) drawBenchSection(); root._frame.ready = true; reportSize();
} else {
  const canvas = document.getElementById('frame-canvas'), overlay = document.getElementById('dimension-overlay'), ctx = overlay.getContext('2d');
  const world = p => [-p[0], p[1], p[2]];
  const sub = (a, b) => a.map((x, i) => x - b[i]);
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const normalize = v => { const n = Math.hypot(...v) || 1; return v.map(x => x / n); };
  function multiply(a, b) { const out = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return out; }
  function lookAt(eye, target, up) {
    const z = normalize(sub(eye, target)), x = normalize(cross(up, z)), y = cross(z, x);
    return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
  }
  function ortho(halfHeight, aspect) { const w = halfHeight * aspect, n = 100, f = 20000; return new Float32Array([1 / w, 0, 0, 0, 0, 1 / halfHeight, 0, 0, 0, 0, -2 / (f - n), 0, 0, 0, -(f + n) / (f - n), 1]); }
  let width = 1, height = 1, matrix, scheduled = false;
  const profileTriangles = [], environmentTriangles = [];
  function triangle(output, a, b, c, normal, color) { output.push({ points: [a, b, c].map(world), normal: world(normal), color }); }
  function quad(output, a, b, c, e, normal, color) { triangle(output, a, b, c, normal, color); triangle(output, a, c, e, normal, color); }
  function rotate(v, angle = 0) { const c = Math.cos(angle), s = Math.sin(angle); return [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c]; }
  function box(output, part) {
    const points = Array.from({ length: 8 }, (_, i) => rotate(part.size.map((v, k) => ((i >> k) & 1 ? 1 : -1) * v / 2), part.angle).map((v, k) => v + part.center[k]));
    const faces = [[[0, 4, 6, 2], [-1, 0, 0]], [[1, 3, 7, 5], [1, 0, 0]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 6, 7, 3], [0, 1, 0]], [[0, 2, 3, 1], [0, 0, -1]], [[4, 5, 7, 6], [0, 0, 1]]];
    for (const [indices, normal] of faces) quad(output, ...indices.map(i => points[i]), rotate(normal, part.angle), part.color);
    if (part.material === 'acrylic') {
      // Fine tinted edges keep clear panels legible without making their faces opaque.
      for (let axis = 0; axis < 3; axis++) for (const a of [-1, 1]) for (const b of [-1, 1]) {
        const u = (axis + 1) % 3, v = (axis + 2) % 3, offset = [0, 0, 0];
        offset[u] = a * (part.size[u] / 2 - .4); offset[v] = b * (part.size[v] / 2 - .4);
        box(output, { center: rotate(offset, part.angle).map((n, i) => n + part.center[i]), size: part.size.map((n, i) => i === axis ? n : .8), angle: part.angle, color: [.32, .61, .69, .55] });
      }
    }
  }
  function shoe(output, part) {
    const point = (a, b) => rotate([part.radii[0] * Math.cos(a) * Math.cos(b), part.radii[1] * Math.sin(a), part.radii[2] * Math.cos(a) * Math.sin(b)], part.angle).map((v, k) => v + part.center[k]);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 14; j++) {
      const a = -Math.PI / 2 + i * Math.PI / 8, b = j * 2 * Math.PI / 14, c = a + Math.PI / 8, e = b + 2 * Math.PI / 14;
      const normal = rotate(normalize([Math.cos((a + c) / 2) * Math.cos((b + e) / 2) / part.radii[0], Math.sin((a + c) / 2) / part.radii[1], Math.cos((a + c) / 2) * Math.sin((b + e) / 2) / part.radii[2]]), part.angle);
      quad(output, point(a, b), point(a, e), point(c, e), point(c, b), normal, part.color);
    }
  }
  function buildMotion() {
    const data = benchParts(state.drawerTravel), triangles = [];
    for (const part of data.boxes) box(triangles, part);
    for (const part of data.shoes) shoe(triangles, part);
    root._frame.motion = data;
    return triangles;
  }
  let motionTriangles = hasBench ? buildMotion() : [];
  const polygon = [[-15, -15], [-4, -15], [-4, -9], [4, -9], [4, -15], [15, -15], [15, -4], [9, -4], [9, 4], [15, 4], [15, 15], [4, 15], [4, 9], [-4, 9], [-4, 15], [-15, 15], [-15, 4], [-9, 4], [-9, -4], [-15, -4]];
  const turn = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  function triangulate(poly) {
    const remaining = poly.map((_, i) => i), result = [];
    while (remaining.length > 3) {
      let found = false;
      for (let i = 0; i < remaining.length; i++) {
        const a = remaining[(i + remaining.length - 1) % remaining.length], b = remaining[i], c = remaining[(i + 1) % remaining.length];
        if (turn(poly[a], poly[b], poly[c]) <= 1e-6) continue;
        if (remaining.some(p => ![a, b, c].includes(p) && turn(poly[a], poly[b], poly[p]) >= -1e-6 && turn(poly[b], poly[c], poly[p]) >= -1e-6 && turn(poly[c], poly[a], poly[p]) >= -1e-6)) continue;
        result.push([a, b, c]); remaining.splice(i, 1); found = true; break;
      }
      if (!found) throw Error('型材截面无法生成');
    }
    result.push(remaining); return result;
  }
  const caps = triangulate(polygon);
  for (const member of members) {
    const shared = member.kind === 'post' ? cornerLayout.sharedPosts.includes(member.id.slice(5)) : member.id.endsWith('-HE');
    const outerColor = shared ? [.25, .61, .73] : [.72, .78, .82], innerColor = shared ? [.16, .4, .49] : [.42, .48, .53];
    const axis = member.axis, u = (axis + 1) % 3, v = (axis + 2) % 3, half = member.size[axis] / 2;
    const direction = rotate([axis === 0 ? 1 : 0, axis === 1 ? 1 : 0, axis === 2 ? 1 : 0], member.angle);
    const at = (point, end) => {
      const offset = [0, 0, 0]; offset[axis] = end * half; offset[u] = point[0]; offset[v] = point[1];
      const out = rotate(offset, member.angle).map((v, k) => v + member.center[k]);
      const cut = member.cuts?.[end === -1 ? 0 : 1];
      if (cut) { const distance = (cut.value - out[cut.axis]) / direction[cut.axis]; for (let k = 0; k < 3; k++) out[k] += distance * direction[k]; }
      return out;
    };
    for (let i = 0; i < polygon.length; i++) {
      const p = polygon[i], q = polygon[(i + 1) % polygon.length], du = q[0] - p[0], dv = q[1] - p[1], n = [0, 0, 0], len = Math.hypot(du, dv); n[u] = dv / len; n[v] = -du / len;
      const outer = (Math.abs(p[0]) === 15 && Math.abs(q[0]) === 15) || (Math.abs(p[1]) === 15 && Math.abs(q[1]) === 15);
      quad(profileTriangles, at(p, -1), at(q, -1), at(q, 1), at(p, 1), rotate(n, member.angle), outer ? outerColor : innerColor);
    }
    for (const end of [-1, 1]) { const n = [0, 0, 0]; n[axis] = end; const normal = member.cuts?.[end === -1 ? 0 : 1]?.normal || rotate(n, member.angle); for (const [a, b, c] of caps) triangle(profileTriangles, at(polygon[a], end), at(polygon[b], end), at(polygon[c], end), normal, outerColor); }
  }
  if (hasBench) for (const part of model.fixtures) box(profileTriangles, part);
  quad(environmentTriangles, [-60, 0, -3], [d.left + 120, 0, -3], [d.left + 120, d.height + 80, -3], [-60, d.height + 80, -3], [0, 0, 1], [.95, .97, .98]);
  quad(environmentTriangles, [-3, 0, -60], [-3, d.height + 80, -60], [-3, d.height + 80, d.right + 120], [-3, 0, d.right + 120], [1, 0, 0], [.92, .95, .97]);
  const floorTriangles = [];
  quad(floorTriangles, [0, -3, 0], [d.left, -3, 0], [d.left, -3, d.depth], [0, -3, d.depth], [0, 1, 0], [.965, .975, .98]);
  quad(floorTriangles, [0, -3, d.depth], [d.depth, -3, d.depth], [d.depth, -3, d.right], [0, -3, d.right], [0, 1, 0], [.965, .975, .98]);
  quad(floorTriangles, [0, -2, 0], [d.depth, -2, 0], [d.depth, -2, d.depth], [0, -2, d.depth], [0, 1, 0], [.86, .94, .96]);
  let gl, program, profileBuffer, environmentBuffer, floorBuffer, motionBuffer, transparentBuffer, upload, fallback;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) throw Error('WebGL unavailable');
    const shader = (type, source) => { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s)); return s; };
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, 'attribute vec3 position;attribute vec3 normal;attribute vec4 color;uniform mat4 matrix;varying vec3 n;varying vec4 c;void main(){n=normal;c=color;gl_Position=matrix*vec4(position,1.0);}'));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, 'precision mediump float;varying vec3 n;varying vec4 c;void main(){float light=.68+.30*max(dot(normalize(n),normalize(vec3(-.5,.85,.6))),0.0);if(c.r>.9)light=1.0;if(c.a<1.0)light=.94;gl_FragColor=vec4(c.rgb*light,c.a);}'));
    gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error('无法初始化三维视图');
    upload = (triangles, previous) => { const data = []; for (const t of triangles) for (const p of t.points) data.push(...p, ...t.normal, ...t.color.slice(0, 3), t.color[3] ?? 1); const buffer = previous?.buffer || gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW); return { buffer, count: data.length / 10 }; };
    profileBuffer = upload(profileTriangles); environmentBuffer = upload(environmentTriangles); floorBuffer = upload(floorTriangles);
    if (hasBench) motionBuffer = upload(motionTriangles.filter(t => (t.color[3] ?? 1) === 1));
  } catch { fallback = canvas.getContext('2d'); }
  function camera() {
    const close = hasBench && state.focus === 'bench';
    const signClose = hasBench && state.focus === 'lightbox';
    const shelvesClose = hasBench && state.focus === 'shelves';
    const target = shelvesClose ? [-690, (model.leftStorage.reserveFloor + 44) / 2, 200] : signClose ? [-330, 2220, 860] : close ? [-350, 310, 860] : [-d.left / 2, d.height / 2, d.right / 2], direction = [Math.sin(state.yaw) * Math.cos(state.pitch), Math.sin(state.pitch), Math.cos(state.yaw) * Math.cos(state.pitch)];
    const up = state.view === 'top' ? [0, 0, -1] : [0, 1, 0], view = lookAt(target.map((x, i) => x + direction[i] * 8000), target, up);
    let rx = 0, ry = 0;
    for (const x of shelvesClose ? [0, -1380] : signClose ? [-230, -460] : close ? [0, -760] : [0, -d.left]) for (const y of shelvesClose ? [0, model.leftStorage.reserveFloor + 94] : signClose ? [1980, 2420] : close ? [0, 650] : [0, d.height]) for (const z of shelvesClose ? [0, 400] : signClose ? [340, 1380] : close ? [350, 1380] : [0, d.right]) { const p = sub([x, y, z], target); rx = Math.max(rx, Math.abs(view[0] * p[0] + view[4] * p[1] + view[8] * p[2])); ry = Math.max(ry, Math.abs(view[1] * p[0] + view[5] * p[1] + view[9] * p[2])); }
    const halfHeight = Math.max(ry, rx / (width / height)) * 1.28 / state.zoom;
    return multiply(ortho(halfHeight, width / height), view);
  }
  function project(p) { const [x, y, z] = p, a = matrix; return [(a[0] * x + a[4] * y + a[8] * z + a[12] + 1) * width / 2, (1 - a[1] * x - a[5] * y - a[9] * z - a[13]) * height / 2, a[2] * x + a[6] * y + a[10] * z + a[14]]; }
  function drawBuffer(data) {
    if (!data?.count) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);
    for (const [name, offset] of [['position', 0], ['normal', 12], ['color', 24]]) { const location = gl.getAttribLocation(program, name); gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, name === 'color' ? 4 : 3, gl.FLOAT, false, 40, offset); }
    gl.drawArrays(gl.TRIANGLES, 0, data.count);
  }
  function measure(a, b, label, color = '#65737f') {
    const p = project(world(a)), q = project(world(b)), dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy); if (len < 20) return;
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
    for (const v of [p, q]) { ctx.moveTo(v[0] - 4, v[1] + 4); ctx.lineTo(v[0] + 4, v[1] - 4); } ctx.stroke();
    ctx.save(); ctx.translate((p[0] + q[0]) / 2, (p[1] + q[1]) / 2); let angle = Math.atan2(dy, dx); if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI; ctx.rotate(angle);
    ctx.font = '12px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif'; const tw = ctx.measureText(label).width; ctx.fillStyle = 'rgba(255,255,255,.96)'; ctx.fillRect(-tw / 2 - 6, -10, tw + 12, 20); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 0); ctx.restore();
  }
  function drawReference() {
    if (!state.reference) return;
    ctx.save(); ctx.strokeStyle = '#bb5c4c'; ctx.lineWidth = 1.3; ctx.setLineDash([5, 5]);
    for (const member of referenceMembers) {
      const corners = Array.from({ length: 8 }, (_, i) => member.center.map((c, k) => c + ((i >> k) & 1 ? 1 : -1) * member.size[k] / 2));
      ctx.beginPath();
      for (let i = 0; i < 8; i++) for (let k = 0; k < 3; k++) if (!((i >> k) & 1)) {
        const a = project(world(corners[i])), b = project(world(corners[i | (1 << k)]));
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function planLabel(point, text, color) {
    const [x, y] = project(world(point)); ctx.save(); ctx.font = '12px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif';
    const tw = ctx.measureText(text).width; ctx.fillStyle = 'rgba(255,255,255,.94)'; ctx.fillRect(x - tw / 2 - 5, y - 11, tw + 10, 22);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y); ctx.restore();
  }
  function drawLightboxText() {
    if (!hasBench || -Math.sin(state.yaw) * Math.cos(state.pitch) <= .04) return;
    const sign = model.lightbox;
    const a = project(world([sign.front + .5, sign.top - 10, sign.zMin + 10]));
    const b = project(world([sign.front + .5, sign.top - 10, sign.zMax - 10]));
    const c = project(world([sign.front + .5, sign.bottom + 10, sign.zMin + 10]));
    const u = [(b[0] - a[0]) / sign.faceWidth, (b[1] - a[1]) / sign.faceWidth], v = [(c[0] - a[0]) / sign.faceHeight, (c[1] - a[1]) / sign.faceHeight];
    if (Math.abs(u[0] * v[1] - u[1] * v[0]) < .0005) return;
    ctx.save(); ctx.transform(u[0], u[1], v[0], v[1], a[0], a[1]);
    ctx.fillStyle = '#fff6dc'; ctx.shadowColor = 'rgba(255,203,104,.5)'; ctx.shadowBlur = 10;
    ctx.fillRect(0, 0, sign.faceWidth, sign.faceHeight); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.rect(0, 0, sign.faceWidth, sign.faceHeight); ctx.clip();
    ctx.fillStyle = '#293b3c'; ctx.font = '700 78px "PingFang SC","Microsoft YaHei",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    [...sign.text].forEach((character, i) => ctx.fillText(character, sign.faceWidth / 2 + (i - 1.5) * 146, sign.faceHeight / 2 + 3));
    ctx.restore();
  }
  function render() {
    scheduled = false; matrix = camera();
    const close = hasBench && state.focus === 'bench';
    if (gl && program) {
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(1, 1, 1, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST); gl.useProgram(program); gl.uniformMatrix4fv(gl.getUniformLocation(program, 'matrix'), false, matrix);
      drawBuffer(floorBuffer); if (state.walls) drawBuffer(environmentBuffer); drawBuffer(profileBuffer); drawBuffer(motionBuffer);
      const transparent = motionTriangles.filter(t => (t.color[3] ?? 1) < 1);
      transparent.sort((a, b) => b.points.reduce((s, p) => s + project(p)[2], 0) - a.points.reduce((s, p) => s + project(p)[2], 0));
      if (transparent.length) {
        transparentBuffer = upload(transparent, transparentBuffer); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); drawBuffer(transparentBuffer); gl.depthMask(true); gl.disable(gl.BLEND);
      }
    }
    else if (fallback) {
      fallback.clearRect(0, 0, width, height); const triangles = [...floorTriangles, ...(state.walls ? environmentTriangles : []), ...profileTriangles, ...motionTriangles].map(t => ({ ...t, screen: t.points.map(project) }));
      triangles.sort((a, b) => b.screen.reduce((s, p) => s + p[2], 0) - a.screen.reduce((s, p) => s + p[2], 0));
      for (const t of triangles) { const light = (t.color[3] ?? 1) < 1 ? .94 : t.color[0] > .9 ? 1 : .68 + .3 * Math.max(0, dot(t.normal, normalize([-.5, .85, .6]))); fallback.fillStyle = 'rgba(' + t.color.slice(0, 3).map(x => Math.round(x * light * 255)).join(',') + ',' + (t.color[3] ?? 1) + ')'; fallback.beginPath(); t.screen.forEach((p, i) => i ? fallback.lineTo(p[0], p[1]) : fallback.moveTo(p[0], p[1])); fallback.closePath(); fallback.fill(); }
    }
    ctx.clearRect(0, 0, width, height);
    drawLightboxText();
    drawReference();
    if (state.dimensions) {
      if (hasBench && state.focus === 'shelves') {
        measure([30, model.leftStorage.reserveFloor + 94, 430], [1350, model.leftStorage.reserveFloor + 94, 430], '层内宽1320', '#17667d');
      } else if (hasBench && state.focus === 'lightbox') {
        const sign = model.lightbox;
        measure([sign.front + 25, sign.top + 50, sign.zMin], [sign.front + 25, sign.top + 50, sign.zMax], '灯箱宽920', '#9a6930');
        measure([sign.front + 25, sign.bottom, sign.zMax + 50], [sign.front + 25, sign.top, sign.zMax + 50], '高180', '#9a6930');
      } else if (!close) {
        const y = state.view === 'top' ? d.height : d.height + 115;
        measure([0, y, -110], [d.left, y, -110], '左 1380', '#17667d'); measure([-110, y, 0], [-110, y, d.right], '右 1350', '#9a6930');
        if (state.view !== 'top') measure([d.left + 170, 0, 0], [d.left + 170, d.height, 0], '高 2350');
        measure([d.left + 70, 0, 0], [d.left + 70, 0, d.depth], '400'); measure([0, 0, d.right + 70], [d.depth, 0, d.right + 70], '400');
      } else {
        measure([420, 535, 400], [420, 535, 1320], '坐板宽920', '#9a6930');
        measure([0, 0, 1410], [400, 0, 1410], '坐深400');
      }
      if (hasBench && state.view !== 'top' && !['lightbox', 'shelves'].includes(state.focus)) {
        measure([480, 0, 1340], [480, 500, 1340], '坐面500', '#9a6930');
        if (close) state.drawerTravel.forEach((travel, i) => { if (travel > 0) measure([model.bench.faceFront, i ? 360 : 150, 1350], [model.bench.faceFront + travel, i ? 360 : 150, 1350], (i ? '上层' : '下层') + '抽出' + travel, '#17667d'); });
      }
    }
    if (state.view === 'top') {
      planLabel([d.depth / 2, d.height, d.depth / 2], '转角归左柜', '#17667d');
      planLabel([900, d.height, d.depth / 2], '左侧贯通', '#17667d');
      planLabel([d.depth / 2, d.height, 930], hasBench ? '换鞋凳 · 顶高500' : '右侧独立段950', '#9a6930');
    }
    if (close) {
      planLabel([394 + state.drawerTravel[0], 210, 860], '下层 · 穿过的鞋', '#17667d');
      planLabel([394 + state.drawerTravel[1], 392, 860], '上层 · 拖鞋', '#9a6930');
    }
    if (hasBench && (state.focus === 'shelves' || state.view === 'left')) {
      for (const layer of model.leftStorage.layers) planLabel([875, (layer.floor + layer.ceiling) / 2, 410], `${layer.label} · 净高${layer.netHeight}`, '#17667d');
      if (state.view === 'left') planLabel([875, (model.leftStorage.reserveFloor + model.leftStorage.reserveCeiling) / 2, 410], `上部预留 · 净高${model.leftStorage.reserveHeight}`, '#687780');
    }
    root._frame.ready = true;
  }
  const requestRender = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(render); } };
  function status() { document.getElementById('view-status').textContent = ({ overall: '整体 · 左侧九层鞋区与换鞋凳', shelves: '左侧鞋层 · 净高120 / 130 / 170×3 / 260 / 160×3', bench: '换鞋凳近看 · 拖鞋150 / 换下的鞋182', lightbox: '灯箱近看 · 怪兽小屋 · 暖白发光', top: '俯视 · 原L形外廓', left: '左侧正视 · 九层鞋区与上部预留', right: '右侧正视 · 坐面500', custom: '自由视角' })[state.view]; document.querySelectorAll('[data-view]').forEach(b => { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(b.dataset.view === state.view)); }); requestRender(); }
  function preset(view) { const values = { overall: [-.64, .3], shelves: [-.12, .16], bench: [-1.08, .62], lightbox: [-1.16, .12], top: [0, Math.PI / 2], left: [0, 0], right: [-Math.PI / 2, 0] }[view]; state.yaw = values[0]; state.pitch = values[1]; state.zoom = 1; state.view = view; state.focus = ['bench', 'lightbox', 'shelves'].includes(view) ? view : 'all'; status(); }
  document.querySelectorAll('.view-buttons button').forEach(b => b.addEventListener('click', () => preset(b.dataset.view)));
  document.getElementById('reset-view').addEventListener('click', () => preset('overall'));
  document.getElementById('show-walls').addEventListener('change', e => { state.walls = e.target.checked; requestRender(); });
  document.getElementById('show-dimensions').addEventListener('change', e => { state.dimensions = e.target.checked; requestRender(); });
  document.getElementById('show-reference').addEventListener('change', e => { state.reference = e.target.checked; document.getElementById('reference-legend').hidden = !state.reference; requestRender(); });
  if (hasBench) {
    const updateDrawers = () => {
      motionTriangles = buildMotion(); if (gl && program) motionBuffer = upload(motionTriangles.filter(t => (t.color[3] ?? 1) === 1), motionBuffer);
      state.drawerTravel.forEach((value, i) => { document.getElementById('drawer-' + i).value = value; document.getElementById('drawer-value-' + i).value = value + ' mm'; });
      document.getElementById('drawer-motion-status').textContent = '两只踢脚抽独立移动 · 已展开 ' + state.drawerTravel.filter(v => v > 0).length + '/2 只';
      requestRender();
    };
    document.querySelectorAll('[data-drawer]').forEach(input => input.addEventListener('input', () => { state.drawerTravel[Number(input.dataset.drawer)] = Math.max(0, Math.min(300, Number(input.value) || 0)); updateDrawers(); }));
    document.getElementById('close-drawers').addEventListener('click', () => { state.drawerTravel.fill(0); updateDrawers(); });
    for (const [i, id] of ['toggle-used', 'toggle-slippers'].entries()) document.getElementById(id).addEventListener('click', () => { state.drawerTravel[i] = state.drawerTravel[i] ? 0 : 300; updateDrawers(); });
  }
  const pointers = new Map(); let pinch = 0;
  canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY]); pinch = 0; });
  canvas.addEventListener('pointermove', e => {
    const previous = pointers.get(e.pointerId); if (!previous) return; pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 2) { const [a, b] = [...pointers.values()], distance = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) state.zoom = Math.max(.55, Math.min(2.5, state.zoom * distance / pinch)); pinch = distance; }
    else { state.yaw -= (e.clientX - previous[0]) * .006; state.pitch = Math.max(-.3, Math.min(1.45, state.pitch + (e.clientY - previous[1]) * .005)); state.view = 'custom'; }
    status();
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(type, e => { pointers.delete(e.pointerId); pinch = 0; });
  canvas.addEventListener('wheel', e => { e.preventDefault(); state.zoom = Math.max(.55, Math.min(2.5, state.zoom * Math.exp(-e.deltaY * .001))); requestRender(); }, { passive: false });
  canvas.addEventListener('keydown', e => { if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(e.key)) return; e.preventDefault(); if (e.key === 'Home') { preset('overall'); return; } if (['+', '=', '-'].includes(e.key)) state.zoom = Math.max(.55, Math.min(2.5, state.zoom * (e.key === '-' ? .9 : 1.1))); else { state.yaw += e.key === 'ArrowLeft' ? -.1 : e.key === 'ArrowRight' ? .1 : 0; state.pitch = Math.max(-.3, Math.min(1.45, state.pitch + (e.key === 'ArrowUp' ? .1 : e.key === 'ArrowDown' ? -.1 : 0))); state.view = 'custom'; } status(); });
  function resize() { const r = canvas.parentElement.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 2); width = Math.max(1, r.width); height = Math.max(1, r.height); canvas.width = overlay.width = Math.round(width * ratio); canvas.height = overlay.height = Math.round(height * ratio); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); if (fallback) fallback.setTransform(ratio, 0, 0, ratio, 0, 0); requestRender(); }
  new ResizeObserver(resize).observe(canvas.parentElement); resize(); status();
  if (hasBench && ['#bench', '#lightbox', '#shelves'].includes(location.hash)) preset(location.hash.slice(1));
}
