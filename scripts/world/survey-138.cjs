'use strict';
const G=require('./cartography-geometry.cjs'),data=require('./frontiers-138.json');
module.exports=function(c,{source,revise,link,D,I,box,visibleAt}){
 source('silesia138','The Great Historical Atlas of Czech Silesia, § 1.3, Development of the State Border between 1742–1918. Czech Historical Atlas. Silesia in the Habsburg monarchy.',['https://mapa.atlas-slezska.cz/en.html','https://cha.fsv.cvut.cz/en/mapp.php?map=7Cc']);
 source('akhal138','Convention between Russia and Persia, 1881. International Boundary Study No. 25, Iran–U.S.S.R. Boundary. Encyclopaedia Iranica, Boundaries II.',['https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs025.pdf','https://www.qdl.qa/en/archive/81055/vdc_100025852016.0x000022','https://www.iranicaonline.org/articles/boundaries-ii/']);
 source('niger138','La tragédie malienne. Assemblée nationale. Étude d’impact relative à la restitution de biens culturels au Bénin et au Sénégal. Yves Saint-Martin. Un fils d’El Hadj Omar : Aguibou, roi du Dinguiray et du Macina.',['https://horizon.documentation.ird.fr/exl-doc/pleins_textes/2023-12/010061005.pdf','https://www.assemblee-nationale.fr/dyn/15/textes/l15b3221_etude-impact.pdf','https://www.persee.fr/doc/cea_0008-0055_1968_num_8_29_3128']);
 source('tacna138','Tratado de Ancón, 1883, artículos II–III. Tratado de Lima, 1929, artículos II–IV. International Court of Justice. Maritime Dispute (Peru v. Chile), judgment of 27 January 2014, §§ 17–20. Biblioteca Nacional de Chile. La Guerra del Pacífico. Autoridad Nacional del Agua del Perú. Red hidrográfica y Unidades Hidrográficas. Ministerio del Medio Ambiente de Chile. Red hidrográfica del IGM.',['https://api.icj-cij.org/sites/default/files/case-related/137/137-20140127-JUD-01-00-EN.pdf','https://www.bcn.cl/leychile/Navegar?idNorma=220112','https://www.bcn.cl/leychile/navegar?idNorma=220134','https://www.memoriachilena.gob.cl/602/w3-article-693.html','https://www.gob.pe/institucion/muniislaymollendo/noticias/1235528-28-de-agosto-reincorporacion-de-tacna-al-peru','https://www.idep.gob.pe/geoportal/rest/services/INSTITUCIONALES/ANA_WMS/MapServer/7','https://arcgis.mma.gob.cl/server/rest/services/SIMBIO/SIMBIO_HIDROGRAFIA/MapServer/0','https://services1.arcgis.com/RTK5Unh1Z71JKIiR/ArcGIS/rest/services/R%C3%ADos/FeatureServer/2']);
 const pr='1789-prussia',at='early-austria',ru='1789-russian-empire',ir='1789-qajar',pe='early-peru',cl='1789-chile',bo='1815-upper-peru';
 function replace(id,from,to,window,part,reason,src){
  revise([id],from,to,reason,src,p=>G.merge([D(p,window),part]));
 }
 // Central Silesia and the County of Glatz. The window ends before the
 // historic Opava/Těšín exceptions and excludes the Saxon Lusatias.
 const s=data.silesia,sw=G.merge([s.a,s.b]);
 for(const [owner,start,end,part] of [[pr,1742,1867,s.a],['late-hre',1867,1918,s.a],[at,1742,1918,s.b]])
  replace(owner,start,end,sw,part,'silesia-central-settlement','silesia138');
 const k=data.akhal,kw=G.merge([k.a,k.b]);
 for(const [id,part] of [[ru,k.b],[ir,k.a]])replace(id,1881,1893,kw,part,'akhal-delimited-reaches','akhal138');
 const kopet=G.merge([data.kopet.a,data.kopet.b]);
 for(const [id,part] of [[ru,data.kopet.b],[ir,data.kopet.a]])replace(id,1893,1917,kopet,part,'kopet-dag-after-1893','akhal138');
 // The two Kopet Dag windows omit later exchanges at Firyuza and Lotfabad.
 const p=data.pacific,pw=G.merge([p.peru,p.chile]);
 for(const [a,b,peruvian,chilean] of [
  [1866,1879,pw,[]],
  [1879,1880,G.merge([p.aboveSama,p.tacnaArica]),p.tarapaca],
  [1880,1929,p.aboveSama,G.merge([p.tarapaca,p.tacnaArica])]
 ]){
  replace(pe,a,b,pw,peruvian,'pacific-coastal-control','tacna138');
  replace(cl,a,b,pw,chilean,'pacific-coastal-control','tacna138');
  revise([bo],a,b,'coast-north-of-the-loa','tacna138',old=>D(old,pw));
 }
 const lima=G.merge([data.lima.a,data.lima.b]);
 replace(pe,1929,2011,lima,data.lima.a,'lima-treaty-to-bolivian-tripoint','tacna138');
 replace(cl,1929,2011,lima,data.lima.b,'lima-treaty-to-bolivian-tripoint','tacna138');
 for(const id of [bo,'1789-rio-plata'])revise([id],1929,2011,'lima-frontier-exterior','tacna138',old=>D(old,lima));
 const seg='1789-segou',djen='djenne-late',timb='timbuktu-late',fr='late-france';
 const district=visibleAt(djen,1892);
 // Show the documented Ségou foothold on the Niger without transferring the
 // whole outline of Ahmadu’s former state to France in the year of capture.
 const middle=G.union([[[-6.68,13.12],[-6.13,13.15],[-5.79,13.58],[-5.93,13.83],[-6.40,13.70],[-6.73,13.42]]]);
 revise([seg],1890,1893,'segou-french-protectorate','niger138',old=>I(old,middle));
 revise([seg],1893,1919,'segou-and-djenne-administrations','niger138',old=>D(old,district));
 link(fr,seg,1890,1893,'protectorate','niger138');
 for(const [member,start] of [[seg,1893],[djen,1893],[timb,1894]])link(fr,member,start,1919,'province','niger138');
 const h=require('./late-helpers.cjs')(c,{max:2026});
 c.mapComparisons=require('./comparisons-138.cjs');
 function administration(id,name,loc,shape,periods){
  const phases=periods.map(([from,to,status,description])=>h.phase(from,to,status,description,['tacna138'],{name,approx:false,frontierAdded:true}));
  h.entry(id,'south','region',loc,name,phases);
  for(const [from,to,status,description,relationship] of periods){
   const area=h.area(id,from,to,shape,{name,title:status,text:description,kind:'influence',sources:['tacna138'],color:'#947f62'});
   Object.assign(area,{frontierAdded:true,statusLabel:status,label:loc});
   c.cartography.areas[area.id]=c.cartography.shapes.length;c.cartography.shapes.push(shape);
   link(cl,id,from,to,relationship,'tacna138');
  }
 }
 const occupation=['Военная оккупация','Military occupation','Аскердик оккупация'];
 administration('survey138-tarapaca',['Побережье Тарапаки','Tarapacá coast','Тарапаканын жээги'],[-70.14,-20.22],p.tarapaca,[[1879,1884,occupation,['Чилийские войска заняли Икике в ноябре 1879 года. Перу уступило Тарапаку по Анконскому договору, вступившему в силу в 1884 году.','Chilean troops took Iquique in November 1879. Peru ceded Tarapacá under the Treaty of Ancón, which took effect in 1884.','Чили аскерлери Икикени 1879-жылдын ноябрында ээлешкен. Перу Тарапаканы 1884-жылы күчүнө кирген Анкон келишими боюнча Чилиге берген.'],'occupation']]);
 administration('survey138-tacna-coast',['Такна и Арика','Tacna and Arica','Такна жана Арика'],[-70.25,-18.01],p.tacnaArica,[
  [1880,1884,occupation,['В 1880 году чилийские войска заняли Такну в мае, Арику в июне.','In 1880 Chilean troops took Tacna in May and Arica in June.','1880-жылы Чили аскерлери майда Такнаны, июнда Ариканы ээлешкен.'],'occupation'],
  [1884,1929,['Управление по Анконскому договору','Administration under the Treaty of Ancón','Анкон келишими боюнча башкаруу'],['Статья III закрепила управление Чили. В 1929 году Лимский договор передал Такну Перу и оставил Арику Чили.','Article III provided for Chilean administration. The Treaty of Lima settled the question in 1929, assigning Tacna to Peru and Arica to Chile.','III берене боюнча аймакты Чили башкарган. 1929-жылкы Лима келишими Такнаны Перуга өткөрүп, Ариканы Чилиде калтырган.'],'administration']
 ]);
 function event(id,year,owner,loc,title,text,src){h.event('survey138-'+id,year,owner,'politics',loc,title,text,[src],{frontierAdded:true});}
 event('glatz',1742,pr,[16.66,50.435],['Клодзко и большая часть Силезии переходят Пруссии','Glatz and most of Silesia pass to Prussia','Клодзко жана Силезиянын көпчүлүк бөлүгү Пруссияга өттү'],['По миру 1742 года Габсбурги уступили Пруссии большую часть Силезии и графство Глац (Клодзко), прежде входившее в состав земель Чешской короны. Опава и Тешин остались у Габсбургов.','Under the peace of 1742, the Habsburgs ceded most of Silesia and the County of Glatz (Kłodzko), previously part of the Bohemian Crown, to Prussia. Opava and Těšín remained under Habsburg rule.','1742-жылкы тынчтык келишими боюнча Габсбургдар Силезиянын көпчүлүк бөлүгүн жана мурда Чех таажысына караган Глац (Клодзко) графтыгын Пруссияга өткөргөн. Опава менен Тешин Габсбургдарда калган.'],'silesia138');
 event('akhal',1881,ru,[58.38,37.95],['Ахалская конвенция','The Akhal Convention','Ахал конвенциясы'],['В декабре 1881 года Персия и Россия согласовали часть границы от Каспийского моря в направлении Баба-Дурмаза. Ашхабад оказался на российской стороне, Баджгиран — на персидской. Дальнейший участок к границе Афганистана стал предметом соглашения 1893 года.','In December 1881 Persia and Russia delimited part of the frontier from the Caspian towards Baba Durmaz. Ashgabat lay on the Russian side and Bajgiran on the Persian side. A further agreement in 1893 addressed the stretch towards Afghanistan.','1881-жылдын декабрында Персия менен Орусия Каспийден Баба-Дурмазга карай чек аранын бир бөлүгүн аныкташкан. Ашхабад Орусия, Бажгиран Персия тарапта калган. Ооганстанды көздөй кеткен кийинки тилке боюнча 1893-жылы келишим түзүлгөн.'],'akhal138');
 event('niger',1893,djen,[-4.555,13.907],['Французские войска занимают Дженне','French troops take Djenné','Француз аскерлери Женне шаарын ээлешти'],['В 1890 году французские войска заняли Сегу на Нигере. В апреле 1893 года они заняли Дженне и Бандиагару. В Бандиагаре французские власти поддержали правление Агибу Талла.','French troops occupied Ségou on the Niger in 1890. In April 1893 they took Djenné and Bandiagara. In Bandiagara the French authorities supported the rule of Agibu Tall.','Француз аскерлери 1890-жылы Нигер дарыясындагы Сегуну ээлешкен. 1893-жылдын апрелинде алар Женне менен Бандиагараны ээлешкен. Бандиагарада француз бийлиги Агибу Таллдын башкаруусун колдогон.'],'niger138');
 event('ancon',1883,pe,[-70.14,-20.22],['Анконский договор: Тарапака, Такна и Арика','The Treaty of Ancón and the Pacific coast','Анкон келишими жана Тынч океандын жээги'],['Чили заняло Икике в 1879 году, Такну и Арику — в 1880 году. По договору, подписанному в 1883 году и ратифицированному в 1884-м, Перу уступило Чили Тарапаку. Такна и Арика оставались под управлением Чили до решения об их будущем. Предусмотренный договором плебисцит не состоялся.','Chile occupied Iquique in 1879 and Tacna and Arica in 1880. By the treaty signed in 1883 and ratified in 1884, Peru ceded Tarapacá to Chile. Tacna and Arica remained under Chilean administration pending a settlement. The plebiscite provided for in the treaty was never held.','Чили 1879-жылы Икикени, 1880-жылы Такна менен Ариканы ээлеген. 1883-жылы кол коюлуп, 1884-жылы ратификацияланган келишим боюнча Перу Тарапаканы Чилиге өткөргөн. Такна менен Арика алардын келечеги чечилгенге чейин Чилинин башкаруусунда калган. Келишимде каралган элдик добуш берүү өткөн эмес.'],'tacna138');
 event('tacna',1929,pe,[-70.25,-18.01],['Такна возвращается под управление Перу','Tacna returns to Peruvian administration','Такна Перунун башкаруусуна кайтып келди'],['3 июня 1929 года Перу и Чили подписали Лимский договор. 28 августа Перу приняло управление Такной. Арика осталась за Чили. До передачи оба города находились под чилийским управлением.','Peru and Chile signed the Treaty of Lima on 3 June 1929. Peru took over the administration of Tacna on 28 August. Arica remained in Chile. Until the handover both cities were under Chilean administration.','Перу менен Чили 1929-жылдын 3-июнунда Лима келишимине кол коюшкан. 28-августта Перу Такнаны башкарууну кабыл алган. Арика Чилиде калган. Ага чейин эки шаарды тең Чили башкарган.'],'tacna138');
};
