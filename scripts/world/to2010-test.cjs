'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),raw=require('./catalog.cjs'),{createWorldHistory,worldEpochForYear}=require('./core.js');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=createWorldHistory(c);
assert.equal(raw.range.max,2010);assert.equal(c.range.max,2026);assert(html.includes('TIMELINE_MAX=2026;'));assert(html.includes('name="chronograph-version" content="1.22.0"'));
const area=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),phase=(id,y)=>h.get(id,y)?.phase,has=(id,y,p)=>G.covers(area(id,y).polygons,p);
for(let y=2001;y<=2010;y++){
 const a=h.mapAreasAt(y),ids=new Set(a.map(a=>a.entry));assert.equal(ids.size,a.length);
 for(const region of c.regions)assert(h.at(y,region.id).length,region.id+' empty '+y);
 for(const item of h.at(y)){
  assert(ids.has(item.entry.id),'Unmapped profile '+item.entry.id);
  for(const key of ['name','title','text'])assert(item.phase[key]?.length===3&&item.phase[key].every(s=>typeof s==='string'&&s.length>2),'Missing translation '+item.entry.id+' '+key);
  assert(item.phase.sources.every(id=>c.sources[id]&&!c.sources[id].urls),'Missing or exposed source '+item.entry.id);
 }
 for(const rel of raw.cartography.relations.filter(r=>r.from<=y&&y<r.to))assert(ids.has(rel.owner)&&ids.has(rel.member),'Dead ownership '+rel.member+' '+y);
 for(const id of ids)assert(raw.cartography.relations.filter(r=>r.member===id&&r.from<=y&&y<r.to).length<=1,'Conflicting ownership '+id);
 for(const [id,point]of [['1789-qing',[87.62,43.82]],['1914-mongolia',[106.9,47.9]],['late-kyrgyz-tianshan',[74.6,42.87]],['1789-qasimid',[45.03,12.85]],['1939-sudan',[31.6,4.85]]])assert(has(id,y,point));
 assert(!has('1789-qing',y,[106.9,47.9]));assert(!has('1789-qing',y,[74.6,42.87]));assert(!has('1914-south-africa',y,[27.48,-29.31]));
 assert.equal(area('thule',y).kind,'cultural');assert(!area('thule',y).sovereign&&!area('thule',y).overlord);
 assert.equal(area('1848-hongkong',y).sovereign,'1789-qing');assert.equal(area('2000-macao',y).sovereign,'1789-qing');
}
assert(!area('2010-montenegro',2005));assert(has('2010-montenegro',2006,[19.26,42.44]));assert(!has('1918-scs',2006,[19.26,42.44]));assert(has('1918-scs',2006,[20.46,44.81]));
assert(phase('1918-scs',2002).name[1].includes('Yugoslavia'));assert.equal(phase('1918-scs',2003).name[1],'Serbia and Montenegro');assert.equal(phase('1918-scs',2006).name[1],'Serbia');
assert.equal(area('2000-kosovo',2008).kind,'influence');assert(phase('2000-kosovo',2008).text[1].includes('not Serbia'));
assert.equal(area('1991-east-timor',2001).kind,'influence');assert.equal(area('1991-east-timor',2002).kind,'polity');assert(!area('1991-east-timor',2002).overlord&&!area('1991-east-timor',2002).sovereign);
assert.equal(area('1939-iraq',2003).relationship,'occupation');assert(!has('1789-usa',2003,[44.37,33.32]));assert(!area('1939-iraq',2004).overlord);
assert(phase('1960-nepal',2007).name[1].includes('Kingdom'));assert(phase('1960-nepal',2008).name[1].includes('Republic'));
assert(phase('1789-greenland-posts',2009).text[1].includes('Kingdom of Denmark'));
assert(phase('1939-sudan',2010).text[1].includes('not yet independent'));
assert.equal(worldEpochForYear(2000),1992);assert.equal(worldEpochForYear(2001),2001);
for(const id of ['1991-russia','1789-usa','1789-canada','late-kyrgyz-tianshan','1914-mongolia','japan','1789-qing','1914-south-africa','thule','1789-qasimid','late-france','1918-scs','1939-sudan'])assert.deepEqual(area(id,2001).polygons,area(id,2000).polygons,'2000/2001 jump '+id);
for(const id of ['2000-kosovo','1789-greenland-posts','thule','1918-new-guinea','1789-qing'])assert.deepEqual(area(id,2010).polygons,area(id,2001).polygons,'Unjustified redrawing '+id);
// Successor territories must partition the former footprint with no loss or gain.
const old=G.multi(area('1918-scs',2005).polygons),next=clip.union(G.multi(area('1918-scs',2006).polygons),G.multi(area('2010-montenegro',2006).polygons));
const surface=m=>Math.abs(m.flat().reduce((s,r)=>s+G.signed(r),0));assert(surface(clip.xor(old,next))<.0001,'Balkan partition changed exterior');
let pairs=0;const checked=new Set();
for(let y=2001;y<=2010;y++){
 const rows=h.mapAreasAt(y).filter(a=>!a.sovereign&&['polity','influence'].includes(a.kind)).map(a=>{const q=a.polygons.flat();return {...a,b:[Math.min(...q.map(p=>p[0])),Math.min(...q.map(p=>p[1])),Math.max(...q.map(p=>p[0])),Math.max(...q.map(p=>p[1]))]};});
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j];if(a.overlord===b.entry||b.overlord===a.entry||a.overlord&&a.overlord===b.overlord)continue;
  if(a.b[0]>=b.b[2]||a.b[2]<=b.b[0]||a.b[1]>=b.b[3]||a.b[3]<=b.b[1])continue;
  const key=[a.geometryId,b.geometryId].sort().join('|');if(checked.has(key))continue;checked.add(key);pairs++;
  assert(surface(clip.intersection(G.multi(a.polygons),G.multi(b.polygons)))<.0001,'Intersecting political fills '+a.entry+' / '+b.entry+' in '+y);
 }
}
const events=raw.events.filter(e=>e.from>=2001);assert(events.length>=35);
for(const e of events){assert(h.get(e.entry,e.year));assert(e.coord.length===2&&e.coord.every(Number.isFinite));assert(e.sources.every(s=>s.startsWith('to2010')&&raw.sources[s]?.urls.length));}
for(const region of c.regions)assert(events.some(e=>e.region===region.id),'No new events in '+region.id);
assert.equal(events.find(e=>e.id==='2010-event-antarctic-secretariat').coord[0],-58.38);
assert.deepEqual(events.find(e=>e.id==='2010-event-chile').coord,[-72.898,-36.122]);
assert(!events.some(e=>e.entry==='thule'),'Administration must not imply Inuit migration');
const past={entries:raw.entries.map(e=>({...e,phases:e.phases.filter(p=>p.from<2001)})).filter(e=>e.phases.length),areas:raw.areas.filter(a=>a.from<2001),outlines:raw.outlines.filter(a=>a.from<2001),events:raw.events.filter(a=>a.from<2001),sources:Object.fromEntries(Object.entries(raw.sources).filter(([id])=>!id.startsWith('to2010'))),relations:raw.cartography.relations.filter(r=>r.from<2001)};
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const fingerprints=require('./to2010-baseline.json');for(const key of Object.keys(past))assert.equal(hash(past[key]),fingerprints[key],'Earlier data changed: '+key);
const file='.local-checks/to2010-before.json';if(fs.existsSync(file)){
 const b=JSON.parse(fs.readFileSync(file));for(const key of ['entries','areas','outlines','events','sources'])assert.deepEqual(past[key],b[key]);assert.deepEqual(past.relations,b.cartography.relations);
 const delivered=JSON.parse(fs.readFileSync('.local-checks/to2010-delivered-before.json')),oldHistory=createWorldHistory(delivered);
 for(const y of [610,840,1299,1300,1918,1939,1945,1960,1990,1991,1993,1997,1999,2000])for(const a of oldHistory.mapAreasAt(y))if(!c.frontierReview.frames.some(f=>f.entry===a.entry&&f.from<=y&&y<f.to)) assert.deepEqual(area(a.entry,y).polygons,a.polygons,'Delivered geometry changed '+y+' '+a.entry);
}
console.log(JSON.stringify({pass:true,years:10,politicalPairs:pairs,newEvents:events.length,revised:raw.to2010Review.revised.length,checks:'all eight regions, dated status changes, no overlapping political fills, exact partition exterior, earlier independent fingerprints preserved, three languages'}));
