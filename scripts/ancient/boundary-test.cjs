'use strict';
const fs=require('node:fs'),path=require('node:path');
const project=path.resolve(__dirname,'../..'),data=require('./load-boundaries.cjs');
const clip=require(path.join(project,'scripts/vendor/polygon-clipping.cjs'));
const signed=r=>r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1]},0)/2;
const area=g=>g.reduce((s,p)=>s+Math.abs(signed(p[0]))-p.slice(1).reduce((a,r)=>a+Math.abs(signed(r)),0),0);
const years=[...new Set([-3400,609,...data.records.flatMap(r=>[r.from,r.to])])].sort((a,b)=>a-b);
const cache=new Map(),overlaps=[],invalid=[];let pairs=0;
for(const [i,r]of data.records.entries()){
 r._index=i;r._bounds=[Infinity,Infinity,-Infinity,-Infinity];
 for(const p of r.geometry.flat(2)){if(!p.every(Number.isFinite)||Math.abs(p[0])>180||Math.abs(p[1])>90)throw Error('Coordinate '+r.id);r._bounds=[Math.min(r._bounds[0],p[0]),Math.min(r._bounds[1],p[1]),Math.max(r._bounds[2],p[0]),Math.max(r._bounds[3],p[1])];}
 try{const normal=clip.union(r.geometry);if(!normal.length)throw Error('Empty');}catch(e){invalid.push({id:r.id,from:r.from,message:e.message});}
}
for(const year of years){
 const active=data.records.filter(r=>r.from<=year&&year<=r.to);
 for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
  const a=active[i],b=active[j];if(a.id===b.id)continue;const x=a._bounds,y=b._bounds;
  if(x[0]>=y[2]||x[2]<=y[0]||x[1]>=y[3]||x[3]<=y[1])continue;
  const key=[a._index,b._index].sort((a,b)=>a-b).join(':');if(cache.has(key))continue;pairs++;
  try{const intersection=clip.intersection(a.geometry,b.geometry);const size=area(intersection);cache.set(key,size);if(size>1e-7)overlaps.push({year,a:a.id,b:b.id,areaDegrees:size,aFrom:a.from,bFrom:b.from});}catch(e){invalid.push({year,a:a.id,b:b.id,message:e.message});}
 }
}
overlaps.sort((a,b)=>b.areaDegrees-a.areaDegrees);
const report={source:data.source,frames:years.length,entities:data.entities.length,geometryRecords:data.records.length,pairs,invalid,overlaps};
const assert=require('node:assert/strict');
function inside(ring,[x,y]){let b=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],p=ring[j];if((a[1]>y)!==(p[1]>y)&&x<(p[0]-a[0])*(y-a[1])/(p[1]-a[1])+a[0])b=!b;}return b;}
const contains=(id,year,point)=>data.records.some(r=>r.id===id&&r.from<=year&&year<=r.to&&r.geometry.some(p=>inside(p[0],point)&&!p.slice(1).some(h=>inside(h,point))));
for(const [year,owner,other]of [[-59,'ptolemaic','roman-republic'],[-58,'roman-republic','ptolemaic'],[-49,'roman-republic','ptolemaic'],[-48,'ptolemaic','roman-republic'],[-31,'ptolemaic','roman-republic'],[-30,'roman-republic','ptolemaic'],[-27,'roman-empire','ptolemaic']]){assert(contains(owner,year,[33,35]),'Cyprus '+year+' '+owner);assert(!contains(other,year,[33,35]));}
for(const [year,point]of [[455,[12.5,41.9]],[458,[14,41.1]],[462,[14,41.1]]]){assert(contains('roman-west',year,point));assert(!contains('vandal',year,point));}
assert(!data.entities.some(e=>/Kyrgyz|Great Yuan/.test(e.sourceName)),'No unsupported early Kyrgyz polygon or mislabeled Dayuan');
for(const y of [-164,-100,-1,1,50,105])assert(contains('nabataea',y,[35.444,30.328]),'Nabataean Petra '+y);
for(let y=-27;y<=-19;y++){assert(contains('nabataea',y,[35.444,30.328]),'Nabataea must not vanish '+y);assert(!contains('roman-empire',y,[35.444,30.328]),'No Roman annexation in '+y);}
for(let y=5;y<=8;y++)for(const p of [[108.9,34.3],[112.45,34.62]])assert(contains('han',y,p),'Han regency city '+y+' '+p);
for(const p of [[108.9,34.3],[112.45,34.62]]){assert(contains('xin',9,p),'Xin succession '+p);assert(!contains('han',9,p),'No Han/Xin double control');}
assert(!data.records.some(r=>r.id==='nabataea'&&(r.from<-164||r.to>=106)),'Do not backdate the first available frame or extend beyond Roman annexation');
assert(contains('roman-empire',106,[35.444,30.328]),'Petra must pass to Rome in 106');
for(const r of data.records){assert(r.from!==0&&r.to!==0&&r.from<=r.to);assert(r.to<610);assert(data.entities.find(e=>e.id===r.id).title.length===3);}
assert(!data.records.some(r=>r.id==='shang'&&r.to>=-1046));assert(!data.records.some(r=>r.id==='xin'&&r.from<9));
assert.equal(invalid.length,0);assert.equal(overlaps.length,0);
// Qin's title begins in 221; its reconstruction must contain the conquered capitals.
for(const p of [[114.49,36.61],[114.31,34.80],[118.30,36.82],[108.72,34.35],[113.74,34.40],[116.4,39.9]])assert(contains('qin',-221,p),'Qin unification '+p);
assert(!data.entities.some(e=>['wei-state','han-state','yan-state'].includes(e.id)),'Rejected source polygons must not return');
for(const y of [-206,-205,-204,-203]){assert(contains('han',y,[107.0,33.07]),'Han Hanzhong '+y);assert(contains('western-chu',y,[117.19,34.26]),'Western Chu Pengcheng '+y);}
fs.writeFileSync(path.join(project,'verification-ancient-boundaries.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:true,frames:years.length,records:data.records.length,pairs,invalid:0,overlaps:0}));
