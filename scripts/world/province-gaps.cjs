'use strict';
// Detect dated provincial land omitted from the sovereign's aggregate outline.
// Store only frame/entry references: the renderer reuses the original geometry.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),C=require('../vendor/clipper.cjs'),{createWorldHistory}=require('./core.js');
module.exports=c=>{
 const hash=crypto.createHash('sha256').update(fs.readFileSync(__filename)).update(fs.readFileSync(require.resolve('./core.js')));
 for(const v of [c.areas,c.outlines,c.cartography,c.displayCartography,c.entries.map(e=>[e.id,e.phases.map(p=>[p.from,p.to])])])hash.update(JSON.stringify(v));
 const key=hash.digest('hex'),file=path.join(__dirname,'../../.local-checks/province-gaps.json');
 if(fs.existsSync(file)){const old=JSON.parse(fs.readFileSync(file));if(old.key===key)return old.value;}
 const h=createWorldHistory(c),scale=1e6,cache=new Map(),ringCache=new WeakMap(),frames=[];let previous='';
 const rings=p=>{if(!ringCache.has(p))ringCache.set(p,p.map(r=>r.map(([x,y])=>({X:Math.round(x*scale),Y:Math.round(y*scale)}))));return ringCache.get(p);};
 for(let year=610;year<=2026;year++){
  const rows=h.mapAreasAt(year),parents=new Map(rows.map(a=>[a.entry,a])),missing=[];
  for(const a of rows){if(!a.sovereign||a.detachedProvince)continue;const parent=parents.get(a.sovereign);if(!parent)continue;
   const k=a.geometryId+'|'+parent.geometryId;if(!cache.has(k)){
    const engine=new C.Clipper(),solution=[];engine.AddPaths(rings(a.polygons),C.PolyType.ptSubject,true);engine.AddPaths(rings(parent.polygons),C.PolyType.ptClip,true);
    if(!engine.Execute(C.ClipType.ctDifference,solution,C.PolyFillType.pftNonZero,C.PolyFillType.pftNonZero))throw Error('Province comparison failed: '+k);
    cache.set(k,Math.abs(solution.reduce((s,r)=>s+C.Clipper.Area(r),0))/(scale*scale)>.000005);
   }
   if(cache.get(k))missing.push(a.entry);
  }
  missing.sort();const signature=missing.join('|');if(!frames.length||signature!==previous){frames.push([year,missing]);previous=signature;}
 }
 const value={version:1,frames,pairs:cache.size};fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify({key,value}));return value;
};
