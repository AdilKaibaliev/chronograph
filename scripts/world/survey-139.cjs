'use strict';
const G=require('./cartography-geometry.cjs'),data=require('./frontiers-139.json'),bithynia=require('./bithynia-frontiers.cjs');
module.exports=function(c,{source,revise,visibleAt,D,I,box}){
 const H=require('./late-helpers.cjs')(c,{start:610,max:2026});
 c.mapComparisons={...c.mapComparisons,...require('./comparisons-139.cjs')};
 source('bolivia139','José Aguirre Achá and Siegfried Freudenthal. Mapa de Bolivia (1923). Tratado Polo–Bustamante de rectificación de fronteras (1909). Tratado de Petrópolis (1903). Tratado de Paz y Amistad entre Chile y Bolivia (1904).',['https://collections.lib.uwm.edu/digital/collection/agdm/id/1184','https://apps.rree.gob.pe/portal/webtratados.nsf/Tratados_Bilateral.xsp?documentId=605E','https://history.state.gov/historicaldocuments/frus1905/d128']);
 source('yacuiba139','Acuerdos de demarcación argentino-boliviana de 1898 y 1902. Tratado definitivo de límites, 9 de julio de 1925. Cancillería Argentina. Descripción del límite Argentina–Bolivia. Instituto Geográfico Nacional. Cartografía de Salta.',['https://tratados.cancilleria.gob.ar/tratado_archivo.php?caso=pdf&id=lp4%3D&tipo=kg%3D%3D&tratados_id=kqSklZg%3D','https://www.argentina.gob.ar/normativa/nacional/ley-12399-204968/texto','https://cancilleria.gob.ar/es/limites-internacionales/limites-e-hitos/descripcion-del-limite-argentina-bolivia','https://www.argentina.gob.ar/georef/descarga-de-la-base-completa']);
 source('chaco139','Commission of Inquiry and Conciliation, Bolivia and Paraguay. Resolution on the restoration of Forts Vanguardia and Boquerón (1929). Tratado de Paz, Amistad y Límites (1938). Comisión Mixta Demarcadora de Límites. Memoria final. Ana María Musicó Aschiero. Guerra entre Bolivia y Paraguay. Instituto Nacional de Estadística. Cartografía censal del Paraguay.',['https://history.state.gov/historicaldocuments/frus1929v01/d718','https://www2.mre.gov.py/cndl/index.php/institucional/memoria-final-de-la-cndl/presentacion','https://www.colegiomilitar.mil.ar/rediu/pdf/ReDiU_1030_art1-Guerra%20entre%20Bolivia%20y%20Paraguay%201928-1935.pdf','https://www.ine.gov.py/microdatos/cartografia-digital-2022.php']);
 source('bithynia139','Halil İnalcık. Osman I; Orhan. TDV İslâm Ansiklopedisi. Anadolu; İznik.',['https://islamansiklopedisi.org.tr/osman-i','https://islamansiklopedisi.org.tr/orhan','https://islamansiklopedisi.org.tr/anadolu','https://islamansiklopedisi.org.tr/iznik']);
 source('hafsids139','Robert Brunschvig. La Berbérie orientale sous les Hafsides. TDV İslâm Ansiklopedisi. Hafsîler. Encyclopédie berbère. Hafsides.',['https://islamansiklopedisi.org.tr/hafsiler','https://journals.openedition.org/encyclopedieberbere/pdf/1639','https://www.archnet.org/collections/2361']);
 const bo='1815-upper-peru',py='1815-paraguay',ar='1789-rio-plata',br='early-portuguese-brazil',pe='early-peru',cl='1789-chile';
 const neighbours={Argentina:ar,Paraguay:py,Brazil:br,Chile:cl,Peru:pe};
 source('boliviaRepublic139','Constitución política de Bolivia de 1826, artículos 3–5. Juan Ondarza, Juan Mariano Mujía and Lucio Camacho. Mapa de la República de Bolivia (surveyed 1842–1859). Asamblea Legislativa Departamental del Beni. Creación del departamento del Beni. Secretaría Municipal de Cultura y Turismo de Santa Cruz. Miguel Suárez Arana.',['https://www.lexivox.org/norms/BO-CPE-18261119-1.xhtml','https://collections.lib.uwm.edu/digital/collection/agdm/id/20546/','https://asambleabeni.gob.bo/storage/publications/March2024/3xcRYLvvx7KopOytIUzH.pdf','https://culturayturismo.gmsantacruz.gob.bo/articulos/miguel-suarez-arana']);
 // Generalised administrative interior, following the highland valleys and
 // the Moxos and Chiquitos mission districts. The nineteenth-century map's
 // claims in Acre, the Chaco and the Pacific littoral are not used as borders.
 const valleys=I(data.bo,G.union([[[-68.83,-16.76],[-68.65,-15.64],[-67.88,-15.31],[-67.25,-15.62],[-66.38,-14.92],[-66.19,-14.23],[-66.05,-13.61],[-65.80,-13.28],[-65.49,-13.10],[-65.02,-13.14],[-64.72,-12.94],[-64.24,-13.10],[-63.88,-13.00],[-63.47,-13.13],[-63.27,-13.56],[-63.53,-14.29],[-63.12,-15.04],[-62.28,-15.54],[-61.58,-15.77],[-60.96,-15.99],[-60.53,-16.23],[-59.94,-16.41],[-59.99,-16.96],[-60.54,-17.49],[-60.78,-18.01],[-61.44,-18.32],[-62.22,-18.50],[-62.96,-18.98],[-63.46,-19.61],[-64.05,-20.04],[-64.85,-20.28],[-65.74,-20.37],[-66.50,-20.17],[-67.10,-19.76],[-67.52,-18.92],[-68.18,-18.29],[-68.69,-17.64]]]));
 const tarija=I(data.bo,G.union([[[-66.47,-19.92],[-65.54,-19.62],[-64.76,-19.88],[-64.35,-20.54],[-64.18,-21.38],[-64.51,-21.80],[-65.13,-21.83],[-65.73,-21.58],[-66.08,-20.98]]]));
 const eastRoad=I(data.bo,G.union([[[-61.97,-17.17],[-60.94,-17.28],[-60.06,-17.79],[-59.31,-18.14],[-58.66,-18.36],[-57.76,-18.72],[-57.62,-19.04],[-57.95,-19.20],[-58.89,-18.91],[-59.71,-18.65],[-60.52,-18.25],[-61.43,-18.07]]]));
 const settled=G.merge([valleys,tarija]);
 const yacuibaLand=I(data.bo,box(-63.75,-22.07,-63.61,-21.84)),core=G.merge([data.core,yacuibaLand]);
 const northernPending=G.union([[[-73,-9],[-68.05,-9],[-67.52,-10.09],[-67.75,-11.23],[-68.50,-12.32],[-68.97,-13.28],[-69.09,-14.52],[-69.44,-15.34],[-73,-15.34]]]);
 for(const [from,until,land] of [[1825,1826,valleys],[1826,1875,settled],[1875,1898,G.merge([settled,eastRoad])],[1898,1904,G.merge([settled,eastRoad,yacuibaLand])],[1904,1909,G.merge([settled,eastRoad,D(core,G.merge([northernPending,data.before1929]))])]]){
  revise([bo],from,until,'bolivian-settled-interior','boliviaRepublic139',p=>G.merge([p,land]));
  revise(Object.values(neighbours),from,until,'bolivian-cities-exterior','boliviaRepublic139',p=>D(p,land));
 }
 source('brasilBolivia139','Tratado de limites e communicações ferroviarias entre o Brasil e a Bolivia, 25 de dezembro de 1928. Decreto 18.838, 9 de julho de 1929.',['https://www2.camara.leg.br/legin/fed/decret/1920-1929/decreto-18838-9-julho-1929-551303-publicacaooriginal-67619-pe.html','https://www2.camara.leg.br/legin/fed/decret/1900-1909/decreto-1179-18-fevereiro-1904-583547-publicacaooriginal-106345-pl.html']);
 for(const [from,to,open] of [[1909,1929,data.before1929],[1929,1938,[]]]){
  const land=D(core,open);
  revise([bo],from,to,'bolivian-interior-before-chaco-settlement',from===1929?'brasilBolivia139':'bolivia139',old=>G.merge([land,I(old,G.merge([data.chaco,open]))]));
  revise(Object.values(neighbours),from,to,'exclude-bolivian-interior','bolivia139',p=>D(p,land));
 }
 const rim=G.merge([data.bo,...Object.values(data.neighbours)]);
 // The pre-war Bolivian claim west of the river is not a claim to eastern
 // Paraguay. Villa Hayes was under Paraguayan administration after 1878.
 source('paraguay139','Comisión Nacional Demarcadora de Límites del Paraguay. Historia de los límites. Tratados de 1872 y 1876 y laudo Hayes de 1878. Instituto Nacional de Estadística. Cartografía censal.',['https://www2.mre.gov.py/cndl/index.php/limites/historia-de-los-limites','https://www.ine.gov.py/microdatos/cartografia-digital-2022.php']);
 revise([py],1878,2011,'eastern-paraguay-settled-land','paraguay139',p=>G.merge([p,data.eastParaguay]));
 revise([ar,br,bo],1878,2011,'eastern-paraguay-exterior','paraguay139',p=>D(p,data.eastParaguay));
 // The eastern Pilcomayo tripoint was addressed by an additional protocol in 1941.
 const tripoint=box(-62.82,-23,-62.39,-22.03);
 for(const [start,end,keep] of [[1938,1941,tripoint],[1941,2011,[]]]){
  const window=D(rim,keep);
  revise([bo],start,end,'bolivia-after-the-1938-settlements','chaco139',old=>G.merge([I(old,keep),D(data.bo,keep)]));
  for(const [name,id] of Object.entries(neighbours))revise([id],start,end,'bolivian-common-exterior-'+name,id===ar?'yacuiba139':'bolivia139',old=>G.merge([D(old,window),D(data.neighbours[name],keep)]));
 }
 // The same owner is drawn on both sides of the 2010/2011 engine transition by carryModern.
 for(const a of c.areas.filter(a=>a.entry===bo&&a.from>=1909))c.cartography.kinds[a.id]='polity';
 const region='1939-chaco',profile=c.entries.find(e=>e.id===region);
 const status=['Спорная территория','Disputed territory','Талаштуу аймак'];
 const name=['Чако-Бореаль','Chaco Boreal','Түндүк Чако'];
 const description=['Боливия и Парагвай оспаривали равнину между предгорьями Анд и рекой Парагвай. В регионе жили коренные народы. Правительства строили форты, а их территориальные притязания выходили за пределы расположения гарнизонов.','Bolivia and Paraguay disputed the plain between the Andean foothills and the Paraguay River. Indigenous peoples lived in the region. Both governments established forts and claimed territory beyond their garrisons.','Боливия менен Парагвай Анд тоо этектери менен Парагвай дарыясынын ортосундагы түздүк үчүн талашкан. Бул аймакта түпкүлүктүү элдер жашаган. Эки өкмөт тең чептерди куруп, гарнизондор турган жерлерден алыс аймактарга да талап койгон.'];
 const truce=['После перемирия 1935 года судьбу спорной территории решала мирная конференция. Договор и арбитраж 1938 года установили границу.','After the 1935 ceasefire a peace conference negotiated the fate of the disputed lands. The 1938 treaty and arbitration established the frontier.','1935-жылкы ок атышууну токтотуудан кийин талаштуу аймактын тагдыры тынчтык конференциясында талкууланган. 1938-жылкы келишим жана арбитраж чек араны аныктаган.'];
 function area(id,from,to,title,body,shape,src,kind,label){
  const a=H.area(id,from,to,shape,{kind,name:title,title,text:body,sources:[src]});
  Object.assign(a,{frontierAdded:true,label});
  if(kind==='influence'&&id===region)a.statusLabel=status;
  c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(shape);
 }
 for(const [from,to,text] of [[1909,1932,description],[1936,1938,truce]]){
  profile.phases.push(H.phase(from,to,name,text,['chaco139'],{name,frontierAdded:true,approx:true}));
  area(region,from,to,name,text,data.chaco,'chaco139','influence',[-60.0,-21.9]);
 }
 profile.phases.sort((a,b)=>a.from-b.from);
 revise([region],1932,1936,'chaco-war-theatre','chaco139',()=>data.chaco);
 const os='late-ottoman',rum='late-rum',sel='late-rum-seljuk';
 const dates=[1300,1302,1305,1326,1329,1331,1334,1337,1345,1354];
 for(let i=0;i<dates.length-1;i++){
  const y=dates[i],until=dates[i+1],p=bithynia.extent(y);
  revise([os],y,until,'osman-and-orhan-dated-control','bithynia139',()=>p);
  revise([rum],y,until,'bithynian-fortresses','bithynia139',old=>bithynia.roman(old,y));
  revise([sel],y,until,'end-of-seljuk-overlay-in-bithynia','bithynia139',old=>D(old,G.merge([p,bithynia.forts])));
 }
 // Preserve the documented Asian holdings when the next frame adds Gallipoli.
 revise([os],1354,1389,'bithynia-after-gallipoli','bithynia139',old=>G.merge([old,bithynia.extent(1345)]));
 const ah='almohad',hf='hafsid',west='survey139-western-hafsids';
 const coast=G.union([[[4.72,36.67],[4.86,36.31],[5.38,35.99],[5.93,35.87],[6.52,35.71],[7.04,35.73],[7.52,35.97],[7.89,36.31],[8.22,36.58],[8.24,37.04],[7.17,37.19],[5.58,37.12],[4.86,37.00]]]);
 const oldEast=visibleAt(hf,1229),oldWest=visibleAt(ah,1229),contact=I(oldWest,oldEast);
 // The annual series uses 1230 for the expedition dated AH 628 (1230–31).
 // Keep the southern inland campaign separate from the two northern cities.
 revise([hf],1229,1230,'early-hafsid-ifriqiya','hafsids139',old=>D(old,contact));
 revise([ah],1230,1269,'hafsid-western-cities','hafsids139',old=>D(old,coast));
 revise([hf],1230,1234,'hafsid-coastal-campaign','hafsids139',old=>G.merge([D(old,D(contact,coast)),coast]));
 revise([ah],1234,1269,'hafsid-constantine-interior','hafsids139',old=>D(old,contact));
 for(const [from,to] of [[1234,1285],[1309,1311],[1318,1347]])revise([hf],from,to,'hafsid-western-provinces','hafsids139',old=>G.merge([old,coast]));
 revise(['marinid'],1318,1347,'hafsid-side-of-the-tell','hafsids139',old=>D(old,coast));
 revise([hf],1347,1348,'marinid-campaign-in-ifriqiya','hafsids139',old=>D(old,coast));
 revise(['marinid'],1347,1348,'marinid-campaign-in-ifriqiya','hafsids139',old=>G.merge([old,coast]));
 const westName=['Западные владения Хафсидов','Western Hafsid territories','Хафсиддердин батыш ээликтери'];
 const westText=['В Беджае и Константине правили представители династии Хафсидов. В 1285 году Абу Закария утвердился в Беджае и избрал Константину своей столицей. В 1309 году его преемник Абу-ль-Бака объединил западные владения с Тунисом.','Members of the Hafsid dynasty governed Béjaïa and Constantine. In 1285 Abu Zakariyya took Béjaïa and made Constantine his capital. In 1309 his successor Abu al-Baqa united the western lands with Tunis.','Бежая менен Константинаны Хафсид династиясынын өкүлдөрү башкарган. 1285-жылы Абу Закария Бежаяда бийлигин орнотуп, Константинаны борбор кылган. 1309-жылы анын мураскери Абу-л-Бака батыш ээликтерин Тунис менен бириктирген.'];
 const branchText=['После смены власти в Тунисе в 1311 году Константина и Беджа́я вновь стали центрами региональной власти Хафсидов. В 1318 году Абу Яхья Абу Бакр занял Тунис.','After the change of ruler at Tunis in 1311, Constantine and Béjaïa again served as regional centres of Hafsid power. Abu Yahya Abu Bakr took Tunis in 1318.','1311-жылы Тунисте бийлик алмашкандан кийин Константина менен Бежая кайрадан Хафсиддердин аймактык бийлик борборлору болгон. 1318-жылы Абу Яхья Абу Бакр Тунисти ээлеген.'];
 const branches=[[1285,1309,westText],[1311,1318,branchText]];
 H.entry(west,'africa','region',[6.61,36.36],westName,branches.map(([from,to,text])=>H.phase(from,to,westName,text,['hafsids139'],{frontierAdded:true,approx:true})));
 for(const [from,to,text] of branches){
  revise([hf],from,to,'separate-hafsid-western-courts','hafsids139',old=>D(old,coast));
  area(west,from,to,westName,text,coast,'hafsids139','polity',[6.61,36.36]);
 }
 function event(id,y,owner,point,title,text,src,options={}){return H.event('survey139-'+id,y,owner,'politics',point,title,text,[src],{frontierAdded:true,...options});}
 event('beni',1842,bo,[-64.90,-14.84],['Создание департамента Бени','Creation of the department of Beni','Бени департаментинин түзүлүшү'],['18 ноября Боливия образовала департамент Бени с центром в Тринидаде. Поселения Мохоса, включая Тринидад, Сан-Игнасио и Лорето, прежде управлялись из департамента Санта-Крус.','On 18 November Bolivia created the department of Beni, centred on Trinidad. The Moxos settlements, including Trinidad, San Ignacio and Loreto, had previously been administered as part of Santa Cruz.','18-ноябрда Боливия борбору Тринидад болгон Бени департаментин түзгөн. Мурда Тринидад, Сан-Игнасио жана Лорето сыяктуу Мохос конуштары Санта-Крус департаментинин курамында болгон.'],'boliviaRepublic139');
 event('puerto-suarez',1875,bo,[-57.80,-18.97],['Основание Пуэрто-Суареса','Foundation of Puerto Suárez','Пуэрто-Суарестин негизделиши'],['Мигель Суарес Арана основал порт на востоке Боливии, у лагуны Касерес. Он планировал связать Санта-Крус с речными торговыми путями через реку Парагвай.','Miguel Suárez Arana founded a port on Laguna Cáceres in eastern Bolivia. He planned to connect Santa Cruz with river trade routes along the Paraguay.','Мигель Суарес Арана Боливиянын чыгышындагы Касерес лагунасынын жээгинде порт негиздеген. Ал Санта-Крусты Парагвай дарыясы аркылуу өтүүчү соода жолдору менен байланыштырууну көздөгөн.'],'boliviaRepublic139');
 event('nicaea',1331,os,[29.72,40.43],['Никея переходит под власть Орхана','Nicaea passes to Orhan','Никея Орхандын бийлигине өттү'],['2 марта 1331 года гарнизон Никеи сдал город Орхану. Бурса к этому времени уже была османской, а Никомедия оставалась у Римской империи (ар-Рум).','On 2 March 1331 the garrison of Nicaea surrendered the city to Orhan. Bursa was already Ottoman, while Nicomedia remained under Roman rule.','1331-жылдын 2-мартында Никеянын гарнизону шаарды Орханга өткөргөн. Бурса Осмон бийлигинде болчу, ал эми Никомедия Рим империясына (ар-Румга) караган.'],'bithynia139');
 event('nicomedia',1337,os,[29.92,40.77],['Переход Никомедии под власть Османов','Nicomedia passes to the Ottomans','Никомедия Осмон бийлигине өттү'],['После осады гарнизон Никомедии сдал крепость Орхану. Город занимал узел дорог у восточного берега Измитского залива.','After a siege the garrison of Nicomedia surrendered the fortress to Orhan. The town stood at a road junction at the head of the Gulf of İzmit.','Курчоодон кийин Никомедиянын гарнизону чепти Орханга өткөргөн. Шаар Измит булуңунун чыгыш жээгинде, жолдор кесилишкен жерде жайгашкан.'],'bithynia139');
 event('bejaia',1230,hf,[5.068,36.752],['Поход Хафсидов на Беджаю и Константину','The Hafsid campaign for Béjaïa and Constantine','Хафсиддердин Бежая менен Константинага жортуулу'],['После разрыва с Альмохадами Абу Закария занял Беджаю и Константину. Поход датируется 628 годом хиджры, то есть 1230–1231 годами.','After breaking with the Almohads, Abu Zakariyya took Béjaïa and Constantine. The campaign dates to AH 628, spanning 1230–1231.','Альмохаддардан бөлүнгөндөн кийин Абу Закария Бежая менен Константинаны ээлеген. Жортуул хижранын 628-жылына, башкача айтканда, 1230–1231-жылдарга туура келет.'],'hafsids139',{to:1231,approx:true});
 event('chaco-settlement',1938,bo,[-63.47,-21.25],['Боливия и Парагвай устанавливают границу в Чако','Bolivia and Paraguay settle the Chaco frontier','Боливия менен Парагвай Чакодогу чек араны аныкташты'],['После перемирия 1935 года стороны продолжали переговоры. 21 июля 1938 года они подписали мирный договор. Арбитраж 10 октября определил линию раздела. Вилья-Монтес остался в Боливии, Бокерон — в Парагвае.','Negotiations continued after the ceasefire of 1935. The two states signed a peace treaty on 21 July 1938. The award of 10 October determined the boundary. Villa Montes remained in Bolivia and Boquerón in Paraguay.','1935-жылкы ок атышууну токтотуудан кийин сүйлөшүүлөр уланган. Эки мамлекет 1938-жылдын 21-июлунда тынчтык келишимине кол койгон. 10-октябрдагы арбитраж чек араны аныктаган. Вилья-Монтес Боливияда, Бокерон Парагвайда калган.'],'chaco139');
 event('yacuiba',1938,bo,[-63.68,-22.02],['Граница у Якуибы','The frontier at Yacuiba','Якуибанын жанындагы чек ара'],['Договор Аргентины и Боливии, подписанный в 1925 году и ратифицированный в 1938-м, сохранил Якуибу за Боливией. Здесь граница отступает к югу от 22-й параллели и проходит по водотокам.','The boundary treaty signed in 1925 and ratified in 1938 kept Yacuiba in Bolivia. Here the frontier follows streams south of the 22nd parallel.','1925-жылы кол коюлуп, 1938-жылы ратификацияланган келишим Якуибаны Боливияда калтырган. Бул жерде чек ара 22-параллелден түштүккө бурулуп, суулардын нугун бойлой өтөт.'],'yacuiba139');
};
