'use strict';
const assert=require('node:assert/strict'),clip=require('../vendor/polygon-clipping.cjs'),G=require('./cartography-geometry.cjs');
const coast=[...require('./frontiers-138.json').coast,...require('./frontiers-140.json').coast,...require('./frontiers-141.json').coast,...require('./gshhg/harbours-141.json').coast];
module.exports=function compareWithCoastRevision(previous,current){
 // Restrict admissible differences to land actually gained or lost inside
 // the surveyed shore window, including for a much earlier cultural outline.
 const bounds=coast.map(({box:[w,s,e,n]})=>[[[w,s],[e,s],[e,n],[w,n],[w,s]]]);
 const inside=data=>clip.intersection(G.multi(data.displayCartography.land),clip.union(...bounds));
 const coastalChange=clip.xor(inside(previous),inside(current));
 return (actual,expected,location)=>{
  if(JSON.stringify(actual)===JSON.stringify(expected))return;
  const difference=clip.xor(G.multi(actual),G.multi(expected));
  const outside=clip.difference(difference,coastalChange);
  const area=Math.abs(outside.flat().reduce((sum,ring)=>sum+G.signed(ring),0));
  assert(area<.000005,'Geometry changed beyond the revised coastline at '+location+' ('+area+')');
 };
};
