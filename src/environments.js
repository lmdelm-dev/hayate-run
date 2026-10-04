const ENVS=[],ENV_BY={};
function registerEnv(m){ENVS.push(m);ENV_BY[m.id]=m;return m}
function envCount(){return ENVS.length}
function envById(id){return ENV_BY[id]||ENVS[0]}
function envByIndex(i){return ENVS[((i%ENVS.length)+ENVS.length)%ENVS.length]}
const hash=n=>{const s=Math.sin(n*127.1)*43758.5453;return s-Math.floor(s)};
const rndr=a=>a[0]+Math.random()*(a[1]-a[0]);

const PROPSZ={
 building:{w:[2.6,4.4],h:[5,15],d:[3,4.4]},house:{w:[3,4.2],h:[2.6,3.6],d:[3,4]},
 tree:{w:[2.2,3],h:[4,6],d:[2,3]},pine:{w:[2,2.8],h:[4.5,7],d:[2,2.6]},
 palm:{w:[2.4,3.2],h:[4.5,6.5],d:[2,2.6]},lamp:{w:[.5,.7],h:[3.2,3.8],d:[.5,.7],edge:1},
 sign:{w:[1.4,2],h:[2.4,3.2],d:[.4,.5],edge:1},bench:{w:[1.6,2],h:[.9,1],d:[.7,.8],edge:1},
 vend:{w:[1,1.2],h:[1.9,2.1],d:[.8,.9],edge:1},torii:{w:[2.6,3.2],h:[3,3.6],d:[.6,.8],edge:1},
 lantern:{w:[.7,.9],h:[1.8,2.4],d:[.6,.8],edge:1},rock:{w:[1.4,2.6],h:[1,2.2],d:[1.4,2.4]},
 fence:{w:[3,5],h:[1.1,1.3],d:[.3,.4],edge:1},umbrella:{w:[2,2.6],h:[2.2,2.6],d:[2,2.4],edge:1},
 boat:{w:[2.4,3.4],h:[2,3],d:[1,1.4],far:1},crystal:{w:[1.4,2.2],h:[2.4,4],d:[1.4,2]},
 mushroom:{w:[1.6,2.4],h:[1.8,3],d:[1.6,2.2]},pillar:{w:[.9,1.2],h:[3.5,5],d:[.9,1.2],edge:1},
 stall:{w:[2.4,3],h:[2,2.6],d:[1.4,1.8],edge:1},cactus:{w:[1.2,1.6],h:[2,3.4],d:[1.2,1.6]}};

function bld(w,h,c,sd,e){
 const k=ST.k,x0=-w/2,r=k=='cartoon'?.45:k=='3d'?.18:k=='anime'?.05:0;
 const lit=e?(e.lights=='day'?.5:e.lights=='sunset'?.72:.95):(k=='real'?.25:.65);
 if(k=='paper'){ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x0,h);for(let i=1;i<=7;i++)ctx.lineTo(x0+w*i/7,h+(i%2?.14:0));ctx.lineTo(x0+w,0);ctx.closePath()}else rr(x0,0,w,h,r);
 F(ST.sh>1?lg(h,0,sc(c,1.35),sc(c,.7)):rgb(c));
 const rc=rgb([c[0]*.5+40,c[1]*.4+20,c[2]*.5+30]);
 if(k=='anime'||k=='manga'){ctx.beginPath();ctx.moveTo(x0-.3,h-.05);ctx.quadraticCurveTo(x0+.1,h+.1,x0+.35,h+.45);ctx.lineTo(-x0-.35,h+.45);ctx.quadraticCurveTo(-x0-.1,h+.1,-x0+.3,h-.05);ctx.closePath();F(k=='manga'?'#333':rc);
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=.03;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(x0+.3+i*(w-.6)/6,h+.45);ctx.lineTo(x0+.1+i*(w-.2)/6,h);ctx.stroke()}}
 else if(k=='cartoon'||k=='comic'){ctx.beginPath();ctx.moveTo(x0-.2,h);ctx.lineTo(k=='comic'?x0:.2,h+.9);ctx.lineTo(-x0+.2,h);ctx.closePath();F(k=='comic'?'#ff4f9a':'#ff5a5a')}
 else if(k=='3d'||k=='real'){rr(x0-.12,h,w+.24,.2,.05);F(rc)}
 if(k=='manga'){ctx.strokeStyle='#000';ctx.lineWidth=.02;for(let y=.3;y<h;y+=.28){ctx.beginPath();ctx.moveTo(x0+w*.72,y);ctx.lineTo(x0+w,y+.25);ctx.stroke()}}
 const cols=Math.max(2,Math.round(w/.95)),rows=Math.floor((h-1.2)/1.15);
 for(let a=0;a<rows;a++)for(let q=0;q<cols;q++){const wx=x0+(q+.5)*w/cols-.17,wy=1.2+a*1.15,on=((a*5+q*3+(sd|0))%5)<lit*5;
  rr(wx,wy,.34,.55,k=='cartoon'?.17:0);F(on?(k=='3d'?lg(wy+.55,wy,'#b8f0ff','#3aa0d8'):'#ffe29a'):(k=='paper'||k=='flat'||k=='manga'?'#fff':'#1d2748'))}
 rr(-.28,0,.56,.9,k=='cartoon'?.28:0);F('#5a3c32');
 const gl=e&&e.glyphs?e.glyphs[(sd|0)%e.glyphs.length]:(k=='comic'?'BAM':k=='cartoon'?'★':k=='flat'||k=='3d'?'':'酒茶薬本麺'[(sd|0)%5]);
 if(gl){ctx.save();ctx.scale(.01,-.01);ctx.font='bold 34px "Zen Kaku Gothic New",sans-serif';ctx.textAlign='center';ctx.fillStyle=k=='manga'?'#000':'#fff';ctx.fillText(gl,0,-105);ctx.restore()}}
