'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs'),O=require('./frankish-outer-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c),visible=require('./legacy-presentation.js').legacyStateVisible;
function shape(id,y){if(id.startsWith('review-')||id.startsWith('late-'))return h.mapAreasAt(y).find(a=>a.entry===id)?.polygons||[];const e=es.find(e=>e.id===id);if(!e||y<e.from||y>e.to||!visible(id,y))return[];return l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]];}
const controls=[
 ['holyRoman',962,[9.16,45.18],true],['holyRoman',983,[11.25,43.77],true],['holyRoman',983,[12.5,41.9],false],
 ['holyRoman',983,[19.94,50.06],false],['holyRoman',1299,[17.04,51.11],false],['holyRoman',983,[14.42,50.08],true],
 ['holyRoman',1003,[14.42,50.08],false],['holyRoman',1004,[14.42,50.08],true],
 ['holyRoman',1003,[16.61,49.2],false],['holyRoman',1004,[16.61,49.2],false],['holyRoman',1028,[16.61,49.2],false],['holyRoman',1029,[16.61,49.2],true],
 ['holyRoman',1159,[11.41,53.63],false],['holyRoman',1160,[11.41,53.63],true],['holyRoman',1180,[14.55,53.43],false],['holyRoman',1181,[14.55,53.43],true],['holyRoman',1185,[14.55,53.43],false],['holyRoman',1227,[14.55,53.43],true],
 ['eastFrancia',906,[16.37,48.21],true],['eastFrancia',907,[16.37,48.21],false],['eastFrancia',955,[15.62,48.2],true],['eastFrancia',955,[16.37,48.21],false],
 ['eastFrancia',843,[10.75,55.3],false],['eastFrancia',843,[9.05,56.3],false],['eastFrancia',843,[9.57,54.49],false],['eastFrancia',843,[9.99,53.55],true],
 ['eastFrancia',843,[11.62,52.13],true],['eastFrancia',843,[11.97,51.48],true],['eastFrancia',843,[12.56,52.41],false],['eastFrancia',843,[14.42,50.08],false],['eastFrancia',843,[13.74,51.05],false],
 ['eastFrancia',928,[12.56,52.41],true],['eastFrancia',951,[9.16,45.18],true],
 ['holyRoman',982,[12.56,52.41],true],['holyRoman',983,[12.56,52.41],false],['holyRoman',983,[12.08,52.83],false],['holyRoman',983,[13.47,51.16],true],['holyRoman',1156,[12.56,52.41],false],['holyRoman',1157,[12.56,52.41],true],
 ['review-brittany',843,[-2.76,47.66],true],['westFrancia',843,[-2.76,47.66],false],['review-brittany',843,[-1.68,48.11],false],['review-brittany',851,[-1.68,48.11],true],['review-brittany',851,[-1.55,47.22],true],['westFrancia',851,[-1.55,47.22],false],
 ['review-brittany',866,[-1.38,48.68],false],['review-brittany',867,[-1.38,48.68],true],['review-brittany',867,[-1.62,49.63],true],['review-brittany',933,[-1.62,49.63],false],['westFrancia',933,[-1.62,49.63],true],
 ['review-brittany',1299,[-1.55,47.22],true],['review-brittany',1300,[-1.55,47.22],true],['review-brittany',1531,[-1.55,47.22],true],['late-france',1531,[-1.55,47.22],false],['late-france',1532,[-1.55,47.22],true]
];
const failedControls=controls.filter(([id,y,p,want])=>G.covers(shape(id,y),p)!==want);
assert.equal(failedControls.length,0,JSON.stringify(failedControls));
const size=p=>Math.abs(p.reduce((s,r)=>s+G.signed(r),0)),seen=new Set();let edges=0;
for(let y=843;y<1532;y++){
 const a=h.mapAreasAt(y).find(a=>a.entry==='review-brittany');assert(a,`Brittany missing ${y}`);
 assert.equal(a.kind,y>=907&&y<938?'influence':'polity');
 const owners=y<987?['westFrancia']:y<1300?['franceMedieval']:['late-france','late-england'];
 for(const id of owners){const p=shape(id,y),key=JSON.stringify([id,p,a.polygons]);if(seen.has(key))continue;seen.add(key);assert(size(F.I(p,a.polygons))<.0001,`Brittany overlap ${id}/${y}`);edges++;}
}
assert(!h.get('review-brittany',1532));assert.deepEqual(shape('review-brittany',1299),shape('review-brittany',1300));
for(let y=843;y<1300;y++){const id=y<962?'eastFrancia':'holyRoman';for(const p of [[9.05,56.3],[10.75,55.3],[12.57,55.68]])assert(!G.covers(shape(id,y),p),`Danish land annexed ${y}`);}
for(let y=1300;y<1806;y++){const p=shape('late-hre',y);assert(p.length,`Missing imperial frame ${y}`);for(const site of [[9.05,56.3],[10.75,55.3],[12.57,55.68]])assert(!G.covers(p,site),`Later engine annexes Danish land ${y}`);}
for(const id of c.outerFrontiers.events){const e=h.record(id);assert(e&&e.sources.every(s=>c.sources[s]));assert(e.coord.every(Number.isFinite));for(const k of ['title','text'])assert(e[k].length===3&&e[k].every(s=>s.length>5));}
const tr=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));
for(const row of O.messages)for(const lang of ['en','ky'])assert.equal(tr(row[0],lang),row[lang==='en'?1:2]);
assert.deepEqual(F.prepare(es),es);
console.log(JSON.stringify({pass:true,settlementControls:controls.length,years:689,distinctSharedEdges:edges,northernExclusions:2889,events:c.outerFrontiers.events.length}));
