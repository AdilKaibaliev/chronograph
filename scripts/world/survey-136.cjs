'use strict';
const G=require('./cartography-geometry.cjs');
const land=require('./survey-regions-136.json');
const references={
 surveyNguyen:['Vietnam National Archives Center I. Administrative boundaries under the Nguyễn dynasty. Institute of Hán-Nôm Studies. Regional administration in the early Nguyễn dynasty, 1802–1830. International Boundary Study 38, China–Vietnam, including the 1887 and 1895 conventions.',['https://www.archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/ky-i-dia-gioi-hanh-chinh-viet-nam-thoi-ky-quan-chu.htm','https://hannom.vass.gov.vn/nghien-cuu-van-ban/vai-net-ve-to-chuc-hanh-chinh-khu-vuc-va-dia-phuong-thoi-nguyen-so-1802-1830-tap-chi-han-nom-so-6-91-2008-tr-34-40-506336','https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs038.pdf']],
 surveyTianShan:['International Boundary Study 64. China–USSR. St Petersburg Treaty (1881), Kashgar Protocol (1882), New Margelan Protocol (1884).',['https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs064.pdf']],
 surveyCourtrai:['Treaty of Courtrai, 28 March 1820. Frederik Dhondt. Het Verdrag van Kortrijk en de Frans-Belgische grens.',['https://researchportal.vub.be/en/publications/une-mani%C3%A8re-plus-pr%C3%A9cise-et-invariable-het-verdrag-van-kortrijk-v/']],
 surveyYoruba:['Samuel Johnson. The History of the Yorubas, chapter XXXV and appendix A. UNESCO. General History of Africa, volume VII. National Museums Scotland. The court arts and history of the Kingdom of Benin.',['https://www.cambridge.org/core/books/abs/history-of-the-yorubas/establishment-of-the-british-protectorate-the-sequel/5EFDB1C60391A65DBFCA61ABFC9019C2','https://www.nms.ac.uk/discover-catalogue/the-court-arts-and-history-of-the-kingdom-of-benin']],
 surveyBelize:['Convention between Great Britain and Guatemala, 30 April 1859, article I. Mexico–Great Britain boundary treaty, 1893, effective 1897. Belize Ministry of Foreign Affairs. About Belize.',['https://www.oas.org/sap/peacefund/belizeandguatemala/timelinedocuments/1859Aycinena-WykeTreaty.pdf','https://www.belizereferendum.gov.bz/files/JointOpinion1978-1.pdf','https://chicagoconsulate.mfa.gov.bz/index.php/about-belize/']],
 surveyPeten:['Mexico–Guatemala boundary treaty, 27 September 1882, effective 1 May 1883. Secretaría de Relaciones Exteriores, Antecedentes Históricos. Protecting Foreigners: The Refugee Crisis on the Belize–Yucatán Border, 1847–71.',['https://treaties.un.org/doc/publication/UNTS/Volume%201404/v1404.pdf','https://www.gob.mx/sre/acciones-y-programas/antecedentes-historicos-23166','https://www.cambridge.org/core/journals/law-and-history-review/article/abs/protecting-foreigners-the-refugee-crisis-on-the-belizeyucatan-border-184771/9FF26A324C93E119016BA2D5983696C1']],
 surveyFuego:['Boundary Treaty between Argentina and Chile, 23 July 1881, article III. Biblioteca Nacional de Chile. La Tierra de los Fuegos, boundary demarcation in 1894.',['https://history.state.gov/historicaldocuments/frus1881/d8','https://www.memoriachilena.gob.cl/archivos2/pdfs/mc0018204.pdf']],
 surveySolomons:['Solomon Islands Truth and Reconciliation Commission, Final Report. Solomon Islands Historical Encyclopaedia 1893–1978, Proclamation of the Protectorate. Autonomous Bougainville Government, Joint Key Messages on the Peace Agreement and Referendum.',['https://solomons.gov.sb/wp-content/uploads/2023/06/TRC-FINAL-Report-Summary-Condensed-Version.pdf','https://paulturnbull.org/solomonencyclopaedia/biogs/E000042b.htm','https://abg.gov.pg/images/misc/Final_Joint_Key_Messages_on_BPA_and_Referendum_compressed.pdf']]
};
module.exports=function(c,{source,revise,split,link,visibleAt,D,I,box}){
 for(const [id,[title,urls]] of Object.entries(references))source(id,title,urls);
 const extend=(ids,from,to,name,src,side,opposite=[])=>revise(ids,from,to,name,src,p=>G.merge([D(p,opposite),side]));
 // Earlier inland control is independently documented. Retain the original
 // reconstruction in the boundary belt until a dated delimitation is known.
 const v=land.tonkin,china='1789-qing',vietnam='1789-tayson',russia='1789-russian-empire',britain='1789-great-britain';
 for(const [from,to,north,south] of [[1802,1887,v.coreB,v.coreA],[1887,1895,v.second,v.first],[1895,1915,v.second,v.first]]){
   const sector=from===1887?box(104.1,20.85,107.90,23.32):null;
   const n=sector?I(north,sector):north,s=sector?I(south,sector):south;
   extend([china],from,to,'northern-tonkin-chinese-side','surveyNguyen',n,s);
   extend([vietnam],from,to,'nguyen-northern-provinces','surveyNguyen',s,n);
   if(from>=1887)revise(['late-france'],from,to,'tonkin-protectorate-exterior','surveyNguyen',p=>D(p,n));
 }
 for(const [from,to] of [[1915,1919],[1919,1940],[1940,1946]]){
   extend([china],from,to,'china-tonkin-frontier','surveyNguyen',v.second,v.first);
   extend([vietnam],from,to,'tonkin-china-frontier','surveyNguyen',v.first,v.second);
   revise(['late-france'],from,to,'tonkin-protectorate-exterior','surveyNguyen',p=>D(p,v.second));
 }
 const t=land.tianshan;
 const previouslyReviewed=box(...require('./world-corridors.json').torugart.box);
 const east=D(t.coreA,previouslyReviewed),west=D(t.coreB,previouslyReviewed);
 extend([china],1884,1917,'tianshan-eastern-interior','surveyTianShan',east,west);
 extend([russia],1884,1917,'tianshan-western-interior','surveyTianShan',west,east);
 const b=land.belgium;
 for(const [from,to] of [[1831,1914],[1919,1940]]){
   extend(['early-netherlands'],from,to,'belgian-frontier','surveyCourtrai',b.first,b.second);
   extend(['late-france'],from,to,'french-frontier','surveyCourtrai',b.second,b.first);
 }
 const f=land.fuego;
 for(const [from,to,west,east] of [[1881,1894,f.treatyWest,f.treatyEast],[1894,2011,f.west,f.east]]){
   extend(['1789-chile'],from,to,'fuegian-chilean-side','surveyFuego',west,east);
   extend(['1789-rio-plata'],from,to,'fuegian-argentine-side','surveyFuego',east,west);
 }
 for(const [member,year] of [['1789-oyo',1893],['ife',1893],['benin',1897]]){
   link(britain,member,year,1919,member==='benin'?'province':'protectorate','surveyYoruba');
 }
 for(const [from,to,ids] of [[1893,1897,['1789-oyo','ife']],[1897,1919,['1789-oyo','ife','benin']]]){
   revise([britain],from,to,'southern-nigerian-administration','surveyYoruba',(p,y)=>{
     const owned=G.merge(ids.map(id=>visibleAt(id,y)));
     return G.merge([p,from<1897?D(owned,visibleAt('benin',y)):owned]);
   });
 }
 const H=require('./late-helpers.cjs')(c,{max:2026});
 // Add the earlier phases to the same profile used by the later atlas.
 function historicalProfile(id,from,to,name,text,coord,shape,src,status,owner,relationship){
   const e=c.entries.find(e=>e.id===id),phase=H.phase(from,to,name,text,[src],{name,coord,approx:false,frontierAdded:true});
   if(e.phases.some(p=>p.from<to&&p.to>from))throw Error('Overlapping phase '+id+' '+from);
   e.phases.push(phase);e.phases.sort((a,b)=>a.from-b.from);
   const a=H.area(id,from,to,shape,{kind:'influence',name,color:'#a89784',sources:[src]});
   Object.assign(a,{frontierAdded:true,approx:false,statusLabel:status,label:coord});
   c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(shape);
   if(owner)link(owner,id,from,to,relationship,src);
 }
 const belize='1991-belize',bz=land.belize;
 const bname=['Британский Гондурас','British Honduras','Британ Гондурасы'],settlement=['Британские владения в заливе Гондурас','British settlement in the Bay of Honduras','Гондурас булуңундагы британ ээликтери'];
 const treaty=['В 1859 году Великобритания и Гватемала описали границу от устья Сарстуна через водопады Грасьяс-а-Дьос и Гарбутт. Северный предел британских притязаний оставался предметом переговоров с Мексикой.','In 1859 Britain and Guatemala described the boundary from the mouth of the Sarstoon by way of Gracias a Dios and Garbutt’s Falls. The northern limit claimed by Britain remained under negotiation with Mexico.','1859-жылы Британия менен Гватемала Сарстундун куйган жеринен Грасьяс-а-Дьос жана Гарбутт шаркыратмалары аркылуу өткөн чек араны аныкташкан. Түндүк чек боюнча Мексика менен сүйлөшүүлөр уланган.'];
 const colony=['В 1862 году Британский Гондурас получил статус колонии. Мексика и Великобритания подписали договор о северной границе в 1893 году. Он вступил в силу в 1897 году.','British Honduras became a colony in 1862. Mexico and Britain signed the northern boundary treaty in 1893. It entered into force in 1897.','1862-жылы Британ Гондурасы колония макамын алган. Мексика менен Британия түндүк чек ара келишимине 1893-жылы кол коюшкан. Ал 1897-жылы күчүнө кирген.'];
 historicalProfile(belize,1859,1862,settlement,treaty,[-88.20,17.50],bz,'surveyBelize',settlement,britain,'province');
 historicalProfile(belize,1862,1961,bname,colony,[-88.20,17.50],bz,'surveyBelize',['Колония','Colony','Колония'],britain,'province');
 const selfRule=['В 1964 году Британский Гондурас получил внутреннее самоуправление. С 1973 года страна называлась Белизом. Независимость была провозглашена 21 сентября 1981 года.','British Honduras attained internal self-government in 1964. It was renamed Belize in 1973 and became independent on 21 September 1981.','Британ Гондурасы 1964-жылы ички өз алдынча башкарууга өткөн. 1973-жылы өлкөнүн аталышы Белиз болуп өзгөргөн. 1981-жылдын 21-сентябрында көз карандысыздыкка жеткен.'];
 const belizeEntry=c.entries.find(e=>e.id===belize),index=belizeEntry.phases.findIndex(p=>p.from===1961&&p.to===1981);
 if(index<0)throw Error('Missing Belize colonial phase');
 const base=belizeEntry.phases[index],phases=[[1961,1964,bname,colony],[1964,1973,bname,selfRule],[1973,1981,['Белиз','Belize','Белиз'],selfRule]].map(([from,to,name,text])=>
   H.phase(from,to,name,text,[...base.sources,'surveyBelize'],{name,approx:false}));
 belizeEntry.phases.splice(index,1,...phases);
 split('areas',[belize],[1964,1973]);
 for(const a of c.areas.filter(a=>a.entry===belize&&a.from>=1961&&a.to<=1981)){
   const phase=phases.find(p=>p.from<=a.from&&a.from<p.to);
   Object.assign(a,{name:phase.name,title:phase.title,text:phase.text,sources:phase.sources});
 }
 extend([britain],1859,1981,'british-honduras-mainland','surveyBelize',bz,land.peten);
 revise([belize],1961,2011,'belize-coastal-continuity','surveyBelize',()=>bz);
 revise([britain],1981,2011,'independence-of-belize','surveyBelize',p=>D(p,bz));
 // Flores and the settled Petén interior precede the northern boundary
 // settlement with Mexico. The treaty line comes into force in 1883.
 extend(['1848-central-america'],1859,1883,'peten-interior','surveyPeten',I(land.peten,box(-90,15.7,-88.4,17.32)),bz);
 extend(['1848-central-america'],1883,2011,'guatemalan-treaty-side','surveyPeten',land.peten,bz);
 revise(['early-new-spain'],1859,1883,'british-honduras-administration','surveyBelize',p=>D(p,bz));
 revise(['early-new-spain'],1883,2011,'peten-and-british-honduras','surveyPeten',p=>D(D(p,bz),land.peten));
 const sol='1991-solomons',i=land.solomons;
 const britishSol=['Протекторат Британские Соломоновы Острова','British Solomon Islands Protectorate','Британ Соломон аралдары протектораты'];
 const solText=['В 1893 году британский протекторат охватил Гуадалканал, Малаиту, Макиру и Новую Георгию. В 1900 году к нему перешли Шуазёль, Санта-Исабель и Шортлендские острова. Бука и Бугенвиль остались под немецким управлением до 1914 года.','The British protectorate proclaimed in 1893 included Guadalcanal, Malaita, Makira and New Georgia. Choiseul, Santa Isabel and the Shortland Islands joined it in 1900. Buka and Bougainville remained under German administration until 1914.','1893-жылы жарыяланган британ протекторатына Гуадалканал, Малаита, Макира жана Жаңы Георгия кирген. 1900-жылы Шуазёль, Санта-Исабель жана Шортленд аралдары кошулган. Бука менен Бугенвиль 1914-жылга чейин герман башкаруусунда калган.'];
 const south1897=G.merge([i.south,i.outer1897]),south1898=G.merge([south1897,i.outer1898]);
 const south1900=G.merge([south1898,i.transfer]),german1886=G.merge([i.germanNorth,i.transfer]);
 for(const [from,to,shape] of [[1893,1897,i.south],[1897,1898,south1897],[1898,1900,south1898],[1900,1961,south1900]]){
   historicalProfile(sol,from,to,britishSol,solText,[160.15,-9.58],shape,'surveySolomons',['Протекторат','Protectorate','Протекторат'],britain,'protectorate');
   extend([britain],from,to,'british-solomon-islands','surveySolomons',shape,from<1900?german1886:i.germanNorth);
 }
 extend([sol],1961,2011,'solomon-islands-coastal-continuity','surveySolomons',south1900,i.germanNorth);
 extend([britain],1961,1978,'protectorate-until-independence','surveySolomons',south1900,i.germanNorth);
 revise([britain],1978,2011,'independence-of-solomon-islands','surveySolomons',p=>D(p,south1900));
 extend(['late-hre'],1886,1900,'german-solomon-islands','surveySolomons',german1886,i.south);
 extend(['late-hre'],1900,1914,'german-northern-islands','surveySolomons',i.germanNorth,south1900);
 revise(['late-hre'],1914,1919,'end-german-rule-bougainville','surveySolomons',p=>D(p,german1886));
 const northSol='survey-northern-solomons',northName=['Северные Соломоновы острова','Northern Solomon Islands','Түндүк Соломон аралдары'];
 H.entry(northSol,'oceania','region',[155.35,-6.24],northName,[]);
 for(const [from,to,shape] of [[1886,1900,german1886],[1900,1914,i.germanNorth]])historicalProfile(northSol,from,to,northName,solText,[155.35,-6.24],shape,'surveySolomons',['Германский протекторат','German protectorate','Герман протектораты'],'late-hre','protectorate');
 historicalProfile(northSol,1914,1915,northName,solText,[155.35,-6.24],i.germanNorth,'surveySolomons',['Военная администрация Австралии','Australian military administration','Австралиянын аскердик башкаруусу'],'1914-australian-colonies','occupation');
 extend(['1918-new-guinea'],1915,1975,'buka-bougainville-administration','surveySolomons',i.germanNorth,south1900);
 function event(id,year,entry,coord,title,text,src){
   H.event('survey136-'+id,year,entry,'politics',coord,title,text,[src],{frontierAdded:true});
 }
 event('belize',1859,belize,[-88.20,17.50],['Соглашение о границе с Гватемалой','British–Guatemalan boundary convention','Гватемала менен чек ара келишими'],treaty,'surveyBelize');
 event('hondo',1897,belize,[-88.46,18.48],['Договор о границе по Рио-Ондо вступил в силу','Rio Hondo boundary treaty enters into force','Рио-Ондо чек ара келишими күчүнө кирди'],colony,'surveyBelize');
 event('belize-name',1973,belize,[-88.77,17.25],['Британский Гондурас получает название Белиз','British Honduras renamed Belize','Британ Гондурасы Белиз деп аталды'],selfRule,'surveyBelize');
 event('solomons',1900,sol,[156.98,-7.08],['Шуазёль и Санта-Исабель переходят под британское управление','Choiseul and Santa Isabel pass to British administration','Шуазёль жана Санта-Исабель британ башкаруусуна өттү'],solText,'surveySolomons');
 event('santa-cruz',1898,sol,[165.95,-10.76],['Протекторат провозглашён на островах Санта-Крус','Protectorate proclaimed in the Santa Cruz Islands','Санта-Крус аралдарында протекторат жарыяланды'],['Британский указ 1893 года включал острова Санта-Крус. На самих островах протекторат провозгласили в 1898 году. Годом ранее его провозгласили на Реннелле, Беллоне и Сикаиане.','The British Order in Council of 1893 included the Santa Cruz Islands. The protectorate was proclaimed on the islands in 1898, a year after the proclamations on Rennell, Bellona and Sikaiana.','1893-жылкы британ жарлыгы Санта-Крус аралдарын камтыган. Аралдарда протекторат 1898-жылы жарыяланган. Реннелл, Беллона жана Сикаианада ал бир жыл мурда жарыяланган.'],'surveySolomons');
 event('fuego',1881,'1789-rio-plata',[-68.58,-53.6],['Договор о разделе Огненной Земли','Boundary treaty on Tierra del Fuego','Оттуу Жерди бөлүү келишими'],['Договор Аргентины и Чили от 23 июля 1881 года разделил главный остров Огненной Земли. Земли к западу от линии отошли Чили, к востоку — Аргентине. В 1894 году комиссия уточнила положение линии от мыса Эспириту-Санто.','The treaty of 23 July 1881 divided the main island of Tierra del Fuego between Chile in the west and Argentina in the east. A boundary commission surveyed the line from Cape Espíritu Santo in 1894.','1881-жылдын 23-июлундагы келишим Оттуу Жердин башкы аралын бөлгөн. Батышы Чилиге, чыгышы Аргентинага өткөн. 1894-жылы комиссия Эспириту-Санто тумшугунан башталган чек араны жеринде тактаган.'],'surveyFuego');
 event('benin',1897,'benin',[5.63,6.34],['Британские войска занимают Бенин-Сити','British forces occupy Benin City','Британ аскерлери Бенин-Ситини ээлешти'],['В 1897 году британские войска заняли Бенин-Сити, разграбили дворец, а оба Овонрамвен был отправлен в ссылку. В 1914 году его сын Эвека II занял престол под британским управлением.','British troops occupied Benin City in 1897 and looted the palace. Oba Ovonramwen was exiled. His son Eweka II succeeded to the throne under British rule in 1914.','1897-жылы британ аскерлери Бенин-Ситини ээлеп, сарайды талап-тоногон. Оба Овонрамвен сүргүнгө айдалган. 1914-жылы анын уулу Эвека II британ бийлигинин тушунда такка отурган.'],'surveyYoruba');
 return c;
};
