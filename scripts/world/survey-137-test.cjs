'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
const geo=require('./frontiers-137.json'),{I,D}=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]);
const history=require('./core.js').createWorldHistory(c),at=(id,y)=>history.mapAreasAt(y).find(a=>a.entry===id);
const shape=(id,y)=>at(id,y)?.polygons||[],errors=[];
let controls=0;
function points(years,locations,inside,outside=[]){
  for(const y of years)for(const p of locations)for(const [ids,want] of [[inside,true],[outside,false]])for(const id of ids){
    controls++;if(G.covers(shape(id,y),p)!==want)errors.push([id,y,p,want]);
  }
}
const ar='1789-rio-plata',cl='1789-chile',hn='1848-honduras',ni='1848-nicaragua',cr='1848-costa-rica',sv='1848-el-salvador',gt='1848-central-america',uk='1789-great-britain',mx='early-new-spain';
points([1881,1894,1902,1914,1945,1946,2010,2011,2026],[[-69.217,-51.623],[-68.53,-50.03],[-67.49,-45.86]],[ar],[cl]);
points([1881,1894,1902,1914,1945,1946,2026],[[-70.91,-53.14],[-70.13,-52.45]],[cl],[ar]);
points([1881,1902,2026],[[-70.42,-52.81]],[],[cl,ar]);
points([1881,1894,1902,1914], [[-70.50,-51.95]],[ar],[cl]);
points([1881,1894,1902,1914], [[-70.50,-52.05]],[cl],[ar]);
points([1902,1945,2011,2026],[[-72.50,-51.72]],[cl],[ar]);
points([1860,1883,1897,1933,1938,1946,2010,2026],[[-89.89,16.92],[-90.78,14.30]],[gt],[hn,sv,mx]);
points([1860,1897,1933,1938,1946,2026],[[-89.14,14.84]],[hn],[gt]);
points([1860,1906,1933,1946,2026],[[-87.64,14.45]],[hn],[ni]);
points([1860,1894,1946,2026],[[-88.18,13.48],[-89.19,13.70]],[sv],[hn,gt]);
points([1860,1894,1946,2026],[[-86.88,12.43],[-85.92,12.91]],[ni],[cr,hn]);
points([1883,1897,1909,1933,2026],[[-90.3,17.30]],[gt],[mx]);
points([1860,1894,1946,2026],[[-84.84,10.43],[-84.10,9.94]],[cr],[ni]);
points([1858,1859,1860,1894],[[-85.63,11.07]],[cr],[ni]);
points([1858,1859,1860,1894],[[-84.40,11.018]],[ni],[cr]);
points([1860,1870,1881,1893],[[-83.76,12.01]],[ni,'survey137-mosquitia'],[uk]);
points([1894,1906,2011,2026],[[-83.76,12.01]],[ni],['survey137-mosquitia',uk]);
for(const y of [1860,1881,1893])assert.equal(at('survey137-mosquitia',y).overlord,ni);
points([1852,1859,1860],[[-86.53,16.33]],[uk],[hn]);
points([1861,1894,1946,2026],[[-86.53,16.33]],[hn],[uk]);
points([1919,1920],[[21.06,55.92]],['1918-latvia'],['1918-lithuania','1918-soviet-russia']);
points([1921,1922,1933,1939],[[21.06,55.92],[21.08,56.03],[22.33,56.31]],['1918-lithuania'],['1918-latvia','1939-ussr','1918-soviet-russia']);
points([1921,1922,1933,1939],[[21.08,56.51],[25.73,56.16]],['1918-latvia'],['1918-lithuania','1939-ussr']);
assert.equal(errors.length,0,JSON.stringify(errors));
const size=p=>Math.abs(p.reduce((a,r)=>a+G.signed(r),0)),seen=new Set();let pairChecks=0;
function disjoint(a,b,start,end,window){
 for(let y=start;y<end;y++){
   const A=at(a,y),B=at(b,y);assert(A&&B,a+'/'+b+' '+y);
   const key=[start,A.geometryId,B.geometryId].join('|');if(seen.has(key))continue;seen.add(key);
   assert(size(I(I(A.polygons,window),B.polygons))<.0002,'Overlap '+a+'/'+b+' '+y);pairChecks++;
 }
}
disjoint(ar,cl,1881,1902,D(G.merge([geo.pat.ar,geo.pat.cl]),geo.pat.belt));
disjoint(ar,cl,1902,2027,D(G.merge([geo.pat.ar,geo.pat.cl]),geo.pat.ice));
disjoint('1918-latvia','1918-lithuania',1921,1940,G.merge([geo.balt.lt,geo.balt.lv]));
disjoint(gt,hn,1933,2027,geo.bands.gt_hn);
disjoint(gt,sv,1938,2027,geo.bands.gt_sv);
disjoint(ni,hn,1906,2027,geo.bands.hn_ni);
disjoint(hn,sv,1992,2027,geo.bands.hn_sv);
disjoint(cr,ni,1860,2027,G.merge([geo.main.cr,geo.main.ni]));
for(const pt of [[-69.217,-51.623],[-68.53,-50.03],[-83.76,12.01]])assert(G.covers(c.displayCartography.land,pt),'Physical coastline '+pt);
const events=c.events.filter(e=>e.id.startsWith('survey137-'));assert.equal(events.length,13);
for(const e of events){assert(history.record(e.id)&&history.get(e.entry,e.year));assert(e.title.length===3&&e.text.length===3&&e.text.every(Boolean)&&e.sources.every(id=>c.sources[id]));}
console.log(JSON.stringify({pass:true,controls,pairChecks,events:events.length,estuaryControls:3}));
