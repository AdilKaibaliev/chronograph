'use strict';
const G=require('./cartography-geometry.cjs'),data=require('./frontiers-141.json'),states=require('./states-141.cjs');
const uk='1789-great-britain',fr='late-france',pt='late-portugal',us='1789-usa',au='1914-australian-colonies';
const ids=['survey141-erbil','survey141-cyprus-buffer',...states.map(s=>s.id)];
const L=s=>s.split('|');
function apply(c,{source,revise,split,visibleAt,link,D,I,box}){
 const H=require('./late-helpers.cjs')(c,{start:610,max:2026});
 source('states141','United Nations. Former Trust and Non-Self-Governing Territories. United Nations Security Council resolutions 683 and 956. Department of the Interior. Compacts of Free Association. Office of the Historian. A Guide to the History of Recognition. Natural Earth. Admin 0 – Countries and Populated Places.',['https://www.un.org/dppa/decolonization/history/former-trust-and-nsgts','https://www.doi.gov/oia/islands','https://history.state.gov/countries','https://www.naturalearthdata.com/downloads/10m-cultural-vectors/']);
 source('europe141','Swiss Confederation. Under French Rule (1798–1815); On the Way to Becoming a Federal State. Office of the Historian. Andorra; Monaco; Liechtenstein; San Marino. Lateran Treaty, 1929, Annex I. geoBoundaries, Vatican City ADM0, 2017, public-domain source.',[
 'https://www.eda.admin.ch/content/dam/PRS-Web/en/dokumente/unter-franzoesischer-herrschaft-1798-1815_EN.pdf','https://history.state.gov/countries/andorra','https://history.state.gov/countries/monaco','https://history.state.gov/countries/liechtenstein','https://history.state.gov/countries/san-marino','https://www.vaticanstate.va/phocadownload/laws-decrees/LateranTreaty.pdf','https://www.geoboundaries.org/api/current/gbOpen/VAT/ADM0/']);
 source('jazira141','Ibn al-Athīr. Al-Kāmil fī al-taʾrīkh. TDV İslâm Ansiklopedisi. Nâsır-Lidînillâh; Tikrît; Erbil; Şümle; Bedreddin Lü’lü’. Resources for the Study of Islamic Architecture. Ayyubids.',['https://islamansiklopedisi.org.tr/nasir-lidinillah','https://islamansiklopedisi.org.tr/tikrit','https://islamansiklopedisi.org.tr/erbil','https://islamansiklopedisi.org.tr/sumle','https://islamansiklopedisi.org.tr/lulu-bedreddin','https://s3.us-east-1.amazonaws.com/media.archnet.org/system/publications/contents/2704/original/DPC0001.PDF']);
 source('greenland141','Permanent Court of International Justice. Legal Status of Eastern Greenland (1933). Prime Minister’s Office of Denmark. Greenland: Home Rule and Self-Government. Natural Earth. Admin 0 – Countries, 1:50m.',['https://legal.un.org/PCIJsummaries/documents/english/PCIJ_FinalText.pdf','https://stm.dk/en/the-prime-ministers-office/the-unity-of-the-realm/greenland/']);
 source('frontiers141','Treaties of Roskilde (1658) and Copenhagen (1660). Treaties of Bayonne (1856, 1862 and 1866). CNIG. Frontière France–Espagne. International Boundary Study No. 127: Congo–Congo. Convention of Bloemfontein (1854). International Boundary Study No. 82: El Salvador–Guatemala. Award on the Guatemala–Honduras Boundary, 23 January 1933. Senegal: Archives nationales d’outre-mer and Université Cheikh Anta Diop.',['https://lex.dk/Tabet_af_Sk%C3%A5ne_i_1658-1660','https://cnig.gouv.fr/espagne-a25931.html','https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs127.pdf','https://www.justice.gov.za/trc/report/finalreport/Volume%203.pdf','https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs082.pdf','https://legal.un.org/riaa/states/guatemala.shtml','https://fastef.ucad.sn/revuefastef/LIEN17/liens17_lsmbow.pdf']);
 source('ports141','Arquivo Nacional do Brasil. Pernambuco. Biblioteca Nacional de Chile. Colonización de Magallanes. Tratado de Límites entre Chile y Argentina (1881). National Museum of Australia. First Fleet. Northern Territory Government. History of Darwin. Natural Earth. Coastline and Admin 0 – Countries.',['https://historialuso.an.gov.br/glossario/index.php/verbetes-glossario/28-verbetes-iniciados-em-p/604-pernambuco','https://www.memoriachilena.gob.cl/602/w3-article-598975.html','https://www.bcn.cl/obtienearchivo?id=recursoslegales%2F10221.3%2F35115%2FTratado_de_limites_1881.pdf','https://www.nma.gov.au/defining-moments/resources/first-fleet']);
 source('armistice141','United Nations. Jerusalem: Principal Holy Sites and Armistice Line (1949). UNFICYP. About the Buffer Zone. Natural Earth. Cyprus No Mans Area.',['https://www.un.org/unispal/document/auto-insert-205535/','https://unficyp.unmissions.org/en/about-buffer-zone']);
 source('unions141','Archivio di Stato di Milano. Regno lombardo-veneto. Palazzo Venezia. Treaties of Campo Formio and Pressburg. State Archives of Belgium. French and Dutch Periods. Royal House of the Netherlands. Kingdom of the Netherlands.',['https://sias-archivi.cultura.gov.it/cgi-bin/pagina.pl?Chiave=36&RicProgetto=as-milano&TipoPag=contesto','https://vive.cultura.gov.it/en/palazzo-venezia/history/austria-france-and-then-austria-again','https://www.arch.be/index.php?l=en&m=about-the-institution&r=history-of-the-institution','https://www.belgium.be/en/about_belgium/country/history/belgium_from_1830']);
 source('artois141','Treaty of the Pyrenees (1659), articles 35–39; Treaties of Nijmegen (1678). Dictionnaire numérique de la Ferme générale. Hainaut. Préfecture des Hauts-de-France. Histoire de la région.',['https://mjp.univ-perp.fr/traites/1659pyrenees.htm','https://fermege.meshs.fr/notice/188','https://www.hauts-de-france.gouv.fr/region-et-institutions/portrait-de-la-region/histoire/lhistoire-de-la-region-hauts-de-france']);
 source('lombardy141','Regione Lombardia. Paesaggi e immagini della Lombardia. Treaties of Zurich (1859), definition of the frontier, articles 1–2. Archivio di Stato di Milano. Regno lombardo-veneto. Natural Earth. Rivers and Lake Centerlines.',['https://www.regione.lombardia.it/content/dam/rl/canali-tematici-servizi/06-ambiente-e-territorio/16-paesaggio/piano-paesaggistico-regionale-ppr/allegati/3PTR_PPR_Paesaggi_Immagini.pdf','https://archive.spectator.co.uk/article/3rd-december-1859/3/the-treaties-of-zurich','https://sias-archivi.cultura.gov.it/cgi-bin/pagina.pl?Chiave=36&RicProgetto=as-milano&TipoPag=contesto']);
 for(const id of ['ports141','greenland141','frontiers141']){
  c.sources[id].title+=' Paul Wessel and Walter H. F. Smith. A Global, Self-consistent, Hierarchical, High-resolution Shoreline Database. GSHHG 2.3.7.';
  c.sources[id].urls.push('https://doi.org/10.1029/96JB00104');
 }
 const cart=c.cartography;
 const fine=require('./gshhg/harbours-141.json').coast;
 function localCoast(p,name){
  const shore=fine.find(s=>s.name===name);
  return G.merge([D(p,box(...shore.box)),shore.land]);
 }
 function register(id,region,coord,name,periods,color,src,profileKind='state'){
  H.entry(id,region,profileKind,coord,name,periods.map(p=>H.phase(p.from,p.to,p.title||name,p.text,[src],{name:p.name||name,approx:false,frontierAdded:true})));
  for(const p of periods){const a=H.area(id,p.from,p.to,p.shape,{kind:p.kind||'polity',name:p.name||name,title:p.title||name,color,sources:[src]});Object.assign(a,{frontierAdded:true,label:coord,approx:false});if(p.status)a.statusLabel=p.status;cart.areas[a.id]=cart.shapes.length;cart.shapes.push(p.shape);}
 }
 // Search only intersecting political records. Preserve historical context,
 // dependencies of the owner and cultural outlines. Changes are recorded on
 // both the selectable area and its dated external outline.
 const bounds=new WeakMap();
 function bbox(p){if(bounds.has(p))return bounds.get(p);const b=[180,90,-180,-90];for(const r of p)for(const [x,y] of r){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);}bounds.set(p,b);return b;}
 function clearNeighbours(keep,p,from,to,src){
  const b=bbox(p),affected=new Set(),tested=new Map();
  for(const key of ['areas','outlines'])for(const a of c[key]){
   if(a.entry===keep||a.from>=to||a.to<=from||affected.has(a.entry)||key==='areas'&&!['polity','influence'].includes(cart.kinds?.[a.id]||a.kind))continue;
   const old=key==='areas'?cart.shapes[cart.areas[a.id]]||a.polygons:a.polygons;
   if(!old.length)continue;const z=bbox(old);if(z[0]>=b[2]||z[2]<=b[0]||z[1]>=b[3]||z[3]<=b[1])continue;
   if(!tested.has(old))tested.set(old,I(old,p).length>0);
   if(tested.get(old))affected.add(a.entry);
  }
  if(affected.size)revise([...affected],from,to,'exterior-of-'+keep,src,s=>D(s,p));
 }
 const associated={ATG:1967,DMA:1967,GRD:1967,KNA:1967,VCT:1969};
 for(const state of states){
  const {id,code,name,text,coord,region,from}=state,shape=data.areas[code],sourceId=['AND','LIE','CHE','SMR','MCO','VAT'].includes(code)?'europe141':'states141',periods=[];
  const protectedState=['BHR','BRN','MDV'].includes(code);
  const start=associated[code]|| (protectedState?1946:from);
  if(start<from){
   const status=protectedState?L('Договорная связь с Великобританией|Treaty relationship with Britain|Британия менен келишимдик байланыш'):L('Ассоциированное государство|Associated state|Ассоциацияланган мамлекет');
   const detail=protectedState?L('Местный правитель сохранял внутреннее управление. Внешние отношения регулировались договорами с Великобританией.|The local ruler retained internal government. Treaties with Britain governed external relations.|Ички башкаруу жергиликтүү өкүмдардын колунда болгон. Тышкы мамилелер Британия менен түзүлгөн келишимдер аркылуу жөнгө салынган.'):L('Местное правительство ведало внутренними делами, а Великобритания отвечала за оборону и внешние отношения.|The local government managed internal affairs. Britain retained responsibility for defence and foreign relations.|Жергиликтүү өкмөт ички иштерди башкарган. Коргонуу жана тышкы мамилелер Британиянын карамагында калган.');
   periods.push({from:start,to:from,text:detail,title:status,status,shape});
   link(uk,id,start,from,protectedState?'dependency':'association',sourceId);
  }
  periods.push({from,to:2011,text,shape});
  clearNeighbours(id,shape,start,2011,sourceId);
  register(id,region,coord,name,periods,({africa:'#97a47c',north:'#ab9874',oceania:'#79a29a',eurasia:'#b3a781'})[region],sourceId);
 }
 // Record colonial ownership only where the administering power is known.
 // Trusteeships and protected states are not ordinary British possessions.
 function add(id,from,to,p,why,src){revise([id],from,to,why,src,s=>G.merge([s,p]));}
 for(const [code,owner,start,end] of [['BMU',uk,1946,2011],['CPV',pt,1946,1975],['STP',pt,1946,1975],['COM',fr,1946,1975],['MLT',uk,1814,1964],['ATG',uk,1946,1967],['DMA',uk,1946,1967],['GRD',uk,1946,1967],['KNA',uk,1946,1967],['VCT',uk,1946,1969],['BHS',uk,1946,1973],['MUS',uk,1946,1968],['SYC',uk,1946,1976],['TUV',uk,1946,1978]]){
  add(owner,start,end,data.areas[code],'administered-islands-'+code,'states141');
 }
 for(const [id,code,from] of [['palau','PLW',1994],['nanmadol','FSM',1986]]){
  clearNeighbours(id,data.areas[code],from,2011,'states141');
  revise([id],from,2011,'pacific-free-association-'+code,'states141',()=>data.areas[code]);
  if(code==='FSM'){
   const name=L('Федеративные Штаты Микронезии|Federated States of Micronesia|Микронезия Федеративдик Штаттары');
   const e=c.entries.find(x=>x.id===id);
   for(const p of e.phases.filter(p=>p.from>=from)){p.name=name;p.title=name;p.text=L('Яп, Чуук, Понпеи и Косраэ образуют четыре штата федерации. В 1986 году вступил в силу договор о свободной ассоциации с США.|Yap, Chuuk, Pohnpei and Kosrae are the four states of the federation. The Compact of Free Association with the US entered into force in 1986.|Яп, Чуук, Понпеи жана Косраэ федерациянын төрт штатын түзөт. АКШ менен эркин ассоциация жөнүндө келишим 1986-жылы күчүнө кирген.');}
   for(const a of c.areas.filter(a=>a.entry===id&&a.from>=from)){a.name=name;a.title=name;cart.kinds[a.id]='polity';}
  }
 }
 const gr='1789-greenland-posts',dk='early-denmark-norway';
 // The sovereignty ruling concerns the island. Settlement and Inuit
 // cultural layers retain their own extents and dates.
 const greenland=localCoast(data.areas.GRL,'Nuuk');
 add(dk,1933,2011,greenland,'danish-realm-greenland','greenland141');
 revise([gr],1933,2011,'greenland-political-territory','greenland141',()=>greenland);
 for(const a of c.areas.filter(a=>a.entry===gr&&a.from>=1933)){cart.kinds[a.id]='polity';a.detachedProvince=true;}
 link(dk,gr,1933,2027,'province','greenland141');
 // Avoid tracing national power into the island's interior before the ruling.
 const iraq=require('./iraq-jazira.cjs');
