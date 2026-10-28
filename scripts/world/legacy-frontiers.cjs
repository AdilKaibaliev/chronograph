'use strict';
// Explicit dated corrections to the early atlas. Never resolve an unknown
// ownership dispute by draw order or by giving the larger polygon priority.
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const regionalReview=require('./early-boundary-review.cjs');
const mediterraneanReview=require('./mediterranean-review.cjs');
const anatolianReview=require('./anatolian-review.cjs');
const europeCentralReview=require('./europe-central-review.cjs');
const arabiaKhitaiReview=require('./arabia-khitai-review.cjs');
const altaiJochiReview=require('./altai-jochi-review.cjs');
const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))).filter(r=>Math.abs(G.signed(r))>1e-8);
const I=(a,b)=>a.length&&b.length?flat(clip.intersection(G.multi(a),G.multi(b))):[];
const D=(a,b)=>a.length&&b.length?flat(clip.difference(G.multi(a),G.multi(b))):a;
const B=(x0,y0,x1,y1)=>G.union([[[x0,y0],[x1,y0],[x1,y1],[x0,y1]]]);
const sources={
 conquest:'Michael G. Morony. Arab Conquest of Iran. Encyclopaedia Iranica; Hugh Kennedy. The Great Arab Conquests.',
 china:'Denis Twitchett and Paul Jakov Smith (eds.). The Cambridge History of China, Volume 5, Part 1: The Sung Dynasty and Its Precursors, 907–1279; Herbert Franke and Denis Twitchett (eds.). Volume 6: Alien Regimes and Border States, 907–1368.',
 ghaznavid:'C. E. Bosworth. The Ghaznavids: Their Empire in Afghanistan and Eastern Iran, 994–1040; Ghaznavids. Encyclopaedia Iranica.',
 seljuk:'A. C. S. Peacock. The Great Seljuk Empire; C. E. Bosworth. The Political and Dynastic History of the Iranian World (A.D. 1000–1217). The Cambridge History of Iran, Volume 5.',
 anatolia:'A. C. S. Peacock. Saljuqs III: Saljuqs of Rum. Encyclopaedia Iranica; Claude Cahen. The Formation of Turkey: The Seljukid Sultanate of Rum, Eleventh to Fourteenth Century.',
 khitai:'Michal Biran. The Empire of the Qara Khitai in Eurasian History: Between China and the Islamic World; István Vásáry. Qarā Ḵeṭāy. Encyclopaedia Iranica.',
 khwarazm:'C. E. Bosworth. Khwarazmshahs III: The Line of Anuštigin. Encyclopaedia Iranica; Sanjar; Tekiš b. Il Arslān. Encyclopaedia Iranica.',
 samanid:'R. N. Frye. The Samanids. The Cambridge History of Iran, Volume 4; C. E. Bosworth. Khorasan VI: History in the Taherid and Samanid Periods. Encyclopaedia Iranica.',
 karluk:'Peter B. Golden. An Introduction to the History of the Turkic Peoples; E. A. Davidovich. The Karakhanids. History of Civilizations of Central Asia, Volume IV, Part One.',
 ayyubid:'R. Stephen Humphreys. From Saladin to the Mongols: The Ayyubids of Damascus, 1193–1260; Linda Komaroff and Suzan Yalman. The Art of the Ayyubid Period (ca. 1171–1260).',
 mongol:'Michal Biran and Hodong Kim (eds.). The Cambridge History of the Mongol Empire; Peter Jackson. The Mongols and the Islamic World.',
 ...regionalReview.sources,...mediterraneanReview.sources,...anatolianReview.sources,...europeCentralReview.sources,...arabiaKhitaiReview.sources,...altaiJochiReview.sources
};
const messages=[
 ['Айюбидские владения Сирии','Ayyubid domains in Syria','Сириядагы Айюбийлердин ээликтери'],
 ['В 1250 году мамлюки установили власть в Египте. Айюбидские княжества Сирии сохранились до монгольского вторжения 1260 года.','In 1250 the Mamluks took power in Egypt. The Ayyubid principalities of Syria survived until the Mongol invasion of 1260.','1250-жылы мамлюктар Египетте бийликке келген. Сириядагы Айюбий княздыктары 1260-жылкы монгол чабуулуна чейин сакталган.'],
 ['Газна и Буст; правители признают верховенство Саманидов.','Ghazna and Bust; the rulers acknowledge Samanid overlordship.','Газна жана Буст; башкаруучулар Саманийлердин үстөмдүгүн тааныган.'],
 ['Хорезм под верховной властью Сельджуков.','Khwarazm under Seljuk overlordship.','Селжуктардын үстөмдүгү алдындагы Хорезм.'],
 ['Караханидские владения под верховной властью Каракитаев.','Qarakhanid domains under Qara Khitai overlordship.','Каракытайлардын үстөмдүгү алдындагы Караханий ээликтери.'],
 ['Местные владения западнотюркской политической системы.','Local domains within the Western Turkic political system.','Батыш Түрк саясий системасындагы жергиликтүү ээликтер.'],
 ['Формирование Каракитайского государства; продвижение Елюй Даши на запад.','Formation of the Qara Khitai state; Yelü Dashi’s movement westward.','Каракытай мамлекетинин калыптанышы; Елюй Дашинин батышка жылышы.']
 ,...regionalReview.messages,...mediterraneanReview.messages,...anatolianReview.messages,...europeCentralReview.messages,...arabiaKhitaiReview.messages,...altaiJochiReview.messages];
