// Dated routes live on the normal atlas, alongside the Silk Roads.
const expansionWords={
 layer:['Походы и освоение','Campaigns and settlement','Жортуулдар жана өздөштүрүү'],
 campaign:['Военный поход','Military campaign','Аскердик жортуул'],
 treaty:['Передача по договору','Transfer by treaty','Келишим боюнча өткөрүү'],
 settlement:['Освоение и переселение','Settlement and migration','Өздөштүрүү жана көчүү'],
 occupation:['Военная оккупация','Military occupation','Аскердик оккупация'],
 voyage:['Морская экспедиция','Maritime expedition','Деңиз экспедициясы'],
 source:['Источники','Sources','Булактар'],
 direction:['Направление между историческими центрами','Direction between historical centres','Тарыхый борборлордун ортосундагы багыт']
};
const xt=k=>wl(expansionWords[k]);
const xn=(tag,attrs={})=>{const n=document.createElementNS(svg.namespaceURI,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
const expansionLayer=xn('g',{id:'expansionLayer','data-locale-owned':'true'});
tradeLayer.after(expansionLayer);
const expansionToggleLabel=we('label');expansionToggleLabel.dataset.localeOwned='true';
const expansionToggle=we('input');expansionToggle.id='toggleExpansion';expansionToggle.type='checkbox';expansionToggle.checked=stateParams.get('journeys')!=='0';
const expansionToggleText=we('span');expansionToggleLabel.append(expansionToggle,expansionToggleText);$('toggleTrade').closest('label').after(expansionToggleLabel);
const expansionGeometry=new Map();
for(const s of EXPANSION_CATALOG.states)for(const r of s.routes){
 const parts=expansionSegments(r.points).map(p=>p.map(project));
 expansionGeometry.set(r.id,{parts,path:parts.map(p=>p.map((xy,i)=>(i?'L':'M')+xy.map(v=>v.toFixed(2)).join(' ')).join(' ')).join(' ')});
}
const expansionDate=r=>(r.approx?wl(['ок. ','c. ','болж. ']):'')+r.from+(r.to!==r.from?'–'+r.to:'');
let expansionRendered='',expansionFrame=0,expansionFocusReturn=null;
function expansionShow(s,r){
 stopPlay();expansionFocusReturn=document.activeElement;
 const body=$('modalBody');body.replaceChildren();
 body.append(we('div','kicker',wl(s.name)+' · '+expansionDate(r)),we('h2','',wl(r.title)),we('p','route-kind',xt(r.kind)),we('p','',wl(r.text)),we('p','route-caption',xt('direction')),we('h3','',xt('source')));
 for(const id of r.sources)body.append(we('p','route-source',EXPANSION_CATALOG.sources[id].title));
 $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;$('modalClose').focus();
}
$('modalClose').addEventListener('click',()=>{if(expansionFocusReturn?.isConnected)expansionFocusReturn.focus({preventScroll:true});expansionFocusReturn=null;});
function renderExpansion(){
 expansionToggleText.textContent=xt('layer');expansionLayer.classList.toggle('hidden-layer',!expansionToggle.checked);
 const key=year+'|'+language+'|'+expansionToggle.checked;if(key===expansionRendered)return;expansionRendered=key;
 expansionLayer.replaceChildren();if(!expansionToggle.checked)return;
 for(const s of EXPANSION_CATALOG.states)for(const r of expansionRoutesAt(s,year)){
  const geometry=expansionGeometry.get(r.id),g=xn('g',{class:'expansion-route '+r.kind,'data-expansion-route':r.id});
  const line=xn('path',{d:geometry.path,class:'expansion-line'}),hit=xn('path',{d:geometry.path,class:'expansion-hit',role:'button',tabindex:0,'aria-label':expansionDate(r)+' · '+wl(r.title)});
  const title=xn('title');title.textContent=expansionDate(r)+' · '+wl(r.title);hit.append(title);
  // Keep map dragging available when a gesture begins on a route. Capture on
  // this path so the atlas's background capture does not swallow route taps.
  let down=null;
  hit.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();hideTooltip();down={id:e.pointerId,x:e.clientX,y:e.clientY,tx:mapState.tx,ty:mapState.ty,moved:false};hit.setPointerCapture(e.pointerId);};
  hit.onpointermove=e=>{if(!down||down.id!==e.pointerId)return;e.stopPropagation();down.moved ||= Math.hypot(e.clientX-down.x,e.clientY-down.y)>5;if(down.moved){const p=screenPoint(e.clientX,e.clientY),q=screenPoint(down.x,down.y);mapState.tx=down.tx+p.x-q.x;mapState.ty=down.ty+p.y-q.y;setViewport();}};
  hit.onpointerup=e=>{if(!down||down.id!==e.pointerId)return;e.stopPropagation();const moved=down.moved;down=null;try{hit.releasePointerCapture(e.pointerId);}catch{}if(moved)queueLocationSave();else expansionShow(s,r);};
  hit.onpointercancel=()=>{down=null;};hit.onclick=e=>e.stopPropagation();
  hit.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();expansionShow(s,r);}};
  g.append(line,hit);
  for(const p of [geometry.parts[0][0],geometry.parts.at(-1).at(-1)]){const dot=xn('g',{class:'expansion-symbol','data-x':p[0],'data-y':p[1]});dot.append(xn('circle',{r:3}));g.append(dot);}
  expansionLayer.append(g);
 }
 updateExpansionScale();
}
function updateExpansionScale(){expansionFrame=0;const {scale}=worldLabelMetrics();for(const s of expansionLayer.querySelectorAll('.expansion-symbol'))s.setAttribute('transform',`translate(${s.dataset.x} ${s.dataset.y}) scale(${1/scale})`);}
function scheduleExpansionScale(){if(expansionLayer.childElementCount&&!expansionFrame)expansionFrame=requestAnimationFrame(updateExpansionScale);}
new MutationObserver(scheduleExpansionScale).observe(viewport,{attributes:true,attributeFilter:['transform']});new ResizeObserver(scheduleExpansionScale).observe(svg);
const expansionPreviousWorldHook=worldHistoryHook;worldHistoryHook=()=>{expansionPreviousWorldHook();renderExpansion();};
const expansionPreviousLocationHook=worldLocationHook;worldLocationHook=url=>{expansionPreviousLocationHook(url);for(const key of ['expansion','xstage','xhistory'])url.searchParams.delete(key);if(expansionToggle.checked)url.searchParams.delete('journeys');else url.searchParams.set('journeys','0');};
expansionToggle.onchange=()=>{renderExpansion();queueLocationSave();};localeSelect.addEventListener('change',renderExpansion);
worldPlaybackYears=[...new Set([...worldPlaybackYears,...EXPANSION_CATALOG.states.flatMap(s=>s.routes.flatMap(r=>[r.from,r.to])).filter(y=>y>=1300)])].sort((a,b)=>a-b);
renderExpansion();
