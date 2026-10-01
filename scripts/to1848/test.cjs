'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const c=require('../world/catalog.cjs'),{createWorldHistory}=require('../world/core.js'),h=createWorldHistory(c);
const html=fs.readFileSync(require('node:path').join(__dirname,'../../index.html'),'utf8');
const delivered=JSON.parse(html.match(/const WORLD_HISTORY=(.*);/)[1]),dh=createWorldHistory(delivered);
assert.equal(c.range.min,610);assert(c.range.max>=1848);
// Cartographic additions have their own date/geometry tests; preserve the original-data hash.
const old={entries:c.entries.filter(e=>!e.id.startsWith('cartography-')).map(e=>({...e,phases:e.phases.filter(p=>p.from<1816)})).filter(e=>e.phases.length),areas:c.areas.filter(a=>!a.entry.startsWith('cartography-')).filter(a=>a.from<1816),events:c.events.filter(e=>e.from<1816),sources:Object.fromEntries(Object.entries(c.sources).filter(([id])=>!id.startsWith("to1939")&&!id.startsWith("to1945")).filter(([id])=>!id.startsWith('cartography')).filter(([id])=>!/^to(?:1848|1914|1918)/.test(id)))};
assert.equal(crypto.createHash('sha256').update(JSON.stringify(require('../world/kyrgyz-baseline.cjs')(old))).digest('hex'),'ef69981bc749dd23713b5e34cd9c080218527af337204c80d6adec771d1c56d5','Previous 610–1815 catalogue changed');
for(const key of ['entries','areas','range'])assert.deepEqual(delivered[key],c[key]);
assert(html.includes('TIMELINE_MAX='+c.range.max+';'));assert(html.includes('name="chronograph-version"')); 
for(const id of ['yearRange','worldYearInput'])assert(new RegExp('id="'+id+'"[^>]*max="'+c.range.max+'"').test(html));
for(let y=1816;y<=1848;y++){
 assert.deepEqual(dh.at(y),h.at(y));assert.deepEqual(dh.areasAt(y),h.areasAt(y));
 for(const r of c.regions)assert(h.at(y,r.id).length,'Empty region '+r.id+' in '+y);
 const seen=new Set();for(const a of h.areasAt(y)){assert(h.get(a.entry,y));assert(!seen.has(a.entry),'Two active areas for '+a.entry);seen.add(a.entry);}
 for(const p of h.at(y))assert(seen.has(p.entry.id),'Unmapped profile '+p.entry.id);
}
const p=(id,y)=>h.get(id,y)?.phase,a=(id,y)=>h.areasAt(y).find(a=>a.entry===id);
for(const [id,y] of [['1848-greece',1821],['1848-pishpek',1825],['1848-liberia',1822],['1848-perth',1829],['1848-melbourne',1835],['1848-hongkong',1842],['1848-kashmir',1846]]){assert(!p(id,y-1));assert(p(id,y));assert(a(id,y));}
assert(!p('1815-tambora',1816));assert(!p('1815-haiti-north',1820));assert(!p('1848-abdalkadir',1848));
for(const [id,y0,y1,re] of [['early-st-augustine',1820,1821,/USA/],['1789-gulf-florida',1820,1821,/USA/],['1789-alta-california',1820,1821,/Mexico/],['early-portuguese-brazil',1821,1822,/Empire/],['early-champa',1831,1832,/communities/],['early-tripoli',1834,1835,/Ottoman/],['early-mombasa',1836,1837,/· Oman$/],['late-france',1847,1848,/Republic/]]){assert(!re.test(p(id,y0).name[1]),id);assert(re.test(p(id,y1).name[1]),id);}
assert.equal(a('early-champa',1832).kind,'cultural');
assert(a('1789-russian-empire',1828).polygons.length>a('1789-russian-empire',1827).polygons.length);
assert(a('1789-qajar',1828).polygons.length<a('1789-qajar',1827).polygons.length);
assert.equal(a('early-algiers',1830).polygons.length,1);assert.equal(a('early-algiers',1831).polygons.length,2);assert.equal(a('early-algiers',1837).polygons.length,3);
assert(a('1789-new-granada',1819).polygons.length<a('1789-new-granada',1821).polygons.length);
assert(!p('1848-caribbean-royalists',1821));assert(p('1848-el-salvador',1838));
assert(a('1789-new-granada',1829).polygons.length>a('1789-new-granada',1830).polygons.length);
assert(p('1848-venezuela',1830));assert(p('1848-ecuador',1830));
assert(h.get('1789-muscogee',1840).coord[0]<-90);assert(h.get('1789-cherokee',1840).coord[0]<-90);
assert.equal(a('antarctica',1848).kind,'uninhabited');assert.equal(a('1848-ross-sea',1842).kind,'landscape');
const ctx=vm.createContext({TIMELINE_MAX:1848,worldHistory:dh,WORLD_HISTORY:delivered});
vm.runInContext(html.match(/const KEY_YEARS=\[[^;]+;/)[0]+html.match(/worldPlaybackYears=\[\.\.\.new Set[^;]+;/)[0]+html.match(/function nextPlaybackYear\(y\)\{[\s\S]*?\n\}/)[0]+';globalThis.next=nextPlaybackYear;',ctx);
let y=1815;const visited=new Set();while(y<1848){const next=ctx.next(y);assert(next>y&&next<=1848);visited.add(next);y=next;}
for(const e of c.events.filter(e=>e.from>1815&&e.from<=1848)){assert(visited.has(e.from),'Skipped event '+e.id);assert(h.get(e.entry,e.from),'Event has no contemporary profile '+e.id);}
for(const d of h.changes().filter(d=>d>1815&&d<=1848))assert(visited.has(d),'Skipped territorial change '+d);
for(const person of require('./biographies.cjs')){for(const t of person.text)assert(t.length>100);assert(html.includes(person.name[0]));assert(html.includes(person.era));}
assert.equal(Object.values(delivered.sources).filter(s=>s.urls).length,0);
console.log('PASS: 1816–1848 in eight regions; unchanged 610–1815; mapped profiles, dated transfers, removals, breakups, all events in playback and biographies in three languages.');

