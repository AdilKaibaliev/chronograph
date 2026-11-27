'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
function verify(c){
 const h=require('./core.js').createWorldHistory(c),at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),has=(id,y,p)=>!!at(id,y)&&G.covers(at(id,y).polygons,p);
 let dates=0,points=0;
 function point(id,y,p,wanted=true){assert.equal(has(id,y,p),wanted,`${id} ${y} ${p}`);points++;}
 // Independent city controls, on either side of each documented transfer.
 for(let y=1420;y<1454;y++)for(const p of [[-.58,44.84],[-.24,44.91],[-.04,44.85]]){
  const english=y<1451||y===1452;point('late-england',y,p,english);point('late-france',y,p,!english);
 }
 point('late-england',1452,[-.8,43.8],false); // Talbot did not recover all Gascony.
 for(const y of [1450,1451,1452,1453])point('late-england',y,[-.13,51.51]);
 for(let y=1650;y<1664;y++){
  for(const p of [[-72.925,41.308],[-73.54,41.054],[-73,40.85]]){
   point('1789-new-netherland',y,p,false);
   assert(has('1789-english-atlantic',y,p)||has('late-england',y,p),'English settlement missing '+y+' '+p);points++;
  }
  point('1789-new-netherland',y,[-73.995,40.71]); // New Amsterdam is not transferred.
 }
 for(let y=1538;y<1590;y++){
  point('early-safavid',y,[47.82,30.5],false);point('late-ottoman',y,[47.82,30.5]);
  point('early-safavid',y,[48.67,31.32]); // Ahvaz remains in Safavid Khuzestan.
 }
 assert.equal(at('review-basra-garrison',1697)?.overlord,'early-safavid');
 for(const y of [1919,1922,1923,1945]){
  const e=h.entry('1960-nepal'),p=e.phases.find(p=>p.from<=y&&y<p.to),a=at(e.id,y);
  assert(p&&a);point(e.id,y,[85.32,27.72]);
  for(let i=0;i<3;i++)assert.equal(/1923/.test(p.text[i]),y>=1923,'Premature treaty '+y+' language '+i);
  assert.deepEqual(a.text,p.text,'Map and phase disagree '+y);
 }
 for(const [id,year]of [['bordeaux-transfer-1451',1451],['bordeaux-transfer-1452',1452],['new-haven-foundation-1638',1638],['hartford-agreement-1650',1650],['basra-administration-1538',1538],['basra-administration-1546',1546],['nepal-britain-treaty-1923',1923]]){
  const e=c.events.find(e=>e.id===id);assert(e&&e.year===year&&e.coord.every(Number.isFinite));
  for(const text of [...e.title,...e.text])assert(text&&typeof text==='string');
 }
 // A whole-catalogue structural census, including intentional interregna.
 // Gaps are allowed: automatically filling them would erase conquests/revolts.
 const ids=new Set();
 for(const e of c.entries){
  assert(!ids.has(e.id),'Duplicate profile '+e.id);ids.add(e.id);
  const sorted=[...e.phases].sort((a,b)=>a.from-b.from);
  for(let i=0;i<sorted.length;i++){
   const p=sorted[i];assert(Number.isInteger(p.from)&&Number.isInteger(p.to)&&p.from<p.to&&p.from!==0&&p.to!==0,'Invalid dates '+e.id);
   if(i)assert(sorted[i-1].to<=p.from,'Overlapping periods '+e.id);
   assert(p.sources?.length&&p.sources.every(s=>c.sources[s]),'Missing source '+e.id);dates++;
  }
 }
 for(const key of ['areas','outlines','events']){
  const seen=new Set();for(const a of c[key]){
   assert(!seen.has(a.id),'Duplicate '+key+' '+a.id);seen.add(a.id);
   if(a.entry||key!=='events')assert(ids.has(a.entry),'Unknown profile '+a.id);
   assert(Number.isInteger(a.from)&&Number.isInteger(a.to)&&(key==='events'?a.from<=a.to:a.from<a.to),'Bad interval '+a.id);
   assert(a.sources?.every(s=>c.sources[s]),'Unknown source '+a.id);
   if(key==='areas')for(let y=a.from;y<a.to;y++)assert(c.entries.find(e=>e.id===a.entry).phases.some(p=>p.from<=y&&y<p.to),'Area without narrative '+a.id+' '+y);
  }
 }
 return {pass:true,profiles:ids.size,phaseIntervals:dates,geographicalControls:points,documentedTransfers:7};
}
module.exports=verify;
if(require.main===module){const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]);console.log(JSON.stringify(verify(c)));}
