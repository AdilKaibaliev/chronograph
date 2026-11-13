const assert=require('assert/strict'),fs=require('fs'),vm=require('vm');
const catalog=require('./catalog.cjs'),{createWorldHistory}=require('./core.js'),history=createWorldHistory(catalog);
const MAX=catalog.range?.max??1299;
const languageRows=[];
function text(row){assert.equal(row.length,3);for(const value of row)assert(typeof value==='string'&&value.trim());assert(!/[А-Яа-яЁё]/.test(row[1]),'Russian remains in English: '+row[1]);languageRows.push(row);}
const ids=new Set(),used=new Set();let phases=0;
for(const r of catalog.regions){assert(r.id);text(r.name);text(r.scope);}
for(const e of catalog.entries){
 assert(!ids.has(e.id),'Duplicate '+e.id);ids.add(e.id);text(e.name);assert(catalog.regions.some(r=>r.id===e.region));
 assert(['state','uninhabited','city','community','culture','region','landscape'].includes(e.kind));
 let previous=-Infinity;
 for(const p of e.phases){
  phases++;assert(Number.isInteger(p.from)&&Number.isInteger(p.to)&&p.to>p.from);assert(p.from>=previous,'Overlapping phases '+e.id);previous=p.to;
  [p.period,p.title,p.text].forEach(text);assert(p.sources.length);
  if(p.name)text(p.name);
  if(p.kind)assert(['state','uninhabited','city','community','culture','region','landscape'].includes(p.kind));
  if(p.learning){assert(Object.keys(p.learning).length);for(const [topic,row] of Object.entries(p.learning)){assert(['government','economy','society'].includes(topic),'Unknown learning topic '+topic);text(row);}}
  for(const id of p.sources){assert(catalog.sources[id]?.title&&catalog.sources[id].urls.length,'Missing source '+id);used.add(id);}
  const c=p.coord||e.coord;assert(c.length===2&&c.every(Number.isFinite)&&c[0]>=-180&&c[0]<=180&&c[1]>=-90&&c[1]<=85,'Invalid map coordinate');
  if(p.from>=610&&p.from<=MAX){assert.equal(history.phaseAt(e,p.from),p);assert.notEqual(history.phaseAt(e,p.from-1),p);}
  if(p.to<=MAX){assert.equal(history.phaseAt(e,p.to-1),p);assert.notEqual(history.phaseAt(e,p.to),p);}
 }
}
for(const e of catalog.events){assert(e.from>=610&&e.from<=MAX&&e.to<=MAX+1&&e.from<=e.to);assert(!ids.has(e.id));ids.add(e.id);[e.title,e.text].forEach(text);assert(catalog.regions.some(r=>r.id===e.region));assert(e.coord.length===2);assert(e.sources.length);for(const id of e.sources){assert(catalog.sources[id]);used.add(id);}if(e.entry)assert(catalog.entries.some(p=>p.id===e.entry));if(e.route){assert(e.route.length>=2);for(const p of e.route)assert(p.length===2&&p.every(Number.isFinite));}}
for(const e of catalog.events)assert(['war','politics','diplomacy','migration','economy','culture','nature'].includes(e.kind),'Untranslated or unfilterable event topic: '+e.id+' / '+e.kind);
const areaIds=new Set();
for(const a of catalog.areas){
 assert(!areaIds.has(a.id),'Duplicate territorial frame '+a.id);areaIds.add(a.id);
 assert(catalog.entries.some(e=>e.id===a.entry));assert(a.to>a.from);assert(a.approx===true);assert(a.geometry==='schematic-regional-outline');
 assert(['polity','influence','cultural','settlement','landscape','uninhabited'].includes(a.kind));
 [a.name,a.title,a.text].forEach(text);assert(a.sources.length);for(const id of a.sources){assert(catalog.sources[id]);used.add(id);}
 assert(a.polygons.length);for(const ring of a.polygons){assert(ring.length>=3);for(const p of ring)assert(p.length===2&&p.every(Number.isFinite)&&p[0]>=-180&&p[0]<=180&&p[1]>=-90&&p[1]<=85);const signed=ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0);assert(Math.abs(signed)>.00001,'Degenerate polygon '+a.id);}
 for(const y of [Math.max(610,a.from),Math.min(MAX,a.to-1)])assert(history.get(a.entry,y),'Area persists without active society: '+a.entry);
 assert(history.areasAt(a.from).some(x=>x.id===a.id));assert(!history.areasAt(a.to).some(x=>x.id===a.id));
}
for(const a of catalog.outlines||[])for(const id of a.sources){assert(catalog.sources[id]);used.add(id);}
assert.equal(used.size,Object.keys(catalog.sources).length,'Unused source: '+Object.keys(catalog.sources).filter(k=>!used.has(k)).join(','));
for(let y=610;y<=MAX;y++){
 const all=history.at(y);assert.equal(new Set(all.map(i=>i.entry.id)).size,all.length);
 const areas=history.areasAt(y);assert.equal(new Set(areas.map(a=>a.entry)).size,areas.length,'Overlapping frames in '+y);
 for(const r of catalog.regions){const subset=history.at(y,r.id);assert(subset.length,'Empty region '+r.id+' in '+y);assert(subset.every(i=>i.entry.region===r.id));}
}
// Historical error checks: no premature cities, no polities persisting after their mapped phase.
assert(!history.get('chaco',849));assert(history.get('chaco',850));assert(!history.get('chaco',1250));
assert(!history.get('mayapan',1199));assert(history.get('mayapan',1200));assert(!history.get('tikal',900));
assert(history.get('wari',999));assert(!history.get('wari',1000));assert(!history.get('moche',800));
assert(!history.get('mapungubwe',1219));assert(history.get('mapungubwe',1220));assert(!history.get('mali',1229));
assert.notDeepEqual(history.get('sican',1099).coord,history.get('sican',1100).coord);
assert.equal(history.get('mesa',624).phase.from,550);assert.equal(history.get('mesa',1250).phase.from,1180);
assert.equal(history.get('budj',610).entry.kind,'landscape');assert.equal(history.get('kakadu',1299).entry.kind,'landscape');
assert(!history.get('norse',984));assert(history.get('norse',985));assert.equal(history.get('norse',1261).phase.from,1261);
assert(!history.get('dorset',799));assert(history.get('dorset',800));assert(history.get('antarctica',610));assert(history.get('antarctica',1299));
assert(!history.get('aotearoa',1249));assert(history.get('aotearoa',1250));assert.notDeepEqual(history.get('thule',1199).coord,history.get('thule',1200).coord);
assert.notDeepEqual(history.areasAt(1199,'south').find(a=>a.entry==='chimu').points,history.areasAt(1200,'south').find(a=>a.entry==='chimu').points);
const territory=(id,y)=>history.areasAt(y).find(a=>a.entry===id);
assert.notDeepEqual(territory('cahokia',1049).points,territory('cahokia',1050).points);
assert.notDeepEqual(territory('cahokia',1149).points,territory('cahokia',1150).points);
assert.equal(territory('mixtec',1049).kind,'cultural');assert.equal(territory('mixtec',1100).kind,'influence');assert.equal(territory('mixtec',1200).kind,'cultural');
assert(territory('wari',999));assert(!territory('wari',1000));assert(!territory('tula',1150));
assert.equal(territory('almoravid',1089).polygons.length,1);assert.equal(territory('almoravid',1090).polygons.length,2);
assert(!territory('almoravid',1147));assert(territory('almohad',1147));assert(!territory('almohad',1269));assert(territory('marinid',1269));
assert(!territory('mali',1229));assert(territory('mali',1230));assert(!territory('aotearoa',1249));assert(territory('aotearoa',1250));
assert.notDeepEqual(territory('norse',1260).name,territory('norse',1261).name);assert.equal(territory('thule',1199).polygons.length,1);assert.equal(territory('thule',1200).polygons.length,3);
for(const y of [610,900,1200,1299]){assert.equal(territory('antarctica',y).kind,'uninhabited');assert(history.areasAt(y,'australia').every(a=>a.kind==='landscape'));}
assert(history.changes('north').includes(1050));assert(history.changes('south').includes(1000));assert(history.changes('africa').includes(1269));
for(const r of catalog.regions){const records=history.timeline(r.id);assert(records.length);assert(records.every(e=>e.region===r.id));assert(records.every(e=>e.year>=e.from&&e.year<=e.to));}
const html=fs.readFileSync('index.html','utf8');
for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
assert(html.includes('if(worldHistoryHook)worldHistoryHook()'));assert(html.includes('worldHistoryHook=renderWorldHistory'));
assert(html.includes('.future-mode #worldHistoryLayer'));assert(html.includes('worldLocationHook(url)'));
assert(html.includes('.future-mode #worldTerritoryLayer'));assert(html.includes("id='worldTerritoriesToggle'"));assert(html.includes("['wterritory',worldState.area]"));
assert(!html.includes("if(f.properties.name==='Antarctica') return;"));assert(/LAT_MIN\s*=\s*-90/.test(html));
const payload=JSON.parse(html.match(/const WORLD_HISTORY=(.*);/)[1]);assert.equal(payload.events.filter(e=>e.base).length,66);assert(!JSON.stringify(payload.sources).includes('https://'));
for(const e of payload.events){assert(e.title[1]&&!/[А-Яа-яЁё]/.test(e.title[1]),'Untranslated event '+e.id);assert(e.text[1]&&!/[А-Яа-яЁё]/.test(e.text[1]),'Untranslated description '+e.id);}
const publishedHistory=createWorldHistory(payload);
assert.match(payload.sources.to1789Central.title,/Central Asia/);
assert.match(payload.sources.to1789CentralAfrica.title,/Central Africa/);
assert.match(payload.sources.to1789DutchAmerica.title,/New Netherland/);
const eventIds=new Set();
for(const e of payload.events){
 assert(!eventIds.has(e.id),'Duplicate published event '+e.id);eventIds.add(e.id);
 assert(e.sources.length&&e.sources.every(id=>payload.sources[id]?.title),'Missing published source '+e.id);
 const displayedYear=publishedHistory.record(e.id).year;
 assert(e.from<=displayedYear&&displayedYear<=e.to,'Published event date '+e.id);
 if(e.coord)assert(e.coord.length===2&&e.coord.every(Number.isFinite)&&Math.abs(e.coord[0])<=180&&Math.abs(e.coord[1])<=90,'Published event coordinate '+e.id);
}
for(const w of require('./kyrgyz-witnesses.json')){
 text(w.title);text(w.text);assert(w.source);
 if(w.geographyNote)text(w.geographyNote);
 for(const [coord,name] of w.places||[]){text(name);assert(coord.length===2&&coord.every(Number.isFinite));assert(Math.abs(coord[0])<=180&&Math.abs(coord[1])<=90);}
 if(!w.place)assert(!eventIds.has('kyrgyz-witness-'+w.from),'Unlocated account has a map pin');
}
// A broad source account must not hide a dated embassy in the Kyrgyz timeline.
const parallelSource=fs.readFileSync('scripts/world/kyrgyz-parallel.js','utf8');
const readPeriod=vm.runInNewContext(parallelSource.slice(parallelSource.indexOf(' function reading(y)'),parallelSource.indexOf(' function title(y)'))+';reading',{
 KYRGYZ_WITNESSES:require('./kyrgyz-witnesses.json'),
 kyrgyzHistoryForYear:()=>null,
 worldHistory:{at:()=>[]}
});
for(const y of [843,844,863,866,1265,1291,1758,1759,1762])assert.equal(readPeriod(y).note.from,y,'Dated Kyrgyz account hidden by a broad period '+y);
const readWithStage=vm.runInNewContext(parallelSource.slice(parallelSource.indexOf(' function reading(y)'),parallelSource.indexOf(' function title(y)'))+';reading',{
 KYRGYZ_WITNESSES:require('./kyrgyz-witnesses.json'),kyrgyzHistoryForYear:y=>({year:y}),worldHistory:{at:()=>[]}
});
assert.equal(readWithStage(1295).early,null,'Expanded source reading duplicated its earlier short account');
assert.equal(readWithStage(1293).early.year,1293,'Unrelated early account was removed');
assert.equal(publishedHistory.record('kyrgyz-witness-1755').route.length,2);
assert.equal(publishedHistory.record('kyrgyz-witness-1050').from,1050);
assert.equal(publishedHistory.record('kyrgyz-witness-870').from,801);
assert.deepEqual(publishedHistory.record('kyrgyz-witness-1295').route,[[116.15,40.53],[118,36.5]]);
assert.equal(publishedHistory.record('kyrgyz-witness-1295').to,1296,'Lunar winter must not be silently confined to a Gregorian year');
for(const y of [800,843,984,988,1050,1154,1265,1295,1504,1508,1514,1517,1522,1526,1527,1755,1758,1760]){
 const w=require('./kyrgyz-witnesses.json').find(w=>w.from===y),event=publishedHistory.record('kyrgyz-witness-'+y);
 assert(event,'Missing mapped witness '+y);assert.deepEqual(event.mapPlaces,w.places,'Named geography lost in build '+y);
}
const qocho=publishedHistory.record('kyrgyz-witness-984');
assert.deepEqual([qocho.from,qocho.year,qocho.to],[981,984,984]);
assert(qocho.approx&&qocho.periodLabel.length===3,'An embassy spanning several years became a single-year observation');
assert(!qocho.route,'A list of peoples was turned into a migration itinerary');
const charyn=publishedHistory.record('kyrgyz-witness-1508');
assert.equal(charyn.kind,'migration');assert.equal(charyn.to,1509);
assert.deepEqual(charyn.route,[[78.9,43.55],[86.57,42.06]],'An unsupported Karashahr–Turfan sequence was introduced');
assert.equal(charyn.mapPlaces.length,3);
assert.equal(publishedHistory.record('kyrgyz-witness-1514').kind,'war','Military raid was classified as migration');
assert(!publishedHistory.record('kyrgyz-witness-1522').route,'Winter quarters acquired an unsupported departure point');
const kochkor=publishedHistory.record('kyrgyz-witness-1526');
assert.deepEqual([kochkor.from,kochkor.year,kochkor.to],[1525,1526,1527]);
assert(kochkor.approx,'Chronologically inferred relocation became an exact year');
assert.deepEqual(kochkor.route,[[75.76,42.21],[75.8,41.17]]);
assert(!readPeriod(1524).notes.some(n=>n.from===1526),'Relocation appears before its source interval');
assert(!readPeriod(1528).notes.some(n=>n.from===1526),'Relocation persists after its source interval');
assert.equal(readPeriod(1527).note.from,1527,'The dated departure is hidden by a broad relocation account');
for(const y of [1504,1527])assert(!publishedHistory.record('kyrgyz-witness-'+y).route,'An unnamed destination acquired a route');
assert.equal(publishedHistory.record('kyrgyz-witness-1527').mapPlaces.length,1);
const moghulistan1510=publishedHistory.record('kyrgyz-witness-1510');
assert.deepEqual([moghulistan1510.from,moghulistan1510.to],[1510,1511]);
assert.equal(moghulistan1510.kind,'politics');assert(!moghulistan1510.route,'Regional presence became an invented migration');
const emil1703=publishedHistory.record('1789-yenisei-kyrgyz-deportation');
assert.equal(emil1703.kind,'migration');assert.equal(emil1703.route.length,6);
assert.deepEqual(emil1703.route.at(-1),[83.89,46.64],'The Dzungarian relocation was extended to Issyk-Kul');
assert.equal(emil1703.mapPlaces.length,4);
assert(!publishedHistory.record('kyrgyz-witness-1703'),'Old and enriched accounts duplicate the same event');
assert.equal(payload.events.filter(e=>e.id==='1789-yenisei-kyrgyz-deportation').length,1,'Existing event link must open one enriched card');
// A revised public ID is excluded only from the old-content fingerprint;
// validate its complete replacement separately, including translations.
const revisedWitnesses=require('./kyrgyz-witnesses.json').filter(n=>n.replacesEvent);
assert.deepEqual(revisedWitnesses.map(n=>n.replacesEvent),['1789-yenisei-kyrgyz-deportation'],'Unreviewed event revision');
for(const note of revisedWitnesses){
 const e=payload.events.find(e=>e.id===note.replacesEvent);
 assert(require('./catalog.cjs').events.some(old=>old.id===note.replacesEvent),'Revision lost its original event');
 for(const field of ['title','text','kind','route','mapScale','periodLabel','geographyNote'])assert.deepEqual(e[field],note[field],'Enriched event field '+field);
 assert.deepEqual(e.coord,note.place);assert.deepEqual(e.mapPlaces,note.places);
 assert.deepEqual([e.from,e.year,e.to],[note.periodFrom??note.from,note.from,note.to]);
 assert.equal(e.approx,(note.periodFrom??note.from)!==note.to);
 assert.deepEqual(e.sources,['kyrgyz-witness-'+note.from]);
 assert.equal(payload.sources[e.sources[0]].title,note.source);
}
assert(!readPeriod(1702).notes.some(n=>n.from===1703));
assert(!readPeriod(1704).notes.some(n=>n.from===1703));
const road1765=publishedHistory.record('kyrgyz-witness-1765');
assert.deepEqual([road1765.from,road1765.year,road1765.to],[1763,1765,1770]);
assert.equal(road1765.kind,'economy','A geographical itinerary became a dated migration');
assert(road1765.approx);assert.deepEqual(road1765.route,[[75.8,41.17],[75.76,42.21],[77.2,42.4]]);
assert(!readPeriod(1762).notes.some(n=>n.from===1765));assert(!readPeriod(1771).notes.some(n=>n.from===1765));
// A rejected proposal and administrative roads must not become migration evidence.
const embassy863=publishedHistory.record('kyrgyz-witness-863');
assert.equal(embassy863.kind,'diplomacy');assert(!embassy863.route);
assert.equal(embassy863.mapPlaces.length,2);
const road885=publishedHistory.record('kyrgyz-witness-885');
assert.deepEqual([road885.from,road885.year,road885.to],[801,885,900]);
assert(road885.approx);assert.equal(road885.kind,'economy');
assert.deepEqual(road885.route,[[72.8,40.53],[73.3,40.77],[75.8,41.17]]);
assert(!readPeriod(800).notes.some(n=>n.from===885));assert(!readPeriod(901).notes.some(n=>n.from===885));
assert.equal(readPeriod(885).note.from,885,'Equal-length accounts hide the chosen source reading');
const relay1291=publishedHistory.record('kyrgyz-witness-1291');
assert.equal(relay1291.kind,'economy');assert.equal(relay1291.from,1291);assert.equal(relay1291.to,1291);
assert.equal(relay1291.route.length,4);assert(relay1291.route.every(p=>p[1]>50),'The northern postal road acquired a Tian Shan destination');
for(const y of [863,885,1291]){
 const n=require('./kyrgyz-witnesses.json').find(n=>n.from===y),e=publishedHistory.record('kyrgyz-witness-'+y);
 for(const field of ['title','text','geographyNote','mapScale'])assert.deepEqual(e[field],n[field]);
 assert.deepEqual(e.mapPlaces,n.places);assert.equal(payload.sources[e.sources[0]].title,n.source);
}
// Trade accounts describe connected regions, not documented migration tracks.
for(const y of [800,988]){
 const e=publishedHistory.record('kyrgyz-witness-'+y);
 assert.equal(e.kind,'economy');assert(!e.route,'Trade geography became a migration route');
 assert(e.approx&&e.periodLabel.length===3,'Broad historical account has a false exact date');
}
const artisans=publishedHistory.record('kyrgyz-witness-1265');
assert.equal(artisans.kind,'migration');assert(!artisans.approx);
assert.deepEqual(artisans.route,[[94.45,51.7],[116.35,39.87]]);
assert(!readPeriod(1264).notes.some(x=>x.from===1265),'Relocation appears before its order');
assert(!readPeriod(1266).notes.some(x=>x.from===1265),'One-time relocation persists into another year');
for(let y=1300;y<=payload.range.max;y++)assert(publishedHistory.at(y,'eurasia').some(item=>item.entry.kyrgyzHistory),'Missing Kyrgyz history in '+y);
assert.equal(publishedHistory.record('kyrgyz-witness-1517').kind,'war');
const geography=publishedHistory.record('kyrgyz-witness-950');
assert.deepEqual([geography.from,geography.year,geography.to],[901,950,1000]);
assert(geography.approx&&geography.periodLabel.length===3);
for(const id of ['late-timur-damascus','early-marjdabiq-1516']){
 for(const region of ['all','eurasia','africa'])assert.equal(publishedHistory.timeline(region).filter(e=>e.id===id).length,1);
}
assert.equal(publishedHistory.record('kyrgyz-witness-1522').title[0].includes('Кочкоре'),true);
// Use the real guide handlers: every step must close the dialog, change the
// historical year and select its own source account, in all three languages.
class GuideNode{
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.attrs={};this.classList={add(){}};}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(key,value){this.attrs[key]=value;}
 querySelector(){return new GuideNode('div');}
 after(node){this.afterNode=node;}
 focus(){}
 click(){this.onclick?.();}
}
const descendants=node=>[node,...node.children.flatMap(descendants)];
for(const lang of [0,1,2]){
 const dom={},get=id=>dom[id]??=new GuideNode('div');let closed=0,saved=0,chosen='';
 get('modalClose').onclick=()=>closed++;
 const guide={document:{createElement:tag=>new GuideNode(tag)},$:get,
  we:(tag,cls='',text='')=>Object.assign(new GuideNode(tag),{className:cls,textContent:text}),
  wl:row=>row[lang],WORLD_HISTORY:payload,worldHistory:publishedHistory,KYRGYZ_WITNESSES:require('./kyrgyz-witnesses.json'),
  KYRGYZ_STAGES:[],TIMELINE_MAX:MAX,year:1508,language:['ru','en','ky'][lang],
  kyrgyzHistoryForYear:()=>null,translate:s=>s,stopPlay(){},showKyrgyzContext:false,
  renderYear:y=>{guide.year=y;},worldChooseEvent:id=>{chosen=id;},
  queueLocationSave:()=>saved++,saveLocation(){},localeSelect:{addEventListener(){}},
  MutationObserver:class{observe(){}}
 };
 // Use a stable insertion target to reach the actual history button.
 const row=new GuideNode('div');get('timelineCard').querySelector=()=>row;
 vm.runInNewContext(parallelSource,guide);row.afterNode.click();
 let box=descendants(get('modalBody')).find(n=>n.className==='kyrgyz-journey');
 assert(box&&!box.open,'The long source guide opens expanded by default');
 box.open=true;box.ontoggle();
 const buttons=descendants(box).filter(n=>n.dataset.kyrgyzJourney);
 assert.equal(buttons.length,21);assert.equal(buttons.filter(n=>n.attrs['aria-current']==='step').length,1);
 const categories={863:['Дипломатия','Diplomacy','Дипломатия'],885:['Пути и связи','Routes and connections','Жолдор жана байланыштар'],1291:['Пути и связи','Routes and connections','Жолдор жана байланыштар'],1703:['Переселение','Relocation','Көчүрүү'],1765:['Пути и связи','Routes and connections','Жолдор жана байланыштар'],1514:['Военный поход','Military campaign','Аскердик жортуул']};
 for(const [y,labels] of Object.entries(categories))assert(buttons.find(b=>b.dataset.kyrgyzJourney===y).children.some(n=>n.tag==='small'&&n.textContent.endsWith(labels[lang])),'Guide confuses roads, campaigns and relocations');
 for(const button of buttons){
  button.click();assert.equal(guide.year,Number(button.dataset.kyrgyzJourney));
  const note=guide.KYRGYZ_WITNESSES.find(n=>n.from===guide.year);
  assert.equal(chosen,note.replacesEvent||'kyrgyz-witness-'+guide.year);assert(guide.showKyrgyzContext);
 }
 assert.equal(closed,21);assert.equal(saved,21);
 row.afterNode.click();box=descendants(get('modalBody')).find(n=>n.className==='kyrgyz-journey');
 assert(box.open,'The guide lost its expansion state after returning from the map');
}
console.log(JSON.stringify({status:'PASS',entries:catalog.entries.length,phases,events:payload.events.length,areas:catalog.areas.length,languages:3,textRows:languageRows.length,years:MAX-609,regions:catalog.regions.length,sources:used.size}));
