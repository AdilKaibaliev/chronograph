'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]);
const l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([\s\S]*?);\n/)[1]);
const empires=require('./continuity.cjs').legacyData();
assert.deepEqual(c.cartography.outlinePolicy.profiles,[...new Set(c.areas.map(a=>a.entry))].sort(),'A territory bypasses the common policy');
assert.equal(c.cartography.outlinePolicy.frames.length,c.areas.length);
assert.deepEqual(l.outlinePolicy.profiles,empires.map(e=>e.id).sort(),'An early polity bypasses the common policy');
const shape=(id,y)=>l.shapes[l.frames[id].filter(r=>r[0]<=y).at(-1)[1]];
const points=[
 [1217,[75.99,39.47],false,'Kashgar before Karakhitai conquest'],[1218,[75.99,39.47],true,'Kashgar'],
 [1218,[82.97,41.72],true,'Kucha'],[1218,[89.2,42.95],true,'Turfan'],
 [1221,[64.42,39.77],true,'Bukhara'],[1221,[66.97,39.65],true,'Samarkand'],
 [1226,[106.27,38.47],false,'Xia before final conquest'],[1227,[106.27,38.47],true,'Xia'],
 [1231,[114.31,34.8],false,'Jin before conquest'],[1234,[114.31,34.8],true,'Kaifeng'],
 [1242,[48.04,46.35],true,'Lower Volga'],[1242,[79,47],true,'Eastern steppe'],
 [1252,[100.23,25.6],false,'Dali before conquest'],[1253,[100.23,25.6],true,'Dali'],
 [1257,[44.36,33.31],false,'Baghdad before conquest'],[1258,[44.36,33.31],true,'Baghdad'],
 [1260,[78,39],true,'Tarim'],[1260,[97.5,41],true,'Hexi corridor'],
 [1279,[113.26,23.13],true,'Guangzhou'],[1279,[119.3,26.08],true,'Fuzhou'],
 [1279,[110.3,19.9],true,'Hainan'],[1279,[47.78,30.5],true,'Basra']
];
for(const[y,p,want,name]of points)assert.equal(G.covers(shape('mongolRealm',y),p),want,name+' '+y);
for(const y of [1242,1258,1279,1299])for(const p of [[31.24,30.04],[139.7,35.7],[77.2,28.6],[105.84,21.03],[158.6,53],[100,65]])assert(!G.covers(shape('mongolRealm',y),p),'Mongol annexation of unconquered country '+y+' '+p);
// One continuous mainland, without forcing island or overseas possessions together.
const main=G.multi(shape('mongolRealm',1279)).find(p=>G.covers(p,[106.9,47.9]));
for(const p of [[66.97,39.65],[75.99,39.47],[89.2,42.95],[106.27,38.47],[116.4,39.9],[113.26,23.13]])assert(G.covers(main,p),'Artificial mainland break '+p);
const h=require('./core.js').createWorldHistory(c);
const m1300=h.mapAreasAt(1300).find(a=>a.entry==='late-yuan').mongolUnion;
assert.deepEqual(m1300,shape('mongolRealm',1299),'Mongol geometry jumps at timeline boundary');
assert(c.displayCartography.land.length>1000,'Detailed physical coastline missing');
assert(html.includes("countryLayer.setAttribute('clip-path','url(#worldLandClip)')"));
assert(!html.includes('.unified-mongol{stroke:none!important}'),'Outer Mongol border hidden');
const oldPath='.local-checks/universal-borders-before.json';
let changed=0;
if(fs.existsSync(oldPath)){
 const old=JSON.parse(fs.readFileSync(oldPath));
 for(const key of ['areas','entries','events'])assert.deepEqual(require('./catalog.cjs')[key],old[key],'Unrelated historical data changed');
 const oldDisplayFile='.local-checks/universal-display-before.json';
 if(fs.existsSync(oldDisplayFile)){const before=JSON.parse(fs.readFileSync(oldDisplayFile));changed=c.areas.filter(a=>JSON.stringify(before.shapes[before.areas[a.id]])!==JSON.stringify(c.displayCartography.shapes[c.displayCartography.areas[a.id]])).length;}
}
console.log(JSON.stringify({pass:true,worldProfiles:c.cartography.outlinePolicy.profiles.length,earlyPolities:l.outlinePolicy.profiles.length,worldFrames:c.areas.length,changedAreaFrames:changed,controls:points.length+24+6,checks:'universal policy, conquest dates, shared frontiers, one Mongol mainland, unchanged 1299/1300, physical base, archived narratives'}));
