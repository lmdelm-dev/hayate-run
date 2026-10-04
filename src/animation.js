function viewAt(x,z){
 const vx=cam.x-x,vz=cam.z-z,L=Math.hypot(vx,vz)||1,d=vz/L;
 if(d<-.42)return{v:'rear'};
 if(d>.42)return{v:'front'};
 const a=P(x,0,z+1),b=P(x,0,z-1);let m=1;
 if(a&&b)m=a[0]>b[0]?1:-1;else if(b)m=-1;
 return{v:'side',m}}
function poseOf(pose){
 if(pose=='jump')return{pose,hip:1.06,bounce:0,lift:.55};
 if(pose=='fall')return{pose,hip:1.02,bounce:0,lift:.95};
 if(pose=='land')return{pose,hip:.87,bounce:0,lift:-.2};
 if(pose=='hit')return{pose,hip:.97,bounce:0,lift:.3};
 return{pose:'run',hip:1,bounce:1,lift:0}}
function legJ(pose,ph,d,flat){
 const s=Math.sin(ph+(d>0?0:Math.PI)),c=Math.cos(ph+(d>0?0:Math.PI)),hx=flat?0:d*.12;
 if(pose=='jump')return d>0?{kx:hx+.2,ky:.7,fx:hx+.32,fy:.56}:{kx:hx-.08,ky:.5,fx:hx-.3,fy:.2};
 if(pose=='fall')return{kx:hx+s*.2,ky:.54,fx:hx+s*.32,fy:.1+Math.max(0,c)*.34};
 if(pose=='land')return{kx:hx+d*.1,ky:.4,fx:d*.26,fy:0};
 if(pose=='hit')return{kx:hx+d*.16,ky:.58,fx:d*.36,fy:d>0?.22:.06};
 return{kx:hx+s*.14+.05,ky:.52,fx:hx+s*.3,fy:.07+Math.max(0,c)*.25}}
function armJ(pose,ph,d,flat){
 const s=-Math.sin(ph+(d>0?0:Math.PI)),sx=flat?0:d*.3;
 if(pose=='jump')return{ex:sx+d*.16,ey:1.52,hx:sx+d*.22,hy:1.86};
 if(pose=='fall')return{ex:sx+d*.26,ey:1.3,hx:sx+d*.42,hy:1.36};
 if(pose=='land')return{ex:sx+d*.14,ey:1.06,hx:sx+d*.2,hy:.84};
 if(pose=='hit')return{ex:sx+d*.28,ey:1.58,hx:sx+d*.36,hy:1.96};
 return{ex:sx+d*.12+s*.08,ey:1.12+s*.08,hx:sx+d*.1+s*.04,hy:.95+s*.22}}

function drawChara(ch,o){
 const pose=o.pose||'run',ph=o.ph||0,t=o.t||0,wind=clamp(o.wind||0,0,1);
  const P0=poseOf(pose),V=viewAt(o.x||0,o.z||0);
  if(ch.sprite&&typeof spriteReady==='function'&&spriteReady(ch)){
    ctx.save();
    if(V.v=='side'&&V.m<0)ctx.scale(-1,1);
    drawSpriteChara(ch,o);
    ctx.restore();return}
  ctx.save();
 if(pose=='land'){const f=clamp((o.landT||0)/.25,0,1);ctx.translate(0,0);ctx.scale(1,1-.17*f)}
 if(pose=='hit'){const f=clamp((o.hitT||0)/.7,0,1);ctx.translate(0,.95);ctx.rotate(-.36*f);ctx.translate(0,-.95)}
 if(V.v=='side'&&V.m<0)ctx.scale(-1,1);
 const A={ch,pose,ph,t,wind,p:P0};
 if(V.v=='rear')drawRear(A);else if(V.v=='side')drawSide(A);else drawFront(A);
 ctx.restore()}

