const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
let fail=0;
const ok=(c,m)=>{if(c){console.log('  ok  '+m)}else{fail++;console.log('FAIL  '+m)}};

const grads={addColorStop(){}};
const ctxStub=new Proxy({},{get(t,k){
  if(k==='roundRect')return (x,y,w,h,r)=>{};
  if(k==='createLinearGradient'||k==='createRadialGradient')return ()=>grads;
  if(k==='createPattern')return ()=>({kind:'pattern'});
  if(typeof k==='symbol')return undefined;
  if(!(k in t))t[k]=()=>{};
  return t[k]},
 set(t,k,v){t[k]=v;return true}});

function makeEl(tag){
 const e={tag,textContent:'',value:tag==='select'?'auto':'',label:'',width:0,height:0,offsetWidth:1,
  style:{},attributes:{},_kids:[],_html:'',
  classList:{_s:new Set(),add(c){this._s.add(c)},remove(c){this._s.delete(c)},toggle(c,f){if(f===undefined)f=!this._s.has(c);if(f)this._s.add(c);else this._s.delete(c)},contains(c){return this._s.has(c)}},
  appendChild(c){this._kids.push(c);return c},
  setAttribute(k,v){this.attributes[k]=String(v)},getAttribute(k){return this.attributes[k]},
  getContext(){return ctxStub},addEventListener(){},click(){this.onclick&&this.onclick({})},
  onclick:null,onchange:null};
 Object.defineProperty(e,'children',{get(){return e._kids}});
 Object.defineProperty(e,'innerHTML',{get(){return e._html},set(v){e._html=v;if(v==='')e._kids.length=0}});
 return e}

const registry=new Map();
const document={querySelector(s){if(!registry.has(s))registry.set(s,makeEl('div'));return registry.get(s)},
 createElement:makeEl};
registry.set('#c',makeEl('canvas'));
registry.set('#look',makeEl('select'));
registry.set('#env',makeEl('select'));
registry.set('#bpm',makeEl('input'));
registry.get('#bpm').value='100';

class FakeAC{
 constructor(){this.currentTime=0;this.sampleRate=44100;this.destination={}}
 resume(){return Promise.resolve()}
 createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},setTargetAtTime(){}},connect(){}}}
 createBiquadFilter(){return{type:'',frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}
 createOscillator(){return{type:'',frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}}}
 createBuffer(ch,len){return{length:len,getChannelData(){return new Float32Array(len)}}}
 createBufferSource(){return{buffer:null,connect(){},start(){},stop(){}}}}

const timers=[];
const g=globalThis;
g.window=g;
g.document=document;
g.AudioContext=FakeAC;
g.matchMedia=()=>({matches:false});
g.addEventListener=()=>{};
g.removeEventListener=()=>{};
g.innerWidth=1280;g.innerHeight=720;g.devicePixelRatio=1;
let raf=null;
g.requestAnimationFrame=fn=>{raf=fn;return 1};
const realSetInterval=g.setInterval;
g.setInterval=(fn,ms)=>{timers.push(fn);return timers.length};
g.clearInterval=()=>{};
g.localStorage={_m:{},getItem(k){return(k in this._m)?this._m[k]:null},setItem(k,v){this._m[k]=String(v)},removeItem(k){delete this._m[k]}};
FakeAC.prototype.suspend=function(){return Promise.resolve()};
FakeAC.prototype.resume=function(){return Promise.resolve()};


const EPilogue=`
globalThis.__T={
 get G(){return G},set G(v){G=v},
 get ENV(){return ENV},set ENV(v){ENV=v},
 get ST(){return ST},set ST(v){ST=v},
 get running(){return running},set running(v){running=v},
 get ac(){return ac},set ac(v){ac=v},
 get objs(){return objs},get si(){return si},get ci(){return ci},
  reset,update,render,onBeat,setShot,camEase,envCut,setEnv,wxSet,wxForce,drawChara,hit,finish,togglePause,pauseGame,resumeGame,setQuality,QLEVELS,Quality,checkCollisions,collectOrb,spawnBurst,OPENINGS,
  ENVS,PROPS,OBS,PROPSZ,SHOTS,STY,CHARS,PEOPLE,SONGS,WXP,AUTO_ORDER,autoEnvList,viewAt,
  spawnRow,mkDecor,drawHorizon,drawGround,lightApply,post,bloom,laneWarn,envById,envCount,
  spriteFrame,spriteRect,spriteReady,drawSpriteChara,spriteLoadAll,
  get ctx(){return ctx}
};`;

