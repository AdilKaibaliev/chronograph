// This module owns its text and state; it does not alter historical datasets.
const futureText={
 button:['Будущие события','Future events','Келечектеги окуялар'],back:['← Исторический атлас','← Historical atlas','← Тарыхый атлас'],
 intro:['События по хадисам Пророка Мухаммада ﷺ из «Сахиха аль-Бухари» и «Сахиха Муслима».','Events in the hadiths of Prophet Muhammad ﷺ from Sahih al-Bukhari and Sahih Muslim.','Мухаммад пайгамбардын ﷺ «Сахих аль-Бухари» жана «Сахих Муслим» жыйнактарындагы хадистерден окуялар.'],
 search:['Найти событие или место','Find an event or place','Окуяны же жерди издөө'],group:['Раздел событий','Event section','Окуялар бөлүмү'],
 main:['Связанные последовательности','Connected sequences','Байланышкан ырааттар'],major:['Большие признаки · 10','Major signs · 10','Чоң белгилер · 10'],minor:['Малые признаки и связанные сообщения','Minor signs and related accounts','Кичине белгилер жана байланыштуу баяндар'],expected:['Другие ожидаемые события','Other expected events','Башка күтүлгөн окуялар'],historical:['Исторические сообщения','Historical accounts','Тарыхый баяндар'],all:['Весь каталог','Whole catalogue','Толук каталог'],
 unknown:['Место не названо или не установлено','Place unnamed or unidentified','Жер аталган эмес же аныктала элек'],
 approx:['Точки и области — географические ориентиры.','Points and areas are geographical guides.','Чекиттер жана аймактар — географиялык багыттар.'],
 borders:['Границы служат ориентиром на современной карте.','Boundaries are guides on a modern map.','Чек аралар азыркы картада багыт берет.'],
 noorder:['Общий порядок не установлен','Overall order is not established','Жалпы кезек аныкталган эмес'],
 ordered:['Порядок внутри выбранного рассказа','Order within the selected account','Тандалган баяндын ичиндеги кезек'],
 history:['Сообщение о прошлом','Account concerning the past','Өткөнгө тиешелүү баян'],
 minorNote:['Малые признаки могут относиться к прошлому или повторяющимся явлениям. Их расположение в каталоге не задаёт хронологию.','Minor signs may concern past or recurring phenomena. Their catalogue order does not establish a chronology.','Кичине белгилер өткөнгө же кайталануучу көрүнүштөргө тиешелүү болушу мүмкүн. Каталогдогу орун хронологияны аныктабайт.'],
 majorNote:['Десять признаков перечислены в Муслиме 2901a. Порядок перечисления не задаёт полную последовательность. Солнце и Зверь следуют близко друг за другом; который раньше — здесь не установлено.','Muslim 2901a lists ten signs. Listing order does not establish a complete sequence. The sun and the Beast follow closely; which comes first is not fixed here.','Муслим 2901aда он белги саналат. Тизмедеги орун толук ыраатты аныктабайт. Күн менен жаныбардын чыгышы жакын болот; кайсынысы биринчи экени бул жерде белгиленбейт.'],
 orderNote:['Шаги соединены по указанному хадису. Другие признаки не вставлены между ними без текстового основания.','Steps follow the cited hadith. Other signs are not inserted between them without textual support.','Кадамдар көрсөтүлгөн хадис боюнча байланышкан. Башка белгилер тексттик негизсиз алардын арасына кошулган эмес.'],
 sources:['Источники','Sources','Булактар'],list:['Список событий','Event list','Окуялардын тизмеси'],method:['О каталоге и карте','About the catalogue and map','Каталог жана карта жөнүндө'],
 methodBody:['Тематический указатель сообщений о признаках Часа из двух сборников. Повторяющиеся передачи объединены; карточки содержат краткий пересказ, а не полный перевод хадиса. Номера приведены по сквозной нумерации, буквы различают варианты. Это первая редакция каталога: она не означает построчную проверку всего корпуса обоих сборников.','A thematic index of accounts about signs of the Hour from the two collections. Repeated transmissions are grouped; cards give short paraphrases, not full hadith translations. Continuous numbering is used, with letters for variants. This is the first catalogue edition, not a claim that every line of both collections has been audited.','Эки жыйнактагы Кыямат белгилери тууралуу баяндардын тематикалык көрсөткүчү. Кайталанган риваяттар бириктирилген; карточкалар толук котормо эмес, кыскача мазмун берет. Жалпы номерлөө колдонулуп, тамгалар варианттарды айырмалайт. Бул — каталогдун алгачкы редакциясы; эки жыйнактын ар бир сабы текшерилди дегенди билдирбейт.'],
 mapMethod:['Координаты городов приблизительны, области не имеют предсказанных границ. Неназванные места и спорные точные отождествления оставлены без точки. Даты по григорианскому календарю и хиджре не назначаются.','City coordinates are approximate; areas do not represent predicted borders. Unnamed places and uncertain exact identifications have no point. Gregorian and Hijri dates are not assigned.','Шаарлардын координаттары болжолдуу; аймактар болочок чек араларды билдирбейт. Аталбаган жана так аныкталбаган жерлер чекитсиз берилет. Григориандык жана хижралык даталар коюлбайт.'],
 empty:['Ничего не найдено. Измените запрос или раздел.','No matches. Change the search or section.','Эч нерсе табылган жок. Издөөнү же бөлүмдү өзгөртүңүз.'],
 previous:['Предыдущее событие','Previous event','Мурунку окуя'],next:['Следующее событие','Next event','Кийинки окуя'],play:['Начать просмотр карточек','Start browsing cards','Карточкаларды көрүүнү баштоо'],pause:['Остановить просмотр','Pause browsing','Көрүүнү токтотуу'],step:['Карточка','Card','Карточка'],browse:['Просмотр карточек · без дат','Browsing cards · no dates','Карточкаларды көрүү · датасыз'],reset:['Показать места события','Show event places','Окуянын жерлерин көрсөтүү'],map:['Карта мест, упомянутых в хадисах','Map of places mentioned in hadiths','Хадистерде аталган жерлердин картасы'],
 named:['Названные места','Named places','Аталган жерлер'],partial:['Часть названных мест не нанесена: точка не установлена.','Some named places have no point: their location is not fixed.','Аталган жерлердин айрымдары белгиленген эмес: так чекити аныкталган эмес.'],
 statusMajor:['Большой признак','Major sign','Чоң белги'],statusMinor:['Малый признак / связанное сообщение','Minor sign / related account','Кичине белги / байланыштуу баян'],statusExpected:['Ожидаемое событие по хадису','Expected event in the hadith','Хадистеги күтүлгөн окуя']
};
const ft=k=>futureText[k][supportedLanguages.indexOf(language)],fl=v=>v[language];
const futureState={active:false,filter:'seq:sham',selected:'battle',query:'',timer:null,history:null};
const futureById=new Map(FUTURE_CATALOG.events.map(e=>[e.id,e]));
const futureButton=document.createElement('button');futureButton.id='futureBtn';futureButton.className='btn';futureButton.dataset.localeOwned='true';futureButton.setAttribute('aria-pressed','false');futureButton.setAttribute('aria-controls','futurePanel');localeSelect.after(futureButton);
const futurePanel=document.createElement('aside');futurePanel.id='futurePanel';futurePanel.className='card';futurePanel.dataset.localeOwned='true';futurePanel.hidden=true;
futurePanel.innerHTML='<header class="future-head"><div class="future-label">CHRONOGRAPH 1.4.3</div><h2></h2><p></p><div class="future-controls"><select id="futureGroup"></select><input id="futureSearch" type="search" autocomplete="off"></div></header><div class="future-scroll" id="futureScroll"><article id="futureArticle"></article><details class="future-index" open><summary id="futureListTitle"></summary><ol class="future-list" id="futureList"></ol></details><details class="future-method"><summary id="futureMethodTitle"></summary><p id="futureMethodBody"></p><p id="futureMapMethod"></p></details></div>';
$('timelineCard').before(futurePanel);
const futureTimeline=document.createElement('section');futureTimeline.id='futureTimeline';futureTimeline.className='card timeline-card';futureTimeline.dataset.localeOwned='true';futureTimeline.hidden=true;futureTimeline.innerHTML='<button class="round" id="futurePrevious">‹</button><button class="round" id="futurePlay">▶</button><div class="future-progress"><strong id="futureCurrent"></strong><small id="futureCount" role="status" aria-live="polite"></small><progress id="futureProgress" max="1" value="0"></progress></div><button class="round" id="futureNext">›</button>';
$('timelineCard').after(futureTimeline);
const futureNote=document.createElement('div');futureNote.id='futureMapNote';futureNote.dataset.localeOwned='true';futureNote.hidden=true;$('mapCard').append(futureNote);
const futureLayer=document.createElementNS('http://www.w3.org/2000/svg','g');futureLayer.id='futureLayer';futureLayer.dataset.localeOwned='true';futureLayer.style.display='none';viewport.append(futureLayer);
const futureOriginalMapLabel=svg.getAttribute('aria-label');
const futureOriginalReset=$('resetView').onclick;
function futureSequence(){return FUTURE_CATALOG.sequences.find(s=>'seq:'+s.id===futureState.filter);}
function futureItems(){
 const seq=futureSequence();let result=seq?seq.ids.map(id=>futureById.get(id)):FUTURE_CATALOG.events.filter(e=>futureState.filter==='all'||e.group===futureState.filter);
 const q=futureState.query.trim().toLocaleLowerCase();
 if(q)result=result.filter(e=>[fl(e.title),fl(e.summary),...e.places.map(p=>fl(FUTURE_CATALOG.places[p].name)),...e.refs].join(' ').toLocaleLowerCase().includes(q));
 return result;
}
function futureRef(ref){const [collection,num]=ref.split(':');return (collection==='bukhari'?({ru:'Сахих аль-Бухари',en:'Sahih al-Bukhari',ky:'Сахих аль-Бухари'})[language]:({ru:'Сахих Муслим',en:'Sahih Muslim',ky:'Сахих Муслим'})[language])+' · '+num;}
function futureStop(){if(futureState.timer!==null)clearInterval(futureState.timer);futureState.timer=null;futurePlayLabel();}
function futurePlayLabel(){$('futurePlay').textContent=futureState.timer===null?'▶':'Ⅱ';$('futurePlay').setAttribute('aria-label',ft(futureState.timer===null?'play':'pause'));$('futurePlay').setAttribute('aria-pressed',String(futureState.timer!==null));}
function futureSetCamera(points){
 ++cameraAnimationVersion;
 if(!points.length){mapState={scale:1,tx:0,ty:0};setViewport();return;}
 const ps=points.map(project),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);
 const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 const scale=Math.min(5,1000/(Math.max(...xs)-Math.min(...xs)+90),410/(Math.max(...ys)-Math.min(...ys)+65));
 mapState={scale,tx:720-cx*scale,ty:360-cy*scale};setViewport();
}
function futureMap(event,focus){
 futureLayer.replaceChildren();const places=event?event.places.map(id=>[id,FUTURE_CATALOG.places[id]]):[];
 const located=places.filter(([,p])=>p.coord);
 if(focus)futureSetCamera(located.map(([,p])=>p.coord));
 // Screen-size markers remain legible under map zoom.
 for(const [id,p] of located){
  const [x,y]=project(p.coord),g=document.createElementNS(svg.namespaceURI,'g');g.classList.add('future-marker');g.setAttribute('transform',`translate(${x} ${y})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',fl(p.name));g.dataset.place=id;
  const inner=document.createElementNS(svg.namespaceURI,'g');inner.classList.add('future-marker-inner');inner.setAttribute('transform',`scale(${futureMarkerScale()})`);
  if(p.area){const halo=document.createElementNS(svg.namespaceURI,'circle');halo.classList.add('future-halo');halo.setAttribute('r','24');inner.append(halo);}
  const dot=document.createElementNS(svg.namespaceURI,'circle');dot.setAttribute('r','6');inner.append(dot);
  const label=document.createElementNS(svg.namespaceURI,'text');label.setAttribute('x','11');label.setAttribute('y',String(4+located.findIndex(v=>v[0]===id)%2*13));label.textContent=fl(p.name).split(' · ')[0].split(' — ')[0];inner.append(label);g.append(inner);
  g.addEventListener('pointerdown',e=>e.stopPropagation());
  const activate=()=>{futureStop();futureSetCamera([p.coord]);updateFutureMarkerScale();};g.addEventListener('click',activate);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();activate();}});futureLayer.append(g);
 }
 futureNote.replaceChildren();const caption=document.createElement('div');caption.className='future-map-caption';caption.textContent=located.length?ft('approx')+' '+ft('borders'):ft('unknown');futureNote.append(caption);
 if(located.length&&located.length<places.length){const more=document.createElement('div');more.className='future-map-caption';more.textContent=ft('partial');futureNote.append(more);}
}
function futureMarkerScale(){return 1/(mapState.scale*Math.max(.1,Math.min(svg.clientWidth/SVG_W,svg.clientHeight/SVG_H)));}
function updateFutureMarkerScale(){if(!futureState.active)return;for(const inner of futureLayer.querySelectorAll('.future-marker-inner'))inner.setAttribute('transform',`scale(${futureMarkerScale()})`);}
new MutationObserver(updateFutureMarkerScale).observe(viewport,{attributes:true,attributeFilter:['transform']});
new ResizeObserver(updateFutureMarkerScale).observe(svg);
function futureRender(focus=false,scroll=false){
 const items=futureItems();if(!items.some(e=>e.id===futureState.selected))futureState.selected=items[0]?.id||'';
 const event=futureById.get(futureState.selected),seq=futureSequence();
 futureButton.textContent=ft(futureState.active?'back':'button');futureButton.setAttribute('aria-pressed',String(futureState.active));futurePanel.setAttribute('aria-label',ft('button'));
 futurePanel.querySelector('h2').textContent=ft('button');futurePanel.querySelector('.future-head p').textContent=ft('intro');
 const group=$('futureGroup');group.replaceChildren();
 const seqGroup=document.createElement('optgroup');seqGroup.label=ft('main');for(const s of FUTURE_CATALOG.sequences){const o=document.createElement('option');o.value='seq:'+s.id;o.textContent=fl(s.title);seqGroup.append(o);}group.append(seqGroup);
 for(const value of ['major','minor','expected','historical','all']){const o=document.createElement('option');o.value=value;o.textContent=ft(value);group.append(o);}group.value=futureState.filter;group.setAttribute('aria-label',ft('group'));
 $('futureSearch').placeholder=ft('search');$('futureSearch').setAttribute('aria-label',ft('search'));
 const article=$('futureArticle');article.replaceChildren();
 if(event){
  const label=document.createElement('div');label.className='future-label';label.textContent=ft(event.group==='historical'?'history':event.group==='major'?'statusMajor':event.group==='minor'?'statusMinor':'statusExpected');article.append(label);
  const title=document.createElement('h3');title.textContent=fl(event.title);article.append(title);const p=document.createElement('p');p.textContent=fl(event.summary);article.append(p);
  const context=document.createElement('p');context.className='future-context';context.textContent=seq?ft('orderNote'):event.group==='major'?ft('majorNote'):event.group==='minor'?ft('minorNote'):event.group==='historical'?ft('history'):ft('noorder');article.append(context);
  const where=document.createElement('div');where.className='future-places';where.setAttribute('role','group');where.setAttribute('aria-label',ft('named'));
  if(!event.places.length){const no=document.createElement('p');no.textContent=ft('unknown');where.append(no);}
  for(const id of event.places){const place=FUTURE_CATALOG.places[id],b=document.createElement('button');b.textContent=fl(place.name);b.disabled=!place.coord;b.onclick=()=>{futureStop();futureSetCamera([place.coord]);};where.append(b);}article.append(where);
  const sources=document.createElement('div');sources.className='future-source';sources.textContent=ft('sources')+': '+event.refs.map(futureRef).join('; ');article.append(sources);
 }else{const p=document.createElement('p');p.textContent=ft('empty');article.append(p);}
 $('futureListTitle').textContent=ft('list')+' · '+items.length;const list=$('futureList');list.replaceChildren();
 for(const [i,e] of items.entries()){const li=document.createElement('li'),b=document.createElement('button');b.textContent=(seq?(i+1)+'. ':'')+fl(e.title);b.dataset.event=e.id;b.setAttribute('aria-current',String(e.id===futureState.selected));b.onclick=()=>{futureStop();futureState.selected=e.id;futureRender(true,true);queueLocationSave();};li.append(b);list.append(li);}
 for(const [id,key] of [['futureMethodTitle','method'],['futureMethodBody','methodBody'],['futureMapMethod','mapMethod']])$(id).textContent=ft(key);
 $('futureCurrent').textContent=event?fl(event.title):ft('empty');$('futureCount').textContent=items.length?`${ft('step')} ${items.findIndex(e=>e.id===futureState.selected)+1} / ${items.length} · ${ft(seq?'ordered':'noorder')}`:'0 / 0';
 $('futureProgress').max=Math.max(1,items.length);$('futureProgress').value=items.findIndex(e=>e.id===futureState.selected)+1;$('futureProgress').setAttribute('aria-label',ft('browse'));
 $('futurePrevious').setAttribute('aria-label',ft('previous'));$('futureNext').setAttribute('aria-label',ft('next'));const index=items.findIndex(e=>e.id===futureState.selected);$('futurePrevious').disabled=index<=0;$('futureNext').disabled=index<0||index>=items.length-1;$('futurePlay').disabled=items.length<2;futurePlayLabel();
 if(futureState.active){futureMap(event,focus);svg.dataset.localeOwned='true';svg.setAttribute('aria-label',ft('map'));$('resetView').dataset.localeOwned='true';$('resetView').textContent=ft('reset');}
 if(scroll)$('futureScroll').scrollTop=0;
}
function futureStep(delta){const items=futureItems(),i=items.findIndex(e=>e.id===futureState.selected),next=i+delta;if(next<0||next>=items.length){futureStop();return;}futureState.selected=items[next].id;futureRender(true,true);queueLocationSave();if(next===items.length-1)futureStop();}
function futureTogglePlay(){if(futureState.timer!==null){futureStop();return;}const items=futureItems();if(items.length<2)return;if(futureState.selected===items.at(-1).id){futureState.selected=items[0].id;futureRender(true,true);}futureState.timer=setInterval(()=>futureStep(1),8500);futurePlayLabel();}
function setFutureMode(active){
 if(active===futureState.active)return;stopPlay();futureStop();
 if(active)futureState.history={view:{...mapState},resetText:$('resetView').textContent};
 futureState.active=active;document.body.classList.toggle('future-mode',active);futurePanel.hidden=!active;futureTimeline.hidden=!active;futureNote.hidden=!active;futureLayer.style.display=active?'':'none';
 $('layerPanel').hidden=true;tooltip.classList.remove('show');
 if(!active){mapState={...futureState.history.view};setViewport();delete svg.dataset.localeOwned;svg.setAttribute('aria-label',futureOriginalMapLabel);delete $('resetView').dataset.localeOwned;$('resetView').textContent='Обзор';localizePage();}
 futureRender(active,true);queueLocationSave();
}
futureButton.onclick=()=>setFutureMode(!futureState.active);
$('futureGroup').onchange=e=>{futureStop();futureState.filter=e.target.value;futureState.selected='';futureRender(true,true);queueLocationSave();};
$('futureSearch').oninput=e=>{futureStop();futureState.query=e.target.value;futureRender(true,true);queueLocationSave();};
$('futurePrevious').onclick=()=>{futureStop();futureStep(-1);};$('futureNext').onclick=()=>{futureStop();futureStep(1);};$('futurePlay').onclick=futureTogglePlay;
$('resetView').onclick=()=>{if(futureState.active){futureMap(futureById.get(futureState.selected),true);}else futureOriginalReset();};
window.addEventListener('keydown',e=>{if(!futureState.active||e.defaultPrevented||$('modal').classList.contains('show')||e.target.closest('input,select,button,summary,[role=button],[contenteditable=true]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();futureStop();futureStep(e.key==='ArrowLeft'?-1:1);}if(e.code==='Space'){e.preventDefault();futureTogglePlay();}},true);
localeSelect.addEventListener('change',()=>futureRender(false));
// Save the historical view separately so leaving this mode returns to it.
futureLocationHook=url=>{if(futureState.active){url.searchParams.set('mode','future');url.searchParams.set('section',futureState.filter);if(futureState.selected)url.searchParams.set('event',futureState.selected);else url.searchParams.delete('event');url.searchParams.set('view',Object.values(futureState.history.view).map(n=>n.toFixed(3)).join(','));url.searchParams.set('fview',[mapState.scale,mapState.tx,mapState.ty].map(n=>n.toFixed(3)).join(','));if(futureState.query)url.searchParams.set('q',futureState.query);else url.searchParams.delete('q');}else for(const key of ['mode','section','event','fview','q'])url.searchParams.delete(key);};
const futureInitialFilter=stateParams.get('section');if(['major','minor','expected','historical','all',...FUTURE_CATALOG.sequences.map(s=>'seq:'+s.id)].includes(futureInitialFilter))futureState.filter=futureInitialFilter;
if(futureById.has(stateParams.get('event')))futureState.selected=stateParams.get('event');futureState.query=(stateParams.get('q')||'').slice(0,200);$('futureSearch').value=futureState.query;
futureRender();if(stateParams.get('mode')==='future'){setFutureMode(true);const v=(stateParams.get('fview')||'').split(',').map(Number);if(v.length===3&&v.every(Number.isFinite)&&v[0]>=.75&&v[0]<=9&&Math.abs(v[1])<=20000&&Math.abs(v[2])<=20000){[mapState.scale,mapState.tx,mapState.ty]=v;setViewport();updateFutureMarkerScale();}}
