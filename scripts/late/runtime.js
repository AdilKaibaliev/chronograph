// Main atlas panels for the added centuries use the same dated catalogue as the map.
const lateText={
 world:['История мира','World history','Дүйнө тарыхы'],
 snapshot:['Государства и общества','States and societies','Мамлекеттер жана коомдор'],
 snapshotBody:['Карта показывает государства, центры власти и общества выбранного года. Выберите область, чтобы узнать о её устройстве и исторических изменениях.','The map shows states, centres of power and societies in the selected year. Select a region to explore its organisation and historical changes.','Карта тандалган жылдагы мамлекеттерди, бийлик борборлорун жана коомдорду көрсөтөт. Түзүлүшү менен тарыхый өзгөрүүлөрүн билүү үчүн аймакты тандаңыз.'],
 period:['Исторический срез','Historical snapshot','Тарыхый кесим'],
 next:['Следующий рубеж','Next milestone','Кийинки маанилүү окуя'],
 current:['Мир в выбранном году','The world in the selected year','Тандалган жылдагы дүйнө'],
 atlas:['Открыть общества на карте','Explore societies on the map','Картадагы коомдорду ачуу'],
 central:['Центральная Азия · государства и общества','Central Asia · states and societies','Борбордук Азия · мамлекеттер жана коомдор']
};
const lt=key=>wl(lateText[key]);
const lateEventRecords=WORLD_HISTORY.events.filter(e=>e.from>=1300).sort((a,b)=>a.from-b.from||a.id.localeCompare(b.id));
const lateEvents=()=>lateEventRecords;
const lateOwnedIds=['sideKicker','eventTitle','eventDesc','eventPlace','eventAh','eventType','worldList','shiftText','caText','caActions','caEraFacts','caEraNote','kyrgyzEraTitle','kyrgyzEraText','kyrgyzEraFacts','kyrgyzEraSource','compareIslam','compareIslamMeta','compareWorld','compareWorldMeta','mapBanner'];
lateEventHook=y=>{
 const exact=lateEvents().find(e=>y>=e.from&&y<=e.to),region=exact&&WORLD_HISTORY.regions.find(r=>r.id===exact.region);
 return {ah:ceToAHApprox(y),title:exact?wl(exact.title):lt('snapshot')+' · '+y,desc:exact?wl(exact.text):lt('snapshotBody'),place:region?wl(region.name):lt('world'),type:exact?wt(exact.kind==='culture'?'cultureEvents':exact.kind):lt('period'),coord:exact?.coord||null,zoom:3,world:[],lateEvent:exact};
};
function lateCard(item){
 const b=we('button','world-item late-world-item');b.type='button';b.dataset.latePlace=item.entry.id;
 b.append(we('b','',wl(item.entry.name)),we('p','',wl(item.phase.title)),we('span','',wt('show')+' →'));
 b.onclick=()=>worldChoosePlace(item.entry.id,true);return b;
}
lateSideHook=(y,e)=>{
 lateOwnedIds.forEach(id=>{if($(id))$(id).dataset.localeOwned='true';});
 $('sideKicker').textContent=lt('world')+' · '+y+' '+wt('era');
 for(const [id,value] of [['eventTitle',e.title],['eventDesc',e.desc],['eventPlace',e.place],['eventAh',translate(e.ah,language)],['eventType',e.type]])$(id).textContent=value;
 const list=$('worldList');list.replaceChildren();
 const sameYear=lateEvents().filter(event=>y>=event.from&&y<=event.to);
 for(const event of sameYear){
  const b=we('button','world-item late-world-item');b.type='button';b.dataset.lateEvent=event.id;
  b.append(we('b','',wl(event.title)),we('p','',wl(event.text)),we('span','',wt('show')+' →'));
  b.onclick=()=>worldChooseEvent(event.id);list.append(b);
 }
 const live=worldHistory.at(y);
 // One regional heading and a small selection of current polities, with access to the full catalogue.
 for(const region of WORLD_HISTORY.regions){
  const items=live.filter(x=>x.entry.region===region.id);if(!items.length)continue;
  const preferred=items.filter(x=>x.entry.kind==='state');
  const eventEntries=new Set(sameYear.map(event=>event.entry));
  const choices=[...(preferred.length?preferred:items)].sort((a,b)=>Number(eventEntries.has(b.entry.id))-Number(eventEntries.has(a.entry.id))||b.phase.from-a.phase.from).slice(0,region.id==='eurasia'?4:2);
  const section=we('section','late-region');section.append(we('h4','',wl(region.name)));choices.forEach(item=>section.append(lateCard(item)));list.append(section);
 }
 const explore=we('button','btn',lt('atlas'));explore.onclick=()=>{switchPanel('compare');worldChooseRegion('all',false);};list.append(explore);
 const next=lateEvents().find(item=>item.from>y);
 $('shiftText').textContent=next?lt('next')+' · '+next.from+': '+wl(next.title):lt('current')+' · '+y;
 $('mapBanner').textContent=y+' '+wt('era')+' · '+lt('snapshot');
 $('compareIslam').textContent=e.desc;$('compareIslamMeta').textContent=e.place+' · '+translate(e.ah,language);
 $('compareWorld').textContent=live.filter(x=>x.entry.kind==='state').slice(0,8).map(x=>wl(x.entry.name)).join(' · ');
 $('compareWorldMeta').textContent=lt('current')+' · '+y;
 const ca=live.filter(x=>x.entry.centralAsia);
 $('caText').textContent=ca.map(x=>wl(x.entry.name)).join(' · ');
 $('caActions').replaceChildren(...ca.map(item=>{const b=we('button','',wl(item.entry.name));b.onclick=()=>worldChoosePlace(item.entry.id,true);return b;}));
 $('caEraFacts').replaceChildren(...ca.map(item=>{const node=we('div','ca-fact');node.append(we('b','',wl(item.phase.title)),we('span','',wl(item.phase.text)));return node;}));
 $('caEraNote').textContent=wt('geography');
 const kyrgyz=live.filter(x=>x.entry.kyrgyzHistory);
 if(kyrgyz.length){
  $('kyrgyzEraTitle').textContent=kyrgyz.map(x=>wl(x.entry.name)).join(' · ');$('kyrgyzEraText').textContent='';
  $('kyrgyzEraFacts').replaceChildren();
  for(const kg of kyrgyz){const fact=we('div','ca-fact');fact.append(we('b','',wl(kg.entry.name)),we('span','',wl(kg.phase.text)));const b=we('button','',wt('show'));b.onclick=()=>worldChoosePlace(kg.entry.id,true);fact.append(b);$('kyrgyzEraFacts').append(fact);}
  $('kyrgyzEraSource').textContent=[...new Set(kyrgyz.flatMap(x=>x.phase.sources))].map(id=>WORLD_HISTORY.sources[id]?.title||'').join(' · ');
  $('focusKyrgyzHistory').onclick=lateFocusKyrgyz;
 }
 $('selectedCard').classList.add('hidden');$('selectionEmpty').hidden=false;
};
function lateFocusKyrgyz(){stopPlay();switchPanel('regions');renderYear(year);focusLonLat(85,48,2.7);}
// Remove per-panel locale ownership when returning to the original atlas interval.
const lateOriginalSide=renderSide;
renderSide=function(y,e){if(y<1300)lateOwnedIds.forEach(id=>$(id)?.removeAttribute('data-locale-owned'));return lateOriginalSide(y,e);};
localeSelect.addEventListener('change',()=>{if(year>=1300)renderYear(year);});
for(const id of ['tenochtitlan-foundation','late-ilkhan-1335','late-ming-1368','late-timur-1370','late-ankara-1402','triple-alliance','pachacuti-accession','late-constantinople-1453','early-timbuktu-1468','early-granada-1492','early-safavid-1501','early-cairo-1517','early-tenochtitlan-1521','early-panipat-1526','early-cusco-1533','early-kazan-1552','early-vilcabamba-1572','early-tondibi-1591','early-sekigahara-1600','1789-jamestown-1607','1789-gondar','1789-qing-beijing','1789-westphalia','1789-mbwila','1789-taiwan-conquest','1789-asante-union','1789-britain-union','1789-nystad','1789-plassey','1789-bengal-diwani','1789-independence-1776','1789-sydney-1788','1789-bastille']){
 const event=lateEvents().find(e=>e.id===id);if(!event)continue;const y=event.from;
 const button=we('button','',y+' · '+wl(event.title));button.type='button';button.dataset.year=y;button.dataset.localeOwned='true';button.dataset.lateMilestone=event.id;
 button.onclick=()=>{stopPlay();renderYear(y);if(event.coord)focusLonLat(...event.coord,3);queueLocationSave();};$('eraStrip').append(button);
}
localeSelect.addEventListener('change',()=>document.querySelectorAll('[data-late-milestone]').forEach(b=>{const e=lateEvents().find(e=>e.id===b.dataset.lateMilestone);b.textContent=e.from+' · '+wl(e.title);}));
renderYear(year);
