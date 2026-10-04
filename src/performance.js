var DPR_CAP=2;
﻿/* Quality levels + FPS monitor with automatic degradation.
   LOW / MEDIUM / HIGH / ULTRA control resolution, particles, bloom, grain. */
const QLEVELS = [
  { id: 'LOW', dpr: 1, wx: .35, bloom: 0, lines: 12, fx: .4, grain: 0 },
  { id: 'MEDIUM', dpr: 1.5, wx: .6, bloom: .5, lines: 28, fx: .7, grain: .15 },
  { id: 'HIGH', dpr: 2, wx: 1, bloom: 1, lines: 44, fx: 1, grain: .3 },
  { id: 'ULTRA', dpr: 2, wx: 1.3, bloom: 1.3, lines: 64, fx: 1.4, grain: .45 }
];
const Quality = { current: 'HIGH', auto: true, ema: 60, lastT: 0, lowT: 0, hiT: 0 };
try {
  const saved = typeof localStorage !== 'undefined' && localStorage.getItem('hayate-quality');
  if (saved && QLEVELS.some(q => q.id === saved)) Quality.current = saved;
  const savedAuto = typeof localStorage !== 'undefined' && localStorage.getItem('hayate-quality-auto');
  if (savedAuto === '0') Quality.auto = false;
} catch (e) { /* private mode: stay on defaults */ }
function qualityGet() {
  return QLEVELS.find(q => q.id === Quality.current) || QLEVELS[2];
}
function setQuality(id, auto) {
  if (!QLEVELS.some(q => q.id === id)) return;
  Quality.current = id;
  try { DPR_CAP = qualityGet().dpr; } catch (err) { /* ignore */ }
  if (typeof auto === 'boolean') Quality.auto = auto;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('hayate-quality', id);
      localStorage.setItem('hayate-quality-auto', Quality.auto ? '1' : '0');
    }
  } catch (e) { /* ignore */ }
  if (typeof rs === 'function') rs();
  if (typeof wxSet === 'function' && typeof G !== 'undefined' && G && typeof ENV !== 'undefined' && ENV) {
    try { wxSet((typeof WXforce !== 'undefined' && WXforce) || ENV.weather.kind); } catch (e) { /* ignore */ }
  }
}
function fpsTick(now) {
  if (!Quality.lastT) { Quality.lastT = now; return; }
  const dt = (now - Quality.lastT) / 1000;
  Quality.lastT = now;
  if (dt <= 0 || dt > 1) return;
  const fps = 1 / dt;
  Quality.ema += (fps - Quality.ema) * .06;
  if (!Quality.auto) return;
  const order = ['LOW', 'MEDIUM', 'HIGH', 'ULTRA'];
  const i = order.indexOf(Quality.current);
  if (Quality.ema < 45 && i > 0) {
    Quality.lowT += dt;
    if (Quality.lowT > 2) { Quality.lowT = 0; setQuality(order[i - 1], true); }
  } else Quality.lowT = 0;
  if (Quality.ema > 58 && i < 3) {
    Quality.hiT += dt;
    if (Quality.hiT > 12) { Quality.hiT = 0; setQuality(order[i + 1], true); }
  } else Quality.hiT = 0;
}

try { DPR_CAP = qualityGet().dpr; } catch (err) { /* ignore */ }
