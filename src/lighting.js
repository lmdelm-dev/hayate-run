function lightApply(e,amt){
 const L=e.light;if(!L||!L.amt||amt<=0)return;
 ctx.save();ctx.globalCompositeOperation=L.mode||'multiply';ctx.globalAlpha=L.amt*amt;ctx.fillStyle=L.tint;ctx.fillRect(0,0,W,H);ctx.restore()}
