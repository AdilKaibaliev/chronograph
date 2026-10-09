'use strict';
// Shared, generalised frontier topology. This is not a treaty-scale survey.
// Historical divisions and dated exceptions remain explicit below.
module.exports=c=>{
 const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),ref=require('./to1960-reference.json');
 const flat=p=>p.flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))).filter(r=>Math.abs(G.signed(r))>.000005);
 const I=(a,b)=>flat(clip.intersection(G.multi(a),G.multi(b))),D=(a,b)=>flat(clip.difference(G.multi(a),G.multi(b)));
 const U=(...names)=>G.merge(names.map(n=>G.union(ref[n]))),box=(a,b,d,e)=>G.union([[[a,b],[d,b],[d,e],[a,e]]]);
 const active=(id,y)=>c.areas.find(a=>a.entry===id&&a.from<=y&&y<a.to),before=new Map(c.areas.map(a=>[a.id,structuredClone(a.polygons)])),reviewed=new Set();
 const original=(id,y)=>before.get(active(id,y)?.id)||[];
 function put(a,p){if(!p.length)throw Error('Empty reviewed frontier '+a.id);a.polygons=p;a.points=p[0];a.geometry='schematic-regional-outline';delete c.cartography.areas[a.id];reviewed.add(a.entry);}
 const countries={
 '1914-mongolia':['Mongolia'],'late-kyrgyz-tianshan':['Kyrgyzstan'],'early-kazakh':['Kazakhstan'],'1939-uzbek':['Uzbekistan'],'1939-turkmen':['Turkmenistan'],'1939-tajik':['Tajikistan'],
 '1918-estonia':['Estonia'],'1918-latvia':['Latvia'],'1918-lithuania':['Lithuania'],'1918-ukraine':['Ukraine'],'1789-belarus-russia':['Belarus'],'1918-georgia':['Georgia'],'1918-armenia':['Armenia'],'1918-azerbaijan':['Azerbaijan'],
 '1789-durrani':['Afghanistan'],'1789-qajar':['Iran'],'1939-iraq':['Iraq'],'1939-turkey':['Turkey'],'1939-transjordan':['Jordan'],'1789-bangkok':['Thailand'],'1789-konbaung':['Myanmar'],'1960-nepal':['Nepal'],'1960-bhutan':['Bhutan'],
 '1789-great-britain':['United Kingdom'],'late-portugal':['Portugal'],'1789-spain':['Spain'],'early-sweden':['Sweden'],'1815-finland':['Finland'],'1815-norway':['Norway'],'1945-poland':['Poland'],'1914-romania':['Romania'],'1914-bulgaria':['Bulgaria'],'1914-albania':['Albania'],'1918-hungary':['Hungary'],
 '1939-ireland':['Ireland'],'early-netherlands':['Belgium'],'early-dutch':['Netherlands'],'1945-luxembourg':['Luxembourg'],'1945-czechoslovakia':['Czechia','Slovakia'],
 '1815-paraguay':['Paraguay'],'1815-banda-oriental':['Uruguay'],'1789-rio-plata':['Argentina'],'early-portuguese-brazil':['Brazil'],'1815-upper-peru':['Bolivia'],'1789-chile':['Chile'],'early-peru':['Peru'],'1848-venezuela':['Venezuela'],'1789-new-granada':['Colombia'],'1848-ecuador':['Ecuador'],
 '1914-panama':['Panama'],'1848-honduras':['Honduras'],'1848-nicaragua':['Nicaragua'],'1848-costa-rica':['Costa Rica'],'1848-central-america':['Guatemala'],'1848-el-salvador':['El Salvador'],'early-new-spain':['Mexico'],'1848-dominican':['Dominican Rep.'],'1789-saint-domingue':['Haiti'],'1914-cuba':['Cuba'],
 'ethiopia':['Ethiopia'],'1914-eritrea':['Eritrea'],'1848-liberia':['Liberia'],'1848-basotho':['Lesotho'],'1939-angola':['Angola'],'1939-mozambique':['Mozambique'],'1914-kenya':['Kenya'],'1914-uganda':['Uganda'],'1914-namibia':['Namibia'],
 '1939-ussr':['Russia','Ukraine','Belarus','Moldova','Estonia','Latvia','Lithuania','Georgia','Armenia','Azerbaijan','Kazakhstan','Uzbekistan','Turkmenistan','Tajikistan','Kyrgyzstan']
 };
 for(const a of c.areas.filter(a=>a.from>=1946&&a.from<1961))if(countries[a.entry])put(a,U(...countries[a.entry]));
 for(const a of c.areas.filter(a=>a.from>=1946&&a.from<1961)){
  const y=a.from;
  if(a.entry==='1789-qing'){
   let p=U('China');if(y<1951)p=D(p,I(original('cartography-tibet',y),p));
   if(y===1949)p=D(p,I(p,box(108,18,112,20.3)));p=D(p,original('1848-hongkong',y));put(a,p);
  }
  if(['cartography-tibet','1914-xinjiang'].includes(a.entry))put(a,I(a.polygons,U('China')));
  if(a.entry==='late-france')put(a,I(U('France'),box(-6,41,10,52))); // Guiana has a separate dated member.
  if(a.entry==='1789-usa')put(a,U('United States of America'));
  if(a.entry==='1914-alaska')put(a,I(U('United States of America'),box(-180,50,-129,90)));
  if(a.entry==='1789-canada')put(a,y<1949?D(U('Canada'),original('1960-newfoundland',y)):U('Canada'));
  if(a.entry==='1918-scs'){
   let p=U('Slovenia','Croatia','Bosnia and Herz.','Serbia','Montenegro','Kosovo','Macedonia');
   if(y>=1947&&y<1954)p=D(p,original('1960-trieste-b',y));put(a,p);
  }
  if(a.entry==='1848-greece')put(a,U('Greece'));
  if(a.entry==='1914-south-africa')put(a,D(U('South Africa'),U('Lesotho')));
  if(a.entry==='early-johor')put(a,D(a.polygons,original('1848-singapore',y)));
  if(a.entry==='1789-diriyah')put(a,U('Saudi Arabia'));
  if(a.entry==='1789-qasimid')put(a,I(original(a.entry,y),U('Yemen')));
  if(a.entry==='1789-oman')put(a,U('Oman'));
  if(a.entry==='1960-pakistan')put(a,D(U('Pakistan','Bangladesh'),original('1848-kashmir',y)));
  if(a.entry==='1939-india'&&y===1946)put(a,D(I(a.polygons,U('India','Pakistan','Bangladesh')),G.merge([original('1960-sikkim',y),original('1960-goa',y)])));
  if(a.entry==='1939-palestine')put(a,D(a.polygons,U('Lebanon','Jordan','Egypt')));
  if(a.entry==='1918-new-guinea')put(a,I(a.polygons,U('Papua New Guinea')));
  if(['bornu-late','early-haudenosaunee','1789-jamaica-maroons'].includes(a.entry)){a.kind='cultural';reviewed.add(a.entry);}
 }
 // A city profile is part of Kenya, not a second sovereign country on top of it.
 for(const o of c.outlines.filter(o=>o.entry==='1914-kenya'&&o.from>=1946)){o.members=[...new Set([...(o.members||[]),'early-mombasa'])];}
 c.cartography.relations.push({owner:'1914-kenya',member:'early-mombasa',from:1946,to:1961,relationship:'province',extent:false});
 for(const a of c.areas.filter(a=>a.entry==='1914-kenya'&&a.from>=1946))if(!c.outlines.some(o=>o.entry===a.entry&&o.from<=a.from&&a.from<o.to))c.outlines.push({...a,id:'shared-outline-'+a.id,members:['early-mombasa'],dependencies:{},short:a.name,cartographic:true});
 const indianRegions=['early-mughal','1789-company-bengal','1789-maratha','1789-gujarat-regional','1815-sikh','1789-awadh','1789-south-indian-courts','1789-mysore'];
 for(const id of indianRegions)for(const a of c.areas.filter(a=>a.entry===id&&a.from>=1946&&a.from<1961)){
  const relationship=id==='1789-mysore'?'dependency':'province';
  c.cartography.relations.push({owner:'1939-india',member:id,from:a.from,to:a.to,relationship,extent:false});
  for(const o of c.outlines.filter(o=>o.entry==='1939-india'&&o.from<a.to&&a.from<o.to)){
   if(relationship==='province')o.members=[...new Set([...(o.members||[]),id])];else o.dependencies={...o.dependencies,[id]:relationship};
  }
 }
 // Rebuild only reviewed sovereign outlines. Existing member polygons must not
 // reintroduce the old overshoot along an international boundary.
 for(const o of c.outlines.filter(o=>o.from>=1946&&o.from<1961)){
  const a=active(o.entry,o.from);if(!a)continue;
  if(reviewed.has(o.entry)){
   let p=a.polygons;
   const offshore=(o.members||[]).filter(id=>['1789-jamaica','1945-french-guiana','1960-cyprus-bases','1848-tahiti','1914-puerto-rico','early-guam','1914-american-samoa'].includes(id)).map(id=>active(id,o.from)?.polygons).filter(Boolean);
   if(offshore.length)p=G.merge([p,...offshore]);o.polygons=p;o.points=p[0];o.geometry='schematic-regional-outline';
  }
 }
 c.postwarGeographyReview={from:1946,to:1961,profiles:[...reviewed].sort(),reference:'Natural Earth 1:110m Admin 0, generalised; historical exceptions retained',scope:'Common regional frontier topology, not exact treaty demarcation'};
 return c;
};
