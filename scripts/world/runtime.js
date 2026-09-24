// Self-localized world comparison; historical polities and future-event data stay independent.
const worldHistory=createWorldHistory(WORLD_HISTORY);
const worldText={
 title:['Параллельная история мира','Parallel world history','Дүйнөнүн параллелдүү тарыхы'],
 explore:['Мир','World','Дүйнө'],all:['Все регионы','All regions','Бардык аймактар'],
 regionLabel:['Регион','Region','Аймак'],eurasiaShort:['Евразия','Eurasia','Евразия'],sync:['Исламская история и современники','Islamic history and contemporaries','Ислам тарыхы жана замандаштар'],
 year:['Год нашей эры','Year CE','Биздин замандын жылы'],apply:['Показать','Show','Көрсөтүү'],
 era:['н. э.','CE','б. з.'],active:['Центры и культуры','Centres and cultures','Борборлор жана маданияттар'],
 show:['Показать на карте','Show on map','Картадан көрсөтүү'],sources:['Источники','Sources','Булактар'],
 phases:['Этапы истории','Historical phases','Тарыхый этаптар'],
 eurasia:['Евразия · исламская история и современники','Eurasia · Islamic history and contemporaries','Евразия · ислам тарыхы жана замандаштар'],
 legend:['● Город / центр   ◇ Культура   ○ Ландшафт / область','● City / centre   ◇ Culture   ○ Landscape / region','● Шаар / борбор   ◇ Маданият   ○ Ландшафт / аймак'],
 empty:['В этой подборке нет центров для выбранного года.','No centres in this selection for the chosen year.','Бул топтомдо тандалган жылга тиешелүү борборлор жок.'],
 range:['610–1299 · годы нашей эры','610–1299 · Common Era','610–1299 · биздин заман'],
 dating:['Даты этапов округлены там, где хронология приблизительна.','Phase dates are rounded where the chronology is approximate.','Хронология болжолдуу болгон жерлерде этаптардын даталары тегеректелген.'],
 geography:['Обозначены города и культурные ландшафты.','Symbols locate cities and cultural landscapes.','Белгилер шаарларды жана маданий ландшафттарды көрсөтөт.'],
 invalid:['Введите год от 610 до 1299.','Enter a year from 610 to 1299.','610–1299 аралыгындагы жылды киргизиңиз.'],
 mapName:['Карта исторических государств, городов и культурных ландшафтов','Map of historical states, cities and cultural landscapes','Тарыхый мамлекеттердин, шаарлардын жана маданий ландшафттардын картасы'],
 city:['Город / центр','City / centre','Шаар / борбор'],community:['Поселения','Settlements','Конуштар'],culture:['Археологическая культура','Archaeological culture','Археологиялык маданият'],region:['Региональный ориентир','Regional reference point','Аймактык багыт белгиси'],landscape:['Культурный ландшафт','Cultural landscape','Маданий ландшафт']
};
Object.assign(worldText,{
 state:['Государство / политический центр','State / political centre','Мамлекет / саясий борбор'],uninhabited:['Нет подтверждённых поселений','No confirmed settlements','Ырасталган конуштар жок'],
 overview:['Государства и общества','States and societies','Мамлекеттер жана коомдор'],chronology:['Хронология','Chronology','Хронология'],
 active:['Центры и общества','Centres and societies','Борборлор жана коомдор'],
 legend:['Цвет — владения · пунктир — влияние · штриховка — культуры и расселение','Colour: domains · dashed: influence · hatched: cultures and settlement','Түс — ээликтер · пунктир — таасир · штрих — маданияттар жана конуштар'],
 geography:['Контуры передают приблизительные области для указанного периода.','Outlines represent approximate areas for the stated period.','Контурлар көрсөтүлгөн мезгилдеги болжолдуу аймактарды берет.'],
 dating:['Точные даты и приблизительные периоды обозначены раздельно.','Exact dates and approximate periods are labelled separately.','Так даталар менен болжолдуу мезгилдер өзүнчө белгиленет.'],
 search:['Событие, государство, место или год…','Event, state, place or year…','Окуя, мамлекет, жер же жыл…'],filters:['Поиск и фильтры','Search and filters','Издөө жана чыпкалар'],
 allTypes:['Все темы','All topics','Бардык темалар'],allTime:['Все века','All centuries','Бардык кылымдар'],
 war:['Войны и завоевания','Wars and conquests','Согуштар жана басып алуулар'],politics:['Государства и власть','States and power','Мамлекеттер жана бийлик'],diplomacy:['Договоры','Agreements','Келишимдер'],migration:['Переселения','Migrations','Көчүүлөр'],period:['Исторические этапы','Historical phases','Тарыхый этаптар'],
 exact:['Датированное событие','Dated event','Даталанган окуя'],approx:['Приблизительный период','Approximate period','Болжолдуу мезгил'],
 polities:['Государства и области на карте','States and regions on the map','Картадагы мамлекеттер жана аймактар'],active:['Исторические записи','Historical records','Тарыхый жазуулар'],
 previous:['Предыдущее событие','Previous event','Мурунку окуя'],next:['Следующее событие','Next event','Кийинки окуя'],close:['Закрыть событие','Close event','Окуяны жабуу'],
 results:['Найдено','Results','Табылды'],noResults:['Для этих фильтров записей нет.','No records match these filters.','Бул чыпкаларга туура келген жазуулар жок.'],
 core:['Ядро государства / центр власти','State core / seat of power','Мамлекеттин өзөгү / бийлик борбору'],cultural:['Культурная область','Cultural area','Маданий аймак'],settlement:['Зона поселений','Settlement area','Конуш аймагы'],
 current:['В выбранном году','In the selected year','Тандалган жылда'],baseSources:['Источники основного атласа','Sources of the main atlas','Негизги атластын булактары'],route:['Направление на карте','Direction on the map','Картадагы багыт'],
 territory:['Изменения территорий','Territorial changes','Аймактардын өзгөрүшү'],territories:['Территории и области','Territories and regions','Ээликтер жана аймактар'],polity:['Политические владения','Political domains','Саясий ээликтер'],influence:['Область влияния','Sphere of influence','Таасир аймагы'],
 territoryPrevious:['Предыдущее изменение карты','Previous map change','Картанын мурунку өзгөрүшү'],territoryNext:['Следующее изменение карты','Next map change','Картанын кийинки өзгөрүшү'],
 continuity:['В этом интервале показана длительная преемственность.','This interval shows long-term continuity.','Бул аралыкта узакка созулган уланмалуулук көрсөтүлгөн.'],
 closeArea:['Закрыть область','Close region','Аймакты жабуу'],areaStages:['Этапы на карте','Map stages','Картадагы этаптар'],
 study:['Общество','Society','Коом'],cultureEvents:['Культура и технологии','Culture and technology','Маданият жана технология'],learning:['Как было устроено общество','How society worked','Коом кандай түзүлгөн'],
 government:['Власть и организация','Power and organisation','Бийлик жана уюшуу'],economy:['Хозяйство и обмен','Economy and exchange','Чарба жана алмашуу'],society:['Поселения и жизнь людей','Settlements and daily life','Конуштар жана күнүмдүк жашоо'],
 studySearch:['Найти общество или занятие…','Find a society or activity…','Коомду же кесипти издөө…'],studyHint:['Выберите год и регион: как люди управляли, трудились и жили.','Choose a year and region to explore how people governed, worked and lived.','Жыл менен аймакты тандаңыз: адамдар кантип башкарып, эмгектенип, жашаганын билиңиз.']
});
const wl=values=>values[supportedLanguages.indexOf(language)],wt=key=>wl(worldText[key]);
const worldState={region:WORLD_HISTORY.regions.some(r=>r.id===stateParams.get('world'))?stateParams.get('world'):'all',selected:stateParams.get('wplace')||'',area:stateParams.get('wterritory')||'',mode:['timeline','study'].includes(stateParams.get('wview'))?stateParams.get('wview'):'overview',event:stateParams.get('wevent')||'',type:'all',century:'all',search:'',studySearch:'',filters:!stateParams.has('wevent')};
const we=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
const worldExplorer=we('section','world-explorer');worldExplorer.id='worldExplorer';worldExplorer.dataset.localeOwned='true';
worldExplorer.innerHTML='<header class="world-header"><div class="world-heading"><h3 id="worldHeading"></h3><span id="worldCurrentYear"></span></div><form id="worldYearForm"><label class="world-sr" for="worldRegionSelect" id="worldRegionLabel"></label><select id="worldRegionSelect"></select><label class="world-sr" for="worldYearInput" id="worldYearLabel"></label><input id="worldYearInput" type="number" min="610" max="1299" step="1" required><button id="worldYearApply" type="submit"></button></form><p id="worldScope"></p></header><p class="world-legend" id="worldLegend"></p><div id="worldCards"></div><p class="world-dating" id="worldDating"></p>';
$('bottomGrid').prepend(worldExplorer);
const worldModes=we('div','world-modes');worldModes.setAttribute('role','group');
for(const [value,key] of [['overview','overview'],['timeline','chronology'],['study','study']]){const b=we('button');b.type='button';b.dataset.worldMode=value;b.dataset.worldLabel=key;b.onclick=()=>{worldState.mode=value;worldState.area='';worldState.event='';renderWorldHistory();$('panel-compare').scrollTop=0;queueLocationSave();};worldModes.append(b);}worldExplorer.querySelector('header').append(worldModes);
const worldStudyTools=we('div','world-study-tools');worldStudyTools.innerHTML='<p id="worldStudyHint"></p><input id="worldStudySearch" type="search">';$('worldCards').before(worldStudyTools);
$('worldStudySearch').oninput=e=>{worldState.studySearch=e.target.value;renderWorldCards();};
const worldFilters=we('div','world-filters');worldFilters.innerHTML='<input id="worldSearch" type="search"><div><select id="worldCentury"></select><select id="worldType"></select></div>';worldExplorer.querySelector('header').append(worldFilters);
const worldFilterToggle=we('button','world-filter-toggle');worldFilterToggle.type='button';worldFilterToggle.id='worldFilterToggle';worldFilterToggle.setAttribute('aria-controls','worldSearch');worldFilters.before(worldFilterToggle);worldFilterToggle.onclick=()=>{worldState.filters=!worldState.filters;renderWorldControls();};
const worldEventDetail=we('section','world-event-detail');worldEventDetail.id='worldEventDetail';$('worldLegend').before(worldEventDetail);
const worldAreaDetail=we('section','world-event-detail world-area-detail');worldAreaDetail.id='worldAreaDetail';$('worldLegend').before(worldAreaDetail);
const worldMapSteps=we('div','world-map-steps');worldMapSteps.id='worldMapSteps';worldModes.before(worldMapSteps);
const worldChronology=we('div','world-chronology');worldChronology.id='worldChronology';$('worldCards').after(worldChronology);
const worldEurasia=we('details','world-eurasia');worldEurasia.id='worldEurasia';
const eurasiaSummary=we('summary');eurasiaSummary.dataset.localeOwned='true';worldEurasia.append(eurasiaSummary);
const originalComparison=$('compareIslam').closest('.bottom-card');originalComparison.querySelector('.bottom-title').remove();worldEurasia.append(originalComparison);$('bottomGrid').append(worldEurasia);
const worldSources=we('section','source-group');worldSources.id='worldSources';worldSources.dataset.localeOwned='true';$('panel-sources').append(worldSources);
const worldMapLegend=we('section','world-map-legend');worldMapLegend.id='worldMapLegend';worldMapLegend.dataset.localeOwned='true';$('legendItems').after(worldMapLegend);
const worldButton=we('button','btn');worldButton.type='button';worldButton.id='worldExploreBtn';worldButton.dataset.localeOwned='true';$('layersBtn').before(worldButton);
const worldLayer=document.createElementNS(svg.namespaceURI,'g');worldLayer.id='worldHistoryLayer';worldLayer.dataset.localeOwned='true';viewport.append(worldLayer);
const worldTerritoryLayer=document.createElementNS(svg.namespaceURI,'g');worldTerritoryLayer.id='worldTerritoryLayer';worldTerritoryLayer.dataset.localeOwned='true';viewport.insertBefore(worldTerritoryLayer,empireLabelLayer);
const worldTerritoryLabels=document.createElementNS(svg.namespaceURI,'g');worldTerritoryLabels.id='worldTerritoryLabels';worldTerritoryLabels.dataset.localeOwned='true';viewport.insertBefore(worldTerritoryLabels,worldLayer);
const worldDefs=document.createElementNS(svg.namespaceURI,'defs'),worldLandClip=document.createElementNS(svg.namespaceURI,'clipPath');worldLandClip.id='worldLandClip';worldLandClip.setAttribute('clipPathUnits','userSpaceOnUse');
for(const feature of MODERN_COUNTRIES.features){const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',geometryPath(feature.geometry));path.setAttribute('clip-rule','evenodd');worldLandClip.append(path);}worldDefs.append(worldLandClip);
const worldPattern=document.createElementNS(svg.namespaceURI,'pattern');worldPattern.id='worldRegionHatch';worldPattern.setAttribute('width',7);worldPattern.setAttribute('height',7);worldPattern.setAttribute('patternUnits','userSpaceOnUse');worldPattern.setAttribute('patternTransform','rotate(30)');const worldHatchLine=document.createElementNS(svg.namespaceURI,'path');worldHatchLine.setAttribute('d','M0 0V7');worldHatchLine.setAttribute('stroke','#51492e');worldHatchLine.setAttribute('stroke-width',1);worldHatchLine.setAttribute('stroke-opacity',.2);worldPattern.append(worldHatchLine);worldDefs.append(worldPattern);viewport.prepend(worldDefs);
const worldEraStrip=we('div','world-era-strip');worldEraStrip.id='worldEraStrip';worldEraStrip.dataset.localeOwned='true';$('eraStrip').after(worldEraStrip);
// Playback also stops at milestones introduced by the world chronology.
for(const e of worldHistory.timeline())for(const y of [e.from,e.year,e.to+1])if(y>=610&&y<=1299&&!KEY_YEARS.includes(y))KEY_YEARS.push(y);KEY_YEARS.sort((a,b)=>a-b);
function worldCamera(region=worldState.region){
 if(region==='oceania'){animateCamera({scale:1,tx:0,ty:0});return;}
 if(region==='antarctica'){focusLonLat(0,-75,1);return;}
 const r=WORLD_HISTORY.regions.find(r=>r.id===region);
 if(r)focusLonLat(...r.view);else animateCamera(region==='eurasia'?{...DEFAULT_WORLD_VIEW}:{scale:1,tx:0,ty:0});
}
function worldChooseRegion(region,focus=true){
 stopPlay();worldShowLocations();worldState.region=region;worldState.selected='';worldState.area='';worldState.event='';worldState.search='';worldState.studySearch='';worldState.type='all';worldState.century='all';renderWorldHistory();
 if(focus)worldCamera();$('panel-compare').scrollTop=0;queueLocationSave();
}
function worldChoosePlace(id,scroll=false){
 const item=worldHistory.get(id,year);if(!item)return;
 const keepSearch=worldState.mode==='study'&&Boolean($('world-card-'+id));
 stopPlay();worldShowLocations();worldState.selected=id;worldState.area='';worldState.event='';if(worldState.mode!=='study')worldState.mode='overview';if(!keepSearch)worldState.studySearch='';worldState.region=item.entry.region;switchPanel('compare');renderWorldHistory();
 focusLonLat(...item.coord,item.entry.kind==='landscape'?3.2:4.3);
 const card=$('world-card-'+id);card.querySelector('button').focus({preventScroll:true});
 if(scroll){const panel=$('panel-compare'),header=worldExplorer.querySelector('header'),sticky=getComputedStyle(header).position==='sticky';panel.scrollTop=Math.max(0,card.getBoundingClientRect().top-panel.getBoundingClientRect().top+panel.scrollTop-(sticky?header.offsetHeight:0)-10);}
 queueLocationSave();
}
function worldShowLocations(){layerState.places=true;layerState.empires=true;$('togglePlaces').checked=true;$('toggleEmpires').checked=true;applyLayerState();worldLayer.classList.remove('hidden-layer');worldTerritoryLayer.classList.remove('hidden-layer');worldTerritoryLabels.classList.remove('hidden-layer');}
worldButton.onclick=()=>{switchPanel('compare');worldChooseRegion('all');};
$('togglePlaces').addEventListener('change',()=>worldLayer.classList.toggle('hidden-layer',!layerState.places));
$('toggleEmpires').addEventListener('change',()=>{worldTerritoryLayer.classList.toggle('hidden-layer',!layerState.empires);worldTerritoryLabels.classList.toggle('hidden-layer',!layerState.empires);renderWorldAreaControls();updateWorldMarkerScale();});
$('opacityRange').addEventListener('input',()=>worldTerritoryLayer.style.setProperty('--area-opacity',worldAreaOpacity()));
$('worldRegionSelect').onchange=e=>worldChooseRegion(e.target.value);
$('worldYearForm').onsubmit=e=>{e.preventDefault();const value=$('worldYearInput').valueAsNumber;if(!Number.isInteger(value)||value<610||value>1299){$('worldYearInput').setCustomValidity(wt('invalid'));$('worldYearInput').reportValidity();return;}stopPlay();renderYear(value);queueLocationSave();};
$('worldYearInput').oninput=()=>{$('worldYearInput').setCustomValidity('');};
$('worldYearInput').onfocus=stopPlay;
$('worldSearch').oninput=e=>{worldState.search=e.target.value;renderWorldChronology();};
$('worldCentury').onchange=e=>{worldState.century=e.target.value;renderWorldChronology();};
$('worldType').onchange=e=>{worldState.type=e.target.value;renderWorldChronology();};
function worldEventDate(e){return e.record==='period'?wl(e.period):(e.approx?wl(['ок. ','c. ','болж. ']):'')+e.from+(e.to!==e.from?'–'+e.to:'')+' '+wt('era');}
function worldRecords(){return worldHistory.timeline(worldState.region).filter(e=>{
 const century=+worldState.century;
 const place=WORLD_HISTORY.entries.find(p=>p.id===e.entry);
 const q=worldState.search.trim().toLocaleLowerCase(),matchYear=/^\d{3,4}$/.test(q)&&+q>=e.from&&+q<=e.to;
 return (worldState.type==='all'||e.kind===worldState.type)&&(worldState.century==='all'||e.from<=century*100&&e.to>=(century-1)*100+1)&&(!q||matchYear||[...e.title,...e.text,...(e.name||[]),...(place?.name||[])].join(' ').toLocaleLowerCase().includes(q));
});}
function worldChooseEvent(id){
 const e=worldHistory.timeline().find(e=>e.id===id);if(!e)return;
 if(e.record==='territory'){stopPlay();renderYear(e.year);worldChooseTerritory(e.entry);return;}
 stopPlay();worldShowLocations();worldState.area='';worldState.event=id;worldState.selected=e.entry||'';worldState.mode='timeline';worldState.filters=false;
 if(worldState.region!=='all'&&worldState.region!==e.region)worldState.region=e.region;
 switchPanel('compare');renderYear(e.year);
 if(e.route?.length){const pts=e.route.map(project),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2,s=Math.min(24,SVG_W*.72/Math.max(14,Math.max(...xs)-Math.min(...xs)),SVG_H*.65/Math.max(14,Math.max(...ys)-Math.min(...ys)));animateCamera({scale:s,tx:SVG_W/2-cx*s,ty:SVG_H/2-cy*s});}else focusLonLat(...e.coord,e.region==='antarctica'?1.3:4.2);
 $('panel-compare').scrollTop=0;$('worldEventTitle')?.focus({preventScroll:true});queueLocationSave();
}
function renderWorldControls(){
 svg.setAttribute('role','group');svg.setAttribute('aria-label',wt('mapName'));
 document.body.classList.toggle('world-regional',!['all','eurasia'].includes(worldState.region));
 $('worldHeading').textContent=wt('title');$('worldCurrentYear').textContent=year+' '+wt('era');
 $('worldYearLabel').textContent=wt('year');$('worldYearInput').value=year;$('worldYearInput').setCustomValidity('');$('worldYearApply').textContent=wt('apply');
 const region=WORLD_HISTORY.regions.find(r=>r.id===worldState.region);
 const count=worldHistory.at(year,worldState.region).length+worldBasePolities().length;
 $('worldScope').textContent=(region?wl(region.scope):wt('range'))+' · '+wt('active')+': '+count;
 $('worldLegend').textContent=wt('legend');$('worldDating').textContent=wt('dating')+' '+wt('geography');
 worldButton.textContent=wt('explore');worldButton.title=wt('title');worldButton.setAttribute('aria-controls','panel-compare');
 eurasiaSummary.textContent=wt('eurasia');
 worldEurasia.hidden=!['all','eurasia'].includes(worldState.region);if(worldState.region==='eurasia')worldEurasia.open=true;
 $('worldLegend').hidden=false;$('worldDating').hidden=false;
 $('worldRegionLabel').textContent=wt('regionLabel');const nav=$('worldRegionSelect');nav.replaceChildren();
 for(const r of [{id:'all',name:worldText.all},...WORLD_HISTORY.regions]){
  const option=we('option','',wl(r.name));option.value=r.id;nav.append(option);
 }
 nav.value=worldState.region;
 for(const b of worldModes.children){b.textContent=wt(b.dataset.worldLabel);b.setAttribute('aria-pressed',String(b.dataset.worldMode===worldState.mode));}
 worldModes.setAttribute('aria-label',wt('title'));worldFilters.hidden=worldState.mode!=='timeline'||!worldState.filters;worldFilterToggle.hidden=worldState.mode!=='timeline';worldFilterToggle.textContent=wt('filters')+(worldState.filters?' ▴':' ▾');worldFilterToggle.setAttribute('aria-expanded',String(worldState.filters));
 worldExplorer.classList.toggle('filters-expanded',worldState.mode==='timeline'&&worldState.filters);
 worldExplorer.classList.toggle('has-event',Boolean(worldState.event));worldExplorer.classList.toggle('studying',worldState.mode==='study');
 $('worldSearch').value=worldState.search;$('worldSearch').placeholder=wt('search');$('worldSearch').setAttribute('aria-label',wt('search'));
 for(const [id,items,value] of [['worldCentury',[['all',wt('allTime')],...[7,8,9,10,11,12,13].map(n=>[String(n),['VII','VIII','IX','X','XI','XII','XIII'][n-7]+wl([' век',' century',' кылым'])])],worldState.century],['worldType',[['all',wt('allTypes')],...['war','politics','diplomacy','migration','culture','territory','period'].map(k=>[k,wt(k==='culture'?'cultureEvents':k)])],worldState.type]]){const s=$(id);s.replaceChildren();s.setAttribute('aria-label',id==='worldType'?wt('allTypes'):wt('allTime'));for(const [v,t] of items){const o=we('option','',t);o.value=v;s.append(o);}s.value=value;}
 $('worldCards').hidden=worldState.mode==='timeline';worldChronology.hidden=worldState.mode!=='timeline';
 worldStudyTools.hidden=worldState.mode!=='study';$('worldStudyHint').textContent=wt('studyHint');$('worldStudySearch').placeholder=wt('studySearch');$('worldStudySearch').setAttribute('aria-label',wt('studySearch'));$('worldStudySearch').value=worldState.studySearch;
 worldEraStrip.replaceChildren();
 const preferred=worldState.region==='all'?['palenque-611','nubia-baqt','quirigua-738','greenland-norse','vinland-1021','hastings','chimu-expansion','maori-arrival']:null;
 let milestones=worldHistory.timeline(worldState.region).filter(e=>preferred?preferred.includes(e.id):e.record==='event');if(!milestones.length)milestones=worldHistory.timeline(worldState.region);
 milestones=milestones.filter((e,i,items)=>items.findIndex(x=>x.year===e.year&&wl(x.title)===wl(e.title))===i);
 if(milestones.length>10)milestones=Array.from({length:10},(_,i)=>milestones[Math.round(i*(milestones.length-1)/9)]);
 for(const e of milestones){const b=we('button','',e.year+' · '+wl(e.title));b.type='button';b.title=worldEventDate(e);b.onclick=()=>worldChooseEvent(e.id);worldEraStrip.append(b);}
 updateWorldCaption();
 renderWorldAreaControls();
}
function updateWorldCaption(){
 if(!$('panel-compare').hidden&&!document.body.classList.contains('future-mode')){const e=worldHistory.timeline().find(e=>e.id===worldState.event),r=WORLD_HISTORY.regions.find(r=>r.id===worldState.region);$('mapAh').textContent=$('timelineAh').textContent+' · '+(e?wl(e.title):r?wl(r.name):wt('title'));}
 else {const e=activeEvent(year);$('mapAh').textContent=translate(`${e.ah} · ${e.title}`,language);}
}
function appendWorldSources(parent,ids,base=false){
 const details=we('details','world-source');details.append(we('summary','',wt('sources')));
 for(const id of ids)details.append(we('p','',WORLD_HISTORY.sources[id].title));
 if(base){const b=we('button','world-source-button',wt('baseSources'));b.type='button';b.onclick=()=>switchPanel('sources');details.append(b);}parent.append(details);
}
function renderWorldChronology(){
 worldChronology.replaceChildren();const records=worldRecords();worldChronology.append(we('p','world-count',wt('results')+': '+records.length));
 for(const e of records){
  const item=we('article','world-timeline-item');item.dataset.worldEvent=e.id;item.classList.toggle('selected',e.id===worldState.event);item.classList.toggle('current',year>=e.from&&year<=e.to);
  const b=we('button','world-timeline-button');b.type='button';b.append(we('span','world-period',worldEventDate(e)),we('strong','',wl(e.title)));
  const r=WORLD_HISTORY.regions.find(r=>r.id===e.region);b.append(we('span','world-card-meta',(e.name?wl(e.name)+' · ':'')+wl(r.name)+' · '+wt(e.kind==='culture'?'cultureEvents':e.kind)));
  b.onclick=()=>worldChooseEvent(e.id);item.append(b);worldChronology.append(item);
 }
 if(!records.length)worldChronology.append(we('p','world-empty',wt('noResults')));
}
function renderWorldEvent(){
 const e=worldHistory.timeline().find(e=>e.id===worldState.event);worldEventDetail.replaceChildren();worldEventDetail.hidden=!e;if(!e)return;
 const title=we('h4','',wl(e.title));title.id='worldEventTitle';title.tabIndex=-1;
 worldEventDetail.append(we('p','world-card-meta',worldEventDate(e)+' · '+wt(e.approx?'approx':'exact')),title,we('p','world-description',wl(e.text)));
 appendWorldSources(worldEventDetail,e.sources,e.base);
 const actions=we('div','world-event-actions'),records=worldRecords(),i=records.findIndex(r=>r.id===e.id);
 for(const [label,delta] of [['previous',-1],['next',1]]){const b=we('button','',delta<0?'←':'→');b.type='button';b.setAttribute('aria-label',wt(label));b.title=wt(label);const target=i>=0?records[i+delta]:null;b.disabled=!target;b.onclick=()=>worldChooseEvent(target.id);actions.append(b);}
 const close=we('button','',wt('close'));close.type='button';close.onclick=()=>{worldState.event='';renderWorldHistory();queueLocationSave();};actions.append(close);worldEventDetail.append(actions);
}
function appendWorldLearning(parent,phase,id,expanded=false){
 if(!phase.learning)return;
 const details=we('details','world-learning');details.id='world-learning-'+id;details.open=expanded;details.append(we('summary','',wt('learning')));
 const list=we('dl');for(const key of ['government','economy','society'])if(phase.learning[key]){list.append(we('dt','',wt(key)),we('dd','',wl(phase.learning[key])));}details.append(list);parent.append(details);
}
function renderWorldCards(){
 const container=$('worldCards'),studying=worldState.mode==='study',query=studying?worldState.studySearch.trim().toLocaleLowerCase():'';
 const items=worldHistory.at(year,worldState.region).filter(({entry,phase})=>!query||[wl(entry.name),wl(phase.title),wl(phase.text),...Object.values(phase.learning||{}).map(wl)].join(' ').toLocaleLowerCase().includes(query));
 const openIds=new Set([...container.querySelectorAll('details[open]')].map(d=>d.id));
 container.replaceChildren();
 const areas=worldHistory.areasAt(year,worldState.region);
 if(areas.length&&!studying){const group=we('section','world-territory-list');group.append(we('h4','',wt('territories')+' · '+areas.length));for(const a of areas){const b=we('button','world-territory-chip');b.type='button';b.dataset.territory=a.entry;b.style.setProperty('--territory-color',a.color);b.setAttribute('aria-pressed',String(worldState.area===a.entry));b.append(we('strong','',wl(a.name)),we('small','',wt(a.kind)));b.onclick=()=>worldChooseTerritory(a.entry);group.append(b);}container.append(group);}
 const states=worldBasePolities().filter(s=>!query||translate(s.name,language).toLocaleLowerCase().includes(query)),showStates=states.length&&(!studying||worldState.region==='eurasia'||query);
 if(studying)container.append(we('p','world-count',wt('results')+': '+(items.length+(showStates?states.length:0))));
 if(showStates){const details=we('details','world-polities');details.id='world-polities';details.open=Boolean(query)||worldState.region==='eurasia'||openIds.has(details.id);details.append(we('summary','',wt('polities')+' · '+states.length));const list=we('div');for(const state of states){const b=we('button','',translate(state.name,language));b.type='button';b.onclick=()=>{stopPlay();worldState.event='';layerState.empires=true;$('toggleEmpires').checked=true;applyLayerState();selectEmpire(state.id,true,true);};list.append(b);}details.append(list);container.append(details);}
 for(const {entry,phase} of items){
  const region=WORLD_HISTORY.regions.find(r=>r.id===entry.region);
  const article=we('article','world-card');article.id='world-card-'+entry.id;article.dataset.worldEntry=entry.id;article.classList.toggle('selected',entry.id===worldState.selected);
  const top=we('div','world-card-meta',wl(region.name)+' · '+wt(entry.kind));article.append(top);
  const title=we('h4');const button=we('button','world-card-title',wl(entry.name));button.type='button';button.onclick=()=>worldChoosePlace(entry.id,true);title.append(button);article.append(title);
  article.append(we('span','world-period',wl(phase.period)),we('h5','',wl(phase.title)),we('p','world-description',wl(phase.text)));
  appendWorldLearning(article,phase,entry.id,studying||entry.id===worldState.selected||openIds.has('world-learning-'+entry.id));
  const actions=we('div','world-card-actions');const show=we('button','',wt('show'));show.type='button';show.onclick=()=>worldChoosePlace(entry.id,true);actions.append(show);article.append(actions);
  const history=we('button','',wt('chronology'));history.type='button';history.onclick=()=>{worldState.search=wl(entry.name).split(' · ')[0];worldState.mode='timeline';worldState.type='all';worldState.century='all';worldState.event='';worldState.filters=true;renderWorldHistory();$('panel-compare').scrollTop=0;queueLocationSave();};actions.append(history);
  if(entry.phases.length>1){
   const details=we('details','world-phases');details.id='world-phases-'+entry.id;details.open=openIds.has(details.id);details.append(we('summary','',wt('phases')));
   for(const p of entry.phases){const b=we('button','',wl(p.period)+' · '+wl(p.title));b.type='button';b.setAttribute('aria-current',String(p===phase));b.onclick=()=>{stopPlay();worldState.selected=entry.id;renderYear(clamp(p.from,610,1299));queueLocationSave();};details.append(b);}article.append(details);
  }
  const details=we('details','world-source');details.id='world-source-'+entry.id;details.open=openIds.has(details.id);details.append(we('summary','',wt('sources')));
  for(const id of phase.sources)details.append(we('p','',WORLD_HISTORY.sources[id].title));article.append(details);container.append(article);
 }
 if(!items.length&&!showStates)container.append(we('p','world-empty',wt(query?'noResults':'empty')));
}
function worldBasePolities(){const african=new Set(['aksum','fatimid','ayyubid','mamluk']);return displayEmpiresForYear(year).filter(e=>e.type!=='reference'&&(worldState.region==='all'||worldState.region==='eurasia'&&!african.has(e.id)||worldState.region==='africa'&&african.has(e.id)));}
function renderWorldMap(){
 worldLayer.replaceChildren();worldLayer.classList.toggle('hidden-layer',!layerState.places);
 const sn=(name,attrs)=>{const n=document.createElementNS(svg.namespaceURI,name);for(const [k,v] of Object.entries(attrs||{}))n.setAttribute(k,v);return n;};
 const defs=sn('defs'),pattern=sn('pattern',{id:'worldCoreHatch',width:6,height:6,patternUnits:'userSpaceOnUse',patternTransform:'rotate(30)'});pattern.append(sn('path',{d:'M0 0V6',stroke:'#765629','stroke-width':1,'stroke-opacity':.38}));defs.append(pattern);
 const arrow=sn('marker',{id:'worldRouteArrow',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'});arrow.append(sn('path',{d:'M0 0L10 5L0 10Z',fill:'#9a351e'}));defs.append(arrow);worldLayer.append(defs);
 renderWorldTerritories();
 // The region selector scopes the reading panel, never the world's geography.
 for(const {entry,phase,coord} of worldHistory.at(year)){
  const g=document.createElementNS(svg.namespaceURI,'g'),[x,y]=project(coord),inner=document.createElementNS(svg.namespaceURI,'g');
  g.setAttribute('class','world-marker'+(worldState.selected===entry.id?' selected':''));g.dataset.worldPlace=entry.id;g.dataset.px=x;g.dataset.py=y;
  g.setAttribute('transform',`translate(${x} ${y})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',wl(entry.name)+' · '+wl(phase.period));
  inner.setAttribute('class','world-marker-inner');
  const shape=document.createElementNS(svg.namespaceURI,entry.kind==='culture'?'path':'circle');
  if(entry.kind==='culture')shape.setAttribute('d','M0 -5 L5 0 L0 5 L-5 0 Z');else shape.setAttribute('r',entry.kind==='landscape'||entry.kind==='region'?'6':'4');
  shape.setAttribute('class','world-marker-core '+entry.kind);
  const target=document.createElementNS(svg.namespaceURI,'circle');target.setAttribute('r','14');target.setAttribute('class','world-marker-hit');inner.append(target,shape);
  const label=document.createElementNS(svg.namespaceURI,'text');label.textContent=wl(entry.name).split(' · ')[0];inner.append(label);g.append(inner);
  const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=wl(entry.name)+' · '+wl(phase.title);g.append(title);
  g.addEventListener('pointerdown',e=>e.stopPropagation());g.onclick=()=>worldChoosePlace(entry.id,true);
  g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();worldChoosePlace(entry.id,true);}};
  worldLayer.append(g);
 }
 const event=worldHistory.timeline().find(e=>e.id===worldState.event);
 if(event){
  if(event.route?.length){const d=event.route.map((p,i)=>(i?'L':'M')+project(p).join(' ')).join(' ');const route=sn('path',{d,class:'world-event-route','marker-end':'url(#worldRouteArrow)'});route.append(sn('title'));route.firstChild.textContent=wt('route');worldLayer.append(route);}
  const [x,y]=project(event.coord),g=sn('g',{class:'world-marker world-event-marker selected',transform:`translate(${x} ${y})`,'data-px':x,'data-py':y,role:'button',tabindex:0,'aria-label':wl(event.title)}),inner=sn('g',{class:'world-marker-inner'});
  inner.append(sn('circle',{r:12,class:'world-event-ring'}),sn('circle',{r:4,class:'world-event-dot'}));const label=sn('text');label.textContent=wl(event.title);inner.append(label);g.append(inner);g.onclick=()=>{switchPanel('compare');$('panel-compare').scrollTop=0;};g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.onclick();}};g.addEventListener('pointerdown',e=>e.stopPropagation());worldLayer.append(g);
 }
 updateWorldMarkerScale();
}
function updateWorldMarkerScale(){
 const ratio=Math.max(.1,Math.min(svg.clientWidth/SVG_W,svg.clientHeight/SVG_H)),scale=mapState.scale*ratio;
 const priority=g=>g.classList.contains('world-event-marker')?2:Number(g.dataset.worldPlace===worldState.selected);
 const markers=[...worldLayer.querySelectorAll('.world-marker')].sort((a,b)=>priority(b)-priority(a));
 const territoryLabels=updateWorldTerritoryLabels(),occupied=[...territoryLabels.occupied];
 for(const g of markers){
  g.querySelector('.world-marker-inner').setAttribute('transform',`scale(${1/scale})`);
  const label=g.querySelector('text'),x=(+g.dataset.px*mapState.scale+mapState.tx)*ratio,y=(+g.dataset.py*mapState.scale+mapState.ty)*ratio;
  label.style.display='none';if(territoryLabels.entries.has(g.dataset.worldPlace)||x<0||y<0||x>SVG_W*ratio||y>SVG_H*ratio)continue;
  const width=label.textContent.length*6.4+6;
  for(const [dx,dy,anchor] of [[11,4,'start'],[11,-10,'start'],[-11,4,'end'],[11,19,'start']]){
   const left=x+dx-(anchor==='end'?width:0),rect=[left,y+dy-11,left+width,y+dy+3];
   if(rect[0]<4||rect[2]>SVG_W*ratio-4||rect[1]<4||rect[3]>SVG_H*ratio-4)continue;
   if(occupied.some(r=>rect[0]<r[2]+4&&rect[2]>r[0]-4&&rect[1]<r[3]+3&&rect[3]>r[1]-3))continue;
   label.setAttribute('x',dx);label.setAttribute('y',dy);label.setAttribute('text-anchor',anchor);label.style.display='';occupied.push(rect);break;
  }
 }
}
function renderWorldSources(){
 worldSources.replaceChildren(we('h4','',wt('title')));
 for(const s of Object.values(WORLD_HISTORY.sources))worldSources.append(we('p','world-source-title',s.title));
}
function renderWorldLegend(){
 worldMapLegend.replaceChildren();
 const areas=worldHistory.areasAt(year);
 const regions=[...WORLD_HISTORY.regions].sort((a,b)=>Number(b.id===worldState.region)-Number(a.id===worldState.region));
 for(const region of regions){
  const items=areas.filter(a=>WORLD_HISTORY.entries.find(e=>e.id===a.entry).region===region.id);if(!items.length)continue;
  const section=we('div','world-legend-region');section.append(we('h4','',wl(region.name)));
  for(const a of items){const b=we('button','legend-item');b.type='button';b.dataset.legendTerritory=a.entry;const swatch=we('span','swatch');swatch.style.background=a.color;b.append(swatch,we('span','',wl(a.name).split(' · ')[0]));b.title=wt(a.kind);b.onclick=()=>{worldMapLegend.closest('details').open=false;worldChooseTerritory(a.entry);};section.append(b);}
  worldMapLegend.append(section);
 }
}
function renderWorldHistory(){
 if(!worldHistory.get(worldState.selected,year))worldState.selected='';
 if(!worldHistory.areasAt(year).some(a=>a.entry===worldState.area))worldState.area='';
 const selected=worldHistory.timeline().find(e=>e.id===worldState.event);if(selected&&(year<selected.from||year>selected.to))worldState.event='';
 renderWorldControls();renderWorldCards();renderWorldChronology();renderWorldEvent();renderWorldAreaDetail();renderWorldMap();renderWorldLegend();
}
new MutationObserver(updateWorldMarkerScale).observe(viewport,{attributes:true,attributeFilter:['transform']});
new ResizeObserver(updateWorldMarkerScale).observe(svg);
const worldComparisonLayout=()=>{document.body.classList.toggle('world-comparison',!$('panel-compare').hidden);updateWorldCaption();};
new MutationObserver(worldComparisonLayout).observe($('panel-compare'),{attributes:true,attributeFilter:['hidden']});worldComparisonLayout();
localeSelect.addEventListener('change',()=>{worldState.studySearch='';renderWorldHistory();renderWorldSources();});
worldHistoryHook=renderWorldHistory;
worldLocationHook=url=>{for(const [key,value] of [['world',worldState.region==='all'?'':worldState.region],['wplace',worldState.selected],['wview',worldState.mode==='overview'?'':worldState.mode],['wevent',worldState.event],['wterritory',worldState.area]]){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}};
// TERRITORIES_RUNTIME
renderWorldHistory();renderWorldSources();
if(stateParams.get('tab')==='compare'&&stateParams.has('world')&&!stateParams.has('view')&&stateParams.get('mode')!=='future')worldCamera();