const files=['engine.js','audio.js','characters.js','animation.js','sprites.js','environments.js','renderer.js','weather.js','lighting.js','particles.js','effects.js','camera.js','director.js','player.js','collision.js','input.js','ui.js','performance.js','main.js'];
const bundle=files.map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n;\n')+EPilogue;
try{vm.runInThisContext(bundle,{filename:'bundle.js'})}
catch(e){console.log('FAIL  bundle load: '+e.stack);process.exit(1)}
const T=globalThis.__T;
ok(true,'bundle loaded');
try{T.reset()}catch(e){fail++;console.log('FAIL  reset(): '+e.stack);process.exit(1)}

console.log('\n-- world system --');
ok(T.envCount()===160,'160 environment manifests registered (got '+T.envCount()+')');
const badLic=[],badProp=[],badObs=[],dupe=new Set(),seen=new Set();
T.ENVS.forEach(e=>{
 if(!e.license||!e.source||!e.author)badLic.push(e.id);
 if(seen.has(e.id))dupe.add(e.id);seen.add(e.id);
 e.props.forEach(p=>{if(!T.PROPS[p]||!T.PROPSZ[p])badProp.push(e.id+':'+p)});
 e.obstacles.forEach(o=>{if(!T.OBS[o])badObs.push(e.id+':'+o)});
 ['sky','ground','road','walk','hill','accent','building'].forEach(k=>{if(!e.pal[k])badProp.push(e.id+' pal.'+k)});
 if(!e.light||!e.weather||!e.horizon||!e.ground)badLic.push(e.id+' structure')});
ok(badLic.length===0,'every manifest has license/source/author + core fields'+(badLic.length?' -> '+badLic.slice(0,5):''));
ok(badProp.length===0,'every declared prop exists in PROPS/PROPSZ'+(badProp.length?' -> '+badProp.slice(0,5):''));
ok(badObs.length===0,'every declared obstacle exists in OBS'+(badObs.length?' -> '+badObs.slice(0,5):''));
ok(dupe.size===0,'no duplicate env ids');
ok(T.AUTO_ORDER.every(id=>!!T.envById(id)),'AUTO_ORDER references real ids');
ok(T.OBS.hole&&T.OBS.hole.ground,'jumpable hole obstacle present');

console.log('\n-- character system --');
['run','jump','fall','land','hit'].forEach(pose=>{
 ['rear','side','front'].forEach(v=>{
  const shot=v==='rear'?'chase':v==='side'?'sideR':'front';
  T.setShot(shot,1);T.camEase(0.016);
  T.CHARS.forEach(c=>{
   try{T.drawChara(c,{pose,ph:1.2*t2(pose),t:1.5,x:0,z:0,wind:.5,landT:.2,hitT:.5})}
   catch(e){fail++;console.log('FAIL  chara '+c.n+' '+pose+'/'+v+': '+e.message)}})});
 ok(true,'pose '+pose+' x 3 views x '+T.CHARS.length+' characters')});
function t2(p){return p==='run'?3:1}
const V=['rear','side','front'],P5=['run','jump','fall','land','hit'];
let charErr=null;
V.forEach(v=>{T.setShot(v==='rear'?'chase':v==='side'?'sideR':'front',1);T.camEase(.016);
 P5.forEach(p=>T.CHARS.concat(T.PEOPLE).forEach(c=>{
  try{T.drawChara(c,{pose:p,ph:.9,t:2,x:0,z:0,wind:.6,landT:.1,hitT:.3})}catch(e){charErr=e}}))});
