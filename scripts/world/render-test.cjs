const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const catalog=require('./catalog.cjs');
const {createWorldHistory}=require('./core.js');

// Exercise the production renderers against a small SVG DOM. Geometry, layout and
// pointer hit testing are covered by the browser review; this test covers which
// dated features reach the DOM, independently of the selected reading region.
class SvgNode {
 constructor(name){
  this.nodeName=name;this.children=[];this.attributes={};this.dataset={};this.textContent='';
  this.style={setProperty:(name,value)=>{this.style[name]=String(value);}};
  this.classList={
   contains:name=>(this.attributes.class||'').split(/\s+/).includes(name),
   toggle:(name,force)=>{
    const values=new Set((this.attributes.class||'').split(/\s+/).filter(Boolean));
    const enabled=force===undefined?!values.has(name):force;
    if(enabled)values.add(name);else values.delete(name);
    this.attributes.class=[...values].join(' ');return enabled;
   }
  };
 }
 setAttribute(name,value){
  this.attributes[name]=String(value);
  if(name.startsWith('data-'))this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(value);
 }
 getAttribute(name){return this.attributes[name]??null;}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 addEventListener(){}
 get firstChild(){return this.children[0]||null;}
}

const runtime=fs.readFileSync(path.join(__dirname,'runtime.js'),'utf8');
const start=runtime.indexOf('function renderWorldMap(){');
const end=runtime.indexOf('function updateWorldMarkerScale(){',start);
assert(start>=0&&end>start,'Cannot locate the production map renderer');
const context={
 WORLD_HISTORY:catalog,worldHistory:createWorldHistory(catalog),
 year:1299,worldState:{region:'arctic',area:'',selected:'',event:''},
 layerState:{empires:true,places:true},overlayOpacity:.5,
 worldTerritoryLayer:new SvgNode('g'),worldTerritoryLabels:new SvgNode('g'),worldLayer:new SvgNode('g'),
 document:{createElementNS:(_,name)=>new SvgNode(name)},svg:{namespaceURI:'http://www.w3.org/2000/svg'},
 SVG_W:1440,SVG_H:720,TIMELINE_MAX:catalog.range?.max??1299,
 project:([x,y])=>[x,y],polygonPath:rings=>rings.map(ring=>'M'+ring.map(p=>p.join(' ')).join('L')+'Z').join(''),
 wl:row=>row[0],wt:key=>key,hideTooltip:()=>{},updateWorldMarkerScale:()=>{}
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'territory-runtime.js'),'utf8'),context,{filename:'territory-runtime.js'});
vm.runInContext(runtime.slice(start,end),context,{filename:'runtime.js:renderWorldMap'});

const expectedAreas=year=>catalog.areas.filter(a=>year>=a.from&&year<a.to);
const expectedPlaces=year=>catalog.entries.filter(e=>e.phases.some(p=>year>=p.from&&year<p.to));
const sorted=values=>[...values].sort();
let renders=0;
function checkRender(year,region){
 context.year=year;context.worldState.region=region;
 context.renderWorldMap();renders++;
 const actual=context.worldTerritoryLayer.children;
 const expected=expectedAreas(year);
 assert.deepEqual(sorted(actual.map(g=>g.getAttribute('data-territory-frame'))),sorted(expected.map(a=>a.id)),`Lost or stale territorial frames: ${year}, ${region}`);
 assert.deepEqual(sorted(actual.map(g=>g.getAttribute('data-world-area'))),sorted(expected.map(a=>a.entry)),`Region selection hid territory: ${year}, ${region}`);
 assert.equal(new Set(actual.map(g=>g.getAttribute('data-world-area'))).size,actual.length,`Duplicate territory in ${year}`);
 for(const group of actual){
  const frame=expected.find(a=>a.id===group.getAttribute('data-territory-frame'));
  assert.equal(group.getAttribute('data-territory-kind'),frame.kind);
  assert(group.children[0].getAttribute('d'),'Territory has no SVG path');
  assert.equal(group.children[0].getAttribute('role'),'button');
  assert(group.children[0].getAttribute('aria-label').includes(frame.name[0]),'Missing territory name');
 }
 const labels=context.worldTerritoryLabels.children.filter(n=>n.nodeName==='text');
 assert.deepEqual(sorted(labels.map(n=>n.getAttribute('data-entry'))),sorted(expected.map(a=>a.entry)),`Lost territory labels: ${year}, ${region}`);
 const markers=context.worldLayer.children.filter(n=>n.dataset.worldPlace);
 assert.deepEqual(sorted(markers.map(n=>n.dataset.worldPlace)),sorted(expectedPlaces(year).map(e=>e.id)),`Region selection hid places: ${year}, ${region}`);
 return actual;
}

// The reported URL selected Arctic in 1299: the map must still contain every
// active American and African feature, just as it retains the Eurasian layer.
const regions=['all',...catalog.regions.map(r=>r.id)];
for(const year of [610,800,999,1000,1049,1050,1100,1199,1200,1229,1230,1250,1269,1299,1300,1335,1368,1402,1428,1438,1453,1492,1517,1521,1526,1552,1572,1600,1601,1644,1648,1683,1701,1757,1763,1776,1788,1789]){
 for(const region of regions)checkRender(year,region);
}

// Repeated redraws over the entire supported span catch stale DOM left behind
// by ended frames, and premature areas or places from a later period.
for(let year=610;year<=(catalog.range?.max??1299);year++)checkRender(year,'arctic');
const idsAt=year=>new Set(checkRender(year,'arctic').map(g=>g.getAttribute('data-world-area')));
assert(idsAt(999).has('wari'));assert(!idsAt(1000).has('wari'));
assert(!idsAt(1229).has('mali'));assert(idsAt(1230).has('mali'));
for(const id of ['mali','cahokia','chimu'])assert(idsAt(1299).has(id),`Missing visible continent representative: ${id}`);

// A selection on another continent can highlight its territory without
// narrowing the map. Visibility switches must affect layers consistently.
context.worldState.area='mali';context.worldState.selected='mali';
const selected=checkRender(1299,'arctic').filter(g=>g.classList.contains('selected'));
assert.deepEqual(selected.map(g=>g.getAttribute('data-world-area')),['mali']);
context.layerState.empires=false;context.layerState.places=false;
checkRender(1299,'north');
assert(context.worldTerritoryLayer.classList.contains('hidden-layer'));
assert(context.worldTerritoryLabels.classList.contains('hidden-layer'));
assert(context.worldLayer.classList.contains('hidden-layer'));
context.layerState.empires=true;context.layerState.places=true;
checkRender(1299,'south');
assert(!context.worldTerritoryLayer.classList.contains('hidden-layer'));
assert(!context.worldTerritoryLabels.classList.contains('hidden-layer'));
assert(!context.worldLayer.classList.contains('hidden-layer'));

console.log(JSON.stringify({status:'PASS',renderers:2,renders,regions:regions.length,years:(catalog.range?.max??1299)-609,territoriesIn1299:expectedAreas(1299).length,placesIn1299:expectedPlaces(1299).length}));
