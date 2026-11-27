// A reading course on the common atlas timeline. It never replaces political
// geometries: regional symbols and schematic journeys belong to the selection.
(()=>{
 const course=createKyrgyzStudy(KYRGYZ_STUDY),state={open:false,chapter:'all',selected:'',query:'',expanded:false};
 const labels={title:['История кыргызов','Kyrgyz history','Кыргыз тарыхы'],chapter:['Тема','Topic','Тема'],search:['Найти событие, племя или место','Find an event, tribe or place','Окуяны, урууну же жерди издөө'],close:['Вернуться к миру','Return to world history','Дүйнө тарыхына кайтуу'],contents:['Эпизоды темы','Episodes in this topic','Темадагы окуялар'],previous:['← Назад','← Previous','← Мурунку'],next:['Далее →','Next →','Кийинки →'],sources:['Источники','Sources','Булактар'],places:['Места на карте','Places on the map','Картадагы жерлер'],question:['Вопрос для обсуждения','Question to discuss','Талкуулоо үчүн суроо'],answer:['Показать ответ','Show answer','Жообун көрсөтүү'],empty:['Ничего не найдено. Измените поиск или выберите другую тему.','No matches. Change the search or choose another topic.','Эч нерсе табылган жок. Издөөнү өзгөртүңүз же башка теманы тандаңыз.'],different:['Выбран другой год. Откройте эпизод из списка, чтобы показать его места.','The year has changed. Choose an episode to show its places.','Башка жыл тандалды. Жерлерин көрүү үчүн тизмеден окуяны ачыңыз.'],fit:['Показать все места','Show all places','Бардык жерлерди көрсөтүү'],region:['Отметки · районы и места','Markers · regions and places','Белгилер · аймактар жана жерлер'],migration:['Пунктир · направление переселения','Dashes · direction of relocation','Үзүк сызык · көчүү багыты'],war:['Красный пунктир · направление похода','Red dashes · campaign direction','Кызыл үзүк сызык · жортуул багыты'],road:['Пунктир · дорога и связи','Dashes · roads and connections','Үзүк сызык · жолдор жана байланыштар'],flight:['Дуга · переселение самолётами','Arc · relocation by air','Жаа · учак менен көчүү'],noPlace:['Точное место не установлено источником.','The source does not establish an exact location.','Булакта так жер көрсөтүлгөн эмес.']};
 const kinds={war:['Сражения и походы','Battles and campaigns','Салгылаштар жана жортуулдар'],migration:['Переселение','Relocation','Көчүү'],diplomacy:['Дипломатия','Diplomacy','Дипломатия'],economy:['Хозяйство и связи','Livelihoods and connections','Чарба жана байланыштар'],culture:['Общество и культура','Society and culture','Коом жана маданият'],politics:['Политическая история','Political history','Саясий тарых']};
 const t=k=>wl(labels[k]),make=(tag,cls,text)=>we(tag,cls,text),button=(text,fn,cls='')=>{const b=make('button',cls,text);b.type='button';b.onclick=fn;return b;};
 const panel=make('section','kyrgyz-study');panel.id='kyrgyzStudy';panel.hidden=true;panel.dataset.localeOwned='true';$('panel-compare').prepend(panel);
 const map=document.createElementNS(svg.namespaceURI,'g');map.id='kyrgyzStudyMap';map.dataset.localeOwned='true';viewport.append(map);
 const key=make('div','kyrgyz-study-key');key.id='kyrgyzStudyKey';key.dataset.localeOwned='true';key.hidden=true;$('mapCard').append(key);
 // Stack the keys above the measured layers menu, including wrapped translations.
 const mapCard=$('mapCard'),scope=$('kyrgyzScope'),layers=mapCard.querySelector('.map-legend'),paleo=$('paleoMapKey');
 const stackKeys=()=>{
  const base=mapCard.getBoundingClientRect();let bottom=12;
  for(const item of [paleo,layers]){const r=item?.getBoundingClientRect();if(r?.height)bottom=Math.max(bottom,base.bottom-r.top+8);}
  mapCard.style.setProperty('--kyrgyz-scope-bottom',bottom+'px');
  const r=scope?.getBoundingClientRect();if(r?.height)bottom=Math.max(bottom,base.bottom-r.top+8);
  mapCard.style.setProperty('--kyrgyz-study-key-bottom',bottom+'px');
 };
 const keyResize=new ResizeObserver(stackKeys);for(const item of [mapCard,paleo,layers,scope])if(item)keyResize.observe(item);stackKeys();
 const date=e=>e.periodLabel?wl(e.periodLabel):e.from===e.to?ancientCalendar.format(e.year,language):ancientCalendar.format(e.from,language)+' — '+ancientCalendar.format(e.to,language);
 const current=()=>state.open&&course.activeAt(state.selected,year)?course.record(state.selected):null;
 let resizing=0,renderedYear=null;
 function scheduleLabels(){if(!resizing)resizing=requestAnimationFrame(()=>{resizing=0;layoutLabels();});}
 function layoutLabels(){
  if(!map.children.length)return;
  const m=worldLabelMetrics(),occupied=[],base=svg.getBoundingClientRect();
  for(const text of viewport.querySelectorAll('text')){if(map.contains(text)||text.closest('#kyrgyzLocalMap'))continue;const r=text.getBoundingClientRect();if(r.width&&r.height&&r.right>base.left&&r.left<base.right&&r.bottom>base.top&&r.top<base.bottom)occupied.push([r.left-base.left,r.top-base.top,r.right-base.left,r.bottom-base.top]);}
  for(const g of map.querySelectorAll('[data-study-pin]')){
   const inner=g.firstElementChild,label=g.querySelector('.kyrgyz-study-place-name');inner.setAttribute('transform','scale('+1/m.scale+')');label.textContent=m.width<600?g.dataset.placeName.split(' · ')[0]:g.dataset.placeName;
   const [x,y]=m.point(+g.dataset.px,+g.dataset.py),w=worldLabelWidth(label.textContent,11)+6;label.style.display='none';
   for(const [dx,dy,anchor] of [[15,4,'start'],[15,-15,'start'],[-15,4,'end'],[-15,-15,'end'],[15,25,'start']]){
    const l=x+dx-(anchor==='end'?w:0),r=[l,y+dy-12,l+w,y+dy+4];
    if(r[0]<4||r[2]>m.width-4||r[1]<4||r[3]>m.height-4||occupied.some(a=>r[0]<a[2]+4&&r[2]>a[0]-4&&r[1]<a[3]+3&&r[3]>a[1]-3))continue;
    label.setAttribute('x',dx);label.setAttribute('y',dy);label.setAttribute('text-anchor',anchor);label.style.display='';occupied.push(r);break;
   }
  }
 }
 function focus(e){
  const points=[...(e.route||[]),...e.mapPlaces.map(p=>p[0])];
  if(!points.length){focusLonLat(86,46,2.7);return;}
  const pts=points.map(project),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
  const s=Math.min(e.mapScale||15,SVG_W*.65/Math.max(14,Math.max(...xs)-Math.min(...xs)),SVG_H*.55/Math.max(14,Math.max(...ys)-Math.min(...ys)));
  animateCamera({scale:s,tx:SVG_W/2-cx*s,ty:SVG_H/2-cy*s});
 }
 function focusPlace(index){const e=current(),p=e?.mapPlaces[index];if(!p)return;focusLonLat(...p[0],Math.max(mapState.scale,Math.min(e.mapScale||12,16)));panel.querySelectorAll('[data-study-place]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.studyPlace===index)));queueLocationSave();}
 function draw(){
  map.replaceChildren();const e=current(),visible=e&&!$('panel-compare').hidden&&!document.body.classList.contains('future-mode');key.hidden=!visible;
  if(!visible)return;
  const sn=(tag,attrs={})=>{const n=document.createElementNS(svg.namespaceURI,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
  const color=e.transport==='flight'?'#25647c':e.kind==='war'?'#a24030':e.kind==='migration'?'#976017':'#316b5a';map.style.setProperty('--study-color',color);
  key.replaceChildren(make('span','',t('region')));
  if(e.route?.length>1){
   const defs=sn('defs'),arrow=sn('marker',{id:'kyrgyzStudyArrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:5,markerHeight:5,orient:'auto'});arrow.append(sn('path',{d:'M0 0L10 5L0 10Z',fill:color}));defs.append(arrow);map.append(defs);
   const pts=e.route.map(project);let d=pts.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ');
   if(e.transport==='flight'){const [a,b]=[pts[0],pts.at(-1)];d='M'+a.join(' ')+' Q'+[(a[0]+b[0])/2,Math.min(a[1],b[1])-Math.abs(a[0]-b[0])*.18].join(' ')+' '+b.join(' ');}
   const path=sn('path',{d,class:'kyrgyz-study-route','marker-end':'url(#kyrgyzStudyArrow)'}),title=sn('title');title.textContent=t(e.transport==='flight'?'flight':e.kind==='war'?'war':e.kind==='migration'?'migration':'road');path.append(title);map.append(path);key.append(make('span','',title.textContent));
  }
  e.mapPlaces.forEach(([coord,name],i)=>{
   const [x,y]=project(coord),g=sn('g',{class:'kyrgyz-study-pin',transform:'translate('+x+' '+y+')','data-study-pin':i,'data-px':x,'data-py':y,role:'button',tabindex:0,'aria-label':(i+1)+'. '+wl(name)}),inner=sn('g'),title=sn('title');
   g.dataset.placeName=wl(name);if(e.regional)inner.append(sn('circle',{r:20,class:'kyrgyz-study-region'}));
   const dot=sn('circle',{r:9,class:'kyrgyz-study-dot'}),number=sn('text',{'text-anchor':'middle',y:3.5,class:'kyrgyz-study-number'}),label=sn('text',{class:'kyrgyz-study-place-name'});number.textContent=i+1;label.textContent=wl(name);title.textContent=wl(name);inner.append(dot,number,label);g.append(inner,title);
   g.addEventListener('pointerdown',ev=>ev.stopPropagation());g.onclick=()=>focusPlace(i);g.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();ev.stopPropagation();focusPlace(i);}};map.append(g);
  });
  if(!e.mapPlaces.length)key.replaceChildren(make('span','',t('noPlace')));layoutLabels();
 }
 function choose(id,move=true,keepYear=false){
  const e=course.record(id);if(!e)return;
  stopPlay();state.selected=id;state.open=true;state.expanded=false;panel.hidden=false;document.body.classList.add('kyrgyz-study-mode');
  worldState.event='';worldState.area='';worldState.selected='';
  if($('modal').classList.contains('show'))$('modalClose').click();
  switchPanel('compare');renderYear(keepYear&&course.activeAt(id,year)?year:e.year);render();draw();if(move)focus(e);queueLocationSave();
  $('panel-compare').scrollTop=matchMedia('(max-width:700px)').matches?Math.max(0,panel.querySelector('article').offsetTop-panel.offsetTop):0;panel.querySelector('h3')?.focus({preventScroll:true});
 }
 function close(){state.open=false;state.selected='';panel.hidden=true;document.body.classList.remove('kyrgyz-study-mode');map.replaceChildren();key.hidden=true;renderYear(year);queueLocationSave();$('kyrgyzParallel').focus({preventScroll:true});document.dispatchEvent(new Event('kyrgyz-context-change'));}
 function render(){
  if(!state.open)return;renderedYear=year;panel.replaceChildren();
  const header=make('header','kyrgyz-study-header'),top=make('div','kyrgyz-study-top');top.append(make('h2','',t('title')),button('×',close,'kyrgyz-study-close'));top.lastChild.setAttribute('aria-label',t('close'));top.lastChild.title=t('close');header.append(top);
  const select=make('select','');select.id='kyrgyzStudyChapter';select.setAttribute('aria-label',t('chapter'));
  for(const c of KYRGYZ_STUDY.chapters){const option=make('option','',wl(c.title)+' · '+c.lessons.length);option.value=c.id;option.selected=c.id===state.chapter;select.append(option);}
  select.onchange=()=>{state.chapter=select.value;state.query='';state.expanded=false;const first=course.list(state.chapter)[0];if(first)choose(first.id);else render();};header.append(select);
  const chapter=course.chapter(state.chapter);
  const list=course.list(state.chapter,state.query),idx=list.findIndex(e=>e.id===state.selected),e=current();
  const line=$('kyrgyzParallel');line.dataset.studyTitle=e?wl(e.title):'';
  document.dispatchEvent(new Event('kyrgyz-caption-change'));
  const nav=make('nav','kyrgyz-study-nav');nav.setAttribute('aria-label',t('contents'));
  for(const [text,delta]of [[t('previous'),-1],[t('next'),1]]){const dest=course.neighbour(state.chapter,state.selected,delta,state.query),b=button(text,()=>{const target=course.neighbour(state.chapter,state.selected,delta,state.query);if(target)choose(target.id);});b.disabled=!dest;nav.append(b);}
  const progress=make('span','',idx>=0?(idx+1)+' / '+list.length:'— / '+list.length);progress.setAttribute('role','status');nav.insertBefore(progress,nav.lastChild);header.append(nav);panel.append(header);
  const contents=make('details','kyrgyz-study-contents');contents.open=state.expanded;contents.append(make('summary','',t('contents')+' · '+list.length),make('p','kyrgyz-study-intro',wl(chapter.intro)));contents.ontoggle=()=>{if(contents.isConnected)state.expanded=contents.open;};
  const input=make('input','');input.type='search';input.id='kyrgyzStudySearch';input.placeholder=t('search');input.setAttribute('aria-label',t('search'));input.value=state.query;
  const items=make('ol','');function fill(){items.replaceChildren();const matches=course.list(state.chapter,state.query);for(const item of matches){const li=make('li',''),b=button('',()=>choose(item.id));b.dataset.studyEpisode=item.id;b.setAttribute('aria-current',String(item.id===state.selected));b.append(make('span','',wl(item.title)),make('small','',date(item)));li.append(b);items.append(li);}if(!matches.length)items.append(make('li','kyrgyz-study-empty',t('empty')));contents.querySelector('summary').textContent=t('contents')+' · '+matches.length;const pos=matches.findIndex(x=>x.id===state.selected);progress.textContent=(pos>=0?pos+1:'—')+' / '+matches.length;nav.firstChild.disabled=!course.neighbour(state.chapter,state.selected,-1,state.query);nav.lastChild.disabled=!course.neighbour(state.chapter,state.selected,1,state.query);}
  input.oninput=()=>{state.query=input.value;fill();};contents.append(input,items);fill();panel.append(contents);
  const article=make('article','kyrgyz-study-article');article.setAttribute('aria-live','polite');
  if(e){article.append(make('div','kyrgyz-study-meta',wl(kinds[e.kind]||kinds.culture)+' · '+date(e)));const title=make('h3','',wl(e.title));title.tabIndex=-1;article.append(title,make('p','',wl(e.text)));
   if(e.geographyNote)article.append(make('p','kyrgyz-study-geography',wl(e.geographyNote)));
   const places=make('div','kyrgyz-study-places');places.append(make('h4','',t('places')));
   e.mapPlaces.forEach((p,i)=>{const b=button((i+1)+'. '+wl(p[1]),()=>focusPlace(i));b.dataset.studyPlace=i;b.setAttribute('aria-pressed','false');places.append(b);});
   if(!e.mapPlaces.length)places.append(make('p','',t('noPlace')));else places.append(button(t('fit'),()=>focus(e),'kyrgyz-study-fit'));article.append(places);
   const sources=make('details','kyrgyz-study-sources');sources.append(make('summary','',t('sources')));for(const s of e.sources)sources.append(make('p','',s));article.append(sources);
  }else article.append(make('h3','',wl(['Кыргызстан в выбранном году','Kyrgyzstan in the selected year','Тандалган жылдагы Кыргызстан'])));panel.append(article);
  const active=course.at(year).filter(x=>x.id!==state.selected&&x.mapPlaces.some(p=>p[0][0]>=69&&p[0][0]<=81&&p[0][1]>=39&&p[0][1]<=44));
  if(active.length){const nearby=make('section','kyrgyz-local');nearby.id='kyrgyzSameYear';nearby.append(make('h4','',wl(['Другие места и события этого года','Other places and events this year','Ушул жылдагы башка жерлер жана окуялар'])));const entries=make('div','kyrgyz-local-list');for(const item of active){const b=button(wl(item.title),()=>choose(item.id,false,true));b.dataset.sameYearEpisode=item.id;entries.append(b);}nearby.append(entries);panel.append(nearby);}
  const concurrent=make('section','kyrgyz-concurrent');concurrent.id='kyrgyzConcurrent';panel.append(concurrent);document.dispatchEvent(new Event('kyrgyz-context-change'));
  if(chapter.question){const question=make('section','kyrgyz-study-question');question.append(make('h4','',t('question')),make('p','',wl(chapter.question)));const answer=make('details','');answer.append(make('summary','',t('answer')),make('p','',wl(chapter.answer)));question.append(answer);panel.append(question);}
 }
 function open(){stopPlay();state.open=true;state.query='';state.selected='';panel.hidden=false;document.body.classList.add('kyrgyz-study-mode');switchPanel('compare');render();draw();focusLonLat(75.2,41.65,24);queueLocationSave();}
 document.addEventListener('kyrgyz-open-episode',ev=>{const e=course.record(ev.detail?.id);if(e&&course.activeAt(e.id,year))choose(e.id,false,true);});
 $('kyrgyzParallel').onclick=open;
 $('kyrgyzHistoryBtn').onclick=open;
 for(const id of ['worldExploreBtn','compareBtn','atlasBtn','futureBtn'])$(id)?.addEventListener('click',()=>{if(state.open)close();},true);
 new MutationObserver(()=>{if(state.open&&renderedYear!==year){if(!course.activeAt(state.selected,year))state.selected='';render();draw();queueLocationSave();}}).observe($('timelineYear'),{childList:true,characterData:true,subtree:true});
 new MutationObserver(draw).observe($('panel-compare'),{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(scheduleLabels).observe(viewport,{attributes:true,attributeFilter:['transform']});new ResizeObserver(scheduleLabels).observe(svg);
 localeSelect.addEventListener('change',()=>{if(state.open){render();draw();}});
 const baseLocation=worldLocationHook;worldLocationHook=url=>{baseLocation?.(url);for(const [k,v]of [['kstudy',state.open?state.chapter:''],['kepisode',state.open?state.selected:'']]){if(v)url.searchParams.set(k,v);else url.searchParams.delete(k);}};
 const requested=stateParams.get('kstudy'),episode=stateParams.get('kepisode');
 if(requested&&stateParams.get('mode')!=='future'){state.chapter=course.chapter(requested).id;const chosen=course.list(state.chapter).find(e=>e.id===episode);requestAnimationFrame(()=>{if(chosen&&course.activeAt(chosen.id,year))choose(chosen.id,!stateParams.has('view'),true);else{state.open=true;panel.hidden=false;document.body.classList.add('kyrgyz-study-mode');switchPanel('compare');render();draw();}});}
})();
