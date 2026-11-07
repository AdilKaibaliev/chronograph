'use strict';
const clip=require('../vendor/polygon-clipping.cjs');
const cache=new Map();
const clean=r=>r.filter((p,i)=>!i||p[0]!==r[i-1][0]||p[1]!==r[i-1][1]);
// Existing catalogue rings are independent positive areas, not GeoJSON holes.
// Boolean output retains hole winding, so enclaves do not become annexations.
function union(rings){
 const key=JSON.stringify(rings);if(cache.has(key))return cache.get(key);
 const input=rings.map(clean).filter(r=>r.length>=3).map(r=>[r]);
 const out=input.length?clip.union(...input).flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))):[];
 cache.set(key,out);return out;
}
function multi(rings){
 const shells=rings.filter(r=>signed(r)>0).map(r=>[r]);
 for(const hole of rings.filter(r=>signed(r)<0)){
  const owner=shells.find(p=>hole.some((v,i)=>{
   const next=hole[(i+1)%hole.length];
   return inside(p[0],v)||inside(p[0],[(v[0]+next[0])/2,(v[1]+next[1])/2]);
  }));
  if(!owner)throw Error('Unowned hole');
  owner.push(hole);
 }
 return shells;
}
function difference(rings,cut){return clip.difference(multi(rings),cut.map(r=>[r])).flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8)))));}
function merge(geometries){const input=geometries.filter(g=>g.length).map(multi);return input.length?clip.union(...input).flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))):[];}
function signed(r){return r.reduce((a,p,i)=>{const q=r[(i+1)%r.length];return a+p[0]*q[1]-q[0]*p[1];},0)/2;}
function inside(r,[x,y]){let b=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const p=r[i],q=r[j];if((p[1]>y)!==(q[1]>y)&&x<(q[0]-p[0])*(y-p[1])/(q[1]-p[1])+p[0])b=!b;}return b;}
const covers=(rings,p)=>rings.reduce((n,r)=>n+(inside(r,p)?Math.sign(signed(r)):0),0)>0;
module.exports={union,difference,merge,signed,covers,inside,multi};
