'use strict';
// Keep the previously published research catalogue as an independent baseline.
// Corrections are explicit, dated transformations, checked against that baseline.
let c=structuredClone(require('./catalog.cjs'));
c=require('./frontier-review.cjs')(c);
c=require('./shared-frontiers.cjs')(c);
c=require('./to2026.cjs')(c);
c=require('./mediterranean-review.cjs').world(c);
c=require('./europe-central-review.cjs').world(c);
c=require('./maghreb-frontier-review.cjs')(c);
const G=require('./cartography-geometry.cjs');
for(const a of c.areas)if(c.cartography.areas[a.id]===undefined){
 const p=G.merge([a.polygons]);c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);
}
c.cartography.outlinePolicy={version:1,frames:c.areas.map(a=>[a.id,a.entry,a.from,a.to,a.kind,c.cartography.areas[a.id]]),profiles:[...new Set(c.areas.map(a=>a.entry))].sort()};
module.exports=c;
