'use strict';
const G=require('./cartography-geometry.cjs');
const data=require('./frontiers-137.json');
const sources={
  magellan137:['Biblioteca Nacional de Chile. Colonización de Magallanes, 1843–1943. Comisión Nacional de Monumentos de Argentina. Puerto Santa Cruz. Archivo General de la Nación. El célebre cacique Kasûmiro.',['https://www.memoriachilena.gob.cl/602/w3-article-598975.html','https://www.argentina.gob.ar/cultura/monumentos/puerto-santa-cruz','https://www.argentina.gob.ar/sites/default/files/tehuelches.pdf']],
  andes137:['Argentina y Chile. Tratado de Límites de 23 de julio de 1881, artículos I–II. The Cordillera of the Andes Boundary Case, award of 20 November 1902.',['https://www.argentina.gob.ar/normativa/nacional/ley-1116-1881-216105/texto','https://legal.un.org/riaa/cases/vol_ix/37-49.pdf']],
  isthmus137:['Honduras Borders (Guatemala–Honduras), arbitral award of 23 January 1933. Guatemala–El Salvador boundary treaty of 9 April 1938, ratifications exchanged on 24 May 1938. Costa Rica–Panama boundary treaty of 1 May 1941. International Boundary Study 82. Honduras Borders (Guatemala–Honduras), Reports of International Arbitral Awards, vol. II, pp. 1307–1366.',['https://legal.un.org/riaa/cases/vol_II/1307-1366.pdf','https://legal.un.org/legislativeseries/pdfs/volumes/book12.pdf','https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs082.pdf','https://www.rree.go.cr/?cat=convenios&cont=610&instrumento=722&sec=exterior']],
  centralCourts137:['Cañas–Jerez Treaty of Limits, 1858. Cleveland Award, 1888. International Court of Justice. Arbitral Award Made by the King of Spain on 23 December 1906, judgment of 18 November 1960. The Boundary Case between Honduras and Nicaragua, 1906, pp. 114–117. International Boundary Study 36. Land, Island and Maritime Frontier Dispute, judgment of 11 September 1992.',['https://api.icj-cij.org/sites/default/files/case-related/133/15331.pdf','https://api.icj-cij.org/sites/default/files/case-related/39/039-19601118-JUD-01-00-EN.pdf','https://legal.un.org/riaa/cases/vol_XI/101-117.pdf','https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs036.pdf','https://api.icj-cij.org/sites/default/files/case-related/75/075-19920911-JUD-01-00-EN.pdf']],
  caribbean137:['Treaty of Managua, 28 January 1860, articles I–III. Arbitration of 2 July 1881. Foreign Relations of the United States, Nicaragua (Mosquito Territory), 1894. Great Britain and the Bay Islands, 1821–61.',['https://history.state.gov/historicaldocuments/frus1867p2/d436','https://legal.un.org/riaa/states/nicaragua.shtml','https://history.state.gov/historicaldocuments/frus1894Nicaragua','https://www.cambridge.org/core/journals/historical-journal/article/abs/iv-great-britain-and-the-bay-islands-182161/1147DBC5042E4CD1E2A3F4B684B30619']],
  baltic137:['Palanga Municipality. Return of Palanga to Lithuania, centenary. Latvia and Lithuania, Convention on demarcation of 14 May 1921, Declaration of 30 June 1930 and Treaty on restoration of the border. Latvijas Vēstnesis. Latvian diplomacy in Lithuania.',['https://www.palanga.lt/palangos-grazinimo-lietuvai-simtmetis/iniciatyvos/socialiniu-tinklu-projektai/7821','https://likumi.lv/ta/en/lv/starptautiskie-ligumi/id/1007','https://www.vestnesis.lv/ta/id/59898']]
};
module.exports=function(c,{source,revise,link,D,I,box}){
  for(const [id,[title,urls]] of Object.entries(sources))source(id,title,urls);
  const uk='1789-great-britain',ar='1789-rio-plata',cl='1789-chile',ni='1848-nicaragua',hn='1848-honduras';
  const H=require('./late-helpers.cjs')(c,{max:2026});
  function event(id,year,owner,coord,title,text,src){
    H.event('survey137-'+id,year,owner,'politics',coord,title,text,Array.isArray(src)?src:[src],{frontierAdded:true});
  }
  function assign(id,from,to,extent,open,side,reason,src){
    // Where the old frontier is unresolved, retain the previous depiction.
    // The shared land mask is continental: offshore islands keep their own history.
    revise([id],from,to,reason,src,p=>G.merge([D(p,extent),D(side,open),I(p,open)]));
  }
  const pat=data.pat,continental=G.merge([pat.ar,pat.cl]);
  for(const [from,to,open] of [[1881,1902,pat.belt],[1902,2011,pat.ice]]){
    assign(ar,from,to,continental,open,pat.ar,'argentine-mainland-patagonia','andes137');
    assign(cl,from,to,continental,open,pat.cl,'chilean-mainland-patagonia','andes137');
  }
  const ids={gt:'1848-central-america',hn,sv:'1848-el-salvador',ni,cr:'1848-costa-rica'};
  const main=data.main,land=G.merge([...Object.values(main),data.belize]);
  const sanJuan=I(G.merge([main.ni,main.cr]),box(-86.10,10.65,-84.25,11.36));
  for(const code of ['cr','ni'])assign(ids[code],1858,1860,sanJuan,[],I(main[code],sanJuan),'canas-jerez-western-frontier','centralCourts137');
  for(const [id,entry] of Object.entries(ids)){
    const borders=Object.keys(data.bands).filter(pair=>pair.split('_').includes(id));
    const years=[...new Set([1860,...(borders.includes('hn_ni')?[1901]:[]),...borders.map(pair=>data.epochs[pair]),2011])].sort((a,b)=>a-b);
    for(let i=0;i<years.length-1;i++){
      const from=years[i],to=years[i+1],open=G.merge(borders.filter(k=>from<data.epochs[k]).map(k=>
        k==='hn_ni'&&from>=1901?I(data.bands[k],box(-86.136,12,-83,16)):data.bands[k]));
      assign(entry,from,to,land,open,main[id],'central-american-mainland-'+id,id==='ni'?'centralCourts137':'isthmus137');
    }
  }
  // Keep the previously reviewed Belizean frontier, the Mexico–Guatemala
  // settlement, and the Panama Canal Zone independent of the mainland repair.
  revise(['early-new-spain'],1860,1883,'guatemalan-interior-before-delimitation','surveyPeten',p=>D(p,D(main.gt,data.bands.gt_mx)));
  assign('early-new-spain',1883,2011,data.bands.gt_mx,[],I(main.mx,data.bands.gt_mx),'mexican-side-of-guatemalan-border','surveyPeten');
  revise(['early-new-spain'],1883,2011,'mexican-exterior-after-1883','surveyPeten',p=>D(p,main.gt));
  for(const [owner,from,to] of [['1789-new-granada',1860,1903],['1914-panama',1903,1941]]){
    revise([owner],from,to,'costa-rican-interior-exterior','isthmus137',p=>D(p,D(main.cr,data.bands.cr_pa)));
  }
  assign('1914-panama',1941,2011,data.bands.cr_pa,[],I(main.pa,data.bands.cr_pa),'panamanian-side-of-costa-rica','isthmus137');
  revise([uk],1860,2011,'end-of-mosquito-protectorate','caribbean137',p=>D(p,G.merge(Object.keys(ids).map(k=>main[k]))));
  const bay=data.bay;
  revise([uk],1852,1861,'bay-islands-colony','caribbean137',p=>G.merge([p,bay]));
  revise([hn],1852,1861,'before-return-of-bay-islands','caribbean137',p=>D(p,bay));
  revise([uk],1861,2011,'bay-islands-handover','caribbean137',p=>D(p,bay));
  revise([hn],1861,2011,'honduran-bay-islands','caribbean137',p=>G.merge([p,bay]));
  // The reserve had self-government inside Nicaragua until incorporation.
  const mis='survey137-mosquitia',misName=['Москитская резервация','Mosquito Reservation','Москит резервациясы'];
  const misText=['Манагуанский договор 1860 года признал суверенитет Никарагуа и закрепил самоуправление жителей резервации. Центром управления был Блуфилдс. В 1894 году правительство Никарагуа распространило на эту территорию прямое управление.','The 1860 Treaty of Managua recognised Nicaraguan sovereignty and provided for self-government in the reservation. Bluefields was its administrative centre. The Nicaraguan government imposed direct administration in 1894.','1860-жылкы Манагуа келишими Никарагуанын эгемендигин таанып, резервацияда өз алдынча башкарууну бекиткен. Анын борбору Блуфилдс болгон. 1894-жылы Никарагуа бул жерде түз башкарууну киргизген.'];
  const misPhase=H.phase(1860,1894,misName,misText,['caribbean137'],{name:misName,approx:false,frontierAdded:true});
  H.entry(mis,'north','region',[-83.76,12.01],misName,[misPhase]);
  const reserve=H.area(mis,1860,1894,data.mosquito,{name:misName,kind:'influence',color:'#89a39a',sources:['caribbean137']});
  Object.assign(reserve,{frontierAdded:true,statusLabel:['Внутреннее самоуправление','Internal self-government','Ички өз алдынча башкаруу'],label:[-83.76,12.01]});
  c.cartography.areas[reserve.id]=c.cartography.shapes.length;c.cartography.shapes.push(data.mosquito);
  link(ni,mis,1860,1894,'dependency','caribbean137');
  const balt=data.balt,baltland=G.merge([balt.lt,balt.lv]),latvia='1918-latvia',lith='1918-lithuania';
  // The narrow coastal foothold records the administrations at Palanga and
  // Šventoji before arbitration; its inland extent is approximate.
  const coast=I(baltland,G.union([[[20.86,55.89],[21.10,55.89],[21.14,55.96],[21.16,56.04],[21.18,56.11],[21.16,56.27],[20.86,56.27]]]));
  revise([latvia],1919,1921,'latvian-coastal-administration','baltic137',p=>G.merge([p,coast]));
  revise([lith,'1918-soviet-russia'],1919,1921,'palanga-before-arbitration','baltic137',p=>D(p,coast));
  assign(lith,1921,1940,baltland,[],balt.lt,'lithuanian-side-of-1921-boundary','baltic137');
  assign(latvia,1921,1940,baltland,[],balt.lv,'latvian-side-of-1921-boundary','baltic137');
  revise(['1918-soviet-russia','1939-ussr','late-hre','1945-poland'],1921,1940,'independent-baltic-states','baltic137',p=>D(p,baltland));
  event('bulnes',1843,cl,[-70.915,-53.628],['Основание форта Бульнес','Fort Bulnes founded','Бульнес чебинин негизделиши'],['Чилийская экспедиция основала форт Бульнес на мысе Санта-Ана у Магелланова пролива. В 1848 году поселение начали переносить на север, в Пунта-Аренас.','A Chilean expedition founded Fort Bulnes at Punta Santa Ana on the Strait of Magellan. In 1848 the settlement began moving north to Punta Arenas.','Чили экспедициясы Магеллан кысыгындагы Санта-Ана тумшугунда Бульнес чебин негиздеген. 1848-жылы конуш түндүктөгү Пунта-Аренаска көчүрүлө баштаган.'],'magellan137');
  event('punta-arenas',1848,cl,[-70.91,-53.14],['Поселение в Пунта-Аренасе','Settlement at Punta Arenas','Пунта-Аренастагы конуш'],['Пунта-Аренас сменил форт Бульнес как центр чилийского поселения у Магелланова пролива.','Punta Arenas succeeded Fort Bulnes as the centre of Chilean settlement on the Strait of Magellan.','Пунта-Аренас Бульнес чебинин ордуна Магеллан кысыгындагы чилилик конуштун борбору болгон.'],'magellan137');
  event('santa-cruz',1878,ar,[-68.53,-50.03],['Экспедиция Луиса Пи в Санта-Крус','Luis Py expedition at Santa Cruz','Луис Пинин Санта-Круска экспедициясы'],['Аргентинская морская экспедиция под командованием Луиса Пи прибыла к устью Санта-Крус в период спора с Чили. Первое декабря считается датой основания Пуэрто-Санта-Крус.','An Argentine naval expedition led by Luis Py reached the Santa Cruz estuary during the dispute with Chile. Puerto Santa Cruz commemorates 1 December as its founding date.','Чили менен талаш жүрүп турганда Луис Пи жетектеген Аргентина деңиз экспедициясы Санта-Крус дарыясынын куйган жерине келген. Пуэрто-Санта-Крустун негизделген күнү 1-декабрь деп белгиленет.'],'magellan137');
  event('magellan',1881,cl,[-70,-52],['Материковая граница у Магелланова пролива','Mainland frontier at the Strait of Magellan','Магеллан кысыгынын жанындагы материктик чек ара'],['От мыса Дунгенесс граница шла через Монте-Динеро и Монте-Аймонд к пересечению 70° з. д. и 52° ю. ш., затем на запад по параллели. К северу лежали владения Аргентины, к югу — Чили. Между рекой Санта-Крус и проливом жили аоникенк.','From Punta Dungeness the frontier ran via Monte Dinero and Monte Aymond to 70°W, 52°S and then west along the parallel. Argentina lay to the north and Chile to the south. The Aonikenk lived between the Santa Cruz River and the strait.','Чек ара Дунгенесс тумшугунан Монте-Динеро жана Монте-Аймонд аркылуу 70° батыш узундук менен 52° түштүк кеңдик кесилишкен жерге, андан батышка кеткен. Түндүгү Аргентинага, түштүгү Чилиге караган. Санта-Крус дарыясы менен кысыктын ортосунда аоникенк эли жашаган.'],['andes137','magellan137']);
  event('andes',1902,cl,[-72.53,-51.71],['Арбитраж по границе в Патагонских Андах','Arbitration in the Patagonian Andes','Патагония Анд тоолорундагы чек ара арбитражы'],['Решение от 20 ноября 1902 года определило границу на нескольких спорных участках Анд. Среди них был район залива Ультима-Эсперанса.','The award of 20 November 1902 delimited several disputed sections of the Andes, including the region of Última Esperanza Sound.','1902-жылдын 20-ноябрындагы арбитраж Анд тоолорунун бир нече талаштуу тилкесиндеги чек араны аныктаган. Алардын арасында Ультима-Эсперанса булуңунун аймагы болгон.'],'andes137');
  event('bay',1861,hn,[-86.53,16.33],['Передача островов Ислас-де-ла-Баия Гондурасу','Bay Islands transferred to Honduras','Ислас-де-ла-Баия аралдары Гондураска өткөрүлдү'],['В 1852 году Великобритания объявила острова колонией. Договор 1859 года был ратифицирован в 1860 году, а передача управления Гондурасу состоялась в 1861-м.','Britain proclaimed the islands a colony in 1852. The 1859 treaty was ratified in 1860 and the administration passed to Honduras in 1861.','Британия аралдарды 1852-жылы колония деп жарыялаган. 1859-жылкы келишим 1860-жылы ратификацияланып, 1861-жылы башкаруу Гондураска өткөн.'],'caribbean137');
  event('bluefields',1860,mis,[-83.76,12.01],['Самоуправление на Москитовом берегу','Self-government on the Mosquito Coast','Москит жээгиндеги өз алдынча башкаруу'],misText,'caribbean137');
  event('mosquitia',1894,ni,[-83.76,12.01],['Прямое управление Никарагуа в Блуфилдсе','Nicaragua takes direct control at Bluefields','Блуфилдс Никарагуанын түз башкаруусуна өттү'],misText,'caribbean137');
  event('copan',1933,hn,[-89.14,14.84],['Арбитраж между Гватемалой и Гондурасом','Guatemala–Honduras boundary award','Гватемала менен Гондурастын чек ара арбитражы'],['23 января арбитражный суд установил границу от района Монте-Кристо до Карибского моря. Копан остался на стороне Гондураса.','On 23 January the arbitral tribunal determined the boundary from the Montecristo area to the Caribbean. Copán lay on the Honduran side.','23-январда арбитраждык сот Монте-Кристо аймагынан Кариб деңизине чейинки чек араны аныктаган. Копан Гондурас тарапта калган.'],'isthmus137');
  event('san-juan',1858,'1848-costa-rica',[-84.398,11.018],['Договор о границе на Сан-Хуане','Boundary treaty on the San Juan River','Сан-Хуан дарыясындагы чек ара келишими'],['Договор Каньяса — Хереса установил границу от Тихого океана до Карибского моря. Ниже Эль-Кастильо на части пути граница идёт по правому берегу Сан-Хуана. Река находится под юрисдикцией Никарагуа, за Коста-Рикой закреплено право торгового судоходства.','The Cañas–Jerez treaty delimited the boundary from the Pacific to the Caribbean. Downstream of El Castillo part of the boundary follows the right bank of the San Juan. Nicaragua has jurisdiction over the river, and Costa Rica has commercial navigation rights.','Каньяс — Херес келишими Тынч океандан Кариб деңизине чейинки чек араны аныктаган. Эль-Кастильодон төмөн чек аранын бир бөлүгү Сан-Хуандын оң жээги менен өтөт. Дарыя Никарагуанын карамагында, Коста-Риканын соода кемелери анда жүрүүгө укуктуу.'],'centralCourts137');
  event('coco',1906,hn,[-83.18,14.99],['Арбитраж о границе по реке Коко','Award on the Coco River frontier','Коко дарыясындагы чек ара арбитражы'],['Решение 23 декабря определило восточный участок границы Гондураса и Никарагуа. На побережье граница начиналась у главного рукава Коко. В 1960 году Международный суд ООН подтвердил обязательную силу решения.','The award of 23 December delimited the eastern part of the Honduras–Nicaragua frontier. On the coast it began at the principal mouth of the Coco River. The International Court of Justice upheld the award in 1960.','23-декабрдагы чечим Гондурас менен Никарагуанын чыгыш чек арасын аныктаган. Жээкте ал Коко дарыясынын негизги куймасынан башталган. 1960-жылы БУУнун Эл аралык соту чечимдин милдеттүү күчүн тастыктаган.'],'centralCourts137');
  event('fonseca-land',1992,ids.sv,[-87.78,13.42],['Решение по шести сухопутным участкам','Judgment on six land boundary sectors','Кургактыктагы алты чек ара тилкеси боюнча чечим'],['Мирный договор 1980 года закрепил согласованные части границы Сальвадора и Гондураса. 11 сентября 1992 года Международный суд ООН определил линию на шести оставшихся спорных сухопутных участках, включая низовья Гоаскорана.','The 1980 peace treaty set out the agreed sections of the El Salvador–Honduras frontier. On 11 September 1992 the International Court of Justice delimited the six remaining disputed land sectors, including the lower Goascorán.','1980-жылкы тынчтык келишими Сальвадор менен Гондурастын чек арасынын макулдашылган бөлүктөрүн бекиткен. 1992-жылдын 11-сентябрында БУУнун Эл аралык соту калган алты талаштуу тилкени, анын ичинде Гоаскорандын төмөнкү агымындагы чек араны аныктаган.'],'centralCourts137');
  event('palanga',1921,lith,[21.06,55.92],['Паланга переходит под управление Литвы','Palanga passes to Lithuanian administration','Паланга Литванын башкаруусуна өттү'],['По решению арбитража Паланга и Швянтойи перешли Литве, Акнисте — Латвии. Латвийская администрация покинула Палангу 30 марта 1921 года.','Under the arbitration award Palanga and Šventoji passed to Lithuania and Aknīste to Latvia. The Latvian administration left Palanga on 30 March 1921.','Арбитраждын чечими боюнча Паланга менен Швянтойи Литвага, Акнисте Латвияга өткөн. Латвиянын администрациясы Палангадан 1921-жылдын 30-мартында кеткен.'],'baltic137');
  return c;
};
