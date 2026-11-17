'use strict';
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:610,max:2026}),id='1848-oregon',src='oregonChronology',L=s=>s.split('|');
 H.source(src,'United States Census Bureau. Guide to State and Local Census Geography: Oregon; Oregon Secretary of State. Provisional & Territorial Records Guide; Oregon Historical Quarterly, volume 37, The Oregon State Boundary.',[
  'https://www.census.gov/geographies/reference-files/2010/geo/state-local-geo-guides-2010/oregon.html',
  'https://sos.oregon.gov/archives/provisional-guide/Pages/default.aspx',
  'https://en.wikisource.org/wiki/Oregon_Historical_Quarterly/Volume_37/The_Oregon_State_Boundary',
  'https://sos.oregon.gov/archives/provisional-guide/pages/supreme-court.aspx',
  'https://leg.wa.gov/about-the-legislature/history-of-the-legislature/territorial-history/territorial-government/'
 ]);
 const name=L('Тихоокеанский Северо-Запад США|Pacific Northwest of the United States|АКШнын Тынч океан жээгиндеги түндүк-батышы');
 const rows=[
  [1848,1853,'Учреждение территории Орегон|Organization of Oregon Territory|Орегон аймагынын уюштурулушу','14 августа 1848 года учреждена территория Орегон. Она включает современные Орегон, Вашингтон и Айдахо, а также части Монтаны и Вайоминга.|Oregon Territory is organized on 14 August 1848. It includes present-day Oregon, Washington and Idaho, and parts of Montana and Wyoming.|1848-жылдын 14-августунда Орегон аймагы уюштурулат. Ага азыркы Орегон, Вашингтон, Айдахо жана Монтана менен Вайомингдин бөлүктөрү кирет.'],
  [1853,1859,'Разделение Орегона и Вашингтона|Oregon and Washington territories separated|Орегон жана Вашингтон аймактарынын бөлүнүшү','2 марта 1853 года из северной части территории Орегон образована территория Вашингтон. Южная часть продолжает существовать как территория Орегон.|On 2 March 1853 Washington Territory is created from the northern part of Oregon Territory. The southern part remains Oregon Territory.|1853-жылдын 2-мартында Орегон аймагынын түндүк бөлүгүнөн Вашингтон аймагы түзүлөт. Түштүк бөлүгү Орегон аймагы болуп калат.'],
  [1859,2027,'Орегон и Тихоокеанский Северо-Запад|Oregon and the Pacific Northwest|Орегон жана Тынч океан жээгиндеги түндүк-батыш','14 февраля 1859 года Орегон становится 33-м штатом США. Земли прежней территории за пределами нового штата переданы территории Вашингтон.|Oregon becomes the 33rd US state on 14 February 1859. Lands of the former territory outside the new state are transferred to Washington Territory.|1859-жылдын 14-февралында Орегон АКШнын 33-штаты болот. Мурдагы аймактын жаңы штаттан тышкары калган жерлери Вашингтон аймагына берилет.']
 ];
 const e=c.entries.find(e=>e.id===id),oldPhases=e.phases;
 e.phases=oldPhases.filter(p=>p.from<1848).map(p=>p.to>1848?{...p,to:1848}:p).concat(rows.map(([from,to,title,text])=>H.phase(from,to,L(title),L(text),[src],{name,kind:'region',approx:false,frontierAdded:true})));
 // The original polygon is a regional outline, not the boundary of the
 // present state of Oregon or every historical Oregon Territory.
 const cuts=rows.map(r=>r[0]);
 for(const key of ['areas','outlines']){
  const out=[];
  for(const a of c[key]){
   if(a.entry!==id||a.to<=1848){out.push(a);continue;}
   const dates=[a.from,...cuts.filter(y=>y>a.from&&y<a.to),a.to];
   for(let i=0;i<dates.length-1;i++){
    const from=dates[i],to=dates[i+1],p=e.phases.find(p=>p.from<=from&&from<p.to),copy={...a,id:from===a.from?a.id:a.id+'-dated-'+from,from,to};
    if(from>=1848)Object.assign(copy,{name,title:p.title,text:p.text,sources:[...new Set([...a.sources,src])],frontierAdded:true});
    if(c.cartography.areas[a.id]!==undefined)c.cartography.areas[copy.id]=c.cartography.areas[a.id];
    if(c.cartography.kinds[a.id]!==undefined)c.cartography.kinds[copy.id]=c.cartography.kinds[a.id];
    out.push(copy);
   }
  }
  c[key]=out;
 }
 const centres={1848:[-122.607,45.357],1853:[-122.901,47.038],1859:[-123.035,44.942]};
 for(const [year,,title,text] of rows)H.event('oregon-chronology-'+year,year,id,'politics',centres[year],L(title),L(text),[src],{frontierAdded:true,region:'north'});
 return c;
};
