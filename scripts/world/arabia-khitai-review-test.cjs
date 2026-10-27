'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const at=(id,y)=>l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]];
const places={medina:[39.61,24.47],mecca:[39.83,21.42],badr:[38.79,23.78],khaybar:[39.29,25.7],damascus:[36.3,33.51],amman:[35.93,31.95],sanaa:[44.21,15.35],aksum:[38.72,14.13],adulis:[39.66,15.26],cartagena:[-.98,37.6],cordoba:[-4.78,37.89],tunis:[10.18,36.8],urgench:[59.16,42.32],samarqand:[66.97,39.65],balasagun:[75.2,42.8],nishapur:[58.8,36.21]};
const controls=[];
for(const y of [622,624,625,627,628,629,630,631]){controls.push(['earlyIslam',y,'medina',true],['earlyIslam',y,'mecca',y>=630],['earlyIslam',y,'damascus',false]);}
controls.push(['earlyIslam',624,'badr',true],['earlyIslam',627,'khaybar',false],['earlyIslam',628,'khaybar',true],['rashidun',632,'amman',false],['rashidun',632,'medina',true]);
for(const y of [610,628,632])for(const [site,want]of [['sanaa',false],['aksum',true],['adulis',true]])controls.push(['aksum',y,site,want]);
for(const y of [625,628,630,632])controls.push(['byzantine',y,'cartagena',false],['byzantine',y,'tunis',true],['visigoths',y,'cartagena',true],['visigoths',y,'cordoba',true],['visigoths',y,'tunis',false]);
for(const y of [1157,1187,1194,1200])controls.push(['karaKhitai',y,'urgench',false],['khwarazmian',y,'urgench',true],['karaKhitai',y,'samarqand',true],['karaKhitai',y,'balasagun',true],['karaKhitai',y,'nishapur',false]);
for(const[id,y,site,want]of controls)assert.equal(G.covers(at(id,y),places[site]),want,`${id}/${y}/${site}`);
const seen=new Set();let edges=0;
for(const[a,b,from,to]of [['aksum','earlyIslam',622,632],['aksum','rashidun',632,633],['byzantine','visigoths',625,633],['karaKhitai','khwarazmian',1141,1210]])for(let y=from;y<to;y++){
 const A=at(a,y),B=at(b,y),key=a+b+JSON.stringify([A,B]);if(seen.has(key))continue;seen.add(key);const overlap=F.I(A,B);assert(Math.abs(overlap.reduce((s,r)=>s+G.signed(r),0))<.0001,`${a}/${b}/${y}`);edges++;
}
const tr=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));for(const row of require('./arabia-khitai-review.cjs').messages)for(const lang of ['en','ky'])assert.notEqual(tr(row[0],lang),row[0]);
console.log(JSON.stringify({pass:true,settlementControls:controls.length,sharedEdges:edges,checks:'Medina/Mecca chronology, Khaybar, Red Sea shores, Spania after 625, Khwarazm administration and tribute, translations'}));
