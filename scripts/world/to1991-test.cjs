'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),raw=require('./catalog.cjs'),{createWorldHistory,worldEpochForYear,worldRegionalMilestones}=require('./core.js');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=createWorldHistory(c);
assert(c.range.max>=1991);assert(html.includes('TIMELINE_MAX='+require('../incidents/integrate.cjs').timelineMax+';'));assert(html.includes('name="chronograph-version" content="1.21.1"'));
const a=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),has=(id,y,p)=>G.covers(a(id,y).polygons,p),p=(id,y)=>h.get(id,y)?.phase;
for(let y=1961;y<=1991;y++){
 const map=h.mapAreasAt(y),ids=new Set(map.map(a=>a.entry));assert.equal(ids.size,map.length);
 for(const r of c.regions)assert(h.at(y,r.id).length,r.id+' empty '+y);
 for(const r of raw.cartography.relations.filter(r=>r.from<=y&&y<r.to)){assert(ids.has(r.member)&&ids.has(r.owner),'Dead relation '+y+' '+r.member);}
 for(const id of ids)assert(raw.cartography.relations.filter(r=>r.member===id&&r.from<=y&&y<r.to).length<=1,'Conflicting owners '+id+' '+y);
 for(const item of h.at(y))assert(ids.has(item.entry.id),'No mapped profile '+item.entry.id);
}
assert(a('1939-ussr',1990));assert(!a('1939-ussr',1991));
assert.equal(a('late-kyrgyz-tianshan',1990).sovereign,'1939-ussr');assert(!a('late-kyrgyz-tianshan',1991).sovereign);assert(has('late-kyrgyz-tianshan',1991,[74.6,42.87]));
assert.equal(p('1848-pishpek',1991).name[1],'Bishkek');assert(!has('1991-russia',1991,[74.6,42.87]));
for(const y of [1946,1960,1961,1975,1991]){
 assert(has('1914-mongolia',y,[106.9,47.9]));assert(!has('1789-qing',y,[106.9,47.9]));
 assert(has('1789-qing',y,[87.62,43.82]));assert(!has('1914-mongolia',y,[87.62,43.82]));
 assert(has('late-kyrgyz-tianshan',y,[74.6,42.87]));assert(!has('1789-qing',y,[74.6,42.87]));
 assert(!has('1914-south-africa',y,[27.48,-29.31]),'Lesotho enclave filled');
}
assert(a('1991-south-yemen',1989));assert(!a('1991-south-yemen',1990));assert(has('1789-qasimid',1990,[45.03,12.85]));assert(has('1789-qasimid',1961,[44.21,15.35]));assert(!has('1789-qasimid',1961,[48.77,15.93]));
assert(a('1960-gdr',1989));assert(!a('1960-gdr',1990));assert(has('1960-frg',1990,[13.4,52.52]));
assert(has('1960-pakistan',1970,[90.4,23.81]));assert(!has('1960-pakistan',1971,[90.4,23.81]));assert(has('1991-bangladesh',1971,[90.4,23.81]));
assert.equal(a('1848-singapore',1964).sovereign,'early-johor');assert(!a('1848-singapore',1965).sovereign&&!a('1848-singapore',1965).overlord);
assert.equal(a('1991-east-timor',1975).relationship,'occupation');assert(!has('1789-batavia',1975,[125.58,-8.56]));
assert.equal(a('1991-kuwait',1990).overlord,'1939-iraq');assert.equal(a('1991-kuwait',1990).relationship,'occupation');assert(!a('1991-kuwait',1991).overlord);
assert.equal(a('1960-ryukyu',1971).overlord,'1789-usa');assert.equal(a('1960-ryukyu',1972).sovereign,'japan');
assert(!a('1815-sham',1961).sovereign);assert(!has('early-ottoman-egypt-sham',1961,[36.3,33.5]));
assert.equal(a('1991-sinai',1967).relationship,'occupation');assert(!a('1991-sinai',1982));assert(has('early-ottoman-egypt-sham',1982,[33.8,30.7]));
assert.equal(a('1960-gaza',1967).relationship,'occupation');assert.equal(a('1960-west-bank',1967).relationship,'occupation');assert(a('1991-golan',1967));
for(const[id,y]of [['1914-kenya',1963],['1914-uganda',1962],['early-algiers',1962],['1960-northern-rhodesia',1964],['1960-nyasaland',1964],['1848-basotho',1966],['1939-angola',1975],['1939-mozambique',1975],['1914-namibia',1990],['1789-jamaica',1962],['1918-new-guinea',1975],['1914-western-samoa',1962]]){
 assert(a(id,y-1).sovereign||a(id,y-1).overlord,'Missing earlier owner '+id);assert(!a(id,y).sovereign&&!a(id,y).overlord,'Colonial fill persists '+id);
}
assert(!a('1960-rhodesia-federation',1963));assert(!a('1939-ruanda',1962));assert(a('1991-rwanda',1962)&&a('1991-burundi',1962));
assert(a('1914-eritrea',1991));assert(!a('1914-eritrea',1991).sovereign);assert(!has('ethiopia',1991,[38.9,15.33]));
assert(!a('1960-south-vietnam',1976));assert(has('1789-tayson',1976,[106.7,10.78]));
assert.equal(worldEpochForYear(1991),1961);assert(worldRegionalMilestones(h.timeline(),1991).every(e=>e.year>=1961&&e.year<=1991));
// Independent before-release snapshot: narrative and events before 1961 stay
// intact. Geographic corrections are deliberately covered by spatial assertions.
const file='.local-checks/to1991-catalog-baseline.json';if(fs.existsSync(file)){
 const b=JSON.parse(fs.readFileSync(file)),archived=require('./arctic-baseline.cjs')(raw,undefined,1961);for(const e of b.entries)assert.deepEqual(archived.entries.find(n=>n.id===e.id).phases.filter(p=>p.from<1961),e.phases,'Earlier narrative '+e.id);
 assert.deepEqual(archived.events.filter(e=>e.from<1961),b.events);
}
// All pairs of unrelated political fills, every postwar year. A common border
// may touch but cannot have positive area. Cultural regions and provinces are
// intentionally separate layers; they are not rival sovereign claims.
let pairs=0;const checked=new Set();
for(let y=1946;y<=1991;y++){
 const rows=h.mapAreasAt(y).filter(a=>!a.sovereign&&['polity','influence'].includes(a.kind)).map(a=>{const q=a.polygons.flat();return {...a,b:[Math.min(...q.map(p=>p[0])),Math.min(...q.map(p=>p[1])),Math.max(...q.map(p=>p[0])),Math.max(...q.map(p=>p[1]))]};});
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j];if(a.overlord===b.entry||b.overlord===a.entry||a.overlord&&a.overlord===b.overlord)continue;
  if(a.b[0]>=b.b[2]||a.b[2]<=b.b[0]||a.b[1]>=b.b[3]||a.b[3]<=b.b[1])continue;
  const key=[a.geometryId,b.geometryId].sort().join('|');if(checked.has(key))continue;checked.add(key);pairs++;
  const intersection=clip.intersection(G.multi(a.polygons),G.multi(b.polygons)),surface=intersection.flat().reduce((s,r)=>s+G.signed(r),0);
  assert(surface<.0001,'Intersecting fills '+a.entry+' / '+b.entry+' in '+y+': '+surface);
 }
}
console.log(JSON.stringify({pass:true,years:31,frontierYears:46,politicalPairs:pairs,entries:c.entries.length,newEvents:raw.events.filter(e=>e.from>=1961).length,revised:raw.to1991Review.revised.length}));
