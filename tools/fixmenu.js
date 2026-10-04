const fs = require('fs'), vm = require('vm');
const F = 'C:/Users/Pc/hayate-run/src/ui.js';
let s = fs.readFileSync(F, 'utf8');
if (!s.startsWith('let si=')) s = 'let si=0,ci=0;\n' + s;
fs.writeFileSync(F, s);
new vm.Script(s, { filename: F });
console.log('menu state ok');
