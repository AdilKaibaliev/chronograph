'use strict';
// Regional reconstruction, not a surveyed medieval boundary. See KYRGYZ_REVIEW.md.
const G=require('./cartography-geometry.cjs');
const messages=[];
const L=(ru,en,ky)=>{messages.push([ru,en,ky]);return ru;};
const sourceTang='Xin Tang shu (新唐書), juan 217, 黠戛斯; Jiu Tang shu (舊唐書), juan 195.';
const sourceMap='Xin Tang shu, juan 217; В. Я. Бутанаев, Ю. С. Худяков. История енисейских кыргызов (2000); А. А. Астайкин. Великий Кыргызский каганат. IX век. Атлас Tartarica (2006), с. 177; Michael R. Drompp. Breaking the Orkhon Tradition (1999).';
// Minusinsk basin / upper Yenisei, the Sayan passages and Tuva. Vertices follow
// regional relief at atlas scale; their precision does not imply survey accuracy.
const core=G.union([[
 [87.5,52.4],[87.9,53.1],[88.1,53.8],[88.6,54.4],[89.1,55.1],[89.9,55.5],
 [90.8,55.8],[91.8,55.9],[92.8,55.6],[93.5,55.1],[94.2,54.9],[95.1,54.6],
 [95.7,54.0],[96.5,53.7],[97.3,53.3],[98.2,53.0],[98.8,52.4],[99.1,51.7],
 [98.8,51.0],[98.3,50.5],[97.5,50.2],[96.8,50.0],[95.8,50.2],[94.9,50.4],
 [94.0,50.3],[93.1,50.5],[92.4,50.3],[91.7,50.5],[91.0,50.8],[90.3,50.7],
 [89.8,50.9],[89.2,51.2],[88.7,51.5],[88.3,51.8],[87.8,52.0]
]]);
// Broad military-political reach of the ninth-century high point, NOT continuous
// administration of every location. Regional synthesis of Butanaev/Khudyakov
// and comparison with Astaykin's c.860 map; not a tracing of its boundaries.
// The shared envelope is explicitly century-level, not an annual frontier.
const influence=G.union([[
 [81.8,48.5],[82.4,50.0],[83.7,51.5],[85.0,53.0],[86.5,54.1],
 [88.0,55.2],[89.6,55.9],[91.2,56.4],[93.0,56.5],[94.7,55.8],
 [96.4,54.8],[98.0,54.0],[99.4,52.8],[101.0,51.5],[103.0,51.0],
 [104.6,51.0],[106.2,51.8],[108.0,52.2],[110.1,52.6],[112.2,53.0],
 [114.5,52.8],[116.6,52.0],[118.1,51.0],[119.4,49.6],[120.0,48.0],
 [119.9,46.5],[118.5,45.2],[116.5,43.9],[114.2,42.8],[111.8,41.9],
 [109.4,40.8],[107.0,40.6],[104.6,41.0],[102.4,41.8],[100.0,42.5],
 [97.5,43.0],[95.0,43.5],[92.6,44.0],[90.2,44.4],[88.0,44.2],
 [85.8,43.9],[83.8,44.4],[82.3,45.6],[81.8,47.0]
]]);
const fringe=G.difference(influence,core);
const texts={
 name:L('Кыргызский каганат','Kyrgyz Khaganate','Кыргыз каганаты'),
 body:L('После победы над Уйгурским каганатом в 840 году кыргызская держава вышла далеко за пределы Енисея. Светлая область показывает реконструкцию её военно-политического охвата в эпоху расцвета IX века: Алтай, Верхнее Прииртышье, Джунгарию, значительную часть Монголии и районы Забайкалья. Енисейско-Саянское ядро выделено темнее. Широкая реконструкция представлена у Бутанаева и Худякова и на карте Астайкина около 860 года; длительность власти в отдельных областях, особенно на Орхоне, обсуждается в исследованиях Дромппа.',
 'After the victory over the Uyghur Khaganate in 840, Kyrgyz power extended far beyond the Yenisei. The lighter area reconstructs its military and political reach at the ninth-century high point: the Altai, upper Irtysh, Dzungaria, much of Mongolia and parts of Transbaikalia. The Yenisei–Sayan heartland is darker. Butanaev and Khudyakov and Astaykin’s map of about 860 present a broad reconstruction; Drompp examines the disputed duration of rule in outlying regions, especially the Orkhon.',
 '840-жылы Уйгур каганатын жеңгенден кийин кыргыз державасынын таасири Энесайдан кыйла алыска тараган. Ачык түстөгү аймак IX кылымдагы гүлдөп-өсүү мезгилинин аскердик-саясий таасир чөйрөсүн көрсөтөт: Алтай, Иртыштын жогорку агымы, Жуңгария, Монголиянын кыйла бөлүгү жана Байкалдын чыгышындагы айрым аймактар. Энесай–Саян өзөгү күңүрт түстө берилген. Кеңири реконструкция Бутанаев менен Худяковдун эмгегинде жана Астайкиндин болжол менен 860-жылга арналган картасында бар; четки аймактардагы, өзгөчө Орхондогу бийликтин узактыгы Дромпптун изилдөөсүндө талкууланат.'),
 territories:L('Тёмная область — Енисейско-Саянское ядро. Светлая область — военно-политический охват расцвета IX века. Внешний контур обобщает влияние и походы этой эпохи, а не ежегодную административную границу.',
 'Darker area: Yenisei–Sayan heartland. Lighter area: military and political reach at the ninth-century high point. The outer outline summarizes the era’s influence and campaigns, rather than an annual administrative frontier.',
 'Күңүрт аймак — Энесай–Саян өзөгү. Ачык аймак — IX кылымдагы гүлдөп-өсүү мезгилинин аскердик-саясий таасир чөйрөсү. Сырткы контур жыл сайынгы административдик чек араны эмес, ошол доордун таасирин жана жортуулдарын жалпылайт.'),
 later:L('Кыргызские владения на Енисее','Kyrgyz domains on the Yenisei','Энесайдагы кыргыз ээликтери'),
 laterBody:L('В X–XII веках кыргызские земли сохранялись в Саяно-Енисейском регионе. «Худуд аль-алам» описывает кыргызскую страну в 982 году, а аль-Идриси — в XII веке. Кемиджкет упоминается в средневековой географии, но его точное расположение спорно. В 1207 году кыргызские правители признали верховную власть Чингисхана.',
 'In the tenth–twelfth centuries Kyrgyz domains continued in the Sayan–Yenisei region. Hudud al-Alam describes the Kyrgyz country in 982, and al-Idrisi in the twelfth century. Kemijiket appears in medieval geography, but its precise location is disputed. In 1207 Kyrgyz rulers acknowledged Chinggis Khan’s overlordship.',
 'X–XII кылымдарда кыргыз ээликтери Саян–Энесай аймагында сакталып турган. «Худуд аль-алам» кыргыз өлкөсүн 982-жылы, ал эми аль-Идриси XII кылымда сүрөттөгөн. Кемиджкет орто кылымдагы географиялык эмгектерде аталат, бирок анын так жайгашкан жери талаштуу. 1207-жылы кыргыз башкаруучулары Чыңгыз хандын үстөмдүгүн тааныган.'),
 earlierBody:L('Китайские хроники описывают связи кыргызов с Тан, подчинение уйгурам и последующую борьбу за самостоятельность.','Chinese chronicles describe Kyrgyz diplomacy with Tang, subordination to the Uyghurs and the subsequent struggle.','Кытай жылнаамалары кыргыздардын Тан менен дипломатиялык байланыштарын, уйгурларга көз карандылыгын жана андан кийинки күрөшүн баяндайт.'),
 region:L('Верхний Енисей, Минусинская котловина, Саяны и Тува; приблизительный региональный контур.','Upper Yenisei, Minusinsk basin, Sayan Mountains and Tuva; approximate regional outline.','Жогорку Энесай, Минусин ойдуңу, Саян тоолору жана Тува; болжолдуу аймактык контур.'),
 mongolBody:L('С 1207 года кыргызские земли входят в систему монгольской верховной власти. В 1218 году отказ участвовать в походе против туматов вызвал новое выступление Джучи. «Юань ши» описывает назначение Лю Хаоли в 1270 году, северное восстание 1273 года и поход Тутухи 1293 года. Кыргызское население сохранялось в регионе; отдельные группы переселялись по распоряжениям монгольских властей.',
 'From 1207 the Kyrgyz lands formed part of the Mongol system of overlordship. In 1218 refusal to join a campaign against the Tumat prompted a new expedition by Jochi. Yuan shi records Liu Haoli’s appointment in 1270, the northern revolt in 1273 and Tutukha’s campaign in 1293. Kyrgyz communities continued in the region; some groups were relocated by the Mongol authorities.',
 '1207-жылдан кыргыз жерлери монголдордун үстөмдүк тутумуна кирген. 1218-жылы туматтарга каршы жортуулга катышуудан баш тартуу Жучунун жаңы жортуулуна алып келген. «Юань ши» Лю Хаолинин 1270-жылкы дайындалышын, 1273-жылкы түндүктөгү көтөрүлүштү жана Тутуханын 1293-жылкы жортуулун баяндайт. Кыргыз калкы аймакта жашоосун уланткан; айрым топтор монгол бийлигинин буйругу менен көчүрүлгөн.')
};
const sourceLater='Hudud al-Alam (982); аль-Идриси. Nuzhat al-mushtaq (1154); Ю. Н. Есин. Страна кыргызов на картах большого атласа аль-Идриси (2022).';
const sourceMongol='Сокровенное сказание монголов, §239; Рашид ад-Дин. Сборник летописей, книга I, раздел о кыргызах и кэм-кэмджиутах; Yuan shi, juan 17, 18, 128, 167.';
L(sourceMap,'Xin Tang shu, juan 217; V. Ya. Butanaev, Yu. S. Khudyakov. History of the Yenisei Kyrgyz (2000); A. A. Astaykin. Great Kyrgyz Khaganate, 9th century. Atlas Tartarica (2006), p. 177; Michael R. Drompp. Breaking the Orkhon Tradition (1999).','Xin Tang shu, 217-бөлүм; В. Я. Бутанаев, Ю. С. Худяков. Энесай кыргыздарынын тарыхы (2000); А. А. Астайкин. Улуу Кыргыз каганаты. IX кылым. Tartarica атласы (2006), 177-бет; Michael R. Drompp. Breaking the Orkhon Tradition (1999).');
L(sourceLater,'Hudud al-Alam (982); al-Idrisi. Nuzhat al-mushtaq (1154); Yu. N. Esin. The Kyrghyz Country on the Maps in al-Idrisi’s Great Atlas (2022).','Худуд аль-алам (982); аль-Идриси. Нузхат аль-муштак (1154); Ю. Н. Есин. Аль-Идрисинин чоң атласындагы кыргыз өлкөсү (2022).');
L(sourceMongol,'The Secret History of the Mongols, §239; Rashid al-Din. Compendium of Chronicles, book I, Kyrgyz and Kem-Kemjiut section; Yuan shi, juan 17, 18, 128, 167.','Монголдордун жашыруун тарыхы, §239; Рашид ад-Дин. Жылнаамалар жыйнагы, I китеп, кыргыздар жана кэм-кэмжиуттар бөлүмү; Yuan shi, 17, 18, 128, 167-бөлүмдөр.');
const migration=L('Кыргызская история продолжалась на Енисее после IX века. Переселения монгольского времени затрагивали отдельные группы. Формирование кыргызского населения Тянь-Шаня связано с несколькими этапами и взаимодействием разных сообществ; эти процессы показаны в последующих периодах атласа.',
 'Kyrgyz history continued on the Yenisei after the ninth century. Mongol-period relocations affected individual groups. The formation of the Kyrgyz population of the Tien Shan involved several stages and interaction between communities; these developments appear in later periods of the atlas.',
 'Кыргыз тарыхы IX кылымдан кийин да Энесайда уланган. Монгол доорундагы көчүрүүлөр айрым топторду камтыган. Теңир-Тоодогу кыргыз калкынын калыптанышы бир нече этап жана ар башка жамааттардын өз ара байланышы менен жүргөн; бул процесстер атластын кийинки мезгилдеринде көрсөтүлөт.');
