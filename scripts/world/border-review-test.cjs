'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const G=require('./cartography-geometry.cjs'),c=require('./catalog.cjs'),h=require('./core.js').createWorldHistory(c);
const empires=JSON.parse(fs.readFileSync('src/atlas.html','utf8').match(/const EMPIRES\s*=\s*(\[[\s\S]*?\]);/)[1]);
const compiled=require('./cartography-legacy.cjs')(empires);
const shape=(id,y)=>compiled.shapes[compiled.frames[id].filter(f=>f[0]<=y).at(-1)[1]];
let checks=0;
function legacy(id,y,p,want){assert.equal(G.covers(shape(id,y),p),want,`${id} ${y} ${p}`);checks++;}
// Positive and negative control points distinguish conquest from mere contact.
for(const[id,y,p,want]of [
 ['sui',610,[118.8,32.06],true],
 ['tang',639,[89.2,42.95],false],['tang',640,[89.2,42.95],true],
 ['tang',648,[82.97,41.72],true],['tang',700,[75.99,39.47],true],
 ['tang',700,[75.2,42.8],false],['tangDependencies',700,[75.2,42.8],true],
 ['tang',700,[66.97,39.65],false],['tang',700,[91.1,29.65],false],
 ['tang',790,[87.6,43.8],false],['tangDependencies',790,[75.99,39.47],true],
 ['tang',808,[75.99,39.47],false],['tangDependencies',808,[75.99,39.47],false],
 ['northernSong',1000,[116.4,39.9],false],['northernSong',1000,[114.3,34.8],true],
 ['northernSong',1000,[75.99,39.47],false],['southernSong',1200,[114.3,34.8],false],
 ['liao',916,[116.4,39.9],false],['liao',936,[116.4,39.9],true],
 ['rashidun',632,[31.24,30.04],false],['rashidun',642,[31.24,30.04],true],
 ['rashidun',637,[44.6,33.1],true],['umayyad',710,[-5.99,37.39],false],
 ['umayyad',711,[-5.99,37.39],true],['umayyad',711,[-.89,41.65],false],
 ['umayyad',714,[-.89,41.65],true],['umayyad',714,[-5.85,43.36],false],
 ['abbasid',900,[59.6,36.3],false],['abbasid',945,[44.36,33.31],true],
 ['umayyad',714,[18,35],false],['umayyad',714,[39,20],false]
])legacy(id,y,p,want);
for(const e of empires){assert.equal(new Set(e.keyframes.map(f=>f.year)).size,e.keyframes.length,'Duplicate frame '+e.id);}
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id);
const ru=y=>at(y<1547?'late-moscow':y<1721?'early-russia':'1789-russian-empire',y);
for(const[y,p,want]of [
 [1478,[37.6,55.75],true],[1586,[68.25,58.2],false],[1587,[68.25,58.2],true],
 [1618,[92.17,58.45],false],[1619,[92.17,58.45],true],[1632,[129.7,62.03],true],
 [1696,[158.6,53],false],[1697,[158.6,53],true],
 [1720,[129.7,62.03],true],[1721,[129.7,62.03],true]
]){assert.equal(G.covers(ru(y).polygons,p),want,'Russia '+y+' '+p);checks++;}
const area=p=>p.reduce((s,r)=>s+G.signed(r),0);
assert(Math.abs(area(ru(1721).polygons)/area(ru(1720).polygons)-1)<.06,'Imperial title causes an implausible territorial jump');
for(const[y,want]of [[1406,false],[1407,true],[1427,true],[1428,false]]){
 assert.equal(G.covers(at('late-ming',y).polygons,[105.84,21.03]),want,'Ming Jiaozhi '+y);checks++;
}
assert.equal(at('late-daiviet',1410).sovereign,'late-ming');assert(!at('late-daiviet',1428).sovereign);
for(const[y,p,want]of [[1754,[87.62,43.82],false],[1755,[87.62,43.82],true],[1758,[75.99,39.47],false],[1759,[75.99,39.47],true]]){
 assert.equal(G.covers(at('1789-qing',y).polygons,p),want,'Qing '+y);checks++;
}
// The delivered asset must contain the same compiled geometry, including empty
// dependency frames after losses; otherwise dependencies can persist forever.
const html=fs.readFileSync('index.html','utf8');
const delivered=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([\s\S]*?);\n/)[1]);
assert.deepEqual(delivered,compiled);
console.log(JSON.stringify({pass:true,controlPoints:checks,checks:'dated conquest/loss, ownership, imperial continuity, sea gaps, delivered geometry'}));
