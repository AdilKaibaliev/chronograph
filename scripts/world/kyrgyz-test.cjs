'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),G=require('./cartography-geometry.cjs');
const src=fs.readFileSync('src/atlas.html','utf8'),html=fs.readFileSync('index.html','utf8');
const data=vm.runInNewContext(src.slice(src.indexOf('const S ='),src.indexOf('function resampleRing'))+';({EMPIRES,KYRGYZ_STAGES})');
const E=Object.fromEntries(JSON.parse(JSON.stringify(data.EMPIRES)).map(e=>[e.id,e])),stages=JSON.parse(JSON.stringify(data.KYRGYZ_STAGES));
const frame=(id,y)=>{const e=E[id];return y<e.from||y>e.to?null:e.keyframes.filter(f=>f.year<=y).at(-1);};
const core=frame('kyrgyzKhaganate',840).polys,fringe=frame('kyrgyzKhaganate',840).dependentPolys;
assert.equal(core.length,1,'Principal domain must form a single connected outline');
assert.deepEqual(G.union(core),core,'Self intersections or unmerged internal seams');
assert.deepEqual(G.merge([fringe]),fringe,'Influence hole must not fill the heartland');
assert(core[0].length>=30);
for(const p of [[91.43,53.72],[91.69,53.71],[90.4,54.5],[94.45,51.72],[92.1,51.28]])assert(G.covers(core,p),'Missing Yenisei/Tuva control '+p);
for(const p of [[102.66,47.43],[106.9,47.9],[113,50],[87.62,43.82],[75.99,39.47],[74.6,42.87],[49.1,55.8],[34.1,44.95]])assert(!G.covers(core,p),'Campaign / distant country painted as direct rule '+p);
for(const p of [[107.6,53.5],[87.62,43.82],[75.99,39.47],[74.6,42.87],[49.1,55.8],[34.1,44.95],[116.4,39.9],[122,45]])assert(!G.covers(fringe,p),'Beyond the reviewed reconstruction '+p);
for(const p of [[113,50],[110.5,51.7],[117,47],[106.9,47.9],[88,46],[83.6,49.9],[85.2,51.5]])assert(G.covers(fringe,p),'IX-century reach omitted '+p);
for(const p of [[91.43,53.72],[94.45,51.72]])assert(!G.covers(fringe,p),'Heartland counted twice');
assert(E.kyrgyzKhaganate.source.includes('Tartarica'));
assert(E.kyrgyzKhaganate.territories.includes('не ежегодную'));
assert(G.covers(fringe,[102.66,47.43]),'Orkhon expedition context omitted');
assert.equal(G.difference(fringe,core).length,fringe.length);
for(const y of [924,982,1154,1206]){const f=frame('yeniseiKyrgyz',y);assert(!f.hidden);assert.equal(f.type,'fuzzy');assert(G.covers(f.polys,[94.45,51.72]));}
assert(!frame('kyrgyzKhaganate',924));assert(!frame('yeniseiKyrgyz',1207));
assert.equal(E.kyrgyzMongol.type,'population');
assert.equal(stages.length,new Set(stages.map(s=>s.year)).size);
const S=Object.fromEntries(stages.map(s=>[s.year,s]));
assert.equal(S[840].route.kind,'campaign');assert.deepEqual(S[840].route.points.at(-1),[102.66,47.43]);
assert.equal(S[860].route.to,874);assert(S[860].text.includes('трижды'));assert(S[860].title.includes('860–874'));
assert(S[1207].source.includes('§239'));assert(S[1218].text.includes('тумат'));
assert(S[1273].source.includes('167'));assert(!S[1273].route);
assert(!S[1293].route);assert(S[1293].source.includes('128'));
const c=require('./catalog.cjs'),continuation=c.areas.find(a=>a.entry==='late-kyrgyz'&&a.from===1300);
assert.deepEqual(continuation.polygons,frame('kyrgyzMongol',1299).polys);
const compiled=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([\s\S]*?);\n/)[1]);
for(const [id,rings] of [['kyrgyzKhaganate',core],['kyrgyzKhaganateDependencies',fringe]]){
 const shape=compiled.shapes[compiled.frames[id][0][1]];
 for(const p of [[91.43,53.72],[94.45,51.72],[102.66,47.43],[113,50],[34.1,44.95]])assert.equal(G.covers(shape,p),G.covers(rings,p),'Compiled mismatch '+id+' '+p);
}
const rows=require('../i18n/compiled-messages.json'),tr=require('../i18n/core.js').createChronographTranslator(rows);
const fields=[E.kyrgyzKhaganate.body,E.kyrgyzKhaganate.territories,frame('yeniseiKyrgyz',924).body,...stages.flatMap(s=>[s.title,s.text])];
for(const t of fields)for(const lang of ['en','ky']){assert.notEqual(tr(t,lang),t,'Missing '+lang+' '+t);if(lang==='en')assert(!/[А-Яа-я]/.test(tr(t,lang)));}
const events=vm.runInNewContext(src.slice(src.indexOf('const EVENTS = {'),src.indexOf('function ceToAHApprox'))+';EVENTS');
const oldData=vm.runInNewContext(src.slice(src.indexOf('const EVENTS = {'),src.indexOf('function ceToAHApprox'))+';({PEOPLE,PLACES})');
assert(Object.keys(oldData.PLACES).length>=20);assert(oldData.PLACES.mecca&&oldData.PEOPLE);
assert(html.includes('const PLACES = ')&&html.includes('const PEOPLE = '),'Legacy map dependencies missing from build');
for(const y of [840,847,860,1207,1218,1270,1273,1293]){assert.equal(events[y].desc,S[y].text);assert.equal(tr(events[y].title,'en'),tr(S[y].title,'en'));}
const baseline='.local-checks/kyrgyz-before.json';if(fs.existsSync(baseline)){
 const before=JSON.parse(fs.readFileSync(baseline,'utf8')),ids=new Set(['yeniseiKyrgyz','kyrgyzKhaganate','kyrgyzMongol']);
 assert.deepEqual(Object.values(E).filter(e=>!ids.has(e.id)),before.EMPIRES.filter(e=>!ids.has(e.id)),'Unrelated legacy states changed');
}
assert(!E.yeniseiKyrgyz.body.includes('ставка кагана находилась в Туве'));
assert(html.includes('if(y>1299 || !r || (r.to && y>r.to))return;'));
const symbolSource=fs.readFileSync('scripts/world/kyrgyz-symbols.js','utf8');
const node=()=>({attrs:{},dataset:{baseY:'80',offset:'20'},style:{setProperty(k,v){this[k]=v;}},setAttribute(k,v){this.attrs[k]=v;},parentNode:{classList:{contains:()=>false}}});
const marker=node(),label=node(),city=node(),pulse=node();
const ctx={SVG_W:1440,SVG_H:720,svg:{clientWidth:1440,clientHeight:720,classList:{toggle(){}},style:{setProperty(){}}},mapState:{scale:1},showKyrgyzContext:true,$:()=>({querySelectorAll:s=>s==='circle'?[marker]:[label]}),placeLayer:{querySelectorAll:s=>s==='circle.core'?[city]:[]},pulseLayer:{querySelectorAll:()=>[pulse]}};
vm.createContext(ctx);vm.runInContext(symbolSource,ctx);
for(const scale of [1,4,8,24]){ctx.mapState.scale=scale;ctx.updateKyrgyzSymbols();assert.equal(marker.attrs.r*scale,4);assert.equal(parseFloat(label.style['font-size'])*scale,11.5);assert(city.attrs.r*scale<=4);}
ctx.showKyrgyzContext=false;ctx.updateKyrgyzSymbols();assert.equal(city.attrs.r,3.2);
// A tap opens the card, a drag pans without selecting, keyboard access works.
const pointerPath={setAttribute(){},addEventListener(){},setPointerCapture(){},releasePointerCapture(){}};
const pc={hideTooltip(){},mapState:{tx:0,ty:0},screenPoint:(x,y)=>({x,y}),setViewport(){},selected:[],selectEmpire(id){this.selected.push(id);}};
pc.selectEmpire=id=>pc.selected.push(id);vm.createContext(pc);vm.runInContext(fs.readFileSync('scripts/world/kyrgyz-pointer.js','utf8'),pc);pc.bindKyrgyzPointer(pointerPath,{id:'kyrgyzKhaganate',name:'Кыргызский каганат'});
const pe=(x,y)=>({button:0,pointerId:1,clientX:x,clientY:y,preventDefault(){},stopPropagation(){}});
pointerPath.onpointerdown(pe(10,10));pointerPath.onpointerup(pe(10,10));assert.equal(pc.selected.length,1);
pointerPath.onpointerdown(pe(10,10));pointerPath.onpointermove(pe(35,25));pointerPath.onpointerup(pe(35,25));assert.equal(pc.selected.length,1);assert.equal(pc.mapState.tx,25);
pointerPath.onkeydown({...pe(0,0),key:'Enter'});assert.equal(pc.selected.length,2);
console.log(JSON.stringify({pass:true,stages:stages.length,coreVertices:core[0].length,checks:'regional control points, connected outline, influence separated, dated status, primary attribution, bilingual translations, event sync, 1299–1300 continuity, unrelated legacy preserved'}));
