const SC=[0,1,5,7,8];
const SONGS=[
{rain:1,sc:[0,2,3,5,7,8,10],n:'Rain Letter',jp:'雨の手紙',bpm:92,root:57,bass:[0,5,2,6],
 mel:[7,-1,6,4,-1,4,2,-1,3,-1,4,6,-1,4,3,-1,7,-1,8,9,-1,8,6,-1,7,6,4,3,2,-1,-1,-1]},
{n:'Sakura Sprint',jp:'桜スプリント',bpm:150,root:57,bass:[0,3,2,4],
 mel:[4,-1,5,7,-1,5,4,2,4,-1,5,7,9,7,5,-1,2,-1,4,5,-1,4,2,0,2,4,5,4,2,0,-1,-1]},
{n:'Neon Shibuya',jp:'ネオン渋谷',bpm:128,root:52,bass:[0,0,3,2],
 mel:[7,-1,-1,5,7,9,-1,7,5,-1,4,5,-1,2,4,-1,7,-1,9,10,9,7,5,-1,4,5,4,2,0,-1,2,-1]},
{n:'Yuuhi Line',jp:'夕陽ライン',bpm:172,root:55,bass:[2,0,3,4],
 mel:[5,5,7,9,7,5,4,-1,2,4,5,4,2,-1,0,-1,5,5,7,9,10,9,7,5,4,5,7,5,4,2,0,-1]}];

let ac,master,noise,t0,nextT,step,song,timer,lp,src,custom;
let muted=false;
function setMuted(m){muted=!!m;if(master&&master.gain)master.gain.value=muted?0:.55}
function toggleMute(){setMuted(!muted);return muted}
const mf=m=>440*Math.pow(2,(m-69)/12),dg=d=>{const S=song.sc||SC,n=S.length;return S[((d%n)+n)%n]+12*Math.floor(d/n)};
function tone(f,t,d,type,v){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.02)}
function kick(t,v=.9){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(40,t+.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(master);o.start(t);o.stop(t+.2)}
function hat(t,v,hp,d=.06){const n=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();n.buffer=noise;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);n.connect(f);f.connect(g);g.connect(master);n.start(t);n.stop(t+d+.02)}
function riser(t,d){const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(2400,t+d);g.gain.setValueAtTime(.005,t);g.gain.exponentialRampToValueAtTime(.09,t+d*.98);g.gain.linearRampToValueAtTime(0,t+d+.05);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.1)}
function sched(){while(nextT<ac.currentTime+.25){const bs=60/song.bpm,sd=bs/2,t=nextT,i=step%32,b=step/2,ch=song.bass[(step>>3)%4],build=b>=48&&b<64,drop=b>=64&&b<112;
 if(step==0)lp.frequency.setValueAtTime(2500,t);
 if(step==32){lp.frequency.setValueAtTime(2500,t);lp.frequency.exponentialRampToValueAtTime(16000,t+bs*8)}
 if(step==96){lp.frequency.setValueAtTime(1200,t);lp.frequency.exponentialRampToValueAtTime(16000,t+bs*16);riser(t,bs*16)}
 if(step==224){lp.frequency.setValueAtTime(16000,t);lp.frequency.exponentialRampToValueAtTime(2500,t+bs*8)}
 const an=song.root+dg(ch+[0,2,4,7,4,2,4,2][step%8])+12;
 tone(mf(an),t,sd*3,'triangle',drop?.06:.1);tone(mf(an+12),t,sd*2,'sine',.04);
 if(step%8==0)tone(mf(song.root+dg(ch)),t,sd*8,'sawtooth',build?.04:.025);
 if(b>=8&&step%2==0)tone(mf(song.root-12+dg(ch)),t,sd*1.8,'triangle',.28);
 const m=song.mel[i];if(m>=0&&b>=24&&b<112){tone(mf(song.root+12+dg(m)),t,sd*1.7,drop?'square':'triangle',drop?.06:.1);if(drop)tone(mf(song.root+24+dg(m)),t,sd*1.2,'sawtooth',.025)}
 if(b>=16&&b<48){if(step%8==0)kick(t,.5);if(b>=32&&step%2)hat(t,.1,8000)}
 if(build){if(step%2==0)hat(t,.15+.35*(b-48)/16,2500);if(b>=56)hat(t+sd/2,.3,2500);if(b>=62){hat(t+sd/4,.4,2500);hat(t+sd*.75,.4,2500)}}
 if(drop){if(step%2==0)kick(t,1);if(step%4==2)hat(t,.6,2200);if(step%2)hat(t,.22,8000);if(step==128)hat(t,.9,1500,.9)}
 nextT+=sd;step++}}
function startMusic(){ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();
 master=ac.createGain();master.gain.value=muted?0:.55;lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=song.buf?20000:2500;master.connect(lp);lp.connect(ac.destination);
 noise=ac.createBuffer(1,ac.sampleRate*.2,ac.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 step=0;t0=nextT=ac.currentTime+.15;
 if(song.buf){src=ac.createBufferSource();src.buffer=song.buf;src.connect(master);src.start(t0)}else timer=setInterval(sched,40)}
function stopMusic(){clearInterval(timer);if(src){try{src.stop()}catch(e){}src=null}if(master)master.gain.setTargetAtTime(0,ac.currentTime,.1)}
function beatFloat(){return ac&&t0!=null?(ac.currentTime-t0)*song.bpm/60:0}
function sectionOf(b){return b<16?'intro':b<48?'verse':b<64?'build':b<112?'drop':'outro'}
