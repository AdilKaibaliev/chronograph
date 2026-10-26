'use strict';
// Regional frontiers anchored to dated acquisitions. These are not surveyed
// boundaries, and a campaign is not treated as annexation of the whole peninsula.
const G=require('./cartography-geometry.cjs');
const sources={
 anatolianAuthority:'A. C. S. Peacock. Saljuqs III: Saljuqs of Rum; David Durand-Guedy. Maleksah. Encyclopaedia Iranica; Carole Hillenbrand. Turkish Myth and Muslim Symbol: The Battle of Manzikert.',
 nicaeanFrontier:'Foundation of the Hellenic World. The Latin Empire of Constantinople (1204–1261); Politics in the Late Byzantine Period: Expansion of the Borders; Ahmet Gunes. Iznik. TDV Islam Ansiklopedisi.'
};
const messages=[
 ['Иран, Ирак и восточные владения; анатолийские государства развиваются отдельно от Великого Сельджукского султаната.','Iran, Iraq and eastern domains; Anatolian states develop separately from the Great Seljuk sultanate.','Иран, Ирак жана чыгыш ээликтери; Анадолудагы мамлекеттер Улуу Селжук султанатынан өзүнчө өнүккөн.'],
 ['Победа при Манцикерте в 1071 году открыла путь тюркскому расселению и появлению новых государств в Анатолии. Она не означала немедленного присоединения всего полуострова к Великому Сельджукскому султанату.','The victory at Manzikert in 1071 opened the way to Turkish settlement and new states in Anatolia. It did not immediately annex the entire peninsula to the Great Seljuk sultanate.','1071-жылы Манцикерттеги жеңиш түрктөрдүн Анадолуга отурукташуусуна жана жаңы мамлекеттердин түзүлүшүнө жол ачкан. Бул бүт жарым арал дароо Улуу Селжук султанатына кошулганын билдирбейт.'],
 ['Константинополь и Фракия; борьба за северо-западную Анатолию.','Constantinople and Thrace; campaigns in northwestern Anatolia.','Константинополь жана Фракия; түндүк-батыш Анадолу үчүн күрөш.'],
 ['Нимфейский договор 1214 года закрепляет латинские владения на северо-западе Анатолии до Адрамиттия.','The Treaty of Nymphaeum in 1214 confirms Latin possessions in northwestern Anatolia as far as Adramyttion.','1214-жылкы Нимфей келишими латындардын түндүк-батыш Анадолудагы Адрамиттийге чейинки ээликтерин бекиткен.'],
 ['После поражения 1224 года и перемирия 1225 года азиатские владения латинян сокращаются до окрестностей Никомедии и берега напротив Константинополя.','Following defeat in 1224 and the truce of 1225, Latin holdings in Asia shrink to the vicinity of Nicomedia and the shore opposite Constantinople.','1224-жылкы жеңилүүдөн жана 1225-жылкы элдешүүдөн кийин латындардын Азиядагы ээликтери Никомедиянын айланасына жана Константинополдун каршы жээгине чейин кыскарган.'],
 ['С 1235 года Латинская империя не владеет крепостями в Малой Азии. Константинополь остаётся под её властью до 1261 года.','From 1235 the Latin Empire holds no fortresses in Asia Minor. Constantinople remains under its rule until 1261.','1235-жылдан тартып Латын империясынын Кичи Азияда чептери калган эмес. Константинополь 1261-жылга чейин анын бийлигинде болгон.'],
 ['Никея и западная Анатолия; граница с латинскими владениями меняется после договоров 1214 и 1225 годов и завоеваний 1235 года.','Nicaea and western Anatolia; the frontier with Latin holdings changes after the treaties of 1214 and 1225 and the conquests of 1235.','Никея жана батыш Анадолу; латын ээликтери менен чек ара 1214 жана 1225-жылкы келишимдерден, 1235-жылкы басып алуулардан кийин өзгөргөн.'],
 ['Румские сельджуки после 1097 года не возвращают Никею. В конце XIII века султанат находится под властью монголов, а в Анатолии усиливаются самостоятельные бейлики.','The Seljuks of Rum do not recover Nicaea after 1097. In the late thirteenth century the sultanate is under Mongol authority while independent beyliks gain strength in Anatolia.','Рум селжуктары 1097-жылдан кийин Никеяны кайра алган эмес. XIII кылымдын аягында султанат монголдорго баш ийип, Анадолуда өз алдынча бейликтер күч алган.']
];
function apply(es,{frame,at,by,cite,D}){
 // Remove the inherited triangle reaching Ankara and the Black Sea coast.
 // Keep eastern Anatolian acquisitions and the Iranian/Mesopotamian core.
 // The western line is a regional reconstruction, not a modern national edge.
 const westernAnatolia=G.union([[[-180,37.5],[39,37.5],[40.4,38.4],[42.3,39.5],[43.5,40],[43.4,41.2],[41.5,41.7],[41.5,85],[-180,85]]]);
 const great=by.get('greatSeljuk');
 for(const f of great.keyframes)if(f.year>=1071&&f.year<1194){f.polys=D(G.union(f.polys),westernAnatolia);f.territories=messages[0][0];}
 great.body=messages[1][0];
 // The old final endpoint in 1299 reintroduced Nicaea and the Marmara coast.
 // Preserve the latest reviewed geometry instead of reviving a lost domain.
 const rum=by.get('rumSeljuk');
 frame('rumSeljuk',1299,{...structuredClone(at('rumSeljuk',1256)),body:messages[7][0]});
 rum.body=messages[7][0];
 // Both successor states share the same coast and a dated Asian boundary.
 // No part of European Thrace is assigned to Nicaea in the 1204 frame.
 const strait=[[29.13,41.24],[29.1,41.2],[29.07,41.12],[29.03,41.07],[29.01,41.025],[29,40.98]];
 const asia=G.union([[[25.8,38],[27,36.7],[28.3,36.9],[29.4,37.5],[30.5,38],[30.5,39.5],[32,40],[31.6,41.25],[30.3,41.3],[29.2,41.25],...strait,[28.9,40.55],[26,40],[25.8,39]]]);
 const initialLatin=G.union([[[26,40],[28.3,40.1],[28.8,40.35],[29.2,40.5],[29.6,40.65],[30.2,40.6],[30.3,41.3],[29.2,41.25],...strait,[28.9,40.55]]]);
 const treatyLatin=G.merge([initialLatin,G.union([[[25.8,39.4],[26.8,39.35],[27.2,39.5],[27.9,39.8],[28.3,40.1],[26,40]]])]);
 const nicomedia=G.union([[[29,40.98],[29.2,40.75],[29.6,40.65],[30.2,40.6],[30.3,41.3],[29.2,41.25],...strait]]);
 const thrace=G.union([[[25.9,40.5],[26.2,41],[26.5,41.7],[27.4,42.1],[28.1,42.1],...strait,[27.3,40.55]]]);
 const capital=G.union([[[27.7,41.05],[27.7,41.7],[28.3,41.9],...strait,[28.6,40.95]]]);
 for(const y of [1204,1214,1225,1230,1235,1261]){
  const latinAsia=y<1214?initialLatin:y<1225?treatyLatin:y<1235?nicomedia:[];
  frame('latinEmpire',y,{polys:G.merge([y<1225?thrace:capital,latinAsia]),territories:messages[y<1214?2:y<1225?3:y<1235?4:5][0],label:[28.3,41.4]});
  frame('nicaea',y,{polys:D(asia,latinAsia),territories:messages[6][0],label:[28.8,39.5]});
 }
 for(const id of ['greatSeljuk','medievalByzantine','rumSeljuk'])cite(id,'anatolianAuthority');
 for(const id of ['nicaea','latinEmpire','rumSeljuk'])cite(id,'nicaeanFrontier');
}
const rules=[
 ['medievalByzantine','greatSeljuk',1071,1194,'anatolianAuthority'],
 ['nicaea','latinEmpire',1204,1261,'nicaeanFrontier']
];
module.exports={apply,sources,messages,rules};
