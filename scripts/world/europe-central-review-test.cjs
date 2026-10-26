'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c),visible=require('./legacy-presentation.js').legacyStateVisible;
function shape(id,y){
 if(id.includes('-'))return h.mapAreasAt(y).find(a=>a.entry===id)?.polygons||[];
 const e=es.find(e=>e.id===id);if(!e||y<e.from||y>e.to||!visible(id,y))return[];
 return l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]];
}
// Coordinates are settlement controls independent of the polygon vertices.
const places={paris:[2.35,48.86],reims:[4.03,49.26],dijon:[5.04,47.32],tournai:[3.39,50.61],cambrai:[3.23,50.18],metz:[6.18,49.12],strasbourg:[7.75,48.58],aachen:[6.08,50.78],besancon:[6.02,47.24],geneva:[6.14,46.2],arles:[4.63,43.68],lyon:[4.84,45.76],grenoble:[5.72,45.19],almalyk:[80.45,43.84],almaty:[76.89,43.24],balasagun:[75.2,42.8],taldykorgan:[78.37,45.0],semey:[80.23,50.41],samarqand:[66.97,39.65]};
const controls=[];
for(const [id,y]of [['westFrancia',962],['franceMedieval',1000],['franceMedieval',1299],['late-france',1300]]){
 for(const site of ['paris','reims','dijon','tournai'])controls.push([id,y,site,true]);
 for(const site of ['cambrai','metz','strasbourg','besancon','geneva','arles','lyon'])controls.push([id,y,site,false]);
}
for(const site of ['aachen','metz','strasbourg','cambrai'])controls.push(['holyRoman',962,site,true]);
for(const site of ['geneva','besancon','arles','lyon'])controls.push(['holyRoman',1031,site,false],['review-burgundy',1031,site,true],['holyRoman',1032,site,true],['review-burgundy',1032,site,false]);
controls.push(['review-burgundy',1000,'dijon',false],['late-france',1311,'lyon',false],['late-france',1312,'lyon',true],['late-hre',1311,'lyon',true],['late-hre',1312,'lyon',false],['late-france',1348,'grenoble',false],['late-france',1349,'grenoble',true],['late-hre',1348,'grenoble',true],['late-hre',1349,'grenoble',false]);
for(const [id,y]of [['chagatai',1299],['late-chagatai',1346],['late-moghulistan',1347]])for(const site of ['almalyk','almaty','balasagun','taldykorgan'])controls.push([id,y,site,true]);
for(const [id,y]of [['goldenHorde',1299],['late-jochi',1347]]){controls.push([id,y,'semey',true]);for(const site of ['almalyk','almaty','balasagun','taldykorgan'])controls.push([id,y,site,false]);}
controls.push(['late-moghulistan',1347,'samarqand',false]);
for(const[id,y,site,want]of controls)assert.equal(G.covers(shape(id,y),places[site]),want,`${id}/${y}/${site}`);
let edges=0;const seen=new Set();
for(const[a,b,from,to]of [['westFrancia','eastFrancia',933,962],['westFrancia','holyRoman',962,987],['franceMedieval','holyRoman',987,1300],['franceMedieval','review-burgundy',987,1032],['holyRoman','review-burgundy',962,1032],['late-france','late-hre',1300,1454],['chagatai','goldenHorde',1260,1300],['late-chagatai','late-jochi',1300,1347],['late-moghulistan','late-jochi',1347,1454]])for(let y=from;y<to;y++){
 const A=shape(a,y),B=shape(b,y),key=a+b+JSON.stringify([A,B]);if(!A.length||!B.length||seen.has(key))continue;seen.add(key);
 assert(Math.abs(F.I(A,B).reduce((n,r)=>n+G.signed(r),0))<.0001,`Shared frontier ${a}/${b}/${y}`);edges++;
}
for(const [id,old]of [['late-france','franceMedieval'],['late-hre','holyRoman'],['late-chagatai','chagatai'],['late-jochi','goldenHorde']]){
 const A=shape(id,1300),B=shape(old,1299),area=p=>Math.abs(p.reduce((n,r)=>n+G.signed(r),0));
 // Coast clipping rounds at 1e-8 degrees. Compare occupied area, not ring
 // order or centimetre-level rounding in two independent build pipelines.
 assert(area(F.D(A,B))+area(F.D(B,A))<1e-6,`No source-file frontier jump ${id}`);
}
for(const id of ['westFrancia','franceMedieval'])for(const p of [[-.14,50.82],[-3.53,50.72],[1.31,51.13]])assert(!G.covers(shape(id,id==='westFrancia'?962:1299),p),'France must not cross the Channel '+id);
// Outside this review's date windows preserve the original extents.
const raw=require('./continuity.cjs').legacyData();
for(const id of ['eastFrancia','westFrancia'])assert.deepEqual(es.find(e=>e.id===id).keyframes[0].polys,raw.find(e=>e.id===id).keyframes[0].polys);
assert(!h.get('review-burgundy',932));assert(h.get('review-burgundy',933));assert(!h.get('review-burgundy',1032));
const tr=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));
for(const row of require('./europe-central-review.cjs').messages)for(const lang of ['en','ky'])assert.notEqual(tr(row[0],lang),row[0]);
for(const e of h.mapAreasAt(1000).filter(a=>a.entry==='review-burgundy'))assert(e.sources.every(s=>c.sources[s]));
assert.deepEqual(F.prepare(es),es);
console.log(JSON.stringify({pass:true,settlementControls:controls.length,distinctSharedEdges:edges,checks:'western kingdoms, Burgundy succession, Rhône transfers, Balkhash/Semirechye, 1299/1300 continuity, translations'}));
