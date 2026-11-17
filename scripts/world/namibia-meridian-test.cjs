'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const G=require('./cartography-geometry.cjs');
const clip=require('../vendor/polygon-clipping.cjs');
const strip=G.multi([[[20,-22],[21,-22],[21,-18],[20,-18]]]);
const c=JSON.parse(fs.readFileSync('index.html','utf8').match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]);
const h=require('./core.js').createWorldHistory(c);
const covered=(id,y,p)=>h.mapAreasAt(y).some(a=>a.entry===id&&G.covers(a.polygons,p));
assert(!covered('1914-namibia',1889,[20.5,-20]),'Treaty extent applied before 1890');
for(let y=1890;y<1946;y++){
 assert(covered('1914-namibia',y,[20.5,-20]),'Missing treaty strip '+y);
 assert(!covered('1914-namibia',y,[21.2,-20]),'Crosses 21E '+y);
 assert(!covered('1914-namibia',y,[20.5,-22.2]),'Crosses 22S turn '+y);
 assert.equal(covered('late-hre',y,[20.5,-20]),y<1915,'German colonial period '+y);
 for(const owner of ['1789-great-britain','1914-south-africa'])assert(!covered(owner,y,[20.5,-20]),'Mandate/occupation turned into a detached province '+owner+' '+y);
 for(const a of h.mapAreasAt(y)){
  if(['1914-namibia','late-hre','1789-great-britain','1914-south-africa'].includes(a.entry)||!['polity','influence'].includes(a.kind))continue;
  const v=a.polygons.flat();
  if(!v.length||Math.max(...v.map(p=>p[0]))<=20||Math.min(...v.map(p=>p[0]))>=21||Math.max(...v.map(p=>p[1]))<=-22||Math.min(...v.map(p=>p[1]))>=-18)continue;
  const area=clip.intersection(G.multi(a.polygons),strip).reduce((s,p)=>s+Math.abs(G.signed(p[0]))-p.slice(1).reduce((n,r)=>n+Math.abs(G.signed(r)),0),0);
  assert(area<1e-7,'Competing political fill '+a.entry+' '+y);
 }
}
assert(covered('1914-namibia',1946,[20.5,-20]),'Treaty strip disappears in 1946');
console.log(JSON.stringify({pass:true,years:56,treaty:1890,meridians:[20,21],parallels:[-22,-18],checks:'dated territory, parent administrations, neighbours, 1945/1946 continuity'}));
