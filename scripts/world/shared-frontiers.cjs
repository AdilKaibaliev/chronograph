'use strict';
// Dated repairs of the source sketches. These rules are not a global drawing
// priority: each identifies a documented frontier, transfer, or relationship.
module.exports=c=>{
 const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),ref=require('./to1960-reference.json');
 const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))).filter(r=>Math.abs(G.signed(r))>.000005);
 const D=(a,b)=>b.length?flat(clip.difference(G.multi(a),G.multi(b))):a;
 const I=(a,b)=>a.length&&b.length?flat(clip.intersection(G.multi(a),G.multi(b))):[];
 const U=(...n)=>G.merge(n.map(n=>{if(!ref[n])throw Error('Unknown reference '+n);return G.union(ref[n]);}));
 const box=(x,y,X,Y)=>G.union([[[x,y],[X,y],[X,Y],[x,Y]]]);
 const geometry=a=>c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons;
 const visibleAt=(id,y)=>c.outlines.find(a=>a.entry===id&&a.from<=y&&y<a.to)?.polygons||at(id,y);
 const at=(id,y)=>{const a=c.areas.find(a=>a.entry===id&&a.from<=y&&y<a.to);return a?geometry(a):[];};
 const reviewed=[],relations=[],presentation=[];
 const source=(id,title,urls)=>c.sources[id]={title,urls};
 source('sharedKhorasan','Encyclopaedia Iranica. Khorasan IX–X; Herat III; Safavid Dynasty; The Cambridge History of Iran, Volumes 6–7.',[
  'https://www.iranicaonline.org/articles/khorasan-ix-history-in-the-timurid-period/',
  'https://www.iranicaonline.org/articles/khorasan-x-history-in-the-safavid-and-afsharid-periods/',
  'https://www.iranicaonline.org/articles/herat-iii/',
  'https://www.iranicaonline.org/articles/safavids/']);
 source('sharedNorthernFrontier','International Boundary Commission. History; Anglo-Russian Convention of 1825; Treaty of 1846; Treaty of 1908; Alaska Boundary Tribunal, 1903.',[
  'https://www.internationalboundarycommission.org/en/about/history.php',
  'https://legal.un.org/riaa/cases/vol_XV/481-540.pdf']);
 source('sharedScandinavia','Norwegian Government. NOU 2008:5, Chapter 6; Convention concerning the Norway–Russia boundary, 14 May 1826.',[
  'https://www.regjeringen.no/no/dokumenter/nou-2008-5/id499796/?ch=6',
  'https://lovdata.no/dokument/TRAKTAT/traktat/1826-05-14-1']);
 source('sharedPyrenees','Archives diplomatiques. Limites / Espagne; Treaties of Bayonne, 1856, 1862 and 1866.',[
  'https://archivesdiplomatiques.diplomatie.gouv.fr/ark:/14366/x5lcmwfsd78p']);
 source('sharedCentralAsia','Seymour Becker. Russia’s Protectorates in Central Asia: Bukhara and Khiva, 1865–1924; Encyclopaedia Iranica. Central Asia VII, IX; Khiva.',[
  'https://www.iranicaonline.org/articles/central-asia-vii/',
  'https://www.iranicaonline.org/articles/central-asia-ix/',
  'https://www.iranicaonline.org/articles/khiva/']);
 source('sharedCivilWar','National Park Service. Civil War Timeline; Appomattox Court House: February 1861; National Archives. West Virginia Statehood; U.S. Census Bureau. Cartographic state boundaries, 2017.',[
  'https://www.nps.gov/gett/learn/historyculture/civil-war-timeline.htm',
  'https://home.nps.gov/apco/february-1861.htm',
  'https://www.archives.gov/legislative/features/west-virginia/hjres17.html',
  'https://github.com/topojson/us-atlas']);
 source('sharedTexas','Texas State Library. Annexation Process, 1836–1845; Office of the Historian. Gadsden Purchase, 1853–1854.',[
  'https://www.tsl.texas.gov/ref/abouttx/annexation/timeline.html',
  'https://history.state.gov/milestones/1830-1860/gadsden-purchase']);
 source('sharedChaco','Treaty of Peace, Friendship and Boundaries between Bolivia and Paraguay, 21 July 1938; Chaco Arbitral Award, 10 October 1938.',[
  'https://www2.mre.gov.py/cndl/index.php/institucional/memoria-final-de-la-cndl/tratado-de-paz-amistad-entre-las-republicas-de-bolivia-y-paraguay',
  'https://legal.un.org/riaa/states/bolivia.shtml']);
 source('sharedPortugal','Treaty of Badajoz, 6 June 1801, Article III.',[
  'https://pt.wikisource.org/wiki/Tratado_de_Badajoz_%281801%29']);
 source('sharedAmur','Law Library of Congress. The Sino-Soviet Border; Treaty of Peking, 14 November 1860.',[
  'https://tile.loc.gov/storage-services/service/ll/llglrdppub/2019668557/2019668557.pdf']);
 source('sharedQing','The Cambridge History of China, Volume 9; Hodong Kim. Holy War in China: The Muslim Rebellion and State in Chinese Central Asia, 1864–1877; Cultural Encounters on China’s Ethnic Frontiers. Chinggis Khan: From Imperial Ancestor to Ethnic Hero.',[
  'https://www.cambridge.org/core/books/cambridge-history-of-china/FCAF722927C25994C5560B5BA3107C1C',
  'https://uw.manifoldapp.org/read/f53eaa89-d3e1-42d9-a820-bce1265b853f/section/28731b38-d9fd-475d-af6f-e76b346f0d54']);
 source('sharedKazan','TDV İslâm Ansiklopedisi. Kazan Hanlığı; UNESCO. Historic and Architectural Complex of the Kazan Kremlin.',[
  'https://islamansiklopedisi.org.tr/kazan-hanligi',
  'https://whc.unesco.org/en/list/980/']);
 source('sharedUqair','Uqair Protocol No. 1, 1922; United Nations Treaty Series, Volume 1638, Agreed Minutes of 18 April 1975: demarcation under the 1922 protocol.',[
  'https://treaties.un.org/doc/Publication/UNTS/Volume%201638/english.pdf']);
 // Split at a real rule boundary, including outlines. Do not apply a later
 // correction retroactively to a long-lived source frame.
 function split(key,ids,cuts){
  c[key]=c[key].flatMap(a=>{
   if(!ids.includes(a.entry))return [a];
   const years=[...new Set([a.from,...cuts.filter(y=>a.from<y&&y<a.to),a.to])].sort((a,b)=>a-b);
   return years.slice(0,-1).map((from,i)=>{if(years.length===2)return a;const n={...a,from,to:years[i+1],id:a.id+'-edge-'+from};if(key==='areas'){c.cartography.areas[n.id]=c.cartography.areas[a.id];if(c.cartography.kinds?.[a.id])c.cartography.kinds[n.id]=c.cartography.kinds[a.id];}return n;});
  });
 }
 function revise(ids,from,to,rule,sourceId,fn){
  for(const key of ['areas','outlines']){
   split(key,ids,[from,to]);
   for(const a of c[key].filter(a=>ids.includes(a.entry)&&from<=a.from&&a.to<=to)){
    const old=key==='areas'?geometry(a):a.polygons,p=fn(old,a.from,a.entry);
    if(!p.length)throw Error('Empty shared frontier '+rule+' '+a.id);
    if(JSON.stringify(old)===JSON.stringify(p))continue;
    if(key==='areas'){c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);}
    else {a.polygons=p;a.points=p[0];}
    a.sources=[...new Set([...a.sources,sourceId])];
    const record={id:a.id,entry:a.entry,from:a.from,to:a.to,reason:rule,source:sourceId};reviewed.push(record);c.frontierReview.frames.push(record);
   }
  }
 }
 function subtract(ids,from,to,other,sourceId,rule){
  const cuts=[...c.areas,...c.outlines].filter(a=>other.includes(a.entry)).flatMap(a=>[a.from,a.to]).filter(y=>from<y&&y<to);
  for(const key of ['areas','outlines'])split(key,ids,cuts);
  revise(ids,from,to,rule,sourceId,(p,y)=>D(p,G.merge(other.map(id=>visibleAt(id,y)))));
 }
 // Khorasan is a regional reconstruction, not the whole eastern half of Iran.
 // The shared frontier is used on both sides of each dated transfer.
 const oldKhorasan=at('late-timurid',1500);
 const khorasan=G.union([[[54.4,36.6],[55.5,35.5],[56.3,34.2],[57.7,32.8],[60,30],[64,33],[65,36.5],[62.3,37.8],[60,38],[56,38]]]);
 revise(['late-timurid'],1454,1507,'khorasan-regional-frontier','sharedKhorasan',p=>G.merge([D(p,oldKhorasan),khorasan]));
 revise(['early-shaybanid'],1507,1510,'khorasan-1507-transfer','sharedKhorasan',p=>G.merge([D(p,oldKhorasan),khorasan]));
 revise(['late-aqqoyunlu'],1468,1503,'western-iran-khorasan-edge','sharedKhorasan',p=>D(p,khorasan));
 revise(['early-safavid'],1503,1510,'khorasan-before-merv','sharedKhorasan',p=>D(p,khorasan));
 subtract(['early-safavid'],1503,1508,['late-aqqoyunlu'],'sharedKhorasan','baghdad-before-1508');
 subtract(['late-timurid'],1500,1507,['early-shaybanid'],'sharedKhorasan','transoxiana-1500-transfer');
 subtract(['early-safavid','1789-afsharid'],1510,1747,['early-shaybanid','early-bukhara'],'sharedKhorasan','transoxiana-khorasan-shared-edge');
 // Borders with a documented nineteenth-century settlement. The reference
 // only supplies a generalised line in a restricted frontier corridor; it
 // never supplies the entire overseas possessions of a historical empire.
 const northAmerica=box(-141,40,-50,55),usa=I(U('United States of America'),northAmerica),canada=I(U('Canada'),northAmerica);
 revise(['1789-usa','1848-oregon','1815-louisiana-purchase'],1846,1919,'us-canada-treaty-edge','sharedNorthernFrontier',p=>D(p,canada));
 revise(['1789-canada','1789-great-britain','1789-acadia'],1846,1919,'canada-us-treaty-edge','sharedNorthernFrontier',p=>D(p,usa));
 // The 1825 coastal strip and islands belong to Russian America, then to the
 // USA from 1867. At this map scale the 1903 line generalises that strip; the
 // competing pre-award inland claims are not separate sovereign fills.
 revise(['1789-canada','1789-great-britain'],1846,1919,'alaska-coastal-strip-and-islands','sharedNorthernFrontier',p=>D(p,U('United States of America')));
 subtract(['1789-usa'],1821,1845,['1848-texas'],'sharedTexas','texas-before-annexation');
 const continental=box(-128,24,-65,50.5),continentalUS=I(U('United States of America'),continental);
 const civilWar=require('./civil-war-states.json');
 for(const key of ['areas','outlines'])split(key,['1789-usa','1914-confederacy'],[1861,1863,1865]);
 revise(['1914-confederacy'],1861,1865,'seceded-states-and-west-virginia','sharedCivilWar',(p,y)=>I(civilWar[y<1863?'before1863':'after1863'],continentalUS));
 revise(['1789-usa'],1854,1946,'post-gadsden-continental-envelope','sharedTexas',(p,y)=>G.merge([D(p,continental),y>=1861&&y<1865?D(continentalUS,visibleAt('1914-confederacy',y)):continentalUS]));
 const alaskaWindow=box(-180,50,-128,72),alaska=I(U('United States of America'),alaskaWindow);
 revise(['1789-usa'],1867,1946,'alaska-after-1867-transfer','sharedNorthernFrontier',p=>G.merge([D(p,alaskaWindow),alaska]));
 const pyrenees=box(-2.2,42,3.5,43.9),france=I(U('France'),pyrenees),spain=I(U('Spain'),pyrenees);
 revise(['1789-spain'],1866,1946,'bayonne-shared-frontier','sharedPyrenees',p=>G.merge([D(p,pyrenees),spain]));
 revise(['late-france','1945-vichy','late-hre'],1866,1946,'bayonne-northern-side','sharedPyrenees',p=>D(p,spain));
 const iberia=box(-10,36,-6,43),portugal=I(U('Portugal'),iberia);
 revise(['late-portugal'],1801,1946,'portuguese-mainland-envelope','sharedPortugal',p=>G.merge([D(p,iberia),portugal]));
 revise(['1789-spain'],1801,1946,'spanish-portuguese-shared-edge','sharedPortugal',p=>D(p,portugal));
 // Norway's mainland border persists through union and wartime occupation.
 // Svalbard and Jan Mayen keep their existing dated source geometry.
 const mainland=box(4,57,32,71.5),norway=I(U('Norway'),mainland);
 revise(['1815-norway'],1826,1946,'norwegian-mainland-envelope','sharedScandinavia',p=>G.merge([D(p,mainland),norway]));
 revise(['early-sweden','1815-finland','1789-russian-empire','1918-soviet-russia','1939-ussr'],1826,1946,'norwegian-shared-edge','sharedScandinavia',p=>D(p,norway));
 // The reviewed modern references below are used only after the relevant
 // treaty period, and only to remove overshoot into a named neighbour.
 revise(['1789-rio-plata'],1895,1946,'argentina-brazil-edge','frontierAmericas',p=>D(p,U('Brazil')));
 revise(['early-portuguese-brazil'],1895,1919,'brazil-southern-edge','frontierAmericas',p=>D(p,U('Argentina','Uruguay')));
 revise(['1815-banda-oriental'],1909,1946,'uruguay-brazil-edge','frontierAmericas',p=>D(p,U('Brazil')));
 revise(['1815-paraguay'],1938,1946,'post-chaco-paraguay-envelope','sharedChaco',()=>U('Paraguay'));
 revise(['1815-upper-peru'],1938,1946,'post-chaco-bolivia-envelope','sharedChaco',()=>U('Bolivia'));
 revise(['1789-rio-plata','early-portuguese-brazil','early-peru','1789-chile'],1938,1946,'post-chaco-neighbour-edges','sharedChaco',p=>D(p,U('Paraguay','Bolivia')));
 const amurWindow=box(119,42,136,58),amurChina=I(U('China'),amurWindow),amurRussia=I(U('Russia'),amurWindow);
 revise(['1789-qing'],1860,1912,'post-peking-amur-edge','sharedAmur',p=>G.merge([D(p,amurWindow),amurChina]));
 revise(['1789-russian-empire'],1860,1919,'post-peking-russian-edge','sharedAmur',p=>G.merge([D(p,amurWindow),amurRussia]));
 // The northern Mongol profile already describes Khalkha after 1636. Remove
 // its inherited southern extent, which otherwise crosses the Qing frontier.
 subtract(['late-mongol'],1636,1691,['1789-jurchen','1789-qing'],'sharedQing','khalkha-after-inner-mongolia-submission');
 // Reconquest is staged in the Qing profile; the losing polity must retreat
 // on those same dates instead of retaining its full pre-campaign footprint.
 subtract(['1914-kashgar'],1876,1878,['1789-qing'],'sharedQing','kashgaria-retreat-during-reconquest');
 subtract(['late-moscow','early-russia'],1454,1552,['early-kazan'],'sharedKazan','kazan-before-1552-conquest');
 subtract(['1918-siberia'],1918,1920,['cartography-tuva'],'sharedCentralAsia','tuva-outside-civil-war-siberian-region');
 subtract(['1918-soviet-russia'],1918,1921,['1918-georgia'],'sharedCentralAsia','georgia-before-soviet-takeover');
 // Western section only. Use the surveyed locations of the 1922 protocol's
 // named wells, before the later straightening. Do not assign the neutral zone
 // farther east to either state through a modern country-envelope shortcut.
 const uqairWindow=box(39.2346,29,43.7,32.3);
 const uqairEnvelope=I(G.merge([at('1939-iraq',1926),at('1789-diriyah',1926)]),uqairWindow);
 const uqairNorth=G.union([[[39.2346,32.3],[43.7,32.3],[43.7,30.09],[43.622,30.1389],[43.6605,30.3705],[43.0638,30.4146],[42.9833,30.7378],[41.4405,31.3711],[40.4308,31.9372],[39.2346,32.1518]]]);
 revise(['1939-iraq'],1926,1946,'uqair-western-common-edge','sharedUqair',p=>G.merge([D(p,uqairWindow),I(uqairEnvelope,uqairNorth)]));
 revise(['1789-diriyah'],1926,1946,'uqair-western-common-edge','sharedUqair',p=>G.merge([D(p,uqairWindow),D(uqairEnvelope,uqairNorth)]));
 // British India and Nepal/Bhutan already have a common envelope in 1.22.
 // Lesotho is similarly a separate protectorate, not a second opaque fill
 // superimposed on the South African Union.
 revise(['1848-basotho'],1919,1946,'basutoland-envelope','to1939Africa',()=>U('Lesotho'));
 revise(['1914-south-africa'],1919,1946,'basutoland-exclusion','to1939Africa',p=>D(p,U('Lesotho')));
 // Correct relationships omitted from the rendering catalogue. These do not
 // alter the stated political independence of pre-Soviet republics.
 const link=(owner,member,from,to,relationship,sourceId)=>relations.push({owner,member,from,to,relationship,source:sourceId});
 link('1789-russian-empire','early-bukhara',1868,1917,'dependency','sharedCentralAsia');
 link('1789-russian-empire','early-khwarazm',1873,1917,'dependency','sharedCentralAsia');
 link('1918-soviet-russia','early-kazakh',1920,1922,'province','sharedCentralAsia');
 link('1918-soviet-russia','1914-tashkent',1918,1922,'province','sharedCentralAsia');
 link('1939-ussr','1914-tashkent',1922,1924,'province','sharedCentralAsia');
 for(const owner of ['1918-soviet-russia','1939-ussr'])for(const member of ['early-bukhara','early-khwarazm'])link(owner,member,owner==='1939-ussr'?1922:1920,owner==='1939-ussr'?1924:1922,'dependency','sharedCentralAsia');
 // Soviet republics are associated with Russia before creation of the USSR,
 // not retrospectively labelled provinces of an already existing USSR.
 for(const [member,from] of [['1918-ukraine',1920],['1789-belarus-russia',1920],['1918-azerbaijan',1920],['1918-armenia',1920],['1918-georgia',1921]])link('1918-soviet-russia',member,from,1922,'association','sharedCentralAsia');
 link('1914-confederacy','1848-texas',1861,1865,'province','sharedCivilWar');
 link('1918-soviet-russia','1789-kokand',1920,1922,'province','sharedCentralAsia');
 link('1939-ussr','1789-kokand',1922,1924,'province','sharedCentralAsia');
 // Political associations and cultural regions do not replace the land colour
 // of their constituent states. Their external contour remains available.
 presentation.push({entry:'late-hre',from:1300,to:1867,overlay:'association'});
 // This frame explicitly represents resistance after the loss of the khan's
 // court, not a second sovereign occupying every Qing-held location.
 presentation.push({entry:'1789-dzungar',from:1755,to:1758,overlay:'resistance'});
 presentation.push({entry:'1918-scs',from:1941,to:1945,overlay:'war-region'});
 // The source narratives already describe colonial-era communities here.
 // Preserve their contours and cards without assigning competing state fills.
 for(const [entry,from] of [['1789-luba',1891],['1789-lunda',1891],['1789-kuba',1900],['1789-rozvi',1890],['1848-ndebele',1894]]){
  split('areas',[entry],[from]);
  for(const a of c.areas.filter(a=>a.entry===entry&&a.from>=from&&a.to<=1946))c.cartography.kinds[a.id]='cultural';
 }
 c.cartography.frontierRelations=relations;c.cartography.presentation=presentation;
 for(const key of ['areas','outlines']){const ids=new Set();for(const a of c[key]){if(!(a.from<a.to)||ids.has(a.id))throw Error('Invalid split frontier '+a.id);ids.add(a.id);}}
 c.sharedFrontiers={version:1,frames:reviewed,relations,presentation};
 return c;
};
