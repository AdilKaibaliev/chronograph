'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
module.exports=function verify(c){
 const h=require('./core.js').createWorldHistory(c);let controls=0;
 function point(id,y,p,want=true){const a=h.mapAreasAt(y).find(a=>a.entry===id);assert.equal(!!a&&G.covers(a.polygons,p),want,`${id} ${y} ${p}`);controls++;}
 const towns=[[29.93,56.02],[28.48,56.29],[31.2,55.6]];
 for(let y=1678;y<1772;y++){
  const r=y<1721?'early-russia':'1789-russian-empire';
  for(const p of towns){point('early-commonwealth',y,p);point(r,y,p,false);}
  for(const p of [[32.05,54.78],[30.52,56.34],[28.66,56.71]]){point(r,y,p);point('early-commonwealth',y,p,false);}
  point('early-commonwealth',y,[30.2,55.19]);
 }
 for(const y of [1667,1677,1772,1773])for(const p of towns){point(y<1721?'early-russia':'1789-russian-empire',y,p);point('early-commonwealth',y,p,false);}
 for(const [i,id]of ['nevel','sebezh','velizh'].entries()){
  const e=c.events.find(e=>e.id===id+'-restitution-1678');assert(e&&e.year===1678);assert.deepEqual(e.coord,towns[i]);
  assert(e.sources.every(s=>c.sources[s]));for(const t of e.text)assert(t.includes('1678')&&t.includes('1772'));
  for(const t of e.title)assert(t.length>8);
 }
 return {pass:true,geographicalControls:controls,datedEvents:3};
};
if(require.main===module){const c=JSON.parse(fs.readFileSync('index.html','utf8').match(/const WORLD_HISTORY=([^\n]+);/)[1]);console.log(JSON.stringify(module.exports(c)));}
