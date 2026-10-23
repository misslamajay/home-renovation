import { model, dimensions as d, members, footprint, posts } from './geometry.js';
const root = document.getElementById('shoe-cabinet-frame');
const state = { yaw: -Math.PI / 4, pitch: .18, zoom: 1, view: 'overall', walls: true, dimensions: true };
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
  const bars = members.filter(m => m.kind === 'top').map(m => `<rect x="${origin[0] - m.center[0] - m.size[0] / 2}" y="${origin[1] + m.center[2] - m.size[2] / 2}" width="${m.size[0]}" height="${m.size[2]}" fill="#b0bdc5"/>`).join('');
  const columns = posts.map(p => `<rect x="${origin[0] - p.x - 15}" y="${origin[1] + p.z - 15}" width="30" height="30" fill="#8f9da7"/>`).join('');
  document.getElementById('plan-drawing').innerHTML = `<svg viewBox="0 0 1780 1750" role="img" aria-label="L形框架俯视：左侧1380，右侧1350，深400，转角400乘400共用">${svgStyle}
    <defs><pattern id="corner-hatch" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M0 26L26 0" stroke="#b4d0da" stroke-width="1"/></pattern></defs>
    <path d="M140 178H1572V1580" fill="none" stroke="#c7d0d7" stroke-width="3" stroke-dasharray="8 5"/>
    <polygon points="${polygon}" fill="#f9fbfc" stroke="#b5c1c9" stroke-width="1"/>
    <rect x="1150" y="200" width="400" height="400" fill="#edf5f8"/><rect x="1150" y="200" width="400" height="400" fill="url(#corner-hatch)"/>
    ${bars}${columns}<text x="650" y="410" text-anchor="middle" class="left">左侧框架</text><text x="1350" y="1070" text-anchor="middle" class="right">右侧框架</text>
    <text x="1350" y="385" text-anchor="middle" style="font-size:32px">400 × 400</text><text x="1350" y="440" text-anchor="middle" style="font-size:30px">转角共用</text>
    <circle cx="1550" cy="200" r="7" fill="#17667d"/><text x="1530" y="153" text-anchor="end" style="font-size:30px">共同墙角</text>
    ${dimension(170, 80, 1550, 80, '1380')}${dimension(1660, 200, 1660, 1550, '1350', true)}
    ${dimension(70, 200, 70, 600, '400', true)}${dimension(1150, 1650, 1550, 1650, '400')}
  </svg>`;
}
function drawElevation(side) {
  const left = side === 'left', length = left ? d.left : d.right, ox = 180, oy = 130;
  const centers = left ? [15, d.left - d.depth + 15, d.left - 15] : [15, d.depth - 15, d.right - 15];
  const cornerX = ox + (left ? length - d.depth : 0), mainX = left ? ox + (length - d.depth) / 2 : ox + d.depth + (length - d.depth) / 2;
  const bars = centers.map(x => `<rect x="${ox + x - 15}" y="${oy}" width="30" height="2350" fill="#aebbc4"/>`).join('');
  document.getElementById(side + '-drawing').innerHTML = `<svg viewBox="0 0 ${length + 380} 2700" role="img" aria-label="${left ? '左' : '右'}侧立面：外长${length}，外高2350，框架内高2290毫米">${svgStyle}
    <rect x="${cornerX}" y="${oy}" width="400" height="2350" fill="#edf5f8"/>
    ${bars}<rect x="${ox}" y="${oy}" width="${length}" height="30" fill="#aebbc4"/><rect x="${ox}" y="${oy + 2320}" width="${length}" height="30" fill="#aebbc4"/>
    <text x="${cornerX + 200}" y="${oy + 180}" text-anchor="middle" style="font-size:44px">共用角部</text>
    ${dimension(70, oy, 70, oy + 2350, '2350', true)}${dimension(ox, 2590, ox + length, 2590, String(length))}
    ${dimension(mainX, oy + 30, mainX, oy + 2320, '2290', true)}
    <text x="${mainX}" y="${oy + 2140}" text-anchor="middle" style="font-size:44px">净宽 ${left ? 950 : 920}</text>
    <text x="${cornerX + 200}" y="${oy + 2140}" text-anchor="middle" style="font-size:42px">净宽 340</text>
  </svg>`;
}

