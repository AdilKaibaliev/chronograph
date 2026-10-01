'use strict';
// One cartographic contract for every territory, in both timeline engines.
// raw = independently digitised positive regions; dissolved = oriented rings
// with holes. Never infer ownership from proximity, colour, or present-day states.
const G=require('./cartography-geometry.cjs');
const cache=new Map();
function prepare(rings,{dissolved=false}={}){
 const key=Number(dissolved)+'|'+JSON.stringify(rings);
 if(cache.has(key))return cache.get(key);
 for(const r of rings)for(const p of r)if(p.length!==2||!p.every(Number.isFinite)||Math.abs(p[0])>180||Math.abs(p[1])>90)throw Error('Invalid historical coordinate');
 const value=dissolved?G.merge([rings]):G.union(rings);
 cache.set(key,value);return value;
}
function apply(c){
 const review=require('./cartography-reviewed.cjs');
 const byId=new Map(c.entries.map(e=>[e.id,e]));
 const cart=c.cartography||{shapes:[],areas:{},relations:[],mongol:[]};
 const shapeIds=new Map(cart.shapes.map((g,i)=>[JSON.stringify(g),i]));
 const intern=g=>{const k=JSON.stringify(g);if(!shapeIds.has(k)){shapeIds.set(k,cart.shapes.length);cart.shapes.push(g);}return shapeIds.get(k);};
 const coverage=[];
 for(const a of c.areas){
  const e=byId.get(a.entry);if(!e)throw Error('Missing territory profile '+a.entry);
  if(!(a.from<a.to)||!a.sources?.length)throw Error('Undated or unsourced territory '+a.id);
  // Apply the geographic review to ALL entries, including non-imperial states.
  // Recent frames already contain occupation/enclave holes; do not fill them.
  const existing=cart.areas[a.id];
  const rings=a.from<1919?review.geometry(a,a.from):(existing===undefined?a.polygons:cart.shapes[existing]);
  try{cart.areas[a.id]=intern(prepare(rings,{dissolved:!rings.length||G.signed(rings[0])>0}));}catch(err){throw Error(a.id+': '+err.message);}
  coverage.push([a.id,a.entry,a.from,a.to,a.kind,cart.areas[a.id]]);
 }
 // Every sovereign political profile gets the same outline path. Keeping these
 // frames separate from ownership outlines avoids duplicating timeline records.
 cart.outlinePolicy={version:1,frames:coverage,profiles:[...new Set(coverage.map(r=>r[1]))].sort()};
 c.cartography=cart;return c;
}
module.exports={prepare,apply};
