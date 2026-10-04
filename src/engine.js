const $=s=>document.querySelector(s),cv=$('#c'),ctx=cv.getContext('2d');
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W,H;
function rs(){const cap=(typeof DPR_CAP==="number")?DPR_CAP:2;const d=Math.min(devicePixelRatio||1,cap);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',rs);rs();

const rgb=(c,k=1)=>`rgb(${Math.min(255,c[0]*k|0)},${Math.min(255,c[1]*k|0)},${Math.min(255,c[2]*k|0)})`;
const LANE=2.4;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const mixHex=(a,b,t)=>{const p=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)],A=p(a),B=p(b);
 return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const shadeHex=(h,k)=>{const p=x=>[parseInt(x.slice(1,3),16),parseInt(x.slice(3,5),16),parseInt(x.slice(5,7),16)];
 return '#'+p(h).map(v=>Math.max(0,Math.min(255,Math.round(v*k))).toString(16).padStart(2,'0')).join('')};
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];

const STY=[
{k:'anime',n:'Anime',w:'疾風',sh:1,ol:1.6,olc:'#1b1340',bloom:.45},
{k:'cartoon',n:'Cartoon',w:'BOING!',sh:.5,ol:3.5,olc:'#111',bloom:.15},
{k:'paper',n:'Paper',w:'紙',sh:.35,ol:1.2,olc:'#5a3d2b',paper:1,bloom:.1,shd:['rgba(70,45,20,.5)',0,5,6]},
{k:'manga',n:'Manga',w:'ドン！',sh:.2,ol:2.8,olc:'#000',gray:1,tone:1},
{k:'comic',n:'Comic',w:'POW!',sh:.6,ol:3.2,olc:'#000',dots:1,bloom:.1,grade:['multiply',.14,'#ff4f9a']},
{k:'3d',n:'3D',w:'DEPTH',sh:1.8,ol:0,bloom:.9,shd:['rgba(0,0,0,.45)',16,0,8]},
{k:'flat',n:'Flat 2D',w:'2D',sh:0,ol:0,bloom:0},
{k:'real',n:'Realistic',w:'REAL',sh:1.4,ol:0,bloom:.3,real:1,shd:['rgba(0,0,0,.5)',12,0,6]}];
let ST=STY[0];
const STYSEQ=[0,5,1,6,3,7,4,2],DROPSEQ=[6,7,3,4,1,2,0,7];

function mkPat(w,fn){const c=document.createElement('canvas');c.width=c.height=w;fn(c.getContext('2d'),w);return ctx.createPattern(c,'repeat')}
const pDot=(col,w,r)=>mkPat(w,(x,z)=>{x.fillStyle='#fff';x.fillRect(0,0,z,z);x.fillStyle=col;x.beginPath();x.arc(z/2,z/2,r,0,7);x.fill()});
const pK=pDot('#555',12,3),pC=pDot('#ff4f9a',18,5.5),pPaper=mkPat(128,(x,z)=>{x.fillStyle='#fff';x.fillRect(0,0,z,z);for(let i=0;i<900;i++){x.fillStyle=`rgba(120,90,50,${Math.random()*.2})`;x.fillRect(Math.random()*z,Math.random()*z,1+Math.random()*2,1)}});
const bc=document.createElement('canvas'),bx=bc.getContext('2d');

const cam={ox:0,oy:3.4,oz:-7.5,la:9,fov:1,roll:0,x:0,y:3,z:-7,yaw:0,pit:0};
function P(x,y,z,clampP){const dx=x-cam.x,dy=y-cam.y,dz=z-cam.z,c=Math.cos(cam.yaw),s=Math.sin(cam.yaw);
 const x1=dx*c-dz*s,z1=dx*s+dz*c,cp=Math.cos(cam.pit),sp=Math.sin(cam.pit);
 const y1=dy*cp-z1*sp;let z2=dy*sp+z1*cp;if(z2<.3){if(!clampP)return null;z2=.3}
 const f=Math.min(H*.95,W*1.1)*cam.fov/z2;return[W/2+x1*f,H/2-y1*f,z2,f]}
