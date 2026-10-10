const incidentText={
 button:['Войны и перевороты','Wars & upheavals','Согуштар жана төңкөрүштөр'],
 title:['Войны и политические потрясения','Wars and political upheavals','Согуштар жана саясий толкундоолор'],
 back:['← Атлас','← Atlas','← Атлас'],stories:['По шагам','Stories','Баскычтар'],registry:['Мировой реестр','World registry','Дүйнөлүк реестр'],
 war:['Война','War','Согуш'],intervention:['Военная операция','Military operation','Аскердик операция'],coup:['Переворот','Coup','Төңкөрүш'],attempt:['Попытка переворота','Coup attempt','Төңкөрүш аракети'],conspiracy:['Заговор','Conspiracy','Кутум'],protest:['Протесты / революция','Protests / revolution','Нааразылык / революция'],
 all:['Все виды','All types','Бардык түрлөр'],years:['Все годы','All years','Бардык жылдар'],countries:['Все страны','All countries','Бардык өлкөлөр'],search:['Страна, год или номер записи','Country, year or record ID','Өлкө, жыл же жазуунун номери'],
 play:['Воспроизвести','Play','Ойнотуу'],pause:['Пауза','Pause','Тыныгуу'],previous:['Предыдущее событие','Previous event','Мурунку окуя'],next:['Следующее событие','Next event','Кийинки окуя'],effects:['Эффекты','Effects','Эффекттер'],
 overview:['Обзор событий','Event overview','Окуялардын сереби'],sources:['Источники','Sources','Булактар'],sequence:['Хронология','Chronology','Хронология'],
 reference:['Современные границы · географический ориентир','Modern borders · geographic reference','Азыркы чек аралар · географиялык багыт'],
 countryPoint:['Указатель страны; точное место в реестре не задано.','Country marker; the registry does not specify an exact location.','Өлкөнүн белгиси; реестрде так жер көрсөтүлгөн эмес.'],
 classification:['Классификация Cline Center','Cline Center classification','Cline Center классификациясы'],
 military:['Военные','Military','Аскерлер'],dissident:['Оппозиционная группа','Dissident group','Оппозициялык топ'],rebel:['Повстанцы','Rebels','Козголоңчулар'],palace:['Группа внутри власти','Faction within government','Бийликтин ичиндеги топ'],foreign:['Иностранная поддержка','Foreign backing','Чет өлкөлүк колдоо'],auto:['Самопереворот · расширение полномочий действующей власти','Self-coup · incumbent expands powers','Өзүн-өзү төңкөрүш · бийлик өз ыйгарым укуктарын кеңейтет'],resign:['Вынужденная отставка','Forced resignation','Аргасыз отставка'],popular:['Массовое восстание','Popular revolt','Массалык көтөрүлүш'],counter:['Контрпереворот','Counter-coup','Каршы төңкөрүш'],other:['Прочие / не установлены','Other / unidentified','Башка / аныкталган эмес'],
 coverage:['1945–3 января 2026 · 1161 запись · версия 2.2.2','1945–3 January 2026 · 1,161 records · version 2.2.2','1945–2026-жылдын 3-январы · 1161 жазуу · 2.2.2 версиясы'],
 methodology:['О реестре','About the registry','Реестр жөнүндө'],
 method:['Реестр Cline Center учитывает перевороты, неудавшиеся попытки и раскрытые заговоры. «Переворот» означает, что действующая власть потеряла полномочия неконституционным путём; установление власти организаторов не обязательно. Даты и категории сохранены по источнику. Протесты и революции в пошаговых рассказах описаны отдельно.','The Cline Center registry covers coups, failed attempts and disrupted conspiracies. A “coup” means incumbents lost authority by irregular means; the plotters need not take power. Dates and categories follow the source. The stories describe protests and revolutions separately.','Cline Center реестри төңкөрүштөрдү, ишке ашпаган аракеттерди жана ачылган кутумдарды камтыйт. «Төңкөрүш» бийликтин конституциядан тыш жол менен ыйгарым укуктарын жоготушун билдирет; уюштуруучулар бийликке келиши шарт эмес. Даталар жана түрлөр булак боюнча сакталган. Баяндоолордо нааразылык менен революциялар өзүнчө берилет.'],
 empty:['По этим условиям записей нет.','No records match these filters.','Бул шарттарга ылайык жазуулар жок.'],
 results:['Найдено','Results','Табылды'],record:['Запись источника','Source record','Булактагы жазуу'],date:['Дата по источнику','Source date','Булактагы дата'],
 legend:['Обозначения','Map key','Белгилер'],page:['Страница','Page','Барак'],
 reduced:['Системная настройка уменьшения движения включена.','System reduced-motion preference is on.','Системада кыймылды азайтуу жөндөөсү күйгүзүлгөн.']
};
const il=v=>v[({ru:0,en:1,ky:2})[language]],it=k=>il(incidentText[k]);
const incidentColors={war:'#f0a081',intervention:'#94cbe4',coup:'#eac46d',attempt:'#d4aceb',conspiracy:'#abb8c9',protest:'#a7d5a8'};
const incidentState={active:false,view:'stories',story:'gkchp',step:0,record:null,kind:'all',year:'all',country:'all',query:'',page:0,timer:null,effects:true,history:null};
const incidentMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const incidentButton=document.createElement('button');incidentButton.id='incidentsBtn';incidentButton.className='btn';incidentButton.dataset.localeOwned='true';incidentButton.setAttribute('aria-controls','incidentsPanel');localeSelect.after(incidentButton);
const incidentPanel=document.createElement('aside');incidentPanel.id='incidentsPanel';incidentPanel.className='card';incidentPanel.dataset.localeOwned='true';incidentPanel.hidden=true;
incidentPanel.innerHTML='<header class="incident-head"><div class="incident-eyebrow">CHRONOGRAPH · 1914–2026</div><h2></h2><nav class="incident-tabs"><button id="incidentStories"></button><button id="incidentRegistry"></button></nav><div id="incidentStoryTools"><select id="incidentStorySelect"></select></div><div id="incidentRegistryTools" hidden><input id="incidentSearch" type="search" autocomplete="off" maxlength="200"><div class="incident-filters"><select id="incidentKind"></select><select id="incidentYear"></select><select id="incidentCountry"></select></div></div></header><div class="incident-scroll" id="incidentScroll"><article id="incidentArticle"></article><div id="incidentList"></div><details id="incidentMethod"><summary></summary><p></p><small></small></details></div>';
$('timelineCard').before(incidentPanel);
const incidentTimeline=document.createElement('section');incidentTimeline.id='incidentsTimeline';incidentTimeline.className='card timeline-card';incidentTimeline.dataset.localeOwned='true';incidentTimeline.hidden=true;
incidentTimeline.innerHTML='<button class="round" id="incidentPrevious">‹</button><button class="round" id="incidentPlay">▶</button><div class="incident-progress"><strong id="incidentCurrent"></strong><small id="incidentCount" role="status" aria-live="polite"></small><progress id="incidentProgress" max="1" value="0"></progress></div><button class="round" id="incidentNext">›</button><label class="incident-effects"><input id="incidentEffects" type="checkbox" checked><span></span></label>';
$('timelineCard').after(incidentTimeline);
const incidentNote=document.createElement('div');incidentNote.id='incidentMapNote';incidentNote.dataset.localeOwned='true';incidentNote.hidden=true;$('mapCard').append(incidentNote);
const incidentLayer=document.createElementNS(svg.namespaceURI,'g');incidentLayer.id='incidentsLayer';incidentLayer.dataset.localeOwned='true';incidentLayer.style.display='none';viewport.append(incidentLayer);
const incidentMapLabel=svg.getAttribute('aria-label');
const ie=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
function incidentDate(s){if(language==='ky'){const [y,m,d]=s.split('-').map(Number),months=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];return y+'-ж. '+d+'-'+months[m-1];}return new Intl.DateTimeFormat(language==='ru'?'ru-RU':'en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(s+'T00:00:00Z'));}
function incidentStory(){return INCIDENT_CATALOG.stories.find(s=>s.id===incidentState.story);}
function incidentFiltered(){return incidentRecords(INCIDENT_REGISTRY,incidentState);}
function incidentStop(){clearInterval(incidentState.timer);incidentState.timer=null;incidentPlayLabel();}
function incidentPlayLabel(){$('incidentPlay').textContent=incidentState.timer===null?'▶':'Ⅱ';$('incidentPlay').setAttribute('aria-label',it(incidentState.timer===null?'play':'pause'));$('incidentPlay').setAttribute('aria-pressed',String(incidentState.timer!==null));}
function incidentFocus(coord,scale=4){animateCamera({scale,tx:SVG_W/2-project(coord)[0]*scale,ty:SVG_H/2-project(coord)[1]*scale},incidentMotion.matches||!incidentState.effects?1:500);}
function incidentScale(){return 1/(mapState.scale*Math.max(.01,Math.min(svg.clientWidth/SVG_W,svg.clientHeight/SVG_H)));}
function incidentScaleMarkers(){if(!incidentState.active)return;const s=incidentScale();incidentLayer.querySelectorAll('.incident-marker-inner').forEach(e=>e.setAttribute('transform','scale('+s+')'));}
const incidentViewportObserver=new MutationObserver(incidentScaleMarkers);incidentViewportObserver.observe(viewport,{attributes:true,attributeFilter:['transform']});new ResizeObserver(incidentScaleMarkers).observe(svg);
function incidentMarker(coord,label,kind,selected,count,activate){
 const s=(tag,attrs={})=>{const el=document.createElementNS(svg.namespaceURI,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el;};
 const g=s('g',{transform:'translate('+project(coord).join(' ')+')',class:'incident-marker'+(selected?' selected':''),tabindex:'0',role:'button','aria-label':label});g.style.setProperty('--incident-color',incidentColors[kind]||'#c4b385');
 const inner=s('g',{class:'incident-marker-inner',transform:'scale('+incidentScale()+')'});
 if(selected){const halo=s('circle',{r:19,class:'incident-halo'});if(incidentState.effects&&!incidentMotion.matches)halo.classList.add('incident-accent');inner.append(halo);}
 const shapes={war:'M0 -9L3 -3L9 -3L4 2L6 9L0 5L-6 9L-4 2L-9 -3L-3 -3Z',intervention:'M0 -9L8 0L0 9L-8 0Z',coup:'M-7 -7H7V7H-7Z',attempt:'M0 -9L9 7H-9Z',conspiracy:'M-7 -4L0 -8L7 -4V4L0 8L-7 4Z',protest:'M0 -8A8 8 0 1 0 0 8A8 8 0 1 0 0 -8Z'};
 inner.append(count?s('circle',{r:12,class:'incident-symbol'}):s('path',{d:shapes[kind]||shapes.protest,class:'incident-symbol'}));
 const title=s('title');title.textContent=label;g.append(title);
 if(count){const t=s('text',{'text-anchor':'middle',y:4,class:'incident-cluster-number'});t.textContent=count;inner.append(t);}
 const txt=s('text',{x:count?18:13,y:4,class:'incident-marker-label'});txt.textContent=label;inner.append(txt);g.append(inner);incidentLayer.append(g);
 g.addEventListener('pointerdown',e=>e.stopPropagation());g.onclick=e=>{e.stopPropagation();incidentStop();activate();};g.onkeydown=e=>{if(e.key==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();incidentStop();activate();}};
}
function incidentMap(focus=false){
 if(!incidentState.active)return;incidentLayer.replaceChildren();incidentNote.replaceChildren();
 const rows=incidentFiltered(),story=incidentStory(),stage=story.steps[incidentState.step];let selected,coord,scale,title;
 if(incidentState.view==='stories'){
  const seen=[...new Set(story.steps.map(s=>s.place))];for(const id of seen){const p=INCIDENT_CATALOG.places[id],isSelected=id===stage.place;incidentMarker(p.coord,il(p.name),isSelected?(stage.kind||story.kind):story.kind,isSelected,null,()=>{incidentState.step=story.steps.findIndex(s=>s.place===id);incidentRender(true);queueLocationSave();});}
  const p=INCIDENT_CATALOG.places[stage.place];coord=p.coord;scale=p.scale;title=incidentDate(stage.date)+' · '+il(stage.title);
 }else{
  selected=rows.find(r=>r.id===incidentState.record);const groups=incidentGroups(INCIDENT_REGISTRY,rows);
  for(const group of groups){const c=INCIDENT_REGISTRY.countries[group.country],active=selected?.country===group.country;incidentMarker(c.coord,il(c.name),active?selected.kind:'',active,active?null:group.records.length,()=>{incidentState.country=group.country;incidentState.record=group.records[0].id;incidentState.page=0;incidentRender(true);queueLocationSave();});}
  if(selected){coord=INCIDENT_REGISTRY.countries[selected.country].coord;scale=3;title=incidentDate(selected.date)+' · '+il(INCIDENT_REGISTRY.countries[selected.country].name);}else title=it('overview');
 }
 if(focus&&coord)incidentFocus(coord,scale);
 const caption=ie('div',undefined,'incident-caption');caption.append(ie('strong',title),ie('span',it('reference')));if(incidentState.view==='registry')caption.append(ie('span',it('countryPoint')));incidentNote.append(caption);
 const legend=ie('details',undefined,'incident-legend');legend.append(ie('summary',it('legend')));for(const k of ['war','intervention','coup','attempt','conspiracy','protest']){const row=ie('div',({war:'✦',intervention:'◆',coup:'■',attempt:'▲',conspiracy:'⬡',protest:'●'})[k]+' '+it(k));row.style.color=incidentColors[k];legend.append(row);}incidentNote.append(legend);
}
function incidentOptions(select,items,current){select.replaceChildren(...items.map(([v,t])=>{const o=ie('option',t);o.value=v;return o;}));select.value=current;}
function incidentSources(article,ids){const d=ie('details',undefined,'incident-sources');d.append(ie('summary',it('sources')));for(const id of ids)d.append(ie('p',INCIDENT_CATALOG.sources[id].title));article.append(d);}
function incidentRender(focus=false){
 incidentButton.textContent=it(incidentState.active?'back':'button');incidentButton.setAttribute('aria-pressed',String(incidentState.active));incidentButton.title=it('title');
 if(!incidentState.active)return;
 incidentPanel.querySelector('h2').textContent=it('title');incidentPanel.setAttribute('aria-label',it('title'));svg.dataset.localeOwned='true';svg.setAttribute('aria-label',it('title'));$('resetView').dataset.localeOwned='true';$('resetView').textContent=it('overview');
 for(const [id,k]of [['incidentStories','stories'],['incidentRegistry','registry']]){$(id).textContent=it(k);$(id).setAttribute('aria-pressed',String(incidentState.view===k));}
 $('incidentStoryTools').hidden=incidentState.view!=='stories';$('incidentRegistryTools').hidden=incidentState.view!=='registry';$('incidentMethod').hidden=incidentState.view!=='registry';
 incidentOptions($('incidentStorySelect'),INCIDENT_CATALOG.stories.map(s=>[s.id,il(s.title)]),incidentState.story);$('incidentStorySelect').setAttribute('aria-label',it('stories'));
 incidentOptions($('incidentKind'),['all','coup','attempt','conspiracy'].map(k=>[k,it(k)]),incidentState.kind);$('incidentKind').setAttribute('aria-label',it('all'));
 incidentOptions($('incidentYear'),[['all',it('years')],...Array.from({length:82},(_,i)=>[String(2026-i),String(2026-i)])],incidentState.year);$('incidentYear').setAttribute('aria-label',it('years'));
 incidentOptions($('incidentCountry'),[['all',it('countries')],...Object.entries(INCIDENT_REGISTRY.countries).map(([k,c])=>[k,il(c.name)]).sort((a,b)=>a[1].localeCompare(b[1],language))],incidentState.country);$('incidentCountry').setAttribute('aria-label',it('countries'));
 $('incidentSearch').placeholder=it('search');$('incidentSearch').setAttribute('aria-label',it('search'));$('incidentSearch').value=incidentState.query;
 $('incidentMethod').querySelector('summary').textContent=it('methodology');$('incidentMethod').querySelector('p').textContent=it('method');$('incidentMethod').querySelector('small').textContent=INCIDENT_REGISTRY.provenance.authors+'. '+INCIDENT_REGISTRY.provenance.title+'. University of Illinois Urbana-Champaign, 2026. Version 2.2.2. DOI '+INCIDENT_REGISTRY.provenance.doi+'. '+INCIDENT_REGISTRY.provenance.license+'.';
 const article=$('incidentArticle'),list=$('incidentList');article.replaceChildren();list.replaceChildren();let index=0,length=0,heading='';
 if(incidentState.view==='stories'){
  const story=incidentStory();incidentState.step=incidentStep(incidentState.step,0,story.steps.length);const stage=story.steps[incidentState.step];index=incidentState.step;length=story.steps.length;
  const badge=ie('div',it(stage.kind||story.kind),'incident-kind');badge.style.color=incidentColors[stage.kind||story.kind];article.append(badge,ie('h3',il(story.title)),ie('p',il(story.summary),'incident-summary'));
  const current=ie('section',undefined,'incident-stage');current.append(ie('time',incidentDate(stage.date)),ie('h4',il(stage.title)),ie('p',il(stage.text)));current.querySelector('time').dateTime=stage.date;article.append(current);
  const ol=ie('ol',undefined,'incident-steps');ol.setAttribute('aria-label',it('sequence'));story.steps.forEach((s,i)=>{const li=ie('li'),b=ie('button');b.append(ie('small',incidentDate(s.date)),ie('span',il(s.title)));b.setAttribute('aria-current',String(i===incidentState.step));b.onclick=()=>{incidentStop();incidentState.step=i;incidentRender(true);queueLocationSave();};li.append(b);ol.append(li);});article.append(ol);incidentSources(article,story.sources);heading=incidentDate(stage.date)+' · '+il(stage.title);
 }else{
  const rows=incidentFiltered();length=rows.length;let record=rows.find(r=>r.id===incidentState.record);if(!record){record=rows[0];incidentState.record=record?.id||null;}index=record?rows.indexOf(record):0;
  article.append(ie('div',it('classification'),'incident-eyebrow'),ie('p',it('coverage'),'incident-coverage'));
  if(record){article.append(ie('h3',il(INCIDENT_REGISTRY.countries[record.country].name)));const badge=ie('p',it(record.kind),'incident-kind');badge.style.color=incidentColors[record.kind];article.append(badge,ie('p',it('date')+': '+incidentDate(record.date)),ie('p',record.types.map(it).join(' · '),'incident-coverage'),ie('small',it('record')+' '+record.id),ie('p',it('countryPoint'),'incident-coverage'));heading=incidentDate(record.date)+' · '+il(INCIDENT_REGISTRY.countries[record.country].name);}
  else article.append(ie('p',it('empty')));
  list.append(ie('p',it('results')+': '+rows.length,'incident-results'));const size=20,pages=Math.ceil(rows.length/size);incidentState.page=Math.max(0,Math.min(incidentState.page,pages-1));
  const ul=ie('ul',undefined,'incident-records');for(const r of rows.slice(incidentState.page*size,(incidentState.page+1)*size)){const li=ie('li'),b=ie('button');b.append(ie('small',incidentDate(r.date)+' · '+it(r.kind)),ie('span',il(INCIDENT_REGISTRY.countries[r.country].name)));b.setAttribute('aria-current',String(r.id===incidentState.record));b.onclick=()=>{incidentStop();incidentState.record=r.id;incidentRender(true);$('incidentScroll').scrollTop=0;queueLocationSave();};li.append(b);ul.append(li);}list.append(ul);
  if(pages>1){const pager=ie('div',undefined,'incident-pager');for(const [delta,label]of [[-1,'‹'],[1,'›']]){const b=ie('button',label);b.setAttribute('aria-label',it('page')+' '+(incidentState.page+1+delta));b.disabled=incidentState.page+delta<0||incidentState.page+delta>=pages;b.onclick=()=>{incidentStop();incidentState.page+=delta;incidentRender(false);};pager.append(b);}pager.insertBefore(ie('span',it('page')+' '+(incidentState.page+1)+' / '+pages),pager.lastChild);list.append(pager);}
 }
 $('incidentCurrent').textContent=heading||it('empty');$('incidentCount').textContent=length?(index+1)+' / '+length:it('empty');$('incidentProgress').max=Math.max(1,length);$('incidentProgress').value=length?index+1:0;
 $('incidentPrevious').disabled=!length||index===0;$('incidentNext').disabled=!length||index===length-1;$('incidentPlay').disabled=length<2;
 $('incidentPrevious').setAttribute('aria-label',it('previous'));$('incidentNext').setAttribute('aria-label',it('next'));$('incidentEffects').checked=incidentState.effects;$('incidentEffects').disabled=incidentMotion.matches;$('incidentEffects').parentElement.querySelector('span').textContent=it('effects');$('incidentEffects').parentElement.title=incidentMotion.matches?it('reduced'):it('effects');incidentPlayLabel();incidentMap(focus);
}
function incidentAdvance(delta){if(incidentState.view==='stories'){const s=incidentStory();incidentState.step=incidentStep(incidentState.step,delta,s.steps.length);}else{const rows=incidentFiltered(),i=rows.findIndex(r=>r.id===incidentState.record);incidentState.record=rows[incidentStep(i,delta,rows.length)]?.id||null;incidentState.page=Math.floor(incidentStep(i,delta,rows.length)/20);}incidentRender(true);queueLocationSave();}
function incidentTogglePlay(){if(incidentState.timer!==null){incidentStop();return;}if($('incidentNext').disabled){if(incidentState.view==='stories')incidentState.step=0;else{incidentState.record=incidentFiltered()[0]?.id;incidentState.page=0;}incidentRender(true);}incidentState.timer=setInterval(()=>{incidentAdvance(1);if($('incidentNext').disabled)incidentStop();},6500);incidentPlayLabel();}
function setIncidentMode(active){
 if(active===incidentState.active)return;incidentStop();stopPlay();
 if(active){if(futureState.active)setFutureMode(false);incidentState.history={view:{...mapState}};}
 incidentState.active=active;document.body.classList.toggle('incidents-mode',active);incidentPanel.hidden=!active;incidentTimeline.hidden=!active;incidentNote.hidden=!active;incidentLayer.style.display=active?'':'none';$('layerPanel').hidden=true;tooltip.classList.remove('show');
 if(!active){++cameraAnimationVersion;mapState={...incidentState.history.view};setViewport();delete svg.dataset.localeOwned;svg.setAttribute('aria-label',incidentMapLabel);delete $('resetView').dataset.localeOwned;$('resetView').textContent='Обзор';localizePage();}
 incidentRender(active);queueLocationSave();
}
incidentButton.onclick=()=>setIncidentMode(!incidentState.active);
futureButton.addEventListener('click',()=>{if(incidentState.active)setIncidentMode(false);},true);
for(const [id,view]of [['incidentStories','stories'],['incidentRegistry','registry']])$(id).onclick=()=>{incidentStop();incidentState.view=view;incidentRender(view==='stories');if(view==='registry'){++cameraAnimationVersion;mapState={scale:1,tx:0,ty:0};setViewport();}$('incidentScroll').scrollTop=0;queueLocationSave();};
$('incidentStorySelect').onchange=e=>{incidentStop();incidentState.story=e.target.value;incidentState.step=0;incidentRender(true);$('incidentScroll').scrollTop=0;queueLocationSave();};
for(const [id,key]of [['incidentKind','kind'],['incidentYear','year'],['incidentCountry','country']])$(id).onchange=e=>{incidentStop();incidentState[key]=e.target.value;incidentState.page=0;incidentState.record=null;incidentRender(false);++cameraAnimationVersion;mapState={scale:1,tx:0,ty:0};setViewport();queueLocationSave();};
let incidentSearchTimer;$('incidentSearch').oninput=e=>{incidentStop();incidentState.query=e.target.value;clearTimeout(incidentSearchTimer);incidentSearchTimer=setTimeout(()=>{incidentState.page=0;incidentState.record=null;incidentRender(false);queueLocationSave();},180);};
$('incidentPrevious').onclick=()=>{incidentStop();incidentAdvance(-1);};$('incidentNext').onclick=()=>{incidentStop();incidentAdvance(1);};$('incidentPlay').onclick=incidentTogglePlay;
$('incidentEffects').onchange=e=>{incidentState.effects=e.target.checked;incidentMap(false);};incidentMotion.addEventListener('change',()=>{incidentStop();incidentRender(false);});
const incidentPreviousReset=$('resetView').onclick;$('resetView').onclick=()=>{if(incidentState.active){++cameraAnimationVersion;mapState={scale:1,tx:0,ty:0};setViewport();}else incidentPreviousReset();};
localeSelect.addEventListener('change',()=>{incidentStop();incidentRender(false);});document.addEventListener('visibilitychange',()=>{if(document.hidden)incidentStop();});
for(const id of ['supportBtn','contactBtn'])$(id)?.addEventListener('click',incidentStop,true);
window.addEventListener('keydown',e=>{if(!incidentState.active||e.defaultPrevented||$('modal').classList.contains('show')||e.target.closest('input,select,button,summary,[role=button],[contenteditable=true]'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();incidentStop();incidentAdvance(e.key==='ArrowLeft'?-1:1);}if(e.code==='Space'){e.preventDefault();if(!$('incidentPlay').disabled)incidentTogglePlay();}},true);
incidentsLocationHook=url=>{for(const k of ['incident','istep','ilist','iyear','ikind','icountry','iq','iview'])url.searchParams.delete(k);if(incidentState.active){url.searchParams.set('mode','incidents');url.searchParams.set('ilist',incidentState.view);url.searchParams.set('incident',incidentState.view==='stories'?incidentState.story:incidentState.record||'');url.searchParams.set('istep',String(incidentState.step));url.searchParams.set('iyear',incidentState.year);url.searchParams.set('ikind',incidentState.kind);url.searchParams.set('icountry',incidentState.country);if(incidentState.query)url.searchParams.set('iq',incidentState.query);url.searchParams.set('view',[incidentState.history.view.scale,incidentState.history.view.tx,incidentState.history.view.ty].map(n=>n.toFixed(3)).join(','));url.searchParams.set('iview',[mapState.scale,mapState.tx,mapState.ty].map(n=>n.toFixed(3)).join(','));}};
if(stateParams.get('mode')==='incidents'){
 if(stateParams.get('ilist')==='registry')incidentState.view='registry';
 const selected=stateParams.get('incident');if(INCIDENT_CATALOG.stories.some(s=>s.id===selected))incidentState.story=selected;if(INCIDENT_REGISTRY.records.some(r=>r.id===selected))incidentState.record=selected;
 if(/^\d{1,2}$/.test(stateParams.get('istep')||''))incidentState.step=incidentStep(+stateParams.get('istep'),0,incidentStory().steps.length);
 if(/^\d{4}$/.test(stateParams.get('iyear')||'')&&+stateParams.get('iyear')>=1945&&+stateParams.get('iyear')<=2026)incidentState.year=stateParams.get('iyear');
 if(['coup','attempt','conspiracy'].includes(stateParams.get('ikind')))incidentState.kind=stateParams.get('ikind');if(INCIDENT_REGISTRY.countries[stateParams.get('icountry')])incidentState.country=stateParams.get('icountry');incidentState.query=(stateParams.get('iq')||'').slice(0,200);
 setIncidentMode(true);const v=(stateParams.get('iview')||'').split(',').map(Number);if(v.length===3&&v.every(Number.isFinite)&&v[0]>=.75&&v[0]<=24&&Math.abs(v[1])<40000&&Math.abs(v[2])<40000){++cameraAnimationVersion;[mapState.scale,mapState.tx,mapState.ty]=v;setViewport();}
}else incidentRender();