register('survey141-erbil','eurasia',[44.01,36.19],L('Эрбиль|Erbil|Эрбил'),[{from:1190,to:1232,shape:iraq.erbil,name:L('Эмират Эрбиля|Emirate of Erbil|Эрбил эмирлиги'),title:L('Эмират Эрбиля|Emirate of Erbil|Эрбил эмирлиги'),text:L('Музаффар ад-Дин Гёкбёри правил из Эрбиля. Его владения охватывали Киркук и часть Шахразура. После его смерти в 1232 году Эрбиль перешёл к багдадскому халифу аль-Мустансиру.|Muzaffar al-Din Gökböri ruled from Erbil. His domain included Kirkuk and part of Shahrazur. At his death in 1232 Erbil passed to the Abbasid caliph al-Mustansir.|Музаффар ад-Дин Гөкбөрү Эрбилден башкарган. Анын ээлигине Киркук жана Шахразурдун бир бөлүгү кирген. Ал 1232-жылы каза болгондо Эрбил Багдад халифи аль-Мустансирге өткөн.')},{from:1232,to:1258,kind:'settlement',shape:G.union([[[43.99,36.18],[44.03,36.17],[44.04,36.20],[44.01,36.22]]]),text:L('После смерти Гёкбёри город перешёл к Аббасидам. В 1236 году монголы осадили цитадель и отступили.|After Gökböri’s death the city passed to the Abbasids. In 1236 the Mongols besieged the citadel and withdrew.|Гөкбөрү каза болгондо шаар Аббасилерге өттү. 1236-жылы монголдор цитаделди курчап, кийин чегиништи.')}],'#b29a70','jazira141','region');
 const buffer='survey141-cyprus-buffer',bn=L('Буферная зона ООН на Кипре|UN buffer zone in Cyprus|Кипрдеги БУУнун буфердик зонасы');
 const bufferText=L('После прекращения огня в 1974 году силы ООН наблюдают за зоной между линиями прекращения огня. Она проходит через Никосию.|Since the 1974 ceasefire, UN peacekeepers have monitored the zone between the ceasefire lines. It passes through Nicosia.|1974-жылы ок атышуу токтогондон бери БУУнун тынчтык күчтөрү эки тилкенин ортосундагы зонага көз салып келет. Ал Никосия аркылуу өтөт.');
 clearNeighbours(buffer,data.areas.CNM,1974,2011,'armistice141');
 register(buffer,'eurasia',[33.366635,35.166677],bn,[{from:1974,to:2011,shape:data.areas.CNM,text:bufferText,kind:'influence',status:bn}],'#b6af99','armistice141','region');
 const jerusalem=G.union([[[35.10,31.785],[35.13,31.763],[35.17,31.751],[35.197,31.752],[35.214,31.768],[35.219,31.779],[35.213,31.790],[35.186,31.800],[35.15,31.797]]]);
 clearNeighbours('1960-israel',jerusalem,1949,2011,'armistice141');add('1960-israel',1949,2011,jerusalem,'west-jerusalem-armistice','armistice141');
 function bankPair(a,b,from,to,left,right,why){
  revise([a],from,to,why,'frontiers141',s=>G.merge([D(s,right),left]));
  revise([b],from,to,why,'frontiers141',s=>G.merge([D(s,left),right]));
 }
 const sw='early-sweden',ores={...data.locals.oresund,DNK:localCoast(data.locals.oresund.DNK,'Copenhagen')};
 add(dk,1523,1658,G.merge([ores.DNK,ores.SWE]),'zealand-and-western-scania','frontiers141');
 revise([sw],1523,1658,'oresund-before-roskilde','frontiers141',s=>D(s,G.merge([ores.DNK,ores.SWE])));
 bankPair(dk,sw,1658,2011,ores.DNK,ores.SWE,'oresund-after-roskilde');
 const py=data.locals.pyrenees;
 for(const [from,to,w,e] of [[1856,1862,-1.84,-.73],[1862,1866,-1.84,1.78],[1866,2011,-1.84,3.25]]){
  const reach=box(w,42.25,e,43.45);
  bankPair(fr,'1789-spain',from,to,D(I(py.FRA,reach),data.areas.AND),D(I(py.ESP,reach),data.areas.AND),'bayonne-demarcation');
 }
 const pool=data.locals.pool,congo='1914-congo',brazz='1960-congo-brazzaville';
 for(const [owner,from,to] of [[fr,1885,1919],['1939-french-equatorial',1919,1946],[brazz,1946,2011]]){
  bankPair(owner,congo,from,to,pool.COG,pool.COD,'pool-malebo');
 }
 revise([fr],1919,1960,'french-administered-congo-bank','frontiers141',s=>G.merge([D(s,pool.COD),pool.COG]));
 // Regional protectorates and colonial administration in Senegal were not
 // two additional independent state fills on top of neighbouring districts.
 function govern(owner,member,from,to,relation,src){
  const cuts=[...new Set([from,to,...c.areas.filter(a=>a.entry===member&&a.from<to&&from<a.to).flatMap(a=>[a.from,a.to]).filter(y=>from<y&&y<to)])].sort((a,b)=>a-b);
  if(relation==='province')for(let i=0;i<cuts.length-1;i++){
   const p=visibleAt(member,cuts[i]);if(p.length)add(owner,cuts[i],cuts[i+1],p,'including-'+member,src);
  }
  link(owner,member,from,to,relation,src);
 }
 for(const [member,start,relation] of [['1789-cayor',1886,'province'],['1789-jolof',1890,'dependency'],['1789-futa-toro',1898,'province']])govern(fr,member,start,1919,relation,'frontiers141');
 // The overlapping sketch runs from the country south of Arras through
 // Vermandois towards Rethel, within France after the seventeenth-century treaties.
 const artois=I(visibleAt('early-netherlands',1745),visibleAt(fr,1745));
 for(const [from,to] of [[1679,1795],[1815,1914],[1919,1939]]){
  revise(['early-netherlands'],from,to,'french-artois-and-vermandois','artois141',s=>D(s,artois));
  add(fr,from,to,artois,'french-artois-and-vermandois','artois141');
 }
 // The surveyed nineteenth-century overlap is in the Ticino basin.
 // Split only ground already present in both states' reconstructions.
 const it='1914-italy',aus='early-austria',mil='early-milan',ven='early-venice';
 const tr=data.ticino,west=G.union([[...tr,[tr.at(-1)[0],44.70],[8.10,44.70],[8.10,46.30],[tr[0][0],46.30]]]);
 const crossing=I(visibleAt(it,1855),G.merge([visibleAt(mil,1855),visibleAt(aus,1855)]));
 const piedmont=I(crossing,west),lombardy=D(crossing,west);
 revise([aus,mil],1849,1859,'ticino-piedmont-bank','lombardy141',s=>D(s,piedmont));
 revise([it],1849,1859,'ticino-lombardy-bank','lombardy141',s=>D(s,lombardy));
 // After Zurich, the overlap west of the Mantuan defensive frontier and
 // south of the Po belongs to the Italian side. Preserve the Austrian forts.
 const po=data.po,southPo=G.union([[...po,[po.at(-1)[0],44.60],[po[0][0],44.60]]]);
 for(const [from,to] of [[1859,1860],[1860,1861],[1861,1866]]){
  const overlap=I(visibleAt(it,from),G.merge([visibleAt(ven,from),visibleAt(aus,from)]));
  const confirmed=I(overlap,G.merge([box(9.8,44.6,10.59,45.65),southPo]));
  revise([aus,ven],from,to,'west-of-mantua-and-south-of-po','lombardy141',s=>D(s,confirmed));
 }
 for(const [owner,member,from,to] of [
  ['early-austria','early-netherlands',1714,1789],['early-austria','early-netherlands',1791,1792],
  [fr,'early-netherlands',1795,1814],['early-dutch','early-netherlands',1815,1830],
  ['early-austria','early-milan',1714,1796],['early-austria','early-venice',1797,1805],
  ['early-milan','early-venice',1805,1814],['early-austria','early-milan',1814,1848],
  ['early-austria','early-milan',1849,1859],['early-austria','early-venice',1814,1848],
  ['early-austria','early-venice',1849,1866]
 ])govern(owner,member,from,to,'province','unions141');
 const paz=data.locals.paz,mot=data.locals.motagua,gua='1848-central-america',hon='1848-honduras',sal='1848-el-salvador';
 // A Guatemalan treaty does not settle the adjacent Salvadoran–Honduran
 // sector at Montecristo. Stop each revision at the third country's
 // existing dated outline, including when that outline changes mid-frame.
 function guatemalanFrontier(neighbour,third,from,left,right,why){
  const years=[...new Set([from,2011,...[...c.areas,...c.outlines].filter(a=>a.entry===third).flatMap(a=>[a.from,a.to]).filter(y=>from<y&&y<2011)])].sort((a,b)=>a-b);
  for(let i=0;i<years.length-1;i++){
   const thirdArea=visibleAt(third,years[i]);
   bankPair(gua,neighbour,years[i],years[i+1],D(left,thirdArea),D(right,thirdArea),why);
  }
 }
 guatemalanFrontier(hon,sal,1933,mot.GTM,mot.HND,'guatemala-honduras-award');
 guatemalanFrontier(sal,hon,1938,paz.GTM,paz.SLV,'guatemala-salvador-demarcation');
 // Use the contiguous central Vaal reach, upstream of the disputed diamond
 // fields. The opposite bank is defined once for both republics.
 const river=data.vaal.filter(r=>r[0][0]>=26&&r.at(-1)[0]<=28.53).sort((a,b)=>b[0][0]-a[0][0]).flat().filter(([x])=>x>=26.15&&x<=28.52);
 if(river.length<70)throw Error('Incomplete central Vaal');
 const north=G.union([[...river,[river.at(-1)[0],-26.3],[river[0][0],-26.3]]]),south=G.union([[...river,[river.at(-1)[0],-28.15],[river[0][0],-28.15]]]);
 bankPair('1914-transvaal','1914-orange',1854,1902,north,south,'vaal-republican-frontier');
 govern(uk,'1914-transvaal',1877,1881,'province','frontiers141');
 const ports={...data.locals,darwin:{AUS:localCoast(data.locals.darwin.AUS,'darwin')},magellan:{CHL:localCoast(data.locals.magellan.CHL,'magellan')}},br='early-portuguese-brazil',dutch='1789-dutch-brazil',ch='1789-chile';
 for(const [id,from,to,p,why] of [[br,1537,1630,ports.recife.BRA,'recife'],[dutch,1630,1654,ports.recife.BRA,'dutch-recife'],[br,1654,2011,ports.recife.BRA,'recife'],[ch,1848,2011,ports.magellan.CHL,'punta-arenas'],['1789-sydney',1788,1849,ports.sydney.AUS,'port-jackson'],['1815-hobart',1804,1849,ports.hobart.AUS,'hobart'],[au,1849,2011,ports.sydney.AUS,'sydney'],[au,1849,2011,ports.hobart.AUS,'hobart'],[au,1869,2011,ports.darwin.AUS,'darwin']])add(id,from,to,p,why,'ports141');
 revise([br],1630,1654,'recife-under-the-west-india-company','ports141',s=>D(s,ports.recife.BRA));
 source('datedBorders141','Guy Schvitz, Seraina Rüegger, Luc Girardin, Lars-Erik Cederman, Nils Weidmann and Kristian Skrede Gleditsch. Mapping the International System, 1886–2017: The CShapes 2.0 Dataset. Lars-Erik Cederman, Luc Girardin, Carl Müller-Crepon and Yannick Pengl. Nationalism and the Transformation of the State. Natural Earth. Admin 0 – Countries.',[
 'https://icr.ethz.ch/data/cshapes/','https://icr.ethz.ch/data/cshapes/CShapes-2.0_Codebook.pdf']);
 const reviewed=require('./frontiers-141-reviewed.json');
 for(const id of new Set(reviewed.rules.map(r=>r.loser))){
  const rows=reviewed.rules.filter(r=>r.loser===id),years=[...new Set(rows.flatMap(r=>[r.from,r.to]))].sort((a,b)=>a-b);
  for(let i=0;i<years.length-1;i++){
   const y=years[i],end=years[i+1],active=rows.filter(r=>r.from<=y&&y<r.to);
   if(!active.length)continue;
   const cut=G.merge(active.map(r=>I(reviewed.shapes[r.shape],visibleAt(r.winner,y))));
   if(cut.length)revise([id],y,end,'independently-attributed-crossing','datedBorders141',s=>I(s,cut).length?D(s,cut):s);
  }
 }
 function lesson(id,year,entry,coord,title,detail,src,question,places,frames,scale){
  H.event(id,year,entry,'politics',coord,L(title),L(detail),[src],{frontierAdded:true});
  c.mapComparisons={...c.mapComparisons,[id]:{question:L(question),places:places.map(([pt,n])=>[pt,L(n)]),frames:frames.map(([y,t])=>[y,L(t)]),scale}};
 }
 lesson('survey141-erbil-transfer',1232,'survey141-erbil',[44.01,36.19],
  'Эрбиль переходит под власть Багдада|Erbil passes to Baghdad|Эрбил Багдаддын бийлигине өттү',
  'После смерти Музаффар ад-Дина Гёкбёри Эрбиль по его завещанию перешёл к халифу аль-Мустансиру.|On the death of Muzaffar al-Din Gökböri, his will transferred Erbil to the caliph al-Mustansir.|Музаффар ад-Дин Гөкбөрү каза болгондо, анын керээзи боюнча Эрбил халиф аль-Мустансирге өттү.','jazira141',
  'Кто управлял Эрбилем до и после 1232 года?|Who ruled Erbil before and after 1232?|Эрбилди 1232-жылга чейин жана андан кийин ким башкарган?',
  [[[44.01,36.19],'Эрбиль|Erbil|Эрбил'],[[43.68,34.60],'Тикрит|Tikrit|Тикрит'],[[44.36,33.31],'Багдад|Baghdad|Багдад']],
  [[1190,'Гёкбёри правит в Эрбиле. Тикрит перешёл к багдадскому халифу.|Gökböri rules Erbil. Tikrit has passed to the caliph at Baghdad.|Гөкбөрү Эрбилди башкарат. Тикрит Багдад халифине өттү.'],[1232,'Эрбиль переходит к багдадскому халифу аль-Мустансиру.|Erbil passes to the Abbasid caliph al-Mustansir.|Эрбил Багдад халифи аль-Мустансирге өттү.'],[1236,'Монголы заняли нижний город. Цитадель выдержала осаду, и войско отступило.|The Mongols occupied the lower town. The citadel held and the army withdrew.|Монголдор төмөнкү шаарды ээлешти. Цитадель курчоого туруштук берип, аскер чегинди.']],16);
 lesson('survey141-brazzaville',1960,brazz,[15.28,-4.25],
  'Независимость Республики Конго|Independence of the Republic of the Congo|Конго Республикасынын эгемендиги',
  '30 июня получил независимость бывший Бельгийский Конго. 15 августа независимой стала Республика Конго со столицей в Браззавиле, на противоположном берегу реки.|The former Belgian Congo became independent on 30 June. On 15 August the Republic of the Congo became independent, with Brazzaville as its capital across the river.|Мурдагы Бельгиялык Конго 30-июнда эгемендик алды. 15-августта дарыянын каршы жээгиндеги Браззавиль борбор болгон Конго Республикасы эгемен болду.','frontiers141',
  'Почему столицы двух государств стоят на противоположных берегах Конго?|Why do two national capitals face each other across the Congo?|Эки өлкөнүн борборлору эмне үчүн Конго дарыясынын эки жээгинде жайгашкан?',
  [[[15.28,-4.25],'Браззавиль|Brazzaville|Браззавиль'],[[15.31,-4.32],'Леопольдвиль / Киншаса|Léopoldville / Kinshasa|Леопольдвиль / Киншаса']],
  [[1959,'Браззавиль находится на французской стороне, Леопольдвиль — на бельгийской.|Brazzaville is on the French side and Léopoldville on the Belgian side.|Браззавиль француз тарабында, Леопольдвиль бельгиялык тарапта.'],[1960,'Оба города стали столицами независимых республик.|Both cities have become capitals of independent republics.|Эки шаар тең эгемен республикалардын борборлору болду.']],24);
 // Return precisely the edited continuing profiles. This preserves the
 // visible 2010 frontier through the catalogue transition in 2011.
 c.survey141Modern=[...new Set(c.frontierReview.frames.filter(f=>f.from<=2010&&2010<f.to&&['states141','europe141','frontiers141','greenland141','armistice141','ports141'].includes(f.source)).map(f=>f.entry).concat(ids))];
}
module.exports=apply;module.exports.ids=ids;

