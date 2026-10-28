'use strict';
const G=require('./cartography-geometry.cjs');
const sources={
 taurusFrontier:'Tülin Kaya. Understanding the Use of Byzantine Routes in Central Anatolia (ca. 7th–9th Centuries). Studia Ceranea 9 (2019), pp. 259–278; TDV Islam Ansiklopedisi. Tarsus; Bizans.',
 chinaInterregnum:'Naomi Standen. The Five Dynasties; Hugh R. Clark. The Southern Kingdoms between the Tang and the Sung, 907–979. The Cambridge History of China, vol. 5, part 1; Chenggu County Gazetteer (城固县志), historical administrative divisions; Huainan Municipal Government. Administrative history (建置沿革); Wang Zifu. Zhoushan shizong (舟山史踪).'
};
const messages=[
 ['Северные династии Китая; региональные границы меняются вместе с походами и сменой власти.','Northern dynasties of China; regional frontiers change with campaigns and political succession.','Кытайдын түндүк династиялары; аймактык чек аралар жортуулдар жана бийлик алмашуусу менен өзгөргөн.'],
 ['Царства Южного Китая; Сычуань показана отдельно от северных владений до 925 года и вновь с 934 года.','The kingdoms of southern China; Sichuan is separate from the northern domains before 925 and again from 934.','Түштүк Кытайдын падышалыктары; Сычуань 925-жылга чейин жана 934-жылдан тартып түндүк ээликтерден өзүнчө көрсөтүлгөн.'],
 ['Поздняя Тан: после завоевания Ранней Шу в 925 году Сычуань включена в северное государство; в 934 году возникает Поздняя Шу.','Later Tang: following the conquest of Former Shu in 925, Sichuan belongs to the northern state; Later Shu emerges in 934.','Кийинки Тан: 925-жылы Алгачкы Шу басып алынгандан кийин Сычуань түндүк мамлекетке кирген; 934-жылы Кийинки Шу түзүлгөн.'],
 ['Поздняя Чжоу: Шоучжоу взят в 957 году; в 958 году Южная Тан уступает земли к северу от Янцзы.','Later Zhou: Shouzhou falls in 957; in 958 Southern Tang cedes its lands north of the Yangtze.','Кийинки Чжоу: Шоучжоу 957-жылы алынган; 958-жылы Түштүк Тан Янцзынын түндүгүндөгү жерлерин өткөрүп берген.']
];
// Regional reconstruction along Qinling, the Han corridor and the Huai.
// The masks partition the inherited combined extent; no modern province
// boundary or straight latitude is asserted as a historical surveyed border.
const divide=[[100,34.3],[106,34.3],[108,33.8],[110,33.3],[111.5,31.3],[113,31.1],[114,31.4],[115,32.1],[116,32.4],[117,33],[119,33.5],[124,34]];
function apply(es,{frame,at,by,cite,I,D,B}){
 const hanzhong=G.union([[[105,32],[109.7,32],[109.5,33.4],[108,33.8],[106,34],[105,33]]]);
 const combined=G.merge([G.union(at('fiveDynasties',907).polys),G.union(at('tenKingdoms',907).polys),hanzhong]);
 const south=I(combined,G.union([[[100,0],...divide,[124,0]]]));
 const north=D(combined,south);
 const shu=I(combined,G.union([[[101,27],[106,27],[109,29],[110,31],[109.4,33.6],[108,33.8],[106,34.3],[100,34.3],[100,29]]]));
 const shou=I(south,G.union([[[116.1,32.25],[117.1,32.25],[117.3,33.1],[116.1,33.1]]]));
 const huainan=I(south,G.union([[[114.5,30.8],[116,30.8],[117.2,31.5],[118.4,32.15],[118.8,32.2],[119.2,32.25],[119.8,32.15],[122,31.7],[124,34],[119,33.5],[117,33],[115,32.1]]]));
 for(const y of [907,925,934,957,958]){
  let n=north;
  if(y>=925&&y<934)n=G.merge([n,shu]);
  if(y===957)n=G.merge([n,shou]);
  if(y>=958)n=G.merge([n,huainan]);
  frame('fiveDynasties',y,{polys:n,territories:messages[y>=957?3:y===925?2:0][0]});
  frame('tenKingdoms',y,{polys:D(combined,n),territories:messages[1][0]});
 }
 // The last northern dynasty ends with the Song accession, not one year later.
 by.get('fiveDynasties').to=959;
 by.get('fiveDynasties').keyframes=by.get('fiveDynasties').keyframes.filter(f=>f.year<960);
 // Preserve the dated southern border at the Song succession; Song additions
 // are restricted to the acquired Huainan corridor and prior northern fill.
 for(const y of [960,965])frame('northernSong',y,{polys:G.merge([y===960?D(G.union(at('northernSong',y).polys),shu):G.union(at('northernSong',y).polys),huainan])});
 // Tarsus was rebuilt as an Abbasid frontier base in 787/788. Add the
 // Cilician corridor from that stage, not Arab raids into central Anatolia.
 const cilicia=G.union([[[33.5,36.3],[34.1,37.3],[34.7,37.65],[35.5,38],[36.3,37.8],[37.2,38],[38.4,38.8],[39.3,38.7],[39.5,37.5],[36,37],[35,35.9]]]);
 for(const y of [788,800,821])frame('abbasid',y,{polys:G.merge([G.union(at('abbasid',y).polys),cilicia])});
 // Abbasid decentralisation in 868 does not return Cilicia to Rome.
 // Keep the frontier exclusion until the independently attested recoveries.
 const roman965=structuredClone(at('medievalByzantine',965).polys);
 const melitene=G.union([[[37.5,38],[39.5,38],[39.5,39.3],[37.5,39.3]]]);
 frame('medievalByzantine',788,{polys:structuredClone(at('medievalByzantine',788).polys)});
 frame('medievalByzantine',934,{polys:roman965});
 frame('medievalByzantine',965,{polys:roman965});
 for(const id of ['abbasid','medievalByzantine'])cite(id,'taurusFrontier');
 for(const id of ['fiveDynasties','tenKingdoms','northernSong'])cite(id,'chinaInterregnum');
}
const rules=[['medievalByzantine','abbasid',750,1157,'taurusFrontier']];
function geometry(id,y,p,D){
 if(id!=='medievalByzantine'||y<788||y>=965)return p;
 const cilicia=G.union([[[33.5,36.3],[34.1,37.3],[34.7,37.65],[35.5,38],[36.3,37.8],[37.2,38],[38.4,38.8],[39.3,38.7],[39.5,37.5],[36,37],[35,35.9]]]);
 const melitene=G.union([[[37.5,38],[39.5,38],[39.5,39.3],[37.5,39.3]]]);
 return D(p,y<934?cilicia:D(cilicia,melitene));
}
module.exports={apply,sources,messages,rules,divide,geometry};
