'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');
const c=require('../world/catalog.cjs');
const {createWorldHistory}=require('../world/core.js');
const h=createWorldHistory(c);
const html=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const delivered=JSON.parse(html.match(/const WORLD_HISTORY=(.*);/)[1]);
const dh=createWorldHistory(delivered);
assert.equal(c.range.min,610);assert(c.range.max>=1600);
assert.deepEqual(delivered.range,c.range);
assert.deepEqual(delivered.entries,c.entries);
assert.deepEqual(delivered.areas,c.areas);
assert(html.includes('const TIMELINE_MIN=610,TIMELINE_MAX='+c.range.max+';'));
for(const id of ['yearRange','worldYearInput'])assert(new RegExp('id="'+id+'"[^>]*max="'+c.range.max+'"').test(html),'Unreachable new years in '+id);
assert(html.includes("'XIV','XV','XVI'"),'Sixteenth-century filter is unavailable');
// Playback must actually visit the new milestones instead of stepping over
// one-year events with the old fixed five-year increments.
const playContext=vm.createContext({TIMELINE_MAX:1600,worldHistory:dh,WORLD_HISTORY:delivered});
vm.runInContext(html.match(/const KEY_YEARS=\[[^;]+;/)[0]+html.match(/worldPlaybackYears=\[\.\.\.new Set[^;]+;/)[0]+html.match(/function nextPlaybackYear\(y\)\{[\s\S]*?\n\}/)[0]+';globalThis.next=nextPlaybackYear;',playContext);
const visited=new Set([1453]);let playback=1453;
while(playback<1600){const next=playContext.next(playback);assert(next>playback&&next<=1600);visited.add(next);playback=next;}
for(const e of c.events.filter(e=>e.from>=1454&&e.from<=1600))assert(visited.has(e.from),'Playback skips '+e.id+' in '+e.from);

// Baseline refreshed after the explicit 1300 continuity correction; its changed
// contours and end dates are independently guarded by continuity-test.cjs.
// This guards historical phases and map outlines against accidental rewriting
// while continuations are attached to the same entry IDs.
const old={entries:c.entries.map(e=>({id:e.id,region:e.region,kind:e.kind,coord:e.coord,name:e.name,phases:e.phases.filter(p=>p.from<1454)})).filter(e=>e.phases.length),areas:c.areas.filter(a=>a.from<1454)};
assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),'0cc4a875d45722eb1833723895ef76dd40383b9d73996159691b4b3b566cc160','Reviewed continuity baseline changed');

