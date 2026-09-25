'use strict';
// The legacy atlas ends at a release boundary, not at the fall of its polities.
// Carry its last dated reconstruction into the first continuation frame. Later
// dated frames remain untouched; there is no interpolation of historical borders.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const mappings={
 'late-ottoman':'ottoman','late-rum':'lateByzantine','late-yuan':'yuan',
 'late-ilkhan':'ilkhanate','late-chagatai':'chagatai','late-jochi':'goldenHorde',
 'late-delhi':'delhiSultanate','late-france':'franceMedieval','late-hre':'holyRoman',
 'mamluk-late':'mamluk','late-mecca':'sharifsMecca','late-kyrgyz':'kyrgyzMongol'
};
const members=new Set(['late-yuan','late-ilkhan','late-chagatai','late-jochi']);
function legacyData(){
 const html=fs.readFileSync(path.join(__dirname,'../../src/atlas.html'),'utf8');
 return JSON.parse(JSON.stringify(vm.runInNewContext(html.slice(html.indexOf('const S ='),html.indexOf('function resampleRing'))+';EMPIRES')));
}
function reconcile(c){
 const legacy=legacyData(),byId=new Map(legacy.map(e=>[e.id,e]));
 const translations={...require('../i18n/empires-1.json'),...require('../i18n/empires-2.json')};
 for(const [id,oldId] of Object.entries(mappings)){
  const old=byId.get(oldId),frame=old.keyframes.filter(f=>f.year<=1299).at(-1);
  const first=c.areas.find(a=>a.entry===id&&a.from===1300);
  if(!first)throw Error('Missing continuation '+id);
  first.polygons=structuredClone(frame.polys);first.points=first.polygons[0];
  first.geometryYear=frame.year;
  first.label=old.label;
  first.short=id==='late-ottoman'?['Османы','Ottomans','Осмондор']:[old.short,translations[oldId][2],translations[oldId][3]];
  const previousColour=first.color;
  for(const area of c.areas.filter(a=>a.entry===id&&a.color===previousColour))area.color=old.color;
  if(members.has(id))first.mongolGroup=true;
 }
 // Do not repaint societies already in the worldwide catalogue at the file boundary.
 for(const entry of c.entries){
  const before=c.areas.find(a=>a.entry===entry.id&&a.from<1300&&a.to===1300);
  const first=c.areas.find(a=>a.entry===entry.id&&a.from===1300);
  // Preserve later colour changes that denote a new ruler or colonial occupation.
  if(before&&first){const previousColour=first.color;for(const area of c.areas.filter(a=>a.entry===entry.id&&a.from>=1300&&a.color===previousColour))area.color=before.color;}
 }
 for(const area of c.areas.filter(a=>['early-ottoman-yemen','early-ottoman-egypt-sham','early-ottoman-tunis'].includes(a.entry)))area.color=byId.get('ottoman').color;
 const H=require('./late-helpers.cjs')(c,{max:1789}),L=H.L;
 H.source('continuityAnatolia','A. C. S. Peacock. Saljuqs of Rum. Encyclopaedia Iranica; Kate Fleet (ed.). The Cambridge History of Turkey, vol. 1: Byzantium to Turkey, 1071–1453.',['https://www.iranicaonline.org/articles/saljuqs-iii/']);
 H.source('continuityTrebizond','William Miller. Trebizond: The Last Greek Empire of the Byzantine Era, 1204–1461; Suraiya N. Faroqhi and Kate Fleet (eds.). The Cambridge History of Turkey, vol. 2.',['https://assets.cambridge.org/97805216/20949/frontmatter/9780521620949_frontmatter.pdf']);
 for(const [id,oldId,to,coord,name,title,body,source,kind] of [
  ['late-rum-seljuk','rumSeljuk',1308,[32.49,37.87],L('Султанат Рум','Sultanate of Rum','Рум султандыгы'),L('Последние сельджукские султаны','The last Seljuk sultans','Акыркы селжук султандары'),L('В начале XIV века сельджукские султаны сохраняют титул при монгольской верховной власти. Реальная власть в Анатолии разделена между ильханской администрацией и бейликами. Династия прекращается в 1308 году.','Early in the fourteenth century the Seljuk sultans retain their title under Mongol overlordship. Effective power in Anatolia is divided between Ilkhanid administration and principalities. The dynasty ends in 1308.','XIV кылымдын башында селжук султандары монголдордун үстөмдүгү алдында титулун сактайт. Анатолиядагы чыныгы бийлик илхандардын башкаруусу менен бейликтердин ортосунда бөлүнөт. Династия 1308-жылы токтойт.'),'continuityAnatolia','influence'],
  ['late-trebizond','trebizond',1461,[39.72,41.0],L('Трапезундская империя','Empire of Trebizond','Трапезунд империясы'),L('Великие Комнины на Чёрном море','The Grand Komnenoi on the Black Sea','Кара деңиздеги Улуу Комниндер'),L('Трапезунд остаётся отдельным ромейским государством на южном берегу Чёрного моря и центром морской и сухопутной торговли. Османское завоевание в 1461 году завершает его историю.','Trebizond remains a separate Roman state on the southern Black Sea coast and a centre of maritime and overland trade. The Ottoman conquest in 1461 ends its history.','Трапезунд Кара деңиздин түштүк жээгиндеги өзүнчө ромей мамлекети, деңиз жана кургактык соодасынын борбору бойдон калат. 1461-жылкы Осмон басып алуусу анын тарыхын аяктайт.'),'continuityTrebizond','polity']
 ]){
  const old=byId.get(oldId),frame=old.keyframes.at(-1);
  H.entry(id,'eurasia','state',coord,name,[H.phase(1300,to,title,body,[source])]);
  const area=H.area(id,1300,to,structuredClone(frame.polys),{kind,color:old.color});area.geometryYear=frame.year;area.label=old.label;
 }
 return c;
}
module.exports=reconcile;
module.exports.mappings=mappings;
module.exports.legacyData=legacyData;
