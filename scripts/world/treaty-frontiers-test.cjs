'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const G=require('./cartography-geometry.cjs');
const {I,D,B}=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8');
function unpack(name){return JSON.parse(html.match(new RegExp('const '+name+'=([^\\n]+);'))[1]);}
const catalog=unpack('WORLD_HISTORY'),empires=unpack('EMPIRES'),legacy=unpack('LEGACY_CARTOGRAPHY');
const history=require('./core.js').createWorldHistory(catalog);
function shape(id,year){
  const empire=empires.find(e=>e.id===id);
  if(!empire)return history.mapAreasAt(year).find(a=>a.entry===id)?.polygons||[];
  if(year<empire.from || year>empire.to || !require('./legacy-presentation.js').legacyStateVisible(id,year))return [];
  const frame=legacy.frames[id].filter(f=>f[0]<=year).at(-1);
  return frame?legacy.shapes[frame[1]]:[];
}
const area=rings=>Math.abs(rings.reduce((a,r)=>a+G.signed(r),0));
const cities={cordoba:[-4.78,37.89],toledo:[-4.03,39.86],seville:[-5.99,37.39],merida:[-6.34,38.92],orihuela:[-.95,38.08],zaragoza:[-.88,41.65],barcelona:[2.17,41.39],narbonne:[3,43.18],oviedo:[-5.85,43.36],blagoveshchensk:[127.50,50.28],heihe:[127.47,50.24],vladivostok:[131.89,43.12],nikolayevsk:[140.72,53.14],harbin:[126.64,45.76],jiamusi:[130.36,46.8]};
const checks=[
 ['umayyad',710,'cordoba',false],['umayyad',711,'cordoba',true],['umayyad',711,'toledo',true],['visigoths',711,'toledo',false],
 ['umayyad',711,'seville',false],['visigoths',711,'seville',true],['umayyad',712,'seville',true],['umayyad',712,'merida',false],['umayyad',713,'merida',true],
 ['umayyad',712,'orihuela',false],['umayyad',713,'orihuela',true],['visigoths',713,'zaragoza',true],['umayyad',713,'zaragoza',false],['umayyad',714,'zaragoza',true],
 ['visigoths',717,'barcelona',true],['umayyad',717,'barcelona',false],['umayyad',718,'barcelona',true],['visigoths',719,'narbonne',true],['umayyad',719,'narbonne',false],
 ['umayyad',720,'narbonne',true],['umayyad',720,'oviedo',false],['review-andalusi-governor',750,'cordoba',true],['cordoba',756,'cordoba',true],
 ['review-narbonne-garrison',758,'narbonne',true],['franks',758,'narbonne',false],['franks',759,'narbonne',true],
 ['1789-russian-empire',1857,'blagoveshchensk',false],['1789-russian-empire',1858,'blagoveshchensk',true],['1789-qing',1859,'heihe',true],['1789-russian-empire',1859,'heihe',false],
 ['1789-russian-empire',1858,'nikolayevsk',true],['1789-qing',1857,'vladivostok',true],['review-ussuri-joint',1858,'vladivostok',true],['1789-qing',1859,'vladivostok',false],
 ['1789-russian-empire',1859,'vladivostok',false],['1789-russian-empire',1860,'vladivostok',true],['1789-qing',1860,'harbin',true],['1789-qing',1912,'jiamusi',true],['1789-russian-empire',1916,'nikolayevsk',true]
];
// The coast near Terney previously remained blank before Aigun. The test
// point lies inland to avoid sensitivity to shoreline simplification.
cities.terney=[136.35,45.23];
checks.push(['1789-qing',1857,'terney',true],['review-ussuri-joint',1859,'terney',true],['1789-russian-empire',1860,'terney',true]);
const failed=checks.filter(([id,y,city,hit])=>G.covers(shape(id,y),cities[city])!==hit);
assert.deepEqual(failed,[],'Independent city controls');
for(let year=711;year<720;year++)assert(area(I(shape('umayyad',year),shape('visigoths',year)))<.0001,'Overlapping conquest year '+year);
const window=B(121.405,42.25,142,54.65);
const joint=shape('review-ussuri-joint',1858);
assert.deepEqual(history.mapAreasAt(1858).find(a=>a.entry==='review-ussuri-joint').statusLabel,['Совместное владение','Joint possession','Биргелешкен ээлик']);
for(let y=1858;y<1917;y++){
  const ru=I(shape('1789-russian-empire',y),window),cn=I(shape('1789-qing',y),window);
  assert(area(I(ru,cn))<.0001,'Mainland treaty overlap '+y);
  if(y<1860){assert(area(I(ru,joint))+area(I(cn,joint))<.0001,'Shared land painted twice '+y);}
}
assert(!history.get('review-ussuri-joint',1857)&&!history.get('review-ussuri-joint',1860));
assert(!G.covers(require('./amur-mainland.json').window,[141.94,46.70]),'The mainland repair must exclude Sakhalin');
const previous=I(shape('umayyad',749),require('./iberian-conquest.cjs').straitAndSea);
const successors=G.merge([shape('review-andalusi-governor',750),shape('review-narbonne-garrison',750)]);
assert(area(D(previous,successors))+area(D(successors,previous))<.0001,'Land changes solely because the Damascus caliphate ends');
assert(area(D(joint,shape('1789-russian-empire',1860)))<.0001,'Joint domain not transferred in 1860');
for(const id of ['amur-frontier-1858','amur-frontier-1860',...[711,712,713,714,718,720].map(y=>'iberian-frontier-'+y)]){
 const e=history.record(id);assert(e&&e.sources.every(s=>catalog.sources[s])&&e.coord.every(Number.isFinite));assert(e.title.length===3&&e.text.length===3);
}
console.log(JSON.stringify({pass:true,cityControls:checks.length,iberianYears:9,amurYears:59,events:8}));

