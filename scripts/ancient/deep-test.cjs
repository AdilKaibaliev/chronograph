'use strict';
const assert=require('node:assert/strict'),scale=require('./time-scale.js'),deep=require('./prehistory.cjs'),s=require('./scriptural.cjs');
let previous=-1;for(let y=scale.min;y<=scale.max;y++)if(y){const p=scale.toPosition(y);assert(p>previous,'Non-monotonic year '+y);assert.equal(scale.toYear(p),y,'Lost year '+y);previous=p;}
assert.equal(scale.toYear(0),scale.min);assert.equal(scale.toYear(10000000),scale.max);
assert.equal(s.records.filter(r=>r.kind==='prophet').length,25);assert.equal(s.records.filter(r=>r.kind==='people').length,5);
const ids=new Set();for(const r of deep.records){assert(!ids.has(r.id));ids.add(r.id);assert(r.from<r.to);assert(r.approx&&r.deepTime);assert(r.title.length===3&&r.text.length===3);assert(r.title.every(Boolean)&&r.text.every(Boolean));assert(r.sources.every(id=>deep.sources[id]?.urls?.length));assert(!r.polygons&&!r.route);assert(r.coord.every(Number.isFinite));}
for(const t of deep.trails)for(const id of t.records)assert(ids.has(id));
for(const r of s.records){assert.equal(r.date,null,'No fabricated exact dates');assert(r.title.length===3&&r.text.length===3&&r.dateLabel.length===3);assert(r.title.every(Boolean)&&r.text.every(Boolean));assert(r.sources.every(id=>s.sources[id]?.urls?.length));assert(!r.place||s.places[r.place]);assert(!r.from&&!r.to&&!r.polygons&&!r.route);}
for(const p of Object.values(s.places)){assert(p.sources.every(id=>s.sources[id]));assert(p.note.length===3&&p.title.length===3);}
assert.equal(s.records.find(r=>r.id==='adam').place,null);assert.equal(s.records.find(r=>r.id==='nuh').place,null);assert.equal(s.records.find(r=>r.id==='hud').place,null);assert.equal(s.records.find(r=>r.id==='muhammad').openYear,610);
console.log(JSON.stringify({pass:true,roundTripYears:352026,prehistoricRecords:deep.records.length,readingTrails:deep.trails.length,prophets:25,peoples:5,locatedTextualPlaces:Object.keys(s.places).length,noInventedPropheticDates:true}));
