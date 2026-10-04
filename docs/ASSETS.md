# Hayate Run — Asset & License Policy

Hayate Run is almost fully procedural: every environment and every note is
generated at runtime. The single exception is two vendored CC0 character
sprite sheets documented below.

## Embedded CC0 assets (vendored)

- **AutoSprite free character sprite sheets** — https://www.autosprite.io/free-sprite-sheets —
  creator: AutoSprite — license: **CC0 1.0 Universal** (public-domain
  dedication; vendored copy at `assets/characters/autosprite/*/LICENSE.txt`) —
  **unmodified**.
  - `assets/characters/autosprite/ninja/walk-side.png` (+ `.json` atlas) —
    25-frame side-view walk cycle, 224px frames. Drives roster runner
    **Kage** via `src/sprites.js` + `src/characters.js`.
  - `assets/characters/autosprite/witch/walk-side.png` (+ `.json` atlas) —
    same format. Drives roster runner **Majo**.
  - Only the side-view walk sheets are vendored (~800KB total). The packs'
    other facings are isometric (wrong orientation for a side-runner) and no
    side-view *run* cycle exists in the free packs — known limitation: the
    walk cycle plays at run cadence with a procedural forward lean and bob
    (`drawSpriteChara` in `src/sprites.js`).

Procedural systems (no files ship for these):

- **Characters** — original vector artwork drawn per-frame by
  `src/animation.js` from palette/flag data in `src/characters.js`
  (mirrored in `data/characters.json`). No sprite sheets, no screenshots.
- **Environments** — procedural geometry (buildings, torii, trees, lamps,
  crystals …) drawn by `src/environments.js` / `src/renderer.js` from the
  160 manifests in `data/environments.json`.
- **Music** — original synthesized tracks composed live with the Web Audio API
  (`src/audio.js`). No audio files ship with the game; players may optionally
  load their own local `.mp3`/`.ogg` (never uploaded anywhere).

## Rules for contributors

1. **No ripped assets.** No anime screenshots, character sprites, game
   backgrounds, extracted music/SFX, logos, or fan-art tracings — even
   "placeholder".
2. **Every external asset needs provenance.** If you add one, document in this
   file: name, URL, creator, license, and whether it was modified.
3. **Prefer** CC0, public domain, MIT, Apache-2.0, or equivalent.
4. **Characters must stay original.** Do not copy designs from Naruto, One
   Piece, Dragon Ball, Bleach, Demon Slayer, Jujutsu Kaisen, Attack on Titan,
   My Hero Academia, Pokémon, Final Fantasy, Persona, or any other commercial
   work. Names, silhouettes, palettes, and outfits must be your own.

## Reference-only CC0 sources (not embedded)

These were used as *style references* while designing the original cast.
Nothing is copied from them into the repo:

- OpenGameArt — Anime Collection: https://opengameart.org/content/anime-collection (CC0)
- OpenGameArt — Anime Girl / Michona: https://opengameart.org/content/anime-girl (CC0)
- OpenGameArt — Anime Style Walkabouts: https://opengameart.org/content/anime-style-walkabouts (CC0)
- SpriteCook Free Game Assets: https://github.com/SpriteCook/spritecook-free-game-assets (CC0)
- RGS Dev — Free CC0 Modular Animated Vector Characters: https://rgsdev.itch.io/free-cc0-modular-animated-vector-characters-2d (CC0)

## Fonts

Display/body fonts load from Google Fonts (`Dela Gothic One`,
`Zen Kaku Gothic New`) with system-font fallbacks, so the game still works
offline. No font files are vendored.