function tree(h,pk){
 const k=ST.k,t=h*.45,g=pk?[[255,150,195],[255,205,225]]:[[48,160,98],[96,200,130]],L=i=>rgb(g[i]);
 if(k=='flat'||k=='real'){limb(0,0,0,t*.7,.3,'#5a3b2e');for(let i=0;i<3;i++){const y=t*.5+i*h*.2,hw=1.15-i*.25;ctx.beginPath();ctx.moveTo(-hw,y);ctx.lineTo(0,y+h*.34);ctx.lineTo(hw,y);ctx.closePath();F(k=='flat'?'#2fb36b':rgb([34+i*8,70+i*8,46+i*6]))}return}
 limb(0,0,k=='cartoon'?.1:0,t,k=='cartoon'?.5:.35,sc([110,72,54],1));
 if(k=='comic'){ctx.beginPath();for(let i=0;i<24;i++){const a=i/24*6.28,r=i%2?.75:1.2;ctx.lineTo(Math.cos(a)*r,h*.8+Math.sin(a)*r)}ctx.closePath();F(pk?'#ff7ab8':'#3dd96b');return}
 if(k=='3d'){const gr=ctx.createRadialGradient(-.3,h*.9,.1,0,h*.8,1.3);gr.addColorStop(0,rgb(g[1],1.1));gr.addColorStop(1,rgb(g[0],.55));circ(0,h*.8,1.15,gr);return}
 if(k=='paper'){[[0,h*.6,1.15,0],[0,h*.85,.9,1],[0,h*1.05,.6,0]].forEach(a=>circ(a[0],a[1],a[2],pk?rgb([255,170-a[3]*30,200]):rgb([100+a[3]*50,170,110])));return}
 const sp=k=='cartoon'?[[0,h*.8,1.15]]:[[0,h*.78,.95],[-.7,h*.62,.7],[.7,h*.62,.7],[-.35,h*.98,.65],[.4,h*.95,.6]];
 sp.forEach(a=>circ(a[0],a[1],a[2],k=='manga'?'#fff':k=='cartoon'?(pk?'#ff8ac0':'#2fd45f'):L(0)));
 sp.forEach(a=>{if(k!='manga'){ctx.beginPath();ctx.arc(a[0]-.15,a[1]+.15,a[2]*.5,0,7);ctx.fillStyle=k=='cartoon'?'rgba(255,255,255,.35)':L(1);ctx.fill()}else{ctx.strokeStyle='#000';ctx.lineWidth=.02;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(a[0]-.3+i*.18,a[1]-.3);ctx.lineTo(a[0]+.1+i*.18,a[1]+.3);ctx.stroke()}}})}

