function createKyrgyzTerritories(catalog){
 const records=new Map(catalog.records.map(r=>[r.id,r]));let cachedYear=null,cached=null;
 function at(year){if(year===cachedYear)return cached;cachedYear=year;let lo=0,hi=catalog.frames.length-1,frame=null;while(lo<=hi){const mid=(lo+hi)>>1,f=catalog.frames[mid];if(year<f.from)hi=mid-1;else if(year>=f.to)lo=mid+1;else{frame=f;break;}}return cached=frame?{...frame,rows:frame.records.map(id=>records.get(id)),layers:frame.layers.map(l=>({...l,polygons:catalog.shapes[l.shape]}))}:{from:year,to:year+1,rows:[],layers:[]};}
 function next(year,direction){const dates=catalog.frames.filter(f=>f.records.length).map(f=>f.from);return direction>0?dates.find(y=>y>year)??null:dates.filter(y=>y<year).at(-1)??null;}
 return {at,next};
}
if(typeof module!=='undefined')module.exports={createKyrgyzTerritories};
