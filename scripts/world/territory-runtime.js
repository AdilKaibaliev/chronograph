function worldAreaDate(a){const from=Math.max(610,a.from),to=Math.min(TIMELINE_MAX,a.to-1);return (a.approx?wl(['ок. ','c. ','болж. ']):'')+from+(from===to?'':'–'+to)+' '+wt('era');}
function worldAreaCamera(a){
 if(a.worldFocus){animateCamera({scale:1,tx:0,ty:0});return;}
 const related=a.entry==='late-hre'&&year>=1939&&year<1945?worldHistory.mapAreasAt(year).filter(p=>p.overlord===a.entry).flatMap(p=>p.polygons):[];
 const pts=[...a.polygons,...related].flat().map(project),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 const scale=Math.min(24,Math.max(1,Math.min(SVG_W*.7/Math.max(14,x1-x0),SVG_H*.62/Math.max(14,y1-y0))));
 animateCamera({scale,tx:SVG_W/2-(x0+x1)/2*scale,ty:SVG_H/2-(y0+y1)/2*scale});
}
function worldChooseTerritory(id,focus=true){
 const a=worldHistory.mapAreasAt(year).find(a=>a.entry===id);if(!a)return;
 
 stopPlay();worldShowLocations();worldState.area=id;worldState.selected=id;worldState.event='';worldState.mode='overview';worldState.filters=false;
 worldState.region=worldHistory.entry(id).region;switchPanel('compare');renderWorldHistory();
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
 worldAreaDetail.replaceChildren();const a=worldHistory.mapAreasAt(year).find(a=>a.entry===worldState.area);worldAreaDetail.hidden=!a;
 worldExplorer.classList.toggle('has-area',Boolean(a));if(!a)return;
 worldAreaDetail.style.setProperty('--territory-color',a.color);
 const heading=we('h4','',wl(a.name));heading.id='worldAreaTitle';heading.tabIndex=-1;
 const close=we('button','world-area-close','×');close.type='button';close.setAttribute('aria-label',wt('closeArea'));close.title=wt('closeArea');close.onclick=()=>{worldState.area='';renderWorldHistory();queueLocationSave();};
 worldAreaDetail.append(close,we('p','world-card-meta',wt(a.kind)+' · '+worldAreaDate(a)),heading,we('h5','',wl(a.title)),we('p','world-description',wl(a.text)),we('p','world-dating',wt('geography')));
 if(a.sovereign||a.overlord){const text=a.sovereign?['В составе: ','Part of: ','Курамында: ']:a.relationship==='administration'?['Под управлением: ','Administered by: ','Башкаруусунда: ']:a.relationship==='occupation'?['Военная оккупация: ','Military occupation: ','Аскердик оккупация: ']:['Зависимость от: ','Dependent on: ','Көз каранды: '];const b=we('button','world-imperial-parent',wl(text)+wl(a.sovereignName));b.type='button';b.onclick=()=>worldChooseTerritory(a.sovereign||a.overlord);heading.after(b);}
 if(a.entry==='late-hre'&&year>=1939&&year<=1945){
  const nav=we('div','world-war-years');nav.setAttribute('aria-label',wl(['Вторая мировая война по годам','World War II by year','Экинчи дүйнөлүк согуш жылдар боюнча']));
  const legend=we('p','world-war-note',wl(year===1945?['Германская оккупация завершена. Германия находится под управлением союзников.','German occupation has ended. Germany is under Allied administration.','Немис оккупациясы аяктады. Германия союздаштардын башкаруусунда.']:['Сплошной цвет — рейх · косая штриховка — оккупация · пунктир — зависимые режимы','Solid colour: Reich · diagonal hatching: occupation · dashed: dependent regimes','Туташ түс — рейх · кыйгач штрих — оккупация · пунктир — көз каранды режимдер']));
  for(let y=1939;y<=1945;y++){const b=we('button','',String(y));b.type='button';b.setAttribute('aria-pressed',String(y===year));b.onclick=()=>{stopPlay();renderYear(y);worldChooseTerritory('late-hre');};nav.append(b);}
  const fit=we('button','world-war-fit',wl(['Показать Европу','Show Europe','Европаны көрсөтүү']));fit.type='button';fit.onclick=()=>worldAreaCamera(a);nav.append(fit);heading.after(legend,nav);
 }
 const frames=worldHistory.mapFrames(a.entry);
 if(frames.length>1){const phases=we('div','world-area-stages');phases.setAttribute('role','group');phases.setAttribute('aria-label',wt('areaStages'));
  for(const f of frames){const b=we('button','',(f.approx?'≈ ':'')+Math.max(610,f.from));b.type='button';b.setAttribute('aria-pressed',String(f.id===a.id));b.title=wl(f.title);b.onclick=()=>{stopPlay();renderYear(Math.max(610,f.from));worldChooseTerritory(f.entry);};phases.append(b);}worldAreaDetail.append(phases);
 }
 const phase=worldHistory.get(a.entry,year)?.phase;
 if(phase)appendWorldLearning(worldAreaDetail,phase,'area-'+a.entry,true);
 appendWorldSources(worldAreaDetail,[...new Set([...a.sources,...(phase?.sources||[])])]);
 
}
function worldAreaOpacity(){return Math.min(.9,Math.max(.16,overlayOpacity*1.35));}
// Reuse immutable dated features. Bound retention while readers scrub the timeline.
const worldTerritoryNodes=new Map();
function renderWorldTerritories(){
 worldTerritoryLayer.replaceChildren();worldTerritoryLabels.replaceChildren();
 worldTerritoryLayer.classList.toggle('hidden-layer',!layerState.empires);worldTerritoryLabels.classList.toggle('hidden-layer',!layerState.empires);
 worldTerritoryLayer.style.setProperty('--area-opacity',worldAreaOpacity());
 const sn=(name,attrs)=>{const n=document.createElementNS(svg.namespaceURI,name);for(const [k,v] of Object.entries(attrs||{}))n.setAttribute(k,v);return n;};
 const rank={uninhabited:0,cultural:1,landscape:2,influence:3,settlement:4,polity:5};
 // Like the original Eurasian layer, every active territory remains on the map.
 // A selected region filters the cards and chronology only.
 const areas=worldHistory.mapAreasAt(year).sort((a,b)=>Number(a.relationship==='occupation')-Number(b.relationship==='occupation')||Number(a.entry===worldState.area)-Number(b.entry===worldState.area)||Number(Boolean(b.politicalOutline))-Number(Boolean(a.politicalOutline))||rank[a.kind]-rank[b.kind]);
 const unified=areas.filter(a=>a.mongolGroup).length===4&&!(typeof showMongolUluses!=='undefined'&&showMongolUluses);
 for(const a of areas){
  const entry=worldHistory.entry(a.entry),selected=a.entry===worldState.area,grouped=unified&&a.mongolGroup;
  const cacheKey=[a.id,wl(['ru','en','ky']),selected,Boolean(grouped),a.overlord===worldState.area,grouped?a.mongolUnionId:null,overlayOpacity].join('|');
  const saved=worldTerritoryNodes.get(cacheKey);
  if(saved){worldTerritoryNodes.delete(cacheKey);worldTerritoryNodes.set(cacheKey,saved);worldTerritoryLayer.append(saved.g);worldTerritoryLabels.append(saved.guide,saved.text);continue;}
  const g=sn('g',{'data-world-area':a.entry,'data-territory-frame':a.id,'data-territory-kind':a.kind,class:'world-territory '+a.kind+(selected?' selected':'')});
  if(a.politicalOutline)g.classList.toggle('political-outline',true);
  if(a.dependencyOutline){g.classList.toggle('imperial-dependency',true);g.setAttribute('data-overlord',a.overlord);}
  if(a.relationship==='occupation')g.classList.toggle('military-occupation',true);
  if(a.overlord===worldState.area)g.classList.toggle('related-selected',true);
  if(a.detachedProvince)g.classList.toggle('detached-province',true);
  if(a.sovereign){g.classList.toggle('sovereign-part',true);g.setAttribute('data-sovereign',a.sovereign);}
  if(grouped){g.classList.toggle('mongol-unified',true);if(a.entry!=='late-yuan'&&a.mongolUnion&&!selected){g.classList.toggle('mongol-unified-member',true);g.setAttribute('aria-hidden','true');}}
  // Tiny Pacific islands are below the base map's resolution: these outlines mark
  // their local settlement vicinity. They never connect islands into ocean empires.
  if(!a.coastClipped&&entry.region!=='oceania'&&entry.id!=='mabuyag')g.setAttribute('clip-path','url(#worldLandClip)');
  const path=sn('path',{d:polygonPath(grouped&&a.entry==='late-yuan'&&a.mongolUnion?a.mongolUnion:a.polygons),fill:grouped?'#785344':a.color,stroke:grouped?'#61483a':a.color,role:'button',tabindex:0,'aria-label':wl(a.name)+' · '+wt(a.kind)+' · '+worldAreaDate(a)});
  if(grouped&&a.entry!=='late-yuan'&&a.mongolUnion&&!selected)path.setAttribute('tabindex','-1');
  if(a.sovereign&&!a.detachedProvince&&!selected){g.setAttribute('aria-hidden','true');path.setAttribute('tabindex','-1');path.setAttribute('aria-hidden','true');}
  if(a.geometryYear!==undefined)path.style.setProperty('--area-opacity',String(overlayOpacity));
  const title=sn('title');title.textContent=wl(a.name)+' · '+wl(a.title);path.append(title);g.append(path);
  if(a.relationship==='occupation')g.append(sn('path',{d:polygonPath(a.polygons),fill:'url(#worldOccupationHatch)',class:'world-occupation-hatch'}));
  if(['cultural','settlement','landscape'].includes(a.kind))g.append(sn('path',{d:polygonPath(a.polygons),fill:'url(#worldRegionHatch)',class:'world-territory-hatch'}));
  let pointer=null;
  path.onpointerenter=hideTooltip;
  path.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();hideTooltip();pointer={id:e.pointerId,x:e.clientX,y:e.clientY,tx:mapState.tx,ty:mapState.ty,moved:false};path.setPointerCapture(e.pointerId);};
  path.onpointermove=e=>{if(!pointer||pointer.id!==e.pointerId)return;e.stopPropagation();const p=screenPoint(e.clientX,e.clientY),q=screenPoint(pointer.x,pointer.y);pointer.moved ||= Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>5;if(pointer.moved){mapState.tx=pointer.tx+p.x-q.x;mapState.ty=pointer.ty+p.y-q.y;setViewport();}};
  path.onpointerup=e=>{if(!pointer||pointer.id!==e.pointerId)return;e.stopPropagation();const moved=pointer.moved;pointer=null;try{path.releasePointerCapture(e.pointerId);}catch{}if(!moved)worldChooseTerritory(a.entry);else queueLocationSave();};
  path.onpointercancel=()=>{pointer=null;};
  path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();worldChooseTerritory(a.entry);}};
  worldTerritoryLayer.append(g);
  const ring=(a.polygons.length?a.polygons:[[[entry.coord[0]-.01,entry.coord[1]-.01],[entry.coord[0]+.01,entry.coord[1]+.01],[entry.coord[0]-.01,entry.coord[1]+.01]]]).reduce((best,r)=>{const bounds=p=>{const xs=p.map(v=>v[0]),ys=p.map(v=>v[1]);return (Math.max(...xs)-Math.min(...xs))*(Math.max(...ys)-Math.min(...ys));};return bounds(r)>bounds(best)?r:best;});
  const xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]),lon=(Math.min(...xs)+Math.max(...xs))/2,lat=(Math.min(...ys)+Math.max(...ys))/2,[x,y]=project(grouped&&a.entry==='late-yuan'?[89,49]:a.label||[lon,lat]);
  const guide=sn('line',{class:'world-territory-guide','data-guide':a.entry,x1:x,y1:y,x2:x,y2:y});worldTerritoryLabels.append(guide);
  const text=sn('text',{x,y,class:'world-territory-label'+(selected?' selected':''),'text-anchor':'middle','data-entry':a.entry,'data-kind':a.overviewLabel?'polity':a.kind,'data-width':a.labelWidth||(Math.max(...xs)-Math.min(...xs))/360*SVG_W});
  text.textContent=grouped&&a.entry==='late-yuan'?wl(['Монгольская империя и улусы','Mongol Empire and uluses','Монгол империясы жана улустар']):wl(a.short||a.name).split(' · ')[0];
  if(grouped&&a.entry!=='late-yuan'&&!selected)text.dataset.groupHidden='true';
  if(a.sovereign&&!a.overviewLabel)text.dataset.sovereign=a.sovereign;
  worldTerritoryLabels.append(text);
  if(worldTerritoryNodes.size>=768)worldTerritoryNodes.delete(worldTerritoryNodes.keys().next().value);
  worldTerritoryNodes.set(cacheKey,{g,guide,text});
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
function worldLabelMetrics(){
 const ratio=Math.max(.1,Math.min(svg.clientWidth/SVG_W,svg.clientHeight/SVG_H)),scale=mapState.scale*ratio;
 const offsetX=(svg.clientWidth-SVG_W*ratio)/2,offsetY=(svg.clientHeight-SVG_H*ratio)/2;
 return {ratio,scale,detail:Math.max(.75,scale),width:svg.clientWidth,height:svg.clientHeight,
  point:(x,y)=>[(x*mapState.scale+mapState.tx)*ratio+offsetX,(y*mapState.scale+mapState.ty)*ratio+offsetY]};
}
function updateAtlasReferenceLabels({scale,detail}){
 for(const label of empireLabelLayer.querySelectorAll('text')){
  const small=label.classList.contains('small'),font=Math.min(small?11.5:13.5,8+3*Math.log2(Math.max(1,detail)));
  label.style.setProperty('font-size',font/scale+'px','important');
  label.style.setProperty('stroke-width',2/scale+'px','important');
 }
}
function updateAtlasPlaceLabels(metrics,occupied){
 const {scale,detail,width,height}=metrics;
 for(const group of placeLayer.querySelectorAll('.place-dot')){
  const label=group.querySelector('text');if(!label)continue;
  const major=group.classList.contains('major'),medium=group.classList.contains('medium');
  label.style.setProperty('display','none','important');
  if(detail<(major?2.1:medium?3:4))continue;
  const match=group.getAttribute('transform').match(/translate\(([-.\d]+)[ ,]+([-.\d]+)\)/);if(!match)continue;
  const [x,y]=metrics.point(+match[1],+match[2]),font=Math.min(11.5,8+2*Math.log2(detail));
  const textWidth=worldLabelWidth(label.textContent,font)+8,rect=[x+8,y-font,x+8+textWidth,y+4];
  if(rect[0]<3||rect[2]>width-3||rect[1]<3||rect[3]>height-3||occupied.some(r=>rect[0]<r[2]+4&&rect[2]>r[0]-4&&rect[1]<r[3]+3&&rect[3]>r[1]-3))continue;
  label.style.setProperty('font-size',font/scale+'px','important');label.style.setProperty('stroke-width',2/scale+'px','important');
  label.setAttribute('x',8/scale);label.setAttribute('y',3/scale);label.style.setProperty('display','block','important');occupied.push(rect);
 }
}
function updateWorldTerritoryLabels(metrics=worldLabelMetrics()){
 const {ratio,scale,detail,width:mapWidth,height:mapHeight}=metrics;
 updateAtlasReferenceLabels(metrics);
 // Reserve labels of the original political layer as well as the new territories.
 const mapRect=svg.getBoundingClientRect(),occupied=[...empireLabelLayer.querySelectorAll('text')].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return [r.left-mapRect.left,r.top-mapRect.top,r.right-mapRect.left,r.bottom-mapRect.top];}).filter(r=>r[2]>r[0]&&r[3]>r[1]);
 const hatchStep=7/scale;worldPattern.setAttribute('width',hatchStep);worldPattern.setAttribute('height',hatchStep);worldHatchLine.setAttribute('d','M0 0V'+hatchStep);worldHatchLine.setAttribute('stroke-width',1/scale);
 if(typeof worldOccupationPattern!=='undefined'){worldOccupationPattern.setAttribute('width',9/scale);worldOccupationPattern.setAttribute('height',9/scale);worldOccupationLine.setAttribute('d','M0 0V'+9/scale);worldOccupationLine.setAttribute('stroke-width',1/scale);}
 const priority={polity:6,influence:5,cultural:3,settlement:2,landscape:1,uninhabited:0};
 const labels=[...worldTerritoryLabels.querySelectorAll('.world-territory-label')].sort((a,b)=>Number(b.dataset.entry===worldState.area)-Number(a.dataset.entry===worldState.area)||priority[b.dataset.kind]-priority[a.dataset.kind]||+b.dataset.width-+a.dataset.width);
 // Markers carry detailed site labels only when a territorial label cannot fit.
 const fit=new Set();
 for(const label of labels){
  const selected=label.dataset.entry===worldState.area,political=['polity','influence'].includes(label.dataset.kind);
  const font=selected?13:Math.min(political?13:11.5,8+3*Math.log2(Math.max(1,detail)));
  const px=+label.getAttribute('x'),py=+label.getAttribute('y'),[x,y]=metrics.point(px,py);
  const guide=worldTerritoryLabels.querySelector('[data-guide="'+label.dataset.entry+'"]');guide.style.display='none';label.style.display='none';
  if(label.dataset.groupHidden==='true'){fit.add(label.dataset.entry);continue;}
  if(label.dataset.sovereign&&!selected&&detail<3){fit.add(label.dataset.entry);continue;}
  label.style.fontSize=font/scale+'px';label.style.strokeWidth=2/scale+'px';
  if(x<0||y<0||x>mapWidth||y>mapHeight)continue;
  // Canvas metrics do not force layout of the whole SVG after every style write.
  const width=worldLabelWidth(label.textContent,font);
  // Overview labels stay near their territory. Small territories become readable on zoom.
  if(!selected&&(+label.dataset.width*scale<Math.max(12,width*.28)||(!political&&detail<1.8)))continue;
  const offsets=selected||detail>=3?[[0,-7],[0,-22],[0,18]]:[[0,-4]];
  for(const [dx,dy] of offsets){
   const rect=[x+dx-width/2,y+dy-font,x+dx+width/2,y+dy+3];
   if(rect[0]<3||rect[2]>mapWidth-3||rect[1]<3||rect[3]>mapHeight-3||occupied.some(r=>rect[0]<r[2]+4&&rect[2]>r[0]-4&&rect[1]<r[3]+3&&rect[3]>r[1]-3))continue;
   label.setAttribute('dx',dx/scale);label.setAttribute('dy',dy/scale);label.style.display='';fit.add(label.dataset.entry);occupied.push(rect);
   if(Math.abs(dy)>10){guide.setAttribute('x2',px+dx/scale);guide.setAttribute('y2',py+(dy-font/2)/scale);guide.style.display='';}
   break;
  }
 }
 return layerState.empires?{occupied,entries:fit}:{occupied:[],entries:new Set()};
}