const PROPS={
 building:(o,e)=>bld(o.w,o.h,e.pal.building[o.ci],o.sd,e),
 house:(o,e)=>{const w=o.w,h=o.h;rr(-w/2,0,w,h*.62,ST.k=='cartoon'?.2:0);F(o.c1);
  ctx.beginPath();ctx.moveTo(-w/2-.25,h*.62);ctx.lineTo(0,h);ctx.lineTo(w/2+.25,h*.62);ctx.closePath();F(o.c2);
  rr(-w*.14,0,w*.28,h*.42,0);F('#4a3226');
  for(const d of[-1,1]){rr(d*w*.3-w*.1,h*.3,w*.2,h*.22,0);F('rgba(255,235,170,.9)')}},
 tree:(o,e)=>tree(o.h,e.tags.includes('sakura')||e.theme=='sakura'),
 pine:(o,e)=>{limb(0,0,0,o.h*.32,.32,sc([92,64,44],1));for(let i=0;i<4;i++){const y=o.h*.22+i*o.h*.18,hw=o.w*.5*(1-i*.17);
   ctx.beginPath();ctx.moveTo(-hw,y);ctx.lineTo(0,y+o.h*.36);ctx.lineTo(hw,y);ctx.closePath();F(e.lights=='snow'?'#dfeaf2':rgb([26+i*6,74+i*8,58+i*6]))}},
 palm:(o,e)=>{ctx.beginPath();ctx.moveTo(-.14,0);ctx.quadraticCurveTo(.2,o.h*.6,o.h*.16,o.h);ctx.lineWidth=.28;ctx.strokeStyle=ST.ol?ST.olc:'#7a5636';ctx.stroke();ctx.lineWidth=.2;ctx.strokeStyle='#8a6a44';ctx.stroke();
  for(let i=0;i<6;i++){const a=i/6*6.28;ctx.beginPath();ctx.moveTo(o.h*.16,o.h);ctx.quadraticCurveTo(o.h*.16+Math.cos(a)*o.w*.6,o.h+Math.sin(a)*o.w*.4-o.w*.3,o.h*.16+Math.cos(a)*o.w,o.h+Math.sin(a)*o.w*.5);ctx.lineWidth=.16;ctx.strokeStyle=rgb([46,150,96]);ctx.stroke()}},
 lamp:(o,e)=>{limb(0,0,0,o.h,.16,rgb([70,74,92]));limb(0,o.h,.5,o.h,.14,rgb([70,74,92]));
  rr(.4,o.h-.16,.34,.24,.08);F(e.lights=='day'?'#c9cdd8':'#ffe9a0');
  if(e.lights!='day'){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(.55,o.h-.1,0,.55,o.h-.1,1.6);g.addColorStop(0,'rgba(255,232,160,.55)');g.addColorStop(1,'rgba(255,232,160,0)');ctx.fillStyle=g;ctx.fillRect(-1,o.h-1.7,3,3);ctx.restore()}},
 sign:(o,e)=>{limb(0,0,0,o.h,.12,rgb([80,84,100]));rr(-o.w/2,o.h-o.h*.4,o.w,o.h*.4,.12);F(e.pal.accent);
  ctx.save();ctx.scale(.012,-.012);ctx.font='bold 40px "Zen Kaku Gothic New",sans-serif';ctx.textAlign='center';ctx.fillStyle='#1b1340';ctx.fillText(e.glyphs?e.glyphs[o.sd%e.glyphs.length]:'道',0,-o.h*83);ctx.restore()},
 bench:(o,e)=>{rr(-o.w/2,o.h*.45,o.w,.14,.06);F('#7a5636');for(const d of[-1,1]){limb(d*o.w*.4,o.h*.45,d*o.w*.4,0,.1,rgb([70,60,54]))}rr(-o.w/2,o.h*.75,o.w,.12,.05);F('#8a6a48')},
 vend:(o,e)=>{rr(-o.w/2,0,o.w,o.h,.14);F(e.lights=='day'?'#d8434e':'#e85260');rr(-o.w*.36,o.h*.28,o.w*.72,o.h*.5,.08);F('rgba(255,255,255,.92)');
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){rr(-o.w*.3+j*o.w*.34,o.h*.32+i*o.h*.15,o.w*.26,o.h*.12,.04);F(i==1?'#7ad0ff':'#ffd36b')}rr(-o.w*.4,0,o.w*.8,o.h*.16,.06);F('#33242c')},
 torii:(o,e)=>{for(const d of[-1,1]){limb(d*o.w*.36,0,d*o.w*.32,o.h,.26,rgb([214,58,58]))}
  ctx.beginPath();ctx.moveTo(-o.w*.58,o.h);ctx.lineTo(o.w*.58,o.h);ctx.lineTo(o.w*.5,o.h-.2);ctx.lineTo(-o.w*.5,o.h-.2);ctx.closePath();F(rgb([214,58,58]));
  rr(-o.w*.46,o.h*.7,o.w*.92,.16,.04);F(rgb([196,46,46]))},
 lantern:(o,e)=>{limb(0,0,0,o.h,.06,rgb([60,50,44]));ctx.beginPath();ctx.ellipse(0,o.h*.86,o.w*.5,o.h*.16,0,0,7);F(e.lights=='day'?'#f2e2c8':'#ff9f5a');
  ctx.beginPath();ctx.ellipse(0,o.h*.86,o.w*.22,o.h*.1,0,0,7);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fill()},
 rock:(o,e)=>{sm([[-o.w/2,0],[-o.w*.42,o.h*.6],[-o.w*.1,o.h],[o.w*.3,o.h*.82],[o.w/2,o.h*.3],[o.w*.36,0]]);F(e.ground=='snow'?'#e6eef6':rgb([116,110,118]));
  sm([[-o.w*.4,o.h*.55],[-o.w*.12,o.h*.92],[o.w*.06,o.h*.62]]);ctx.fillStyle='rgba(255,255,255,.28)';ctx.fill()},
 fence:(o,e)=>{for(let i=0;i<=4;i++){const x=-o.w/2+i*o.w/4;limb(x,0,x,o.h,.1,rgb([142,116,86]))}for(const y of[.35,.8])limb(-o.w/2,o.h*y,o.w/2,o.h*y,.08,rgb([156,128,96]))},
 umbrella:(o,e)=>{limb(0,0,0,o.h,.09,rgb([90,80,70]));
  ctx.beginPath();ctx.moveTo(-o.w/2,o.h);ctx.quadraticCurveTo(0,o.h+o.w*.4,o.w/2,o.h);ctx.quadraticCurveTo(o.w*.25,o.h*.94,0,o.h);ctx.quadraticCurveTo(-o.w*.25,o.h*.94,-o.w/2,o.h);ctx.closePath();F(e.pal.accent);
  ctx.beginPath();ctx.moveTo(-o.w/2,o.h);ctx.quadraticCurveTo(0,o.h+o.w*.4,o.w/2,o.h);ctx.lineWidth=.06;ctx.strokeStyle='rgba(0,0,0,.25)';ctx.stroke()},
 boat:(o,e)=>{sm([[-o.w/2,o.h*.4],[o.w/2,o.h*.4],[o.w*.34,0],[-o.w*.34,0]]);F(rgb([196,178,150]));
  limb(0,o.h*.4,0,o.h*1.3,.07,'#6a5a4a');
  ctx.beginPath();ctx.moveTo(.04,o.h*1.3);ctx.lineTo(o.w*.5,o.h*.5);ctx.lineTo(.04,o.h*.5);ctx.closePath();F('#fff')},
 crystal:(o,e)=>{sm([[-o.w/2,0],[-o.w*.3,o.h*.7],[0,o.h],[o.w*.3,o.h*.6],[o.w/2,0]]);
  F(e.lights=='day'?'#8fd8ff':'#6ae0ff');
  sm([[0,o.h],[o.w*.3,o.h*.6],[o.w/2,0],[.02,0]]);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fill();
  if(e.lights!='day'){ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(0,o.h*.5,0,0,o.h*.5,o.h);g.addColorStop(0,'rgba(120,230,255,.5)');g.addColorStop(1,'rgba(120,230,255,0)');ctx.fillStyle=g;ctx.fillRect(-o.h,-o.h*.2,o.h*2,o.h*2);ctx.restore()}},
 mushroom:(o,e)=>{limb(0,0,0,o.h*.55,o.w*.3,'#f2e6d8');
  ctx.beginPath();ctx.ellipse(0,o.h*.62,o.w*.55,o.h*.34,0,Math.PI,0);F(e.pal.accent);
  for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(-o.w*.3+i*o.w*.2,o.h*.6,o.w*.09,o.h*.07,0,0,7);F('rgba(255,255,255,.8)')}},
 pillar:(o,e)=>{rr(-o.w/2,0,o.w,o.h,.05);F(rgb([214,206,196]));
  rr(-o.w*.7,o.h,o.w*1.4,o.h*.1,.04);F(rgb([198,190,180]));
  rr(-o.w*.7,0,o.w*1.4,o.h*.08,.04);F(rgb([198,190,180]));
  ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=.04;for(const d of[-.2,.2]){ctx.beginPath();ctx.moveTo(d*o.w,0);ctx.lineTo(d*o.w,o.h);ctx.stroke()}},
 stall:(o,e)=>{rr(-o.w/2,0,o.w,o.h*.62,.06);F('#8a6a48');
  ctx.beginPath();ctx.moveTo(-o.w*.6,o.h*.62);ctx.lineTo(o.w*.6,o.h*.62);ctx.lineTo(o.w*.44,o.h);ctx.lineTo(-o.w*.44,o.h);ctx.closePath();F(e.pal.accent);
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-o.w*.6+i*o.w*.24,o.h*.62);ctx.lineTo(-o.w*.44+i*o.w*.22,o.h);ctx.lineWidth=.06;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.stroke()}
  for(const d of[-1,1])limb(d*o.w*.44,0,d*o.w*.44,o.h,.1,rgb([120,96,70]))},
 cactus:(o,e)=>{limb(0,0,0,o.h*.9,o.w*.6,rgb([64,140,86]));
  limb(-o.w*.3,o.h*.4,-o.w*.3,o.h*.66,o.w*.42,rgb([64,140,86]));limb(-o.w*.3,o.h*.62,-o.w*.06,o.h*.62,o.w*.4,rgb([64,140,86]));
  limb(o.w*.3,o.h*.52,o.w*.3,o.h*.74,o.w*.42,rgb([64,140,86]));limb(o.w*.3,o.h*.7,o.w*.08,o.h*.7,o.w*.4,rgb([64,140,86]))}};

