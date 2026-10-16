'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),c=require('./catalog.cjs'),{createWorldHistory}=require('./core.js');
const html=fs.readFileSync('index.html','utf8'),d=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=createWorldHistory(d),r=createWorldHistory(c);
const area=(y,raw=false)=>(raw?r:h).mapAreasAt(y).find(a=>a.entry==='thule'),has=(y,p,raw=false)=>G.covers(area(y,raw).polygons,p);
assert.equal(c.arcticReview.stages.length,12);assert(html.includes('content="1.24.0"'));
for(let y=610;y<=1991;y++){
 assert.equal(!!h.get('thule',y),y>=1000);
 if(y<1000)continue;
 const item=h.get('thule',y),a=area(y);assert(a&&!a.sovereign&&!a.overlord);
 if(y>=1600)assert.equal(item.phase.kind,'community','Living communities labelled as an archaeological culture');
 assert(['settlement','cultural'].includes(a.kind));assert(item.phase.sources.every(s=>d.sources[s]&&!d.sources[s].urls));
 assert.equal(d.areas.filter(a=>a.entry==='thule'&&a.from<=y&&y<a.to).length,1);
 for(const text of [item.phase.name,item.phase.title,item.phase.text])assert(text.length===3&&text.every(s=>s.length>5));
 assert(!has(y,[-40,75]),'Greenland ice sheet presented as settlement '+y);
}
// Independent geographic controls for real changes, not merely different IDs.
assert(!has(1199,[-69,77],true));assert(has(1200,[-69,77],true));
assert(!has(1299,[-51.7,64.2],true));assert(has(1300,[-51.7,64.2],true));
assert(!has(1399,[-19.5,74.3],true));assert(has(1400,[-19.5,74.3],true));
assert(!has(1499,[-62.65,58.45],true));assert(has(1500,[-62.65,58.45],true));
assert(!has(1549,[-61.7,56.5],true));assert(has(1550,[-61.7,56.5],true));
for(const p of [[-94.83,74.7],[-82.9,76.42]]){assert(has(1500,p,true));assert(!has(1700,p,true));assert(!has(1952,p,true));assert(has(1953,p,true));}
assert(has(1700,[-69,77],true),'Inughuit wrongly removed with Canadian islands');
assert(has(1800,[-19.5,74.3],true));assert(!has(1850,[-19.5,74.3],true));
assert(!has(1924,[-21.97,70.49],true));assert(has(1925,[-21.97,70.49],true));
for(const y of [1300,1400,1500,1550,1600,1850,1925,1953])assert.notDeepEqual(area(y-1).polygons,area(y).polygons,'Coast rendering erases transition '+y);
const events=c.events.filter(e=>e.id.startsWith('arctic-review-'));assert.equal(events.length,8);
for(const e of events){assert(h.record(e.id));assert(h.get(e.entry,e.from));assert(e.sources.every(id=>id.startsWith('arcticReview')));if(e.route)assert.deepEqual(e.route.at(-1),e.coord);}
// Origins/destinations of the 1953 events are documented; routes are schematic.
for(const id of ['resolute','grise']){const e=events.find(e=>e.id==='arctic-review-'+id);assert.equal(e.from,1953);assert.deepEqual(e.route[0],[-78.1,58.46]);assert.equal(e.approx,false);}
const base='.local-checks/arctic-before.json';if(fs.existsSync(base)){
 const b=JSON.parse(fs.readFileSync(base)),past=require('./to2000-window.cjs')(c);
 assert.deepEqual(past.entries.filter(e=>e.id!=='thule'),b.entries.filter(e=>e.id!=='thule'));
 for(const key of ['areas','outlines'])assert.deepEqual(past[key].filter(a=>a.entry!=='thule'),b[key].filter(a=>a.entry!=='thule'));
 assert.deepEqual(past.events.filter(e=>!e.id.startsWith('arctic-review-')),b.events);
 assert.deepEqual(Object.fromEntries(Object.entries(past.sources).filter(([id])=>!id.startsWith('arcticReview'))),b.sources);
 assert.deepEqual(past.cartography.relations,b.cartography.relations,'Political ownership changed');
 // Frozen historical fixtures restore precisely the old records, not recomputed expectations.
 for(const key of ['entries','areas','events'])assert.deepEqual(require('./arctic-baseline.cjs')(past[key],key),b[key]);
}
console.log(JSON.stringify({pass:true,arcticStages:12,newEvents:8,years:992,checks:'dated settlement extent, ice-sheet exclusion, High Arctic relocations, cultural layer, three languages, unrelated history preserved'}));
