'use strict';
// Project an expanded catalogue into the date window covered by an archived release.
// New content is tested independently; every earlier record remains in the comparison.
module.exports=(list,key,end=1946)=>{list=require('./arctic-baseline.cjs')(list,key,end);return key==='entries'?list.map(e=>({...e,phases:e.phases.filter(p=>p.from<end)})).filter(e=>e.phases.length):list.filter(r=>r.from<end);};
