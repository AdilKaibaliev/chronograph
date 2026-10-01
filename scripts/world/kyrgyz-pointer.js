function bindKyrgyzPointer(path,emp){
 if(!['yeniseiKyrgyz','kyrgyzKhaganate','kyrgyzMongol'].includes(emp.id))return;
 let pointer=null;
 path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label',emp.name);
 path.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();},true);
 path.onpointerdown=e=>{
  if(e.button!==0)return;e.preventDefault();e.stopPropagation();hideTooltip();
  pointer={id:e.pointerId,x:e.clientX,y:e.clientY,tx:mapState.tx,ty:mapState.ty,moved:false};
  path.setPointerCapture(e.pointerId);
 };
 path.onpointermove=e=>{
  if(!pointer||pointer.id!==e.pointerId)return;e.stopPropagation();
  pointer.moved ||= Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>5;
  if(pointer.moved){const p=screenPoint(e.clientX,e.clientY),q=screenPoint(pointer.x,pointer.y);mapState.tx=pointer.tx+p.x-q.x;mapState.ty=pointer.ty+p.y-q.y;setViewport();}
 };
 path.onpointerup=e=>{
  if(!pointer||pointer.id!==e.pointerId)return;e.stopPropagation();
  const moved=pointer.moved;pointer=null;try{path.releasePointerCapture(e.pointerId);}catch{}
  if(!moved)selectEmpire(emp.id,false);else if(typeof queueLocationSave==='function')queueLocationSave();
 };
 path.onpointercancel=()=>{pointer=null;};
 path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();selectEmpire(emp.id,false);}};
}
