const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const h=fs.readFileSync('src/atlas.html','utf8');
function fn(name){const s=h.indexOf('function '+name+'(');for(let e=h.indexOf('}',s);e>=0;e=h.indexOf('}',e+1)){try{new vm.Script('('+h.slice(s,e+1)+')');return h.slice(s,e+1);}catch{}}throw Error(name);}
const data=vm.runInNewContext(h.slice(h.indexOf('const S ='),h.indexOf('function resampleRing'))+fn('frameFor')+';({EMPIRES,KYRGYZ_STAGES,frameFor})');
const by=Object.fromEntries(data.EMPIRES.map(e=>[e.id,e]));
const frame=(id,y)=>data.frameFor(by[id],y);
function inside(p,ring){let v=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])v=!v;}return v;}
const covers=(id,y,p)=>!!frame(id,y)?.polys.some(r=>inside(p,r));
let checks=0;for(const e of data.EMPIRES){let previous=-Infinity;for(const f of e.keyframes){assert(f.year>previous,'Unsorted frames '+e.id);previous=f.year;for(const r of f.polys){assert(r.length>=3,e.id);for(const [x,y] of r){assert(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90,e.id);checks++;}}}}
assert.equal(frame('yeniseiKyrgyz',610).type,'population');assert(frame('yeniseiKyrgyz',840).hidden);assert.equal(frame('yeniseiKyrgyz',924).type,'population');
for(let y=1207;y<=1299;y++){assert.equal(frame('yeniseiKyrgyz',y),null);assert.equal(frame('kyrgyzKhaganate',y),null);assert.equal(by.kyrgyzMongol.type,'population');assert(frame('mongolSiberia',y));}
assert(!covers('mongol',1206,[116.4,39.9]));assert(covers('mongol',1215,[116.4,39.9]),'Beijing after 1215');assert(covers('mongol',1234,[114.3,34.8]),'Kaifeng after Jin');
assert(!covers('mongol',1221,[46.3,38]),'Western raid is not permanent control');assert(covers('mongol',1231,[48.3,38]),'Western campaign under Chormaqan');
assert(covers('mongol',1253,[100.2,25.6]),'Dali conquest');assert(!covers('mongol',1258,[120.15,30.27]),'Song Hangzhou remains');
assert.equal(frame('jinChina',1234),null);assert.equal(frame('westernXia',1227),null);assert.equal(frame('karaKhitai',1218),null);
assert.equal(frame('yuan',1260).short,'Владения Хубилая');assert.equal(frame('yuan',1271).short,'Юань · монгольская династия');
assert(!covers('yuan',1271,[120.15,30.27]));assert(covers('yuan',1276,[120.15,30.27]));assert(!covers('yuan',1276,[113.26,23.13]));assert(covers('yuan',1279,[113.26,23.13]));assert.equal(frame('southernSong',1279),null);
assert(!covers('mongolSiberia',1293,[100,67]),'All Siberia must not be claimed');assert(!covers('goldenHorde',1250,[21,52]),'Poland not Jochid land');
assert(!covers('ilkhanate',1256,[44.36,33.31]));assert(covers('ilkhanate',1258,[44.36,33.31]),'Baghdad after 1258');
assert.equal(data.KYRGYZ_STAGES.length,11);const stages=Object.fromEntries(data.KYRGYZ_STAGES.map(s=>[s.year,s]));assert.equal(stages[648].route.kind,'diplomacy');assert.equal(stages[1293].route,null);assert.equal(stages[1295].route.kind,'resettlement');assert(stages[1295].route.points[0][0]>115,'Jinshan is near Beijing, not Altai');
assert(!h.includes("p=>p.setAttribute('fill-opacity',overlayOpacity)"),'Opacity must preserve population outlines');
for(const match of h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(match[1].trim())new vm.Script(match[1]);
console.log('PASS: '+checks+' coordinate checks; 690-year data, dated Kyrgyz status, Mongol conquest milestones, dependent territories, migration semantics and JS syntax.');
