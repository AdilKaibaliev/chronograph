'use strict';
// Regional campaign snapshots, not provincial survey boundaries.
const G=require('./cartography-geometry.cjs');
const hami=[[91.8,41.2],[93,40.5],[96,39],[99,40],[98,41],[96,42],[94,44],[92.2,43.4]];
const north1876=[[80,43.4],[85,42.8],[87,43],[89,43.2],[91.3,42],[94,41],[96,39],[99,40],[100,42],[94,43],[90,46],[87,49],[85,47],[82,45.2]];
const khotan=[[77.5,36.7],[80,35.4],[86,35.5],[84,38],[79,38]];
module.exports=(year,xinjiang)=>{
 const parts=[];
 if(year>=1696)parts.push(hami);
 if(year===1876)parts.push(north1876);
 if(year===1877)return G.merge([G.union(parts),G.difference(G.union([xinjiang(year)]),[khotan])]);
 return G.union(parts);
};
module.exports.note=year=>year>=1696&&year<1755?
 'В 1696 году правитель Хами признаёт власть Цин. Этот восточный оазис показан отдельно от ещё не завоёванных Джунгарии и Таримского бассейна.|In 1696 the ruler of Hami acknowledges Qing authority. This eastern oasis is distinct from Dzungaria and the Tarim Basin, which have not yet been conquered.|1696-жылы Хаминин башкаруучусу Цин бийлигин тааныйт. Бул чыгыш оазиси али багындырылбаган Жуңгариядан жана Тарим ойдуңунан айырмаланып көрсөтүлөт.':year===1876?
 'В 1876 году цинская армия возвращает Урумчи и Манас. Южные оазисы ещё не заняты.|In 1876 Qing forces retake Urumqi and Manas. The southern oases have not yet been occupied.|1876-жылы Цин аскерлери Үрүмчү менен Манасты кайтарып алат. Түштүк оазистер али ээлене элек.':year===1877?
 'В 1877 году цинская армия занимает Турфан, Аксу, Яркенд и Кашгар. Хотан будет занят в январе 1878 года; Илийский край остаётся под российским управлением.|In 1877 Qing forces take Turfan, Aksu, Yarkand and Kashgar. Khotan falls in January 1878; the Ili region remains under Russian administration.|1877-жылы Цин аскерлери Турпанды, Аксууну, Жаркентти жана Кашкарды ээлейт. Хотан 1878-жылдын январында алынат; Или аймагы Россиянын башкаруусунда калат.':null;
