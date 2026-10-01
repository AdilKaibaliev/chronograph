'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c=require('../world/catalog.cjs'),{createWorldHistory}=require('../world/core.js'),h=createWorldHistory(c),html=fs.readFileSync('index.html','utf8');
assert.equal(c.range.min,610);assert(c.range.max>=1918);assert(html.includes('name="chronograph-version" content="1.13.0"'));
for(const id of ['yearRange','worldYearInput'])assert(new RegExp('id="'+id+'"[^>]*max="1939"').test(html));
const p=(id,y)=>h.get(id,y)?.phase,a=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id);
for(let y=1915;y<=1918;y++){for(const r of c.regions)assert(h.at(y,r.id).length);const mapped=h.mapAreasAt(y);assert.equal(mapped.length,new Set(mapped.map(a=>a.entry)).size);for(const item of h.at(y))assert(mapped.some(a=>a.entry===item.entry.id),'Unmapped '+item.entry.id);}
assert(p('1789-russian-empire',1916).name[1].includes('Empire'));assert(!p('1789-russian-empire',1917).name[1].includes('Empire'));assert(!p('1789-russian-empire',1918));
for(const id of ['1918-soviet-russia','1918-siberia','1918-czechoslovakia','1918-scs','1918-estonia','1918-latvia','1918-lithuania','1918-georgia','1918-armenia','1918-azerbaijan']){assert(!p(id,1917));assert(p(id,1918));assert.equal(a(id,1918).kind,'influence');}
assert(p('1815-finland',1917).name[1].includes('independence'));assert(!a('1815-finland',1917).sovereign);
assert.equal(a('1815-warsaw',1915).kind,'influence');assert(!a('1815-warsaw',1915).sovereign);
assert(!p('early-austria',1918));assert(!p('early-royal-hungary',1918));assert(!p('1914-serbia',1918));
assert(p('late-kyrgyz-tianshan',1916).name[1].includes('Urkun'));assert(p('late-kyrgyz-tianshan',1917).name[1].includes('return'));
assert(p('1789-kokand',1917).name[1].includes('Autonomy'));assert(p('1789-kokand',1918).name[1].includes('suppression'));assert(p('1914-tashkent',1918).name[1].includes('ASSR'));
assert(p('late-mecca',1916).name[1].includes('Kingdom'));assert(p('1918-medina',1918));assert(p('1914-namibia',1915).name[1].includes('occupation'));
assert(p('early-new-spain',1917).name[1].includes('Constitution'));assert(p('iceland',1918).name[1].includes('Kingdom'));assert(!p('1914-ross-expeditions',1918));
const delivered=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),dh=createWorldHistory(delivered);assert.equal(Object.values(delivered.sources).filter(s=>s.urls).length,0);
for(const e of c.events.filter(e=>e.from>=1915)){assert(h.get(e.entry,e.from),'Orphan event '+e.id);assert.equal(e.title.length,3);assert(e.coord.every(Number.isFinite));assert(dh.record(e.id));}
assert(delivered.outlines?.length,'Political outlines lost during build');
for(const y of [1915,1916,1917,1918])assert(h.changes().includes(y));
const biography=require('./biographies.cjs')[0];for(const t of biography.text)assert(t.length>150);for(const n of biography.name)assert(html.includes(n));assert(html.includes(biography.era));
// Cartographic additions have their own date/geometry tests; preserve the original-data hash.
const historic={entries:c.entries.filter(e=>!e.id.startsWith('cartography-')).map(e=>({...e,phases:e.phases.filter(p=>p.from<1915)})).filter(e=>e.phases.length),areas:c.areas.filter(a=>!a.entry.startsWith('cartography-')).filter(a=>a.from<1915),events:c.events.filter(e=>e.from<1915),sources:Object.fromEntries(Object.entries(c.sources).filter(([id])=>!id.startsWith("to1939")).filter(([id])=>!id.startsWith('cartography')).filter(([id])=>!id.startsWith('to1918')))};
const hash=crypto.createHash('sha256').update(JSON.stringify(historic)).digest('hex');
assert.equal(hash,'f8108f87d2359b444f54332f430af1c451815f7d3870efe19576d8f27db42e0f','Pre-1915 catalogue changed');
console.log('PASS: 1915–1918, imperial collapses, occupation vs sovereignty, Urkun, global events, sources, complete biographies and preserved earlier catalogue.');
