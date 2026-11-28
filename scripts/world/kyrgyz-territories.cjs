'use strict';
// Presentation catalogue: reuse dated, reviewed evidence; do not extend an
// observation interval or manufacture a state boundary from an ethnic label.
const G=require('./cartography-geometry.cjs');
const clip=require('../vendor/polygon-clipping.cjs');
module.exports=function buildKyrgyzTerritories(world,empires,frontiers,ancient,study,textRow){
 const records=[],shapes=[],shapeIds=new Map(),history=require('./core.js').createWorldHistory(world);
 const tr=s=>Array.isArray(s)?s:textRow(s),source=ids=>[...new Set((ids||[]).map(id=>world.sources[id]?.title||frontiers.sources[id]||id).filter(Boolean))];
 const shape=p=>{const key=JSON.stringify(p);if(!shapeIds.has(key)){shapeIds.set(key,shapes.length);shapes.push(p);}return shapeIds.get(key);};
 const add=r=>{if(r.from>=r.to)return;if(r.polygons?.length){r.shape=shape(r.polygons);delete r.polygons;}records.push(r);};
 for(const e of empires.filter(e=>['yeniseiKyrgyz','kyrgyzKhaganate','kyrgyzMongol'].includes(e.id))){
  const keys=e.keyframes.slice().sort((a,b)=>a.year-b.year);
  keys.forEach((f,i)=>{if(f.hidden)return;const from=Math.max(e.from,f.year),to=Math.min(e.to+1,keys[i+1]?.year??e.to+1),kind=e.id==='kyrgyzKhaganate'?'core':e.id==='yeniseiKyrgyz'&&from>=820?'core':'community';
   const base={id:e.id+'-'+from,from,to,kind,title:tr(f.name||f.short||e.name),text:tr(f.body||e.body),coord:f.label||e.label,sources:[f.source||e.source],approx:true,origin:e.id};
   add({...base,polygons:f.polys});
   if(f.dependentPolys?.length)add({...base,id:base.id+'-reach',kind:'influence',title:tr('Военно-политический охват · IX век'),polygons:f.dependentPolys});
  });
 }
 const late=world.entries.find(e=>e.id==='late-kyrgyz'),tian=world.entries.find(e=>e.id==='late-kyrgyz-tianshan');
 // Continue the Yuan-era Yenisei geography across the 1299/1300 seam.
 const yuan=history.mapAreasAt(1300).find(a=>a.entry===late.id),phase=late.phases.find(p=>p.from===1300);
 add({id:'yenisei-yuan',from:1300,to:1368,kind:'community',title:phase.title,text:phase.text,coord:yuan.label,polygons:yuan.polygons,sources:source(phase.sources),approx:true,origin:late.id});
 for(const r of frontiers.records.filter(r=>r.polygons?.length))add({...r,id:'region-'+r.id,kind:'community',sources:r.sources.map(id=>frontiers.sources[id]),origin:'residence-'+r.id});
 // Cultural sketches flagged markers-only remain points before administrative
// status begins in 1924. They never become a fictitious medieval state fill.
 const dates=[...new Set([...tian.phases.flatMap(p=>[p.from,p.to]),...world.areas.filter(a=>a.entry===tian.id&&a.from>=1924).flatMap(a=>[a.from,a.to])])].sort((a,b)=>a-b);
 for(let i=0;i<dates.length-1;i++){
  const from=dates[i],to=dates[i+1],p=tian.phases.find(p=>p.from<=from&&from<p.to);if(!p)continue;
  const area=history.mapAreasAt(from).find(a=>a.entry===tian.id);
  const base={id:'tianshan-'+from,from,to,title:p.title,text:p.text,coord:area?.label||p.coord||tian.coord,sources:source(p.sources),approx:area?.approx!==false,origin:tian.id};
  if(from>=1924&&area?.polygons?.length){const parent=area.administrativeParent&&history.mapAreasAt(from).find(a=>a.entry===area.administrativeParent);const polygons=parent?clip.intersection(G.multi(area.polygons),G.multi(parent.polygons)).flatMap(p=>p.map(r=>r.slice(0,-1))):area.polygons;add({...base,kind:from>=1991?'core':'administrative',polygons});}
  else add({...base,kind:'reference',fallback:true});
 }
 for(const r of ancient.records.filter(r=>r.kyrgyz))for(const [i,p]of(r.geographicReferences||[]).entries())add({id:r.id+'-'+i,from:r.from,to:r.to,kind:'reference',title:p.label||p.title||r.title,text:r.text,coord:p.coord,sources:(r.sources||[]).map(id=>ancient.sources[id]?.title).filter(Boolean),approx:true,origin:r.id});
 const cuts=[...new Set(records.flatMap(r=>[r.from,r.to]))].sort((a,b)=>a-b),frames=[];
 for(let i=0;i<cuts.length-1;i++){
  const from=cuts[i],to=cuts[i+1],active=records.filter(r=>r.from<=from&&from<r.to),territories=active.filter(r=>Number.isInteger(r.shape));
  const rows=active.filter(r=>!r.fallback||!territories.some(a=>a.coord?.[0]<85&&a.coord?.[1]<46));
  const layers=[];let painted=[];
  for(const kind of ['core','administrative','community','influence']){
   const matching=territories.filter(r=>r.kind===kind);if(!matching.length)continue;
   let p=G.merge(matching.map(r=>shapes[r.shape]));if(painted.length)p=G.difference(p,painted);if(!p.length)continue;
   layers.push({kind,shape:shape(p)});painted=G.merge([painted,p]);
  }
  frames.push({from,to,records:rows.map(r=>r.id),layers});
 }
 return {version:1,records,shapes,frames};
};