function mkDecor(side,z,e){
 const kind=e.props[Math.random()*e.props.length|0],s=PROPSZ[kind]||PROPSZ.tree;
 const x=s.edge?side*(6.9+Math.random()*.7):s.far?side*(16+Math.random()*14):side*(7.5+Math.random()*7);
 const o={kind,x,z,w:rndr(s.w),h:rndr(s.h),d:rndr(s.d),ci:Math.random()*3|0,sd:Math.random()*9|0};
 if(kind=='house'){o.c1=rgb(e.pal.building[o.ci]);o.c2=shadeHex(e.pal.accent,.7)}
 if(kind=='tree')o.pk=e.tags.includes('sakura')||e.theme=='sakura'?1:Math.random()<.3;
 return o}

const OBS={
 building:{w:2.2,d:3,h:6,draw(o,e){bld(o.w,o.h,e.pal.building[o.ci],o.sd,e)}},
 tree:{w:.9,d:.9,h:3.4,draw(o,e){tree(o.h,e.theme=='sakura'||e.tags.includes('sakura'))}},
 person:{w:.8,d:.6,h:1.9,draw(o,e,t){drawChara(o.pal,{pose:'run',ph:t*3.2+xj(o.seed),t,x:o.x,z:o.z,wind:.5})}},
 hole:{w:2,d:2.6,h:0,ground:1,drawG(o,e){const x0=o.x-o.w/2,x1=o.x+o.w/2,z0=o.z-o.d/2,z1=o.z+o.d/2;
  quad(P(x0-.15,0,z0-.15,1),P(x1+.15,0,z0-.15,1),P(x1+.15,0,z1+.15,1),P(x0-.15,0,z1+.15,1),e.pal.accent);
  quad(P(x0,0,z0,1),P(x1,0,z0,1),P(x1,0,z1,1),P(x0,0,z1,1),e.ground=='grid'?'#12002a':'#08050f')}},
 rock:{w:1.7,d:1.6,h:1.7,draw(o,e){PROPS.rock({w:o.w*1.4,h:o.h},e)}},
 crate:{w:1.5,d:1.5,h:1.25,draw(o,e){rr(-o.w/2,0,o.w,o.h,.1);F(rgb([176,138,92]));
  ctx.strokeStyle='rgba(60,40,20,.55)';ctx.lineWidth=.09;ctx.beginPath();ctx.moveTo(-o.w/2,0);ctx.lineTo(o.w/2,o.h);ctx.moveTo(o.w/2,0);ctx.lineTo(-o.w/2,o.h);ctx.stroke();
  rr(-o.w/2,0,o.w,o.h,ST.k=='cartoon'?.1:0);ctx.lineWidth=ST.ol/K;ctx.strokeStyle=ST.olc;ctx.stroke()}},
 barrier:{w:2.1,d:.5,h:1,draw(o,e){for(const d of[-1,1])limb(d*o.w*.4,0,d*o.w*.4,.75,.12,rgb([210,214,224]));
  rr(-o.w/2,.75,o.w,.25,.06);F('#ff6a4a');
  ctx.save();ctx.beginPath();ctx.rect(-o.w/2,.75,o.w,.25);ctx.clip();for(let i=-3;i<4;i++){ctx.beginPath();ctx.moveTo(i*.5,.75);ctx.lineTo(i*.5+.3,1);ctx.lineWidth=.16;ctx.strokeStyle='#fff';ctx.stroke()}ctx.restore()}},
 lamp:{w:.5,d:.5,h:3.2,draw(o,e){PROPS.lamp({w:o.w,h:o.h},e)}},
 sign:{w:1.6,d:.4,h:2.6,draw(o,e){PROPS.sign({w:o.w,h:o.h,sd:o.sd},e)}},
 log:{w:2,d:.8,h:.9,draw(o,e){rr(-o.w/2,0,o.w,o.h,.4);F(rgb([136,100,66]));
  ctx.beginPath();ctx.ellipse(o.w/2,o.h*.5,.1,.4,0,0,7);F(rgb([190,158,116]))}},
 crystal:{w:1.4,d:1.4,h:2.6,draw(o,e){PROPS.crystal({w:o.w*1.3,h:o.h},e)}},
 mushroom:{w:1.6,d:1.6,h:2.2,draw(o,e){PROPS.mushroom({w:o.w*1.2,h:o.h},e)}},
 orb:{w:.9,d:.9,h:1.2,pickup:1,draw(o,e,t){const b=Math.sin((t||0)*4+xj(o.seed))*.18;ctx.save();ctx.translate(0,1.1+b);ctx.rotate(Math.sin((t||0)*2)*.2);ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5,r=i%2?.16:.4;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();F(e.lights==='day'?'#ffd166':'#ffe9a0');ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(0,0,0,0,0,.8);g.addColorStop(0,'rgba(255,220,120,.8)');g.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=g;ctx.fillRect(-.8,-.8,1.6,1.6);ctx.restore();ctx.restore()}}, asteroid:{w:1.8,d:1.8,h:1.8,draw(o,e){sm([[-o.w/2,0],[-o.w*.4,o.h*.75],[-o.w*.05,o.h],[o.w*.42,o.h*.7],[o.w/2,o.h*.15],[o.w*.2,-.1]]);
  F(rgb([88,84,110]));sm([[-o.w*.3,o.h*.6],[0,o.h*.85],[o.w*.2,o.h*.5]]);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fill();
  ctx.beginPath();ctx.arc(-o.w*.1,o.h*.5,.14,0,7);F('rgba(40,30,60,.6)')}}};
