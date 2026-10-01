'use strict';
// Year slices use [from,to). Earlier releases are kept byte-for-byte in the catalogue.
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1816,max:1848}),T=s=>Array.isArray(s)?s:s.split('|');
 const before=new Map(c.entries.filter(e=>e.phases.some(p=>p.from<=1815&&p.to>1815)).map(e=>[e.id,{entry:e,phase:structuredClone(e.phases.find(p=>p.from<=1815&&p.to>1815)),area:structuredClone(c.areas.find(a=>a.entry===e.id&&a.from<=1815&&a.to>1815))}]));
 const revised=new Set(),G=id=>structuredClone(before.get(id).area.polygons);
 // Continuing local societies and unchanged regional cores retain their established geometry.
 // Dated political transfers below replace these continuations; no new modern borders are used.
 for(const [id,b] of before){
  const p=structuredClone(b.phase);p.from=1816;p.to=1849;p.period=T('1816–1848|1816–1848|1816–1848');
  b.entry.phases.push(p);const a=structuredClone(b.area);a.id=id+'-1816';a.from=1816;a.to=1849;c.areas.push(a);
 }
 function set(id,rows,meta={}){
  revised.add(id);let e=c.entries.find(e=>e.id===id),prior=before.get(id);
  if(!e)e=H.entry(id,meta.region,meta.kind||'state',meta.coord,T(meta.name||rows[0][2]),[]);
  e.phases=e.phases.filter(p=>p.from<1816);c.areas=c.areas.filter(a=>a.entry!==id||a.from<1816);
  for(const r of rows){
   const [from,to,name,body,geometry,kind,color,coord]=r,sources=meta.sources||prior.phase.sources;
   const p=H.phase(from,to,T(name),T(body),sources,{name:T(name),coord:coord||prior?.phase.coord||e.coord,approx:meta.approx??false});
   if(meta.learning)p.learning=meta.learning;
   e.phases.push(p);
   const a=H.area(id,from,to,geometry||G(id),{name:T(name),kind:kind||prior?.area.kind||'polity',color:color||meta.color||prior?.area.color||'#9f8d6d',sources});
   // Preserve hand-positioned anchors when reusing a reviewed outline.
   if(!geometry&&prior?.area.label)a.label=prior.area.label;
  }
 }
 const source=(id,title,url)=>H.source('to1848'+id,title,url);
 const event=(id,y,entry,title,text,coord,kind='politics',extra={})=>H.event('1848-event-'+id,y,entry,kind,coord,T(title),T(text),extra.sources||c.entries.find(e=>e.id===entry).phases.find(p=>p.from<=y&&p.to>y)?.sources||before.get(entry).phase.sources,extra);
 const box=(x0,y0,x1,y1)=>[[[x0,y0],[x1,y0],[x1,y1],[x0,y1]]];
 for(const module of ['europe','asia','africa','americas','oceanic','review','corrections'])require('./to1848-'+module+'.cjs')(c,{...H,T,G,set,source,event,box});
 // Living descendants are communities, not archaeological cultures.
 for(const e of c.entries)for(const p of e.phases.filter(p=>p.from>=1816)){
  if(e.kind==='culture')p.kind='community';
  if(e.id==='tonga'&&p.from>=1845)p.kind='state';
 }
 c.to1848Review={revised:[...revised],continuing:[...before.keys()].filter(id=>!revised.has(id))};
 c.range={min:610,max:1848};return c;
};
