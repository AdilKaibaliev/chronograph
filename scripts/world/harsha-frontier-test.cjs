'use strict';
const assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs');
const c=require('./legacy-frontiers.cjs').compiler(require('./continuity.cjs').legacyData());
const e=c.empires.find(e=>e.id==='harsha');
const clip=require('../vendor/polygon-clipping.cjs');
assert.equal(e.to,647);
for(const y of [610,620,632,633,641,646,647]){
 const shape=c.shape('harsha',y);
 assert(G.covers(shape,[79.92,27.05]),'Kannauj missing '+y);
 assert(G.covers(shape,[76.83,29.97]),'Thanesar missing '+y);
 assert(G.covers(shape,[78.75,23.83]),'North of Narmada missing '+y);
 assert(!G.covers(shape,[79.09,21.15]),'Nagpur in Deccan wrongly annexed '+y);
 for(const other of c.empires){
  const f=other.keyframes.filter(f=>f.year<=y).at(-1);
  if(other.id==='harsha'||y<other.from||y>other.to||!f||f.hidden||['population','influence','reference'].includes(f.type||other.type))continue;
  const overlap=clip.intersection(G.multi(shape),G.multi(c.shape(other.id,y))).reduce((s,p)=>s+Math.abs(G.signed(p[0]))-p.slice(1).reduce((n,r)=>n+Math.abs(G.signed(r)),0),0);
  assert(overlap<1e-7,'Political overlap with '+other.id+' '+y);
 }
}
console.log(JSON.stringify({pass:true,years:7,end:647,controls:['Kannauj','north of Narmada','Nagpur outside']}));