ok(!charErr,'all characters x views x poses render'+(charErr?' -> '+charErr.stack.split('\n')[0]:''));

console.log('\n-- camera + shots --');
Object.keys(T.SHOTS).forEach(k=>{try{T.setShot(k,1);T.camEase(.016)}catch(e){fail++;console.log('FAIL shot '+k+': '+e.message)}});
ok(true,Object.keys(T.SHOTS).length+' named shots (chase/side/front/close/wide/top/dutch/face...)');
['rear','side','front'].forEach(v=>{const s=v==='rear'?'chase':v==='side'?'sideR':'front';
 T.setShot(s,1);T.camEase(.016);const r=T.viewAt(0,0);
 ok(r.v===v,'viewAt -> '+v+' using shot '+s+' (got '+r.v+')')});

console.log('\n-- director storyboard --');
T.reset();
let beatErr=null;
for(let b=0;b<=132;b++){try{T.onBeat(b)}catch(e){beatErr=e;break}}
ok(!beatErr,'onBeat(0..132) clean'+(beatErr?' -> '+beatErr.stack.split('\n')[0]:''));

console.log('\n-- full simulation --');
T.reset();
try{globalThis.startMusic()}catch(e){fail++;console.log('FAIL startMusic: '+e.stack)}
T.running=true;
let frames=0,maxBeat=0,died=false,err=null;
try{
 while(frames<5600&&T.running){
  T.ac.currentTime+=1/60;
  timers.forEach(fn=>{try{fn()}catch(e){throw e}});
  T.G.lives=5;T.G.inv=1;
  T.update(1/60);
  T.render(1/60);
  if(T.G)maxBeat=Math.max(maxBeat,T.G.lastBeat);
  frames++;
  if(T.G.pose==='hit')T.G.inv=0;
 }
}catch(e){err=e}
ok(!err,'5600 frames of update+render clean'+(err?' -> '+err.stack.split('\n')[0]:''));
ok(maxBeat>=128,'reached end of song structure (beat '+maxBeat+')');
ok(!T.running,'run finished -> end screen');
ok(maxBeat>=64,'passed the 64-beat drop');

console.log('\n-- every environment renders --');
T.running=true;T.G.lives=9;
let envErr=null;
T.ENVS.forEach(e=>{try{
  T.setEnv(e.id);
  T.G.dim=.3;T.G.lx=1.2;
  T.render(1/60);
 }catch(ex){envErr=ex+' ['+e.id+']'}});
ok(!envErr,'all 160 environments render'+(envErr?' -> '+envErr:''));

console.log('\n-- every render style renders --');
let styErr=null;
T.STY.forEach((s,i)=>{try{T.ST=s;T.render(1/60)}catch(ex){styErr=ex+' ['+s.k+']'}});
ok(!styErr,'all 8 render styles render'+(styErr?' -> '+styErr:''));

console.log('\n-- every obstacle + prop draws --');
let drawErr=null;
Object.keys(T.OBS).forEach(k=>{try{
  const o={t:k,x:0,z:6,hit:false,ci:0,sd:3,seed:1,w:T.OBS[k].w,d:T.OBS[k].d,h:T.OBS[k].h};
  if(k==='person')o.pal=T.PEOPLE[0];
  T.setShot('chase',1);T.camEase(.016);
  if(T.OBS[k].ground)T.OBS[k].drawG(o,T.ENV);else T.OBS[k].draw(o,T.ENV,1);
 }catch(ex){drawErr=ex+' ['+k+']'}});
ok(!drawErr,'all '+Object.keys(T.OBS).length+' obstacle types draw'+(drawErr?' -> '+drawErr:''));
let propErr=null;
Object.keys(T.PROPS).forEach(k=>{try{
  const s=T.PROPSZ[k],o={kind:k,x:-8,z:14,w:(s.w[0]+s.w[1])/2,h:(s.h[0]+s.h[1])/2,d:(s.d[0]+s.d[1])/2,ci:1,sd:4,c1:'#886644',c2:'#aa5533',pk:0};
  T.PROPS[k](o,T.ENV);
 }catch(ex){propErr=ex+' ['+k+']'}});