if (document.body.dataset.view === 'dimensions') {
  drawPlan(); drawElevation('left'); drawElevation('right'); root._frame.ready = true; reportSize();
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
    const axis = member.axis, u = (axis + 1) % 3, v = (axis + 2) % 3, half = member.size[axis] / 2;
    const at = (point, end) => { const out = [...member.center]; out[axis] += end * half; out[u] += point[0]; out[v] += point[1]; return out; };
    for (let i = 0; i < polygon.length; i++) {
      const p = polygon[i], q = polygon[(i + 1) % polygon.length], du = q[0] - p[0], dv = q[1] - p[1], n = [0, 0, 0], len = Math.hypot(du, dv); n[u] = dv / len; n[v] = -du / len;
      const outer = (Math.abs(p[0]) === 15 && Math.abs(q[0]) === 15) || (Math.abs(p[1]) === 15 && Math.abs(q[1]) === 15);
      quad(profileTriangles, at(p, -1), at(q, -1), at(q, 1), at(p, 1), n, outer ? [.72, .78, .82] : [.42, .48, .53]);
    }
    for (const end of [-1, 1]) { const n = [0, 0, 0]; n[axis] = end; for (const [a, b, c] of caps) triangle(profileTriangles, at(polygon[a], end), at(polygon[b], end), at(polygon[c], end), n, [.68, .74, .79]); }
  }
  quad(environmentTriangles, [-60, 0, -3], [d.left + 120, 0, -3], [d.left + 120, d.height + 80, -3], [-60, d.height + 80, -3], [0, 0, 1], [.95, .97, .98]);
  quad(environmentTriangles, [-3, 0, -60], [-3, d.height + 80, -60], [-3, d.height + 80, d.right + 120], [-3, 0, d.right + 120], [1, 0, 0], [.92, .95, .97]);
  const floorTriangles = [];
  quad(floorTriangles, [0, -3, 0], [d.left, -3, 0], [d.left, -3, d.depth], [0, -3, d.depth], [0, 1, 0], [.965, .975, .98]);
  quad(floorTriangles, [0, -3, d.depth], [d.depth, -3, d.depth], [d.depth, -3, d.right], [0, -3, d.right], [0, 1, 0], [.965, .975, .98]);
  let gl, program, profileBuffer, environmentBuffer, floorBuffer, fallback;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) throw Error('WebGL unavailable');
    const shader = (type, source) => { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s)); return s; };
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, 'attribute vec3 position;attribute vec3 normal;attribute vec3 color;uniform mat4 matrix;varying vec3 n;varying vec3 c;void main(){n=normal;c=color;gl_Position=matrix*vec4(position,1.0);}'));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, 'precision mediump float;varying vec3 n;varying vec3 c;void main(){float light=.68+.30*max(dot(normalize(n),normalize(vec3(-.5,.85,.6))),0.0);if(c.r>.9)light=1.0;gl_FragColor=vec4(c*light,1.0);}'));
    gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error('无法初始化三维视图');
    const upload = triangles => { const data = []; for (const t of triangles) for (const p of t.points) data.push(...p, ...t.normal, ...t.color); const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW); return { buffer, count: data.length / 9 }; };
    profileBuffer = upload(profileTriangles); environmentBuffer = upload(environmentTriangles); floorBuffer = upload(floorTriangles);
  } catch { fallback = canvas.getContext('2d'); }
  function camera() {
    const target = [-d.left / 2, d.height / 2, d.right / 2], direction = [Math.sin(state.yaw) * Math.cos(state.pitch), Math.sin(state.pitch), Math.cos(state.yaw) * Math.cos(state.pitch)];
    const up = state.view === 'top' ? [0, 0, -1] : [0, 1, 0], view = lookAt(target.map((x, i) => x + direction[i] * 8000), target, up);
    let rx = 0, ry = 0;
    for (const x of [0, -d.left]) for (const y of [0, d.height]) for (const z of [0, d.right]) { const p = sub([x, y, z], target); rx = Math.max(rx, Math.abs(view[0] * p[0] + view[4] * p[1] + view[8] * p[2])); ry = Math.max(ry, Math.abs(view[1] * p[0] + view[5] * p[1] + view[9] * p[2])); }
    const halfHeight = Math.max(ry, rx / (width / height)) * 1.28 / state.zoom;
    return multiply(ortho(halfHeight, width / height), view);
  }
  function project(p) { const [x, y, z] = p, a = matrix; return [(a[0] * x + a[4] * y + a[8] * z + a[12] + 1) * width / 2, (1 - a[1] * x - a[5] * y - a[9] * z - a[13]) * height / 2, a[2] * x + a[6] * y + a[10] * z + a[14]]; }
  function drawBuffer(data) {
    gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);
    for (const [name, offset] of [['position', 0], ['normal', 12], ['color', 24]]) { const location = gl.getAttribLocation(program, name); gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 36, offset); }
    gl.drawArrays(gl.TRIANGLES, 0, data.count);
  }
  function measure(a, b, label, color = '#65737f') {
    const p = project(world(a)), q = project(world(b)), dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy); if (len < 20) return;
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
    for (const v of [p, q]) { ctx.moveTo(v[0] - 4, v[1] + 4); ctx.lineTo(v[0] + 4, v[1] - 4); } ctx.stroke();
    ctx.save(); ctx.translate((p[0] + q[0]) / 2, (p[1] + q[1]) / 2); let angle = Math.atan2(dy, dx); if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI; ctx.rotate(angle);
    ctx.font = '12px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif'; const tw = ctx.measureText(label).width; ctx.fillStyle = 'rgba(255,255,255,.96)'; ctx.fillRect(-tw / 2 - 6, -10, tw + 12, 20); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 0); ctx.restore();
  }
  function render() {
    scheduled = false; matrix = camera();
    if (gl && program) { gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(1, 1, 1, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST); gl.useProgram(program); gl.uniformMatrix4fv(gl.getUniformLocation(program, 'matrix'), false, matrix); drawBuffer(floorBuffer); if (state.walls) drawBuffer(environmentBuffer); drawBuffer(profileBuffer); }
    else if (fallback) {
      fallback.clearRect(0, 0, width, height); const triangles = [...floorTriangles, ...(state.walls ? environmentTriangles : []), ...profileTriangles].map(t => ({ ...t, screen: t.points.map(project) }));
      triangles.sort((a, b) => b.screen.reduce((s, p) => s + p[2], 0) - a.screen.reduce((s, p) => s + p[2], 0));
      for (const t of triangles) { const light = t.color[0] > .9 ? 1 : .68 + .3 * Math.max(0, dot(t.normal, normalize([-.5, .85, .6]))); fallback.fillStyle = 'rgb(' + t.color.map(x => Math.round(x * light * 255)).join(',') + ')'; fallback.beginPath(); t.screen.forEach((p, i) => i ? fallback.lineTo(p[0], p[1]) : fallback.moveTo(p[0], p[1])); fallback.closePath(); fallback.fill(); }
    }
    ctx.clearRect(0, 0, width, height);
    if (state.dimensions) {
      const y = state.view === 'top' ? d.height : d.height + 115;
      measure([0, y, -110], [d.left, y, -110], '左 1380', '#17667d'); measure([-110, y, 0], [-110, y, d.right], '右 1350', '#9a6930');
      if (state.view !== 'top') measure([d.left + 170, 0, 0], [d.left + 170, d.height, 0], '高 2350');
      measure([d.left + 70, 0, 0], [d.left + 70, 0, d.depth], '400'); measure([0, 0, d.right + 70], [d.depth, 0, d.right + 70], '400');
    }
    root._frame.ready = true;
  }
  const requestRender = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(render); } };
  function status() { document.getElementById('view-status').textContent = ({ overall: '整体 · L 形阴角', top: '俯视 · 转角共用 400 × 400', left: '左侧正视', right: '右侧正视', custom: '自由视角' })[state.view]; document.querySelectorAll('[data-view]').forEach(b => { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(b.dataset.view === state.view)); }); requestRender(); }
  function preset(view) { const values = { overall: [-Math.PI / 4, .18], top: [0, Math.PI / 2], left: [0, 0], right: [-Math.PI / 2, 0] }[view]; state.yaw = values[0]; state.pitch = values[1]; state.zoom = 1; state.view = view; status(); }
  document.querySelectorAll('.view-buttons button').forEach(b => b.addEventListener('click', () => preset(b.dataset.view)));
  document.getElementById('reset-view').addEventListener('click', () => preset('overall'));
  document.getElementById('show-walls').addEventListener('change', e => { state.walls = e.target.checked; requestRender(); });
  document.getElementById('show-dimensions').addEventListener('change', e => { state.dimensions = e.target.checked; requestRender(); });
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
}
