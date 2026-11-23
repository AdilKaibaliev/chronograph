'use strict';
// Test the generated SVG masks with an independent point compositor. Regression
// points were found by integer polygon intersection, not by this renderer.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs');
const file=path.join(__dirname,'render-test.cjs'),src=fs.readFileSync(file,'utf8'),fixture=new Module(file);fixture.filename=file;fixture.paths=Module._nodeModulePaths(__dirname);fixture._compile(src.slice(0,src.indexOf('const expectedAreas='))+'\nmodule.exports={context,catalog};',file);
const {context:x,catalog:c}=fixture.exports,points=require('./paint-regressions.json'),css=fs.readFileSync(path.join(__dirname,'style.css'),'utf8');assert(points.length>50);
x.empireLayer.querySelectorAll=()=>[];x.project=([lon,lat])=>[(lon+180)*4,(85-Math.min(85,Math.max(-90,lat)))/175*720];x.polygonPath=rings=>rings.map(r=>'M'+r.map(p=>x.project(p).map(v=>v.toFixed(3)).join(' ')).join('L')+'Z').join(' ');
const transparent=[0,0,0,0],over=(a,b)=>[a[0]+b[0]*(1-a[3]),a[1]+b[1]*(1-a[3]),a[2]+b[2]*(1-a[3]),a[3]+b[3]*(1-a[3])],mul=(v,n)=>v.map(x=>x*n),paths=new Map();
function color(s){if(s==='white')return [1,1,1,1];if(s==='black')return [0,0,0,1];if(s==='none'||/^url\(#world(Region|Occupation)Hatch/.test(s))return transparent;if(s==='url(#frontierReviewDots)')s='#cfc6b4';assert(/^#[0-9a-f]{6}$/i.test(s),'Unexpected fill '+s);return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255).concat(1);}
function inside(node,pt){
 const a=node.attributes;if(node.nodeName==='rect')return pt[0]>=+a.x&&pt[1]>=+a.y&&pt[0]<=+a.x+(+a.width)&&pt[1]<=+a.y+(+a.height);
 if(node.nodeName!=='path')return true;const d=a.d||'';if(!paths.has(d)){if(paths.size>=128)paths.delete(paths.keys().next().value);const rings=d.split(/Z/i).filter(s=>s.trim()).map(s=>{const v=s.match(/[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi)||[];assert(!/[HhVvCcQqAa]/.test(s),'Use polygon paths');return Array.from({length:v.length/2},(_,i)=>[+v[i*2],+v[i*2+1]]);});paths.set(d,rings.map(r=>({r,sign:Math.sign(G.signed(r))})));}
 const rings=paths.get(d);return a['fill-rule']==='evenodd'?rings.filter(v=>G.inside(v.r,pt)).length%2===1:rings.reduce((n,v)=>n+(G.inside(v.r,pt)?v.sign:0),0)!==0;
}
function makePainter(pt){
 const ids=new Map(),memo=new Map(),visiting=new Set();function index(n){if(n.attributes?.id){assert(!ids.has(n.attributes.id),'Duplicate SVG id '+n.attributes.id);ids.set(n.attributes.id,n);}for(const q of n.children||[])index(q);}index(x.worldDefs);index(x.worldTerritoryLayer);
 function paint(n,inherited='black'){
  if(!n)return transparent;const a=n.attributes,fill=a.fill||inherited;let byFill=memo.get(n);if(!byFill){byFill=new Map();memo.set(n,byFill);}if(byFill.has(fill))return byFill.get(fill);assert(!visiting.has(n),'Cyclic SVG mask');visiting.add(n);
  let v=transparent;if(n.nodeName==='use'){const ref=a.href.slice(1);assert(ids.has(ref),'Missing SVG reference '+ref);v=paint(ids.get(ref),fill);}else if(['path','rect'].includes(n.nodeName)){if(inside(n,pt))v=color(fill);}else for(const child of n.children)v=over(paint(child,fill),v);
  v=mul(v,Number(a.opacity??1)*Number(a['fill-opacity']??1));if(a.mask){const ref=a.mask.match(/#([^)]*)/)[1];assert(ids.has(ref),'Missing SVG mask '+ref);const mask=paint(ids.get(ref));v=mul(v,.2126*mask[0]+.7152*mask[1]+.0722*mask[2]);}
  visiting.delete(n);byFill.set(fill,v);return v;
 }
 return paint;
}
function rootOwner(id,rows){const seen=new Set();while(!seen.has(id)){seen.add(id);const a=rows.find(a=>a.entry===id),parent=a?.sovereign||(a?.relationship!=='occupation'&&a?.overlord);if(!parent)break;id=parent;}return id;}
// The independent geographic oracle uses the same documented output precision.
// Otherwise a sample less than 0.001 SVG unit from an edge can test the opposite
// side of that edge. Keep those samples: they also guard province/dependency seams.
const roundedRings=new WeakMap();
function covers(rings,point){if(!roundedRings.has(rings))roundedRings.set(rings,rings.map(r=>r.map(p=>{const [x,y]=xProject(p);return [Number(x.toFixed(3))/4-180,85-Number(y.toFixed(3))*175/720];})));return G.covers(roundedRings.get(rings),point);}
const xProject=p=>x.project(p);
let checks=0,renderedYear,rows;const years=new Set(),failures=[];
// Several points share a year. Reuse its DOM; the annual renderer suite checks
// transitions independently. Every geographic regression still gets composited.
for(const test of [...points].sort((a,b)=>a.year-b.year)){
 if(renderedYear!==test.year){x.year=test.year;x.worldState.area='';x.renderWorldTerritories();rows=x.worldHistory.mapAreasAt(test.year);renderedYear=test.year;}
 years.add(test.year);const paint=makePainter(x.project(test.point));
 const coverage=x.worldTerritoryLayer.children.filter(n=>n.getAttribute('data-province-remainders')==='true'||n.getAttribute('data-dependent-fills')==='true'||n.getAttribute('data-context-fills')==='true');let actual=transparent;for(const node of coverage)actual=over(paint(node),actual);
 const primary=rows.some(a=>(!a.sovereign||a.detachedProvince)&&!a.overlord&&!a.cartographicOverlay&&['polity','influence'].includes(a.kind)&&covers(a.polygons,test.point))||x.boundaryFrame(test.year).zones.some(z=>covers(c.boundaryEvidence.shapes[z[2]],test.point));
 const dependency=rows.filter(a=>(!a.sovereign||a.detachedProvince)&&a.overlord&&!a.cartographicOverlay&&covers(a.polygons,test.point));
 const restoreIds=new Set(c.provinceGaps.frames.filter(f=>f[0]<=test.year).at(-1)[1]);
 const restored=primary||rows.some(a=>a.overlord&&!a.cartographicOverlay&&['polity','influence'].includes(a.kind)&&covers(a.polygons,test.point))?[]:rows.filter(a=>restoreIds.has(a.entry)&&a.sovereign&&!a.detachedProvince&&['polity','influence','settlement'].includes(a.kind)&&covers(a.polygons,test.point));
 const owners=[...new Set(restored.length?restored.map(a=>{let id=a.sovereign;const seen=new Set();while(!seen.has(id)&&rows.find(r=>r.entry===id)?.sovereign){seen.add(id);id=rows.find(r=>r.entry===id).sovereign;}return id;}):dependency.map(a=>rootOwner(a.overlord,rows)))];
 let expectedColor='#b6b195',opacity=.675*.55;if(owners.length>1){expectedColor='#cfc6b4';opacity=.675;}else if(owners.length){const owner=rows.find(a=>a.entry===owners[0]);expectedColor=owner.color;opacity=.675*(owner.kind==='influence'?.82:1);}if(primary)opacity=0;
 const expected=mul(color(expectedColor),opacity);if(actual.some((v,k)=>Math.abs(v-expected[k])>=.000001))failures.push({...test,actual,expected,owners,covering:rows.filter(a=>G.covers(a.polygons,test.point)).map(a=>({id:a.entry,kind:a.kind,sovereign:a.sovereign,overlord:a.overlord}))});checks++;
}
fs.writeFileSync('verification-paint-failures.json',JSON.stringify(failures,null,2));assert.deepEqual(failures,[],'Tint accumulates or vanishes at regression points');
// The same shade must continue from the Dzungar outline into its Yarkand
// dependency. Selecting a province or a unified Mongol member is outline-only.
assert(css.includes('.world-territory.sovereign-part.selected:not(.detached-province)>path[role=button]'));
assert(css.includes('.world-territory.mongol-unified:not([data-world-area="late-yuan"])>path[role=button]{fill-opacity:0!important}'));
x.year=1704;x.renderWorldTerritories();const deps=x.worldTerritoryLayer.children.find(n=>n.getAttribute('data-dependent-fills')==='true'),dzungar=deps.children.find(n=>n.getAttribute('data-fill-owner')==='1789-dzungar');assert(dzungar);assert.equal(+dzungar.getAttribute('opacity'),.675*.82);
// Shared uncertainty symbols get one opacity regardless of intersecting bands.
for(const y of [610,840,1200,1299,1704,1942]){x.year=y;x.renderWorldTerritories();const g=x.worldTerritoryLayer.children.find(n=>n.getAttribute('data-frontier-review')==='true');if(g){assert.equal(+g.getAttribute('opacity'),.7);assert(g.children.every(p=>p.getAttribute('fill-opacity')===null));}}
const report={pass:true,regressionPoints:checks,datedContexts:years.size,checks:'independent SVG compositing, single owner shade, cultural/dependency conflicts, no grey underpaint, valid non-cyclic mask references, shared frontier opacity, outline-only nested selection'};fs.writeFileSync('verification-paint-composition.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
