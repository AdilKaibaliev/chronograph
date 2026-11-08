'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),read=id=>JSON.parse(html.match(new RegExp('const '+id+'=([^\\n]+);'))[1]),c=read('WORLD_HISTORY'),legacy=read('LEGACY_CARTOGRAPHY');
const h=require('./core.js').createWorldHistory(c),at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id);
const os='late-ottoman',rum='late-rum',ah='almohad',hf='hafsid',west='survey139-western-hafsids',bo='1815-upper-peru',pe='early-peru',ar='1789-rio-plata',br='early-portuguese-brazil',cl='1789-chile',py='1815-paraguay';
let controls=0,pairs=0;
function points(years,pts,owners,others=[]){
 for(const y of years)for(const pt of pts)for(const [ids,expected] of [[owners,true],[others,false]])for(const id of ids){
  assert.equal(G.covers(at(id,y)?.polygons||[],pt),expected,id+' '+y+' '+pt);controls++;
 }
}
const cities=[[29.06,40.19],[29.72,40.43],[29.92,40.77],[29.15,40.43]];
for(const [i,transfer] of [1326,1331,1337,1334].entries()){
 for(const y of [1300,1302,1305,1325,1326,1329,1330,1331,1334,1336,1337,1345,1353,1354,1362]){
  const owner=y>=transfer?os:rum;points([y],[cities[i]],[owner],[owner===os?rum:os,'late-rum-seljuk']);
 }
}
points([1300,1305,1326,1337,1354],[[30.18,40.02],[29.98,40.14],[29.51,40.08]],[os],[rum]);
for(const [id,next] of [['ottoman',os],['lateByzantine',rum]]){
 const p=legacy.shapes[legacy.frames[id].filter(f=>f[0]<=1299).at(-1)[1]],q=at(next,1300).polygons;
 for(const pt of [...cities,[30.18,40.02],[29.98,40.14],[29.51,40.08]]){assert.equal(G.covers(p,pt),G.covers(q,pt),id+' at 1299–1300 '+pt);controls++;}
}
const northern=[[5.068,36.752],[6.61,36.36]];
points([1229],northern,[ah],[hf]);points([1230,1231,1234,1235,1242,1269,1284],northern,[hf],[ah]);
points([1285,1299,1300,1308,1311,1313,1317],northern,[west],[ah,hf]);points([1309,1310,1318,1329],northern,[hf],[west,ah]);
points([1229,1230,1285,1309,1318],[[10.18,36.8]],[hf],[ah,west]);
const interior=[[-68.15,-16.50],[-66.16,-17.39],[-64.90,-14.84],[-63.18,-17.79],[-57.80,-18.97],[-65.26,-19.05],[-63.47,-21.25],[-63.68,-22.02]];
points([1825,1826,1836,1839,1842,1859,1874,1875,1898,1904,1908],[[-66.16,-17.39],[-64.90,-14.84],[-63.18,-17.79],[-65.26,-19.05]],[bo],[pe,ar,br,cl,py]);
points([1875,1898,1904,1908],[[-57.80,-18.97]],[bo],[br]);points([1898,1904,1908],[[-63.68,-22.02]],[bo],[ar]);
points([1909,1910,1918,1929,1932,1935,1938,1940,1941,1946,1991,2010,2011,2026],interior,[bo],[pe,ar,br,cl,py]);
points([1938,1941,2010,2011,2026],[[-63.679,-22.06]],[ar],[bo]);
points([1909,1929,1932,1935,1938,1941,2010,2011,2026],[[-57.63,-25.28],[-56.45,-25.78],[-57.52,-25.09]],[py],[ar,bo,br]);
const fort=[-59.96,-22.77];
points([1909,1929,1932,1935,1936,1937],[fort],['1939-chaco'],[bo]);
points([1938,1941,1945,2010,2011,2026],[fort],[py],[bo,'1939-chaco']);
const seen=new Set();
function exclusive(a,b,start,end){
 for(let y=start;y<end;y++){const A=at(a,y),B=at(b,y);if(!A||!B)continue;
 const key=a+'/'+b+'/'+A.geometryId+'/'+B.geometryId;if(seen.has(key))continue;seen.add(key);
 const area=Math.abs(clip.intersection(G.multi(A.polygons),G.multi(B.polygons)).flat().reduce((sum,ring)=>sum+G.signed(ring),0));
 assert(area<.0001,'Independent fills intersect '+a+' '+b+' '+y+' '+area);pairs++;}
}
exclusive(os,rum,1300,1354);exclusive(ah,hf,1229,1269);exclusive(hf,west,1285,1318);
for(const id of [ar,br,py,cl,pe])exclusive(bo,id,1909,2027);
for(const id of [bo,py,ar,br,cl,pe])assert.deepEqual(at(id,2010).polygons,at(id,2011).polygons,id+' 2010–11');
const dated=c.events.filter(e=>e.id.startsWith('survey139-'));
assert.equal(dated.length,7);for(const event of dated){assert(h.get(event.entry,event.year));assert(event.sources.every(s=>c.sources[s]?.title));}
for(const [id,l] of Object.entries(require('./comparisons-139.cjs'))){assert.deepEqual(c.mapComparisons[id],l);assert(l.frames.some(([y])=>y===h.record(id).year));}
console.log(JSON.stringify({pass:true,controls,pairs,newEvents:dated.length,lessons:3}));

