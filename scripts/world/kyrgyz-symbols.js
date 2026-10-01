function updateKyrgyzSymbols(){
 const scale=Math.max(.01,Math.min(svg.clientWidth/SVG_W,svg.clientHeight/SVG_H)*mapState.scale);
 const focused=showKyrgyzContext||(typeof selectedEmpire!=='undefined'&&selectedEmpire==='kyrgyzKhaganate'&&typeof year!=='undefined'&&year>=840&&year<924);
 svg.classList.toggle('kyrgyz-context',focused);
 svg.style.setProperty('--kyrgyz-trade-font',11/scale+'px');
 svg.style.setProperty('--kyrgyz-trade-stroke',2/scale+'px');
 const layer=$('kyrgyzRouteLayer');
 for(const node of layer.querySelectorAll('circle'))node.setAttribute('r',4/scale);
 for(const label of layer.querySelectorAll('text')){
  label.style.setProperty('font-size',11.5/scale+'px','important');
  label.style.setProperty('stroke-width',2.5/scale+'px','important');
  label.setAttribute('y',+label.dataset.baseY+(+label.dataset.offset)/scale);
 }
 // In the focused regional story, keep city and event markers smaller than the
 // polity name. Restore the ordinary sizes when the context layer is closed.
 for(const node of placeLayer.querySelectorAll('circle.core')){
  const ordinary=node.parentNode.classList.contains('active')?4.5:3.2;
  node.setAttribute('r',focused?Math.min(ordinary,4/scale):ordinary);
 }
 for(const node of placeLayer.querySelectorAll('circle.pulse'))node.setAttribute('r',focused?Math.min(5,8/scale):5);
 for(const node of pulseLayer.querySelectorAll('circle'))node.setAttribute('r',focused?Math.min(12,15/scale):12);
}
