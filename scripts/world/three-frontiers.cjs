'use strict';
const G=require('./cartography-geometry.cjs'),data=require('./three-frontiers.json');
const L=s=>s.split('|');
module.exports=function apply({source,revise,visibleAt,link,D,I,register,lesson}){
 const q='1789-qing',r='1789-russian-empire',ot='late-ottoman',sa='early-safavid',pr='1789-prussia',au='early-austria',dw='1815-warsaw';
 source('iliPamirReview','Office of the Geographer. International Boundary Study 64. Treaty of Saint Petersburg (1881) and boundary protocols (1882–1893). Two Dungan Migrations. Highland Asia. Russian Pamir Connections. Report on the Proceedings of the Pamir Boundary Commission. CShapes 2.0. Natural Earth.',['https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs064.pdf','https://www.eastasianhistory.org/44/two-dungans/index.html','https://www.highlandasia.net/projects/rusarchive.html','https://specialcollections.exeter.ac.uk/2025/11/21/the-pamir-commission-eul-ms-152/','https://icr.ethz.ch/data/cshapes/']);
 source('iraqCitiesReview','Rudi Matthee. Iraq: Relations in the Safavid Period. Encyclopaedia Iranica. TDV İslâm Ansiklopedisi. Bağdat; Musul; Hâfız Ahmed Paşa.',['https://www.iranicaonline.org/articles/iraq-iv-safavid-period/','https://islamansiklopedisi.org.tr/bagdat','https://islamansiklopedisi.org.tr/musul--irak','https://islamansiklopedisi.org.tr/hafiz-ahmed-pasa']);
 source('pilicaReview','German Historical Institute. The Partitions of Poland, 1772–1795. Zygmunt Gloger. Geografia historyczna ziem dawnej Polski. City of Kraków. Historyczne widoki i plany Krakowa. Natural Earth. Rivers of Europe, 1:10m.',['https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/the-partitions-of-poland-1772-1795','https://literat.ug.edu.pl/glogre/0014.htm','https://www.krakow.pl/1495%2Cartykul%2Chistoryczne-widoki-i-plany-krakowa---plany-z-xvii-i-xviii-wieku.html','https://www.naturalearthdata.com/downloads/10m-physical-vectors/']);
 // Reassign only existing land inside a separately verified interior.
 // The five interior masks exclude the immediate modern frontier. All dated
 // CShapes reconstructions covering 1894–1916 contain the corresponding mask.
 function datedShapes(ids,from,to,apply){
  let first=from,lastKey=null,lastShapes=null;
  for(let y=from;y<to;y++){
   const shapes=ids.map(id=>visibleAt(id,y)),key=JSON.stringify(shapes);
   if(key===lastKey)continue;
   if(lastShapes)apply(first,y,lastShapes);
   first=y;lastKey=key;lastShapes=shapes;
  }
  if(lastShapes)apply(first,to,lastShapes);
 }
 for(const [owner,other,mask] of [[q,r,data.iliChina],[r,q,data.iliRussia],[q,r,data.pamirChina],[r,q,data.pamirRussia],[r,q,data.pamirNorth]]){
  datedShapes([other],1894,1917,(from,to,[shape])=>{
   const misplaced=I(mask,shape);
   if(misplaced.length)hold(owner,other,from,to,misplaced,'iliPamirReview','ili-pamir-confirmed-interior');
  });
 }
 function hold(owner,other,from,to,shape,src,reason){
  revise([owner],from,to,reason,src,p=>G.merge([p,shape]));
  revise([other],from,to,reason,src,p=>D(p,shape));
 }
 source('semirechyeDistricts','Карта Нарынского края по рекогносцировкам в 1868 и 1869 годах. Памятные книжки Семиреченской области. Документальные материалы по истории г. Каракол.',['https://elib.rgo.ru/handle/123456789/236794','https://nlr.ru/elibrarypro/memo/RA6248/semirechenskaya-oblast','https://archive.kg/images/Putevoditel/Issiyk-kul_IRUA.pdf']);
 // Only remove duplicate Chinese fill inside the Russian district interiors.
 // The masks stop short of the international frontier, the Ili valley and the Pamir.
 const districtInteriors=[
  [1868,[[75.40,41.26],[75.80,41.15],[76.19,41.21],[76.40,41.37],[76.26,41.52],[75.75,41.58],[75.40,41.48]]],
  [1870,[[76.52,42.18],[77.53,42.13],[78.10,42.22],[78.61,42.39],[78.71,42.59],[78.43,42.79],[77.75,42.82],[76.67,42.58]]]
 ];
 for(const [start,ring] of districtInteriors){
  const mask=G.union([ring]);
  datedShapes([q,r],start,1917,(from,to,[china,russia])=>{
   const duplicate=I(I(mask,china),russia);
   if(duplicate.length)revise([q],from,to,'semirechye-district-interior','semirechyeDistricts',p=>D(p,duplicate));
  });
 }
 // Regional reconstructions of the city and river approaches. Do not use
 // the modern Iraqi frontier or extend a city transfer across the mountains.
 const baghdad=G.union([[[44.25,33.51],[44.50,33.49],[44.59,33.27],[44.55,32.96],[44.42,32.45],[44.34,32.01],[44.28,31.96],[44.16,32.04],[44.14,32.46],[43.96,32.57],[43.98,32.68],[44.18,32.76],[44.27,33.15]]]);
 const mosul=G.union([[[43.06,36.26],[43.17,36.25],[43.21,36.34],[43.17,36.43],[43.09,36.42],[43.04,36.34]]]);
 hold(sa,ot,1508,1534,baghdad,'iraqCitiesReview','safavid-central-iraq');
 hold(ot,sa,1534,1624,baghdad,'iraqCitiesReview','ottoman-central-iraq');
 hold(sa,ot,1624,1638,baghdad,'iraqCitiesReview','shah-abbas-central-iraq');
 hold(ot,sa,1638,1722,baghdad,'iraqCitiesReview','ottoman-return-to-baghdad');
 hold(ot,sa,1517,1624,mosul,'iraqCitiesReview','ottoman-mosul');
 hold(sa,ot,1624,1625,mosul,'iraqCitiesReview','brief-safavid-mosul');
 hold(ot,sa,1625,1722,mosul,'iraqCitiesReview','ottoman-return-to-mosul');
 const kirkuk=G.union([[[44.27,35.43],[44.36,35.36],[44.48,35.42],[44.50,35.51],[44.41,35.58],[44.30,35.54]]]);
 const erbil=G.union([[[43.86,36.14],[43.99,36.08],[44.13,36.14],[44.16,36.23],[44.03,36.30],[43.89,36.25]]]);
 source('iraqNorthernTowns','TDV İslâm Ansiklopedisi. Kerkük; Musul; Erbil. Rudi Matthee. Iraq: Relations in the Safavid Period.',['https://islamansiklopedisi.org.tr/kerkuk','https://islamansiklopedisi.org.tr/musul--irak','https://islamansiklopedisi.org.tr/erbil','https://www.iranicaonline.org/articles/iraq-iv-safavid-period/']);
 hold(sa,ot,1624,1625,kirkuk,'iraqNorthernTowns','safavid-kirkuk');
 // Accounts differ on control during the 1625 expedition. The later
 // recovery in 1630 is explicit in the city's own historical profile.
 hold(ot,sa,1630,1722,kirkuk,'iraqNorthernTowns','ottoman-kirkuk');
 hold(ot,sa,1535,1623,erbil,'iraqNorthernTowns','erbil-district');
 hold(ot,sa,1639,1722,erbil,'iraqNorthernTowns','erbil-shahrazur');
 function occupation(id,name,coord,shape,from,to,occupier,neighbours,text,src){
  const status=L('Военная оккупация|Military occupation|Аскердик оккупация');
  register(id,'eurasia',coord,L(name),[{from,to,shape,text:L(text),title:status,status}], '#b49470',src,'city');
  for(const neighbour of neighbours)revise([neighbour],from,to,id,src,p=>D(p,shape));
  link(occupier,id,from,to,'occupation',src);
 }
 const basra=G.union([[[47.78,30.47],[47.83,30.46],[47.86,30.50],[47.85,30.55],[47.80,30.55],[47.77,30.52]]]);
 occupation('review-basra-garrison','Басра|Basra|Басра',[47.82,30.50],basra,1697,1701,sa,[ot,sa],'В марте 1697 года в Басру вошли сефевидские войска. В марте 1701 года город принял османского губернатора.|Safavid troops occupied Basra in March 1697. An Ottoman governor entered the city in March 1701.|1697-жылдын мартында Басрага Сефеви аскерлери кирген. 1701-жылдын мартында шаарды Осмон губернатору кабыл алган.','iraqCitiesReview');
 hold(ot,sa,1701,1722,basra,'iraqCitiesReview','basra-restored');
 // Use the natural river sections only. Leave out the modern Sulejów
 // reservoir and the historical exceptions around the upper headwaters.
 function banks(river,upper){
  const [x,y]=river[0],[X,Y]=river.at(-1);
  return (upper?[19.05,20.50]:[52.10,50.88]).map(edge=>G.union([[...river,...(upper?[[edge,Y],[edge,y]]:[[X,edge],[x,edge]])]]));
 }
 for(const [Prussian,Austrian] of [banks(data.pilicaUpper,true),banks(data.pilicaLower,false)]){
  for(const [from,to,west] of [[1795,1807,pr],[1807,1809,dw]]){
   datedShapes([west,au],from,to,(start,end,shapes)=>{
    const extent=G.merge(shapes);
    hold(west,au,start,end,I(Prussian,extent),'pilicaReview','pilica-left-bank');
    hold(au,west,start,end,I(Austrian,extent),'pilicaReview','pilica-right-bank');
   });
  }
 }
 const krakow=G.union([[[19.932,50.052],[19.940,50.050],[19.946,50.059],[19.944,50.067],[19.935,50.067],[19.930,50.061]]]);
 occupation('review-krakow-garrison','Краков|Kraków|Краков',[19.938,50.061],krakow,1794,1796,pr,[pr,au,'early-commonwealth'],'Прусские войска заняли Краков в июне 1794 года. Австрия получила город по разделу 1795 года и вступила в него в январе 1796 года.|Prussian troops occupied Kraków in June 1794. Austria received the city in the 1795 partition and took possession in January 1796.|Пруссия аскерлери Краковду 1794-жылдын июнунда ээлеген. 1795-жылкы бөлүштүрүүдө шаар Австрияга берилип, анын аскерлери 1796-жылдын январында кирген.','pilicaReview');
 hold(au,pr,1796,1809,krakow,'pilicaReview','austrian-krakow');
 hold(dw,au,1809,1815,krakow,'pilicaReview','duchy-krakow');
 lesson('mosul-baghdad-transfers',1624,sa,[43.13,36.34],'Мосул и Багдад при шахе Аббасе|Mosul and Baghdad under Shah Abbas|Шах Аббас тушундагы Мосул жана Багдад','После похода на Багдад сефевидские войска заняли Мосул. Уже в 1625 году Мосул вернулся под османское управление. Багдад оставался у Сефевидов до 1638 года.|After the Baghdad campaign, Safavid troops took Mosul. Mosul returned to Ottoman control in 1625. Baghdad remained Safavid until 1638.|Багдад жортуулунан кийин Сефеви аскерлери Мосулду алган. 1625-жылы Мосул Осмон бийлигине кайткан. Багдад 1638-жылга чейин Сефевилерде калган.','iraqCitiesReview','Когда Мосул и Багдад сменили власть?|When did Mosul and Baghdad change hands?|Мосул менен Багдадда бийлик качан алмашкан?',
 [[[43.13,36.34],'Мосул|Mosul|Мосул'],[[44.36,33.31],'Багдад|Baghdad|Багдад']],[[1624,'Мосул и Багдад под властью Сефевидов.|Mosul and Baghdad are under Safavid control.|Мосул менен Багдад Сефевилердин бийлигинде.'],[1625,'Османы вернули Мосул. Багдад удерживают Сефевиды.|The Ottomans retook Mosul. The Safavids held Baghdad.|Осмондор Мосулду кайтарып алды. Багдад Сефевилерде калды.'],[1638,'Османы вернули Багдад.|The Ottomans retook Baghdad.|Осмондор Багдадды кайтарып алды.']],16);
 lesson('krakow-partition-transfer',1796,au,[19.938,50.061],'Австрия принимает Краков|Austria takes possession of Kraków|Краков Австриянын башкаруусуна өттү','После раздела 1795 года Краков перешёл к Австрии. Прусский гарнизон покинул город в январе 1796 года. На участке Пилицы прусские земли лежали на левом берегу, австрийские — на правом.|The 1795 partition assigned Kraków to Austria. Prussian troops left the city in January 1796. Along the reviewed reach of the Pilica, Prussia held the left bank and Austria the right.|1795-жылкы бөлүштүрүүдө Краков Австрияга берилген. Пруссия гарнизону 1796-жылдын январында шаардан кеткен. Пилицанын каралган тилкесинде сол жээк Пруссияга, оң жээк Австрияга таандык болгон.','pilicaReview','Кто управлял Краковом после раздела?|Who governed Kraków after the partition?|Бөлүштүрүүдөн кийин Краковду ким башкарган?',
 [[[19.938,50.061],'Краков|Kraków|Краков'],[[19.875,51.088],'Пшедбуж · Пилица|Przedbórz · Pilica|Пшедбуж · Пилица']],[[1795,'В Кракове стоит прусский гарнизон.|A Prussian garrison holds Kraków.|Краковдо Пруссия гарнизону турат.'],[1796,'В январе в город входят австрийские войска.|Austrian troops enter the city in January.|Январда шаарга Австрия аскерлери кирди.'],[1809,'Краков переходит к Варшавскому герцогству.|Kraków passes to the Duchy of Warsaw.|Краков Варшава герцогдугуна өтөт.']],18);
 lesson('pamir-post-murghab',1893,r,[73.97,38.17],'Памирский пост в Мургабе|Pamir Post at Murghab|Мургабдагы Памир посту','В Мургабе появился постоянный российский гарнизон. Соглашение Великобритании и России 1895 года касалось разграничения у Афганистана; Китай в нём не участвовал.|A permanent Russian garrison was established at Murghab. The 1895 Anglo-Russian agreement concerned the Afghan frontier. China was not a party.|Мургабда туруктуу орус гарнизону түзүлгөн. 1895-жылкы британ-орус келишими Ооганстан менен чектеш аймакка тиешелүү болгон. Кытай ага катышкан эмес.','iliPamirReview','Где находился Памирский пост?|Where was Pamir Post?|Памир посту кайда жайгашкан?',
 [[[73.97,38.17],'Памирский пост · Мургаб|Pamir Post · Murghab|Памир посту · Мургаб'],[[73.7,37.44],'Зоркуль|Lake Zorkul|Зоркөл']],[[1893,'В Мургабе основан российский пост.|A Russian post is established at Murghab.|Мургабда орус посту түзүлдү.'],[1895,'Комиссия обследует рубеж к востоку от Зоркуля.|The commission surveys the frontier east of Lake Zorkul.|Комиссия Зоркөлдүн чыгышындагы чек араны изилдейт.']],16);
};

