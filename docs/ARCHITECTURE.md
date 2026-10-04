# Hayate Run — Architecture

Static, no-build browser game. All paths are relative so it works both from
`file://` and under the `/hayate-run/` GitHub Pages subpath.

```text
index.html            DOM shell + script tags (relative src/ + styles/)
src/
  engine.js           canvas, math/colour helpers, projection, post, bloom
  audio.js            Web Audio synth tracks, beat clock (BPM/bars/sections)
  characters.js       12-runner roster data (palettes, flags, speed, jump)
  animation.js        rear/side/front runner renderer, run-cycle IK, accessories
  environments.js     env registry, 20 themes x 8 variants = 160 manifests,
                      props, obstacles (incl. orb), spawner
  renderer.js         horizons (city/peaks/sea/space/…) + ground (road/grid/…)
  weather.js          12 pooled weather systems (rain, petals, neon, mist …)
  lighting.js         per-environment light tint multiply
  particles.js        pooled speed lines + impact bursts
  effects.js          vignette, grain, chromatic fringe, flash + EFFECTS catalog
  camera.js           13 named shots, eased cuts, world-synced position
  director.js         beat-driven opening timeline + OPENINGS data
  player.js           lane/jump/physics/pose/pickups
  collision.js        hazard + collectible resolution
  input.js            keyboard + touch
  ui.js               menu/HUD/pause/settings/credits
  performance.js      LOW–ULTRA quality, FPS monitor, auto degradation
  main.js             run lifecycle, update/render loop, boot
data/                 generated mirrors of runtime data (see tools/gen-data.js)
styles/               main.css (base) / menu.css (screens) / game.css (HUD)
test/smoke.js         60-assertion suite: world, cast, camera, director,
                      full-song sim, roster, orbs, pause, quality, manifests
tools/gen-data.js     regenerates data/*.json from the live sources
.github/workflows/   validate (node test/smoke.js) then deploy to Pages
```

## Key flows

- **Beat sync** — `audio.js` schedules a 128-beat song (intro 0–16, verse
  16–48, build 48–64, drop 64–112, outro 112–128). `update()` derives the beat
  from the audio clock; `director.js onBeat()` cuts cameras, environments,
  styles, weather, and slow-motion on section boundaries. Kick/drop accents
  drive shake, flash, and particle bursts.
- **Camera** — `setShot()` + `camEase()` lerp position/FOV/roll; `viewAt()`
  picks the rear/side/front drawing path so the runner is correct from
  every angle.
- **Environments** — manifests declare palette, horizon, ground, lights,
  weather, props, and obstacles. The auto director rotates a curated order;
  drop sections cut every 8 beats with a wipe.
- **Performance** — object pools for weather/bursts, capped DPR, downsampled
  bloom, quality auto-step-down below 45 fps.

## Regenerating manifests

```sh
node tools/gen-data.js   # rewrites data/*.json from src/
node test/smoke.js       # full suite, must print ALL CHECKS PASSED
```
