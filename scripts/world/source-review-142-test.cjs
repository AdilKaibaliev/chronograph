'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c),ref=require('./source-review-142.json');
const area=m=>Math.abs(m.flat().reduce((s,r)=>s+G.signed(r),0)),at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),has=(id,y,p)=>!!at(id,y)&&G.covers(at(id,y).polygons,p);
let years=0;
for(const r of ref.rules)for(let y=r.from;y<r.to;y++){
 const w=at(r.winner,y),l=at(r.loser,y),mask=G.multi(ref.shapes[r.shape]);assert(w&&l);
 assert(area(clip.intersection(mask,G.multi(w.polygons)))>1e-7,'Attested neighbour missing '+y+' '+r.winner);
 assert(area(clip.intersection(mask,G.multi(l.polygons)))<1e-7,'Duplicate remains '+y+' '+r.loser);years++;
}
const points=[[-123.084,48.533],[-122.91,48.65],[-122.88,48.49]];
for(let y=1846;y<=2026;y++)for(const p of points){
 const owner=y<1872?'review-san-juan':'1789-usa';assert(has(owner,y,p),'Island missing '+y+' '+p);
 for(const other of ['1789-great-britain','1789-canada',...(y<1872?['1789-usa','1848-oregon']:[])])assert(!has(other,y,p),'Unsettled island assigned '+y+' '+other);
 if(y<1872){const a=at(owner,y);assert(!a.sovereign&&!a.overlord);assert.equal(a.kind,'influence');}
}
assert(!at('review-san-juan',1845));assert(!at('review-san-juan',1872));
for(const y of [1859,1860,1872])assert(c.events.find(e=>e.id==='san-juan-'+y&&e.year===y));
for(const y of [1846,1859,1860,1871])assert(!has('review-san-juan',y,[-123.4,48.43]),'Vancouver Island became disputed');
console.log(JSON.stringify({pass:true,datedAttributionChecks:years,reviewedPairs:4,sanJuanYears:181,islandPointChecks:543}));
