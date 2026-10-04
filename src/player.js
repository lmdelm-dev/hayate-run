/* Player state: lane movement, jumping, run-cycle phase, pose, pickups. */
function lane(d) {
  if (!running || !G || G.paused) return;
  G.lane = clamp(G.lane + d, -1, 1);
}
function jump() {
  if (!running || !G || G.paused) return;
  if (G.py <= 0 && G.vy <= 0) G.vy = (G.ch && G.ch.jumpV) || 8.5;
}
function playerPhysics(dt, d2, d3) {
  G.px += (G.lane * LANE - G.px) * (1 - Math.exp(-d3 * 14));
  if (G.py > 0 || G.vy > 0) {
    const was = G.vy;
    G.vy -= 26 * d2;
    G.py += G.vy * d2;
    if (G.py <= 0) {
      G.py = 0;
      if (was < -.5) G.landT = .25;
      G.vy = 0;
    }
  }
  G.ph += d2 * G.sp * .55;
  const air = G.py > 0 || G.vy > 0;
  G.pose = G.hitT > 0 ? 'hit' : air ? (G.vy > 0 ? 'jump' : 'fall') : G.landT > 0 ? 'land' : 'run';
}
function collectOrb(o) {
  o.gone = true;
  G.combo = (G.combo || 0) + 1;
  G.comboT = 4;
  const gain = 50 * G.combo;
  G.bonus = (G.bonus || 0) + gain;
  G.score = (G.score || 0) + gain;
  G.pickT = 1;
  const q = P(o.x, 1.1, o.z);
  if (q) spawnBurst(q[0], q[1], 10, '#ffd166', 220);
}
