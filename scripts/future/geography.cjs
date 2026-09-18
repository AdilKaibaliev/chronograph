// Geography is evidence about a place, not part of the quoted prophetic wording.
module.exports=function geography(d){
 const L=(ru,en,ky)=>({ru,en,ky});
 const source=(title,url)=>({title,url});
 const iranica=source('Encyclopaedia Iranica · Ctesiphon; Sasanian Dynasty; Khorasan', 'https://www.iranicaonline.org/articles/ctesiphon/');
 const hasan=source('TDV İslâm Ansiklopedisi · Hasan', 'https://islamansiklopedisi.org.tr/hasan');
 const ammar=source('TDV İslâm Ansiklopedisi · Ammâr b. Yâsir; Sıffîn Savaşı', 'https://islamansiklopedisi.org.tr/siffin-savasi');
 const muhammad=source('TDV İslâm Ansiklopedisi · Muhammed', 'https://islamansiklopedisi.org.tr/muhammed');
 const put=(id,name,coord,extra={})=>d.places[id]={name,coord,...extra};
 put('ctesiphon',L('Аль-Мадаин · Ктесифон','Al-Madain · Ctesiphon','Аль-Мадаин · Ктесифон'),[44.58,33.09]);
 put('kufa',L('Аль-Куфа','Al-Kufa','Аль-Куфа'),[44.40,32.03]);
 put('mecca-city',L('Мекка','Mecca','Мекке'),[39.83,21.42],{area:true,radius:.12});
 // Siffin is an area between Raqqa and Balis, not Ammar's modern mausoleum.
 put('siffin',L('Сиффин · район сражения','Siffin · battle area','Сыффин · салгылаш аймагы'),[38.43,35.87],{area:true,radius:.27});
 Object.assign(d.places.rawha,{coord:[39.0,24.0],area:true,radius:.20});
 Object.assign(d.places.tabala,{coord:[42.3,20.0],area:true,radius:.24});
 // An original schematic of the mainland core around 600 CE. It does not
 // include the temporary conquests in Egypt and al-Sham in 614–628.
 d.territories={sasanian:{
  name:L('Персия Сасанидов · аль-Фурс','Sasanian Persia · al-Furs','Сасаниддер Персиясы · аль-Фурс'),
  period:L('Основные владения · начало VII века · схема','Mainland core · early 7th century · schematic','Негизги ээликтер · VII кылымдын башы · схема'),
  labelCoord:[55,32],
  polygons:[[[40,36.7],[41.2,37.5],[42.5,39],[44,40.3],[46.8,41.5],[48.3,41.9],[49.2,40.4],[48.5,38.4],[49.5,37.5],[51.4,36.6],[53.7,37],[54.5,38],[57,37.8],[59.5,37.5],[62.2,39],[64.6,38],[66.8,37.5],[68.5,36.7],[68,34.7],[66.7,33.4],[65.5,31.4],[64,29.5],[63,27],[61.5,25.2],[59.4,25.4],[57.8,25.7],[57.1,27.1],[56.3,27.2],[54.8,26.6],[53.5,27.2],[52,27.8],[50.8,28.6],[49.6,30.1],[48.5,30.1],[47.9,29.5],[46.8,30.2],[45.1,31.5],[43.6,33.1],[42,34.6],[40,36.7]]],
  sources:[iranica]
 }};
 const set=(id,places,geography)=>{const e=d.events.find(e=>e.id===id);e.places=places;e.geography=geography;};
 const historical=(date,note,sources,extra={})=>({mode:'historical',date,note,sources,...extra});
 set('kisra',['ctesiphon'],historical(L('637 н. э. · 16 г. х.','637 CE · 16 AH','637-ж. · хижранын 16-ж.'),
  L('Аль-Мадаин — столица Сасанидов, взятая мусульманским войском в 637 году. Здесь находилась царская казна. На карте выделены основные владения Сасанидов начала VII века.',
    'Al-Madain, the Sasanian capital, was taken by the Muslim army in 637. The royal treasury was located here. The map highlights the Sasanian mainland core in the early 7th century.',
    'Сасаниддердин борбору Аль-Мадаинди мусулман кошууну 637-жылы алган. Падышанын казынасы ушул жерде жайгашкан. Картада Сасаниддердин VII кылымдын башындагы негизги ээликтери көрсөтүлгөн.'),[iranica],{territories:['sasanian']}));
 set('hasan',['kufa'],historical(L('661 н. э. · 41 г. х.','661 CE · 41 AH','661-ж. · хижранын 41-ж.'),
  L('Аль-Куфа: здесь аль-Хасан и Муавия лично подтвердили соглашение, завершившее примирение в 661 году.',
    'Al-Kufa: al-Hasan and Muawiya personally confirmed the agreement here, completing the reconciliation in 661.',
    'Аль-Куфа: 661-жылы аль-Хасан менен Муавия бул жерде келишимди жеке ырастап, жарашууну жыйынтыкташкан.'),[hasan]));
 set('ammar',['siffin'],historical(L('657 н. э. · 37 г. х.','657 CE · 37 AH','657-ж. · хижранын 37-ж.'),
  L('Аммар ибн Ясир погиб в сражении при Сиффине. Выделен район сражения на правом берегу Евфрата между ар-Раккой и Балисом.',
    'Ammar ibn Yasir died at the Battle of Siffin. The highlighted battle area lies on the right bank of the Euphrates between al-Raqqa and Balis.',
    'Аммар ибн Ясир Сыффин салгылашында каза болгон. Евфраттын оң жээгиндеги ар-Ракка менен Балистин ортосундагы салгылаш аймагы белгиленген.'),[ammar]));
 set('death-prophet',['medina'],historical(L('632 н. э. · 11 г. х.','632 CE · 11 AH','632-ж. · хижранын 11-ж.'),
  L('Пророк Мухаммад ﷺ скончался в Медине в 632 году.','The Prophet Muhammad ﷺ died in Medina in 632.','Пайгамбар Мухаммад ﷺ 632-жылы Мединада дүйнөдөн кайткан.'),[muhammad]));
 set('mission',['mecca-city'],historical(null,L('Мекка — начало пророческой миссии Мухаммада ﷺ.','Mecca — the beginning of Muhammad’s ﷺ prophetic mission.','Мекке — Мухаммаддын ﷺ пайгамбарлык миссиясынын башталган жери.'),[muhammad]));
 set('moon',['mecca-city'],{mode:'named',sources:[source('Sahih al-Bukhari · 4867','https://sunnah.com/bukhari:4867')],note:L('Мекка — место наблюдения знамения: в передаче Анаса названы жители Мекки, попросившие показать им знамение.','Mecca is the place of witnessing the sign: Anas’s transmission names the people of Mecca who asked to be shown a sign.','Мекке — белгиге күбө болгон жер: Анастан келген риваятта белги көрсөтүүнү сураган Меккенин тургундары аталат.')});
 set('hajj-isa',['rawha'],{mode:'named',sources:[source('Saudi Press Agency · Al-Rawha Well; Encyclopedia of Translated Islamic Terms · Al-Rawhā’', 'https://www.spa.gov.sa/en/N2518849')],note:L('Ар-Рауха — долина на пути из Медины в Мекку, к юго-западу от Медины.','Al-Rawha is a valley on the route from Medina to Mecca, southwest of Medina.','Ар-Рауха — Мединадан Меккеге кеткен жолдогу, Мединанын түштүк-батышындагы өрөөн.')});
 set('du-khalasa',['tabala'],{mode:'named',sources:[source('Sahih Muslim · 2906; NGA Geographic Names · Tabālah','https://sunnah.com/muslim:2906')],note:L('Табала — долина, названная в передаче Муслима о Зу-ль-Халасе. Выделен район долины.','Tabala is the valley named in Muslim’s transmission about Dhu al-Khalasa. The valley area is highlighted.','Табала — Муслимдин Зул-Халаса тууралуу риваятында аталган өрөөн. Картада өрөөндүн аймагы белгиленген.')});
 for(const e of d.events){
  if(e.geography)continue;
  if(e.places.some(id=>d.places[id].coord))e.geography={mode:'named',sources:[]};
  else e.geography={mode:'unlocated',sources:[],note:e.places.length
   ?L('Названное место пока не локализовано.','The named place has not been located.','Аталган жердин жайгашкан орду аныкталган эмес.')
   :L('В этом хадисе место события не названо.','This hadith does not name the event’s location.','Бул хадисте окуянын жери аталган эмес.')};
 }
 d.version=4;return d;
};