const development=L('«Синь Тан шу» сообщает о выращивании проса, пшеницы и ячменя, изготовлении железного оружия, скотоводстве и иерархии должностных лиц. Эти сведения показывают сочетание земледелия, ремесла и кочевого хозяйства в кыргызском обществе.',
 'Xin Tang shu records millet, wheat and barley cultivation, iron weapon production, livestock herding and a hierarchy of officials. These descriptions show the combination of farming, crafts and pastoralism in Kyrgyz society.',
 '«Синь Тан шу» таруу, буудай жана арпа өстүрүүнү, темир курал жасоону, мал чарбачылыгын жана кызмат адамдарынын иерархиясын баяндайт. Бул маалыматтар кыргыз коомунда дыйканчылык, кол өнөрчүлүк жана көчмөн мал чарбачылыгы айкалышканын көрсөтөт.');
function revise(empires,stages){
 const by=Object.fromEntries(empires.map(e=>[e.id,e]));
 const kh=by.kyrgyzKhaganate;
 Object.assign(kh,{name:texts.name,short:texts.name,type:'empire',label:[102,49.5],focus:[100,49,5],source:sourceMap,sourceUrl:'https://donglishuzhai.net/chapter/4353.html',body:texts.body,territories:texts.territories,keyframes:[{year:840,polys:core,dependentPolys:fringe}]});
 delete kh.corePolys;
 const early=by.yeniseiKyrgyz;
 Object.assign(early,{body:texts.earlierBody,territories:texts.region,focus:[93,53,4.4]});
 early.keyframes=early.keyframes.map(f=>({...f,polys:f.hidden?[]:core,...(f.year===924?{type:'fuzzy',name:texts.later,short:texts.later,body:texts.laterBody,source:sourceLater,label:[93,54.6]}:{})}));
 Object.assign(by.kyrgyzMongol,{body:texts.mongolBody,territories:texts.region,source:sourceMongol,sourceUrl:'https://zh.wikisource.org/wiki/元史/卷128',label:[93,54.6],focus:[93,53,4.4]});
 by.kyrgyzMongol.keyframes=by.kyrgyzMongol.keyframes.map(f=>({...f,polys:core}));
 const s=Object.fromEntries(stages.map(s=>[s.year,s]));
 const change=(year,title,text,source,extra={})=>Object.assign(s[year]||{year,facts:[],route:null,focus:year<924?'kyrgyzKhaganate':year<1207?'yeniseiKyrgyz':'kyrgyzMongol',view:[94,53,4.2]}, {title,text,source,...extra});
 const revised=[...stages.filter(s=>![840,847,860,924,1207,1218,1270,1273,1293].includes(s.year)),
 change(840,L('840 · Разгром Уйгурского каганата','840 · Defeat of the Uyghur Khaganate','840 · Уйгур каганатынын талкаланышы'),
 L('Кыргызское войско взяло уйгурскую столицу на Орхоне. Уйгурский каган погиб, а прежнее государство распалось. Китайская хроника сообщает о переносе кыргызской ставки южнее гор Лаошань / Думань. На карте отмечены район Верхнего Енисея и Орду-Балык; линия между ними показывает общее направление похода.',
 'The Kyrgyz army captured the Uyghur capital on the Orkhon. The Uyghur khagan was killed and the former state broke apart. The Chinese chronicle records the relocation of the Kyrgyz ruler’s camp south of Laoshan / Duman. The map marks the upper Yenisei region and Ordu-Baliq; the connecting line indicates the campaign’s general direction.',
 'Кыргыз аскерлери Орхондогу уйгур борборун алган. Уйгур каганы өлүп, мурдагы мамлекет ыдыраган. Кытай жылнаамасында кыргыз ордосунун Лаошань / Думань тоолорунун түштүгүнө көчүрүлгөнү айтылат. Картада Жогорку Энесай аймагы менен Ордо-Балык белгиленип, алардын ортосундагы сызык жортуулдун жалпы багытын көрсөтөт.'),sourceTang,
 {view:[100,49,3.1],route:{kind:'campaign',to:846,points:[[92.5,53.6],[102.66,47.43]],label:L('840 · Поход к Орду-Балыку','840 · Campaign to Ordu-Baliq','840 · Ордо-Балыкка жортуул'),endLabel:L('Орду-Балык · 840','Ordu-Baliq · 840','Ордо-Балык · 840')}}),
 change(847,s[847].title,L('Тан утвердила за кыргызским правителем титул Инъу чэнмин кэхань. Посольства закрепляли отношения двух дворов после победы кыргызов над Уйгурским каганатом.',
 'The Tang court confirmed the title Yingwu Chengming Kehan for the Kyrgyz ruler. Embassies maintained relations between the two courts after the Kyrgyz victory over the Uyghur Khaganate.',
 'Тан ордосу кыргыз башкаруучусуна Инъу чэнмин кэхань наамын бекиткен. Элчиликтер кыргыздардын Уйгур каганатын жеңишинен кийин эки ордонун мамилесин бекемдеген.'),'Xin Tang shu, juan 217 (Dazhong 1).',{view:[100,49,3.1]}),
 change(860,L('860–874 · Три посольства к Тан','860–874 · Three embassies to Tang','860–874 · Танга үч элчилик'),
 L('«Синь Тан шу» сообщает, что в эру Сяньтун кыргызские послы трижды прибывали ко двору Тан. Эта эра охватывает 860–874 годы. Хроника подтверждает три посещения в пределах периода, не называя здесь год каждого посольства.',
 'Xin Tang shu reports that Kyrgyz envoys visited the Tang court three times during the Xiantong era, 860–874. The chronicle confirms three visits within that period without giving each embassy’s year in this passage.',
 '«Синь Тан шу» Сяньтун доорунда кыргыз элчилери Тан ордосуна үч жолу келгенин билдирет. Бул доор 860–874-жылдарды камтыйт. Жылнаама ушул мезгилдеги үч сапарды ырастайт, бирок бул үзүндүдө ар бир элчиликтин жылы өзүнчө көрсөтүлбөйт.'),'Xin Tang shu, juan 217, 黠戛斯 (Xiantong).',
 {route:{kind:'diplomacy',to:874,points:[[92.5,53.6],[108.94,34.34]],label:L('860–874 · Посольства к Тан','860–874 · Embassies to Tang','860–874 · Танга элчиликтер'),endLabel:L('Чанъань · двор Тан','Chang’an · Tang court','Чанъань · Тан ордосу')},view:[101,44,3.1]}),
 change(924,s[924].title,texts.laterBody,sourceLater,{view:[94,53,4.2]}),
 change(1207,s[1207].title,L('«Сокровенное сказание монголов» (§239) сообщает о походе Джучи к лесным народам и подчинении кыргызских правителей Чингисхану. Рашид ад-Дин также описывает признание монгольской власти. Кыргызские земли сохранялись как населённый и управляемый регион внутри монгольских владений.',
 'The Secret History of the Mongols (§239) records Jochi’s expedition to the forest peoples and the submission of Kyrgyz rulers to Chinggis Khan. Rashid al-Din also describes their acknowledgement of Mongol authority. The Kyrgyz lands continued as an inhabited and administered region within the Mongol domains.',
 '«Монголдордун жашыруун тарыхында» (§239) Жучунун токой элдерине жортуулу жана кыргыз башкаруучуларынын Чыңгыз ханга баш ийиши баяндалат. Рашид ад-Дин да монгол бийлигинин таанылышын сүрөттөйт. Кыргыз жерлери монгол ээликтеринин ичинде калкы жана башкаруусу бар аймак катары сакталган.'),sourceMongol),
 change(1218,L('1218 · Восстание и поход Джучи','1218 · Revolt and Jochi’s campaign','1218 · Көтөрүлүш жана Жучунун жортуулу'),
 L('По Рашид ад-Дину, кыргызы отказались выделить войска для похода против туматов и восстали. Джучи выступил против них, восстановив монгольскую власть. Событие относится к кыргызским землям Верхнего Енисея.',
 'According to Rashid al-Din, the Kyrgyz refused to supply troops for a campaign against the Tumat and rebelled. Jochi marched against them and restored Mongol authority. The event concerns the Kyrgyz lands of the upper Yenisei.',
 'Рашид ад-Диндин маалыматы боюнча, кыргыздар туматтарга каршы жортуулга аскер берүүдөн баш тартып, көтөрүлүшкө чыккан. Жучу аларга каршы жортуул жасап, монгол бийлигин калыбына келтирген. Окуя Жогорку Энесайдагы кыргыз жерлерине тиешелүү.'),sourceMongol),
 change(1270,s[1270].title,L('В 1270 году Хубилай назначил Лю Хаоли управлять кыргызскими и соседними северными областями. «Юань ши» описывает организацию снабжения и почтовых станций, а также ремесленное население Цяньчжоу.',
 'In 1270 Khubilai appointed Liu Haoli to administer the Kyrgyz and neighbouring northern regions. Yuan shi describes supply arrangements and postal stations, as well as the artisan population of Qianzhou.',
 '1270-жылы Хубилай Лю Хаолини кыргыз жана коңшу түндүк аймактарды башкарууга дайындаган. «Юань ши» камсыздоону жана почта бекеттерин уюштурууну, ошондой эле Цяньчжоунун кол өнөрчү калкын баяндайт.'),'Yuan shi, juan 63, 167 (Zhiyuan 7).'),
 change(1273,L('1273 · Восстание северных князей','1273 · Revolt of the northern princes','1273 · Түндүктөгү төрөлөрдүн көтөрүлүшү'),
 L('В жизнеописании Лю Хаоли «Юань ши» сообщает о восстании северных князей. Часть северных областей вышла из повиновения Хубилаю. Это эпизод борьбы за власть внутри монгольского мира; образование нового независимого Кыргызского каганата этим сообщением не установлено.',
 'Liu Haoli’s biography in Yuan shi records a revolt of the northern princes. Some northern regions ceased to obey Khubilai. This was a struggle for power within the Mongol world; the passage does not establish the foundation of a new independent Kyrgyz Khaganate.',
 '«Юань шидеги» Лю Хаолинин өмүр баянында түндүктөгү төрөлөрдүн көтөрүлүшү айтылат. Айрым түндүк аймактар Хубилайга баш ийбей калган. Бул монгол дүйнөсүндөгү бийлик үчүн күрөштүн окуясы; бул маалымат жаңы көз карандысыз Кыргыз каганаты түзүлгөнүн ырастабайт.'),'Yuan shi, juan 167 (Zhiyuan 10).'),
 change(1293,L('1293 · Тутуха на Енисее','1293 · Tutukha on the Yenisei','1293 · Тутуха Энесайда'),
 L('Весной 1293 года войско Тутухи прошло по льду реки Кэм, подчинило пять групп и оставило гарнизон. «Юань ши» отдельно сообщает о переселении 700 кыргызских хозяйств в Хэсыхэ. Военный поход и переселение — два различных сообщения хроники.',
 'In spring 1293 Tutukha’s army travelled over the frozen Kem River, subdued five groups and left a garrison. Yuan shi separately reports the relocation of 700 Kyrgyz households to Hesihe. The campaign and the relocation are distinct reports in the chronicle.',
 '1293-жылдын жазында Тутуханын аскерлери тоңгон Кэм дарыясынын үстү менен өтүп, беш топту баш ийдирип, гарнизон калтырган. «Юань ши» өзүнчө 700 кыргыз түтүнүнүн Хэсыхэге көчүрүлгөнүн билдирет. Жортуул менен көчүрүү — жылнаамадагы эки башка маалымат.'),'Yuan shi, juan 17, 128 (Zhiyuan 30).',{route:null})
 ].sort((a,b)=>a.year-b.year);
 return {empires,stages:revised,migration,development};
}
L('Енисейско-Саянское ядро','Yenisei–Sayan heartland','Энесай–Саян өзөгү');
L('Военно-политический охват · IX век','Military and political reach · 9th c.','Аскердик-саясий таасир · IX кылым');
L('Расцвет IX века · реконструкция','Ninth-century high point · reconstruction','IX кылымдагы гүлдөп-өсүү · реконструкция');
L('Внешний контур: обобщённый военно-политический охват расцвета IX века; сопоставлен с реконструкцией около 860 года.','Outer outline: the combined military and political reach of the ninth-century high point, compared with the reconstruction for about 860.','Сырткы контур: IX кылымдагы гүлдөп-өсүү мезгилинин жалпыланган аскердик-саясий таасир чөйрөсү; болжол менен 860-жылкы реконструкция менен салыштырылган.');
L('Направление похода или посольства','Campaign or embassy direction','Жортуул же элчилик багыты');
L('Расселение и направления','Settlement and directions','Конуштар жана багыттар');
L('Контуры передают исторические области; точная линия средневековой границы неизвестна.','Outlines represent historical regions; the exact medieval boundary line is unknown.','Контурлар тарыхый аймактарды көрсөтөт; орто кылымдагы чек аранын так сызыгы белгисиз.');
module.exports={revise,messages,core,fringe,influence};