const xj=n=>(n||0)%6.28;

function spawnRow(e,objs){
 const types=e.obstacles,n=Math.random()<.45?2:1,lanes=[-1,0,1].sort(()=>Math.random()-.5).slice(0,n);
 lanes.forEach(l=>{const t=types[Math.random()*types.length|0],d=OBS[t],o={t,x:l*LANE,z:95,hit:false,ci:Math.random()*3|0,sd:Math.random()*9|0,seed:Math.random()*6.28};
  o.w=d.w;o.d=d.d;o.h=d.h;
  if(t=='building'){o.h=4+Math.random()*4}
  if(t=='person')o.pal=PEOPLE[Math.random()*4|0];
  objs.push(o)})
 if(Math.random()<.4){const free=[-1,0,1].filter(l=>lanes.indexOf(l)<0);if(free.length){const l=free[Math.random()*free.length|0];objs.push({t:'orb',x:l*LANE,z:97,hit:false,ci:0,sd:Math.random()*9|0,seed:Math.random()*6.28,w:.9,d:.9,h:1.2})}}}

const THEMES=[
{k:'school',name:'Anime School',ja:'アニメ学校',horizon:'town',ground:'road',glyphs:'校室館図書体育',
 wx:'none',nightWx:'none',tags:['school'],
 props:['building','tree','fence','bench','lamp','sign','vend','stall'],
 obstacles:['crate','barrier','person','tree','hole'],
 pal:{sky:['#1e4fa8','#5aa2e8','#cfeaff'],ground:'#4a7a52',road:['#8e8a80','#86827a'],walk:['#b8b2a4','#b0aa9c'],hill:'#6a9a6a',accent:'#ff5c8a',building:[[238,224,200],[226,206,180],[212,194,174]]}},
{k:'city',name:'Japanese City',ja:'日本の街',horizon:'city',ground:'road',glyphs:'酒茶薬本麺',
 wx:'none',nightWx:'mist',tags:['city'],
 props:['building','lamp','sign','vend','bench','fence','stall','lantern'],
 obstacles:['building','person','barrier','lamp','hole'],
 pal:{sky:['#183a7a','#4a8ad4','#bfe0ff'],ground:'#3e4654',road:['#4b5262','#454c5c'],walk:['#6a7284','#646c7e'],hill:'#3a4a6a',accent:'#ffd166',building:[[196,200,214],[174,180,196],[150,158,178]]}},
{k:'rain',name:'Rainy City',ja:'雨の街',horizon:'city',ground:'road',glyphs:'雨空水雲汽',
 wx:'rain',nightWx:'rain',tags:['rain','city'],
 props:['building','lamp','sign','vend','fence','stall'],
 obstacles:['building','person','barrier','sign','hole'],
 pal:{sky:['#141a34','#3a4a74','#8b93b8'],ground:'#2e3546',road:['#3c4356','#374051'],walk:['#525b72','#4d566c'],hill:'#2a3352',accent:'#7ad0ff',building:[[150,160,186],[130,142,170],[112,124,152]]}},
{k:'sakura',name:'Cherry-Blossom Road',ja:'桜並木',horizon:'town',ground:'road',glyphs:'和菓茶花道',
 wx:'petals',nightWx:'petals',tags:['sakura'],
 props:['tree','torii','lantern','fence','lamp','bench','stall'],
 obstacles:['tree','person','crate','hole'],
 pal:{sky:['#2f2066','#ff8fb0','#ffd9c2'],ground:'#4f7a4a',road:['#8a8078','#827a72'],walk:['#c9b8ae','#c1b0a6'],hill:'#7fae6a',accent:'#ff9ec4',building:[[242,214,196],[230,198,182],[216,184,170]]}},
{k:'forest',name:'Forest',ja:'森',horizon:'forest',ground:'grass',glyphs:'森木野緑泉',
 wx:'leaves',nightWx:'fireflies',tags:['nature'],
 props:['tree','pine','rock','fence','stall'],
 obstacles:['tree','log','rock','hole'],
 pal:{sky:['#123a2a','#2f7a5a','#a8e6c8'],ground:'#2f5a34',road:['#6b5a44','#645440'],walk:['#7d6a50','#75634c'],hill:'#2f7a4a',accent:'#8fe0a0',building:[[140,120,96],[126,108,86],[112,96,76]]}},
{k:'mountain',name:'Mountain',ja:'山',horizon:'peaks',ground:'snow',glyphs:'山峰雪雲天',
 wx:'none',nightWx:'stars',tags:['nature','peaks'],
 props:['pine','rock','pillar','fence','house'],
 obstacles:['rock','log','person','hole'],
 pal:{sky:['#1e3a6e','#5a9ad4','#d8ecff'],ground:'#6a7a8c',road:['#8a8f9c','#828894'],walk:['#a2a8b4','#9aa0ac'],hill:'#5a6a86',accent:'#e8f4ff',building:[[160,150,140],[146,136,128],[132,124,118]]}},
{k:'beach',name:'Beach',ja:'海辺',horizon:'sea',ground:'sand',glyphs:'浜海貝波砂',
 wx:'none',nightWx:'stars',tags:['sea'],
 props:['palm','umbrella','rock','boat','stall','lantern'],
 obstacles:['rock','person','barrier','hole'],
 pal:{sky:['#125a9c','#4fb8e8','#c8f0ff'],ground:'#e8d4a0',road:['#dcc796','#d4bf8e'],walk:['#f0e0b8','#e8d8b0'],hill:'#2a9ec8',accent:'#ff7a5c',building:[[240,220,190],[228,206,178],[214,194,166]]}},
{k:'neon',name:'Neon / Cyberpunk City',ja:'ネオン都市',horizon:'city',ground:'grid',glyphs:'光音幻夜電',
 wx:'neon',nightWx:'neon',tags:['cyber','city'],
 props:['building','sign','lamp','vend','pillar','stall'],
 obstacles:['building','person','barrier','lamp','hole'],
 pal:{sky:['#050318','#2a0a6a','#ff2fa0'],ground:'#140a2e',road:['#1e1244','#1a0f3c'],walk:['#2a1a56','#25154e'],hill:'#3a1080',accent:'#4de3ff',building:[[70,30,140],[50,20,110],[100,40,160]]}},
{k:'fantasy',name:'Fantasy Town',ja:'幻想の町',horizon:'hills',ground:'grass',glyphs:'魔法光星門',
 wx:'fireflies',nightWx:'fireflies',tags:['fantasy'],
 props:['mushroom','crystal','pillar','house','tree','lantern','stall'],
 obstacles:['crystal','mushroom','person','hole'],
 pal:{sky:['#2a1a6e','#7a4ad8','#ffd0f0'],ground:'#4a3a8a',road:['#5a4a9a','#544490'],walk:['#6a5aaa','#6454a0'],hill:'#8a5ae0',accent:'#ffd166',building:[[190,160,240],[170,140,220],[150,120,200]]}},
{k:'space',name:'Space / Sci-Fi',ja:'宇宙',horizon:'space',ground:'grid',glyphs:'宇宙星船',
 wx:'stars',nightWx:'stars',tags:['scifi'],
 props:['crystal','pillar','sign','lamp','rock'],
 obstacles:['asteroid','crate','rock','hole'],
 pal:{sky:['#020210','#0a0a3a','#2a1a6a'],ground:'#0a0a1e',road:['#161636','#121230'],walk:['#1e1e44','#1a1a3e'],hill:'#3a2a7a',accent:'#4de3ff',building:[[80,90,140],[64,74,120],[48,58,100]]}},
{k:'sunset',name:'Sunset Line',ja:'夕陽ライン',horizon:'city',ground:'road',glyphs:'夕日暮空',
 wx:'none',nightWx:'none',tags:['sunset'],
 props:['building','lamp','sign','fence','bench','stall'],
 obstacles:['building','person','barrier','hole'],
 pal:{sky:['#3a0d2e','#ff5a3c','#ffd36b'],ground:'#4a3040',road:['#5a4050','#543a4a'],walk:['#6a5060','#644a5a'],hill:'#8a3a5a',accent:'#ffd36b',building:[[226,150,120],[210,136,110],[192,122,100]]}},
{k:'snow',name:'Snow Field',ja:'雪原',horizon:'peaks',ground:'snow',glyphs:'雪氷白冬',
 wx:'snow',nightWx:'snow',tags:['snow'],
 props:['pine','rock','house','fence','lamp'],
 obstacles:['rock','log','person','hole'],
 pal:{sky:['#2a4a7a','#7aa8d8','#e8f4ff'],ground:'#dfeaf4',road:['#c8d8e8','#c0d0e0'],walk:['#e8f2fa','#e0eaf4'],hill:'#9ab8d4',accent:'#7ad0ff',building:[[230,238,248],[214,224,238],[198,210,228]]}},
{k:'manga',name:'Manga Panel',ja:'マンガ',horizon:'city',ground:'road',glyphs:'マンガ擬音',
 wx:'none',nightWx:'none',tags:['print'],
 props:['building','lamp','sign','fence','bench'],
 obstacles:['building','person','barrier','hole'],
 pal:{sky:['#ffffff','#f4f4f4','#dcdcdc'],ground:'#e8e8e8',road:['#9a9a9a','#909090'],walk:['#c4c4c4','#bcbcbc'],hill:'#b4b4b4',accent:'#000000',building:[[230,230,230],[205,205,205],[180,180,180]]}},
{k:'comic',name:'Comic Panel',ja:'コミック',horizon:'city',ground:'road',glyphs:'BAMPOWZAP',
 wx:'none',nightWx:'none',tags:['print'],
 props:['building','lamp','sign','stall','fence'],
 obstacles:['building','person','crate','hole'],
 pal:{sky:['#ffe14d','#ff9a3d','#ff4f9a'],ground:'#ff7ab8',road:['#3a2d7c','#33276f'],walk:['#ffd23f','#f5c518'],hill:'#ff4f9a',accent:'#3a2d7c',building:[[255,120,180],[120,200,255],[255,220,60]]}},
{k:'dream',name:'Dream',ja:'夢',horizon:'hills',ground:'grass',glyphs:'夢幻泡影月',
 wx:'bubbles',nightWx:'stars',tags:['dream'],
 props:['mushroom','crystal','house','tree','lantern','pillar'],
 obstacles:['mushroom','crystal','person','hole'],
 pal:{sky:['#1a0a3e','#5a2a9e','#ffb8f0'],ground:'#3a2a6a',road:['#4a3a7a','#443472'],walk:['#5a4a8a','#544482'],hill:'#a05ae0',accent:'#ffb8f0',building:[[220,180,255],[200,160,240],[180,140,220]]}},
{k:'country',name:'Countryside',ja:'田舎道',horizon:'hills',ground:'grass',glyphs:'田畠道風空',
 wx:'leaves',nightWx:'fireflies',tags:['nature','rural'],
 props:['house','fence','tree','lamp','stall','bench'],
 obstacles:['crate','log','person','hole'],
 pal:{sky:['#2a6ab8','#7cc4ee','#dff4ff'],ground:'#4f8a44',road:['#9a8a70','#928464'],walk:['#b8a888','#b0a080'],hill:'#5a9a52',accent:'#ffd166',building:[[238,226,200],[224,210,186],[208,194,172]]}},
{k:'shrine',name:'Shrine',ja:'神社',horizon:'forest',ground:'grass',glyphs:'神社祭祈縣',
 wx:'fireflies',nightWx:'fireflies',tags:['shrine'],
 props:['torii','lantern','tree','fence','stall','house'],
 obstacles:['person','tree','barrier','hole'],
 pal:{sky:['#27436e','#7a90c4','#f0d8e8'],ground:'#3e6e42',road:['#8a8478','#827c70'],walk:['#a8a094','#a0968c'],hill:'#3a5a48',accent:'#ff5c5c',building:[[226,210,188],[212,196,176],[196,180,162]]}},
{k:'station',name:'Underground Station',ja:'地下駅',horizon:'city',ground:'deck',glyphs:'駅線改札車',
 wx:'none',nightWx:'mist',tags:['city','station'],
 props:['pillar','sign','lamp','bench','vend','fence'],
 obstacles:['barrier','person','sign','hole'],
 pal:{sky:['#0c0e22','#2a2f5e','#6a6aa8'],ground:'#262a3e',road:['#333852','#2e3350'],walk:['#414763','#3c4260'],hill:'#1e2440',accent:'#ffd166',building:[[150,156,180],[132,138,162],[114,120,144]]}},
{k:'roof',name:'Rooftops',ja:'屋上',horizon:'city',ground:'deck',glyphs:'屋上空風夜',
 wx:'none',nightWx:'neon',tags:['city','roof'],
 props:['pillar','fence','lamp','sign','vend','stall'],
 obstacles:['barrier','crate','person','hole'],
 pal:{sky:['#3a2a6e','#b46ac4','#ffd9a8'],ground:'#3a3452',road:['#4a4462','#443e5c'],walk:['#5a5472','#544e6c'],hill:'#4a3a7a',accent:'#4de3ff',building:[[196,170,220],[176,150,202],[156,130,184]]}},
{k:'castle',name:'Fantasy Castle',ja:'幻想城',horizon:'hills',ground:'grass',glyphs:'城門空星光',
 wx:'stars',nightWx:'stars',tags:['fantasy','castle'],
 props:['pillar','crystal','house','lantern','stall','tree'],
 obstacles:['crystal','rock','person','hole'],
 pal:{sky:['#1e2a6e','#6a6ad8','#ffd0e8'],ground:'#3e4a7a',road:['#5a5a8a','#545482'],walk:['#6a6a9a','#646492'],hill:'#5a4ab8',accent:'#ffd166',building:[[210,190,240],[190,170,222],[170,150,204]]}}
];

