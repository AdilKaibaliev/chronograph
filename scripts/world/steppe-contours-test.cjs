'use strict';
const assert=require('node:assert/strict');
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const raw=require('./continuity.cjs').legacyData();
const c=require('./legacy-frontiers.cjs').compiler(raw);
const area=p=>p.reduce((s,r)=>s+G.signed(r),0);
const points=[
 ['westernTurkic',610,[75.2,42.8],true,'Suyab'],
 ['westernTurkic',610,[71.37,42.9],true,'Talas'],
 ['westernTurkic',610,[64.42,39.77],true,'Bukhara'],
 ['westernTurkic',610,[61.83,37.6],false,'Sasanian Merv'],
 ['westernTurkic',628,[66.9,36.75],true,'Balkh in the reviewed Tokharistan dependency'],
 ['easternTurkic',610,[102.84,47.55],true,'Orkhon'],
 ['easternTurkic',610,[108.94,34.34],false,'Sui capital'],
 ['turgesh',720,[75.2,42.8],true,'Suyab after 719'],
 ['turgesh',720,[71.37,42.9],true,'Talas'],
 ['turgesh',720,[66.97,39.65],false,'Samarkand is not a permanent Türgesh possession'],
 ['karluk',840,[75.2,42.8],true,'Chu valley'],
 ['karluk',892,[71.37,42.9],true,'Taraz before Samanid conquest'],
 ['karluk',893,[71.37,42.9],false,'Taraz after Samanid conquest'],
 ['qarakhanid',950,[75.2,42.8],true,'Balasaghun region'],
 ['qarakhanid',950,[75.99,39.47],true,'Kashgar'],
 ['qarakhanid',998,[64.42,39.77],false,'Bukhara before 999'],
 ['qarakhanid',999,[64.42,39.77],true,'Bukhara from 999'],
 ['qarakhanid',999,[66.97,39.65],true,'Samarkand from 999'],
 ['qarakhanid',1005,[79.93,37.11],false,'Khotan before 1006'],
 ['qarakhanid',1006,[79.93,37.11],true,'Khotan from 1006'],
 ['qarakhanid',1064,[89.2,42.95],false,'Turfan is outside the Qarakhanid realm'],
 ['qarakhanid',1064,[86,49],false,'Altai is not Qarakhanid core'],
 ['qarakhanid',1064,[66.9,36.75],false,'Balkh south of Oxus']
];
for(const[id,y,p,want,label]of points)assert.equal(G.covers(c.shape(id,y),p),want,`${label}: ${id} ${y}`);
for(const y of [610,618,624,627,629]){
 const west=c.shape('westernTurkic',y),east=c.shape('easternTurkic',y);
 assert(west.flat().length>100&&east.flat().length>100,'Detailed reference was simplified back into a sketch');
 assert(area(clip.intersection(G.multi(west),G.multi(east)).flatMap(p=>p.map(r=>r.slice(0,-1))))<1e-7,'Turkic frontier overlaps');
 // Population context can overlap a political envelope without carving a hole.
 const population=c.empires.find(e=>e.id==='yeniseiKyrgyz').keyframes.filter(f=>f.year<=y).at(-1);
 assert.equal(population.type,'population');
 assert(area(clip.intersection(G.multi(east),G.multi(c.shape('yeniseiKyrgyz',y))).flatMap(p=>p.map(r=>r.slice(0,-1))))>0,'Population context removed sovereign land');
}
for(const y of [648,650,656])assert(area(clip.intersection(G.multi(c.shape('westernTurkic',y)),G.multi(c.shape('yeniseiKyrgyz',y))).flatMap(p=>p.map(r=>r.slice(0,-1))))<1e-7,'Dated Kyrgyz political fill overlaps Western Turks');
// The source comparison must not silently shrink the previously reviewed
// Kyrgyz core/influence or alter the Mongol conquests.
for(const id of ['kyrgyzKhaganate','yeniseiKyrgyz','mongol','yuan','goldenHorde']){
 const before=raw.find(e=>e.id===id),after=c.empires.find(e=>e.id===id);
 for(const f of before.keyframes){const a=after.keyframes.find(x=>x.year===f.year);assert.deepEqual(a.polys,f.polys,id+' extent unexpectedly changed');}
}
console.log(JSON.stringify({pass:true,datedControls:points.length,sharedFrontiers:5,preserved:['Kyrgyz core and reach','Mongol conquest geometry'],method:'regional outlines, dated acquisitions, no Bézier border interpolation'}));
