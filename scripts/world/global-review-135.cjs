'use strict';
const G=require('./cartography-geometry.cjs');
const geography=require('./world-corridors.json');
const sourceList={
  worldGoldCoast:['Office of the Geographer. International Boundary Study 138, Ghana–Ivory Coast Boundary. Anglo-French agreement regarding the boundary of the Ivory Coast and the Gold Coast, 11 May 1905.',['https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs138.pdf']],
  worldWestGuinea:['Papua Act 1905, territorial limits. United Nations. United Nations Security Force in West New Guinea, Historical Background. Agreement concerning West New Guinea, 15 August 1962.',['https://www.legislation.gov.au/C1905A00009/asmade/1905-11-16/text/original/epub/OEBPS/document_1/document_1.html','https://peacekeeping.un.org/sites/default/files/past/unsfbackgr.html','https://peacemaker.un.org/en/node/9217']],
  worldGuinea:['British and German agreement on the division of New Guinea, April 1885. Parliamentary Papers of New Zealand, 1885. Papua Act 1905. National Archives of Australia. Records of Papua New Guinea, 1883–1942; Independence of Papua New Guinea.',['https://paperspast.natlib.govt.nz/parliamentary/appendix-to-the-journals-of-the-house-of-representatives/1885/I/116','https://www.legislation.gov.au/C1905A00009/asmade/1905-11-16/text/original/epub/OEBPS/document_1/document_1.html','https://www.naa.gov.au/help-your-research/fact-sheets/records-papua-new-guinea-1883-1942','https://www.naa.gov.au/help-your-research/fact-sheets/independence-papua-new-guinea']],
  worldIslandBoundary:['Dominican Republic–Haiti Boundary. Office of the Geographer, International Boundary Study 5. Dominican–Haitian Boundary Treaty of 1929 and Protocol of 1936.',['https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs005.pdf','https://mirex.gob.do/tratados/tratado-entre-republica-dominicana-y-la-republica-de-haiti-sobre-delimitacion-de-la-frontera-que-separa-los-territorios-de-ambas-republicas/']],
  worldMesilla:['Treaty of La Mesilla (Gadsden Purchase), 1853/1854. U.S. Department of State, Office of the Historian. The Chamizal Arbitration, 1911.',['https://history.state.gov/milestones/1830-1860/gadsden-purchase','https://history.state.gov/historicaldocuments/frus1911/d851']],
  worldHispaniola:['U.S. Department of State. A Guide to the United States’ History of Recognition: Dominican Republic; Foreign Relations of the United States, 1906, historical account of Santo Domingo.',['https://history.state.gov/countries/dominican-republic','https://history.state.gov/historicaldocuments/frus1906p1/d501']],
  worldAcre:['Treaty of Petrópolis, 17 November 1903, in force 10 March 1904. United Nations Treaty Series 888. Brazil–Peru Boundary Treaty, 1909, promulgated in 1910. Governo do Acre. História do Acre; The Brazilian Review, 31 March 1903. Instituto Nacional de Estadística de Bolivia. Riberalta.',['https://treaties.un.org/Pages/showDetails.aspx?objid=0800000280110cdf','https://planalto.gov.br/ccivil_03/decreto/1910-1929/d07975.html','https://estado.ac.gov.br/acre/','https://hemeroteca-pdf.bn.gov.br/161993/per161993_1903_00013.pdf','https://www.ine.gob.bo/index.php/riberalta-es-el-segundo-municipio-mas-poblado-del-departamento-de-beni/']],
  worldAfrica:['John Laband. Historical Dictionary of the Zulu Wars; South African History Online. The Zulu Kingdom and the Colony of Natal; Judicial Service of Ghana. History before Independence.',['https://sahistory.org.za/article/zulu-kingdom-and-colony-natal','https://sahistory.org.za/dated-event/natal-becomes-part-union-south-africa','https://judicial.gov.gh/jsweb/index.php/about-the-judiciary/history/before-independence']],
  worldEurope:['Deutscher Bundestag. Konstituierende Sitzung des ersten Reichstages. Deutsches Historisches Museum. Chronik 1871. Map of Europe in 1871, University of South Florida, Educational Technology Clearinghouse.',['https://www.bundestag.de/dokumente/textarchiv/2021/kw11-kalenderblatt-150jahre-reichstag-828278','https://www.dhm.de/lemo/jahreschronik/1871','https://etc.usf.edu/maps/pages/800/865/865.htm']],
  worldCentralAsia:['Treaty of Saint Petersburg on Ili, 1881, and Ili Protocol, 1882. Office of the Geographer. International Boundary Study 64, China–USSR. New Margelan Protocol, 1884. Report on the Proceedings of the Pamir Boundary Commission, 1895.',['https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs064.pdf','https://www.abirus.ru/content/564/623/626/14338/16620/16656.html','https://specialcollections.exeter.ac.uk/2025/11/21/the-pamir-commission-eul-ms-152/']],
  worldSamoa:['Tripartite Convention respecting Samoa, 1899, ratified 1900. U.S. Department of the Interior. 575 DM 1, Introduction and History. New Zealand Ministry for Culture and Heritage. New Zealand’s Administration of Samoa. NOAA. National Marine Sanctuary of American Samoa, History. UN Special Committee on Decolonization, 1976 report, Tokelau.',['https://history.state.gov/historicaldocuments/frus1899/d625','https://www.doi.gov/sites/default/files/elips/documents/575-dm-1.pdf','https://nzhistory.govt.nz/page/background-0','https://americansamoa.noaa.gov/learn/history.html','https://digitallibrary.un.org/record/704812']],
  worldAntarctic:['The Antarctic Treaty, 1959, Article IV. Antarctic Treaty Secretariat.',['https://www.ats.aq/e/antarctictreaty.html']]
};
function apply(c,{source,revise,split,link,visibleAt,D,I,box}){
  for(const [id,[title,urls]] of Object.entries(sourceList))source(id,title,urls);
  const replace=(original,window,side)=>G.merge([D(original,window),side]);
  function put(owner,from,to,partition,side,reason,sourceId){
    const window=box(...partition.box);
    revise([owner],from,to,reason,sourceId,p=>replace(p,window,side));
  }
  // Use the same international edge on both sides. Keep the dated domestic
  // partition of Texas from the existing Civil War reconstruction.
  const us=geography.usMexico,usWindow=box(...us.box);
  revise(['early-new-spain'],1854,1946,'mesilla-mexican-side','worldMesilla',p=>replace(p,usWindow,us.second));
  for(const [from,to] of [[1854,1861],[1861,1863],[1863,1865],[1865,1946]]){
    const confederate=from>=1861&&from<1865?G.merge([I(visibleAt('1914-confederacy',from),us.first),I(us.first,box(-106.47,25.65,-96.8,31.78))]):[];
    put('1789-usa',from,to,us,D(us.first,confederate),'mesilla-us-side','worldMesilla');
    if(confederate.length)put('1914-confederacy',from,to,us,confederate,'texas-mexico-edge','worldMesilla');
  }
  const island=geography.hispaniola,islandWindow=box(-74.6,17.4,-68.15,20.1);
  revise(['1789-saint-domingue'],1822,1844,'island-under-haitian-rule','worldHispaniola',p=>replace(p,islandWindow,island));
  // Recover the two uncontested coastal interiors while retaining the
  // earlier frontier reconstruction in the disputed central strip.
  for(const [owner,core] of [['1789-saint-domingue',box(-74.6,17.4,-72.10,20.1)],['1848-dominican',box(-71.35,17.4,-68.15,20.1)]]){
    const land=I(island,core);
    revise([owner],1844,1936,'hispaniola-coastal-interior','worldIslandBoundary',p=>G.merge([I(p,island),land]));
  }
  put('1789-saint-domingue',1936,2011,geography.hispaniola1936,geography.hispaniola1936.first,'haitian-agreed-border','worldIslandBoundary');
  put('1848-dominican',1936,2011,geography.hispaniola1936,geography.hispaniola1936.second,'dominican-agreed-border','worldIslandBoundary');
  for(const [from,to] of [[1822,1861],[1865,1898]])revise(['1789-spain'],from,to,'remove-spanish-island-claim','worldHispaniola',p=>D(p,islandWindow));
  revise(['early-spanish-antilles'],1822,1898,'antilles-without-stale-santo-domingo','worldHispaniola',p=>D(p,islandWindow));
  for(const key of ['areas','outlines'])split(key,['1789-spain'],[1861,1865]);
  revise(['1789-spain'],1861,1865,'santo-domingo-annexation','worldHispaniola',(p,y)=>replace(p,islandWindow,I(visibleAt('1848-dominican',y),island)));
  link('1789-spain','1848-dominican',1861,1865,'province','worldHispaniola');
  // The 1867 oblique line ran from the Madeira to the head of the Javari.
  // Limit the early bilateral reconstruction to the eastern Acre valley.
  const valley=G.union([[[-69.75,-10.86],[-69.55,-10.25],[-68.83,-10],[-68.25,-9.73],[-67.60,-9.55],[-67,-9.64],[-66.85,-10.40],[-67.3,-11.2],[-69.9,-11.3]]]);
  const southOfLine=G.union([[[-73.8,-7.1],[-65.4,-10.333],[-65.4,-13],[-73.8,-13]]]);
  const eastAcre=I(I(geography.acre,valley),southOfLine);
  revise(['1815-upper-peru'],1867,1946,'bolivian-amazonian-interior','worldAcre',p=>G.merge([p,geography.beni]));
  revise(['early-portuguese-brazil','early-peru'],1867,1946,'bolivian-amazonian-exterior','worldAcre',p=>D(p,geography.beni));
  revise(['1815-upper-peru'],1867,1899,'upper-acre-bolivian-jurisdiction','worldAcre',p=>G.merge([p,eastAcre]));
  revise(['early-portuguese-brazil','early-peru'],1867,1904,'eastern-acre-before-treaty','worldAcre',p=>D(p,eastAcre));
  revise(['1815-upper-peru'],1899,1910,'contested-acre-and-transfer','worldAcre',p=>D(p,eastAcre));
  revise(['early-portuguese-brazil'],1904,1910,'acre-federal-territory','worldAcre',p=>G.merge([p,eastAcre]));
  revise(['early-portuguese-brazil'],1910,1946,'acre-after-peruvian-settlement','worldAcre',p=>G.merge([p,geography.acre]));
  revise(['1815-upper-peru','early-peru'],1910,1946,'acre-common-exterior','worldAcre',p=>D(p,geography.acre));
  addAcre(c,eastAcre);
  // Bohemia, Moravia, the Austrian Alps and the neighbouring German lands.
  // The North German Confederation did not yet include the southern kingdoms.
  const eu=geography.europe;
  revise(['late-hre'],1867,1871,'north-german-exterior','worldEurope',p=>D(p,eu.first));
  put('late-hre',1871,1918,eu,eu.second,'imperial-german-southern-edge','worldEurope');
  put('early-austria',1867,1918,eu,eu.first,'austro-hungarian-northern-edge','worldEurope');
  for(const [geometry,start,id] of [[geography.ili,1882,'khorgos'],[geography.torugart,1884,'torugart']]){
    put('1789-qing',start,1917,geometry,geometry.first,id+'-chinese-side','worldCentralAsia');
    put('1789-russian-empire',start,1917,geometry,geometry.second,id+'-russian-side','worldCentralAsia');
  }
  const wakhan=geography.wakhan;
  revise(['1789-durrani'],1895,1919,'wakhan-and-upper-panj','worldCentralAsia',p=>G.merge([D(p,wakhan.second),wakhan.first]));
  revise(['1789-russian-empire','early-bukhara','1789-qing'],1895,1917,'afghan-bank-of-panj','worldCentralAsia',p=>D(p,wakhan.first));
  link('1789-great-britain','1848-zulu',1887,1910,'province','worldAfrica');
  link('1914-south-africa','1848-zulu',1910,1919,'province','worldAfrica');
  revise(['1789-great-britain'],1887,1910,'zululand-in-british-domains','worldAfrica',(p,y)=>G.merge([p,visibleAt('1848-zulu',y)]));
  revise(['1789-asante'],1902,1946,'ashanti-colonial-envelope','worldAfrica',p=>I(p,geography.ghana));
  link('1789-great-britain','1789-asante',1902,1946,'province','worldAfrica');
  revise(['1789-great-britain'],1902,1946,'ashanti-under-british-rule','worldAfrica',(p,y)=>G.merge([p,visibleAt('1789-asante',y)]));
  revise(['late-france'],1905,1946,'ivory-coast-shared-exterior','worldGoldCoast',p=>D(p,geography.ghana));
  const gold=geography.goldCoast;
  put('1789-great-britain',1905,1946,gold,gold.first,'gold-coast-shared-frontier','worldGoldCoast');
  revise(['1789-asante'],1905,1946,'ashanti-western-limit','worldGoldCoast',p=>D(p,gold.second));
  for(const [from,to] of [[1905,1940],[1944,1946]])put('late-france',from,to,gold,gold.second,'ivory-coast-shared-frontier','worldGoldCoast');
  put('1939-french-west',1919,1946,gold,gold.second,'french-west-african-frontier','worldGoldCoast');
  split('areas',['1848-zulu'],[1887,1897,1910,1919]);
  for(const a of c.areas.filter(a=>a.entry==='1848-zulu'&&a.from>=1887&&a.to<=1919)){
    a.statusLabel=a.from<1897?['Британская колония','British colony','Британ колониясы']:a.from<1910?['В составе Наталя','Part of Natal','Наталдын курамында']:['Наталь · Южно-Африканский Союз','Natal · Union of South Africa','Наталь · Түштүк Африка Биримдиги'];
  }
  samoa(c,{revise,split,link,D,I,box,replace});
  newGuinea(c,{revise,link,D,I});
  milestones(c);
  return c;
}
function addRegion(c,id,region,coord,name,phases){
  const H=require('./late-helpers.cjs')(c,{start:phases[0].from,max:phases.at(-1).to-1});
  H.entry(id,region,'region',coord,name,phases.map(f=>H.phase(f.from,f.to,f.title,f.text,[f.source],{approx:false,frontierAdded:true})));
  for(const f of phases){
    const a=H.area(id,f.from,f.to,f.shape,{kind:'influence',name:f.title,title:f.title,text:f.text,color:f.color,sources:[f.source]});
    a.frontierAdded=true;a.approx=false;a.statusLabel=f.status;
    c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(f.shape);
  }
}
function addAcre(c,shape){
  const disputed=['Оспариваемая область','Contested region','Талаштуу аймак'],provisional=['Временное управление','Provisional administration','Убактылуу башкаруу'];
  addRegion(c,'review-acre-valley','south',[-67.81,-9.97],['Долина Акри','Acre valley','Акри өрөөнү'],[
    {from:1899,to:1903,title:['Восстания в долине Акри','Uprisings in the Acre valley','Акри өрөөнүндөгү көтөрүлүштөр'],text:['В 1899 году в долине Акри провозгласили республику. В следующие годы местные правительства сменялись, продолжалась борьба с боливийскими властями.','A republic was proclaimed in the Acre valley in 1899. Local governments changed during the ensuing struggle with Bolivian authorities.','1899-жылы Акри өрөөнүндө республика жарыяланган. Боливия бийлиги менен күрөш жүрүп, жергиликтүү өкмөттөр алмашып турган.'],source:'worldAcre',shape,color:'#ac927a',status:disputed},
    {from:1903,to:1904,title:['Временное управление в Акри','Provisional administration in Acre','Акридеги убактылуу башкаруу'],text:['Соглашение марта 1903 года позволило Бразилии ввести отряд в долину Акри. В ноябре Бразилия и Боливия подписали Петрополисский договор.','The March 1903 arrangement allowed Brazil to station troops in the Acre valley. Brazil and Bolivia signed the Treaty of Petrópolis in November.','1903-жылдын мартындагы келишим Бразилияга Акри өрөөнүнө аскер киргизүүгө мүмкүнчүлүк берген. Ноябрда Бразилия менен Боливия Петрополис келишимине кол коюшкан.'],source:'worldAcre',shape,color:'#ac927a',status:provisional}
  ]);
}
function samoa(c,{revise,split,link,D,box,replace}){
  const geom=geography.samoa,eastWindow=box(-171.35,-14.8,-167.9,-10.9),westWindow=box(-173.1,-14.2,-171.35,-13.3);
  const manuaAndRose=G.merge([geom.manua,geom.rose]);
  const eastern=G.merge([geom.tutuila,manuaAndRose]),american='1914-american-samoa',western='1914-western-samoa';
  // Keep the 1899 council decision distinct from formal transfers in 1900.
  const transition=['В декабре 1899 года державы подписали конвенцию о разделе Самоа. Ратификация и установление нового управления последовали в 1900 году.','The powers signed the Samoan partition convention in December 1899. Ratification and the new administrations followed in 1900.','1899-жылдын декабрында державалар Самоаны бөлүштүрүү жөнүндө конвенцияга кол коюшкан. Ал 1900-жылы ратификацияланып, жаңы башкаруу орногон.'];
  for(const id of [american,western]){
    const entry=c.entries.find(e=>e.id===id),first=entry.phases[0],name=id===american?['Восточное Самоа · соглашение о разделе','Eastern Samoa · partition convention','Чыгыш Самоа · бөлүштүрүү келишими']:['Западное Самоа · соглашение о разделе','Western Samoa · partition convention','Батыш Самоа · бөлүштүрүү келишими'];
    entry.phases.splice(0,1,{...first,to:1900,title:name,name,text:transition,sources:['worldSamoa'],period:['1899','1899','1899']},{...first,from:1900,period:first.period.map(t=>t.replace('1899','1900'))});
  }
  for(const r of c.cartography.relations||[])if(r.member===american&&r.owner==='1789-usa'&&r.from<1900)r.from=1900;
  for(const owner of ['1789-usa','late-hre'])split('outlines',[owner],[1899,1900]);
  for(const a of c.outlines)if(a.from===1899&&a.to===1900&&a.members)a.members=a.members.filter(id=>id!==american&&id!==western);
  const stages=[[1899,1900,eastern],[1900,1904,geom.tutuila],[1904,1925,eastern],[1925,2011,G.merge([eastern,geom.swains])]];
  for(const [from,to,shape] of stages){
    revise([american],from,to,'eastern-samoan-islands','worldSamoa',()=>shape);
    revise(['1789-usa'],from,to,'us-samoan-islands','worldSamoa',p=>replace(p,eastWindow,from===1899?[]:shape));
  }
  revise([western],1899,2011,'western-samoan-islands','worldSamoa',()=>geom.west);
  revise(['late-hre'],1899,1900,'before-german-samoa','worldSamoa',p=>D(p,westWindow));
  revise(['late-hre'],1900,1914,'german-samoa','worldSamoa',p=>replace(p,westWindow,geom.west));
  revise(['late-hre'],1914,1919,'end-german-samoan-administration','worldSamoa',p=>D(p,westWindow));
  link('1914-new-zealand',western,1914,1920,'occupation','worldSamoa');
  for(const a of c.areas.filter(a=>[american,western].includes(a.entry)&&a.from===1899)){const phase=c.entries.find(e=>e.id===a.entry).phases[0];a.name=phase.name;a.title=phase.title;a.text=phase.text;a.statusLabel=['Соглашение о разделе','Partition agreement','Бөлүштүрүү келишими'];}
  const name=['Острова Мануа','Manuʻa Islands','Мануа аралдары'];
  addRegion(c,'review-manua','oceania',[-169.46,-14.24],name,[{from:1900,to:1904,title:name,text:['Островами Мануа управляли местные правители. Акт уступки Соединённым Штатам подписан в 1904 году.','The rulers of Manuʻa continued to govern the islands. The deed of cession to the United States was signed in 1904.','Мануа аралдарын жергиликтүү башкаруучулар башкарган. Аралдарды АКШга өткөрүү актысына 1904-жылы кол коюлган.'],shape:geom.manua,source:'worldSamoa',color:'#b19979',status:['Местное управление','Local government','Жергиликтүү башкаруу']}]);
}
function milestones(c){
  const rows=[
    ['mesilla',1854,'north',[-106.8,32.27],'worldMesilla',['Вступление в силу договора Ла-Месилья','Gadsden Purchase takes effect','Ла-Месилья келишими күчүнө кирди'],['После обмена ратификациями новая граница США и Мексики проходит южнее долины Месильи.','Following ratification, the new US–Mexican boundary ran south of the Mesilla Valley.','Ратификациядан кийин АКШ менен Мексиканын жаңы чек арасы Месилья өрөөнүнөн түштүккө жылган.']],
    ['restoration',1865,'north',[-69.93,18.48],'worldHispaniola',['Восстановление независимости Доминиканской Республики','Dominican independence restored','Доминикан Республикасынын көз карандысыздыгы калыбына келди'],['После войны за восстановление независимости испанское управление восточной частью Эспаньолы завершилось.','The War of Restoration ended Spanish rule over eastern Hispaniola.','Көз карандысыздык үчүн согуштан кийин Эспаньоланын чыгышында испан бийлиги аяктаган.']],
    ['ili',1882,'eurasia',[81.32,43.91],'worldCentralAsia',['Возвращение Кульджи под управление Цин','Qing administration returns to Kuldja','Кулжа кайрадан Циндин башкаруусуна өттү'],['После Петербургского договора 1881 года Цин вернула управление Кульджой. Западная часть Илийского края осталась у России. Граница пересекала долину по Хоргосу.','Following the 1881 Treaty of Saint Petersburg, Qing administration returned to Kuldja. Russia retained the western part of Ili, with the frontier following the Khorgos across the valley.','1881-жылкы Петербург келишиминен кийин Кулжа Циндин башкаруусуна кайтарылган. Иленин батыш бөлүгү Россияда калган. Чек ара өрөөндө Коргос дарыясы аркылуу өткөн.']],
    ['pamir',1895,'eurasia',[73.7,37.44],'worldCentralAsia',['Памирская пограничная комиссия','Pamir Boundary Commission','Памир чек ара комиссиясы'],['Комиссия определяла рубеж между российской и афганской сферами от озера Зоркуль к востоку. Вахан сохранялся за Афганистаном. Стороны соглашения — Великобритания и Россия.','The commission surveyed the boundary of the Russian and Afghan spheres eastward from Lake Zorkul. Wakhan remained with Afghanistan. Britain and Russia were the parties to the agreement.','Комиссия Зоркөлдөн чыгышка карай орус жана ооган таасир аймактарынын чегин аныктаган. Вахан Ооганстанда калган. Келишимди Британия менен Россия түзгөн.']],
    ['natal',1897,'africa',[31.42,-28.33],'worldAfrica',['Зулуленд включён в колонию Наталь','Zululand incorporated into Natal','Зулуленд Наталь колониясына кошулду'],['Зулуленд, аннексированный Британией в 1887 году, в декабре 1897 года вошёл в Наталь. В 1910 году Наталь стала провинцией Южно-Африканского Союза.','Britain annexed Zululand in 1887. It became part of Natal in December 1897. In 1910 Natal became a province of the Union of South Africa.','1887-жылы Британия аннексиялаган Зулуленд 1897-жылдын декабрында Наталга кошулган. 1910-жылы Наталь Түштүк Африка Биримдигинин провинциясына айланган.']],
    ['acre-treaty',1903,'south',[-43.18,-22.51],'worldAcre',['Петрополисский договор','Treaty of Petrópolis','Петрополис келишими'],['Бразилия и Боливия подписали договор 17 ноября 1903 года в Петрополисе. Он вступил в силу 10 марта 1904 года. Долина Акри вошла в состав Бразилии.','Brazil and Bolivia signed the treaty at Petrópolis on 17 November 1903. It entered into force on 10 March 1904, transferring the Acre valley to Brazil.','Бразилия менен Боливия келишимге 1903-жылдын 17-ноябрында Петрополисте кол коюшкан. Ал 1904-жылдын 10-мартында күчүнө кирип, Акри өрөөнү Бразилияга өткөн.']],
    ['acre-federal',1904,'south',[-67.81,-9.97],'worldAcre',['Федеральная территория Акри','Federal territory of Acre','Акри федералдык аймагы'],['В Акри организовано федеральное управление. Западнее долины Акри разграничение с Перу продолжалось. Договор 1909 года был утверждён в 1910 году.','Brazil established a federal administration in Acre. Farther west the boundary with Peru was still being settled. The 1909 treaty was approved in 1910.','Бразилия Акриде федералдык башкарууну уюштурган. Батышта Перу менен чек араны тактоо уланган. 1909-жылкы келишим 1910-жылы бекитилген.']],
    ['tutuila',1900,'oceania',[-170.68,-14.28],'worldSamoa',['Акт уступки Тутуилы и Аунуу','Deed of cession of Tutuila and Aunuʻu','Тутуила менен Аунууну өткөрүү актысы'],['В апреле местные вожди подписали акт уступки Тутуилы и Аунуу Соединённым Штатам. Мануа сохраняли собственное управление до 1904 года.','In April local chiefs signed the deed ceding Tutuila and Aunuʻu to the United States. Manuʻa retained local government until 1904.','Апрелде жергиликтүү башчылар Тутуила менен Аунууну АКШга өткөрүү актысына кол коюшкан. Мануада 1904-жылга чейин жергиликтүү башкаруу сакталган.']],
    ['manua',1904,'oceania',[-169.46,-14.24],'worldSamoa',['Акт уступки островов Мануа','Deed of cession of Manuʻa','Мануа аралдарын өткөрүү актысы'],['Правители Мануа подписали акт уступки. Под управление США перешли Тау, Офу, Олосега и атолл Роуз.','The rulers of Manuʻa signed a deed of cession covering Taʻū, Ofu, Olosega and Rose Atoll.','Мануа башкаруучулары Тау, Офу, Олосега жана Роуз атоллун АКШга өткөрүү актысына кол коюшкан.']],
    ['swains',1925,'oceania',[-171.08,-11.056],'worldSamoa',['Суэйнс включён в Американское Самоа','Swains Island added to American Samoa','Суэйнс Америкалык Самоага кошулду'],['Конгресс США включил Суэйнс (Олохега) в Американское Самоа. Жители Факаофо в Токелау выдвигали собственные притязания на остров.','The US Congress placed Swains Island (Olohega) under American Samoan administration. People on Fakaofo in Tokelau maintained their own claim to the island.','АКШнын Конгресси Суэйнсти (Олохеганы) Америкалык Самоага кошкон. Токелаудагы Факаофо тургундары да аралга өз укугун билдиришкен.']]
  ];
  for(const [id,year,region,coord,source,title,text] of rows)c.events.push({id:'global-frontier-'+id,from:year,to:year,year,region,coord,kind:'politics',title,text,sources:[source],approx:false,frontierAdded:true});
}

