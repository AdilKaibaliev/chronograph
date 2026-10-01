'use strict';
const {merge}=require('./cartography-geometry.cjs');
const {legacyGeometry}=require('./cartography-reviewed.cjs');
// Dissolve existing extents at build time. This never interpolates a frontier
// or bridges two separated possessions. The source reconstructions stay intact.
module.exports=empires=>{
 const shapes=[],ids=new Map(),frames={};
 const shape=p=>{const key=JSON.stringify(p);if(!ids.has(key)){ids.set(key,shapes.length);shapes.push(p);}return ids.get(key);};
 for(const e of empires)frames[e.id]=e.keyframes.map(f=>[f.year,shape(legacyGeometry(e.id,f.year,f.polys))]);
 const mongol=new Set(['mongol','yuan','chagatai','goldenHorde','ilkhanate','mongolSiberia','mongolTibet','mongolKorea','rusTribute']);
 const members=empires.filter(e=>mongol.has(e.id));
 const years=[...new Set([1206,...members.flatMap(e=>[e.from,e.to+1,...e.keyframes.map(f=>f.year)])])].filter(y=>y>=1206&&y<=1299).sort((a,b)=>a-b);
 frames.mongolRealm=[];frames.mongolDependencies=[];
 for(const y of years){const states=members.flatMap(e=>{const f=e.keyframes.filter(f=>f.year<=y).at(-1);return f&&!f.hidden&&y>=e.from&&y<=e.to?[{...e,...f,polys:legacyGeometry(e.id,y,f.polys)}]:[];});frames.mongolRealm.push([y,shape(merge(states.filter(e=>e.type!=='influence').map(e=>e.polys)))]);frames.mongolDependencies.push([y,shape(merge(states.filter(e=>e.type==='influence').map(e=>e.polys)))]);}
 return {shapes,frames};
};
