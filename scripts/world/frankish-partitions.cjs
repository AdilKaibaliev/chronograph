'use strict';
// Regional reconstruction of the Carolingian partitions. River corridors are
// generalised; they are not cadastral borders or modern national boundaries.
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1)));
const I=(a,b)=>a.length&&b.length?flat(clip.intersection(G.multi(a),G.multi(b))):[];
const D=(a,b)=>a.length&&b.length?flat(clip.difference(G.multi(a),G.multi(b))):a;
const box=(x,y,X,Y)=>G.union([[[x,y],[X,y],[X,Y],[x,Y]]]);
const sources={frankishPartitions:'Reinhold Kaiser. Frankenreich. Historisches Lexikon der Schweiz; Hans-Dietrich Kahl. Burgund (Zweites Königreich). Historisches Lexikon der Schweiz; Theodor Schieffer. Lothar II. Neue Deutsche Biographie; Middeleeuws Medemblik: een centrum in de periferie. West-Friese Archeologische Rapporten 61; Staatliche Museen zu Berlin. Münzkabinett: Verona, Otto I., object 18233352; Landschaftsverband Rheinland. Rheinische Geschichte: Zeittafeln 843, 855, 870, 880; Jens Schneider. La production d’un espace: débuts lotharingiens et pratiques de la frontière (IXe–XIe siècle).'};
const M={
 westBody:['Западно-Франкское королевство возникло при разделе державы Каролингов в 843 году. Его политическая история предшествует королевству Капетингов.','West Francia emerged from the partition of the Carolingian realm in 843. Its political history precedes the Capetian kingdom.','Батыш Франк королдугу 843-жылы Каролингдер державасы бөлүнгөндө түзүлгөн. Анын саясий тарыхы Капетингдер королдугунан мурун болгон.'],
 middle:['Срединное королевство','Middle Francia','Орто Франк королдугу'],
 lothar:['Лотарингия','Lotharingia','Лотарингия'],
 italy:['Итальянское королевство','Kingdom of Italy','Италия королдугу'],
 provence:['Королевство Прованс','Kingdom of Provence','Прованс королдугу'],
 upper:['Верхняя Бургундия','Upper Burgundy','Жогорку Бургундия'],
 lower:['Нижняя Бургундия','Lower Burgundy','Төмөнкү Бургундия'],
 verdun:['Верденский раздел','Partition of Verdun','Верден бөлүштүрүүсү'],
 prum:['Раздел Срединного королевства','Partition of Middle Francia','Орто Франк королдугунун бөлүнүшү'],
 meerssen:['Мерсенский договор','Treaty of Meerssen','Мерсен келишими'],
 ribemont:['Рибмонский договор','Treaty of Ribemont','Рибмон келишими'],
 west911:['Лотарингия признаёт западнофранкского короля','Lotharingia recognises the West Frankish king','Лотарингия Батыш Франк падышасын тааныйт'],
 east925:['Лотарингия переходит к Генриху I','Lotharingia passes to Henry I','Лотарингия Генрих Iге өтөт'],
 middleText:['В 843 году Лотарь I получает Срединное королевство: земли от Северного моря через Лотарингию и Бургундию до Италии. Западное королевство достаётся Карлу Лысому, восточное — Людовику Немецкому.','In 843 Lothar I receives Middle Francia, extending from the North Sea through Lotharingia and Burgundy to Italy. Charles the Bald receives the western kingdom and Louis the German the eastern kingdom.','843-жылы Лотарь I Түндүк деңизден Лотарингия жана Бургундия аркылуу Италияга чейин созулган Орто Франк королдугун алган. Батыш королдук Карл Тазга, чыгыш королдук Людовик Немецке берилген.'],
 prumText:['В 855 году владения Лотаря I разделены между сыновьями: Людовик II получает Италию, Лотарь II — северные земли, Карл — Прованс и бургундские земли вдоль Роны с Лионом.','In 855 Lothar I’s lands are divided among his sons: Louis II receives Italy, Lothar II the northern lands, and Charles Provence and the Burgundian Rhône lands including Lyon.','855-жылы Лотарь Iнин ээликтери уулдарына бөлүнгөн: Людовик II Италияны, Лотарь II түндүк жерлерди, Карл Провансты жана Лион менен Рона боюндагы Бургундия жерлерин алган.'],
 lotharText:['Королевство Лотаря II объединяет земли между Северным морем и Альпами. После смерти короля в 869 году его наследство оспаривают западные и восточные Каролинги.','Lothar II’s kingdom links the North Sea and the Alps. After his death in 869, the western and eastern Carolingians contest his inheritance.','Лотарь IIнин королдугу Түндүк деңиз менен Альптын ортосундагы жерлерди бириктирген. Ал 869-жылы өлгөндөн кийин батыш жана чыгыш Каролингдер анын мурасы үчүн талашкан.'],
 transjurane:['В 859 году Лотарь II уступает Людовику II права на Трансъюранские земли. Местную власть сохраняет Хукберт; его соперник Конрад побеждает его при Орбе в 864 году.','In 859 Lothar II cedes rights over Transjurania to Louis II. Hukbert retains local power until his rival Conrad defeats him at Orbe in 864.','859-жылы Лотарь II Трансъюра жерлерине болгон укуктарын Людовик IIге берген. Жергиликтүү бийлик Хукбертте калып, 864-жылы атаандашы Конрад аны Орбеде жеңген.'],
 provence863:['После смерти Карла Прованского в 863 году его братья делят наследство: Лион и Вьен получает Лотарь II, Прованс — Людовик II.','After Charles of Provence dies in 863, his brothers divide the inheritance: Lothar II receives Lyon and Vienne, and Louis II receives Provence.','863-жылы Карл Прованстык өлгөндөн кийин мурасы бир туугандарына бөлүнгөн: Лион менен Вьен Лотарь IIге, Прованс Людовик IIге өткөн.'],
 meerssenText:['В 870 году Карл Лысый и Людовик Немецкий делят наследство Лотаря II. Ахен, Мец и Эльзас переходят восточному королю; западная часть Лотарингии, Лион и Вьен — западному.','In 870 Charles the Bald and Louis the German divide Lothar II’s inheritance. Aachen, Metz and Alsace pass to the eastern king; western Lotharingia, Lyon and Vienne to the western king.','870-жылы Карл Таз менен Людовик Немец Лотарь IIнин мурасын бөлүшкөн. Ахен, Мец жана Эльзас чыгыш падышага; батыш Лотарингия, Лион жана Вьен батыш падышага өткөн.'],
 ribemontText:['В 880 году западная часть Лотарингии передана Людовику Младшему. Лотарингия объединена под властью восточнофранкского короля.','In 880 western Lotharingia is ceded to Louis the Younger. Lotharingia is united under the East Frankish king.','880-жылы Лотарингиянын батыш бөлүгү Людовик Кичүүгө берилген. Лотарингия Чыгыш Франк падышасынын бийлиги астында бириккен.'],
 west911Text:['В 911 году лотарингская знать признаёт Карла Простоватого. Лотарингия входит в западнофранкское королевство; Эльзас остаётся в восточном королевстве.','In 911 the Lotharingian aristocracy recognises Charles the Simple. Lotharingia joins West Francia; Alsace remains in the eastern kingdom.','911-жылы Лотарингиянын ак сөөктөрү Карл Жөнөкөйдү тааныган. Лотарингия Батыш Франк королдугуна кошулган; Эльзас чыгыш королдукта калган.'],
 east925Text:['В 925 году Генрих I закрепляет власть в Лотарингии. Она вновь входит в восточнофранкское королевство.','In 925 Henry I establishes his authority in Lotharingia. It returns to the East Frankish kingdom.','925-жылы Генрих I Лотарингияда бийлигин бекемдеген. Ал кайра Чыгыш Франк королдугуна кирген.'],
 italyText:['Королевство охватывает северную и часть центральной Италии. Его корона становится предметом соперничества Каролингов и местных династий. Рим и папские владения имеют отдельный политический статус.','The kingdom covers northern and part of central Italy. Carolingian and local dynasties compete for its crown. Rome and the papal lands have a distinct political status.','Королдук түндүк жана борбордук Италиянын бир бөлүгүн камтыган. Анын таажысы үчүн Каролингдер жана жергиликтүү династиялар күрөшкөн. Рим менен папалык ээликтер өзүнчө саясий макамда болгон.'],
 upperText:['В 888 году Рудольф I избран королём в Сен-Морисе. Верхняя Бургундия объединяет западные альпийские земли, графство Бургундия и Савойю.','In 888 Rudolf I is elected king at Saint-Maurice. Upper Burgundy brings together the western Alpine lands, the County of Burgundy and Savoy.','888-жылы Рудольф I Сен-Мористе падыша болуп шайланган. Жогорку Бургундия батыш Альп жерлерин, Бургундия графтыгын жана Савойяны бириктирген.'],
 lowerText:['В 879 году Бозон избран королём в Мантайе. Его королевство складывается в Провансе и долине Роны; власть оспаривают Каролинги.','In 879 Boso is elected king at Mantaille. His kingdom forms in Provence and the Rhône valley; the Carolingians contest his rule.','879-жылы Бозон Мантайеде падыша болуп шайланган. Анын королдугу Прованста жана Рона өрөөнүндө түзүлгөн; Каролингдер анын бийлигине каршы чыккан.'],
 italy951:['Оттон I — король Италии','Otto I becomes king of Italy','Оттон I Италиянын падышасы болот'],
 italy951Text:['В 951 году Оттон I принимает титул короля Италии. В 962 году он коронован императором в Риме; германские и итальянские владения связаны императорской властью.','In 951 Otto I assumes the title of king of Italy. In 962 he is crowned emperor in Rome, linking German and Italian domains under imperial authority.','951-жылы Оттон I Италиянын падышасы наамын алган. 962-жылы Римде император болуп таажы кийип, герман жана италиялык ээликтер императордук бийлик аркылуу бириккен.'],
 westText:['Западное королевство Карла Лысого после раздела 843 года. Лотарингия, Прованс и Италия относятся к Срединному королевству.','Charles the Bald’s western kingdom after the partition of 843. Lotharingia, Provence and Italy belong to Middle Francia.','843-жылдагы бөлүштүрүүдөн кийинки Карл Таздын батыш королдугу. Лотарингия, Прованс жана Италия Орто Франк королдугуна кирген.'],
 eastText:['Восточное королевство Людовика Немецкого: Саксония, Франкония, Алеманния, Бавария и Хурская Реция. Майнц, Вормс и Шпайер остаются за восточным королём.','Louis the German’s eastern kingdom: Saxony, Franconia, Alemannia, Bavaria and Churrätien. Mainz, Worms and Speyer remain with the eastern king.','Людовик Немецтин чыгыш королдугу: Саксония, Франкония, Алеманния, Бавария жана Хур Рециясы. Майнц, Вормс жана Шпайер чыгыш падышасында калган.']
};
const messages=Object.values(M);
// Reuse the previously reviewed Scheldt–Meuse–Saône–Rhône frontier.
const E=require('./europe-central-review.cjs'),west=E.west,burgundy=E.burgundy;
const mainland=G.union([[[-20,35],[20,35],[20,54],[3.6,52],[2.5,51.1],[1.5,50.9],[0,50],[-1.8,50],[-5.2,49],[-20,49]]]);
const rhineAare=[[7.1,54],[7.1,51.7],[7.05,51],[7.4,50.3],[7.65,50.1],[7.55,49.2],[8.25,49],[7.85,48.7],[7.75,48],[7.7,47.6],[8.22,47.58],[8.05,47.35],[7.6,47],[7.5,46.7],[8.3,46.5]];
const leftRhine=G.union([[[-20,54],...rhineAare,[8.3,43],[-20,43]]]);
const italianMask=G.union([[[7.5,43.3],[7.6,44.6],[7.15,45.2],[7.7,45.9],[8.3,46.5],[9.2,46.6],[10.5,46.75],[12.3,46.8],[13.7,46.6],[14,45.8],[16,40],[7.5,40]]]);
function geometry(carolingian){
 const italy=D(I(G.union(carolingian),italianMask),burgundy);
 const north=D(D(D(I(leftRhine,G.union([[[3.1,50],[3.6,54],[7.1,54],[9,48],[9,46],[4.8,46]]])),west),burgundy),italy);
 const middle=G.merge([north,burgundy,italy]);
 const upper=I(burgundy,G.union([[[5.3,46.65],[5.5,46],[5.6,45.6],[6.8,45.55],[7.7,45.9],[10,46],[10,50],[4,50],[4,46.65]]]));
 const provence=D(burgundy,upper);
 const transjurane=I(upper,G.union([[[5.8,46.6],[6.5,47.1],[7.5,47.3],[8.3,47.3],[8.3,45.6],[5.8,45.6]]]));
 const lyon=I(provence,box(4,45.35,5.65,46.7));
 // Meuse–Ourthe–Moselle corridor. Metz and Aachen lie on the eastern side.
 // The lower-Rhine delta is a frontier zone; Utrecht is not treated as an
 // unambiguous settlement control for 870 (royal, episcopal and Viking power).
 const westernShare=I(north,G.union([[[-10,54],[4.9,54],[4.9,52.3],[5.12,52.09],[5.6,51.2],[5.7,50.8],[5.5,50.1],[5.85,49.45],[6,48.8],[5.8,48.4],[5.7,47.5],[-10,47.5]]]));
 const alsace=I(north,G.union([[[6.85,49.25],[8.5,49.25],[8.5,47.5],[6.85,47.5]]]));
 return {north,upper,provence,transjurane,lyon,westernShare,alsace,italy,middle};
}
function legacy(es,{frame,at,by,cite}){
 const g=geometry(at('carolingian',842).polys),W=I(I(G.union(at('westFrancia',843).polys),west),mainland);
 const eastBase=D(G.union(at('eastFrancia',843).polys),G.merge([west,g.middle]));
 const dates=[843,855,859,863,870,875,879,880,888,911,925];
 for(const y of dates){
  let w=W,e=eastBase,description=y<855?M.westText:y<870?M.prumText:y===879?M.lowerText:y<880?M.meerssenText:y<911?M.ribemontText:y<925?M.west911Text:M.east925Text;
  if(y>=870&&y<880)w=G.merge([w,g.westernShare]);
  if(y>=870&&y<879)w=G.merge([w,g.lyon,...(y>=875?[g.provence]:[])]);
  if(y>=870)e=G.merge([e,D(g.north,y<880?g.westernShare:[]),...(y<888?[g.upper]:[])]);
  if(y>=911&&y<925){const l=D(g.north,g.alsace);w=G.merge([w,l]);e=D(e,l);}
  frame('westFrancia',y,{polys:w,territories:description[0]});
  frame('eastFrancia',y,{polys:e,territories:(y<870?M.eastText:description)[0]});
 }
 // Preserve the established later eastern extent; Italy joins Otto's crown
 // in 951, not at an undated point after the imperial coronation in 962.
 for(const f of by.get('eastFrancia').keyframes)if(f.year>=933&&f.year<951)f.polys=D(G.union(f.polys),g.italy);
 frame('eastFrancia',951,{polys:G.merge([G.union(at('eastFrancia',950).polys),g.italy]),territories:M.italy951Text[0]});
 by.get('westFrancia').body=M.westBody[0];
 for(const id of ['westFrancia','eastFrancia','carolingian'])cite(id,'frankishPartitions');
}
function world(c){
 const es=require('./legacy-frontiers.cjs').prepare(require('./continuity.cjs').legacyData());
 const g=geometry(es.find(e=>e.id==='carolingian').keyframes.filter(f=>f.year<=842).at(-1).polys);
 const H=require('./late-helpers.cjs')(c,{start:843,max:962}),key='frankishPartitions';
 H.source(key,sources[key],['https://archisarchief.cultureelerfgoed.nl/bibliotheek/Middeleeuws%20Medemblik%20een%20centrum%20in%20de%20periferie%20WAR_61.pdf','https://ikmk.smb.museum/object?id=18233352&lang=en&view=rs','https://hls-dhs-dss.ch/de/articles/008249/2011-05-12/','https://hls-dhs-dss.ch/de/articles/006620/2005-04-20/','https://www.deutsche-biographie.de/gnd118826816.html','https://www.rheinische-geschichte.lvr.de/chronicle/843','https://www.rheinische-geschichte.lvr.de/chronicle/855','https://www.rheinische-geschichte.lvr.de/chronicle/870','https://www.rheinische-geschichte.lvr.de/chronicle/880','https://rgh.univ-lorraine.fr/articles/view/43/La_production_d_un_espace_debuts_lotharingiens_et_pratiques_de_la_frontiere_IXe_XIe_siecle']);
 const records=[
  ['middle-francia',M.middle,[6.18,49.12],'#8d7957',[[843,855,g.middle,M.middleText]]],
  ['lotharingia',M.lothar,[6.08,50.78],'#8d7957',[[855,859,G.merge([g.north,g.upper]),M.lotharText],[859,863,D(G.merge([g.north,g.upper]),g.transjurane),M.transjurane],[863,870,G.merge([g.north,D(g.upper,g.transjurane),g.lyon]),M.provence863]]],
  ['provence',M.provence,[4.63,43.68],'#9c8c72',[[855,863,g.provence,M.prumText]]],
  ['italy',M.italy,[9.16,45.18],'#8b786c',[[855,859,g.italy,M.italyText],[859,863,G.merge([g.italy,g.transjurane]),M.transjurane],[863,870,G.merge([g.italy,g.transjurane,D(g.provence,g.lyon)]),M.provence863],[870,875,G.merge([g.italy,D(g.provence,g.lyon)]),M.italyText],[875,951,g.italy,M.italyText],[951,962,g.italy,M.italy951Text]]],
  ['upper-burgundy',M.upper,[6.14,46.2],'#9a8d73',[[888,933,g.upper,M.upperText]]],
  ['lower-burgundy',M.lower,[4.87,45.52],'#a18b6c',[[879,933,g.provence,M.lowerText]]]
 ];
 for(const[id,name,coord,color,stages]of records){
  const eid='review-'+id;H.entry(eid,'eurasia','state',coord,name,stages.map(([from,to,p,text])=>H.phase(from,to,name,text,[key],{approx:false})));
  for(const[from,to,p]of stages){const a=H.area(eid,from,to,p,{color});a.frontierAdded=true;a.label=coord;
   if(id==='italy'&&from===951)Object.assign(a,{overlord:'eastFrancia',sovereignName:['Восточно-Франкское королевство','East Francia','Чыгыш Франк королдугу'],relationship:'union',dependencyOutline:true,legacyOverlord:true,color:'#7d7166'});
   c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(require('./coast-geometry.cjs')(p));
  }
 }
 const events=[
  [843,'middle-francia',[5.38,49.16],M.verdun,M.middleText],
  [855,'lotharingia',[6.42,50.21],M.prum,M.prumText],
  [859,'italy',[6.53,46.53],M.italy,M.transjurane],
  [863,'lotharingia',[4.84,45.76],M.provence,M.provence863],
  [870,'italy',[5.75,50.89],M.meerssen,M.meerssenText],
  [879,'lower-burgundy',[4.9,45.25],M.lower,M.lowerText],
  [880,'italy',[3.46,49.8],M.ribemont,M.ribemontText],
  [888,'upper-burgundy',[7,46.22],M.upper,M.upperText],
  [911,'italy',[6.08,50.78],M.west911,M.west911Text],
  [925,'italy',[6.08,50.78],M.east925,M.east925Text],
  [951,'italy',[9.16,45.18],M.italy951,M.italy951Text]
 ];
 // Political events have their own locations; entry ownership only supplies
 // catalogue navigation, never the position of the map marker.
 for(const[y,id,coord,title,text]of events){
  H.event('frankish-partition-'+y,y,'review-'+id,'politics',coord,title,text,[key]);
  if([870,880,911,925].includes(y))delete c.events.at(-1).entry;
 }
 c.frankishPartitions={version:1,years:events.map(e=>e[0]),scope:'Middle Francia and successor kingdoms; generalised river and Alpine corridors. Outer Saxon/Slavic and Breton frontiers, individual counties and temporary royal campaigns are outside this review.'};
 return c;
}
module.exports={legacy,world,sources,messages,geometry};
