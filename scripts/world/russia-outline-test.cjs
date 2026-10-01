'use strict';
const assert=require('node:assert/strict'),c=require('./catalog.cjs'),{createWorldHistory}=require('./core.js'),h=createWorldHistory(c);
const inside=(ring,[x,y])=>{let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
const area=(year,id='1789-russian-empire')=>h.mapAreasAt(year).find(a=>a.entry===id);
const covers=(year,point,id)=>area(year,id)?.polygons.some(r=>inside(r,point))||false;
for(const [name,point] of Object.entries({Moscow:[37.62,55.75],Petersburg:[30.32,59.94],Omsk:[73.36,54.99],Novosibirsk:[82.92,55.03],Irkutsk:[104.28,52.29],Yakutsk:[129.73,62.03],Magadan:[150.81,59.57],Kamchatka:[158.65,53.04],Anadyr:[177.51,64.73],Chukotka:[-173,66],Tashkent:[69.24,41.3],Samarkand:[66.97,39.65]}))assert(covers(1914,point),'Missing '+name);
for(const [name,point] of Object.entries({Oslo:[10.75,59.91],Stockholm:[18.07,59.33],Kiruna:[20.23,67.86],Tokyo:[139.69,35.68],Harbin:[126.63,45.75],Ulaanbaatar:[106.91,47.92],Tehran:[51.39,35.69],Bukhara:[64.43,39.77],Khiva:[60.36,41.38]}))assert(!covers(1914,point),'Overreach into '+name);
for(const point of [[-147.7,64.84],[-135.34,57.05]]){assert(covers(1866,point),'Alaska missing before cession');assert(!covers(1867,point),'Alaska still Russian after cession');}
assert(!covers(1859,[131.89,43.12]));assert(covers(1860,[131.89,43.12]),'Vladivostok after Peking treaty');
assert(!covers(1857,[127.5,50.28]));assert(covers(1858,[127.5,50.28]),'Northern Amur after Aigun treaty');
assert(!covers(1874,[142.74,46.96]));assert(covers(1875,[142.74,46.96]));assert(covers(1904,[142.74,46.96]));assert(!covers(1905,[142.74,46.96]));assert(covers(1905,[142.74,46.96],'japan'));assert(covers(1905,[143,52]));
for(const [id,y] of [['1848-pishpek',1862],['1914-tashkent',1865],['late-kyrgyz-tianshan',1876]])assert.equal(h.mapAreasAt(y).find(a=>a.entry===id)?.sovereign,'1789-russian-empire',id+' must join on its own date');
const orient=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
for(const a of c.outlines)for(const ring of a.polygons){assert(ring.length>=3);for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];assert(p.every(Number.isFinite));assert(Math.abs(p[0]-q[0])<=180,'Dateline bridge '+a.id);for(let j=i+2;j<ring.length;j++){if(i===0&&j===ring.length-1)continue;const r=ring[j],s=ring[(j+1)%ring.length];assert(!(orient(p,q,r)*orient(p,q,s)<-1e-8&&orient(r,s,p)*orient(r,s,q)<-1e-8),'Crossing ring '+a.id+' edges '+i+'/'+j);}}}
assert(h.changes().includes(1867));assert(h.changes().includes(1905));
assert(h.mapFrames('1789-russian-empire').some(a=>a.from===1867));
assert(h.mapAreasAt(1914,'eurasia').some(a=>a.entry==='1789-russian-empire'));
for(const year of [1721,1809,1866,1867,1905,1914]){const rows=h.mapAreasAt(year);assert.equal(rows.length,new Set(rows.map(a=>a.entry)).size);assert(rows.find(a=>a.entry==='1789-russian-empire').politicalOutline);}
console.log('PASS: Russian extent, dated Alaska/Amur/Primorye/Sakhalin transfers, regional membership, no crossed rings or dateline bridges.');
