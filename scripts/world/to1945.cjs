'use strict';
// Annual snapshots: major changes within a year are described in the dated card.
// Earlier catalogue records are immutable; this module adds only 1940 onward.
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1940,max:1945}),geo=require('./cartography-geometry.cjs'),T=s=>Array.isArray(s)?s:s.split('|');
 const before=new Map(c.entries.flatMap(e=>{const p=e.phases.find(p=>p.from<=1939&&1939<p.to),a=c.areas.find(a=>a.entry===e.id&&a.from<=1939&&1939<a.to);return p&&a?[[e.id,{entry:e,phase:structuredClone(p),area:structuredClone(a)}]]:[];}));
 const canonical=p=>geo.signed(p[0])<0?geo.union(p):p;
 const G=id=>{const a=before.get(id)?.area;if(!a)throw Error('Unknown 1939 geography '+id);return structuredClone(c.cartography.shapes[c.cartography.areas[a.id]]||canonical(a.polygons));};
 for(const[id,b]of before){b.entry.phases.push({...structuredClone(b.phase),from:1940,to:1946,period:T('1940–1945|1940–1945|1940–1945')});c.areas.push({...structuredClone(b.area),id:id+'-1940',from:1940,to:1946,polygons:G(id),points:G(id)[0]});}
 const revised=new Set(),relations=[];
 const source=(id,title,urls)=>H.source('to1945'+id,title,urls);
 function set(id,rows,meta={}){
  revised.add(id);let e=c.entries.find(e=>e.id===id);const prior=before.get(id);
  if(!e)e=H.entry(id,meta.region||'eurasia',meta.kind||'state',meta.coord,T(meta.name||rows[0][2]),[]);
  if(meta.centralAsia)e.centralAsia=true;
  e.phases=e.phases.filter(p=>p.from<1940);c.areas=c.areas.filter(a=>a.entry!==id||a.from<1940);
  for(const[from,to,name,text,poly,kind]of rows){
   const sources=meta.sources?.map(s=>'to1945'+s)||prior?.phase.sources;if(!sources?.length)throw Error('Missing wartime source '+id);
   e.phases.push(H.phase(from,to,T(name),T(text),sources,{name:T(name),approx:false,coord:meta.coord||prior?.phase.coord||e.coord}));
   const a=H.area(id,from,to,(poly||G(id)).filter(r=>Math.abs(geo.signed(r))>0.000005),{name:T(name),kind:kind||prior?.area.kind||'polity',color:meta.color||prior?.area.color||'#ada06e',sources});a.label=meta.label||meta.coord||prior?.area.label||e.coord;
  }
 }
 const end=(id,to)=>{revised.add(id);const e=c.entries.find(e=>e.id===id);e.phases=e.phases.filter(p=>p.from<to);for(const p of e.phases)if(p.from>=1940){p.to=Math.min(to,p.to);p.period=Array(3).fill(p.from===p.to-1?String(p.from):p.from+'–'+(p.to-1));}c.areas=c.areas.filter(a=>a.entry!==id||a.from<to);for(const a of c.areas)if(a.entry===id&&a.from>=1940)a.to=Math.min(to,a.to);};
 const link=(owner,member,from=1940,to=1946,relationship='province',extent=true)=>relations.push({owner,member,from,to,relationship,extent});
 const event=(id,y,entry,title,text,coord,src,kind='politics')=>H.event('1945-event-'+id,y,entry,kind,coord,T(title),T(text),src.map(s=>'to1945'+s));
 const ring=p=>geo.union([p]),box=(a,b,d,e)=>ring([[a,b],[d,b],[d,e],[a,e]]);
 const ctx={...H,T,G,set,end,source,event,ring,box,before,link,geo,relations};
 for(const part of ['europe','asia','world','occupation-review'])require('./to1945-'+part+'.cjs')(c,ctx);
 // Continue explicit non-wartime ownership, then apply dated wartime replacements.
 const stop=new Set();
 const override=new Set(relations.map(r=>r.member));
 
 for(const r of c.cartography.relations.filter(r=>r.to===1940&&!stop.has(r.owner)&&!override.has(r.member))){
  if(!c.entries.find(e=>e.id===r.owner)?.phases.some(p=>p.from>=1940)||!c.entries.find(e=>e.id===r.member)?.phases.some(p=>p.from>=1940))continue;
  link(r.owner,r.member,1940,['late-hre','japan'].includes(r.owner)?1945:1946,r.relationship,r.extent);
 }
 c.cartography.relations.push(...relations);
 const active=(id,y)=>c.areas.find(a=>a.entry===id&&a.from<=y&&y<a.to);
 const roots=new Set(relations.map(r=>r.owner));
 for(const owner of roots){
  const cuts=[...new Set([1940,1946,...c.areas.filter(a=>a.entry===owner&&a.from>=1940).flatMap(a=>[a.from,a.to]),...relations.filter(r=>r.owner===owner).flatMap(r=>[r.from,r.to,...c.areas.filter(a=>a.entry===r.member&&a.from>=1940).flatMap(a=>[a.from,a.to])])])].sort((a,b)=>a-b);
  for(let i=0;i<cuts.length-1;i++){
   const from=cuts[i],to=cuts[i+1],a=active(owner,from);if(!a||from<1940||from>=1946)continue;
   const live=relations.filter(r=>r.owner===owner&&r.from<=from&&from<r.to&&active(r.member,from));
   const direct=live.filter(r=>r.relationship==='province'),deps=live.filter(r=>r.relationship!=='province');
   const polygons=geo.merge([canonical(a.polygons),...direct.filter(r=>r.extent).map(r=>canonical(active(r.member,from).polygons))]);
   c.outlines.push({...a,id:'to1945-outline-'+owner+'-'+from,from,to,polygons,points:polygons[0],members:direct.map(r=>r.member),dependencies:Object.fromEntries(deps.map(r=>[r.member,r.relationship])),short:a.name,cartographic:true,worldFocus:['1789-great-britain','1789-usa','late-france','japan','early-dutch','late-portugal'].includes(owner)});
  }
 }
 c.to1945Review={revised:[...revised],continuing:[...before.keys()].filter(id=>!revised.has(id))};c.range={min:610,max:1945};return c;
};