const VARIANTS=[
{k:'day',name:'Day',lights:null,wx:'theme',tint:null,amt:0,skyMix:null,mixT:0,shade:1},
{k:'dusk',name:'Dusk',lights:'sunset',wx:'theme',tint:'#ff8a4c',amt:.16,skyMix:'#ff7a3c',mixT:.4,shade:.86},
{k:'night',name:'Night',lights:'night',wx:'night',tint:'#243a8f',amt:.42,skyMix:'#050a24',mixT:.72,shade:.55},
{k:'rain',name:'Rain',lights:'night',wx:'rain',tint:'#4a5a80',amt:.32,skyMix:'#39486e',mixT:.55,shade:.7},
{k:'snow',name:'Snow',lights:'day',wx:'snow',tint:'#cfe4ff',amt:.2,skyMix:'#cfe4ff',mixT:.3,shade:.95},
{k:'storm',name:'Storm',lights:'night',wx:'rain',tint:'#161c38',amt:.55,skyMix:'#101528',mixT:.75,shade:.5},
{k:'aurora',name:'Aurora',lights:'night',wx:'stars',tint:'#0f7a8a',amt:.3,skyMix:'#06203a',mixT:.6,shade:.6},
{k:'festival',name:'Festival',lights:'sunset',wx:'embers',tint:'#ff6a3c',amt:.2,skyMix:'#ff7a3c',mixT:.35,shade:.9}];

