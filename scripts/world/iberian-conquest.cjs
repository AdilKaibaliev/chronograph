'use strict';

const geometry = require('./cartography-geometry.cjs');
const { union, merge } = geometry;
const polygon = vertices => union([vertices]);

const source = 'Instituto Geográfico Nacional. Atlas Nacional de España, Referencias históricas; M. J. Cervera Fras. La conquista musulmana (siglo VIII), Atlas de Historia de Aragón; Real Academia de la Historia. Historia Hispánica, 714; Gran Enciclopèdia Catalana. Ardó; Inrap. Les premières sépultures musulmanes en Septimanie.';
const texts = {
  first: ['В 711 году войско Тарика перешло пролив, разгромило Родериха и продвинулось к Кордове и Толедо.', 'In 711 Tariq’s army crossed the strait, defeated Roderic and advanced to Córdoba and Toledo.', '711-жылы Тариктин аскери кысыктан өтүп, Родерихти жеңип, Кордова менен Толедого чейин жеткен.'],
  seville: ['В 712 году Муса ибн Нусайр переправился в аль-Андалус. Севилья перешла под его власть. Мерида ещё держалась.', 'In 712 Musa ibn Nusayr crossed into al-Andalus. Seville came under his authority. Mérida still held out.', '712-жылы Муса ибн Нусайр аль-Андалуска өткөн. Севилья анын бийлигине өтүп, Мерида каршылык көрсөтүүнү уланткан.'],
  merida: ['В 713 году после осады сдалась Мерида. На юго-востоке договор с Теодомиром сохранил местную власть и установил выплату дани.', 'In 713 Mérida surrendered after a siege. In the southeast a treaty with Theodemir preserved local authority in return for tribute.', '713-жылы курчоодон кийин Мерида багынган. Түштүк-чыгышта Теодомир менен түзүлгөн келишим жергиликтүү бийликти сактап, салык төлөөнү белгилеген.'],
  ebro: ['Около 714 года Сарагоса и средняя долина Эбро перешли под власть халифата. В северо-восточных областях сохранялись вестготские центры.', 'Around 714 Zaragoza and the middle Ebro valley came under caliphal rule. Visigothic centres survived farther northeast.', '714-жыл чамасында Сарагоса менен Эбронун орто өрөөнү халифаттын бийлигине өткөн. Түндүк-чыгышта вестгот борборлору сакталып калган.'],
  northeast: ['После поражения Родериха вестготская власть сохранялась в долине Эбро и на северо-востоке. Здесь правил Агила II.', 'After Roderic’s defeat Visigothic authority survived in the Ebro valley and the northeast under Achila II.', 'Родерих жеңилгенден кийин Эбро өрөөнүндө жана түндүк-чыгышта Агила IIнин бийлиги сакталып калган.'],
  ardo: ['При Ардо вестготские владения сократились до северо-востока полуострова и Септимании.', 'Under Ardo the remaining Visigothic domains contracted to the northeast of the peninsula and Septimania.', 'Ардо тушунда вестгот ээликтери жарым аралдын түндүк-чыгышы жана Септимания менен чектелген.'],
  coast: ['В 717–718 годах власть аль-Андалуса распространилась на побережье вокруг Барселоны. Нарбонна ещё оставалась вне его владений.', 'In 717–718 the rulers of al-Andalus extended their authority along the coast around Barcelona. Narbonne remained outside their domains.', '717–718-жылдары аль-Андалустун бийлиги Барселонанын айланасындагы жээкке жайылган. Нарбонна анын ээлигинен тышкары калган.'],
  narbonne: ['Около 720 года ас-Самх занял Нарбонну. Город стал опорой мусульманских владений к северу от Пиренеев.', 'Around 720 al-Samh took Narbonne. The city became a centre of Muslim power north of the Pyrenees.', '720-жыл чамасында ас-Самх Нарбоннаны алган. Шаар Пиренейдин түндүгүндөгү мусулман бийлигинин борборуна айланган.']
};

