'use strict';
// Atlas-scale regional reconstructions. More vertices are not more historical
// certainty: the points describe regions, not a surveyed medieval state line.
const G=require('./cartography-geometry.cjs');
const clip=require('../vendor/polygon-clipping.cjs');
const data=require('../../research/turkic-contours.json');
const source='Yuri Bregel. An Historical Atlas of Central Asia (2003), maps 7–14; Peter B. Golden. An Introduction to the History of the Turkic Peoples; E. A. Davidovich. The Karakhanids. History of Civilizations of Central Asia, vol. IV, part 1. Early seventh-century reference geometry: Bennett et al. Cliopatria v0.2.1 (CC BY 4.0).';
const fromGeo=g=>clip.union(g.type==='Polygon'?[g.coordinates]:g.coordinates).flatMap(p=>p.map(r=>r.slice(0,-1).map(v=>v.map(n=>+n.toFixed(8)))));
const early={westernTurkic:fromGeo(data.selected.western.geometry),easternTurkic:fromGeo(data.selected.eastern.geometry)};
// Semirechye: Chu–Talas, Ili, southern Balkhash, Dzungarian Alatau and the
// northern Tian Shan. Campaigns across the Oxus or into the Tarim are not fill.
const semirechye=G.union([[
 [68.7,42.5],[69.6,42.1],[70.5,41.8],[71.7,41.9],[72.7,42.1],
 [73.6,42.2],[74.6,42.25],[75.5,42.15],[76.4,42.1],[77.3,42.2],
 [78.3,42.45],[79.2,42.7],[80.1,42.75],[81.1,43.0],[82.1,43.1],
 [83.0,43.5],[83.7,44.15],[84.0,44.8],[83.6,45.4],[82.8,45.8],
 [82.1,46.25],[81.2,46.55],[80.3,46.7],[79.3,46.75],[78.2,46.8],
 [77.2,46.55],[76.3,46.2],[75.25,46.0],[74.3,45.65],[73.3,45.1],
 [72.4,44.6],[71.4,44.0],[70.3,43.6],[69.3,43.3]
]]);
// An independently drawn regional envelope for the Türgesh northern/eastern
// steppe zone; no copying of a modern international frontier.
const dzungaria=G.union([[
 [79.1,46.0],[80.1,46.9],[81.4,47.4],[82.7,47.7],[84.0,48.0],
 [85.0,48.25],[85.8,48.0],[86.6,47.5],[87.3,46.9],[87.9,46.2],
 [88.1,45.4],[87.6,44.8],[86.6,44.4],[85.6,44.1],[84.4,43.9],
 [83.2,43.65],[82.1,43.8],[81.2,44.3],[80.3,45.1]
]]);
const kashgar=G.union([[
 [72.8,42.25],[73.2,41.4],[73.5,40.6],[73.6,39.8],[73.9,39.1],
 [74.5,38.6],[75.3,38.5],[76.2,38.6],[77.0,39.0],[77.8,39.6],
 [78.1,40.25],[78.2,40.9],[78.5,41.7],[78.3,42.45],
 [77.3,42.2],[76.4,42.1],[75.5,42.15],[74.6,42.25]
]]);
const transoxiana=G.union([[
 [60.0,43.7],[60.0,41.5],[61.4,41.4],[62.2,40.5],[63.6,39.1],
 [64.5,38.4],[65.4,37.7],[66.8,37.35],[67.4,37.05],[68.3,37.1],
 [69.2,37.2],[70,37.4],[71.2,37.1],[72.0,38.0],[73.0,39.2],
 [73.8,40.6],[73.8,42.5],[72.3,43.2],[70.9,43.5],[69.4,43.5],
 [68.2,43.4],[66.9,43.8],[65.4,44.1],[63.8,44.0],[62.0,43.8]
]]);
const khotan=G.union([[
 [75.3,38.5],[76.0,37.7],[77.0,37.0],[78.1,36.65],[79.3,36.6],
 [80.5,36.75],[81.5,37.1],[82.2,37.65],[82.5,38.3],[82.2,39.05],
 [81.3,39.6],[80.1,40.05],[78.1,40.25],[77.8,39.6],[77.0,39.0],[76.2,38.6]
]]);
const ferghana=G.union([[
 [69.7,40.25],[70.4,39.7],[71.4,39.5],[72.5,39.7],[73.5,40.2],
 [74.1,41.0],[73.8,41.8],[72.7,42.1],[71.7,41.9],[70.6,41.3]
]]);
function apply(es,{frame,by}){
 for(const [id,polys]of Object.entries(early)){
  // The detailed reference describes the early seventh-century regional
  // extent. Keep existing dated Chinese acquisitions and Altai partition:
  // subsequent regional review rules act on both sides of every shared edge.
  for(const f of by.get(id).keyframes)if(f.year<657){
   // The source outline omits Balkh. Retain the already reviewed Tokharistan
   // dependency within the old parent footprint; the Khorasan rule below
   // still excludes Persian Merv/Herat. No new southern extension is inferred.
   const local=id==='westernTurkic'?by.get('tokharistan').keyframes.filter(k=>k.year<=f.year).at(-1)?.polys:[];
   const retained=local?.length?clip.intersection(G.multi(G.union(f.polys)),G.multi(G.union(local))).flatMap(p=>p.map(r=>r.slice(0,-1))):[];
   f.polys=G.merge([polys,retained]);
  }
 }
 for(const f of by.get('turgesh').keyframes)f.polys=G.merge([semirechye,dzungaria]);
 for(const f of by.get('karluk').keyframes)f.polys=structuredClone(semirechye);
 const heartland=G.merge([semirechye,kashgar]);
 for(const f of by.get('qarakhanid').keyframes)f.polys=G.merge([heartland,...(f.year>=999?[transoxiana,ferghana]:[]),...(f.year>=1006?[khotan]:[])]);
 frame('qarakhanid',1006,{polys:G.merge([heartland,ferghana,transoxiana,khotan])});
 for(const id of ['westernTurkic','easternTurkic','turgesh','karluk','qarakhanid']){
  const e=by.get(id);if(!e.source.includes(source))e.source+=' '+source;
 }
 return es;
}
module.exports={apply,source,early,semirechye,dzungaria,kashgar,transoxiana,khotan,ferghana};
