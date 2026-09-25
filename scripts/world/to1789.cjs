'use strict';
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1601,max:1789});
 for(const file of ['to1789-eurasia','to1789-europe','to1789-africa','to1789-americas','to1789-oceanic'])require('./'+file+'.cjs')(c,H);
 for(const a of c.areas.filter(a=>a.from>=1601)){
  if(a.entry==='early-bukhara'&&a.from>=1747)a.name=a.from>=1785?['Бухарский эмират','Emirate of Bukhara','Бухара эмирлиги']:['Бухара · мангытские правители','Bukhara · Manghit rulers','Бухара · маңгыт башкаруучулары'];
  if(a.entry==='angkor')a.name=['Кхмерское королевство','Khmer kingdom','Кхмер падышалыгы'];
  if(a.entry==='early-johor')a.name=['Джохор-Риау','Johor-Riau','Жохор-Риау'];
  if(a.entry==='early-manila'&&a.from===1762)a.name=['Манила · британская оккупация','Manila · British occupation','Манила · британ оккупациясы'];
 }
 // Use names of the selected period in cards and markers as well as polygons.
 for(const entry of c.entries)for(const phase of entry.phases.filter(p=>p.from>=1601)){
  const area=c.areas.find(a=>a.entry===entry.id&&a.from<=phase.from&&phase.from<a.to);
  if(area){phase.name=area.name;if(area.kind==='cultural'&&['state','culture'].includes(entry.kind))phase.kind='community';}
 }
 c.range={min:610,max:1789};
 return c;
};
