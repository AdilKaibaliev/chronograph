'use strict';
const assert=require('node:assert/strict');
const c=require('./catalog.cjs'),{createWorldHistory}=require('./core.js'),h=createWorldHistory(c);
for(let y=610;y<=c.range.max;y++){
 const expected=c.entries.flatMap(entry=>{const phase=entry.phases.find(p=>y>=p.from&&y<p.to);return phase?[{entry:phase.name||phase.kind?{...entry,name:phase.name||entry.name,kind:phase.kind||entry.kind}:entry,phase,coord:phase.coord||entry.coord}]:[];});
 assert.deepEqual(h.at(y),expected);
 assert.deepEqual(h.areasAt(y),c.areas.filter(a=>y>=a.from&&y<a.to));
 for(const item of expected)assert.deepEqual(h.get(item.entry.id,y),item);
 for(const region of c.regions)assert.deepEqual(h.at(y,region.id),expected.filter(i=>i.entry.region===region.id));
}
let reads=0;const fixture={range:{min:1,max:30},entries:[{id:'a',region:'r',get phases(){reads++;return [{from:1,to:31}];}}],areas:[],events:[]};
const cached=createWorldHistory(fixture);reads=0;
for(let i=0;i<100;i++){cached.at(10);cached.get('a',10);cached.areasAt(10);cached.timeline();cached.changes();}
assert.equal(reads,1,'Repeated map reads rebuilt the profile snapshot');
const originals=h.at(1300),areas=h.areasAt(1300),timeline=h.timeline(),changes=h.changes();
h.at(1300).pop();h.areasAt(1300).reverse();h.timeline().pop();h.changes().reverse();
assert.deepEqual(h.at(1300),originals);assert.deepEqual(h.areasAt(1300),areas);assert.deepEqual(h.timeline(),timeline);assert.deepEqual(h.changes(),changes);
for(let y=1301;y<=1315;y++)h.at(y);
assert.deepEqual(h.at(1300),originals,'Evicted year did not rebuild correctly');
const frames=h.frames('late-hre');h.frames('late-hre').pop();assert.deepEqual(h.frames('late-hre'),frames);assert.deepEqual(frames,c.areas.filter(a=>a.entry==='late-hre'));
const fs=require('node:fs'),vm=require('node:vm'),runtime=fs.readFileSync(require('node:path').join(__dirname,'runtime.js'),'utf8');
let builds=0;const context={worldLegendDisclosure:{open:false},worldLegendPending:'1900|ru',worldRenderCache:{},renderWorldLegend:()=>builds++};
vm.createContext(context);vm.runInContext(runtime.match(/function refreshWorldLegend\(\)\{[^\n]+/)[0],context);
context.refreshWorldLegend();assert.equal(builds,0,'Closed legend built its hidden list');
context.worldLegendDisclosure.open=true;context.refreshWorldLegend();context.refreshWorldLegend();assert.equal(builds,1);
context.worldLegendDisclosure.open=false;context.worldLegendPending='1901|ky';context.refreshWorldLegend();assert.equal(builds,1);
context.worldLegendDisclosure.open=true;context.refreshWorldLegend();assert.equal(builds,2,'Opening a stale legend failed to refresh year/language');
console.log('PASS: cached queries equal direct catalogue queries for every year and region; bounded cache revisits and caller array mutation are safe.');
