'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const project=path.resolve(__dirname,'../..');
const review=require(path.join(project,'scripts/ancient/polity-review.cjs'));
if(!process.argv[2])throw Error('Provide the path to the upstream Cliopatria v0.2.1 polity GeoJSON.');
const input=fs.readFileSync(path.resolve(process.argv[2]));
const source=JSON.parse(input);const chosen=new Map(review.map(r=>[r.sourceName,r]));
const clip=require(path.join(project,'scripts/vendor/polygon-clipping.cjs'));
const records=[];
for(const f of source.features){
 const p=f.properties,r=p.Name==='Roman Empire'&&p.FromYear<-27?chosen.get('Roman Republic'):chosen.get(p.Name);if(!r||p.Type!=='POLITY'||p.FromYear>=610)continue;
 const from=Math.max(p.FromYear,r.from),to=Math.min(p.ToYear===0?-1:p.ToYear,r.to-1,609);
 if(from>to||from===0)continue;
 // Han is never allowed to coexist with Xin in 9–24. Labels do not redefine borders.
 const spans=r.id==='han'?[[from,Math.min(to,8)],[Math.max(from,25),to]]:[[from,to]];
 const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
 if(f.geometry.type!=='Polygon'&&f.geometry.type!=='MultiPolygon')throw Error(f.geometry.type);
 const geometry=polys.map(poly=>poly.map(ring=>ring.map(p=>p.map(n=>+n.toFixed(5)))));
 for(const [a,b]of spans)if(a<=b)records.push({id:r.id,from:a,to:b,sourceFrom:p.FromYear,sourceTo:p.ToYear,geometry});
}
// Correct dated control, not arbitrary paint-order collisions.
const bounds=poly=>poly[0].reduce((a,p)=>[Math.min(a[0],p[0]),Math.min(a[1],p[1]),Math.max(a[2],p[0]),Math.max(a[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);
const cyprus=records.find(r=>r.id==='ptolemaic'&&r.from<=-50&&r.to>=-50).geometry.filter(poly=>{const b=bounds(poly);return b[0]>32&&b[2]<35&&b[1]>34&&b[3]<36;});
if(cyprus.length!==1)throw Error('Expected one Cyprus outline');
function splitAt(id,dates){for(let i=records.length-1;i>=0;i--){const r=records[i];if(r.id!==id)continue;const points=[...new Set([r.from,...dates.filter(y=>y>r.from&&y<=r.to),r.to+1])].sort((a,b)=>a-b);if(points.length<3)continue;records.splice(i,1,...points.slice(0,-1).map((y,j)=>({...r,from:y,to:points[j+1]-1})));}}
function transfer(sourceName,from,to,id){
 const fragments=source.features.filter(f=>f.properties.Name===sourceName&&f.properties.Type==='POLITY'&&f.properties.FromYear<=to&&f.properties.ToYear>=from).map(f=>({from:Math.max(from,f.properties.FromYear),to:Math.min(to,f.properties.ToYear),geometry:f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates,sourceFrom:f.properties.FromYear,sourceTo:f.properties.ToYear}));
 splitAt(id,fragments.flatMap(p=>[p.from,p.to+1]));
 for(const p of fragments){const targets=records.filter(r=>r.id===id&&r.from>=p.from&&r.to<=p.to);if(!targets.length)records.push({...p,id,controlEvent:from});else for(const r of targets){r.geometry=clip.union(r.geometry,p.geometry);r.controlEvent=from;}}
}
// Correct the upstream snapshot lag at explicitly dated conquests.
transfer('Neo-Babylonian Empire',-539,-531,'achaemenid');
transfer('Twenty-sixth Dynasty of Egypt',-525,-501,'achaemenid');
// The upstream Ptolemaic label in Alexander's lifetime is anachronistic.
transfer('Ptolemaic Kingdom',-331,-324,'macedon');
transfer('Ptolemaic Kingdom',-323,-306,'ptolemaic-satrapy');
transfer('Ptolemaic Kingdom',-30,-28,'roman-republic');
// Frankish regional kingdoms remain distinct constituent areas, but share a
// single aggregate outline and the plural label used by the atlas.
transfer('Salian Franks',481,609,'franks');
transfer('Ripuarian Franks',481,609,'franks');
// Egypt changes allegiance in 332 BCE, one year before the source's next
// world snapshot. Use the existing Egyptian footprint, restricted to the
// Persian territory of that year; no guessed conquest line is drawn.
splitAt('achaemenid',[-332,-331]);splitAt('macedon',[-332,-331]);
const egyptBefore=source.features.find(f=>f.properties.Name==='Twenty-sixth Dynasty of Egypt'&&f.properties.FromYear===-530);
const egyptPolys=egyptBefore.geometry.type==='Polygon'?[egyptBefore.geometry.coordinates]:egyptBefore.geometry.coordinates;
const egyptMain=[egyptPolys.reduce((a,p)=>p[0].length>a[0].length?p:a)];
const persia332=records.find(r=>r.id==='achaemenid'&&r.from===-332),alexander332=records.find(r=>r.id==='macedon'&&r.from===-332);
if(!persia332||!alexander332)throw Error('Missing Egypt transition frame');
const egypt332=clip.intersection(persia332.geometry,egyptMain);persia332.geometry=clip.difference(persia332.geometry,egypt332);alexander332.geometry=clip.union(alexander332.geometry,egypt332);persia332.controlEvent=-332;alexander332.controlEvent=-332;
for(const id of ['ptolemaic','roman-republic'])splitAt(id,[-58,-48,-30]);
for(const r of records){
 if(r.id==='ptolemaic'&&r.from>=-58&&r.to<=-49)r.geometry=clip.difference(r.geometry,cyprus);
 if(r.id==='roman-republic'&&r.from>=-58&&r.to<=-49)r.geometry=clip.union(r.geometry,cyprus);
 if(r.id==='roman-republic'&&r.from>=-48&&r.to<=-31)r.geometry=clip.difference(r.geometry,cyprus);
}
const italy=[];
for(const r of records.filter(r=>r.id==='vandal')){const removed=r.geometry.filter(poly=>{const b=bounds(poly);return b[0]>11&&b[2]<15&&b[1]>40&&b[3]<44;});if(removed.length){italy.push({from:r.from,to:r.to,geometry:removed});r.geometry=r.geometry.filter(p=>!removed.includes(p));}}
splitAt('roman-west',italy.flatMap(r=>[r.from,r.to+1]));
for(const r of records.filter(r=>r.id==='roman-west'))for(const raid of italy)if(r.from>=raid.from&&r.to<=raid.to)r.geometry=clip.union(r.geometry,raid.geometry);
const corrections=[
 {id:'conquest-dates',years:[-539,-525,-332,-331,-323,-305,-30,-27],decision:'Corrected snapshot lag at the conquest of Babylon and Egypt; distinguished Alexander’s dominion, Ptolemy’s governorship, royal title and Roman annexation. Augustus’ title begins in 27 BCE.',sources:[{title:'The Metropolitan Museum of Art. Egypt, 1000 B.C.–1 A.D.; Iran, 1000 B.C.–1 A.D.',url:'https://www.metmuseum.org/toah/ht/04/afe.html'},{title:'British Museum. The Cyrus Cylinder.',url:'https://www.britishmuseum.org/collection/object/W_1880-0617-1941'}]},
 {id:'cyprus-58-48',years:[-58,-48],decision:'Cyprus assigned to Rome from 58 BCE; restored to Ptolemaic control around 48/47 BCE. Annual view uses 48 BCE. Removed double fill.',sources:[{title:'T. B. Mitford. Notes on Some Published Inscriptions of Roman Cyprus. Annual of the British School at Athens.',url:'https://www.cambridge.org/core/journals/annual-of-the-british-school-at-athens/article/abs/notes-on-some-published-inscriptions-of-roman-cyprus1/25FFC6A3A9F921ACDD23A971646A1795'},{title:'Cypriote Antiquities in Reading. Bryn Mawr Classical Review, 2016.04.42.',url:'https://bmcr.brynmawr.edu/2016/2016.04.42'}]},
 {id:'vandal-raids',years:[455,458],decision:'Removed Rome and Campania raid footprints from Vandal sovereign territory; retained in Roman western territory.',sources:[{title:'Ralph W. Mathisen. Majorian. De Imperatoribus Romanis.',url:'https://roman-emperors.sites.luc.edu/major.htm'},{title:'Thomas Hodgkin. Italy and Her Invaders, book III, chapter V.',url:'https://penelope.uchicago.edu/Thayer/E/Gazetteer/Places/Europe/Italy/_Texts/HODIHI/2d_edition/3/5%2A.html'}]}
];
// Preserve sub-pixel boundary uncertainty as a neutral shared band. Do not
// award a digitisation sliver to whichever state happens to paint last.
const signed=ring=>ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1]},0)/2;
const area=g=>g.reduce((s,p)=>s+Math.abs(signed(p[0]))-p.slice(1).reduce((a,r)=>a+Math.abs(signed(r)),0),0);
const seams=[];
for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
 const a=records[i],b=records[j],from=Math.max(a.from,b.from),to=Math.min(a.to,b.to);if(a.id===b.id||from>to)continue;
 const overlap=clip.intersection(a.geometry,b.geometry),size=area(overlap);if(size<=1e-7)continue;
 if(size>0.01)throw Error('Substantive control conflict: '+a.id+' / '+b.id+' '+from);
 seams.push({from,to,a:a.id,b:b.id,geometry:overlap});
}
for(const r of review)splitAt(r.id,seams.filter(s=>s.a===r.id||s.b===r.id).flatMap(s=>[s.from,s.to+1]));
for(const r of records)for(const s of seams)if((s.a===r.id||s.b===r.id)&&r.from>=s.from&&r.to<=s.to)r.geometry=clip.difference(r.geometry,s.geometry);
function inside(ring,p){let v=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])v=!v;}return v;}
function anchor(g){const p=g.reduce((a,p)=>Math.abs(signed(p[0]))>Math.abs(signed(a[0]))?p:a);const b=bounds(p);let best=null,bestScore=-1;for(let x=1;x<12;x++)for(let y=1;y<12;y++){const q=[b[0]+(b[2]-b[0])*x/12,b[1]+(b[3]-b[1])*y/12];if(!inside(p[0],q)||p.slice(1).some(r=>inside(r,q)))continue;const score=Math.min(...p[0].map(v=>(v[0]-q[0])**2+(v[1]-q[1])**2));if(score>bestScore){best=q;bestScore=score;}}return best||p[0][0];}
for(const r of records){r.anchor=anchor(r.geometry);r.areaDegrees=area(r.geometry);}
const output={schema:1,status:'reviewed-selected-reconstruction',releaseReady:true,source:{title:'Bennett, Mutch, Tollefson et al. Cliopatria. Scientific Data 12, 247 (2025). Seshat Global History Databank, v0.2.1.',url:'https://github.com/Seshat-Global-History-Databank/cliopatria',doi:'10.1038/s41597-025-04516-9',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',sha256:crypto.createHash('sha256').update(input).digest('hex'),changes:'Selected entities; chronological bounds checked against referenced chronologies; rounded coordinates to five decimals. No new sovereign boundaries inferred.'},entities:review,records};
output.corrections=corrections;
output.corrections.push({id:'nabataea-review',note:'Nabataean geometry is available from 164 BCE, not an asserted foundation date. End independent control before Roman annexation in 106 CE. Petra is tested on both sides of this transition.',sources:[{title:'Petra Museum. Gallery 7: Waning of Petra. Annexation in 106 CE.',url:'https://www.petramuseum.jo/en-us/exhibitions/waning-of-petra/'},{title:'UNESCO. Petra. Statement of Outstanding Universal Value.',url:'https://whc.unesco.org/en/list/326/'}]});
output.cartographicSeams=seams;
fs.writeFileSync(path.join(project,'research/ancient-boundaries.json.gz'),require('node:zlib').gzipSync(Buffer.from(JSON.stringify(output)),{level:9}));
console.log(JSON.stringify({entities:review.length,records:records.length,bytes:Buffer.byteLength(JSON.stringify(output))}));
