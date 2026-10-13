'use strict';
// Diagnostic only: an intersecting reconstruction is a review candidate, not
// proof of sovereignty, occupation, or an error. Includes BOTH map engines.
const fs=require('node:fs'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]);
const es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const h=require('./core.js').createWorldHistory(c),visible=require('./legacy-presentation.js').legacyStateVisible;
const mongol=new Set(['mongol','yuan','chagatai','goldenHorde','ilkhanate','mongolSiberia','mongolTibet','mongolKorea','rusTribute']);
const cache=new Map(),seen=new Set(),overlaps=[],empty=[],geometryErrors=[];
function geometry(a){if(cache.has(a.key))return cache.get(a.key);const points=a.polygons.flat(),v={multi:G.multi(a.polygons),bounds:[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))]};cache.set(a.key,v);return v;}
function early(y){return es.flatMap(e=>{const f=e.keyframes.filter(f=>f.year<=y).at(-1);if(y<e.from||y>e.to||!visible(e.id,y)||!f||f.hidden||f.legacyContext||['influence','population','reference'].includes(f.type||e.type))return[];const g=l.frames[e.id].filter(g=>g[0]<=y).at(-1);return[{entry:e.id,key:'legacy:'+g[1],polygons:l.shapes[g[1]],mongolGroup:mongol.has(e.id),until:e.to}];});}
for(let y=610;y<=2026;y++){
 const all=h.mapAreasAt(y),world=all.filter(a=>!a.sovereign&&!a.overlord&&!a.cartographicOverlay&&a.kind==='polity').map(a=>({...a,key:'world:'+a.geometryId,until:a.to-1}));
 const rows=[...world,...(y<1300?early(y):[])];if(!rows.length)empty.push(y);
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j];if(a.mongolGroup&&b.mongolGroup)continue;
  const key=[a.key,b.key].sort().join('|');if(seen.has(key))continue;
  try{const A=geometry(a),B=geometry(b),x=A.bounds,z=B.bounds;if(x[0]>=z[2]||x[2]<=z[0]||x[1]>=z[3]||x[3]<=z[1])continue;seen.add(key);
   const size=Math.abs(clip.intersection(A.multi,B.multi).flat().reduce((n,r)=>n+G.signed(r),0));if(size>.001)overlaps.push({year:y,until:Math.min(a.until,b.until),a:a.entry,b:b.entry,areaDegreesSquared:+size.toFixed(4)});
  }catch(error){geometryErrors.push({year:y,a:a.entry,b:b.entry,error:error.message});}
 }
}
overlaps.sort((a,b)=>b.areaDegreesSquared-a.areaDegreesSquared);
const report={version:html.match(/name="chronograph-version" content="([^"]+)/)[1],years:1417,pairs:seen.size,empty,geometryErrors,scope:'Both engines and their cross-pairs; solid independent political areas only. Claims, dependencies, population and unified Mongol members excluded. Candidates are not automatically adjudicated historical errors.',overlaps};
const dest=process.argv[2]||'verification-frontier-audit.json';fs.writeFileSync(dest,JSON.stringify(report,null,2));
console.log(JSON.stringify({years:report.years,pairs:report.pairs,empty,geometryErrors:geometryErrors.length,candidates:overlaps.length,largest:overlaps.slice(0,12)}));
if(empty.length||geometryErrors.length)process.exitCode=1;
