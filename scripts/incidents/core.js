// Independent event chronology: never mutates political territory datasets.
function incidentRecords(registry,filter,langIndex=0){
 const q=(filter.query||'').trim().toLocaleLowerCase();
 return registry.records.filter(r=>(!filter.kind||filter.kind==='all'||r.kind===filter.kind)&&(!filter.year||filter.year==='all'||r.date.startsWith(String(filter.year)))&&(!filter.country||filter.country==='all'||r.country===filter.country)&&(!q||[...registry.countries[r.country].name,r.country,r.date,r.id].join(' ').toLocaleLowerCase().includes(q))).slice().sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
function incidentGroups(registry,records){const groups=new Map();for(const r of records){if(!groups.has(r.country))groups.set(r.country,{country:r.country,coord:registry.countries[r.country].coord,records:[]});groups.get(r.country).records.push(r);}return [...groups.values()];}
function incidentStep(index,delta,length){return Math.max(0,Math.min(length-1,index+delta));}
if(typeof module!=='undefined')module.exports={incidentRecords,incidentGroups,incidentStep};
