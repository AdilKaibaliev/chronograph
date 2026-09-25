function createWorldHistory(catalog){
 const min=catalog.range?.min??610,max=catalog.range?.max??1299;
 const entries=new Map(catalog.entries.map(e=>[e.id,e]));
 // Catalogues are immutable after construction. Keep only the most recent years
 // so playback does not retain every profile snapshot for the entire atlas.
 const snapshots=new Map(),memo=(cache,key,build)=>{if(!cache.has(key)){if(cache.size>=12)cache.delete(cache.keys().next().value);cache.set(key,build());}return cache.get(key);};
 const phaseAt=(entry,year)=>entry.phases.find(p=>year>=p.from&&year<p.to)||null;
 const snapshot=year=>memo(snapshots,year,()=>{const items=catalog.entries.flatMap(entry=>{const phase=phaseAt(entry,year);return phase?[{entry:phase.name||phase.kind?{...entry,name:phase.name||entry.name,kind:phase.kind||entry.kind}:entry,phase,coord:phase.coord||entry.coord}]:[];});return {items,byId:new Map(items.map(item=>[item.entry.id,item])),areas:(catalog.areas||[]).filter(a=>year>=a.from&&year<a.to)};});
 const at=(year,region='all')=>snapshot(year).items.filter(item=>region==='all'||item.entry.region===region);
 const get=(id,year)=>snapshot(year).byId.get(id)||null;
 const records=[
  ...(catalog.events||[]).filter(e=>e.to>=min&&e.from<=max).map(e=>({...e,record:'event',year:e.year??Math.max(min,Math.min(max,Math.round((e.from+e.to)/2)))})),
  ...(catalog.areas||[]).filter(a=>a.to>min&&a.from<=max).map(a=>{const entry=entries.get(a.entry),phase=phaseAt(entry,a.from);return {id:'area-'+a.id,entry:a.entry,region:entry.region,kind:'territory',record:'territory',from:Math.max(min,a.from),to:Math.min(max,a.to-1),year:Math.max(min,a.from),coord:phase?.coord||entry.coord,title:a.title,text:a.text,sources:a.sources,name:a.name,approx:a.approx};}),
  ...catalog.entries.flatMap(entry=>entry.phases.filter(p=>p.to>min&&p.from<=max).map(p=>({id:'phase-'+entry.id+'-'+p.from,entry:entry.id,region:entry.region,kind:'period',record:'period',from:Math.max(min,p.from),to:Math.min(max,p.to-1),year:Math.max(min,p.from),coord:p.coord||entry.coord,title:p.title,text:p.text,sources:p.sources,period:p.period,name:p.name||entry.name,approx:p.approx??true})))
 ].sort((a,b)=>a.from-b.from||a.to-b.to||a.id.localeCompare(b.id));
 const timeline=(region='all')=>records.filter(e=>region==='all'||e.region===region);
 const areasAt=(year,region='all')=>snapshot(year).areas.filter(a=>region==='all'||entries.get(a.entry)?.region===region);
 const changeCache=new Map();
 const changes=(region='all')=>memo(changeCache,region,()=>[...new Set((catalog.areas||[]).filter(a=>region==='all'||entries.get(a.entry)?.region===region).flatMap(a=>[a.from,a.to]).filter(y=>y>=min&&y<=max))].sort((a,b)=>a-b)).slice();
 return {phaseAt,at,get,timeline,areasAt,changes};
}
if(typeof module!=='undefined')module.exports={createWorldHistory};
