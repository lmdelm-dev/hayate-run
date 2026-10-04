/* Keyboard + touch input. Desktop: arrows/WASD/space. P/Esc pause, M mute. */
addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') lane(-1);
  else if (e.key === 'ArrowRight' || e.key === 'd') lane(1);
  else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') { e.preventDefault(); jump(); }
  else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') togglePause();
  else if (e.key === 'm' || e.key === 'M') toggleMuteUI();
});
let touchStartPt = null;
addEventListener('touchstart', e => { touchStartPt = e.touches[0]; }, { passive: true });
addEventListener('touchend', e => {
  if (!touchStartPt || !running) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartPt.clientX, dy = t.clientY - touchStartPt.clientY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 25) lane(dx > 0 ? 1 : -1);
  else if (dy < -25 || (Math.abs(dx) < 10 && Math.abs(dy) < 10)) jump();
  touchStartPt = null;
});
