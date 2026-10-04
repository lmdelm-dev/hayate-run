const STARS=Array.from({length:150},(_,i)=>({x:hash(i*3.7),y:hash(i*7.1+5),r:.5+hash(i+11)*1.7}));
function skyline(hz,col,par,seed,minH,maxH){
 const o=-cam.yaw*W*par,step=W/9,q=Math.floor(o/step),r=o-q*step;
 for(let i=-2;i<=11;i++){const x=i*step+r-W*.35,h=H*(minH+(maxH-minH)*hash(i-q+seed)),w=step*.72;
  ctx.fillStyle=col;ctx.fillRect(x,hz-h,w,h);
  ctx.fillStyle='rgba(255,240,190,.5)';
  for(let a=0;a<3;a++)for(let b=0;b<4;b++){if(hash((i-q)*13+a*7+b*3+seed)>.55)ctx.fillRect(x+w*.15+b*w*.2,hz-h+H*.03+a*H*.05,w*.1,H*.022)}}}

function drawHorizon(e,hz,pulse){
 const p=e.pal,sx=W/2-cam.yaw*W*.8;
 if(e.lights=='night'||e.lights=='neon'){
  STARS.forEach((s,i)=>{ctx.globalAlpha=.35+.55*Math.abs(Math.sin(performance.now()*.0012+i*1.7));
   ctx.fillStyle='#dfe9ff';ctx.beginPath();ctx.arc(s.x*W-W*.2-cam.yaw*W*.45,hz-H*.9*s.y-H*.03,s.r,0,7);ctx.fill()});
  ctx.globalAlpha=1;
  ctx.fillStyle='rgba(255,248,225,.95)';ctx.beginPath();ctx.arc(sx-W*.14,hz-H*.6,H*.05,0,7);ctx.fill();
  ctx.fillStyle=p.sky[0];ctx.beginPath();ctx.arc(sx-W*.14+H*.026,hz-H*.6-H*.016,H*.047,0,7);ctx.fill();
 }else if(e.lights=='sunset'){
  const g=ctx.createRadialGradient(sx,hz-H*.07,0,sx,hz-H*.07,H*.32);
  g.addColorStop(0,'rgba(255,214,140,.9)');g.addColorStop(1,'rgba(255,180,90,0)');
  ctx.fillStyle=g;ctx.fillRect(sx-H*.35,hz-H*.4,H*.7,H*.5);
  ctx.fillStyle='#ffd07a';ctx.beginPath();ctx.arc(sx,hz-H*.07,H*.12*(1+pulse*.05),0,7);ctx.fill();
 }else{
  ctx.fillStyle='#fff6d8';ctx.globalAlpha=.95;ctx.beginPath();ctx.arc(sx,hz-H*.16,H*.09*(1+pulse*.05),0,7);ctx.fill();ctx.globalAlpha=1}
 if(e.horizon=='peaks'){
  const layers=[[.42,'#2c3a66',.16],[.3,'#44548c',.3],[.2,'#6173ad',.5]];
  layers.forEach((L,i)=>{const off=-cam.yaw*W*L[2];
   ctx.fillStyle=L[1];ctx.beginPath();ctx.moveTo(-W,hz);
   for(let x=-W;x<=W*2;x+=W/5){const k=Math.floor((x-off)/(W/5));ctx.lineTo(x,hz-H*L[0]*(.45+hash(k+i*31)*.75))}
   ctx.lineTo(W*2,hz);ctx.closePath();ctx.fill();
   ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();
   for(let x=-W;x<=W*2;x+=W/5){const k=Math.floor((x-off)/(W/5)),y=hz-H*L[0]*(.45+hash(k+i*31)*.75);if(hash(k+i*7)>.62){ctx.moveTo(x-W*.05,y+H*.05);ctx.lineTo(x,y);ctx.lineTo(x+W*.05,y+H*.05)}}
   ctx.fill()})
 }else if(e.horizon=='hills'){
  const hx=W*.78-cam.yaw*W*.8,hw=W*.4,hh=H*.2;
  ctx.fillStyle=p.hill;ctx.beginPath();ctx.moveTo(hx-hw,hz);ctx.lineTo(hx-hw*.14,hz-hh);ctx.lineTo(hx+hw*.14,hz-hh);ctx.lineTo(hx+hw,hz);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.moveTo(hx-hw*.14-hw*.1,hz-hh*.72);ctx.lineTo(hx-hw*.14,hz-hh);ctx.lineTo(hx+hw*.14,hz-hh);ctx.lineTo(hx+hw*.14+hw*.1,hz-hh*.72);ctx.lineTo(hx+hw*.03,hz-hh*.8);ctx.lineTo(hx-hw*.05,hz-hh*.7);ctx.fill()
 }else if(e.horizon=='city'){
  skyline(hz,shadeHex(p.hill,.55),.14,3,.1,.34);skyline(hz,shadeHex(p.hill,.8),.3,17,.16,.46)
 }else if(e.horizon=='town'){
  skyline(hz,shadeHex(p.hill,.62),.18,9,.07,.18);
  const tx=W*.66-cam.yaw*W*.55;ctx.fillStyle=shadeHex(p.hill,.5);
  ctx.fillRect(tx-W*.05,hz-H*.3,W*.012,H*.3);ctx.fillRect(tx+W*.04,hz-H*.3,W*.012,H*.3);
  ctx.fillRect(tx-W*.08,hz-H*.31,W*.14,H*.02);ctx.fillRect(tx-W*.06,hz-H*.26,W*.1,H*.015)
 }else if(e.horizon=='forest'){
  const off=-cam.yaw*W*.4,step=W/12;
  for(let i=-1;i<=10;i++){const x=i*step+(off%step)-W*.1,h=H*(.1+hash(i+21)*.16);
   ctx.fillStyle=shadeHex(p.hill,.55);ctx.beginPath();ctx.arc(x,hz-h*.4,h*.55,0,7);ctx.arc(x+h*.4,hz-h*.3,h*.45,0,7);ctx.fill()}
 }else if(e.horizon=='sea'){
  ctx.fillStyle=shadeHex(p.hill,.7);ctx.fillRect(-W,hz,W*3,H*.5);
  ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.6;ctx.beginPath();
  for(let i=0;i<7;i++){const y=hz+H*.03+i*H*.05;for(let x=-W;x<W*2;x+=26)ctx.moveTo(x,y+Math.sin((x+performance.now()*.06+i*40)*.02)*3)}
  ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(sx-W*.16,hz,W*.32,2)
 }else if(e.horizon=='space'){
  const g=ctx.createRadialGradient(W*.3,hz-H*.3,0,W*.3,hz-H*.3,W*.6);
  g.addColorStop(0,'rgba(120,60,190,.4)');g.addColorStop(1,'rgba(120,60,190,0)');
  ctx.fillStyle=g;ctx.fillRect(0,hz-H,W,H*1.2);
  ctx.fillStyle='rgba(70,200,255,.18)';ctx.beginPath();ctx.ellipse(W*.75,hz-H*.4,W*.4,H*.2,.5,0,7);ctx.fill();
  ctx.fillStyle=shadeHex(p.hill,.9);ctx.beginPath();ctx.arc(sx+W*.26,hz-H*.34,H*.13,0,7);ctx.fill();
  ctx.strokeStyle='rgba(200,230,255,.5)';ctx.lineWidth=H*.02;ctx.beginPath();ctx.ellipse(sx+W*.26,hz-H*.34,H*.24,H*.06,-.4,0,7);ctx.stroke()}}

