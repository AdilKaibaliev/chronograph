function createKyrgyzStudy(catalog){
 const records=new Map(catalog.lessons.map(e=>[e.id,e]));
 const chapters=new Map(catalog.chapters.map(e=>[e.id,e]));
 const list=(chapter='all',query='')=>{
  const q=query.trim().toLocaleLowerCase();
  return (chapters.get(chapter)||chapters.get('all')).lessons.map(id=>records.get(id)).filter(e=>e&&(!q||[e.year,e.from,e.to,...(e.periodLabel||[]),...e.title,...e.text,...e.mapPlaces.flatMap(p=>p[1])].join(' ').toLocaleLowerCase().includes(q)));
 };
 const neighbour=(chapter,id,delta,query='')=>{const items=list(chapter,query),i=items.findIndex(e=>e.id===id);return i<0?null:items[i+delta]||null;};
 const nearest=(chapter,year)=>list(chapter).slice().sort((a,b)=>Math.abs(a.year-year)-Math.abs(b.year-year)||a.year-b.year)[0]||null;
 const activeAt=(id,year)=>{const e=records.get(id);return !!e&&e.from<=year&&year<=e.to;};
 let cachedYear=null,cachedActive=[];
 const at=year=>{if(year!==cachedYear){cachedYear=year;cachedActive=catalog.lessons.filter(e=>e.from<=year&&year<=e.to).sort((a,b)=>Number(!!a.background)-Number(!!b.background)||(a.to-a.from)-(b.to-b.from));}return cachedActive;};
 const placesAt=year=>{const groups=new Map();for(const e of at(year))for(const [coord,label]of e.mapPlaces){const key=coord.join(',');let group=groups.get(key);if(!group){group={coord,label,lessons:[]};groups.set(key,group);}if(!group.lessons.some(x=>x.id===e.id))group.lessons.push(e);}return [...groups.values()];};
 return {list,neighbour,nearest,activeAt,at,placesAt,record:id=>records.get(id)||null,chapter:id=>chapters.get(id)||chapters.get('all')};
}
if(typeof module!=='undefined')module.exports={createKyrgyzStudy};
