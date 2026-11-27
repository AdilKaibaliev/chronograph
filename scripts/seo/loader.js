// Date-aware geometry loading. Metadata stays available to searches and lessons.
(function startAtlas(manifest,runtimes){
 const arrays=Array.from({length:manifest.count},()=>[]),loaded=new Set(),pending=new Map(),started=Date.now();let intent=0,dataReady=false;
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
 const scripts=new Map();
 function script(src){if(scripts.has(src))return scripts.get(src);const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>{scripts.delete(src);s.remove();reject(Error('Map script unavailable'));};document.body.append(s);});scripts.set(src,p);return p;}
 // DecompressionStream is available in browsers that predate AbortSignal.timeout.
 // Include the response body in the deadline, and clear timers after every request.
 const requests=new Map(),received=new Map(),queue=[];let inflight=0;
 function slot(){return new Promise(resolve=>{if(inflight<4){inflight++;resolve();}else queue.push(resolve);});}
 function release(){if(queue.length)queue.shift()();else inflight--;}
 function read(url,format){
  if(received.has(url))return Promise.resolve(received.get(url));if(requests.has(url))return requests.get(url);
  const p=(async()=>{await slot();try{for(let attempt=0;attempt<2;attempt++){
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),attempt?60000:45000);
   try{const r=await fetch(url,{signal:controller.signal});if(!r.ok){const error=Error('Map data '+r.status);error.retryable=r.status===408||r.status===429||r.status>=500;throw error;}const value=await r[format]();received.set(url,value);return value;}
   catch(error){if(attempt||error.retryable===false)throw error;}
   finally{clearTimeout(timer);}
  }}finally{release();requests.delete(url);}})();requests.set(url,p);return p;
 }
 async function readBundle(urls,fallback){
  const compressed=typeof DecompressionStream==='function',parts=compressed?urls:fallback;
  // Keep successful parts after a network failure, so Retry requests only missing parts.
  const values=await Promise.all(parts.map(url=>read(url,compressed?'arrayBuffer':'json')));
  try{return compressed?await new Response(new Blob(values).stream().pipeThrough(new DecompressionStream('gzip'))).json():values.flat();}
  finally{for(const url of parts)received.delete(url);}
 }
 async function boot(){busy();try{
  if(!dataReady){
   if(typeof DecompressionStream==='function')window.CHRONOGRAPH_DATA=await readBundle(manifest.startup,[]);
   else for(const src of manifest.fallback)await script(src);
   hydrate(window.CHRONOGRAPH_DATA);dataReady=true;
  }
  const parsed=Number(new URLSearchParams(location.search).get('year')),year=Number.isInteger(parsed)&&parsed!==0&&parsed>=-350000&&parsed<=2026?parsed:-350000;
  // The base atlas initializes 610 before installing the shared ancient timeline.
  await Promise.all([ensure(610),ensure(year)]);
  for(const src of runtimes)await script(src);done();document.body.dataset.atlasReady='true';document.body.dataset.atlasLoadMs=String(Date.now()-started);
 }catch(error){console.error('Atlas initialization',error);fail(boot);}}
 api.ready=boot();
})
