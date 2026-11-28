'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
module.exports=function verify(c){
 const h=require('./core.js').createWorldHistory(c);let controls=0;
 function has(id,y,p){const a=h.mapAreasAt(y).find(a=>a.entry===id);return !!a&&G.covers(a.polygons,p);}
 function point(id,y,p,wanted=true){assert.equal(has(id,y,p),wanted,`${id} ${y} ${p}`);controls++;}
 for(let y=1710;y<1772;y++){
  const r=y<1721?'early-russia':'1789-russian-empire';
  point(r,y,[30.2,55.19],false);point('early-commonwealth',y,[30.2,55.19]);
  point(r,y,[32.05,54.78]);point(r,y,[30.52,50.45]);point(r,y,[24.1,56.95]);
 }
 point('early-commonwealth',1772,[30.2,55.19],false);point('1789-russian-empire',1772,[30.2,55.19]);
 for(let y=1623;y<=1639;y++){
  point('early-safavid',y,[44.39,35.47],y>=1624&&y<1630);
  point('late-ottoman',y,[44.39,35.47],y<1624||y>=1630);
  point('early-safavid',y,[44.36,33.31],y>=1624&&y<1638);
  point('late-ottoman',y,[43.13,36.34],y!==1624);
 }
 point('early-safavid',1638,[44.01,36.19],false);point('late-ottoman',1638,[44.01,36.19]);
 for(let y=1838;y<1946;y++)for(const [p,loser]of [[[-89.56,13.99],'1848-central-america'],[[-88.94,14.03],'1848-honduras']]){
  point(loser,y,p,false);point('1848-el-salvador',y,p);
 }
 for(const y of [1638,1639,1721]){
  const p=h.get('early-safavid',y).phase,a=h.mapAreasAt(y).find(a=>a.entry==='early-safavid');
  assert.equal(p.from,y===1638?1638:1639);assert.equal(p.to,y===1638?1639:1722);
  assert.deepEqual(a.title,p.title);assert.deepEqual(a.text,p.text);
  for(const t of p.text)assert.equal(t.includes('1639'),y>=1639);
 }
 for(const [id,y]of [['kirkuk-recovery-1630',1630]]){
  const e=c.events.find(e=>e.id===id);assert(e&&e.year===y&&e.coord.every(Number.isFinite));
  assert(e.sources.every(s=>c.sources[s]));for(const t of [...e.title,...e.text])assert(t.length>8);
 }
 return {pass:true,geographicalControls:controls,datedEvents:1};
};
if(require.main===module){const c=JSON.parse(fs.readFileSync('index.html','utf8').match(/const WORLD_HISTORY=([^\n]+);/)[1]);console.log(JSON.stringify(module.exports(c)));}
