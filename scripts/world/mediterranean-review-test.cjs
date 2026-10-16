'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),world=require('./core.js').createWorldHistory(c),visible=require('./legacy-presentation.js').legacyStateVisible;
function shape(id,y){const e=es.find(e=>e.id===id);if(y<e.from||y>e.to||!visible(id,y))return[];const f=l.frames[id].filter(f=>f[0]<=y).at(-1);return l.shapes[f[1]];}
// Coordinates and expectations come from dated settlement histories, not from
// sampling the reconstruction under test. Include retained and excluded cities.
const sites={dokkum:[5.99,53.33],groningen:[6.56,53.22],paris:[2.35,48.86],pavia:[9.16,45.18],genoa:[8.93,44.41],rome:[12.5,41.9],ravenna:[12.2,44.42],spoleto:[12.74,42.73],benevento:[14.78,41.13],munich:[11.58,48.14],paderborn:[8.75,51.72],hamburg:[10,53.55],barcelona:[2.17,41.39],girona:[2.82,41.98],tortosa:[.52,40.81],krakow:[19.94,50.06],narbonne:[3,43.18],kairouan:[10.1,35.68],mahdia:[11.06,35.5],constantine:[6.61,36.36],qalat:[4.79,35.81],cairo:[31.24,30.04]};
const controls=[
 ['franks',733,'dokkum',false],['franks',734,'dokkum',true],['franks',784,'groningen',false],['franks',785,'groningen',true],
 ['franks',610,'paris',true],['franks',768,'paris',true],['franks',768,'krakow',false],
 ['franks',758,'narbonne',false],['franks',759,'narbonne',true],
 ['franks',773,'pavia',false],['lombards',773,'pavia',true],['franks',774,'pavia',true],['lombards',774,'pavia',false],
 ['lombards',642,'genoa',false],['lombards',643,'genoa',true],
 ['lombards',610,'rome',false],['lombards',700,'ravenna',false],['lombards',700,'benevento',true],
 ['franks',775,'spoleto',false],['franks',776,'spoleto',true],['franks',799,'benevento',false],['franks',799,'rome',false],
 ['franks',784,'paderborn',false],['franks',785,'paderborn',true],['franks',787,'munich',false],['franks',788,'munich',true],
 ['franks',784,'girona',false],['franks',785,'girona',true],['carolingian',800,'barcelona',false],['carolingian',801,'barcelona',true],
 ['carolingian',803,'hamburg',false],['carolingian',804,'hamburg',true],['carolingian',830,'tortosa',false],['carolingian',830,'krakow',false],
 ['fatimid',1000,'kairouan',true],['fatimid',1047,'kairouan',true],['fatimid',1048,'kairouan',false],
 ['fatimid',1048,'cairo',true],['fatimid',1013,'constantine',true],['fatimid',1014,'constantine',false]
];
for(const[id,y,city,want]of controls)assert.equal(G.covers(shape(id,y),sites[city]),want,`${id}/${y}/${city}`);
// A changed royal title in 800 must not redraw the whole Frankish realm.
assert.deepEqual(shape('franks',799),shape('carolingian',800));
let edges=0;const seen=new Set();
for(let y=610;y<774;y++){
 const A=shape('franks',y),B=shape('lombards',y),k=JSON.stringify([A,B]);if(seen.has(k))continue;seen.add(k);
 assert(Math.abs(F.I(A,B).reduce((s,r)=>s+G.signed(r),0))<.0001,`Franks/Lombards ${y}`);edges++;
}
for(const y of [972,1013,1014,1047,1048,1057,1147]){
 const areas=world.mapAreasAt(y),z=areas.find(a=>a.entry==='zirid');assert(z);
 assert.equal(Boolean(z.overlord),y<1048,`Zirid status ${y}`);
 assert.equal(z.politicalOutline,y>=1048,`Zirid fill status ${y}`);
 if(y<1048){assert.equal(z.overlord,'fatimid');assert(z.dependencyOutline&&z.legacyOverlord);assert(Math.abs(F.D(z.polygons,shape('fatimid',y)).reduce((s,r)=>s+G.signed(r),0))<.0001,`Fatimid dependent coverage ${y}`);}
 else assert(Math.abs(F.I(z.polygons,shape('fatimid',y)).reduce((s,r)=>s+G.signed(r),0))<.0001,`Independent Zirid overlap ${y}`);
 if(y>=1014){const h=areas.find(a=>a.entry==='hammadid');assert(h);assert(G.covers(h.polygons,sites.qalat));assert(!G.covers(z.polygons,sites.qalat));assert(Math.abs(F.I(z.polygons,h.polygons).reduce((s,r)=>s+G.signed(r),0))<.0001,`Zirid/Hammadid ${y}`);}
 // Natural Earth's generalised coast omits Mahdia's narrow cape. Require the
 // actual city in the historical extent AND coastal coverage within 8 km;
 // never move the city coordinate to make an incorrect inland border pass.
 const raw=c.areas.find(a=>a.entry==='zirid'&&a.from<=y&&y<a.to);
 assert(G.covers(raw.polygons,sites.mahdia),`Mahdia source extent ${y}`);
 assert([-.08,-.04,0,.04,.08].some(dx=>[-.04,0,.04].some(dy=>G.covers(z.polygons,[sites.mahdia[0]+dx,sites.mahdia[1]+dy]))),`Mahdia coast vicinity ${y}`);
}
assert(world.mapFrames('zirid').some(a=>a.from===1048));
assert(!world.mapAreasAt(1148).some(a=>a.entry==='zirid'));
assert.deepEqual(F.prepare(es),es);
// Execute the delivered navigation handler with a minimal DOM-facing seam.
const vm=require('node:vm'),start=html.indexOf('function worldChooseTerritory('),end=html.indexOf('function renderWorldAreaControls(',start),selected=[];
const ctx={worldHistory:world,year:1000,empireStatesForYear:()=>es.filter(e=>e.from<=1000&&1000<=e.to),stopPlay(){},selectEmpire:id=>selected.push(id)};
vm.createContext(ctx);vm.runInContext(html.slice(start,end),ctx);ctx.worldChooseTerritory('fatimid');ctx.worldChooseTerritory('unknown');assert.deepEqual(selected,['fatimid']);
console.log(JSON.stringify({pass:true,settlementControls:controls.length,frankishSharedEdges:edges,ziridStages:7,parentNavigation:true,scope:'Frankish expansion and Fatimid/Zirid/Hammadid relations; remaining medieval borders require separate research.'}));
