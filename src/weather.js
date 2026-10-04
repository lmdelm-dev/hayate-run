const WXP={
 petals:{n:70,c:'#ffb7d5',sz:[3,7],vx:-.05,vy:.09,rot:1},
 rain:{n:140,c:'#cfe0ff',sz:[11,26],vx:-.24,vy:1.6,stroke:1,dx:.26,dy:1},
 snow:{n:95,c:'#ffffff',sz:[1.6,4.2],vx:-.04,vy:.15,rot:0},
 leaves:{n:60,c:'#ffb45c',sz:[3,6.5],vx:-.07,vy:.13,rot:1},
 embers:{n:60,c:'#ffca6a',sz:[1.5,3.5],vx:.02,vy:-.1,rot:0,add:1},
 sand:{n:110,c:'#e8cfa0',sz:[7,18],vx:-.5,vy:.09},
 stars:{n:120,c:'#dfe9ff',sz:[.8,2.2],vx:-.01,vy:.008,rot:0,add:1,tw:1},
 bubbles:{n:55,c:'rgba(190,240,255,.65)',sz:[2,6],vx:.02,vy:-.07,rot:0},
 fireflies:{n:45,c:'#e8ff7a',sz:[1.4,3],vx:.03,vy:-.03,rot:0,add:1,tw:1},
 mist:{n:26,c:'rgba(232,240,255,.4)',sz:[45,120],vx:-.04,vy:0},
 neon:{n:70,c:'#4de3ff',sz:[2,5],vx:-.09,vy:.2,rot:0,add:1},
 none:{n:0}};
let WX=[],WXk='none',WXb=0;
function wxSet(kind){WXk=WXP[kind]?kind:'none';const D=WXP[WXk];
 WX=Array.from({length:D.n},()=>({x:Math.random(),y:Math.random(),v:.6+Math.random()*.8,r:D.sz[0]+Math.random()*(D.sz[1]-D.sz[0]),s:Math.random()*6.28}))}
function wxBurst(){WXb=1}
function wxDraw(dt){
 if(WXk=='none')return;const D=WXP[WXk];WXb*=Math.pow(.25,dt);
 ctx.save();if(D.add)ctx.globalCompositeOperation='screen';
 ctx.fillStyle=D.c;ctx.strokeStyle=D.c;ctx.lineCap='round';
 for(const p of WX){
  const sp=(D.vy+p.v*.05)*(1+WXb*2.4),dr=D.vx*(1+WXb*1.6);
  p.y+=sp*dt*2.2;p.x+=dr*dt*1.6;p.s+=dt*1.4;
  if(D.vy>0&&p.y>1.08){p.y=-.08;p.x=Math.random()*1.15}
  if(D.vy<0&&p.y<-.08){p.y=1.08;p.x=Math.random()*1.15}
  if(p.x<-.1)p.x=1.1;if(p.x>1.1)p.x=-.1;
  const X=p.x*W,Y=p.y*H;
  ctx.globalAlpha=D.tw?.4+.6*Math.abs(Math.sin(p.s*2)):.85;
  if(D.stroke){ctx.lineWidth=Math.max(1,p.r*.12);ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X-p.r*(D.dx||.3),Y-p.r*(D.dy||1));ctx.stroke()}
  else if(WXk=='petals'||WXk=='leaves'||WXk=='sand'){ctx.save();ctx.translate(X,Y);ctx.rotate(p.s);ctx.beginPath();ctx.ellipse(0,0,p.r,p.r*.45,0,0,7);ctx.fill();ctx.restore()}
  else{ctx.beginPath();ctx.arc(X,Y,p.r,0,7);ctx.fill()}}
 ctx.restore()}
