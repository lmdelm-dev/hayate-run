const fs = require('fs');
const R = 'C:/Users/Pc/hayate-run-repo/js/envs.js';
const F = 'C:/Users/Pc/hayate-run/src/environments.js';
let base = fs.readFileSync(F, 'utf8');
let extra = fs.readFileSync(R, 'utf8');
let s = base.trim() + '\n\n' + extra.trim() + '\n';
const anchor = '}];\n\nconst VARIANTS=[';
if (!s.includes(anchor)) throw new Error('theme anchor missing');
const themes = `,
{k:'country',name:'Countryside',ja:'\u7530\u820e\u9053',horizon:'hills',ground:'grass',glyphs:'\u7530\u7560\u9053\u98a8\u7a7a',
 wx:'leaves',nightWx:'fireflies',tags:['nature','rural'],
 props:['house','fence','tree','lamp','stall','bench'],
 obstacles:['crate','log','person','hole'],
 pal:{sky:['#2a6ab8','#7cc4ee','#dff4ff'],ground:'#4f8a44',road:['#9a8a70','#928464'],walk:['#b8a888','#b0a080'],hill:'#5a9a52',accent:'#ffd166',building:[[238,226,200],[224,210,186],[208,194,172]]}},
{k:'shrine',name:'Shrine',ja:'\u795e\u793e',horizon:'forest',ground:'grass',glyphs:'\u795e\u793e\u796d\u7948\u7e23',
 wx:'fireflies',nightWx:'fireflies',tags:['shrine'],
 props:['torii','lantern','tree','fence','stall','house'],
 obstacles:['person','tree','barrier','hole'],
 pal:{sky:['#27436e','#7a90c4','#f0d8e8'],ground:'#3e6e42',road:['#8a8478','#827c70'],walk:['#a8a094','#a0968c'],hill:'#3a5a48',accent:'#ff5c5c',building:[[226,210,188],[212,196,176],[196,180,162]]}},
{k:'station',name:'Underground Station',ja:'\u5730\u4e0b\u99c5',horizon:'city',ground:'deck',glyphs:'\u99c5\u7dda\u6539\u672d\u8eca',
 wx:'none',nightWx:'mist',tags:['city','station'],
 props:['pillar','sign','lamp','bench','vend','fence'],
 obstacles:['barrier','person','sign','hole'],
 pal:{sky:['#0c0e22','#2a2f5e','#6a6aa8'],ground:'#262a3e',road:['#333852','#2e3350'],walk:['#414763','#3c4260'],hill:'#1e2440',accent:'#ffd166',building:[[150,156,180],[132,138,162],[114,120,144]]}},
{k:'roof',name:'Rooftops',ja:'\u5c4b\u4e0a',horizon:'city',ground:'deck',glyphs:'\u5c4b\u4e0a\u7a7a\u98a8\u591c',
 wx:'none',nightWx:'neon',tags:['city','roof'],
 props:['pillar','fence','lamp','sign','vend','stall'],
 obstacles:['barrier','crate','person','hole'],
 pal:{sky:['#3a2a6e','#b46ac4','#ffd9a8'],ground:'#3a3452',road:['#4a4462','#443e5c'],walk:['#5a5472','#544e6c'],hill:'#4a3a7a',accent:'#4de3ff',building:[[196,170,220],[176,150,202],[156,130,184]]}},
{k:'castle',name:'Fantasy Castle',ja:'\u5e7b\u60f3\u57ce',horizon:'hills',ground:'grass',glyphs:'\u57ce\u9580\u7a7a\u661f\u5149',
 wx:'stars',nightWx:'stars',tags:['fantasy','castle'],
 props:['pillar','crystal','house','lantern','stall','tree'],
 obstacles:['crystal','rock','person','hole'],
 pal:{sky:['#1e2a6e','#6a6ad8','#ffd0e8'],ground:'#3e4a7a',road:['#5a5a8a','#545482'],walk:['#6a6a9a','#646492'],hill:'#5a4ab8',accent:'#ffd166',building:[[210,190,240],[190,170,222],[170,150,204]]}}
];\n\nconst VARIANTS=`;
s = s.split(anchor).join(themes);
const ao = "const AUTO_ORDER=['school-day','sakura-day','city-day','rain-rain','forest-day','mountain-snow','beach-day','neon-night',";
if (!s.includes(ao)) throw new Error('AUTO_ORDER anchor missing');
s = s.split("'school-festival'];").join("'school-festival','castle-night','shrine-night','station-night','country-festival','roof-festival','country-day','shrine-day','station-day','roof-day','castle-day'];");
const ob = ' asteroid:{w:1.8,d:1.8,h:1.8,';
if (!s.includes(ob)) throw new Error('OBS anchor missing');
s = s.split(ob).join(" orb:{w:.9,d:.9,h:1.2,pickup:1,draw(o,e,t){const b=Math.sin((t||0)*4+xj(o.seed))*.18;" +
"ctx.save();ctx.translate(0,1.1+b);ctx.rotate(Math.sin((t||0)*2)*.2);" +
"ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5,r=i%2?.16:.4;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();" +
"F(e.lights==='day'?'#ffd166':'#ffe9a0');" +
"ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(0,0,0,0,0,.8);g.addColorStop(0,'rgba(255,220,120,.8)');g.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=g;ctx.fillRect(-.8,-.8,1.6,1.6);ctx.restore();ctx.restore()}}," +
" asteroid:{w:1.8,d:1.8,h:1.8,");
fs.writeFileSync(F, s);
const CF = 'C:/Users/Pc/hayate-run/src/camera.js';
let c = fs.readFileSync(CF, 'utf8');
const ce = 'function camEase(dt){const m=SHOTS[G.shot]||SHOTS.chase,k=G.cut?1:1-Math.exp(-dt*7);';
if (!c.includes(ce)) throw new Error('camEase anchor missing');
c = c.split(ce).join(ce + "\n if(G){cam.x=(G.px||0)*.7+cam.ox;cam.y=cam.oy+(G.pulse||0)*.08;cam.z=cam.oz}");
fs.writeFileSync(CF, c);
const EF = 'C:/Users/Pc/hayate-run/src/engine.js';
let e = fs.readFileSync(EF, 'utf8');
const rs = 'function rs(){const d=Math.min(devicePixelRatio||1,2);';
if (!e.includes(rs)) throw new Error('rs anchor missing');
e = e.split(rs).join('function rs(){const cap=(typeof qualityGet==="function")?qualityGet().dpr:2;const d=Math.min(devicePixelRatio||1,cap);');
fs.writeFileSync(EF, e);
console.log('patches ok');
const vm = require('vm');
for (const f of [F, CF, EF]) vm.runInThisContext(fs.readFileSync(f, 'utf8'), { filename: f });
console.log('syntax ok');

