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
