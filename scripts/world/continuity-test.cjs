'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const catalog=require('./catalog.cjs'),{createWorldHistory}=require('./core.js');
const {mappings,legacyData}=require('./continuity.cjs'),history=createWorldHistory(catalog);
const old=new Map(legacyData().map(e=>[e.id,e]));
// The correction does not back-project any new state into the original atlas.
const originalPeriod={entries:catalog.entries.map(e=>({...e,phases:e.phases.filter(p=>p.from<1300)})).filter(e=>e.phases.length),areas:catalog.areas.filter(a=>a.from<1300)};
assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(originalPeriod)).digest('hex'),'2341270089d4f14fee424ae9f04bf236ef2a113aaa69f74c8eca81d32a813852');
for(const [id,oldId] of Object.entries(mappings)){
 const area=history.areasAt(1300).find(a=>a.entry===id),prior=old.get(oldId),frame=prior.keyframes.filter(f=>f.year<=1299).at(-1);
 assert.deepEqual(area.polygons,frame.polys,'Artificial border change at 1300: '+id);
 assert.equal(area.color,prior.color);assert.equal(area.geometryYear,frame.year);
 assert.deepEqual(area.label,prior.label);
 for(let y=1300;y<area.to;y++)assert(history.areasAt(y).includes(area));
 assert(!history.areasAt(area.to).includes(area),'Snapshot must stop at the next dated frame');
}
const members=y=>history.areasAt(y).filter(a=>a.mongolGroup).map(a=>a.entry).sort();
assert.equal(members(1300).length,4);assert.equal(members(1334).length,4);
assert(!members(1335).includes('late-ilkhan'));
assert(!history.get('late-rum-seljuk',1299));assert(history.get('late-rum-seljuk',1307));assert(!history.get('late-rum-seljuk',1308));
assert(history.get('late-trebizond',1460));assert(!history.get('late-trebizond',1461));
// A source-file boundary must not change a continuing society's colour.
for(const a of catalog.areas.filter(a=>a.to===1300)){
 const next=history.areasAt(1300).find(n=>n.entry===a.entry);if(next)assert.equal(a.color,next.color,a.entry);
}
// Rendered geometry is authoritative in the delivered single-file build too.
const html=fs.readFileSync('index.html','utf8'),delivered=JSON.parse(html.match(/const WORLD_HISTORY=(.*);/)[1]);
assert.deepEqual(delivered.areas,catalog.areas);
const runtime=fs.readFileSync('scripts/world/runtime.js','utf8');
assert(runtime.includes('worldRenderCache.map!==mapKey'));assert(runtime.includes('else if(year<1300)scheduleWorldLabels()'));
const territory=fs.readFileSync('scripts/world/territory-runtime.js','utf8');
assert(!territory.includes('getComputedTextLength'),'Pan must not force SVG layout per label');
// Direct pointer handling must cancel text selection yet retain drag and tap.
const pointer=territory.match(/path.onpointerdown=e=>\{([^\n]*)\};/)[1];
let prevented=false,captured=false,hidden=false;
const context={path:{setPointerCapture:()=>captured=true},mapState:{tx:4,ty:8},hideTooltip:()=>hidden=true,e:{button:0,pointerId:1,clientX:20,clientY:30,preventDefault:()=>prevented=true,stopPropagation:()=>{}}};
vm.runInNewContext('let pointer=null;(()=>{'+pointer+'})();',context);
assert(prevented&&captured&&hidden);
console.log('PASS: 12 legacy continuations keep dated geometry, colour and label anchors; 1300/1335 Mongol modes; Seljuk and Trebizond end dates; map selection prevention.');
