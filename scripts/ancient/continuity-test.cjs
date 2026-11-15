'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const read=n=>{const k='const '+n+'=',p=html.indexOf(k)+k.length;assert(p>=k.length);return JSON.parse(html.slice(p,html.indexOf(';\n',p)));};
const a=read('ANCIENT_BOUNDARIES'),c=read('ANCIENT_CONTINUITY'),legacy=read('LEGACY_CARTOGRAPHY'),empires=read('EMPIRES'),world=read('WORLD_HISTORY');
const clip=require('../vendor/polygon-clipping.cjs'),G=require('../world/cartography-geometry.cjs');
assert.deepEqual(c,require('./continuity.cjs')(a,legacy,empires,world),'Built continuity must match source');
const area=g=>g.reduce((n,p)=>n+Math.abs(G.signed(p[0]))-p.slice(1).reduce((n,h)=>n+Math.abs(G.signed(h)),0),0);
const contains=(g,p)=>g.some(r=>G.inside(r[0],p)&&!r.slice(1).some(h=>G.inside(h,p)));
const old=a.records.filter(r=>r.to===609),at=y=>c.supplement.records.filter(r=>r.from<=y&&y<=r.to);
const bridges=c.bridges.filter(r=>r.from<=609&&r.to>=609);assert.equal(bridges.length,11);assert.equal(at(610).length,11);
for(const r of old){const b=bridges.find(b=>b.id===r.id);if(b){const source=b.legacyId?G.multi(legacy.shapes[legacy.frames[b.legacyId].filter(f=>f[0]<=610).at(-1)[1]]):G.multi(require('../world/core.js').createWorldHistory(world).mapAreasAt(610).find(x=>x.entry===b.entry).polygons);assert(area(clip.xor(b.geometry,source))<1e-8,r.id+' changes at technical cutoff');}else{const next=at(610).find(x=>x.id===r.id);assert(next,r.id+' disappears');assert(area(clip.xor(r.geometry,next.geometry))<1e-8,r.id+' redraws at technical cutoff');}}
for(const r of [...c.bridges,...c.supplement.records]){assert(r.from<=r.to);assert(r.geometry.length);assert(Number.isFinite(area(r.geometry))&&area(r.geometry)>0);assert(r.anchor.every(Number.isFinite));for(const p of r.geometry.flat(2))assert(p.every(Number.isFinite)&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90);clip.union(r.geometry);}
const years=[...new Set([609,610,611,...c.supplement.records.flatMap(r=>[Math.max(610,r.from),r.to,r.to+1])])];let checked=0;
for(const y of years){const rows=at(y);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length,'Duplicate entity '+y);for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const n=area(clip.intersection(rows[i].geometry,rows[j].geometry));assert(n<1e-7,`${y}: ${rows[i].id}/${rows[j].id} overlap ${n}`);checked++;}}
for(const y of [609,610]){const rome=bridges.find(r=>r.id==='roman-east').geometry,persia=bridges.find(r=>r.id==='sasanian').geometry;for(const p of [[38.795,37.159],[40.955,37.177],[41.276,39.904]]){assert(contains(persia,p),'Persian conquests by '+y);assert(!contains(rome,p),'Do not restore conquered cities to Rome '+y);}for(const p of [[35.213,31.768],[29.918,31.2]]){assert(contains(rome,p),'Jerusalem/Alexandria still Roman '+y);assert(!contains(persia,p),'Do not anticipate later conquests '+y);}}
assert(at(617).some(r=>r.id==='goguryeo'));assert(!at(668).some(r=>r.id==='goguryeo'));assert(at(659).some(r=>r.id==='baekje'));assert(!at(660).some(r=>r.id==='baekje'));assert(at(682).some(r=>r.id==='silla'),'Unified Silla must continue');assert(at(934).some(r=>r.id==='silla'));assert(!at(935).some(r=>r.id==='silla'));
assert(!c.bridges.filter(r=>r.id==='sui'&&r.from<609).some(r=>r.to>=609));
console.log(JSON.stringify({pass:true,continuousEntities:old.length,sharedFrames:bridges.length,supplementRecords:c.supplement.records.length,validatedFrames:years.length,internalPairs:checked,datedCityControlChecks:10}));
