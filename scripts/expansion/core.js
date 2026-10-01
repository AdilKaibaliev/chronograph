'use strict';
function expansionRoutesAt(state,year){return state.routes.filter(r=>r.from<=year&&year<=r.to);}
function expansionSnapshot(state,year,wanted){
 const inPeriod=year>=state.from&&year<=state.to;
 const available=inPeriod?state.routes.filter(r=>r.to<=year):[];
 return {available,selected:available.find(r=>r.id===wanted)||available.at(-1)||null};
}
// Split crossings at ±180°. Never connect Alaska to Siberia across Eurasia.
function expansionSegments(points){
 const parts=[[points[0].slice()]];
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],delta=b[0]-a[0];
  if(Math.abs(delta)>180){
   const adjusted=b[0]+(delta>0?-360:360),edge=delta>0?-180:180;
   const lat=a[1]+(b[1]-a[1])*(edge-a[0])/(adjusted-a[0]);
   parts.at(-1).push([edge,lat]);parts.push([[-edge,lat],b.slice()]);
  }else parts.at(-1).push(b.slice());
 }
 return parts;
}
if(typeof module!=='undefined')module.exports={expansionSnapshot,expansionSegments,expansionRoutesAt};
