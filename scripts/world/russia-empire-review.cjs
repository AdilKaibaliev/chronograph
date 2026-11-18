'use strict';
// Treaty-specific repairs to the published map, independent of the archived
// catalogue. All geometry remains a regional historical reconstruction.
module.exports=c=>{
 const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),r=require('./russia-treaty-geography.json');
 const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))).filter(r=>Math.abs(G.signed(r))>.0000001);
 const D=(a,b)=>a.length&&b.length?flat(clip.difference(G.multi(a),G.multi(b))):a;
 const I=(a,b)=>a.length&&b.length?flat(clip.intersection(G.multi(a),G.multi(b))):[];
 const box=(x,y,X,Y)=>G.union([[[x,y],[X,y],[X,Y],[x,Y]]]);
 const source=(id,title,urls)=>c.sources[id]={title,urls};
 source('russiaBessarabia','Бухарестский мирный договор, 1812; Парижский мирный договор, 1856, ст. XX–XXI; Парижские протоколы, 1857; Берлинский трактат, 1878, ст. XLV; Edward Hertslet. The Map of Europe by Treaty, plate 16.',[
  'https://www.prlib.ru/history/619271','https://content.ecf.org.il/files/M00934_TreatyOfParis1856English.pdf','https://maproom.org/00/02/present.php?m=0016','https://docs.historyrussia.org/ru/nodes/520083-otnosyaschiesya-k-rumynii-stati-berlinskogo-traktata-1-13-iyulya-1878-g']);
 source('russiaGulistan','Кюрекчайский договор, 1805; Гюлистанский мирный договор, 1813, ст. II–III; Elton L. Daniel. Golestān Treaty. Encyclopaedia Iranica.',[
  'https://justice.gov.az/documents/categories/1163/kurekcay-en.pdf','https://justice.gov.az/documents/categories/1163/gulustan-en.pdf','https://www.iranicaonline.org/articles/golestan-treaty/']);
 source('russiaKyiv1686','Вечный мир, 1686; Київський обласний археологічний музей. Правобережна Київщина 1667–1772 рр.; карта А. И. Ригельмана, 1748.',[
  'https://koam.com.ua/pravoberezhna-kii-vshhina-1667-1772-rr/']);
 source('russiaAfghan1887','U.S. Department of State. International Boundary Study No. 26 (revised): Afghanistan–U.S.S.R., 1983; Daniel Balland. Boundaries of Afghanistan. Encyclopaedia Iranica.',[
  'https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs026.pdf','https://www.iranicaonline.org/articles/boundaries-iii/']);
 source('russiaBlackSea1774','Кючук-Кайнарджийский мирный договор, 1774, ст. XVIII–XX; П. А. Румянцев. Сборник документов, том II.',[
  'https://www.vostlit.info/Texts/Dokumenty/Turk/XVIII/1760-1780/Traktat_Kucuk_Karnaji_1774/text.phtml',
  'https://drevlit.ru/docs/russia/XVIII/1740-1760/Rumjancev_P_A/Sb_dok_tom_II/pril5445.php']);
 source('russiaArctic1916','Б. А. Вилькицкий. Отчёт об экспедиции, 1913; циркулярная нота МИД России, 1916; Legal Appraisals of Canada’s Arctic Sovereignty: Key Documents, 1905–56. Documents on Canadian Arctic Sovereignty and Security, 2, 2014.',[
  'https://rgo.ru/activity/redaction/articles/kak-russkie-moreplavateli-iskali-put-cherez-okean-a-nashli-novuyu-zemlyu/',
  'https://pubs.aina.ucalgary.ca/dcass/81350.pdf',
  'https://collections.dartmouth.edu/archive/text/stefansson-wrangel-tei/diplomatic/stefansson-wrangel-09-30-006-diplomatic.html']);
 source('urupContinuity','Совместный сборник документов по истории территориального вопроса между Россией и Японией: договор 1875 года; документы 1945–1946 годов. Natural Earth. Admin 0, 1:10m.',[
  'https://www.mofa.go.jp/region/europe/russia/territory/edition92/period2.html',
  'https://www.mofa.go.jp/region/europe/russia/territory/edition92/period3.html',
  'https://www.naturalearthdata.com/downloads/10m-cultural-vectors/']);
 const records=[],rus=['early-russia','1789-russian-empire'];
 function revise(ids,from,to,reason,src,fn){
  for(const key of ['areas','outlines']){
   c[key]=c[key].flatMap(a=>{
    if(!ids.includes(a.entry)||a.to<=from||a.from>=to)return [a];
    const cuts=[a.from,...[from,to].filter(y=>a.from<y&&y<a.to),a.to].sort((a,b)=>a-b);
    return cuts.slice(0,-1).map((start,i)=>{
     const n=cuts.length===2?a:{...a,id:a.id+'-russia-'+start,from:start,to:cuts[i+1]};
     if(key==='areas'){
      c.cartography.areas[n.id]=c.cartography.areas[a.id];
      if(c.cartography.kinds[a.id]!==undefined)c.cartography.kinds[n.id]=c.cartography.kinds[a.id];
     }
     if(n.from<from||n.to>to)return n;
     const old=key==='areas'?c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons:a.polygons;
     const p=fn(old,n.from,n.entry);
     if(!p.length)throw Error('Empty Russian frontier correction: '+n.id);
     if(JSON.stringify(p)===JSON.stringify(old))return n;
     if(key==='areas'){c.cartography.areas[n.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);}
     else {n.polygons=p;n.points=p[0];}
     n.sources=[...new Set([...n.sources,src])];n.approx=true;
     records.push({id:n.id,entry:n.entry,from:n.from,to:n.to,reason,source:src});
     return n;
    });
   });
  }
 }
 const add=mask=>p=>G.merge([p,mask]),remove=mask=>p=>D(p,mask);
 // A broad Siberian envelope must not assign Wrangel Island to the empire
 // two centuries before its documented claim. Never fill the intervening sea.
 revise(rus,1649,1916,'wrangel-before-official-claim','russiaArctic1916',remove(r.wrangel));
 revise(rus,1916,1918,'arctic-notification-1916','russiaArctic1916',add(r.wrangel));
 revise(rus,1913,1918,'severnaya-expedition-announcement','russiaArctic1916',add(r.severnaya));
 // The Kyiv enclave already belonged to the Tsardom at the foundation of
 // the empire. Do not wait for the Polish partitions to show Kyiv.
 revise(rus,1686,1793,'kyiv-right-bank-enclave','russiaKyiv1686',p=>G.merge([D(p,r.rightBank),r.kyiv]));
 revise(['early-commonwealth'],1686,1793,'kyiv-right-bank-enclave','russiaKyiv1686',p=>G.merge([D(p,r.kyiv),r.rightBank]));
 // The Bug–Dnipro steppe, Kinburn and the Kerch/Yenikale districts precede
 // the annexation of the Crimean Khanate. Do not backdate the whole peninsula.
 const blackSea=G.merge([r.northBlackSea,r.kerch]);
 revise(rus,1774,1792,'kuchuk-kainarji-before-crimea','russiaBlackSea1774',add(blackSea));
 revise(['late-ottoman','early-crimea'],1774,1792,'kuchuk-kainarji-before-crimea','russiaBlackSea1774',remove(blackSea));
 // Bessarabia is west of the Dniester. Earlier Russian acquisition of the
 // opposite bank must not be extended across the river into Ottoman land.
 revise(rus,1792,1812,'bessarabia-before-bucharest','russiaBessarabia',remove(r.bessarabia));
 revise(['late-ottoman'],1792,1812,'bessarabia-before-bucharest','russiaBessarabia',add(r.bessarabia));
 revise(rus,1812,1856,'bucharest-1812','russiaBessarabia',add(r.bessarabia));
 revise(rus,1856,1857,'paris-1856','russiaBessarabia',p=>G.merge([D(p,r.bessarabia),D(r.bessarabia,r.south1856)]));
 revise(rus,1857,1878,'bessarabian-protocols-1857','russiaBessarabia',p=>G.merge([D(p,r.bessarabia),D(r.bessarabia,r.south1857)]));
 revise(rus,1878,1918,'berlin-1878','russiaBessarabia',add(r.bessarabia));
 revise(['late-ottoman'],1812,1856,'bucharest-1812','russiaBessarabia',remove(r.bessarabia));
 revise(['late-ottoman'],1856,1857,'paris-1856','russiaBessarabia',p=>G.merge([D(p,r.bessarabia),r.south1856]));
 revise(['late-ottoman'],1857,1859,'bessarabian-protocols-1857','russiaBessarabia',p=>G.merge([D(p,r.bessarabia),r.south1857]));
 revise(['1914-romania'],1859,1878,'southern-bessarabia-principalities','russiaBessarabia',p=>G.merge([D(p,r.bessarabia),r.south1857]));
 revise(['late-ottoman'],1859,1878,'southern-bessarabia-principalities','russiaBessarabia',remove(r.bessarabia));
 revise(['late-ottoman','1914-romania'],1878,1918,'berlin-1878','russiaBessarabia',remove(r.bessarabia));
 // Gulistan recognises the conquest of Ganja and Karabakh; Erivan and
 // Nakhchivan remain outside this repair until the 1828 settlement.
 const ganja=G.union([[[45.45,41.45],[46.25,41.45],[46.8,40.98],[47.25,40.68],[46.55,40.37],[45.75,40.5],[45.45,40.8]]]);
 const karabakh=G.union([[[45.85,40.5],[46.5,40.6],[47.5,40.5],[47.4,39.4],[46.5,38.95],[46.1,39.35],[46.18,39.75],[45.85,40.05]]]);
 revise(rus,1804,1813,'ganja-conquest-1804','russiaGulistan',add(ganja));
 revise(['1789-qajar'],1804,1813,'ganja-conquest-1804','russiaGulistan',remove(ganja));
 revise(rus,1805,1813,'karabakh-kurekchay-1805','russiaGulistan',add(karabakh));
 revise(['1789-qajar'],1805,1813,'karabakh-kurekchay-1805','russiaGulistan',remove(karabakh));
 revise(rus,1813,1828,'gulistan-ganja-karabakh','russiaGulistan',add(r.gulistan));
 revise(['1789-qajar'],1813,1828,'gulistan-ganja-karabakh','russiaGulistan',remove(r.gulistan));
 revise(rus,1855,1875,'shimoda-urup','to1918PacificTreaties',add(r.urup));
 revise(['japan'],1855,1875,'shimoda-urup','to1918PacificTreaties',remove(r.urup));
 revise(['japan'],1875,1945,'st-petersburg-urup','urupContinuity',add(r.urup));
 // Keep the recipient after the imperial period; the island must not vanish
 // at the 1917/1918 or 1945/1946 catalogue boundaries.
 revise(['1939-ussr'],1945,1992,'urup-soviet-administration','urupContinuity',add(r.urup));
 revise(['1991-russia'],1991,2027,'urup-successor-administration','urupContinuity',add(r.urup));
 // The coarse US reference omitted Baranof Island after the Alaska transfer.
 // Preserve the actual island coast for both the parent and regional card.
 revise(['1789-usa','1914-alaska'],1867,2027,'baranof-after-alaska-transfer','to1914Alaska',add(r.baranof));
 const merv=I(r.transcaspian,box(61,36.7,63.5,38.5));
 revise(['early-bukhara','early-khwarazm'],1868,1884,'merv-before-russian-acquisition','russiaAfghan1887',remove(merv));
 const panjdeh=I(r.transcaspian,G.union([[[62.3,37.3],[63.4,37.3],[63.2,36.4],[63.12,35.9],[62.8,35.77],[62.65,36],[62.5,36.7]]]));
 revise(rus,1885,1887,'panjdeh-occupation-1885','russiaAfghan1887',add(panjdeh));
 revise(['early-bukhara','early-khwarazm'],1885,1887,'panjdeh-occupation-1885','russiaAfghan1887',remove(panjdeh));
 // The settled 1887 Afghan frontier supplies the late imperial contour.
 // It is not projected backwards onto the 1884 Merv acquisition.
 revise(rus,1887,1918,'afghan-frontier-1887','russiaAfghan1887',add(r.transcaspian));
 revise(['early-bukhara','early-khwarazm'],1887,1918,'transcaspian-direct-administration','russiaAfghan1887',remove(r.transcaspian));
 const H=require('./late-helpers.cjs')(c,{start:610,max:2026});
 H.event('russia-arctic-claim-1913',1913,'1789-russian-empire','politics',[97.2,80.0667],['Земля Николая II: экспедиция Вилькицкого','Nicholas II Land: Vilkitsky’s expedition','Николай II жери: Вилькицкийдин экспедициясы'],['В сентябре 1913 года экспедиция Бориса Вилькицкого открыла архипелаг, ныне известный как Северная Земля. На берегу подняли российский флаг и объявили землю владением империи.','In September 1913 Boris Vilkitsky’s expedition discovered the archipelago now called Severnaya Zemlya. The expedition raised the Russian flag and announced its incorporation into the empire.','1913-жылдын сентябрында Борис Вилькицкийдин экспедициясы азыр Түндүк Жер деп аталган архипелагды ачкан. Жээкке орус туусу көтөрүлүп, жер империянын ээлиги деп жарыяланган.'],['russiaArctic1916'],{frontierAdded:true,region:'eurasia'});
 H.event('russia-arctic-claim-1916',1916,'1789-russian-empire','politics',[179.5,71.2],['Российские притязания на арктические острова','Russian claims to Arctic islands','Россиянын Арктика аралдарына дооматтары'],['Дипломатическая нота 1916 года объявила Врангеля и ряд других арктических островов частью Российской империи. Это заявление о суверенитете; постоянной российской администрации на острове Врангеля тогда не было.','A diplomatic note in 1916 declared Wrangel and several other Arctic islands part of the Russian Empire. It was a claim to sovereignty; Wrangel Island did not then have a permanent Russian administration.','1916-жылкы дипломатиялык нота Врангель жана башка бир катар Арктика аралдарын Россия империясынын бөлүгү деп жарыялаган. Бул эгемендикке доомат болгон; Врангель аралында ошол кезде туруктуу орус администрациясы болгон эмес.'],['russiaArctic1916'],{frontierAdded:true,region:'eurasia'});
 c.russiaEmpireReview={version:1,range:[1721,1917],geometrySha256:require('node:crypto').createHash('sha256').update(JSON.stringify(r)).digest('hex'),records,sources:['russiaBessarabia','russiaGulistan','russiaKyiv1686','russiaBlackSea1774','russiaAfghan1887','russiaArctic1916','to1918PacificTreaties']};
 return c;
};
