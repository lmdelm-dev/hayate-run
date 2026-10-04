const fs = require('fs'), path = require('path');
const R = 'C:/Users/Pc/hayate-run/';
let s = fs.readFileSync(R + 'test/smoke.base.js', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('pattern missing: ' + a.slice(0, 60)); s = s.split(a).join(b); };
// 1. new 18-module load order
rep("const files=['core.js','audio.js','character.js','world.js','envs.js','director.js','game.js','main.js'];",
    "const files=['engine.js','audio.js','characters.js','animation.js','environments.js','renderer.js','weather.js','lighting.js','particles.js','effects.js','camera.js','director.js','player.js','collision.js','input.js','ui.js','performance.js','main.js'];");
rep("fs.readFileSync(path.join(root,'js',f),'utf8')", "fs.readFileSync(path.join(root,'src',f),'utf8')");
// 2. harness: localStorage + audio suspend/resume
rep("const timers=[];", "g.localStorage={_m:{},getItem(k){return(k in this._m)?this._m[k]:null},setItem(k,v){this._m[k]=String(v)},removeItem(k){delete this._m[k]}};\nFakeAC.prototype.suspend=function(){return Promise.resolve()};\nFakeAC.prototype.resume=function(){return Promise.resolve()};\nconst timers=[];");
// 3. expose new globals for tests
rep("reset,update,render,onBeat,setShot,camEase,envCut,setEnv,wxSet,wxForce,drawChara,hit,finish,",
    "reset,update,render,onBeat,setShot,camEase,envCut,setEnv,wxSet,wxForce,drawChara,hit,finish,togglePause,pauseGame,resumeGame,setQuality,QLEVELS,Quality,checkCollisions,collectOrb,spawnBurst,OPENINGS,");
// 4. bigger world: 160 envs
rep("ok(T.envCount()===120,'120 environment manifests registered (got '+T.envCount()+')');",
    "ok(T.envCount()===160,'160 environment manifests registered (got '+T.envCount()+')');");
rep("ok(!envErr,'all 120 environments render'", "ok(!envErr,'all 160 environments render'");
// 5. longer song: 5600-frame simulation
rep("while(frames<4200&&T.running){", "while(frames<5600&&T.running){");
rep("ok(!err,'4200 frames of update+render clean'", "ok(!err,'5600 frames of update+render clean'");
// 6. extra suites before final summary
rep("console.log('\\n'+(fail?'FAILED: '+fail+' assertion(s)':'ALL CHECKS PASSED'));",
`console.log('\\n-- 12-character roster --');
ok(T.CHARS.length>=12,'at least 12 playable characters (got '+T.CHARS.length+')');
const badCh=[];
T.CHARS.forEach(c=>{['id','name','jp','role','hair','skin','top','legs','eye','speed','jumpV','desc'].forEach(k=>{if(c[k]===undefined||c[k]===null)badCh.push((c.id||c.n||'?')+'.'+k)})});
ok(badCh.length===0,'every character has full roster metadata'+(badCh.length?' -> '+badCh.slice(0,6):''));
const seenCh=new Set();let dupeCh=0;T.CHARS.forEach(c=>{if(seenCh.has(c.id))dupeCh++;seenCh.add(c.id)});
ok(!dupeCh,'no duplicate character ids');
let rosterErr=null;
['run','jump','fall','land','hit'].forEach(p=>{['chase','sideR','front'].forEach(sh=>{T.setShot(sh,1);T.camEase(.016);
 T.CHARS.forEach(c=>{try{T.drawChara(c,{pose:p,ph:1.1,t:2,x:0,z:0,wind:.5,landT:.2,hitT:.5})}catch(e){rosterErr=String(e).split('\\n')[0]+' ['+c.id+' '+p+' '+sh+']'}})})});
ok(!rosterErr,'all 12+ characters render in 5 poses x 3 views'+(rosterErr?' -> '+rosterErr:''));
console.log('\\n-- collectibles + combo --');
T.reset();T.running=true;
T.objs.push({t:'orb',x:T.G.px,z:0.4,w:.9,d:.9,h:1.2,hit:false,ci:0,sd:1,seed:0});
T.update(1/60);
ok(T.G.combo>=1,'orb pickup raises combo (got '+T.G.combo+')');
ok(T.G.score>0,'orb pickup raises score (got '+T.G.score+')');
ok(!T.objs.some(o=>o.t==='orb'),'picked orb is removed');
console.log('\\n-- pause --');
T.reset();T.running=true;
T.togglePause();ok(T.G.paused===true,'paused flag set');
const d0=T.G.dist;T.update(1/60);ok(T.G.dist===d0,'update frozen while paused');
T.togglePause();ok(T.G.paused!==true,'resumed after second toggle');
console.log('\\n-- quality levels --');
ok(T.QLEVELS&&T.QLEVELS.length===4,'4 quality levels LOW/MEDIUM/HIGH/ULTRA (got '+(T.QLEVELS&&T.QLEVELS.length)+')');
let qErr=null;['LOW','MEDIUM','HIGH','ULTRA'].forEach(q=>{try{T.setQuality(q)}catch(e){qErr=String(e).split('\\n')[0]+' ['+q+']'}});
ok(!qErr,'all quality levels apply'+(qErr?' -> '+qErr:''));
T.setQuality('HIGH');
console.log('\\n-- data manifests --');
const dj=JSON.parse(fs.readFileSync(path.join(root,'data','characters.json'),'utf8'));
ok(dj.length===T.CHARS.length,'data/characters.json matches roster ('+dj.length+')');
const de=JSON.parse(fs.readFileSync(path.join(root,'data','environments.json'),'utf8'));
ok(de.length===T.envCount(),'data/environments.json matches registry ('+de.length+')');
const dop=JSON.parse(fs.readFileSync(path.join(root,'data','openings.json'),'utf8'));
ok(dop.sections&&dop.sections[0].startBeat===0,'openings.json timeline starts at beat 0');
ok(dop.sections[dop.sections.length-1].endBeat>=128,'openings.json timeline covers 128 beats');
const dfx=JSON.parse(fs.readFileSync(path.join(root,'data','effects.json'),'utf8'));
ok(dfx.effects&&dfx.effects.length>=10,'effects.json catalogs 10+ effects (got '+(dfx.effects&&dfx.effects.length)+')');
console.log('\\n-- github pages paths --');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
ok(html.indexOf('src="/')<0&&html.indexOf('href="/')<0,'no root-absolute asset paths (subpath safe)');
['src/engine.js','src/main.js','styles/main.css'].forEach(p=>{ok(html.indexOf(p)>=0,'index.html references '+p)});
console.log('\\n'+(fail?'FAILED: '+fail+' assertion(s)':'ALL CHECKS PASSED'));`);
fs.writeFileSync(R + 'test/smoke.js', s);
console.log('test written: ' + s.split('\\n').length + ' lines');
