'use strict';
// Before the regional bibliography was corrected, these IDs collided.
// Reproduce only that old naming convention when comparing saved releases.
const aliases={to1789CentralAfrica:'to1789Central',to1789DutchAmerica:'to1789Dutch'};
function references(row){
 if(row.sources?.some(id=>aliases[id]))return {...row,sources:row.sources.map(id=>aliases[id]||id)};
 return row;
}
module.exports=function archivedSources(value,key){
 if(key==='sources'){
  const old=Object.fromEntries(Object.entries(value).filter(([id])=>!aliases[id]));
  for(const [id,alias] of Object.entries(aliases))if(value[id])old[alias]=value[id];
  return old;
 }
 return value.map(row=>row.phases?{...references(row),phases:row.phases.map(references)}:references(row));
};
