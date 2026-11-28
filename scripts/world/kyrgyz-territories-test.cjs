'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),read=name=>JSON.parse(html.match(new RegExp('const '+name+'=([^\\n]+);'))[1]);
const data=read('KYRGYZ_TERRITORIES'),model=require('./kyrgyz-territories-core.js').createKyrgyzTerritories(data),area=p=>p.reduce((n,r)=>n+G.signed(r),0);
assert(html.includes(fs.readFileSync('scripts/world/kyrgyz-territories-runtime.js','utf8')),'Stale renderer');
for(const r of data.records){assert(r.from<r.to);assert(r.title.length===3&&r.title.every(Boolean),r.id+' title');assert(r.text.length===3&&r.text.every(Boolean),r.id+' text');assert(r.sources.length&&r.sources.every(Boolean),r.id+' sources');assert(r.coord?.length===2&&r.coord.every(Number.isFinite),r.id+' location');if(r.kind==='reference')assert(!Number.isInteger(r.shape),'A geographic witness became a state');}
for(const p of data.shapes){assert(p.length&&area(p)>0);assert(p.every(r=>r.length>=3&&r.every(c=>c.length===2&&c.every(Number.isFinite))));assert.doesNotThrow(()=>clip.union(G.multi(p)));}
let checked=0;
for(const year of [...new Set([-350000,-202,...data.frames.flatMap(f=>[f.from-1,f.from,f.to-1,f.to]),...Array.from({length:1417},(_,i)=>610+i)])]){
 const f=model.at(year);for(const r of f.rows)assert(r.from<=year&&year<r.to,'Stale '+r.id+' '+year);
 for(let i=0;i<f.layers.length;i++)for(let j=i+1;j<f.layers.length;j++)assert(Math.abs(area(clip.intersection(G.multi(f.layers[i].polygons),G.multi(f.layers[j].polygons)).flat()))<1e-7,'Doubled fill '+year);
 assert.strictEqual(model.at(year),f,'Same-year lookup not cached');checked++;
}
assert.equal(model.at(-202).rows.length,0);assert(model.at(-201).rows.some(r=>r.kind==='reference'));assert.equal(model.at(-201).layers.length,0);
assert(model.at(839).layers.every(l=>l.kind!=='influence'));assert(model.at(840).layers.some(l=>l.kind==='influence'));assert(model.at(924).layers.every(l=>l.kind!=='influence'));
assert(model.at(1206).layers.some(l=>l.kind==='core'));assert(model.at(1207).layers.every(l=>l.kind==='community'));
const yenisei=y=>model.at(y).layers.find(l=>G.covers(l.polygons,[92.5,53.5])).polygons;
assert(Math.abs(area(G.difference(yenisei(1299),yenisei(1300))))+Math.abs(area(G.difference(yenisei(1300),yenisei(1299))))<1e-7,'1299/1300 geographic discontinuity');
assert(!model.at(1507).rows.some(r=>r.origin==='residence-tianshan-1508'));assert(model.at(1508).rows.some(r=>r.origin==='residence-tianshan-1508'));assert(!model.at(1534).rows.some(r=>r.origin==='residence-tianshan-1508'));
assert(!model.at(1703).rows.some(r=>/residence-(altysar|isar|altyr|tuba)/.test(r.origin)));
assert(!model.at(1923).layers.some(l=>l.kind==='administrative'));assert(model.at(1924).layers.some(l=>l.kind==='administrative'));assert(model.at(1990).layers.some(l=>l.kind==='administrative'));assert(model.at(1991).layers.some(l=>l.kind==='core'));
assert(model.at(2026).layers.some(l=>G.covers(l.polygons,[74.6,42.87])));assert(model.at(2026).layers.every(l=>!G.covers(l.polygons,[45,24])));
assert.equal(model.next(839,1),840);assert.equal(model.next(840,-1),820);assert.equal(model.next(2026,1),null);
new vm.Script(fs.readFileSync('scripts/world/kyrgyz-territories-runtime.js','utf8'));assert(Buffer.byteLength(JSON.stringify(data))<450000,'Territory startup budget');
console.log(JSON.stringify({pass:true,records:data.records.length,frames:data.frames.length,shapes:data.shapes.length,checkedYears:checked,bytes:Buffer.byteLength(JSON.stringify(data))}));
