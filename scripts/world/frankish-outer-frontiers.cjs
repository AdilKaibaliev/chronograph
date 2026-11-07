'use strict';
// Named frontier corridors and dated transfers, not generic priority clipping.
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8)))));
const I=(a,b)=>a.length&&b.length?flat(clip.intersection(G.multi(a),G.multi(b))):[];
const D=(a,b)=>a.length&&b.length?flat(clip.difference(G.multi(a),G.multi(b))):a;
const B=(x,y,X,Y)=>G.union([[[x,y],[X,y],[X,Y],[x,Y]]]);
const sources={
 imperialOuter:'Marco Jorio and Bettina Braun. Heiliges Römisches Reich. Historisches Lexikon der Schweiz; Library of Congress. Czechoslovakia: A Country Study; Biografický slovník českých zemí. Boleslav I. Ukrutný; Neue Deutsche Biographie. Greifen; Stadtarchiv Schwerin. Stadtchronik; Österreich-Lexikon. Frühmittelalter; Marktgemeinde Sieghartskirchen. Geschichte Hausberg und ehemalige Burg Kogl; Wienerwaldmuseum. Eichgrabner, März 2025.',
 frankishNorth:'Hans Schultz Hansen and Axel Johnsen. Grænselandets historie: Tidstavle. Grænseforeningen; Gesellschaft für Schleswig-Holsteinische Geschichte. Limes Saxoniae.',
 frankishElbe:'Bundeszentrale für politische Bildung. Die Elbe im Lauf der Geschichte; Archäologisches Landesmuseum Brandenburg. Slawenzeit, 600–1200; The Medieval Elbe. The Events of 983; Stadt Halle. Castellum und Civitas Giebichenstein (bis 10. Jahrhundert).',
 bretonKings:'Histoire de la Bretagne. Le temps des rois; André Chédeville and Hubert Guillotel. La Bretagne des saints et des rois.',
 bretonVikings:'Tudi Kernalegenn. La Bretagne viking (913–936). Bécédia; Philippe Lanoë. Naissance du duché de Bretagne. Bécédia; Neil S. Price. The Vikings in Brittany. Viking Society for Northern Research.',
 bretonDuchy:'Histoire de la Bretagne. Le temps des ducs; Région Normandie. L’histoire passionnante de la Normandie.'
};
const T={
 angersTitle:['Анжерский договор','Treaty of Angers','Анже келишими'],
 entrammesTitle:['Антрамский договор','Treaty of Entrammes','Антрам келишими'],
 compiegneTitle:['Компьенский договор','Treaty of Compiègne','Компьен келишими'],
 returnTitle:['Возвращение Алена Барбеторта','Return of Alan Barbetorte','Ален Барбеторттун кайтып келиши'],
 cotentinTitle:['Котантен и Авраншен переходят к Нормандии','Cotentin and Avranchin pass to Normandy','Котантен менен Авраншен Нормандияга өтөт'],
 unionTitle:['Соединение Бретани с французской короной','Union of Brittany with the French crown','Бретандын француз таажысына кошулушу'],
 brittany:['Бретань','Brittany','Бретань'],
 princes:['Владения бретонских правителей','Breton rulers’ domains','Бретон башкаруучуларынын ээликтери'],
 kingdom:['Королевство Бретань','Kingdom of Brittany','Бретань королдугу'],
 viking:['Бретань в эпоху скандинавских вторжений','Brittany during Scandinavian invasions','Скандинавиялык чабуулдар учурундагы Бретань'],
 duchy:['Герцогство Бретань','Duchy of Brittany','Бретань герцогдугу'],
 initial:['Номиноэ укрепляет власть в Бретани. Восточная пограничная область остаётся предметом борьбы с франками.','Nominoë consolidates power in Brittany. The eastern frontier remains contested with the Franks.','Номиноэ Бретанда бийлигин бекемдейт. Чыгыш чек ара үчүн франктар менен күрөш жүрөт.'],
 angers:['В 851 году Карл Лысый признаёт королевское достоинство Эриспоэ и уступает Ренн, Нант и Рец. Эриспоэ сохраняет верность франкскому королю.','In 851 Charles the Bald recognises Erispoë’s royal rank and cedes Rennes, Nantes and Retz. Erispoë owes allegiance to the Frankish king.','851-жылы Карл Таз Эриспоэнин падышалык макамын таанып, Ренн, Нант жана Рецти берген. Эриспоэ франк падышасына берилген бойдон калган.'],
 entrammes:['В 863 году Саломон получает земли между Майеном и Сартой.','In 863 Salomon receives lands between the Mayenne and Sarthe.','863-жылы Саломон Майен менен Сартанын ортосундагы жерлерди алган.'],
 compiegne:['В 867 году Саломону уступлены Котантен и Авраншен.','In 867 Cotentin and Avranchin are ceded to Salomon.','867-жылы Саломонго Котантен менен Авраншен берилген.'],
 crisis:['После смерти Алена Великого в 907 году власть ослабевает; скандинавские нападения усиливаются.','After Alan the Great dies in 907, authority weakens and Scandinavian attacks intensify.','907-жылы Ален Улуу өлгөндөн кийин бийлик алсырап, скандинавиялык чабуулдар күчөгөн.'],
 occupation:['В 913–936 годах скандинавские правители закрепляются в Бретани; важный центр — Нант. Ренн сохраняет местного графа. Область не имеет единой устойчивой власти.','In 913–936 Scandinavian rulers establish themselves in Brittany, notably at Nantes. Rennes retains a local count. Authority across the region is fragmented.','913–936-жылдары скандинавиялык башкаруучулар Бретанда, өзгөчө Нантта бекемделген. Реннде жергиликтүү граф калган. Аймакта бирдиктүү туруктуу бийлик болгон эмес.'],
 cotentin:['В 933 году Котантен и Авраншен переданы нормандскому правителю Вильгельму Длинный Меч.','In 933 Cotentin and Avranchin are granted to the Norman ruler William Longsword.','933-жылы Котантен менен Авраншен норманд башкаруучусу Вильгельм Узун Кылычка берилген.'],
 restoration:['Ален Барбеторт возвращается в 936 году. В 937 году он закрепляется в Нанте; в 938 году принимает титул герцога. Победа при Тране в 939 году завершает изгнание основных скандинавских сил.','Alan Barbetorte returns in 936, establishes himself at Nantes in 937 and takes the ducal title in 938. Victory at Trans in 939 expels the remaining major Scandinavian forces.','Ален Барбеторт 936-жылы кайтып, 937-жылы Нантта бекемделип, 938-жылы герцог наамын алган. 939-жылы Трандагы жеңиш негизги скандинавиялык күчтөрдү сүрүп чыгарган.'],
 ducal:['Бретань управляется собственными герцогами и местными сеньорами. Их отношения с французской и английской коронами меняются; герцогство сохраняет отдельные учреждения.','Brittany is governed by its dukes and local lords. Relations with the French and English crowns change, while the duchy retains separate institutions.','Бретанды өз герцогдору жана жергиликтүү сеньорлор башкарган. Француз жана англис таажылары менен мамилелер өзгөрүп, герцогдук өз мекемелерин сактаган.'],
 union:['В 1532 году эдикт оформляет соединение Бретани с французской короной с сохранением ряда местных прав и учреждений.','In 1532 an edict establishes Brittany’s union with the French crown while preserving local rights and institutions.','1532-жылы эдикт Бретандын француз таажысына кошулушун бекитип, бир катар жергиликтүү укуктарды жана мекемелерди сактаган.'],
 elbe:['Эльба и восточная граница','The Elbe and the eastern frontier','Эльба жана чыгыш чек ара'],
 advance:['Походы Генриха I за Эльбу','Henry I’s campaigns beyond the Elbe','Генрих Iнин Эльбанын ары жагындагы жортуулдары'],
 retreat:['Славянское восстание 983 года','Slavic uprising of 983','983-жылкы славян көтөрүлүшү'],
 brandenburg:['Бранденбургская марка','Margraviate of Brandenburg','Бранденбург маркграфтыгы'],
 advanceText:['В 928–929 годах Генрих I берёт укрепление Бранденбург и основывает Мейсен. Начинается расширение власти за Эльбу.','In 928–929 Henry I captures Brandenburg’s stronghold and founds Meissen, expanding authority beyond the Elbe.','928–929-жылдары Генрих I Бранденбург чебин алып, Мейсенди негиздеген. Бийлик Эльбанын ары жагына кеңейген.'],
 retreatText:['В 983 году восстание разрушает имперскую власть в Хафельберге и Бранденбурге. За Эльбой вновь действуют самостоятельные славянские правители.','In 983 an uprising overturns imperial authority at Havelberg and Brandenburg. Independent Slavic rulers again hold these lands beyond the Elbe.','983-жылы көтөрүлүш Хафельберг менен Бранденбургдагы империялык бийликти кулаткан. Эльбанын ары жагында өз алдынча славян башкаруучулары кайра бийлик кылган.'],
 brandenburgText:['В 1157 году Альбрехт Медведь закрепляется в Бранденбурге. Земли гаволян становятся ядром Бранденбургской марки.','In 1157 Albert the Bear secures Brandenburg. The Hevelli lands become the core of the Margraviate of Brandenburg.','1157-жылы Альбрехт Аюу Бранденбургда бекемделген. Гаволян жерлери Бранденбург маркграфтыгынын өзөгүнө айланган.']
};
// Eider river corridor. The separator follows the river's bends, then continues
// offshore; it does not use a modern German/Danish administrative polygon.
const northLimit=G.union([[[-25,35],[35,35],[35,54.32],[10.16,54.32],[9.92,54.35],[9.72,54.31],[9.5,54.3],[9.3,54.35],[9.15,54.31],[8.83,54.31],[-25,54.31]]]);
// Limes Saxoniae → lower Elbe → Saale → Bohemian forest → eastern Alps.
// Campaigns/tribute east of this corridor are not sovereign annexations.
const eastCorridor=[[10.16,54.32],[10.25,54.15],[10.1,53.95],[10.4,53.8],[10.6,53.6],[10.7,53.4],[11.1,53.15],[11.6,53],[11.8,52.65],[11.9,52.2],[11.85,52],[11.95,51.9],[12.06,51.6],[12.06,51.35],[12,51.05],[11.85,50.75],[11.95,50.3],[12.3,50.1],[12.65,49.6],[13.1,49.15],[13.8,48.7],[14.5,48.8],[15.1,48.85],[16.1,48.8],[16.8,48.65],[17.2,48.2],[17.2,47.8],[16.6,47.45],[16.3,46.9],[15.5,46.5],[14.6,46.3],[13.7,46.4],[12.3,46.7],[10.5,46.7],[9.2,46.55],[8.3,46.45],[7.8,45],[-25,45]];
const eastCore=G.union([[[-25,54.32],...eastCorridor]]);
// Regional extent of the Ottonian march system, south of the independently
// ruled Baltic coast. No extension into the whole of modern Poland.
const marches=G.union([[[11.65,53.05],[12.3,53.2],[13.5,53.15],[14.2,52.9],[14.65,52.5],[14.7,51.65],[14.25,51],[13.7,50.75],[12.95,50.9],[12,51.05],[11.9,51.9],[11.85,52.2]]]);
const post983=G.union([[[10.6,53.6],[11.1,53.15],[11.6,53],[11.8,52.65],[11.9,52.2],[11.85,52],[12.9,52],[13.8,51.8],[14.7,51.8],[15.4,52.8],[15.4,55],[10.6,55]]]);
const bohemia=G.union([[[12,50.1],[12.45,50.6],[13.4,50.9],[14.6,51],[15.4,50.6],[16.4,50.3],[16.5,49.5],[15.7,48.8],[14.5,48.55],[13.5,48.6],[12.7,49.2]]]);
const moravia=G.union([[[15.7,48.8],[16.35,48.6],[16.9,48.65],[17.6,49],[18.25,49.6],[18.1,50.05],[17.4,50.3],[16.4,50.3],[15.9,49.6]]]);
const mecklenburg=G.union([[[10.4,53.4],[10.65,54],[11.2,54.2],[12.3,54.3],[13.35,54.15],[13.5,53.4],[12.3,53.15],[11.6,53]]]);
const pomerania=G.union([[[13.1,53.3],[13.1,54.25],[14,54.15],[15,54.3],[16.1,54.4],[16.2,53.6],[15.3,53.1],[14.1,52.9]]]);
// Danube march contraction after 907 and subsequent regional advances.
// Preserve Carinthia south of the cut; do not paint the Pannonian plain.
function alpineCut(y){
 if(y<907)return [];
 const x=y<955?14.5:y<976?15.7:y<1000?16.1:y<1031?16.9:y<1043?16.65:17.08;
 return G.union([[[x,48.85],[20,48.85],[20,46.9],[16.1,46.9],[15.7,47.35],[x,47.8]]]);
}
const bretonCore=G.union([[[-5.3,48.8],[-2.55,48.8],[-2.15,48.5],[-2.18,48.1],[-2.15,47.85],[-2.35,47.55],[-2.35,47.25],[-5.3,47.25]]]);
const breton851=G.union([[[-5.3,48.8],[-1.5,48.65],[-1.1,48.5],[-1.05,48],[-1.15,47.6],[-1.2,47.2],[-1.5,46.95],[-2.25,46.9],[-5.3,47.25]]]);
const betweenRivers=G.union([[[-1.2,48],[-.75,48.2],[-.25,48.15],[.05,47.85],[-.15,47.45],[-.6,47.3],[-1.2,47.2]]]);
const cotentin=G.union([[[-2.5,48.6],[-2.5,49.8],[-1.2,49.8],[-1.05,49.2],[-1.15,48.6],[-1.5,48.5]]]);
function breton(y){return y<851?bretonCore:y<863?breton851:y<867?G.merge([breton851,betweenRivers]):y<933?G.merge([breton851,betweenRivers,cotentin]):breton851;}
function legacy(es,{frame,by,cite}){
 for(const id of ['eastFrancia','holyRoman','carolingian','franks']){
  for(const y of id==='eastFrancia'?[907,928,955]:id==='holyRoman'?[976,983,1003,1004,1029,1031,1043,1157,1160,1181,1185,1227]:id==='carolingian'?[811]:[])frame(id,y,{});
  for(const f of by.get(id).keyframes){
   let p=I(G.union(f.polys),northLimit);
   if(id==='carolingian'||id==='franks')p=I(p,G.merge([eastCore,B(-25,35,8.3,55),B(7.5,35,14.3,46.7)]));
   if(id==='eastFrancia'){
    const italy=require('./frankish-partitions.cjs').geometry(by.get('carolingian').keyframes.filter(x=>x.year<=842).at(-1).polys).italy;
    p=G.merge([I(p,eastCore),...(f.year>=928?[I(p,marches)]:[]),...(f.year>=951?[italy]:[])]);
    p=D(p,alpineCut(f.year));
   }
   if(id==='holyRoman'){
    const east=by.get('eastFrancia').keyframes.filter(x=>x.year===925).at(-1).polys;
    const italy=require('./frankish-partitions.cjs').geometry(by.get('carolingian').keyframes.filter(x=>x.year<=842).at(-1).polys).italy;
    p=G.merge([east,italy,marches,...(f.year!==1003?[bohemia]:[]),...(f.year<1003||f.year>=1029?[moravia]:[]),...(f.year>=1032?[require('./europe-central-review.cjs').burgundy]:[]),...(f.year>=1160?[mecklenburg]:[]),...(f.year>=1181&&(f.year<1185||f.year>=1227)?[pomerania]:[])]);
    // Recover the eastern march from its pre-907 regional extent in stages.
    const earlyEast=by.get('eastFrancia').keyframes.find(x=>x.year===843).polys;
    p=G.merge([p,I(earlyEast,B(14,46.3,17.2,48.85))]);
    p=D(I(p,northLimit),alpineCut(f.year));
    if(f.year>=983&&f.year<1157)p=D(p,post983);
   }
   f.polys=p;
  }
  cite(id,'frankishNorth');if(id==='eastFrancia'||id==='holyRoman'){cite(id,'frankishElbe');cite(id,'imperialOuter');}
 }
 for(const id of ['westFrancia','franceMedieval']){
  for(const y of [851,863,867,907,913,933,936,938,987])if(y>=by.get(id).from&&y<=by.get(id).to)frame(id,y,{});
  for(const f of by.get(id).keyframes)f.polys=D(G.union(f.polys),breton(f.year));
  cite(id,'bretonKings');cite(id,'bretonVikings');
 }
}
function world(c){
 const H=require('./late-helpers.cjs')(c,{start:843,max:1532});
 const urls={frankishNorth:['https://graenseforeningen.dk/om-graenselandet/graenselandets-historie/tidstavle','https://geschichte-s-h.de/sh-von-a-bis-z/l/limes-saxoniae/'],frankishElbe:['https://www.bpb.de/themen/europaeische-geschichte/geschichte-im-fluss/160040/die-elbe-im-lauf-der-geschichte/','https://www.landesmuseum-brandenburg.de/das-museum/dauerausstellung/epochen/','https://medievalelbe.org/events-983'],bretonKings:['https://www.histoiredelabretagne.bzh/periodes/le-temps-des-rois'],bretonVikings:['https://www.bcd.bzh/becedia/fr/node/563','https://bcd.bzh/becedia/fr/node/299','https://vsnr.org/wp-content/uploads/2021/11/VSNR_Studies_The-Vikings-In-Brittany.pdf'],bretonDuchy:['https://www.histoiredelabretagne.bzh/periodes/le-temps-des-ducs','https://www.normandie.fr/lhistoire-passionnante-de-la-normandie']};
 for(const[k,v]of Object.entries(sources))H.source(k,v,urls[k]);
 const stages=[[843,851,T.princes,T.initial,'bretonKings','polity'],[851,863,T.kingdom,T.angers,'bretonKings','polity'],[863,867,T.kingdom,T.entrammes,'bretonKings','polity'],[867,907,T.kingdom,T.compiegne,'bretonKings','polity'],[907,913,T.princes,T.crisis,'bretonVikings','influence'],[913,933,T.viking,T.occupation,'bretonVikings','influence'],[933,936,T.viking,T.cotentin,'bretonDuchy','influence'],[936,938,T.princes,T.restoration,'bretonVikings','influence'],[938,1532,T.duchy,T.ducal,'bretonDuchy','polity']];
 H.entry('review-brittany','eurasia','state',[-2.76,47.66],T.brittany,stages.map(([f,t,n,text,s])=>H.phase(f,t,n,text,[s],{approx:false,name:n,frontierAdded:true})));
 for(const[f,t,n,text,s,kind]of stages){const a=H.area('review-brittany',f,t,breton(f),{color:'#809487',kind,name:n,title:n,text,sources:[s]});a.frontierAdded=true;a.label=[-2.7,48];c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(require('./coast-geometry.cjs')(a.polygons));}
 // Keep the duchy through the 1300 engine boundary. It is not annexed merely
 // because data move into the next chronological source module.
 for(const key of ['areas','outlines'])c[key]=c[key].flatMap(a=>{
  if(!['late-france','late-england'].includes(a.entry)||a.from>=1532)return[a];
  const dates=[a.from,...(a.from<1532&&a.to>1532?[1532]:[]),a.to];
  return dates.slice(0,-1).map((from,i)=>{
   if(from>=1532){const n={...a,id:a.id+'-breton-'+from,from,to:dates[i+1]};if(key==='areas')c.cartography.areas[n.id]=c.cartography.areas[a.id];return n;}
   const n=dates.length===2?a:{...a,id:a.id+'-breton-'+from,from,to:dates[i+1]};
   const p=D(key==='areas'?c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons:a.polygons,breton851);
   if(key==='areas'){c.cartography.areas[n.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);}n.polygons=p;n.points=p[0];return n;
  });
 });
 // The same Danish frontier applies in the later imperial engine. Do not
 // restore the old Jutland overreach when switching source modules in 1300.
 for(const key of ['areas','outlines'])for(const a of c[key])if(a.entry==='late-hre'&&a.from<1806){
  const original=key==='areas'?c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons:a.polygons;
  const p=I(original,northLimit);a.polygons=p;a.points=p[0];a.sources=[...new Set([...a.sources,'frankishNorth'])];
  if(key==='areas'){c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);}
 }
 // Source-only regional events use their own locations, not a fabricated polity.
 const events=[[851,T.angers,[-.55,47.47],T.angersTitle,'bretonKings'],[863,T.entrammes,[-.72,48],T.entrammesTitle,'bretonKings'],[867,T.compiegne,[2.83,49.42],T.compiegneTitle,'bretonKings'],[913,T.occupation,[-4.27,48.29],T.viking,'bretonVikings'],[933,T.cotentin,[-1.38,48.68],T.cotentinTitle,'bretonDuchy'],[936,T.restoration,[-1.75,48.55],T.returnTitle,'bretonVikings'],[1532,T.union,[-1.55,47.22],T.unionTitle,'bretonDuchy'],[929,T.advanceText,[12.56,52.41],T.advance,'frankishElbe'],[983,T.retreatText,[12.08,52.83],T.retreat,'frankishElbe'],[1157,T.brandenburgText,[12.56,52.41],T.brandenburg,'frankishElbe']];
 for(const[y,text,coord,title,source]of events){H.event('outer-frontier-'+y,y,'review-brittany','politics',coord,title,text,[source],{frontierAdded:true});if(y>=929&&!['bretonKings','bretonVikings','bretonDuchy'].includes(source)||y===1532)delete c.events.at(-1).entry;}
 c.outerFrontiers={version:1,events:events.map(e=>'outer-frontier-'+e[0]),years:[843,851,863,867,907,913,928,933,936,938,983,1157,1532]};return c;
}
module.exports={legacy,world,sources,messages:Object.values(T),breton,northLimit,eastCore,marches,post983,I,D};
