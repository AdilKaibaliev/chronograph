// PaleoMIST ages are years before 1950, not before the visitor's current year.
const paleoTimeline=(()=>{
 const ordinal=y=>y<0?y+1:y;
 const historical=y=>y<=0?y-1:y;
 const fromBP=bp=>historical(1950-bp),toBP=y=>1950-ordinal(y);
 function frameIndex(y,frames){
  if(!Number.isInteger(y)||!y)return -1;
  const age=toBP(y);
  if(!frames.length||age>frames[0].bp)return -1;
  // Descending dated frames. At an exact midpoint retain the older frame.
  let lo=0,hi=frames.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(frames[mid].bp>age)lo=mid+1;else hi=mid;}
  return lo>0&&Math.abs(frames[lo-1].bp-age)<=Math.abs(frames[lo].bp-age)?lo-1:lo;
 }
 const coverage=y=>!Number.isInteger(y)||!y?'invalid':toBP(y)>352000?'unavailable':y>1950?'reference':'reconstruction';
 return {fromBP,toBP,frameIndex,coverage};
})();
if(typeof module!=='undefined')module.exports=paleoTimeline;
