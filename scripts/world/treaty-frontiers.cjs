'use strict';

const G = require('./cartography-geometry.cjs');
const iberia = require('./iberian-conquest.cjs');
const lowerAmur = require('./lower-amur.json').coordinates;
const coast = require('./coast-geometry.cjs');

const treatySources = 'Айгунский договор, 16/28 мая 1858 года, статья I; Пекинский договор, 2/14 ноября 1860 года, статья I. Карта Амурской страны, присоединённой к России по Айгунскому договору. Иркутск, 1860-е годы. Natural Earth. Rivers and Lake Centerlines, 1:10m.';
const jointName = ['Совместное владение на Уссури','Joint domain on the Ussuri','Уссуридеги биргелешкен ээлик'];
const jointText = ['В 1858 году левый берег Амура от Аргуни до устья закреплялся за Россией, правый берег до Уссури — за Цин. Земли от Уссури до моря оставались в совместном владении России и Цин до установления границы. Русские посты существовали и в этот переходный период. Статья I сохраняла для маньчжурских жителей части левобережья Амура местное управление Цин.', 'In 1858 Russia received the Amur’s left bank from the Argun to the sea. Qing China retained the right bank as far as the Ussuri. The lands from the Ussuri to the sea were held jointly by Russia and Qing China pending delimitation. Russian posts also existed during this interval. Article I preserved Qing local jurisdiction over Manchu residents of part of the Amur’s left bank.', '1858-жылы Аргундан деңизге чейин Амурдун сол жээги Россияга, ал эми Уссуриге чейинки оң жээги Цинге бекитилген. Чек ара аныкталганга чейин Уссуриден деңизге чейинки жерлер Россия менен Циндин биргелешкен ээлигинде калган. Бул мезгилде орус бекеттери да болгон. Биринчи берене Амурдун сол жээгинин бир бөлүгүндөгү манжур тургундары үчүн Циндин жергиликтүү башкаруусун сактаган.'];
const pekingText = ['Пекинский договор 1860 года закрепил границу по Амуру и Уссури. Земли между Уссури и морем перешли к России. К югу от озера Ханка граница шла по суше к реке Тумэнь.', 'The 1860 Convention of Peking confirmed the frontier along the Amur and Ussuri. The lands between the Ussuri and the sea passed to Russia. South of Lake Khanka the land boundary continued towards the Tumen River.', '1860-жылкы Пекин келишими Амур жана Уссури боюнча чек араны бекиткен. Уссури менен деңиздин ортосундагы жерлер Россияга өткөн. Ханка көлүнөн түштүктө чек ара кургактык аркылуу Тумэнь дарыясына жеткен.'];

// Reuse the independent political reference only for the mainland treaty
// corridor. Islands, other frontiers and the later civil-war period have their
// own dated records. The river centreline is geographic, not an island survey.
function amur(c, {revise,source,D,I}) {
  source('amurTreaties',treatySources,['https://www.vostlit.info/Texts/Dokumenty/China/XIX/1840-1860/Ajgun_traktat/text1.htm','https://www.loc.gov/item/2018694143/','https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/']);
  const reference = require('./amur-mainland.json');
  const window = reference.window;
  const russia = reference.russia;
  // Derive the other side from the same vertices, including river bends.
  const china = D(reference.domain,russia);
  const lowerRight = G.union([[...lowerAmur,[142,53.11],[142,41.8],[129.9,41.8],[130.1,44.0],[132.1,46.0],[133.0,47.4],[134.3,48.20]]]);
  const joint = I(russia,lowerRight);
  // Before Aigun, the coarse Qing sketch stopped inland along the maritime
  // coast. Restore that right-bank sector without moving the northern
  // watershed, assigning Sakhalin, or treating individual posts as borders.
  revise(['1789-qing'],1689,1858,'pre-aigun-maritime-coast','amurTreaties',old=>G.merge([old,joint]));
  revise(['early-russia','1789-russian-empire'],1689,1858,'pre-aigun-right-bank','amurTreaties',old=>D(old,joint));
  for(const [id,side] of [['1789-qing',china],['1789-russian-empire',russia]]) {
    revise([id],1858,1860,'aigun-mainland','amurTreaties',old=>G.merge([D(old,window),id==='1789-russian-empire'?D(side,joint):side]));
    revise([id],1860,1917,'peking-mainland','amurTreaties',old=>G.merge([D(old,window),side]));
  }
  const H=require('./late-helpers.cjs')(c,{start:1858,max:1860});
  const id='review-ussuri-joint';
  H.entry(id,'eurasia','region',[135.4,46.2],jointName,[H.phase(1858,1860,jointName,jointText,['amurTreaties'],{approx:false,frontierAdded:true})]);
  const area=H.area(id,1858,1860,joint,{kind:'influence',color:'#9b8970',sources:['amurTreaties']});
  area.frontierAdded=true;
  area.approx=false;
  area.statusLabel=['Совместное владение','Joint possession','Биргелешкен ээлик'];
  c.cartography.areas[area.id]=c.cartography.shapes.length;
  c.cartography.shapes.push(coast(joint));
  return joint;
}

function addEvent(c,id,year,coord,title,text,source,approx=false) {
  c.events.push({id,from:year,to:year,year,region:'eurasia',kind:'politics',coord,title,text,sources:[source],approx,frontierAdded:true});
}

