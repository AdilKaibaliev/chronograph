'use strict';
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const {createWorldHistory}=require('./core.js'),{legacyStateVisible}=require('./legacy-presentation.js');
const mongol=new Set(['mongol','yuan','chagatai','goldenHorde','ilkhanate','mongolSiberia','mongolTibet','mongolKorea','rusTribute']);
const tolerance=.000005;
const flatten=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1).map(pt=>pt.map(n=>+n.toFixed(8))))).filter(r=>Math.abs(G.signed(r))>1e-10);
const surface=m=>Math.abs(m.flat().reduce((a,r)=>a+G.signed(r),0));
function compile(c,empires,legacy){
 const h=createWorldHistory(c),shapes=[],shapeIds=new Map(),frames=[],frameIds=new Map(),geometry=new WeakMap(),pairCache=new Map(),signatureCache=new Map(),cutCache=new Map();
 let serial=0;
 function info(p){if(geometry.has(p))return geometry.get(p);
  const b=[180,90,-180,-90];for(const r of p)for(const [x,y] of r){b[0]=Math.min(x,b[0]);b[1]=Math.min(y,b[1]);b[2]=Math.max(x,b[2]);b[3]=Math.max(y,b[3]);}
  const v={b,p,m:G.multi(p),key:serial++};geometry.set(p,v);return v;}
 function intern(p){const k=JSON.stringify(p);if(!shapeIds.has(k)){shapeIds.set(k,shapes.length);shapes.push(p);}return shapeIds.get(k);}
 function overlap(a,b){
  const key=a.key<b.key?a.key+'|'+b.key:b.key+'|'+a.key;if(pairCache.has(key))return pairCache.get(key);
  const polygon=clip.intersection(a.m,b.m),id=surface(polygon)>tolerance?intern(flatten(polygon)):-1;pairCache.set(key,id);return id;
 }
 function sharedCut(cuts){
  const ids=[...new Set(cuts)].sort((a,b)=>a-b);if(ids.length===1)return ids[0];
  const key=ids.join(',');
  if(!cutCache.has(key))cutCache.set(key,intern(G.merge(ids.map(id=>shapes[id]))));
  return cutCache.get(key);
 }
 function frame(rows){
  rows.sort((a,b)=>a.id.localeCompare(b.id));
  const signature=rows.map(r=>r.id+':'+r.g.key).join('/');
  if(signatureCache.has(signature))return signatureCache.get(signature);
  const sorted=rows.slice().sort((a,b)=>a.g.b[0]-b.g.b[0]),cuts=new Map(),zones=[];
  for(let i=0;i<sorted.length;i++){const a=sorted[i],A=a.g.b;
   for(let j=i+1;j<sorted.length;j++){const b=sorted[j],B=b.g.b;if(B[0]>=A[2])break;
    if(A[1]>=B[3]||A[3]<=B[1]||a.id===b.id||a.member&&b.member)continue;
    const idx=overlap(a.g,b.g);if(idx<0)continue;const names=[a.id,b.id].sort();
    zones.push([...names,idx]);for(const r of [a,b]){if(!cuts.has(r.id))cuts.set(r.id,[]);cuts.get(r.id).push(idx);}
   }
  }
  const paint={};for(const r of rows)if(cuts.has(r.id))paint[r.id]=sharedCut(cuts.get(r.id));
  zones.sort((a,b)=>a[0].localeCompare(b[0])||a[1].localeCompare(b[1]));
  const value={paint,zones},fk=JSON.stringify(value);
  if(!frameIds.has(fk)){frameIds.set(fk,frames.length);frames.push(value);}
  const id=frameIds.get(fk);signatureCache.set(signature,id);return id;
 }
 const timeline={detailed:[],unified:[]};
 const put=(mode,y,n)=>{if(timeline[mode].at(-1)?.[1]!==n)timeline[mode].push([y,n]);};
 function earlyShape(id,y){const f=legacy.frames[id]?.filter(f=>f[0]<=y).at(-1);return f?legacy.shapes[f[1]]:[];}
 for(let y=610;y<=2026;y++){
  const all=h.mapAreasAt(y),world=all.filter(a=>['polity','influence'].includes(a.kind)&&!a.sovereign&&!a.overlord&&!a.cartographicOverlay).map(a=>({id:a.entry,g:info(a.polygons),member:Boolean(a.mongolGroup)}));
  const early=y<1300?empires.flatMap(e=>{
   if(y<e.from||y>e.to||!legacyStateVisible(e.id,y))return[];
   const f=e.keyframes.filter(f=>f.year<=y).at(-1);if(!f||f.hidden||f.legacyContext||['influence','population','reference'].includes(f.type||e.type))return[];
   return [{id:e.id,g:info(earlyShape(e.id,y)),member:mongol.has(e.id)}];
  }):[];
  const separate=world.concat(early),d=frame(separate);put('detailed',y,d);
  let unified;
  if(early.some(a=>a.member)){
   const p=earlyShape('mongolRealm',y);if(p.length)unified=separate.filter(a=>!mongol.has(a.id)).concat({id:'mongolRealm',g:info(p),member:true});
  }else if(all.filter(a=>a.mongolGroup).length===4){
   const p=all.find(a=>a.entry==='late-yuan')?.mongolUnion;if(p?.length)unified=separate.filter(a=>!a.member).concat({id:'worldMongolRealm',g:info(p),member:true});
  }
  put('unified',y,unified?frame(unified):d);
 }
 return {version:1,tolerance,shapes,frames,timeline};
}
module.exports=function buildEvidence(c,empires,legacy){
 const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
 const digest=crypto.createHash('sha256').update(fs.readFileSync(__filename)).update(fs.readFileSync(require.resolve('./core.js'))).update(fs.readFileSync(require.resolve('./legacy-presentation.js')));
 for(const item of [c.areas,c.entries.map(e=>[e.id,e.phases.map(p=>[p.from,p.to])]),c.outlines,c.cartography,c.displayCartography,empires,legacy])digest.update(JSON.stringify(item));
 const key=digest.digest('hex'),file=path.join(__dirname,'../../.local-checks/border-evidence-cache.json');
 if(fs.existsSync(file)){const saved=JSON.parse(fs.readFileSync(file));if(saved.key===key)return saved.table;}
 const table=compile(c,empires,legacy);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify({key,table}));return table;
};

