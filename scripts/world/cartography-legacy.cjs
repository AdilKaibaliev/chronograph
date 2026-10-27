'use strict';
const {merge}=require('./cartography-geometry.cjs');
const {legacyGeometry}=require('./cartography-reviewed.cjs');
const {prepare}=require('./outline-policy.cjs');
// Dissolve existing extents at build time. This never interpolates a frontier
// or bridges two separated possessions. The source reconstructions stay intact.
module.exports=empires=>{
 const review=require('./legacy-frontiers.cjs').compiler(empires);empires=review.empires;
 const fs=require('node:fs'),path=require('node:path'),hash=require('node:crypto').createHash('sha256').update(JSON.stringify(empires));
 for(const file of ['cartography-legacy.cjs','legacy-frontiers.cjs','early-boundary-review.cjs','mediterranean-review.cjs','anatolian-review.cjs','europe-central-review.cjs','arabia-khitai-review.cjs','cartography-reviewed.cjs','qing-stages.cjs','mongol-frontiers.cjs','coast-geometry.cjs','cartography-geometry.cjs','outline-policy.cjs','land-coasts.json','land-coast-tiles.json'])hash.update(fs.readFileSync(path.join(__dirname,file)));
 const key=hash.digest('hex'),cachePath=path.join(__dirname,'../../.local-checks/legacy-cartography-cache.json');
 if(empires.length>1&&fs.existsSync(cachePath)){const saved=JSON.parse(fs.readFileSync(cachePath));if(saved.key===key)return saved.value;}
 const shapes=[],ids=new Map(),frames={};
 const shape=p=>{const key=JSON.stringify(p);if(!ids.has(key)){ids.set(key,shapes.length);shapes.push(p);}return ids.get(key);};
 const coast=require('./coast-geometry.cjs');
 for(const e of empires){
  const rules=require('./legacy-frontiers.cjs').rules.filter(r=>r[0]===e.id);
  const dates=[...new Set([...e.keyframes.map(f=>f.year),...review.years.filter(y=>y>=e.from&&y<=e.to&&rules.some(r=>y>=r[2]&&y<=r[3]))])].sort((a,b)=>a-b);
  frames[e.id]=dates.map(y=>{try{return[y,shape(coast(prepare(review.shape(e.id,y),{dissolved:true})))];}catch(error){throw Error(e.id+' '+y+': '+error.message);}});
  if(e.keyframes.some(f=>f.corePolys))frames[e.id+'Core']=e.keyframes.map(f=>[f.year,shape(coast(require('./cartography-geometry.cjs').union(f.corePolys||[])))]);
  if(e.keyframes.some(f=>f.dependentPolys))frames[e.id+'Dependencies']=e.keyframes.map(f=>[f.year,shape(coast(require('./cartography-geometry.cjs').merge([f.dependentPolys||[]])))]);
 }
 const mongol=new Set(['mongol','yuan','chagatai','goldenHorde','ilkhanate','mongolSiberia','mongolTibet','mongolKorea','rusTribute']);
 const members=empires.filter(e=>mongol.has(e.id));
 const memberRules=require('./legacy-frontiers.cjs').rules.filter(r=>mongol.has(r[0]));
 const years=[...new Set([1206,...members.flatMap(e=>[e.from,e.to+1,...e.keyframes.map(f=>f.year)]),...review.years.filter(y=>memberRules.some(r=>y>=r[2]&&y<=r[3]))])].filter(y=>y>=1206&&y<=1299).sort((a,b)=>a-b);
 frames.mongolRealm=[];frames.mongolDependencies=[];
 for(const y of years){const states=members.flatMap(e=>{const f=e.keyframes.filter(f=>f.year<=y).at(-1);return f&&!f.hidden&&y>=e.from&&y<=e.to?[{...e,...f,polys:review.shape(e.id,y)}]:[];});frames.mongolRealm.push([y,shape(coast(merge(states.filter(e=>e.type!=='influence').map(e=>e.polys))))]);frames.mongolDependencies.push([y,shape(coast(merge(states.filter(e=>e.type==='influence').map(e=>e.polys))))]);}
 const value={shapes,frames,outlinePolicy:{version:1,profiles:empires.map(e=>e.id).sort()}};
 if(empires.length>1){fs.mkdirSync(path.dirname(cachePath),{recursive:true});fs.writeFileSync(cachePath,JSON.stringify({key,value}));}
 return value;
};
