// Only one dated map state is painted. A brief emphasis on the new state
// avoids cross-fading two incompatible borders during timeline scrubbing.
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
  pairs.push({live});
 }
 mapTransitionPending=pairs;
};
worldMapAfter=()=>{
 const pairs=mapTransitionPending;mapTransitionPending=null;if(!pairs?.length)return;
 const animations=[];let timer=0,closed=false;
 const cleanup=()=>{if(closed)return;closed=true;clearTimeout(timer);for(const a of animations)a.cancel();};
 mapTransitionCleanup=cleanup;
 for(const {live}of pairs){
  animations.push(live.animate([{opacity:.88},{opacity:1}],{duration:140,easing:'ease-out'}));
 }
 timer=setTimeout(cleanup,200);
};
