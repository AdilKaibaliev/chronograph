function worldAreaDate(a){const from=Math.max(610,a.from),to=Math.min(TIMELINE_MAX,a.to-1);return (a.approx?wl(['ок. ','c. ','болж. ']):'')+from+(from===to?'':'–'+to)+' '+wt('era');}
function worldAreaCamera(a){
 const pts=a.polygons.flat().map(project),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 const scale=Math.min(24,Math.max(1,Math.min(SVG_W*.7/Math.max(14,x1-x0),SVG_H*.62/Math.max(14,y1-y0))));
 animateCamera({scale,tx:SVG_W/2-(x0+x1)/2*scale,ty:SVG_H/2-(y0+y1)/2*scale});
}
function worldChooseTerritory(id,focus=true){
 const a=worldHistory.areasAt(year).find(a=>a.entry===id);if(!a)return;
 stopPlay();worldShowLocations();worldState.area=id;worldState.selected=id;worldState.event='';worldState.mode='overview';worldState.filters=false;
 worldState.region=WORLD_HISTORY.entries.find(e=>e.id===id).region;switchPanel('compare');renderWorldHistory();
 if(focus)worldAreaCamera(a);$('panel-compare').scrollTop=0;$('worldAreaTitle')?.focus({preventScroll:true});queueLocationSave();
}
function renderWorldAreaControls(){
 worldMapSteps.replaceChildren();
 const label=we('label','world-territories-toggle'),input=we('input');input.type='checkbox';input.checked=layerState.empires;input.id='worldTerritoriesToggle';
 input.onchange=()=>{layerState.empires=input.checked;$('toggleEmpires').checked=input.checked;applyLayerState();worldTerritoryLayer.classList.toggle('hidden-layer',!input.checked);worldTerritoryLabels.classList.toggle('hidden-layer',!input.checked);updateWorldMarkerScale();};label.append(input,we('span','',wt('territories')));worldMapSteps.append(label);
 const changes=worldHistory.changes(worldState.region),prev=changes.filter(y=>y<year).at(-1),next=changes.find(y=>y>year);
 for(const [id,key,value,arrow] of [['worldMapPrevious','territoryPrevious',prev,'←'],['worldMapNext','territoryNext',next,'→']]){
  const b=we('button','',arrow+(value?' '+value:''));b.type='button';b.id=id;b.title=wt(key);b.setAttribute('aria-label',wt(key)+(value?' · '+value:''));b.disabled=value===undefined;
  b.onclick=()=>{stopPlay();renderYear(value);$(id)?.focus({preventScroll:true});queueLocationSave();};worldMapSteps.append(b);
 }
 if(changes.length===1)worldMapSteps.title=wt('continuity');else worldMapSteps.title=wt('territory');
}
function renderWorldAreaDetail(){
 worldAreaDetail.replaceChildren();const a=worldHistory.areasAt(year).find(a=>a.entry===worldState.area);worldAreaDetail.hidden=!a;
 worldExplorer.classList.toggle('has-area',Boolean(a));if(!a)return;
 worldAreaDetail.style.setProperty('--territory-color',a.color);
 const heading=we('h4','',wl(a.name));heading.id='worldAreaTitle';heading.tabIndex=-1;
 const close=we('button','world-area-close','×');close.type='button';close.setAttribute('aria-label',wt('closeArea'));close.title=wt('closeArea');close.onclick=()=>{worldState.area='';renderWorldHistory();queueLocationSave();};
 worldAreaDetail.append(close,we('p','world-card-meta',wt(a.kind)+' · '+worldAreaDate(a)),heading,we('h5','',wl(a.title)),we('p','world-description',wl(a.text)),we('p','world-dating',wt('geography')));
 const frames=WORLD_HISTORY.areas.filter(x=>x.entry===a.entry);
 if(frames.length>1){const phases=we('div','world-area-stages');phases.setAttribute('role','group');phases.setAttribute('aria-label',wt('areaStages'));
  for(const f of frames){const b=we('button','',(f.approx?'≈ ':'')+Math.max(610,f.from));b.type='button';b.setAttribute('aria-pressed',String(f.id===a.id));b.title=wl(f.title);b.onclick=()=>{stopPlay();renderYear(Math.max(610,f.from));worldChooseTerritory(f.entry);};phases.append(b);}worldAreaDetail.append(phases);
 }
 const phase=worldHistory.get(a.entry,year)?.phase;
 if(phase)appendWorldLearning(worldAreaDetail,phase,'area-'+a.entry,true);
 appendWorldSources(worldAreaDetail,[...new Set([...a.sources,...(phase?.sources||[])])]);
}
function worldAreaOpacity(){return Math.min(.9,Math.max(.16,overlayOpacity*1.35));}
function renderWorldTerritories(){
 worldTerritoryLayer.replaceChildren();worldTerritoryLabels.replaceChildren();
 worldTerritoryLayer.classList.toggle('hidden-layer',!layerState.empires);worldTerritoryLabels.classList.toggle('hidden-layer',!layerState.empires);
 worldTerritoryLayer.style.setProperty('--area-opacity',worldAreaOpacity());
 const sn=(name,attrs)=>{const n=document.createElementNS(svg.namespaceURI,name);for(const [k,v] of Object.entries(attrs||{}))n.setAttribute(k,v);return n;};
 const rank={uninhabited:0,cultural:1,landscape:2,influence:3,settlement:4,polity:5};
 // Like the original Eurasian layer, every active territory remains on the map.
 // A selected region filters the cards and chronology only.
 const areas=worldHistory.areasAt(year).sort((a,b)=>Number(a.entry===worldState.area)-Number(b.entry===worldState.area)||rank[a.kind]-rank[b.kind]);
 const unified=areas.filter(a=>a.mongolGroup).length===4&&!(typeof showMongolUluses!=='undefined'&&showMongolUluses);
 for(const a of areas){
  const entry=WORLD_HISTORY.entries.find(e=>e.id===a.entry),selected=a.entry===worldState.area,grouped=unified&&a.mongolGroup;
  const g=sn('g',{'data-world-area':a.entry,'data-territory-frame':a.id,'data-territory-kind':a.kind,class:'world-territory '+a.kind+(selected?' selected':'')});
  if(grouped)g.classList.toggle('mongol-unified',true);
  // Tiny Pacific islands are below the base map's resolution: these outlines mark
  // their local settlement vicinity. They never connect islands into ocean empires.
  if(entry.region!=='oceania'&&entry.id!=='mabuyag')g.setAttribute('clip-path','url(#worldLandClip)');
  const path=sn('path',{d:polygonPath(a.polygons),fill:grouped?'#785344':a.color,stroke:grouped?'none':a.color,role:'button',tabindex:0,'aria-label':wl(a.name)+' · '+wt(a.kind)+' · '+worldAreaDate(a)});
  if(a.geometryYear!==undefined)path.style.setProperty('--area-opacity',String(overlayOpacity));
  const title=sn('title');title.textContent=wl(a.name)+' · '+wl(a.title);path.append(title);g.append(path);
  if(['cultural','settlement','landscape'].includes(a.kind))g.append(sn('path',{d:polygonPath(a.polygons),fill:'url(#worldRegionHatch)',class:'world-territory-hatch'}));
  let pointer=null;
  path.onpointerenter=hideTooltip;
  path.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();hideTooltip();pointer={id:e.pointerId,x:e.clientX,y:e.clientY,tx:mapState.tx,ty:mapState.ty,moved:false};path.setPointerCapture(e.pointerId);};
  path.onpointermove=e=>{if(!pointer||pointer.id!==e.pointerId)return;e.stopPropagation();const p=screenPoint(e.clientX,e.clientY),q=screenPoint(pointer.x,pointer.y);pointer.moved ||= Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>5;if(pointer.moved){mapState.tx=pointer.tx+p.x-q.x;mapState.ty=pointer.ty+p.y-q.y;setViewport();}};
  path.onpointerup=e=>{if(!pointer||pointer.id!==e.pointerId)return;e.stopPropagation();const moved=pointer.moved;pointer=null;try{path.releasePointerCapture(e.pointerId);}catch{}if(!moved)worldChooseTerritory(a.entry);else queueLocationSave();};
  path.onpointercancel=()=>{pointer=null;};
  path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();worldChooseTerritory(a.entry);}};
  worldTerritoryLayer.append(g);
  const ring=a.polygons.reduce((best,r)=>{const bounds=p=>{const xs=p.map(v=>v[0]),ys=p.map(v=>v[1]);return (Math.max(...xs)-Math.min(...xs))*(Math.max(...ys)-Math.min(...ys));};return bounds(r)>bounds(best)?r:best;});
  const xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]),lon=(Math.min(...xs)+Math.max(...xs))/2,lat=(Math.min(...ys)+Math.max(...ys))/2,[x,y]=project(grouped&&a.entry==='late-yuan'?[89,49]:a.label||[lon,lat]);
  const guide=sn('line',{class:'world-territory-guide','data-guide':a.entry,x1:x,y1:y,x2:x,y2:y});worldTerritoryLabels.append(guide);
  const text=sn('text',{x,y,class:'world-territory-label'+(selected?' selected':''),'text-anchor':'middle','data-entry':a.entry,'data-kind':a.kind,'data-width':(Math.max(...xs)-Math.min(...xs))/360*SVG_W});
  text.textContent=grouped&&a.entry==='late-yuan'?wl(['Монгольская империя и улусы','Mongol Empire and uluses','Монгол империясы жана улустар']):wl(a.short||a.name).split(' · ')[0];
  if(grouped&&a.entry!=='late-yuan'&&!selected)text.dataset.groupHidden='true';
  worldTerritoryLabels.append(text);
 }
}
let worldLabelMeasureContext;
const worldLabelWidths=new Map();
function worldLabelWidth(text,font){
 const key=font+'|'+text;
 if(!worldLabelWidths.has(key)){
  worldLabelMeasureContext ||= document.createElement('canvas').getContext('2d');
  worldLabelMeasureContext.font='700 '+font+'px Georgia, serif';
  if(worldLabelWidths.size>2048)worldLabelWidths.clear();
  worldLabelWidths.set(key,Math.max(worldLabelMeasureContext.measureText(text).width,text.length*font*.48));
 }
 return worldLabelWidths.get(key);
}
function updateWorldTerritoryLabels(){
 const ratio=Math.max(.1,Math.min(svg.clientWidth/SVG_W,svg.clientHeight/SVG_H)),scale=mapState.scale*ratio;
 // Reserve labels of the original political layer as well as the new territories.
 const mapRect=svg.getBoundingClientRect(),occupied=[...empireLabelLayer.querySelectorAll('text')].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return [r.left-mapRect.left,r.top-mapRect.top,r.right-mapRect.left,r.bottom-mapRect.top];}).filter(r=>r[2]>r[0]&&r[3]>r[1]);
 const hatchStep=7/scale;worldPattern.setAttribute('width',hatchStep);worldPattern.setAttribute('height',hatchStep);worldHatchLine.setAttribute('d','M0 0V'+hatchStep);worldHatchLine.setAttribute('stroke-width',1/scale);
 const priority={polity:6,influence:5,cultural:3,settlement:2,landscape:1,uninhabited:0};
 const labels=[...worldTerritoryLabels.querySelectorAll('.world-territory-label')].sort((a,b)=>Number(b.dataset.entry===worldState.area)-Number(a.dataset.entry===worldState.area)||priority[b.dataset.kind]-priority[a.dataset.kind]||+b.dataset.width-+a.dataset.width);
 // Markers carry detailed site labels only when a territorial label cannot fit.
 const fit=new Set();
 for(const label of labels){
  const selected=label.dataset.entry===worldState.area,political=['polity','influence'].includes(label.dataset.kind),font=selected?14:political?12.5:11;
  const px=+label.getAttribute('x'),py=+label.getAttribute('y'),x=(px*mapState.scale+mapState.tx)*ratio,y=(py*mapState.scale+mapState.ty)*ratio;
  const guide=worldTerritoryLabels.querySelector('[data-guide="'+label.dataset.entry+'"]');guide.style.display='none';label.style.display='none';
  if(label.dataset.groupHidden==='true'){fit.add(label.dataset.entry);continue;}
  label.style.fontSize=font/scale+'px';label.style.strokeWidth=3.5/scale+'px';
  if(x<0||y<0||x>SVG_W*ratio||y>SVG_H*ratio)continue;
  // Small kingdoms still get a label; nearby callouts avoid hiding them for lack of width.
  if(!selected&&!political&&+label.dataset.width*scale<9)continue;
  // Canvas metrics do not force layout of the whole SVG after every style write.
  const width=worldLabelWidth(label.textContent,font);
  for(const [dx,dy] of [[0,-9],[0,-27],[0,22],[width/2+12,0],[-width/2-12,0],[0,-45],[0,40]]){
   const rect=[x+dx-width/2,y+dy-font,x+dx+width/2,y+dy+3];
   if(rect[0]<3||rect[2]>SVG_W*ratio-3||rect[1]<3||rect[3]>SVG_H*ratio-3||occupied.some(r=>rect[0]<r[2]+4&&rect[2]>r[0]-4&&rect[1]<r[3]+3&&rect[3]>r[1]-3))continue;
   label.setAttribute('dx',dx/scale);label.setAttribute('dy',dy/scale);label.style.display='';fit.add(label.dataset.entry);occupied.push(rect);
   if(dx||dy!==-9){guide.setAttribute('x2',px+dx/scale);guide.setAttribute('y2',py+(dy-font/2)/scale);guide.style.display='';}
   break;
  }
 }
 return layerState.empires?{occupied,entries:fit}:{occupied:[],entries:new Set()};
}
