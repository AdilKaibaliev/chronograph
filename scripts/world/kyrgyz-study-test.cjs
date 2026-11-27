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
assert.equal(catalog.chapters.length,11);
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
// A common year does not mean two records describe the same event.
const stagePlaces={610:[92,54],820:[92,54],840:[102.66,47.43],847:[92.5,53.6],860:[108.94,34.34],924:[94,53],1207:[92.5,53.6],1218:[92.5,53.6],1273:[92.5,53.6],1293:[92.5,53.6]};
for(const [year,point]of Object.entries(stagePlaces)){
 const lesson=course.record('stage-'+year);assert.deepEqual(lesson.coord,point,'Wrong geography for Kyrgyz stage '+year);
 if(lesson.eventId){const linked=world.events.find(e=>e.id===lesson.eventId);assert.deepEqual(linked.title,lesson.title,'Unrelated same-year event');assert(linked.sources.includes('kyrgyz-stage-'+year),'Missing Kyrgyz event provenance');}
}
assert.equal(course.record('stage-610').eventId,undefined,'Do not link the Kyrgyz overview to the beginning of revelation');
assert.deepEqual(course.record('stage-610').mapPlaces[0][0],[92,54]);
assert.deepEqual(world.events.find(e=>e.id==='atlas-610').coord,[39.8579,21.3891],'The independent Mecca event must retain its own location');
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
new vm.Script(fs.readFileSync(__dirname+'/kyrgyz-geography-runtime.js','utf8'));
const school=require('./kyrgyz-school-data.cjs');
assert(school.events.length>=85,'Retain the geographic textbook coverage');
for(const entry of school.events){assert.deepEqual(course.record(entry.id),entry,'School record lost in integration: '+entry.id);}
// Inclusive event intervals, distinct locations and no same-coordinate duplicates.
for(const y of [610,840,1514,1517,1522,1847,1855,1862,1876,1916,1917,1920,1924,1926,1936,1978,1982,1991,2010]){
 const current=course.at(y);assert(current.length,'No history at '+y);
 assert(current.every(e=>e.from<=y&&y<=e.to),'Wrong-year events at '+y);
 for(const g of course.placesAt(y)){assert.equal(new Set(g.lessons.map(e=>e.id)).size,g.lessons.length);for(const e of g.lessons)assert(e.mapPlaces.some(p=>p[0].join(',')===g.coord.join(',')));}
}
assert(course.placesAt(610).some(p=>p.coord[0]>75&&p.coord[0]<76&&p.coord[1]>42),'Tian Shan history remains visible independently of the Yenisei');
for(const id of ['kemin-1916','kanaat-1916','boom-1916','tokmok-1916','tyup-1916'])assert(course.at(1916).some(e=>e.id==='ky-school-'+id));
assert(!course.at(1917).some(e=>e.id==='ky-school-tokmok-1916'),'A battle must not persist into an unrelated year');
assert(!course.at(1830).some(e=>e.id==='ky-school-tailak'),'Anti-Kokand campaign begins in 1831');
assert(course.at(1838).some(e=>e.id==='ky-school-tailak'));
assert(!course.at(1839).some(e=>e.id==='ky-school-tailak'),'Do not show Tailak commanding after his death in 1838');
assert(course.at(1920).some(e=>e.id==='ky-school-refugee-assistance'));
assert(!course.at(1935).some(e=>e.id==='ky-school-ssr-1936'));
assert(course.at(1936).some(e=>e.id==='ky-school-ssr-1936'));
assert.equal(course.record('ky-school-early-tianshan-question').route,undefined,'Do not invent a continuous early migration path');
assert(!html.includes("e.stopImmediatePropagation();showKyrgyz();"),'Early history buttons must open the unified course');
// The timeline caption must not clamp ancient years to the 610 overview,
// or replace a selected campaign with a different same-year relocation.
const caption={dataset:{}},captionEvents={},captionObservers=[];
const captionContext={year:610,language:'ru',activeStudy:false,WORLD_HISTORY:{entries:[],events:[]},KYRGYZ_WITNESSES:[],ANCIENT_PREVIEW:read('ANCIENT_PREVIEW'),worldHistory:{at:()=>[]},
 document:{createElement:()=>caption,body:{classList:{contains:()=>captionContext.activeStudy}},addEventListener:(name,fn)=>captionEvents[name]=fn},
 $:()=>({querySelector:()=>({after(){}})}),wl:r=>r[['ru','en','ky'].indexOf(captionContext.language)],translate:s=>s,kyrgyzHistoryForYear:()=>({year:610,title:'610 overview'}),
 localeSelect:{addEventListener:(name,fn)=>captionEvents.locale=fn},MutationObserver:class{constructor(fn){captionObservers.push(fn);}observe(){}}};
vm.runInNewContext(fs.readFileSync('scripts/world/kyrgyz-parallel.js','utf8'),captionContext);
for(const y of [-350000,-201,-49,609]){captionContext.year=y;captionObservers[0]();assert(!caption.textContent.includes('610 overview'),'Future caption at '+y);}
captionContext.year=-201;captionObservers[0]();assert(caption.textContent.includes('Гэгунь'));
captionContext.year=1293;captionContext.activeStudy=true;caption.dataset.studyTitle='1293 · Тутуха на Енисее';captionEvents['kyrgyz-caption-change']();captionObservers[0]();assert(caption.textContent.endsWith(caption.dataset.studyTitle),'Date observer replaced the selected episode');
caption.dataset.studyTitle='';captionEvents['kyrgyz-caption-change']();assert(!caption.textContent.includes('Тутуха'),'Old episode persisted after changing year');
caption.dataset.studyTitle='1293 · Тутуха на Енисее';captionContext.activeStudy=false;captionObservers[0]();assert(!caption.textContent.includes('Тутуха'),'Closed study caption persisted');
console.log(JSON.stringify({pass:true,lessons:ids.size,chapters:catalog.chapters.map(c=>[c.id,c.lessons.length]),newEvents:additions.events.length,checks:'dates, three languages, sources, destinations, return branch, flight, ancient continuity, filtered navigation and no false tribal borders'}));
