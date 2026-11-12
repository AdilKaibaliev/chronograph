// The same year drives the political map and this parallel reading.
(() => {
 const line=document.createElement('button');
 line.type='button';line.id='kyrgyzParallel';line.dataset.localeOwned='true';
 $('timelineCard').querySelector('.timeline-row').after(line);
 const label=()=>wl(['История кыргызов','Kyrgyz history','Кыргыз тарыхы']);
 const groups=()=>WORLD_HISTORY.entries.filter(e=>e.kyrgyzHistory);
 const communities=new Set(groups().map(e=>e.id));
 const eventsByYear=new Map();
 for(const item of WORLD_HISTORY.events){
  if(item.referenceOnly||!(communities.has(item.entry)||item.id.startsWith('incident-kyrgyzstan-')))continue;
  const record=worldHistory.record(item.id);
  if(!eventsByYear.has(record.year))eventsByYear.set(record.year,[]);
  eventsByYear.get(record.year).push(record);
 }
 function reading(y){
  const notes=KYRGYZ_WITNESSES.filter(n=>(n.periodFrom??n.from)<=y&&y<=n.to)
   .sort((a,b)=>Number(!!a.background)-Number(!!b.background)
    ||(a.to-(a.periodFrom??a.from))-(b.to-(b.periodFrom??b.from)));
  const note=notes.find(n=>!n.background);
  const early=y<1300?kyrgyzHistoryForYear(y):null;
  const later=y>=1300?worldHistory.at(y,'eurasia').filter(x=>x.entry.kyrgyzHistory):[];
  return {note,notes,early,later};
 }
 function title(y){
  const {note,early,later}=reading(y);
  if(early?.year===y&&note?.periodLabel)return translate(early.title,language);
  if(note)return wl(note.title);
  if(eventsByYear.has(y))return wl(eventsByYear.get(y)[0].title);
  if(early)return translate(early.title,language);
  return later.map(x=>wl(x.phase.title)).join(' · ')||label();
 }
 function refresh(){
  line.textContent=label()+' · '+title(year);
  line.title=line.textContent;
 }
 function open(){
  stopPlay();
  const y=year,{notes,early,later}=reading(y),body=$('modalBody');body.replaceChildren();
  body.append(we('h2','',label()+' · '+y));
  const select=we('select','');
  select.setAttribute('aria-label',wl(['Перейти к этапу','Go to a period','Тарыхый этапка өтүү']));
  const dates=new Set([y,...eventsByYear.keys(),...KYRGYZ_STAGES.map(s=>s.year),...KYRGYZ_WITNESSES.filter(s=>!s.background).map(s=>s.from),...groups().flatMap(e=>e.phases.map(p=>p.from))]);
  for(const d of [...dates].filter(d=>d>=610&&d<=TIMELINE_MAX).sort((a,b)=>a-b)){
   const option=we('option','',d+' · '+title(d));option.value=d;option.selected=d===y;select.append(option);
  }
  function visit(d){renderYear(d);saveLocation();open();}
  select.onchange=()=>visit(Number(select.value));
  body.append(select);
  const steps=[...dates].filter(d=>d>=610&&d<=TIMELINE_MAX).sort((a,b)=>a-b);
  const nav=we('div','kyrgyz-period-nav');
  for(const [date,caption] of [[steps.filter(d=>d<y).at(-1),wl(['← Раньше','← Earlier','← Мурун'])],[steps.find(d=>d>y),wl(['Позже →','Later →','Кийин →'])]]){
   if(date===undefined)continue;
   const b=we('button','btn',caption+' · '+date);b.type='button';b.onclick=()=>visit(date);nav.append(b);
  }
  body.append(nav);
  function section(heading,detail,source,view,territory,eventId){
   body.append(we('h3','',heading),we('p','',detail),we('small','',source));
   if(view){const b=we('button','btn',wl(['Показать на карте','Show on map','Картадан көрсөтүү']));b.type='button';
    b.onclick=()=>{$('modalClose').click();showKyrgyzContext=true;renderYear(year);
     if(territory)worldChooseTerritory(territory);
     else if(eventId&&worldHistory.record(eventId))worldChooseEvent(eventId);
     else focusLonLat(...view);queueLocationSave();};
    const actions=we('div','');actions.append(b);body.append(actions);}
  }
  for(const note of [...notes].sort((a,b)=>Number(!!a.background)-Number(!!b.background))){
   const witness='kyrgyz-witness-'+note.from;
   const eventId=note.background?null:worldHistory.record(witness)?witness:'atlas-'+note.from;
   section(wl(note.title),wl(note.text),(note.periodLabel?wl(note.periodLabel)+' · ':'')+note.source,note.place&&[...note.place,5],null,eventId);
  }
  if(early)section(translate(early.title,language),translate(early.text,language),early.source,early.view);
  for(const event of eventsByYear.get(y)||[]){
   section(wl(event.title),wl(event.text),[worldEventDate(event),...event.sources.map(id=>WORLD_HISTORY.sources[id]?.title).filter(Boolean)].join(' · '),event.coord,null,event.id);
  }
  for(const {entry,phase} of later)section(wl(entry.name)+' · '+wl(phase.title),wl(phase.text),
   phase.sources.map(id=>WORLD_HISTORY.sources[id]?.title).filter(Boolean).join(' · '),[...entry.coord,5],entry.id);
  $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;select.focus({preventScroll:true});
 }
 line.onclick=open;
 new MutationObserver(refresh).observe($('timelineYear'),{childList:true,characterData:true,subtree:true});
 localeSelect.addEventListener('change',refresh);refresh();
})();
