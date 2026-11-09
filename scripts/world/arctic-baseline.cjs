'use strict';
// Test-only projection to the independently saved 1.18.0 Arctic records.
// Historical release hashes remain unchanged; arctic-test.cjs tests the new
// records directly and verifies every unrelated record against that release.
const saved=require('./arctic-before.json');
// Older catalogues reused each of these two identifiers for different regions.
// Reproduce the archived references only in comparisons to those catalogues.
const oldId={to1789CentralAfrica:'to1789Central',to1789DutchAmerica:'to1789Dutch'};
function oldReferences(row){
 if(row.sources?.some(id=>oldId[id]))return {...row,sources:row.sources.map(id=>oldId[id]||id)};
 return row;
}
module.exports=function beforeArcticReview(value,key,end=1992){
 if(key==='sources'){
  const result=Object.fromEntries(Object.entries(value).filter(([id])=>!id.startsWith('arcticReview')&&!oldId[id]));
  for(const [id,old] of Object.entries(oldId))if(value[id])result[old]=value[id];
  return result;
 }
 if(!Array.isArray(value))return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,['entries','areas','events','sources','outlines'].includes(k)?beforeArcticReview(v,k,end):v]));
 value=value.map(row=>row.phases?{...oldReferences(row),phases:row.phases.map(oldReferences)}:oldReferences(row));
 if(key==='entries')return value.map(e=>e.id!=='thule'?e:Object.fromEntries(Object.keys(e).map(k=>[k,k==='phases'?structuredClone(saved.entry.phases.filter(p=>p.from<end)):structuredClone(saved.entry[k])])));
 if(key==='events')return value.filter(e=>!e.id.startsWith('arctic-review-'));
 if(key!=='areas')return value;
 const rows=value.filter(a=>a.entry!=='thule'),present=new Set(rows.map(a=>a.id));
 for(const a of saved.areas.filter(a=>a.from<end)){
  const index=saved.areaOrder.indexOf(a.id),prev=saved.areaOrder.slice(0,index).reverse().find(id=>present.has(id));
  const at=prev?rows.findIndex(r=>r.id===prev)+1:0;rows.splice(at,0,structuredClone(a));present.add(a.id);
 }
 return rows;
};
