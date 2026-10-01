'use strict';
// Annual snapshots: intervals are [from,to); outline changes are regional reconstructions.
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1849,max:1914}),T=s=>Array.isArray(s)?s:s.split('|');
 const before=new Map(c.entries.flatMap(entry=>{const phase=entry.phases.find(p=>p.from<=1848&&p.to>1848),area=c.areas.find(a=>a.entry===entry.id&&a.from<=1848&&a.to>1848);return phase?[[entry.id,{entry,phase:structuredClone(phase),area:structuredClone(area)}]]:[];}));
 const revised=new Set(),G=id=>structuredClone(before.get(id).area.polygons);
 for(const [id,b] of before){const p=structuredClone(b.phase);Object.assign(p,{from:1849,to:1915,period:T('1849–1914|1849–1914|1849–1914')});b.entry.phases.push(p);const a=structuredClone(b.area);Object.assign(a,{id:id+'-1849',from:1849,to:1915});c.areas.push(a);}
 function set(id,rows,meta={}){
  revised.add(id);let e=c.entries.find(e=>e.id===id),prior=before.get(id);
  if(!e)e=H.entry(id,meta.region,meta.kind||'state',meta.coord,T(meta.name||rows[0][2]),[]);
  if(meta.centralAsia&&!prior)e.centralAsia=true;
  e.phases=e.phases.filter(p=>p.from<1849);c.areas=c.areas.filter(a=>a.entry!==id||a.from<1849);
  for(const [from,to,name,body,geometry,kind,color,coord] of rows){
   const sources=meta.sources||prior.phase.sources;
   const p=H.phase(from,to,T(name),T(body),sources,{name:T(name),coord:coord||prior?.phase.coord||e.coord,approx:meta.approx??false});
   if(kind==='cultural')p.kind='community';else if(kind==='settlement')p.kind='city';else if(meta.phaseKind)p.kind=meta.phaseKind;
   if(meta.learning)p.learning=meta.learning;e.phases.push(p);
   const a=H.area(id,from,to,geometry||G(id),{name:T(name),kind:kind||prior?.area.kind||'polity',color:color||meta.color||prior?.area.color||'#9f8d6d',sources});
   if(!geometry&&prior?.area.label)a.label=prior.area.label;
  }
 }
 const source=(id,title,url)=>H.source('to1914'+id,title,url);
 const event=(id,y,entry,title,text,coord,kind='politics',extra={})=>H.event('1914-event-'+id,y,entry,kind,coord,T(title),T(text),extra.sources||c.entries.find(e=>e.id===entry).phases.find(p=>p.from<=y&&p.to>y)?.sources||before.get(entry).phase.sources,extra);
 const box=(x0,y0,x1,y1)=>[[[x0,y0],[x1,y0],[x1,y1],[x0,y1]]];
 for(const module of ['europe','asia','africa','americas','oceanic','review','corrections'])require('./to1914-'+module+'.cjs')(c,{...H,T,G,set,source,event,box,before});
 for(const e of c.entries)for(const p of e.phases.filter(p=>p.from>=1849))if(e.kind==='culture')p.kind='community';
 c.to1914Review={revised:[...revised],continuing:[...before.keys()].filter(id=>!revised.has(id))};c.range={min:610,max:1914};return c;
};
