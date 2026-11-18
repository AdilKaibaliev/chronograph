'use strict';
const assert=require('node:assert/strict'),clip=require('../vendor/polygon-clipping.cjs'),G=require('./cartography-geometry.cjs');
const coast=[...require('./frontiers-138.json').coast,...require('./frontiers-140.json').coast,...require('./frontiers-141.json').coast,...require('./gshhg/harbours-141.json').coast];
module.exports=function compareWithCoastRevision(previous,current){
 // Restrict admissible differences to land actually gained or lost inside
 // the surveyed shore window, including for a much earlier cultural outline.
 const bounds=coast.map(({box:[w,s,e,n]})=>[[[w,s],[e,s],[e,n],[w,n],[w,s]]]);
 const inside=data=>clip.intersection(G.multi(data.displayCartography.land),clip.union(...bounds));
 const coastalChange=clip.xor(inside(previous),inside(current));
 // The archived fixtures predate the restoration of two missing islands.
 // Permit only additions on those exact land rings for the documented owner
 // and dates. Removals, other states and all other frontiers remain checked.
 const islands=require('./russia-treaty-geography.json');
 const islandReviews=[
  ['japan',1875,1945,'urup','st-petersburg-urup'],
  ['1939-ussr',1945,1992,'urup','urup-soviet-administration'],
  ['1991-russia',1991,2027,'urup','urup-successor-administration'],
  ['1789-usa',1867,2027,'baranof','baranof-after-alaska-transfer'],
  ['1914-alaska',1867,2027,'baranof','baranof-after-alaska-transfer']
 ];
 return (actual,expected,location)=>{
  if(JSON.stringify(actual)===JSON.stringify(expected))return;
  const difference=clip.xor(G.multi(actual),G.multi(expected));
  const match=/^(\d+) (\S+)$/.exec(location),year=match?+match[1]:NaN,entry=match?.[2];
  const approved=islandReviews.filter(([id,from,to,,reason])=>id===entry&&from<=year&&year<to&&current.russiaEmpireReview?.records.some(r=>r.entry===id&&r.from<=year&&year<r.to&&r.reason===reason));
  const additions=approved.flatMap(([, , ,key])=>clip.difference(G.multi(islands[key]),G.multi(expected)));
  const outside=clip.difference(difference,coastalChange,...(additions.length?[additions]:[]));
  const area=Math.abs(outside.flat().reduce((sum,ring)=>sum+G.signed(ring),0));
  assert(area<.000005,'Geometry changed beyond the revised coastline at '+location+' ('+area+')');
 };
};
