'use strict';
// Dated regional corrections. These are geographical reconstructions, not surveyed borders.
const G=require('./cartography-geometry.cjs');
const sources={
 arabiaStages:'Marshall G. S. Hodgson. The Venture of Islam, Volume 1, chronology of Muhammad’s lifetime; Michael G. Morony. Arab II: Arab Conquest of Iran. Encyclopaedia Iranica.',
 redSeaSeparation:'Daniel Thomas Potts. Arabia II: The Sasanians and Arabia. Encyclopaedia Iranica; Stuart Munro-Hay. Aksum: An African Civilisation of Late Antiquity.',
 carthageCoast:'Walter E. Kaegi. Muslim Expansion and Byzantine Collapse in North Africa. Cambridge University Press, 2010.',
 spaniaEnd:'Jamie Wood. Defending Byzantine Spain: frontiers and diplomacy. Early Medieval Europe 18 (2010), pp. 292–319.',
 khitaiTribute:'István Vásáry. Qarā Ḵeṭāy. Encyclopaedia Iranica; Michal Biran. The Empire of the Qara Khitai in Eurasian History: Between China and the Islamic World.'
};
const messages=[
 ['Медина и прилегающие оазисы.','Medina and the neighbouring oases.','Медина жана анын жанындагы оазистер.'],
 ['Медина и западноаравийские союзные общины; Мекка ещё не присоединена.','Medina and allied communities in western Arabia; Mecca has not yet been incorporated.','Медина жана Батыш Аравиядагы союздаш жамааттар; Мекке али кошула элек.'],
 ['Медина, Хайбар и союзные общины Хиджаза после Худайбийского договора.','Medina, Khaybar and allied communities in the Hijaz after the Treaty of Hudaybiyyah.','Худайбия келишиминен кийин Медина, Хайбар жана Хижаздагы союздаш жамааттар.'],
 ['Мекка и Медина; объединение Хиджаза в 630 году.','Mecca and Medina; the unification of the Hijaz in 630.','Мекке жана Медина; Хижаздын 630-жылы биригиши.'],
 ['Большая часть Аравийского полуострова признаёт власть Медины через договоры и делегации.','Much of the Arabian Peninsula acknowledges Medina’s authority through agreements and delegations.','Аравия жарым аралынын көпчүлүк бөлүгү келишимдер жана элчиликтер аркылуу Мединанын бийлигин тааныган.'],
 ['Аксумское царство на африканском берегу Красного моря. К началу VII века прежние аксумские владения в Йемене уже утрачены.','The kingdom of Aksum on the African shore of the Red Sea. By the early seventh century its former possessions in Yemen had been lost.','Кызыл деңиздин африкалык жээгиндеги Аксум падышалыгы. VII кылымдын башына чейин анын Йемендеги мурдагы ээликтери жоголгон.'],
 ['Семиречье, Кашгария и Мавераннахр. Хорезм выплачивает дань, сохраняя собственное управление.','Semirechye, Kashgaria and Transoxiana. Khwarazm pays tribute while retaining its own government.','Жети-Суу, Кашкар жана Мавераннахр. Хорезм өз башкаруусун сактап, салык төлөгөн.']
];
// Offshore Red Sea divider, not a present-day political boundary.
const africa=G.union([[[-20,-20],[60,-20],[60,11],[44,11],[43.35,12.6],[42.5,14.3],[41,16.3],[39,20],[36,24],[33,28],[-20,28]]]);
const arabia=G.union([[[33,28],[36,24],[39,20],[41,16.3],[42.5,14.3],[43.35,12.6],[44,11],[60,11],[60,31.5],[46,31.5],[41,31],[37,29.5],[35,29.5]]]);
// Maritime separator through Gibraltar and the western Mediterranean.
const iberia=G.union([[[-20,35.95],[-5.6,35.95],[-4,36.05],[0,37],[5,39],[5,50],[-20,50]]]);
function apply(es,{frame,at,by,cite,I,D,B}){
 const medina=G.union([[[39.1,24],[40.1,24],[40.35,24.9],[39.3,25.05]]]);
 const western=G.merge([medina,G.union([[[38.65,23.4],[39.1,23.4],[40.1,24],[40.35,24.9],[39.3,25.05],[38.65,24.4]]])]);
 const khaybar=G.merge([western,G.union([[[38.8,24.7],[39.7,24.7],[40.2,25.6],[39.7,26],[38.9,25.9]]])]);
 const hijaz=G.merge([khaybar,G.union([[[38.8,24.8],[40.2,25.6],[41.3,23],[41.4,21],[40.3,20.5],[39.1,21],[38.8,23]]])]);
 for(const f of by.get('earlyIslam').keyframes){
  f.polys=f.year===622?medina:f.year<628?western:f.year<630?khaybar:f.year===630?hijaz:I(G.union(f.polys),arabia);
  f.territories=messages[f.year===622?0:f.year<628?1:f.year<630?2:f.year===630?3:4][0];
  f.label=f.year<630?[39.65,24.8]:[41,23.8];
 }
 for(const f of by.get('aksum').keyframes){f.polys=I(G.union(f.polys),africa);f.territories=messages[5][0];}
 // Do not paint Byzantine Syria as conquered in the 632 Arabian snapshot.
 frame('rashidun',632,{polys:I(G.union(at('rashidun',632).polys),arabia)});
 // The 625 fall of the remaining province is a dated loss, not an island
 // disappearing because of the renderer's draw order.
 // The 624 sketch also cut through Carthage's coast; its imperial
 // administration persisted, so retain the coastal core in every early frame.
 const carthage=G.union([[[9,35.5],[11.5,35.5],[11.5,37.6],[9,37.6]]]);
 for(const f of by.get('byzantine').keyframes)f.polys=G.merge([G.union(f.polys),carthage]);
 cite('byzantine','carthageCoast');
 frame('byzantine',625,{});
 for(const f of by.get('byzantine').keyframes)if(f.year>=625)f.polys=D(G.union(f.polys),iberia);
 for(const f of by.get('visigoths').keyframes)f.polys=I(G.union(f.polys),iberia);
 const northOxus=G.union([[[60,50],[100,50],[100,35],[74,35],[71.2,37.1],[69.2,37.2],[67.4,37.05],[66.8,37.35],[65.4,37.7],[64.5,38.4],[63.6,39.1],[62.2,40.5],[61.4,41.4],[60,41.5]]]);
 for(const f of by.get('karaKhitai').keyframes)if(f.year>=1141){f.polys=I(G.union(f.polys),northOxus);if(f.year<1210)f.territories=messages[6][0];}
 for(const id of ['earlyIslam','rashidun'])cite(id,'arabiaStages');
 cite('aksum','redSeaSeparation');for(const id of ['byzantine','visigoths'])cite(id,'spaniaEnd');
 for(const id of ['karaKhitai','khwarazmian'])cite(id,'khitaiTribute');
}
// Local Khwarazmian administration was not a directly occupied Qara Khitai
// province. Existing post-1210 conquest rules handle the subsequent reversal.
const rules=[['karaKhitai','khwarazmian',1141,1210,'khitaiTribute']];
module.exports={apply,sources,messages,rules};
