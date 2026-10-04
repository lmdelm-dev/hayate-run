/* Game orchestration: state, run lifecycle, pause, update + render loop. */
let G, objs, decor, running = false, last = 0, ENV = null, ENVi = 0, envMode = 'auto', envList = [], envListI = 0, WXforce = null;
function randEnvId() { return ENVS[Math.random() * ENVS.length | 0].id; }
function setEnv(id, now) {
  ENV = envById(id); ENVi = ENVS.indexOf(ENV);
  if (!now) G.wipe = 1;
  wxSet(WXforce || ENV.weather.kind);
  envBadge(ENV.name);
}
function envCut(reason) {
  if (envMode === 'auto' && reason === 'start') { setEnv(envList[0], 1); return; }
  if (reason === 'outro') { if (envMode === 'auto') setEnv('sunset-dusk'); return; }
  if (envMode === 'random') { setEnv(randEnvId()); return; }
  if (envMode !== 'auto') return;
  envListI = (envListI + 1) % envList.length;
  setEnv(envList[envListI]);
}
function wxForce(k) { WXforce = k; wxSet(k || ENV.weather.kind); }
function reset() {
  song = SONGS[si];
  G = {
    ts: 1, tsT: 1, bp: 0, styT: 0, lock: +$('#look').value, t: 0, dist: 0,
    score: 0, bonus: 0, combo: 0, comboT: 0, pickT: 0,
    px: 0, lane: 0, py: 0, vy: 0, ph: 0, lives: 3, inv: 0,
    pulse: 0, flash: 0, red: 0, shake: 0, shot: 'chase', cut: 1, lastBeat: -1,
    next: 22, ch: CHARS[ci], cap: 0, pose: 'run', landT: 0, hitT: 0, hitstop: 0,
    wipe: 0, lx: 1, lxT: 1, dim: 0, dimT: 0, sp: 20, paused: false
  };
  ST = STY[G.lock ? G.lock - 1 : 0];
  objs = []; decor = [];
  envMode = $('#env').value;
  envList = envMode === 'auto' ? autoEnvList(si) : envMode === 'random' ? null : [envMode];
  envListI = 0; WXforce = null;
  const id0 = envMode === 'auto' ? envList[0] : envMode === 'random' ? randEnvId() : envMode;
  setEnv(id0, 1);
  for (let i = 0; i < 30; i++) {
    const side = i % 2 ? 1 : -1;
    decor.push(mkDecor(side, (i >> 1) * 10 + Math.random() * 4, ENV));
  }
  Object.assign(cam, SHOTS.chase);
}
function hit() {
  if (G.inv > 0) return;
  G.lives--; G.inv = 1.6; G.shake = .5; G.red = 1; G.hitT = .7;
  G.combo = 0; G.comboT = 0; G.hitstop = .09;
  const q = P(G.px, 1.4, 0);
  if (q) spawnBurst(q[0], q[1], 16, '#ff4f6b', 300);
  if (G.lives <= 0) finish(false);
}
function finish(win) {
  running = false;
  stopMusic();
  showPause(false);
  $('#hud').style.display = 'none';
  $('#eh').textContent = win ? 'Stage clear!' : 'Tripped up';
  $('#es').textContent = song.n + ' · ' + (G.dist | 0) + ' m · ' + ((G.score || 0) | 0) + ' pts';
  $('#end').classList.remove('off');
}
function pauseGame() {
  if (!running || !G || G.paused) return;
  G.paused = true;
  showPause(true);
  try { if (ac && ac.suspend) ac.suspend(); } catch (e) { /* ignore */ }
}
function resumeGame(silent) {
  if (!G || !G.paused) return;
  G.paused = false;
  if (!silent) showPause(false);
  else showPause(false);
  try { if (ac && ac.resume) ac.resume(); } catch (e) { /* ignore */ }
  last = performance.now();
}
function togglePause() {
  if (!running || !G) return;
  if (G.paused) resumeGame();
  else pauseGame();
}
function startRun() {
  reset();
  if (typeof custom !== 'undefined' && custom) song = Object.assign({}, SONGS[si], { n: 'Your track', jp: 'マイソング', bpm: +$('#bpm').value || 100, buf: custom });
  startMusic();
  $('#menu').classList.add('off');
  $('#end').classList.add('off');
  showPause(false);
  $('#hud').style.display = 'flex';
  $('#c1').textContent = song.jp;
  $('#c2').textContent = song.n + '  /  starring ' + G.ch.n;
  const cr = $('#cred');
  cr.classList.remove('pop'); void cr.offsetWidth; cr.classList.add('pop');
  last = performance.now();
  running = true;
}
function update(dt) {
  if (G.paused) return;
  if (G.hitstop > 0) { G.hitstop -= dt; return; }
  const bt = beatFloat(), bi = Math.floor(bt);
  if (bi !== G.lastBeat) { G.lastBeat = bi; G.pulse = 1; onBeat(bi); }
  G.ts += (G.tsT - G.ts) * (1 - Math.exp(-dt * 2.5));
  const d2 = dt * G.ts, d3 = dt * Math.max(G.ts, .7);
  G.bp = sectionOf(bt) === 'build' ? (bt - 48) / 16 : 0;
  G.t += d2; G.styT = Math.max(0, G.styT - dt * 2.2); G.wipe = Math.max(0, G.wipe - dt * 2.6);
  G.pulse *= Math.pow(.02, dt); G.flash *= Math.pow(.003, dt); G.red *= Math.pow(.05, dt); G.shake *= Math.pow(.01, dt);
  G.inv = Math.max(0, G.inv - dt); G.hitT = Math.max(0, G.hitT - dt); G.landT = Math.max(0, G.landT - dt);
  G.pickT = Math.max(0, G.pickT - dt);
  if (G.comboT > 0) { G.comboT -= dt; if (G.comboT <= 0) G.combo = 0; }
  G.lx += (G.lxT - G.lx) * (1 - Math.exp(-dt * 2.5));
  G.dim += (G.dimT - G.dim) * (1 - Math.exp(-dt * 2.5));
  const sp = (15 + song.bpm * .03 + Math.min(G.dist / 500, 5)) * ((G.ch && G.ch.speed) || 1);
  G.sp = sp; G.dist += sp * d2; G.score += sp * d2;
  playerPhysics(dt, d2, d3);
  objs.forEach(o => o.z -= sp * d2);
  objs = objs.filter(o => o.z > -12);
  decor.forEach(d => { d.z -= sp * d2; if (d.z < -14) Object.assign(d, mkDecor(d.x < 0 ? -1 : 1, d.z + 300, ENV)); });
  G.next -= sp * d2;
  if (G.next <= 0) { spawnRow(ENV, objs); G.next = sp * 120 / song.bpm; }
  checkCollisions();
  if (bi >= 128) finish(true);
  hudSet();
}
function laneWarn() {
  const th = [0, 0, 0];
  for (const o of objs) {
    if (o.hit || o.gone || o.t === 'orb' || o.z < -3 || o.z > 34) continue;
    const l = Math.round(o.x / LANE);
    if (l < -1 || l > 1) continue;
    const q = P(o.x, Math.max(.6, o.h * .5), o.z);
    if (q && q[0] > -40 && q[0] < W + 40 && q[1] > -40 && q[1] < H + 40) continue;
    th[l + 1] = 1;
  }
  if (!th[0] && !th[1] && !th[2]) return;
  const w = 26, gap = 10, x0 = W / 2 - (w * 3 + gap * 2) / 2, y = H * .86, pulse = .85 + .15 * Math.sin(G.t * 9);
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const x = x0 + i * (w + gap);
    ctx.globalAlpha = (th[i] ? .95 : .2) * pulse;
    ctx.fillStyle = th[i] ? ENV.pal.accent : '#fff4e6';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, 10, 4); else ctx.rect(x, y, w, 10);
    ctx.fill();
  }
  ctx.restore();
}
function render(dt) {
  camEase(dt);
  const fovB = cam.fov;
  cam.fov += G.bp * .7;
  cam.x = G.px * .7 + cam.ox; cam.y = cam.oy + G.pulse * .08; cam.z = cam.oz;
  const tx = G.px, ty = 1.2, tz = cam.la;
  cam.yaw = Math.atan2(tx - cam.x, tz - cam.z);
  cam.pit = Math.atan2(ty - cam.y, Math.hypot(tx - cam.x, tz - cam.z));
  const kF = Math.min(H * .95, W * 1.1) * cam.fov;
  const hz = clamp(H / 2 + Math.tan(cam.pit) * kF, -H * .7, H * 1.7);
  const e = ENV, p = e.pal;
  ctx.save();
  if (G.shake > .02 && !RM) ctx.translate((Math.random() - .5) * G.shake * 30, (Math.random() - .5) * G.shake * 30);
  ctx.translate(W / 2, H / 2); ctx.rotate(RM ? 0 : cam.roll); ctx.translate(-W / 2, -H / 2);
  const g = ctx.createLinearGradient(0, hz - H * .8, 0, hz);
  g.addColorStop(0, p.sky[0]); g.addColorStop(.6, p.sky[1]); g.addColorStop(1, p.sky[2]);
  ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, hz + H);
  drawHorizon(e, hz, G.pulse);
  drawGround(e, hz, G);
  const items = [], dd = (x, z) => (x - cam.x) * (x - cam.x) + (z - cam.z) * (z - cam.z), fog = z => clamp((100 - z) / 40, 0, 1);
  decor.forEach(d => items.push({ k: dd(d.x, d.z), a: fog(d.z), f: () => S(d.x, d.z, () => PROPS[d.kind](d, e)) }));
  objs.forEach(o => items.push({
    k: dd(o.x, o.z) + (OBS[o.t].ground ? 1e5 : 0), a: fog(o.z), f: () => {
      if (OBS[o.t].ground) OBS[o.t].drawG(o, e);
      else S(o.x, o.z, () => { if (o.t === 'person') ctx.scale(.92, .92); OBS[o.t].draw(o, e, G.t); });
    }
  }));
  items.push({
    k: dd(G.px, 0), a: 1, f: () => {
      if (G.inv > 0 && Math.floor(G.t * 14) % 2) return;
      S(G.px, 0, () => { ctx.translate(0, G.py); drawChara(G.ch, { pose: G.pose, ph: G.ph, t: G.t, x: G.px, z: 0, wind: clamp(G.sp / 45, 0, 1), landT: G.landT, hitT: G.hitT }); });
    }
  });
  items.sort((a, b) => b.k - a.k).forEach(i => { ctx.globalAlpha = i.a; i.f(); });
  ctx.globalAlpha = 1;
  ctx.restore();
  cam.fov = fovB;
  const q = qualityGet();
  const inten = (.15 + G.pulse * .25 + G.flash * .35 + Math.min((G.sp || 20) / 60, .2)) * (ST.gray ? 1.7 : 1) * (1 - G.bp * .7) + (G.tsT > 1 ? .25 : 0);
  drawSpeedLines(W / 2, H * .48, inten, q.lines);
  wxDraw(dt);
  drawBursts(dt);
  lightApply(e, G.lx);
  if (G.dim > .01) { ctx.fillStyle = 'rgba(8,10,44,' + G.dim.toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
  fxVignette(e.lights === 'night' || e.lights === 'neon' ? .34 : .18);
  post();
  bloom((ST.bloom || 0) * (q.bloom || 0) + G.bp * .7 + G.flash * .4);
  fxBandFlash(G.flash);
  if (G.red > .02) { ctx.fillStyle = 'rgba(255,40,70,' + (G.red * .45).toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
  fxChroma(G.flash * .6 + G.shake * .3);
  fxGrain(.5 + G.flash);
  if (G.bp > .01) {
    const g2 = ctx.createRadialGradient(W / 2, H / 2, H * .2, W / 2, H / 2, H * .9);
    g2.addColorStop(0, 'rgba(255,255,255,0)');
    g2.addColorStop(1, 'rgba(255,235,245,' + (G.bp * .55).toFixed(3) + ')');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }
  if (G.styT > .01) {
    const qq = 1 - G.styT, x = -H + qq * (W + H * 2), bw = W * .35;
    ctx.fillStyle = ST.gray ? '#000' : '#fff';
    ctx.globalAlpha = Math.sin(qq * 3.14) * .85;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + bw, 0); ctx.lineTo(x + bw - H * .5, H); ctx.lineTo(x - H * .5, H); ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (G.wipe > .01) {
    const qq = 1 - G.wipe, bw = W * .5, x = -bw + qq * (W + bw * 2);
    ctx.fillStyle = p.accent;
    ctx.globalAlpha = Math.sin(qq * 3.14) * .9;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + bw, 0); ctx.lineTo(x + bw - H * .6, H); ctx.lineTo(x - H * .6, H); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  const bar = H * .075;
  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0, 0, W, bar); ctx.fillRect(0, H - bar, W, bar);
  laneWarn();
}
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000);
  last = now;
  if (typeof fpsTick === 'function') { try { fpsTick(now); } catch (e) { /* ignore */ } }
  if (running) update(dt);
  if (G && (running || !$('#end').classList.contains('off'))) render(dt);
  requestAnimationFrame(frame);
}
uiInit();
requestAnimationFrame(frame);
