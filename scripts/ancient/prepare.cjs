'use strict';
const calendar=require('./calendar.js');
module.exports=function prepareAncient(world,kyrgyz){
 const c=structuredClone(require('./catalog.cjs'));
 const deep=structuredClone(require('./prehistory.cjs'));Object.assign(c.sources,deep.sources);c.records.push(...deep.records);c.trails=deep.trails;
 c.scriptural=structuredClone(require('./scriptural.cjs'));
 const peoples=structuredClone(require('./peoples-movements.cjs'));Object.assign(c.sources,peoples.sources);c.records.push(...peoples.records);c.movements=peoples.movements;c.peoplesTrail=peoples.records.map(r=>r.id);
 for(const [id,source,from,to,coord,title,text]of [
  ['marib-monuments','saba',-1000,631,[45.325,15.425],['Мариб · памятники Сабейского царства','Marib · monuments of the kingdom of Saba','Мариб · Саба падышалыгынын эстеликтери'],['Города, храмы и ирригационные сооружения района Мариба отражают развитие древней Южной Аравии. Этот интервал датирует комплекс памятников, а не непрерывное правление одной династии.','Cities, temples and irrigation works around Marib document ancient South Arabian development. This interval dates the monument complex, not the continuous rule of one dynasty.','Марибдин шаарлары, храмдары жана сугат курулуштары байыркы Түштүк Аравиянын өнүгүшүн көрсөтөт. Бул аралык бир династиянын үзгүлтүксүз бийлигин эмес, эстеликтер комплексин даталайт.']],
  ['hegra-nabataean','hegra',-100,101,[37.954,26.783],['Хегра · набатейские памятники','Hegra · Nabataean monuments','Хегра · набатей эстеликтери'],['Монументальные гробницы относятся к I веку до н. э. — I веку н. э. Сохранились также более ранние надписи. Дата этих сооружений не является датой жизни пророка Салиха.','Monumental tombs date to the first century BCE–first century CE. Earlier inscriptions also survive. These structures do not date the life of the prophet Salih.','Ири мүрзөлөр б. з. ч. I — б. з. I кылымдарына таандык. Мурдагы жазуулар да сакталган. Бул курулуштар Салих пайгамбардын өмүрүн даталабайт.']]
 ]){c.sources['text-place-'+source]=c.scriptural.sources[source];c.records.push({id,from,to,coord,title,text,region:'eurasia',kind:'site',approx:true,sources:['text-place-'+source]});}
 const early=structuredClone(require('./neolithic.cjs'));Object.assign(c.sources,early.sources);c.records.push(...early.records);
 const ancient=structuredClone(require('./antiquity.cjs'));Object.assign(c.sources,ancient.sources);c.records.push(...ancient.records);
 c.records.push(...structuredClone(require('./east-asia.cjs').records));
 const china=structuredClone(require('./china-steppe.cjs'));Object.assign(c.sources,china.sources);c.records.push(...china.records);c.movements.push(...china.movements);
 // Resolve chronology/location conflicts before records reach the renderer.
 c.sources['shang-zhou-chronology']={title:'The Metropolitan Museum of Art. China, 2000–1000 B.C. Heilbrunn Timeline of Art History.',urls:['https://www.metmuseum.org/de/toah/ht/03/eac.html']};
 c.sources['western-jin-chronology']={title:'Damien Chaussende. Western Jin. The Cambridge History of China, volume 2, 2019, pp. 79–95.',urls:['https://www.cambridge.org/core/books/abs/cambridge-history-of-china/western-jin/C26640110C74E0B6FA215625AFBBA6B7']};
 const shang=c.records.find(r=>r.id==='shang');shang.to=-1046;shang.coord=[113.65,34.75];shang.sources=['shang-zhou-chronology'];
 const zhou=c.records.find(r=>r.id==='western-zhou');zhou.from=-1046;zhou.to=-770;zhou.sources=['shang-zhou-chronology','zhou-states'];
 c.records.find(r=>r.id==='spring-autumn').to=-475;c.records.find(r=>r.id==='warring-states').from=-475;
 for(const id of ['spring-autumn','warring-states'])c.records.find(r=>r.id===id).sources=['zhou-states'];
 c.chinaTrail=[...require('./east-asia.cjs').records.map(r=>r.id),'yangshao','qin-unification','western-han','eastern-han','sui-unification',...china.records.map(r=>r.id)];
 const centres=structuredClone(require('./china-centres.cjs'));Object.assign(c.sources,centres.sources);c.records.push(...centres.records);c.chinaTrail.push(...centres.records.map(r=>r.id));
 c.chinaReference={svg:require('node:fs').readFileSync(require('node:path').join(__dirname,'china-reference-250.svg'),'utf8'),title:['Семь царств · около 250 года до н. э.','Seven states · about 250 BCE','Жети падышалык · б. з. ч. болжол менен 250-жыл'],source:'Ian Remsen. Warring States c. 250 BC (2025), CC0. Based on The Cambridge History of China, vol. 1 (1986), p. 39.',legend:[['#f5ab3a',['Цинь','Qin','Цинь']],['#e85bbf',['Чжао','Zhao','Чжао']],['#83608e',['Янь','Yan','Янь']],['#c35356',['Вэй','Wei','Вэй']],['#44c27d',['Ци','Qi','Ци']],['#dfe0df',['Хань','Han','Хань']],['#00adbc',['Чу','Chu','Чу']]]};
 const jin=c.records.find(r=>r.id==='western-jin-unification');jin.sources.push('western-jin-chronology');
 // A city reference does not imply that this city was a capital for the entire interval.
 c.records.find(r=>r.id==='rome-late').coord=[12.49,41.89];
 const kuk=c.records.find(r=>r.id==='kuk-drainage');kuk.to=2027;kuk.dateLabel=['Примерно с 2050 года до н. э. · длительная традиция','From about 2050 BCE · a long tradition','Б. з. ч. болжол менен 2050-жылдан · узак салт'];
 const chad=c.records.find(r=>r.id==='mega-chad-low');chad.to=1000;chad.dateLabel=['После примерно 3050 года до н. э. · меняющиеся водоёмы','After about 3050 BCE · changing water bodies','Б. з. ч. болжол менен 3050-жылдан кийин · өзгөргөн суу алаптары'];
 c.records.find(r=>r.id==='ghaggar-valley').dateLabel=['Долина в эпоху ранних поселений и городов Инда','Valley during early settlement and the Indus urban period','Алгачкы конуштар жана Инд шаарлары доорундагы өрөөн'];
 c.records.find(r=>r.id==='nile-ahramat').dateLabel=['Эпоха пирамид · примерно 2700–1700 годы до н. э.','Pyramid-building period · about 2700–1700 BCE','Пирамидалар доору · б. з. ч. болжол менен 2700–1700-жылдар'];
 const aksum=c.records.find(r=>r.id==='aksum-centre');aksum.from=1;aksum.to=1301;aksum.kind='site';aksum.dateLabel=['Памятники I–XIII веков н. э.','Monuments of the 1st–13th centuries CE','Б. з. I–XIII кылымдарындагы эстеликтер'];
 const yangshao=c.records.find(r=>r.id==='yangshao');yangshao.from=-4800;
 const budjPeriod=c.records.find(r=>r.id==='budj-bim-early');budjPeriod.dateLabel=['Длительная история · около шести тысячелетий','Long history · about six millennia','Узак тарых · болжол менен алты миң жылдык'];
 c.sources['indus-chronology']={title:'The Metropolitan Museum of Art. South Asia, 8000–2000 B.C. Heilbrunn Timeline of Art History.',urls:['https://www.metmuseum.org/fr/toah/ht/02/ssa']};
 c.records.find(r=>r.id==='moenjodaro').sources.push('indus-chronology');
 c.sources['sui-chronology']={title:'The Metropolitan Museum of Art. China, 500–1000 A.D. Heilbrunn Timeline of Art History.',urls:['https://www.metmuseum.org/zh/toah/ht/06/eac.html']};
 c.records.find(r=>r.id==='sui-unification').sources.push('sui-chronology');
 const sites={'egypt-unification':[31.22,29.85],yangshao:[109.05,34.27],'qin-unification':[108.72,34.35],'western-han':[108.9,34.3],'eastern-han':[112.45,34.62],'sui-unification':[108.9,34.3],'sasanian-foundation':[52.53,28.85],'babylon-cyrus':[44.42,32.54]};
 for(const [id,coord]of Object.entries(sites)){const r=c.records.find(r=>r.id===id);if(r){r.coord=coord;r.coordinatePrecision='regional-centre';}}
 c.sources.poverty={title:'National Park Service. Monumental Earthworks of Poverty Point: World Heritage Site.',urls:['https://www.nps.gov/articles/000/monumental-earthworks-of-poverty-point-world-heritage-site.htm']};
 c.sources.saqqaq={title:'National Museum of Denmark. Saqqaq culture chronology; Geographical areas of the Saqqaq culture.',urls:['https://natmus.dk/organisation/forskning-og-kulturarv/nyere-tid-og-verdens-kulturer/etnografisk-samling/arktisk-forskning/prehistory-of-greenland/saqqaq/']};
 c.records.push({id:'poverty-point',from:-1700,to:-1100,approx:true,region:'north',kind:'site',coord:[-91.41,32.64],sources:['poverty'],
  title:['Поверти-Пойнт · земляные сооружения','Poverty Point · earthworks','Поверти-Пойнт · топурактан курулган эстеликтер'],
  text:['В нижней долине Миссисипи общество охотников, рыболовов и собирателей создаёт крупный комплекс земляных сооружений для проживания и церемоний.','In the Lower Mississippi Valley, hunter-fisher-gatherers build a large earthwork complex for residential and ceremonial use.','Миссисипинин төмөнкү өрөөнүндө мергенчилер, балыкчылар жана жыйноочулар жашоо жана жөрөлгөлөр үчүн топурактан чоң комплексти курушкан.']});
 c.records.push({id:'saqqaq',from:-2500,to:-800,approx:true,region:'arctic',kind:'culture',coord:null,sources:['saqqaq'],
  title:['Саккак · древние общества Гренландии','Saqqaq · early Greenland societies','Саккак · Гренландиянын байыркы коомдору'],
  text:['Памятники культуры саккак известны в западной и юго-восточной Гренландии. Жилища и орудия позволяют изучать сезонную жизнь и использование прибрежных ресурсов. Переход к следующим культурам различается по регионам.','Saqqaq sites occur in western and southeastern Greenland. Dwellings and tools reveal seasonal life and coastal resource use. Transitions to later cultures differ by region.','Саккак маданиятынын эстеликтери Гренландиянын батышында жана түштүк-чыгышында белгилүү. Турак жайлар менен куралдар мезгилдик турмушту жана жээктеги ресурстарды пайдаланууну көрсөтөт. Кийинки маданияттарга өтүү аймактарда ар башка болгон.']});
 c.sources={...c.sources,...Object.fromEntries(Object.entries(kyrgyz.sources).map(([id,s])=>['ky-'+id,{title:s.bibliography,urls:[s.url].filter(Boolean)}]))};
 c.records.push(...kyrgyz.cards.map(card=>{
  const d=card.date,from=d.era==='BCE'?-d.year:(d.from||d.year),last=d.to||from;
  return {id:'ky-'+card.id,from,to:calendar.add(last,1),approx:d.precision!=='exact',dateLabel:card.dateLabel,title:card.title,text:card.text,
   region:'eurasia',kind:'witness',kyrgyz:true,coord:null,sources:card.sources.map(id=>'ky-'+id),geographyReview:card.geography,
   passages:card.sources.filter(id=>kyrgyz.sources[id].type==='primary-text').map(id=>({source:'ky-'+id,text:kyrgyz.sources[id].passage,...(kyrgyz.sources[id].geographicPassage?{geography:kyrgyz.sources[id].geographicPassage}:{})})).filter(p=>p.text)};
 }));
 // Retain existing phase dates and descriptions, including periods that cross 610.
 // Existing 610 territory outlines are never backdated to the phase's start.
 for(const e of world.entries)for(const p of e.phases.filter(p=>p.from<610)){
  const sourceIds=p.sources.map(id=>'existing-'+id);
  for(const id of p.sources)c.sources['existing-'+id]=world.sources[id];
  c.records.push({id:'existing-'+e.id+'-'+p.from,from:p.from,to:p.to,approx:true,region:e.region,kind:e.kind,coord:p.coord||e.coord,
   title:e.name,text:p.text,dateLabel:p.period,sources:sourceIds,continuity:{entry:e.id,phaseFrom:p.from,phaseTo:p.to}});
 }
 // Published coordinates identify a site, not a political territory.
 c.sources['uruk-location']={title:'Cuneiform Digital Library Initiative. Provenience: Uruk (Warka).',urls:['https://cdli.earth/proveniences/105']};
 for(const [id,coord,source] of [
  ['uruk-urbanisation',[45.6395,31.3234],'uruk-location'],
  ['caral-supe',[-77.521389,-10.891667],'caral'],
  ['moenjodaro',[68.138889,27.329167],'indus']
 ]){const r=c.records.find(r=>r.id===id);r.coord=coord;r.coordinateSource=source;if(!r.sources.includes(source))r.sources.push(source);}
 c.records.sort((a,b)=>a.from-b.from||a.id.localeCompare(b.id));
 const budj=world.entries.find(e=>e.id==='budj');if(budj)c.records.find(r=>r.id==='budj-bim-early').coord=budj.coord;
 for(const r of c.records)if(r.id.startsWith('lapita-')||r.id.startsWith('kuk-'))r.region='oceania';
 const boundaries=require('./load-boundaries.cjs');
 const paleo=require('./paleogeography/load.cjs');
 for(const [id,s]of Object.entries(require('./paleogeography/catalog.cjs').sources))c.sources['paleo-'+id]=s;
 c.milestones=[...new Set([c.range.min,-1,1,609,610,...paleo.frames.map(f=>f.year),...c.records.flatMap(r=>[r.from,r.to]),...boundaries.records.flatMap(r=>[r.from,r.to===-1?1:r.to+1])])].filter(y=>y>=c.range.min&&y<=610&&y!==0).sort((a,b)=>a-b);
 c.coverage={records:c.records.length,kyrgyz:c.records.filter(r=>r.kyrgyz).length,sites:c.records.filter(r=>r.coord).length,environmentRecords:c.records.filter(r=>r.kind==='environment').length,
  datedPoliticalGeometry:boundaries.records.length,territorialEntities:boundaries.entities.length,worldComplete:false,
  publicationScope:'Selected ancient societies and source-based territorial reconstructions, joined to the existing 610–2026 atlas.',
  paleogeographyFrames:paleo.frames.length,paleogeographyRangeBP:[80000,2500],
  remainingResearch:['Ancient boundaries are reconstructions, not surveyed annual frontiers.','PaleoMIST physical geography uses dated 2500-year model frames, without annual interpolation. Older periods retain the modern reference. River courses and inland lake levels are not reconstructed by this marine model.','Pre-610 and post-610 territorial frames use independent sources and resolutions.']};
 return c;
};
