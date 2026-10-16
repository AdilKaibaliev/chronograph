'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=require('./core.js').createWorldHistory(c);
const early=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]),earlyCartography=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]),earlyVisible=require('./legacy-presentation.js').legacyStateVisible;
function hasEarlyOwner(id,y){const e=early.find(e=>e.id===id),f=earlyCartography.frames[id]?.filter(f=>f[0]<=y).at(-1);return y<1300&&e&&e.from<=y&&y<=e.to&&earlyVisible(id,y)&&f&&earlyCartography.shapes[f[1]]?.length;}
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),surface=m=>Math.abs(m.flat().reduce((n,r)=>n+G.signed(r),0));
let years=0,checks=0;
for(let y=610;y<=2026;y++){
 const rows=h.mapAreasAt(y);assert(rows.length,'Empty map '+y);const ids=new Set(rows.map(a=>a.entry));assert.equal(rows.length,ids.size,'Duplicate map identity '+y);
 for(const a of rows){assert(a.from<=y&&y<a.to);assert(a.polygons?.length,'Empty geometry '+a.entry+' '+y);if(a.sovereign||a.overlord){const parent=a.sovereign||a.overlord;assert(ids.has(parent)||a.legacyOverlord&&hasEarlyOwner(parent,y),'Missing owner '+parent+' '+y);}}
 for(const e of h.at(y))assert(ids.has(e.entry.id)||e.coord?.length===2,'Unmapped profile '+e.entry.id+' '+y);
 years++;
}
const asianIds=['1939-ussr','1914-mongolia','1789-qing','1789-qajar','1789-durrani','cartography-tibet','cartography-tuva','1939-india','1960-nepal','1960-bhutan'];
for(let y=1922;y<=1945;y++){
 const areas=asianIds.map(id=>at(id,y));for(const a of areas)assert(a,'Missing Asian state '+y);
 for(let i=0;i<areas.length;i++)for(let j=i+1;j<areas.length;j++){
  const a=areas[i],b=areas[j];if(a.sovereign===b.entry||b.sovereign===a.entry)continue;
  const s=surface(clip.intersection(G.multi(a.polygons),G.multi(b.polygons)));assert(s<.0001,'Asian overlap '+y+' '+a.entry+'/'+b.entry+' '+s);checks++;
 }
 for(const[id,point]of [['1789-qajar',[51.42,35.69]],['1789-qajar',[54.37,31.9]],['1789-qajar',[57.08,30.28]],['1789-durrani',[69.17,34.56]],['1789-durrani',[62.2,34.35]],['1914-mongolia',[106.9,47.9]],['1960-nepal',[85.32,27.72]],['1960-bhutan',[89.64,27.47]],['1939-ussr',[69.24,41.3]],['1789-qing',[87.62,43.82]]]){assert(G.covers(at(id,y).polygons,point),'Missing control '+id+' '+y);checks++;}
}
assert(!at('cartography-tuva',1943).sovereign);assert.equal(at('cartography-tuva',1944).sovereign,'1939-ussr');assert(!at('cartography-tibet',1942).sovereign);assert.equal(at('1914-xinjiang',1942).overlord,'1789-qing');
for(let y=1919;y<=1945;y++){
 for(const [a,b]of [['1789-usa','1789-canada'],['1789-rio-plata','early-portuguese-brazil'],['early-portuguese-brazil','1815-banda-oriental']])assert(surface(clip.intersection(G.multi(at(a,y).polygons),G.multi(at(b,y).polygons)))<.0001,'American frontier '+y+' '+a+'/'+b);
 for(const id of ['bornu-late','1789-rozvi','1789-lunda','1789-xhosa','early-haudenosaunee','1789-jamaica-maroons','early-transylvania'])assert.equal(at(id,y).kind,'cultural',id+' mistaken for a separate state '+y);
 assert(!G.covers(at('1789-canada',y).polygons,[-56,49]),'Newfoundland joined Canada early');
 assert(G.covers(at('1789-usa',y).polygons,[-150,64]),'American Alaska lost');
}
for(let y=2011;y<=2026;y++){
 assert(h.mapAreasAt(y).length>=h.mapAreasAt(2010).length,'2010 seam drops profiles '+y);
 for(const region of c.regions)assert(h.at(y,region.id).length,'Empty modern region '+region.id);
 for(const id of ['1789-qing','1914-mongolia','late-kyrgyz-tianshan','1991-russia','1789-usa','1789-canada','thule','japan']){
  assert.deepEqual(at(id,y).polygons,at(id,2010).polygons,'Unjustified modern redrawing '+id+' '+y);
  assert.equal(at(id,y).color,at(id,2010).color,'Colour jump '+id+' '+y);
 }
 assert(at('2026-south-sudan',y));assert(G.covers(at('2026-south-sudan',y).polygons,[31.6,4.85]));assert(!G.covers(at('1939-sudan',y).polygons,[31.6,4.85]));
}
assert(!at('2026-south-sudan',2010));
const old=G.multi(at('1939-sudan',2010).polygons),next=clip.union(G.multi(at('1939-sudan',2011).polygons),G.multi(at('2026-south-sudan',2011).polygons));
assert(surface(clip.xor(old,next))<.0001,'Sudan exterior lost in partition');
assert.equal(h.get('1991-macedonia',2018).phase.name[1],'Macedonia');assert.equal(h.get('1991-macedonia',2019).phase.name[1],'Republic of North Macedonia');
assert.equal(h.get('1991-eswatini',2017).phase.name[1],'Swaziland');assert.equal(h.get('1991-eswatini',2018).phase.name[1],'Kingdom of Eswatini');
assert(h.get('1789-durrani',2020).phase.name[1].includes('Republic'));assert(h.get('1789-durrani',2021).phase.name[1].includes('Taliban'));
assert(h.get('1991-somaliland',2025).phase.text[1].includes('26 December 2025'));
assert(h.changes().includes(2011));assert.equal(require('./core.js').worldEpochForYear(2026),2021);
for(const a of h.mapAreasAt(2010)){
 const b=at(a.entry,2011);assert(b,'Lost 2010 profile '+a.entry);
 assert.equal(b.color,a.color);assert.equal(b.sovereign,a.sovereign);assert.equal(b.overlord,a.overlord);
 if(!['1939-sudan','early-funj'].includes(a.entry))assert.deepEqual(b.polygons,a.polygons,'Unjustified 2010/2011 jump '+a.entry);
}
let modernPairs=0;const seen=new Set();
for(let y=2011;y<=2026;y++){
 for(const {entry,phase}of h.at(y))for(const key of ['name','title','text'])assert(phase[key]?.length===3&&phase[key].every(Boolean),'Modern translation '+entry.id+' '+key);
 const rows=h.mapAreasAt(y).filter(a=>!a.sovereign&&['polity','influence'].includes(a.kind)).map(a=>{const p=a.polygons.flat();return {...a,b:[Math.min(...p.map(p=>p[0])),Math.min(...p.map(p=>p[1])),Math.max(...p.map(p=>p[0])),Math.max(...p.map(p=>p[1]))]};});
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j];if(a.overlord===b.entry||b.overlord===a.entry||a.overlord&&a.overlord===b.overlord)continue;
  if(a.b[0]>=b.b[2]||a.b[2]<=b.b[0]||a.b[1]>=b.b[3]||a.b[3]<=b.b[1])continue;
  const key=[a.geometryId,b.geometryId].sort().join('|');if(seen.has(key))continue;seen.add(key);modernPairs++;
  assert(surface(clip.intersection(G.multi(a.polygons),G.multi(b.polygons)))<.0001,'Modern political intersection '+y+' '+a.entry+'/'+b.entry);
 }
}
assert(!html.includes('event-geography-reference'));assert(!/worldTerritoryLayer[^}]*display:none/.test(fs.readFileSync('scripts/incidents/style.css','utf8')));
assert(Object.values(c.sources).every(s=>!s.urls),'Sources expose URLs');
console.log(JSON.stringify({pass:true,years,asianControls:checks,modernYears:16,modernPairs,checks:'all yearly frames, dates, parents, all regions, no Asian intersections, Iran/Afghanistan coverage, Nepal/Bhutan, continuous 2010/2011 appearance, Sudan partition, dated names and government changes'}));
