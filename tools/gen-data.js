/* Generates data/*.json manifests from the runtime sources (single source of truth). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = 'C:/Users/Pc/hayate-run/';
const grads = { addColorStop() {} };
const ctxStub = new Proxy({}, { get(t, k) {
  if (k === 'roundRect') return () => {};
  if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => grads;
  if (k === 'createPattern') return () => ({ kind: 'pattern' });
  if (typeof k === 'symbol') return undefined;
  if (!(k in t)) t[k] = () => {};
  return t[k]; }, set(t, k, v) { t[k] = v; return true; } });
function makeEl(tag) {
  const e = { tag, textContent: '', value: tag === 'select' ? 'auto' : '', width: 0, height: 0, offsetWidth: 1,
    style: {}, attributes: {}, _kids: [], _html: '', files: [],
    classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, toggle(c, f) { if (f) this._s.add(c); else this._s.delete(c); }, contains(c) { return this._s.has(c); } },
    appendChild(c) { this._kids.push(c); return c; },
    setAttribute(k, v) { this.attributes[k] = String(v); }, getAttribute(k) { return this.attributes[k]; },
    getContext() { return ctxStub; }, addEventListener() {}, click() {}, onchange: null, onclick: null };
  Object.defineProperty(e, 'children', { get() { return e._kids; } });
  Object.defineProperty(e, 'innerHTML', { get() { return e._html; }, set(v) { e._html = v; if (v === '') e._kids.length = 0; } });
  return e;
}
const registry = new Map();
const documentStub = { querySelector(s) { if (!registry.has(s)) registry.set(s, makeEl('div')); return registry.get(s); }, createElement: makeEl };
const sb = { g: null };
const ctx = {
  console, Math, JSON, Object, Array, Float32Array, performance,
  window: null, document: documentStub,
  AudioContext: function () {}, matchMedia: () => ({ matches: false }),
  addEventListener: () => {}, removeEventListener: () => {},
  innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
  requestAnimationFrame: () => 1, setInterval: () => 1, clearInterval: () => {},
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
};
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);
const files = ['engine.js','audio.js','characters.js','animation.js','environments.js','renderer.js','weather.js','lighting.js','particles.js','effects.js','camera.js','director.js','player.js','collision.js','input.js','ui.js','performance.js','main.js'];
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, 'src', f), 'utf8'), ctx, { filename: f });
const out = vm.runInContext('JSON.stringify({chars:CHARS,envs:ENVS.map(e=>({id:e.id,name:e.name,nameJa:e.nameJa,theme:e.theme,variant:e.variant,weather:e.weather.kind,lights:e.lights,horizon:e.horizon,ground:e.ground,license:e.license,source:e.source,author:e.author})),openings:OPENINGS,effects:EFFECTS})', ctx);
const data = JSON.parse(out);
fs.writeFileSync(path.join(root, 'data', 'characters.json'), JSON.stringify(data.chars, null, 2));
fs.writeFileSync(path.join(root, 'data', 'environments.json'), JSON.stringify(data.envs, null, 2));
fs.writeFileSync(path.join(root, 'data', 'openings.json'), JSON.stringify({ openings: data.openings }, null, 2));
fs.writeFileSync(path.join(root, 'data', 'effects.json'), JSON.stringify({ effects: data.effects }, null, 2));
console.log('chars=' + data.chars.length + ' envs=' + data.envs.length + ' openings=' + data.openings.length + ' effects=' + data.effects.length);
