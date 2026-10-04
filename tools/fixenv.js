const fs = require('fs');
const F = 'C:/Users/Pc/hayate-run/src/environments.js';
let s = fs.readFileSync(F, 'utf8');
const a = 'building:[[220,180,255],[200,160,240],[180,140,220]]},';
if (!s.includes(a)) throw new Error('anchor missing');
s = s.split(a).join('building:[[220,180,255],[200,160,240],[180,140,220]]}},');
fs.writeFileSync(F, s);
require('vm').runInThisContext(s, { filename: F });
console.log('environments PARSE OK, len=' + s.length);
