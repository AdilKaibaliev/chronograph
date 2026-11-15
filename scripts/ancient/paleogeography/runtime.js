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
 const paths=new WeakMap(),polarPaths=new WeakMap();let lastGeometry=null;
 const pathFor=g=>{if(paths.has(g))return paths.get(g);const d=g.map(poly=>poly.map(ring=>ring.map((p,i)=>(i?'L':'M')+project(p).map(n=>n.toFixed(2)).join(',')).join('')+'Z').join('')).join('');paths.set(g,d);return d;};
 const polarFor=g=>{if(polarPaths.has(g))return polarPaths.get(g);const d=g.filter(poly=>poly[0].some(p=>p[1]<-60)).map(poly=>poly.map(ring=>ring.map(([lon,lat],i)=>{const r=(90+lat)*3,a=lon*Math.PI/180;return(i?'L':'M')+(120+r*Math.sin(a)).toFixed(2)+','+(120-r*Math.cos(a)).toFixed(2);}).join('')+'Z').join('')).join('');polarPaths.set(g,d);return d;};
 const frame=()=>data.frames[paleoTimeline.frameIndex(year,data.frames)]||null;
 const ageText=bp=>bp===0?tr(['1950 год','1950 CE','1950-жыл']):new Intl.NumberFormat(language==='ky'?'ru':language).format(bp)+' '+tr(['лет до 1950 г.','years before 1950','жыл 1950-жылга чейин']);
 const frameText=f=>tr(['Срез модели: ','Model frame: ','Моделдин кесими: '])+ageText(f.bp);
 const noFrame=()=>tr(['Для выбранной эпохи реконструкции нет. Показана современная географическая основа; отсутствие белой заливки не означает отсутствия ледников.','No reconstruction is available for the selected period. A modern geographic base is shown; the absence of white shading does not mean that ice sheets were absent.','Тандалган доор үчүн реконструкция жок. Азыркы географиялык негиз көрсөтүлөт; ак боёктун жоктугу муз калкандары болгон эмес дегенди билдирбейт.']);
 const coverageText=()=>tr(['Доступные срезы: 78051 год до н. э. — 1950 год н. э., шаг 2500 лет.','Available frames: 78051 BCE–1950 CE, spaced 2,500 years apart.','Жеткиликтүү кесимдер: б. з. ч. 78051-жылдан б. з. 1950-жылга чейин, кадамы 2500 жыл.']);
 function settings(){
  const row=el('div','paleo-settings');
  for(const [key,name]of [['enabled',tr(['Берега эпохи','Past coasts','Доордун жээктери'])],['ice',tr(['Ледники','Ice sheets','Муз калкандары'])],['reference',tr(['Современный берег','Modern coast','Азыркы жээк'])]]){const b=btn(name,()=>{state[key]=!state[key];lastGeometry=null;render();});b.dataset.paleoToggle=key;b.setAttribute('aria-pressed',String(state[key]));row.append(b);}return row;
 }
 function legend(compact=false){const row=el('div','paleo-key');for(const [c,name]of [['land',tr(['Суша','Land','Кургактык'])],['shelf',tr(['Зелёный — суша, ныне под морем','Green — land now under the sea','Жашыл — азыр деңиз астындагы кургактык'])],['ice',tr(['Белый — ледниковый щит','White — ice sheet','Ак — муз калканы'])],['reference',tr(['Пунктир — современный берег','Dashes — modern coast','Үзүк сызык — азыркы жээк'])]]){if(compact&&(c==='land'||c==='reference'||c==='ice'&&!state.ice))continue;const s=el('span','',name);s.prepend(el('i','paleo-swatch '+c));row.append(s);}return row;}
 function jump(bp){stopPlay();renderYear(paleoTimeline.fromBP(bp));switchPanel('selection');queueLocationSave();}
 function frameNav(f){
  const row=el('div','paleo-frame-nav');let i=f?data.frames.indexOf(f):24;
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
  panel.append(el('p','paleo-coverage',coverageText()));
  if(year>1950)panel.append(el('p','paleo-coverage',tr(['Для этого года используется опорный срез 1950 года. Он не показывает последующее отступление ледников и изменение берегов.','The 1950 frame is used as a dated reference for this year. It does not show subsequent glacier retreat or coastal changes.','Бул жыл үчүн 1950-жылдагы таяныч кесим колдонулат. Ал андан кийинки муздардын чегинишин жана жээктердин өзгөрүшүн көрсөтпөйт.'])));
  panel.append(settings(),legend());
  if(f)panel.append(frameNav(f));
  const locations=el('select','paleo-locations');locations.id='paleoRegion';locations.setAttribute('aria-label',tr(['Природная область','Landscape region','Табигый аймак']));for(const place of guide.regions){const o=el('option','',tr(place.title));o.value=place.id;locations.append(o);}locations.value=r.id;locations.onchange=()=>activate(guide.regions.find(x=>x.id===locations.value));panel.append(locations);
  const article=el('article','paleo-region');article.dataset.paleoArticle=r.id;article.append(el('h3','',tr(r.title)),el('p','',tr(r.text)));
  if(r.id==='antarctica-ice'&&f)article.append(polarMap(f));
  if(r.focus)article.append(btn(tr(['Показать область','Show region','Аймакты көрсөтүү']),()=>focusLonLat(...r.focus)));
  const example=btn(tr(['Открыть пример · ','Open example · ','Мисалды ачуу · '])+ageText(r.exampleBP),()=>{jump(r.exampleBP);if(r.focus)focusLonLat(...r.focus);});example.dataset.paleoExample=r.id;article.append(example);
  if(r.related.length){article.append(el('h4','',tr(['Свидетельства присутствия людей','Evidence of human presence','Адамдардын болгонун тастыктаган далилдер'])));for(const id of r.related){const rec=ANCIENT_PREVIEW.records.find(x=>x.id===id);if(!rec)continue;const b=btn(tr(rec.title),()=>{hideGuide();document.dispatchEvent(new CustomEvent('chronograph:open-ancient',{detail:id}));});b.dataset.paleoEvidence=id;article.append(b);}}
  article.append(sourceDetails(r.sources));panel.append(article);
  const method=el('details','paleo-method');method.append(el('summary','',tr(['Как читать природную карту','Reading the landscape map','Табигый картаны окуу'])));
  method.append(el('p','',tr(['BP отсчитывается от 1950 года. Показан ближайший срез PaleoMIST с шагом 2500 лет; его возраст подписан отдельно от выбранного года. Контуры упрощены из сетки 0,25°. Это модель берегов и наземных ледниковых щитов; реки, уровни внутренних озёр и сезонный морской лёд ею не датируются.','BP is measured from 1950. The closest PaleoMIST frame is shown at 2,500-year spacing; its age is labelled separately from the selected year. Outlines are simplified from a 0.25° grid. This models marine coasts and grounded ice sheets, not river courses, inland lake levels or seasonal sea ice.','BP 1950-жылдан эсептелет. PaleoMIST моделинин 2500 жылдык кадамдагы эң жакын кесими көрсөтүлөт; анын жашы тандалган жылдан өзүнчө жазылган. Контурлар 0,25° тордон жөнөкөйлөтүлгөн. Модель деңиз жээктерин жана жерге таянган муз калкандарын көрсөтөт; дарыялар, ички көлдөрдүн деңгээли жана мезгилдик деңиз музу даталанбайт.'])));
  method.append(el('p','ancient-reference',guide.sources.paleomist.title),el('p','ancient-reference',tr(['Адаптация: Хронограф — выделение контуров и упрощение для карты.','Adaptation: Chronograph — contour extraction and map simplification.','Ыңгайлаштыруу: Хронограф — контурларды бөлүп алуу жана карта үчүн жөнөкөйлөтүү.'])));
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
  box.append(el('small','',!f?noFrame():state.enabled?tr(['Показан ближайший срез с шагом 2500 лет. Его возраст указан над картой.','The closest frame, at 2,500-year spacing, is shown. Its age is labelled on the map.','2500 жылдык кадамдагы эң жакын кесим көрсөтүлөт. Анын жашы картада жазылган.']):tr(['Природная реконструкция выключена.','Landscape reconstruction is off.','Табигый реконструкция өчүрүлгөн.'])));
 }
 function render(){
  const f=frame(),active=!!f&&state.enabled&&!document.body.classList.contains('future-mode')&&!document.body.classList.contains('textual-place-mode');document.body.classList.toggle('paleo-active',active);shapes.style.display=active?'':'none';marks.style.display=active?'':'none';
  const territories=$('ancientTerritories');if(active){countryLayer.setAttribute('clip-path','url(#paleoLandClip)');territories?.setAttribute('clip-path','url(#paleoLandClip)');}else{countryLayer.setAttribute('clip-path','url(#worldLandClip)');territories?.removeAttribute('clip-path');}
  if(active&&lastGeometry!==f){shapes.replaceChildren();const d=pathFor(f.land);clipShape.setAttribute('d',d);shapes.append(S('path',{d,class:'paleo-land','fill-rule':'evenodd'}),S('path',{d:pathFor(f.shelf),class:'paleo-shelf','fill-rule':'evenodd'}),S('path',{d:pathFor(data.modern),class:'paleo-reference','fill-rule':'evenodd'}));iceOverlay.replaceChildren(S('path',{d:pathFor(f.ice),class:'paleo-ice','fill-rule':'evenodd'}));lastGeometry=f;}
  iceOverlay.style.display=active&&state.ice?'':'none';
  shapes.classList.toggle('hide-ice',!state.ice);shapes.classList.toggle('hide-reference',!state.reference);
  badge.hidden=false;badge.textContent=title()+' · '+(!f?tr(['нет среза этой эпохи','no frame for this period','бул доордун кесими жок']):!state.enabled?tr(['выключена','off','өчүрүлгөн']):year>1950?tr(['опорный срез 1950 года','1950 reference frame','1950-жылдагы таяныч кесим']):ageText(f.bp));badge.setAttribute('aria-label',badge.textContent);badge.dataset.frameBP=f?String(f.bp):'';badge.title=f?frameText(f)+' · '+coverageText():noFrame();
  mapKey.dataset.coverage=paleoTimeline.coverage(year);mapLegend.replaceChildren(...legend(true).children);mapLegend.hidden=!active;
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
