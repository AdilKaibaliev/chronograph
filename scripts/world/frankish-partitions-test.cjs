'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),sourceMode=process.env.CHECK_FRANKISH_SOURCE==='1';
const compiled=sourceMode?F.compiler(require('./continuity.cjs').legacyData()):null;
const es=sourceMode?compiled.empires:JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const c=sourceMode?require('./published-catalog.cjs'):JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c),visible=require('./legacy-presentation.js').legacyStateVisible;
const ids=['westFrancia','eastFrancia','review-middle-francia','review-lotharingia','review-provence','review-italy','review-upper-burgundy','review-lower-burgundy','review-burgundy'];
function shape(id,y){
 if(id.startsWith('review-')){const p=h.mapAreasAt(y).find(a=>a.entry===id)?.polygons||[];return sourceMode?require('./coast-geometry.cjs')(p):p;}
 const e=es.find(e=>e.id===id);if(!e||y<e.from||y>e.to||!visible(id,y))return[];
 return sourceMode?require('./coast-geometry.cjs')(compiled.shape(id,y)):l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]];
}
// Settlement coordinates and political affiliations are independent source
// controls, not vertices copied from the geometry being tested.
const sites={cambrai:[3.23,50.18],paris:[2.35,48.86],reims:[4.03,49.26],dijon:[5.04,47.32],aachen:[6.08,50.78],metz:[6.18,49.12],strasbourg:[7.75,48.58],utrecht:[5.12,52.09],mainz:[8.27,50],worms:[8.36,49.63],speyer:[8.44,49.32],zurich:[8.54,47.38],chur:[9.53,46.85],basel:[7.59,47.56],geneva:[6.14,46.2],besancon:[6.02,47.24],lyon:[4.84,45.76],vienne:[4.87,45.52],arles:[4.63,43.68],pavia:[9.16,45.18],munich:[11.58,48.14],rome:[12.5,41.9],lausanne:[6.63,46.52]};
const controls=[];
function owner(y,id,places){for(const name of places)for(const other of ids){if(y>=951&&other==='review-italy'&&id==='eastFrancia')continue;controls.push([other,y,name,other===id]);}}
for(const y of [843,854]){
 owner(y,'westFrancia',['paris','reims','dijon']);
 owner(y,'eastFrancia',['mainz','worms','speyer','zurich','chur','munich']);
 owner(y,'review-middle-francia',['aachen','metz','strasbourg','utrecht','basel','geneva','besancon','lyon','vienne','arles','pavia']);
}
owner(855,'review-lotharingia',['aachen','metz','strasbourg','utrecht','basel','geneva','besancon']);
owner(855,'review-provence',['lyon','vienne','arles']);owner(855,'review-italy',['pavia']);
owner(859,'review-italy',['lausanne','pavia']);
owner(863,'review-lotharingia',['lyon','vienne']);owner(863,'review-italy',['arles','pavia']);
owner(870,'eastFrancia',['aachen','metz','strasbourg','basel']);owner(870,'westFrancia',['cambrai','lyon','vienne']);
owner(880,'eastFrancia',['aachen','metz','strasbourg','utrecht']);
owner(888,'review-upper-burgundy',['geneva','besancon','basel']);owner(888,'review-lower-burgundy',['lyon','vienne','arles']);
owner(911,'westFrancia',['aachen','metz','utrecht']);owner(911,'eastFrancia',['strasbourg','mainz','chur']);
owner(925,'eastFrancia',['aachen','metz','utrecht','strasbourg']);owner(925,'westFrancia',['paris','reims','dijon']);
owner(933,'review-burgundy',['geneva','besancon','lyon','arles']);
owner(950,'review-italy',['pavia']);owner(951,'eastFrancia',['pavia']);
for(const[id,y,city,want]of controls)assert.equal(G.covers(shape(id,y),sites[city]),want,`${id}/${y}/${city}`);
// Neither Roman imperial titles nor Italy's crown annex the papal city.
for(const y of [843,855,870,951])assert(!G.covers(shape(y<855?'review-middle-francia':y<951?'review-italy':'eastFrancia',y),sites.rome));
const area=p=>Math.abs(p.reduce((s,r)=>s+G.signed(r),0)),seen=new Set();let edges=0;
for(let y=843;y<962;y++){
 const rows=ids.filter(id=>!(id==='review-italy'&&y>=951)).map(id=>[id,shape(id,y)]).filter(([,p])=>p.length);
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const [a,A]=rows[i],[b,B]=rows[j],key=a+b+JSON.stringify([A,B]);if(seen.has(key))continue;seen.add(key);
  assert(area(F.I(A,B))<.0001,`Overlapping political fills ${a}/${b}/${y}`);edges++;
 }
}
// The 855 partition redistributes Middle Francia, without erasing its land.
const before=shape('review-middle-francia',854),after=G.merge(['review-lotharingia','review-provence','review-italy'].map(id=>shape(id,855)));
assert(area(F.D(before,after))+area(F.D(after,before))<1e-6,'Land lost at 855');
const beforeB=G.merge(['review-upper-burgundy','review-lower-burgundy'].map(id=>shape(id,932))),afterB=shape('review-burgundy',933);
assert(area(F.D(beforeB,afterB))+area(F.D(afterB,beforeB))<1e-6,'Burgundy source transition');
assert(!shape('review-middle-francia',855).length);assert(!shape('review-lotharingia',870).length);assert(!shape('review-provence',863).length);assert(!shape('review-italy',962).length);
const italy=h.mapAreasAt(951).find(a=>a.entry==='review-italy');assert(italy.legacyOverlord&&!italy.politicalOutline);assert(area(F.D(italy.polygons,shape('eastFrancia',951)))<1e-6);
for(const id of ['westFrancia','eastFrancia'])for(const y of [843,870,880,911,925,933])for(const p of [[-.14,50.82],[1.31,51.13]])assert(!G.covers(shape(id,y),p),'Continental realm painted in England');
const tr=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));
for(const row of require('./frankish-partitions.cjs').messages)for(const lang of ['en','ky'])assert.equal(tr(row[0],lang),row[lang==='en'?1:2]);
for(const y of c.frankishPartitions.years){const e=h.record('frankish-partition-'+y);assert(e&&e.year===y&&e.sources.every(s=>c.sources[s]));}
assert.deepEqual(F.prepare(es),es);
console.log(JSON.stringify({pass:true,settlementControls:controls.length,distinctSharedEdges:edges,years:119,events:c.frankishPartitions.years.length,checks:'Verdun, Prüm, Transjurania, Meerssen, Ribemont, Burgundy, Lotharingian allegiance, Italian crown, translations, conservation of mapped land'}));
