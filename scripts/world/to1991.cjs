'use strict';
// End-of-year regional snapshots. Treaty dates and changes within a year live in cards.
// Pre-1961 records are never rewritten by this extension.
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1961,max:1991}),geo=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),T=s=>Array.isArray(s)?s:s.split('|');
 const before=new Map(c.entries.flatMap(e=>{const p=e.phases.find(p=>p.from<=1960&&1960<p.to),a=c.areas.find(a=>a.entry===e.id&&a.from<=1960&&1960<a.to);return p&&a?[[e.id,{entry:e,phase:structuredClone(p),area:structuredClone(a)}]]:[];}));
 const canonical=p=>geo.signed(p[0])<0?geo.union(p):p;
 const G=id=>{const a=before.get(id)?.area;if(!a)throw Error('Unknown 1960 geography '+id);return structuredClone(canonical(a.polygons));};
 for(const[id,b]of before){const polygons=G(id);b.entry.phases.push({...structuredClone(b.phase),from:1961,to:1992,period:Array(3).fill('1961–1991')});c.areas.push({...structuredClone(b.area),id:id+'-1961',from:1961,to:1992,polygons,points:polygons[0]});}
 const revised=new Set(),relations=[],noCarry=new Set();
 const source=(id,title,urls)=>H.source('to1991'+id,title,urls);
 function set(id,rows,meta={}){
  revised.add(id);let e=c.entries.find(e=>e.id===id);const prior=before.get(id);
  if(!e)e=H.entry(id,meta.region||'eurasia',meta.kind||'state',meta.coord,T(meta.name||rows[0][2]),[]);
  if(meta.centralAsia)e.centralAsia=true;
  e.phases=e.phases.filter(p=>p.from<1961);c.areas=c.areas.filter(a=>a.entry!==id||a.from<1961);
  for(const[from,to,name,text,poly,kind]of rows){
   if(from<1961||to>1992||from>=to)throw Error('Invalid postwar interval '+id);
   const sources=meta.sources?.map(s=>'to1991'+s)||prior?.phase.sources;if(!sources?.length)throw Error('Missing postwar source '+id);
   e.phases.push(H.phase(from,to,T(name),T(text),sources,{name:T(name),approx:false,coord:meta.coord||prior?.phase.coord||e.coord}));
   const a=H.area(id,from,to,(poly||G(id)).filter(r=>Math.abs(geo.signed(r))>0.000005),{name:T(name),kind:kind||(prior?.area.kind==='influence'?'polity':prior?.area.kind)||'polity',color:meta.color||prior?.area.color||'#ada06e',sources});a.label=meta.label||meta.coord||prior?.area.label||e.coord;
  }
 }
 const end=(id,to=1961)=>{revised.add(id);const e=c.entries.find(e=>e.id===id);if(!e)throw Error('Unknown ended profile '+id);e.phases=e.phases.filter(p=>p.from<to);for(const p of e.phases)if(p.from>=1961){p.to=Math.min(to,p.to);p.period=Array(3).fill(p.from===p.to-1?String(p.from):p.from+'–'+(p.to-1));}c.areas=c.areas.filter(a=>a.entry!==id||a.from<to);for(const a of c.areas)if(a.entry===id&&a.from>=1961)a.to=Math.min(to,a.to);};
 const link=(owner,member,from=1961,to=1992,relationship='province',extent=false)=>{noCarry.add(member);relations.push({owner,member,from,to,relationship,extent});};
 const stop=id=>noCarry.add(id);
 const event=(id,y,entry,title,text,coord,src,kind='politics')=>H.event('1991-event-'+id,y,entry,kind,coord,T(title),T(text),src.map(s=>'to1991'+s));
 const ring=p=>geo.union([p]),box=(a,b,d,e)=>ring([[a,b],[d,b],[d,e],[a,e]]);
 const reference=require('./to1960-reference.json'),U=n=>{if(!reference[n])throw Error('Unknown reference '+n);return geo.union(reference[n]);};
 const intersect=(a,b)=>clip.intersection(geo.multi(a),geo.multi(b)).flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8)))));
 const ctx={...H,T,G,U,set,end,stop,source,event,ring,box,before,link,geo,relations,intersect};
 for(const part of ['europe','asia','africa','world','review','detail','editorial'])require('./to1991-'+part+'.cjs')(c,ctx);
 for(const r of c.cartography.relations.filter(r=>r.to===1961&&!noCarry.has(r.member))){
  const owner=c.entries.find(e=>e.id===r.owner),member=c.entries.find(e=>e.id===r.member);
  if(!owner?.phases.some(p=>p.from>=1961)||!member?.phases.some(p=>p.from>=1961))continue;
  // Explicitly ended occupations must not turn into perpetual postwar ownership.
  if(r.relationship==='occupation')continue;
  relations.push({...r,from:1961,to:1992});
 }
 c.cartography.relations.push(...relations);
 const active=(id,y)=>c.areas.find(a=>a.entry===id&&a.from<=y&&y<a.to);
 for(const owner of new Set(relations.map(r=>r.owner))){
  const cuts=[...new Set([1961,1992,...c.areas.filter(a=>a.entry===owner&&a.from>=1961).flatMap(a=>[a.from,a.to]),...relations.filter(r=>r.owner===owner).flatMap(r=>[r.from,r.to,...c.areas.filter(a=>a.entry===r.member&&a.from>=1961).flatMap(a=>[a.from,a.to])])])].sort((a,b)=>a-b);
  for(let i=0;i<cuts.length-1;i++){
   const from=cuts[i],to=cuts[i+1],a=active(owner,from);if(!a||from<1961||from>=1992)continue;
   const live=relations.filter(r=>r.owner===owner&&r.from<=from&&from<r.to&&active(r.member,from)),direct=live.filter(r=>r.relationship==='province'),deps=live.filter(r=>r.relationship!=='province');
   const offshore=new Set(['1789-jamaica','1945-french-guiana','1960-cyprus-bases','1848-tahiti','1914-puerto-rico','early-guam','1914-american-samoa']);
   const polygons=geo.merge([canonical(a.polygons),...direct.filter(r=>r.extent&&(!c.postwarGeographyReview.profiles.includes(owner)||offshore.has(r.member))).map(r=>canonical(active(r.member,from).polygons))]);
   c.outlines.push({...a,id:'to1991-outline-'+owner+'-'+from,from,to,polygons,points:polygons[0],members:direct.map(r=>r.member),dependencies:Object.fromEntries(deps.map(r=>[r.member,r.relationship])),short:a.name,cartographic:true,worldFocus:['1789-great-britain','1789-usa','late-france','japan','early-dutch','late-portugal'].includes(owner)});
  }
 }
 c.to1991Review={revised:[...revised],continuing:[...before.keys()].filter(id=>!revised.has(id))};c.range={min:610,max:1991};return c;
};
