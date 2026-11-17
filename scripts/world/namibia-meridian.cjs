'use strict';
const G=require('./cartography-geometry.cjs');
// Article III(2), Anglo-German Agreement of 1 July 1890: the boundary
// turns east on 22S from 20E to 21E, then north on 21E to 18S.
// This is a treaty-defined meridian segment, not decorative smoothing.
// Caprivi, the Kunene frontier and Walvis Bay require separate evidence.
module.exports=function({source,revise}){
 const id='namibiaMeridian1890';
 source(id,'Anglo-German Agreement, 1 July 1890, Article III(2), reproduced in International Court of Justice, Kasikili/Sedudu Island (Botswana/Namibia), Judgment of 13 December 1999. Office of the Geographer, International Boundary Studies 120 and 125.',[
  'https://legal.un.org/icjsummaries/documents/english/st_leg_serf1_add2.pdf',
  'https://api.icj-cij.org/sites/default/files/case-related/98/098-19991213-JUD-01-00-EN.pdf',
  'https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs120.pdf',
  'https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs125.pdf'
 ]);
 const strip=G.union([[[20,-22],[21,-22],[21,-18],[20,-18]]]);
 // Correct the selectable territory and its pre-1915 German imperial union.
 // Later occupation/mandate layers remain separately displayed: adding a
 // strip to Britain or South Africa would create a false detached province.
 // Retain existing occupation/administration/dependency relationships.
 for(const [owner,from,to] of [
  ['1914-namibia',1890,1946],['late-hre',1890,1915]
 ])revise([owner],from,to,'namibia-treaty-meridian-step',id,p=>G.merge([p,strip]));
};
