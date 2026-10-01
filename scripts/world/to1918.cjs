'use strict';
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1915,max:1918}),T=s=>Array.isArray(s)?s:s.split('|');
 const before=new Map(c.entries.flatMap(e=>{const p=e.phases.find(p=>p.from<=1914&&p.to>1914),a=c.areas.find(a=>a.entry===e.id&&a.from<=1914&&a.to>1914);return p?[[e.id,{entry:e,phase:structuredClone(p),area:structuredClone(a)}]]:[];})),revised=new Set();
 const G=id=>structuredClone(before.get(id).area.polygons);
 for(const [id,b] of before){b.entry.phases.push({...structuredClone(b.phase),from:1915,to:1919,period:T('1915–1918|1915–1918|1915–1918')});c.areas.push({...structuredClone(b.area),id:id+'-1915',from:1915,to:1919});}
 const source=(id,title,urls)=>H.source('to1918'+id,title,urls);
 function set(id,rows,meta={}){revised.add(id);const prior=before.get(id);let e=c.entries.find(e=>e.id===id);if(!e)e=H.entry(id,meta.region||'eurasia',meta.kind||'state',meta.coord,T(meta.name||rows[0][2]),[]);if(meta.centralAsia)e.centralAsia=true;e.phases=e.phases.filter(p=>p.from<1915);c.areas=c.areas.filter(a=>a.entry!==id||a.from<1915);for(const [from,to,name,text,geometry,kind,color,coord] of rows){const sources=meta.sources||prior?.phase.sources;if(!sources)throw Error('Missing sources '+id);e.phases.push(H.phase(from,to,T(name),T(text),sources,{name:T(name),coord:coord||e.coord,approx:false,...(kind==='cultural'?{kind:'community'}:{})}));const a=H.area(id,from,to,geometry||G(id),{name:T(name),kind:kind||prior?.area.kind||'polity',color:color||meta.color||prior?.area.color||'#9c9973',sources});if(!geometry&&prior?.area.label)a.label=prior.area.label;}}
 const event=(id,y,entry,title,text,coord,sourceIds,kind='politics')=>H.event('1918-event-'+id,y,entry,kind,coord,T(title),T(text),sourceIds.map(id=>'to1918'+id));
 const ring=p=>[p],box=(x0,y0,x1,y1)=>ring([[x0,y0],[x1,y0],[x1,y1],[x0,y1]]);
 for(const part of ['europe','asia','world','review'])require('./to1918-'+part+'.cjs')(c,{...H,T,G,set,source,event,ring,box,before});
 c.to1918Review={revised:[...revised],continuing:[...before.keys()].filter(id=>!revised.has(id))};c.range={min:610,max:1918};return c;
};
