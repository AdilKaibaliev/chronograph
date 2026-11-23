// Geography follows the common year and camera, without entering a separate mode.
(()=>{
 const history=createKyrgyzStudy(KYRGYZ_STUDY),node=(tag,cls,text)=>we(tag,cls,text);
 const layer=document.createElementNS(svg.namespaceURI,'g');layer.id='kyrgyzLocalMap';viewport.insertBefore(layer,$('kyrgyzStudyMap'));
 const panel=node('section','kyrgyz-local');panel.id='kyrgyzLocalHistory';panel.hidden=true;panel.dataset.localeOwned='true';$('panel-events').prepend(panel);
 const labels={local:['На этом участке карты','In this part of the map','Картанын бул бөлүгүндө'],same:['Мир в это время','Elsewhere at the same time','Ошол учурдагы дүйнө'],world:['Обзор мира','World overview','Дүйнөгө сереп'],places:['Места и события','Places and events','Жерлер жана окуялар'],regional:['Район события','Event region','Окуянын аймагы']};
 const t=k=>wl(labels[k]);
 let frame=0,timer=0,lastSignature='',lastGroups=[],lastYear=null;
 const open=id=>document.dispatchEvent(new CustomEvent('kyrgyz-open-episode',{detail:{id}}));
 const button=(text,fn)=>{const b=node('button','',text);b.type='button';b.onclick=fn;return b;};
 function date(e){return e.periodLabel?wl(e.periodLabel):e.from===e.to?ancientCalendar.format(e.year,language):ancientCalendar.format(e.from,language)+' — '+ancientCalendar.format(e.to,language);}
 function groups(){if(lastYear!==year){lastYear=year;lastGroups=history.placesAt(year);}return lastGroups;}
 function visibleGroups(){const m=worldLabelMetrics();if(layerState.places===false||mapState.scale<3||document.body.classList.contains('future-mode'))return [];return groups().filter(g=>{const [x,y]=m.point(...project(g.coord));return x>12&&y>12&&x<m.width-12&&y<m.height-12;});}
 function draw(){
  frame=0;const m=worldLabelMetrics(),visible=visibleGroups(),signature=year+'|'+language+'|'+visible.map(g=>g.coord.join(',')).join(';');
  // Keep the existing Silk Road caption legible when zooming to local history.
  for(const label of $('tradeLayer')?.querySelectorAll('text')||[])label.style.fontSize=(12/m.scale)+'px';
  if(signature!==lastSignature){
   lastSignature=signature;layer.replaceChildren();
   for(const g of visible){
    const [x,y]=project(g.coord),pin=document.createElementNS(svg.namespaceURI,'g'),inner=document.createElementNS(svg.namespaceURI,'g');pin.classList.add('kyrgyz-local-pin');pin.setAttribute('transform','translate('+x+' '+y+')');pin.dataset.px=x;pin.dataset.py=y;pin.dataset.localEpisodes=g.lessons.map(e=>e.id).join(' ');pin.setAttribute('role','button');pin.setAttribute('tabindex','0');
    const name=wl(g.label),title=document.createElementNS(svg.namespaceURI,'title');title.textContent=name+' · '+g.lessons.map(e=>wl(e.title)).join('; ');pin.setAttribute('aria-label',title.textContent);
    const dot=document.createElementNS(svg.namespaceURI,'circle');dot.setAttribute('r','5');
    const label=document.createElementNS(svg.namespaceURI,'text');label.textContent=name.split(' · ')[0];label.setAttribute('x','9');label.setAttribute('y','4');
    inner.append(dot,label);pin.append(inner,title);pin.onpointerdown=e=>e.stopPropagation();pin.onclick=()=>open(g.lessons[0].id);pin.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();open(g.lessons[0].id);}};layer.append(pin);
   }
  }
  // At world scale or outside Kyrgyz historical places there are no local labels.
  // Avoid forcing layout for every SVG label on each camera-animation frame.
  if(!layer.children.length)return;
  const base=svg.getBoundingClientRect(),occupied=[];
  for(const text of viewport.querySelectorAll('text')){if(layer.contains(text))continue;const r=text.getBoundingClientRect();if(r.width&&r.height&&r.right>base.left&&r.left<base.right&&r.bottom>base.top&&r.top<base.bottom)occupied.push([r.left-base.left,r.top-base.top,r.right-base.left,r.bottom-base.top]);}
  for(const pin of layer.children){
   pin.firstElementChild.setAttribute('transform','scale('+1/m.scale+')');const label=pin.querySelector('text'),[x,y]=m.point(+pin.dataset.px,+pin.dataset.py),w=worldLabelWidth(label.textContent,11)+10;label.style.display='none';
   if(mapState.scale<6)continue;
   for(const [dx,dy,anchor]of [[9,4,'start'],[9,-14,'start'],[-9,4,'end'],[9,24,'start'],[-9,-14,'end']]){const left=x+dx-(anchor==='end'?w:0),rect=[left,y+dy-11,left+w,y+dy+4];if(rect[0]<6||rect[2]>m.width-6||rect[1]<6||rect[3]>m.height-6||occupied.some(a=>rect[0]<a[2]+3&&rect[2]>a[0]-3&&rect[1]<a[3]+2&&rect[3]>a[1]-2))continue;label.setAttribute('x',dx);label.setAttribute('y',dy);label.setAttribute('text-anchor',anchor);label.style.display='';occupied.push(rect);break;}
  }
 }
 function concurrent(){
  const host=$('kyrgyzConcurrent');if(!host)return;host.replaceChildren(node('h4','',t('same')));
  const yearText=node('p','kyrgyz-local-date',ancientCalendar.format(year,language));host.append(yearText);
  // Existing world entries use half-open periods. Do not substitute a nearby
  // event or change the selected year when returning to the world overview.
  const regions=WORLD_HISTORY.regions.filter(r=>r.id!=='all');
  const events=WORLD_HISTORY.events.filter(e=>e.year===year&&!/^(ky-|kyrgyz-)/.test(e.id)&&!(e.coord?.[0]>=69&&e.coord[0]<=81&&e.coord[1]>=39&&e.coord[1]<=44)).slice(0,5);
  for(const e of events)host.append(node('p','',wl(e.title)+' — '+wl(e.text)));
  const older=year<610?ANCIENT_PREVIEW.records.filter(e=>e.from<=year&&year<e.to&&!e.kyrgyz&&['polity','polities','city'].includes(e.kind)).slice(0,8).map(e=>wl(e.title)):year<1300?displayEmpiresForYear(year).slice(0,8).map(e=>translate(e.name,language)):[];
  if(older.length)host.append(node('p','',older.join(' · ')));
  for(const region of regions){const entries=worldHistory.at(year,region.id).filter(x=>!x.entry.kyrgyzHistory).sort((a,b)=>Number(b.entry.kind==='state')-Number(a.entry.kind==='state'));if(!entries.length)continue;const row=node('p','');row.append(node('strong','',wl(region.name)+': '));row.append(document.createTextNode(entries.slice(0,3).map(x=>wl(x.phase.title||x.entry.name)).join(' · ')));host.append(row);}
  const overview=button(t('world'),()=>{stopPlay();animateCamera({scale:1,tx:0,ty:0});queueLocationSave();});host.append(overview);
 }
 function render(){
  const visible=visibleGroups(),ids=new Set(visible.flatMap(g=>g.lessons.map(e=>e.id))),items=history.at(year).filter(e=>ids.has(e.id));
  panel.hidden=!items.length;panel.replaceChildren();
  if(items.length){panel.append(node('h3','',t('local')),node('p','kyrgyz-local-date',ancientCalendar.format(year,language)));const list=node('div','kyrgyz-local-list');for(const e of items){const b=button(wl(e.title),()=>open(e.id));b.dataset.localEpisode=e.id;b.append(node('small','',date(e)));list.append(b);}panel.append(list);}
  concurrent();queueLocationSave();
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(draw);clearTimeout(timer);timer=setTimeout(render,120);}
 new MutationObserver(schedule).observe(viewport,{attributes:true,attributeFilter:['transform']});
 new MutationObserver(()=>{lastYear=null;lastSignature='';schedule();}).observe($('timelineYear'),{childList:true,subtree:true,characterData:true});
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
 new MutationObserver(schedule).observe(placeLayer,{attributes:true,attributeFilter:['class']});
 new ResizeObserver(schedule).observe(svg);localeSelect.addEventListener('change',()=>{lastSignature='';schedule();});
 document.addEventListener('kyrgyz-context-change',schedule);schedule();
})();
