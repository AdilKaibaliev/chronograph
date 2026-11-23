// All sourced journeys for the common year, whether or not a lesson is open.
(()=>{
 const course=createKyrgyzStudy(KYRGYZ_STUDY),ns=svg.namespaceURI,layer=document.createElementNS(ns,'g');layer.id='kyrgyzMovements';viewport.insertBefore(layer,$('kyrgyzLocalMap'));
 const key=we('section','kyrgyz-movement-key');key.id='kyrgyzMovementKey';key.dataset.localeOwned='true';key.hidden=true;$('mapCard').append(key);
 const labels={title:['Направления движения','Movement directions','Жылыш багыттары'],war:['Поход','Campaign','Жортуул'],migration:['Переселение','Relocation','Көчүү'],other:['Связи и дороги','Connections and roads','Байланыштар жана жолдор'],pause:['Остановить движение','Pause movement','Кыймылды токтотуу'],play:['Показать движение','Animate movement','Кыймылды көрсөтүү']};
 let signature='',scheduled=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const sn=(tag,attrs={})=>{const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
 const color=e=>e.kind==='war'?'#9e3927':e.kind==='migration'?'#86520d':'#28665e';
 function render(){scheduled=false;
  const active=course.at(year).flatMap(e=>(e.routes||[e.route]).filter(r=>r?.length>1).map((route,index)=>({e,route,index}))),visible=!document.body.classList.contains('future-mode')&&layerState.routes!==false&&active.length;
  const next=year+'|'+language+'|'+Boolean(visible);if(signature!==next){signature=next;layer.replaceChildren();key.replaceChildren();key.hidden=!visible;if(!visible)return;
   const title=we('strong','',wl(labels.title));key.append(title);const kinds=new Set();
   for(const {e,route,index}of active){
    const kind=e.kind==='war'?'war':e.kind==='migration'?'migration':'other',c=color(e);kinds.add(kind);
    const g=sn('g',{'data-movement':e.id,'data-route-index':index,class:'kyrgyz-movement'}),defs=sn('defs'),marker=sn('marker',{id:'kyrgyz-movement-'+e.id+'-'+index,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:5,markerHeight:5,orient:'auto'});marker.append(sn('path',{d:'M0 0L10 5L0 10Z',fill:c}));defs.append(marker);g.append(defs);
    const pts=route.map(project);let d=pts.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ');if(e.transport==='flight'){const a=pts[0],b=pts.at(-1);d='M'+a.join(' ')+' Q'+[(a[0]+b[0])/2,Math.min(a[1],b[1])-Math.abs(a[0]-b[0])*.18].join(' ')+' '+b.join(' ');}
    const line=sn('path',{d,class:'kyrgyz-movement-line',stroke:c,'marker-end':'url(#kyrgyz-movement-'+e.id+'-'+index+')'}),hit=sn('path',{d,class:'kyrgyz-movement-hit',role:'button',tabindex:0,'aria-label':wl(e.title)+' · '+wl(labels[kind])}),tooltip=sn('title');tooltip.textContent=wl(e.title);hit.append(tooltip);
    const open=()=>document.dispatchEvent(new CustomEvent('kyrgyz-open-episode',{detail:{id:e.id}}));let pointer=null;
    hit.onpointerdown=ev=>{if(ev.button!==0)return;ev.preventDefault();ev.stopPropagation();pointer={id:ev.pointerId,x:ev.clientX,y:ev.clientY,tx:mapState.tx,ty:mapState.ty,moved:false};hit.setPointerCapture(ev.pointerId);};
    hit.onpointermove=ev=>{if(!pointer||pointer.id!==ev.pointerId)return;ev.stopPropagation();pointer.moved ||= Math.hypot(ev.clientX-pointer.x,ev.clientY-pointer.y)>5;if(pointer.moved){const p=screenPoint(ev.clientX,ev.clientY),q=screenPoint(pointer.x,pointer.y);mapState.tx=pointer.tx+p.x-q.x;mapState.ty=pointer.ty+p.y-q.y;setViewport();}};
    hit.onpointerup=ev=>{if(!pointer||pointer.id!==ev.pointerId)return;ev.stopPropagation();const moved=pointer.moved;pointer=null;if(hit.hasPointerCapture(ev.pointerId))hit.releasePointerCapture(ev.pointerId);if(moved)queueLocationSave();else open();};
    hit.onpointercancel=()=>{pointer=null;};hit.onclick=ev=>{if(ev.detail===0)open();};hit.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();ev.stopPropagation();open();}};
    g.append(sn('path',{d,class:'kyrgyz-movement-halo'}),line,hit);layer.append(g);
   }
   for(const kind of kinds){const item=we('span','',wl(labels[kind]));item.dataset.kind=kind;key.append(item);}
   const toggle=we('button');toggle.type='button';const update=()=>{toggle.textContent=wl(labels[paused?'play':'pause']);toggle.setAttribute('aria-pressed',String(!paused));layer.classList.toggle('paused',paused);};toggle.onclick=()=>{paused=!paused;update();};key.append(toggle);update();
  }
  // Keep the stroke pattern and arrowheads the same screen size at every zoom.
  const m=worldLabelMetrics();for(const p of layer.querySelectorAll('.kyrgyz-movement-line')){p.style.strokeDasharray=(7/m.scale)+' '+(5/m.scale);p.style.setProperty('--route-cycle',(-24/m.scale)+'px');p.setAttribute('stroke-width',2.2/m.scale);}for(const p of layer.querySelectorAll('.kyrgyz-movement-halo'))p.setAttribute('stroke-width',4.5/m.scale);for(const p of layer.querySelectorAll('.kyrgyz-movement-hit'))p.setAttribute('stroke-width',12/m.scale);
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
 new MutationObserver(schedule).observe($('timelineYear'),{childList:true,subtree:true,characterData:true});new MutationObserver(schedule).observe(viewport,{attributes:true,attributeFilter:['transform']});new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});new MutationObserver(schedule).observe(routeLayer,{attributes:true,attributeFilter:['class']});new ResizeObserver(schedule).observe(svg);localeSelect.addEventListener('change',()=>{signature='';schedule();});document.addEventListener('kyrgyz-context-change',schedule);schedule();
})();
