'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const c=require('../world/catalog.cjs'),{createWorldHistory}=require('../world/core.js'),h=createWorldHistory(c);
const html=fs.readFileSync(require('node:path').join(__dirname,'../../index.html'),'utf8');
const delivered=JSON.parse(html.match(/const WORLD_HISTORY=(.*);/)[1]),dh=createWorldHistory(delivered);
assert.equal(c.range.min,610);assert(c.range.max>=1914);
// Pecos is deliberately corrected from 1838; every other older record is preserved.
// Cartographic additions have their own date/geometry tests; preserve the original-data hash.
const old={entries:c.entries.filter(e=>!e.id.startsWith('cartography-')).map(e=>({...e,phases:e.phases.filter(p=>p.from<1849)})).filter(e=>e.phases.length&&e.id!=='pecos'),areas:c.areas.filter(a=>!a.entry.startsWith('cartography-')).filter(a=>a.from<1849&&a.entry!=='pecos'),events:c.events.filter(e=>e.from<1849),sources:Object.fromEntries(Object.entries(c.sources).filter(([id])=>!id.startsWith("to1939")&&!id.startsWith("to1945")).filter(([id])=>!id.startsWith('cartography')).filter(([id])=>!/^to(?:1914|1918)/.test(id)))};
assert.equal(crypto.createHash('sha256').update(JSON.stringify(require('../world/kyrgyz-baseline.cjs')(old))).digest('hex'),'35cbb03b5319d4fcbfe78a2494611b5c5dc1915f50c4ab92182484f462a8d0cd','Previous catalogue outside the explicit Pecos correction changed');
for(const key of ['entries','areas','range'])assert.deepEqual(delivered[key],c[key]);
assert(html.includes('name="chronograph-version" content="1.15.0"'));
for(const id of ['yearRange','worldYearInput'])assert(new RegExp('id="'+id+'"[^>]*max="'+c.range.max+'"').test(html));
for(let y=1849;y<=1914;y++){
 assert.deepEqual(dh.at(y),h.at(y));assert.deepEqual(dh.areasAt(y),h.areasAt(y));
 for(const r of c.regions)assert(h.at(y,r.id).length,'Empty region '+r.id+' in '+y);
 const mapped=new Set();for(const a of h.areasAt(y)){assert(h.get(a.entry,y));assert(!mapped.has(a.entry),'Duplicate area: '+a.entry);mapped.add(a.entry);}
 for(const p of h.at(y))assert(mapped.has(p.entry.id),'Unmapped profile '+p.entry.id);
}
const p=(id,y)=>h.get(id,y)?.phase,a=(id,y)=>h.areasAt(y).find(a=>a.entry===id);
for(const [id,y,re] of [['late-hre',1867,/North German/],['late-hre',1871,/German Empire/],['1914-italy',1861,/Italy/],['1789-kokand',1876,/Ferghana Oblast/],['1789-qing',1912,/Republic/],['late-joseon',1910,/Japan/],['1789-taiwan-qing',1895,/Japan/],['1789-saint-domingue',1849,/Empire/],['1789-saint-domingue',1859,/Republic/],['early-mombasa',1861,/Zanzibar/],['hawaii',1898,/USA/]])assert(re.test(p(id,y).name[1]),id+' '+y);
assert.equal(a('late-hre',1871).kind,'polity');assert.equal(h.get('hawaii',1850).entry.kind,'state');
for(const [id,last] of [['1789-prussia',1866],['early-naples',1859],['1815-sicily',1859],['early-papal',1869],['1914-confederacy',1864],['1914-ili',1881],['1914-transvaal',1909],['1914-orange',1909]]){assert(p(id,last));assert(!p(id,last+1),id+' survived its end date');}
for(const [id,first] of [['1914-mongolia',1911],['1914-albania',1912],['1914-confederacy',1861],['1914-south-africa',1910],['1914-panama',1903],['1914-ili',1871],['1914-alaska',1867]]){assert(!p(id,first-1));assert(p(id,first));}
assert(a('1789-kokand',1864).polygons.length>a('1789-kokand',1865).polygons.length);
assert(a('1789-qing',1910).polygons.length>a('1789-qing',1911).polygons.length);
assert.notDeepEqual(a('1789-usa',1853).polygons,a('1789-usa',1854).polygons);
assert.notDeepEqual(a('1789-usa',1860).polygons,a('1789-usa',1861).polygons);
assert(a('1914-italy',1859).polygons.length<a('1914-italy',1860).polygons.length);
assert(a('1789-canada',1872).polygons.length<a('1789-canada',1873).polygons.length);
assert.notDeepEqual(a('1914-xinjiang',1881).polygons,a('1914-xinjiang',1882).polygons);
assert.equal(a('pecos',1900).kind,'landscape');
assert.equal(a('pecos',1837).kind,'cultural');assert.equal(a('pecos',1838).kind,'landscape');assert.equal(p('pecos',1838).kind,'landscape');assert(p('pecos',1838).text[1].includes('Jemez in 1838'));
const contains=(ring,[x,y])=>{let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;};
assert(!a('1914-romania',1900).polygons.some(r=>contains(r,[23.59,46.77])),'Romania must not include Cluj before 1918');
assert(!a('1789-canada',1900).polygons.some(r=>contains(r,[-56,49])),'Newfoundland is not yet a Canadian province');
const ctx=vm.createContext({TIMELINE_MAX:1914,worldHistory:dh,WORLD_HISTORY:delivered});
vm.runInContext(html.match(/const KEY_YEARS=\[[^;]+;/)[0]+html.match(/worldPlaybackYears=\[\.\.\.new Set[^;]+;/)[0]+html.match(/function nextPlaybackYear\(y\)\{[\s\S]*?\n\}/)[0]+';globalThis.next=nextPlaybackYear;',ctx);
let y=1848;const visited=new Set();while(y<1914){const next=ctx.next(y);assert(next>y&&next<=1914);visited.add(next);y=next;}
for(const e of c.events.filter(e=>e.from>=1849&&e.from<=1914)){assert(visited.has(e.from),'Skipped event '+e.id);assert(h.get(e.entry,e.from),'Event has no contemporary profile '+e.id);}
for(const d of h.changes().filter(d=>d>=1849&&d<=1914))assert(visited.has(d),'Skipped boundary change '+d);
for(const person of require('./biographies.cjs')){for(const t of person.text)assert(t.length>100);assert(html.includes(person.name[0]));assert(html.includes(person.era));}
assert.equal(Object.values(delivered.sources).filter(s=>s.urls).length,0);
console.log('PASS: 1849–1914, eight regions, preserved earlier catalogue, dated unions and partitions, mapped profiles, playback and three-language biographies.');