function legsPart(A,flat){
 const {ch,pose,ph,p}=A,hip=p.hip,SK=rgb(ch.skin);
 for(const d of[-1,1]){
  const L=legJ(pose,ph,d,flat),hx=flat?0:d*.12;
  limb(hx,hip,L.kx,L.ky,.17,rgb(ch.legs));
  limb(L.kx,L.ky,L.fx,L.fy+.08,.14,ch.skirt?SK:rgb(ch.legs));
  ctx.beginPath();ctx.ellipse(L.fx+.04,L.fy+.04,.14,.07,0,0,7);F('#f4f4f4');
  ctx.beginPath();ctx.ellipse(L.fx+.04,L.fy+.01,.11,.03,0,0,7);F('#d6d8e6')}}
function skirtPart(A){
 const {ch,ph,t,p}=A,w=Math.sin(t*9)*.07+p.lift*.12;
 if(!ch.skirt)return;
 sm([[-.26,1.05],[.26,1.05],[.42,.66+w*.3],[0,.6],[-.42,.66-w*.3]]);F(rgb(ch.legs))}

function drawFront(A){
 const {ch,pose,ph,t,wind,p}=A,H1=sc(ch.hair,1),H2=sc(ch.hair,.7),H3=sc(ch.hair,1.4),SK=rgb(ch.skin),hg=ST.sh>1;
 const run=p.bounce,sw=Math.sin(ph)*run,w=Math.sin(t*9)*.07,hip=p.hip;
 legsPart(A,0);
 ctx.save();ctx.translate(0,hip-1);
 ctx.translate(0,run?Math.abs(Math.sin(ph))*.07:0);
 if(ch.long)sm([[-.36,1.72],[-.1,1.97],[.3,1.85],[.42,1.4],[.4,.95+w],[.2,.62+w*2],[0,.9],[-.2,.6-w*2],[-.4,.95-w],[-.42,1.4]]),F(H2);
 if(ch.scarf)sm([[.12,1.32],[.45,1.3+w],[.9+wind*.3,1.34+w*2],[1.05+wind*.4,1.22],[.6,1.16],[.15,1.12]]),F(rgb(ch.acc));
 skirtPart(A);
 sm([[-.25,1.42],[.25,1.42],[.3,1],[.22,.88],[-.22,.88],[-.3,1]]);F(hg?lg(1.4,.88,sc(ch.top,1.2),sc(ch.top,.8)):rgb(ch.top));
 if(ch.skirt)sm([[-.25,1.42],[.25,1.42],[.1,1.2],[-.1,1.2]]),F(rgb(ch.legs));
 for(const d of[-1,1]){const A2=armJ(pose,ph,d,0);
  limb(d*.3,1.34,A2.ex,A2.ey,.13,rgb(ch.top));limb(A2.ex,A2.ey,A2.hx,A2.hy,.11,SK)}
 limb(0,1.36,0,1.46,.12,SK);
 sm([[-.27,1.7],[-.23,1.86],[0,1.94],[.23,1.86],[.27,1.7],[.2,1.46],[0,1.37],[-.2,1.46]]);F(SK);
 if(pose!='hit'){
  for(const d of[-1,1]){const x=d*.115,y=1.64;
   ctx.beginPath();ctx.ellipse(x,y,.085,.105,0,0,7);F('#fff');
   ctx.beginPath();ctx.ellipse(x,y-.01,.066,.09,0,0,7);ctx.fillStyle=hg?lg(y+.08,y-.1,rgb(ch.eye,1.4),rgb(ch.eye,.6)):rgb(ch.eye);ctx.fill();
   ctx.beginPath();ctx.ellipse(x,y-.015,.032,.055,0,0,7);ctx.fillStyle='#1a1030';ctx.fill();
   ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+.025,y+.04,.024,0,7);ctx.fill();ctx.beginPath();ctx.arc(x-.02,y-.04,.012,0,7);ctx.fill();
   ctx.beginPath();ctx.arc(x,y,.09,.25,2.9);ctx.lineWidth=.03;ctx.strokeStyle='#1a1030';ctx.stroke();
   ctx.beginPath();ctx.ellipse(d*.17,1.53,.05,.028,0,0,7);ctx.fillStyle='rgba(255,110,140,.35)';ctx.fill()}
  ctx.beginPath();ctx.arc(0,1.5,.04,pose=='hit'?2.4:3.6,pose=='hit'?3.9:5.8);ctx.lineWidth=.02;ctx.strokeStyle='#8a3040';ctx.stroke()}
 sm([[-.31,1.74],[-.29,1.94],[-.1,2.04],[.12,2.04],[.29,1.94],[.31,1.74],[.21,1.84],[.13,1.72],[.03,1.86],[-.08,1.72],[-.2,1.84]]);F(hg?lg(2.05,1.7,H3,H1):H1);
 for(const d of[-1,1])sm([[d*.3,1.78],[d*.34,1.5+w+p.lift*.1],[d*.27,1.4+w],[d*.24,1.68]]),F(H2);
 sm([[-.18,1.97],[0,2.03],[.18,1.97],[0,1.99]]);ctx.fillStyle=H3;ctx.fill();
 if(ch.rib)for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(-.27,1.9);ctx.lineTo(-.27+d*.18,2);ctx.lineTo(-.27+d*.18,1.8);ctx.closePath();F('#ff3b6b')}
 if(ch.spike)for(const d of[-1,0,1]){ctx.beginPath();ctx.moveTo(d*.17-.09,2);ctx.lineTo(d*.2,2.24);ctx.lineTo(d*.17+.09,2);ctx.closePath();F(H1)}
 if(ch.band){ctx.beginPath();ctx.rect(-.3,1.84,.6,.06);F(rgb(ch.acc))}
 accDraw(A,'front');
 ctx.restore();
 if(pose=='hit')impactMark(0,1.75)}

