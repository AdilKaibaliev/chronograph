'use strict';
module.exports=c=>{
  const H=require('./late-helpers.cjs')(c);
  for(const file of ['late-eurasia','late-africa','late-americas','late-oceanic'])require('./'+file+'.cjs')(c,H);
  c.range={min:610,max:1453};
  return c;
};
