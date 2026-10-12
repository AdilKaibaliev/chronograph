'use strict';
// Regional cartographic reconstruction, not treaty-scale demarcation.
// Shared edges remove independent digitisation seams. Sovereignty, occupation,
// and cultural settlement retain their separate meanings and dates.
module.exports=c=>{
 const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs'),ref=require('./to1960-reference.json');
 const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1).map(p=>p.map(v=>+v.toFixed(8))))).filter(r=>Math.abs(G.signed(r))>.000005);
 const I=(a,b)=>flat(clip.intersection(G.multi(a),G.multi(b))),D=(a,b)=>flat(clip.difference(G.multi(a),G.multi(b)));
 const U=(...n)=>G.merge(n.map(n=>G.union(ref[n]))),box=(x,y,X,Y)=>G.union([[[x,y],[X,y],[X,Y],[x,Y]]]);
 const active=(id,y)=>c.areas.find(a=>a.entry===id&&a.from<=y&&y<a.to);
 const original=a=>c.cartography.shapes[c.cartography.areas[a.id]]||a.polygons;
 const before=new Map(c.areas.map(a=>[a.id,structuredClone(original(a))]));
 const B=(id,y)=>before.get(active(id,y)?.id)||[];
 const frames=[],notes=[];
 const put=(a,p,reason)=>{
  if(!p.length)throw Error('Empty frontier review '+a.id);
  c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);
  frames.push({id:a.id,entry:a.entry,from:a.from,to:a.to,reason});
 };
 const shape=(id,y)=>{const a=active(id,y);return a?original(a):[];};
 // Full national envelopes replace isolated inherited regional patches. The
 // reference supplies generalised edges only; the historical status is sourced
 // separately, including the contemporary Tibetan administration and Tuva.
 const modern={
  '1789-qajar':['Iran'], '1789-durrani':['Afghanistan'], '1914-mongolia':['Mongolia']
 };
 for(const a of c.areas){
  const from=a.entry==='1789-qajar'?1882:a.entry==='1789-durrani'?1896:1911;
  if(modern[a.entry]&&a.from>=from&&a.from<1946)put(a,U(...modern[a.entry]),'complete-national-envelope');
 }
 for(const a of c.areas.filter(a=>a.from>=1911&&a.from<1946&&a.entry==='cartography-tuva'))put(a,I(B(a.entry,a.from),U('Russia')),'tuva-mongolia-shared-edge');
 const east=box(60,-90,180,90),west=box(-180,-90,60,90),sovietEast=I(U('Russia','Kazakhstan','Uzbekistan','Turkmenistan','Tajikistan','Kyrgyzstan'),east);
 for(const a of c.areas.filter(a=>a.entry==='1939-ussr'&&a.from>=1922&&a.from<1946)){
  let p=sovietEast;
  if(a.from<1944)p=D(p,shape('cartography-tuva',a.from));
  // Southern Sakhalin and the Kurils are Japanese before the 1945 transfer.
  if(a.from<1945)p=D(p,B('japan',a.from));
  p=G.merge([I(B(a.entry,a.from),west),p,I(B(a.entry,a.from),box(-180,50,-169,90))]);
  p=D(p,G.merge([U('Iran','Afghanistan','Mongolia','China')]));
  put(a,p,'soviet-asian-frontier-with-dated-tuvasakhalin');
 }
 const china=U('China');
 for(const a of c.areas.filter(a=>a.from>=1912&&a.from<1946&&['cartography-tibet','1914-xinjiang','1939-manchukuo'].includes(a.entry)))put(a,I(B(a.entry,a.from),china),'china-regional-administration-edge');
 for(const a of c.areas.filter(a=>a.entry==='1789-qing'&&a.from>=1912&&a.from<1946)){
  let p=D(china,shape('cartography-tibet',a.from));
  if(a.from>=1932&&a.from<1945)p=D(p,shape('1939-manchukuo',a.from));
  p=D(p,B('1848-hongkong',a.from));
  put(a,p,'republic-of-china-continuous-mainland');
 }
 for(const a of c.areas.filter(a=>a.entry==='1789-qing'&&a.from===1911))put(a,D(B(a.entry,a.from),U('Mongolia')),'outer-mongolia-1911-separation');
 for(const a of c.areas.filter(a=>['1789-russian-empire','1918-siberia','1918-soviet-russia','1939-far-east'].includes(a.entry)&&a.from>=1911&&a.from<1946))put(a,D(B(a.entry,a.from),U('China','Mongolia','Iran','Afghanistan')),'russian-civil-war-regions-respect-external-neighbours');
 // Repair the neighbouring side too: replacing only one country would create
 // a fresh seam along an otherwise shared edge. No modern area is added here.
 const neighboursToTrim={
  '1939-turkey':['Iran'],'1939-iraq':['Iran'],
  '1789-tayson':['China'],'1789-lao-kingdoms':['China'],
  '1939-china-occupation':['Mongolia','Russia','North Korea'],
  '1945-manchuria':['Mongolia','Russia','North Korea']
 };
 for(const a of c.areas.filter(a=>a.from>=1919&&a.from<1946&&neighboursToTrim[a.entry]))put(a,D(B(a.entry,a.from),U(...neighboursToTrim[a.entry])),'shared-edge-on-both-sides');
 for(const a of c.areas.filter(a=>a.entry==='1939-india'&&a.from>=1919&&a.from<1946)){
  let p=U('India','Pakistan','Bangladesh');if(a.from<1937)p=G.merge([p,U('Myanmar')]);
  put(a,p,'british-india-common-exterior');
 }
 // Dependencies are clipped to their documented parent envelope, not drawn as
 // independent states that protrude across the parent's international border.
 for(const a of c.areas.filter(a=>a.from>=1919&&a.from<1946&&['1789-hyderabad','1789-mysore','1848-kashmir'].includes(a.entry))){const p=I(B(a.entry,a.from),shape('1939-india',a.from));if(p.length)put(a,p,'indian-princely-state-within-imperial-envelope');}
 const H=require('./late-helpers.cjs')(c,{start:1919,max:1945});
 H.source('frontierAmericas','International Boundary Commission. History and Treaty of 1908; Arquivo Nacional do Brasil. Dionísio Evangelista de Castro Cerqueira; Fundação Alexandre de Gusmão. Obras do Barão do Rio Branco, Volume V: Questões de limites.',[
  'https://internationalboundarycommission.org/en/about/history.php',
  'https://mapa.an.gov.br/index.php?catid=70&id=1559&option=com_content&view=article',
  'https://www.gov.br/funag/pt-br/chdd/arquivos-chdd/publicacoes/obras_do_barao_do_rio_branco__volume_v_._questoes_de_limites__exposicoes_de_motivos__capa_mole.pdf']);
 // Correct the common edge only. Keep each country's dated possessions,
 // including Newfoundland's exclusion from Canada before 1949.
 const americanFix={'1789-usa':['Canada'],'1789-canada':['United States of America'],'1789-rio-plata':['Brazil'],'early-portuguese-brazil':['Argentina','Uruguay'],'1815-banda-oriental':['Brazil']};
 const americanShape=(id,p)=>id==='1789-canada'?I(p,U('Canada')):id==='early-portuguese-brazil'?I(p,U('Brazil')):D(p,U(...americanFix[id]));
 for(const a of c.areas.filter(a=>a.from>=1919&&a.from<1946&&americanFix[a.entry]))put(a,americanShape(a.entry,B(a.entry,a.from)),'american-treaty-frontier-shared-edge');
 // Source cards already describe these as communities inside colonial states
 // or as a divided region. Their category must not imply separate sovereignty.
 c.cartography.kinds={...c.cartography.kinds};
 for(const a of c.areas.filter(a=>a.from>=1919&&a.from<1946&&['bornu-late','1789-rozvi','1789-lunda','1789-xhosa','early-haudenosaunee','1789-jamaica-maroons','early-transylvania'].includes(a.entry))){
  c.cartography.kinds[a.id]='cultural';notes.push({id:a.id,entry:a.entry,from:a.from,to:a.to,kind:'cultural',sources:a.sources,reason:'community-or-region-within-existing-polities'});
 }
 H.source('frontierHimalaya','Foreign Relations of the United States, 1950, Volume V: Nepal, Department of State Policy Statement; United States Army, The Pacific and Adjacent Theaters, 1942; Treaty of Punakha, 1910.',[
  'https://history.state.gov/historicaldocuments/frus1950v05/d836',
  'https://tile.loc.gov/storage-services/public/gdc/00107311816/00107311816.pdf',
  'https://www.cambridge.org/core/journals/itinerario/article/friendship-and-international-relations-in-the-himalayas-bhutan-britain-and-the-1910-treaty-of-punakha/84B58A6909F14A5B6D609B825777A0D1']);
 for(const[id,n,name,text,coord]of [
  ['1960-nepal','Nepal',['Королевство Непал','Kingdom of Nepal','Непал Королдугу'],['Непал сохраняет собственную монархию и управление Рана. Договор с Великобританией 1923 года подтверждает независимость страны. Непал не входит в Британскую Индию.','Nepal retains its monarchy and Rana government. The 1923 treaty with Britain confirms its independence. Nepal is not part of British India.','Непалда монархия жана Рана башкаруусу сакталат. Британия менен 1923-жылкы келишим өлкөнүн көз карандысыздыгын ырастайт. Непал Британ Индиясына кирбейт.'],[85.32,27.72]],
  ['1960-bhutan','Bhutan',['Королевство Бутан','Kingdom of Bhutan','Бутан Королдугу'],['Бутаном правит династия Вангчук. Внутреннее управление сохраняется за монархией; по договору 1910 года британское правительство консультирует Бутан по внешним отношениям.','Bhutan is ruled by the Wangchuck dynasty. The monarchy retains internal administration; under the 1910 treaty Britain advises Bhutan on external relations.','Бутанды Вангчук династиясы башкарат. Ички башкаруу монархияда калат; 1910-жылкы келишим боюнча Британия тышкы байланыштар боюнча кеңеш берет.'],[89.64,27.47]]
 ]){
  const e=c.entries.find(e=>e.id===id);e.phases.unshift(H.phase(1919,1946,name,text,['frontierHimalaya'],{name,approx:false,coord,frontierAdded:true}));
  const a=H.area(id,1919,1946,U(n),{name,kind:'polity',color:n==='Nepal'?'#98a781':'#b5ad81'});a.label=coord;a.frontierAdded=true;put(a,a.polygons,'missing-himalayan-state');
 }
 // Rebuild reviewed owner envelopes; broad province sketches must not restore
 // an old overshoot. Foreign possessions outside the reviewed mainland survive.
 const ids=new Set(frames.map(f=>f.entry));
 for(const o of c.outlines.filter(o=>o.from<1946&&ids.has(o.entry))){
  const a=active(o.entry,o.from);if(!a||!frames.some(f=>f.id===a.id))continue;
  let p=americanFix[o.entry]?americanShape(o.entry,o.polygons):shape(o.entry,o.from);
  o.polygons=p;o.points=p[0];frames.push({id:o.id,entry:o.entry,from:o.from,to:o.to,reason:'reviewed-owner-envelope'});
 }
 // These dependencies are already described explicitly in the historical
 // source cards; restore the omitted relationship in the map data as well.
 for(const[owner,member,from,to,relationship]of [
  ['1789-dzungar','early-yarkand',1680,1705,'dependency'],
  ['1789-dzungar','1789-altishahr',1705,1755,'dependency'],
  ['late-trebizond','early-trebizond',1454,1461,'province']
 ]){
  c.cartography.relations.push({owner,member,from,to,relationship,extent:false});
  const owners=c.areas.filter(a=>a.entry===owner&&a.from<to&&from<a.to);
  for(const a of owners){
   const start=Math.max(from,a.from),end=Math.min(to,a.to),existing=c.outlines.filter(o=>o.entry===owner&&o.from<end&&start<o.to);
   if(existing.length){for(const o of existing){if(relationship==='province')o.members=[...new Set([...(o.members||[]),member])];else o.dependencies={...o.dependencies,[member]:relationship};}}
   else{const p=shape(owner,start);c.outlines.push({...a,id:'frontier-owner-'+owner+'-'+start,from:start,to:end,polygons:p,points:p[0],members:relationship==='province'?[member]:[],dependencies:relationship==='province'?{}:{[member]:relationship},short:a.name,cartographic:true});}
  }
  notes.push({owner,member,from,to,relationship,reason:'relationship-already-stated-in-source-card'});
 }
 c.frontierReview={version:1,frames,notes,addedProfiles:['1960-nepal','1960-bhutan'],sources:['frontierHimalaya','frontierAmericas'],scope:'Shared regional edges, full national envelopes and historically separate administrations; not precise surveyed boundaries'};
 return c;
};
