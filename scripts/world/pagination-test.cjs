'use strict';
const assert=require('node:assert/strict'),{worldPageWindow,createWorldHistory}=require('./core.js');
const catalog=require('./catalog.cjs'),history=createWorldHistory(catalog),records=history.timeline(),state={};
let window=worldPageWindow(records,state,'all','',60),visited=[];
for(let page=0;page<window.pages;page++){
 state.page=page;window=worldPageWindow(records,state,'all','',60);assert(window.items.length<=60);visited.push(...window.items.map(e=>e.id));
}
assert.deepEqual(visited,records.map(e=>e.id),'Pagination must expose every record exactly once');
const target=records[records.length-2].id;
window=worldPageWindow(records,state,'all',target,60);assert(window.items.some(e=>e.id===target),'A selected event must open its page');
state.page=0;window=worldPageWindow(records,state,'all',target,60);assert.equal(window.page,0,'Selection must not prevent reading earlier pages');
window=worldPageWindow([],state,'empty','',60);assert.equal(window.from,0);assert.equal(window.to,0);assert.equal(window.pages,1);
const items=history.at(catalog.range.max);window=worldPageWindow(items,{},'cards',items.at(-1).entry.id,24,item=>item.entry.id);assert(window.items.some(i=>i.entry.id===items.at(-1).entry.id));assert(window.items.length<=24);
for(const record of records)assert.strictEqual(history.record(record.id),record);
for(const entry of catalog.entries)assert.strictEqual(history.entry(entry.id),entry);
assert.equal(history.record('missing'),null);
const fs=require('node:fs'),vm=require('node:vm'),runtime=fs.readFileSync(require('node:path').join(__dirname,'runtime.js'),'utf8');
const lazy=vm.runInNewContext('('+runtime.match(/function populateWorldDetails\(details,build\)\{[\s\S]*?\n\}/)[0]+')');
let builds=0,toggle;const details={open:false,addEventListener(type,fn){assert.equal(type,'toggle');toggle=fn;}};
lazy(details,()=>builds++);assert.equal(builds,0);details.open=true;toggle();assert.equal(builds,1);details.open=false;toggle();details.open=true;toggle();assert.equal(builds,1,'Reopening must not duplicate content');
lazy({open:true,addEventListener(){}},()=>builds++);assert.equal(builds,2,'Restored open details must populate immediately');
console.log('PASS: bounded pages reach all records; deep selection, backward navigation, empty filters, selected cards and indexed lookups remain correct.');
const {worldRegionalMilestones,worldEpochForYear}=require('./core.js');
assert.notEqual(worldEpochForYear(1914),worldEpochForYear(1915),'Controls must refresh at the new epoch');
const milestones=worldRegionalMilestones(history.timeline('eurasia'),1918);assert(milestones.length);assert(milestones.every(e=>e.year>=1915));
assert(worldRegionalMilestones(history.timeline('eurasia'),1866).every(e=>e.year>=1849&&e.year<=1914));
assert.deepEqual(worldRegionalMilestones([],1918),[]);
