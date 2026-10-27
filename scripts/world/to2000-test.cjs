'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),raw=require('./catalog.cjs'),{createWorldHistory,worldEpochForYear}=require('./core.js');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=createWorldHistory(c),r=createWorldHistory(raw);
assert(c.range.max>=2000);assert(html.includes('TIMELINE_MAX='+require('../incidents/integrate.cjs').timelineMax+';'));assert(html.includes('name="chronograph-version" content="1.28.0"'));
const area=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),phase=(id,y)=>h.get(id,y)?.phase,has=(id,y,p)=>G.covers(area(id,y).polygons,p);
for(let y=1992;y<=2000;y++){
 const a=h.mapAreasAt(y),ids=new Set(a.map(a=>a.entry));assert.equal(ids.size,a.length);
 for(const region of c.regions)assert(h.at(y,region.id).length,region.id+' empty '+y);
 for(const item of h.at(y)){
  assert(ids.has(item.entry.id),'Unmapped profile '+item.entry.id);
  for(const key of ['name','title','text'])assert(item.phase[key]?.length===3&&item.phase[key].every(s=>typeof s==='string'&&s.length>2),'Missing translation '+item.entry.id+' '+key);
  assert(item.phase.sources.every(id=>c.sources[id]&&!c.sources[id].urls),'Missing or exposed source '+item.entry.id);
 }
 for(const rel of raw.cartography.relations.filter(r=>r.from<=y&&y<r.to))assert(ids.has(rel.owner)&&ids.has(rel.member),'Dead ownership '+rel.member+' '+y);
 for(const id of ids)assert(raw.cartography.relations.filter(r=>r.member===id&&r.from<=y&&y<r.to).length<=1,'Conflicting ownership '+id);
 for(const [id,point]of [['1789-qing',[87.62,43.82]],['1914-mongolia',[106.9,47.9]],['late-kyrgyz-tianshan',[74.6,42.87]],['1789-qasimid',[45.03,12.85]]])assert(has(id,y,point));
 assert(!has('1789-qing',y,[106.9,47.9]));assert(!has('1789-qing',y,[74.6,42.87]));assert(!has('1914-south-africa',y,[27.48,-29.31]));
 assert.equal(area('thule',y).kind,'cultural');assert(!area('thule',y).sovereign&&!area('thule',y).overlord);assert(!has('thule',y,[-40,75]));
}
assert(area('1945-czechoslovakia',1992));assert(!area('1945-czechoslovakia',1993));
assert(!area('2000-czechia',1992));assert(has('2000-czechia',1993,[14.42,50.08]));assert(has('2000-slovakia',1993,[17.11,48.15]));
assert(!area('2000-bosnia',1991));assert(has('2000-bosnia',1992,[18.41,43.85]));assert(!has('1918-scs',1992,[18.41,43.85]));
assert(!area('2000-kosovo',1998));assert(has('2000-kosovo',1999,[21.16,42.66]));assert.equal(area('2000-kosovo',1999).kind,'influence');assert(!has('1918-scs',1999,[21.16,42.66]));
assert.equal(area('1848-hongkong',1996).overlord,'1789-great-britain');assert.equal(area('1848-hongkong',1997).sovereign,'1789-qing');
assert.equal(area('2000-macao',1998).overlord,'late-portugal');assert.equal(area('2000-macao',1999).sovereign,'1789-qing');
assert.equal(area('palau',1993).overlord,'1789-usa');assert(!area('palau',1994).overlord&&!area('palau',1994).sovereign);
assert.equal(area('1914-eritrea',1992).kind,'influence');assert.equal(area('1914-eritrea',1993).kind,'polity');
assert.equal(area('1991-east-timor',1998).relationship,'occupation');assert(!area('1991-east-timor',1999).overlord);assert(phase('1991-east-timor',1999).name[1].includes('UNTAET'));
for(const id of ['1960-west-bank','1960-gaza','1991-golan'])assert.equal(area(id,2000).relationship,'occupation');
assert.equal(phase('1914-congo',1996).name[1],'Zaire');assert.equal(phase('1914-congo',1997).name[1],'Democratic Republic of the Congo');
assert.equal(worldEpochForYear(2000),1992);
// Administrative and textual changes must not make unchanged countries jump.
for(const id of ['1991-russia','1789-usa','1789-canada','late-kyrgyz-tianshan','1914-mongolia','japan','1789-qing','1914-south-africa','thule','1789-qasimid','late-france'])assert.deepEqual(area(id,1992).polygons,area(id,1991).polygons,'1991/1992 discontinuity '+id);
for(const id of ['1789-canada','thule'])assert.deepEqual(area(id,1999).polygons,area(id,1998).polygons,'Nunavut confused with state or settlement boundary '+id);
let pairs=0;const checked=new Set();
for(let y=1992;y<=2000;y++){
 const rows=h.mapAreasAt(y).filter(a=>!a.sovereign&&['polity','influence'].includes(a.kind)).map(a=>{const q=a.polygons.flat();return {...a,b:[Math.min(...q.map(p=>p[0])),Math.min(...q.map(p=>p[1])),Math.max(...q.map(p=>p[0])),Math.max(...q.map(p=>p[1]))]};});
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j];if(a.overlord===b.entry||b.overlord===a.entry||a.overlord&&a.overlord===b.overlord)continue;
  if(a.b[0]>=b.b[2]||a.b[2]<=b.b[0]||a.b[1]>=b.b[3]||a.b[3]<=b.b[1])continue;
  const key=[a.geometryId,b.geometryId].sort().join('|');if(checked.has(key))continue;checked.add(key);pairs++;
  const surface=clip.intersection(G.multi(a.polygons),G.multi(b.polygons)).flat().reduce((s,r)=>s+G.signed(r),0);
  assert(surface<.0001,'Intersecting political fills '+a.entry+' / '+b.entry+' in '+y+': '+surface);
 }
}
const events=raw.events.filter(e=>e.from>=1992&&e.from<2001);assert(events.length>=29);
for(const e of events){assert(h.get(e.entry,e.year));assert(e.coord.length===2&&e.coord.every(Number.isFinite));assert(e.sources.every(s=>s.startsWith('to2000')&&raw.sources[s]?.urls.length));}
const file='.local-checks/to2000-before.json';if(fs.existsSync(file)){
 const b=JSON.parse(fs.readFileSync(file)),past=require('./to2000-window.cjs')(raw);
 for(const key of ['entries','areas','outlines','events','sources'])assert.deepEqual(key==='outlines'?require('./semirechye-baseline.cjs')(past[key]):past[key],b[key],'Earlier '+key+' changed');
 assert.deepEqual(past.cartography.relations,b.cartography.relations);
 const delivered=JSON.parse(fs.readFileSync('.local-checks/to2000-delivered-before.json')),old=createWorldHistory(delivered);
 for(const y of [610,840,1299,1300,1918,1939,1945,1960,1990,1991])for(const a of old.mapAreasAt(y))if(!c.frontierReview.frames.some(f=>f.entry===a.entry&&f.from<=y&&y<f.to)&&!c.europeCentralReview.frames.some(f=>f.entry===a.entry&&f.from<=y&&y<f.to)&&!((a.entry==='late-chagatai'&&y<1347||a.entry==='late-jochi'&&y<1360)&&y>=1300)) assert.deepEqual(area(a.entry,y).polygons,a.polygons,'Delivered geometry changed '+y+' '+a.entry);
}
console.log(JSON.stringify({pass:true,years:9,politicalPairs:pairs,newEvents:events.length,revised:raw.to2000Review.revised.length,checks:'dated sovereignty and administration, enclave holes, no overlapping political fills, all regions, continuity, three languages, complete earlier catalogue unchanged'}));
