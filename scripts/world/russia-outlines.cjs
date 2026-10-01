'use strict';
// Political extent is distinct from the catalogue's local centres and communities.
// Rings are regional reconstructions, clipped to the atlas land mask at display time.
module.exports=c=>{
 const T=s=>s.split('|'),end=Math.min(c.range.max+1,1917),blue='#96a6b8';
 c.sources.to1918RussianAtlas={title:'Атлас Азиатской России. Переселенческое управление, 1914; Manatū Taonga. Map of the Russian Empire in 1914.',urls:['https://www.loc.gov/item/2021666105/','https://nzhistory.govt.nz/media/photo/map-russian-empire-1914']};
 c.sources.to1918RussianTreaties={title:'Ништадтский мирный договор (1721); Нерчинский договор (1689); Айгунский договор (1858); Пекинский договор (1860).',urls:['https://docs.historyrussia.org/ru/nodes/335720','https://www.prlib.ru/history/619514','https://www.prlib.ru/history/619270','https://www.prlib.ru/node/619718']};
 c.sources.to1918PacificTreaties={title:'Совместный сборник документов по истории территориального вопроса между Россией и Японией: договоры 1855, 1875 и 1905 годов.',urls:['https://www.mofa.go.jp/region/europe/russia/territory/edition92/','https://www.mofa.go.jp/region/europe/russia/territory/edition92/period2.html']};
 c.sources.to1918RussianAmerica={title:'National Park Service. Russian America; Convention between Great Britain and Russia (1825); Treaty concerning the Cession of the Russian Possessions in North America (1867).',urls:['https://www.nps.gov/subjects/nhlalaska/russian-alaska.htm','https://history.state.gov/milestones/1866-1898/alaska-purchase','https://vilda.alaska.edu/digital/collection/cdmg21/id/21782/']};
 c.sources.to1918Kamchatka={title:'Камчатский краевой объединённый музей. Памятный крест В. Атласова, 1697; Атлас Азиатской России, 1914.',urls:['https://kamchatka-museum.ru/pamyatnyj-krest-ustanovlennyj-v-atlasovym-v-chest-prisoedineniya-kamchatki-k-territorii-rossijskogo-gosudarstva/']};
 const members=[['early-siberian-forts',1587,1917],['1789-siberian-tatar',1601,1917],['1789-siberian-river-centres',1619,1917],['1789-yenisei-communities',1703,1917],['1789-belarus-russia',1772,1915],['1815-finland',1809,1917],['1815-warsaw',1815,1915],['early-kazakh',1868,1917],['late-kyrgyz-tianshan',1876,1917],['1789-kokand',1876,1917],['1848-pishpek',1862,1917],['1914-tashkent',1865,1917],['1789-kodiak',1784,1867],['1815-sitka',1799,1867]];
 const coastNorth=[[180,73],[165,75],[145,77],[125,77],[112,77.8],[95,77.8],[75,77],[56,76.5],[45,73],[34,70]];
 const chukotka=[[-180,64],[-174,64.2],[-169,65.2],[-169,67],[-175,70],[-180,72]];
 const alaska=[[-168.5,65],[-166,69],[-155,72],[-145,71],[-141,70],[-141,60.2],[-138,59.7],[-135.5,58.7],[-133.2,57.5],[-131.2,56.4],[-130,54.7],[-132.1,54.7],[-135.8,57],[-147,59],[-153,57],[-160,54.5],[-166,54],[-166,57],[-163,59],[-168,61]];
 const alaskaEarly=[[-168.5,65],[-161,66],[-157,65],[-154,63],[-151,62],[-141,60.2],[-135.5,58.7],[-130,54.7],[-132.1,54.7],[-147,59],[-153,57],[-160,54.5],[-166,54],[-166,57],[-163,59],[-168,61]];
 const aleutians=[[[172,51],[180,51],[180,53.5],[172,53.5]],[[-180,50.8],[-171,51],[-164,53],[-160,54.2],[-162,56],[-172,54],[-180,53.5]]];
 const sakhalin=[[[141.5,54.5],[144,54.5],[145.2,48],[143,45.8],[141,46],[141,50]]];
 const northSakhalin=[[[141,50],[144.7,50],[144,54.5],[141.5,54.5]]],southSakhalin=[[[141,50],[144.7,50],[145.2,48],[143,45.8],[141,46]]];
 const kurils=[[[155.1,50.5],[156.5,50.5],[156.8,51.2],[155.2,51.2]],[[153.2,49.1],[155.8,49.8],[156.2,50.9],[154.8,50.8]],[[150,46.2],[153.3,47.7],[154.8,49.2],[153.9,49.9],[151.8,48.7],[149.8,47.2]]];
 function west(y){
  if(y<1721)return [[34,70],[31,68],[33,65],[34,62],[33,60],[31,59.3],[28,58],[28.5,56],[32,54],[33,53],[34,52],[36,51],[39,52],[43,52],[45.5,49]];
  const fin=y>=1809?[[34,70],[29,69.5],[27.8,70.1],[25.8,69.6],[20.5,69.1],[21.8,68.1],[23.4,67.6],[23.7,66.2],[24.2,65.7],[24.8,65],[23.5,63.5],[20,62.5],[19.5,60],[22,59.2]]:[[34,70],[29,69],[31,66],[32,63],[y>=1743?27.2:28.7,61.5],[y>=1743?26.5:28.2,60.4],[27.5,59.4],[22,59.5]];
  const pol=y>=1815?[[20.9,56.4],[21,55.7],[22.6,55.2],[22.8,54.5],[23.7,53.9],[21.6,53.8],[20,53.5],[18.3,53],[18.1,52],[17.8,51.2],[19.3,50.5],[20,50.2],[22,50.5],[23.7,50.5],[24.1,50.1],[25,50.4],[26.2,50.5],[26.5,48.6]]:y>=1795?[[20.9,56.4],[21,55.7],[22.6,55.2],[23.7,53.9],[23.5,52],[23.7,51.4],[25,50.4],[26.2,50.5],[26.5,48.6]]:y>=1793?[[23.1,56.6],[27,56],[27,54],[24.5,51.5],[26.2,50.5],[26.5,48.6]]:y>=1772?[[23.1,56.6],[28.2,56],[29,54],[30,52],[31,51],[31,49.5]]:[[23.1,56.6],[28.2,56],[31.8,54],[31.2,52],[30.5,51.1],[31.3,49.9],[34,49],[36,50]];
  return [...fin,...pol];
 }
 function south(y){
  const black=y>=1812?(y>=1856&&y<1878?[[28.2,46.5],[29.5,46.4],[30.5,46.5]]:[[27.1,48.3],[28.2,46.5],[28.2,45.5],[29.7,45.3]]):y>=1792?[[29.7,46],[31.5,46]]:y>=1783?[[32.5,47],[33,46]]:[[37,49],[40,48.8],[43,49]];
  const crimea=y>=1783?[[32.3,45.5],[32.5,44.5],[35.7,44.5],[37,45.5],[38.2,45.5]]:[];
  const caucasus=y>=1878?[[40.1,43.5],[41.4,41.5],[41.4,41],[42.4,40.5],[43.1,39.7],[44.5,39.6],[46,38.8],[48.5,38.4],[50.3,40.8],[50,45]]:y>=1828?[[40.5,43.5],[42,42],[43.6,41.1],[43.5,40.3],[44.5,39.6],[46,38.8],[48.5,38.4],[50.3,40.8],[50,45]]:y>=1813?[[40.5,43.5],[43,42],[44,41.4],[46.2,41],[47,39.6],[48.5,38.4],[50.3,40.8],[50,45]]:y>=1801?[[40.5,44],[43,42],[44,41.4],[46.2,41.4],[47.5,44],[50,45]]:[[45.5,48],[48,45.5],[50,47]];
  const steppe=y>=1868?[[50.5,48],[53,47],[56,46],[58,44],[60,44],[64,43.5],[66,42],[66.4,40.2],[66.5,39.4],[67.5,39.3],[68.3,40],[69.5,40.8],...(y>=1876?[[70.9,39.4],[72.4,39.3],[73,39.5]]:[[71,42.8],[73.5,42.4]]),...(y>=1895?[[73,38],[74.7,37.2],[75.1,38.1],[74.9,39.5]]:[]),[76,41.2],[80,42.5],[80,44.5],[82,45.2],[85,47],[87,49],[90,50]]:y>=1822?[[50.5,49],[54,49],[58,49.5],[62,51],[69,52],[73,51.8],[77,49.5],[80,49],[84,49.8],[87,50.5],[90,51]]:[[50.5,49],[55,52.5],[62,54],[69,54.7],[74,54.5],[80,52.5],[84,52.3],[88,53],[92,52.8]];
  return [...black,...crimea,...caucasus,...steppe];
 }
 function east(y){
  if(y<1587)return [[59,57],[60,66],[61,73],[56,76.5],[45,73],[34,70]];
  if(y<1619)return [[77,56],[82,60],[84,71],[80,74],[60,77],[45,73],[34,70]];
  if(y<1632)return [[94,57],[97,64],[97,76],[75,77],[56,76.5],[45,73],[34,70]];
  if(y<1649)return [[100,53],[110,55],[120,58],[131,60],[137,66],[137,74],[112,77.8],[75,77],[56,76.5],[45,73],[34,70]];
  const transbaikal=[[96,52],[99,52],[102,50.8],[105,50.2],[108,49.5],[110,49.1],[115,49.9],[119.9,49.5],[120.7,53.4]];
  const amur=y>=1860?[[124,53.5],[127,50],[130.7,48],[134.6,48.4],[134.8,47.3],[133,45],[131.1,44],[130.6,42.4],[132,42],[136,43],[142,50]]:y>=1858?[[124,53.5],[127,50],[130.7,48],[134.6,48.4],[135.1,49.3],[139,51.5],[141.1,53]]:[[123,55.4],[130,55.7],[136,57],[140.5,56.5]];
  const pacific=y>=1697?[[146,58],[150,58],[154,57],[157,54],[156,51],[157,50.8],[163,54],[166,59],[180,64]]:[[146,59],[153,59],[159,63],[169,64],[180,64]];
  return [...transbaikal,...amur,...pacific,...coastNorth];
 }
 function rings(y){
  // Before trans-Ural expansion the southern edge ends at the Urals.
  const s=y<1587?[[46.5,49],[48,45.5],[50,47],[53,54],[59,56]]:south(y);
  const out=[[...west(y),...s,...east(y)]];
  if(y>=1649)out.push(chukotka);
  if(y>=1784&&y<1799){const a=c.areas.find(a=>a.entry==='1789-kodiak'&&a.from<=y&&a.to>y);if(a)out.push(...a.polygons);}
  if(y>=1799&&y<1867)out.push(y>=1825?alaska:alaskaEarly,...aleutians);
  if(y>=1855&&y<1875)out.push(...kurils);
  if(y>=1875)out.push(...(y>=1905?northSakhalin:sakhalin));
  // Transcaspian possessions connect to the main domain along the eastern Caspian.
  if(y>=1881)out.push([[52,47],[56,46],[58,44],[58,41.8],[59.5,40.8],[61,39],[60.5,37.5],[58,37.2],[55,38],[53,40],[51.8,42]]);
  if(y>=1884)out.push([[59.5,40.8],[61,39],[60.5,37.5],[61.8,36.7],[63.5,37.5],[64.5,38.4],[63.3,39.2],[61.5,40.5]]);
  return structuredClone(out).map(r=>{const signed=r.reduce((sum,p,i)=>{const q=r[(i+1)%r.length];return sum+p[0]*q[1]-q[0]*p[1];},0);return signed<0?r.reverse():r;});
 }
 const cuts=[1556,1587,1619,1632,1649,1667,1689,1697,1721,1743,1772,1774,1783,1784,1792,1793,1795,1799,1801,1809,1812,1813,1815,1822,1825,1828,1855,1856,1858,1860,1862,1865,1867,1868,1875,1876,1878,1881,1884,1895,1905,1914,1915,end].filter((y,i,a)=>y>=1721&&y<=end&&a.indexOf(y)===i).sort((a,b)=>a-b);
 c.outlines=[];
 for(let i=0;i<cuts.length-1;i++){
  const from=cuts[i],to=cuts[i+1],entry=from<1721?'early-russia':'1789-russian-empire';
  if(!c.entries.find(e=>e.id===entry)?.phases.some(p=>p.from<=from&&p.to>from))continue;
  const name=T(from<1721?'Русское царство|Tsardom of Russia|Орус падышалыгы':'Российская империя|Russian Empire|Россия империясы');
  const text=T(from<1697?'Царство расширяется за Урал через речные пути и остроги. Местные общества сохраняют собственные формы жизни и сопротивляются завоеванию.|The tsardom expands beyond the Urals along rivers and through forts. Local societies retain their ways of life and resist conquest.|Падышалык дарыя жолдору жана чептер аркылуу Уралдан ары кеңейет. Жергиликтүү коомдор жашоо салттарын сактап, басып алууга каршылык көрсөтөт.':from<1867?'Европейские и сибирские владения показаны в составе одного государства. Камчатка включена после похода Атласова; с конца XVIII века появляются колониальные владения в Русской Америке. Управление опирается на города, остроги и местные соглашения.|European and Siberian possessions form one state. Kamchatka enters after Atlasov’s expedition; colonial possessions in Russian America appear from the late eighteenth century. Administration rests on towns, forts and local agreements.|Европадагы жана Сибирдеги ээликтер бир мамлекеттин курамында көрсөтүлөт. Камчатка Атласовдун жортуулунан кийин кошулат; XVIII кылымдын аягынан Орус Америкасында колониялык ээликтер пайда болот. Башкаруу шаарларга, чептерге жана жергиликтүү келишимдерге таянат.':'Империя простирается от Восточной Европы через Сибирь до Тихого океана. Аляска передана США 18 октября 1867 года. Среднеазиатские приобретения и изменения на Сахалине показаны по датам.|The empire extends from Eastern Europe across Siberia to the Pacific. Alaska was transferred to the USA on 18 October 1867. Central Asian acquisitions and changes on Sakhalin follow their dates.|Империя Чыгыш Европадан Сибирь аркылуу Тынч океанга чейин созулат. Аляска 1867-жылдын 18-октябрында АКШга өткөрүлгөн. Борбордук Азиядагы ээликтер жана Сахалиндеги өзгөрүүлөр даталары боюнча көрсөтүлөт.');
  c.outlines.push({id:'russia-extent-'+from,entry,from,to,name,short:name,title:name,text,polygons:rings(from),kind:'polity',color:blue,label:[75,62],coord:[37.62,55.75],members:members.filter(([,a,b])=>from>=a&&from<b).map(([id])=>id),sources:['to1918RussianAtlas','to1918RussianTreaties','to1918Kamchatka',...(from>=1784?['to1918RussianAmerica']:[]),...(from>=1855?['to1918PacificTreaties']:[])],approx:true,worldFocus:true});
 }
 // Keep the geographical context through the revolutionary year; new national
 // governments and occupied regions are drawn above this sphere-of-influence layer.
 if(c.range.max>=1917){
  const phase=c.entries.find(e=>e.id==='1789-russian-empire')?.phases.find(p=>p.from===1917);
  if(phase)c.outlines.push({id:'russia-revolution-1917',entry:'1789-russian-empire',from:1917,to:1918,name:phase.name,short:phase.name,title:phase.title,text:phase.text,polygons:rings(1916),kind:'influence',color:blue,label:[75,62],coord:[30.32,59.94],members:['early-siberian-forts','1789-siberian-tatar','1789-siberian-river-centres','1789-yenisei-communities'],sources:['to1918RussianAtlas','to1918Revolution'],approx:true,worldFocus:true});
 }
 // The 1905 cession must have a visible recipient, not just disappear from Russia.
 const japanBase=y=>c.areas.find(a=>a.entry==='japan'&&a.from<=y&&a.to>y),hokkaido=[[[139.4,41.3],[141.2,41.3],[145.8,43.2],[145.5,45.7],[142,46],[140,44]]];
 for(const [from,to,extra] of [[1869,1875,hokkaido],[1875,1905,[...hokkaido,...kurils]],[1905,c.range.max+1,[...hokkaido,...kurils,...southSakhalin]]]){
  const a=japanBase(from);if(!a)continue;
  c.outlines.push({id:'japan-pacific-'+from,entry:'japan',from,to:Math.min(to,c.range.max+1),name:a.name,title:T('Северные острова Японии|Japan’s northern islands|Япониянын түндүк аралдары'),text:T('Хоккайдо включён в административное устройство Японии в 1869 году. Северные Курильские острова переходят от России в 1875 году; южный Сахалин — в 1905 году.|Hokkaido enters Japan’s new administrative system in 1869. The northern Kuril Islands pass from Russia in 1875; southern Sakhalin follows in 1905.|Хоккайдо 1869-жылы Япониянын жаңы административдик түзүлүшүнө кирет. Түндүк Курил аралдары Россиядан 1875-жылы, түштүк Сахалин 1905-жылы өтөт.'),polygons:[...a.polygons,...extra],label:[138,38],coord:[139.76,35.68],color:a.color,kind:'polity',sources:['to1918PacificTreaties','to1914Japan'],approx:true,members:[]});
 }
 return c;
};
