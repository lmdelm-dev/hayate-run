function cap(t){const w=$('#cap');w.textContent=t;w.classList.remove('pop');void w.offsetWidth;w.classList.add('pop')}
function envBadge(t){const w=$('#envb');w.textContent=t;w.classList.remove('pop');void w.offsetWidth;w.classList.add('pop')}
function setStyle(i){ST=STY[G.lock?G.lock-1:i];G.styT=1;const e=$('#sty');e.textContent=ST.n;e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')}

function onBeat(bi){
 if(bi<0)return;
 const sec=sectionOf(bi);
 if(bi===0){setStyle(0);setShot('chase',1);cap('疾風 RUN');return}
 if(sec==='intro'){
  if(bi===8){setShot('sideR',1);cap(WORDS[0])}
  if(bi===12)setShot('chase',1);
  if(bi===14)envCut();
  return}
 if(sec==='verse'){
  if(bi%8===0){const i=(bi-16)/8;setShot(SHOTSEQ[i%8],1);G.flash=.5;cap(WORDS[i%5])}
  if(bi>16&&bi%8===4)setShot('chase',0);
  if(bi>16&&(bi-16)%16===8)envCut();
  return}
 if(sec==='build'){
  if(bi===48){setStyle(2);setShot('close',1);G.tsT=.3;cap('時が止まる');wxForce('rain');G.dimT=.45;G.lxT=1.4}
  if(bi===52)setShot('face',1);
  if(bi===56){setShot('low',1);G.tsT=.45;cap('息を止めて')}
  if(bi===60){setStyle(3);setShot('high',1);G.tsT=.6}
  return}
 if(sec==='drop'){
  if(bi===64){setStyle(4);setShot('dutch',1);G.tsT=1.35;G.flash=1.6;G.shake=.6;G.next=Math.min(G.next,9);
   envCut();wxBurst();G.dimT=0;G.lxT=.3;wxForce(null);cap('POW!')}
  if(bi>64&&(bi-64)%4===0){const k=((bi-64)/4)%8;setStyle(STYSEQ[k]);setShot(DROPSHOTS[k],1);G.flash=.7;G.shake=.2;cap(ST.w)}
  if(bi>64&&(bi-64)%8===0)envCut();
  return}
 if(sec==='outro'){
  if(bi===112){setStyle(0);setShot('wide',1);G.tsT=1;envCut('outro');G.dimT=.15;G.lxT=1.2;wxForce(null);cap('また明日')}
  if(bi===116)setShot('sideR',1);
  if(bi===120)setShot('chase',1);
  if(bi===124)setShot('tight',1);
  return}}

const OPENINGS=[{id:'hayate-opening-1',name:'Hayate Run Opening',beats:128,
 sections:[
  {startBeat:0,endBeat:8,name:'Title',env:'auto',camera:'chase',weather:'theme',fx:['flash','title-card']},
  {startBeat:8,endBeat:16,name:'Intro',env:'auto',camera:'sideR',weather:'theme',fx:['speed-lines']},
  {startBeat:16,endBeat:48,name:'Verse',env:'auto-8',camera:'sequence',weather:'theme',fx:['speed-lines','captions']},
  {startBeat:48,endBeat:64,name:'Build-up',env:'hold',camera:'close-face-low',weather:'rain',fx:['slow-motion','dim','riser']},
  {startBeat:64,endBeat:112,name:'Chorus / Drop',env:'auto-4',camera:'montage',weather:'theme',fx:['flash','shake','burst','style-cuts']},
  {startBeat:112,endBeat:128,name:'Outro',env:'sunset-dusk',camera:'wide',weather:'theme',fx:['letterbox','title-card']}
 ]}];