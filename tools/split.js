const fs = require('fs');
const R = 'C:/Users/Pc/hayate-run-repo/js/';
const O = 'C:/Users/Pc/hayate-run/src/';
const read = f => fs.readFileSync(R + f, 'utf8');
function after(src, marker) { const i = src.indexOf(marker); if (i < 0) throw new Error('marker missing: ' + marker); return [src.slice(0, i), src.slice(i)]; }
// character.js -> characters.js (roster head) + animation.js (rest)
{
  const src = read('character.js');
  const [head, tail] = after(src, 'function viewAt');
  fs.writeFileSync(O + 'characters.js', head.trim() + '\n');
  fs.writeFileSync(O + 'animation.js', tail.trim() + '\n');
}
// world.js -> environments.js + renderer.js + lighting.js + weather.js
{
  const src = read('world.js');
  const [env, rest1] = after(src, 'const STARS=');
  const [rend, rest2] = after(rest1, 'function lightApply');
  const [light, wx] = after(rest2, 'const WXP=');
  fs.writeFileSync(O + 'environments.js', env.trim() + '\n');
  fs.writeFileSync(O + 'renderer.js', rend.trim() + '\n');
  fs.writeFileSync(O + 'lighting.js', light.trim() + '\n');
  fs.writeFileSync(O + 'weather.js', wx.trim() + '\n');
}
// director.js -> camera.js + director.js
{
  const src = read('director.js');
  const [cam, dir] = after(src, 'function cap(');
  fs.writeFileSync(O + 'camera.js', cam.trim() + '\n');
  fs.writeFileSync(O + 'director.js', dir.trim() + '\n');
}
// game.js -> main.js (orchestration, will be refactored next)
{
  fs.writeFileSync(O + 'main.js', read('game.js'));
}
console.log('split ok');
try {
  for (const f of ['characters.js','animation.js','environments.js','renderer.js','lighting.js','weather.js','camera.js','director.js','main.js'])
    new (require('vm').Script)(fs.readFileSync(O + f, 'utf8'), { filename: f });
  console.log('syntax ok');
} catch (e) { console.log('SYNTAX FAIL: ' + e.message); process.exit(1); }
