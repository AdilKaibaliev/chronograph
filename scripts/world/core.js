function createWorldHistory(catalog){
 const phaseAt=(entry,year)=>entry.phases.find(p=>year>=p.from&&year<p.to)||null;
 const at=(year,region='all')=>catalog.entries.filter(e=>region==='all'||e.region===region).flatMap(entry=>{const phase=phaseAt(entry,year);return phase?[{entry,phase,coord:phase.coord||entry.coord}]:[];});
 const get=(id,year)=>at(year).find(item=>item.entry.id===id)||null;
 const timeline=(region='all')=>[
  ...(catalog.events||[]).map(e=>({...e,record:'event',year:e.year??Math.max(610,Math.min(1299,Math.round((e.from+e.to)/2)))})),
  ...(catalog.areas||[]).map(a=>{const entry=catalog.entries.find(e=>e.id===a.entry);return {id:'area-'+a.id,entry:a.entry,region:entry.region,kind:'territory',record:'territory',from:Math.max(610,a.from),to:Math.min(1299,a.to-1),year:Math.max(610,a.from),coord:entry.coord,title:a.title,text:a.text,sources:a.sources,name:a.name,approx:a.approx};}),
  ...catalog.entries.flatMap(entry=>entry.phases.filter(p=>p.to>610&&p.from<1300).map(p=>({id:'phase-'+entry.id+'-'+p.from,entry:entry.id,region:entry.region,kind:'period',record:'period',from:Math.max(610,p.from),to:Math.min(1299,p.to-1),year:Math.max(610,p.from),coord:p.coord||entry.coord,title:p.title,text:p.text,sources:p.sources,period:p.period,name:entry.name,approx:true})))
 ].filter(e=>region==='all'||e.region===region).sort((a,b)=>a.from-b.from||a.to-b.to||a.id.localeCompare(b.id));
 const areasAt=(year,region='all')=>(catalog.areas||[]).filter(a=>year>=a.from&&year<a.to&&catalog.entries.some(e=>e.id===a.entry&&(region==='all'||region===e.region)));
 const changes=(region='all')=>[...new Set((catalog.areas||[]).filter(a=>region==='all'||catalog.entries.find(e=>e.id===a.entry).region===region).flatMap(a=>[a.from,a.to]).filter(y=>y>=610&&y<=1299))].sort((a,b)=>a-b);
 return {phaseAt,at,get,timeline,areasAt,changes};
}
if(typeof module!=='undefined')module.exports={createWorldHistory};
