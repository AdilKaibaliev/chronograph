// One continuous, fixed scale. Equal pixel distances can represent different eras.
const ancientTimeScale=(()=>{
 const anchors=[[-350000,0],[-100000,2200000],[-20000,4400000],[-7000,5800000],[1,7600000],[610,8300000],[1300,9100000],[2026,10000000]];
 // The BCE/CE seam uses ordinals: there is no publicly selectable year zero.
 const ordinalAnchors=anchors.map(([y,p])=>[y<0?y+1:y,p]);
 function toPosition(y){const o=y<0?y+1:y;let i=ordinalAnchors.findIndex(a=>a[0]>=o);if(i<0)i=ordinalAnchors.length-1;i=Math.max(1,i);const a=ordinalAnchors[i-1],b=ordinalAnchors[i];return Math.round(Math.max(0,Math.min(10000000,a[1]+(o-a[0])/(b[0]-a[0])*(b[1]-a[1]))));}
 function toYear(p){p=Math.max(0,Math.min(10000000,p));let i=ordinalAnchors.findIndex(a=>a[1]>=p);i=Math.max(1,i);const a=ordinalAnchors[i-1],b=ordinalAnchors[i],o=Math.round(a[0]+(p-a[1])/(b[1]-a[1])*(b[0]-a[0]));return o<=0?o-1:o;}
 return {anchors,min:-350000,max:2026,toPosition,toYear};
})();
if(typeof module!=='undefined')module.exports=ancientTimeScale;
