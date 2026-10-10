'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),vm=require('vm');
const c=require('./catalog.cjs'),r=require('./registry.json'),core=require('./core.js');
const raw=fs.readFileSync(__dirname+'/cline-2.2.2.csv','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),r.provenance.rawSha256);
const lines=raw.trim().split(/\r?\n/),keys=lines.shift().split(','),originals=new Map(lines.map(line=>{const values=line.match(/(?:"(?:[^"]|"")*"|[^,]*)(?:,|$)/g).filter(Boolean).map(v=>v.replace(/,$/,'').replace(/^"|"$/g,''));const record=Object.fromEntries(keys.map((k,i)=>[k,values[i]]));return[record.coup_id,record];}));
for(const record of r.records){const source=originals.get(record.id);assert(source);assert.equal(record.country,source.country);assert.equal(record.date,[source.year,source.month.padStart(2,'0'),source.day.padStart(2,'0')].join('-'));assert.equal(record.kind,({'coup':'coup','attempted coup':'attempt','conspiracy':'conspiracy'})[source.event_type]);assert.deepEqual(record.types,['military','dissident','rebel','palace','foreign','auto','resign','popular','counter','other'].filter(k=>source[k]==='1'));}
assert.equal(r.records.length,1161);assert.equal(new Set(r.records.map(x=>x.id)).size,1161);assert.equal(Object.keys(r.countries).length,143);
assert.deepEqual(Object.fromEntries(['coup','attempt','conspiracy'].map(k=>[k,r.records.filter(x=>x.kind===k).length])),{coup:472,attempt:408,conspiracy:281});
for(const row of r.records){assert(r.countries[row.country]);assert.equal(new Date(row.date+'T00:00:00Z').toISOString().slice(0,10),row.date);assert(row.date<='2026-01-03');}
for(const country of Object.values(r.countries)){assert.equal(country.name.length,3);assert(country.name.every(Boolean));assert(country.coord[0]>=-180&&country.coord[0]<=180);assert(country.coord[1]>=-90&&country.coord[1]<=90);}
assert.equal(core.incidentRecords(r,{country:'Kazakhstan',year:2022}).length,2,'Keep distinct cases on the same date');
assert.deepEqual(core.incidentRecords(r,{country:'Kazakhstan',year:2022}).map(x=>x.id).sort(),['70501052022_1','70501052022_2']);
assert.equal(core.incidentRecords(r,{query:'Кыргызстан'}).length,4);
assert.equal(core.incidentRecords(r,{query:'no-such-country',year:1991}).length,0);
assert.equal(core.incidentGroups(r,r.records).length,143);assert.equal(core.incidentStep(0,-1,3),0);assert.equal(core.incidentStep(2,1,3),2);
assert.equal(c.stories.length,12);assert.equal(new Set(c.stories.map(s=>s.id)).size,12);
for(const s of c.stories){for(const v of [s.title,s.summary]){assert.equal(v.length,3);assert(v.every(Boolean));}assert(s.sources.length);s.sources.forEach(id=>assert(c.sources[id]?.title&&c.sources[id]?.url));let prev='';for(const step of s.steps){assert(step.date>=prev,s.id);prev=step.date;assert(c.places[step.place]);assert.equal(step.title.length,3);assert.equal(step.text.length,3);assert(step.title.every(Boolean)&&step.text.every(Boolean));assert.equal(new Date(step.date+'T00:00:00Z').toISOString().slice(0,10),step.date);}}
assert.equal(c.stories.find(s=>s.id==='gkchp').kind,'attempt');assert.equal(c.stories.find(s=>s.id==='orange-2004').kind,'protest');
assert.deepEqual(c.stories.find(s=>s.id==='kazakhstan-2022').steps.slice(-3).map(s=>s.date),['2022-01-06','2022-01-13','2022-01-19']);
assert.equal(c.stories.find(s=>s.id==='nato-afghanistan').steps[0].date,'2003-08-11');
const html=fs.readFileSync('index.html','utf8');assert(html.includes('name="chronograph-version" content="1.21.1"'));
for(const name of ['runtime.js','core.js'])new vm.Script(fs.readFileSync(__dirname+'/'+name,'utf8'));
const delivered=JSON.parse(html.match(/const INCIDENT_CATALOG=([\s\S]*?);\n/)[1]);assert.deepEqual(delivered.stories,c.stories);assert(Object.values(delivered.sources).every(s=>Object.keys(s).join()==='title'));
const integrated=require('./integrate.cjs'),world=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),originalWorld=require('../world/catalog.cjs');
assert.equal(world.range.max,2026);assert.equal(integrated.events.length,1202);
for(const key of ['entries','areas','outlines','cartography'])assert.deepEqual(world[key],originalWorld[key],key+' preserved');
for(const e of integrated.events){assert(world.events.some(w=>w.id===e.id));assert.equal(e.year,+e.date.slice(0,4));}
assert.equal(integrated.events.filter(e=>e.sourceRecord).length,1161);
assert(integrated.events.filter(e=>e.sourceRecord).every(e=>e.referenceOnly&&!e.epicentre));
assert(integrated.events.some(e=>e.year===2020&&e.epicentre&&e.place[0]==='Бишкек'));
assert(integrated.events.some(e=>e.year===2022&&e.epicentre&&e.place[0]==='Алматы'));
assert.equal(integrated.events.find(e=>e.id==='cline-'+r.records.find(x=>x.country==='Cyprus').id).region,'eurasia');
assert.equal(integrated.events.find(e=>e.id==='cline-'+r.records.find(x=>x.country==='Guatemala').id).region,'north');
assert(!html.includes("id='incidentsBtn'"));assert(!html.includes("id='incidentsPanel'"));assert(!html.includes('incidents-mode'));
const runtime=fs.readFileSync(__dirname+'/runtime.js','utf8'),style=fs.readFileSync(__dirname+'/style.css','utf8');
assert(runtime.includes('year!==eventAccentYear'));assert(runtime.includes('setTimeout(clearEventAccent,2800)'));assert(runtime.includes('e.referenceOnly'));assert(runtime.includes('pulseLayer.append(g)'));assert(!runtime.includes('viewport.append'));
assert(style.includes('1.2s ease-in-out 2'));assert(style.includes('prefers-reduced-motion'));assert(!style.includes('scale('));
assert.deepEqual(JSON.parse(html.match(/const FUTURE_CATALOG=([\s\S]*?);\n/)[1]),require('../future/catalog.cjs'));
console.log('PASS: integrated main chronology, 1202 dated records; original political data and future catalogue preserved; brief fixed-size epicentre accents.');
