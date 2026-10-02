// Fade only between dated map states. Never invent intermediate frontiers.
// Decorations are transient, inaccessible and cannot receive pointer events.
let mapTransitionCleanup=()=>{},mapTransitionPending=null,mapTransitionLastTime=0;
function mapBoundaryKey(y){
 const legacy=y<1300?EMPIRES.filter(e=>e.from<=y&&y<=e.to).map(e=>e.id+':'+(LEGACY_CARTOGRAPHY.frames[e.id]?.filter(f=>f[0]<=y).at(-1)?.[1]??'')).join(','):'';
 return legacy+'|'+worldHistory.mapAreasAt(y).map(a=>a.geometryId+':'+(a.mongolUnionId??'')+':'+(a.sovereign||a.overlord||'')).join(',');
}
worldMapBefore=target=>{
 mapTransitionCleanup();mapTransitionPending=null;
 const now=performance.now(),fast=now-mapTransitionLastTime<90;mapTransitionLastTime=now;
 if(target===year||fast||!layerState.empires||document.body.classList.contains('future-mode')||matchMedia('(prefers-reduced-motion: reduce)').matches||mapBoundaryKey(target)===mapBoundaryKey(year))return;
 const pairs=[];
 for(const live of [empireLayer,worldTerritoryLayer]){
  if(!live.childElementCount||live.classList.contains('hidden-layer'))continue;
  const ghost=live.cloneNode(true);ghost.removeAttribute('id');ghost.classList.add('map-transition-ghost');ghost.setAttribute('aria-hidden','true');ghost.style.pointerEvents='none';
  for(const n of ghost.querySelectorAll('[id],[tabindex],[role]')){n.removeAttribute('id');n.removeAttribute('tabindex');n.removeAttribute('role');}
  pairs.push({live,ghost});
 }
 mapTransitionPending=pairs;
};
worldMapAfter=()=>{
 const pairs=mapTransitionPending;mapTransitionPending=null;if(!pairs?.length)return;
 const animations=[];let timer=0,closed=false;
 const cleanup=()=>{if(closed)return;closed=true;clearTimeout(timer);for(const a of animations)a.cancel();for(const {ghost}of pairs)ghost.remove();};
 mapTransitionCleanup=cleanup;
 for(const {live,ghost}of pairs){
  live.after(ghost);
  animations.push(live.animate([{opacity:0},{opacity:1}],{duration:180,easing:'ease-out'}),ghost.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-out'}));
 }
 timer=setTimeout(cleanup,200);
};
