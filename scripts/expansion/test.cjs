'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const catalog=require('./catalog.cjs'),{expansionSnapshot,expansionSegments,expansionRoutesAt}=require('./core.js');
const html=fs.readFileSync('index.html','utf8'),world=require('../world/catalog.cjs');
const source=fs.readFileSync('src/atlas.html','utf8');
const empires=vm.runInNewContext(source.slice(source.indexOf('const S ='),source.indexOf('function resampleRing'))+';EMPIRES');
const aliases=new Set([...world.entries.map(e=>e.id),...empires.map(e=>e.id),'mongolRealm']);
const kinds=new Set(['campaign','treaty','settlement','occupation','voyage']);
const seen=new Set();let years=0,routes=0;
for(const state of catalog.states){
 assert(!seen.has(state.id));seen.add(state.id);assert(state.routes.length>=3);
 assert(state.name.length===3&&state.name.every(Boolean));assert(state.aliases.some(id=>aliases.has(id)),state.id);
 for(const r of state.routes){
  routes++;assert(!seen.has(r.id));seen.add(r.id);
  assert(r.to>=state.from&&r.from<=r.to&&r.to<=state.to&&r.from>=610&&r.to<=1918,r.id);
  for(const t of [r.title,r.text])assert(t.length===3&&t.every(x=>x.trim().length>3),r.id);
  assert(kinds.has(r.kind));assert(r.sources.length&&r.sources.every(id=>catalog.sources[id]?.title&&catalog.sources[id]?.urls.length));
  assert(r.points.length>=2);for(const [x,y] of r.points)assert(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90);
  const seg=expansionSegments(r.points);assert.deepEqual(seg[0][0],r.points[0]);assert.deepEqual(seg.at(-1).at(-1),r.points.at(-1));
  for(const p of seg)for(let i=1;i<p.length;i++)assert(Math.abs(p[i][0]-p[i-1][0])<=180,r.id+' crosses entire map');
  assert.equal(expansionSnapshot(state,r.to,r.id).selected.id,r.id);
  assert(!expansionSnapshot(state,r.to-1,r.id).available.some(x=>x.id===r.id),'Future acquisition leaked: '+r.id);
 }
 for(let y=610;y<=1918;y++){
  years++;const s=expansionSnapshot(state,y,'invalid-route');
  assert(s.available.every(r=>r.to<=y));if(y<state.from||y>state.to)assert.equal(s.available.length,0);
  assert.equal(s.selected,s.available.at(-1)||null);
 }
}
const russia=catalog.states.find(s=>s.id==='russia');
assert.equal(expansionSegments(russia.routes.find(r=>r.id==='russia-alaska').points).length,2);
assert.deepEqual(expansionSegments([[170,50],[-170,60]]),[[[170,50],[180,55]],[[-180,55],[-170,60]]]);
assert.deepEqual(expansionSegments([[-170,50],[170,60]]),[[[-170,50],[-180,55]],[[180,55],[170,60]]]);
assert.equal(expansionSnapshot(russia,1917).selected,null);
const usa=catalog.states.find(s=>s.id==='usa');assert(usa.routes.some(r=>r.id==='usa-oregon-trail'&&r.kind==='settlement'));
for(const s of catalog.states)for(const r of s.routes){assert(expansionRoutesAt(s,r.from).includes(r));assert(expansionRoutesAt(s,r.to).includes(r));assert(!expansionRoutesAt(s,r.from-1).includes(r));assert(!expansionRoutesAt(s,r.to+1).includes(r));}
assert.equal(catalog.states.find(s=>s.id==='timur').routes.length,6);
const qing=catalog.states.find(s=>s.id==='qing');assert.equal(expansionSnapshot(qing,1682).selected.id,'qing-beijing');assert.equal(expansionSnapshot(qing,1683).selected.id,'qing-taiwan');
for(const s of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
const delivered=JSON.parse(html.match(/const EXPANSION_CATALOG=(.*);\n/)[1]);assert.deepEqual(delivered.states,catalog.states);
assert(Object.values(delivered.sources).every(s=>!s.urls));
const runtime=fs.readFileSync('scripts/expansion/runtime.js','utf8');assert(html.includes(runtime));
assert(html.includes('body.future-mode #expansionLayer'));assert(html.includes('vector-effect:non-scaling-stroke'));
assert(!html.includes("id='expansionBtn'"));assert(!html.includes('expansion-open'));assert(!html.includes('expansionPanel'));assert(!html.includes('expansionFocus('));
assert(html.includes("expansionToggle.id='toggleExpansion'"));assert(html.includes("tradeLayer.after(expansionLayer)"));
assert(html.includes('countries:true,empires:true'));assert(html.includes('id="toggleCountries" type="checkbox" checked'));
console.log(JSON.stringify({states:catalog.states.length,routes,yearSnapshots:years,checks:'dates, translations, sources, date line, delivered runtime, future isolation',pass:true}));
