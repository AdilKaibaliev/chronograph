'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const visible=require('./legacy-presentation.js').legacyStateVisible;
function shape(id,y){const e=es.find(e=>e.id===id);if(y<e.from||y>e.to||!visible(id,y))return[];return l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]];}
// Independent place coordinates. Positive and negative controls prevent a
// geometrically neat subtraction from silently losing the correct ruler.
const sites={ankara:[32.85,39.93],nicaea:[29.72,40.43],konya:[32.49,37.87],trabzon:[39.72,41.00],baghdad:[44.36,33.31],isfahan:[51.67,32.65],ani:[43.57,40.51],antioch:[36.16,36.20],bursa:[29.06,40.19],smyrna:[27.14,38.42],nicomedia:[29.92,40.77],constantinople:[28.98,41.01],chalcedon:[29.03,40.99],adramyttion:[26.94,39.51]};
const controls=[
 ['greatSeljuk',1071,'ankara',false],['greatSeljuk',1092,'ankara',false],['greatSeljuk',1141,'ankara',false],
 ['greatSeljuk',1071,'nicaea',false],['greatSeljuk',1092,'konya',false],['greatSeljuk',1092,'trabzon',false],
 ['greatSeljuk',1092,'baghdad',true],['greatSeljuk',1092,'isfahan',true],['greatSeljuk',1092,'ani',true],['greatSeljuk',1092,'antioch',true],
 ['medievalByzantine',1071,'ankara',true],['medievalByzantine',1097,'nicaea',true],
 ['rumSeljuk',1096,'nicaea',true],['rumSeljuk',1097,'nicaea',false],['rumSeljuk',1299,'nicaea',false],['rumSeljuk',1299,'bursa',false],['rumSeljuk',1299,'konya',true],
 ['nicaea',1204,'nicaea',true],['nicaea',1214,'nicaea',true],['nicaea',1235,'nicaea',true],
 ['nicaea',1214,'bursa',true],['latinEmpire',1214,'bursa',false],['nicaea',1214,'smyrna',true],
 ['latinEmpire',1214,'adramyttion',true],['nicaea',1214,'adramyttion',false],['latinEmpire',1225,'adramyttion',false],['nicaea',1225,'adramyttion',true],
 ['latinEmpire',1234,'nicomedia',true],['nicaea',1234,'nicomedia',false],['latinEmpire',1235,'nicomedia',false],['nicaea',1235,'nicomedia',true],
 ['latinEmpire',1235,'constantinople',true],['nicaea',1235,'constantinople',false],['latinEmpire',1235,'chalcedon',false],['nicaea',1235,'chalcedon',true],
 ['nicaea',1261,'nicaea',false],['latinEmpire',1261,'constantinople',false]
];
for(const[id,y,city,want]of controls){
 const p=sites[city],out=shape(id,y);let found=G.covers(out,p);
 // The 1:50m land mask omits the tips of the two urban peninsulas beside
 // the Bosporus. Require the exact location in the historical source extent
 // AND delivered land within 3 km, rather than moving the city to pass a test.
 if(want&&!found&&['constantinople','chalcedon'].includes(city)){
  const raw=es.find(e=>e.id===id).keyframes.filter(f=>f.year<=y).at(-1).polys;
  assert(G.covers(raw,p),`Historical city extent ${id}/${city}`);
  found=[-.025,0,.025].some(dx=>[-.015,0,.015].some(dy=>G.covers(out,[p[0]+dx,p[1]+dy])));
 }
 assert.equal(found,want,`${id}/${y}/${city}`);
}
let edges=0;const seen=new Set();
for(const[a,b,from,to]of [['greatSeljuk','medievalByzantine',1071,1194],['greatSeljuk','rumSeljuk',1077,1194],['latinEmpire','nicaea',1204,1261],['nicaea','rumSeljuk',1204,1243]])for(let y=from;y<to;y++){
 const A=shape(a,y),B=shape(b,y),k=a+b+JSON.stringify([A,B]);if(seen.has(k))continue;seen.add(k);
 assert(Math.abs(F.I(A,B).reduce((s,r)=>s+G.signed(r),0))<.0001,`Shared edge ${a}/${b}/${y}`);edges++;
}
assert.deepEqual(shape('rumSeljuk',1298),shape('rumSeljuk',1299),'No revival of lost territories in the final early frame');
assert.deepEqual(F.prepare(es),es);
const translate=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));
for(const row of require('./anatolian-review.cjs').messages)for(const lang of ['en','ky'])assert.notEqual(translate(row[0],lang),row[0],`Translation ${lang}/${row[0]}`);
console.log(JSON.stringify({pass:true,settlementControls:controls.length,sharedEdges:edges,scope:'Anatolian frontiers; not a complete reconstruction of all regional principalities or Balkan acquisitions.'}));
