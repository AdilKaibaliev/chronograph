'use strict';
const ref=require('./source-review-142.json');
module.exports=function(c,{source,revise,visibleAt,D,I}){
 source('sourceReview142','Office of the Geographer. International Boundary Study 64 (1978), pp. 15–16; National Museum of History of Moldova, Bessarabia in the 19th Century; Treaty of Berlin (1878), Article XLV; Administration du cadastre et de la topographie du Luxembourg, Limites d’État; Treaty of Zurich (1859), Article 3; CShapes 2.0 and CShapes-Europe; Natural Earth.',[
  'https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs064.pdf',
  'https://www.nationalmuseum.md/en/exhibitions/the_compartment_bessarabia_in_the_19th_century/',
  'https://sourcebooks.fordham.edu/Mod/1878berlin.asp',
  'https://act.public.lu/fr/parcelles-residences/mensuration-officielle/limites-etat.html',
  'https://archive.spectator.co.uk/article/3rd-december-1859/3/the-treaties-of-zurich',
  'https://icr.ethz.ch/data/cshapes/'
 ]);
 // These masks come from existing atlas overlaps and Natural Earth parts.
 // Dated external maps and documentary sources independently attribute them.
 // Remove a duplicate only where the attested neighbour already has a fill.
 for(const r of ref.rules){
  const runs=[];
  for(let y=r.from;y<r.to;y++){
   const cut=I(ref.shapes[r.shape],visibleAt(r.winner,y)),key=JSON.stringify(cut),last=runs.at(-1);
   if(last?.key===key)last.to=y+1;else runs.push({from:y,to:y+1,cut,key});
  }
  for(const {from,to,cut} of runs)if(cut.length)revise([r.loser],from,to,'source-confirmed-interior-142','sourceReview142',p=>I(p,cut).length?D(p,cut):p);
 }
};
