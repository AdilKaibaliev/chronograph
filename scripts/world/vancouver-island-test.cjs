'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
const c=JSON.parse(fs.readFileSync('index.html','utf8').match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]),h=require('./core.js').createWorldHistory(c);
const covered=(id,y,p)=>h.mapAreasAt(y).some(a=>a.entry===id&&G.covers(a.polygons,p));
const points=[[-125.5,49.5],[-126,50],[-124,48.6],[-123.4,48.43]];
for(let y=1846;y<=2026;y++)for(const p of points){
 assert.equal(covered('1789-canada',y,p),y>=1871,'Canadian accession '+y+' '+p);
 if(y<1919)assert(covered('1789-great-britain',y,p),'British treaty side '+y+' '+p);
 for(const id of ['1789-usa','1848-oregon'])assert(!covered(id,y,p),'False American island fill '+id+' '+y);
}
for(const y of [1846,1870,1871,1945,1946,2026])assert(!covered('1789-canada',y,[-123.43,48.12]),'Canada spills onto Olympic Peninsula');
for(const y of [1846,1849,1866]){const e=c.events.find(e=>e.id==='vancouver-island-'+y);assert(e&&e.year===y&&!e.approx);assert.equal(e.region,'north');assert(e.title.every(Boolean)&&e.text.every(Boolean));}
console.log(JSON.stringify({pass:true,annualYears:181,points:4,britishTreaty:1846,confederation:1871,checks:'whole island including Victoria; US/Oregon exclusion; Olympic Peninsula; 1945/1946 continuity; three-language events'}));
