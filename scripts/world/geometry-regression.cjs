'use strict';
// Archived release locks still protect every date, source, narrative and owner.
// Only geometry of the six profiles repaired in 1.16 is compared separately,
// with dated coverage/continuity controls in map-stability-test.cjs.
const repaired=new Set(['1789-qing','1789-spain','1789-great-britain','1914-italy','late-france','japan']);
module.exports=list=>list.map(a=>{
 if(a.from<1919||!repaired.has(a.entry))return a;
 const {polygons,points,...record}=a;return record;
});
