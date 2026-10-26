'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const raw=require('./continuity.cjs').legacyData(),compiled=F.compiler(raw);
const html=fs.readFileSync('index.html','utf8'),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]),es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]);
const at=(id,y)=>l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]],surface=p=>Math.abs(p.reduce((s,r)=>s+G.signed(r),0));
let frames=0,points=0;const seen=new Set();
for(const[a,b,from,to,source]of F.rules){assert(F.sources[source]);for(let y=from;y<to;y++){
 const e=es.find(e=>e.id===a),o=es.find(e=>e.id===b);if(y<e.from||y>e.to||y<o.from||y>o.to)continue;
 const x=l.frames[a].filter(f=>f[0]<=y).at(-1),z=l.frames[b].filter(f=>f[0]<=y).at(-1),key=x[1]+'|'+z[1];if(seen.has(key))continue;seen.add(key);
 assert(surface(F.I(at(a,y),at(b,y)))<.0001,`Delivered early overlap ${a}/${b}/${y}`);frames++;
}}
for(const[id,y,p,want]of [
 ['sasanian',635,[44.6,33.1],true],['sasanian',637,[44.6,33.1],false],['rashidun',637,[44.6,33.1],true],
 ['rashidun',641,[48.52,34.19],false],['rashidun',642,[48.52,34.19],true],
 ['rashidun',644,[51.67,32.65],true],['sasanian',644,[51.67,32.65],false],
 ['sasanian',649,[52.89,29.98],true],['rashidun',650,[52.89,29.98],true],
 ['greatSeljuk',1037,[44.36,33.31],false],['greatSeljuk',1055,[44.36,33.31],true],
 ['ghaznavid',980,[68.42,33.55],true],['ghaznavid',980,[74.35,31.55],false],
 ['ghaznavid',1055,[68.42,33.55],true],['ghaznavid',1055,[58.8,36.2],false],
 ['karaKhitai',1124,[75.2,42.8],false],['karaKhitai',1134,[75.2,42.8],true],
 ['ayyubid',1251,[36.3,33.5],true],['ayyubid',1251,[31.24,30.04],false],
 ['mamluk',1251,[31.24,30.04],true],['mamluk',1251,[36.3,33.5],false],['mamluk',1260,[36.3,33.5],true],
 ['northernSong',975,[118.78,32.06],true],['tenKingdoms',975,[118.78,32.06],false],
 ['jinChina',1215,[116.4,39.9],false],['mongol',1215,[116.4,39.9],true],
 ['rumSeljuk',1096,[29.72,40.43],true],['rumSeljuk',1097,[29.72,40.43],false],
 ['medievalByzantine',1096,[29.72,40.43],false],['medievalByzantine',1097,[29.72,40.43],true],
 ['rumSeljuk',1200,[32.49,37.87],true],['rumSeljuk',1200,[27.14,38.42],false],
 ['nicaea',1220,[29.72,40.43],true],['nicaea',1220,[32.49,37.87],false],
 ['rumSeljuk',1206,[30.7,36.89],false],['rumSeljuk',1207,[30.7,36.89],true],
 ['rumSeljuk',1213,[35.15,42.02],false],['rumSeljuk',1214,[35.15,42.02],true]
]){assert.equal(G.covers(at(id,y),p),want,`Early control ${id}/${y}/${p}`);points++;}
for(const[id,y,owner]of [['ghaznavid',980,'samanid'],['khwarazmian',1100,'greatSeljuk'],['qarakhanid',1150,'karaKhitai'],['sogd',620,'westernTurkic'],['rumSeljuk',1243,'mongol'],['rumSeljuk',1256,'ilkhanate']]){
 const f=es.find(e=>e.id===id).keyframes.filter(f=>f.year<=y).at(-1);assert(f.legacyContext);assert.equal(f.overlord,owner);
}
assert.equal(es.find(e=>e.id==='ayyubid').to,1259);
assert.deepEqual(F.prepare(es),es,'Preparation must be idempotent');
// Every existing early profile is preserved and unchanged profiles retain
// their records byte-for-byte (apart from the explicit review version).
assert.deepEqual(es.map(e=>e.id),raw.map(e=>e.id));
for(const id of ['kyrgyzKhaganate','yeniseiKyrgyz','kyrgyzMongol','tang','yuan']){const{frontierReviewVersion,...e}=es.find(e=>e.id===id);assert.deepEqual(e,raw.find(e=>e.id===id),id);}
{const{frontierReviewVersion,source,...e}=es.find(e=>e.id==='goldenHorde');const{source:prior,...r}=raw.find(e=>e.id==='goldenHorde');assert.deepEqual(e,r);assert.equal(source,prior+' '+F.sources.semirechyeFrontier);}
console.log(JSON.stringify({pass:true,sharedEdges:frames,controlPoints:points,profiles:es.length,checks:'retreat, conquest dates, Syrian Ayyubids, pre-imperial Seljuks and Ghaznavids, dependencies, delivered geometry'}));
