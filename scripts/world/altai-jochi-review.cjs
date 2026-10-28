'use strict';
// The Altai is a regional frontier, not a surveyed seventh-century state line.
const G=require('./cartography-geometry.cjs');
const sources={
 altaiFrontier:'Tursynkhan Z. Kayirken. Historical geography of Altai in the epoch of Turkic Kaganate (VI–XIII centuries), 2021; Ahmet Taçagil. The Tribal System of the Turk Khaganate. Chronica 7–8, pp. 242–248; Xin Tang shu, juan 217b.',
 jochi1207:'Michal Biran. Joči. Encyclopaedia Iranica; The Secret History of the Mongols, section 239; B. R. Zoriktuev. About unrenowned crusade of Mongols to Yenisei in 1207, 2013.'
};
const messages=[
 ['Западнотюркские владения к западу от Алтайского рубежа; Семиречье и зависимые городские области Центральной Азии.','Western Turkic domains west of the Altai frontier; Semirechye and dependent urban regions of Central Asia.','Алтай чегинин батышындагы Батыш Түрк ээликтери; Жети-Суу жана Борбордук Азиядагы көз каранды шаардык аймактар.'],
 ['Восточнотюркские владения в Монголии и соседних степях к востоку от Алтайского рубежа.','Eastern Turkic domains in Mongolia and neighbouring steppes east of the Altai frontier.','Алтай чегинин чыгышындагы Монголияда жана ага жанаша талаалардагы Чыгыш Түрк ээликтери.'],
 ['Объединённые монгольские владения в 1206 году. Поход Джучи к лесным народам и енисейским кыргызам относится к 1207 году.','Unified Mongol domains in 1206. Jochi’s campaign to the forest peoples and the Yenisei Kyrgyz belongs to 1207.','1206-жылдагы бириккен монгол ээликтери. Жучунун токой элдерине жана енисейлик кыргыздарга жортуулу 1207-жылы болгон.']
];
// A shared atlas-scale ridge corridor. Both states use the same vertices;
// split their combined previous extent, rather than hiding overlap by draw order.
const ridge=[[85,60],[86,54],[87.8,50.2],[89.1,49],[90.3,47.4],[91.2,46],[92.4,44],[93.4,42.2],[96,35]];
function apply(es,{frame,at,by,cite,I}){
 const westMask=G.union([[[-180,35],...ridge.slice().reverse(),[-180,60]]]);
 const eastMask=G.union([[[180,35],[180,60],...ridge]]);
 const years=[...new Set([...by.get('westernTurkic').keyframes,...by.get('easternTurkic').keyframes].map(f=>f.year).filter(y=>y<630))].sort((a,b)=>a-b);
 const stages=years.map(y=>({y,combined:G.merge([G.union(at('westernTurkic',y).polys),G.union(at('easternTurkic',y).polys)])}));
 for(const {y,combined}of stages){
  frame('westernTurkic',y,{polys:I(combined,westMask),territories:messages[0][0]});
  frame('easternTurkic',y,{polys:I(combined,eastMask),territories:messages[1][0]});
 }
 frame('mongol',1206,{territories:messages[2][0]});
 for(const id of ['westernTurkic','easternTurkic'])cite(id,'altaiFrontier');
 cite('mongol','jochi1207');
}
// Apply after the reviewed Mongol geometry is compiled; raw polygon editing
// alone would be overwritten by mongol-frontiers.geometry().
const rules=[['mongol','yeniseiKyrgyz',1206,1207,'jochi1207'],['westernTurkic','sui',610,618,'altaiFrontier'],['westernTurkic','tang',618,630,'altaiFrontier']];
module.exports={apply,sources,messages,rules,ridge};
