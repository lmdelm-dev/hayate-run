const fs = require('fs');
const s = fs.readFileSync('C:/Users/Pc/hayate-run/src/camera.js', 'utf8');
const i = s.indexOf('function camEase');
console.log(s.slice(i, i + 420));