ok(!propErr,'all '+Object.keys(T.PROPS).length+' prop types draw'+(propErr?' -> '+propErr:''));

console.log('\n-- weather particles --');
let wxErr=null;
Object.keys(T.WXP).forEach(k=>{try{T.wxSet(k);for(let i=0;i<30;i++)globalThis.wxDraw&&0;T.render(1/60)}catch(ex){wxErr=ex+' ['+k+']'}});
ok(!wxErr,'all '+Object.keys(T.WXP).length+' weather kinds draw'+(wxErr?' -> '+wxErr:''));

console.log('\n-- screen sizes --');
[[1920,1080],[1280,720],[768,1024],[390,844]].forEach(([w,h])=>{
 g.innerWidth=w;g.innerHeight=h;
 try{globalThis.rs();T.render(1/60);ok(true,w+'x'+h)}
 catch(e){fail++;console.log('FAIL  '+w+'x'+h+': '+e.message)}});

console.log('\n-- 12-character roster --');
ok(T.CHARS.length>=12,'at least 12 playable characters (got '+T.CHARS.length+')');
const badCh=[];
T.CHARS.forEach(c=>{['id','name','jp','role','hair','skin','top','legs','eye','speed','jumpV','desc'].forEach(k=>{if(c[k]===undefined||c[k]===null)badCh.push((c.id||c.n||'?')+'.'+k)})});
ok(badCh.length===0,'every character has full roster metadata'+(badCh.length?' -> '+badCh.slice(0,6):''));
const seenCh=new Set();let dupeCh=0;T.CHARS.forEach(c=>{if(seenCh.has(c.id))dupeCh++;seenCh.add(c.id)});
ok(!dupeCh,'no duplicate character ids');
let rosterErr=null;
['run','jump','fall','land','hit'].forEach(p=>{['chase','sideR','front'].forEach(sh=>{T.setShot(sh,1);T.camEase(.016);
 T.CHARS.forEach(c=>{try{T.drawChara(c,{pose:p,ph:1.1,t:2,x:0,z:0,wind:.5,landT:.2,hitT:.5})}catch(e){rosterErr=String(e).split('\n')[0]+' ['+c.id+' '+p+' '+sh+']'}})})});
ok(!rosterErr,'all 12+ characters render in 5 poses x 3 views'+(rosterErr?' -> '+rosterErr:''));
console.log('\n-- pixel guest sprites --');
const spr=T.CHARS.filter(c=>c.sprite);
ok(spr.length===2,'2 pixel-guest runners registered (got '+spr.length+')');
let sprErr=null;
spr.forEach(c=>{const s=c.sprite;
 try{
  if(!(s.src&&s.fw>0&&s.cols>0&&s.count>0))throw new Error('bad sprite meta');
  const png=path.join(root,s.src);
  if(!fs.existsSync(png))throw new Error('missing '+s.src);
  if(fs.statSync(png).size>1024*1024)throw new Error('too big '+s.src);
  const at=JSON.parse(fs.readFileSync(png.replace(/\.png$/,'.json'),'utf8'));
  if(Object.keys(at.frames).length!==s.count)throw new Error('atlas count mismatch');
  const frs=[];for(let k=0;k<80;k++)frs.push(T.spriteFrame(c,'run',k*.37));
  if(!frs.every(f=>f>=0&&f<s.count)||new Set(frs).size<4)throw new Error('frames do not cycle');
  const r=T.spriteRect(c,s.count-1);
  if(r[0]+r[2]>at.meta.size.w||r[1]+r[3]>at.meta.size.h)throw new Error('frame outside sheet');
  const keep=T.ctx.drawImage;
  let drew=null;T.ctx.drawImage=function(){drew=Array.from(arguments)};
  s.img={complete:true,naturalWidth:1120,width:1120,height:1120};
  if(!T.spriteReady(c))throw new Error('spriteReady false with loaded img');
  T.setShot('sideR',1);T.camEase(.016);
  ['run','jump','fall','land','hit'].forEach(p=>T.drawChara(c,{pose:p,ph:1.2,t:2,x:0,z:0,wind:.5}));
  T.ctx.drawImage=keep;
  if(!drew)throw new Error('no drawImage call');
  if(drew[1]<0||drew[2]<0||drew[1]+drew[3]>1120||drew[2]+drew[4]>1120)throw new Error('source rect out of bounds');
  if(!(drew[7]>0&&drew[8]>0))throw new Error('dest size invalid');
  delete s.img;
  T.drawChara(c,{pose:'jump',ph:1.2,t:2,x:0,z:0,wind:.5});
 }catch(e){sprErr=String(e).split('\n')[0]+' ['+c.id+']'}});
