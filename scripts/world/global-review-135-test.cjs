'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs'),{I,D,B}=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c);
const by=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),shape=(id,y)=>by(id,y)?.polygons||[];
const size=p=>Math.abs(p.reduce((a,r)=>a+G.signed(r),0));
const controls=[
 ['1789-usa',1882,-97.499,25.902,true],['early-new-spain',1882,-97.499,25.902,false],['early-new-spain',1882,-97.50,25.86,true],['1789-usa',1882,-97.50,25.86,false],
 ['early-new-spain',1900,-117.038,32.51,true],['1789-usa',1900,-117.16,32.72,true],['early-new-spain',1900,-99.51,27.48,true],
 ['1789-saint-domingue',1822,-69.93,18.48,true],['1789-spain',1822,-69.93,18.48,false],['1848-dominican',1844,-69.93,18.48,true],['1789-spain',1860,-69.93,18.48,false],['1789-spain',1861,-69.93,18.48,true],['1789-spain',1865,-69.93,18.48,false],
 ['1815-upper-peru',1898,-67.81,-9.97,true],['review-acre-valley',1899,-67.81,-9.97,true],['1815-upper-peru',1900,-67.81,-9.97,false],['review-acre-valley',1903,-67.81,-9.97,true],['early-portuguese-brazil',1904,-67.81,-9.97,true],['1815-upper-peru',1904,-67.81,-9.97,false],['early-portuguese-brazil',1910,-72.67,-7.63,true],['1815-upper-peru',1904,-66.08,-10.98,true],
 ['late-hre',1867,11.58,48.14,false],['late-hre',1871,11.58,48.14,true],['early-austria',1871,11.58,48.14,false],['early-austria',1871,15.06,50.77,true],['late-hre',1871,15.06,50.77,false],['early-austria',1914,14.42,50.08,true],['late-hre',1914,14.98,51.15,true],
 ['1789-qing',1882,81.32,43.91,true],['1789-russian-empire',1882,81.32,43.91,false],['1789-russian-empire',1882,80.01,44.16,true],['1789-qing',1882,80.01,44.16,false],['1789-russian-empire',1884,75.29,40.82,true],['1789-qing',1884,75.29,40.82,false],['1789-qing',1884,75.50,40.40,true],
 ['1789-durrani',1895,72.32,36.95,true],['1789-durrani',1895,73.44,36.995,true],['1789-russian-empire',1900,73.44,36.995,false],
 ['1789-asante',1902,-1.62,6.69,true],['1848-zulu',1910,31.42,-28.33,true],['1914-south-africa',1910,31.42,-28.33,true],
 ['1914-american-samoa',1900,-170.7,-14.3,true],['1914-american-samoa',1900,-169.46,-14.24,false],['review-manua',1900,-169.46,-14.24,true],['1914-american-samoa',1904,-169.46,-14.24,true],['1914-american-samoa',1924,-171.08,-11.056,false],['1914-american-samoa',1925,-171.08,-11.056,true],['1914-american-samoa',2011,-169.46,-14.24,true],['1914-american-samoa',2026,-171.08,-11.056,true],
 ['1914-western-samoa',1900,-172.45,-13.64,true],['1914-western-samoa',2026,-172.45,-13.64,true],
 ['1914-confederacy',1862,-97.499,25.902,true],['1789-usa',1862,-97.499,25.902,false],
 ['1848-dominican',1871,-70.68,19.77,true],['1789-saint-domingue',1871,-72.22,19.73,true],
 ['review-papuan-territory',1884,147.16,-9.46,false],['review-papuan-territory',1885,147.16,-9.46,true],
 ['review-kaiser-wilhelmsland',1885,147,-6.73,true],['review-papuan-territory',1885,147,-6.73,false],
 ['late-hre',1913,147,-6.73,true],['late-hre',1914,147,-6.73,false],['review-kaiser-wilhelmsland',1914,147,-6.73,true],
 ['1918-new-guinea',1915,147,-6.73,true],['review-papuan-territory',1948,147.16,-9.46,true],['1918-new-guinea',1948,147.16,-9.46,false],
 ...[1949,1975,2010,2011,2026].flatMap(y=>[['1918-new-guinea',y,147.16,-9.46,true],['1918-new-guinea',y,147,-6.73,true],['1918-new-guinea',y,134.07,-.86,false]]),
 ['early-dutch',1885,139,-6,true],['1960-west-papua',1962,139,-6,true],['1789-batavia',1962,139,-6,false],['early-dutch',1962,139,-6,false],['1789-batavia',1963,139,-6,true],['1789-batavia',2026,147,-6.73,false]
];
const misses=controls.filter(([id,y,x,lat,want])=>G.covers(shape(id,y),[x,lat])!==want);
const errors=misses.map(JSON.stringify);
for(const [id,y,owner] of [['1848-dominican',1860,null],['1848-dominican',1861,'1789-spain'],['1848-dominican',1865,null],['1848-zulu',1886,null],['1848-zulu',1887,'1789-great-britain'],['1848-zulu',1910,'1914-south-africa'],['1789-asante',1902,'1789-great-britain'],['1914-american-samoa',1899,null],['1914-american-samoa',1900,'1789-usa'],['1914-western-samoa',1899,null],['1914-western-samoa',1900,'late-hre'],['1914-western-samoa',1914,'1914-new-zealand']]){
  const a=by(id,y),actual=a?.administrativeParent||a?.overlord||null;
  if(!a||actual!==owner)errors.push(id+' '+y+' should have owner '+owner+'; got '+actual);
}
assert.equal(errors.length,0,errors.join('\n'));
const windows=require('./world-corridors.json');let edges=0;const seen=new Set();
for(const [a,b,start,end,box] of [['1789-usa','early-new-spain',1854,1946,windows.usMexico.box],['late-hre','early-austria',1867,1918,windows.europe.box],['1789-russian-empire','1789-qing',1882,1917,windows.ili.box],['1789-russian-empire','1789-qing',1884,1917,windows.torugart.box],['1815-upper-peru','early-portuguese-brazil',1867,1946,[-69.2,-11.1,-67.2,-9.8]]]){
 const region=B(...box);for(let y=start;y<end;y++){const A=by(a,y),C=by(b,y);assert(A&&C);const key=[a,b,box,A.geometryId,C.geometryId].join('|');if(seen.has(key))continue;seen.add(key);assert(size(I(I(A.polygons,region),C.polygons))<.0002,'Overlapping border '+a+'/'+b+' '+y);edges++;}
}
const events=c.events.filter(e=>e.id.startsWith('global-frontier-'));assert.equal(events.length,14);
for(let y=1905;y<1946;y++){
 const west=y>=1940&&y<1944?'1939-french-west':'late-france';
 assert(size(D(windows.goldCoast.first,shape('1789-great-britain',y)))<.0002,'Gold Coast coverage '+y);
 assert(size(D(windows.goldCoast.second,shape(west,y)))<.0002,'Ivory Coast coverage '+y);
 assert(size(I(shape(west,y),windows.goldCoast.first))<.0002,'Gold Coast overlap '+y);
}
for(let y=1975;y<=2026;y++)assert(size(I(shape('1789-batavia',y),shape('1918-new-guinea',y)))<.0001,'New Guinea '+y);
for(const e of events)assert(e.coord.every(Number.isFinite)&&e.sources.every(k=>c.sources[k])&&e.title.length===3&&e.text.length===3);
for(const y of [1958,1959,1960,1961,2026]){const a=by('antarctica',y);assert(a&&!a.sovereign&&!a.overlord&&a.kind==='landscape','Antarctica '+y);}
for(const [id,year] of [['1960-event-antarctic-treaty',1959],['1991-event-antarctic',1961]])assert.equal(c.events.find(e=>e.id===id)?.year,year);
const outer=G.union([[[0,0],[3,0],[3,3],[0,3]]]),hole=G.union([[[1,1],[2,1],[2,2],[1,2]]])[0].reverse();
assert.equal(G.multi([hole,...outer])[0].length,2,'Hole before its owner is lost');
for(const [year,count] of [[1899,2],[1900,2]])for(const id of ['1914-american-samoa','1914-western-samoa']){const v=h.get(id,year);assert(v&&v.phase.from===year);if(year===1899)assert(v.phase.title.every(t=>t.length>10));}
console.log(JSON.stringify({pass:true,controls:controls.length,sharedEdges:edges,events:events.length,antarcticYears:5}));

