'use strict';
// Behavioural guards for the first extension beyond 1299. Generic catalogue
// schema, translation coverage and SVG rendering are tested by the world suites.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const catalog=require('../world/catalog.cjs');
const {createWorldHistory}=require('../world/core.js');
const history=createWorldHistory(catalog);
const payloadMatch=html.match(/const WORLD_HISTORY=(.*);/);
assert(payloadMatch,'Build the atlas before running the late-period checks');
const delivered=JSON.parse(payloadMatch[1]);
const publishedHistory=createWorldHistory(delivered);
const MIN=610,MAX=1453;
assert.equal(catalog.range.min,MIN);assert(catalog.range.max>=MAX);
assert.deepEqual(delivered.range,catalog.range,'The built atlas has stale year limits');
assert.deepEqual(delivered.entries,catalog.entries,'The built profile text or phases are stale');
assert.deepEqual(delivered.areas,catalog.areas,'The built territorial geometry or text is stale');
const rangeTag=html.match(/<input\b[^>]*\bid="yearRange"[^>]*>/)?.[0];
assert(rangeTag,'Missing main timeline');
assert.equal(rangeTag.match(/\bmin="(\d+)"/)?.[1],String(MIN));
assert.equal(rangeTag.match(/\bmax="(\d+)"/)?.[1],String(catalog.range.max));
assert(html.includes('const TIMELINE_MIN=610,TIMELINE_MAX='+catalog.range.max+';'));

const territory=(id,y)=>history.areasAt(y).find(a=>a.entry===id);
const active=(id,y)=>history.get(id,y);
const event=id=>{const e=catalog.events.find(e=>e.id===id);assert(e,'Missing milestone '+id);return e;};
const present=(id,y)=>{assert(active(id,y),id+' must be present in '+y);assert(territory(id,y),id+' needs a mapped area in '+y);};
const absent=(id,y)=>{assert(!active(id,y),id+' persists in '+y);assert(!territory(id,y),id+' leaves a stale map area in '+y);};
const ids=items=>items.map(x=>x.entry.id).sort();

// A newly built page must agree with the source catalogue throughout the added
// interval, not just at its two endpoints. Detect stale builds and orphan areas.
for(let y=1300;y<=MAX;y++){
 const live=history.at(y),areaRows=history.areasAt(y);
 for(const a of areaRows)assert(active(a.entry,y),a.id+' has no society in '+y);
 assert.deepEqual(ids(publishedHistory.at(y)),ids(live),'Built profile selection differs in '+y);
 assert.deepEqual(publishedHistory.areasAt(y).map(a=>a.id).sort(),areaRows.map(a=>a.id).sort(),'Built territory selection differs in '+y);
}
const milestones=history.timeline().filter(e=>e.record==='event'&&e.from>=1300&&e.from<=MAX);
assert(milestones.every(e=>e.year>=1300&&e.year<=MAX));
assert(milestones.some(e=>e.id==='late-constantinople-1453'&&e.year===1453),'Final year is missing from the chronology');

// Eurasian transitions: the Yuan court survives in Mongolia, not as the same
// Chinese dynasty indefinitely; the Ilkhanate fragments rather than remaining.
present('late-yuan',1367);absent('late-yuan',1368);
absent('late-ming',1367);present('late-ming',1368);present('late-ming',1453);
present('late-mongol',1368);present('late-mongol',1453);
assert.equal(event('late-ming-1368').from,1368);
present('late-ilkhan',1334);absent('late-ilkhan',1335);
present('late-iran-successors',1335);assert.equal(event('late-ilkhan-1335').from,1335);
present('late-rum',1452);absent('late-rum',1453);
present('late-morea',1453);present('late-ottoman',1453);
assert.equal(event('late-constantinople-1453').from,1453);
assert.notDeepEqual(territory('late-ottoman',1452).polygons,territory('late-ottoman',1453).polygons,'The conquest never changes Ottoman territory');
// The dated shape must tell the same story as its text. These specific places
// guard against back-projecting later conquests into earlier schematic frames.
function contains(ring,[x,y]){
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [xi,yi]=ring[i],[xj,yj]=ring[j];
  if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
 }
 return inside;
}
const covers=(id,y,point)=>territory(id,y).polygons.some(ring=>contains(ring,point));
const constantinople=[28.97,41.01],kunming=[102.71,25.04],herat=[62.20,34.35];
for(let y=1300;y<1453;y++)assert(!covers('late-ottoman',y,constantinople),'Ottoman colour reaches Constantinople before 1453: '+y);
assert(covers('late-ottoman',1453,constantinople),'Constantinople remains outside the conquest frame');
assert(covers('late-rum',1452,constantinople),'The final Roman frame loses its capital too early');
for(let y=1368;y<1382;y++)assert(!covers('late-ming',y,kunming),'Ming Yunnan is back-projected into '+y);
for(let y=1382;y<=MAX;y++)assert(covers('late-ming',y,kunming),'Ming Yunnan is absent in '+y);
for(let y=1368;y<=MAX;y++)for(const [place,point] of [
 ['Lhasa',[91.13,29.65]],['Ulaanbaatar',[106.92,47.92]],['Taipei',[121.57,25.03]]
])assert(!covers('late-ming',y,point),place+' is silently incorporated into Ming territory in '+y);
assert(!covers('late-timurid',1380,herat),'Timurid Herat appears before its conquest');
assert(covers('late-timurid',1381,herat),'The Herat conquest never changes the map');
// Korea and Vietnam cannot retain their previous rulers across the new dates.
present('korea',1391);absent('korea',1392);present('late-joseon',1392);
assert.equal(active('late-daiviet',1428).phase.from,1428);

