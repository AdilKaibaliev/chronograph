// PaleoMIST ages are years before 1950, not before the visitor's current year.
const paleoTimeline=(()=>{
 const ordinal=y=>y<0?y+1:y;
 const historical=y=>y<=0?y-1:y;
 const fromBP=bp=>historical(1950-bp),toBP=y=>1950-ordinal(y);
 function frameIndex(y,frames){
  if(!Number.isInteger(y)||!y)return -1;
  const age=toBP(y);
  // Do not extrapolate the oldest reconstruction or the 1950 ice sheet into
  // older prehistory / recent centuries. Later historical maps keep their base.
  if(age>80000||age<2500)return -1;
  let best=0;
  for(let i=1;i<frames.length;i++)if(Math.abs(frames[i].bp-age)<Math.abs(frames[best].bp-age))best=i;
  return best;
 }
 return {fromBP,toBP,frameIndex};
})();
if(typeof module!=='undefined')module.exports=paleoTimeline;
