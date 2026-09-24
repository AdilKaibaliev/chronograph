const assert=require('assert/strict');
const c=require('./catalog.cjs'),{createWorldHistory}=require('./core.js'),h=createWorldHistory(c);
const area=(id,y)=>h.areasAt(y).find(a=>a.entry===id);
// Distinguish the approximate appearance of a royal centre from later empires.
assert(!h.get('benin',1199));assert(h.get('benin',1200));
assert.equal(area('benin',1200).kind,'polity');
assert(area('benin',1200).polygons.flat().every(([x,y])=>x>5&&x<6.2&&y>6&&y<7));
assert.equal(area('gao',800).kind,'settlement');assert.equal(area('gao',1000).kind,'polity');
assert.equal(area('gao',1200).kind,'settlement');
assert(!h.get('gedi',899));assert(h.get('gedi',900));
// Post-Wari local societies are not a premature Inca empire or a united Wanka state.
for(const id of ['lucre','wanka']){assert(!h.get(id,999));assert(h.get(id,1000));assert(h.get(id,1299));assert.notEqual(area(id,1299).kind,'polity');}
assert.equal(area('xochicalco',899).kind,'polity');assert.equal(area('xochicalco',900).kind,'settlement');assert(!area('xochicalco',1000));
assert(h.get('cholula',610));assert(h.get('cholula',1299));
assert(!h.get('tajin',799));assert(h.get('tajin',800));assert(!area('tajin',1200));
// Earliest dated settlement, assembly and subordination are different stages.
assert(!h.get('iceland',869));assert.equal(area('iceland',870).kind,'settlement');
assert.equal(area('iceland',930).kind,'polity');assert(area('iceland',1262).name[1].includes('Norwegian'));
assert.equal(area('palau',1249).kind,'landscape');assert.equal(area('palau',1250).kind,'settlement');
assert.equal(h.get('samoa',1099).phase.from,610);assert.equal(h.get('samoa',1100).phase.from,1100);
assert(h.get('tonga',1250).phase.text[1].includes('Heketa'));assert.deepEqual(h.get('tonga',1250).coord,[-175.048,-21.137]);
// Expanded notes use only their active historical phase, with bibliographic support.
assert(!h.get('cahokia',1049).phase.learning);assert(h.get('cahokia',1050).phase.learning);
for(const e of c.entries)for(const p of e.phases)if(p.learning){assert(p.sources.length);for(const id of p.sources)assert(c.sources[id]);for(const values of Object.values(p.learning))assert(values.length===3&&values.every(t=>typeof t==='string'&&t.trim()));}
for(const id of ['cholula-polychrome','chokepukio-halls'])assert.equal(c.events.find(e=>e.id===id).kind,'culture');
assert.equal(c.events.find(e=>e.id==='sosso-defeat').kind,'war');
assert.equal(c.events.filter(e=>e.id==='sosso-defeat').length,1);
console.log('PASS: educational expansion chronology, differentiated territorial categories, source-backed learning, cultural events and political transitions.');