ok(!sprErr,'sprite sheets valid, cycle, draw in-bounds, fallback clean'+(sprErr?' -> '+sprErr:''));
console.log('\n-- collectibles + combo --');
T.reset();T.running=true;
T.objs.push({t:'orb',x:T.G.px,z:0.4,w:.9,d:.9,h:1.2,hit:false,ci:0,sd:1,seed:0});
T.update(1/60);
ok(T.G.combo>=1,'orb pickup raises combo (got '+T.G.combo+')');
ok(T.G.score>0,'orb pickup raises score (got '+T.G.score+')');
ok(!T.objs.some(o=>o.t==='orb'),'picked orb is removed');
console.log('\n-- pause --');
T.reset();T.running=true;
T.togglePause();ok(T.G.paused===true,'paused flag set');
const d0=T.G.dist;T.update(1/60);ok(T.G.dist===d0,'update frozen while paused');
T.togglePause();ok(T.G.paused!==true,'resumed after second toggle');
console.log('\n-- quality levels --');
ok(T.QLEVELS&&T.QLEVELS.length===4,'4 quality levels LOW/MEDIUM/HIGH/ULTRA (got '+(T.QLEVELS&&T.QLEVELS.length)+')');
let qErr=null;['LOW','MEDIUM','HIGH','ULTRA'].forEach(q=>{try{T.setQuality(q)}catch(e){qErr=String(e).split('\n')[0]+' ['+q+']'}});
ok(!qErr,'all quality levels apply'+(qErr?' -> '+qErr:''));
T.setQuality('HIGH');
console.log('\n-- data manifests --');
const dj=JSON.parse(fs.readFileSync(path.join(root,'data','characters.json'),'utf8'));
ok(dj.length===T.CHARS.length,'data/characters.json matches roster ('+dj.length+')');
const de=JSON.parse(fs.readFileSync(path.join(root,'data','environments.json'),'utf8'));
ok(de.length===T.envCount(),'data/environments.json matches registry ('+de.length+')');
const dop=JSON.parse(fs.readFileSync(path.join(root,'data','openings.json'),'utf8'));
const secs=dop.openings&&dop.openings[0]&&dop.openings[0].sections;
ok(secs&&secs[0].startBeat===0,'openings.json timeline starts at beat 0');
ok(secs&&secs[secs.length-1].endBeat>=128,'openings.json timeline covers 128 beats');
const dfx=JSON.parse(fs.readFileSync(path.join(root,'data','effects.json'),'utf8'));
ok(dfx.effects&&dfx.effects.length>=10,'effects.json catalogs 10+ effects (got '+(dfx.effects&&dfx.effects.length)+')');
console.log('\n-- github pages paths --');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
ok(html.indexOf('src="/')<0&&html.indexOf('href="/')<0,'no root-absolute asset paths (subpath safe)');
['src/engine.js','src/main.js','styles/main.css'].forEach(p=>{ok(html.indexOf(p)>=0,'index.html references '+p)});
console.log('\n'+(fail?'FAILED: '+fail+' assertion(s)':'ALL CHECKS PASSED'));
process.exit(fail?1:0);
