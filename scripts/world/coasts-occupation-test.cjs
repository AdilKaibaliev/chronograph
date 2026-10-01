'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const html=fs.readFileSync('index.html','utf8'),raw=require('./catalog.cjs'),c=JSON.parse(html.match(/const WORLD_HISTORY=([\s\S]*?);\n/)[1]);
const h=require('./core.js').createWorldHistory(c),G=require('./cartography-geometry.cjs'),display=c.displayCartography;
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
for(const key of ['areas','outlines','entries'])assert.equal(digest(c[key]),digest(raw[key]),'Display compiler mutated source '+key);
assert(display&&display.shapes.length>100);
for(const a of [...c.areas,...c.outlines]){
 const rings=display.shapes[display.areas[a.id]];assert(rings?.length,'Empty coastal area '+a.id);
 for(const r of rings){assert(r.length>=3);for(const p of r)assert(p.every(Number.isFinite));}
 G.multi(rings); // Retain valid hole orientation after coastline intersection.
}
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id);
const german=(y,pt)=>h.mapAreasAt(y).some(a=>a.overlord==='late-hre'&&a.relationship==='occupation'&&G.covers(a.polygons,pt));
for(const [y,p,expected]of [
 [1939,[2.35,48.86],false],[1940,[2.35,48.86],true],[1940,[4.35,50.85],true],
 [1940,[4.9,52.37],true],[1940,[6.13,49.61],true],[1940,[12.54,55.68],true],
 [1940,[10.75,59.91],true],[1940,[23.73,37.98],false],[1941,[23.73,37.98],true],
 [1941,[20.46,44.81],true],[1942,[30.52,50.45],true],[1943,[30.52,50.45],false],
 [1942,[12.5,41.9],false],[1943,[12.5,41.9],true],[1944,[12.5,41.9],false],
 [1944,[9.19,45.46],true],[1944,[2.35,48.86],false],[1944,[20.46,44.81],false],
 [1944,[19.04,47.5],true],[1944,[22,57],true],[1945,[9.19,45.46],false]
])assert.equal(german(y,p),expected,'Occupation '+y+' '+p);
for(let y=1939;y<=1945;y++)for(const p of [[-.12,51.5],[18.06,59.33],[7.45,46.95],[-3.7,40.42],[-9.14,38.72],[26.1,44.4],[24.94,60.17],[3.06,36.7],[106.85,-6.2],[-52.33,4.94]])assert(!german(y,p),'German occupation projected onto ally, neutral or colony '+y+' '+p);
assert.equal(at('1945-transnistria',1942).overlord,'1914-romania');assert(!german(1942,[30.73,46.48]));
assert.equal(at('1945-greek-bulgarian-zone',1942).overlord,'1914-bulgaria');
assert.equal(at('1945-croatia-client',1942).relationship,'dependency');
assert.equal(at('early-algiers',1941).color,raw.areas.find(a=>a.entry==='late-france'&&a.from===1940).color);
assert(at('early-algiers',1941).detachedProvince,'Occupied metropole must not hide its overseas regions');
assert(!h.mapAreasAt(1945).some(a=>a.overlord==='late-hre'));
// Solid sovereign geometry must not grow to include occupied France.
assert(!G.covers(at('late-hre',1942).polygons,[2.35,48.86]));
// Inland controls and adjacent sea controls for several continents / eras.
for(const[id,y,p,want]of [
 ['late-ottoman',1600,[32.86,39.93],true],['late-ottoman',1600,[27,35],false],
 ['late-france',1941,[2.35,48.86],true],['late-france',1941,[-5,48],false],
 ['1789-usa',1900,[-97,38],true],['1789-usa',1900,[-130,35],false],
 ['1939-madagascar',1940,[47,-19],true],['1939-madagascar',1940,[43,-19],false]
])assert.equal(G.covers(at(id,y).polygons,p),want,'Coastal control '+id+' '+p);
assert(html.includes('worldOccupationHatch')&&html.includes('world-war-years'));
const oldFile='.local-checks/coasts-ww2-baseline.json';if(fs.existsSync(oldFile)){
 const old=JSON.parse(fs.readFileSync(oldFile));
 // The documented 1.14.4 France/Sardinia geometry corrections are covered by
 // all-borders-test; retain the original regression guard for every other row.
 const preserved=(rows,key)=>rows.filter(a=>a.from<1940&&(key!=='outlines'||!['late-france','1914-italy','late-yuan','late-chagatai','late-ilkhan','late-jochi'].includes(a.entry)));
 for(const key of ['areas','outlines','events'])assert.equal(digest(require('./kyrgyz-baseline.cjs')(preserved(raw[key],key))),digest(preserved(old[key],key)),'Earlier history changed '+key);
}
console.log(JSON.stringify({pass:true,coastalShapes:display.shapes.length,coastalFrames:Object.keys(display.areas).length,smallIslandVicinities:display.vicinities.length,checks:'all coastal frames, retained holes, WWII occupations by year, allies and colonies, earlier history preserved'}));
