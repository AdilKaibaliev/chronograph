'use strict';
module.exports=c=>{
 const H=require('./late-helpers.cjs')(c,{start:1454,max:1600});
 for(const file of ['early-eurasia','early-africa','early-americas','early-oceanic'])require('./'+file+'.cjs')(c,H);
 c.range={min:610,max:1600};
 return c;
};