function variantPal(p,v){
 const sky=v.skyMix?p.sky.map(c=>mixHex(c,v.skyMix,v.mixT)):p.sky.slice();
 const sh=v.shade;
 return{sky,ground:shadeHex(p.ground,sh),road:p.road.map(c=>shadeHex(c,sh)),walk:p.walk.map(c=>shadeHex(c,sh)),
  hill:shadeHex(p.hill,sh),accent:p.accent,building:p.building.map(c=>[c[0]*sh|0,c[1]*sh|0,c[2]*sh|0])}}
function buildEnvs(){
 THEMES.forEach(th=>{VARIANTS.forEach(v=>{
  const wx=v.wx=='theme'?th.wx:v.wx=='night'?(th.nightWx||th.wx):v.wx;
  registerEnv({id:th.k+'-'+v.k,name:th.name+' · '+v.name,nameJa:th.ja,
   theme:th.k,themeName:th.name,themeJa:th.ja,variant:v.k,variantName:v.name,
   license:'CC0-1.0',source:'Procedural geometry generated at runtime by js/envs.js (original artwork, no third-party assets)',
   author:'Hayate Run contributors',tags:[th.k,v.k].concat(th.tags||[]),
   pal:variantPal(th.pal,v),horizon:th.horizon,ground:th.ground,
   lights:v.lights||'day',weather:{kind:wx},props:th.props.slice(),obstacles:th.obstacles.slice(),
   glyphs:th.glyphs,light:{tint:v.tint||'rgba(0,0,0,0)',mode:v.mode||'multiply',amt:v.amt}})})})}
buildEnvs();

const AUTO_ORDER=['school-day','sakura-day','city-day','rain-rain','forest-day','mountain-snow','beach-day','neon-night',
 'fantasy-day','space-night','sunset-dusk','snow-day','dream-night','manga-day','comic-day','city-festival',
 'neon-rain','sakura-dusk','beach-dusk','forest-night','fantasy-aurora','space-aurora','rain-storm','school-festival','castle-night','shrine-night','station-night','country-festival','roof-festival','country-day','shrine-day','station-day','roof-day','castle-day'];
const SONG_ENV=['rain-rain','sakura-day','neon-night','sunset-dusk'];
function autoEnvList(sIdx){
 const head=SONG_ENV[sIdx%SONG_ENV.length];
 let i=AUTO_ORDER.indexOf(head);if(i<0)i=0;
 const out=[];for(let k=0;k<AUTO_ORDER.length;k++)out.push(AUTO_ORDER[(i+k)%AUTO_ORDER.length]);
 return out}
