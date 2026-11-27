'use strict';
// Documentary transfers are applied to both source geometry and owner outlines.
// Existing regional envelopes remain approximate; these are not cadastral lines.
module.exports=function(c,{source,revise,split,visibleAt,D,I,box}){
 const G=require('./cartography-geometry.cjs'),H=require('./late-helpers.cjs')(c,{start:610,max:2026}),L=s=>s.split('|');
 const cite=(id,title,urls)=>source(id,title,urls);
 cite('gasconRolls143','The Gascon Rolls Project. Gascon Rolls C 61/138–140; Anne Curry, The Gascon Rolls and the End of English Gascony, 1451–1453.',[
  'https://www.gasconrolls.org/fr/edition/calendars/C61_139/document.html',
  'https://www.gasconrolls.org/fr/edition/calendars/C61_140/document.html',
  'https://www.gasconrolls.org/en/blog/the-gascon-rolls-and-the-end-of-english-gascony-1451-1453/'
 ]);
 cite('hartfordTreaty143','Articles of Agreement at Hartford, 19 September 1650. New Netherland Papers, c. 1650–1660, pp. 3–4; Connecticut Secretary of the State, Selected Important Dates in Connecticut History; Dwight Loomis and J. Gilbert Calhoun, The Judicial and Civil History of Connecticut (1895).',[
  'https://www.newnetherlandinstitute.org/application/files/9016/8416/7647/Bontemantel.pdf',
  'https://portal.ct.gov/sots/register-manual/section-i/selected-important-dates-in-connecticut-history-us-presidents-and-vice-presidents',
  'https://www.colonialwarsct.org/1731.htm',
  'https://www.cga.ct.gov/hco/books/The_Judicial_and_Civil_History_of_CT.pdf'
 ]);
 cite('basraRegisters143','Yusuf Halaçoğlu. Basra, Osmanlı Dönemi, TDV İslâm Ansiklopedisi; Fadime Demirdöğen. XVI. Yüzyılda Basra Vakıfları (1590 Tarihli Tahrir Defterine Göre).',[
  'https://islamansiklopedisi.org.tr/basra#2-osmanli-donemi',
  'https://dergipark.org.tr/en/pub/vakiflar/article/720013'
 ]);
 cite('nepalTreaty143','Treaty between the United Kingdom and Nepal, signed at Katmandu, 21 December 1923, Article 1. Cmd. 2112 (1924); British Library, IOR/L/PS/18/B383; Foreign Relations of the United States, 1950, Volume V, document 836.',[
  'https://archivenepal.s3.amazonaws.com/documents/1924_UK_and_Nepal_treaty.pdf',
  'https://searcharchives.bl.uk/catalog/040-000563531',
  'https://history.state.gov/historicaldocuments/frus1950v05/d836'
 ]);
 // Use the English Gascony frame, not the French kingdom's wider legal claim.
 const gascony=I(visibleAt('late-england',1450),box(-2,42,2,47));
 revise(['late-france'],1420,1451,'gascony-before-french-recovery','gasconRolls143',p=>D(p,gascony));
 revise(['late-england'],1451,1453,'loss-of-gascony-1451','gasconRolls143',p=>D(p,gascony));
 revise(['late-france'],1451,1453,'french-recovery-of-gascony-1451','gasconRolls143',p=>G.merge([p,gascony]));
 // The 1452 return restored the Bordelais, not all earlier English Gascony.
 // This regional envelope joins the attested Bordeaux–Libourne–Castillon area;
 // the source does not provide surveyed lines between every village.
 const bordelais=I(gascony,G.union([[[-1.2,45.5],[-.3,45.35],[.12,45.05],[.12,44.8],[-.35,44.5],[-1.2,44.5]]]));
 revise(['late-england'],1452,1453,'talbot-bordelais-return-1452','gasconRolls143',p=>G.merge([p,bordelais]));
 revise(['late-france'],1452,1453,'bordelais-outside-french-control-1452','gasconRolls143',p=>D(p,bordelais));
 const franceRows=[
  [1450,1451,'Возвращение Нормандии|Recovery of Normandy|Нормандиянын кайтарылышы','В 1450 году Карл VII возвращает Нормандию. Бордо и английские владения в Гаскони остаются вне его власти.|Charles VII recovers Normandy in 1450. Bordeaux and the English possessions in Gascony remain outside his control.|1450-жылы Карл VII Нормандияны кайтарат. Бордо жана Гаскондогу англис ээликтери анын бийлигинен тышкары калат.'],
  [1451,1452,'Возвращение Гаскони|Recovery of Gascony|Гаскондун кайтарылышы','В июне 1451 года Бордо переходит под власть Карла VII. В августе сдается Байонна; английское управление Гасконью прекращается.|Bordeaux passes to Charles VII in June 1451. Bayonne surrenders in August, ending English administration in Gascony.|1451-жылдын июнунда Бордо Карл VIIнин бийлигине өтөт. Августта Байонна багынып, Гаскондогу англис башкаруусу токтойт.'],
  [1452,1453,'Английское возвращение в Бордо|English return to Bordeaux|Англистердин Бордого кайтып келиши','В октябре 1452 года войско Джона Тальбота возвращает Бордо. Английские и гасконские силы восстанавливают власть в Борделе; это не восстановление всех прежних владений в Гаскони.|John Talbot’s army recovers Bordeaux in October 1452. English and Gascon forces regain the Bordelais, without restoring all their former possessions in Gascony.|1452-жылдын октябрында Жон Талботтун аскери Бордону кайтарат. Англис жана гаскон күчтөрү Борделеде бийлигин калыбына келтирет, бирок Гаскондогу мурдагы ээликтеринин баарын кайтара албайт.']
 ];
 function phases(id,from,to,rows,src){
  const e=c.entries.find(e=>e.id===id),old=e.phases.find(p=>p.from<=from&&from<p.to);
  e.phases=e.phases.flatMap(p=>p.to<=from||p.from>=to?[p]:[
   ...(p.from<from?[{...p,to:from}]:[]),...(p.to>to?[{...p,from:to}]:[])
  ]).concat(rows.map(([f,t,title,text])=>H.phase(f,t,L(title),L(text),[...new Set([...old.sources,src])],{...old,from:f,to:t,title:L(title),text:L(text),sources:[...new Set([...old.sources,src])],period:H.phase(f,t,[],[],[],{approx:false}).period}))).sort((a,b)=>a.from-b.from);
  split('areas',[id],rows.flatMap(r=>r.slice(0,2)));
  split('outlines',[id],rows.flatMap(r=>r.slice(0,2)));
  for(const a of [...c.areas,...c.outlines].filter(a=>a.entry===id&&a.from>=from&&a.to<=to)){
   const p=e.phases.find(p=>p.from<=a.from&&a.from<p.to);a.title=p.title;a.text=p.text;a.sources=[...new Set([...a.sources,src])];
  }
 }
 phases('late-france',1450,1453,franceRows,'gasconRolls143');
 phases('late-england',1450,1453,franceRows,'gasconRolls143');
 for(const r of franceRows.filter(r=>r[0]>1450))H.event('bordeaux-transfer-'+r[0],r[0],r[0]===1452?'late-england':'late-france','war',[-.58,44.84],L(r[2]),L(r[3]),['gasconRolls143'],{frontierAdded:true});
 // The treaty partitions Long Island and recognises English settlements east
 // of Greenwich. Beyond the specified twenty miles, do not invent a northward
 // meridian as a surveyed boundary: remove only duplicate English-settlement
 // geometry already present in the catalogue. Hartford's Dutch trading post
 // is represented as a dated place, not as sovereignty over the whole valley.
 const dutch1650=visibleAt('1789-new-netherland',1650),english1650=visibleAt('1789-english-atlantic',1650);
 const mainland=I(english1650,box(-73.65,41.02,-71.5,42.4));
 const longIsland=I(dutch1650,box(-73.54,40.5,-71.7,41.02));
 const eastern=G.merge([mainland,longIsland]);
 revise(['1789-new-netherland'],1650,1664,'hartford-1650-english-side','hartfordTreaty143',p=>D(p,eastern));
 revise(['1789-english-atlantic'],1650,1664,'hartford-1650-long-island','hartfordTreaty143',p=>G.merge([p,longIsland]));
 // Owner outlines after 1655 include the colonies; keep the same dated edge.
 revise(['late-england'],1655,1664,'hartford-1650-colonial-owner','hartfordTreaty143',p=>G.merge([p,longIsland]));
 const hartfordText='19 сентября 1650 года представители английских колоний и Питер Стёйвесант согласуют раздел Лонг-Айленда у Ойстер-Бей и рубеж на материке от Гринвич-Бей. За нидерландцами сохраняются уже занятые ими земли торгового поста в Хартфорде.|On 19 September 1650 English colonial representatives and Peter Stuyvesant agree to divide Long Island at Oyster Bay and set a mainland boundary from Greenwich Bay. The Dutch retain the land already occupied by their trading post at Hartford.|1650-жылдын 19-сентябрында англис колонияларынын өкүлдөрү менен Питер Стёйвесант Лонг-Айлендди Ойстер-Бейден бөлүүнү жана материктеги чекти Гринвич-Бейден баштоону макулдашат. Нидерланддар Хартфорддогу соода бекети ээлеген жерлерин сактап калат.';
 const dutchOld=c.entries.find(e=>e.id==='1789-new-netherland').phases.find(p=>p.from===1624);
 const afterHartford='Нидерландские владения связывают Новый Амстердам, Гудзон и западную часть Лонг-Айленда. В 1654 году власти Коннектикута конфискуют нидерландское имущество в Хартфорде; прежний торговый пост больше не означает нидерландского контроля над долиной.|Dutch possessions link New Amsterdam, the Hudson and western Long Island. Connecticut authorities confiscate Dutch property at Hartford in 1654; the former trading post no longer represents Dutch control of the valley.|Нидерланд ээликтери Жаңы Амстердамды, Гудзонду жана Лонг-Айленддин батышын байланыштырат. 1654-жылы Коннектикут бийлиги Хартфорддогу нидерланд мүлкүн конфискациялайт; мурдагы соода бекети эми өрөөндөгү нидерланд бийлигин билдирбейт.';
 phases('1789-new-netherland',1650,1664,[[1650,1654,'После Хартфордского соглашения|After the Hartford agreement|Хартфорд келишиминен кийин',hartfordText],[1654,1664,'Новые Нидерланды после утраты поста в Хартфорде|New Netherland after the loss of the Hartford post|Хартфорд бекетин жоготкондон кийинки Жаңы Нидерланд',afterHartford]],'hartfordTreaty143');
 // Keep the earlier phase's printed date range in step with the new split.
 dutchOld.period=H.phase(dutchOld.from,1650,[],[],[],{approx:true}).period;
 for(const p of c.entries.find(e=>e.id==='1789-new-netherland').phases.filter(p=>p.from===1624))p.period=dutchOld.period;
 H.event('hartford-agreement-1650',1650,'1789-new-netherland','diplomacy',[-72.674,41.764],L('Хартфордское соглашение|Hartford agreement|Хартфорд келишими'),L(hartfordText),['hartfordTreaty143'],{frontierAdded:true});
 H.event('new-haven-foundation-1638',1638,'1789-english-atlantic','politics',[-72.925,41.308],L('Основание колонии Нью-Хейвен|Foundation of New Haven Colony|Нью-Хейвен колониясынын негизделиши'),L('Джон Дэвенпорт и Теофил Итон основывают английскую колонию Нью-Хейвен на землях народа куиннипиак.|John Davenport and Theophilus Eaton establish the English colony of New Haven on Quinnipiac lands.|Жон Дэвенпорт менен Теофил Итон куиннипиак элинин жеринде англис Нью-Хейвен колониясын негиздейт.'),['hartfordTreaty143'],{frontierAdded:true});
 // Basra acknowledges Ottoman suzerainty before the permanent garrison.
 // Only the already mapped lower-Iraq territory west of the Shatt al-Arab is
 // removed from the Safavid envelope; Khuzestan and later occupations survive.
 const lowerIraq=G.union([[[46.5,30],[48.45,30],[48.18,30.2],[48,30.5],[47.9,30.65],[47.6,31],[47.4,31.2],[46.5,31.2]]]);
 const basra=I(visibleAt('late-ottoman',1555),lowerIraq);
 revise(['early-safavid'],1538,1590,'basra-ottoman-suzerainty-and-garrison','basraRegisters143',p=>D(p,basra));
 for(const [year,title,text]of [
  [1538,'Басра признаёт власть султана|Basra acknowledges the sultan|Басра султандын бийлигин тааный','Правитель Басры вновь подтверждает подчинение Сулейману. Местное управление сохраняется; на монетах появляется имя султана.|Basra’s ruler renews his submission to Suleiman. Local administration continues, and coins bear the sultan’s name.|Басранын башкаруучусу Сулайманга баш ийерин кайра ырастайт. Жергиликтүү башкаруу сакталат, тыйындарга султандын аты түшүрүлөт.'],
  [1546,'Османский гарнизон в Басре|Ottoman garrison at Basra|Басрада осмон гарнизону','После похода Аяс-паши в конце 1545–1546 годов в Басре закрепляется османский гарнизон и вводится провинциальное управление.|Following Ayas Pasha’s campaign in late 1545–1546, an Ottoman garrison and provincial administration are established at Basra.|1545-жылдын аягындагы–1546-жылдагы Аяс-пашанын жортуулунан кийин Басрада осмон гарнизону жана вилайет башкаруусу орнойт.']
 ])H.event('basra-administration-'+year,year,'late-ottoman','diplomacy',[47.82,30.5],L(title),L(text),['basraRegisters143'],{frontierAdded:true});
 const nepalBefore='Непал сохраняет монархию и управление Рана. Правительство в Катманду самостоятельно ведёт внутренние дела страны; Непал не входит в Британскую Индию.|Nepal retains its monarchy and Rana government. The government in Kathmandu administers the country’s internal affairs; Nepal is not part of British India.|Непалда монархия жана Рана башкаруусу сакталат. Катмандудагы өкмөт өлкөнүн ички иштерин өз алдынча башкарат; Непал Британ Индиясына кирбейт.';
 const nepalAfter='21 декабря 1923 года Непал и Великобритания подписывают договор: обе стороны признают внутреннюю и внешнюю независимость друг друга. Монархия и управление Рана сохраняются.|On 21 December 1923 Nepal and Britain sign a treaty recognising each other’s internal and external independence. The monarchy and Rana government continue.|1923-жылдын 21-декабрында Непал менен Британия бири-биринин ички жана тышкы көз карандысыздыгын тааныган келишимге кол коёт. Монархия жана Рана башкаруусу сакталат.';
 phases('1960-nepal',1919,1946,[[1919,1923,'Непал при Рана|Nepal under the Ranas|Раналар башкарган Непал',nepalBefore],[1923,1946,'Договор Непала и Великобритании|Nepal–Britain treaty|Непал–Британия келишими',nepalAfter]],'nepalTreaty143');
 H.event('nepal-britain-treaty-1923',1923,'1960-nepal','diplomacy',[85.32,27.72],L('Договор Непала и Великобритании|Nepal–Britain treaty|Непал–Британия келишими'),L(nepalAfter),['nepalTreaty143'],{frontierAdded:true});
};
