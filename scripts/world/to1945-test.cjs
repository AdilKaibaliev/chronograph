'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const c=require('./catalog.cjs'),h=require('./core.js').createWorldHistory(c),html=fs.readFileSync('index.html','utf8');
assert.equal(c.range.max,1945);assert(html.includes('TIMELINE_MAX=1945;'));
const a=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),p=(id,y)=>h.get(id,y)?.phase;
for(let y=1940;y<=1945;y++){
 for(const r of c.regions)assert(h.at(y,r.id).length,'Empty region '+r.id+' '+y);
 const areas=h.mapAreasAt(y);assert.equal(new Set(areas.map(a=>a.entry)).size,areas.length);
 for(const e of h.at(y))assert(areas.some(a=>a.entry===e.entry.id),'Unmapped '+e.entry.id);
 for(const r of c.cartography.relations.filter(r=>r.from<=y&&y<r.to)){
  assert(p(r.owner,y),'Inactive owner '+r.owner+' '+y);assert(p(r.member,y),'Inactive member '+r.member+' '+y);
 }
}
assert.equal(a('ethiopia',1940).relationship,'occupation');assert(!a('ethiopia',1941).overlord);
assert(!a('cartography-tuva',1943).sovereign);assert.equal(a('cartography-tuva',1944).sovereign,'1939-ussr');
assert.equal(a('1918-estonia',1940).sovereign,'1939-ussr');
assert.equal(a('1918-estonia',1942).relationship,'occupation');
assert.equal(a('1918-estonia',1944).sovereign,'1939-ussr');
for(const y of [1940,1941,1944,1945])assert(!a('1815-finland',y).sovereign,'Finland annexed');
const G=require('./cartography-geometry.cjs');
for(const y of [1940,1944,1945])assert(G.covers(a('japan',y).polygons,[141.35,43.06]),'Hokkaido missing '+y);
assert(G.covers(a('japan',1944).polygons,[142.7,46.96]));assert(!G.covers(a('japan',1945).polygons,[142.7,46.96]));assert(G.covers(a('1939-ussr',1945).polygons,[142.7,46.96]));
assert(!p('1939-manchukuo',1945));assert(!p('1939-bohemia',1945));
assert.equal(a('1789-taiwan-qing',1944).sovereign,'japan');assert.equal(a('1789-taiwan-qing',1945).relationship,'administration');
assert.equal(a('early-guam',1940).sovereign,'1789-usa');assert.equal(a('early-guam',1942).overlord,'japan');assert.equal(a('early-guam',1944).sovereign,'1789-usa');
assert(!/DPRK|Republic of Korea/.test(p('late-joseon',1945).name[1]),'1948 state projected into 1945');
const raw=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
for(const key of ['entries','areas','outlines','events'])assert.equal(digest(key==='events'?raw[key].filter(e=>!e.id.startsWith('atlas-')):raw[key]),digest(c[key]),'Delivered '+key);
const baseline='.local-checks/to1945-baseline.json';if(fs.existsSync(baseline)){
 const old=JSON.parse(fs.readFileSync(baseline));
 assert.equal(digest(c.entries.map(e=>({...e,phases:e.phases.filter(p=>p.from<1940)})).filter(e=>e.phases.length)),digest(old.entries),'Earlier text changed');
 for(const key of ['areas','events'])assert.equal(digest(require('./kyrgyz-baseline.cjs')(c[key].filter(a=>a.from<1940))),digest(old[key]),'Earlier '+key+' changed');
}
// Exercise the actual timer callback at the end of the delivered timeline.
const vm=require('node:vm');let tick;
const playContext={year:1944,playing:false,playTimer:null,playDelay:100,TIMELINE_MAX:1945,TIMELINE_MIN:610,
 $:()=>({setAttribute(){},textContent:''}),clearInterval(){},setInterval(fn){tick=fn;return 1;},nextPlaybackYear:y=>Math.min(1945,y+1)};
playContext.renderYear=y=>{playContext.year=y;};
vm.createContext(playContext);
vm.runInContext(html.slice(html.indexOf('function startPlay(){'),html.indexOf('function restartPlayIfNeeded(){')),playContext);
playContext.startPlay();tick();assert.equal(playContext.year,1945);assert.equal(playContext.playing,false);
playContext.startPlay();tick();assert.equal(playContext.year,1945);assert.equal(playContext.playing,false,'Restart at maximum must not wrap to 610');
console.log(JSON.stringify({pass:true,years:6,revised:c.to1945Review.revised.length,events:c.events.filter(e=>e.from>=1940).length,checks:'global coverage, occupation/province distinction, succession, delivered data, earlier content preserved'}));
