// PaleoMIST ages are years before 1950, not before the visitor's current year.
const paleoTimeline=(()=>{
 const ordinal=y=>y<0?y+1:y;
 const historical=y=>y<=0?y-1:y;
 const fromBP=bp=>historical(1950-bp),toBP=y=>1950-ordinal(y);
 function frameIndex(y,frames){
  if(!Number.isInteger(y)||!y)return -1;
  const age=toBP(y);
  // All 33 published frames are usable. Years after 1950 use the final frame
  // only as an explicitly dated reference, never as a present-day survey.
  if(age>80000)return -1;
  let best=0;
  for(let i=1;i<frames.length;i++)if(Math.abs(frames[i].bp-age)<Math.abs(frames[best].bp-age))best=i;
  return best;
 }
 const coverage=y=>!Number.isInteger(y)||!y?'invalid':toBP(y)>80000?'unavailable':y>1950?'reference':'reconstruction';
 return {fromBP,toBP,frameIndex,coverage};
})();
if(typeof module!=='undefined')module.exports=paleoTimeline;
