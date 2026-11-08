'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const G=require('./cartography-geometry.cjs'),{I,D}=require('./legacy-frontiers.cjs'),ref=require('./frontiers-138.json');
const html=fs.readFileSync('index.html','utf8'),catalog=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]);
const history=require('./core.js').createWorldHistory(catalog);
const at=(id,y)=>history.mapAreasAt(y).find(a=>a.entry===id);
let controls=0,pairs=0;
const towns={glatz:[16.66,50.435],opava:[17.903,49.938],breslau:[17.03,51.11],ashgabat:[58.38,37.95],bajgiran:[58.42,37.62],quchan:[58.51,37.11],tacna:[-70.25,-18.01],arica:[-70.31,-18.48],iquique:[-70.14,-20.22],segou:[-6.26,13.43],djenne:[-4.555,13.907]};
for(const coord of Object.values(towns))assert(G.covers(catalog.displayCartography.land,coord),'Physical land '+coord);
function cities(years,places,inside,outside){
 for(const year of years)for(const place of places)for(const [ids,expected] of [[inside,true],[outside,false]])for(const id of ids){
  assert.equal(G.covers(at(id,year)?.polygons||[],towns[place]),expected,[year,id,place].join(' '));controls++;
 }
}
const pr='1789-prussia',au='early-austria',de='late-hre',ir='1789-qajar',ru='1789-russian-empire',pe='early-peru',cl='1789-chile',bo='1815-upper-peru';
cities([1740,1741],['glatz','breslau','opava'],[au],[pr]);
cities([1742,1743,1763,1795,1807,1815,1866],['glatz','breslau'],[pr],[au]);
cities([1867,1871,1914,1917],['glatz','breslau'],[de],[au]);
cities([1742,1795,1815,1866,1867,1917],['opava'],[au],[pr,de]);
cities([1881,1892,1893,1914,1916],['ashgabat'],[ru],[ir]);
cities([1881,1892,1893,1914,1916],['bajgiran','quchan'],[ir],[ru]);
cities([1866,1878],['tacna','arica','iquique'],[pe],[cl,bo]);
cities([1879],['tacna','arica'],[pe],[cl,bo]);cities([1879],['iquique'],[cl],[pe,bo]);
cities([1880,1883,1884,1914,1928],['tacna','arica','iquique'],[cl],[pe,bo]);
cities([1929,1945,1946,2010,2011,2026],['tacna'],[pe],[cl,bo]);
cities([1929,1945,1946,2010,2011,2026],['arica','iquique'],[cl],[pe,bo]);
cities([1890,1892,1893,1894,1918],['segou'],['1789-segou'],['djenne-late']);
cities([1890,1892,1893,1894,1918],['djenne'],['djenne-late'],['1789-segou']);
const size=rings=>Math.abs(rings.reduce((n,r)=>n+G.signed(r),0));
function partition(from,to,a,b,extent){
 const seen=new Set();
 for(let y=from;y<to;y++){
  const A=at(a,y),B=at(b,y),key=A?.geometryId+'|'+B?.geometryId;if(seen.has(key))continue;seen.add(key);
  assert(A&&B,'Missing owner '+y+' '+a+'/'+b);
  assert(size(I(I(A.polygons,extent),B.polygons))<.00005,'Overlap '+a+'/'+b+' '+y);
  assert(size(D(extent,G.merge([A.polygons,B.polygons])))<.0001,'Unfilled interior '+a+'/'+b+' '+y);pairs++;
 }
}
partition(1742,1867,pr,au,G.merge([ref.silesia.a,ref.silesia.b]));
partition(1867,1918,de,au,G.merge([ref.silesia.a,ref.silesia.b]));
partition(1881,1917,ru,ir,G.merge([ref.akhal.a,ref.akhal.b]));
partition(1893,1917,ru,ir,G.merge([ref.kopet.a,ref.kopet.b]));
partition(1866,2011,cl,pe,G.merge([ref.pacific.peru,ref.pacific.chile]));
for(const id of [cl,pe,bo])assert.deepEqual(at(id,2010).polygons,at(id,2011).polygons,'Modern carry '+id);
// The 1929 line runs inland to Bolivia, including the railway on the Chilean side.
for(const year of [1929,1939,1946,1991,2010,2026]){
 for(const [id,point] of [[pe,[-70.11,-18.01]],[cl,[-69.81,-18.44]]]){
  assert(G.covers(at(id,year).polygons,point),'Inland frontier '+id+' '+year);
 }
}
for(const y of [1893,1905,1916])assert(G.covers(at(ru,y).polygons,[58.09,37.915])&&!G.covers(at(ir,y).polygons,[58.09,37.915]));
for(const [year,id,status] of [[1879,'survey138-tarapaca','occupation'],[1880,'survey138-tacna-coast','occupation'],[1884,'survey138-tacna-coast','administration'],[1928,'survey138-tacna-coast','administration']]){
 assert.equal(at(id,year).relationship,status);assert.equal(at(id,year).overlord,cl);
}
assert(!at('survey138-tarapaca',1884)&&!at('survey138-tacna-coast',1929));
assert.equal(at('1789-segou',1890).overlord,'late-france');assert.equal(at('1789-segou',1893).sovereign,'late-france');
assert(!at('djenne-late',1892).sovereign);assert.equal(at('djenne-late',1893).sovereign,'late-france');
assert(!at('timbuktu-late',1893).sovereign);assert.equal(at('timbuktu-late',1894).sovereign,'late-france');
const events=catalog.events.filter(e=>e.id.startsWith('survey138-'));
assert.equal(events.length,5);
for(const e of events){assert(history.get(e.entry,e.year));assert(e.sources.every(s=>catalog.sources[s]?.title));}
const runtime=fs.readFileSync(__dirname+'/runtime.js','utf8');
const comparison=runtime.slice(runtime.indexOf('function renderWorldComparison('),runtime.indexOf('function renderWorldEvent('));
let interactions=0;
function node(tag,className,text){return {tag,className,text,children:[],attrs:{},dataset:{},append(...items){this.children.push(...items);},setAttribute(k,v){this.attrs[k]=v;}};}
for(const [id,lesson] of Object.entries(catalog.mapComparisons)){
 const e=history.record(id);assert(e&&lesson.frames.some(([y])=>y===e.year));
 assert.equal(lesson.frames.length,new Set(lesson.frames.map(([y])=>y)).size);assert(lesson.places.every(([pt,name])=>G.covers(catalog.displayCartography.land,pt)&&name.length===3));
 for(let lang=0;lang<3;lang++){
  const ctx={WORLD_HISTORY:catalog,wl:text=>text[lang],we:node,year:e.year,stopPlay(){},queueLocationSave(){},renderYear(y){ctx.year=y;},worldEventDetail:{append(el){ctx.group=el;},querySelector(){return {focus(){}};}}};
  vm.runInNewContext(comparison,ctx);
  for(const [y,desc] of lesson.frames){
   ctx.renderWorldComparison(e);const buttons=ctx.group.children[2].children;
   buttons.find(b=>b.dataset.frameYear===y).onclick();ctx.renderWorldComparison(e);
   assert.equal(ctx.group.children[3].text,desc[lang]);assert.equal(ctx.group.children[2].children.filter(b=>b.attrs['aria-pressed']==='true').length,1);
   assert(ctx.group.children[1].text&&desc[lang]);interactions++;
  }
 }
}
console.log(JSON.stringify({pass:true,cityControls:controls,distinctShapePairs:pairs,eventCards:events.length,lessons:Object.keys(catalog.mapComparisons).length,localizedFrameInteractions:interactions}));
