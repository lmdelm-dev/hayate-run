const fs = require('fs'), vm = require('vm');
const F = 'C:/Users/Pc/hayate-run/src/environments.js';
let s = fs.readFileSync(F, 'utf8');
const a = '  objs.push(o)})}';
if (!s.includes(a)) throw new Error('spawn anchor missing');
s = s.split(a).join("  objs.push(o)})\n if(Math.random()<.4){const free=[-1,0,1].filter(l=>lanes.indexOf(l)<0);if(free.length){const l=free[Math.random()*free.length|0];objs.push({t:'orb',x:l*LANE,z:97,hit:false,ci:0,sd:Math.random()*9|0,seed:Math.random()*6.28,w:.9,d:.9,h:1.2})}}}");
fs.writeFileSync(F, s);
new vm.Script(s, { filename: F });
console.log('spawnRow orb patch ok');
