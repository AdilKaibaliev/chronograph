// Keep older geography on demand; neighbouring dates share in-flight requests.
const createPaleoFrameStore=(load,limit=8)=>{
 const cache=new Map(),pending=new Map();
 const get=f=>{if(f.land)return f;const value=cache.get(f.asset);if(value){cache.delete(f.asset);cache.set(f.asset,value);}return value||null;};
 const request=f=>{
  const ready=get(f);if(ready)return Promise.resolve(ready);
  if(pending.has(f.asset))return pending.get(f.asset);
  const p=Promise.resolve().then(()=>load(f.asset)).then(value=>{
   if(value.bp!==f.bp||value.year!==f.year||value.source!==f.source||!['land','ice','shelf'].every(k=>Array.isArray(value[k])))throw Error('Unexpected landscape frame');
   cache.set(f.asset,value);while(cache.size>limit)cache.delete(cache.keys().next().value);return value;
  }).finally(()=>pending.delete(f.asset));pending.set(f.asset,p);return p;
 };
 return {get,request,size:()=>cache.size};
};
if(typeof module!=='undefined')module.exports=createPaleoFrameStore;
