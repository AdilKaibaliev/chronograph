'use strict';
// Regional reconstructions checked against named settlements and dated changes.
// Shared paths are cartographic approximations, never surveyed ancient borders.
const G=require('./cartography-geometry.cjs');
const sources={
 sasanianEast:'Mark Luce. Khorasan III: Historical Geography in the Late Sasanid–Early Islamic Periods. Encyclopaedia Iranica.',
 buyidStages:'Tilman Nagel. Buyids; C. E. Bosworth. Kerman V; Al-e Mohtaj; Kakuyids. Encyclopaedia Iranica.',
 samanidFrontier:'C. E. Bosworth. Khorasan VI; Esmail b. Ahmad b. Asad Samani; Qarakhanid. Encyclopaedia Iranica; Yuri Bregel. An Historical Atlas of Central Asia.',
 xiaFrontier:'Between the Great Walls: Northern Song Imaginations of the Northwest. Journal of Chinese History; Herbert Franke and Denis Twitchett (eds.). The Cambridge History of China, Volume 6.',
 westernSuccession:'The Metropolitan Museum of Art. Ottonian Art; Bibliotheque nationale de France. Le regne des Carolingiens; Hugues Capet.'
};
const messages=[
 ['Фарс; центр власти — Шираз.','Fars; the seat of power is Shiraz.','Фарс; бийликтин борбору — Шираз.'],
 ['Фарс, Исфахан и владения в Джибале.','Fars, Isfahan and domains in Jibal.','Фарс, Исфахан жана Жибалдагы ээликтер.'],
 ['Фарс, Джибаль и Хузестан.','Fars, Jibal and Khuzestan.','Фарс, Жибал жана Хузестан.'],
 ['Владения Буидов в Иране; Рей с 943 года, с перерывом в 945–946 годах.','Buyid domains in Iran; Ray from 943, with an interruption in 945–946.','Ирандагы Буйид ээликтери; Рей 943-жылдан, 945–946-жылдардагы тыныгуу менен.'],
 ['Багдад и владения Буидов в западном и южном Иране.','Baghdad and Buyid domains in western and southern Iran.','Багдад жана Ирандын батышы менен түштүгүндөгү Буйид ээликтери.'],
 ['Ирак, Рей, Джибаль и Фарс; Басра с 947 года.','Iraq, Ray, Jibal and Fars; Basra from 947.','Ирак, Рей, Жибал жана Фарс; Басра 947-жылдан.'],
 ['Ирак, западный и южный Иран; Керман с 968 года.','Iraq, western and southern Iran; Kerman from 968.','Ирак, батыш жана түштүк Иран; Керман 968-жылдан.'],
 ['В 934 году Али ибн Буя закрепился в Ширазе. Владения династии расширялись поэтапно: Багдад — в 945 году, Басра — в 947-м, Керман — в 968-м.','In 934 Ali ibn Buya established himself in Shiraz. The dynasty expanded in stages: Baghdad in 945, Basra in 947 and Kerman in 968.','934-жылы Али ибн Буя Ширазда бийлигин бекемдеген. Династиянын ээликтери этап менен кеңейген: Багдад 945-жылы, Басра 947-жылы, Керман 968-жылы.'],
 ['Мавераннахр; Тараз присоединён в 893 году.','Transoxiana; Taraz was taken in 893.','Мавераннахр; Тараз 893-жылы алынган.'],
 ['Мавераннахр и Хорасан; Тараз — северо-восточный пограничный центр.','Transoxiana and Khorasan; Taraz is a northeastern frontier centre.','Мавераннахр жана Хорасан; Тараз — түндүк-чыгыштагы чек ара борбору.'],
 ['Нинся, коридор Хэси и северная часть Шэньси.','Ningxia, the Hexi Corridor and northern Shaanxi.','Нинся, Хэси коридору жана Шэньсинин түндүгү.'],
 ['Мавераннахр.','Transoxiana.','Мавераннахр.']
];
function apply(es,{frame,at,by,cite,I,D,B}){
 // The records start in 962/987 but previously had no drawable frame until
 // 1000. Restore the existing regional outline at each documented accession;
 // this repairs a data gap, not an assertion of a surveyed 962 frontier.
 for(const id of ['holyRoman','franceMedieval']){const e=by.get(id);frame(id,e.from,structuredClone(e.keyframes[0]));cite(id,'westernSuccession');}
 // The former northeastern Persian line reached Khwarazm and overlapped the
 // Western Turks throughout 610–650. Anchor the shared side to the Khorasani
 // piedmont and Murghab frontier: Merv/Herat remain west, Balkh east.
 const khorasanSide=G.union([[[-180,-80],[180,-80],[180,24],[68,24],[64,29],[63.5,32],[62.8,34.5],[63.4,35.1],[63.5,36],[62.5,37],[61.8,38.5],[59.5,38.6],[57,38.8],[55,39.4],[53,41.2],[49,43.3],[-180,43.3]]]);
 for(const f of by.get('sasanian').keyframes)f.polys=I(G.union(f.polys),khorasanSide);
 for(const f of by.get('westernTurkic').keyframes)if(f.year<657)f.polys=D(G.union(f.polys),khorasanSide);
 cite('sasanian','sasanianEast');cite('westernTurkic','sasanianEast');

 // Separate the Samanid settled frontier from Karluk/Semirechye sketches.
 // The Taraz advance is dated; the old 875 shape already reached beyond it.
 const settled=G.union([[[-180,-80],[180,-80],[180,35],[76,35],[74,39],[72.5,40.7],[71,41.8],[69.8,42.4],[69,42.6],[67,43.1],[64,43.7],[60,43.7],[-180,43.7]]]);
 const taraz=G.union([[[68.7,42.1],[70,41.8],[71.5,42.2],[72.1,42.9],[71.9,43.35],[70.8,43.5],[69.6,43.05]]]);
 const northeast=G.merge([settled,taraz]);
 for(const f of by.get('samanid').keyframes)if(f.year<999)f.polys=I(G.union(f.polys),f.year<893?settled:northeast);
 const northOfOxus=G.union([[[-180,80],[-180,41.5],[60,41.5],[61.4,41.4],[62.2,40.5],[63.6,39.1],[64.5,38.4],[65.4,37.7],[66.8,37.35],[67.4,37.05],[68.3,37.1],[69.2,37.2],[70,37.4],[71.2,37.1],[74,35],[180,35],[180,80]]]);
 for(const f of by.get('samanid').keyframes)if(f.year<900){f.polys=I(f.polys,northOfOxus);f.territories=messages[11][0];}
 frame('samanid',893,{polys:G.merge([at('samanid',875).polys,taraz]),territories:messages[8][0]});
 frame('samanid',900,{polys:G.merge([at('samanid',900).polys,taraz]),territories:messages[9][0]});
 for(const f of by.get('karluk').keyframes)f.polys=D(G.union(f.polys),f.year<893?settled:northeast);
 frame('karluk',893,{polys:D(G.union(at('karluk',840).polys),northeast)});
 for(const f of by.get('qarakhanid').keyframes)if(f.year<999)f.polys=D(G.union(f.polys),northeast);
 // The partition of Transoxiana dates to 999, not a delayed 1000 frame.
 frame('qarakhanid',999,{...structuredClone(at('qarakhanid',1000)),year:999});
 for(const id of ['samanid','karluk','qarakhanid'])cite(id,'samanidFrontier');

 // Buyid regional acquisitions. The old 934 and 980 sketches crossed into
 // Nishapur/Merv while omitting Baghdad. These regions retain one unioned
 // outline; additions follow recorded transfers, not linear interpolation.
 const fars=G.union([[[49.6,30.4],[50.2,28.1],[53.2,26.4],[56,26.7],[56.1,28.6],[54.8,31.3],[52.5,32.1],[50.8,31.6]]]);
 const jibal=G.union([[[46.5,34],[48,33],[50.8,31.6],[52.5,32.1],[54,33.1],[53.6,34.8],[51.9,35.2],[49.2,35.6],[47.1,35.3]]]);
 const khuzestan=G.union([[[46.5,34],[48,33],[50.8,31.6],[49.6,30.4],[48.5,29.9],[47.4,30.3],[46.5,32]]]);
 const ray=G.union([[[49.2,35.6],[50.1,36.3],[52,36.5],[54.5,36.2],[55.2,35.6],[55,34.7],[53.6,34.8],[51.9,35.2]]]);
 const baghdad=G.union([[[42,34.8],[44.2,35.2],[46.5,34],[46.5,32],[47.4,30.3],[45.5,30.8],[43.8,32.2]]]);
 const basra=G.union([[[45.5,30.8],[47.4,30.3],[48.5,29.9],[48.9,30.5],[48.2,31.3],[46.3,31.8]]]);
 const kerman=G.union([[[54.8,31.3],[56.1,28.6],[56,26.7],[58.2,25.8],[59.4,26.4],[59.4,29],[58.8,31.3],[57.1,32.4],[55.3,32.1]]]);
 const parts={fars,jibal,khuzestan:D(khuzestan,basra),ray,baghdad,basra,kerman};
 const join=names=>G.merge(names.map(k=>parts[k]));
 const stages=[
  [934,['fars'],0],[935,['fars','jibal'],1],[936,['fars','jibal','khuzestan'],2],
  [943,['fars','jibal','khuzestan','ray'],3],
  [945,['fars','jibal','khuzestan','baghdad'],4],
  [947,['fars','jibal','khuzestan','ray','baghdad','basra'],5],
  [968,Object.keys(parts),6],[980,Object.keys(parts),6]
 ];
 by.get('buyids').body=messages[7][0];
 for(const[y,n,m]of stages)frame('buyids',y,{polys:join(n),territories:messages[m][0],label:y<935?[52.6,29.7]:y<945?[51,32.4]:[49,32.6]});
 // The Samanid interventions at Ray are deliberately separate from their
 // enduring Khurasani domain; returning to the base must not retain the city.
 const samBase=structuredClone(at('samanid',900));
 for(const[y,hold]of [[940,true],[943,false],[945,true],[947,false]])frame('samanid',y,{...samBase,polys:hold?G.merge([samBase.polys,ray]):samBase.polys});
 // Ghaznavid Khorasan starts in 999. Ray is acquired only in 1029; Kerman
 // remains outside that realm except the documented temporary 1033–1036 rule.
 const ghaz999=G.merge([G.union(at('ghaznavid',999).polys),G.union([[[55.6,36],[57.5,33.8],[61.5,33.5],[65,35.2],[66,37.5],[62,39],[58,38.8]]])]);
 frame('ghaznavid',999,{polys:ghaz999});
 frame('ghaznavid',1029,{polys:G.merge([ghaz999,ray])});
 frame('ghaznavid',1030,{polys:G.merge([G.union(at('ghaznavid',1030).polys),ray])});
 const ghaz1030=structuredClone(at('ghaznavid',1030).polys);
 frame('ghaznavid',1033,{polys:G.merge([ghaz1030,kerman])});
 frame('ghaznavid',1036,{polys:ghaz1030});
 for(const f of by.get('ghaznavid').keyframes)if(f.year>=999){
  const retained=['fars','jibal','khuzestan','baghdad','basra',...(f.year<1029?['ray']:[]),...(f.year>=1033&&f.year<1036?[]:['kerman'])];
  f.polys=D(G.union(f.polys),join(retained));
 }
 frame('greatSeljuk',1042,{polys:G.merge([G.union(at('greatSeljuk',1040).polys),ray])});
 // Preserve the later eastern campaigns; add Kerman only from its conquest.
 for(const y of [1048,1055,1071,1092])frame('greatSeljuk',y,{polys:G.merge([G.union(at('greatSeljuk',y).polys),kerman])});
 frame('greatSeljuk',1062,{polys:G.merge([G.union(at('greatSeljuk',1055).polys),fars])});
 for(const id of ['buyids','samanid','ghaznavid','greatSeljuk'])cite(id,'buyidStages');

 // Tangut Xia: Hexi/Ningxia/northern Shaanxi. The former six-point polygon
 // covered Song territory in southern Gansu and a large part of Jin/Liao.
 // Preserve the river-bend and desert belt without claiming the whole Gansu
 // province or mapping Song's paper claims as effective occupation.
 const xia=G.union([[[93.8,40.4],[94.6,39.2],[97.5,38.8],[100.5,38.4],[102.1,37.3],[103.5,36.6],[105.2,36.6],[106.2,36.1],[107.2,36.7],[108.6,37.2],[110.1,37.7],[110.5,39],[110.6,40],[109,41.2],[106,41.9],[103,42.1],[99,42],[96,41.5]]]);
 for(const f of by.get('westernXia').keyframes)f.polys=xia;
 by.get('westernXia').territories=messages[10][0];
 for(const id of ['westernXia','northernSong','liao','jinChina'])cite(id,'xiaFrontier');
 return es;
}
// Date-specific ownership only. No generic 'larger shape wins' rule.
const rules=[
 ['samanid','buyids',934,999,'buyidStages'],
 ['abbasid','buyids',934,945,'buyidStages'],
 ['northernSong','westernXia',1038,1127,'xiaFrontier'],
 ['liao','westernXia',1038,1125,'xiaFrontier'],
 ['jinChina','westernXia',1125,1227,'xiaFrontier']
];
module.exports={apply,sources,messages,rules};
