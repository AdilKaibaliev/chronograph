'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),clip=require('../vendor/polygon-clipping.cjs'),G=require('./cartography-geometry.cjs');
const s=fs.readFileSync('index.html','utf8'),read=k=>JSON.parse(s.match(new RegExp('const '+k+'=([^\\n]+);'))[1]),c=read('WORLD_HISTORY'),legacy=read('LEGACY_CARTOGRAPHY'),h=require('./core.js').createWorldHistory(c);
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id)?.polygons||[];
function early(id,y){const f=legacy.frames[id]?.filter(x=>x[0]<=y).at(-1);return f?legacy.shapes[f[1]]:[];}
const roman=y=>y<1300?early('lateByzantine',y):at('late-rum',y);
let controls=0,pairs=0;
function check(p,pt,v,n){assert.equal(G.covers(p,pt),v,n+' '+pt);controls++;}
function exclusive(a,b,n){const area=Math.abs(clip.intersection(G.multi(a),G.multi(b)).flat().reduce((s,r)=>s+G.signed(r),0));assert(area<.0001,n+' overlap '+area);pairs++;}
for(let y=1261;y<1453;y++){
 const p=roman(y);
 check(p,[32.49,37.87],false,'Konya '+y);check(p,[32.86,39.93],false,'Ankara '+y);
 check(p,[28.97,41.01],true,'Constantinople '+y);
 check(p,[22.37,37.07],y>=1262,'Mistra '+y);
 check(p,[22.94,40.64],y<1387||y>=1403&&y<1423,'Thessalonica '+y);
 check(p,[28.52,38.35],y<1391,'Philadelphia '+y);
 const epi=y===1261?early('epirus',y):at('survey140-epirus',y);
 if(y<1338){check(epi,[20.98,39.16],true,'Arta '+y);exclusive(epi,p,'Epirus '+y);}
 if(y>=1300)exclusive(p,at('late-ottoman',y),'Rome/Ottomans '+y);
}
for(const y of [1387,1402,1403,1422,1423,1429,1430,1452]){
 const owner=y<1403||y>=1430?'late-ottoman':y<1423?'late-rum':'survey140-venetian-salonika';
 for(const id of ['late-ottoman','late-rum','survey140-venetian-salonika'])check(at(id,y),[22.94,40.64],id===owner,'Thessalonica '+y+' '+id);
}
for(const y of [1452,1453,1459]){const p=y===1452?roman(y):at('late-morea',y);for(const pt of [[21.70,36.82],[21.96,36.80],[22.80,37.57]])check(p,pt,false,'Venetian ports '+y);}
for(const [from,to,id] of [[1468,1490,'late-bahmani'],[1490,1492,'early-bijapur'],[1510,1520,'early-bijapur'],[1520,1530,'late-vijayanagara'],[1530,1535,'early-bijapur']]){
 for(let y=from;y<to;y++)for(const other of ['late-bahmani','early-bijapur','early-golconda','late-vijayanagara'])check(at(other,y),[77.35,16.20],other===id,'Raichur '+y+' '+other);
}
for(let y=1518;y<1535;y++)exclusive(at('early-bijapur',y),at('early-golconda',y),'Bijapur/Golconda '+y);
const ports=[
 ['late-portugal',1300,[-9.146812,38.724669]],['early-sweden',1454,[18.095389,59.352706]],['1815-banda-oriental',1828,[-56.172998,-34.856096]],['1914-new-zealand',1849,[174.783266,-41.299988]],['1991-fiji',1970,[178.441707,-18.133016]],['1991-gambia',1965,[-16.591702,13.453877]],['1960-guinea',1958,[-13.682181,9.533469]],['1848-liberia',1847,[-10.79966,6.314582]],['1991-sierra-leone',1961,[-13.236162,8.471957]],['iceland',1918,[-21.950015,64.150024]],['1939-lebanon',1943,[35.507762,33.873921]],['1789-oman',1650,[58.593312,23.613325]],['1991-eq-guinea',1968,[8.783278,3.750015]],['1991-djibouti',1977,[43.148002,11.595015]],['early-tripoli',1951,[13.180012,32.8925]],['1991-vanuatu',1980,[168.316641,-17.73335]]
];
for(const [id,start,pt] of ports){
 check(c.displayCartography.land,pt,true,'physical port '+id);
 for(const y of [start,2010,2011,2026])check(at(id,y),pt,true,'political port '+id+' '+y);
 const owners=h.mapAreasAt(2026).filter(a=>!a.sovereign&&!a.overlord&&!a.cartographicOverlay&&['polity','influence'].includes(a.kind)&&G.covers(a.polygons,pt)).map(a=>a.entry);
 assert.deepEqual(owners,[id],'Port assigned twice '+id);
}
for(const y of [1507,1601,1649,1650,1710]){check(at('late-portugal',y),[58.593312,23.613325],y<1650,'Portugal at Muscat '+y);check(at('1789-oman',y),[58.593312,23.613325],y>=1650,'Oman at Muscat '+y);}
for(const [y,pt,id] of [[1627,[-59.61,13.10],'late-england'],[1707,[-59.61,13.10],'1789-great-britain'],[1965,[-59.61,13.10],'1789-great-britain'],[1966,[-59.61,13.10],'survey140-barbados'],[2026,[-59.61,13.10],'survey140-barbados'],[1814,[-61.0,14.0],'1789-great-britain'],[1966,[-61.0,14.0],'1789-great-britain'],[1967,[-61.0,14.0],'survey140-saint-lucia'],[1979,[-61.0,14.0],'survey140-saint-lucia'],[2026,[-61.0,14.0],'survey140-saint-lucia']]){
 check(at(id,y),pt,true,id+' '+y);
}
const events=c.events.filter(e=>e.id.startsWith('survey140-'));assert.equal(events.length,2);for(const ev of events){assert(h.get(ev.entry,ev.year));assert(c.mapComparisons[ev.id].frames.some(([y])=>y===ev.year));}
for(const y of [1878,1908,1913,1915,1919,1939,1940,1947,1991,2011,2026]){
 const ro=at('1914-romania',y),bg=at('1914-bulgaria',y);
 for(const pt of [[22.94,43.99],[25.97,43.90]]){check(ro,pt,true,'Romanian bank '+y);check(bg,pt,false,'Bulgarian exterior '+y);}
 for(const pt of [[22.87,43.985],[25.96,43.84]]){check(bg,pt,true,'Bulgarian bank '+y);check(ro,pt,false,'Romanian exterior '+y);}
 if(y>=1940){for(const pt of [[27.255,44.11],[27.83,43.57]])check(bg,pt,true,'Southern Dobruja '+y);}
}
console.log(JSON.stringify({pass:true,cityAndDateChecks:controls,datedBorderPairs:pairs,portCities:ports.length,lessons:events.length}));

