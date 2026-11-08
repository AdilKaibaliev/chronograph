'use strict';
// Keep the previously published research catalogue as an independent baseline.
// Corrections are explicit, dated transformations, checked against that baseline.
let c=structuredClone(require('./catalog.cjs'));
c=require('./frontier-review.cjs')(c);
c=require('./shared-frontiers.cjs')(c);
c=require('./to2026.cjs')(c);
// Preserve the political status of Greenland as well as its geometry across
// the 2010/2011 catalogue transition.
for(const a of c.areas.filter(a=>a.entry==='1789-greenland-posts'&&a.from>=2011))c.cartography.kinds[a.id]='polity';
c=require('./global-review-135.cjs').carryModern(c,[...c.survey141Modern,...require('./survey-140.cjs').modern,'early-portuguese-brazil','1815-paraguay','1789-chile','early-peru','1815-upper-peru','1789-rio-plata','1991-belize','1991-solomons','1848-central-america','early-new-spain','1789-great-britain','1848-honduras','1848-el-salvador','1848-nicaragua','1848-costa-rica','1914-panama']);
c=require('./mediterranean-review.cjs').world(c);
c=require('./europe-central-review.cjs').world(c);
c=require('./maghreb-frontier-review.cjs')(c);
c=require('./frankish-partitions.cjs').world(c);
c=require('./frankish-outer-frontiers.cjs').world(c);
c=require('./treaty-frontiers.cjs').records(c);
const G=require('./cartography-geometry.cjs');
for(const a of c.areas)if(c.cartography.areas[a.id]===undefined){
 const p=G.merge([a.polygons]);c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);
}
// Many dated revisions share the same outline or supersede an intermediate
// shape. Publish each referenced sequence of coordinates only once.
const cart=c.cartography,shapes=[],indices=new Map(),remapped=new Map();
function publishedShape(old){
 if(remapped.has(old))return remapped.get(old);
 const shape=cart.shapes[old];if(!shape)throw Error('Missing cartographic shape '+old);
 const key=JSON.stringify(shape);
 if(!indices.has(key)){indices.set(key,shapes.length);shapes.push(shape);}
 const id=indices.get(key);remapped.set(old,id);return id;
}
for(const key of Object.keys(cart.areas))cart.areas[key]=publishedShape(cart.areas[key]);
for(const frame of cart.mongol)frame.shape=publishedShape(frame.shape);
cart.shapes=shapes;
c.cartography.outlinePolicy={version:1,frames:c.areas.map(a=>[a.id,a.entry,a.from,a.to,a.kind,c.cartography.areas[a.id]]),profiles:[...new Set(c.areas.map(a=>a.entry))].sort()};
module.exports=c;
