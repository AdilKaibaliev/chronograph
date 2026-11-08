'use strict';
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const patches=[...require('./frontiers-137.json').coast,...require('./frontiers-138.json').coast];
const bounds=r=>r.reduce((b,[x,y])=>[Math.min(b[0],x),Math.min(b[1],y),Math.max(b[2],x),Math.max(b[3],y)],[Infinity,Infinity,-Infinity,-Infinity]);
const overlaps=([x,y,X,Y],[u,v,U,V])=>x<U&&u<X&&y<V&&v<Y;
const box=([w,s,e,n])=>[[[w,s],[e,s],[e,n],[w,n],[w,s]]];
// Replace the same physical coastline for the background and the political
// clipping tiles. Local windows never become visible political boundaries.
function apply(rings,tile){
 let result=rings;
 for(const p of patches){
   if(tile&&!overlaps(tile,p.box))continue;
   const affected=[],other=[];
   for(const ring of result)(overlaps(bounds(ring),p.box)?affected:other).push(ring);
   const outside=clip.difference(G.multi(affected),box(p.box));
   const fine=tile?clip.intersection(G.multi(p.land),box(tile)):G.multi(p.land);
   result=other.concat(clip.union(outside,fine).flatMap(poly=>poly.map(r=>r.slice(0,-1))));
 }
 return result;
}
module.exports={apply,patches};
