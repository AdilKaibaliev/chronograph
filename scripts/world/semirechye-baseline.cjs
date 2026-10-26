'use strict';
// Test-only projection to the independent, archived pre-1.27 catalogue.
// Only the 1300 Chagatai outline changed in the raw catalogue. Preserve every
// other vertex, field and record; the new shared edge has settlement and
// intersection controls in europe-central-review-test.cjs.
const assert=require('node:assert/strict');
// Polygon union removes the collinear 84°E vertex between 82°E and 86°E.
const revised=require('./mongol-frontiers.cjs').semirechyeEdge.slice(1,-1).filter(p=>p[0]!==84).reverse();
const archived=[[84,48],[80,46.2],[77,44.8],[74.4,42.8]];
module.exports=rows=>rows.map(a=>{
 if(a.id!=='cartography-late-chagatai-1300')return a;
 const p=structuredClone(a.polygons);
 const at=p[0].findIndex(q=>q[0]===87.8&&q[1]===49)+1;
 assert(at>0);assert.deepEqual(p[0].slice(at,at+revised.length),revised);
 p[0].splice(at,revised.length,...archived);
 return {...a,polygons:p,points:p[0]};
});
