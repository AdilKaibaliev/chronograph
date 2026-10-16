'use strict';
// Dated regional reconstructions, not modern borders or surveyed medieval lines.
// Both chronology engines use these same Maghreb shapes.
const G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const flat=m=>m.flatMap(p=>p.map(r=>r.slice(0,-1)));
const D=(a,b)=>a.length&&b.length?flat(clip.difference(G.multi(a),G.multi(b))):a;
const I=(a,b)=>a.length&&b.length?flat(clip.intersection(G.multi(a),G.multi(b))):[];
const box=(x,y,X,Y)=>G.union([[[x,y],[X,y],[X,Y],[x,Y]]]);
const central=G.union([[[0,35.5],[4,37],[7.4,37],[8,35],[6,33.2],[2,33]]]);
const eastern=G.union([[[6.5,36.8],[10.9,37.5],[12,33.7],[17,31.1],[16,29.9],[11,31],[8.3,32.5],[6.1,34.3]]]);
const maghreb=G.merge([central,eastern]);
const ifriqiya=D(eastern,central);
const west=box(-180,-85,18,85);
const sources={
 frisiaStages:'Bruce Donaldson. Dutch. A linguistic history of Holland and Belgium (1983), pp. 89–90; Gilles de Langen and Dennis Worst. De oostelijke begrenzing van de moederparochie Dokkum ca. 950–1150 (2021).',
 frankishStages:'Reinhold Kaiser. Royaume franc; Charlemagne. Dictionnaire historique de la Suisse; Bibliotheque nationale de France. Le regne des Carolingiens; Matthias Becher. Sturz Herzog Tassilos. Historisches Lexikon Bayerns; ICOMOS. The Longobards in Italy, No. 1318 (2011).',
 catalanStages:'Josep M. Salrach. Monarquia carolingia i poder comtal. Historia, politica, societat i cultura dels Paisos Catalans; La intervencio carolingia en els afers d’Hispania. Del roma al romanic.',
 maghrebDependence:'Museum With No Frontiers. Discover Islamic Art: Hammadids; Corisande Fenwick. The Islamic Archaeology of Ifriqiya and the central Maghreb.'
};
const messages=[
 ['Франкские владения расширяются поэтапно: Северная Италия — с 774 года, Бавария — с 788-го. Саксонские войны продолжаются в 772–804 годах.','Frankish domains expand in stages: northern Italy from 774 and Bavaria from 788. The Saxon Wars continue from 772 to 804.','Франк ээликтери этап менен кеңейген: Түндүк Италия 774-жылдан, Бавария 788-жылдан. Сакс согуштары 772–804-жылдары уланган.'],
 ['Галлия, рейнские земли, Алеманния и Тюрингия.','Gaul, the Rhineland, Alemannia and Thuringia.','Галлия, Рейн аймагы, Алеманния жана Тюрингия.'],
 ['Франкские земли и завоёванное Лангобардское королевство Северной Италии.','Frankish lands and the conquered Lombard kingdom in northern Italy.','Франк жерлери жана Түндүк Италиядагы каратылган Лангобард королдугу.'],
 ['Северная Италия и западная Саксония; Жирона под франкской властью с 785 года.','Northern Italy and western Saxony; Girona is under Frankish rule from 785.','Түндүк Италия жана батыш Саксония; Жирона 785-жылдан франктардын бийлигинде.'],
 ['Бавария включена в державу после низложения Тассилона III в 788 году.','Bavaria joins the realm after the deposition of Tassilo III in 788.','Бавария 788-жылы Тассилон III тактан түшүрүлгөндөн кийин державага кошулган.'],
 ['Франкские владения на среднем Дунае после походов против аваров 791–796 годов.','Frankish domains on the middle Danube after the campaigns against the Avars in 791–796.','791–796-жылдары аварларга каршы жортуулдардан кийин ортоңку Дунайдагы франк ээликтери.'],
 ['Барселона взята в 801 году; граница проходит севернее Тортосы.','Barcelona is taken in 801; the frontier lies north of Tortosa.','Барселона 801-жылы алынган; чек ара Тортосанын түндүгүнөн өткөн.'],
 ['Завершение Саксонских войн в 804 году; владения Каролингов от Пиренеев до Эльбы и средней Италии.','The Saxon Wars end in 804; Carolingian domains extend from the Pyrenees to the Elbe and central Italy.','Сакс согуштары 804-жылы аяктаган; Каролингдердин ээликтери Пиренейден Эльбага жана ортоңку Италияга чейин созулган.'],
 ['Ифрикия под управлением Зиридов, признающих верховенство Фатимидов.','Ifriqiya is administered by the Zirids, who acknowledge Fatimid overlordship.','Ифрикияны Фатимиддердин үстөмдүгүн тааныган Зириддер башкарган.'],
 ['В 1048 году Зириды разрывают связь с Фатимидами.','In 1048 the Zirids break their allegiance to the Fatimids.','1048-жылы Зириддер Фатимиддерге баш ийүүнү токтоткон.'],
 ['Фатимидский халифат','Fatimid Caliphate','Фатимийлер халифаты'],
 ['Египет и восточные владения; Ифрикией управляют Зириды под верховной властью Фатимидов.','Egypt and eastern domains; the Zirids administer Ifriqiya under Fatimid overlordship.','Египет жана чыгыш ээликтери; Ифрикияны Фатимийлердин үстөмдүгү астында Зириддер башкарат.'],
 ['Египет и восточные владения; после разрыва 1048 года Ифрикия не входит в державу Фатимидов.','Egypt and eastern domains; after the break in 1048, Ifriqiya is outside the Fatimid realm.','Египет жана чыгыш ээликтери; 1048-жылкы ажырашуудан кийин Ифрикия Фатимийлердин державасына кирбейт.']
];
function legacy(es,{frame,at,by,cite}){
 // Replace the pre-conquest maximum, which reached Poland and northern Italy
 // already in 768. Endpoints follow regional histories; intervening revolts
 // are not invented as continuously moving military fronts.
 const core=G.union([[[-1.9,48.7],[-1.3,46.3],[-1.6,43.5],[0.1,42.8],[1.4,43.1],[2.1,43.7],[3.7,44.1],[4.7,43.2],[7.1,43.5],[7.6,44.4],[6.8,45.3],[7.4,46.1],[9,46.4],[10.5,46.8],[10.7,48],[11.7,49],[12.1,50.3],[11.2,51.2],[9.5,51.5],[8.1,51.5],[7,51.8],[6.1,51.9],[5.8,51.7],[4,51.6],[2.4,51.2],[.2,50.2],[-1.9,49.8]]]);
 const frisiaFull=G.union([[[4,51.6],[5.8,51.7],[7,51.8],[7.5,53.5],[5.6,53.7],[4.5,53.1]]]);
 // The 734 conquest reaches the Lauwers; eastern Frisia belongs to the
 // later Saxon campaigns. This is a regional frontier, not a surveyed line.
 const frisia=I(frisiaFull,box(-180,-85,6.2,85));
 const septimania=G.union([[[.1,42.8],[1.4,43.1],[2.1,43.7],[3.7,44.1],[4.7,43.2],[3.1,42.3],[2.4,42.3],[1.5,42.5]]]);
 // Exclude Rome and the Ravenna exarchate from the northern Lombard core.
 const northItaly=G.union([[[6.8,45.3],[7.6,44.4],[7.1,43.5],[8.5,43.7],[9.7,44],[10.9,42.3],[12,42.5],[12.2,43.4],[11.5,44.1],[11.7,44.8],[12.2,45.1],[13.6,45.8],[13.7,46.6],[12.3,46.8],[10.5,46.8],[9,46.4],[7.4,46.1]]]);
 const spoleto=G.union([[[12.35,42.65],[12.5,43.2],[13.2,43.3],[13.7,42.8],[14.15,42.2],[13.8,41.9],[13.1,42.15]]]);
 const benevento=G.union([[[13.7,41.9],[14.15,42.2],[15.4,42],[16.2,41.4],[16.8,40.5],[16.4,39.5],[15.7,39.7],[15,40.4],[14.7,40.7],[14.4,41],[13.7,41.3]]]);
 // Liguria remains Roman until Rothari's conquest of 643.
 const liguria=G.union([[[7.1,43.5],[8.5,43.7],[9.7,44],[9.9,44.5],[8.9,44.8],[7.9,44.7],[7.5,44.3]]]);
 for(const f of by.get('lombards').keyframes)f.polys=G.merge([f.year<643?D(northItaly,liguria):northItaly,spoleto,benevento]);
 frame('lombards',643,{polys:G.merge([northItaly,spoleto,benevento])});
 const saxonWest=G.merge([G.union([[[7,51.8],[8.1,51.5],[9.5,51.5],[11.2,51.2],[11.5,52.2],[10.5,53.2],[9.5,53.6],[7.5,53.5]]]),D(frisiaFull,frisia)]);
 const saxonNorth=G.union([[[9.5,53.6],[10.5,53.2],[11.5,52.2],[11.2,51.2],[12.1,51.6],[12.1,52.6],[11.4,53.4],[10.7,54.3],[9,54.4],[8.5,54.2]]]);
 const bavaria=G.union([[[10.5,46.8],[12.3,46.8],[13.7,46.6],[15.3,46.4],[16.2,47.2],[15.8,48.5],[13.7,48.9],[12.1,50.3],[11.7,49],[10.7,48]]]);
 const danube=G.union([[[13.7,46.6],[15.3,46.4],[16.2,45.9],[18.3,46.1],[18.8,47.3],[17.5,48.5],[15.8,48.5],[16.2,47.2]]]);
 const girona=G.union([[[1.5,42.5],[2.4,42.3],[3.1,42.3],[3.4,41.7],[2.2,41.7],[1.6,42]]]);
 const barcelona=G.union([[[1.6,42],[2.2,41.7],[3.4,41.7],[2.7,41.1],[1.5,41],[1.15,41.45]]]);
 const stages=[[610,[core],1],[700,[core],1],[734,[core,frisia],1],[759,[core,frisia,septimania],1],[768,[core,frisia,septimania],1],[774,[core,frisia,septimania,northItaly],2],[776,[core,frisia,septimania,northItaly,spoleto],2],[785,[core,frisia,septimania,northItaly,spoleto,saxonWest,girona],3],[788,[core,frisia,septimania,northItaly,spoleto,saxonWest,girona,bavaria],4],[796,[core,frisia,septimania,northItaly,spoleto,saxonWest,girona,bavaria,danube],5]];
 by.get('franks').body=messages[0][0];
 for(const[y,p,m]of stages)frame('franks',y,{polys:G.merge(p),territories:messages[m][0]});
 const final=structuredClone(at('franks',796).polys);
 frame('franks',800,{polys:final});
 for(const y of [800,801,804,843])frame('carolingian',y,{polys:G.merge([final,...(y>=801?[barcelona]:[]),...(y>=804?[saxonNorth]:[])]),territories:messages[y>=804?7:y>=801?6:5][0]});
 for(const id of ['franks','lombards','carolingian'])cite(id,'frankishStages');
 for(const id of ['franks','carolingian','cordoba'])cite(id,'catalanStages');
 for(const id of ['franks','carolingian'])cite(id,'frisiaStages');
 // Both engines share the same dependent province extent. Remove the old
 // western Fatimid wedge when the Zirids renounce their allegiance.
 const fat=by.get('fatimid'),original=structuredClone(fat.keyframes);
 frame('fatimid',909,{label:[10.5,34.6]});
 const raw=y=>original.filter(f=>f.year<=y).at(-1).polys;
 for(const y of [...new Set([...original.map(f=>f.year).filter(y=>y>=969),972,1014,1048])]){
  const east=D(G.union(raw(y)),west);
  const domain=y<1014?maghreb:y<1048?ifriqiya:[];
  frame('fatimid',y,{polys:G.merge([east,domain]),label:[29,28],territories:y>=1048?messages[12][0]:y>=972?messages[11][0]:fat.territories});
 }
 cite('fatimid','maghrebDependence');
}
function world(c){
 const source='maghrebDependence';c.sources[source]={title:sources[source],urls:['https://islamicart.museumwnf.org/dynasty.php?id=50','https://discovery.ucl.ac.uk/10067414/3/Fenwick%2001_Fenwick-Handbook_final.pdf']};
 const zirid=c.entries.find(e=>e.id==='zirid'),old=zirid.phases[0];
 zirid.phases=[{...old,to:1048,text:messages[8],sources:[...old.sources,source],period:['972–1047','972–1047','972–1047']},{...old,from:1048,to:1057,text:messages[9],sources:[...old.sources,source],period:['1048–1056','1048–1056','1048–1056']},{...old,from:1057,period:['1057–1147','1057–1147','1057–1147']}];
 c.areas=c.areas.flatMap(a=>a.entry==='zirid'&&a.from<1048&&1048<a.to?[{...a,to:1048},{...a,id:'zirid-1048',from:1048}]:[a]);
 for(const a of c.areas.filter(a=>['zirid','hammadid'].includes(a.entry))){
  let p=a.entry==='hammadid'?central:a.from<1014?maghreb:a.from<1057?ifriqiya:G.union(a.polygons);
  a.polygons=p;a.points=p[0];a.sources=[...new Set([...a.sources,source])];
  if(a.entry==='zirid'){
   a.text=zirid.phases.find(p=>p.from<=a.from&&a.from<p.to).text;
   if(a.from<1048)Object.assign(a,{overlord:'fatimid',sovereignName:messages[10],relationship:'vassal',dependencyOutline:true,legacyOverlord:true,color:'#826957'});
  }
  c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(p);
 }
 c.mediterraneanReview={version:1,ziridAllegiance:[972,1048],sharedEdge:'Zirid/Hammadid from 1014; same Ifriqiya outline in the Fatimid chronology'};
 return c;
}
const rules=[['byzantine','lombards',610,633,'frankishStages'],['medievalByzantine','lombards',633,774,'frankishStages'],['medievalByzantine','franks',774,800,'frankishStages'],['medievalByzantine','carolingian',800,843,'frankishStages'],['cordoba','franks',785,800,'catalanStages'],['cordoba','carolingian',800,843,'catalanStages']];
module.exports={legacy,world,sources,messages,rules,maghreb,ifriqiya,central};