function drawGround(e,hz,G){
 const p=e.pal;
 ctx.fillStyle=p.ground;ctx.fillRect(-W,hz,W*3,H*2);
 for(let z=-24;z<100;z+=4){const alt=(Math.floor((z+G.dist)/4))&1,a=1-Math.max(0,(z-50)/50);ctx.globalAlpha=a;
  quad(P(-6.2,0,z,1),P(6.2,0,z,1),P(6.2,0,z+4.05,1),P(-6.2,0,z+4.05,1),p.road[1-alt]);
  quad(P(-3.9,0,z,1),P(3.9,0,z,1),P(3.9,0,z+4.05,1),P(-3.9,0,z+4.05,1),p.walk[1-alt])}
 ctx.globalAlpha=1;
 if(e.ground=='grid'){ctx.save();ctx.globalCompositeOperation='screen';
  for(let z=-24+(4-G.dist%4)%4-4;z<95;z+=4){const a=1-Math.max(0,(z-60)/40);ctx.globalAlpha=a*.75;
   quad(P(-6.2,.02,z,1),P(6.2,.02,z,1),P(6.2,.02,z+.1,1),P(-6.2,.02,z+.1,1),p.accent)}
  ctx.globalAlpha=.55;
  for(const lx of[-6.2,-3.9,-1.5,1.5,3.9,6.2])quad(P(lx-.05,0,-24,1),P(lx+.05,0,-24,1),P(lx+.05,0,95,1),P(lx-.05,0,95,1),p.accent);
  ctx.restore()}
 else if(e.ground=='sand'){ctx.fillStyle='rgba(255,255,255,.28)';for(let i=0;i<40;i++){const z=-20+hash(i)*90,x=(hash(i+50)-.5)*26;const q=P(x,0,z);if(q)ctx.fillRect(q[0],q[1],2.5,1.5)}}
 else if(e.ground=='snow'){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;ctx.beginPath();for(let z=-20;z<90;z+=9){for(const s of[-1,1]){const a=P(s*7,0,z),b=P(s*11,0,z+6);if(a&&b){ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}}}ctx.stroke()}
 else if(e.ground=='deck'){ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1.5;ctx.beginPath();for(let z=-24+(4-G.dist%4)%4-4;z<95;z+=2){const a=P(-6.2,0,z,1),b=P(6.2,0,z,1);if(a&&b){ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}}ctx.stroke()}
 else if(e.ground=='grass'){ctx.fillStyle='rgba(255,255,255,.1)';for(let z=-24+(8-G.dist%8)%8-8;z<95;z+=8)quad(P(-6.2,0,z,1),P(6.2,0,z,1),P(6.2,0,z+4,1),P(-6.2,0,z+4,1),'rgba(255,255,255,.06)')}
 for(let z=-24+(4-G.dist%4)%4-4;z<90;z+=4)for(const lx of[-1.2,1.2])quad(P(lx-.07,0,z,1),P(lx+.07,0,z,1),P(lx+.07,0,z+1.8,1),P(lx-.07,0,z+1.8,1),e.ground=='grid'?p.accent:'rgba(255,244,230,.72)')}
