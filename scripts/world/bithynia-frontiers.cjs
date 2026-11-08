'use strict';
const G=require('./cartography-geometry.cjs');
const {D}=require('./legacy-frontiers.cjs');
const ring=vertices=>G.union([vertices]);
// Regional extents reconstructed from settlements and campaigns in İnalcık,
// Osman I and Orhan. They describe control at the scale of the atlas.
const early=ring([[29.37,40.06],[29.48,39.94],[29.80,39.87],[30.00,39.84],[30.35,39.68],[30.52,39.72],[30.51,39.89],[30.31,40.08],[30.17,40.23],[29.91,40.30],[29.64,40.32],[29.52,40.24],[29.48,40.15]]);
const sakarya=ring([[29.53,40.19],[29.87,40.16],[30.23,40.10],[30.36,40.25],[30.54,40.55],[30.40,40.62],[30.23,40.54],[30.13,40.51],[29.99,40.49],[29.89,40.41],[29.58,40.34]]);
const kite=ring([[28.61,40.20],[28.74,40.12],[28.86,40.10],[29.39,40.01],[29.65,40.05],[29.72,40.30],[29.47,40.35],[29.19,40.34],[28.96,40.28],[28.76,40.29],[28.61,40.26]]);
const bursa=ring([[28.96,40.18],[29.00,40.12],[29.09,40.12],[29.17,40.20],[29.13,40.25],[29.03,40.26],[28.97,40.23]]);
const nicaea=ring([[29.34,40.39],[29.52,40.33],[29.73,40.31],[29.87,40.40],[29.85,40.50],[29.66,40.54],[29.42,40.49]]);
const coast=ring([[29.02,40.69],[29.27,40.63],[29.42,40.48],[29.60,40.47],[29.79,40.54],[30.10,40.51],[30.38,40.47],[30.65,40.69],[30.86,41.09],[30.86,41.20],[30.36,41.21],[29.93,41.13],[29.57,41.05],[29.29,40.99],[29.10,40.93]]);
// Connect the held valleys to the Gulf of İzmit after Pelekanon. The urban
// strongholds below are excluded individually until their recorded surrender.
const hinterland=ring([[28.77,40.19],[29.19,40.08],[29.68,40.12],[30.10,40.18],[30.36,40.32],[30.50,40.62],[30.42,40.79],[30.08,40.87],[29.69,40.86],[29.26,40.77],[28.98,40.66],[28.86,40.42]]);
const izmit=ring([[29.74,40.73],[29.81,40.69],[29.96,40.68],[30.04,40.77],[30.0,40.84],[29.86,40.86],[29.75,40.81]]);
const gemlik=ring([[28.94,40.41],[29.05,40.36],[29.18,40.36],[29.39,40.42],[29.43,40.54],[29.22,40.56],[29.05,40.51],[28.97,40.50]]);
const karesi=ring([[26.52,39.19],[27.03,38.99],[27.18,38.97],[27.65,39.15],[28.13,39.30],[28.46,39.72],[28.50,40.05],[28.72,40.26],[27.87,40.38],[27.36,40.48],[26.88,40.40],[26.59,39.86],[26.76,39.66]]);
const memo=new Map();
function extent(year){
 const phase=[1299,1302,1305,1326,1329,1331,1334,1337,1345].filter(y=>y<=year).at(-1);
 if(memo.has(phase))return memo.get(phase);
 const parts=[early];
 if(year>=1302)parts.push(sakarya);
 if(year>=1305)parts.push(kite);
 if(year>=1329)parts.push(coast,hinterland);
 if(year>=1331)parts.push(nicaea);
 if(year>=1334)parts.push(gemlik);
 if(year>=1345)parts.push(karesi);
 let result=G.merge(parts);
 if(year<1326)result=D(result,bursa);else result=G.merge([result,bursa]);
 if(year<1331)result=D(result,nicaea);
 if(year<1334)result=D(result,gemlik);
 if(year<1337)result=D(result,izmit);else result=G.merge([result,izmit]);
 memo.set(phase,result);return result;
}
const forts=G.merge([bursa,nicaea,gemlik,izmit]);
function roman(shape,year){return D(G.merge([shape,forts]),extent(year));}
module.exports={extent,roman,forts};