// These envelopes follow mainland coasts and regional centres. The northern
// edge leaves the Cantabrian and Basque highlands outside a uniform royal fill.
const peninsula = polygon([[-10,35.98],[-5.55,35.98],[-3,36.08],[-.4,37.15],[.6,38.15],[1.12,40.12],[3.65,41.5],[3.55,42.62],[2.4,42.8],[.65,42.65],[-.35,42.63],[-1.25,42.55],[-2.8,42.62],[-4.6,42.72],[-5.8,43.02],[-7.1,43.72],[-9.7,44],[-10,42]]);
const narbonnais = polygon([[1.85,42.40],[2.65,42.32],[3.5,42.56],[3.48,43.27],[3.08,43.50],[2.46,43.37],[2.12,43.01]]);
const northeast = polygon([[-1.83,41.92],[-1.42,41.38],[-.60,40.99],[.58,40.57],[1.48,40.72],[3.60,41.50],[3.55,42.62],[2.4,42.8],[.65,42.65],[-.35,42.63]]);
const coastalCore = polygon([[-.15,42.20],[.22,41.63],[.72,41.12],[1.63,40.95],[3.6,41.50],[3.55,42.62],[2.4,42.8],[.65,42.65]]);
const tariq = polygon([[-6.32,36.03],[-5.50,35.98],[-4.35,36.25],[-2.8,36.56],[-2.78,37.42],[-3.23,38.16],[-3.47,39.08],[-3.78,39.95],[-4.25,40.02],[-4.60,39.35],[-4.85,38.40],[-5.1,37.98],[-5.58,37.55],[-5.71,37.03],[-6.30,36.55]]);
const seville = polygon([[-6.65,36.35],[-5.9,36.20],[-5.10,37.20],[-4.85,37.9],[-5.49,38.08],[-6.13,37.76],[-6.50,37.38]]);
const lusitania = polygon([[-8.9,36.78],[-6.20,36.56],[-4.9,37.63],[-4.28,39.52],[-3.85,39.98],[-4.6,40.12],[-5.63,40.03],[-6.23,39.55],[-6.78,39.29],[-7.18,38.62],[-7.92,38.40],[-8.44,37.9]]);
const tudmir = polygon([[-3.14,36.57],[-1.42,36.63],[-.19,37.7],[-.18,38.52],[-.64,38.65],[-1.12,38.39],[-1.80,38.30],[-2.62,37.64]]);
const realm = merge([peninsula,narbonnais]);
const straitAndSea = polygon([[-11,35.98],[-5.6,35.98],[-3,36.04],[0,37.02],[5,39],[6,44.5],[-11,44.5]]);

function apply(empires, { by, at, frame, cite, D, I }) {
  const visigoths = by.get('visigoths');
  const caliphate = by.get('umayyad');
  const strip = straitAndSea;
  const gains = [tariq, merge([tariq,seville]), merge([tariq,seville,lusitania,tudmir])].map(area=>I(area,peninsula));
  const mainland = I(at('umayyad',714).polys,strip);
  const advance = year => {
    if(year<714) return gains[year-711];
    if(year<718) return D(mainland,merge([coastalCore,narbonnais]));
    if(year<720) return D(mainland,narbonnais);
    return merge([mainland,narbonnais]);
  };
  for (const year of [713,718,720]) frame('umayyad',year,{});
  const notes = {711:texts.first,712:texts.seville,713:texts.merida,714:texts.ebro,718:texts.coast,720:texts.narbonne};
  for (const phase of caliphate.keyframes.filter(f=>f.year>=711)) {
    phase.polys = merge([D(phase.polys,strip), advance(phase.year)]);
    if(notes[phase.year]) phase.territories = notes[phase.year][0];
  }
  frame('visigoths',700,{polys:realm});
  visigoths.to=719;
  frame('visigoths',711,{polys:D(realm,gains[0]),label:[-.70,41.86],territories:texts.northeast[0]});
  frame('visigoths',712,{polys:merge([northeast,narbonnais]),label:[.40,42.02],territories:texts.northeast[0]});
  frame('visigoths',714,{polys:merge([coastalCore,narbonnais]),label:[1.98,42.11],territories:texts.ardo[0]});
  frame('visigoths',718,{polys:narbonnais,label:[2.89,43.12],territories:texts.coast[0]});
  cite('umayyad','iberianConquest'); cite('visigoths','iberianConquest');
  return empires;
}
module.exports={apply,source,texts,straitAndSea,narbonnais};