function drawRear(A){
 const {ch,pose,ph,t,wind,p}=A,H1=sc(ch.hair,1),H2=sc(ch.hair,.7),H3=sc(ch.hair,1.45),SK=rgb(ch.skin),hg=ST.sh>1;
 const run=p.bounce,sw=Math.sin(ph)*run,w=Math.sin(t*9)*.07,hip=p.hip;
 legsPart(A,0);
 ctx.save();ctx.translate(0,hip-1);
 ctx.translate(0,run?Math.abs(Math.sin(ph))*.07:0);
 skirtPart(A);
 sm([[-.26,1.44],[.26,1.44],[.3,1.02],[.22,.9],[-.22,.9],[-.3,1.02]]);
 F(hg?lg(1.44,.9,sc(ch.top,1.15),sc(ch.top,.78)):rgb(ch.top));
 ctx.beginPath();ctx.moveTo(-.2,1.36);ctx.quadraticCurveTo(0,1.28,.2,1.36);ctx.lineWidth=.035;ctx.strokeStyle='rgba(0,0,0,.28)';ctx.stroke();
 if(ch.scarf){sm([[.1,1.3],[.44,1.32+w],[.92+wind*.4,1.3+w*2],[1.06+wind*.5,1.18],[.6,1.14],[.14,1.1]]);F(rgb(ch.acc))}
 for(const d of[-1,1]){const A2=armJ(pose,ph,d,0);
  limb(d*.3,1.36,A2.ex,A2.ey,.13,rgb(ch.top));limb(A2.ex,A2.ey,A2.hx,A2.hy,.11,SK)}
 limb(0,1.38,0,1.48,.13,SK);
 const fl=Math.sin(t*7)*.05+p.lift*.3,wd=wind*.1;
 if(ch.long){
  sm([[-.31,1.76],[-.13,2.01],[.15,2.01],[.31,1.76],[.3,1.42],[.27+fl-wd,1.08],[.21+fl*1.6-wd,.84],[0,.8],[-.21+fl*1.6-wd,.84],[-.27+fl-wd,1.08],[-.3,1.42]]);
  F(H1);
  ctx.beginPath();ctx.moveTo(-.12,1.9);ctx.quadraticCurveTo(-.02,1.4,-.04,1.0);ctx.lineWidth=.07;ctx.strokeStyle=H3;ctx.globalAlpha=.55;ctx.stroke();ctx.globalAlpha=1;
 }else{
  sm([[-.27,1.72],[-.24,1.89],[0,2],[.24,1.89],[.27,1.72],[.22,1.5],[0,1.44],[-.22,1.5]]);
  F(H1);
  ctx.beginPath();ctx.ellipse(-.07,1.87,.11,.03,-.28,0,7);ctx.fillStyle=H3;ctx.fill()}
 for(const d of[-1,1]){const e=ch.long?.25:.27;ctx.beginPath();ctx.ellipse(d*e,1.64,.045,.06,0,0,7);F(SK)}
 if(ch.rib)for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(-.26,1.92);ctx.lineTo(-.26+d*.18,2.02);ctx.lineTo(-.26+d*.18,1.82);ctx.closePath();F('#ff3b6b')}
 if(ch.spike)for(const d of[-1,0,1]){ctx.beginPath();ctx.moveTo(d*.16-.08,1.98);ctx.lineTo(d*.19,2.2);ctx.lineTo(d*.16+.08,1.98);ctx.closePath();F(H1)}
 if(ch.band){ctx.beginPath();ctx.rect(-.28,1.84,.56,.06);F(rgb(ch.acc))}
 accDraw(A,'rear');
 ctx.restore();
 if(pose=='hit')impactMark(0,1.75)}

