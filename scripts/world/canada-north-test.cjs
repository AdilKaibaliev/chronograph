'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
const c=JSON.parse(fs.readFileSync('index.html','utf8').match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]);
const h=require('./core.js').createWorldHistory(c);
const covered=(id,y,p)=>h.mapAreasAt(y).some(a=>a.entry===id&&G.covers(a.polygons,p));
const ca='1789-canada',uk='1789-great-britain';
const mainland=[[-135.05,60.72],[-114.37,62.45],[-97,57],[-75,57]];
const arctic=[[-89,75],[-110,71],[-80,79]];
for(const p of mainland){assert(!covered(ca,1869,p));for(let y=1870;y<=1946;y++)assert(covered(ca,y,p),'Mainland missing '+y+' '+p);}
for(const p of arctic){assert(!covered(ca,1879,p),'Arctic transfer too early');for(let y=1880;y<=1946;y++)assert(covered(ca,y,p),'Arctic missing '+y+' '+p);}
for(const y of [1870,1879,1880,1900,1918])for(const p of [...mainland,...arctic])assert(covered(uk,y,p),'British imperial outline missing '+y);
assert(!covered(ca,1870,[-123,54]),'BC before accession');assert(covered(ca,1871,[-123,54]),'BC missing after accession');
assert(!covered(ca,1872,[-63.3,46.4]),'PEI before accession');assert(covered(ca,1873,[-63.3,46.4]),'PEI missing after accession');
for(const y of [1870,1880,1903,1927,1945,1946,1948]){
 assert(!covered(ca,y,[-53.7,47.6]),'Newfoundland before 1949');
 assert(!covered(ca,y,[-149.9,61.2]),'Canada overlaps Alaska');
 assert(!covered(ca,y,[-46,70]),'Canada overlaps Greenland');
}
assert(covered(ca,1949,[-53.7,47.6]),'Newfoundland missing in 1949');
console.log(JSON.stringify({pass:true,mainlandTransfer:1870,arcticTransfer:1880,annualYears:77,checks:'mainland, archipelago, BC, imperial union, Alaska, Greenland, Newfoundland and 1945/1946 continuity'}));
