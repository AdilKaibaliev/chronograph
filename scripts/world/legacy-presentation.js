// In a succession year the atlas displays the new political frame. It must
// not also paint the preceding dynasty over the same land. Historical date
// labels retain the year of the transition; this is a rendering convention.
function legacyStateVisible(id,year){
 const end={earlyIslam:632,sasanian:651,rashidun:661,umayyad:750,franks:800,carolingian:843,eastFrancia:962,westFrancia:987,tang:907,fiveDynasties:960,tenKingdoms:979,liao:1125,northernSong:1127,fatimid:1171,nicaea:1261,latinEmpire:1261,samanid:999,qarakhanid:1212,greatSeljuk:1194,ghaznavid:1186,buyids:1062,turgesh:766,khwarazmian:1231};
 return end[id]===undefined||year<end[id];
}
if(typeof module!=='undefined')module.exports={legacyStateVisible};
