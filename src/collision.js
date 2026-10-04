/* Collision: hazards damage the runner, orbs are collected, holes need jumps. */
function checkCollisions() {
  for (const o of objs) {
    if (o.hit || o.gone) continue;
    if (Math.abs(o.z) > o.d / 2 + .3) continue;
    if (Math.abs(o.x - G.px) > o.w / 2 + .35) continue;
    if (o.t === 'hole') {
      if (G.py < .25 && Math.abs(o.z) < o.d / 2 - .5) { o.hit = true; hit(); }
    } else if (o.t === 'orb' || (OBS[o.t] && OBS[o.t].pickup)) {
      collectOrb(o);
    } else if (G.py < o.h - .1) {
      o.hit = true;
      hit();
    }
  }
  if (objs.some(o => o.gone)) objs = objs.filter(o => !o.gone);
}
