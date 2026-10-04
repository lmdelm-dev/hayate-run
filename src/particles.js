/* Pooled screen-space particles: radial speed lines + impact bursts. */
const speedDirs = [];
for (let i = 0; i < 64; i++) speedDirs.push(Math.random() * 6.28);
const FXB = [];
function spawnBurst(px, py, n, col, spd) {
  const q = (typeof qualityGet === 'function') ? qualityGet() : null;
  const mul = q && q.fx ? q.fx : 1;
  const c = Math.min(40, Math.round(n * mul));
  for (let i = 0; i < c; i++) {
    if (FXB.length > 420) FXB.shift();
    const a = Math.random() * 6.28, v = (spd || 260) * (.35 + Math.random() * .9);
    FXB.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .5 + Math.random() * .5, t: 0, r: 2 + Math.random() * 3.5, col: col || '#ffd166' });
  }
}
function drawBursts(dt) {
  if (!FXB.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = FXB.length - 1; i >= 0; i--) {
    const p = FXB[i];
    p.t += dt;
    if (p.t >= p.life) { FXB.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt;
    ctx.globalAlpha = 1 - p.t / p.life;
    ctx.fillStyle = p.col;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - p.t / p.life * .6), 0, 7); ctx.fill();
  }
  ctx.restore();
}
function drawSpeedLines(cx, cy, inten, count) {
  const n = Math.min(count || 44, speedDirs.length);
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = speedDirs[i];
    const r0 = Math.min(W, H) * (.38 + ((i * 37) % 10) / 40);
    const r1 = r0 + Math.min(W, H) * (.25 + Math.random() * .25 * inten * 2);
    ctx.strokeStyle = 'rgba(255,244,230,' + (inten * .55).toFixed(3) + ')';
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * .8);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * .8);
    ctx.stroke();
  }
  ctx.restore();
}