function prepare(input){
 const es=structuredClone(input);if(es[0]?.frontierReviewVersion===7)return es;
 const by=new Map(es.map(e=>[e.id,e])),at=(id,y)=>by.get(id)?.keyframes.filter(f=>f.year<=y).at(-1);
 // The generic geometry compiler also accepts stand-alone regional inputs.
 // Cross-state historical repairs require the complete chronological catalogue.
 if(!['rashidun','greatSeljuk','ayyubid'].every(id=>by.has(id)))return es;
 function frame(id,y,changes){const e=by.get(id);if(!e)return;const old=at(id,y);e.keyframes=e.keyframes.filter(f=>f.year!==y);e.keyframes.push({...structuredClone(old),...changes,year:y});e.keyframes.sort((a,b)=>a.year-b.year);}
 function cite(id,key){const e=by.get(id);if(e&&!e.source.includes(sources[key]))e.source+=' '+sources[key];}
 function context(id,from,to,owner,text){
  const e=by.get(id);if(!e)return;
  const end=structuredClone(at(id,to));
  for(const y of [...new Set([from,...e.keyframes.filter(f=>f.year>=from&&f.year<to).map(f=>f.year)])])frame(id,y,{legacyContext:true,overlord:owner,...(text?{territories:text}:{}),color:by.get(owner)?.color||e.color});
  if(to<=e.to)frame(id,to,{...end,legacyContext:false,overlord:null,color:e.color});
 }
 // Regional conquests: the old state loses precisely the land painted as
 // acquired by its successor; both sides retain the same shared vertices.
 // The additional Iranian stages represent regional control, not an annual
 // survey of the front or the unbroken obedience of every local community.
 const jebal=G.union([[[45,34],[47,33],[49,32.5],[51,33.5],[51.8,35.2],[50.8,36.3],[48,36.8],[46,35.5]]]);
 const isfahan=G.union([[[48.5,30],[51,29.8],[54,32.3],[54.5,34.8],[51.8,35.2],[49,32.5]]]);
 const fars=G.union([[[50,28],[52.5,26.5],[55.5,27],[57,29],[55.5,31.7],[54,32.3],[51,29.8]]]);
 const before=new Map(by.get('rashidun').keyframes.map(f=>[f.year,structuredClone(f.polys)]));
 for(const y of [642,643,644,650]){const original=[...before].filter(([n])=>n<=y).at(-1)[1];frame('rashidun',y,{polys:G.merge([G.union(original),jebal,...(y>=644?[isfahan]:[]),...(y>=650?[fars]:[])])});}
 cite('sasanian','conquest');cite('rashidun','conquest');
 // Before 999, do not back-project Mahmud's later Indian and Iranian empire.
 const ghazna=G.union([[[63.5,30.8],[66,30.5],[69,31.5],[70.3,33.8],[69,35.1],[66.5,34.5],[64,33]]]);
 const ghazOriginal=structuredClone(at('ghaznavid',977).polys);
 frame('ghaznavid',977,{polys:ghazna});frame('ghaznavid',999,{polys:ghazOriginal});
 context('ghaznavid',977,999,'samanid',messages[2][0]);cite('ghaznavid','ghaznavid');
 const samanidExtent=G.union(at('samanid',875).polys),transoxiana=B(60,37,77,46);
 frame('samanid',819,{polys:I(G.union(at('samanid',819).polys),transoxiana)});
 frame('samanid',875,{polys:I(samanidExtent,transoxiana)});
 frame('samanid',900,{polys:samanidExtent});context('samanid',819,875,'abbasid');cite('samanid','samanid');
 frame('karluk',756,{type:'influence',legacyContext:true});
 frame('karluk',766,{type:by.get('karluk').type,legacyContext:false});cite('karluk','karluk');
 // Nisa/Merv/Nishapur and the 1040 victory precede the advance into western
 // Iran and Baghdad. The former 1037 frame already included western Iran.
 const khorasan=G.union([[[55.5,35.5],[57.5,33],[61.5,32.8],[65.5,35],[66,38],[62,40],[58,39]]]);
 frame('greatSeljuk',1037,{polys:[[[57,37],[59.5,35.5],[62.5,36],[64,38],[62,39],[59,38.5]]]});
 frame('greatSeljuk',1040,{polys:khorasan});
 frame('greatSeljuk',1044,{polys:G.merge([khorasan,G.union([[[49,34],[51.5,33],[55.5,35.5],[58,39],[54,39],[50,37.5]]])])});
 frame('greatSeljuk',1055,{polys:G.union([[[43,33],[46,30],[51,29],[57.5,33],[61.5,32.8],[65.5,35],[66,38],[62,40],[56,42],[48,41],[43,37]]])});
 // After Sanjar's death the surviving western sultanate must not retain the
 // whole eastern empire. Regional successors remain distinct atlas profiles.
 const westIran=G.union([[[43,33],[46,30],[51,29],[55.5,32],[55,36.5],[52,39],[48,41],[44,39]]]);
 frame('greatSeljuk',1157,{polys:westIran});cite('greatSeljuk','seljuk');
 context('khwarazmian',1097,1157,'greatSeljuk',messages[3][0]);cite('khwarazmian','khwarazm');
 // Tekish's western conquests belong to the 1190s, not the old 1180 frame.
 const khwarazmCore=G.union(at('khwarazmian',1097).polys);
 frame('khwarazmian',1180,{polys:khwarazmCore});
 const nishapur=G.union([[[56,35],[58,34.5],[60,35],[60,37.5],[58,38],[56,38]]]);
 frame('khwarazmian',1187,{polys:G.merge([khwarazmCore,nishapur])});
 frame('khwarazmian',1193,{polys:G.merge([khwarazmCore,khorasan])});
 frame('khwarazmian',1194,{polys:G.merge([khwarazmCore,khorasan,westIran])});
 // The source's single 1124 polygon was the later empire at its maximum.
 // Early migration is contextual; a solid Central Asian domain starts with
 // the taking of Balasaghun in 1134, followed by Qatwan in 1141.
 const former=structuredClone(at('karaKhitai',1124).polys);
 frame('karaKhitai',1124,{polys:[[[91,44],[96,44],[98,47],[95,49],[91,48]]],type:'influence',territories:messages[6][0],label:[94,47]});
 frame('karaKhitai',1130,{polys:[[[81,45],[85,44],[88,46],[86,48],[82,48]]],type:'influence',label:[84,47]});
 frame('karaKhitai',1134,{polys:former,type:'empire',label:[80,44],territories:by.get('karaKhitai').territories});
 frame('karaKhitai',1141,{type:'empire',label:[78,44],territories:by.get('karaKhitai').territories});
 context('qarakhanid',1141,1212,'karaKhitai',messages[4][0]);cite('karaKhitai','khitai');cite('qarakhanid','khitai');
 // Egypt changes ruler in 1250; the Syrian Ayyubids do not vanish with it.
 const syria=G.union([[[34.2,31.5],[35.4,30.8],[38,31.3],[40.5,34],[40.5,36.7],[37,37],[35.5,35.6]]]);
 by.get('ayyubid').to=1259;
 frame('ayyubid',1250,{polys:syria,name:messages[0][0],short:messages[0][0],body:messages[1][0],label:[37,34.4]});
 const egypt=G.union([[[27,32],[31,32],[34.2,31.5],[34.8,29.5],[35,27],[33.5,24],[30,23.8],[27,28]]]);
 frame('mamluk',1250,{polys:egypt});
 frame('mamluk',1260,{polys:G.merge([egypt,syria])});
 cite('ayyubid','ayyubid');cite('mamluk','ayyubid');
 // Nicaea was lost in 1097. The old two frames kept the whole western
 // peninsula in Rum until 1299, even on top of the Nicaean state itself.
 // These are regional reconstructions anchored to dated acquisitions, not
 // surveyed frontiers or a claim to represent every Turkish principality.
 const rumInitial=G.union([[[29.4,40.6],[31,40.5],[33,40],[35,39],[35.2,37.5],[32,37],[30.5,38],[29.2,39.5]]]);
 const rumCore=G.union([[[30.5,39.5],[32,40],[34,39.8],[35.2,38.8],[35.2,37.5],[32,37],[30.5,38]]]);
 const rum1178=G.merge([rumCore,G.union([[[33,40],[36,40.6],[38.8,39.5],[39,38],[37,37.5],[35.2,37.5]]])]);
 const antalya=G.union([[[30.1,36.6],[31.2,36.6],[32,37.5],[30.5,38],[29.9,37.2]]]);
 const sinop=G.union([[[33,40],[34,42.2],[35.5,42.2],[36,40.6]]]);
 const alanya=G.union([[[31,36.3],[33,36.3],[33,37.4],[31.2,37.5]]]);
 const erzurum=G.union([[[38.5,39],[40.7,38.7],[42,39.5],[42,40.5],[40,40.6],[38.5,40.1]]]);
 frame('rumSeljuk',1077,{polys:rumInitial});frame('rumSeljuk',1097,{polys:rumCore,label:[32.5,38.4]});
 frame('rumSeljuk',1178,{polys:rum1178});frame('rumSeljuk',1200,{polys:rum1178});
 frame('rumSeljuk',1207,{polys:G.merge([rum1178,antalya])});
 frame('rumSeljuk',1214,{polys:G.merge([rum1178,antalya,sinop])});
 frame('rumSeljuk',1221,{polys:G.merge([rum1178,antalya,sinop,alanya])});
 frame('rumSeljuk',1230,{polys:G.merge([rum1178,antalya,sinop,alanya,erzurum])});
 context('rumSeljuk',1243,1256,'mongol');context('rumSeljuk',1256,1300,'ilkhanate');
 cite('rumSeljuk','anatolia');cite('medievalByzantine','anatolia');cite('nicaea','anatolia');
 // Local rulers within a hegemonic polity are selectable context outlines,
 // not another opaque sovereign fill over their own suzerain.
 for(const id of ['sogd','ferghana','suyabZone','chach','tokharistan','khwarezm'])context(id,610,633,'westernTurkic',messages[5][0]);
 regionalReview.apply(es,{frame,at,by,cite,I,D,B});
 mediterraneanReview.legacy(es,{frame,at,by,cite,I,D,B});
 anatolianReview.apply(es,{frame,at,by,cite,I,D,B});
 europeCentralReview.legacy(es,{frame,at,by,cite,I,D,B});
 arabiaKhitaiReview.apply(es,{frame,at,by,cite,I,D,B});
 altaiJochiReview.apply(es,{frame,at,by,cite,I,D,B});
 for(const e of es)e.frontierReviewVersion=7;
 return es;
}
// [losing/overextended outline, authority at the shared edge, from, until, source]
const rules=[
 ['byzantine','sasanian',610,633,'conquest'],['medievalByzantine','sasanian',633,651,'conquest'],
 ['sasanian','earlyIslam',630,632,'conquest'],['sasanian','rashidun',632,651,'conquest'],
 ['medievalByzantine','rashidun',636,661,'conquest'],['medievalByzantine','umayyad',661,750,'conquest'],
 ['tenKingdoms','northernSong',960,979,'china'],['liao','jinChina',1115,1125,'china'],['fiveDynasties','liao',907,960,'china'],
 ['easternTurkic','sui',610,618,'china'],['easternTurkic','tang',618,630,'china'],
 ['westernTurkic','tang',640,657,'china'],
 ['turgesh','tang',699,766,'china'],['karluk','tang',766,790,'china'],
 ['ghaznavid','greatSeljuk',1037,1157,'seljuk'],['buyids','greatSeljuk',1040,1062,'seljuk'],['buyids','ghaznavid',1029,1062,'ghaznavid'],
 ['ghaznavid','qarakhanid',999,1186,'ghaznavid'],
 ['greatSeljuk','qarakhanid',1037,1141,'seljuk'],['greatSeljuk','karaKhitai',1141,1157,'khitai'],
 ['greatSeljuk','abbasidIraq',1157,1194,'seljuk'],
 ['greatSeljuk','khwarazmian',1157,1194,'khwarazm'],
 ['greatSeljuk','rumSeljuk',1077,1194,'seljuk'],
 ['medievalByzantine','rumSeljuk',1077,1204,'anatolia'],['nicaea','rumSeljuk',1204,1243,'anatolia'],
 ['khwarazmian','abbasidIraq',1157,1231,'khwarazm'],['khwarazmian','delhiSultanate',1206,1231,'khwarazm'],
 ['qarakhanid','karaKhitai',1134,1141,'khitai'],
 ['karaKhitai','khwarazmian',1210,1218,'khitai'],['qarakhanid','khwarazmian',1210,1212,'khitai'],
 ['khwarazmian','mongol',1218,1231,'mongol'],
 ['mongol','jinChina',1206,1215,'mongol'],['mongol','westernXia',1206,1227,'mongol'],['ilkhanate','abbasidIraq',1256,1258,'mongol'],
 ['jinChina','mongol',1215,1234,'mongol'],['southernSong','mongol',1235,1260,'mongol'],['southernSong','yuan',1260,1279,'mongol']
 ,...regionalReview.rules,...mediterraneanReview.rules,...anatolianReview.rules,...arabiaKhitaiReview.rules,...altaiJochiReview.rules];
function compiler(input){
 const es=prepare(input),by=new Map(es.map(e=>[e.id,e])),memo=new Map();
 const raw=(id,y)=>{const e=by.get(id),f=e?.keyframes.filter(f=>f.year<=y).at(-1);return e&&y>=e.from&&y<=e.to&&f&&!f.hidden?require('./cartography-reviewed.cjs').legacyGeometry(id,y,f.polys):[];};
 function shape(id,y,chain=[]){const key=id+'|'+y;if(memo.has(key))return memo.get(key);if(chain.includes(id))throw Error('Cyclic dated border rule '+chain.concat(id));let p=raw(id,y);for(const[a,b,from,to]of rules)if(a===id&&y>=from&&y<to)p=D(p,shape(b,y,chain.concat(id)));memo.set(key,p);return p;}
 const years=new Set(es.flatMap(e=>[e.from,e.to+1,...e.keyframes.map(f=>f.year)]));for(const r of rules){years.add(r[2]);years.add(r[3]);}
 return {empires:es,shape,years:[...years].sort((a,b)=>a-b)};
}
module.exports={prepare,compiler,rules,sources,messages,I,D,B};
