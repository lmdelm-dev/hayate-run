# Hayate Run (疾風 RUN)

An **anime-opening-inspired browser runner**. Pick one of 14 runners (12
original + 2 CC0 pixel guests) and sprint through a 128-beat opening:
beat-synced camera cuts, 160 cinematic worlds, weather, lighting, and a hype
drop — all static, no server.

**Play it:** https://lmdelm-dev.github.io/hayate-run/

## Features

- 14 runners: 12 original anime-style runners (school sprinter → cyber idol
  → rival), each with unique palette, accessories, speed, and jump, plus 2
  CC0 pixel-guest runners (Kage the ninja, Majo the witch) with real
  animated sprite sheets
- Rear / side / front run cycles: alternating limbs, body bounce, hair + cloth
  secondary motion, jump/fall/land/hit poses
- 160 environments (20 themes × day/dusk/night/rain/snow/storm/aurora/festival)
  with layered parallax horizons and grounds
- Beat-driven director: 13 camera shots, style cuts, slow-mo build, drop burst
- 4 original Web Audio synth tracks (92–172 BPM) + load-your-own audio file
- Weather (rain, petals, snow, neon, embers, mist …), dynamic lighting,
  speed lines, bursts, vignette, bloom, grain, chromatic fringe
- Real gameplay: 3 lanes, jump/double-feel jumps, hazards, star-orbs, combo
  scoring, lives, speed ramp, pause, game over, restart
- LOW / MEDIUM / HIGH / ULTRA quality with FPS monitor + auto degradation
- Desktop keyboard + mobile touch; responsive HUD with score/combo/progress

## Controls

| Action | Desktop | Mobile |
|---|---|---|
| Change lane | ← → or A/D | swipe left/right |
| Jump | ↑ / Space / W | swipe up or tap |
| Pause | P or Esc (or II button) | II button |
| Mute | M | mute checkbox |

## Development

No build step — open `index.html`, or serve the folder:

```sh
node test/smoke.js       # 60-assertion suite (must print ALL CHECKS PASSED)
node tools/gen-data.js   # regenerate data/*.json from src/
```

Pushing to `main` runs the suite in CI and deploys to GitHub Pages
(see `.github/workflows/deploy-pages.yml`).

## Asset / license policy

No ripped anime/game assets, ever. Art is original procedural vector work
plus two vendored CC0 sprite sheets, and all music is synthesized at runtime.
Details and CC0 reference sources:
[`docs/ASSETS.md`](docs/ASSETS.md). Architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Credits

Original game by the Hayate Run contributors — code, art, and music generated
for this repository. Fonts: Dela Gothic One / Zen Kaku Gothic New (Google
Fonts, fallback-safe offline).
