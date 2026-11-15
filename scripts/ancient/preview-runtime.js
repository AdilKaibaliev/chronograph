// Ancient overview. The existing renderer owns every year >=610.
(()=>{
 const cal=ancientCalendar,scale=ancientTimeScale,catalog=ANCIENT_PREVIEW,boundaries=ANCIENT_BOUNDARIES,continuity=ANCIENT_CONTINUITY,baseRender=renderYear,baseNext=nextPlaybackYear;
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
  geography:['Берега и ледники','Coasts and ice sheets','Жээктер жана муз калкандары'],
  mapKey:['Заливка — реконструкции территорий; точки — памятники и центры. Природная карта показывает берега и ледники по датированным срезам.','Fills: territorial reconstructions; dots: sites and centres. The landscape map shows coasts and ice in dated frames.','Боёк — аймактардын реконструкциялары; чекиттер — эстеликтер жана борборлор. Табигый карта жээктер менен муздарды даталанган кесимдерде көрсөтөт.'],
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
 const territoryMap=document.createElementNS(svg.namespaceURI,'g');territoryMap.id='ancientTerritories';territoryMap.dataset.localeOwned='true';viewport.insertBefore(territoryMap,empireLabelLayer);
 const map=document.createElementNS(svg.namespaceURI,'g');map.id='ancientLayer';map.dataset.localeOwned='true';viewport.append(map);
 const boundaryEntities=new Map(boundaries.entities.map(e=>[e.id,e])),boundaryPaths=new WeakMap();
 const sharedStateIds={'roman-east':'byzantine',sasanian:'sasanian',sui:'sui','turk-west':'westernTurkic','turk-east':'easternTurkic',franks:'franks',visigoth:'visigoths',lombard:'lombards',aksum:'aksum'};
 const sharedWorldIds={makuria:'dongola',alodia:'alwa'};
 const ancientAppearance=id=>{const e=EMPIRES.find(e=>e.id===sharedStateIds[id]);if(e)return {color:e.color,title:translate(e.id==='easternTurkic'?e.name:e.short,language)};const a=WORLD_HISTORY.areas.find(a=>a.entry===sharedWorldIds[id]);return {color:a?.color,title:a?loc(a.name).split(' · ')[0]:null};};
 const pathFor=g=>{if(boundaryPaths.has(g))return boundaryPaths.get(g);const d=g.map(p=>p.map(r=>r.map((v,i)=>{const q=project(v);return(i?'L':'M')+q.map(n=>n.toFixed(3)).join(',');}).join('')+'Z').join('')).join('');boundaryPaths.set(g,d);return d;};
 const visibleTerritories=()=>environmentOnly&&year<610?[]:(year<610?boundaries.records.filter(r=>r.from<=year&&year<=r.to).map(r=>{const bridge=continuity.bridges.find(b=>b.id===r.id&&b.from<=year&&year<=b.to);return bridge?{...r,...bridge}:r;}):continuity.supplement.records.filter(r=>r.from<=year&&year<=r.to)).sort((a,b)=>b.areaDegrees-a.areaDegrees);
 let selected=null,region='all',environmentOnly=false;
 let deepModalMode=null,deepProfile=null,historyTopic=null;
 const movementMap=document.createElementNS(svg.namespaceURI,'g');movementMap.id='ancientMovements';viewport.append(movementMap);
 const origins=button('',()=>showOrigins('dispersal'));origins.id='originsBtn';origins.dataset.localeOwned='true';$('kyrgyzHistoryBtn').after(origins);
 const textualMap=document.createElementNS(svg.namespaceURI,'g');textualMap.id='textualPlace';viewport.append(textualMap);
 const textualNote=make('div','textual-place-note');textualNote.id='textualPlaceNote';textualNote.hidden=true;$('mapCard').append(textualNote);
 function clearTextPlace(){textualMap.replaceChildren();textualNote.hidden=true;document.body.classList.remove('textual-place-mode');for(const p of document.querySelectorAll('.scriptural-map-panel'))p.remove();}
 function profileFacts(r){
  const box=make('div','scriptural-facts');
  for(const [label,value]of [[loc(['Время','Time','Убакыт']),loc(r.dateLabel)],[loc(['Народ','People','Эл']),r.audience&&loc(r.audience)],[loc(['Местность','Location','Жер']),loc(r.placeLabel)]])if(value){const row=make('p','');row.append(make('strong','',label+': '),document.createTextNode(value));box.append(row);}
  for(const relation of r.chronologyRelations||[])box.append(make('p','scriptural-relation',loc(relation.title)+' · '+catalog.scriptural.sources[relation.source].title));
  return box;
 }
 function locateText(r){
  const p=catalog.scriptural.places[r.place];if(!p)return;clearTextPlace();$('modalClose').click();stopPlay();document.body.classList.add('textual-place-mode');
  const [x,y]=project(p.coord),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('transform',`translate(${x},${y})`);
  const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('r',p.precision==='region'?'16':'5');circle.setAttribute('vector-effect','non-scaling-stroke');circle.setAttribute('class',p.precision);g.append(circle);
  const labelGroup=document.createElementNS(svg.namespaceURI,'g');labelGroup.classList.add('textual-map-label');const label=document.createElementNS(svg.namespaceURI,'text');label.setAttribute('text-anchor','middle');label.setAttribute('y','-24');label.textContent=loc(r.title)+' · '+loc(p.title).split(' · ')[0];labelGroup.append(label);g.append(labelGroup);textualMap.append(g);
  textualNote.replaceChildren(make('strong','',loc(r.title)+' · '+loc(p.title)),make('small','',loc(r.dateLabel)),make('p','',loc(p.note)),button(loc(['Убрать отметку','Clear marker','Белгини алып салуу']),clearTextPlace));textualNote.hidden=false;focusLonLat(...p.coord,p.precision==='region'?3:5);
  const info=make('div','scriptural-map-panel');info.dataset.localeOwned='true';info.append(make('h2','',loc(r.title)),profileFacts(r),make('p','ancient-map-key',loc(p.title)+' · '+loc(p.note)),make('p','',loc(r.text)));
  for(const d of r.details||[])info.append(make('p','',loc(d.text)),make('small','ancient-reference',[...new Set([...r.sources,...p.sources,...d.sources])].map(id=>catalog.scriptural.sources[id].title).join(' · ')));
  info.append(button(loc(['Открыть карточку','Open profile','Карточканы ачуу']),()=>{clearTextPlace();showOrigins('prophets',r.id);}));$('panel-selection').append(info);switchPanel('selection');
 }
 function showOrigins(mode='dispersal',profileId=null){
  stopPlay();historyTopic=null;deepModalMode=mode;deepProfile=profileId;const body=$('modalBody');body.replaceChildren();body.dataset.ancientOwned='true';body.dataset.localeOwned='true';
  body.append(make('h2','',loc(['Истоки · люди, поселения и народы','Origins · people, settlements and societies','Башаттар · адамдар, конуштар жана элдер'])));
  const nav=make('div','origins-tabs');for(const [id,name]of [['dispersal',catalog.trails[0].title],['settlement',catalog.trails[1].title],['prophets',['Пророки и народы','Prophets and peoples','Пайгамбарлар жана элдер']],['peoples',['Государства и переселения','States and migrations','Мамлекеттер жана көчүүлөр']]]){const b=button(loc(name),()=>showOrigins(id));b.setAttribute('aria-pressed',String(mode===id));nav.append(b);}body.append(nav);
  if(mode==='prophets'){
   body.append(make('p','ancient-muted',loc(['Коран, достоверные хадисы и тафсир Ибн Касира. Для каждого имени указаны время, народ и местность по источникам. Где календарный год неизвестен, показаны подтверждённые связи между людьми и поколениями.','The Qur’an, authentic hadith and Ibn Kathir’s tafsir. Each profile identifies its source-based time, people and location. Where calendar dates are unknown, documented relationships between people and generations are shown.','Куран, сахих хадистер жана Ибн Касирдин тафсири. Ар бир карточкада булактар боюнча убакыт, эл жана жер көрсөтүлгөн. Календардык жыл белгисиз болсо, адамдар менен муундардын тастыкталган байланыштары берилет.'])));
   body.append(make('small','ancient-reference',catalog.scriptural.sources['prophetic-chronology'].title));
   const focused=catalog.scriptural.records.find(r=>r.id===profileId);
   if(focused){
    body.append(button(loc(['← Все имена и народы','← All names and peoples','← Бардык ысымдар жана элдер']),()=>showOrigins('prophets')));
    const a=make('article','ancient-card scriptural-detail');a.dataset.scripturalRecord=focused.id;
    a.append(make('h3','',loc(focused.title)),profileFacts(focused),make('p','',loc(focused.text)));
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
 function openRecord(r){stopPlay();clearTextPlace();selected=r.id;region='all';environmentOnly=false;if(!(r.from<=year&&year<r.to))renderYear(Math.max(catalog.range.min,r.from));else{renderPanels();draw();}switchPanel('selection');const movement=catalog.movements.find(m=>m.id===r.movementId);if(movement)focusMovement(movement);else if(r.coord)focusLonLat(...r.coord,r.kind==='environment'?3:5);else if(r.geographicReferences?.length){const ps=r.geographicReferences;focusLonLat(ps.reduce((s,p)=>s+p.coord[0],0)/ps.length,ps.reduce((s,p)=>s+p.coord[1],0)/ps.length,4);}queueLocationSave();}
 function card(r,details=false){
  const box=make('article','ancient-card');box.dataset.ancientRecord=r.id;box.dataset.localeOwned='true';
  box.append(make('small','',period(r)),make('h3','',loc(r.title)),make('p','',loc(r.text)));
  if(r.timeMeaning==='dating-window')box.append(make('small','ancient-muted',loc(['Интервал датировки находки','Dating window of the evidence','Табылган далилдин даталоо аралыгы'])));
  if(r.coordinatePrecision==='regional-reference')box.append(make('small','ancient-muted',loc(['На карте: ориентир в районе находки','Map: a reference in the find region','Картада: табылган аймактагы багыт'])));
  if(details&&r.geographyCaption)box.append(make('p','ancient-map-key',loc(r.geographyCaption)));
  if(details){box.append(make('small','ancient-reference',r.sources.map(id=>catalog.sources[id].title).join(' · ')));
   for(const p of r.passages||[]){const quote=make('blockquote','ancient-primary-text',p.text+(p.geography?' '+p.geography:''));quote.lang='zh';box.append(quote,make('small','ancient-reference',catalog.sources[p.source].title));}
   if(r.movementId){const m=catalog.movements.find(m=>m.id===r.movementId);box.append(make('p','ancient-map-key',loc(m.caption)),button(loc(['Показать направление','Show connection','Багытты көрсөтүү']),()=>{selected=r.id;draw();focusMovement(m);}));}
   if(r.territoryId){const territory=visibleTerritories().find(t=>t.id===r.territoryId);if(territory)box.append(button(loc(['Выделить территорию','Highlight territory','Аймакты бөлүп көрсөтүү']),()=>{selected='territory:'+territory.id;renderPanels();draw();focusLonLat(...territory.anchor,4);}));}
   if(r.geographicReferences?.length){for(const ref of r.geographicReferences){const b=button(loc(ref.title),()=>{$('modalClose').click();openRecord(r);focusLonLat(...ref.coord,4);});b.dataset.ancientGeographyTarget=ref.id;box.append(b);}}
   else if(r.coord)box.append(button(t('location'),()=>focusLonLat(...r.coord,5)));else box.append(make('p','ancient-muted',t('unmapped')));
  }else box.append(button(t('view'),()=>openRecord(r)));
  return box;
 }
 function showKyrgyz(){
  stopPlay();deepModalMode=null;historyTopic='kyrgyz';const body=$('modalBody');body.replaceChildren();body.dataset.ancientOwned='true';body.dataset.localeOwned='true';
  body.append(make('h2','',t('kyrgyz')));
  for(const r of catalog.records.filter(r=>r.kyrgyz)){const c=card(r,true);c.append(button(t('view'),()=>{$('modalClose').click();openRecord(r);}));body.append(c);}
  $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;body.querySelector('button')?.focus({preventScroll:true});
 }
 function showChina(){
  stopPlay();deepModalMode=null;historyTopic='china';const body=$('modalBody');body.replaceChildren();body.dataset.ancientOwned='true';body.dataset.localeOwned='true';
  body.append(make('h2','',loc(['Китай · поселения, царства и империи','China · settlements, states and empires','Кытай · конуштар, падышалыктар жана империялар'])));
  const reference=make('details','china-reference');reference.append(make('summary','',loc(catalog.chinaReference.title)));
  const illustration=make('img','');illustration.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(catalog.chinaReference.svg);illustration.alt=loc(catalog.chinaReference.title);reference.append(illustration);
  const legend=make('div','china-reference-legend');for(const [color,title]of catalog.chinaReference.legend){const item=make('span','',loc(title)),swatch=make('i','');swatch.style.background=color;item.prepend(swatch);legend.append(item);}reference.append(legend,make('small','ancient-reference',catalog.chinaReference.source),button(loc(['Открыть 250 год до н. э. на общей карте','Open 250 BCE on the world map','Жалпы картада б. з. ч. 250-жылды ачуу']),()=>{$('modalClose').click();stopPlay();renderYear(-250);focusLonLat(113,35,4);queueLocationSave();}));body.append(reference);
  for(const r of catalog.records.filter(r=>catalog.chinaTrail.includes(r.id))){const a=card(r,true);for(const b of a.querySelectorAll('button'))b.remove();a.append(button(t('view'),()=>{$('modalClose').click();openRecord(r);}));body.append(a);}
  $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;body.querySelector('button')?.focus({preventScroll:true});
 }
 function chooseTerritory(r,focus=true){selected='territory:'+r.id;clearTextPlace();renderPanels();draw();switchPanel('selection');if(focus)focusLonLat(...r.anchor,4);}
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
  // The parallel-history row is part of the timeline at every date. Removing
  // it before 610 changed the SVG's physical scale despite an unchanged camera.
  if(year<610){const line=$('kyrgyzParallel');line.textContent=loc(['История кыргызов · ранние свидетельства','Kyrgyz history · early evidence','Кыргыз тарыхы · алгачкы маалыматтар']);line.title=line.textContent;}
  const nav=make('div','ancient-nav'),steps=catalog.milestones;
  for(const [y,label]of [[steps.filter(v=>v<year).at(-1),t('earlier')],[steps.find(v=>v>year),t('later')]])if(y!==undefined)nav.append(button(label+' · '+cal.format(y,language),()=>{stopPlay();renderYear(y);queueLocationSave();}));
  controls.append(nav);
  const topics=make('div','ancient-topics');for(const [id,title,fn]of [['ancientProphets',loc(['Пророки и народы','Prophets and peoples','Пайгамбарлар жана элдер']),()=>showOrigins('prophets')],['ancientChina',loc(['Китай','China','Кытай']),showChina],['ancientKyrgyz',loc(['Кыргызы','Kyrgyz','Кыргыздар']),showKyrgyz]]){const b=button(title,fn);b.id=id;topics.append(b);}controls.append(topics);
  const geography=button(t('geography'),()=>document.dispatchEvent(new CustomEvent('chronograph:paleo-open')));geography.id='ancientEnvironment';nav.append(geography);
 }
 function draw(){
  map.replaceChildren();
  territoryMap.replaceChildren();
  document.body.classList.toggle('continuity-map',year>=610&&visibleTerritories().length>0);
  for(const r of visibleTerritories()){
   const e=boundaryEntities.get(r.id),shape=document.createElementNS(svg.namespaceURI,'path');shape.setAttribute('d',pathFor(r.geometry));shape.setAttribute('fill-rule','evenodd');shape.setAttribute('vector-effect','non-scaling-stroke');shape.dataset.ancientTerritory=r.id;
   const appearance=ancientAppearance(r.id),hue=[...r.id].reduce((n,c)=>n+c.charCodeAt(0),0)%360;shape.style.fill=appearance.color||`hsl(${hue} 25% 55%)`;shape.style.setProperty('--ancient-stroke',appearance.color||'#615747');shape.style.setProperty('--ancient-opacity',String(overlayOpacity));shape.setAttribute('role','button');shape.setAttribute('tabindex','0');shape.setAttribute('aria-label',loc(e.title));
   const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=loc(e.title);shape.append(title);
   shape.classList.toggle('ancient-territory-selected',selected==='territory:'+r.id);
   if(r.legacyId)clipPoliticalPath(shape,r.legacyId,610);else if(r.entry)clipPoliticalPath(shape,r.entry,610);
   const choose=()=>{selectedEmpire=null;worldState.area='';worldState.selected='';for(const p of empireLayer.querySelectorAll('.selected'))p.classList.remove('selected');if(year>=610)renderWorldHistory();selected='territory:'+r.id;document.body.classList.toggle('continuity-selection',year>=610);renderPanels();draw();switchPanel('selection');};bindMapAction(shape,choose);territoryMap.append(shape);
   const [x,y]=project(r.anchor),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('transform',`translate(${x},${y})`);g.dataset.ancientLabel=r.id;
   const inner=document.createElementNS(svg.namespaceURI,'g');inner.classList.add('ancient-marker-content');inner.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);
   const text=document.createElementNS(svg.namespaceURI,'text');text.textContent=appearance.title||loc(e.title);text.setAttribute('text-anchor','middle');text.classList.add('ancient-territory-label');inner.append(text);g.append(inner);map.append(g);
  }
  for(const s of boundaries.cartographicSeams.filter(s=>s.from<=year&&year<=s.to&&!environmentOnly)){const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',pathFor(s.geometry));p.setAttribute('class','ancient-boundary-band');territoryMap.append(p);}
  for(const r of (year<610?active(year):[]).filter(r=>r.coord)){
   const [x,y]=project(r.coord),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('transform',`translate(${x},${y})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',loc(r.title));g.dataset.ancientMarker=r.id;g.dataset.ancientKind=r.kind;
   // Nested inverse scale keeps labels legible without growing over the atlas.
   const inner=document.createElementNS(svg.namespaceURI,'g');inner.classList.add('ancient-marker-content');inner.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);
   const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('r','4');
   const text=document.createElementNS(svg.namespaceURI,'text');text.setAttribute('x','8');text.setAttribute('y','4');text.textContent=loc(r.title);
   const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=loc(r.title);inner.append(circle,text,title);g.append(inner);if(r.kind==='environment'){const ring=document.createElementNS(svg.namespaceURI,'circle');ring.setAttribute('r','11');ring.setAttribute('class','environment-halo');inner.prepend(ring);}
   const choose=()=>{selected=r.id;renderPanels();draw();switchPanel('selection');};g.addEventListener('pointerdown',e=>e.stopPropagation());g.onclick=e=>{e.stopPropagation();choose();};g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};map.append(g);
  }
  // Regional evidence uses hollow dashed symbols. It never acquires a state
  // fill, a capital symbol or a migration arrow through geographic inference.
  for(const r of year<610?active(year):[])for(const ref of r.geographicReferences||[]){
   const ns=svg.namespaceURI,g=document.createElementNS(ns,'g');g.setAttribute('transform',`translate(${project(ref.coord)})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',loc(ref.label)+' · '+loc(ref.title));g.dataset.ancientGeography=ref.id;g.dataset.ancientMarker=r.id+':'+ref.id;
   const inner=document.createElementNS(ns,'g');inner.classList.add('ancient-marker-content');inner.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);
   const ring=document.createElementNS(ns,'circle');ring.setAttribute('r','10');ring.setAttribute('class','ancient-regional-reference');
   const text=document.createElementNS(ns,'text');text.setAttribute('x','15');text.setAttribute('y','4');text.textContent=loc(ref.label);const tip=document.createElementNS(ns,'title');tip.textContent=loc(r.geographyCaption);inner.append(ring,text,tip);g.append(inner);bindMapAction(g,()=>{selected=r.id;renderPanels();draw();switchPanel('selection');});map.append(g);
  }
  drawContinuityFrontiers();drawMovement();syncAncientLayers();arrangeLabels();
 }
 function drawContinuityFrontiers(){
  // Retain both reconstructions in a neutral shared band; never assign a
  // disputed strip to whichever country's path happens to be painted last.
  const ids=new Set(continuity.supplement.entities.map(e=>e.id)),extra=[...territoryMap.querySelectorAll('[data-ancient-territory]')].filter(p=>ids.has(p.dataset.ancientTerritory));if(!extra.length)return;
  const ns=svg.namespaceURI,defs=document.createElementNS(ns,'defs'),mask=document.createElementNS(ns,'clipPath');mask.id='ancientContinuityMain';mask.setAttribute('clipPathUnits','userSpaceOnUse');
  const primary=year<610?[...territoryMap.querySelectorAll('[data-ancient-territory]')].filter(p=>!ids.has(p.dataset.ancientTerritory)):[...empireLayer.querySelectorAll('.empire-path[data-empire-type=empire],.empire-path[data-empire-type=local],.empire-path[data-empire-type=fuzzy]'),...worldTerritoryLayer.querySelectorAll('.world-territory.polity:not(.sovereign-part) > path[role=button],.world-territory.influence:not(.imperial-dependency) > path[role=button]')];
  for(const p of primary){const copy=document.createElementNS(ns,'path');copy.setAttribute('d',p.getAttribute('d'));copy.setAttribute('clip-rule',p.getAttribute('fill-rule')||'nonzero');if(p.hasAttribute('clip-path'))copy.setAttribute('clip-path',p.getAttribute('clip-path'));mask.append(copy);}defs.append(mask);const regionMask=document.createElementNS(ns,'mask');regionMask.id='ancientRegionalOutside';regionMask.setAttribute('maskUnits','userSpaceOnUse');for(const [k,v]of Object.entries({x:-1440,y:-720,width:4320,height:2160}))regionMask.setAttribute(k,v);const field=document.createElementNS(ns,'rect');for(const [k,v]of Object.entries({x:-1440,y:-720,width:4320,height:2160,fill:'white'}))field.setAttribute(k,v);regionMask.append(field);const cut=document.createElementNS(ns,'rect');for(const [k,v]of Object.entries({x:-1440,y:-720,width:4320,height:2160,fill:'black','clip-path':'url(#ancientContinuityMain)'}))cut.setAttribute(k,v);regionMask.append(cut);defs.append(regionMask);territoryMap.append(defs);for(const p of extra.filter(p=>boundaryEntities.get(p.dataset.ancientTerritory)?.kind==='polities'))p.setAttribute('mask','url(#ancientRegionalOutside)');
  for(const p of extra.filter(p=>continuity.frontierEntities.includes(p.dataset.ancientTerritory))){const band=document.createElementNS(ns,'path');band.setAttribute('d',p.getAttribute('d'));band.setAttribute('fill-rule','evenodd');band.setAttribute('clip-path','url(#ancientContinuityMain)');band.setAttribute('class','ancient-continuity-band');const title=document.createElementNS(ns,'title');title.textContent=loc(['Сопоставление контуров','Comparison of outlines','Контурларды салыштыруу'])+' · '+p.getAttribute('aria-label');band.append(title);band.setAttribute('role','button');band.setAttribute('tabindex','0');band.setAttribute('aria-label',title.textContent);
   const explain=()=>{const body=$('modalBody');body.replaceChildren(make('h2','',title.textContent),make('p','',cal.format(year,language)),make('p','',loc(['Здесь различаются картографические реконструкции территорий. Этот участок показан отдельно от заливки государств; он не обозначает установленную по источникам границу или особое государство.','Territorial reconstructions differ in this area. It is displayed separately from state fills; it does not represent an established boundary or a separate state.','Бул жерде аймактык реконструкциялар айырмаланат. Тилке мамлекеттердин боёгунан өзүнчө көрсөтүлгөн; ал булактар менен аныкталган чек араны же өзүнчө мамлекетти билдирбейт.'])),...[boundaries.source.title].map(s=>make('p','ancient-reference',s)));$('modal').classList.add('show');$('modalClose').focus();};bindMapAction(band,explain);territoryMap.append(band);}
  // Apply the same reviewed frontier symbols on either side of the cut-off.
  const sharedOwners=new Set(visibleTerritories().flatMap(r=>[r.legacyId,r.entry]).filter(Boolean));if(year<610)for(const [a,b,i] of boundaryFrame(610).zones.filter(z=>sharedOwners.has(z[0])&&sharedOwners.has(z[1]))){const p=document.createElementNS(ns,'path');p.setAttribute('d',polygonPath(WORLD_HISTORY.boundaryEvidence.shapes[i]));p.setAttribute('fill','url(#frontierReviewDots)');p.style.setProperty('--ancient-opacity',Math.min(1,overlayOpacity+.20));p.style.stroke='none';p.setAttribute('class','ancient-shared-frontier');p.setAttribute('role','button');p.setAttribute('tabindex','0');p.setAttribute('aria-label',boundaryName(a,610)+' / '+boundaryName(b,610));bindMapAction(p,()=>openBoundaryNote([a,b]));territoryMap.append(p);}
 }
 function bindMapAction(node,activate){let down=null;node.onclick=e=>{e.stopPropagation();if(e.detail===0)activate();};node.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}};node.onpointerdown=e=>{if(e.button!==0)return;e.stopPropagation();e.preventDefault();down={x:e.clientX,y:e.clientY,tx:mapState.tx,ty:mapState.ty,id:e.pointerId,moved:false};node.setPointerCapture(e.pointerId);};node.onpointermove=e=>{if(!down||down.id!==e.pointerId)return;down.moved ||= Math.hypot(e.clientX-down.x,e.clientY-down.y)>5;if(down.moved){const a=screenPoint(e.clientX,e.clientY),b=screenPoint(down.x,down.y);mapState.tx=down.tx+a.x-b.x;mapState.ty=down.ty+a.y-b.y;setViewport();}};node.onpointercancel=()=>{down=null;};node.onpointerup=e=>{if(!down||down.id!==e.pointerId)return;e.stopPropagation();const moved=down.moved;down=null;if(node.hasPointerCapture(e.pointerId))node.releasePointerCapture(e.pointerId);if(moved)queueLocationSave();else activate();};}
 function syncAncientLayers(){territoryMap.classList.toggle('hidden-layer',!layerState.empires);for(const g of map.querySelectorAll('[data-ancient-label]'))g.classList.toggle('hidden-layer',!layerState.empires);for(const g of map.querySelectorAll('[data-ancient-marker]'))g.classList.toggle('hidden-layer',!layerState.places);}
 $('opacityRange').addEventListener('input',()=>draw());
 function clearContinuitySelection(){document.body.classList.remove('continuity-selection');if(selected?.startsWith('territory:'))selected=null;for(const p of territoryMap.querySelectorAll('.ancient-territory-selected'))p.classList.remove('ancient-territory-selected');}
 const originalSelectEmpire=selectEmpire;selectEmpire=function(...args){clearContinuitySelection();return originalSelectEmpire(...args);};
 const originalWorldChoose=worldChooseTerritory;worldChooseTerritory=function(...args){clearContinuitySelection();return originalWorldChoose(...args);};
 const originalLayerState=applyLayerState;applyLayerState=function(){originalLayerState();syncAncientLayers();};
 function drawMovement(){
  movementMap.replaceChildren();const m=catalog.movements.find(m=>m.record===selected&&m.from<=year&&year<m.to);if(!m||environmentOnly)return;
  const ns=svg.namespaceURI,[a,b]=m.endpoints.map(p=>project(p.coord)),defs=document.createElementNS(ns,'defs'),marker=document.createElementNS(ns,'marker');marker.id='ancientArrow';for(const [k,v]of Object.entries({viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto'}))marker.setAttribute(k,v);const tip=document.createElementNS(ns,'path');tip.setAttribute('d','M0 0 L10 5 L0 10Z');tip.setAttribute('fill','#603c17');marker.append(tip);defs.append(marker);movementMap.append(defs);
  const p=document.createElementNS(ns,'path');p.dataset.ancientMovement=m.id;p.setAttribute('class','ancient-movement-line');p.setAttribute('d',`M${a} L${b}`);p.setAttribute('marker-end','url(#ancientArrow)');p.setAttribute('vector-effect','non-scaling-stroke');movementMap.append(p);
  for(let i=0;i<2;i++){const g=document.createElementNS(ns,'g');g.setAttribute('transform',`translate(${i?b:a})`);const inner=document.createElementNS(ns,'g');inner.classList.add('ancient-movement-label');const dot=document.createElementNS(ns,'circle');dot.setAttribute('r','4');const label=document.createElementNS(ns,'text');label.setAttribute('x','8');label.setAttribute('y',i?'18':'-8');label.textContent=loc(m.endpoints[i].title);inner.append(dot,label);g.append(inner);movementMap.append(g);}resizeMovements();
 }
 function resizeMovements(){for(const g of movementMap.querySelectorAll('.ancient-movement-label'))g.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);}
 function arrangeLabels(){const occupied=[...movementMap.querySelectorAll('text'),...(year>=610?[...document.querySelectorAll('#empireLabelLayer text,#worldTerritoryLabels text,#placeLayer text')].filter(e=>getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width>0):[])].map(e=>e.getBoundingClientRect());const rect=svg.getBoundingClientRect(),detail=worldLabelMetrics().detail;for(const g of map.querySelectorAll('[data-ancient-label],[data-ancient-marker]')){const label=g.querySelector('text');label.style.fontSize=Math.min(g.dataset.ancientLabel?13.5:11,8+3*Math.log2(Math.max(1,detail)))+'px';label.style.strokeWidth='2px';label.style.visibility='visible';const box=label.getBoundingClientRect();const visible=box.left>=rect.left+6&&box.right<=rect.right-6&&box.top>=rect.top+6&&box.bottom<=rect.bottom-6;const collision=occupied.some(b=>box.left<b.right+8&&box.right>b.left-8&&box.top<b.bottom+3&&box.bottom>b.top-3);if(!visible||collision)label.style.visibility='hidden';else occupied.push(box);}}
 function renderPanels(){
  const events=panel('panel-events');events.append(make('h2','',environmentOnly?t('geography'):t('current')),make('p','ancient-muted',cal.format(year,language)),make('p','ancient-map-key',year<-7000?loc(['Точки — места свидетельств; интервалы древнейших дат округлены. Возраст природной реконструкции подписан отдельно.','Dots locate evidence; the earliest dating windows are rounded. The age of the landscape reconstruction is labelled separately.','Чекиттер — далил табылган жерлер; эң байыркы даталардын аралыгы тегеректелген. Табигый реконструкциянын жашы өзүнчө жазылган.']):t('mapKey')));
  const shortcuts=make('div','ancient-periods');for(const [y,title]of [[-7000,['Земледельцы','Early farmers','Алгачкы дыйкандар']],[-3000,['Первые города','Early cities','Алгачкы шаарлар']],[-500,['Царства','Ancient states','Байыркы падышалыктар']],[1,['Начало нашей эры','Early CE','Биздин заман башы']],[609,['VII век','7th century','VII кылым']]])shortcuts.append(button(loc(title),()=>{region='all';environmentOnly=false;stopPlay();renderYear(y);queueLocationSave();}));events.append(shortcuts);
  const records=active(year),territories=visibleTerritories();
  if(!environmentOnly&&region==='all'&&territories.length){const index=make('details','ancient-territory-index');index.append(make('summary','',loc(['Государства и области на карте','States and regions on the map','Картадагы мамлекеттер жана аймактар'])+' · '+territories.length));for(const r of territories)index.append(button(loc(boundaryEntities.get(r.id).title),()=>chooseTerritory(r)));events.append(index);}
  if(!records.length)events.append(make('p','',t('empty')));for(const r of records)events.append(card(r));
  const regions=panel('panel-regions');regions.append(make('h2','',loc(['Регионы мира','World regions','Дүйнө аймактары'])));
  const select=make('select','');select.setAttribute('aria-label',t('all'));for(const [id,name]of [['all',t('all')],...WORLD_HISTORY.regions.map(r=>[r.id,loc(r.name)])]){const o=make('option','',name);o.value=id;select.append(o);}select.value=region;select.onchange=()=>{region=select.value;renderPanels();draw();};regions.append(select);
  for(const r of records)regions.append(card(r));
  const compare=panel('panel-compare');compare.append(make('h2','',loc(['В мире в это время','Elsewhere at this time','Ошол учурда дүйнөдө'])),make('p','ancient-muted',cal.format(year,language)));
  for(const area of WORLD_HISTORY.regions){const local=records.filter(r=>r.region===area.id);if(!local.length)continue;const section=make('section','ancient-region-group');section.append(make('h3','',loc(area.name)));for(const r of local)section.append(card(r));compare.append(section);}
  const sources=panel('panel-sources');sources.append(make('h2','',t('sources')));const books=new Set([...catalog.records.flatMap(r=>r.sources).map(id=>catalog.sources[id].title),...Object.values(catalog.scriptural.sources).map(s=>s.title),catalog.chinaReference.source]);for(const book of books)sources.append(make('p','ancient-reference',book));
  sources.append(make('p','ancient-reference',boundaries.source.title));
  for(const book of new Set(boundaries.corrections.flatMap(c=>c.sources.map(s=>s.title))))sources.append(make('p','ancient-reference',book));
  const license=make('a','ancient-reference',boundaries.source.license);license.href=boundaries.source.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';sources.append(license);
  const selection=panel('panel-selection'),record=catalog.records.find(r=>r.id===selected&&r.from<=year&&year<r.to),territory=visibleTerritories().find(r=>'territory:'+r.id===selected);
  if(record)selection.append(card(record,true));else if(territory){const e=boundaryEntities.get(territory.id);selection.append(make('h2','',loc(e.title)),make('p','',e.kind==='culture'||e.kind==='polities'?t('societies'):t('territory')),make('p','',t('frame')+': '+cal.format(territory.referenceYear?year:(territory.controlEvent??territory.sourceFrom),language)),make('p','ancient-reference',boundaries.source.title));}else selection.append(make('p','',t('selected')));
 }
 const baseViewport=setViewport;
 const baseWorldRender=renderWorldHistory;
 renderWorldHistory=function(){if(year>=610)return baseWorldRender();};
 const baseActiveEvent=activeEvent;
 activeEvent=function(y){if(y>=610)return baseActiveEvent(y);return {title:t('title'),desc:t('current'),ah:labels.era[li()][y<0?0:1],place:t('title'),type:t('title'),coord:null,world:[]};};
 setViewport=function(){baseViewport();for(const g of [...map.querySelectorAll('.ancient-marker-content'),...textualMap.querySelectorAll('.textual-map-label')])g.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);resizeMovements();arrangeLabels();};
 window.addEventListener('resize',()=>setViewport());
 $('kyrgyzHistoryBtn').addEventListener('click',e=>{if(year<610){e.stopImmediatePropagation();showKyrgyz();}},true);
 $('kyrgyzParallel').addEventListener('click',e=>{if(year<610){e.stopImmediatePropagation();showKyrgyz();}},true);
 renderYear=function(value){
  let target=Number(value);if(target===0)target=year<0?1:-1;if(!cal.valid(target))return;target=Math.max(catalog.range.min,Math.min(TIMELINE_MAX,target));
  clearTextPlace();clearContinuitySelection();const ancient=target<610;document.body.classList.toggle('ancient-mode',ancient);
  if(!ancient){for(const id of ['mapYear','timelineYear','mapAh','timelineAh']){delete $(id).dataset.localeOwned;$(id).removeAttribute('aria-label');}baseRender(target);renderControls();draw();syncRange();return;}
  if(typeof mapTransitionCleanup==='function')mapTransitionCleanup();selectedEmpire=null;year=target;
  $('yearRange').value=String(year);$('yearRange').setAttribute('aria-valuetext',cal.format(year,language));
  for(const id of ['mapYear','timelineYear']){$(id).dataset.localeOwned='true';$(id).textContent=String(Math.abs(year));$(id).setAttribute('aria-label',cal.format(year,language));}
  for(const id of ['mapAh','timelineAh']){$(id).dataset.localeOwned='true';$(id).textContent=labels.era[li()][year<0?0:1]+(id==='mapAh'?' · '+t('title'):'');}
  const note=document.querySelector('.map-slice-note');if(note)note.textContent=t('places');
  renderControls();renderPanels();draw();syncRange();
 };
 const continuityYears=[...new Set(continuity.supplement.records.flatMap(r=>[r.from,r.to+1]))].sort((a,b)=>a-b);
 nextPlaybackYear=function(y){if(y>=610){const target=baseNext(y),next=continuityYears.find(v=>v>y);return next!==undefined&&next<target?next:target;}let step=y<-100000?10000:y<-20000?2000:y<-7000?500:y<-1000?100:y<1?25:y<500?10:1;let target=Math.min(610,cal.add(y,step));const next=catalog.milestones.find(v=>v>y);if(next!==undefined&&next<target)target=next;return target;};
 function ticks(){entrance.textContent=cal.format(catalog.range.min,language)+' · '+loc(['Ранние люди','Early humans','Алгачкы адамдар']);$('ticks').replaceChildren();for(const y of [catalog.range.min,-100000,-20000,-7000,1,1300,TIMELINE_MAX]){const e=make('span','tick-label',cal.format(y,language));e.style.left=(scale.toPosition(y)/100000)+'%';$('ticks').append(e);}const hint=document.querySelector('.timeline-hint');if(hint){hint.dataset.localeOwned='true';hint.textContent=cal.format(catalog.range.min,language)+' — '+cal.format(TIMELINE_MAX,language);}}
  localeSelect.addEventListener('change',()=>{renderYear(year);ticks();if($('modal').classList.contains('show')){if(deepModalMode)showOrigins(deepModalMode,deepProfile);else if(historyTopic==='china')showChina();else if(historyTopic==='kyrgyz')showKyrgyz();}});
 $('modalClose').addEventListener('click',()=>{deepModalMode=null;historyTopic=null;if($('modalBody').dataset.ancientOwned){delete $('modalBody').dataset.ancientOwned;delete $('modalBody').dataset.localeOwned;}});
 const incoming=cal.parse(new URLSearchParams(location.search).get('year'));
 if(incoming!==null&&incoming>=catalog.range.min&&incoming<610)renderYear(incoming);else{renderControls();draw();}ticks();syncRange();
 const query=new URLSearchParams(location.search),requestedOrigins=query.get('origins');if(['prophets','dispersal','settlement','peoples'].includes(requestedOrigins))showOrigins(requestedOrigins,query.get('prophet'));
 const requestedRecord=catalog.records.find(r=>r.id===query.get('ancient')&&(incoming===null||(r.from<=incoming&&incoming<r.to)));if(requestedRecord)requestAnimationFrame(()=>openRecord(requestedRecord));
 document.addEventListener('chronograph:open-ancient',event=>{const r=catalog.records.find(r=>r.id===event.detail);if(r)openRecord(r);});
})();
