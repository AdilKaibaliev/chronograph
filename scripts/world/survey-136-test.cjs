const assert=require('node:assert/strict'),fs=require('node:fs');
const G=require('./cartography-geometry.cjs'),{I}=require('./legacy-frontiers.cjs');
const s=fs.readFileSync('index.html','utf8'),c=JSON.parse(s.match(/const WORLD_HISTORY=([^\n]+);/)[1]);
const h=require('./core.js').createWorldHistory(c),at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id);
const pool=c.cartography.shapes,used=new Set([...Object.values(c.cartography.areas),...c.cartography.mongol.map(f=>f.shape)]);
assert(used.size===pool.length&&[...used].every(i=>Number.isInteger(i)&&i>=0&&i<pool.length));
assert.equal(new Set(pool.map(p=>JSON.stringify(p))).size,pool.length);
const covers=(id,y,p)=>G.covers(at(id,y)?.polygons||[],p),checks=[];
function belongs(years,p,inside,outside=[]){
 for(const y of years)for(const [ids,want] of [[inside,true],[outside,false]])for(const id of ids)checks.push([id,y,p,want]);
}
for(const p of [[106.76,21.85],[106.25,22.67]])belongs([1802,1831,1870,1883,1887,1895,1911,1912,1920,1939],p,['1789-tayson'],['1789-qing']);
belongs([1884,1895,1911],[75.99,41.43],['1789-russian-empire'],['1789-qing']);
belongs([1884,1895,1911],[75.99,39.47],['1789-qing'],['1789-russian-empire']);
belongs([1831,1850,1900,1913,1919,1939],[3.39,50.61],['early-netherlands'],['late-france']);
belongs([1831,1850,1900,1913,1919,1939],[3.057,50.629],['late-france'],['early-netherlands']);
belongs([1859,1862,1897,1920,1959],[-88.77,17.25],['1991-belize','1789-great-britain'],['1848-central-america']);
belongs([1859,1897,1939],[-89.89,16.92],['1848-central-america'],['1789-great-britain']);
belongs([1862,1883,1896,1897,1946,1960],[-88.39,18.38],['1991-belize','1789-great-britain'],['early-new-spain','1848-central-america']);
belongs([1881,1894,1914,1945,1946,2026],[-68.31,-54.79],['1789-rio-plata'],['1789-chile']);
belongs([1881,1894,1914,1945,1946,2026],[-67.72,-53.79],['1789-rio-plata'],['1789-chile']);
belongs([1881,1894,1914,1945,1946,2026],[-70.35,-53.29],['1789-chile'],['1789-rio-plata']);
belongs([1881,1893],[-68.59,-53.55],['1789-chile'],['1789-rio-plata']);
belongs([1894,1914,1945],[-68.59,-53.55],['1789-rio-plata'],['1789-chile']);
for(const p of [[156.98,-7.08],[159.173,-8.047]]){
 belongs([1886,1893,1899],p,['survey-northern-solomons','late-hre'],['1991-solomons','1789-great-britain']);
 belongs([1900,1913,1914,1946,1960],p,['1991-solomons','1789-great-britain'],['late-hre','1918-new-guinea']);
}
for(const p of [[155.35,-6.24],[154.65,-5.25]]){
 belongs([1886,1899,1900,1913],p,['survey-northern-solomons','late-hre'],['1991-solomons']);
 belongs([1914],p,['survey-northern-solomons'],['late-hre','1991-solomons']);
 belongs([1915,1920,1946,1960,1975,2026],p,['1918-new-guinea'],['1991-solomons']);
}
belongs([1897,1910], [5.63,6.34],['benin','1789-great-britain']);
belongs([1893,1897,1899,1900], [157.075,-8.00],['1991-solomons','1789-great-britain'],['late-hre']);
belongs([1893,1896], [159.815,-11.304],[],['1991-solomons']);
belongs([1897,1900,1959], [159.815,-11.304],['1991-solomons','1789-great-britain']);
belongs([1893,1897], [165.95,-10.758],[],['1991-solomons']);
belongs([1898,1900,1959], [165.95,-10.758],['1991-solomons','1789-great-britain']);
belongs([1978,2010,2011,2026], [159.815,-11.304],['1991-solomons'],['1789-great-britain']);
belongs([1981,2010,2011,2026], [-88.39,18.38],['1991-belize'],['1789-great-britain','early-new-spain','1848-central-america']);
const misses=checks.filter(([id,y,p,want])=>covers(id,y,p)!==want);
assert.equal(misses.length,0,JSON.stringify(misses));
for(const [id,y,want] of [['1789-oyo',1892,null],['1789-oyo',1893,'1789-great-britain'],['benin',1896,null],['benin',1897,'1789-great-britain'],['1991-belize',1859,'1789-great-britain'],['1991-solomons',1893,'1789-great-britain'],['survey-northern-solomons',1914,'1914-australian-colonies']]){
 const a=at(id,y);assert.equal(a.administrativeParent||a.overlord||null,want,id+' '+y);
}
assert.equal(at('survey-northern-solomons',1914).relationship,'occupation');
const regions=require('./survey-regions-136.json'),area=p=>Math.abs(p.reduce((s,r)=>s+G.signed(r),0));
const cache=new Set();let edges=0;
function adjacent(a,b,from,to,window){
 for(let y=from;y<to;y++){const A=at(a,y),B=at(b,y);assert(A&&B);const key=[A.geometryId,B.geometryId,from].join('|');if(cache.has(key))continue;cache.add(key);
 const overlap=I(I(A.polygons,window),B.polygons);assert(area(overlap)<.0002,a+'/'+b+' '+y);edges++;}
}
const joined=r=>G.merge([r.first,r.second]);
adjacent('early-netherlands','late-france',1831,1914,joined(regions.belgium));
adjacent('early-netherlands','late-france',1919,1940,joined(regions.belgium));
adjacent('1789-tayson','1789-qing',1895,1946,joined(regions.tonkin));
adjacent('1789-chile','1789-rio-plata',1881,1946,G.merge([regions.fuego.west,regions.fuego.east]));
for(const [year,title] of [[1963,'British Honduras'],[1972,'British Honduras'],[1973,'Belize'],[1981,'Belize']])assert.equal(h.get('1991-belize',year).phase.name[1],title);
const events=c.events.filter(e=>e.id.startsWith('survey136-'));assert.equal(events.length,7);
for(const e of events){assert(h.record(e.id)&&h.get(e.entry,e.year));assert(e.title.length===3&&e.text.every(Boolean)&&e.sources.every(id=>c.sources[id]));}
console.log(JSON.stringify({pass:true,controls:checks.length,distinctEdges:edges,events:events.length}));