function quad(a,b,c,d,fill,ol){if(!a||!b||!c||!d)return;ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);ctx.closePath();ctx.fill();if(ol&&ST.ol){ctx.strokeStyle=ST.olc;ctx.lineWidth=ST.ol;ctx.lineJoin='round';ctx.stroke()}}

let K=1;
function S(x,z,fn){const p=P(x,0,z);if(!p)return;K=p[3];ctx.save();ctx.translate(p[0],p[1]);ctx.scale(K,-K);ctx.lineJoin='round';ctx.lineCap='round';
 if(ST.k!='flat'){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,0,.8,.22,0,0,7);ctx.fill()}
 const h=ST.shd;if(h){ctx.shadowColor=h[0];ctx.shadowBlur=h[1];ctx.shadowOffsetX=h[2];ctx.shadowOffsetY=h[3]}
 fn();ctx.restore()}
const sc=(c,k)=>rgb(c,1+(k-1)*ST.sh),lg=(y0,y1,a,b)=>{const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g};
function F(f){ctx.fillStyle=f;ctx.fill();if(ST.ol){ctx.lineWidth=ST.ol/K;ctx.strokeStyle=ST.olc;ctx.stroke()}}
function circ(x,y,r,f){ctx.beginPath();ctx.arc(x,y,r,0,7);F(f)}
function limb(x1,y1,x2,y2,w,c){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);if(ST.ol){ctx.lineWidth=w+2*ST.ol/K;ctx.strokeStyle=ST.olc;ctx.stroke()}ctx.lineWidth=w;ctx.strokeStyle=c;ctx.stroke()}
function sm(p){ctx.beginPath();const n=p.length;for(let i=0;i<n;i++){const a=p[(i-1+n)%n],b=p[i],c=p[(i+1)%n],d=p[(i+2)%n];if(!i)ctx.moveTo(b[0],b[1]);ctx.bezierCurveTo(b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6,c[0]-(d[0]-b[0])/6,c[1]-(d[1]-b[1])/6,c[0],c[1])}ctx.closePath()}
function rr(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect&&r>0)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h)}

function post(){const s=ST,o='globalCompositeOperation',gray=a=>{ctx[o]='saturation';ctx.globalAlpha=a;ctx.fillStyle='#888';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1};
 ctx.save();
 if(s.gray)gray(1);
 if(s.paper){gray(.45);ctx[o]='multiply';ctx.fillStyle=pPaper;ctx.fillRect(0,0,W,H);ctx[o]='soft-light';ctx.fillStyle='rgba(255,215,160,.55)';ctx.fillRect(0,0,W,H)}
 if(s.tone||s.dots){ctx[o]='multiply';ctx.globalAlpha=s.tone?.55:.4;ctx.fillStyle=s.tone?pK:pC;ctx.fillRect(0,0,W,H)}
 if(s.real){gray(.3);const v=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,10,.6)');ctx[o]='source-over';ctx.fillStyle=v;ctx.fillRect(0,0,W,H);ctx[o]='multiply';ctx.globalAlpha=.25;ctx.translate(-Math.random()*128,-Math.random()*128);ctx.fillStyle=pPaper;ctx.fillRect(0,0,W+128,H+128)}
 if(s.grade){ctx[o]=s.grade[0];ctx.globalAlpha=s.grade[1];ctx.fillStyle=s.grade[2];ctx.fillRect(0,0,W,H)}
 ctx.restore()}
function bloom(a){if(a<.02)return;const w=bc.width=W>>3,h=bc.height=H>>3;bx.drawImage(cv,0,0,w,h);ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=Math.min(.85,a);ctx.drawImage(bc,0,0,W,H);ctx.drawImage(bc,-10,-10,W+20,H+20);ctx.restore()}