// Keep the regional administrations visible when the Damascus caliphate ends.
// The last Andalusi governor and the garrison north of the Pyrenees had
// different successors, so their dated records cannot share one end year.
function successors(c) {
  const {prepare,D,I}=require('./legacy-frontiers.cjs');
  const legacy=prepare(require('./continuity.cjs').legacyData());
  const last=legacy.find(e=>e.id==='umayyad').keyframes.filter(f=>f.year<=749).at(-1);
  const mainland=D(I(last.polys,iberia.straitAndSea),iberia.narbonnais);
  c.sources.andalusiSuccession={title:'María Jesús Viguera Molíns. La mezquita de Córdoba en textos árabes: antecedentes e inicios; Philippe Sénac. Présence musulmane en Languedoc. Réalités et vestiges.',urls:['https://www.rah.es/wp-content/uploads/2023/03/La-mezquita-de-Cordoba-en-textos-arabes_antecedentes-e-inicios_-Maria-Jesus-Viguera-TOMO-CCXIX-CUADERNO-III.pdf','https://www.persee.fr/doc/cafan_0575-061x_1983_act_18_1_1317']};
  const H=require('./late-helpers.cjs')(c,{start:750,max:759});
  const add=(id,coord,from,to,name,description,frames)=>{
    const source='andalusiSuccession';
    H.entry(id,'eurasia','region',coord,name,[H.phase(from,to,name,description,[source],{approx:false,frontierAdded:true})]);
    for(const [start,end,shape] of frames){
      const area=H.area(id,start,end,shape,{color:'#809975',kind:'polity',sources:[source]});
      area.frontierAdded=true;
      c.cartography.areas[area.id]=c.cartography.shapes.length;
      c.cartography.shapes.push(coast(shape));
    }
  };
  add('review-andalusi-governor',[-4.78,37.89],750,756,['Аль-Андалус при Юсуфе аль-Фихри','Al-Andalus under Yusuf al-Fihri','Юсуф аль-Фихри башкарган аль-Андалус'],['После падения Омейядов в Дамаске Юсуф аль-Фихри продолжал управлять аль-Андалусом. В 756 году Абд ар-Рахман I занял Кордову.','After the fall of the Umayyads in Damascus, Yusuf al-Fihri continued to govern al-Andalus. In 756 Abd al-Rahman I took Córdoba.','Дамаскта Омейяддардын бийлиги кулагандан кийин Юсуф аль-Фихри аль-Андалусту башкарууну уланткан. 756-жылы Абд ар-Рахман I Кордованы алган.'],[[750,756,mainland]]);
  const garrison=G.union([[[2.72,43.06],[3.12,43.01],[3.27,43.17],[3.10,43.35],[2.78,43.33]]]);
  add('review-narbonne-garrison',[3,43.18],750,759,['Нарбонна и её гарнизон','Narbonne and its garrison','Нарбонна жана анын гарнизону'],['Нарбонну удерживал мусульманский гарнизон. В 759 году город перешёл к франкскому королю Пипину. С похода Пипина в 752 году показана ближайшая округа города.','A Muslim garrison held Narbonne until the city passed to the Frankish king Pippin in 759. From Pippin’s campaign in 752 the outline shows the immediate vicinity of the city.','Нарбоннаны мусулман гарнизону кармаган. 759-жылы шаар франк падышасы Пипиндин бийлигине өткөн. Пипиндин 752-жылкы жортуулунан тартып картада шаардын айланасы көрсөтүлгөн.'],[[750,752,iberia.narbonnais],[752,759,garrison]]);
}

function records(c) {
  successors(c);
  c.sources.iberianConquest={title:iberia.source,urls:['https://ifc.dpz.es/webs/atlash/indice_epocas/islamica/22.htm','https://historia-hispanica.rah.es/hechos/1434123-714','https://www.ign.es/web/resources/docs/IGNCnig/ANE/Capitulos/06_Historicaloverview_2024.pdf']};
  const events=[
    [711,[-4.03,39.86],['Продвижение Тарика к Толедо','Tariq advances to Toledo','Тариктин Толедого жетиши'],iberia.texts.first],
    [712,[-5.99,37.39],['Поход Мусы и взятие Севильи','Musa’s campaign and the capture of Seville','Мусанын жортуулу жана Севильянын алынышы'],iberia.texts.seville],
    [713,[-6.34,38.92],['Капитуляция Мериды','Surrender of Mérida','Мериданын багынышы'],iberia.texts.merida],
    [714,[-.88,41.65],['Переход Сарагосы под власть халифата','Zaragoza comes under caliphal rule','Сарагосанын халифаттын бийлигине өтүшү'],iberia.texts.ebro],
    [718,[2.17,41.39],['Власть аль-Андалуса в Барселоне','Al-Andalus extends its rule to Barcelona','Барселонада аль-Андалустун бийлиги орношу'],iberia.texts.coast],
    [720,[3,43.18],['Взятие Нарбонны','Capture of Narbonne','Нарбоннанын алынышы'],iberia.texts.narbonne]
  ];
  for(const [year,coord,title,description] of events) addEvent(c,'iberian-frontier-'+year,year,coord,title,description,'iberianConquest',[714,718,720].includes(year));
  addEvent(c,'amur-frontier-1858',1858,[127.50,49.98],['Айгунский договор','Treaty of Aigun','Айгун келишими'],jointText,'amurTreaties');
  addEvent(c,'amur-frontier-1860',1860,[116.39,39.91],['Российско-цинский Пекинский договор','Sino-Russian Convention of Peking','Россия менен Циндин Пекин келишими'],pekingText,'amurTreaties');
  return c;
}
module.exports={amur,records};
