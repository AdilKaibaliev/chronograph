// Uses the atlas year and camera; no independent playback clock or map mode.
(()=>{
 const model=createKyrgyzTerritories(KYRGYZ_TERRITORIES),ns=svg.namespaceURI;
 const sn=(tag,attrs={})=>{const n=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;},el=(tag,cls,text)=>we(tag,cls,text);
 const layer=sn('g',{id:'kyrgyzTerritoriesMap','aria-hidden':'true'});viewport.insertBefore(layer,empireLabelLayer);
 const defs=sn('defs'),pattern=sn('pattern',{id:'kyrgyzTerritoryHatch',width:7,height:7,patternUnits:'userSpaceOnUse',patternTransform:'rotate(30)'}),hatch=sn('path',{d:'M0 0V7',stroke:'#996b22','stroke-width':1,'stroke-opacity':.6});pattern.append(hatch);defs.append(pattern);layer.append(defs);const painted=sn('g'),references=sn('g');layer.append(painted,references);
 const panel=el('details','kyrgyz-territories-panel');panel.id='kyrgyzTerritories';panel.dataset.localeOwned='true';
 const labels={title:['Территории кыргызов','Kyrgyz territories','Кыргыздардын аймактары'],core:['Владения / государство','Domains / state','Ээликтер / мамлекет'],administrative:['Автономия / союзная республика','Autonomy / union republic','Автономия / союздук республика'],community:['Районы проживания','Settlement regions','Жашаган аймактар'],influence:['Военно-политическое влияние','Military and political influence','Аскердик-саясий таасир'],reference:['Географические свидетельства','Geographic evidence','Географиялык маалыматтар'],sources:['Источники','Sources','Булактар'],previous:['← Предыдущая смена','← Previous change','← Мурунку өзгөрүү'],next:['Следующая смена →','Next change →','Кийинки өзгөрүү →'],approx:['Региональная реконструкция','Regional reconstruction','Аймактык реконструкция'],show:['Показать территорию','Show territory','Аймакты көрсөтүү']};
 const t=k=>wl(labels[k]),button=(text,fn)=>{const b=el('button','',text);b.type='button';b.onclick=fn;return b;};
 let signature='',panelSignature='',scheduled=false,previousFrame=null,selected='';
 function attach(){const host=document.body.classList.contains('kyrgyz-study-mode')?$('kyrgyzStudy'):$('panel-events');if(host&&panel.parentNode!==host)host.prepend(panel);}
 function focus(r){if(Number.isInteger(r.shape))worldAreaCamera({polygons:KYRGYZ_TERRITORIES.shapes[r.shape]});else if(r.coord)focusLonLat(...r.coord,5);queueLocationSave();}
 function renderPanel(f,visible){attach();panel.hidden=!visible||!f.rows.length;const key=[f.from,language,selected].join('|');if(key===panelSignature)return;panelSignature=key;panel.replaceChildren();
  const summary=el('summary','',t('title'));summary.append(el('small','',ancientCalendar.format(year,language)));panel.append(summary);
  const legend=el('div','kyrgyz-territory-legend');for(const kind of [...new Set(f.rows.map(r=>r.kind))]){const item=el('span','',t(kind));item.dataset.kind=kind;legend.append(item);}panel.append(legend);
  const nav=el('div','kyrgyz-territory-nav');for(const dir of [-1,1]){const dest=model.next(year,dir),b=button(t(dir<0?'previous':'next'),()=>{const y=model.next(year,dir);if(y===null)return;stopPlay();selected='';renderYear(y);queueLocationSave();});b.disabled=dest===null;b.dataset.territoryDirection=String(dir);nav.append(b);}panel.append(nav);
  const list=el('div','kyrgyz-territory-list');for(const r of f.rows){const b=button(wl(r.title),()=>{selected=r.id;panelSignature='';renderPanel(model.at(year),true);focus(r);});b.dataset.kyrgyzTerritory=r.id;b.setAttribute('aria-pressed',String(selected===r.id));b.append(el('small','',t(r.kind)));list.append(b);}panel.append(list);
  const r=f.rows.find(r=>r.id===selected);if(r){const card=el('article','kyrgyz-territory-card');card.append(el('h3','',wl(r.title)),el('p','',wl(r.text)));const info=el('details','');info.append(el('summary','',t('sources')));for(const s of r.sources)info.append(el('p','',s));card.append(info);panel.insertBefore(card,list);}
 }
 function render(){scheduled=false;const f=model.at(year),visible=layerState.empires!==false&&!document.body.classList.contains('future-mode'),key=f.from+'|'+f.to+'|'+visible;
  if(key!==signature){signature=key;painted.replaceChildren();references.replaceChildren();layer.classList.toggle('hidden-layer',!visible);
   if(visible){for(const l of f.layers){const g=sn('g',{'data-kyrgyz-territory-kind':l.kind,class:'kyrgyz-territory '+l.kind}),d=worldPolygonPath(l.polygons);g.append(sn('path',{d,class:'kyrgyz-territory-fill','fill-rule':'nonzero'}),sn('path',{d,class:'kyrgyz-territory-edge'}));painted.append(g);}
    for(const r of f.rows.filter(r=>r.kind==='reference'&&r.coord)){const[x,y]=project(r.coord);const g=sn('g',{transform:'translate('+x+' '+y+')','data-kyrgyz-reference':r.id});g.append(sn('circle',{r:12,class:'kyrgyz-territory-reference'}));references.append(g);}
    if(previousFrame!==null&&previousFrame!==f.from&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&painted.animate){painted.animate([{opacity:.35},{opacity:1}],{duration:380,easing:'ease-out'});for(const edge of painted.querySelectorAll('.kyrgyz-territory-edge'))edge.animate([{strokeWidth:3},{strokeWidth:1.5}],{duration:450});}
   }previousFrame=f.from;
  }
  const m=worldLabelMetrics(),unit=1/m.scale;pattern.setAttribute('width',7*unit);pattern.setAttribute('height',7*unit);hatch.setAttribute('d','M0 0V'+7*unit);hatch.setAttribute('stroke-width',unit);for(const g of references.children)g.firstElementChild.setAttribute('r',12*unit);
  layer.style.setProperty('--kyrgyz-territory-opacity',String(Math.max(0,Math.min(1,overlayOpacity))));
  if(!f.rows.some(r=>r.id===selected))selected='';renderPanel(f,visible);const date=panel.querySelector('summary small');if(date)date.textContent=ancientCalendar.format(year,language);for(const b of panel.querySelectorAll('[data-territory-direction]'))b.disabled=model.next(year,+b.dataset.territoryDirection)===null;
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
 document.body.classList.add('kyrgyz-territories-ready');
 new MutationObserver(schedule).observe($('timelineYear'),{childList:true,subtree:true,characterData:true});new MutationObserver(schedule).observe(viewport,{attributes:true,attributeFilter:['transform']});new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});new MutationObserver(schedule).observe(empireLayer,{attributes:true,attributeFilter:['class']});new ResizeObserver(schedule).observe(svg);localeSelect.addEventListener('change',schedule);$('opacityRange').addEventListener('input',schedule);document.addEventListener('kyrgyz-context-change',schedule);schedule();
})();
