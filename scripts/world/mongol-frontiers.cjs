'use strict';
// Atlas-scale regional reconstruction, not surveyed medieval borders.
// Shared edges intentionally use the same vertices: independent sketches of
// adjoining uluses had left fictitious empty corridors across Central Asia.
// Sources and the temporal limits of this reconstruction: UNIVERSAL_BORDERS.md.
const G=require('./cartography-geometry.cjs');
const mongolia=[[87.8,48.5],[89.2,49.2],[91.7,50.1],[94,51],[97,51.5],[99,53],[103,53.2],[108,53],[112,52],[116,51.3],[119,50],[120,48],[119.5,46],[117,44.6],[114,43],[109,42.5],[105,42],[101,42.4],[97,43],[93,44.5],[90,46]];
// The Tarim, Ili and Dzungarian regions after the defeat of Kuchlug in 1218.
// This is not a rectangle copied from the modern Xinjiang boundary.
const innerAsia=[[73.2,40.2],[74.4,42.8],[77,44.8],[80,46.2],[84,48],[87.8,49],[90,48],[93,46],[97,44],[99,42],[97,40],[95,39],[92,37.5],[88,36.5],[83,35.6],[79,36],[76,37.5],[74,39]];
const hexi=[[96,40],[96.6,41.7],[100,43],[105,43],[108,41],[107,38.3],[105.8,36],[103,35],[101,36],[99,37.5],[97.5,39]];
// The Ulus of Jochi's southern frontier is shared with Central Asia.
const jochi=[[28.8,46.2],[31,47.5],[34,49],[37.3,50.2],[40.7,51.5],[44,53],[48,55],[53,56],[59,56],[65,55.5],[70,55],[76,53],[81,51],[85,49.5],[87.8,49],[84,48],[80,46.2],[77,44.8],[74.4,42.8],[70.5,42.7],[68,43.5],[65,43.4],[62.5,42.3],[60.5,41.5],[62.5,39],[59,38.9],[56,39.4],[53,40.5],[50.5,45],[48.4,43],[46.7,43.5],[44.8,43.6],[42.4,43.5],[40.2,43.4],[38.5,44.4],[36.5,45.2],[35.3,44.7],[33.4,44.3],[31.5,45.1]];
const transoxiana=[[60.5,41.5],[62.5,42.3],[65,43.4],[68,43.5],[70.5,42.7],[74.4,42.8],[76,41],[76,37.5],[73.4,37],[71,36.5],[69.4,37.4],[67,37.3],[65,38],[62.5,39]];
const iran=[[40.2,37],[41.7,39],[43.8,41],[45,42.2],[47.6,42],[49.8,40.6],[52.8,39.8],[56,39.4],[59,38.9],[62.5,39],[65,38],[68,36],[69,33],[67.4,30],[65.7,27],[63,25],[60,24.8],[57.5,25.4],[55.8,26.5],[53,27],[50.5,28.8],[48,29.4],[47,31.3],[45,33],[43,35],[41.3,36]];
const baghdad=[[41.3,36],[43,35],[45,33],[47,31.3],[48,29.4],[46.8,29.6],[45.1,31.3],[43.1,33.1],[41.2,34.5]];
// Following the Huai/Hexi frontiers in broad outline, not the Yangtze:
// Kaifeng falls in 1233 and the Jin state ends in 1234; Song survives until 1279.
const northChina=[[101,42],[105,43],[110,42.5],[116,42],[121,42],[125,44.3],[130,47],[134,48],[135,46],[133,43],[130.7,42.2],[128,41.5],[125,40],[122,39],[121.5,38.5],[122.8,37.6],[122.5,36.4],[120.5,35],[119.8,33.2],[116,32.5],[112.5,33.1],[109.5,33.3],[106,33.1],[104,34],[102,37]];
const chinaSouth=[[97.4,28.5],[98.2,25],[100,22],[102,22.2],[104,22.7],[106.5,22],[108,20.8],[110.5,20.2],[114,21.4],[117,22.7],[119.8,24.7],[121.8,27.6],[123,30.5],[122,32.5],[119.8,33.2],[116,32.5],[112.5,33.1],[109.5,33.3],[106,33.1],[103.8,34],[101.5,33],[99.4,31]];
const hainan=[[108.5,20.3],[111.2,20.3],[111.2,18],[108.5,18]];
const aliases={'late-yuan':'yuan','late-chagatai':'chagatai','late-ilkhan':'ilkhanate','late-jochi':'goldenHorde'};
const reviewed=new Set(['mongol','yuan','chagatai','goldenHorde','ilkhanate']);
function geometry(id,y,raw){
 id=aliases[id]||id;if(!reviewed.has(id))return null;
 // Later break-up/replacement frames must keep their own dated reconstructions.
 if(id==='yuan'&&y>=1368||id==='chagatai'&&y>=1347||id==='ilkhanate'&&y>=1335||id==='goldenHorde'&&y>=1360)return null;
 if(id==='goldenHorde')return G.union([jochi]);
 if(id==='chagatai')return G.union([innerAsia,transoxiana]);
 if(id==='ilkhanate')return G.union([iran,...(y>=1258?[baghdad]:[])]);
 if(id==='mongol'){
  const pieces=raw.slice(1);
  return G.union([mongolia,...pieces,...(y>=1218?[innerAsia]:[]),...(y>=1227?[hexi]:[]),...(y>=1234?[northChina]:[]),...(y>=1242?[jochi]:[]),...(y>=1258?[iran,baghdad]:[])]);
 }
 const pieces=raw.slice(1);return G.union([mongolia,hexi,northChina,...pieces,...(y>=1279?[chinaSouth,hainan]:[])]);
}
module.exports={geometry,reviewed,aliases,cuts:[1218,1227,1234,1242,1258,1279,1335,1347,1360,1368]};
