'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const c=require('../world/catalog.cjs'),{createWorldHistory}=require('../world/core.js'),h=createWorldHistory(c);
const html=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const delivered=JSON.parse(html.match(/const WORLD_HISTORY=(.*);/)[1]);
assert.deepEqual(c.range,{min:610,max:1789});assert.deepEqual(delivered.range,c.range);
assert.deepEqual(delivered.entries,c.entries);assert.deepEqual(delivered.areas,c.areas);
assert(html.includes('const TIMELINE_MIN=610,TIMELINE_MAX=1789;'));
for(const id of ['yearRange','worldYearInput'])assert(new RegExp('id="'+id+'"[^>]*max="1789"').test(html),'Unreachable years in '+id);
assert(html.includes("'XVI','XVII','XVIII'"));assert(html.includes("'culture','nature','territory'"));
const old={entries:c.entries.map(e=>({id:e.id,region:e.region,kind:e.kind,coord:e.coord,name:e.name,phases:e.phases.filter(p=>p.from<1601)})).filter(e=>e.phases.length),areas:c.areas.filter(a=>a.from<1601)};
// Explicitly revised for the audited 1300 continuity fix (continuity-test.cjs).
assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),'b164cde6276ba7b3d781bf4b56045c609eba2a70c223860d8014e3e5b2ecabf4','Reviewed 610–1600 continuity baseline changed');
const dh=createWorldHistory(delivered);
for(let y=1601;y<=1789;y++){
 assert.deepEqual(dh.at(y),h.at(y));assert.deepEqual(dh.areasAt(y),h.areasAt(y));
 for(const r of c.regions)assert(h.at(y,r.id).length,'Empty '+r.id+' in '+y);
 for(const a of h.areasAt(y))assert(h.get(a.entry,y),'Ghost territory '+a.id+' in '+y);
}
const ctx=vm.createContext({TIMELINE_MAX:1789,worldHistory:dh,WORLD_HISTORY:delivered});
vm.runInContext(html.match(/const KEY_YEARS=\[[^;]+;/)[0]+html.match(/worldPlaybackYears=\[\.\.\.new Set[^;]+;/)[0]+html.match(/function nextPlaybackYear\(y\)\{[\s\S]*?\n\}/)[0]+';globalThis.next=nextPlaybackYear;',ctx);
const visited=new Set([1600]);let y=1600;while(y<1789){const next=ctx.next(y);assert(next>y&&next<=1789);visited.add(next);y=next;}
for(const e of c.events.filter(e=>e.from>=1601))assert(visited.has(e.from),'Playback skips '+e.id);
for(const d of h.changes().filter(d=>d>=1601))assert(visited.has(d),'Playback skips territorial change '+d);
const area=(id,y)=>h.areasAt(y).find(a=>a.entry===id);
function contains(ring,[x,y]){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
const covers=(id,y,p)=>area(id,y)?.polygons.some(r=>contains(r,p))||false;
assert.deepEqual(c.to1789EurasiaDecisions.unhandled,[],'Missing successor to a Eurasian profile');
assert(h.get('early-bukhara',1785).entry.name[0].includes('эмират'));
assert(h.get('early-manila',1762).entry.name[0].includes('британская'));
// Dated European transfers must agree across both sides of the border.
for(const [yr,habsburg] of [[1685,false],[1686,true],[1789,true]]){
 assert.equal(covers('early-royal-hungary',yr,[19.04,47.5]),habsburg,'Buda '+yr);
 assert.equal(covers('late-ottoman',yr,[19.04,47.5]),!habsburg);
}
for(const [yr,venetian] of [[1686,false],[1687,true],[1714,true],[1715,false]]){
 assert.equal(covers('early-venice',yr,[22.3,37.5]),venetian,'Morea '+yr);
 assert.equal(covers('late-ottoman',yr,[22.3,37.5]),!venetian);
}
for(const [yr,prussian] of [[1741,false],[1742,true],[1789,true]]){
 assert.equal(covers('1789-prussia',yr,[17.04,51.11]),prussian,'Breslau '+yr);
 assert.equal(covers('early-austria',yr,[17.04,51.11]),!prussian);
 assert(!covers('early-commonwealth',yr,[17.04,51.11]));
}
for(const p of [[18.65,54.35],[18.6,53.01]]){assert(covers('early-commonwealth',1772,p));assert(!covers('1789-prussia',1772,p));}
assert(covers('early-commonwealth',1771,[24.03,49.84]));assert(!covers('early-commonwealth',1772,[24.03,49.84]));assert(covers('early-austria',1772,[24.03,49.84]));
assert(covers('early-denmark-norway',1657,[13,55.61]));assert(!covers('early-denmark-norway',1658,[13,55.61]));assert(covers('early-sweden',1658,[13,55.61]));
// Independent African polities and small colonial footholds are distinguished.
assert(!h.get('1789-cape',1651));assert(covers('1789-cape',1652,[18.42,-33.92]));assert(!covers('1789-cape',1652,[28.04,-26.2]));
assert(h.get('1789-ndongo',1670));assert(!h.get('1789-ndongo',1671));assert(h.get('1789-matamba',1789));
for(const [yr,name] of [[1697,/португал/i],[1698,/оман/i],[1728,/португал/i],[1729,/оман/i],[1741,/Мазруи/i]])assert(name.test(h.get('early-mombasa',yr).phase.title[0]),'Mombasa '+yr);
// Colonial transfers change the relevant centres, while established Andean and Mexican centres remain.
for(const yr of [1601,1717,1723,1739,1776,1780,1789])assert(covers('early-peru',yr,[-71.97,-13.52]),'Cusco lost in '+yr);
for(const yr of [1601,1697,1789])assert(covers('early-new-spain',yr,[-99.13,19.43]));
for(const [yr,portuguese] of [[1623,true],[1624,false],[1625,true]]){
 assert.equal(covers('early-portuguese-brazil',yr,[-38.51,-12.97]),portuguese,'Salvador '+yr);
 assert.equal(covers('1789-dutch-brazil',yr,[-38.51,-12.97]),!portuguese);
}
for(const [yr,portuguese] of [[1629,true],[1630,false],[1653,false],[1654,true]]){
 assert.equal(covers('early-portuguese-brazil',yr,[-34.88,-8.05]),portuguese,'Recife '+yr);
 assert.equal(covers('1789-dutch-brazil',yr,[-34.88,-8.05]),!portuguese);
}
for(const [yr,dutch] of [[1663,true],[1664,false],[1673,true],[1674,false]]){
 assert.equal(covers('1789-new-netherland',yr,[-74.01,40.71]),dutch,'New York '+yr);
 assert.equal(covers('1789-new-york',yr,[-74.01,40.71]),!dutch);
}
assert(!h.get('1789-usa',1775));assert(h.get('1789-usa',1776));
assert(h.get('early-haudenosaunee',1722).entry.name[0].includes('Шесть'));
assert.equal(h.get('early-itza',1697).entry.kind,'community');
assert(!h.get('early-itza',1697).entry.name[0].includes('Государство'));
assert(h.get('early-new-mexico',1610).entry.name[0].includes('Санта-Фе'));
for(const [yr,spanish] of [[1761,true],[1762,false],[1763,true]])assert.equal(covers('early-spanish-antilles',yr,[-82.37,23.13]),spanish,'Havana '+yr);
// Maritime encounters are not back-projected as colonial occupation.
assert.equal(area('early-guam',1667).kind,'cultural');assert.equal(area('early-guam',1668).kind,'influence');assert.equal(area('early-guam',1695).kind,'polity');
assert(!h.get('1789-sydney',1787));assert(h.get('1789-sydney',1788));assert(h.get('1789-cadigal',1789));
assert(covers('1789-sydney',1788,[151.21,-33.86]));assert(!covers('1789-sydney',1788,[149.12,-35.28]));
assert(!h.get('1789-kodiak',1783));assert(h.get('1789-kodiak',1784));assert(!covers('1789-kodiak',1789,[-149.9,61.22]));
assert(!h.get('1789-greenland-posts',1720));assert(h.get('1789-greenland-posts',1721));
assert(covers('1789-greenland-posts',1721,[-52.1,64.13]));assert(covers('1789-greenland-posts',1728,[-51.74,64.18]));
assert(!covers('1789-greenland-posts',1789,[-42,74]));assert(h.get('thule',1789));assert(!h.get('norse',1789));
assert.deepEqual(h.timeline().find(e=>e.id==='area-1789-greenland-posts-1728').coord,[-51.74,64.18],'Territory chronology focuses an obsolete settlement');
for(const yr of [1601,1642,1769,1789]){assert.equal(area('aotearoa',yr).kind,'settlement');assert.equal(area('1789-tasmania',yr).kind,'cultural');}
assert.equal(area('hawaii',1789).kind,'cultural');assert.equal(area('antarctica',1789).kind,'uninhabited');
assert.equal(c.events.find(e=>e.id==='1789-laki-1783').kind,'nature');
for(const e of c.events.filter(e=>e.id.startsWith('1789-'))){assert(e.from>=1601&&e.from<=1789);assert(e.coord.every(Number.isFinite));}
// Inspect the actual delivered dates, sources and individual biographies.
const people=vm.runInNewContext(html.slice(html.indexOf('const ISLAM_STARS = ['),html.indexOf('const STAR_DETAILS='))+';ISLAM_STARS');
assert.equal(people.length,80);
for(const p of require('./biographies.cjs')){
 const star=people.find(x=>x.name===p.name[0]);assert(star,p.name[0]);assert.equal(star.birth,p.birth);assert.equal(star.death,p.death);assert.equal(star.era,p.era);assert.equal(Boolean(star.birthApprox),Boolean(p.approxBirth));
 for(const text of p.text)assert(text.length>100);assert(p.article);
}
assert.equal(people.find(p=>p.name==='Исмаил Хаккы Бурсеви').death,1725);assert.equal(people.find(p=>p.name==='Муртада аз-Забиди').death,1791);
console.log('PASS: 610–1789 interface; preserved 610–1600 fingerprint; all 189 added years in eight regions; playback stops at all new dates; Oceanic colonial distinctions; current coordinates in territorial chronology; 80 delivered biographies.');
