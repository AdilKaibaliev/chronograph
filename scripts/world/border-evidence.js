// Dated political reconstructions can disagree. Their common part has its own
// symbol and keeps both profiles accessible. All polygon operations run at build time.
function boundaryFrame(y,detailed=typeof showMongolUluses!=='undefined'&&showMongolUluses){
 const table=WORLD_HISTORY.boundaryEvidence,rows=table.timeline[detailed?'detailed':'unified'];
 let lo=0,hi=rows.length;while(lo+1<hi){const mid=(lo+hi)>>1;if(rows[mid][0]<=y)lo=mid;else hi=mid;}
 return table.frames[rows[lo][1]];
}
const frontierClipIds=new Set();
// The original atlas paints its first year before the world catalogue and
// its SVG definitions are initialized. Attach the same cuts once they exist.
var frontierGeometryReady;
function initializeBoundaryPaint(){
 frontierGeometryReady=true;
 for(const node of empireLayer.querySelectorAll('.empire-path[data-empire]'))clipPoliticalPath(node,node.dataset.empire,year);
}
function clipPoliticalPath(node,id,y){
 if(!frontierGeometryReady)return;
 const shape=boundaryFrame(y).paint[id];if(shape===undefined)return;
 const key='frontierCut'+shape;
 if(!frontierClipIds.has(shape)){
  const clip=document.createElementNS(svg.namespaceURI,'clipPath'),path=document.createElementNS(svg.namespaceURI,'path');
  clip.setAttribute('id',key);clip.setAttribute('clipPathUnits','userSpaceOnUse');
  path.setAttribute('d','M-1440 -720H2880V1440H-1440Z'+polygonPath(WORLD_HISTORY.boundaryEvidence.shapes[shape]));path.setAttribute('clip-rule','evenodd');
  clip.append(path);worldDefs.append(clip);frontierClipIds.add(shape);
 }
 node.setAttribute('clip-path','url(#'+key+')');
}
function boundaryName(id,y){
 if(id==='worldMongolRealm'||id==='mongolRealm')return wl(['Монгольская империя','Mongol Empire','Монгол империясы']);
 const item=worldHistory.get(id,y);if(item)return wl(item.phase.name||item.entry.name);
 const state=EMPIRES.find(e=>e.id===id);return state?translate(state.name,language):id;
}
function openBoundaryNote(owners){
 stopPlay();const body=$('modalBody');body.replaceChildren();
 const title=we('h2','',wl(['Участок уточнения границы','Frontier under review','Чек ара такталып жаткан тилке']));
 const describesInfluence=worldHistory.mapAreasAt(year).some(a=>owners.includes(a.entry)&&a.kind==='influence');
 const description=we('p','',wl(describesInfluence?['В выбранном году на этом участке пересекаются политические контуры. Как минимум один из них показывает область влияния. В карточках указаны территории и источники.','The political outlines overlap here in the selected year. At least one represents an area of influence. The profiles identify the territories and sources.','Тандалган жылы бул тилкеде саясий контурлар кесилишет. Алардын жок дегенде бири таасир аймагын көрсөтөт. Карточкаларда аймактар жана булактар келтирилген.']:['На этом участке реконструкции владений пересекаются. Доступных сведений недостаточно, чтобы провести однозначную границу для выбранного года.','The territorial reconstructions overlap here. The available evidence does not establish a single boundary for the selected year.','Бул тилкеде тарыхый ээликтердин контурлары кесилишет. Бар болгон маалымат тандалган жылдын так чек арасын аныктоого жетишсиз.']));
 body.append(title,we('p','',String(year)),description);
 for(const id of owners){const b=we('button','world-imperial-parent',boundaryName(id,year));b.type='button';b.onclick=()=>{$('modalClose').click();if(id==='worldMongolRealm')worldChooseTerritory('late-yuan');else if(id==='mongolRealm')selectEmpire(id);else worldChooseTerritory(id);};body.append(b);}
 $('modal').classList.add('show');$('modal').querySelector('.modal-box').scrollTop=0;$('modalClose').focus();
}
let frontierReviewPattern;
function renderBoundaryAreas(sn,y){
 const f=boundaryFrame(y);if(!f.zones.length)return;
 if(!frontierReviewPattern){
  const pat=sn('pattern',{id:'frontierReviewDots',width:4,height:4,patternUnits:'userSpaceOnUse'});
  pat.append(sn('rect',{width:4,height:4,fill:'#cfc6b4'}),sn('circle',{cx:1.6,cy:1.6,r:.57,fill:'#716956'}));worldDefs.append(pat);frontierReviewPattern=pat;
 }
 const group=sn('g',{'data-frontier-review':'true'});
 for(const [a,b,i] of f.zones){
  const label=wl(['Граница уточняется','Frontier under review','Чек ара такталууда'])+' · '+boundaryName(a,y)+' / '+boundaryName(b,y);
  const p=sn('path',{d:polygonPath(WORLD_HISTORY.boundaryEvidence.shapes[i]),fill:'url(#frontierReviewDots)','fill-rule':'nonzero','fill-opacity':Math.min(1,overlayOpacity+.20),'aria-label':label,role:'button',tabindex:0,class:'frontier-review-zone'});
  const t=sn('title');t.textContent=label;p.append(t);p.dataset.owners=a+' '+b;
  const activate=(point)=>{const owners=new Set([a,b]);if(point)for(const q of group.children){if(q.isPointInFill(point))for(const id of q.dataset.owners.split(' '))owners.add(id);}openBoundaryNote([...owners]);};
  p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}};
  p.onclick=e=>{e.stopPropagation();if(e.detail===0)activate();};
  let down=null;
  p.onpointerdown=e=>{if(e.button!==0)return;e.stopPropagation();e.preventDefault();down={x:e.clientX,y:e.clientY,tx:mapState.tx,ty:mapState.ty,id:e.pointerId,moved:false};p.setPointerCapture(e.pointerId);};
  p.onpointermove=e=>{if(!down||down.id!==e.pointerId)return;const u=screenPoint(e.clientX,e.clientY),v=screenPoint(down.x,down.y);down.moved ||= Math.hypot(e.clientX-down.x,e.clientY-down.y)>5;if(down.moved){mapState.tx=down.tx+u.x-v.x;mapState.ty=down.ty+u.y-v.y;setViewport();}};
  p.onpointercancel=()=>{down=null;};
  p.onpointerup=e=>{if(!down||down.id!==e.pointerId)return;e.stopPropagation();const wasDrag=down.moved;down=null;if(p.hasPointerCapture(e.pointerId))p.releasePointerCapture(e.pointerId);if(wasDrag){queueLocationSave();return;}const point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;activate(point.matrixTransform(p.getScreenCTM().inverse()));};
  group.append(p);
 }
 worldTerritoryLayer.append(group);
}

