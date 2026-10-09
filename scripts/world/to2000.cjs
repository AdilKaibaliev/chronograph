'use strict';
// Annual regional snapshots; exact dates and administrative qualifications live
// in the cards. Never rewrite the independently archived years through 1991.
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1992,max:2000}),geo=require('./cartography-geometry.cjs'),T=s=>Array.isArray(s)?s:s.split('|');
 const before=new Map(c.entries.flatMap(e=>{const p=e.phases.find(p=>p.from<=1991&&1991<p.to),a=c.areas.find(a=>a.entry===e.id&&a.from<=1991&&1991<a.to);return p&&a?[[e.id,{entry:e,phase:structuredClone(p),area:structuredClone(a)}]]:[];}));
 const oldOutlines=new Map(c.outlines.filter(a=>a.from<=1991&&1991<a.to).map(a=>[a.entry,structuredClone(a)]));
 const G=id=>{if(!before.has(id))throw Error('Unknown 1991 profile '+id);return structuredClone(before.get(id).area.polygons);};
 for(const[id,b]of before){b.entry.phases.push({...structuredClone(b.phase),from:1992,to:2001,period:Array(3).fill('1992–2000')});c.areas.push({...structuredClone(b.area),id:id+'-1992',from:1992,to:2001});}
 const revised=new Set(),relations=[],noCarry=new Set(),reference=require('./to1960-reference.json');
 const source=(id,title,urls)=>H.source('to2000'+id,title,urls);
 function set(id,rows,meta={}){
  revised.add(id);let e=c.entries.find(e=>e.id===id);const prior=before.get(id);
  if(!e)e=H.entry(id,meta.region||'eurasia',meta.kind||'state',meta.coord,T(meta.name||rows[0][2]),[]);
  e.phases=e.phases.filter(p=>p.from<1992);c.areas=c.areas.filter(a=>a.entry!==id||a.from<1992);
  for(const[from,to,name,text,poly,kind]of rows){
   if(from<1992||to>2001||from>=to)throw Error('Invalid 1992–2000 interval '+id);
   const sources=meta.sources?.map(s=>'to2000'+s)||prior?.phase.sources;if(!sources?.length)throw Error('Missing source '+id);
   const p=H.phase(from,to,T(name),T(text),sources,{name:T(name),approx:false,coord:meta.coord||prior?.phase.coord||e.coord});
   if(meta.phaseKind||prior?.phase.kind)p.kind=meta.phaseKind||prior.phase.kind;
   e.phases.push(p);
   const a=H.area(id,from,to,poly||G(id),{name:T(name),kind:kind||prior?.area.kind||'polity',color:meta.color||prior?.area.color||'#ada06e',sources});
   a.label=meta.label||meta.coord||prior?.area.label||e.coord;
  }
 }
 const end=(id,to=1992)=>{revised.add(id);const e=c.entries.find(e=>e.id===id);e.phases=e.phases.filter(p=>p.from<to);for(const p of e.phases)if(p.from>=1992){p.to=Math.min(to,p.to);p.period=Array(3).fill(p.from===p.to-1?String(p.from):p.from+'–'+(p.to-1));}c.areas=c.areas.filter(a=>a.entry!==id||a.from<to);for(const a of c.areas)if(a.entry===id&&a.from>=1992)a.to=Math.min(to,a.to);};
 const link=(owner,member,from=1992,to=2001,relationship='province',extent=false)=>{noCarry.add(member);relations.push({owner,member,from,to,relationship,extent});};
 const event=(id,y,entry,title,text,coord,src,kind='politics')=>H.event('2000-event-'+id,y,entry,kind,coord,T(title),T(text),src.map(s=>'to2000'+s));
 const U=n=>{if(!reference[n])throw Error('Unknown reference '+n);return geo.union(reference[n]);};
 const ctx={...H,T,G,U,set,end,source,event,before,link,geo,relations};
 for(const part of ['europe','asia','africa','world'])require('./to2000-'+part+'.cjs')(c,ctx);
 const active=(id,y)=>c.areas.find(a=>a.entry===id&&a.from<=y&&y<a.to);
 for(const r of c.cartography.relations.filter(r=>r.from<=1991&&1991<r.to&&!noCarry.has(r.member))){
  // A new narrative phase is not an end of jurisdiction. Carry through the
  // full life of both profiles; explicitly changed ownership is handled above.
  const last=id=>Math.max(...c.areas.filter(a=>a.entry===id&&a.from>=1992).map(a=>a.to));
  if(active(r.owner,1992)&&active(r.member,1992))relations.push({...r,from:1992,to:Math.min(2001,last(r.owner),last(r.member))});
 }
 c.cartography.relations.push(...relations);
 for(const owner of new Set([...oldOutlines.keys(),...relations.map(r=>r.owner)])){
  const cuts=[...new Set([1992,2001,...c.areas.filter(a=>a.entry===owner&&a.from>=1992).flatMap(a=>[a.from,a.to]),...relations.filter(r=>r.owner===owner).flatMap(r=>[r.from,r.to])])].sort((a,b)=>a-b);
  for(let i=0;i<cuts.length-1;i++){
   const from=cuts[i],to=cuts[i+1],a=active(owner,from);if(!a)continue;
   const live=relations.filter(r=>r.owner===owner&&r.from<=from&&from<r.to&&active(r.member,from)),direct=live.filter(r=>r.relationship==='province'),deps=live.filter(r=>r.relationship!=='province');
   const old=oldOutlines.get(owner),unchanged=before.has(owner)&&JSON.stringify(a.polygons)===JSON.stringify(before.get(owner).area.polygons);
   // Keep the delivered footprint (including offshore components and holes)
   // when the state has not changed; changing narrative must not redraw it.
   const polygons=unchanged&&old?structuredClone(old.polygons):structuredClone(a.polygons);
   c.outlines.push({...a,id:'to2000-outline-'+owner+'-'+from,from,to,polygons,points:polygons[0],members:direct.map(r=>r.member),dependencies:Object.fromEntries(deps.map(r=>[r.member,r.relationship])),short:a.name,cartographic:true,worldFocus:old?.worldFocus||false});
  }
 }
 c.to2000Review={revised:[...revised],continuing:[...before.keys()].filter(id=>!revised.has(id))};c.range={min:610,max:2000};return c;
};
