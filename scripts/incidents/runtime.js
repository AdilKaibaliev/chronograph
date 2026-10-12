// A short accent in the existing atlas, triggered only by a change of year.
const eventMotion=matchMedia('(prefers-reduced-motion: reduce)');
let eventAccentYear=year,eventAccentTimer=0;
const eventAccentRecords=new Map();
for(const e of WORLD_HISTORY.events){
 if(!e.coord||e.referenceOnly||e.approx||e.from!==e.to)continue;
 if(!eventAccentRecords.has(e.year))eventAccentRecords.set(e.year,[]);
 eventAccentRecords.get(e.year).push(e);
}
function clearEventAccent(){clearTimeout(eventAccentTimer);pulseLayer.replaceChildren();}
function sizeEventAccents(){
 const ratio=Math.max(.01,Math.min(svg.clientWidth/SVG_W,svg.clientHeight/SVG_H));
 for(const g of pulseLayer.querySelectorAll('.year-event-accent-inner'))g.setAttribute('transform','scale('+1/(mapState.scale*ratio)+')');
}
function showYearEventAccents(y){
 clearEventAccent();
 const seen=new Set();
 for(const e of eventAccentRecords.get(y)||[]){
  const key=e.coord.join(',');if(seen.has(key))continue;seen.add(key);
  const g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('class','year-event-accent');g.setAttribute('transform','translate('+project(e.coord).join(' ')+')');g.setAttribute('aria-hidden','true');
  const inner=document.createElementNS(svg.namespaceURI,'g');inner.setAttribute('class','year-event-accent-inner');
  for(const [r,cls] of [[13,'year-event-ring'],[4,'year-event-dot']]){const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('r',r);circle.setAttribute('class',cls);inner.append(circle);}
  const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=wl(e.title);g.append(title,inner);pulseLayer.append(g);
 }
 sizeEventAccents();
 if(!eventMotion.matches)for(const g of pulseLayer.children)g.classList.add('year-event-blink');
 eventAccentTimer=setTimeout(clearEventAccent,2800);
}
new MutationObserver(sizeEventAccents).observe(viewport,{attributes:true,attributeFilter:['transform']});
new ResizeObserver(sizeEventAccents).observe(svg);
eventMotion.addEventListener('change',clearEventAccent);
new MutationObserver(()=>{if(document.body.classList.contains('future-mode'))clearEventAccent();}).observe(document.body,{attributes:true,attributeFilter:['class']});
const eventPreviousHistoryHook=worldHistoryHook;
const eventMapSliceNote=document.querySelector('.map-slice-note');
eventMapSliceNote.dataset.localeOwned='true';
worldHistoryHook=()=>{
 eventPreviousHistoryHook?.();
 eventMapSliceNote.textContent=year>=2011?wl(['Государственные границы · события года','State boundaries · events of the year','Мамлекеттик чек аралар · жылдын окуялары']):translate('Границы приблизительны · дата среза в карточке',language);
 if(year!==eventAccentYear){eventAccentYear=year;if(!document.body.classList.contains('future-mode'))showYearEventAccents(year);}
};
// Old shared links to the removed mode now open the corresponding ordinary year.
if(stateParams.get('mode')==='incidents'){
 const story=INCIDENT_CATALOG.stories.find(s=>s.id===stateParams.get('incident'));
 const index=Math.max(0,Math.min((story?.steps.length||1)-1,Number(stateParams.get('istep'))||0));
 const record=INCIDENT_REGISTRY.records.find(r=>r.id===(stateParams.get('incident')||stateParams.get('irecord')));
 const date=record?.date||story?.steps[index]?.date;
 if(date)renderYear(+date.slice(0,4));
 switchPanel('events');
}
incidentsLocationHook=url=>{for(const key of ['incident','istep','ilist','iyear','ikind','icountry','iq','iview','irecord'])url.searchParams.delete(key);if(url.searchParams.get('mode')==='incidents')url.searchParams.delete('mode');};
worldHistoryHook();queueLocationSave();
