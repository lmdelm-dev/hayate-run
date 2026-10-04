const SHOTS={
 chase:{ox:0,oy:3.4,oz:-7.5,la:9,fov:1,roll:0},
 tight:{ox:0,oy:2.2,oz:-5.2,la:6,fov:1.2,roll:0},
 sideR:{ox:6.5,oy:1.5,oz:-1.5,la:1,fov:1.15,roll:.07},
 sideL:{ox:-6.5,oy:1.5,oz:-1.5,la:1,fov:1.15,roll:-.07},
 high:{ox:0,oy:11,oz:-5,la:5,fov:.95,roll:0},
 low:{ox:-3.2,oy:.7,oz:-4,la:6,fov:1.35,roll:-.1},
 top:{ox:0,oy:15,oz:-3,la:5,fov:1.05,roll:0},
 close:{ox:.9,oy:2.6,oz:-3.6,la:7,fov:1.5,roll:0},
 wide:{ox:0,oy:6,oz:-16,la:10,fov:.8,roll:0},
 dutch:{ox:2,oy:1.8,oz:-3.4,la:3,fov:1.5,roll:.16},
 front:{ox:0,oy:2,oz:6.5,la:0,fov:1.25,roll:0},
 frontL:{ox:-4.5,oy:1.6,oz:5,la:-1,fov:1.2,roll:-.06},
 face:{ox:.6,oy:1.75,oz:-2.3,la:2.2,fov:1.8,roll:0}};
const WORDS=['駆け抜けろ！','風になれ','止まるな','未来へ','全力疾走！'];
const SHOTSEQ=['chase','sideR','tight','sideL','high','chase','close','dutch'];
const DROPSHOTS=['dutch','sideL','front','close','top','sideR','low','chase'];

function camEase(dt){const m=SHOTS[G.shot]||SHOTS.chase,k=G.cut?1:1-Math.exp(-dt*7);
 for(const key of['ox','oy','oz','la','fov','roll'])cam[key]+=(m[key]-cam[key])*k;
 if(G){cam.x=(G.px||0)*.7+cam.ox;cam.y=cam.oy+(G.pulse||0)*.08;cam.z=cam.oz}
 G.cut=0}
function setShot(name,hard){G.shot=name;if(hard)G.cut=1}
