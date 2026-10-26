'use strict';
// Named regional frontiers, not a priority rule for arbitrary overlapping states.
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))).filter(r=>Math.abs(G.signed(r))>1e-8);
const I=(a,b)=>a.length&&b.length?flat(clip.intersection(G.multi(a),G.multi(b))):[];
const D=(a,b)=>a.length&&b.length?flat(clip.difference(G.multi(a),G.multi(b))):a;
const sources={
 westernRealm:'Marco Jorio and Bettina Braun. Saint Empire romain germanique; Hans-Dietrich Kahl. Second royaume de Bourgogne. Dictionnaire historique de la Suisse; Connaître la Wallonie. Le duché de Lotharingie au sein de l’espace germanique (925–962).',
 burgundianRealm:'Hans-Dietrich Kahl. Second royaume de Bourgogne. Dictionnaire historique de la Suisse; Ville et pouvoir: Arles capitale. Presses universitaires de Provence.',
 rhoneTransfers:'Archives de Lyon. Le rattachement de Lyon à la France en 1312; Archives départementales de la Drôme. Le transport du Dauphiné à la France, 30 mars 1349; Archives départementales de l’Isère. Comptes médiévaux.',
 semirechyeFrontier:'Mirza Muhammad Haidar Dughlat. The Tarikh-i-Rashidi, translated by E. Denison Ross, edited by N. Elias, Part II, Chapter LXVIII; History of Kazakhstan. Political history: Ak Horde and Moghulistan; Christopher P. Atwood. Encyclopedia of Mongolia and the Mongol Empire.'
};
const messages=[
 ['Граница с империей проходит через области Шельды, Мааса, Соны и Роны. Лотарингия и Эльзас остаются за её пределами; герцогство Бургундия входит в королевство.','The frontier with the empire runs through the Scheldt, Meuse, Saône and Rhône regions. Lorraine and Alsace lie outside the kingdom; the Duchy of Burgundy lies within it.','Империя менен чек ара Шельда, Маас, Сона жана Рона аймактары аркылуу өтөт. Лотарингия менен Эльзас падышалыктын сыртында, Бургундия герцогдугу анын ичинде болгон.'],
 ['Германские и итальянские владения; Лотарингия и Эльзас. Бургундское королевство сохраняет отдельную корону до 1032 года.','German and Italian domains; Lorraine and Alsace. The Kingdom of Burgundy retains a separate crown until 1032.','Герман жана италиялык ээликтер; Лотарингия жана Эльзас. Бургундия падышалыгы 1032-жылга чейин өзүнчө таажысын сактаган.'],
 ['С 1032 года император наследует Бургундское королевство. Его власть там утверждается в борьбе за наследство в 1030-х годах.','From 1032 the emperor inherits the Kingdom of Burgundy. His authority there is established through the succession struggle of the 1030s.','1032-жылы император Бургундия падышалыгын мурастаган. Ал жердеги бийлиги 1030-жылдардагы мурас үчүн күрөштө бекемделген.'],
 ['Бургундское королевство','Kingdom of Burgundy','Бургундия падышалыгы'],
 ['Родольфинги между Юрой, Альпами и Роной','The Rudolfings between the Jura, Alps and Rhône','Юра, Альп жана Рона арасындагы Рудольф династиясы'],
 ['В X веке Верхняя Бургундия и Прованс объединяются под одной короной. В состав королевства входят западные альпийские земли, Савойя, графство Бургундия и Прованс. Герцогство Бургундия с центром в Дижоне относится к западному королевству.','In the tenth century Upper Burgundy and Provence unite under one crown. The kingdom includes the western Alpine lands, Savoy, the County of Burgundy and Provence. The Duchy of Burgundy, centred on Dijon, belongs to the western kingdom.','X кылымда Жогорку Бургундия менен Прованс бир таажынын алдында бириккен. Падышалыкка батыш Альп жерлери, Савойя, Бургундия графтыгы жана Прованс кирген. Борбору Дижондо болгон Бургундия герцогдугу батыш падышалыгына караган.'],
 ['Семиречье, долина Или и Кашгария; северный пограничный пояс проходит у Балхаша и Тарбагатая.','Semirechye, the Ili valley and Kashgaria; the northern frontier region follows Balkhash and Tarbagatai.','Жети-Суу, Или өрөөнү жана Кашкар; түндүк чек ара тилкеси Балхаш менен Тарбагатайдын жанынан өткөн.']
];
// Generalised river/frontier corridor. Dijon and Tournai stay west;
// Cambrai, Metz, Strasbourg and Besançon stay east. Shared vertices ensure
// the two realms cannot acquire a fictitious double-coloured border strip.
const westernEdge=[[3.6,54],[3.6,51.5],[3.85,51.15],[3.55,50.5],[3.05,50.25],[3.1,50],[4.15,49.85],[4.75,49.65],[5.12,49.2],[5.45,48.75],[5.55,48.2],[5.85,47.75],[5.45,47.45],[5.4,47.05],[5.3,46.65],[4.85,46.4],[4.73,46],[4.8,45.75],[4.8,45.2],[4.8,44.8],[4.65,44.3],[4.62,44.1],[4.45,43.85],[4.4,43.3]];
const west=G.union([[[-20,54],...westernEdge,[4.4,35],[-20,35]]]);
// The old French sketches crossed the Channel and painted southern England.
// This offshore separator retains the French/Channel-Island coast without
// importing a modern French national border into the medieval reconstruction.
const mainland=G.union([[[-20,35],[15,35],[15,54],[3.6,52],[2.5,51.1],[1.5,50.9],[0,50],[-1.8,50],[-5.2,49],[-20,49]]]);
const burgundy=G.union([[...westernEdge.slice(11),[7.5,43.3],[7.6,44.6],[7.15,45.2],[7.7,45.9],[8.3,46.5],[7.8,47],[7.6,47.8]]]);
// Lotharingian regional envelope, acquired by the eastern kingdom in 925.
const lotharingia=D(G.union([[[3.6,51.5],[5.8,53.3],[7,53.3],[7.1,51],[7.7,49.1],[7.6,47.8],[5.85,47.75],[3.1,50]]]),west);
function legacy(es,{frame,at,by,cite}){
 // This review begins in 933; the separate 843/870/880 partitions require
 // their own reconstruction and are not silently back-projected from it.
 frame('westFrancia',933,{});frame('eastFrancia',933,{});
 for(const id of ['westFrancia','franceMedieval']){
  for(const f of by.get(id).keyframes)if(f.year>=933){f.polys=I(I(G.union(f.polys),west),mainland);f.territories=messages[0][0];}
  cite(id,'westernRealm');
 }
 for(const f of by.get('eastFrancia').keyframes)if(f.year>=933)f.polys=D(G.merge([G.union(f.polys),lotharingia]),burgundy);
 frame('holyRoman',1032,{});
 for(const f of by.get('holyRoman').keyframes){
  f.polys=D(G.merge([G.union(f.polys),lotharingia,...(f.year>=1032?[burgundy]:[])]),west);
  if(f.year<1032)f.polys=D(f.polys,burgundy);
  f.territories=messages[f.year<1032?1:2][0];
 }
 for(const id of ['holyRoman','eastFrancia'])cite(id,'westernRealm');
 for(const id of ['goldenHorde','chagatai','mongol'])cite(id,'semirechyeFrontier');
}
function world(c){
 const H=require('./late-helpers.cjs')(c,{start:933,max:2026});
 for(const [key,title]of Object.entries(sources))H.source(key,title,[]);
 const b=H.entry('review-burgundy','eurasia','state',[6.14,46.2],messages[3],[H.phase(933,1032,messages[4],messages[5],['burgundianRealm'])]);
 const a=H.area(b.id,933,1032,burgundy,{color:'#9a8d73'});a.frontierAdded=true;a.label=[6.35,45.75];
 // Preserve the reviewed 1299 map through the source-file boundary, then
 // apply the dated Rhône acquisitions without changing the other fronts.
 const es=require('./legacy-frontiers.cjs').prepare(require('./continuity.cjs').legacyData());
 const coast=require('./coast-geometry.cjs');
 const changes=[];
 for(const a of [...c.areas,...c.outlines].filter(a=>['late-jochi','late-chagatai'].includes(a.entry)&&a.from<1360))a.sources=[...new Set([...a.sources,'semirechyeFrontier'])];
 const lyon=G.union([[[4.55,45.45],[4.95,45.45],[5.1,45.85],[4.95,46.05],[4.65,45.95]]]);
 const dauphine=G.union([[[4.8,45.75],[5.25,45.8],[5.8,45.65],[6.2,45.45],[6.55,45.1],[7.15,45.1],[7.2,44.8],[6.95,44.5],[6.45,44.25],[5.65,44.2],[5.25,44.3],[5.1,44.65],[5,45.2]]]);
 for(const key of ['areas','outlines'])c[key]=c[key].flatMap(a=>{
  if(!['late-france','late-hre'].includes(a.entry)||a.from>=1454)return[a];
  const dates=[a.from,...[1312,1349].filter(y=>a.from<y&&y<a.to),a.to];
  return dates.slice(0,-1).map((from,i)=>{
   const n=dates.length===2?a:{...a,from,to:dates[i+1],id:a.id+'-edge-'+from};
   const oldId=a.entry==='late-france'?'franceMedieval':'holyRoman';
   const original=key==='areas'?c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons:a.polygons;
   const raw=a.from===1300?G.union(es.find(e=>e.id===oldId).keyframes.at(-1).polys):original;
   const transfers=G.merge([...(from>=1312?[lyon]:[]),...(from>=1349?[dauphine]:[])]);
   const p=coast(a.entry==='late-france'?G.merge([I(I(raw,west),mainland),transfers]):D(G.merge([D(raw,west),burgundy]),G.merge([west,transfers])));
   if(key==='areas'){c.cartography.areas[n.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);if(c.cartography.kinds?.[a.id])c.cartography.kinds[n.id]=c.cartography.kinds[a.id];}
   else {n.polygons=p;n.points=p[0];}
   n.sources=[...new Set([...n.sources,'westernRealm','rhoneTransfers'])];changes.push({id:n.id,entry:n.entry,from:n.from,to:n.to,source:'westernRealm'});return n;
  });
 });
 // The successor retains the eastern ulus's northern frontier. Its old
 // independent sketch extended across the same Jochid steppe twice.
 const M=require('./mongol-frontiers.cjs');
 const oldMoghul=c.areas.find(a=>a.entry==='late-moghulistan'&&a.from===1347);
 const south=G.union([[[60,20],[100,20],[100,49],[87.8,49],...M.semirechyeEdge.slice(0,-1).reverse(),[60,42.7]]]);
 const moghul=I(G.union(oldMoghul.polygons),south);
 for(const key of ['areas','outlines'])for(const a of c[key].filter(a=>a.entry==='late-moghulistan'&&a.from===1347)){
  if(key==='areas'){c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(moghul);}
  else {a.polygons=moghul;a.points=moghul[0];}
  a.sources=[...new Set([...a.sources,'semirechyeFrontier'])];changes.push({id:a.id,entry:a.entry,from:a.from,to:a.to,source:'semirechyeFrontier'});
 }
 c.europeCentralReview={version:1,frames:changes,burgundy:[933,1032],scope:'Western realm frontier and Burgundy; Semirechye/Balkhash regional frontier. No claim of surveyed medieval boundaries.'};
 return c;
}
module.exports={legacy,world,sources,messages,west,burgundy};
