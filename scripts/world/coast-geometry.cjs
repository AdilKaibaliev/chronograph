'use strict';
// Coastline only: no present-day political border is used as a historic border.
// Natural Earth 1:50m land. Shared with the physical base layer, on every date.
const clip=require('../vendor/polygon-clipping.cjs'),G=require('./cartography-geometry.cjs');
// Pre-cut geographic tiles are a spatial index, not political subdivisions.
// Inland states intersect a few rectangles instead of all world coast vertices.
const land=require('./land-coast-tiles.json').map(t=>({...t,multi:G.multi(t.rings)})),cache=new Map();
module.exports=rings=>{
 const key=JSON.stringify(rings);if(cache.has(key))return cache.get(key);
 if(!rings.length)return [];
 const p=rings.flat(),xs=p.map(p=>p[0]),ys=p.map(p=>p[1]),b=[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
 const candidates=land.filter(t=>t.bounds[0]<=b[2]&&t.bounds[2]>=b[0]&&t.bounds[1]<=b[3]&&t.bounds[3]>=b[1]).flatMap(t=>t.multi);
 const out=candidates.length?clip.intersection(G.multi(rings),candidates).flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))):[];
 cache.set(key,out);return out;
};
