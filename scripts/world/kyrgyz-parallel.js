// The same year drives the political map and this parallel reading.
(() => {
 const line=document.createElement('button');
 line.type='button';line.id='kyrgyzParallel';line.dataset.localeOwned='true';
 $('timelineCard').querySelector('.timeline-row').after(line);
 const label=()=>wl(['История кыргызов','Kyrgyz history','Кыргыз тарыхы']);
 const groups=()=>WORLD_HISTORY.entries.filter(e=>e.kyrgyzHistory);
 function reading(y){
  const note=KYRGYZ_WITNESSES.find(n=>n.from<=y&&y<=n.to);
  const early=y<1300?kyrgyzHistoryForYear(y):null;
  const later=y>=1300?worldHistory.at(y,'eurasia').filter(x=>x.entry.kyrgyzHistory):[];
  return {note,early,later};
 }
 function title(y){
  const {note,early,later}=reading(y);
  if(note)return wl(note.title);
  if(early)return translate(early.title,language);
  return later.map(x=>wl(x.phase.title)).join(' · ')||label();
 }
 function refresh(){
  line.textContent=label()+' · '+title(year);
  line.title=line.textContent;
 }
 function open(){
  stopPlay();
  const y=year,{note,early,later}=reading(y),body=$('modalBody');body.replaceChildren();
  body.append(we('h2','',label()+' · '+y));
  const select=we('select','');
  select.setAttribute('aria-label',wl(['Перейти к этапу','Go to a period','Тарыхый этапка өтүү']));
  const dates=new Set([y,...KYRGYZ_STAGES.map(s=>s.year),...KYRGYZ_WITNESSES.map(s=>s.from),...groups().flatMap(e=>e.phases.map(p=>p.from))]);
  for(const d of [...dates].filter(d=>d>=610&&d<=TIMELINE_MAX).sort((a,b)=>a-b)){
   const option=we('option','',d+' · '+title(d));option.value=d;option.selected=d===y;select.append(option);
  }
  select.onchange=()=>{renderYear(Number(select.value));saveLocation();open();};
  body.append(select);
  function section(heading,detail,source,view,territory,eventId){
   body.append(we('h3','',heading),we('p','',detail),we('small','',source));
   if(view){const b=we('button','btn',wl(['Показать на карте','Show on map','Картадан көрсөтүү']));b.type='button';
    b.onclick=()=>{$('modalClose').click();showKyrgyzContext=true;renderYear(year);
     if(territory)worldChooseTerritory(territory);
     else if(eventId&&worldHistory.record(eventId))worldChooseEvent(eventId);
     else focusLonLat(...view);queueLocationSave();};
    const actions=we('div','');actions.append(b);body.append(actions);}
  }
  if(note){
   const witness='kyrgyz-witness-'+note.from;
   const eventId=year===note.from?(worldHistory.record(witness)?witness:'atlas-'+note.from):null;
   section(wl(note.title),wl(note.text),note.source,note.place&&[...note.place,5],null,eventId);
  }
  if(early)section(translate(early.title,language),translate(early.text,language),early.source,early.view);
  for(const {entry,phase} of later)section(wl(entry.name)+' · '+wl(phase.title),wl(phase.text),
   phase.sources.map(id=>WORLD_HISTORY.sources[id]?.title).filter(Boolean).join(' · '),[...entry.coord,5],entry.id);
  $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;select.focus({preventScroll:true});
 }
 line.onclick=open;
 new MutationObserver(refresh).observe($('timelineYear'),{childList:true,characterData:true,subtree:true});
 localeSelect.addEventListener('change',refresh);refresh();
})();
