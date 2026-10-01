'use strict';
const G=require('./cartography-geometry.cjs');
// Labels are typography, not city coordinates. Find a point inside the actual
// coastal polygon; never enlarge a historical frontier to accommodate a label.
module.exports=function labelPoint(rings,preferred){
 if(preferred&&G.covers(rings,preferred))return preferred;
 const parts=G.multi(rings),distance=(a,b)=>(a[0]-b[0])**2*Math.cos(b[1]*Math.PI/180)**2+(a[1]-b[1])**2;
 const candidates=[];
 for(const part of parts){
  const r=part[0],xs=r.map(p=>p[0]),ys=r.map(p=>p[1]);
  let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const clearance=p=>Math.min(...part.flatMap(r=>r.map((a,i)=>{const b=r[(i+1)%r.length],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return distance(p,[a[0]+t*dx,a[1]+t*dy]);})));
  let best=null,score=-1;
  for(let level=0;level<4;level++){
   const dx=(x1-x0)/14,dy=(y1-y0)/14;
   for(let ix=0;ix<14;ix++)for(let iy=0;iy<14;iy++){
    const p=[x0+(ix+.5)*dx,y0+(iy+.5)*dy];if(!G.covers(part,p))continue;
    const s=clearance(p);if(s>score){best=p;score=s;}
   }
   if(!best)break;
   x0=best[0]-dx;x1=best[0]+dx;y0=best[1]-dy;y1=best[1]+dy;
  }
  if(best)candidates.push({point:best,area:G.signed(r),score:preferred?clearance(preferred):0});
 }
 candidates.sort((a,b)=>preferred?a.score-b.score:b.area-a.area);
 if(!candidates.length)throw Error('No interior point for map label');
 return candidates[0].point.map(n=>+n.toFixed(7));
};
