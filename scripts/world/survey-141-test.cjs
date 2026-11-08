'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),clip=require('../vendor/polygon-clipping.cjs');
const html=fs.readFileSync('index.html','utf8'),read=k=>JSON.parse(html.match(new RegExp('const '+k+'=([^\\n]+);'))[1]),c=read('WORLD_HISTORY'),es=read('EMPIRES'),l=read('LEGACY_CARTOGRAPHY'),h=require('./core.js').createWorldHistory(c);
const ev=c.boundaryEvidence,legacyVisible=require('./legacy-presentation.js').legacyStateVisible,states=require('./states-141.cjs'),registered=require('./locations-141.json'),reference=require('./frontiers-141-reviewed.json');
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id),area=m=>Math.abs(m.flat().reduce((s,r)=>s+G.signed(r),0));
function early(id,y){const e=es.find(e=>e.id===id),f=l.frames[id]?.filter(f=>f[0]<=y).at(-1);return e&&e.from<=y&&y<=e.to&&f?l.shapes[f[1]]:[];}
let controls=0;
function point(id,y,pt,expected=true,legacy=false){
 const p=legacy?early(id,y):at(id,y)?.polygons||[];
 assert.equal(G.covers(p,pt),expected,id+' '+y+' '+pt);controls++;
}
for(const [iso,city,pt,id] of registered){
 const owners=h.mapAreasAt(2026).filter(a=>!a.sovereign&&!a.overlord&&!a.cartographicOverlay&&['polity','influence'].includes(a.kind)&&G.covers(a.polygons,pt)).map(a=>a.entry);
 assert.deepEqual(owners,[id],iso+' '+city);point(id,2026,pt);
}
for(const s of states){assert(h.get(s.id,s.from));point(s.id,s.from,s.coord);point(s.id,2026,s.coord);}
for(const y of [1190,1195,1231,1232,1236,1256,1257]){
 point('abbasidIraq',y,[44.36,33.31],true,true);point('abbasidIraq',y,[47.82,30.50],true,true);
 point('abbasidIraq',y,[43.68,34.60],y<1257,true);point('abbasidIraq',y,[44.01,36.19],y>=1232,true);
 point('ayyubid',y,[44.36,33.31],false,true);point('mongol',y,[44.01,36.19],false,true);
}
point('survey141-erbil',1190,[44.01,36.19]);point('ilkhanate',1257,[43.68,34.60],true,true);
for(const y of [1278,1299])point('franceMedieval',y,[1.52,42.51],false,true);
for(const y of [1300,1312,1349,1453,1600,2026]){point('survey141-and',y,[1.52,42.51]);point('late-france',y,[1.52,42.51],false);}
for(const y of [1959,1960,2010,2011,2026]){
 point('1960-congo-brazzaville',y,[15.28,-4.25]);point('1914-congo',y,[15.28,-4.25],false);point('1914-congo',y,[15.31,-4.32]);
}
for(const y of [1523,1657,1658,1700,2010,2026]){
 point('early-denmark-norway',y,[12.57,55.68]);point('early-sweden',y,[12.57,55.68],false);
 point('early-denmark-norway',y,[13.00,55.61],y<1658);point('early-sweden',y,[13.00,55.61],y>=1658);
}
for(const y of [1933,1953,1979,2009,2010,2011,2026]){point('early-denmark-norway',y,[-51.72,64.18]);assert.equal(at('1789-greenland-posts',y).sovereign,'early-denmark-norway');}
for(const [y,id,pt] of [[1630,'1789-dutch-brazil',[-34.88,-8.05]],[1654,'early-portuguese-brazil',[-34.88,-8.05]],[1848,'1789-chile',[-70.917,-53.163]],[1901,'1914-australian-colonies',[151.209,-33.869]],[1901,'1914-australian-colonies',[147.327,-42.882]],[1901,'1914-australian-colonies',[130.841,-12.463]],[1968,'survey141-nru',[166.920,-.547]],[1994,'palau',[134.624,7.501]],[2011,'2026-south-sudan',[31.58,4.85]]])point(id,y,pt);
for(const [owner,id,y] of [['early-austria','early-milan',1816],['early-austria','early-venice',1865],['early-milan','early-venice',1806],['late-france','early-netherlands',1800],['early-dutch','early-netherlands',1825],['1789-great-britain','1914-transvaal',1878]])assert.equal(at(id,y).sovereign,owner,id+' '+y);
assert(!at('early-venice',1848).sovereign);assert(!at('early-netherlands',1831).sovereign);
for(const [id,y] of [['survey141-erbil-transfer',1232],['survey141-brazzaville',1960]])assert(c.mapComparisons[id].frames.some(f=>f[0]===y)&&h.record(id)?.year===y);
for(const r of reference.rules){
 for(const y of new Set([r.from,r.to-1])){const a=at(r.winner,y),b=at(r.loser,y);if(!a||!b)continue;
  const left=area(clip.intersection(G.multi(a.polygons),G.multi(b.polygons),G.multi(reference.shapes[r.shape])));
  assert(left<.00002,'Sourced correction still double-filled '+y+' '+r.winner+'/'+r.loser+' '+left);
 }
}
// Verify SVG cuts with a different overlay engine from the one that built
// them. A unit on the integer grid is 1e-7 degree (roughly a centimetre).
const Clipper=require('../vendor/clipper.cjs'),scale=1e7;
const intRings=p=>p.map(r=>r.map(([x,y])=>({X:Math.round(x*scale),Y:Math.round(y*scale)})));
const intArea=p=>Math.abs(p.reduce((n,r)=>n+Clipper.Clipper.Area(r),0))/(scale*scale);
function overlay(op,left,right){
 if(!left.length&&!right.length)return [];
 const engine=new Clipper.Clipper(),solution=[];
 engine.AddPaths(left,Clipper.PolyType.ptSubject,true);engine.AddPaths(right,Clipper.PolyType.ptClip,true);
 assert(engine.Execute(Clipper.ClipType[op],solution,Clipper.PolyFillType.pftNonZero,Clipper.PolyFillType.pftEvenOdd),'Independent overlay failed: '+op);
 return solution;
}
const visible=new Map(),rawIds=new WeakMap();let seq=0;
function geometry(p,cut){
 if(!rawIds.has(p))rawIds.set(p,seq++);const key=rawIds.get(p)+'/'+(cut??'-');if(visible.has(key))return visible.get(key);
 const original=intRings(p),mask=cut===undefined?null:intRings(ev.shapes[cut]);
 if(mask)assert(intArea(overlay('ctDifference',mask,original))<.00001,'Clip extended beyond the diagnosed reconstruction '+key);
 const m=mask?overlay('ctDifference',original,mask):original,b=[Infinity,Infinity,-Infinity,-Infinity];
 for(const r of m)for(const {X,Y} of r){b[0]=Math.min(X,b[0]);b[1]=Math.min(Y,b[1]);b[2]=Math.max(X,b[2]);b[3]=Math.max(Y,b[3]);}
 if(mask)assert(intArea(overlay('ctXor',original,overlay('ctUnion',m,mask)))<.00002,'Land lost outside the shared portion '+key);
 const geo={key,b,m};visible.set(key,geo);return geo;
}
const mongol=new Set(['mongol','yuan','chagatai','goldenHorde','ilkhanate','mongolSiberia','mongolTibet','mongolKorea','rusTribute']);
const seen=new Set(),signatures=new Set(),families=new Set();let yearsWithZones=0,modeYears=0,largestRemaining=0;
for(let y=610;y<=2026;y++){
 const actual=h.mapAreasAt(y),independent=actual.filter(a=>['polity','influence'].includes(a.kind)&&!a.sovereign&&!a.overlord&&!a.cartographicOverlay).map(a=>({id:a.entry,p:a.polygons,member:!!a.mongolGroup}));
 if(y<1300)for(const e of es){if(e.from>y||e.to<y||!legacyVisible(e.id,y))continue;
  const f=e.keyframes.filter(f=>f.year<=y).at(-1);if(!f||f.hidden||f.legacyContext||['influence','population','reference'].includes(f.type||e.type))continue;
  independent.push({id:e.id,p:early(e.id,y),member:mongol.has(e.id)});
 }
 let withZones=false;
 for(const mode of ['detailed','unified']){
  modeYears++;const index=ev.timeline[mode].filter(f=>f[0]<=y).at(-1)[1],frame=ev.frames[index];withZones ||= !!frame.zones.length;
  let rows=independent;
  if(mode==='unified'&&y<1300&&rows.some(v=>mongol.has(v.id))){const id=l.frames.mongolRealm.filter(f=>f[0]<=y).at(-1)?.[1];if(id!==undefined&&l.shapes[id].length)rows=rows.filter(r=>!mongol.has(r.id)).concat({id:'mongolRealm',p:l.shapes[id],member:true});}
  if(mode==='unified'&&y>=1300&&actual.filter(a=>a.mongolGroup).length===4){const part=actual.find(a=>a.entry==='late-yuan');if(part?.mongolUnion?.length)rows=rows.filter(r=>!r.member).concat({id:'worldMongolRealm',p:part.mongolUnion,member:true});}
  const ids=new Set(rows.map(r=>r.id));for(const [a,b,k] of frame.zones){assert(ids.has(a)&&ids.has(b)&&ev.shapes[k]?.length);assert(frame.paint[a]!==undefined&&frame.paint[b]!==undefined);families.add([a,b].sort().join('/'));}
  const cur=rows.map(r=>({...r,g:geometry(r.p,frame.paint[r.id])})).sort((a,b)=>a.g.b[0]-b.g.b[0]);
  const sig=cur.map(r=>r.id+':'+r.g.key).join('|');if(signatures.has(sig))continue;signatures.add(sig);
  for(let i=0;i<cur.length;i++){const a=cur[i];for(let j=i+1;j<cur.length;j++){const b=cur[j];if(b.g.b[0]>=a.g.b[2])break;if(a.member&&b.member||b.g.b[1]>=a.g.b[3]||a.g.b[1]>=b.g.b[3])continue;
   const k=[a.g.key,b.g.key].sort().join('|');if(seen.has(k))continue;seen.add(k);
   const remaining=intArea(overlay('ctIntersection',a.g.m,b.g.m));largestRemaining=Math.max(largestRemaining,remaining);
   assert(remaining<=ev.tolerance+.0000001,'Visible double fill '+y+' '+mode+' '+a.id+'/'+b.id+' '+remaining);
  }}
 }
 if(withZones)yearsWithZones++;
}
const report={pass:true,years:1417,modeYears,distinctVisiblePairs:seen.size,visibleOverlapThreshold:ev.tolerance,visiblePairsAboveThreshold:0,largestRemaining,rawFamiliesMarked:families.size,yearsWithMarkedAreas:yearsWithZones,newProfiles:states.length,referencePlaceChecks:registered.length,pointAndYearChecks:controls,referenceRules:reference.rules.length,referenceFamilies:new Set(reference.rules.map(r=>[r.winner,r.loser].sort().join('/'))).size};
fs.writeFileSync('verification-141-visual-frontiers.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));

