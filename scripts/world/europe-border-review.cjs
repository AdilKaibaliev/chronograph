'use strict';
const G=require('./cartography-geometry.cjs');
// Regional generalisation of the 1860 transfer. Tende / La Brigue and Geneva
// remain outside the transferred regions. See ALL_STATES_BORDER_REVIEW.md.
const savoy=[[5.62,45.5],[5.82,45.33],[6.25,45.1],[6.67,45.12],[7.08,45.21],[7.17,45.47],[6.98,45.83],[6.82,46.1],[6.89,46.41],[6.8,46.45],[6.35,46.39],[6.22,46.3],[6.23,46.14],[5.99,46.13],[5.82,46.01],[5.8,45.75]];
const nice=[[6.66,43.88],[6.9,43.8],[7.19,43.64],[7.39,43.71],[7.4,43.78],[7.43,43.89],[7.32,44.01],[7.29,44.16],[7.13,44.26],[6.99,44.26],[6.87,44.14]];
const provence=[[4.5,45.3],[5.65,46.05],[5.9,44.8],[6.8,44.35],[6.87,44.14],[6.66,43.88],[6.9,43.8],[7.19,43.64],[6.3,42.9],[5.2,42.9],[4,43.1]];
const liguria=[[7.39,43.71],[7.53,43.75],[7.78,43.86],[8.17,43.99],[8.5,44.27],[8.95,44.4],[9.45,44.2],[9.85,44.06],[10.05,44.15],[9.6,44.58],[9,44.75],[8.5,44.65],[8,44.25],[7.55,44.08]];
const emilia=[[8.7,44.2],[8.7,45.05],[10.6,45],[11.2,44.9],[12.1,44.8],[12.8,43.85],[12.4,43.3],[11.9,43.3],[11.1,44],[10.5,44.1],[9.7,44.2]];
const marcheAbruzzo=[[13.3,42.1],[14.05,42.1],[14.3,42.6],[13.9,42.95],[13.48,42.85],[13.2,42.5]];
module.exports=(a,y)=>{
 if(y<1849||y>=1919)return null;
 if(a.entry==='1914-italy')return G.difference(G.union([...a.polygons,liguria,...(y<1860?[savoy,nice]:[emilia,marcheAbruzzo])]),y<1860?[]:[savoy,nice]);
 if(a.entry==='late-france'){
  const p=G.merge([G.union(a.polygons),G.union([provence,...(y>=1860?[savoy,nice]:[])])]);
  return y<1860?G.difference(p,[savoy,nice]):p;
 }
 return null;
};
