'use strict';
const {merge}=require('./cartography-geometry.cjs');
const {legacyGeometry}=require('./cartography-reviewed.cjs');
const {prepare}=require('./outline-policy.cjs');
// Dissolve existing extents at build time. This never interpolates a frontier
// or bridges two separated possessions. The source reconstructions stay intact.
module.exports=empires=>{
 const fs=require('node:fs'),path=require('node:path'),hash=require('node:crypto').createHash('sha256').update(JSON.stringify(empires));
 for(const file of ['cartography-legacy.cjs','cartography-reviewed.cjs','mongol-frontiers.cjs','coast-geometry.cjs','cartography-geometry.cjs','outline-policy.cjs','land-coasts.json','land-coast-tiles.json'])hash.update(fs.readFileSync(path.join(__dirname,file)));
 const key=hash.digest('hex'),cachePath=path.join(__dirname,'../../.local-checks/legacy-cartography-cache.json');
 if(empires.length>1&&fs.existsSync(cachePath)){const saved=JSON.parse(fs.readFileSync(cachePath));if(saved.key===key)return saved.value;}
 const shapes=[],ids=new Map(),frames={};
 const shape=p=>{const key=JSON.stringify(p);if(!ids.has(key)){ids.set(key,shapes.length);shapes.push(p);}return ids.get(key);};
 const coast=require('./coast-geometry.cjs');
 for(const e of empires){
  frames[e.id]=e.keyframes.map(f=>[f.year,shape(coast(prepare(legacyGeometry(e.id,f.year,f.polys),{dissolved:true})))]);
  if(e.keyframes.some(f=>f.corePolys))frames[e.id+'Core']=e.keyframes.map(f=>[f.year,shape(coast(require('./cartography-geometry.cjs').union(f.corePolys||[])))]);
  if(e.keyframes.some(f=>f.dependentPolys))frames[e.id+'Dependencies']=e.keyframes.map(f=>[f.year,shape(coast(require('./cartography-geometry.cjs').merge([f.dependentPolys||[]])))]);
 }
 const mongol=new Set(['mongol','yuan','chagatai','goldenHorde','ilkhanate','mongolSiberia','mongolTibet','mongolKorea','rusTribute']);
 const members=empires.filter(e=>mongol.has(e.id));
 const years=[...new Set([1206,...members.flatMap(e=>[e.from,e.to+1,...e.keyframes.map(f=>f.year)])])].filter(y=>y>=1206&&y<=1299).sort((a,b)=>a-b);
 frames.mongolRealm=[];frames.mongolDependencies=[];
 for(const y of years){const states=members.flatMap(e=>{const f=e.keyframes.filter(f=>f.year<=y).at(-1);return f&&!f.hidden&&y>=e.from&&y<=e.to?[{...e,...f,polys:legacyGeometry(e.id,y,f.polys)}]:[];});frames.mongolRealm.push([y,shape(coast(merge(states.filter(e=>e.type!=='influence').map(e=>e.polys))))]);frames.mongolDependencies.push([y,shape(coast(merge(states.filter(e=>e.type==='influence').map(e=>e.polys))))]);}
 const value={shapes,frames,outlinePolicy:{version:1,profiles:empires.map(e=>e.id).sort()}};
 if(empires.length>1){fs.mkdirSync(path.dirname(cachePath),{recursive:true});fs.writeFileSync(cachePath,JSON.stringify({key,value}));}
 return value;
};