function newGuinea(c,{revise,link,D,I}){
  const ref=geography.guinea;
  const southernSide=G.union([[[140.6,-5],[141,-5],[144,-6],[147,-8],[154,-8],[154,-12],[140.6,-12]]]);
  const southBefore=I(ref.before1896,southernSide),south=I(ref.main,southernSide),north=D(ref.main,south);
  const papua='review-papuan-territory',kaiser='review-kaiser-wilhelmsland',australia='1914-australian-colonies';
  const papuanName=['Папуа','Papua','Папуа'];
  const germanName=['Земля кайзера Вильгельма','Kaiser-Wilhelmsland','Кайзер Вильгельм жери'];
  const british=['Британская Новая Гвинея','British New Guinea','Британ Жаңы Гвинеясы'];
  const borderText=['В 1885 году Великобритания и Германия согласовали границу на востоке острова Новая Гвинея. От побережья она шла по 8-й параллели до 147° в. д., далее к точкам 6° ю. ш., 144° в. д. и 5° ю. ш., 141° в. д.','Britain and Germany agreed a frontier in eastern New Guinea in 1885. From the coast it followed 8°S to 147°E, then ran to 6°S, 144°E and 5°S, 141°E.','1885-жылы Британия менен Германия Жаңы Гвинеянын чыгышындагы чек араны макулдашкан. Ал жээктен 8° түштүк кеңдик боюнча 147° чыгыш узундукка, андан 6° түштүк кеңдик, 144° чыгыш узундук жана 5° түштүк кеңдик, 141° чыгыш узундук чекиттерине өткөн.'];
  const colonial=['В 1888 году юго-восток острова стал британской колонией. Договор с Нидерландами 1895 года уточнил западную границу в районе реки Флай.','The southeast became a British colony in 1888. A convention with the Netherlands in 1895 specified the western frontier at the Fly River.','1888-жылы аралдын түштүк-чыгышы британ колониясына айланган. 1895-жылы Нидерланд менен түзүлгөн келишим Флай дарыясындагы батыш чек араны тактаган.'];
  const australianText=['С 1906 года Австралия управляла территорией Папуа. Бывшая германская Новая Гвинея имела отдельный статус. В 1949 году обе территории получили общую гражданскую администрацию.','Australia administered the Territory of Papua from 1906. Former German New Guinea had a separate legal status. A common civil administration was established in 1949.','1906-жылдан тартып Папуаны Австралия башкарган. Мурдагы Герман Жаңы Гвинеясынын укуктук макамы өзүнчө болгон. 1949-жылы эки аймакка орток жарандык башкаруу түзүлгөн.'];
  const phase=(from,to,title,text,shape,status,color)=>({from,to,title,text,shape,status,color,source:'worldGuinea'});
  addRegion(c,papua,'oceania',[147.15,-9.47],papuanName,[
    phase(1885,1888,british,borderText,southBefore,['Протекторат','Protectorate','Протекторат'],'#a18885'),
    phase(1888,1896,british,colonial,southBefore,['Британская колония','British colony','Британ колониясы'],'#a18885'),
    phase(1896,1906,british,colonial,south,['Британская колония','British colony','Британ колониясы'],'#a18885'),
    phase(1906,1949,papuanName,australianText,south,['Австралийское управление','Australian administration','Австралиянын башкаруусу'],'#92a68e')
  ]);
  const occupation=['В 1914 году австралийские войска заняли административные центры германской Новой Гвинеи. Военная администрация продолжала действовать до перехода к гражданскому мандатному управлению в 1921 году.','Australian forces occupied the administrative centres of German New Guinea in 1914. Military administration continued until civil mandate administration began in 1921.','1914-жылы австралиялык аскерлер Герман Жаңы Гвинеясынын башкаруу борборлорун ээлеген. Аскердик башкаруу 1921-жылы жарандык мандаттык башкарууга өткөнгө чейин уланган.'];
  addRegion(c,kaiser,'oceania',[147.86,-6.60],germanName,[
    phase(1885,1914,germanName,borderText,north,['Германский протекторат','German protectorate','Герман протектораты'],'#a39989'),
    phase(1914,1915,germanName,occupation,north,['Австралийская военная администрация','Australian military administration','Австралиянын аскердик башкаруусу'],'#92a68e')
  ]);
  link('1789-great-britain',papua,1885,1888,'protectorate','worldGuinea');
  link('1789-great-britain',papua,1888,1906,'province','worldGuinea');
  link(australia,papua,1906,1949,'province','worldGuinea');
  link('late-hre',kaiser,1885,1914,'protectorate','worldGuinea');
  link(australia,kaiser,1914,1915,'occupation','worldGuinea');
  link(australia,'1918-new-guinea',1915,1921,'occupation','worldGuinea');
  for(const [from,to,extent] of [[1885,1896,southBefore],[1896,1906,south]])revise(['1789-great-britain'],from,to,'british-papua-mainland','worldGuinea',p=>G.merge([D(p,ref.mask),extent]));
  revise(['late-hre'],1885,1914,'kaiser-wilhelmsland-mainland','worldGuinea',p=>G.merge([D(p,ref.mask),north]));
  revise(['late-hre'],1914,1919,'german-administration-ends','worldGuinea',p=>D(p,ref.mask));
  revise([australia],1906,1949,'territory-of-papua','worldGuinea',p=>G.merge([D(p,ref.mask),south]));
  revise(['1918-new-guinea'],1915,1949,'new-guinea-northern-mainland','worldGuinea',p=>G.merge([D(p,ref.mask),north]));
  revise(['1918-new-guinea'],1949,1975,'joint-mainland-administration','worldGuinea',p=>G.merge([D(p,ref.mask),ref.main]));
  revise(['1918-new-guinea'],1975,2011,'independent-papua-new-guinea','worldGuinea',()=>ref.independent);
  for(const [start,end,west,east] of [[1885,1896,ref.westBefore,ref.before1896],[1896,1940,ref.west,ref.main]]){
    revise(['early-dutch'],start,end,'netherlands-new-guinea-mainland','worldWestGuinea',p=>G.merge([D(p,east),west]));
  }
  revise(['1960-west-papua'],1946,1963,'west-new-guinea-and-untea','worldWestGuinea',p=>G.merge([D(p,ref.independent),ref.west]));
  revise(['early-dutch'],1946,1962,'dutch-west-new-guinea','worldWestGuinea',p=>G.merge([D(p,ref.independent),ref.west]));
  revise(['early-dutch'],1962,2011,'end-dutch-new-guinea','worldWestGuinea',p=>D(D(p,ref.west),ref.independent));
  revise(['1789-batavia'],1949,1963,'indonesia-before-west-new-guinea-transfer','worldWestGuinea',p=>D(D(p,ref.west),ref.independent));
  revise(['1789-batavia'],1963,2011,'indonesian-west-new-guinea','worldWestGuinea',p=>G.merge([D(p,ref.independent),ref.west]));
  // The educational anchor for the British protectorate predates the inland
  // division of 1885. It should not already colour that entire later sector.
  for(const [year,coord,title,text] of [
    [1884,[147.15,-9.47],['Провозглашение британского протектората','British protectorate proclaimed','Британ протекторатынын жарыяланышы'],['В Порт-Морсби был провозглашён британский протекторат над юго-восточной частью Новой Гвинеи. Границу с германской сферой согласовали в следующем году.','Britain proclaimed a protectorate over southeastern New Guinea at Port Moresby. The boundary with the German sphere was agreed the following year.','Порт-Морсбиде Жаңы Гвинеянын түштүк-чыгышында британ протектораты жарыяланган. Герман аймагы менен чек ара кийинки жылы макулдашылган.']],
    [1885,[147,-8],['Раздел восточной Новой Гвинеи','Partition of eastern New Guinea','Чыгыш Жаңы Гвинеянын бөлүнүшү'],borderText],
    [1906,[147.15,-9.47],['Австралия принимает управление Папуа','Australia administers Papua','Папуаны Австралия башкара баштады'],australianText],
    [1914,[152.18,-4.20],['Австралийские войска в Германской Новой Гвинее','Australian forces in German New Guinea','Австралия аскерлери Герман Жаңы Гвинеясында'],occupation]
  ])c.events.push({id:'global-frontier-guinea-'+year,from:year,to:year,year,region:'oceania',coord,kind:'politics',title,text,sources:['worldGuinea'],approx:false,frontierAdded:true});
}
// Newly created 2011 records carry the last verified political outlines.
// These particular administrative areas store their geometry separately
// from their narrative area records.
function carryModern(c,additional=[]){
  for(const id of ['1914-american-samoa','1914-western-samoa','1918-new-guinea','1789-batavia','early-dutch','1789-saint-domingue','1848-dominican',...additional]){
    const before=c.areas.find(a=>a.entry===id&&a.from<=2010&&a.to>2010);
    if(!before)continue;
    const shape=c.cartography.areas[before.id];
    if(shape===undefined)continue;
    for(const a of c.areas.filter(a=>a.entry===id&&a.from>=2011))c.cartography.areas[a.id]=shape;
  }
  return c;
}

module.exports={apply,carryModern};

