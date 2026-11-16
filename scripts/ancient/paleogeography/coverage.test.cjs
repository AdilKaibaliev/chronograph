'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),d=require('./load.cjs'),t=require('./timeline.js'),guide=require('./catalog.cjs');
const root=path.resolve(__dirname,'../../..'),olderRoot=path.join(root,'research/paleogeography-older');
const manifest=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(olderRoot,'manifest.json.gz'))));
assert.equal(d.frames.length,305);assert.equal(manifest.frames.length,272);
for(const source of [d.source,d.olderSource]){assert.equal(source.license,'CC BY 4.0');assert.equal(source.bpReference,1950);}
assert.equal(d.source.spatialDegrees,.25);assert.equal(d.olderSource.spatialDegrees,.5);assert.equal(d.olderSource.stepYears,1000);
assert.equal(d.processing.temporalInterpolation,false);assert.equal(d.olderProcessing.temporalInterpolation,false);assert.deepEqual(d.olderProcessing.availableBP,[81000,352000]);
assert.equal(d.olderSource.sha256,'722f7d964fb1b947563a0974026b7f8a289875393f5e52f9af6b46972f50d8d3');
for(let y=-350000;y<=2026;y++)if(y){assert.equal(t.fromBP(t.toBP(y)),y);const i=t.frameIndex(y,d.frames);assert(i>=0);const delta=Math.abs(d.frames[i].bp-t.toBP(y));assert(delta<=(d.frames[i].source==='krapp2021'?500:1250));assert(!d.frames.some(f=>Math.abs(f.bp-t.toBP(y))<delta));assert.equal(t.coverage(y),y>1950?'reference':'reconstruction');}
const frameAtYear=y=>d.frames[t.frameIndex(y,d.frames)];
assert.equal(frameAtYear(-350000).bp,352000);assert.equal(frameAtYear(t.fromBP(80500)).bp,81000);assert.equal(frameAtYear(t.fromBP(80499)).bp,80000);
for(const y of [-78052,-78051,-551,-550,-201,-1,1,609,610,700,701,1949,1950,1951,2026])assert(t.frameIndex(y,d.frames)>=0,'Missing physical base '+y);
assert.equal(frameAtYear(2026).year,1950);assert.equal(t.coverage(2026),'reference','Do not present the 1950 reference as a 2026 survey');
for(const invalid of [0,NaN,Infinity,1.5])assert.equal(t.frameIndex(invalid,d.frames),-1);
assert.equal(t.frameIndex(-350052,d.frames),-1);assert.equal(t.fromBP(20000),-18051);assert.equal(t.fromBP(2500),-551);
const at=bp=>d.frames.find(f=>f.bp===bp),snapshots=new Set(),olderHashes=new Set();let rings=0,lastBP=Infinity;
for(const meta of d.frames){
 assert(meta.bp<lastBP);lastBP=meta.bp;let f=meta;
 if(meta.source==='krapp2021'){
  assert(!meta.land,'Older maps must not be embedded in startup data');assert.equal(meta.bp%1000,0);const record=manifest.frames.find(v=>v.bp===meta.bp);assert(record);
  const raw=zlib.gunzipSync(fs.readFileSync(path.join(olderRoot,record.file))),hash=crypto.createHash('sha256').update(raw).digest('hex');assert.equal(hash,record.sha256);assert.equal(raw.length,record.bytes);assert.equal(meta.asset,'/assets/landscape-'+meta.bp+'.'+hash.slice(0,16)+'.json');f=JSON.parse(raw);olderHashes.add(crypto.createHash('sha256').update(JSON.stringify([f.land,f.ice])).digest('hex'));assert.equal(f.source,meta.source);assert.equal(f.bp,meta.bp);assert.equal(f.year,meta.year);
 }else assert.equal(f.bp%2500,0);
 assert.equal(t.fromBP(f.bp),f.year);assert(!snapshots.has(f.year));snapshots.add(f.year);assert(f.land.length>50);assert(f.ice.length>10);
 for(const type of ['land','ice','shelf'])for(const poly of f[type])for(const ring of poly){rings++;assert(ring.length>=4);assert.deepEqual(ring[0],ring.at(-1));for(const [x,y]of ring)assert(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90);for(let j=1;j<ring.length;j++){const [a,b]=[ring[j-1],ring[j]];assert(Math.abs(a[0]-b[0])<=180||(Math.abs(a[1])>89.99&&Math.abs(b[1])>89.99&&a[1]*b[1]>0),'Antimeridian diagonal '+f.bp);}}
 assert(!f.probes['wallacea-sea'].land,'Do not create a land route across Wallacea');
 if(f.source==='paleomist')assert(!f.probes['bering-strait'].ice,'Do not fill Beringia with an ice sheet');
}
assert(olderHashes.size>10,'Do not repeat one ancient map across the timeline');
assert(at(20000).probes['bering-strait'].land);assert(!at(0).probes['bering-strait'].land);
assert(at(20000).probes['torres-strait'].land);assert(!at(0).probes['torres-strait'].land);
assert(at(20000).probes['bass-strait'].land);assert(!at(0).probes['bass-strait'].land);
assert(at(10000).probes['north-sea'].land);assert(!at(5000).probes['north-sea'].land);
assert(at(20000).probes.chicago.ice);assert(!at(10000).probes.chicago.ice);assert(at(20000).probes.stockholm.ice);assert(!at(7500).probes.stockholm.ice);
for(const r of guide.regions){assert(r.title.length===3&&r.text.length===3);assert(r.title.every(Boolean)&&r.text.every(Boolean));assert(r.sources.every(id=>guide.sources[id]?.urls.length));assert(r.exampleBP>=2500&&r.exampleBP<=80000);}
if(!process.argv.includes('--data-only')){const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const file of ['runtime.js','timeline.js','frame-store.js','style.css'])assert(html.includes(fs.readFileSync(path.join(__dirname,file),'utf8')),'Stale published '+file);const key='const ANCIENT_PALEOGEOGRAPHY=',start=html.indexOf(key)+key.length;assert(start>=key.length);assert.deepEqual(JSON.parse(html.slice(start,html.indexOf(';\n',start))),d);}
console.log(JSON.stringify({pass:true,paleoFrames:305,olderFrames:272,calendarYears:352026,validatedRings:rings,geographicControls:13,post1950ExplicitReference:true,noOlderExtrapolation:true,noInventedLandRoute:true}));
