'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const G=require('./cartography-geometry.cjs'),c=require('./catalog.cjs'),{createWorldHistory}=require('./core.js'),h=createWorldHistory(c);
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const adjacent=G.union([rect(0,0,2,2),rect(2,0,2,2),rect(1,1,2,2)]);
assert.equal(adjacent.length,1);assert.equal(adjacent.reduce((s,r)=>s+G.signed(r),0),10);
const separated=G.union([rect(0,0,1,1),rect(5,0,1,1)]);assert.equal(separated.length,2);assert(!G.covers(separated,[3,.5]),'Ocean/foreign-land bridge');
const hole=G.difference(G.union([rect(0,0,10,10)]),[rect(3,3,4,4)]);assert(!G.covers(hole,[5,5]));assert(G.covers(hole,[1,1]));assert.equal(G.multi(hole)[0].length,2,'Enclave hole lost');
assert(!G.covers(G.merge([hole,G.union([rect(20,0,1,1)])]),[5,5]),'Merged imperial geometry filled an enclave');
const fixture=require('./cartography-legacy.cjs')([{id:'fixture',from:1,to:2,keyframes:[{year:1,polys:[rect(0,0,10,2),rect(0,8,10,2),rect(0,2,2,6),rect(8,2,2,6)]}]}]);assert(!G.covers(fixture.shapes[fixture.frames.fixture[0][1]],[5,5]),'Legacy compiler filled an enclave');
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),failures=[];
function point(id,y,p,expected,label){const a=at(id,y);if(Boolean(a&&G.covers(a.polygons,p))!==expected)failures.push(`${label}: ${id} ${y} ${p}`);}
for(const y of [1683,1750,1800,1850,1900]){
 for(const p of [[116.4,39.9],[108.94,34.34],[103.8,36.06],[113.26,23.13],[102.71,25.04],[126.63,45.75]])point('1789-qing',y,p,true,'Chinese core missing');
 for(const p of [[126.98,37.57],[139.69,35.68],[85.32,27.72],[94.45,51.72]])point('1789-qing',y,p,false,'Core extends into another polity/dependency');
}
point('1789-qing',1690,[106.91,47.92],false,'Khalkha premature');point('1789-qing',1691,[106.91,47.92],true,'Khalkha missing');point('1789-qing',1911,[106.91,47.92],false,'Khalkha separation missing');
point('1789-qing',1754,[87.62,43.82],false,'Dzungaria premature');point('1789-qing',1755,[87.62,43.82],true,'Dzungaria conquest');point('1789-qing',1758,[75.99,39.47],false,'Tarim premature');point('1789-qing',1759,[87.62,43.82],true,'Xinjiang campaign');
point('1789-qing',1857,[127.5,50.28],true,'Amur before treaty');point('1789-qing',1858,[127.5,50.28],false,'Amur after treaty');
point('1789-qing',1859,[131.89,43.12],true,'Primorye before treaty');point('1789-qing',1860,[131.89,43.12],false,'Primorye after treaty');
point('1789-qing',1881,[81.33,43.92],false,'Ili still occupied');point('1789-qing',1882,[81.33,43.92],true,'Ili return implemented');point('1789-russian-empire',1881,[81.33,43.92],false,'Occupation presented as annexation');assert.equal(at('1914-ili',1881).relationship,'occupation');
for(const y of [1600,1700,1800,1900,1914])for(const p of [[28.98,41.01],[32.49,37.87],[27.14,38.42],[39.72,39.75]])point('late-ottoman',y,p,true,'Ottoman mainland gap');
point('late-ottoman',1517,[31.24,30.04],true,'Egypt after conquest');point('late-ottoman',1533,[44.36,33.31],false,'Baghdad premature');point('late-ottoman',1534,[44.36,33.31],true,'Baghdad conquest');point('late-ottoman',1624,[44.36,33.31],false,'Safavid Baghdad');point('late-ottoman',1638,[44.36,33.31],true,'Baghdad reconquest');
point('late-ottoman',1700,[23.73,37.98],true,'Athens incorrectly removed with Morea');point('late-ottoman',1700,[22.94,37.57],false,'Venetian Morea');point('late-ottoman',1715,[22.94,37.57],true,'Morea restored');point('late-ottoman',1830,[23.73,37.98],false,'Independent Greece');
point('late-ottoman',1685,[19.04,47.5],true,'Buda missing');point('late-ottoman',1686,[19.04,47.5],false,'Buda retained after capture');point('late-ottoman',1630,[47.78,30.5],true,'Basra removed with Safavid Baghdad');
point('early-mughal',1585,[74.8,34.08],false,'Kashmir premature');point('early-mughal',1586,[74.8,34.08],true,'Kashmir campaign');point('early-mughal',1590,[68.35,25.38],false,'Sindh premature');point('early-mughal',1592,[68.35,25.38],true,'Sindh campaign');
for(const y of [1800,1866,1914])point('1789-russian-empire',y,[94.45,51.72],false,'Tuva treated as Russian province');
assert.equal(at('cartography-tuva',1914).overlord,'1789-russian-empire');assert(!at('cartography-tuva',1917).overlord);
assert.equal(at('cartography-tibet',1900).overlord,'1789-qing');assert(!at('cartography-tibet',1912).overlord);
assert.equal(at('1789-taiwan-qing',1894).sovereign,'1789-qing');assert.equal(at('1789-taiwan-qing',1895).sovereign,'japan');
assert.equal(at('early-ottoman-egypt-sham',1600).sovereign,'late-ottoman');assert.equal(at('cairo',1700).sovereign,'late-ottoman','Nested province remained a separate state');
assert.equal(at('early-ottoman-egypt-sham',1881).overlord,'late-ottoman');assert.equal(at('early-ottoman-egypt-sham',1882).overlord,'1789-great-britain');assert.equal(at('early-ottoman-egypt-sham',1882).relationship,'occupation');assert.equal(at('early-ottoman-egypt-sham',1914).relationship,'dependency');
assert.equal(at('early-royal-hungary',1900).sovereign,'early-austria');assert.equal(at('early-transylvania',1900).sovereign,'early-austria');
assert.equal(at('cartography-cyprus',1900).relationship,'administration');assert.equal(at('cartography-cyprus',1914).sovereign,'1789-great-britain');assert.equal(at('cartography-crete',1900).overlord,'late-ottoman');assert.equal(at('cartography-crete',1913).sovereign,'1848-greece');
assert(G.covers(at('late-yuan',1300).mongolUnion,[116.4,39.9]));assert(G.covers(at('late-yuan',1300).mongolUnion,[66.97,39.65]));assert(!at('late-yuan',1335)?.mongolUnion);
assert.equal(at('1848-texas',1860).sovereign,'1789-usa');assert(!at('1848-texas',1862).sovereign);assert.equal(at('1848-texas',1865).sovereign,'1789-usa');
assert(!at('1789-english-atlantic',1776)?.sovereign);assert(!at('early-portuguese-brazil',1822)?.sovereign);
// Every rendered province has an active visible ancestor; dependencies remain
// selectable, and no year silently duplicates a state.
let years=0;
for(let y=610;y<=1918;y++){
 const areas=h.mapAreasAt(y),ids=new Set(areas.map(a=>a.entry));assert.equal(ids.size,areas.length,'Duplicate '+y);
 for(const a of areas){assert(a.polygons.length,'Empty '+a.id);if(a.sovereign){assert(ids.has(a.sovereign),'Orphan '+a.id);assert(!areas.find(p=>p.entry===a.sovereign).sovereign,'Unresolved parent '+a.id);}if(a.overlord){assert(ids.has(a.overlord));assert(!a.sovereign);}}
 years++;
}
const legacy=require('./continuity.cjs').legacyData(),table=require('./cartography-legacy.cjs')(legacy);
for(const e of legacy)for(const f of e.keyframes){const s=table.shapes[table.frames[e.id].find(row=>row[0]===f.year)[1]];for(const r of s)for(const p of r)assert(p.every(Number.isFinite));const pts=f.polys.flat();if(!pts.length||require('./mongol-frontiers.cjs').reviewed.has(e.id))continue;for(const p of s.flat())for(let k=0;k<2;k++)assert(p[k]>=Math.min(...pts.map(p=>p[k]))-1e-7&&p[k]<=Math.max(...pts.map(p=>p[k]))+1e-7,'Dissolving enlarged a legacy extent');}
assert(G.covers(table.shapes[table.frames.chagatai.at(-1)[1]],[66.97,39.65]));assert(G.covers(table.shapes[table.frames.chagatai.at(-1)[1]],[64.42,39.77]));
const html=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
assert(html.includes("polygonPath(empireCartographicPolys(emp.id,y,f.polys))"));assert(html.includes('countries:true,empires:true'));assert(html.includes("countryLayer.classList.toggle('modern-reference',layerState.countries)"));
assert.deepEqual(failures,[],'Historical control points');
console.log(JSON.stringify({status:'PASS',years,datedOutlines:c.outlines.length,relationships:c.cartography.relations.length,legacyPolities:legacy.length,checks:'union, holes, separated possessions, dated transfers, imperial hierarchy, modern borders, delivered renderer'}));
