'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
// Exercise the production layout with overlapping names and a very small polity.
// This reproduces the zoom-out failure: names must shrink, reveal detail gradually,
// and recover after returning to the original zoom without changing the geography.
function text(id,x,width,kind='polity'){
 const attrs={x:String(x),y:'300'},style={setProperty(k,v){this[k]=v;}};
 return {dataset:{entry:id,width,kind},style,textContent:id,getAttribute:k=>attrs[k],setAttribute:(k,v)=>attrs[k]=v,classList:{contains:()=>false}};
}
const labels=[text('Large northern kingdom',350,180),text('Small city state',450,5),text('Neighbouring kingdom',370,160)],guides=new Map(labels.map(l=>[l.dataset.entry,{style:{},setAttribute(){}}]));
const ctx={SVG_W:1440,SVG_H:720,mapState:{scale:1,tx:0,ty:0},svg:{clientWidth:1440,clientHeight:720,getBoundingClientRect:()=>({left:0,top:0})},
 worldState:{area:''},layerState:{empires:true},empireLabelLayer:{querySelectorAll:()=>[]},
 worldTerritoryLabels:{querySelectorAll:()=>labels,querySelector:s=>guides.get(s.match(/"(.+)"/)[1])},worldPattern:{setAttribute(){}},worldHatchLine:{setAttribute(){}},
 worldLabelWidth:(s,size)=>s.length*size*.55};
vm.createContext(ctx);const src=fs.readFileSync(require('node:path').join(__dirname,'territory-runtime.js'),'utf8');
vm.runInContext(src.slice(src.indexOf('function worldLabelMetrics()')),ctx);
ctx.updateWorldTerritoryLabels();const before=labels.filter(l=>l.style.display!=='none').map(l=>l.dataset.entry),smallFont=parseFloat(labels[0].style.fontSize);
assert(before.includes('Large northern kingdom'));assert(!before.includes('Small city state'));assert(!before.includes('Neighbouring kingdom'),'Colliding label remained visible');
ctx.mapState={scale:4,tx:-900,ty:-900};ctx.updateWorldTerritoryLabels();
const closeFont=parseFloat(labels[0].style.fontSize)*4;assert(closeFont>smallFont&&closeFont<=13);
ctx.worldState.area='Small city state';ctx.updateWorldTerritoryLabels();assert.equal(labels[1].style.display,'','Selected small state is inaccessible');
ctx.worldState.area='';ctx.mapState={scale:1,tx:0,ty:0};ctx.updateWorldTerritoryLabels();
assert.deepEqual(labels.filter(l=>l.style.display!=='none').map(l=>l.dataset.entry),before);
// A tall viewport adds vertical letterboxing; collision checks must use screen coordinates.
ctx.svg.clientHeight=1000;assert.deepEqual(Array.from(ctx.worldLabelMetrics().point(100,100)),[100,240]);
console.log('PASS: overview names shrink, overlapping and tiny labels hide, selection stays available, zoom restores deterministically, letterboxing is included.');

assert(!fs.readFileSync('index.html','utf8').includes('#worldMap.city-mode .empire-label{display:none!important}'),'Close zoom hides all major legacy states');

// A selected event can use separately named landmarks instead of a duplicate
// title on its central marker. Run the actual scaling pass with that DOM shape.
function marker(x,label,kind){
 const inner={setAttribute(k,v){this[k]=v;}};
 return {dataset:{px:String(x),py:'400'},style:{},inner,
  classList:{contains:k=>k===kind},
  querySelector:s=>s==='text'?label:s==='.world-marker-inner'?inner:null};
}
const named=text('Shandong',1100,100),central=marker(1000,null,'world-event-marker'),landmark=marker(1100,named,'world-comparison-place');
ctx.svg.style={setProperty(){}};ctx.worldLayer={querySelectorAll:()=>[central,landmark]};
ctx.updateAtlasPlaceLabels=()=>{};ctx.worldState.selected='';
const runtime=fs.readFileSync(require('node:path').join(__dirname,'runtime.js'),'utf8');
vm.runInContext(runtime.slice(runtime.indexOf('function updateWorldMarkerScale(){'),runtime.indexOf('function renderWorldSources(){')),ctx);
ctx.updateWorldMarkerScale();assert.equal(named.style.display,'','Named destination must remain visible beside an unlabelled event marker');
for(const scale of [4.2,6,1]){
 ctx.mapState={scale,tx:0,ty:0};assert.doesNotThrow(()=>ctx.updateWorldMarkerScale());
 assert(central.inner.transform.startsWith('scale('),'Unlabelled event marker must still scale');
}
assert.equal(named.style.display,'','Landmark label must return when zooming back out');
console.log('PASS: event markers without duplicate titles preserve landmark labels and zoom without interrupting map initialization.');

// A political name directly over a migration endpoint used to hide the
// endpoint. Keep the endpoint readable and restore the political name on close.
const legacyClasses=new Set(),legacy=text('Political context',1100,200);
legacy.classList={contains:k=>legacyClasses.has(k),add:k=>legacyClasses.add(k),remove:k=>legacyClasses.delete(k)};
legacy.getBoundingClientRect=()=>({left:1100,top:533,right:1200,bottom:550});
ctx.empireLabelLayer={querySelectorAll:()=>[legacy]};
ctx.getComputedStyle=e=>({display:e.classList.contains('world-landmark-obscured')?'none':'block'});
ctx.mapState={scale:1,tx:0,ty:0};ctx.updateWorldMarkerScale();
assert.equal(named.style.display,'','Migration endpoint was displaced by a political name');
assert(legacyClasses.has('world-landmark-obscured'),'Political text overlaps the selected endpoint');
ctx.worldLayer.querySelectorAll=()=>[central];ctx.updateWorldMarkerScale();
assert(!legacyClasses.has('world-landmark-obscured'),'Political name did not return after clearing landmarks');
console.log('PASS: selected geographic labels take priority over political context; closing an event restores context.');

// Real 1508 event geometry and camera from the browser: long explanatory
// labels hid Turfan on desktop. All three destinations must fit in each locale.
const relocation=require('./kyrgyz-witnesses.json').find(n=>n.from===1508);
const relocationPoints=[[1035.6,170.53714285714287],[1066.28,176.66742857142856],[1076.8,173.00571428571428]];
ctx.empireLabelLayer={querySelectorAll:()=>[]};ctx.worldTerritoryLabels={querySelectorAll:()=>[]};
ctx.mapState={scale:7,tx:-6673.4,ty:-855.22};
for(const [width,height] of [[938,669],[598,207]])for(let lang=0;lang<3;lang++){
 ctx.svg.clientWidth=width;ctx.svg.clientHeight=height;
 const places=relocation.places.map((p,i)=>{
  const label=text(p[1][lang],0,0),g=marker(relocationPoints[i][0],label,'world-comparison-place');
  g.dataset.py=String(relocationPoints[i][1]);return g;
 });
 ctx.worldLayer.querySelectorAll=()=>places;ctx.updateWorldMarkerScale();
 for(const g of places)assert.equal(g.querySelector('text').style.display,'',`${width}px locale ${lang}: ${g.querySelector('text').textContent} is hidden`);
}
console.log('PASS: Charyn, Karashahr and Turfan remain labelled in three languages on desktop and compact maps.');
