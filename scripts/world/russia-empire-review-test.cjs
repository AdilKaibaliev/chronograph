'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./cartography-geometry.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c);
assert.equal(c.russiaEmpireReview?.geometrySha256,require('node:crypto').createHash('sha256').update(JSON.stringify(require('./russia-treaty-geography.json'))).digest('hex'),'Published map must use the reviewed geometry');
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),r=y=>at(y<1721?'early-russia':'1789-russian-empire',y),has=(a,p)=>!!a&&G.covers(a.polygons,p);
let checks=0;
function point(y,p,want,label,id){assert.equal(has(id?at(id,y):r(y),p),want,label+' '+y);checks++;}
const core={Moscow:[37.62,55.75],Petersburg:[30.32,59.94],Arkhangelsk:[40.54,64.54],Kazan:[49.12,55.79],Kyiv:[30.52,50.45],Kharkiv:[36.23,49.99],Tobolsk:[68.25,58.2],Krasnoyarsk:[92.87,56.02],Irkutsk:[104.28,52.29],Yakutsk:[129.73,62.03],Chita:[113.5,52.03],OkhotskInland:[143.3,59.5],Kamchatka:[158.65,53.04],ChukotkaInland:[177.1,64.9]};
for(let y=1721;y<=1916;y++){
 const a=r(y);assert(a?.politicalOutline&&a.kind==='polity','Missing imperial outline '+y);checks++;
 for(const [name,p] of Object.entries(core))point(y,p,true,name);
 for(const [name,p] of Object.entries({Beijing:[116.4,39.9],Harbin:[126.63,45.75],Ulaanbaatar:[106.91,47.92],Tehran:[51.4,35.7],Kabul:[69.2,34.5],Vienna:[16.37,48.21],Berlin:[13.4,52.52],Krakow:[19.938,50.061]}))point(y,p,false,'Foreign '+name);
}
for(const y of [1700,1720]){assert.equal(r(y).entry,'early-russia');point(y,core.Kyiv,true,'Kyiv before empire');}
for(const y of [1721,1774,1792,1793]){point(y,[32.05,49.44],y>=1793,'Cherkasy partition date');if(y<1793)point(y,[32.05,49.44],true,'Commonwealth Cherkasy','early-commonwealth');}
assert.equal(r(1917).kind,'influence');assert(!r(1917).name[0].includes('империя'));assert(!r(1918));
for(const p of [core.Irkutsk,core.Yakutsk,core.Kamchatka])point(1917,p,true,'Revolutionary Russia context');
for(const y of [1721,1800,1900,1912,1913,1915,1916,1917]){
 for(const p of [[179.5,71.2],[-179.5,71.2]])point(y,p,y>=1916,'Wrangel official claim');
 point(y,[96,79.5],y>=1913,'Severnaya Zemlya');
 point(y,[54,80.6],false,'No premature Franz Josef Land');
}
for(const y of [1913,1916])assert(c.events.some(e=>e.id==='russia-arctic-claim-'+y&&e.sources.includes('russiaArctic1916')));
for(const y of [1773,1774,1778,1782,1783,1792]){
 point(y,[36.47,45.35],y>=1774,'Kerch district');
 point(y,[34.1,44.95],y>=1783,'Crimea annexation');
 if(y>=1774)point(y,[32.62,46.64],true,'Lower Dnipro');
 point(y,[30.73,46.48],y>=1792,'Yassy frontier');
}
for(const y of [1792,1793,1800,1811,1812,1855,1856,1857,1877,1878,1914,1916]){
 for(const p of [[28.83,47.01],[29.47,46.83],[30.35,46.19]])point(y,p,y>=1812,'Bessarabia');
 point(y,[28.84,45.35],y>=1812&&(y<1856||y>=1878),'Izmail');
 if(y>=1812)point(y,[28.83,47.01],false,'Ottoman Chisinau','late-ottoman');
}
for(const y of [1856,1857,1859,1877,1878]){
 const id=y<1859?'late-ottoman':'1914-romania';
 point(y,[28.84,45.35],y<1878,'Ceded Izmail',id);
 point(y,[30.35,46.19],false,'Akkerman retained by Russia',id);
 point(y,[28.615,45.682],y===1856||y>=1878,'Bolgrad protocol');
}
for(const [p,first,name] of [[[46.36,40.68],1804,'Ganja'],[[46.75,39.76],1805,'Shusha'],[[44.51,40.18],1828,'Erivan'],[[45.41,39.21],1828,'Nakhchivan']]){
 point(first-1,p,false,name);point(first,p,true,name);point(1916,p,true,name);
 if(first<1828)point(1813,p,false,'Qajar '+name,'1789-qajar');
}
for(const y of [1854,1855,1874,1875,1916]){point(y,[150.03333,45.93333],y>=1855&&y<1875,'Urup');if(y>=1855)point(y,[150.03333,45.93333],y>=1875,'Japanese Urup','japan');}
for(let y=1875;y<=2026;y++)point(y,[150.03333,45.93333],true,'Urup successor continuity',y<1945?'japan':y<1991?'1939-ussr':'1991-russia');
for(const [p,first,name] of [[[127.54,50.29],1858,'Amur'],[[131.89,43.12],1860,'Primorye'],[[24.94,60.17],1809,'Finland'],[[62.92,35.96],1885,'Panjdeh'],[[62.35,35.28],1887,'Kushka frontier'],[[142.74,46.96],1875,'Sakhalin']]){point(first-1,p,false,name);point(first,p,true,name);}
for(const y of [1904,1905,1916]){point(y,[142.74,46.96],y<1905,'Southern Sakhalin');point(y,[143,52],true,'Northern Sakhalin');}
for(const p of [[-153,57.5],[-134.95,57.05],[-151.26,60.55]]){point(1866,p,true,'Russian America');point(1867,p,false,'Alaska cession');point(1867,p,true,'US Alaska','1789-usa');}
for(let y=1867;y<=2026;y++)point(y,[-134.95,57.05],true,'Baranof successor continuity','1789-usa');
for(const [id,year] of [['early-bukhara',1868],['early-khwarazm',1873]]){const a=at(id,year);assert.equal(a.overlord,'1789-russian-empire');assert.equal(a.relationship,'dependency');checks+=2;}
assert(c.russiaEmpireReview.records.length>100);for(const src of c.russiaEmpireReview.sources){assert(c.sources[src]?.title.length>20);assert(!c.sources[src].urls);}
// Archive exceptions must never allow a deletion, a different owner or an
// earlier transfer date. Only the newly restored land is admissible.
const island=require('./russia-treaty-geography.json').urup,fixture={displayCartography:{land:island}},compare=require('./shoreline-fixture.cjs')(fixture,{...fixture,russiaEmpireReview:c.russiaEmpireReview});
compare(island,[], '1918 japan');checks++;
for(const [a,b,label] of [[[],island,'1918 japan'],[island,[],'1854 japan'],[island,[],'1918 1789-qing']]){assert.throws(()=>compare(a,b,label),/Geometry changed/);checks++;}
console.log(JSON.stringify({pass:true,checks,annualImperialYears:196,transitionYears:[1700,1720,1721,1917,1918],scope:'Delivered coast-clipped geometry: core continuity, foreign exclusions, treaty dates, receiving states and dependencies'}));
