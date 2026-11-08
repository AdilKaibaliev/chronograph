'use strict';
const G=require('./cartography-geometry.cjs'),pal=require('./palaiologan-frontiers.cjs'),data=require('./frontiers-140.json');
const ports=[
 ['PRT','late-portugal',1300],['SWE','early-sweden',1454],['URY','1815-banda-oriental',1828],['NZL','1914-new-zealand',1849],
 ['FJI','1991-fiji',1970],['GMB','1991-gambia',1965],['GIN','1960-guinea',1958],['LBR','1848-liberia',1847],['SLE','1991-sierra-leone',1961],
 ['ISL','iceland',1918],['LBN','1939-lebanon',1943],['OMN','1789-oman',1650],['GNQ','1991-eq-guinea',1968],['DJI','1991-djibouti',1977],
 ['LBY','early-tripoli',1951],['VUT','1991-vanuatu',1980]
];
module.exports=function(c,{source,revise,link,visibleAt,D}){
 const H=require('./late-helpers.cjs')(c,{start:610,max:2026});
 source('palaiologoi140','William R. Shepherd. Historical Atlas. The Eastern Mediterranean about 1265 and about 1355; Europe and the Mediterranean Lands about 1451. The Cambridge History of the Byzantine Empire. The Palaiologoi and the World Around Them. TDV İslâm Ansiklopedisi. Gelibolu; Selânik; Alaşehir; Edirne.',[
 'https://maps.lib.utexas.edu/maps/historical/shepherd_1911/shepherd-c-089.jpg','https://maps.lib.utexas.edu/maps/historical/shepherd_1911/shepherd-c-093.jpg','https://www.cambridge.org/core/books/abs/cambridge-history-of-the-byzantine-empire-c5001492/palaiologoi-and-the-world-around-them-12611400/1734B29353D17D88C041121E70875116','https://islamansiklopedisi.org.tr/selanik','https://islamansiklopedisi.org.tr/gelibolu','https://islamansiklopedisi.org.tr/alasehir']);
 source('deccan140','Archaeological Survey of India. Epigraphia Indica, Arabic and Persian Supplement. Bahmani Inscriptions from Raichur District. Richard M. Eaton. “Kiss My Foot,” Said the King: Firearms, Diplomacy, and the Battle for Raichur, 1520. Robert Sewell. A Forgotten Empire: Vijayanagar, including the chronicle of Fernão Nuniz. Natural Earth. Rivers and Lake Centerlines, 1:10m.',[
 'https://ignca.gov.in/Asi_data/75161.pdf','https://doi.org/10.1017/S0026749X07003289','https://www.gutenberg.org/ebooks/3310','https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/']);
 source('ports140','Natural Earth. Admin 0 – Countries, Coastline and Populated Places, 1:10m. United Nations. The United Nations and Decolonization. Foreign Ministry of Oman. History of Oman.',[
 'https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/','https://www.un.org/dppa/decolonization/history/former-trust-and-nsgts','https://www.fm.gov.om/en/about-oman/state/history/']);
 function regional(id,phases,name,point,detail,color){
  H.entry(id,'eurasia','region',point,name,phases.map(([from,to])=>H.phase(from,to,name,detail,['palaiologoi140'],{frontierAdded:true})));
  for(const [from,to,p] of phases){const a=H.area(id,from,to,p,{color,sources:['palaiologoi140']});Object.assign(a,{frontierAdded:true,label:point});c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);}
 }
 const epi='survey140-epirus',ven='survey140-venetian-salonika';
 regional(epi,[[1262,1319,pal.epirus],[1319,1338,D(pal.epirus,pal.ioannina)]],['Эпирское государство','State of Epirus','Эпир мамлекети'],[20.98,39.16],['После возвращения Константинополя Михаилом VIII Эпир сохранил отдельный двор в Арте. Янина приняла власть императора в 1319 году. В 1337–1338 годах Андроник III подчинил Эпир.','After Michael VIII recovered Constantinople, Epirus retained a separate court at Arta. Ioannina accepted imperial rule in 1319. Andronikos III annexed Epirus in 1337–1338.','Михаил VIII Константинополду кайтарып алгандан кийин Эпирдин өз ордосу Артада калды. Янина 1319-жылы императордун бийлигин тааныды. 1337–1338-жылдары Андроник III Эпирди өзүнө каратты.'],'#b49d76');
 regional(ven,[[1423,1430,pal.salonika]],['Фессалоника под управлением Венеции','Venetian Thessalonica','Венеция башкарган Фессалоника'],[22.94,40.64],['В 1423 году Андроник Палеолог передал город Венеции. В марте 1430 года его заняли войска Мурада II.','Andronikos Palaiologos transferred the city to Venice in 1423. Murad II’s army took it in March 1430.','1423-жылы Андроник Палеолог шаарды Венецияга өткөрүп берген. 1430-жылдын мартында шаарды Мурад IIнин аскери алды.'],'#bd9876');
 const dates=[1300,...pal.dates.filter(y=>y>1300)];
 for(let i=0;i<dates.length-1;i++){
  const y=dates[i],end=dates[i+1],p=pal.roman(y);
  revise(['late-rum'],y,end,'palaiologan-dated-extent','palaiologoi140',()=>p);
  revise(['late-rum-seljuk'],y,end,'western-roman-frontier','palaiologoi140',s=>D(s,p));
  revise(['late-ottoman'],y,end,'roman-ottoman-forts-and-coasts','palaiologoi140',s=>{
   let land=s;
   if(y>=1354&&(y<1367||y>=1377))land=G.merge([land,pal.gallipoli]);
   if(y>=1387&&y<1403||y>=1430)land=G.merge([land,pal.salonika]);
   if(y>=1423&&y<1430)land=D(land,pal.salonika);
   return D(land,p);
  });
 }
 revise(['late-morea'],1453,1460,'peloponnese-after-the-fall','palaiologoi140',()=>pal.morea(1453));
 revise(['late-ottoman'],1453,1460,'morea-before-1460','palaiologoi140',old=>D(old,pal.morea(1453)));
 // The current river traces locate the historical interfluve. Campaigns and
 // inscriptions locate garrisons. No river line is projected across the Deccan.
 const north=data.krishna,south=data.tungabhadra;
 const doab=G.union([[...north,...south.slice().reverse(),[76.23,15.49],[76.18,15.67],[76.03,15.78],[75.93,15.97],[76.02,16.12]]]);
 // Both rivers meet at the eastern end. Taper each reviewed bank back into
 // the existing regional reconstruction instead of painting a map-frame edge.
 function bank(line,width){
  const x0=line[0][0],x1=line.at(-1)[0];
  const offset=([x,y])=>[x,y+width*Math.max(0,Math.min(1,(x-x0)/.37,(x1-x)/.46))];
  return G.union(line.slice(1).map((p,i)=>[line[i],p,offset(p),offset(line[i])]).filter(r=>Math.abs(G.signed(r))>.00000001));
 }
 const beyondNorth=bank(north,.43),beyondSouth=bank(south,-.27);
 const vi='late-vijayanagara',ba='late-bahmani',bi='early-bijapur',go='early-golconda';
 revise([vi],1400,1565,'krishna-northern-bank','deccan140',s=>D(s,beyondNorth));
 revise([ba,bi,go],1400,1565,'tungabhadra-southern-bank','deccan140',s=>D(s,beyondSouth));
 for(const [from,to,id] of [[1400,1490,ba],[1490,1518,bi],[1518,1535,bi]]){
  // The Qutb Shahi frontier north of the confluence is outside the fort's
  // documented transfer. Preserve its separately reconstructed territory.
  const bankLand=from<1518?beyondNorth:D(beyondNorth,visibleAt(go,from));
  revise([id],from,to,'krishna-held-bank','deccan140',s=>G.merge([s,bankLand]));
 }
 revise([vi],1400,1565,'tungabhadra-held-bank','deccan140',s=>G.merge([s,beyondSouth]));
 for(const [from,to,owner] of [[1468,1490,ba],[1490,1492,bi],[1510,1520,bi],[1520,1530,vi],[1530,1535,bi]]){
  revise([owner],from,to,'raichur-held-interfluve','deccan140',s=>G.merge([s,doab]));
  revise([ba,bi,vi,go].filter(id=>id!==owner),from,to,'raichur-opposite-frontier','deccan140',s=>D(s,doab));
 }
 for(const [code,id,from] of ports){
  const coast=data.areas[code];revise([id],from,2011,'surveyed-port-'+code,'ports140',p=>code==='GMB'?coast:G.merge([p,coast]));
 }
 // Modern state lines constrain the reference patches for neighbours; this is
 // limited to the estuary and the period of the surveyed modern states.
 revise(['1960-senegal'],1965,2011,'gambian-estuary-bank','ports140',s=>G.merge([D(s,data.areas.GMB),data.areas.SEN]));
 revise(['mogadishu-late','1991-somaliland'],1977,2011,'djibouti-southern-shore','ports140',s=>D(s,data.areas.DJI));
 revise(['1789-oman'],1601,1650,'portuguese-muscat','ports140',s=>D(s,data.areas.OMN));
 revise(['late-portugal'],1507,1650,'portuguese-muscat','ports140',s=>G.merge([s,data.areas.OMN]));
 source('caribbean140','Historic Bridgetown and its Garrison. UNESCO. The Constitution of Barbados. The Saint Lucia Constitution Order 1978; Government of Saint Lucia. Constitutional Development. Natural Earth. Admin 0 – Countries, 1:10m.',[
 'https://whc.unesco.org/en/list/1376/','https://www.gov.bb/Government/barbados-constitution','https://www.govt.lc/constitutionaldevelopment','https://archive.stlucia.gov.lc/saint_lucia/saintluciaconstitution/the_saint_lucia_constitution.htm']);
 const britain='1789-great-britain',barbados='survey140-barbados',lucia='survey140-saint-lucia';
 for(const [id,from,to,code] of [['late-england',1627,1707,'BRB'],[britain,1707,1966,'BRB'],[britain,1814,1967,'LCA']]){
  revise([id],from,to,'british-caribbean-island-'+code,'caribbean140',p=>G.merge([p,data.areas[code]]));
 }
 function island(id,code,name,pt,rows){
  H.entry(id,'north','state',pt,name,rows.map(([from,to,title,detail])=>H.phase(from,to,title,detail,['caribbean140'],{name,approx:false,frontierAdded:true})));
  for(const [from,to] of rows){const a=H.area(id,from,to,data.areas[code],{color:code==='BRB'?'#ada252':'#819865',sources:['caribbean140']});Object.assign(a,{frontierAdded:true,label:pt});c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(data.areas[code]);}
 }
 const bname=['Барбадос','Barbados','Барбадос'],lname=['Сент-Люсия','Saint Lucia','Сент-Люсия'];
 island(barbados,'BRB',bname,[-59.61,13.10],[[1966,2011,bname,['30 ноября 1966 года Барбадос получил независимость. Бриджтаун остался столицей государства.','Barbados became independent on 30 November 1966. Bridgetown remained the capital.','Барбадос 1966-жылдын 30-ноябрында көз карандысыздык алды. Бриджтаун борбор шаар бойдон калды.']]]);
 island(lucia,'LCA',lname,[-61.0,14.0],[[1967,1979,['Ассоциированное государство Сент-Люсия','Associated State of Saint Lucia','Сент-Люсия ассоциацияланган мамлекети'],['Сент-Люсия получила внутреннее самоуправление. Великобритания отвечала за внешние сношения и оборону.','Saint Lucia gained internal self-government. Britain retained responsibility for foreign affairs and defence.','Сент-Люсия ички өзүн-өзү башкаруу укугун алды. Тышкы саясат жана коргонуу Британиянын карамагында калды.']],[1979,2011,lname,['22 февраля 1979 года Сент-Люсия получила независимость. Столица страны — Кастри.','Saint Lucia became independent on 22 February 1979. Castries is its capital.','Сент-Люсия 1979-жылдын 22-февралында көз карандысыздык алды. Борбору — Кастри.']]]);
 link(britain,lucia,1967,1979,'association','caribbean140');
 source('danube140','Office of the Geographer. International Boundary Study No. 53: Bulgaria–Romania Boundary. Treaty of Berlin (1878), Treaty of Bucharest (1913) and Treaty of Craiova (1940). Natural Earth. Admin 0 – Countries, 1:10m.',[
 'https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs053.pdf']);
 // The river reach upstream of Tutrakan remained a shared frontier when
 // Southern Dobruja changed hands. Wartime control in 1916–18 is separate.
 for(const [from,to,segment] of [[1878,1902,'river'],[1902,1913,'1940'],[1913,1916,'western'],[1919,1940,'western'],[1940,2011,'1940']]){
  const {ROU,BGR}=data.danube[segment];
  for(const [id,own,other] of [['1914-romania',ROU,BGR],['1914-bulgaria',BGR,ROU]])revise([id],from,to,'lower-danube-'+segment,'danube140',old=>G.merge([D(old,other),own]));
 }
 function lesson(id,year,owner,coord,title,text,src,question,places,frames,scale){
  H.event(id,year,owner,'politics',coord,title,text,[src],{frontierAdded:true});
  c.mapComparisons={...c.mapComparisons,[id]:{question,places,frames,scale}};
 }
 const thess=[22.94,40.64],fort=[77.35,16.20];
 lesson('survey140-thessalonica',1423,ven,thess,['Передача Фессалоники Венеции','Thessalonica passes to Venice','Фессалониканын Венецияга өтүшү'],
 ['Андроник Палеолог передал осаждённую Фессалонику Венеции. Венецианская администрация удерживала город до османского завоевания в 1430 году.','Andronikos Palaiologos transferred the besieged city to Venice. Its Venetian administration lasted until the Ottoman conquest in 1430.','Андроник Палеолог курчоодо калган Фессалониканы Венецияга өткөргөн. Венеция шаарды 1430-жылдагы Осмон басып алуусуна чейин башкарган.'],'palaiologoi140',
 ['Кто владел Фессалоникой?','Who governed Thessalonica?','Фессалониканы ким башкарган?'],[[thess,['Фессалоника','Thessalonica','Фессалоника']]],
 [[1387,['Османы заняли город.','The Ottomans took the city.','Осмондор шаарды ээлешти.']],[1403,['По договору город вернулся под власть ар-Рума.','A treaty restored the city to Roman rule.','Келишим боюнча шаар ар-Румдун бийлигине кайтты.']],[1423,['Венеция приняла управление городом.','Venice took over the administration.','Шаар Венециянын башкаруусуна өттү.']],[1430,['Войско Мурада II взяло Фессалонику.','Murad II’s army captured Thessalonica.','Мурад IIнин аскери Фессалониканы алды.']]],15);
 lesson('survey140-raichur',1520,vi,fort,['Битва за Райчур','Battle for Raichur','Райчур үчүн салгылаш'],['Кришнадеварая разбил армию Биджапура и взял крепость Райчур. Она контролировала дороги в междуречье Кришны и Тунгабхадры.','Krishnadevaraya defeated the army of Bijapur and took Raichur fort, which commanded routes between the Krishna and Tungabhadra rivers.','Кришнадеварая Бижапурдун аскерин жеңип, Райчур чебин алган. Чеп Кришна менен Тунгабхадра дарыяларынын ортосундагы жолдорду көзөмөлдөгөн.'],'deccan140',
 ['Как менялся владелец крепости Райчур?','How did control of Raichur fort change?','Райчур чебинин ээси кантип өзгөргөн?'],[[fort,['Райчур','Raichur','Райчур']]],
 [[1519,['Крепость удерживает Биджапур.','Bijapur holds the fort.','Чеп Бижапурдун колунда.']],[1520,['Победа Кришнадеварая передала крепость Виджаянагаре.','Krishnadevaraya’s victory brought the fort under Vijayanagara.','Кришнадевараянын жеңиши менен чеп Вижаянагарага өттү.']],[1530,['Исмаил Адил-шах вернул Райчур Биджапуру.','Ismail Adil Shah recovered Raichur for Bijapur.','Исмаил Адил-шах Райчурду Бижапурга кайтарып алды.']]],20);
};
module.exports.modern=[...ports.map(p=>p[1]),'1960-senegal','mogadishu-late','1991-somaliland','survey140-barbados','survey140-saint-lucia','1914-romania','1914-bulgaria'];

