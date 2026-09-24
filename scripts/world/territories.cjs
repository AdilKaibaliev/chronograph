// Independently drawn regional reconstructions, not digitized historical borders.
// Dates describe documented phases; approximate archaeological changes remain approximate.
// A polygon represents only its stated category: polity, influence, culture or settlement.
const L=(ru,en,ky)=>[ru,en,ky];
module.exports=c=>{
 const src=(id,title,url)=>c.sources[id]={title,urls:[url]};
 src('sicanContinuity','Paloma Carcedo de Mufarech. Ancient Andean Metalworking (900–1532 CE). The Metropolitan Museum of Art, 2024.','https://www.metmuseum.org/essays/ancient-andean-metalworking');
 src('copan','UNESCO. Maya Site of Copan: Outstanding Universal Value.','https://whc.unesco.org/en/list/129');
 src('mixtecCodices','John M. D. Pohl. Ancient Books: Mixtec Group Codices. FAMSI.','https://www.famsi.org/research/pohl/jpcodices/pohlmixtec1.html');
 src('mixtecMuseum','British Museum. Codex Tonindeye (Zouche-Nuttall), Am1902,0308.1; Indigenous reframing of the fall of the Aztec empire.','https://www.britishmuseum.org/collection/object/E_Am1902-0308-1');
 c.sources.mixtecMuseum.urls.push('https://www.britishmuseum.org/blog/indigenous-reframing-fall-aztec-empire');
 src('casarabe','Heiko Prümers et al. Lidar reveals pre-Hispanic low-density urbanism in the Bolivian Amazon. Nature 606, 2022, pp. 325–328.','https://www.nature.com/articles/s41586-022-04780-4');
 src('moundville','Vernon James Knight. Ancient Site. Moundville Archaeological Park, University of Alabama.','https://moundville.museums.ua.edu/ancient-site/');
 src('maghreb','The Metropolitan Museum of Art. Western North Africa (The Maghrib), 1000–1400 A.D.','https://82nd-and-fifth.metmuseum.org/toah/ht/07/afw.html');
 src('murabitun','The Metropolitan Museum of Art. The Art of the Almoravid and Almohad Periods (ca. 1062–1269).','https://www.metmuseum.org/es/essays/the-art-of-the-almoravid-and-almohad-periods-ca-1062-1269');
 src('alwa','Polish Centre of Mediterranean Archaeology, University of Warsaw. Virtual Nubia: Nubian Kingdoms; First results of research in Soba, 2020.','https://virtualnubia.uw.edu.pl/nubian-kingdoms');
 src('cahokiaChange','Larry V. Benson et al. Cahokia’s boom and bust in the context of climate change. US Geological Survey, 2009.','https://www.usgs.gov/publications/cahokias-boom-and-bust-context-climate-change');
 src('thuleArrival','Greenland National Museum and Archives. New people — the Thule Culture.','https://en.nka.gl/museum/exhibitions/new-people-the-thule-culture/');
 src('mississippian','National Park Service. History and Culture of the Mississippi Delta Region; Ocmulgee Mounds: Mississippian Culture.','https://www.nps.gov/locations/lowermsdeltaregion/history-and-culture-of-the-mississippi-delta-region.htm');
 c.sources.mississippian.urls.push('https://www.nps.gov/ocmu/learn/historyculture/mississippian-culture.htm');
 src('caddo','Texas Archeological Research Laboratory, University of Texas at Austin. Tejas: Caddo Timeline; Early Caddo; Middle Caddo.','https://texasbeyondhistory.net/tejas/fundamentals/timeline.html');
 c.sources.caddo.urls.push('https://www.texasbeyondhistory.net/tejas/ancestors/early.html','https://www.texasbeyondhistory.net/tejas/ancestors/middle.html');
 src('mabuyag','Robert N. Williams et al. Multidisciplinary evidence for early banana (Musa cvs.) cultivation on Mabuyag Island, Torres Strait. Nature Ecology & Evolution, 2020.','https://openresearch-repository.anu.edu.au/items/ba545395-25db-41c3-a4d4-8cc8d1bb1c14');
 const p=(from,to,title,text,sources,approx=true)=>({from,to,title,text,sources,period:L((approx?'ок. ':'')+from+'–'+(to===1300?'1299':to),(approx?'c. ':'')+from+'–'+(to===1300?'1299':to),(approx?'болж. ':'')+from+'–'+(to===1300?'1299':to))});
 const entry=(id,region,kind,coord,name,phases)=>c.entries.push({id,region,kind,coord,name,phases});
 entry('copan','north','state',[-89.142,14.838],L('Царство Копан','Kingdom of Copán','Копан падышалыгы'),[
  p(610,738,L('Династический центр долины','Dynastic centre of the valley','Өрөөндүн династиялык борбору'),L('Копан — политический и религиозный центр своей долины и одного из царств майя. Династия возводит храмы, дворцы и монументы с надписями. Киригуа в долине Мотагуа находится в орбите Копана. На карте выделено ядро царства в долине Копана.','Copán is the political and religious centre of its valley and one of the Maya kingdoms. Its dynasty builds temples, palaces and inscribed monuments. Quiriguá in the Motagua Valley lies within Copán’s orbit. The map highlights the kingdom’s core in the Copán Valley.','Копан — өз өрөөнүнүн жана майя падышалыктарынын биринин саясий жана диний борбору. Династия ибадатканаларды, сарайларды жана жазуулары бар эстеликтерди курат. Мотагуа өрөөнүндөгү Киригуа Копандын таасиринде болот. Картада падышалыктын Копан өрөөнүндөгү өзөгү белгиленген.'),['copan','quirigua']),
  p(738,900,L('Копан после отделения Киригуа','Copán after Quiriguá’s independence','Киригуа бөлүнгөндөн кийинки Копан'),L('В 738 году Киригуа становится самостоятельным царством. Копан продолжает существовать как центр своей долины: сохраняются городской центр, храмы и монументальное строительство. К концу классического периода город приходит в упадок; его оставляют в начале X века.','Quiriguá becomes an independent kingdom in 738. Copán continues as the centre of its own valley, with its urban centre, temples and monumental construction. The city declines at the end of the Classic period and is abandoned in the early tenth century.','738-жылы Киригуа өз алдынча падышалыкка айланат. Копан өз өрөөнүнүн борбору бойдон калат: шаар борбору, ибадатканалар жана ири курулуштар сакталат. Классикалык доордун аягында шаар начарлап, X кылымдын башында ташталат.'),['copan','quirigua'])]);
 entry('mississippian','north','culture',[-88.5,35.8],L('Миссисипские общества','Mississippian societies','Миссисипи коомдору'),[
  p(900,1050,L('Центры речных долин','River-valley centres','Дарыя өрөөндөрүнүн борборлору'),L('В долинах Миссисипи и на юго-востоке растут земледельческие общества с насыпными платформами и властью вождей. Окмалги — один из ранних крупных центров.','Farming societies with platform mounds and chiefly authority grow in the Mississippi valleys and Southeast. Ocmulgee is an early major centre.','Миссисипи өрөөндөрүндө жана түштүк-чыгышта дөбөлөрү жана башчылары бар дыйкан коомдору өсөт. Окмалги — алгачкы чоң борборлордун бири.'),['mississippian']),
  p(1050,1300,L('Сеть самостоятельных вождеств','Network of independent chiefdoms','Өз алдынча башчылыктардын тармагы'),L('Кахокия, Маундвилл и другие центры возглавляют отдельные политические общества. Торговля, соперничество и общие ритуальные традиции связывают долины Миссисипи, Теннесси и соседние земли.','Cahokia, Moundville and other centres lead separate political societies. Trade, rivalry and ritual traditions connect the Mississippi and Tennessee valleys and neighbouring regions.','Кахокия, Маундвилл жана башка борборлор өзүнчө саясий коомдорду жетектейт. Соода, атаандаштык жана жөрөлгөлөр Миссисипи, Теннесси өрөөндөрүн жана коңшу жерлерди байланыштырат.'),['mississippian'])]);
 entry('caddo','north','culture',[-94,33.3],L('Общества каддо','Caddo societies','Каддо коомдору'),[
  p(800,1000,L('Становление центров каддо','Emerging Caddo centres','Каддо борборлорунун түзүлүшү'),L('В бассейне Ред-Ривер складываются поселения с церемониальными насыпями и наследственными лидерами.','Settlements with ceremonial mounds and hereditary leaders develop in the Red River basin.','Ред-Ривер алабында жөрөлгө дөбөлөрү жана тукум куучу башчылары бар конуштар түзүлөт.'),['caddo']),
  p(1000,1200,L('Речные сети и новые общины','River networks and new communities','Дарыя тармактары жана жаңы жамааттар'),L('Поселения распространяются в восточном Техасе. Центры связаны долинами Ред-Ривер, Сабин и Нечес; отдельные общины сохраняют своих лидеров.','Settlements spread in eastern Texas. Centres are connected along the Red, Sabine and Neches rivers; individual communities retain their leaders.','Конуштар чыгыш Техаска тарайт. Борборлор Ред-Ривер, Сабин жана Нечес аркылуу байланышат; жамааттар өз башчыларын сактайт.'),['caddo']),
  p(1200,1300,L('Изменение сети поселений','Changing settlement networks','Конуштар тармагынын өзгөрүшү'),L('Средний период каддо отмечен переменами в размещении деревень, хозяйстве и керамике. Продолжают действовать несколько самостоятельных сетей центров.','The Middle Caddo period brings changes in village placement, economy and pottery. Several independent networks of centres continue.','Орто каддо мезгилинде айылдардын жайгашуусу, чарба жана карапа өзгөрөт. Борборлордун бир нече өз алдынча тармагы иштейт.'),['caddo'])]);
 entry('mabuyag','australia','landscape',[142.18,-9.95],L('Мабуяк · Торресов пролив','Mabuyag · Torres Strait','Мабуяк · Торрес кысыгы'),[
  p(600,1300,L('Островное земледелие','Island agriculture','Аралдык дыйканчылык'),L('На Мабуяке археоботаника выявила выращивание бананов и земледельческие террасы, создававшиеся уже в VI–VII веках. Остров связывает мир Австралии и Новой Гвинеи.','Archaeobotany on Mabuyag identifies banana cultivation and agricultural terraces already established in the sixth and seventh centuries. The island connects Australia and New Guinea.','Мабуякта археоботаника VI–VII кылымдарда эле банан өстүрүү жана дыйканчылык террасалары болгонун аныктаган. Арал Австралия менен Жаңы Гвинеяны байланыштырат.'),['mabuyag'])]);
 entry('mixtec','north','state',[-97.34,17.28],L('Миштекские царства','Mixtec kingdoms','Миштек падышалыктары'),[
  p(900,1080,L('Соперничающие династии Оахаки','Rival dynasties of Oaxaca','Оахаканын атаандаш династиялары'),L('Тилантонго, Хальтепек и другие царства связаны браками, союзами и войнами. Кодексы сохраняют их династическую историю.','Tilantongo, Jaltepec and other kingdoms are linked by marriages, alliances and warfare, recorded in pictorial codices.','Тилантонго, Хальтепек жана башка падышалыктар никелер, союздар жана согуштар аркылуу байланышкан. Кодекстер алардын династиялык тарыхын сактайт.'),['mixtecCodices']),
  p(1080,1120,L('Походы Восьми Оленя','Campaigns of Eight Deer','Сегиз Бугунун жортуулдары'),L('В конце XI — начале XII века Восемь Олень объединяет Тилантонго, Теосакоалько и Тутутепек. Завоевания и династические союзы расширяют его власть от нагорья к побережью.','In the late eleventh and early twelfth centuries Eight Deer unites Tilantongo, Teozacoalco and Tututepec. Conquests and dynastic alliances link the highlands and coast.','XI кылымдын аягында — XII кылымдын башында Сегиз Бугу Тилантонго, Теосакоалько жана Тутутепекти бириктирет. Жортуулдар жана династиялык союздар тоолор менен жээкти байланыштырат.'),['mixtecMuseum','mixtecCodices']),
  p(1120,1300,L('Региональные царства','Regional kingdoms','Аймактык падышалыктар'),L('Продолжается история отдельных царских домов. Оахака состоит из нескольких политических центров; владения Восьми Оленя не сохраняются как единое неизменное государство.','Separate royal houses continue. Oaxaca has several political centres; Eight Deer’s domains do not persist as one unchanging state.','Өз алдынча падышалык үйлөрдүн тарыхы уланат. Оахакада бир нече саясий борбор бар; Сегиз Бугунун ээликтери өзгөрбөгөн бирдиктүү мамлекет бойдон калбайт.'),['mixtecCodices'])]);
 entry('moundville','north','state',[-87.63,33.00],L('Маундвилл','Moundville','Маундвилл'),[
  p(1000,1200,L('Центр долины Блэк-Уорриор','Black Warrior Valley centre','Блэк-Уорриор өрөөнүнүн борбору'),L('В долине складывается общество с наследственной элитой и подчинёнными поселениями. Маундвилл становится его главным центром.','A society with hereditary elites and subordinate settlements develops in the valley, centred on Moundville.','Өрөөндө тукум куучу элитасы жана баш ийген конуштары бар коом түзүлөт. Маундвилл анын башкы борборуна айланат.'),['moundville']),
  p(1200,1300,L('Укреплённый политический центр','Fortified political centre','Чептүү саясий борбор'),L('В XIII веке площадь, платформенные насыпи и укрепления образуют спланированный центр власти и церемоний.','In the thirteenth century a plaza, platform mounds and fortifications form a planned centre of power and ceremony.','XIII кылымда аянт, дөбөлөр жана чептер бийлик менен жөрөлгөлөрдүн пландалган борборун түзөт.'),['moundville'])]);
 entry('casarabe','south','culture',[-64.88,-14.85],L('Касарабе','Casarabe','Касарабе'),[
  p(500,1400,L('Города и каналы Амазонии','Amazonian towns and canals','Амазониянын шаарлары жана каналдары'),L('В Льянос-де-Мохос существовала иерархическая сеть поселений с земляными платформами, дамбами и каналами. Котока и Ландивар были крупными центрами; изученная культурная область занимает около 4500 км².','The Llanos de Mojos supported a hierarchical settlement network with platforms, causeways and canals. Cotoca and Landívar were major centres; the known cultural area spans about 4,500 km².','Льянос-де-Мохосто дөбөлөрү, дамбалары жана каналдары бар иерархиялык конуштар тармагы болгон. Котока менен Ландивар чоң борборлор эле; изилденген маданий аймак 4500 км² чамасында.'),['casarabe'])]);
 entry('alwa','africa','state',[32.65,15.52],L('Алва — Алодия','Alwa — Alodia','Алва — Алодия'),[
  p(600,1500,L('Царство со столицей в Собе','Kingdom centred on Soba','Борбору Соба болгон падышалык'),L('Южное христианское царство Нубии занимает земли у слияния Нилов. Столица Соба имеет церкви, ремесленные и жилые кварталы.','The southern Christian Nubian kingdom occupies the region of the Nile confluence. Its capital Soba has churches, workshops and residential districts.','Нубиянын түштүгүндөгү христиан падышалыгы Нилдер кошулган аймакта жайгашкан. Борбору Собада чиркөөлөр, өнөрканалар жана турак жайлар болгон.'),['alwa'])]);
 // Compact dynasty accounts. The regional geometry below is a separate editorial reconstruction.
 const dynasty=(id,coord,name,from,to,title,text,source='maghreb')=>entry(id,'africa','state',coord,name,[p(from,to,title,text,[source],false)]);
 dynasty('zirid',[10.1,35.68],L('Зириды','Zirids','Зириддер'),972,1148,L('Ифрикия','Ifriqiya','Ифрикия'),L('Зириды управляют Ифрикией; после разрыва с Фатимидами и вторжений XI века их власть сокращается до приморских центров.','The Zirids govern Ifriqiya; after their break with the Fatimids and eleventh-century invasions, their power contracts to coastal centres.','Зириддер Ифрикияны башкарат; Фатимиддер менен ажырашуудан жана XI кылымдагы басып кирүүлөрдөн кийин бийлиги жээк борборлоруна кыскарат.'));
 dynasty('hammadid',[4.79,35.81],L('Хаммадиды','Hammadids','Хаммадиддер'),1014,1152,L('Центральный Магриб','Central Maghreb','Борбордук Магриб'),L('Династия с центрами в Кала-Бени-Хаммаде и Беджае правит центральным Магрибом до завоевания Альмохадами.','The dynasty centred on Qal‘at Bani Hammad and Béjaïa rules the central Maghreb until the Almohad conquest.','Кала-Бени-Хаммад жана Бежая борборлоруна таянган династия Альмохаддар каратып алганга чейин борбордук Магрибди башкарат.'));
 dynasty('almoravid',[-7.98,31.63],L('аль-Мурабитун · Альморавиды','al-Murabitun · Almoravids','аль-Мурабитун · Альморавиддер'),1062,1147,L('Магриб и аль-Андалус','Maghreb and al-Andalus','Магриб жана аль-Андалус'),L('Альморавиды объединяют Марокко, часть Сахары и западного Алжира. С 1090 года они подчиняют государства аль-Андалуса.','The Almoravids unite Morocco, parts of the Sahara and western Algeria. From 1090 they take over the states of al-Andalus.','Альморавиддер Мароккону, Сахаранын жана батыш Алжирдин бир бөлүгүн бириктирет. 1090-жылдан тартып аль-Андалустун мамлекеттерин каратышат.'),'murabitun');
 dynasty('almohad',[-7.98,31.63],L('аль-Муваххидун · Альмохады','al-Muwahhidun · Almohads','аль-Муваххидун · Альмохаддар'),1147,1269,L('Объединение и распад державы','Unification and fragmentation','Мамлекеттин биригиши жана ыдырашы'),L('Завоевания объединяют Магриб и часть аль-Андалуса. После поражения 1212 года и отделения региональных династий владения сокращаются.','Conquests unite the Maghreb and part of al-Andalus. After the defeat of 1212 and regional dynasties breaking away, the realm contracts.','Жортуулдар Магрибди жана аль-Андалустун бир бөлүгүн бириктирет. 1212-жылдагы жеңилүүдөн жана аймактык династиялардын бөлүнүшүнөн кийин ээликтер кыскарат.'),'murabitun');
 dynasty('hafsid',[10.18,36.8],L('Хафсиды','Hafsids','Хафсиддер'),1229,1300,L('Государство в Ифрикии','State in Ifriqiya','Ифрикия мамлекети'),L('Хафсиды утверждают власть в восточном Магрибе со столицей в Тунисе.','The Hafsids establish power in the eastern Maghreb, with Tunis as their capital.','Хафсиддер борбору Тунис болгон чыгыш Магрибде бийлигин орнотот.'));
 dynasty('zayyanid',[-1.32,34.88],L('Зайяниды','Zayyanids','Зайяниддер'),1236,1300,L('Тлемсен','Tlemcen','Тлемсен'),L('Тлемсен становится центром самостоятельной династии в центральном Магрибе.','Tlemcen becomes the centre of an independent dynasty in the central Maghreb.','Тлемсен борбордук Магрибдеги өз алдынча династиянын борборуна айланат.'));
 dynasty('marinid',[-5,34.04],L('Мариниды','Marinids','Мариниддер'),1269,1300,L('Марокко после Альмохадов','Morocco after the Almohads','Альмохаддардан кийинки Марокко'),L('Взятие Марракеша завершает власть Альмохадов. Мариниды правят из Феса.','The capture of Marrakesh ends Almohad rule. The Marinids govern from Fez.','Марракештин алынышы Альмохад бийлигин аяктатат. Мариниддер Фестен башкарат.'));

 const old=c.areas; c.areas=[];
 const A=(id,from,to,kind,color,polygons,name=null,note=null,sources=null)=>{
  const e=c.entries.find(e=>e.id===id),phase=e.phases.find(p=>from>=p.from&&from<p.to);
  if(!phase)throw Error('Missing territory phase '+id+' '+from);
  if(typeof polygons[0][0]==='number')polygons=[polygons];
  c.areas.push({id:id+'-'+from,entry:id,from,to,kind,color,polygons,points:polygons[0],name:name||e.name,title:note||phase.title,text:phase.text,sources:sources||phase.sources,approx:true,geometry:'schematic-regional-outline'});
 };
 // NORTH AMERICA: each named polity remains distinct from its wider cultural sphere.
 A('mississippian',900,1050,'cultural','#a5aa73',[[[-92.8,33],[-92.8,37.7],[-90,39],[-88.3,37],[-88,34],[-90,32]], [[-85.4,31.6],[-85.3,33.9],[-82.5,34],[-81.6,32.4],[-83.3,31.3]]]);
 A('mississippian',1050,1300,'cultural','#a5aa73',[[-94,32],[-93,37],[-91.5,40.8],[-88.8,40.8],[-86.5,38],[-82,36.6],[-80.5,33.2],[-82,30.2],[-87,30.4],[-90,31.2]],null,L('Долины Миссисипи, Теннесси и юго-восток','Mississippi, Tennessee and southeastern valleys','Миссисипи, Теннесси жана түштүк-чыгыш өрөөндөрү'));
 A('caddo',800,1000,'cultural','#ab8970',[[-95.6,31.8],[-95.7,34.5],[-94,35],[-92.2,34],[-92,32],[-94,31.4]]);
 const caddoRegion=[[-96,30.8],[-96,34.6],[-94,35],[-92.2,34],[-92,31.7],[-94.3,30.5]];
 A('caddo',1000,1200,'cultural','#ab8970',caddoRegion);A('caddo',1200,1300,'cultural','#9b795f',caddoRegion);
 A('palenque',610,900,'polity','#ae7660',[[-93.2,17.4],[-92.7,18.2],[-91.8,18.1],[-91.3,17.3],[-92,16.8]]);
 A('calakmul',610,695,'influence','#837ca6',[[-91.8,18.5],[-90.7,19.4],[-88.7,19.1],[-88.3,17.7],[-89.4,16.2],[-90.8,16.4]],null,L('Сеть зависимых царств','Network of dependent kingdoms','Көз каранды падышалыктардын тармагы'),['mayaPolitics']);
 A('calakmul',695,900,'polity','#837ca6',[[-90.8,17.8],[-90.4,18.8],[-89.1,18.7],[-89.2,17.5]],null,L('После поражения от Тикаля','After defeat by Tikal','Тикалдан жеңилгенден кийин'),['mayaPolitics']);
 A('tikal',610,695,'polity','#bd9459',[[-90.1,16.5],[-90,17.5],[-89.2,17.6],[-88.9,16.8]]);
 A('tikal',695,900,'influence','#bd9459',[[-90.9,16.5],[-90.4,17.5],[-89.8,17.8],[-88.6,17.3],[-88.5,16.2],[-89.7,15.9]],null,L('Возрождение влияния Тикаля','Tikal’s renewed influence','Тикалдын таасиринин калыбына келиши'),['mayaPolitics']);
 // The valley core is separate from Quiriguá's dependency, which ends in 738.
 // Its outline is an approximate local reconstruction, not Copán's entire sphere of rule.
 const copanValley=[[-89.27,14.79],[-89.29,14.87],[-89.20,14.92],[-89.05,14.90],[-89.00,14.83],[-89.12,14.76]];
 A('copan',610,738,'polity','#c18b74',copanValley,null,L('Политическое ядро долины Копана','Political core of the Copán Valley','Копан өрөөнүнүн саясий өзөгү'));
 A('copan',738,900,'polity','#c18b74',copanValley);
 A('quirigua',610,738,'polity','#87966b',[[-89.5,14.9],[-89.6,15.4],[-88.5,15.6],[-88.3,15]],L('Киригуа · под властью Копана','Quiriguá · under Copán','Киригуа · Копандын бийлигинде'));
 A('quirigua',738,850,'polity','#5b9b8b',[[-89.4,15.1],[-89.35,15.5],[-88.5,15.6],[-88.5,15.2]],L('Киригуа · самостоятельное царство','Quiriguá · independent kingdom','Киригуа · өз алдынча падышалык'));
 A('chichen',610,900,'polity','#74a68d',[[-89.2,20],[-89.4,21.5],[-87.6,21.6],[-87.7,20.4]]);
 A('chichen',900,1200,'influence','#74a68d',[[-90.6,20.1],[-90.2,21.6],[-86.7,21.7],[-87.2,19.7],[-88.9,19.6]],null,L('Влияние в северном Юкатане','Influence in northern Yucatán','Түндүк Юкатандагы таасир'));
 A('mayapan',1200,1300,'polity','#aa6d98',[[-90.5,20],[-90.2,21.5],[-87.5,21.5],[-87.9,19.8],[-89.2,19.5]]);
 A('tula',900,1000,'polity','#9b7259',[[-100.1,19.6],[-100,20.9],[-98.9,21.1],[-98.2,20.2],[-98.7,19.3]]);
 A('tula',1000,1150,'influence','#9b7259',[[-101.6,20],[-101,21.3],[-99.6,22],[-98,21.1],[-97.5,19.1],[-99.2,18.6],[-100.8,19.1]],null,L('Тула и Центральная Мексика','Tula and central Mexico','Тула жана Борбордук Мексика'));
 const mixtecHigh=[[-98.1,16.8],[-98,18],[-97,18.2],[-96.6,17.2],[-97.2,16.6]],mixtecCoast=[[-98.4,16.4],[-97.9,17],[-96.9,16.7],[-96.2,15.9],[-97.1,15.6],[-98.2,15.9]];
 A('mixtec',900,1080,'cultural','#b09568',mixtecHigh);
 A('mixtec',1080,1120,'influence','#b45c59',[mixtecHigh,mixtecCoast],L('Владения и союзы Восьми Оленя','Eight Deer’s domains and alliances','Сегиз Бугунун ээликтери жана союздары'));
 A('mixtec',1120,1300,'cultural','#b09568',[mixtecHigh,mixtecCoast]);
 A('cahokia',800,1050,'settlement','#65958a',[[-90.8,38.2],[-90.6,39.1],[-89.7,39.2],[-89.5,38.5],[-90.1,38.1]]);
 A('cahokia',1050,1150,'influence','#478d88',[[-91.1,37.6],[-91.1,38.8],[-90.4,39.7],[-89.4,39.6],[-88.8,38.7],[-89.6,37.7]],null,L('Рост столицы и земледельческих поселений','Capital and farming settlements expand','Борбор менен дыйкан конуштарынын өсүшү'),['cahokia','cahokiaChange']);
 A('cahokia',1150,1300,'polity','#478d88',[[-90.8,38.2],[-90.7,39.2],[-89.7,39.2],[-89.6,38.4]],null,L('Сокращение сельской округи','Contraction of the rural hinterland','Айылдык аймактын кыскарышы'),['cahokiaChange','cahokia']);
 A('moundville',1000,1200,'settlement','#c79962',[[-88.1,32.5],[-88.1,33.4],[-87.2,33.6],[-87.1,32.8]]);
 A('moundville',1200,1300,'polity','#b37f48',[[-88.2,32.4],[-88.1,33.6],[-87.3,33.9],[-86.9,33],[-87.5,32.4]]);
 A('chaco',850,1050,'cultural','#b18965',[[-109.1,35.5],[-109,37],[-107.1,37],[-106.8,35.5]]);
 A('chaco',1050,1150,'influence','#b18965',[[-110,35],[-110,37.4],[-108.5,37.5],[-106.2,36.8],[-106.1,34.8],[-108,34.4]],null,L('Сеть больших домов и дорог','Great-house and road network','Чоң үйлөр жана жолдор тармагы'));
 A('chaco',1150,1250,'cultural','#b18965',[[-109.3,35.7],[-109.1,37.2],[-107.2,37.3],[-106.6,36]],null,L('После упадка центра Чако','After Chaco’s central decline','Чако борборунун начарлашынан кийин'));
 A('mesa',610,750,'cultural','#9b9e68',[[-110.3,36.6],[-109.5,38.1],[-107.4,38.1],[-107,37],[-108.5,36.5]]);
 A('mesa',750,1180,'cultural','#9b9e68',[[-110.7,36.6],[-110,38.3],[-107.3,38.2],[-107,37],[-108.6,36.5]]);
 A('mesa',1180,1300,'settlement','#999153',[[-109.2,36.9],[-109.2,37.8],[-108,37.8],[-107.8,37]],null,L('Поселения позднего периода; переселения в XIII веке','Late settlements; thirteenth-century migrations','Кийинки конуштар; XIII кылымдагы көчүүлөр'));
 A('hohokam',610,1100,'cultural','#c59988',[[-113.6,31.7],[-113.6,34],[-111.2,34.6],[-110,32.5],[-111.2,31.6]]);
 A('hohokam',1100,1300,'cultural','#b57e6e',[[-112.8,32.5],[-112.8,34],[-111,34.2],[-110.4,32.1],[-111.3,31.7]],null,L('Классический период: укрупнение поселений','Classic period: settlement concentration','Классикалык мезгил: конуштардын топтолушу'));
 A('paquime',700,1200,'settlement','#bbaa76',[[-108.8,29.2],[-108.7,31.5],[-106.9,31.4],[-106.7,29.1]]);
 A('paquime',1200,1300,'influence','#a49455',[[-109,28.9],[-109,31.7],[-107,32],[-105.9,30.5],[-106.4,28.7]],null,L('Пакиме как региональный центр','Paquimé as a regional centre','Аймактык борбор болгон Пакиме'));
 A('effigy',650,1200,'cultural','#899c82',[[-93.5,41.5],[-93,44.8],[-89,45],[-88,43],[-90,41.5]]);
 A('taino',1000,1300,'cultural','#a29e65',[[[-75.3,19.4],[-74,20.1],[-71,19.9],[-68.2,18.8],[-68.7,17.8],[-72.3,18]], [[-67.4,17.8],[-67.3,18.6],[-65.4,18.5],[-65.5,17.8]]]);

 // SOUTH AMERICA: no fifteenth-century Chimú or Inca extent is back-projected.
 A('moche',610,800,'cultural','#bb985f',[[-80.5,-5.4],[-79.7,-5.2],[-78.4,-7.5],[-77.5,-9.1],[-78.1,-9.3],[-79.2,-8.2],[-80.2,-6.8]]);
 A('wari',610,700,'polity','#8f7fa2',[[-75.6,-12],[-74,-11.7],[-73.1,-13.7],[-73.9,-15],[-75.4,-14]]);
 A('wari',700,1000,'influence','#8f7fa2',[[-78.2,-6.8],[-76.7,-7.8],[-75.6,-9.7],[-73.5,-11.3],[-71.6,-13.1],[-70.7,-15.6],[-70.7,-17.6],[-72,-17.1],[-73.8,-15.9],[-75.7,-14.5],[-76.8,-12.1],[-78.1,-9.2]],null,L('Сеть провинциальных центров Уари','Wari provincial network','Уаринин аймактык борборлор тармагы'));
 A('tiwanaku',610,800,'polity','#7b9d9c',[[-70.3,-14.8],[-68.6,-14.5],[-67.5,-16.5],[-68.1,-18],[-69.5,-17.4],[-70.6,-16.1]]);
 A('tiwanaku',800,1000,'influence','#7b9d9c',[[[-71.8,-16.7],[-70.7,-15.5],[-69.9,-14.5],[-68.3,-14.4],[-66.5,-16.5],[-65.5,-17],[-65.7,-18],[-68.5,-18.5],[-70.6,-18.3]]],null,L('Титикака и связанные долины','Titicaca and connected valleys','Титикака жана байланышкан өрөөндөр'));
 A('tiwanaku',1000,1150,'cultural','#9fb8a9',[[-70.4,-15.4],[-69.4,-14.9],[-68.2,-16],[-68.3,-17.4],[-69.5,-17.2]],null,L('Общины после распада политического центра','Communities after political fragmentation','Саясий борбор ыдырагандан кийинки жамааттар'));
 A('sican',800,1100,'polity','#cca26c',[[-80.2,-5.6],[-79.3,-5.5],[-78.9,-6.7],[-79.2,-7.2],[-80,-7],[-80.3,-6.3]]);
 A('sican',1100,1300,'polity','#c5b879',[[-80.1,-6],[-79.3,-6],[-79,-6.8],[-79.4,-7.1],[-80,-6.8]],L('Сикан / Ламбайеке · Тукуме','Sicán / Lambayeque · Túcume','Сикан / Ламбайеке · Тукуме'));
 // Keep the conservative Jequetepeque / Moche valley outlines of the earlier review.
 for(const a of old.filter(a=>a.entry==='chimu'))A(a.entry,a.from,a.to,'polity','#af694f',a.points,null,a.from===1200?L('Подчинение долины Хекетепеке','Control of the Jequetepeque Valley','Хекетепеке өрөөнүн каратуу'):null,['andes','chimu']);
 A('chincha',1150,1300,'polity','#c09b59',[[-76.5,-12.9],[-75.8,-12.7],[-75.3,-13.7],[-75.8,-14.1],[-76.4,-13.7]]);
 A('ichma',1000,1300,'polity','#ca897b',[[-77.3,-11.5],[-76.6,-11.4],[-76.2,-12.5],[-76.7,-12.7],[-77.1,-12.3]]);
 A('muisca',800,1200,'cultural','#bbad70',[[-74.4,4.5],[-73.7,4.3],[-72.6,5.8],[-73.3,6.2],[-74.1,5.4]]);
 A('muisca',1200,1300,'cultural','#ad975b',[[-74.5,4.3],[-73.7,4.2],[-72.5,5.5],[-72.8,6.6],[-73.5,6.5],[-74.2,5.5]],null,L('Поздний период: укрепление местных вождеств','Late period: growing local chiefdoms','Кийинки мезгил: жергиликтүү башчылыктардын өсүшү'));
 A('sanagustin',610,800,'cultural','#c09587',[[-77.2,1.2],[-76.8,2.7],[-75.7,2.5],[-75.5,1.4],[-76.4,.8]]);
 A('sanagustin',800,1300,'settlement','#adac85',[[-77,1.2],[-76.8,2.4],[-75.9,2.3],[-75.9,1.3]],null,L('Поселения после монументального периода','Settlements after the monumental period','Эстеликтер мезгилинен кийинки конуштар'));
 A('marajo',610,1300,'cultural','#7f9b69',[[-50.9,-.6],[-50.2,-.05],[-48.6,-.25],[-48.6,-1.2],[-50,-1.8],[-50.7,-1.25]]);
 A('casarabe',610,1300,'cultural','#699d73',[[-65.05,-14.7],[-64.5,-14.7],[-64.3,-15.25],[-64.9,-15.4],[-65.1,-15.1]]);
 A('araucania',610,1000,'cultural','#88a57e',[[-74.1,-37.5],[-71,-37.5],[-71,-40.5],[-72.4,-41.8],[-74,-41.4]],L('Питрен','Pitrén','Питрен'));
 A('araucania',1000,1300,'cultural','#759260',[[-73.9,-36.6],[-71.5,-36.7],[-71.3,-39.6],[-73,-40.3],[-74,-39.4]],L('Эль-Вергель','El Vergel','Эль-Вергель'));

 // AFRICA: approximate regional possession, not modern national boundaries.
 const morocco=[[-12,28],[-10.4,31.2],[-9,33],[-6,36],[-2,35.2],[-1,33],[-3,31],[-6,29],[-9,27.5]];
 const westMaghreb=[[-12,28],[-10.4,31.2],[-9,33],[-6,36],[-2,35.2],[3,37],[3.8,35],[1,33],[-3,31],[-6,29],[-9,27.5]];
 const ifriqiya=[[6.5,36.8],[10.9,37.5],[12,33.7],[17,31.1],[16,29.9],[11,31],[8.3,32.5],[6.1,34.3]];
 const central=[[0,35.5],[4,37],[7.4,37],[8,35],[6,33.2],[2,33]];
 const andalus=[[-9.5,37],[-9.2,39.4],[-6.9,40.2],[-5,39],[-2.2,39.9],[.7,39.8],[.2,38.3],[-2,36.4],[-5.7,35.9],[-7.9,36.7]];
 // Dissolved outlines retain the exact union of the existing regional pieces.
 // A single political realm must not display the pieces' internal construction seams.
 const westCentralMaghreb=[[-12,28],[-10.4,31.2],[-9,33],[-6,36],[-2,35.2],[3,37],[3.1304347826,36.6739130435],[4,37],[7.4,37],[8,35],[6,33.2],[2,33],[1.6363636364,33.4545454545],[1,33],[-3,31],[-6,29],[-9,27.5]];
 const unifiedMaghreb=[[-12,28],[-10.4,31.2],[-9,33],[-6,36],[-2,35.2],[3,37],[3.1304347826,36.6739130435],[4,37],[7.4,37],[7.4162689805,36.9457700651],[10.9,37.5],[12,33.7],[17,31.1],[16,29.9],[11,31],[8.3,32.5],[6.6878306878,33.819047619],[6,33.2],[2,33],[1.6363636364,33.4545454545],[1,33],[-3,31],[-6,29],[-9,27.5]];
 const centralIfriqiya=[[7.4162689805,36.9457700651],[10.9,37.5],[12,33.7],[17,31.1],[16,29.9],[11,31],[8.3,32.5],[6.6878306878,33.819047619],[6,33.2],[2,33],[0,35.5],[4,37],[7.4,37]];
 A('kairouan',800,909,'polity','#97a774',ifriqiya,L('Аглабиды · Ифрикия','Aghlabids · Ifriqiya','Аглабиддер · Ифрикия'));
 A('zirid',972,1014,'polity','#b29781',centralIfriqiya);
 A('zirid',1014,1057,'polity','#b29781',ifriqiya);
 A('zirid',1057,1148,'polity','#b29781',[[9.5,36.5],[11.2,36.2],[11,34.3],[10.1,34]],null,L('Прибрежные владения после утраты Кайруана','Coastal domains after the loss of Kairouan','Кайруандан айрылгандан кийинки жээк ээликтери'));
 A('hammadid',1014,1152,'polity','#a68fbc',central);
 A('almoravid',1062,1090,'polity','#6c9a85',westMaghreb);
 A('almoravid',1090,1147,'polity','#6c9a85',[westMaghreb,andalus],null,L('Магриб и владения в аль-Андалусе','Maghreb and domains in al-Andalus','Магриб жана аль-Андалустагы ээликтер'));
 A('almohad',1147,1152,'polity','#b39b5e',[westMaghreb,andalus]);
 A('almohad',1152,1159,'polity','#b39b5e',[westCentralMaghreb,andalus]);
 A('almohad',1159,1229,'polity','#b39b5e',[unifiedMaghreb,andalus],null,L('Объединённый Магриб; после 1212 года — утрата влияния в Иберии','Unified Maghreb; declining Iberian power after 1212','Бириккен Магриб; 1212-жылдан кийин Ибериядагы таасирдин азайышы'));
 A('almohad',1229,1236,'polity','#b39b5e',westCentralMaghreb);
 A('almohad',1236,1269,'influence','#b39b5e',morocco,null,L('Остаточные владения в Марокко','Remaining domains in Morocco','Мароккодогу калган ээликтер'));
 A('hafsid',1229,1300,'polity','#b7866a',ifriqiya);
 A('zayyanid',1236,1300,'polity','#869bb3',[[0,35.8],[3.2,36.8],[3.8,35],[1.7,32.7],[-1.7,32.3],[-2,35.3]]);
 A('marinid',1269,1300,'polity','#a47779',morocco);
 A('ghana',800,1000,'polity','#bc965e',[[-11.5,14.5],[-10.5,17.9],[-8,18.2],[-6.5,16.9],[-7,14.6],[-9.2,13.8]]);
 A('ghana',1000,1100,'influence','#bc965e',[[-13,13.5],[-12.7,17],[-10,19],[-7,18.9],[-5.5,16.5],[-6.5,13.8],[-9,12.7],[-11.5,12.8]],null,L('Торговая держава Западного Судана','Trading power of the Western Sudan','Батыш Судандын соода державасы'));
 A('ghana',1100,1200,'polity','#bc965e',[[-10.8,14.8],[-10,17.8],[-8,18],[-6.8,16.4],[-7.5,14.5]],null,L('Ослабление регионального господства','Declining regional dominance','Аймактык үстөмдүктүн начарлашы'));
 A('mali',1230,1250,'polity','#829e63',[[-11.5,10.7],[-9,10],[-6.8,11.4],[-6.5,13.5],[-8.1,14.5],[-10.6,13.8],[-12,12.2]]);
 A('mali',1250,1300,'influence','#829e63',[[-15.2,12],[-13.4,14.8],[-10.5,16.2],[-7.6,16.7],[-5,15.9],[-4.2,13.5],[-6.5,11],[-9,10],[-12,10.8]],null,L('Расширение в бассейнах Сенегала и Нигера','Expansion in the Senegal and Niger basins','Сенегал жана Нигер алаптарындагы кеңейүү'));
 A('kanem',900,1200,'polity','#ba8577',[[13.5,12.5],[15.5,12],[18,14.3],[17.8,17],[15.5,18],[13.5,16.1]]);
 A('kanem',1200,1300,'influence','#ba8577',[[12.8,12.5],[16.3,11.8],[19,14.5],[18,19],[16,24],[13,24],[13.7,19],[12.4,16]],null,L('Канем и северные пути к Феццану','Kanem and northern routes to Fezzan','Канем жана Феццанга түндүк жолдор'));
 A('dongola',610,700,'polity','#ad8763',[[29.3,16],[32,16.1],[33.2,18.7],[32.2,20],[29.6,20.3],[28.8,18.3]],L('Макурия','Makuria','Макурия'));
 A('dongola',700,1300,'polity','#ad8763',[[29.3,16],[32,16.1],[33.2,18.7],[32,20.5],[33.5,23.7],[31.3,24.1],[29.8,21.6],[29.1,19.5],[28.8,18.3]],L('Макурия и Нобадия','Makuria and Nobadia','Макурия жана Нобадия'),null,['dongola','alwa']);
 A('alwa',610,1300,'polity','#8fa5ae',[[30.5,12.5],[33.9,12],[35.3,14.3],[33.8,16.1],[31.3,16],[30.4,14.5]]);
 A('ethiopia',900,1150,'cultural','#93a878',[[37.3,10.5],[39.5,10.4],[40.2,13.2],[39.4,14.3],[37.5,13.6]]);
 A('ethiopia',1150,1270,'polity','#93a878',[[37.4,10],[39.7,9.8],[40.6,12],[39.5,14],[37.5,13.4]],L('Загве · аль-Хабаша','Zagwe · al-Habasha','Загве · аль-Хабаша'));
 A('ethiopia',1270,1300,'polity','#879a58',[[37.5,8.8],[39.9,8.7],[40.6,11.7],[39.5,13.4],[37.4,12.8]],L('Соломонова династия · аль-Хабаша','Solomonic dynasty · al-Habasha','Сулайман династиясы · аль-Хабаша'));
 A('ife',800,1100,'settlement','#b89f82',[[3.8,6.8],[4.1,8.2],[5.5,8.2],[5.8,7],[4.8,6.7]]);
 A('ife',1100,1300,'polity','#b88a62',[[3.8,6.8],[4.1,8.2],[5.5,8.2],[5.8,7],[4.8,6.7]]);
 A('igbo',800,1000,'cultural','#c2aa6e',[[6.5,5.6],[6.5,6.6],[7.6,6.6],[7.6,5.6]]);
 A('djenne',610,1300,'settlement','#bca977',[[-5.4,13.2],[-5.2,14.9],[-3.8,15.5],[-3.5,14.4],[-4.4,13.3]]);
 A('kilwa',800,1200,'settlement','#b49b85',[[39.1,-8.4],[39.9,-8.4],[39.9,-9.5],[39.1,-9.5]]);
 A('kilwa',1200,1300,'polity','#bc8568',[[39.1,-8.4],[39.9,-8.4],[39.9,-9.5],[39.1,-9.5]],L('Килва · город-государство','Kilwa · city-state','Килва · шаар-мамлекет'));
 A('mapungubwe',1220,1300,'polity','#ad8c64',[[27.8,-23],[28,-21.3],[30,-20.8],[31.3,-21.7],[30.7,-23.2],[29,-23.5]]);
 A('zimbabwe',1100,1250,'settlement','#9ca274',[[29.7,-21],[31.9,-21],[32.4,-19.2],[30.3,-18.8]]);
 A('zimbabwe',1250,1300,'influence','#869464',[[28.9,-21.7],[31.8,-21.7],[33.3,-20.3],[32.5,-18.3],[30.2,-17.8],[28.9,-19.3]],null,L('Рост Большого Зимбабве','Growth of Great Zimbabwe','Улуу Зимбабвенин өсүшү'));
 A('madagascar',800,1000,'settlement','#a2a67a',[[47.7,-12.8],[49,-12],[50.4,-14.3],[49.8,-15.7],[48.7,-15.5],[47.3,-14.1]]);
 A('madagascar',1000,1300,'settlement','#a2a67a',[[47.7,-12.8],[49,-12],[50.4,-14.3],[49.8,-16.9],[49.3,-19],[47.7,-18.2],[46.3,-16.7],[47.3,-14.1]],null,L('Распространение поселений','Settlement dispersal','Конуштардын таралышы'));

 // ARCTIC: populated coastal zones, never sovereignty over the ice sheet.
 A('dorset',800,1300,'cultural','#88a9b9',[[[-73,75],[-61,75],[-52,78],[-40,81],[-40,83],[-57,83],[-69,80]], [[-110,69],[-94,69],[-78,72],[-77,76],[-91,78],[-107,75]]]);
 const norse=old.filter(a=>a.entry==='norse').map(a=>a.points);
 A('norse',985,1261,'settlement','#bb9776',norse,L('Скандинавские поселения','Norse settlements','Скандинав конуштары'));
 A('norse',1261,1300,'settlement','#bb7676',norse,L('Поселения под властью Норвегии','Settlements under Norway','Норвегияга караштуу конуштар'));
 const alaska=[[-169,64],[-160,64],[-146,68],[-139,69],[-139,72],[-156,72],[-166,69]];
 A('thule',1000,1200,'settlement','#73a6a4',alaska,null,null,['thule','thuleArrival']);
 A('thule',1200,1300,'settlement','#73a6a4',[alaska,[[-139,68],[-125,68],[-111,70],[-90,72],[-78,74],[-79,78],[-98,77],[-117,73],[-139,72]],[[-73,75],[-65,74.5],[-58,77],[-59,79],[-68,80],[-74,78]]],null,L('Распространение до Гренландии','Dispersal to Greenland','Гренландияга чейин таралуу'),['thule','thuleArrival']);

 // AUSTRALIA: well-attested cultural landscapes with long continuity, not fabricated states.
 A('budj',610,1300,'landscape','#ad8962',[[141.3,-37.7],[142.2,-37.7],[142.3,-38.4],[141.5,-38.5]],L('Будж-Бим · ландшафт гундитжмара','Budj Bim · Gunditjmara landscape','Будж-Бим · гундитжмара ландшафты'));
 A('kakadu',610,1300,'landscape','#bca57d',[[132,-11.9],[133.4,-12],[133.7,-14.2],[132,-14.2]],L('Какаду · культурный ландшафт','Kakadu · cultural landscape','Какаду · маданий ландшафт'));
 A('mabuyag',610,1300,'landscape','#aca271',[[142.13,-10],[142.23,-10],[142.23,-9.91],[142.13,-9.91]]);
 // OCEANIA: island settlement areas do not imply possession of the intervening ocean.
 A('kuk',610,1300,'landscape','#91aa75',[[143.9,-5.3],[145,-5.3],[145.2,-6.4],[144.1,-6.4]]);
 A('tonga',610,1200,'settlement','#caac74',[[[-175.5,-21.4],[-174.8,-21.4],[-174.8,-20.9],[-175.5,-20.9]], [[-174.5,-20.3],[-173.9,-20.3],[-173.9,-19.5],[-174.5,-19.5]]]);
 A('tonga',1200,1300,'polity','#ba975d',[[[-175.5,-21.4],[-174.8,-21.4],[-174.8,-20.9],[-175.5,-20.9]], [[-174.5,-20.3],[-173.9,-20.3],[-173.9,-19.5],[-174.5,-19.5]], [[-174.2,-18.9],[-173.6,-18.9],[-173.6,-18.5],[-174.2,-18.5]]],L('Туи-Тонга · островное ядро','Tuʻi Tonga · island core','Туи-Тонга · аралдык өзөк'));
 A('nanmadol',1200,1300,'polity','#9e8bad',[[158.05,6.75],[158.4,6.75],[158.4,7.03],[158.05,7.03]]);
 A('eastpolynesia',1025,1300,'settlement','#abac7d',[[[-149.9,-18],[-149,-18],[-149,-17.3],[-149.9,-17.3]],[[-151.9,-17],[-151.2,-17],[-151.2,-16.3],[-151.9,-16.3]]]);
 A('rapanui',1200,1300,'settlement','#b3a286',[[-109.6,-27.25],[-109.2,-27.25],[-109.2,-27],[-109.6,-27]]);
 A('hawaii',1200,1300,'settlement','#b3a286',[[[-160.4,21.7],[-159.2,21.7],[-159.2,22.3],[-160.4,22.3]],[[-158.5,20.3],[-155.9,20.3],[-155.9,21.8],[-158.5,21.8]],[[-156.2,18.8],[-154.8,18.8],[-154.8,20.3],[-156.2,20.3]]]);
 A('aotearoa',1250,1300,'settlement','#81a394',[[[172,-34],[175,-34],[177,-36],[176,-38],[174,-37]],[ [173.4,-40.8],[175,-40.8],[174.3,-42.5],[172.9,-42.3] ]],null,L('Ранние районы заселения','Early settlement areas','Алгачкы отурукташкан аймактар'));
 // Antarctica is a geographical reference; no human settlements are attested in this interval.
 A('antarctica',610,1300,'uninhabited','#bcc5c6',[[-180,-60],[180,-60],[180,-90],[-180,-90]]);
 // Preserve supplementary Eurasian cores; the main atlas supplies the political realms.
 for(const a of old.filter(a=>['angkor','bagan','chola'].includes(a.entry)))A(a.entry,a.from,a.to,'polity','#b4a278',a.points);
 // Context belonging to a later frame must describe that frame, not the founding phase.
 c.areas.find(a=>a.id==='mali-1250').text=L('Во второй половине XIII века Мали распространяет власть и торговые связи за пределы Мандена, в бассейны Сенегала и Нигера. Показана область влияния этого этапа; владения XIV века сюда не включены.','In the later thirteenth century Mali extends power and trade beyond Manden into the Senegal and Niger basins. The map shows this phase’s sphere of influence; fourteenth-century domains are excluded.','XIII кылымдын экинчи жарымында Мали бийлиги менен соода байланыштарын Манденден Сенегал жана Нигер алаптарына кеңейтет. Картада ушул мезгилдин таасир аймагы көрсөтүлгөн; XIV кылымдагы ээликтер кошулган эмес.');
 c.events.push({id:'eight-deer-campaigns',from:1080,to:1120,year:1100,approx:true,region:'north',kind:'war',entry:'mixtec',coord:[-97.34,17.28],title:L('Завоевания и союзы Восьми Оленя','Eight Deer’s conquests and alliances','Сегиз Бугунун жортуулдары жана союздары'),text:c.entries.find(e=>e.id==='mixtec').phases[1].text,sources:['mixtecCodices','mixtecMuseum'],route:[[-97.36,16.13],[-97.34,17.28]]});
 return c;
};
