/* Screen-space post effects: vignette, film grain, chromatic fringe, flashes.
   All effects are cheap canvas overlays and respect the quality level. */
const EFFECTS = [
  { id: 'speed-lines', kind: 'overlay', desc: 'Radial manga speed lines, intensity follows beat pulse' },
  { id: 'motion-trail', kind: 'character', desc: 'Afterimage streak on sprint via pulse-scaled lines' },
  { id: 'screen-shake', kind: 'camera', desc: 'Trauma-based shake on hits, kicks and drops' },
  { id: 'impact-frame', kind: 'freeze', desc: 'Brief hitstop freeze on damage (0.09s)' },
  { id: 'flash', kind: 'overlay', desc: 'White flash on camera cuts and the drop' },
  { id: 'vignette', kind: 'overlay', desc: 'Darkened corners, stronger at night' },
  { id: 'bloom', kind: 'overlay', desc: 'Downsampled screen blend glow' },
  { id: 'color-grade', kind: 'overlay', desc: 'Lighting tint multiply per environment' },
  { id: 'chromatic-fringe', kind: 'overlay', desc: 'Red/cyan edge fringe scaled by flash' },
  { id: 'film-grain', kind: 'overlay', desc: 'Animated grain dots, quality-scaled' },
  { id: 'fog', kind: 'weather', desc: 'Ground fog band on mist/fog weather' },
  { id: 'mist', kind: 'weather', desc: 'Drifting mist blobs' },
  { id: 'rain', kind: 'weather', desc: 'Streaked rain lines' },
  { id: 'petals', kind: 'weather', desc: 'Tumbling sakura petals and leaves' }
];
function fxVignette(a) {
  if (a <= 0.01) return;
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .42, W / 2, H / 2, Math.max(W, H) * .75);
  g.addColorStop(0, 'rgba(6,4,20,0)');
  g.addColorStop(1, 'rgba(6,4,20,' + Math.min(.55, a).toFixed(3) + ')');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
function fxGrain(a) {
  if (a <= 0.01) return;
  const q = (typeof qualityGet === 'function') ? qualityGet() : null;
  const n = Math.round((q && q.grain != null ? q.grain : .3) * 220 * a);
  ctx.save();
  ctx.fillStyle = '#fff';
  for (let i = 0; i < n; i++) {
    ctx.globalAlpha = Math.random() * .16 * a;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4);
  }
  ctx.restore();
}
function fxChroma(a) {
  if (a <= 0.02) return;
  const w = Math.max(2, W * .02 * a);
  ctx.save();
  ctx.globalAlpha = Math.min(.5, a * .5);
  ctx.fillStyle = '#ff2f6a';
  ctx.fillRect(0, 0, w, H);
  ctx.fillStyle = '#2fe8ff';
  ctx.fillRect(W - w, 0, w, H);
  ctx.restore();
}
function fxBandFlash(a) {
  if (a <= 0.02) return;
  ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, a * .7).toFixed(3) + ')';
  ctx.fillRect(0, 0, W, H);
}
