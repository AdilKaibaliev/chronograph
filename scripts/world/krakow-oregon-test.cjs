'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c);
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),has=(id,y,p)=>!!at(id,y)&&G.covers(at(id,y).polygons,p);
const towns=[[19.938,50.061],[19.27472,50.20444],[19.40537,50.142621],[19.470921,50.15988],[19.632592,50.135901],[19.592,50.17],[19.946,50.051]];
let checks=0;
for(let y=1815;y<1918;y++){
 const owner=y<1846?'review-krakow-republic':'early-austria';
 assert.equal(!!at('review-krakow-republic',y),y<1846,'Republic date '+y);
 for(const p of towns){assert(has(owner,y,p),'Missing district '+owner+' '+y+' '+p);checks++;for(const other of ['1815-warsaw','1789-russian-empire','1789-prussia',...(y<1846?['early-austria']:[])]){assert(!has(other,y,p),'Competing district '+other+' '+y+' '+p);checks++;}}
 if(y<1846){assert(!at(owner,y).sovereign&&!at(owner,y).overlord,'Triple protection became annexation');for(const p of [[19.95,50.043],[19.565,50.281],[19.222,50.034]]){assert(!has(owner,y,p),'Foreign town annexed '+p);checks++;}}
}
assert(!at('review-krakow-republic',1814));assert(!at('review-krakow-republic',1846));
const ref=require('../../research/krakow-1815-reference.json');assert(ref.areaKm2>1100&&ref.areaKm2<1250);assert(ref.leaveOneOut.every(r=>r.km<1));assert(ref.controls.every(r=>r.want===r.actual));
for(let y=1848;y<=2026;y++){
 const p=h.get('1848-oregon',y).phase,a=at('1848-oregon',y);assert(p.name.every(n=>!n.includes('49')));assert(a.name.every(n=>!n.includes('49')));assert(p.sources.includes('oregonChronology'));assert(a.sources.includes('oregonChronology'));
 assert.equal(p.from,y<1853?1848:y<1859?1853:1859);assert.equal(a.sovereign,'1789-usa','Region detached from USA '+y);assert(!has('1848-oregon',y,[-123.4,48.43]));checks+=6;
}
for(const y of [1848,1853,1859]){const e=c.events.find(e=>e.id==='oregon-chronology-'+y);assert(e&&e.year===y&&e.sources.includes('oregonChronology'));for(const v of [...e.title,...e.text])assert(v.length>15);}
assert(c.events.find(e=>e.id==='krakow-annexation-1846').sources.includes('krakowRepublic1815'));
console.log(JSON.stringify({pass:true,checks,krakowYears:103,oregonYears:179,controls:'District towns, Kazimierz, Austrian Podgorze, three protectors, annexation, neighbouring fills, Oregon 1848/1853/1859, Vancouver Island exclusion'}));
