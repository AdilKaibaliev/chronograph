'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
const raw=require('./catalog.cjs'),html=fs.readFileSync('index.html','utf8');
const c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=require('./core.js').createWorldHistory(c);
const d=c.displayCartography,frames=[...c.areas,...c.outlines];
for(const a of frames){
 const rings=d.shapes[d.areas[a.id]];
 assert(rings?.length,'Empty '+a.id);G.multi(rings);
 assert(a.from<a.to,'Invalid dates '+a.id);
 assert(G.covers(rings,d.labels[a.id]),'Label outside '+a.id);
 for(const ring of rings){assert(ring.length>=3);for(const [x,y]of ring)assert(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90);}
}
let yearlyStates=0;
for(let y=c.range.min;y<=c.range.max;y++){
 const states=h.mapAreasAt(y),ids=new Set(states.map(a=>a.entry));assert.equal(ids.size,states.length,'Duplicate '+y);
 for(const a of states){
  assert(a.polygons?.length,'Empty visible state '+a.entry+' '+y);
  if(a.sovereign||a.overlord)assert(ids.has(a.sovereign||a.overlord),'Missing owner '+a.entry+' '+y);
 }
 yearlyStates+=states.length;
}
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),controls=[];
for(const y of [1849,1859,1860,1861,1870,1871,1914])for(const [name,point]of [['Chambery',[5.92,45.57]],['Nice',[7.26,43.73]]]){
 for(const [id,want]of [['1914-italy',y<1860],['late-france',y>=1860]])controls.push([id,y,point,want,name]);
}
for(const y of [1859,1860,1914]){
 controls.push(['1914-italy',y,[8.95,44.44],true,'Genoa']);
 controls.push(['late-france',y,[5.38,43.32],true,'Marseille']);
 controls.push(['late-france',y,[7.59,44.09],false,'Tende']);
 controls.push(['late-france',y,[6.14,46.2],false,'Geneva']);
 controls.push(['1914-italy',y,[6.14,46.2],false,'Geneva']);
}
for(const[id,y,p,want,place]of controls)assert.equal(G.covers(at(id,y).polygons,p),want,id+' '+y+' '+place);
for(const y of [1860,1861,1866,1870,1914]){
 const land=G.multi(at('1914-italy',y).polygons),mainland=land.find(p=>G.covers(p,[7.69,45.07]));
 for(const city of [[9.2,44.8],[11.34,44.49],[11.25,43.77],[13.57,42.85],[14.27,40.85]])assert(G.covers(mainland,city),'Artificial break in unified Italy '+y+' '+city);
 assert.equal(G.covers(at('1914-italy',y).polygons,[12.5,41.9]),y>=1870,'Premature annexation of Rome '+y);
 assert.equal(G.covers(at('1914-italy',y).polygons,[12.25,45.49]),y>=1866,'Premature annexation of Veneto (Mestre) '+y);
}
for(const[id,y,p]of [['korea',1350,[126.55,37.97]],['late-ottoman',1700,[28.98,41.01]],['early-ottoman-egypt-sham',1900,[31.24,30.04]],['1914-italy',1864,[7.69,45.07]],['1914-italy',1865,[11.25,43.77]],['1914-italy',1871,[12.5,41.9]],['late-hre',1900,[13.4,52.52]],['japan',1940,[139.75,35.68]],['early-johor',1940,[103.92,1.58]],['late-france',1422,[2.4,47.08]]])assert.deepEqual(h.get(id,y).coord,p,'Dated anchor '+id+' '+y);
// A hole may share its first vertex with the outer boundary. It is still a hole.
const touch=[[[0,0],[6,0],[6,6],[0,6]],[[0,3],[2,4],[2,2]]];
assert.equal(G.multi(touch)[0].length,2);assert(!G.covers(touch,[1,3]));
const placed=require('./label-placement.cjs')(G.union([[[0,0],[20,0],[20,4],[0,4]],[[0,7],[2,7],[2,9],[0,9]]]),[0,5]);
assert(placed[1]<4,'Country label moved to a remote island instead of the nearest mainland');
// Only the two documented European geometries may differ from the preceding
// release; historical text / dates / other continents are not silently changed.
const basePath='.local-checks/all-borders-baseline.json';
if(fs.existsSync(basePath)){
 const old=JSON.parse(fs.readFileSync(basePath));
 for(const key of ['areas','events'])assert.deepEqual(raw[key],old[key],'Unexpected change '+key);
 const unrelated=list=>list.filter(a=>!['late-france','1914-italy','late-yuan','late-chagatai','late-ilkhan','late-jochi'].includes(a.entry));
 assert.deepEqual(unrelated(raw.outlines),unrelated(old.outlines));
 for(const e of raw.entries){const prev=old.entries.find(v=>v.id===e.id);assert(prev);assert.deepEqual(e.phases.filter(p=>p.from<1940),prev.phases.filter(p=>p.from<1940),'Older narrative changed '+e.id);}
}
console.log(JSON.stringify({pass:true,profiles:c.entries.length,frames:frames.length,years:c.range.max-c.range.min+1,yearlyStates,geographicControls:controls.length+35,checks:'coastal labels, valid holes, date intervals, owner continuity, 1860 transfer, dated anchors, preserved history'}));
