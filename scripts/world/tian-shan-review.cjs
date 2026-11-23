'use strict';
// Fort and valley evidence gives regional limits, not a surveyed ethnic border.
const G=require('./cartography-geometry.cjs');
const chu=[[71.2,42.1],[71.6,42.8],[72.4,43.05],[73.2,43.1],[74.1,43.12],[74.8,43.08],[75.4,42.95],[75.9,42.65],[75.65,42.38],[75.1,42.25],[74.3,42.13],[73.5,42.05],[72.6,41.95],[71.8,41.97]];
const inner=[[71.2,40.4],[72.2,40.4],[73.1,40.65],[73.7,40.9],[74.4,41],[75.2,40.85],[75.9,40.85],[76.5,41],[77.1,41.4],[77.3,41.8],[77,42.1],[76.2,42.3],[75.9,42.65],[75.3,42.7],[74.7,42.4],[74,42.1],[73.4,41.85],[72.9,41.5],[72.4,41.1],[71.6,40.95]];
const issyk=[[75.65,42.38],[76.2,42.75],[77,42.95],[77.8,42.95],[78.5,42.83],[79.1,42.5],[79.25,42.15],[78.8,41.85],[78.1,41.75],[77.3,41.8],[76.65,42],[76.15,42.15]];
module.exports=c=>{
 const source='kyrgyzKokandValleys';c.sources[source]={title:'Т. Н. Омурбеков, Т. К. Чоротегин. История Кыргызстана, 8 класс, 2014, § 2, с. 7–12; § 6, с. 33–37. Scott C. Levi. The Rise and Fall of Khoqand, 1709–1876, 2017, chapter 5.',urls:['https://upittpress.org/wp-content/uploads/2019/07/9780822965060exr.pdf']};
 const records=[];
 function revise(entry,from,to,fn){for(const key of ['areas','outlines'])c[key]=c[key].flatMap(a=>{
  if(a.entry!==entry||a.to<=from||a.from>=to)return [a];const cuts=[a.from,...[from,to,1849,1855,1860,1862,1864,1865].filter(y=>a.from<y&&y<a.to),a.to].filter((y,i,all)=>all.indexOf(y)===i).sort((a,b)=>a-b);
  return cuts.slice(0,-1).map((start,i)=>{const n=cuts.length===2?a:{...a,id:a.id+'-tianshan-'+start,from:start,to:cuts[i+1]};if(key==='areas'){c.cartography.areas[n.id]=c.cartography.areas[a.id];if(c.cartography.kinds[a.id])c.cartography.kinds[n.id]=c.cartography.kinds[a.id];}if(start<from||start>=to)return n;
   const old=key==='areas'?c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons:a.polygons,p=fn(old,start);if(!p.length)throw Error('Empty Tian Shan shape '+n.id);
   if(key==='areas'){c.cartography.areas[n.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);}else {n.polygons=p;n.points=p[0];}
   n.approx=true;n.sources=[...new Set([...n.sources,source])];records.push({entry,from:n.from,to:n.to,source});return n;
  });
 });}
 const envelope=y=>G.union([chu,...(y>=1831?[inner,issyk]:[])]);
 const russian=y=>{const o=c.outlines.find(a=>a.entry==='1789-russian-empire'&&a.from<=y&&y<a.to);if(o)return o.polygons;const a=c.areas.find(a=>a.entry==='1789-russian-empire'&&a.from<=y&&y<a.to);return a?c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons:[];};
 for(const [from,to]of [[1825,1831],[1831,1834],[1834,1867]])revise('1789-kokand',from,to,(p,y)=>G.merge([p,G.difference(envelope(y),russian(y))]));
 for(const [from,to]of [[1825,1831],[1831,1834],[1834,1864]])revise('1789-qing',from,to,(p,y)=>G.difference(p,envelope(y)));
 // These six-vertex cultural sketches do not establish a political frontier.
 // Dated places, tribal observations and movements supply the map's evidence.
 for(const a of c.areas)if(a.entry==='late-kyrgyz-tianshan'&&a.kind==='cultural')a.settlementMarkersOnly=true;
 c.tianShanReview={version:1,records,scope:'Kokand fort-and-valley reconstruction; dated Kyrgyz settlement markers; no surveyed ethnic boundary'};return c;
};
module.exports.regions={chu,inner,issyk};
