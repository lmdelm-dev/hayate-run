/* CC0 pixel-sprite guest runners (AutoSprite free library, see docs/ASSETS.md).
   Uniform-grid sheet animation: frame w/h, column count, frame count,
   cadence (cycle speed multiplier on the run-phase clock), loop, pose
   transforms, horizontal flip (applied by the drawChara caller), scale via
   sprite.h (world height of one frame), feet offset via sprite.feet
   (fraction down the frame where the feet sit).
   Node/smoke safe: loading is browser-only (typeof Image guard). Until the
   PNG is ready the character falls back to the procedural vector path. */
function spriteReady(ch){
  const s=ch&&ch.sprite,i=s&&s.img;
  return !!(i&&i.complete&&((i.naturalWidth||i.width)>0));
}
function spriteLoad(ch){
  const s=ch&&ch.sprite;
  if(!s||s.img||s.failed)return;
  if(typeof Image==='undefined')return;
  const img=new Image();
  img.onload=()=>{/* spriteReady flips true via complete+naturalWidth */};
  img.onerror=()=>{s.failed=true};
  img.src=s.src;
  s.img=img;
}
function spriteLoadAll(){
  if(typeof CHARS==='undefined'||!CHARS.forEach)return;
  CHARS.forEach(spriteLoad);
}
function spriteFrame(ch,pose,ph){
  const s=ch.sprite,n=s.count||1;
  const i=Math.floor(Math.abs(ph||0)*(s.cadence||2.2))%n;
  return i<0?i+n:i;
}
function spriteRect(ch,fr){
  const s=ch.sprite;
  return [(fr%s.cols)*s.fw,Math.floor(fr/s.cols)*s.fh,s.fw,s.fh];
}
/* Drawn inside the S() world transform: feet origin, +y up, ctx y-flipped.
   The side-view walk cycle is played at run cadence with a forward lean and
   bob so it reads as running; air/land/hit poses reuse the cycle with tilt
   and squash instead of fake extra frames. */
function drawSpriteChara(ch,o){
  const s=ch.sprite,pose=(o&&o.pose)||'run',ph=(o&&o.ph)||0;
  const fr=spriteFrame(ch,pose,ph),r=spriteRect(ch,fr);
  const h=s.h||2.5,w=h*s.fw/s.fh,feet=(s.feet==null)?.93:s.feet;
  ctx.save();
  if(pose==='jump'){ctx.translate(0,.12);ctx.rotate(-.16);ctx.scale(1.02,1.06)}
  else if(pose==='fall'){ctx.translate(0,.06);ctx.rotate(.14)}
  else if(pose==='land'){ctx.scale(1.14,.8)}
  else if(pose==='hit'){ctx.rotate(-.3)}
  else{ctx.rotate(-.12);ctx.translate(0,Math.abs(Math.sin(ph*2))*.05)}
  ctx.scale(1,-1);
  ctx.drawImage(s.img,r[0],r[1],r[2],r[3],-w/2,-h*feet,w,h);
  ctx.restore();
}
spriteLoadAll();
