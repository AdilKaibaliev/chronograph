'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const {createKyrgyzStudy}=require('./kyrgyz-study-core.js');
const html=fs.readFileSync('index.html','utf8');
const read=name=>{const prefix='const '+name+'=',at=html.indexOf(prefix);assert(at>=0,name);const start=at+prefix.length;return JSON.parse(html.slice(start,html.indexOf(';\n',start)));};
const catalog=read('KYRGYZ_STUDY'),world=read('WORLD_HISTORY'),course=createKyrgyzStudy(catalog),additions=require('./kyrgyz-study-data.cjs');
const translated=(value,where)=>assert(Array.isArray(value)&&value.length===3&&value.every(s=>typeof s==='string'&&s.trim()),where);
const coordinate=(p,where)=>assert(Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90,where);
const ids=new Set();
for(const e of catalog.lessons){
 assert(!ids.has(e.id),'Duplicate '+e.id);ids.add(e.id);
 assert(Number.isInteger(e.year)&&e.year!==0&&e.from<=e.year&&e.year<=e.to,'Date '+e.id);
 translated(e.title,e.id+' title');translated(e.text,e.id+' body');if(e.periodLabel)translated(e.periodLabel,e.id+' date');
 assert(e.sources.length&&e.sources.every(s=>typeof s==='string'&&s.trim()),'References '+e.id);
 assert(e.sources.every(s=>!s.includes('https://')),'Book citations only '+e.id);
 for(const [p,name]of e.mapPlaces){coordinate(p,e.id);translated(name,e.id+' place');}
 for(const p of e.route||[])coordinate(p,e.id+' route');
 assert(course.activeAt(e.id,e.year),e.id);assert(!course.activeAt(e.id,e.from-1),e.id+' starts');assert(!course.activeAt(e.id,e.to+1),e.id+' ends');
 assert(!e.polygons&&!e.border,'No invented tribal boundaries '+e.id);
}
assert(ids.size>=100,'Retain earlier reviewed history, not just new cards');
assert.equal(catalog.chapters.length,8);
for(const c of catalog.chapters){
 translated(c.title,c.id);translated(c.intro,c.id);assert(c.lessons.length);
 assert.equal(new Set(c.lessons).size,c.lessons.length);
 assert(c.lessons.every(id=>ids.has(id)),c.id+' missing episode');
 const list=course.list(c.id);for(let i=0;i<list.length;i++){
  assert.equal(course.neighbour(c.id,list[i].id,-1)?.id,list[i-1]?.id);
  assert.equal(course.neighbour(c.id,list[i].id,1)?.id,list[i+1]?.id);
  if(i)assert(list[i].year>=list[i-1].year,'Chronological '+c.id);
 }
 if(c.question){translated(c.question,c.id);translated(c.answer,c.id);}
}
assert.equal(course.nearest('early',-350000).id,'ky-gegun-modu');
assert(course.record('ky-gegun-modu').regional);
assert.equal(course.record('ky-jiankun-zhizhi').mapPlaces.length,0,'Do not turn unlocated textual distances into an exact migration path');
for(const id of ['stage-840','stage-1218','stage-1293','ky-study-maitobe-1847','ky-study-pishpek-1862'])assert(course.list('battles').some(e=>e.id===id),'Battle missing '+id);
assert.notEqual(course.record('stage-1293').kind,course.record('witness-1293').kind,'Separate the campaign and relocation in 1293');
assert.deepEqual(course.record('stage-840').route.at(-1),[102.66,47.43]);
const pamir=course.list('pamir');
assert(pamir.findIndex(e=>e.id==='witness-1982')<pamir.findIndex(e=>e.id==='ky-study-turkey-temporary-1982'),'Arrival precedes temporary housing');
for(const id of ['ky-study-pamir-china-1946','ky-study-pamir-return-1950','witness-1978','ky-study-pamir-return-1979','witness-1982','ky-study-turkey-temporary-1982','witness-1987'])assert(pamir.some(e=>e.id===id),id);
const outward=course.record('witness-1978'),returning=course.record('ky-study-pamir-return-1979');
assert.deepEqual(outward.route,returning.route.slice().reverse(),'A real return branch, not all refugees moving to Turkey');
assert.equal(course.record('witness-1982').transport,'flight');
assert.deepEqual(course.record('witness-1982').route.at(-1),[35.32,37],'Arrival at Adana, not Ulupamir in 1982');
assert.equal(course.record('ky-study-turkey-temporary-1982').route,undefined,'Independent temporary residences are not one serial itinerary');
assert.equal(course.record('witness-1987').from,1987);assert.equal(course.record('witness-1987').to,1988);
assert.deepEqual(course.record('witness-1987').coord,[43.284,39.193]);
assert.equal(course.record('ky-study-pamir-china-1946').year,1948);
assert(course.record('ky-study-pamir-china-1946').approx,'The departure year is not exactly dated');
assert.equal(course.list('tribes').filter(e=>e.tribal).length,8);
assert(course.list('all','Бугу').some(e=>e.id==='ky-study-tribe-bugu'));
assert(course.list('tribes','Сарыбагыш').some(e=>e.id==='ky-study-tribe-sarybagysh'));
assert(course.list('pamir','Gilgit').some(e=>e.id==='witness-1978'));
assert(course.list('pamir','1982').some(e=>e.id==='witness-1982'));
assert(course.list('pamir','1982').some(e=>e.id==='ky-study-turkey-temporary-1982'));
assert(course.list('pamir','Гилгит').some(e=>e.id==='ky-study-pamir-return-1979'));
assert.equal(course.list('all','zz-no-match-zz').length,0);
for(const e of additions.events){const published=world.events.find(x=>x.id===e.id);assert(published,'General atlas event missing '+e.id);assert.deepEqual(published,e);assert(e.sources.every(id=>world.sources[id]));}
new vm.Script(fs.readFileSync(__dirname+'/kyrgyz-study-runtime.js','utf8'));
assert(!html.includes("e.stopImmediatePropagation();showKyrgyz();"),'Early history buttons must open the unified course');
console.log(JSON.stringify({pass:true,lessons:ids.size,chapters:catalog.chapters.map(c=>[c.id,c.lessons.length]),newEvents:additions.events.length,checks:'dates, three languages, sources, destinations, return branch, flight, ancient continuity, filtered navigation and no false tribal borders'}));
