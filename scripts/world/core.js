function createWorldHistory(catalog){
 const min=catalog.range?.min??610,max=catalog.range?.max??1299;
 const entries=new Map(catalog.entries.map(e=>[e.id,e]));
 const framesByEntry=new Map();for(const a of catalog.areas||[]){if(!framesByEntry.has(a.entry))framesByEntry.set(a.entry,[]);framesByEntry.get(a.entry).push(a);}
 // Catalogues are immutable after construction. Keep only the most recent years
 // so playback does not retain every profile snapshot for the entire atlas.
 const snapshots=new Map(),memo=(cache,key,build)=>{if(!cache.has(key)){if(cache.size>=12)cache.delete(cache.keys().next().value);cache.set(key,build());}return cache.get(key);};
 const phaseAt=(entry,year)=>entry.phases.find(p=>year>=p.from&&year<p.to)||null;
 const snapshot=year=>memo(snapshots,year,()=>{const items=catalog.entries.flatMap(entry=>{const phase=phaseAt(entry,year);return phase?[{entry:phase.name||phase.kind?{...entry,name:phase.name||entry.name,kind:phase.kind||entry.kind}:entry,phase,coord:phase.coord||entry.coord}]:[];});return {items,byId:new Map(items.map(item=>[item.entry.id,item])),areas:(catalog.areas||[]).filter(a=>year>=a.from&&year<a.to)};});
 const mapped=new Map();
 const mapAreasAt=(year,region='all')=>memo(mapped,year,()=>{
  const outlines=(catalog.outlines||[]).filter(a=>year>=a.from&&year<a.to&&snapshot(year).byId.has(a.entry)),byEntry=new Map(outlines.map(a=>[a.entry,a])),members=new Map(outlines.flatMap(a=>(a.members||[]).map(id=>[id,a]))),dependencies=new Map(outlines.flatMap(a=>Object.entries(a.dependencies||{}).map(([id,relationship])=>[id,{owner:a,relationship}])));
  const parent=id=>{let owner=members.get(id);const seen=new Set([id]);while(owner&&members.has(owner.entry)&&!seen.has(owner.entry)){seen.add(owner.entry);owner=members.get(owner.entry);}return owner;};
  const activeRelations=new Map((catalog.cartography?.relations||[]).filter(r=>r.from<=year&&year<r.to&&snapshot(year).byId.has(r.owner)).map(r=>[r.member,r]));
  const membershipSpan=a=>{let from=a.from,to=a.to,id=a.entry;const seen=new Set();while(!seen.has(id)){seen.add(id);const r=activeRelations.get(id);if(!r)break;from=Math.max(from,r.from);to=Math.min(to,r.to);if(r.relationship!=='province')break;id=r.owner;}return {from,to};};
  return snapshot(year).areas.map(original=>{
   const shape=catalog.cartography?.shapes[catalog.cartography?.areas[original.id]],outline=byEntry.get(original.entry);
   const unified=original.mongolGroup&&catalog.cartography?.mongol?.find(f=>f.from<=year&&year<f.to);
   let a=shape?{...original,polygons:shape,points:shape[0],...(unified?{mongolUnion:catalog.cartography.shapes[unified.shape],mongolUnionId:unified.from}:{})}:original;
   if(outline)a={...a,...outline,id:original.id+'@'+outline.id,from:Math.max(original.from,outline.from),to:Math.min(original.to,outline.to),points:outline.polygons[0],politicalOutline:true};
   const owner=parent(a.entry),dep=dependencies.get(a.entry);
   if(owner){const outer=dependencies.get(owner.entry)?.owner||owner,span=membershipSpan(original);return {...a,...span,id:original.id+'@member-'+owner.entry+'-'+span.from+'-'+outer.color,politicalOutline:false,sovereign:owner.entry,sovereignName:owner.name,color:outer.color,...(a.entry==='1789-kodiak'&&year>=1799?{overviewLabel:true,label:[-151,64],labelWidth:100,short:['Русская Америка','Russian America','Орус Америкасы']}: {})};}
   if(dep){const span=membershipSpan(original);return {...a,...span,id:original.id+'@dependent-'+dep.owner.entry+'-'+span.from+'-'+dep.owner.color,politicalOutline:false,dependencyOutline:true,overlord:dep.owner.entry,relationship:dep.relationship,sovereignName:dep.owner.name,color:dep.owner.color,kind:'influence'};}
   return a;
  });
 }).filter(a=>region==='all'||entries.get(a.entry)?.region===region);
 const at=(year,region='all')=>snapshot(year).items.filter(item=>region==='all'||item.entry.region===region);
 const get=(id,year)=>snapshot(year).byId.get(id)||null;
 const records=[
  ...(catalog.events||[]).filter(e=>e.to>=min&&e.from<=max).map(e=>({...e,record:'event',year:e.year??Math.max(min,Math.min(max,Math.round((e.from+e.to)/2)))})),
  ...(catalog.areas||[]).filter(a=>a.to>min&&a.from<=max).map(a=>{const entry=entries.get(a.entry),phase=phaseAt(entry,a.from);return {id:'area-'+a.id,entry:a.entry,region:entry.region,kind:'territory',record:'territory',from:Math.max(min,a.from),to:Math.min(max,a.to-1),year:Math.max(min,a.from),coord:phase?.coord||entry.coord,title:a.title,text:a.text,sources:a.sources,name:a.name,approx:a.approx};}),
  ...(catalog.outlines||[]).filter(a=>a.from<=max).map(a=>({...a,id:'outline-'+a.id,region:entries.get(a.entry).region,record:'territory',kind:'territory',to:Math.min(max,a.to-1),year:a.from})),
  ...catalog.entries.flatMap(entry=>entry.phases.filter(p=>p.to>min&&p.from<=max).map(p=>({id:'phase-'+entry.id+'-'+p.from,entry:entry.id,region:entry.region,kind:'period',record:'period',from:Math.max(min,p.from),to:Math.min(max,p.to-1),year:Math.max(min,p.from),coord:p.coord||entry.coord,title:p.title,text:p.text,sources:p.sources,period:p.period,name:p.name||entry.name,approx:p.approx??true})))
 ].sort((a,b)=>a.from-b.from||a.to-b.to||a.id.localeCompare(b.id));
 const recordsById=new Map(records.map(e=>[e.id,e])),regionalRecords=new Map([['all',records]]);
 const timeline=(region='all')=>{if(!regionalRecords.has(region))regionalRecords.set(region,records.filter(e=>e.region===region));return regionalRecords.get(region).slice();};
 const record=id=>recordsById.get(id)||null;
 const entry=id=>entries.get(id)||null;
 const frames=id=>(framesByEntry.get(id)||[]).slice();
 const mappedFrames=new Map();
 const mapFrames=id=>{if(!mappedFrames.has(id)){const years=[...new Set([...frames(id).map(a=>a.from),...(catalog.outlines||[]).filter(a=>a.entry===id||(a.members||[]).includes(id)||a.dependencies?.[id]).flatMap(a=>[a.from,a.to])])].sort((a,b)=>a-b);mappedFrames.set(id,[...new Map(years.map(y=>mapAreasAt(y).find(a=>a.entry===id)).filter(Boolean).map(a=>[a.id,a])).values()]);}return mappedFrames.get(id).slice();};
 const areasAt=(year,region='all')=>snapshot(year).areas.filter(a=>region==='all'||entries.get(a.entry)?.region===region);
 const changeCache=new Map();
 const changes=(region='all')=>memo(changeCache,region,()=>[...new Set([...(catalog.areas||[]),...(catalog.outlines||[])].filter(a=>region==='all'||entries.get(a.entry)?.region===region).flatMap(a=>[a.from,a.to]).filter(y=>y>=min&&y<=max))].sort((a,b)=>a-b)).slice();
 return {phaseAt,at,get,timeline,areasAt,mapAreasAt,mapFrames,changes,record,entry,frames};
}
// A bounded reading window. Selection opens its page once; readers can then move
// freely in either direction without losing access to earlier or later records.
function worldPageWindow(items,state,key,selected='',size=24,idOf=item=>item.id){
 if(state.key!==key){state.key=key;state.page=0;state.selected='';}
 if(selected!==state.selected){const index=items.findIndex(item=>idOf(item)===selected);if(index>=0)state.page=Math.floor(index/size);state.selected=selected;}
 const pages=Math.max(1,Math.ceil(items.length/size));state.page=Math.max(0,Math.min(pages-1,state.page||0));
 const from=state.page*size,to=Math.min(items.length,from+size);
 return {items:items.slice(from,to),from,to,total:items.length,page:state.page,pages};
}
function worldEpochForYear(year){return [610,1300,1454,1601,1790,1816,1849,1915].filter(y=>y<=year).at(-1);}
function worldRegionalMilestones(records,year){
 const start=worldEpochForYear(year),end=[1300,1454,1601,1790,1816,1849,1915,Infinity].find(y=>y>start);
 const events=records.filter(e=>e.record==='event'),pool=events.length?events:records;
 const nearby=pool.filter(e=>e.year>=start&&e.year<end);
 return nearby.length?nearby:pool.slice().sort((a,b)=>Math.abs(a.year-year)-Math.abs(b.year-year)||a.year-b.year).slice(0,10).sort((a,b)=>a.year-b.year);
}
if(typeof module!=='undefined')module.exports={createWorldHistory,worldPageWindow,worldEpochForYear,worldRegionalMilestones};
