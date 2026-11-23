// Date-aware geometry loading. Metadata stays available to searches and lessons.
(function startAtlas(manifest,runtimes){
 const arrays=Array.from({length:manifest.count},()=>[]),loaded=new Set(),pending=new Map(),started=Date.now();let intent=0;
 function hydrate(v){if(!v||typeof v!=='object')return v;if(Number.isInteger(v.$atlasGeometry))return arrays[v.$atlasGeometry];for(const k of Object.keys(v))v[k]=hydrate(v[k]);return v;}
 const lang=new URLSearchParams(location.search).get('lang')||document.documentElement.lang;
 const labels=lang==='ru'?['Загрузка карты…','Не удалось загрузить карту. Повторить']:lang==='ky'?['Карта жүктөлүүдө…','Карта жүктөлгөн жок. Кайра аракет кылуу']:['Loading the map…','Unable to load the map. Retry'];
 const status=document.createElement('button');status.id='atlasLoadStatus';status.type='button';status.setAttribute('role','status');status.style.cssText='position:fixed;z-index:10000;left:50%;top:28%;transform:translateX(-50%);padding:14px 22px;border:1px solid #c5a76c;border-radius:8px;background:#25221b;color:#f2dfaf;font:16px system-ui';status.hidden=true;document.body.append(status);
 const needed=y=>manifest.chunks.filter(c=>c.ranges.some(r=>r[0]<=y&&y<r[1]));
 function load(c){if(loaded.has(c.url))return Promise.resolve();if(pending.has(c.url))return pending.get(c.url);
  const p=readBundle(c.urls,c.fallback).then(rows=>{
   if(rows.length!==c.ids.length||rows.some(([id,value],i)=>id!==c.ids[i]||!Array.isArray(value)))throw Error('Unexpected map data');
   for(const [id,value]of rows){const target=arrays[id];target.length=0;for(const item of value)target.push(item);}loaded.add(c.url);
  }).finally(()=>pending.delete(c.url));pending.set(c.url,p);return p;
 }
 async function ensure(y){const list=needed(y);let next=0;await Promise.all(Array.from({length:Math.min(6,list.length)},async()=>{while(next<list.length)await load(list[next++]);}));}
 function busy(){status.hidden=false;status.disabled=true;status.textContent=labels[0];document.body.setAttribute('aria-busy','true');}
 function done(){status.hidden=true;document.body.removeAttribute('aria-busy');}
 function fail(retry){status.disabled=false;status.textContent=labels[1];status.onclick=retry;document.body.removeAttribute('aria-busy');}
 const api={show(y,render){const token=++intent;y=Number(y);if(needed(y).every(c=>loaded.has(c.url))){done();return true;}busy();ensure(y).then(()=>{if(token!==intent)return;done();render(y);}).catch(()=>{if(token===intent)fail(()=>api.show(y,render));});return false;}};
 window.CHRONOGRAPH_LOADER=api;
 const script=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.append(s);});
 async function readBundle(urls,fallback){
  if(typeof DecompressionStream!=='function')return (await Promise.all(fallback.map(async url=>{const r=await fetch(url);if(!r.ok)throw Error('Map data '+r.status);return r.json();}))).flat();
  const buffers=await Promise.all(urls.map(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Map data '+r.status);return r.arrayBuffer();}));
  return new Response(new Blob(buffers).stream().pipeThrough(new DecompressionStream('gzip'))).json();
 }
 async function boot(){busy();try{
  if(typeof DecompressionStream==='function'){
   const buffers=await Promise.all(manifest.startup.map(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Atlas data '+r.status);return r.arrayBuffer();}));
   const stream=new Blob(buffers).stream().pipeThrough(new DecompressionStream('gzip'));
   window.CHRONOGRAPH_DATA=await new Response(stream).json();
  }else for(const src of manifest.fallback)await script(src);
  hydrate(window.CHRONOGRAPH_DATA);
  const parsed=Number(new URLSearchParams(location.search).get('year')),year=Number.isInteger(parsed)&&parsed!==0&&parsed>=-350000&&parsed<=2026?parsed:-350000;
  // The base atlas initializes 610 before installing the shared ancient timeline.
  await Promise.all([ensure(610),ensure(year)]);
  for(const src of runtimes)await script(src);done();document.body.dataset.atlasReady='true';document.body.dataset.atlasLoadMs=String(Date.now()-started);
 }catch(error){console.error('Atlas initialization',error);fail(()=>location.reload());}}
 api.ready=boot();
})
