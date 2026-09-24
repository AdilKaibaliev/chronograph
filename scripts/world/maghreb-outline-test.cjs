const assert=require('node:assert/strict');
const c=require('./catalog.cjs');
// Preserve the pre-repair approximate coverage; remove only artificial seams.
const west=[[-12,28],[-10.4,31.2],[-9,33],[-6,36],[-2,35.2],[3,37],[3.8,35],[1,33],[-3,31],[-6,29],[-9,27.5]];
const central=[[0,35.5],[4,37],[7.4,37],[8,35],[6,33.2],[2,33]];
const east=[[6.5,36.8],[10.9,37.5],[12,33.7],[17,31.1],[16,29.9],[11,31],[8.3,32.5],[6.1,34.3]];
function inside([x,y],p){let b=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)b=!b;}return b;}
const covered=(point,rings)=>rings.some(r=>inside(point,r));
let checks=0;
for(const [id,original,pieces] of [
 ['zirid-972',[central,east],1],
 ['almohad-1152',[west,central],2],
 ['almohad-1159',[west,central,east],2],
 ['almohad-1229',[west,central],1]
]){
 const area=c.areas.find(a=>a.id===id);assert(area);assert.equal(area.polygons.length,pieces,id+' must have one contiguous Maghreb outline');
 const dissolved=area.polygons[0];
 // Irregular sampling avoids coinciding with historical polygon vertices.
 for(let x=-12.037;x<17.1;x+=.137)for(let y=27.413;y<37.7;y+=.113){const p=[x,y];assert.equal(inside(p,dissolved),covered(p,original),id+' coverage at '+p);checks++;}
 // Every new edge is an exterior boundary: its opposite sides cannot both be land within this realm.
 for(let i=0;i<dissolved.length;i++){
  const a=dissolved[i],b=dissolved[(i+1)%dissolved.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),m=[(a[0]+b[0])/2,(a[1]+b[1])/2],eps=.000001;
  assert(len>0);const left=[m[0]-dy/len*eps,m[1]+dx/len*eps],right=[m[0]+dy/len*eps,m[1]-dx/len*eps];
  assert.notEqual(covered(left,original),covered(right,original),id+' retains an internal seam');
 }
 if(pieces===2)assert.deepEqual(area.polygons[1],c.areas.find(a=>a.id==='almohad-1147').polygons[1],id+' must retain separate Andalus');
}
assert.equal(c.areas.find(a=>a.id==='almoravid-1090').polygons.length,2);
console.log('PASS: dissolved Maghreb outlines preserve '+checks+' coverage samples, remove internal seams, and retain separate Andalus.');