// American state-building has its own dated changes; a fifteenth-century empire
// must not be back-projected onto the thirteenth-century map.
absent('tenochtitlan',1324);present('tenochtitlan',1325);
assert.equal(event('tenochtitlan-foundation').from,1325);
assert.equal(event('tenochtitlan-foundation').approx,true,'The conventional foundation date must retain its qualification');
assert.equal(territory('tenochtitlan',1427).kind,'settlement');
assert.equal(territory('tenochtitlan',1428).kind,'influence');
assert.notDeepEqual(territory('tenochtitlan',1427).polygons,territory('tenochtitlan',1428).polygons);
assert.equal(event('triple-alliance').from,1428);
assert.equal(active('cusco-inca',1437).phase.from,1300);
assert.equal(active('cusco-inca',1438).phase.from,1438);
assert.equal(event('pachacuti-accession').from,1438);
assert.equal(event('pachacuti-accession').approx,true,'Pachacuti’s conventional accession is not an exact archaeological date');
assert.notDeepEqual(territory('cusco-inca',1437).polygons,territory('cusco-inca',1438).polygons);
present('cahokia',1399);absent('cahokia',1400);present('mississippian',1453);
present('mayapan',1449);absent('mayapan',1450);present('yucatan-late',1450);
present('hohokam',1449);absent('hohokam',1450);present('sonoran-communities',1450);

// Abandoning a particular settlement is not the disappearance of a continent's
// population. The Greenland record of 1408 is not a universal extinction date.
present('norse',1408);present('norse',1409);absent('norse',1453);
present('thule',1300);present('thule',1453);
assert.equal(event('late-norse-record').from,1408);
assert(territory('norse',1349).polygons.length>territory('norse',1350).polygons.length,'Western Settlement must disappear separately');
for(const y of [1300,1400,1453]){
 for(const id of ['budj','kakadu','kuk','mabuyag']){
  present(id,y);assert.equal(active(id,y).entry.kind,'landscape');assert.equal(territory(id,y).kind,'landscape');
 }
 for(const id of ['samoa','eastpolynesia','rapanui','hawaii','aotearoa'])assert.equal(territory(id,y).kind,'settlement',id+' has become a fictitious continent-wide state');
 assert.equal(territory('antarctica',y).kind,'uninhabited');
 assert.equal(territory('nanmadol',y).kind,'polity');
 assert.equal(territory('tonga',y).kind,'polity');
 assert(['settlement','cultural'].includes(territory('thule',y).kind));
}

// African occupation and continuity regressions: no double sovereign colours,
// no frozen old capital, and no artificial seams inside one Maghreb state.
present('zayyanid',1336);absent('zayyanid',1337);present('zayyanid',1348);
present('hafsid',1346);absent('hafsid',1347);present('hafsid',1348);
assert.equal(territory('marinid',1347).polygons.length,1,'One Marinid state should not have artificial internal seams');
present('kanem',1384);present('kanem',1385);present('bornu-late',1385);
present('dongola',1364);assert.equal(territory('dongola',1364).kind,'settlement');
present('djenne',1399);absent('djenne',1400);present('djenne-late',1400);

