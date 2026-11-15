// Ancient overview. The existing renderer owns every year >=610.
(()=>{
 const cal=ancientCalendar,scale=ancientTimeScale,catalog=ANCIENT_PREVIEW,boundaries=ANCIENT_BOUNDARIES,baseRender=renderYear,baseNext=nextPlaybackYear;
 const labels={
  title:['Древний мир','Ancient world','Байыркы дүйнө'],preview:['Древний мир · обзор по источникам','Ancient world · a source-based overview','Байыркы дүйнө · булактар боюнча сереп'],
  year:['Год','Year','Жыл'],go:['Перейти','Go','Өтүү'],era:[['до н. э.','н. э.'],['BCE','CE'],['б. з. ч.','б. з.']],
  kyrgyz:['История кыргызов до 610 года','Kyrgyz history before 610','610-жылга чейинки кыргыз тарыхы'],all:['Все регионы','All regions','Бардык аймактар'],
  current:['События и общества выбранного времени','Events and societies of this period','Тандалган доордогу окуялар жана коомдор'],empty:['Для этого года карточки ещё готовятся.','Cards for this year are still in preparation.','Бул жылдын карточкалары даярдалууда.'],
  chronology:['Ранние периоды','Early periods','Алгачкы доорлор'],sources:['Использованные источники','Sources used','Колдонулган булактар'],
  selected:['Выберите карточку или отметку на карте.','Select a card or a map marker.','Карточканы же картадагы белгини тандаңыз.'],
  earlier:['← Раньше','← Earlier','← Мурун'],later:['Позже →','Later →','Кийин →'],
  places:['Памятники и центры · политические контуры проходят сверку','Sites and centres · political outlines under review','Эстеликтер жана борборлор · саясий чектер текшерилүүдө'],
  unmapped:['Место или границы требуют отдельной сверки.','Location or boundaries require further review.','Жайгашкан жери же чек арасы өзүнчө текшерүүнү талап кылат.'],
  location:['Показать место','Show location','Жерин көрсөтүү'],view:['Открыть период','Open period','Доорду ачуу'],
  invalid:['Введите целый год: 350000 до н. э. — 2026 н. э.','Enter a whole year: 350000 BCE–2026 CE.','Бүтүн жыл киргизиңиз: б. з. ч. 350000 — б. з. 2026.'],
  geography:['Берега, реки и озёра','Coasts, rivers and lakes','Жээктер, дарыялар жана көлдөр'],
  mapKey:['Заливка — реконструкции территорий; точки — памятники и центры. Голубые отметки — изменения природной среды. Береговая основа современная.','Fills: territorial reconstructions; dots: sites and centres. Blue markers: environmental change. The reference coastline is modern.','Боёк — аймактардын реконструкциялары; чекиттер — эстеликтер жана борборлор. Көк белгилер — табигый чөйрөнүн өзгөрүшү. Негизги жээк сызыгы азыркы.'],
  territory:['Территориальная реконструкция','Territorial reconstruction','Аймактык реконструкция'],frame:['Датировка картографического среза','Date of the map reconstruction','Картографиялык кесимдин датасы'],
  societies:['Археологическая область · несколько обществ','Archaeological region · several societies','Археологиялык аймак · бир нече коом']
 };
 const li=()=>({ru:0,en:1,ky:2})[language]??1;
 const t=k=>labels[k][li()],loc=a=>Array.isArray(a)?a[li()]:a;
 const make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls||'';if(text!==undefined)e.textContent=text;return e;};
 const button=(text,fn)=>{const b=make('button','btn',text);b.type='button';b.onclick=fn;return b;};
 const controls=make('div','ancient-controls');controls.id='ancientControls';controls.dataset.localeOwned='true';$('starsCard').before(controls);
 const jump=make('div','timeline-jump');jump.id='timelineJump';jump.dataset.localeOwned='true';$('eraStrip').before(jump);
 const range=$('yearRange');range.min='0';range.max='10000000';range.step='1';
 function syncRange(){range.value=String(scale.toPosition(year));range.dataset.year=String(year);range.setAttribute('aria-valuetext',cal.format(year,language));}
 range.addEventListener('input',e=>{e.stopImmediatePropagation();stopPlay();renderYear(scale.toYear(Number(range.value)));queueLocationSave();},true);
 range.addEventListener('keydown',e=>{let next;if(['ArrowLeft','ArrowDown'].includes(e.key))next=cal.add(year,-1);else if(['ArrowRight','ArrowUp'].includes(e.key))next=cal.add(year,1);else if(e.key==='Home')next=catalog.range.min;else if(e.key==='End')next=TIMELINE_MAX;else return;e.preventDefault();e.stopImmediatePropagation();stopPlay();renderYear(next);queueLocationSave();},true);
 const entrance=button('',()=>{stopPlay();renderYear(catalog.range.min);switchPanel('events');queueLocationSave();});entrance.id='ancientEntry';entrance.dataset.localeOwned='true';$('eraStrip').prepend(entrance);
 const territoryMap=document.createElementNS(svg.namespaceURI,'g');territoryMap.id='ancientTerritories';territoryMap.dataset.localeOwned='true';viewport.append(territoryMap);
 const map=document.createElementNS(svg.namespaceURI,'g');map.id='ancientLayer';map.dataset.localeOwned='true';viewport.append(map);
 const boundaryEntities=new Map(boundaries.entities.map(e=>[e.id,e])),boundaryPaths=new WeakMap();
 const pathFor=g=>{if(boundaryPaths.has(g))return boundaryPaths.get(g);const d=g.map(p=>p.map(r=>r.map((v,i)=>{const q=project(v);return(i?'L':'M')+q.map(n=>n.toFixed(3)).join(',');}).join('')+'Z').join('')).join('');boundaryPaths.set(g,d);return d;};
 const visibleTerritories=()=>environmentOnly?[]:boundaries.records.filter(r=>r.from<=year&&year<=r.to).sort((a,b)=>b.areaDegrees-a.areaDegrees);
 let selected=null,region='all',environmentOnly=false;
 let deepModalMode=null,deepProfile=null;
 const movementMap=document.createElementNS(svg.namespaceURI,'g');movementMap.id='ancientMovements';viewport.append(movementMap);
 const origins=button('',()=>showOrigins('dispersal'));origins.id='originsBtn';origins.dataset.localeOwned='true';$('kyrgyzHistoryBtn').after(origins);
 const textualMap=document.createElementNS(svg.namespaceURI,'g');textualMap.id='textualPlace';viewport.append(textualMap);
 const textualNote=make('div','textual-place-note');textualNote.id='textualPlaceNote';textualNote.hidden=true;$('mapCard').append(textualNote);
 function clearTextPlace(){textualMap.replaceChildren();textualNote.hidden=true;document.body.classList.remove('textual-place-mode');for(const p of document.querySelectorAll('.scriptural-map-panel'))p.remove();}
 function locateText(r){
  const p=catalog.scriptural.places[r.place];if(!p)return;clearTextPlace();$('modalClose').click();stopPlay();document.body.classList.add('textual-place-mode');
  const [x,y]=project(p.coord),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('transform',`translate(${x},${y})`);
  const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('r',p.precision==='region'?'16':'5');circle.setAttribute('vector-effect','non-scaling-stroke');circle.setAttribute('class',p.precision);g.append(circle);textualMap.append(g);
  textualNote.replaceChildren(make('strong','',loc(r.title)+' · '+loc(p.title)),make('small','',loc(r.dateLabel)),make('p','',loc(p.note)),button(loc(['Убрать отметку','Clear marker','Белгини алып салуу']),clearTextPlace));textualNote.hidden=false;focusLonLat(...p.coord,p.precision==='region'?3:5);
  const info=make('div','scriptural-map-panel');info.dataset.localeOwned='true';info.append(make('h2','',loc(r.title)),make('p','ancient-muted',loc(r.dateLabel)),make('p','ancient-map-key',loc(p.title)+' · '+loc(p.note)),make('p','',loc(r.text)));
  for(const d of r.details||[])info.append(make('p','',loc(d.text)),make('small','ancient-reference',[...new Set([...r.sources,...p.sources,...d.sources])].map(id=>catalog.scriptural.sources[id].title).join(' · ')));
  info.append(button(loc(['Открыть карточку','Open profile','Карточканы ачуу']),()=>{clearTextPlace();showOrigins('prophets',r.id);}));$('panel-selection').append(info);switchPanel('selection');
 }
 function showOrigins(mode='dispersal',profileId=null){
  stopPlay();deepModalMode=mode;deepProfile=profileId;const body=$('modalBody');body.replaceChildren();body.dataset.ancientOwned='true';body.dataset.localeOwned='true';
  body.append(make('h2','',loc(['Истоки · люди, поселения и народы','Origins · people, settlements and societies','Башаттар · адамдар, конуштар жана элдер'])));
  const nav=make('div','origins-tabs');for(const [id,name]of [['dispersal',catalog.trails[0].title],['settlement',catalog.trails[1].title],['prophets',['Пророки и народы','Prophets and peoples','Пайгамбарлар жана элдер']],['peoples',['Государства и переселения','States and migrations','Мамлекеттер жана көчүүлөр']]]){const b=button(loc(name),()=>showOrigins(id));b.setAttribute('aria-pressed',String(mode===id));nav.append(b);}body.append(nav);
  if(mode==='prophets'){
   body.append(make('p','ancient-muted',loc(['Сведения Корана и достоверных хадисов. Дата, место и историческая датировка указаны отдельно. Порядок списка не задаёт календарных дат.','Qur’anic and authentic hadith evidence. Dates, places and historical dating are stated separately. List order does not establish calendar dates.','Куран жана сахих хадистердин маалыматтары. Дата, жер жана тарыхый даталоо өзүнчө көрсөтүлөт. Тизменин тартиби календардык даталарды аныктабайт.'])));
   const focused=catalog.scriptural.records.find(r=>r.id===profileId);
   if(focused){
    body.append(button(loc(['← Все имена и народы','← All names and peoples','← Бардык ысымдар жана элдер']),()=>showOrigins('prophets')));
    const a=make('article','ancient-card scriptural-detail');a.dataset.scripturalRecord=focused.id;
    a.append(make('h3','',loc(focused.title)),make('small','',loc(focused.dateLabel)),make('p','',loc(focused.text)));
    for(const d of focused.details||[]){a.append(make('p','',loc(d.text)),make('small','ancient-reference',[...new Set([...focused.sources,...d.sources])].map(id=>catalog.scriptural.sources[id].title).join(' · ')));}
    a.append(make('p','ancient-muted',loc(focused.placeLabel)));if(focused.place)a.append(button(t('location'),()=>locateText(focused)));
    if(focused.openYear)a.append(button(loc(['Открыть хронологию','Open timeline','Хронологияны ачуу']),()=>{$('modalClose').click();renderYear(focused.openYear);queueLocationSave();}));
    if(focused.related?.length){a.append(make('h4','',loc(['Связанные люди и народы','Related people and societies','Байланышкан адамдар жана элдер'])));const links=make('div','scriptural-related');for(const id of focused.related){const other=catalog.scriptural.records.find(r=>r.id===id);links.append(button(loc(other.title),()=>showOrigins('prophets',id)));}a.append(links);}
    body.append(a);
   }else{
   const search=make('input','origins-search');search.type='search';search.placeholder=loc(['Найти имя или народ','Find a name or people','Ысымды же элди табуу']);search.setAttribute('aria-label',search.placeholder);body.append(search);
   const list=make('div','scriptural-list');body.append(list);
   function fill(){list.replaceChildren();const query=search.value.trim().toLocaleLowerCase();for(const r of catalog.scriptural.records.filter(r=>loc(r.title).toLocaleLowerCase().includes(query))){const a=make('article','ancient-card');a.dataset.scripturalRecord=r.id;a.append(make('h3','',loc(r.title)),make('small','',loc(r.dateLabel)),make('p','',loc(r.text)),button(loc(['Подробнее','Read more','Кеңири окуу']),()=>showOrigins('prophets',r.id)));if(r.place)a.append(button(t('location'),()=>locateText(r)));list.append(a);}if(!list.childElementCount)list.append(make('p','',loc(['Нет совпадений','No matches','Дал келген жок'])));}
   search.oninput=fill;fill();}
  }else if(mode==='peoples'){
   for(const id of catalog.peoplesTrail){const r=catalog.records.find(r=>r.id===id),a=card(r);a.querySelector('button').onclick=()=>{$('modalClose').click();openRecord(r);};body.append(a);}
  }else{
   body.append(make('p','ancient-muted',loc(['Выберите свидетельство — карта откроет его период и место. Последовательность находок не означает путь одной группы людей.','Choose evidence to open its period and place. The sequence of finds is not the journey of a single group.','Далилди тандаңыз — карта анын мезгилин жана жерин ачат. Табылгалардын ирети бир топтун көч жолун билдирбейт.'])));
   for(const id of catalog.trails.find(t=>t.id===mode).records){const r=catalog.records.find(r=>r.id===id),a=card(r,true);for(const b of a.querySelectorAll('button'))b.remove();a.append(button(t('view'),()=>{$('modalClose').click();openRecord(r);}));body.append(a);}
  }
  $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;nav.querySelector('[aria-pressed=true]').focus({preventScroll:true});
 }
 $('futureBtn').addEventListener('click',clearTextPlace,true);
 const active=y=>catalog.records.filter(r=>r.from<=y&&y<r.to&&(region==='all'||r.region===region)&&(!environmentOnly||r.kind==='environment')).sort((a,b)=>b.from-a.from||a.id.localeCompare(b.id));
 const period=r=>r.dateLabel?loc(r.dateLabel):(r.approx?loc(['ок. ','c. ','болж. ']):'')+cal.range(r.from,r.kind==='event'?r.from:r.to,language);
 function panel(id){let p=$(id).querySelector('.ancient-panel');if(!p){p=make('div','ancient-panel');p.dataset.localeOwned='true';$(id).append(p);}p.replaceChildren();return p;}
 function focusMovement(m){const [a,b]=m.endpoints.map(p=>p.coord);focusLonLat((a[0]+b[0])/2,(a[1]+b[1])/2,Math.abs(a[0]-b[0])>15?4:7);}
 function openRecord(r){stopPlay();clearTextPlace();selected=r.id;region='all';environmentOnly=false;if(!(r.from<=year&&year<r.to))renderYear(Math.max(catalog.range.min,r.from));else{renderPanels();draw();}switchPanel('selection');const movement=catalog.movements.find(m=>m.id===r.movementId);if(movement)focusMovement(movement);else if(r.coord)focusLonLat(...r.coord,r.kind==='environment'?3:5);queueLocationSave();}
 function card(r,details=false){
  const box=make('article','ancient-card');box.dataset.ancientRecord=r.id;box.dataset.localeOwned='true';
  box.append(make('small','',period(r)),make('h3','',loc(r.title)),make('p','',loc(r.text)));
  if(r.timeMeaning==='dating-window')box.append(make('small','ancient-muted',loc(['Интервал датировки находки','Dating window of the evidence','Табылган далилдин даталоо аралыгы'])));
  if(r.coordinatePrecision==='regional-reference')box.append(make('small','ancient-muted',loc(['На карте: ориентир в районе находки','Map: a reference in the find region','Картада: табылган аймактагы багыт'])));
  if(details){box.append(make('small','ancient-reference',r.sources.map(id=>catalog.sources[id].title).join(' · ')));
   if(r.movementId){const m=catalog.movements.find(m=>m.id===r.movementId);box.append(make('p','ancient-map-key',loc(m.caption)),button(loc(['Показать направление','Show connection','Багытты көрсөтүү']),()=>{selected=r.id;draw();focusMovement(m);}));}
   if(r.territoryId){const territory=visibleTerritories().find(t=>t.id===r.territoryId);if(territory)box.append(button(loc(['Выделить территорию','Highlight territory','Аймакты бөлүп көрсөтүү']),()=>{selected='territory:'+territory.id;renderPanels();draw();focusLonLat(...territory.anchor,4);}));}
   if(r.coord)box.append(button(t('location'),()=>focusLonLat(...r.coord,5)));else box.append(make('p','ancient-muted',t('unmapped')));
  }else box.append(button(t('view'),()=>openRecord(r)));
  return box;
 }
 function showKyrgyz(){
  const body=$('modalBody');body.replaceChildren();body.dataset.ancientOwned='true';
  body.append(make('h2','',t('kyrgyz')));
  for(const r of catalog.records.filter(r=>r.kyrgyz)){const c=card(r,true);c.append(button(t('view'),()=>{$('modalClose').click();openRecord(r);}));body.append(c);}
  $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;body.querySelector('button')?.focus({preventScroll:true});
 }
 function renderControls(){
  if(year<610&&$('worldExploreBtn')){$('worldExploreBtn').textContent=loc(['Мир','World','Дүйнө']);$('worldExploreBtn').title=loc(['Параллельная история мира','Parallel world history','Дүйнөнүн параллелдүү тарыхы']);}
  controls.replaceChildren(make('div','section-label',t('preview')));
  const form=make('form','ancient-year-form unified-year-form'),label=make('label','',t('year')),input=make('input',''),era=make('select','');
  input.type='number';input.min='1';input.max='350000';input.step='1';input.value=String(Math.abs(year));input.id='ancientYear';label.htmlFor=input.id;
  era.id='ancientEra';era.setAttribute('aria-label',loc(['Эра','Era','Заман']));
  labels.era[li()].forEach((v,i)=>{const opt=make('option','',v);opt.value=i?'CE':'BCE';era.append(opt);});era.value=year<0?'BCE':'CE';
  const submit=make('button','btn',t('go'));submit.type='submit';const error=make('span','ancient-error');error.setAttribute('role','status');
  form.append(label,input,era,submit,error);form.onsubmit=e=>{e.preventDefault();const n=cal.parse(input.value),y=era.value==='BCE'?-n:n;if(n===null||n<1||y<catalog.range.min||y>TIMELINE_MAX){error.textContent=t('invalid');return;}stopPlay();renderYear(y);queueLocationSave();};
  const step=delta=>{stopPlay();renderYear(cal.add(year,delta));const b=$(delta<0?'previousYear':'nextYear');(b.disabled?$('ancientYear'):b).focus({preventScroll:true});queueLocationSave();};
  const previous=button('−',()=>step(-1)),next=button('+',()=>step(1));
  previous.id='previousYear';next.id='nextYear';previous.disabled=year===catalog.range.min;next.disabled=year===TIMELINE_MAX;
  previous.setAttribute('aria-label',loc(['Предыдущий год','Previous year','Мурунку жыл']));next.setAttribute('aria-label',loc(['Следующий год','Next year','Кийинки жыл']));
  previous.title=previous.getAttribute('aria-label');next.title=next.getAttribute('aria-label');
  form.prepend(previous);form.append(next);jump.replaceChildren(form,make('small','timeline-scale-note',loc(['Единая шкала · неравномерный масштаб','One timeline · variable scale','Бирдиктүү шкала · өзгөрмө масштаб'])));
  origins.textContent=loc(['Истоки','Origins','Башаттар']);origins.title=loc(['Расселение, земледелие, пророки и народы','Dispersal, farming, prophets and peoples','Таралуу, дыйканчылык, пайгамбарлар жана элдер']);
  const nav=make('div','ancient-nav'),steps=catalog.milestones;
  for(const [y,label]of [[steps.filter(v=>v<year).at(-1),t('earlier')],[steps.find(v=>v>year),t('later')]])if(y!==undefined)nav.append(button(label+' · '+cal.format(y,language),()=>{stopPlay();renderYear(y);queueLocationSave();}));
  nav.append(button(t('kyrgyz'),showKyrgyz));controls.append(nav);
  const geography=button(t('geography'),()=>{environmentOnly=!environmentOnly;renderControls();renderPanels();draw();switchPanel('events');});geography.id='ancientEnvironment';geography.setAttribute('aria-pressed',String(environmentOnly));nav.append(geography);
 }
 function draw(){
  map.replaceChildren();
  territoryMap.replaceChildren();
  for(const r of visibleTerritories()){
   const e=boundaryEntities.get(r.id),shape=document.createElementNS(svg.namespaceURI,'path');shape.setAttribute('d',pathFor(r.geometry));shape.setAttribute('fill-rule','evenodd');shape.setAttribute('vector-effect','non-scaling-stroke');shape.dataset.ancientTerritory=r.id;
   const hue=[...r.id].reduce((n,c)=>n+c.charCodeAt(0),0)%360;shape.style.fill=`hsl(${hue} 25% 55%)`;shape.setAttribute('role','button');shape.setAttribute('tabindex','0');shape.setAttribute('aria-label',loc(e.title));
   const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=loc(e.title);shape.append(title);
   shape.classList.toggle('ancient-territory-selected',selected==='territory:'+r.id);
   const choose=()=>{selected='territory:'+r.id;renderPanels();draw();switchPanel('selection');};shape.addEventListener('pointerdown',e=>e.stopPropagation());shape.onclick=e=>{e.stopPropagation();choose();};shape.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};territoryMap.append(shape);
   const [x,y]=project(r.anchor),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('transform',`translate(${x},${y})`);g.dataset.ancientLabel=r.id;
   const inner=document.createElementNS(svg.namespaceURI,'g');inner.classList.add('ancient-marker-content');inner.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);
   const text=document.createElementNS(svg.namespaceURI,'text');text.textContent=loc(e.title);text.setAttribute('text-anchor','middle');text.classList.add('ancient-territory-label');inner.append(text);g.append(inner);map.append(g);
  }
  for(const s of boundaries.cartographicSeams.filter(s=>s.from<=year&&year<=s.to&&!environmentOnly)){const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',pathFor(s.geometry));p.setAttribute('class','ancient-boundary-band');territoryMap.append(p);}
  for(const r of active(year).filter(r=>r.coord)){
   const [x,y]=project(r.coord),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('transform',`translate(${x},${y})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',loc(r.title));g.dataset.ancientMarker=r.id;g.dataset.ancientKind=r.kind;
   // Nested inverse scale keeps labels legible without growing over the atlas.
   const inner=document.createElementNS(svg.namespaceURI,'g');inner.classList.add('ancient-marker-content');inner.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);
   const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('r','4');
   const text=document.createElementNS(svg.namespaceURI,'text');text.setAttribute('x','8');text.setAttribute('y','4');text.textContent=loc(r.title);
   const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=loc(r.title);inner.append(circle,text,title);g.append(inner);if(r.kind==='environment'){const ring=document.createElementNS(svg.namespaceURI,'circle');ring.setAttribute('r','11');ring.setAttribute('class','environment-halo');inner.prepend(ring);}
   const choose=()=>{selected=r.id;renderPanels();draw();switchPanel('selection');};g.addEventListener('pointerdown',e=>e.stopPropagation());g.onclick=e=>{e.stopPropagation();choose();};g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};map.append(g);
  }drawMovement();arrangeLabels();
 }
 function drawMovement(){
  movementMap.replaceChildren();const m=catalog.movements.find(m=>m.record===selected&&m.from<=year&&year<m.to);if(!m||environmentOnly)return;
  const ns=svg.namespaceURI,[a,b]=m.endpoints.map(p=>project(p.coord)),defs=document.createElementNS(ns,'defs'),marker=document.createElementNS(ns,'marker');marker.id='ancientArrow';for(const [k,v]of Object.entries({viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto'}))marker.setAttribute(k,v);const tip=document.createElementNS(ns,'path');tip.setAttribute('d','M0 0 L10 5 L0 10Z');tip.setAttribute('fill','#603c17');marker.append(tip);defs.append(marker);movementMap.append(defs);
  const p=document.createElementNS(ns,'path');p.dataset.ancientMovement=m.id;p.setAttribute('class','ancient-movement-line');p.setAttribute('d',`M${a} L${b}`);p.setAttribute('marker-end','url(#ancientArrow)');p.setAttribute('vector-effect','non-scaling-stroke');movementMap.append(p);
  for(let i=0;i<2;i++){const g=document.createElementNS(ns,'g');g.setAttribute('transform',`translate(${i?b:a})`);const inner=document.createElementNS(ns,'g');inner.classList.add('ancient-movement-label');const dot=document.createElementNS(ns,'circle');dot.setAttribute('r','4');const label=document.createElementNS(ns,'text');label.setAttribute('x','8');label.setAttribute('y',i?'18':'-8');label.textContent=loc(m.endpoints[i].title);inner.append(dot,label);g.append(inner);movementMap.append(g);}resizeMovements();
 }
 function resizeMovements(){for(const g of movementMap.querySelectorAll('.ancient-movement-label'))g.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);}
 function arrangeLabels(){const occupied=[...movementMap.querySelectorAll('text')].map(e=>e.getBoundingClientRect());const rect=svg.getBoundingClientRect();for(const g of map.querySelectorAll('[data-ancient-label],[data-ancient-marker]')){const label=g.querySelector('text');label.style.visibility='visible';const box=label.getBoundingClientRect();const visible=box.left>=rect.left+6&&box.right<=rect.right-6&&box.top>=rect.top+6&&box.bottom<=rect.bottom-6;const collision=occupied.some(b=>box.left<b.right+8&&box.right>b.left-8&&box.top<b.bottom+3&&box.bottom>b.top-3);if(!visible||collision)label.style.visibility='hidden';else occupied.push(box);}}
 function renderPanels(){
  const events=panel('panel-events');events.append(make('h2','',environmentOnly?t('geography'):t('current')),make('p','ancient-muted',cal.format(year,language)),make('p','ancient-map-key',year<-7000?loc(['Точки — места свидетельств; интервалы древнейших дат округлены. Современная береговая линия служит ориентиром.','Dots locate evidence; the earliest dating windows are rounded. Modern coastlines provide a reference.','Чекиттер — далил табылган жерлер; эң байыркы даталардын аралыгы тегеректелген. Азыркы жээктер багыт берет.']):t('mapKey')));
  const records=active(year);if(!records.length)events.append(make('p','',t('empty')));for(const r of records)events.append(card(r));
  const regions=panel('panel-regions');regions.append(make('h2','',loc(['Регионы мира','World regions','Дүйнө аймактары'])));
  const select=make('select','');select.setAttribute('aria-label',t('all'));for(const [id,name]of [['all',t('all')],...WORLD_HISTORY.regions.map(r=>[r.id,loc(r.name)])]){const o=make('option','',name);o.value=id;select.append(o);}select.value=region;select.onchange=()=>{region=select.value;renderPanels();draw();};regions.append(select);
  for(const r of records)regions.append(card(r));
  const compare=panel('panel-compare');compare.append(make('h2','',t('chronology')));for(const r of catalog.records.filter(r=>region==='all'||r.region===region))compare.append(card(r));
  const sources=panel('panel-sources');sources.append(make('h2','',t('sources')));const books=new Set(catalog.records.flatMap(r=>r.sources).map(id=>catalog.sources[id].title));for(const book of books)sources.append(make('p','ancient-reference',book));
  sources.append(make('p','ancient-reference',boundaries.source.title));
  for(const book of new Set(boundaries.corrections.flatMap(c=>c.sources.map(s=>s.title))))sources.append(make('p','ancient-reference',book));
  const license=make('a','ancient-reference',boundaries.source.license);license.href=boundaries.source.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';sources.append(license);
  const selection=panel('panel-selection'),record=catalog.records.find(r=>r.id===selected&&r.from<=year&&year<r.to),territory=visibleTerritories().find(r=>'territory:'+r.id===selected);
  if(record)selection.append(card(record,true));else if(territory){const e=boundaryEntities.get(territory.id);selection.append(make('h2','',loc(e.title)),make('p','',e.kind==='culture'||e.kind==='polities'?t('societies'):t('territory')),make('p','',t('frame')+': '+cal.format(territory.controlEvent??territory.sourceFrom,language)),make('p','ancient-reference',boundaries.source.title));}else selection.append(make('p','',t('selected')));
 }
 const baseViewport=setViewport;
 const baseWorldRender=renderWorldHistory;
 renderWorldHistory=function(){if(year>=610)return baseWorldRender();};
 const baseActiveEvent=activeEvent;
 activeEvent=function(y){if(y>=610)return baseActiveEvent(y);return {title:t('title'),desc:t('current'),ah:labels.era[li()][y<0?0:1],place:t('title'),type:t('title'),coord:null,world:[]};};
 setViewport=function(){baseViewport();if(year<610){for(const g of map.querySelectorAll('.ancient-marker-content'))g.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);resizeMovements();arrangeLabels();}};
 window.addEventListener('resize',()=>{if(year<610)setViewport();});
 $('kyrgyzHistoryBtn').addEventListener('click',e=>{if(year<610){e.stopImmediatePropagation();showKyrgyz();}},true);
 renderYear=function(value){
  let target=Number(value);if(target===0)target=year<0?1:-1;if(!cal.valid(target))return;target=Math.max(catalog.range.min,Math.min(TIMELINE_MAX,target));
  clearTextPlace();const ancient=target<610;document.body.classList.toggle('ancient-mode',ancient);
  if(!ancient){for(const id of ['mapYear','timelineYear','mapAh','timelineAh']){delete $(id).dataset.localeOwned;$(id).removeAttribute('aria-label');}baseRender(target);renderControls();syncRange();return;}
  if(typeof mapTransitionCleanup==='function')mapTransitionCleanup();selectedEmpire=null;year=target;
  $('yearRange').value=String(year);$('yearRange').setAttribute('aria-valuetext',cal.format(year,language));
  for(const id of ['mapYear','timelineYear']){$(id).dataset.localeOwned='true';$(id).textContent=String(Math.abs(year));$(id).setAttribute('aria-label',cal.format(year,language));}
  for(const id of ['mapAh','timelineAh']){$(id).dataset.localeOwned='true';$(id).textContent=labels.era[li()][year<0?0:1]+' · '+t('title');}
  const note=document.querySelector('.map-slice-note');if(note)note.textContent=t('places');
  renderControls();renderPanels();draw();syncRange();
 };
 nextPlaybackYear=function(y){if(y>=610)return baseNext(y);let step=y<-100000?10000:y<-20000?2000:y<-7000?500:y<-1000?100:y<1?25:y<500?10:1;let target=Math.min(610,cal.add(y,step));const next=catalog.milestones.find(v=>v>y);if(next!==undefined&&next<target)target=next;return target;};
 function ticks(){entrance.textContent=cal.format(catalog.range.min,language)+' · '+loc(['Ранние люди','Early humans','Алгачкы адамдар']);$('ticks').replaceChildren();for(const y of [catalog.range.min,-100000,-20000,-7000,1,1300,TIMELINE_MAX]){const e=make('span','tick-label',cal.format(y,language));e.style.left=(scale.toPosition(y)/100000)+'%';$('ticks').append(e);}const hint=document.querySelector('.timeline-hint');if(hint){hint.dataset.localeOwned='true';hint.textContent=cal.format(catalog.range.min,language)+' — '+cal.format(TIMELINE_MAX,language);}}
 localeSelect.addEventListener('change',()=>{renderYear(year);ticks();if($('modal').classList.contains('show')){if(deepModalMode)showOrigins(deepModalMode,deepProfile);else if($('modalBody').querySelector('.ancient-card'))showKyrgyz();}});
 $('modalClose').addEventListener('click',()=>{deepModalMode=null;if($('modalBody').dataset.ancientOwned){delete $('modalBody').dataset.ancientOwned;delete $('modalBody').dataset.localeOwned;}});
 const incoming=cal.parse(new URLSearchParams(location.search).get('year'));
 if(incoming!==null&&incoming>=catalog.range.min&&incoming<610)renderYear(incoming);else renderControls();ticks();syncRange();
 const query=new URLSearchParams(location.search),requestedOrigins=query.get('origins');if(['prophets','dispersal','settlement','peoples'].includes(requestedOrigins))showOrigins(requestedOrigins,query.get('prophet'));
 const requestedRecord=catalog.records.find(r=>r.id===query.get('ancient')&&(incoming===null||(r.from<=incoming&&incoming<r.to)));if(requestedRecord)requestAnimationFrame(()=>openRecord(requestedRecord));
})();
