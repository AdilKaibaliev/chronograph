'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const c=require('../world/catalog.cjs'),{createWorldHistory}=require('../world/core.js'),h=createWorldHistory(c);
const html=fs.readFileSync(require('node:path').join(__dirname,'../../index.html'),'utf8');
const delivered=JSON.parse(html.match(/const WORLD_HISTORY=(.*);/)[1]),dh=createWorldHistory(delivered);
assert.equal(c.range.min,610);assert(c.range.max>=1815);
for(const key of ['range','entries','areas'])assert(JSON.stringify(delivered[key])===JSON.stringify(c[key]),'Delivered '+key+' differs');
for(const [id,source] of Object.entries(c.sources).filter(([id])=>!id.startsWith("to1939")&&!id.startsWith("to1945"))){assert.equal(delivered.sources[id].title,source.title);assert(!delivered.sources[id].urls,'Public sources must remain plain text');}
assert.deepEqual(delivered.events.filter(e=>!e.base),c.events);
assert(html.includes('const TIMELINE_MIN=610,TIMELINE_MAX='+c.range.max+';'));
for(const id of ['yearRange','worldYearInput'])assert(new RegExp('id="'+id+'"[^>]*max="'+c.range.max+'"').test(html));
assert(html.includes("'XVIII','XIX'"),'The nineteenth-century filter is missing');
// Cartographic additions have their own date/geometry tests; preserve the original-data hash.
const old={entries:c.entries.filter(e=>!e.id.startsWith('cartography-')).map(e=>({...e,phases:e.phases.filter(p=>p.from<1790)})).filter(e=>e.phases.length),areas:c.areas.filter(a=>!a.entry.startsWith('cartography-')).filter(a=>a.from<1790)};
assert.equal(crypto.createHash('sha256').update(JSON.stringify(require('../world/kyrgyz-baseline.cjs')(old))).digest('hex'),'14524ecd14c7eb7cdeef1d4ffd05d6e752c4e2040604f936c22a51279de9ef4a','Published 610–1789 catalogue changed');
for(let y=1790;y<=1815;y++){
 assert.deepEqual(dh.at(y),h.at(y));assert.deepEqual(dh.areasAt(y),h.areasAt(y));
 for(const r of c.regions)assert(h.at(y,r.id).length,'Empty '+r.id+' in '+y);
 for(const area of h.areasAt(y))assert(h.get(area.entry,y),'Territory without a contemporary profile');
}
const phase=(id,y)=>h.get(id,y)?.phase,area=(id,y)=>h.areasAt(y).find(a=>a.entry===id);
for(const [id,last] of [['early-commonwealth',1794],['1789-zand',1793],['1789-afsharid',1795]]){assert(phase(id,last));assert(!phase(id,last+1));assert(!area(id,last+1));}
assert(!phase('1815-warsaw',1806));assert(phase('1815-warsaw',1807));
assert(!phase('1815-finland',1808));assert(phase('1815-finland',1809));
assert.equal(area('early-sweden',1808).polygons.length-area('early-sweden',1809).polygons.length,1);
assert(!phase('1815-norway',1813));assert(phase('1815-norway',1814));
assert(phase('early-milan',1802).title[1].includes('Italian Republic'));
assert(phase('1789-mobile',1812).title[1].includes('Spain'));assert(phase('1789-mobile',1813).title[1].includes('United States'));
assert.notDeepEqual(area('1789-muscogee',1813).polygons,area('1789-muscogee',1814).polygons);
assert(!phase('1815-louisiana-purchase',1802));assert.equal(area('1815-louisiana-purchase',1803).kind,'influence');
assert(phase('1789-saint-domingue',1804).title[1].includes('Independent Haiti'));
assert(phase('early-new-spain',1815).title[1].includes('New Spain'));
assert(phase('1789-chile',1814).title[1].includes('Spanish reconquest'));
assert(phase('early-portuguese-brazil',1815).title[1].includes('Kingdom'));
assert(!phase('1815-kauai',1810));assert(phase('1815-kauai',1809));
assert.equal(area('hawaii',1809).polygons.length,2);assert.equal(area('hawaii',1810).polygons.length,3);
assert(!phase('1815-hobart',1802));assert.deepEqual(h.get('1815-hobart',1804).coord,[147.33,-42.88]);
assert(!phase('1815-bathurst',1814));assert(phase('1815-bathurst',1815));
assert.equal(area('1789-tasmania',1815).kind,'cultural');assert.equal(area('antarctica',1815).kind,'uninhabited');
const ctx=vm.createContext({TIMELINE_MAX:1815,worldHistory:dh,WORLD_HISTORY:delivered});
vm.runInContext(html.match(/const KEY_YEARS=\[[^;]+;/)[0]+html.match(/worldPlaybackYears=\[\.\.\.new Set[^;]+;/)[0]+html.match(/function nextPlaybackYear\(y\)\{[\s\S]*?\n\}/)[0]+';globalThis.next=nextPlaybackYear;',ctx);
let y=1789;const visited=new Set();while(y<1815){const next=ctx.next(y);assert(next>y&&next<=1815);visited.add(next);y=next;}
for(const e of c.events.filter(e=>e.from>1789&&e.from<=1815))assert(visited.has(e.from),'Skipped event '+e.id);
for(const d of h.changes().filter(d=>d>1789&&d<=1815))assert(visited.has(d),'Skipped territorial change '+d);
for(const p of require('./biographies.cjs')){for(const t of p.text)assert(t.length>100);assert(html.includes(p.name[0]));assert(html.includes(p.era));}
console.log('PASS: 610–1815 delivery; unchanged published catalogue; dated European, American and Pacific transfers; every new event reachable in playback; three-language biographies.');