// Execute the actual legacy selection function from the built atlas. It must
// return no old empire at any new year, in both united and detailed Mongol modes.
function extractFunction(name){
 const start=html.indexOf('function '+name+'(');
 assert(start>=0,'Missing production function '+name);
 for(let end=html.indexOf('}',start);end>=0;end=html.indexOf('}',end+1)){
  const code=html.slice(start,end+1);
  try{new vm.Script('('+code+')');return code;}catch{}
 }
 throw Error('Unable to extract '+name);
}
const oldContext=vm.createContext({});
const oldStart=html.indexOf('const S ='),oldEnd=html.indexOf('function resampleRing');
assert(oldStart>=0&&oldEnd>oldStart,'Missing original empire dataset');
vm.runInContext(html.slice(oldStart,oldEnd)+extractFunction('frameFor')+';globalThis.legacy={displayEmpiresForYear};',oldContext);
for(const detailed of [false,true]){
 vm.runInContext('showMongolUluses='+detailed,oldContext);
 assert(oldContext.legacy.displayEmpiresForYear(1299).length>0,'Legacy atlas unexpectedly lost its last year');
 for(let y=1300;y<=MAX;y++)assert.equal(oldContext.legacy.displayEmpiresForYear(y).length,0,'Legacy territories leak into '+y);
}

// The sidebar must use late data, rather than repeating the 1299 Osman event.
const hookCalls=[];
const hooks=vm.createContext({
 EVENTS:{1299:{title:'1299 sentinel'}},
 lateEventHook:y=>({title:'late '+y,year:y}),
 lateSideHook:(y,e)=>hookCalls.push([y,e.year]),
 $(){throw Error('New-year sidebar fell through to original-period content');}
});
vm.runInContext(extractFunction('activeEvent')+'\n'+extractFunction('renderSide')+';globalThis.hooks={activeEvent,renderSide};',hooks);
assert.equal(hooks.hooks.activeEvent(1299).title,'1299 sentinel');
for(let y=1300;y<=MAX;y++){const e=hooks.hooks.activeEvent(y);assert.equal(e.year,y);hooks.hooks.renderSide(y,e);}
assert.equal(hookCalls.length,154);

// Check the delivered date/filter behaviour, not only the biographies source.
const starStart=html.indexOf('const ISLAM_STARS = ['),starEnd=html.indexOf('const STAR_DETAILS=');
assert(starStart>=0&&starEnd>starStart,'Missing delivered contemporaries');
const starContext=vm.createContext({});
vm.runInContext(html.slice(starStart,starEnd)+extractFunction('starsByGroupForYear')+extractFunction('starDates')+';globalThis.stars={people:ISLAM_STARS,living:starsByGroupForYear,dates:starDates};',starContext);
const stars=starContext.stars;
assert.equal(stars.people.length,64+require('../early/biographies.cjs').length+require('../to1789/biographies.cjs').length,'The release must retain the original and all added biography sets');
const approvedPeople=[
 ['Ибн Каййим аль-Джаузия',1292,1350],['Ибн Касир',1301,1373],
 ['Ибн Халдун',1332,1406],['аль-Макризи',1364,1442],
 ['Ибн Хаджар аль-Аскаляни',1372,1449],['ас-Сахави',1428,1497],['ас-Суюти',1445,1505]
];
const lives=(name,y)=>stars.living(y).some(g=>g.items.some(p=>p.name===name));
for(const [name,birth,death] of approvedPeople){
 const p=stars.people.find(p=>p.name===name);assert(p,'Missing new biography '+name);
 assert.equal(p.birth,birth,name+' birth');assert.equal(p.death,death,name+' death');
 assert(!lives(name,birth-1),name+' appears before birth');assert(lives(name,birth),name+' absent in birth year');
 assert(lives(name,death),name+' absent in death year');assert(!lives(name,death+1),name+' appears after death');
 assert(stars.dates(p).includes(birth+'–'+death+' ('),name+' must display Gregorian life dates first');
 assert(/г\. х\./.test(stars.dates(p)),name+' is missing parenthesised Hijri dates');
}
assert(lives('ас-Суюти',1453),'The final atlas year must include the young al-Suyuti');
assert(!lives('Ибн Таймия',1329),'A previously included scholar must still disappear after death');

console.log('PASS: 610–1453 bounds; all 154 added years agree with the built atlas; dated Eurasian, American, African and Arctic transitions; Oceanic settlement types; no legacy empire/sidebar leakage; retained contemporaries with verified life-date boundaries.');