function drawSide(A){
 const {ch,pose,ph,t,wind,p}=A,H1=sc(ch.hair,1),H2=sc(ch.hair,.7),H3=sc(ch.hair,1.4),SK=rgb(ch.skin),hg=ST.sh>1;
 const run=p.bounce,sw=Math.sin(ph)*run,w=Math.sin(t*9)*.07,hip=p.hip;
 const L2=legJ(pose,ph,-1,1);
 ctx.save();ctx.globalAlpha=.75;
 limb(0,hip,L2.kx-.04,L2.ky,.16,rgb(ch.legs,.78));
 limb(L2.kx-.04,L2.ky,L2.fx-.05,L2.fy+.08,.13,ch.skirt?rgb(ch.skin,.8):rgb(ch.legs,.8));
 ctx.restore();
 ctx.save();ctx.translate(0,hip-1);ctx.translate(0,run?Math.abs(Math.sin(ph))*.07:0);
 if(ch.skirt){sm([[-.2,1.05],[.24,1.05],[.5+wind*.1,.7+w*.3],[.1,.6],[-.3,.66-w*.3]]);F(shadeHex(rgb(ch.legs),.8))}
 const A2=armJ(pose,ph,-1,1);
 ctx.save();ctx.globalAlpha=.72;limb(-.02,1.34,A2.ex-.05,A2.ey,.12,rgb(ch.top,.75));limb(A2.ex-.05,A2.ey,A2.hx-.06,A2.hy,.1,rgb(ch.skin,.82));ctx.restore();
 sm([[-.2,1.42],[.2,1.42],[.24,1.02],[.16,.9],[-.16,.9],[-.24,1.02]]);
 F(hg?lg(1.42,.9,sc(ch.top,1.2),sc(ch.top,.8)):rgb(ch.top));
 if(ch.scarf){sm([[.06,1.34],[.3,1.36+w],[.72+wind*.5,1.42+w*2],[.86+wind*.6,1.3],[.4,1.18],[.08,1.14]]);F(rgb(ch.acc))}
 const A3=armJ(pose,ph,1,1);
 limb(.02,1.36,A3.ex,A3.ey,.13,rgb(ch.top));limb(A3.ex,A3.ey,A3.hx,A3.hy,.11,SK);
 limb(0,1.4,0,1.5,.12,SK);
 circ(0,1.72,.25,SK);
 sm([[.2,1.76],[.32,1.68],[.2,1.62]]);F(SK);
 if(pose!='hit'){
  ctx.beginPath();ctx.ellipse(.15,1.75,.075,.1,0,0,7);F('#fff');
  ctx.beginPath();ctx.ellipse(.16,1.75,.055,.085,0,0,7);ctx.fillStyle=hg?lg(1.83,1.67,rgb(ch.eye,1.4),rgb(ch.eye,.6)):rgb(ch.eye);ctx.fill();
  ctx.beginPath();ctx.ellipse(.17,1.74,.028,.05,0,0,7);ctx.fillStyle='#1a1030';ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(.19,1.79,.022,0,7);ctx.fill();
  ctx.beginPath();ctx.moveTo(.08,1.87);ctx.quadraticCurveTo(.16,1.9,.23,1.85);ctx.lineWidth=.028;ctx.strokeStyle='#2a1a30';ctx.stroke();
  ctx.beginPath();ctx.arc(0,1.5,.035,pose=='hit'?2.4:3.7,pose=='hit'?4:5.6);ctx.lineWidth=.02;ctx.strokeStyle='#8a3040';ctx.stroke()}
 circ(-.04,1.7,.06,SK);
 ctx.beginPath();ctx.arc(-.04,1.7,.035,-1,1);ctx.lineWidth=.02;ctx.strokeStyle='rgba(140,80,60,.6)';ctx.stroke();
 sm([[-.26,1.74],[-.24,1.96],[0,2.05],[.2,1.99],[.3,1.86],[.2,1.92],[.02,1.9],[-.12,1.96],[-.26,1.86]]);
 F(hg?lg(2.05,1.75,H3,H1):H1);
 if(ch.long)sm([[-.2,1.9],[-.32,1.55],[-.36-wind*.35,1.2],[-.24-wind*.4,1.02],[-.12,1.36],[-.1,1.74]]),F(H1);
 sm([[-.05,2.0],[.06,2.06],[.16,1.99],[.04,1.99]]);ctx.fillStyle=H3;ctx.fill();
 if(ch.spike){ctx.beginPath();ctx.moveTo(-.02,2);ctx.lineTo(.06,2.24);ctx.lineTo(.12,2);ctx.closePath();F(H1)}
 if(ch.band){ctx.beginPath();ctx.rect(-.22,1.86,.44,.06);F(rgb(ch.acc))}
 accDraw(A,'side');
 if(ch.rib){ctx.beginPath();ctx.moveTo(-.2,1.94);ctx.lineTo(-.38,2.02);ctx.lineTo(-.38,1.84);ctx.closePath();F('#ff3b6b')}
 ctx.restore();
 const L1=legJ(pose,ph,1,1);
 limb(0,hip,L1.kx,L1.ky,.17,rgb(ch.legs));
 limb(L1.kx,L1.ky,L1.fx,L1.fy+.08,.14,ch.skirt?SK:rgb(ch.legs));
 ctx.beginPath();ctx.ellipse(L1.fx+.06,L1.fy+.04,.15,.07,0,0,7);F('#f4f4f4');
 ctx.beginPath();ctx.ellipse(L1.fx+.06,L1.fy+.01,.12,.03,0,0,7);F('#d6d8e6');
 if(pose=='hit')impactMark(.1,1.8)}

function impactMark(x,y){
 ctx.save();
 ctx.fillStyle='#fff4e6';
 ctx.beginPath();
 for(let i=0;i<10;i++){const a=i/10*6.283,r=i%2?.16:.4;ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}
 ctx.closePath();F('#ffd166');
 ctx.strokeStyle='#ff4f6b';ctx.lineWidth=.05;ctx.stroke();
 ctx.restore()}

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
}