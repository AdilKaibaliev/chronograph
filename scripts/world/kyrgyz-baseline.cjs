'use strict';
// Historical regression hashes predate the 2026-10-01 Kyrgyz review. Restore only
// its 1300 continuity geometry/anchor for those comparisons, retaining every
// other field and record. New geometry has independent tests in kyrgyz-test.cjs.
module.exports=function beforeKyrgyzReview(value){
 const copy=structuredClone(value),areas=Array.isArray(copy)?copy:copy.areas;
 if(areas)for(const a of areas)if(a.entry==='late-kyrgyz'&&a.from===1300){
  a.polygons=[[[88,54],[90,56],[94,56.5],[97,55],[98,52],[95,50.5],[91,51],[88,52]]];
  a.points=a.polygons[0];a.label=[92.5,55];
 }
 return copy;
};
