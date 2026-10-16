'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const visible=require('./legacy-presentation.js').legacyStateVisible;
const html=fs.readFileSync('index.html','utf8');
const es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]);
const c=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const by=new Map(es.map(e=>[e.id,e]));
function shape(id,y){const e=by.get(id);if(y<e.from||y>e.to||!visible(id,y))return[];const f=c.frames[id].filter(f=>f[0]<=y).at(-1);assert(f,`Missing delivered frame ${id}/${y}`);return c.shapes[f[1]];}
const sites={merv:[62.18,37.66],herat:[62.2,34.35],balkh:[66.9,36.76],nishapur:[58.8,36.2],shiraz:[52.58,29.6],baghdad:[44.36,33.31],basra:[47.78,30.5],ray:[51.44,35.59],kerman:[57.08,30.28],taraz:[71.37,42.9],bukhara:[64.42,39.77],samarkand:[66.98,39.65],yinchuan:[106.23,38.49],tianshui:[105.72,34.58],yanan:[109.49,36.59],dunhuang:[94.67,40.14],xian:[108.94,34.34]};
// Historical expectations are independent settlement coordinates, not points
// generated from the repaired contours. Each before/after checks both rulers.
const controls=[
 ['sasanian',610,'merv',true],['sasanian',628,'herat',true],['sasanian',628,'balkh',false],
 ['westernTurkic',628,'balkh',true],['westernTurkic',628,'merv',false],['westernTurkic',628,'herat',false],
 ['samanid',875,'merv',false],['samanid',899,'merv',false],['samanid',900,'merv',true],
 ['samanid',892,'taraz',false],['karluk',892,'taraz',true],['samanid',893,'taraz',true],['karluk',893,'taraz',false],
 ['samanid',950,'samarkand',true],['qarakhanid',950,'samarkand',false],
 ['samanid',998,'bukhara',true],['samanid',999,'bukhara',false],['qarakhanid',999,'bukhara',true],
 ['buyids',934,'shiraz',true],['buyids',934,'baghdad',false],['buyids',934,'ray',false],['buyids',934,'nishapur',false],
 ['buyids',944,'baghdad',false],['buyids',945,'baghdad',true],
 ['buyids',946,'basra',false],['buyids',947,'basra',true],
 ['samanid',940,'ray',true],['buyids',940,'ray',false],['buyids',943,'ray',true],['samanid',943,'ray',false],
 ['samanid',945,'ray',true],['buyids',945,'ray',false],['buyids',947,'ray',true],['samanid',947,'ray',false],
 ['buyids',967,'kerman',false],['buyids',968,'kerman',true],['buyids',980,'nishapur',false],
 ['ghaznavid',999,'nishapur',true],['buyids',999,'nishapur',false],
 ['buyids',1028,'ray',true],['ghaznavid',1028,'ray',false],['buyids',1029,'ray',false],['ghaznavid',1029,'ray',true],
 ['buyids',1032,'kerman',true],['ghaznavid',1032,'kerman',false],['buyids',1033,'kerman',false],['ghaznavid',1033,'kerman',true],
 ['buyids',1036,'kerman',true],['ghaznavid',1036,'kerman',false],
 ['greatSeljuk',1042,'ray',true],['ghaznavid',1042,'ray',false],
 ['buyids',1047,'kerman',true],['greatSeljuk',1047,'kerman',false],['buyids',1048,'kerman',false],['greatSeljuk',1048,'kerman',true],
 ['buyids',1054,'baghdad',true],['greatSeljuk',1054,'baghdad',false],['buyids',1055,'baghdad',false],['greatSeljuk',1055,'baghdad',true],
 ['greatSeljuk',1062,'shiraz',true],['buyids',1062,'shiraz',false],
 ['westernXia',1038,'yinchuan',true],['westernXia',1038,'dunhuang',true],
 ['westernXia',1100,'tianshui',false],['northernSong',1100,'tianshui',true],
 ['westernXia',1100,'yanan',false],['northernSong',1100,'yanan',true],['northernSong',1100,'xian',true],
 ['jinChina',1150,'yinchuan',false],['westernXia',1150,'yinchuan',true],['jinChina',1150,'yanan',true]
];
for(const[id,y,city,want]of controls)assert.equal(G.covers(shape(id,y),sites[city]),want,`${id}/${y}: ${city}`);
for(const e of es){assert(e.keyframes.some(f=>f.year<=e.from),`No initial state for ${e.id}/${e.from}`);assert(c.frames[e.id].some(f=>f[0]<=e.from),`No compiled initial outline for ${e.id}/${e.from}`);}
for(const[id,from,to,p]of [['holyRoman',962,1000,[11.6,48.14]],['franceMedieval',987,1000,[2.35,48.86]]])for(let y=from;y<to;y++)assert(G.covers(shape(id,y),p),`Disappearing successor ${id}/${y}`);
let frames=0;const seen=new Set();
for(const[a,b,from,to]of [
 ['sasanian','westernTurkic',610,651],['samanid','karluk',819,941],['samanid','qarakhanid',950,999],
 ['buyids','samanid',934,999],['buyids','ghaznavid',999,1062],['buyids','greatSeljuk',1037,1062],
 ['westernXia','northernSong',1038,1127],['westernXia','liao',1038,1125],['westernXia','jinChina',1125,1227]
])for(let y=from;y<to;y++){
 const A=shape(a,y),B=shape(b,y);if(!A.length||!B.length)continue;
 const key=a+b+JSON.stringify([A,B]);if(seen.has(key))continue;seen.add(key);
 const area=Math.abs(F.I(A,B).reduce((n,r)=>n+G.signed(r),0));assert(area<.0001,`Overlap ${a}/${b}/${y}: ${area}`);frames++;
}
assert.deepEqual(F.prepare(es),es,'Review must not apply twice');
// Exercise the DELIVERED pointer binding: SVG parent capture used to swallow
// ordinary polity clicks, while only the Kyrgyz paths had a working binding.
const vm=require('node:vm'),start=html.indexOf('function bindKyrgyzPointer('),end=html.indexOf('function renderEmpires(',start);
assert(start>=0&&end>start);let interactions=0;
for(const id of ['buyids','westernXia','holyRoman','mongolRealm','kyrgyzKhaganate']){
 const attrs={},listeners={},selected=[],state={tx:0,ty:0};
 const p={setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,v)=>listeners[k]=v,setPointerCapture(){},releasePointerCapture(){}};
 const ctx={hideTooltip(){},mapState:state,screenPoint:(x,y)=>({x,y}),setViewport(){},selectEmpire:i=>selected.push(i),queueLocationSave(){}};
 vm.createContext(ctx);vm.runInContext(html.slice(start,end),ctx);ctx.bindKyrgyzPointer(p,{id,name:id});
 assert.equal(attrs.role,'button');assert.equal(attrs.tabindex,'0');
 const e=(x=10,y=10)=>({button:0,pointerId:1,clientX:x,clientY:y,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
 p.onpointerdown(e());p.onpointerup(e());listeners.click(e());assert.deepEqual(selected,[id],'Tap selects exactly once');
 p.onpointerdown(e());p.onpointermove(e(30,25));p.onpointerup(e(30,25));assert.deepEqual(selected,[id],'Drag must not select');assert.equal(state.tx,20);
 p.onpointerdown(e());p.onpointercancel();p.onpointerup(e());assert.equal(selected.length,1,'Cancelled gesture must not select');
 p.onkeydown({...e(),key:'Enter'});p.onkeydown({...e(),key:' '});assert.equal(selected.length,3,'Both keyboard activations work');interactions++;
}
console.log(JSON.stringify({pass:true,settlementControls:controls.length,distinctSharedEdges:frames,pointerProfiles:interactions,scope:'Delivered boundaries and dated ownership; broader unreviewed medieval borders remain approximate.'}));
