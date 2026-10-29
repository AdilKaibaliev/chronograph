'use strict';
const G=require('./cartography-geometry.cjs'),{I,D}=require('./legacy-frontiers.cjs');
// Regional reconstruction: the shared Tell frontier follows the western
// approaches to Kabylia, not a modern administrative boundary.
const easternLimit=G.union([[[-180,-85],[1.5,-85],[1.5,33],[2.3,34.4],[3.35,35.4],[3.45,37.5],[-180,37.5]]]);
const earlyLimit=G.union([[[-180,-85],[-2,-85],[-2,37.5],[-180,37.5]]]);
const tellCoast=G.union([[[-2.2,34.7],[-1.3,34.5],[0,35],[1.8,35.5],[3.25,36.2],[3.35,37.3],[1,37.1],[-1.5,36.4],[-2.2,35.5]]]);
module.exports=c=>{
 const source='maghrebDatedFrontier';
 c.sources[source]={title:'Mehmet Özdemir. Hammâdîler; Ahmet Kavas. Tilimsân; TDV İslâm Ansiklopedisi. Murâbıtlar; UNESCO. Al Qal’a of Beni Hammad, nomination dossier.',urls:['https://islamansiklopedisi.org.tr/hammadiler','https://islamansiklopedisi.org.tr/tilimsan','https://islamansiklopedisi.org.tr/murabitlar','https://whc.unesco.org/document/151548']};
 const shape=a=>c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons;
 const original=c.areas.map(a=>({...a,geometry:shape(a)}));
 const get=(id,y)=>original.find(a=>a.entry===id&&a.from<=y&&y<a.to)?.geometry||[];
 // Keep Béjaïa and the Qal'a in the Hammadid realm until 1152.
 // The western conquest of 1147 is not the conquest of central Maghreb.
 const hammad=y=>y<1080?get('hammadid',y):D(get('hammadid',y),easternLimit);
 for(const key of ['areas','outlines'])c[key]=c[key].flatMap(a=>{
  if(!['hammadid','almoravid','almohad'].includes(a.entry)||a.from>=1236)return[a];
  const dates=[a.from,...[1080,1152].filter(y=>a.from<y&&y<a.to),a.to];
  return dates.slice(0,-1).map((from,i)=>{
   const n={...a,id:dates.length===2?a.id:a.id+'-edge-'+from,from,to:dates[i+1]};
   const old=key==='areas'?shape(a):a.polygons;
   let p=a.entry!=='hammadid'&&from>=1080?require('./coast-geometry.cjs')(G.merge([old,tellCoast])):old;
   if(a.entry==='hammadid')p=hammad(from);
   else if(a.entry==='almoravid'&&from<1080)p=I(old,earlyLimit);
   else if(from<1152)p=D(p,hammad(from));
   if(!p.length)throw Error('Empty Maghreb review '+n.id);
   n.sources=[...new Set([...a.sources,source])];
   if(key==='areas'){c.cartography.areas[n.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);if(c.cartography.kinds?.[a.id])c.cartography.kinds[n.id]=c.cartography.kinds[a.id];}
   else {n.polygons=p;n.points=p[0];}
   const record={id:n.id,entry:n.entry,from:n.from,to:n.to,reason:'Dated western conquests and Hammadid frontier',source};
   c.sharedFrontiers.frames.push(record);c.frontierReview.frames.push(record);
   return n;
  });
 });
 c.maghrebFrontierReview={version:1,dates:[1080,1152],scope:'Western conquests and central Maghreb frontier; approximate regional reconstruction. Internal tribal control and the 1145–1147 campaign require a separate finer chronology.'};
 return c;
};
