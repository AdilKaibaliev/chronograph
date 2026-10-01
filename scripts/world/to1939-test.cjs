'use strict';
const assert=require('node:assert/strict'),fs=require('fs');
const c=require('./catalog.cjs'),{createWorldHistory}=require('./core.js'),h=createWorldHistory(c),html=fs.readFileSync('index.html','utf8');
assert.equal(c.range.max,1939);assert(html.includes('TIMELINE_MAX=1939;'));
for(const id of ['yearRange','worldYearInput'])assert(new RegExp('id="'+id+'"[^>]*max="1939"').test(html));
const p=(id,y)=>h.get(id,y)?.phase,a=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id);
for(let y=1919;y<=1939;y++){
 for(const r of c.regions)assert(h.at(y,r.id).length,'Empty region '+r.id+' '+y);
 const mapped=h.mapAreasAt(y);assert.equal(mapped.length,new Set(mapped.map(a=>a.entry)).size);
 for(const item of h.at(y))assert(mapped.some(a=>a.entry===item.entry.id),'Unmapped '+item.entry.id);
}
assert(!p('1789-russian-empire',1919));assert(!p('1939-ussr',1921));assert(p('1939-ussr',1922));assert(!p('late-ottoman',1923));assert(p('1939-turkey',1923));
assert(!p('early-bukhara',1924));assert(!p('early-khwarazm',1924));assert(!p('1914-tashkent',1924));
for(const[y,n]of [[1924,'Kara-Kyrgyz'],[1925,'Autonomous Region'],[1926,'ASSR'],[1936,'SSR']])assert(p('late-kyrgyz-tianshan',y).name[1].includes(n));
assert(!a('cartography-tuva',1930).sovereign);assert(!a('cartography-tibet',1930).sovereign);
assert.equal(a('late-kyrgyz-tianshan',1936).sovereign,'1939-ussr');
assert(!p('1939-manchukuo',1931));assert.equal(a('1939-manchukuo',1932).overlord,'japan');
assert(!a('1918-austria',1937).sovereign);assert.equal(a('1918-austria',1938).sovereign,'late-hre');
assert(!p('1918-czechoslovakia',1939));assert(p('1939-bohemia',1939));assert(p('1939-slovakia',1939));
assert(!p('1815-warsaw',1939));assert.equal(a('1939-poland-west',1939).overlord,'late-hre');assert.equal(a('1939-poland-east',1939).overlord,'1939-ussr');
for(const id of ['1918-estonia','1918-latvia','1918-lithuania','1815-finland'])assert(!a(id,1939).sovereign&&!a(id,1939).overlord);
assert.equal(a('1939-iraq',1931).overlord,'1789-great-britain');assert(!a('1939-iraq',1932).overlord);
assert(!a('early-ottoman-egypt-sham',1922).overlord);assert.equal(a('ethiopia',1936).overlord,'1914-italy');
assert(!p('1939-chaco',1936));assert(p('1789-spain',1939).name[1].includes('Franco'));
assert(p('1789-saint-domingue',1934).name[1]==='Republic of Haiti');assert(p('1848-dominican',1924).name[1]==='Dominican Republic');
const geo=require('./cartography-geometry.cjs');
for(const[id,y,point,expected]of [
 ['1939-ussr',1936,[131.9,43.1],true],['1939-ussr',1936,[24.94,60.17],false],
 ['1939-ussr',1936,[20.3,67.8],false],['1939-india',1936,[96.15,16.85],true],
 ['1939-india',1937,[96.15,16.85],false],['1939-sudan',1936,[31.6,4.85],true],
 ['1914-south-africa',1936,[18.4,-33.9],true]
])assert.equal(geo.covers(a(id,y).polygons,point),expected,id+' '+y+' '+point);
assert.equal(p('1914-namibia',1920).from,1920);
assert(p('1848-ndebele',1923).name[1].includes('self-governing'));
const delivered=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]);assert.deepEqual(delivered.entries,c.entries);assert.deepEqual(delivered.areas,c.areas);assert.deepEqual(delivered.outlines,c.outlines);
for(const e of c.events.filter(e=>e.from>=1919))assert(h.get(e.entry,e.from),'Orphan event '+e.id);
// Compare all data through 1918 with the source before this extension (when available).
const current={entries:c.entries.map(e=>({...e,phases:e.phases.filter(p=>p.from<1919)})).filter(e=>e.phases.length),areas:c.areas.filter(a=>a.from<1919),events:c.events.filter(e=>e.from<1919),outlines:c.outlines.filter(a=>a.from<1919)};
assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(current)).digest('hex'),'6f980b4266a7cb2a3211f0aa36d8ccd97d9927d0e54acd98f0877a1d5d447cbf','Catalogue through 1918 changed');
const baseline='.local-checks/interwar-baseline.json';if(fs.existsSync(baseline)){
 const old=JSON.parse(fs.readFileSync(baseline));
 for(const key of Object.keys(current))assert.deepEqual(current[key],old[key],'Earlier '+key+' changed');
}
console.log(JSON.stringify({pass:true,years:21,profiles:c.entries.length,interwarRevisions:c.to1939Review.revised.length,events:c.events.filter(e=>e.from>=1919).length,checks:'timeline, state succession, dependencies, delivered data, earlier catalogue preserved'}));
