let si=0,ci=0;
﻿/* DOM shell: menu cards, HUD, pause overlay, settings, credits. */
function hudSet() {
  $('#sc').textContent = (G.dist | 0) + ' m';
  const sc = $('#score');
  if (sc) sc.textContent = ((G.score || 0) | 0) + ' pts';
  const cb = $('#combo');
  if (cb) {
    cb.textContent = G.combo >= 2 ? 'COMBO x' + G.combo : '';
    cb.classList.toggle('hot', G.combo >= 5);
  }
  $('#hp').textContent = '♥'.repeat(Math.max(0, G.lives));
  const pr = $('#prog');
  if (pr) pr.style.width = (clamp(G.lastBeat, 0, 128) / 128 * 100).toFixed(1) + '%';
  const en = $('#envname');
  if (en && typeof ENV !== 'undefined' && ENV) en.textContent = ENV.name;
}
function showPause(v) {
  const p = $('#pause');
  if (p) p.classList.toggle('off', !v);
}
function toggleMuteUI() {
  const m = $('#mute');
  const muted = (typeof toggleMute === 'function') ? toggleMute() : false;
  if (m) m.checked = !!muted;
  return muted;
}
function uiBuildCards(id, arr, html, pick) {
  const el = $(id);
  el.innerHTML = '';
  arr.forEach((a, i) => {
    const b = document.createElement('button');
    b.className = 'card';
    b.innerHTML = html(a);
    b.setAttribute('aria-pressed', i === 0);
    b.onclick = () => { pick(i); [...el.children].forEach((x, j) => x.setAttribute('aria-pressed', j === i)); };
    el.appendChild(b);
  });
}
function uiInit() {
  uiBuildCards('#songs', SONGS, s => '<strong>' + s.jp + '</strong><span>' + s.n + ' · ' + s.bpm + ' BPM</span>', i => { si = i; });
  uiBuildCards('#chars', CHARS, c => icon(c) + '<strong>' + c.n + ' <small>' + c.jp + '</small></strong><span>' + c.role + ' · ' + c.desc + '</span>', i => { ci = i; });
  const sel = $('#env');
  if (sel && typeof ENVS !== 'undefined') {
    const byTheme = {};
    ENVS.forEach(e => { (byTheme[e.theme] = byTheme[e.theme] || []).push(e); });
    Object.keys(byTheme).forEach(t => {
      const list = byTheme[t];
      const og = document.createElement('optgroup');
      og.label = list[0].themeName + ' (' + list[0].themeJa + ')';
      list.forEach(e => {
        const op = document.createElement('option');
        op.value = e.id;
        op.textContent = e.variantName;
        og.appendChild(op);
      });
      sel.appendChild(og);
    });
  }
  const q = $('#quality');
  if (q) {
    q.value = Quality.current;
    q.onchange = () => setQuality(q.value, false);
    const qa = $('#qauto');
    if (qa) {
      qa.checked = Quality.auto;
      qa.onchange = () => setQuality(Quality.current, qa.checked);
    }
  }
  const mute = $('#mute');
  if (mute) {
    let saved = null;
    try { saved = typeof localStorage !== 'undefined' && localStorage.getItem('hayate-mute'); } catch (e) { /* ignore */ }
    if (saved === '1' && typeof setMuted === 'function') setMuted(true);
    mute.checked = saved === '1';
    mute.onchange = () => {
      if (typeof setMuted === 'function') setMuted(mute.checked);
      try { if (typeof localStorage !== 'undefined') localStorage.setItem('hayate-mute', mute.checked ? '1' : '0'); } catch (e) { /* ignore */ }
    };
  }
  const cr = $('#credits');
  if (cr) cr.textContent = 'Original synth tracks · procedural cast & worlds · CC0-only (see docs/ASSETS.md)';
  if ($('#go')) $('#go').onclick = startRun;
  if ($('#again')) $('#again').onclick = () => { $('#end').classList.add('off'); $('#menu').classList.remove('off'); };
  if ($('#pauseBtn')) $('#pauseBtn').onclick = () => togglePause();
  if ($('#resume')) $('#resume').onclick = () => resumeGame();
  if ($('#restart')) $('#restart').onclick = () => { resumeGame(true); startRun(); };
  if ($('#quit')) $('#quit').onclick = () => { resumeGame(true); running = false; stopMusic(); $('#pause').classList.add('off'); $('#end').classList.add('off'); $('#menu').classList.remove('off'); };
  if ($('#file')) $('#file').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    try { custom = await ac.decodeAudioData(await f.arrayBuffer()); $('#fn').textContent = f.name; }
    catch (_) { custom = null; $('#fn').textContent = 'Could not read that file'; }
  };
}
