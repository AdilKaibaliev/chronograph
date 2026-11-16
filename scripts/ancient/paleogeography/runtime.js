// Sourced physical geography on the existing timeline. No independent clock.
(()=>{
 const data=ANCIENT_PALEOGEOGRAPHY,guide=ANCIENT_PALEOGUIDE,cal=ancientCalendar,ns=svg.namespaceURI;
 const state={enabled:true,ice:true,reference:true,open:false,selected:'beringia'};
 const tr=a=>a[({ru:0,en:1,ky:2})[language]??1],el=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls||'';if(text!==undefined)e.textContent=text;return e;};
 const title=()=>tr(['Природная карта','Changing landscapes','Табигый карта']);
 const btn=(text,fn)=>{const b=el('button','btn',text);b.type='button';b.onclick=fn;return b;};
 const S=(tag,attrs={})=>{const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
 const shapes=S('g',{id:'paleoGeography','aria-hidden':'true'}),iceOverlay=S('g',{id:'paleoIceOverlay','aria-hidden':'true'}),marks=S('g',{id:'paleoMarkers'});
 shapes.dataset.localeOwned=iceOverlay.dataset.localeOwned=marks.dataset.localeOwned='true';viewport.insertBefore(shapes,countryLayer);viewport.insertBefore(iceOverlay,$('empireLabelLayer'));viewport.append(marks);
 const defs=S('defs'),clip=S('clipPath',{id:'paleoLandClip',clipPathUnits:'userSpaceOnUse'}),clipShape=S('path',{'clip-rule':'evenodd'});clip.append(clipShape);defs.append(clip);viewport.prepend(defs);
 const mapKey=el('div','paleo-map-key');mapKey.id='paleoMapKey';mapKey.dataset.localeOwned='true';
 const badge=btn('',()=>openGuide());badge.id='paleoBadge';const mapLegend=el('div','paleo-key');mapLegend.id='paleoMapLegend';mapKey.append(badge,mapLegend);$('mapCard').append(mapKey);
 const paths=new WeakMap(),polarPaths=new WeakMap(),failures=new Set(),loading=new Set();let lastGeometry=null;
 const store=createPaleoFrameStore(async url=>{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('Landscape frame '+response.status);return response.json();});
 function requestFrame(f){
  if(!f?.asset||store.get(f)||loading.has(f.asset)||failures.has(f.asset))return;
  loading.add(f.asset);store.request(f).then(()=>{
   failures.delete(f.asset);loading.delete(f.asset);if(frame()===f){render();const i=data.frames.indexOf(f);for(const next of [data.frames[i-1],data.frames[i+1]])if(next?.asset)store.request(next).catch(()=>{});}
  }).catch(()=>{loading.delete(f.asset);failures.add(f.asset);if(frame()===f)render();});
 }
 const pathFor=g=>{if(paths.has(g))return paths.get(g);const d=g.map(poly=>poly.map(ring=>ring.map((p,i)=>(i?'L':'M')+project(p).map(n=>n.toFixed(2)).join(',')).join('')+'Z').join('')).join('');paths.set(g,d);return d;};
 const polarFor=g=>{if(polarPaths.has(g))return polarPaths.get(g);const d=g.filter(poly=>poly[0].some(p=>p[1]<-60)).map(poly=>poly.map(ring=>ring.map(([lon,lat],i)=>{const r=(90+lat)*3,a=lon*Math.PI/180;return(i?'L':'M')+(120+r*Math.sin(a)).toFixed(2)+','+(120-r*Math.cos(a)).toFixed(2);}).join('')+'Z').join('')).join('');polarPaths.set(g,d);return d;};
 const frame=()=>data.frames[paleoTimeline.frameIndex(year,data.frames)]||null;
 const ageText=bp=>bp===0?tr(['1950 год','1950 CE','1950-жыл']):new Intl.NumberFormat(language==='ky'?'ru':language).format(bp)+' '+tr(['лет до 1950 г.','years before 1950','жыл 1950-жылга чейин']);
 const modelName=f=>f.source==='krapp2021'?'Krapp et al. (2021)':'PaleoMIST 1.0';
 const frameText=f=>modelName(f)+' · '+ageText(f.bp)+(f.source==='krapp2021'?' · '+tr(['северные льды: ','northern ice: ','түндүк муздар: '])+(f.bp>=123000?'CLIMBER-2/SICOPOLIS':'ICE-6G'):'');
 const loadText=f=>failures.has(f.asset)?tr(['Срез не загрузился.','The frame could not be loaded.','Кесим жүктөлгөн жок.']):tr(['Загружается срез…','Loading the frame…','Кесим жүктөлүүдө…']);
 const displayedText=f=>lastGeometry?tr(['Пока показан: ','Currently shown: ','Азыр көрсөтүлүүдө: '])+frameText(lastGeometry):tr(['Пока показана современная географическая основа.','The modern geographic base is shown while loading.','Жүктөлгөнчө азыркы географиялык негиз көрсөтүлөт.']);
 const noFrame=()=>tr(['Для выбранной эпохи реконструкции нет. Показана современная географическая основа; отсутствие белой заливки не означает отсутствия ледников.','No reconstruction is available for the selected period. A modern geographic base is shown; the absence of white shading does not mean that ice sheets were absent.','Тандалган доор үчүн реконструкция жок. Азыркы географиялык негиз көрсөтүлөт; ак боёктун жоктугу муз калкандары болгон эмес дегенди билдирбейт.']);
 const coverageText=()=>tr(['Вся шкала от 350000 года до н. э.: ранние срезы через 1000 лет, PaleoMIST — через 2500 лет. Последний срез — 1950 год н. э.','The full timeline from 350000 BCE: earlier frames every 1,000 years and PaleoMIST every 2,500 years. The latest frame is 1950 CE.','Б. з. ч. 350000-жылдан башталган бүт шкала: алгачкы кесимдер 1000 жыл сайын, PaleoMIST 2500 жыл сайын. Акыркы кесим — б. з. 1950-жыл.']);
 function settings(){
  const row=el('div','paleo-settings');
  for(const [key,name]of [['enabled',tr(['Берега эпохи','Past coasts','Доордун жээктери'])],['ice',tr(['Ледники','Ice sheets','Муз калкандары'])],['reference',tr(['Современный берег','Modern coast','Азыркы жээк'])]]){const b=btn(name,()=>{state[key]=!state[key];render();});b.dataset.paleoToggle=key;b.setAttribute('aria-pressed',String(state[key]));row.append(b);}return row;
 }
 function legend(compact=false){const row=el('div','paleo-key');for(const [c,name]of [['land',tr(['Суша','Land','Кургактык'])],['shelf',tr(['Зелёный — суша, ныне под морем','Green — land now under the sea','Жашыл — азыр деңиз астындагы кургактык'])],['ice',tr(['Белый — ледниковый щит','White — ice sheet','Ак — муз калканы'])],['reference',tr(['Пунктир — современный берег','Dashes — modern coast','Үзүк сызык — азыркы жээк'])]]){if(compact&&(c==='land'||c==='reference'||c==='ice'&&!state.ice))continue;const s=el('span','',name);s.prepend(el('i','paleo-swatch '+c));row.append(s);}return row;}
 function jump(bp){stopPlay();renderYear(Math.max(TIMELINE_MIN,paleoTimeline.fromBP(bp)));switchPanel('selection');queueLocationSave();}
 function frameNav(f){
  const row=el('div','paleo-frame-nav');let i=f?data.frames.indexOf(f):0;
  const older=btn(tr(['← Раньше','← Earlier','← Мурун']),()=>jump(data.frames[Math.max(0,i-1)].bp));older.disabled=i<=0;
  const younger=btn(tr(['Позже →','Later →','Кийин →']),()=>jump(data.frames[Math.min(data.frames.length-1,i+1)].bp));younger.disabled=i>=data.frames.length-1;
  older.dataset.paleoStep='older';younger.dataset.paleoStep='younger';row.append(older,younger);return row;
 }
 function activate(r,focus=true){state.selected=r.id;state.open=true;renderPanel();switchPanel('selection');if(focus&&r.focus)focusLonLat(...r.focus);renderMarkers();resizeMarkers();}
 function openGuide(id=state.selected){activate(guide.regions.find(r=>r.id===id)||guide.regions[0],false);}
 function hideGuide(){state.open=false;document.body.classList.remove('paleo-selection');}
 function sourceDetails(ids){const d=el('details','paleo-sources');d.append(el('summary','',tr(['Источники','Sources','Булактар'])));for(const id of [...new Set(ids)])d.append(el('p','ancient-reference',guide.sources[id].title));return d;}
 function polarMap(f){
  const s=S('svg',{viewBox:'0 0 240 240',role:'img','aria-label':tr(['Антарктида · тот же временной срез','Antarctica · the same time slice','Антарктида · ошол эле убакыт кесими'])});s.classList.add('paleo-polar');s.append(S('circle',{cx:120,cy:120,r:114,fill:'#c8bea7'}));
  for(const [geometry,cls]of [[f.land,'paleo-land'],[f.ice,'paleo-ice'],[data.modern,'paleo-reference']]){if(cls==='paleo-ice'&&!state.ice||cls==='paleo-reference'&&!state.reference)continue;s.append(S('path',{d:polarFor(geometry),class:cls,'fill-rule':'evenodd'}));}
  s.append(S('circle',{cx:120,cy:120,r:2,fill:'#5e543b'}));return s;
 }
 function renderPanel(){
  let panel=$('panel-selection').querySelector('.paleo-panel');if(!panel){panel=el('div','paleo-panel');panel.dataset.localeOwned='true';$('panel-selection').append(panel);}panel.replaceChildren();document.body.classList.toggle('paleo-selection',state.open);if(!state.open)return;
  const f=frame(),r=guide.regions.find(x=>x.id===state.selected)||guide.regions[0];
  panel.append(el('h2','',title()),el('p','paleo-current-year',cal.format(year,language)),el('p','paleo-model-date',f?frameText(f):noFrame()));
  if(f&&state.enabled&&!store.get(f)){panel.append(el('p','paleo-loading',loadText(f)+' '+displayedText(f)));if(failures.has(f.asset)){const retry=btn(tr(['Повторить загрузку','Retry loading','Кайра жүктөө']),()=>{failures.delete(f.asset);render();});retry.dataset.paleoRetry='true';panel.append(retry);}}
  panel.append(el('p','paleo-coverage',coverageText()));
  if(year>1950)panel.append(el('p','paleo-coverage',tr(['Для этого года используется опорный срез 1950 года. Он не показывает последующее отступление ледников и изменение берегов.','The 1950 frame is used as a dated reference for this year. It does not show subsequent glacier retreat or coastal changes.','Бул жыл үчүн 1950-жылдагы таяныч кесим колдонулат. Ал андан кийинки муздардын чегинишин жана жээктердин өзгөрүшүн көрсөтпөйт.'])));
  panel.append(settings(),legend());
  if(f)panel.append(frameNav(f));
  const locations=el('select','paleo-locations');locations.id='paleoRegion';locations.setAttribute('aria-label',tr(['Природная область','Landscape region','Табигый аймак']));for(const place of guide.regions){const o=el('option','',tr(place.title));o.value=place.id;locations.append(o);}locations.value=r.id;locations.onchange=()=>activate(guide.regions.find(x=>x.id===locations.value));panel.append(locations);
  const article=el('article','paleo-region');article.dataset.paleoArticle=r.id;article.append(el('h3','',tr(r.title)),el('p','',tr(r.text)));
  const shown=f&&(store.get(f)||lastGeometry);
  if(r.id==='antarctica-ice'&&shown)article.append(polarMap(shown));
  if(f?.source==='krapp2021')article.append(el('p','paleo-coverage',tr(['Для этого раннего периода берега построены по глобальному уровню моря. Ледниковая история детально моделируется для Северного полушария; маска южных льдов не даёт самостоятельной региональной хронологии.','For this earlier period, coasts follow global sea level. Ice history is modelled in detail for the Northern Hemisphere; the southern ice mask does not provide a separate regional chronology.','Бул алгачкы доордун жээктери дүйнөлүк деңиз деңгээли боюнча түзүлгөн. Муз тарыхы Түндүк жарым шар үчүн кеңири моделденген; түштүктөгү муз маскасы өзүнчө аймактык хронология бербейт.'])));
  if(r.focus)article.append(btn(tr(['Показать область','Show region','Аймакты көрсөтүү']),()=>focusLonLat(...r.focus)));
  const example=btn(tr(['Открыть пример · ','Open example · ','Мисалды ачуу · '])+ageText(r.exampleBP),()=>{jump(r.exampleBP);if(r.focus)focusLonLat(...r.focus);});example.dataset.paleoExample=r.id;article.append(example);
  if(r.related.length){article.append(el('h4','',tr(['Свидетельства присутствия людей','Evidence of human presence','Адамдардын болгонун тастыктаган далилдер'])));for(const id of r.related){const rec=ANCIENT_PREVIEW.records.find(x=>x.id===id);if(!rec)continue;const b=btn(tr(rec.title),()=>{hideGuide();document.dispatchEvent(new CustomEvent('chronograph:open-ancient',{detail:id}));});b.dataset.paleoEvidence=id;article.append(b);}}
  article.append(sourceDetails(r.sources));panel.append(article);
  const method=el('details','paleo-method');method.append(el('summary','',tr(['Как читать природную карту','Reading the landscape map','Табигый картаны окуу'])));
  method.append(el('p','',tr(['BP отсчитывается от 1950 года. Возраст ближайшего среза указан отдельно от выбранного года. Это реконструкция, а не съёмка каждого года. Реки, уровни внутренних озёр и сезонный морской лёд не датируются.','BP is measured from 1950. The nearest frame is dated separately from the selected year. This is a reconstruction, not an annual survey. River courses, inland lake levels and seasonal sea ice are not dated.','BP 1950-жылдан эсептелет. Эң жакын кесимдин жашы тандалган жылдан өзүнчө көрсөтүлөт. Бул ар бир жылдын өлчөөсү эмес, реконструкция. Дарыялар, ички көлдөрдүн деңгээли жана мезгилдик деңиз музу даталанбайт.'])));
  method.append(el('p','',f?.source==='krapp2021'?tr(['Krapp и соавторы (2021): шаг 1000 лет, сетка 0,5°. Берега — уровень моря Spratt–Lisiecki и рельеф ETOPO1; северные льды — ICE-6G и CLIMBER-2/SICOPOLIS. Зелёный цвет показывает сушу относительно среза 0 BP той же модели.','Krapp et al. (2021): 1,000-year spacing, 0.5° grid. Coasts use Spratt–Lisiecki sea level and ETOPO1 relief; northern ice uses ICE-6G and CLIMBER-2/SICOPOLIS. Green marks land relative to the same model’s 0 BP frame.','Krapp жана авторлоштор (2021): кадамы 1000 жыл, тору 0,5°. Жээктер Spratt–Lisiecki деңиз деңгээлине жана ETOPO1 рельефине; түндүк муздар ICE-6G жана CLIMBER-2/SICOPOLIS моделдерине таянат. Жашыл түс ошол эле моделдин 0 BP кесимине салыштырмалуу кургактыкты көрсөтөт.']):tr(['PaleoMIST 1.0: шаг 2500 лет, сетка 0,25°. Модель учитывает уровень моря и изменения высоты земной коры под воздействием ледников.','PaleoMIST 1.0: 2,500-year spacing, 0.25° grid. The model accounts for sea level and crustal height changes caused by ice loading.','PaleoMIST 1.0: кадамы 2500 жыл, тору 0,25°. Модель деңиз деңгээлин жана муз салмагынан жер кыртышынын бийиктигинин өзгөрүшүн эске алат.'])));
  method.append(el('p','',tr(['В ранней серии северные льды моделируются CLIMBER-2/SICOPOLIS до среза 123000 BP включительно и ICE-6G начиная со среза 122000 BP. С 80000 BP атлас использует PaleoMIST. На этих стыках меняется модель; различие контуров нельзя целиком относить к природным изменениям между соседними годами.','In the earlier series, northern ice uses CLIMBER-2/SICOPOLIS through the 123000 BP frame and ICE-6G from the 122000 BP frame. The atlas uses PaleoMIST from 80000 BP. These are model junctions; outline differences cannot be attributed entirely to natural changes between adjacent years.','Алгачкы катарда түндүк муздар 123000 BP кесимине чейин CLIMBER-2/SICOPOLIS, 122000 BP кесиминен тартып ICE-6G менен моделденет. 80000 BP кесиминен тартып атлас PaleoMIST моделин колдонот. Бул чектерде модель алмашат; контурлардын айырмасын толугу менен коңшу жылдардагы табигый өзгөрүүлөргө таандык кылууга болбойт.'])));
  method.append(el('p','ancient-reference',guide.sources[f?.source==='krapp2021'?'krapp2021':'paleomist'].title),el('p','ancient-reference',tr(['Адаптация: Хронограф — выделение контуров и упрощение для карты.','Adaptation: Chronograph — contour extraction and map simplification.','Ыңгайлаштыруу: Хронограф — контурларды бөлүп алуу жана карта үчүн жөнөкөйлөтүү.'])));
  panel.append(method);
 }
 function renderMarkers(){
  marks.replaceChildren();if(!state.enabled||!frame())return;
  for(const r of guide.regions.filter(x=>x.focus)){
   const p=project(r.coord),g=S('g',{transform:`translate(${p})`,role:'button',tabindex:0,'aria-label':tr(r.title)});g.dataset.paleoMarker=r.id;
   const inner=S('g',{class:'paleo-marker-content'}),circle=S('circle',{r:5}),text=S('text',{x:9,y:4});text.textContent=tr(r.title);text.style.display=state.open&&state.selected===r.id?'':'none';const tip=S('title');tip.textContent=tr(r.title);inner.append(circle,text,tip);g.append(inner);
   let down=null;g.onpointerdown=e=>{if(e.button!==0)return;e.stopPropagation();e.preventDefault();down={x:e.clientX,y:e.clientY,tx:mapState.tx,ty:mapState.ty,moved:false};g.setPointerCapture(e.pointerId);};g.onpointermove=e=>{if(!down)return;down.moved ||= Math.hypot(e.clientX-down.x,e.clientY-down.y)>5;if(down.moved){const a=screenPoint(e.clientX,e.clientY),b=screenPoint(down.x,down.y);mapState.tx=down.tx+a.x-b.x;mapState.ty=down.ty+a.y-b.y;setViewport();}};g.onpointerup=e=>{if(!down)return;const moved=down.moved;down=null;if(g.hasPointerCapture(e.pointerId))g.releasePointerCapture(e.pointerId);if(moved)queueLocationSave();else activate(r,false);};g.onpointercancel=()=>{down=null;};g.onclick=e=>{e.stopPropagation();if(e.detail===0)activate(r,false);};g.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();activate(r,false);}};marks.append(g);
  }resizeMarkers();
 }
 function resizeMarkers(){for(const n of marks.querySelectorAll('.paleo-marker-content'))n.setAttribute('transform',`scale(${1/(mapState.scale*(svg.getScreenCTM()?.a||1))})`);}
 function renderOverview(){
  const host=$('panel-events').querySelector('.ancient-panel');if(!host)return;let box=host.querySelector('.paleo-overview');if(!box){box=el('div','paleo-overview');box.dataset.localeOwned='true';host.insertBefore(box,host.children[3]||null);}box.replaceChildren();const f=frame();
  box.append(btn(title()+(f?' · '+ageText(f.bp):''),()=>openGuide()));
  box.append(el('small','',!f?noFrame():state.enabled?(!store.get(f)?loadText(f)+' '+displayedText(f):frameText(f)):tr(['Природная реконструкция выключена.','Landscape reconstruction is off.','Табигый реконструкция өчүрүлгөн.'])));
  if(f&&(f.bp>=80000&&f.bp<=81000||f.source==='krapp2021'&&f.bp>=122000&&f.bp<=123000))box.append(el('small','',tr(['Здесь проходит стык двух моделей: различия контуров не означают мгновенного изменения природы.','Two reconstructions meet here: outline differences do not represent an instantaneous natural change.','Бул жерде эки модель туташат: контурлардын айырмасы табияттын заматта өзгөрүшүн билдирбейт.'])));
 }
 function render(){
  const f=frame(),visible=!!f&&state.enabled&&!document.body.classList.contains('future-mode')&&!document.body.classList.contains('textual-place-mode');if(visible)requestFrame(f);
  const ready=f&&store.get(f),shown=ready||lastGeometry,active=visible&&!!shown;document.body.classList.toggle('paleo-active',active);shapes.style.display=active?'':'none';marks.style.display=visible?'':'none';
  const territories=$('ancientTerritories');if(active){countryLayer.setAttribute('clip-path','url(#paleoLandClip)');territories?.setAttribute('clip-path','url(#paleoLandClip)');}else{countryLayer.setAttribute('clip-path','url(#worldLandClip)');territories?.removeAttribute('clip-path');}
  if(active&&lastGeometry!==shown){shapes.replaceChildren();const d=pathFor(shown.land);clipShape.setAttribute('d',d);shapes.append(S('path',{d,class:'paleo-land','fill-rule':'evenodd'}),S('path',{d:pathFor(shown.shelf),class:'paleo-shelf','fill-rule':'evenodd'}),S('path',{d:pathFor(data.modern),class:'paleo-reference','fill-rule':'evenodd'}));iceOverlay.replaceChildren(S('path',{d:pathFor(shown.ice),class:'paleo-ice','fill-rule':'evenodd'}));lastGeometry=shown;}
  iceOverlay.style.display=active&&state.ice?'':'none';
  shapes.classList.toggle('hide-ice',!state.ice);shapes.classList.toggle('hide-reference',!state.reference);
  badge.hidden=false;badge.textContent=title()+' · '+(!f?tr(['нет среза этой эпохи','no frame for this period','бул доордун кесими жок']):!state.enabled?tr(['выключена','off','өчүрүлгөн']):!ready?loadText(f)+(shown?' · '+ageText(shown.bp):''):year>1950?tr(['опорный срез 1950 года','1950 reference frame','1950-жылдагы таяныч кесим']):ageText(f.bp));badge.setAttribute('aria-label',badge.textContent);badge.dataset.frameBP=f?String(f.bp):'';badge.dataset.displayedBP=active?String(shown.bp):'';badge.dataset.source=active?shown.source:'';badge.title=f?frameText(f)+' · '+coverageText():noFrame();
  mapKey.dataset.coverage=paleoTimeline.coverage(year);mapKey.setAttribute('aria-busy',String(visible&&!ready&&!failures.has(f?.asset)));mapLegend.replaceChildren(...legend(true).children);mapLegend.hidden=!active;
  renderMarkers();renderOverview();renderPanel();
 }
 document.addEventListener('chronograph:paleo-open',()=>openGuide());
 document.addEventListener('pointerdown',e=>{if(e.target.closest('#ancientLayer,#ancientTerritories,.ancient-card,#worldTerritoryLayer,#empireLayer'))hideGuide();},true);
 document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.closest('#ancientLayer,#ancientTerritories,.ancient-card'))hideGuide();},true);
 const baseRender=renderYear;renderYear=function(...args){const result=baseRender(...args);render();return result;};
 const baseViewport=setViewport;setViewport=function(...args){const result=baseViewport(...args);resizeMarkers();return result;};
 const playback=nextPlaybackYear;nextPlaybackYear=function(y){const target=playback(y);const next=data.frames.map(f=>f.year).find(v=>v>y&&v<=1950);return next!==undefined&&next<target?next:target;};
 $('futureBtn').addEventListener('click',hideGuide,true);
 let modeKey='';new MutationObserver(()=>{const key=String(document.body.classList.contains('future-mode'))+String(document.body.classList.contains('textual-place-mode'));if(key!==modeKey){modeKey=key;render();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 render();const requested=new URLSearchParams(location.search).get('geography');if(guide.regions.some(r=>r.id===requested)){openGuide(requested);const r=guide.regions.find(r=>r.id===requested);if(r.focus)focusLonLat(...r.focus);}
})();
