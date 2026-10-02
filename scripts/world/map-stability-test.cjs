'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]);
const G=require('./cartography-geometry.cjs'),h=require('./core.js').createWorldHistory(c);
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id);
const area=r=>r.reduce((sum,p)=>sum+G.signed(p),0);
let checks=0;
// Xinjiang, Hexi and the eastern mainland share one land component. Mongolia
// and Tibet are not annexed to make the component look larger.
for(let y=1912;y<=1945;y++){
 const a=at('1789-qing',y),main=G.multi(a.polygons).find(p=>G.covers(p,[103.8,36.1]));
 assert(main,'Gansu missing '+y);
 for(const p of [[75.99,39.47],[87.62,43.82],[93.5,42.8],[94.7,40.1],[98.5,39.7],[116.4,39.9]]){assert(G.covers(main,p),'Artificial China gap '+y+' '+p);checks++;}
 for(const p of [[91.13,29.65],[106.9,47.9],[131.9,43.1]]){assert(!G.covers(a.polygons,p),'Unwarranted annexation '+y+' '+p);checks++;}
 assert(!at('cartography-tibet',y).sovereign,'Tibet administration lost');
}
for(const[id,y]of [['1789-qing',1919],['1789-spain',1919],['japan',1919]]){
 assert(Math.abs(area(at(id,y).polygons)/area(at(id,y-1).polygons)-1)<.015,id+' jumps at module boundary');
}
for(const y of [1918,1919,1928,1939,1940,1944])for(const p of [[141.35,43.06],[142.7,46.96]]){assert(G.covers(at('japan',y).polygons,p),'Japan lost northern islands '+y);checks++;}
for(const[y,p,want]of [
 [1695,[93.5,42.8],false],[1696,[93.5,42.8],true],
 [1754,[87.62,43.82],false],[1755,[87.62,43.82],true],
 [1758,[75.99,39.47],false],[1759,[75.99,39.47],true],
 [1875,[87.62,43.82],false],[1876,[87.62,43.82],true],
 [1876,[75.99,39.47],false],[1877,[75.99,39.47],true],
 [1877,[79.92,37.11],false],[1878,[79.92,37.11],true],
 [1881,[81.3,43.9],false],[1882,[81.3,43.9],true]
]){assert.equal(G.covers(at('1789-qing',y).polygons,p),want,'Qing stage '+y+' '+p);checks++;}
const baseline='.local-checks/release115-baseline.json';
if(fs.existsSync(baseline)){
 const before=JSON.parse(fs.readFileSync(baseline));
 for(const key of ['entries','events'])assert.deepEqual(c[key],before[key],'Narratives changed '+key);
 assert.deepEqual(require('./geometry-regression.cjs')(c.areas),require('./geometry-regression.cjs')(before.areas),'Unexpected historical change');
}
// Exercise cancellation and cleanup of the actual map transition implementation.
let now=1000,reduced=false,nextTimer=1;const timers=new Map(),ghosts=new Set(),animations=new Set();
function layer(){return {childElementCount:1,classList:{contains:()=>false},
 cloneNode(){return {removeAttribute(){},classList:{add(){}},setAttribute(k,v){this[k]=v;},style:{},querySelectorAll:()=>[],remove(){ghosts.delete(this);},animate(){return animate();}};},
 after(g){assert.equal(g.style.pointerEvents,'none');assert.equal(g['aria-hidden'],'true');ghosts.add(g);},animate(){return animate();}};}
function animate(){const a={cancel(){animations.delete(a);}};animations.add(a);return a;}
const context={year:1900,EMPIRES:[],LEGACY_CARTOGRAPHY:{frames:{}},worldHistory:{mapAreasAt:y=>[{geometryId:y<1902?'a':'b'}]},
 performance:{now:()=>now},layerState:{empires:true},document:{body:{classList:{contains:()=>false}}},matchMedia:()=>({matches:reduced}),
 empireLayer:layer(),worldTerritoryLayer:layer(),setTimeout:f=>{timers.set(nextTimer,f);return nextTimer++;},clearTimeout:id=>timers.delete(id),worldMapBefore:null,worldMapAfter:null};
vm.createContext(context);vm.runInContext(fs.readFileSync('scripts/world/map-transition.js','utf8'),context);
context.worldMapBefore(1901);context.worldMapAfter();assert.equal(ghosts.size,0,'Same geometry animated');
now+=150;context.worldMapBefore(1902);context.worldMapAfter();assert.equal(ghosts.size,2);assert.equal(animations.size,4);
for(const f of [...timers.values()])f();assert.equal(ghosts.size,0);assert.equal(animations.size,0);
now+=150;context.worldMapBefore(1902);context.worldMapAfter();assert.equal(ghosts.size,2);
now+=25;context.worldMapBefore(1903);context.worldMapAfter();assert.equal(ghosts.size,0,'Rapid input leaves a stale map');assert.equal(animations.size,0);
now+=150;reduced=true;context.worldMapBefore(1902);context.worldMapAfter();assert.equal(ghosts.size,0,'Reduced motion ignored');
assert(!/class=["'](?:pulse|time-pulse)["']/.test(html),'Pulsing city nodes remain');
assert(!html.includes('@keyframes eventPulse')&&!html.includes('@keyframes pulse{'),'City size animation remains');
assert(html.includes('function pulseEvent(){pulseLayer.replaceChildren();}'));
console.log(JSON.stringify({pass:true,geographicControls:checks,checks:'connected China, dated Qing campaigns, retained Japanese islands, archived narratives, transition cleanup/cancellation/reduced motion, stable city markers'}));
