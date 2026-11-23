'use strict';
// Coordinates are shared losslessly and loaded by their dated use, not rounded.
const assert=require('node:assert/strict');
function ranges(list){const out=[];for(const r of list.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1])){const last=out.at(-1);if(last&&r[0]<=last[1])last[1]=Math.max(last[1],r[1]);else out.push(r.slice());}return out;}
module.exports=function geometryPack(asset){
 const geometries=[],ids=new Map(),landscapes=new Map();
 function register(object,key,dates){const value=object[key];if(!Array.isArray(value)||!value.length)return;const json=JSON.stringify(value);let id=ids.get(json);if(id===undefined){id=geometries.length;ids.set(json,id);geometries.push({value,dates:[]});}geometries[id].dates.push(...dates);object[key]={$atlasGeometry:id};}
 function prepare(key,value){
  if(key==='WORLD_HISTORY'){
   const records=[...value.areas,...value.outlines],byId=new Map(records.map(a=>[a.id,a]));
   // Rendering always uses the coast-clipped display shapes. Preserve research
   // originals in the archive without fetching both copies for the same map.
   for(const a of records)for(const k of ['polygons','points'])register(a,k,[]);
   for(const cart of [value.cartography,value.displayCartography]){
    const uses=new Map(),use=(id,dates)=>{if(!uses.has(id))uses.set(id,[]);uses.get(id).push(dates);};
    for(const [id,index]of Object.entries(cart.areas)){const a=byId.get(id);if(a)use(index,[a.from,a.to]);}
    if(Array.isArray(cart.mongol))for(const f of cart.mongol)use(f.shape,[f.from,f.to]);
    else for(const [from,index]of Object.entries(cart.mongol||{})){const f=value.cartography.mongol.find(f=>f.from===+from);if(f)use(index,[f.from,f.to]);}
    for(let i=0;i<cart.shapes.length;i++)register(cart.shapes,i,cart===value.displayCartography?uses.get(i)||[]:[]);
   }
  }
  if(key==='ANCIENT_PALEOGEOGRAPHY')for(let i=0;i<value.frames.length;i++){
   const f=value.frames[i];if(!f.land)continue;
   const url=asset('landscape-'+f.bp,JSON.stringify(f),'json');landscapes.set(url,f);
   value.frames[i]=Object.fromEntries(Object.entries(f).filter(([k])=>!['land','ice','shelf'].includes(k)));value.frames[i].asset=url;
  }
  return value;
 }
 function finish(){
  const chunks=[],bands=[610,1300,1454,1601,1700,1800,1850,1880,1900,1919,1939,1946,1961,1992,2011,2027],zlib=require('node:zlib');
  for(let i=0;i<bands.length-1;i++){
   const from=bands[i],to=bands[i+1],rows=geometries.flatMap((g,id)=>g.dates.some(r=>r[0]<to&&r[1]>from)?[[id,g.value]]:[]),json=JSON.stringify(rows),compressed=zlib.gzipSync(json,{level:9}),urls=[],fallback=[];
   assert.equal(zlib.gunzipSync(compressed).toString(),json);
   for(let offset=0;offset<compressed.length;offset+=850000)urls.push(asset('map-'+from+'-'+urls.length,compressed.subarray(offset,offset+850000),'bin'));
   let group=[],size=2;const flush=()=>{if(group.length){fallback.push(asset('map-json-'+from+'-'+fallback.length,JSON.stringify(group),'json'));group=[];size=2;}};
   for(const row of rows){const n=Buffer.byteLength(JSON.stringify(row))+1;if(size+n>850000)flush();group.push(row);size+=n;}flush();
   chunks.push({url:urls[0],urls,fallback,ranges:[[from,to]],ids:rows.map(r=>r[0])});
  }
  return {chunks,count:geometries.length};
 }
 function restore(value){if(!value||typeof value!=='object')return value;if(Number.isInteger(value.$atlasGeometry))return geometries[value.$atlasGeometry].value;if(value.asset&&landscapes.has(value.asset))return landscapes.get(value.asset);if(Array.isArray(value))return value.map(restore);return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,restore(v)]));}
 return {prepare,finish,restore};
};
