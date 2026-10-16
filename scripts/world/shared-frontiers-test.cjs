'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=require('./core.js').createWorldHistory(c);
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),surface=m=>Math.abs(m.flat().reduce((n,r)=>n+G.signed(r),0));
let pairs=0,controls=0;const checked=new Set();
function disjoint(a,b,y){const A=at(a,y),B=at(b,y);if(!A||!B)return;const key=[A.geometryId,B.geometryId].sort().join('|');if(checked.has(key))return;checked.add(key);const area=surface(clip.intersection(G.multi(A.polygons),G.multi(B.polygons)));assert(area<.0001,`Shared frontier ${y} ${a}/${b}: ${area}`);pairs++;}
for(const [from,to,a,b]of [
 [1468,1502,'late-timurid','late-aqqoyunlu'],[1503,1506,'late-timurid','early-safavid'],[1507,1509,'early-shaybanid','early-safavid'],
 [1500,1506,'late-timurid','early-shaybanid'],[1503,1507,'early-safavid','late-aqqoyunlu'],
 [1846,1945,'1789-usa','1789-canada'],[1861,1864,'1789-usa','1914-confederacy'],[1821,1844,'1789-usa','1848-texas'],
 [1801,1945,'late-portugal','1789-spain'],[1866,1945,'late-france','1789-spain'],
 [1826,1945,'1815-norway','early-sweden'],[1826,1945,'1815-norway','1815-finland'],[1922,1945,'1815-norway','1939-ussr'],
 [1938,1945,'1815-paraguay','1815-upper-peru'],[1938,1945,'1815-paraguay','1789-rio-plata'],[1938,1945,'1815-upper-peru','1789-rio-plata'],
 [1919,1945,'1848-basotho','1914-south-africa'],[1636,1643,'late-mongol','1789-jurchen'],[1644,1690,'late-mongol','1789-qing'],
 [1876,1877,'1914-kashgar','1789-qing'],[1454,1546,'late-moscow','early-kazan'],[1547,1551,'early-russia','early-kazan'],
 [1918,1919,'1918-siberia','cartography-tuva'],[1918,1920,'1918-soviet-russia','1918-georgia']
])for(let y=from;y<=to;y++)disjoint(a,b,y);
for(const [id,y,p,want]of [
 ['early-safavid',1507,[50.88,34.64],true],['early-safavid',1507,[54.37,31.9],true],['early-safavid',1507,[59.61,36.3],false],
 ['early-shaybanid',1507,[62.2,34.35],true],['early-safavid',1510,[62.2,34.35],true],
 ['1789-usa',1862,[-77.44,37.54],false],['1914-confederacy',1862,[-77.44,37.54],true],['1789-usa',1862,[-77.04,38.91],true],
 ['1914-confederacy',1862,[-81.63,38.35],true],['1914-confederacy',1863,[-81.63,38.35],false],['1789-usa',1863,[-81.63,38.35],true],
 ['1789-usa',1867,[-150,64],true],['1789-usa',1866,[-150,64],false],['1789-canada',1920,[-56,49],false],
 ['1815-norway',1942,[10.75,59.91],true],['1815-finland',1942,[10.75,59.91],false],
 ['early-kazan',1551,[49.12,55.79],true],['early-russia',1551,[49.12,55.79],false],['early-russia',1552,[49.12,55.79],true],
 ['late-mongol',1650,[106.91,47.92],true],['late-mongol',1650,[111.65,40.82],false],
 ['1914-kashgar',1877,[79.92,37.12],true],['1914-kashgar',1877,[87.62,43.82],false],
 ['1848-basotho',1942,[27.48,-29.31],true],['1914-south-africa',1942,[27.48,-29.31],false]
]){assert.equal(Boolean(at(id,y)&&G.covers(at(id,y).polygons,p)),want,`Control ${id} ${y} ${p}`);controls++;}
// The eastern neutral zone is deliberately outside the reviewed Uqair section.
const uqair=G.union([[[39.2346,29],[43.7,29],[43.7,32.3],[39.2346,32.3]]]);
for(let y=1926;y<=1945;y++){
 const iraq=at('1939-iraq',y),saudi=at('1789-diriyah',y);
 assert(iraq&&saudi,'Uqair owners missing '+y);
 assert(surface(clip.intersection(G.multi(iraq.polygons),G.multi(saudi.polygons),G.multi(uqair)))<.0001,'Uqair western overlap '+y);
}
for(const r of c.cartography.frontierRelations){
 assert(c.sources[r.source],'Missing relationship source');
 for(let y=r.from;y<r.to;y++){const a=at(r.member,y),owner=at(r.owner,y);if(!a||!owner)continue;assert.equal(a.sovereign||a.overlord,r.owner,`Dated owner ${r.member} ${y}`);assert(a.from<=y&&y<a.to);assert(a.from>=r.from&&a.to<=r.to,'Relationship interval escaped');}
 assert(h.changes().includes(r.from));
}
assert.equal(at('1848-texas',1862).sovereign,'1914-confederacy');
assert.equal(at('1918-georgia',1921).relationship,'association');assert(!at('1918-georgia',1920).overlord);
assert.equal(at('late-hre',1866).cartographicOverlay,'association');assert(!at('late-hre',1867).cartographicOverlay);
assert.equal(at('1789-dzungar',1755).cartographicOverlay,'resistance');assert(!at('1789-dzungar',1754).cartographicOverlay);
for(const r of c.sharedFrontiers.frames)assert(c.sources[r.source],'Missing geometry source '+r.id);
// Splitting a long frame is allowed only to express a reviewed boundary date.
// Its narrative and original geographic record must remain independently
// recoverable; approved added source IDs do not excuse other silent changes.
const raw=require('./catalog.cjs'),byId=new Map(raw.areas.map(a=>[a.id,a]));
const approvedSources=new Set(c.sharedFrontiers.frames.map(f=>f.source));
assert.equal(c.mediterraneanReview.version,1);
approvedSources.add('maghrebDependence');
// The 1.25 historical review intentionally changes these two profiles.
// Its dedicated test independently checks cities, dependency dates and shared
// geometry; every other original field and unrelated record stays protected.
for(const a of c.areas.filter(a=>a.from<2011&&!a.frontierAdded)){
 const old=byId.get(a.id==='zirid-1048'?'zirid-1014':a.id.split('-edge-')[0]);assert(old,'Unrecorded historical frame '+a.id);
 assert(a.from>=old.from&&a.to<=old.to,'Split extends original dates '+a.id);
 const reviewed=a.entry==='zirid'?['color','text','points','polygons']:a.entry==='hammadid'?['points','polygons']:[];
 for(const key of Object.keys(old).filter(k=>!['id','from','to','sources',...reviewed].includes(k)))assert.deepEqual(a[key],old[key],'Changed original field '+a.id+' '+key);
 for(const id of old.sources)assert(a.sources.includes(id),'Lost source '+a.id);
 for(const id of a.sources)assert(old.sources.includes(id)||approvedSources.has(id),'Unreviewed source '+id);
}
const {legacyStateVisible}=require('./legacy-presentation.js');
for(const [id,y]of [['earlyIslam',632],['rashidun',661],['umayyad',750],['tang',907],['northernSong',1127],['nicaea',1261]]){assert(legacyStateVisible(id,y-1));assert(!legacyStateVisible(id,y));}
assert(html.includes('EMPIRES.filter(e=>legacyStateVisible(e.id,y))'),'Delivered succession filter missing');
assert(html.includes('p.dataset.empireType=emp.legacyContext?"context":emp.type'),'Early state mask metadata missing');
const runtime=fs.readFileSync('scripts/world/territory-runtime.js','utf8');assert(runtime.includes('if(tint)g.append(tint)'));assert(runtime.includes('worldContextFill'));assert(runtime.includes("Boolean(a.overlord)"));
console.log(JSON.stringify({pass:true,pairs,controls,reviewedFrames:c.sharedFrontiers.frames.length,relationships:c.cartography.frontierRelations.length,checks:'dated shared edges, cities, losing-side retreat, owner intervals, legacy successions, context and occupation rendering'}));
