'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c=require('./catalog.cjs'),G=require('./cartography-geometry.cjs'),{createWorldHistory,worldRegionalMilestones,worldEpochForYear}=require('./core.js'),h=createWorldHistory(c),html=fs.readFileSync('index.html','utf8');
assert(c.range.max>=1960);assert(html.includes('TIMELINE_MAX='+c.range.max+';'));
const a=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),p=(id,y)=>h.get(id,y)?.phase,has=(id,y,q)=>G.covers(a(id,y).polygons,q);
for(let y=1946;y<=1960;y++){
 for(const r of c.regions)assert(h.at(y,r.id).length,'Empty region '+r.id+' '+y);
 const map=h.mapAreasAt(y);assert.equal(new Set(map.map(a=>a.entry)).size,map.length);
 for(const i of h.at(y))assert(map.some(a=>a.entry===i.entry.id),'Unmapped '+i.entry.id+' '+y);
 for(const r of c.cartography.relations.filter(r=>r.from<=y&&y<r.to)){assert(p(r.owner,y),'Dead owner '+r.owner);assert(p(r.member,y),'Dead member '+r.member);}
}
for(const e of c.entries)for(const phase of e.phases.filter(p=>p.from>=1946)){
 for(const k of ['name','title','text']){assert.equal(phase[k].length,3,e.id+' '+k);assert(phase[k].every(s=>typeof s==='string'&&s.trim()),e.id+' '+k);}
 for(const s of phase.sources)assert(c.sources[s]?.title,'Unknown source '+s);
}
const cases=[['1960-senegal',1960],['1960-mali',1960],['1960-mauritania',1960],['1960-niger',1960],['1960-upper-volta',1960],['1960-dahomey',1960],['1960-ivory-coast',1960],['1960-chad',1960],['1960-car',1960],['1960-congo-brazzaville',1960],['1960-gabon',1960],['1960-togo',1960],['1960-cameroon',1960],['mogadishu-late',1960],['1939-madagascar',1960],['1939-nigeria',1960],['1914-congo',1960],['1960-guinea',1958],['1960-ghana',1957],['1939-sudan',1956],['early-ottoman-tunis',1956],['1789-alawite',1956],['early-tripoli',1951],['1789-konbaung',1948],['1960-ceylon',1948],['early-johor',1957]];
for(const[id,y]of cases){assert(a(id,y-1).overlord||a(id,y-1).sovereign||id==='early-tripoli',id+' missing former administration');assert(!a(id,y).overlord&&!a(id,y).sovereign,id+' still colonial after independence');}
assert.equal(cases.filter(r=>r[1]===1960).length,17);
assert(!p('1960-frg',1948));assert(p('1960-frg',1949)&&p('1960-gdr',1949));assert(!p('late-hre',1949));
assert(has('1960-frg',1950,[7.1,50.74]));assert(!has('1960-frg',1950,[12.37,51.34]));assert(has('1960-gdr',1950,[12.37,51.34]));
assert(has('1960-saar',1956,[7,49.3]));assert(!has('1960-frg',1956,[7,49.3]));assert(has('1960-frg',1957,[7,49.3]));
assert(!p('1945-manchuria',1946));assert(!a('1789-taiwan-qing',1950).overlord);assert(!has('1789-qing',1955,[121.56,25.03]));
for(const y of [1946,1949,1950,1951,1960])for(const q of [[87.62,43.82],[103.83,36.06],[116.4,39.9]])assert(has('1789-qing',y,q),'China continuity '+y+' '+q);
assert(!has('1789-qing',1949,[91.13,29.65]));assert(has('1789-qing',1951,[91.13,29.65]));assert(!has('1789-qing',1960,[106.9,47.9]));
assert(has('1960-pakistan',1947,[67.01,24.86]));assert(has('1960-pakistan',1947,[90.4,23.81]));assert(!has('1960-pakistan',1947,[77.21,28.61]));
assert(!p('1960-pakistan',1946));assert(!a('1939-india',1947).overlord);assert(!has('1939-india',1950,[73.83,15.49]));assert(has('1939-india',1950,[77.21,28.61]));
assert(!has('1789-batavia',1950,[138,-4]));assert(has('1960-west-papua',1950,[138,-4]));assert(!a('1789-batavia',1950).overlord);
assert(!has('early-johor',1957,[116.07,5.98]));assert(a('1848-singapore',1960).overlord);
assert.equal(a('1914-eritrea',1953).relationship,'dependency');assert.equal(a('1914-eritrea',1953).overlord,'ethiopia');
assert(has('1939-sudan',1960,[31.6,4.85]));assert(!has('1789-alawite',1960,[-13.2,27.15]));
assert(has('1960-spanish-sahara',1960,[-13.2,27.15]));
assert(!has('1789-alawite',1957,[-12,28]));assert(has('1789-alawite',1958,[-12,28]));
assert(!has('late-hre',1948,[7,49.3]));
assert.equal(a('cartography-cyprus',1959).overlord,'1789-great-britain');assert(!a('cartography-cyprus',1960).overlord);
assert.equal(a('1960-sikkim',1950).relationship,'dependency');assert(!has('1939-india',1960,[88.61,27.33]));
assert(has('1960-british-borneo',1957,[116.1,5.8]));assert.equal(a('1960-british-borneo',1960).overlord,'1789-great-britain');
assert(!p('1960-rhodesia-federation',1952));assert.equal(a('1960-nyasaland',1953).sovereign,'1960-rhodesia-federation');
assert.equal(a('1960-rhodesia-federation',1960).relationship,'dependency');
assert(!has('1960-west-papua',1960,[131.4,-7.6]));
for(const id of ['ife','benin','1789-oyo','dongola','early-funj'])assert(!p(id,1960).name[1].includes('British'));
assert.equal(a('antarctica',1960).kind,'landscape');
const {worldReadingOrder,worldPageWindow}=require('./core.js');
const items=h.at(1960,'africa'),ordered=worldReadingOrder(items,h.mapAreasAt(1960,'africa'),1960);
assert.deepEqual(new Set(ordered.map(i=>i.entry.id)),new Set(items.map(i=>i.entry.id)));
assert(ordered.findIndex(i=>i.entry.id==='1960-ghana')<ordered.findIndex(i=>i.entry.id==='1789-asante'));
assert.deepEqual(h.at(1960,'africa'),items,'Ordering must not mutate the cached query');
assert.equal(worldReadingOrder(items,[],1945),items);
assert(worldPageWindow(ordered,{},'africa','1789-asante',24,i=>i.entry.id).items.some(i=>i.entry.id==='1789-asante'));
assert.equal(a('late-kyrgyz-tianshan',1960).sovereign,'1939-ussr');assert(p('late-kyrgyz-tianshan',1954).text[2].includes('Илимдер академиясы'));
assert(!a('1914-australian-colonies',1950).overlord);assert.equal(a('1789-sydney',1950).sovereign,'1914-australian-colonies');
assert.equal(a('1815-sham',1958).sovereign,'early-ottoman-egypt-sham');assert(!a('1815-sham',1957).sovereign);
assert(p('antarctica',1959).text[1].includes('will enter into force'));assert(!/boundaries|borders/.test(p('antarctica',1959).text[1]));
assert.deepEqual(worldEpochForYear(1960),1946);assert(worldRegionalMilestones(h.timeline(),1960).every(e=>e.year>=1946&&e.year<=1960));
// Earlier records are an independent saved snapshot, not regenerated expectations.
const base='.local-checks/to1960-catalog-baseline.json';if(fs.existsSync(base)){
 const b=JSON.parse(fs.readFileSync(base,'utf8')),archived=require('./arctic-baseline.cjs')(c,undefined,1946);
 for(const field of ['areas','events','outlines'])assert.deepEqual(archived[field].filter(x=>x.from<1946),b[field],field+' before 1946 changed');
 for(const e of b.entries)assert.deepEqual(archived.entries.find(n=>n.id===e.id).phases.filter(p=>p.from<1946),e.phases,'Earlier phases '+e.id);
}
let tick;const ctx={year:1959,playing:false,playTimer:null,playDelay:100,TIMELINE_MAX:1960,TIMELINE_MIN:610,$:()=>({setAttribute(){},textContent:''}),clearInterval(){},setInterval(fn){tick=fn;return 1;},nextPlaybackYear:y=>Math.min(1960,y+1)};
ctx.renderYear=y=>ctx.year=y;vm.createContext(ctx);
vm.runInContext(html.slice(html.indexOf('function startPlay(){'),html.indexOf('function restartPlayIfNeeded(){')),ctx);
ctx.startPlay();tick();assert.equal(ctx.year,1960);assert.equal(ctx.playing,false);
ctx.startPlay();tick();assert.equal(ctx.year,1960);assert.equal(ctx.playing,false);
console.log(JSON.stringify({pass:true,years:15,revised:c.to1960Review.revised.length,events:c.events.filter(e=>e.from>=1946).length,independenceTransitions:cases.length}));
