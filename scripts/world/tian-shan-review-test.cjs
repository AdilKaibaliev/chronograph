'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),read=k=>{const i=html.indexOf('const '+k+'=')+k.length+7;return JSON.parse(html.slice(i,html.indexOf(';\n',i)));},c=read('WORLD_HISTORY'),h=require('./core.js').createWorldHistory(c);
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),covers=(id,y,p)=>G.covers(at(id,y).polygons,p);
for(const y of [1831,1832,1834,1842,1848])for(const p of [[74.59,42.87],[75.8,41.17],[76,41.43],[78.39,42.49]]){assert(covers('1789-kokand',y,p),'Kokand presence '+y+' '+p);assert(!covers('1789-qing',y,p),'False Qing control '+y+' '+p);}
assert(!covers('1789-kokand',1824,[74.59,42.87]));assert(covers('1789-kokand',1825,[74.59,42.87]));assert(!covers('1789-kokand',1830,[76,41.43]));
for(const y of [1356,1832,1910,1916])assert(at('late-kyrgyz-tianshan',y).settlementMarkersOnly,'No invented hexagonal Kyrgyz border '+y);
for(const y of [1910,1916]){for(const p of [[74.59,42.87],[75.8,41.17],[76,41.43],[78.39,42.49],[73.97,38.17]]){assert(covers('1789-russian-empire',y,p));assert(!covers('1789-qing',y,p));}assert(covers('1789-qing',y,[75.99,39.47]));}
for(const p of [[75.8,41.17],[76,41.43],[78.39,42.49],[80.5,44.1]])assert(covers('late-moghulistan',1356,p));assert(!covers('late-moghulistan',1356,[66.97,39.65]));
let checked=0;for(let y=1825;y<1867;y++){
 const a=at('1789-kokand',y),b=at('1789-qing',y);if(!a||!b)continue;
 const overlap=clip.intersection(G.multi(a.polygons),G.multi(b.polygons));const area=overlap.flat().reduce((s,r)=>s+Math.abs(G.signed(r)),0);assert(area<.00001,'Kokand/Qing overlap '+y+': '+area);checked++;
}
const study=read('KYRGYZ_STUDY');let routes=0;for(const e of study.lessons)for(const route of e.routes||[e.route])if(route){assert(route.length>1);for(const [x,y]of route)assert(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90);assert(e.sources.length);routes++;}
assert(routes>=30);assert(study.lessons.find(e=>e.id==='ky-school-kokand-naryn').routes.length===2);assert(study.lessons.find(e=>e.id==='witness-1916').to===1916);assert(study.lessons.find(e=>e.id==='ky-school-return-1917').from===1917);
console.log(JSON.stringify({pass:true,annualFrontierChecks:checked,sourceBackedRoutes:routes,years:[1356,1832,1910,1916]}));
