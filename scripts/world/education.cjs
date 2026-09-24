// Apply the researched regional additions after the original territorial catalogue.
module.exports=c=>{
 c=require('./education-core.cjs')(c);
 c=require('./education-africa.cjs')(c);
 c=require('./education-americas.cjs')(c);
 c=require('./education-oceanic.cjs')(c);
 return c;
};
