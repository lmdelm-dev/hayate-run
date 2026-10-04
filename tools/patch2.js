const fs = require('fs'), vm = require('vm');
const ok = [];
function chk(f) { new vm.Script(fs.readFileSync(f, 'utf8'), { filename: f }); ok.push(f); }
// --- 1. director.js: OPENINGS timeline mirror of onBeat ---
{
  const F = 'C:/Users/Pc/hayate-run/src/director.js';
  let s = fs.readFileSync(F, 'utf8');
  s += `
const OPENINGS=[{id:'hayate-opening-1',name:'Hayate Run Opening',beats:128,
 sections:[
  {startBeat:0,endBeat:8,name:'Title',env:'auto',camera:'chase',weather:'theme',fx:['flash','title-card']},
  {startBeat:8,endBeat:16,name:'Intro',env:'auto',camera:'sideR',weather:'theme',fx:['speed-lines']},
  {startBeat:16,endBeat:48,name:'Verse',env:'auto-8',camera:'sequence',weather:'theme',fx:['speed-lines','captions']},
  {startBeat:48,endBeat:64,name:'Build-up',env:'hold',camera:'close-face-low',weather:'rain',fx:['slow-motion','dim','riser']},
  {startBeat:64,endBeat:112,name:'Chorus / Drop',env:'auto-4',camera:'montage',weather:'theme',fx:['flash','shake','burst','style-cuts']},
  {startBeat:112,endBeat:128,name:'Outro',env:'sunset-dusk',camera:'wide',weather:'theme',fx:['letterbox','title-card']}
 ]}];`;
  fs.writeFileSync(F, s);
  chk(F);
}
// --- 2. animation.js: accessory renderer + hooks ---
{
  const F = 'C:/Users/Pc/hayate-run/src/animation.js';
  let s = fs.readFileSync(F, 'utf8');
  const hooks = [
    ["if(ch.band){ctx.beginPath();ctx.rect(-.3,1.84,.6,.06);F(rgb(ch.acc))}", 'front'],
    ["if(ch.band){ctx.beginPath();ctx.rect(-.28,1.84,.56,.06);F(rgb(ch.acc))}", 'rear'],
    ["if(ch.band){ctx.beginPath();ctx.rect(-.22,1.86,.44,.06);F(rgb(ch.acc))}", 'side']
  ];
  for (const [anchor, view] of hooks) {
    if (!s.includes(anchor)) throw new Error('acc hook missing: ' + view);
    s = s.split(anchor).join(anchor + "\n accDraw(A,'" + view + "');");
  }
  s += `
function accDraw(A,view){
 const ch=A.ch;if(!ch)return;
 const ac=ch.acc?rgb(ch.acc):'#fff',t=A.t||0,wd=clamp(A.wind||0,0,1);
 if(ch.cap){
  if(view==='side'){sm([[-.2,1.98],[.2,1.98],[.24,1.86],[-.16,1.86]]);F(ac);limb(.2,1.92,.46,1.86,.08,ac)}
  else{sm([[-.24,1.98],[.24,1.98],[.26,1.84],[-.26,1.84]]);F(ac);rr(-.3,1.82,.6,.05,.02);F(ac)}}
 if(ch.bandana){rr(-.28,1.86,.56,.07,.02);F(ac);sm([[.26,1.9],[.44,1.8],[.4,1.72],[.26,1.8]]);F(ac)}
 if(ch.goggles){
  if(view==='front'){rr(-.24,1.88,.48,.1,.05);F('#223');for(const d of[-1,1]){ctx.beginPath();ctx.ellipse(d*.12,1.93,.08,.06,0,0,7);F('rgba(180,240,255,.9)')}}
  else{limb(-.26,1.9,.26,1.9,.05,'#223')}}
 if(ch.visor&&view!=='rear'){ctx.save();ctx.globalAlpha=.75;rr(-.26,1.66,.52,.16,.06);F(ac);ctx.restore()}
 if(ch.earphones){for(const d of[-1,1]){ctx.beginPath();ctx.arc(d*.26,1.7,.05,0,7);F(ac)}}
 if(ch.hairpin){const hx=view==='side'?.12:.2;ctx.beginPath();ctx.ellipse(hx,1.9,.045,.045,0,0,7);F('#fff');ctx.beginPath();ctx.ellipse(hx,1.9,.02,.02,0,0,7);F(ac)}
 if(ch.hood==='1'||ch.hood===1){
  if(view==='rear'){sm([[-.34,1.7],[-.3,1.95],[0,2.02],[.3,1.95],[.34,1.7],[.2,1.8],[0,1.78],[-.2,1.8]]);F(ac)}
  else if(view==='side'){sm([[-.28,1.7],[-.3,1.95],[-.1,2.0],[-.05,1.78]]);F(ac)}}
 if(ch.cape){const fl=Math.sin(t*7)*.08+wd*.25;
  if(view==='rear'){sm([[-.24,1.4],[.24,1.4],[.3+fl,.7],[.1+fl,.5],[-.1+fl,.5],[-.3+fl,.7]]);F(ac)}
  else if(view==='side'){sm([[-.16,1.42],[.1,1.42],[.5+fl,.7],[.1,.55],[-.2,.7]]);F(ac)}
  else{sm([[-.26,1.4],[-.34,.9],[-.1,.95]]);F(ac);sm([[.26,1.4],[.34,.9],[.1,.95]]);F(ac)}}
}`;
  fs.writeFileSync(F, s);
  chk(F);
}
// --- 3. audio.js: mute support ---
{
  const F = 'C:/Users/Pc/hayate-run/src/audio.js';
  let s = fs.readFileSync(F, 'utf8');
  const a = 'let ac,master,noise,t0,nextT,step,song,timer,lp,src,custom;';
  if (!s.includes(a)) throw new Error('audio anchor missing');
  s = s.split(a).join(a + "\nlet muted=false;\nfunction setMuted(m){muted=!!m;if(master&&master.gain)master.gain.value=muted?0:.55}\nfunction toggleMute(){setMuted(!muted);return muted}");
  const b = 'master=ac.createGain();master.gain.value=.55;';
  if (!s.includes(b)) throw new Error('gain anchor missing');
  s = s.split(b).join('master=ac.createGain();master.gain.value=muted?0:.55;');
  fs.writeFileSync(F, s);
  chk(F);
}
// --- 4. environments.js: orb rows in free lanes ---
{
  const F = 'C:/Users/Pc/hayate-run/src/environments.js';
  let s = fs.readFileSync(F, 'utf8');
  const a = '   objs.push(o)})}';
  if (!s.includes(a)) throw new Error('spawn anchor missing');
  s = s.split(a).join("   objs.push(o)})\n if(Math.random()<.4){const free=[-1,0,1].filter(l=>lanes.indexOf(l)<0);if(free.length){const l=free[Math.random()*free.length|0];objs.push({t:'orb',x:l*LANE,z:97,hit:false,ci:0,sd:Math.random()*9|0,seed:Math.random()*6.28,w:.9,d:.9,h:1.2})}}}");
  fs.writeFileSync(F, s);
  chk(F);
}
console.log('patch2 ok: ' + ok.join(', '));
