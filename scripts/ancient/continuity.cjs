'use strict';
// The initial 610 frame is a cartographic reference, not the foundation of its
// states. Reconcile the existing source intervals which cross that cut-off.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const G=require('../world/cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const pairs={'roman-east':'byzantine',sasanian:'sasanian',sui:'sui','turk-west':'westernTurkic','turk-east':'easternTurkic',franks:'franks',visigoth:'visigoths',lombard:'lombards',aksum:'aksum'};
module.exports=function continuity(boundaries,legacy,empires,world){
 const bridges=[];
 const front=[[[[36,30],[48,30],[48,44],[36,44],[36,30]]]];
 for(const [id,legacyId]of Object.entries(pairs)){
  const r=boundaries.records.find(r=>r.id===id&&r.to===609),e=empires.find(e=>e.id===legacyId),f=legacy.frames[legacyId].filter(f=>f[0]<=610).at(-1);
  if(!r||r.sourceTo<610||!f)throw Error('No source interval spanning 609/610 for '+id);
  const geometry=G.multi(legacy.shapes[f[1]]),common={id,legacyId,from:r.from,to:609,anchor:e.keyframes.filter(f=>f.year<=610).at(-1)?.label||e.label,color:e.color,referenceYear:610};
  // Keep the earlier eastern war front until the capture of Edessa (609).
  // Stable western provinces use the same reference outline on both sides.
  if(['roman-east','sasanian'].includes(id)){
   bridges.push({...common,to:608,geometry:clip.union(clip.difference(geometry,front),clip.intersection(r.geometry,front))});
   bridges.push({...common,from:609,geometry});
  }else if(id==='sui'){
   // Sui's Tuyuhun campaign belongs to 609, not the start of this source slice.
   const west=[[[[88,30],[103,30],[103,42],[88,42],[88,30]]]];
   bridges.push({...common,to:608,geometry:clip.union(clip.difference(geometry,west),clip.intersection(r.geometry,west))});
   bridges.push({...common,from:609,geometry});
  }else bridges.push({...common,geometry});
 }
 const h=require('../world/core.js').createWorldHistory(world);
 for(const [id,entry]of [['makuria','dongola'],['alodia','alwa']]){
  const r=boundaries.records.find(r=>r.id===id&&r.to===609),a=h.mapAreasAt(610).find(a=>a.entry===entry);
  bridges.push({id,entry,from:r.from,to:609,geometry:G.multi(a.polygons),anchor:a.label||r.anchor,color:a.color,referenceYear:610});
 }
 const supplement=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../../research/ancient-continuity.json.gz'))));
 for(const r of supplement.records){const shell=r.geometry.reduce((a,p)=>Math.abs(G.signed(a[0]))>Math.abs(G.signed(p[0]))?a:p),xs=shell[0].map(p=>p[0]),ys=shell[0].map(p=>p[1]);r.areaDegrees=r.geometry.reduce((n,p)=>n+Math.abs(G.signed(p[0]))-p.slice(1).reduce((s,r)=>s+Math.abs(G.signed(r)),0),0);let anchor=null;for(let i=1;i<10&&!anchor;i++)for(let j=1;j<10&&!anchor;j++){const p=[Math.min(...xs)+(Math.max(...xs)-Math.min(...xs))*i/10,Math.min(...ys)+(Math.max(...ys)-Math.min(...ys))*j/10];if(G.inside(shell[0],p)&&!shell.slice(1).some(r=>G.inside(r,p)))anchor=p;}r.anchor=boundaries.records.find(a=>a.id===r.id&&a.sourceFrom===r.sourceFrom)?.anchor||anchor||shell[0][0];}
 return {bridges,supplement,frontierEntities:['avar','goguryeo','nobatia','chalukya'],sources:[boundaries.source.title,'James Howard-Johnston. Ḵosrow II. Encyclopaedia Iranica.','Yu Taishan. The Sui Dynasty and the Western Regions. Sino-Platonic Papers 247, 2014.']};
};