for(let y=1454;y<=1600;y++){
 const profiles=h.at(y),areas=h.areasAt(y);
 assert.deepEqual(dh.at(y).map(x=>x.entry.id),profiles.map(x=>x.entry.id),'Stale profile selection '+y);
 assert.deepEqual(dh.areasAt(y).map(x=>x.id),areas.map(x=>x.id),'Stale map selection '+y);
 for(const a of areas)assert(h.get(a.entry,y),'Orphan territory '+a.id+' in '+y);
 for(const region of c.regions)assert(profiles.some(x=>x.entry.region===region.id),'Empty region '+region.id+' in '+y);
 for(const id of ['budj','kakadu','kuk','mabuyag'])assert.equal(areas.find(a=>a.entry===id)?.kind,'landscape',id+' changed into a fictitious continent-wide state');
 assert.equal(areas.find(a=>a.entry==='antarctica')?.kind,'uninhabited');
 assert(h.get('thule',y),'Inuit continuity lost');assert(!h.get('norse',y),'Extinct Norse settlements reappear');
}
const area=(id,y)=>h.areasAt(y).find(a=>a.entry===id);
const present=(id,y)=>{assert(h.get(id,y),id+' missing in '+y);assert(area(id,y),id+' has no map area in '+y);};
const absent=(id,y)=>{assert(!h.get(id,y),id+' has an anachronistic profile in '+y);assert(!area(id,y),id+' leaves a stale territory in '+y);};
function contains(ring,[x,y]){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
const covers=(id,y,point)=>area(id,y)?.polygons.some(r=>contains(r,point))||false;
for(const [id,y] of [
 ['early-timbuktu-1468',1468],['early-granada-1492',1492],['early-guanahani-1492',1492],['early-safavid-1501',1501],
 ['early-cairo-1517',1517],['early-tenochtitlan-1521',1521],['early-panipat-1526',1526],['early-cusco-1533',1533],
 ['early-kazan-1552',1552],['early-vilcabamba-1572',1572],['early-tondibi-1591',1591],['early-sekigahara-1600',1600]
])assert.equal(c.events.find(e=>e.id===id)?.from,y,'Missing dated navigation milestone '+id);

// American contact, conquest and surviving indigenous centres are separate.
present('tenochtitlan',1520);absent('tenochtitlan',1521);
present('early-new-spain',1521);
const mexico=[-99.13,19.43],cusco=[-71.97,-13.52];
assert(!covers('early-new-spain',1520,mexico));assert(covers('early-new-spain',1521,mexico));
assert(!covers('early-peru',1532,cusco));for(let y=1533;y<=1600;y++)assert(covers('early-peru',y,cusco),'Conquered Cusco disappears in '+y);
present('early-vilcabamba',1571);absent('early-vilcabamba',1572);
absent('early-portuguese-brazil',1500);present('early-portuguese-brazil',1532);
present('early-itza',1600);present('early-haudenosaunee',1600);
// African dynastic and provincial transitions must move the corresponding map.
const cairo=[31.24,30.04],damascus=[36.29,33.51],timbuktu=[-3.01,16.77];
assert(!covers('early-ottoman-egypt-sham',1515,damascus));assert(covers('early-ottoman-egypt-sham',1516,damascus));
assert(!covers('early-ottoman-egypt-sham',1516,cairo));assert(covers('early-ottoman-egypt-sham',1517,cairo));
present('mamluk-late',1516);absent('mamluk-late',1517);
assert(!covers('gao',1467,timbuktu));assert(covers('gao',1468,timbuktu));assert(!covers('gao',1591,timbuktu));
present('mali',1600);present('early-songhay-dendi',1600);
assert.notEqual(area('kilwa',1504).color,area('kilwa',1505).color);assert.equal(area('kilwa',1504).color,area('kilwa',1512).color);
assert.equal(area('early-ottoman-egypt-sham',1517).color,area('late-ottoman',1517).color,'Ottoman regions lost their common colour');
// Eurasian conquests: no later capital should be coloured prematurely.
for(const [point,y] of [[[49.12,55.79],1552],[[48.04,46.35],1556]]){
 assert(!covers('early-russia',y-1,point),'A Volga conquest was back-projected');assert(covers('early-russia',y,point),'A Volga conquest never changes the map');
}
present('early-mughal',1539);absent('early-mughal',1540);present('early-sur',1540);present('early-mughal',1555);
assert(!covers('early-mughal',1560,[75.42,22.35]));for(let y=1561;y<=1600;y++)assert(covers('early-mughal',y,[75.42,22.35]),'Mandu is absent after the Malwa conquest in '+y);
const buda=[19.04,47.50];assert(!covers('late-ottoman',1540,buda));assert(covers('late-ottoman',1541,buda));
assert.equal(area('early-guam',1521).kind,'cultural','Magellan contact turned into Spanish territorial rule');
assert.equal(area('early-solomons',1568).kind,'settlement','Mendaña contact turned into Spanish territorial rule');
assert.equal(area('tonga',1600).kind,'influence');
assert(h.get('aotearoa',1600).phase.title[1].includes('Puawaitanga'));
assert.equal(c.events.find(e=>e.id==='early-iceland-1550').from,1550);
assert.equal(c.events.find(e=>e.id==='early-frobisher-1576').from,1576);

// Inspect the actual shipped people, not just the biography input module.
const start=html.indexOf('const ISLAM_STARS = ['),end=html.indexOf('const STAR_DETAILS=');
const people=vm.runInNewContext(html.slice(start,end)+';ISLAM_STARS');
assert.equal(people.length,72+require('../to1789/biographies.cjs').length);
for(const [name,birth,death,approx] of [
 ['Закария аль-Ансари',1421,1520,true],['Ибн Хаджар аль-Хайтами',1504,1567,true],
 ['Эбуссууд-эфенди',1490,1574,false],['Ташкёпрюзаде Ахмед',1495,1561,false],
 ['Зайн ад-Дин Ибн Нуджайм',1520,1563,false],['Абд аль-Хакк ад-Дихлави',1551,1642,false],
 ['Ахмад Баба ат-Тимбукти',1556,1627,false],['Ахмад Сирхинди',1564,1624,false]
]){
 const p=people.find(p=>p.name===name);assert(p,name);assert.equal(p.birth,birth);assert.equal(p.death,death);assert.equal(Boolean(p.birthApprox),approx,name+' birth precision');
 assert(p.era.includes('г. х.'),name+' lacks Hijri dates');
}
console.log('PASS: 610–1600 interface bounds; preserved 610–1453 phase/geometry fingerprint; all 147 new years in eight regions; Oceanic contact and Arctic continuity; preserved 72 biographies from the preceding release.');
