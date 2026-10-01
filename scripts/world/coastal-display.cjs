'use strict';
// Display geometry only. Historical extents and their dates remain in the catalogue.
// The shared, generalised land mask is not evidence for a historical land frontier.
const G=require('./cartography-geometry.cjs'),coast=require('./coast-geometry.cjs');
module.exports=c=>{
 const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
 const hash=crypto.createHash('sha256').update(JSON.stringify([c.areas,c.outlines,c.cartography]));
 for(const file of [__filename,path.join(__dirname,'outline-policy.cjs'),path.join(__dirname,'label-placement.cjs'),path.join(__dirname,'coast-geometry.cjs'),path.join(__dirname,'cartography-geometry.cjs'),path.join(__dirname,'land-coasts.json'),path.join(__dirname,'land-coast-tiles.json')])hash.update(fs.readFileSync(file));
 const key=hash.digest('hex'),cachePath=path.join(__dirname,'../../.local-checks/coastal-display-cache.json');
 if(fs.existsSync(cachePath)){const saved=JSON.parse(fs.readFileSync(cachePath));if(saved.key===key)return saved.display;}
 const shapes=[],ids=new Map(),areas={},mongol={},vicinities=[];
 const smallIslands=new Set(['early-motutapu','1789-greenland-posts','mabuyag','tonga','nanmadol','eastpolynesia','rapanui','samoa','palau','early-guam','1789-zanzibar','madagascar','1815-rangihoua','1815-sitka','1789-tasmania','1848-tahiti','1914-western-samoa','1914-american-samoa','1914-riau']);
 const vicinityRings=new Map(),byEntry=new Map();
 const shape=(rings,id,allowVicinity=false,supplement=[])=>{
  rings=rings.filter(r=>Math.abs(G.signed(r))>0.000005);
  try{rings=require('./outline-policy.cjs').prepare(rings,{dissolved:!rings.length||G.signed(rings[0])>0});}catch(err){throw Error(id+': '+err.message);}
  if(rings.length&&G.signed(rings[0])<0)rings=G.union(rings);
  let clipped=coast(rings).filter(r=>Math.abs(G.signed(r))>0.000005);
  // Islands smaller than the basemap resolution retain their local vicinity.
  // Never replace a mainland outline with an invented land bridge.
  const missing=allowVicinity?G.multi(rings).filter(p=>Math.abs(G.signed(p[0]))<6&&!coast(p).length):[];
  if(missing.length||supplement.length){clipped=G.merge([clipped,...missing,...supplement]);vicinities.push(id);vicinityRings.set(id,missing);}
  const key=JSON.stringify(clipped);if(!ids.has(key)){ids.set(key,shapes.length);shapes.push(clipped);}
  return ids.get(key);
 };
 for(const a of c.areas){const reviewed=c.cartography?.shapes[c.cartography.areas[a.id]];areas[a.id]=shape(reviewed||(a.from>=1919?a.polygons:G.union(a.polygons)),a.id,smallIslands.has(a.entry));if(!byEntry.has(a.entry))byEntry.set(a.entry,[]);byEntry.get(a.entry).push(a);}
 for(const a of c.outlines||[]){const islands=(a.members||[]).flatMap(id=>(byEntry.get(id)||[]).filter(p=>p.from<=a.from&&a.from<p.to).flatMap(p=>vicinityRings.get(p.id)||[]));areas[a.id]=shape(a.polygons,a.id,false,islands);}
 for(const f of c.cartography?.mongol||[])mongol[f.from]=shape(c.cartography.shapes[f.shape],'mongol-'+f.from);
 const labels={},placement=require('./label-placement.cjs'),labelCache=new Map();
 const empty=Object.keys(areas).filter(id=>!shapes[areas[id]].some(r=>G.signed(r)>0));if(empty.length)throw Error('Empty land intersection: '+empty.join(', '));
 for(const a of [...c.areas,...c.outlines]){
  const rings=shapes[areas[a.id]],largest=rings.filter(r=>G.signed(r)>0).sort((a,b)=>G.signed(b)-G.signed(a))[0];
  const xs=largest.map(p=>p[0]),ys=largest.map(p=>p[1]),preferred=a.label||[(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2];
  const k=areas[a.id]+'|'+preferred.join(',');
  if(!labelCache.has(k))labelCache.set(k,placement(rings,preferred));
  labels[a.id]=labelCache.get(k);
 }
 const display={shapes,areas,mongol,vicinities,labels,land:require('./land-coasts.json')};fs.mkdirSync(path.dirname(cachePath),{recursive:true});fs.writeFileSync(cachePath,JSON.stringify({key,display}));return display;
};
