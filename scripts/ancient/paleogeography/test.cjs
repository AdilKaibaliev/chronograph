'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),d=require('./load.cjs'),t=require('./timeline.js'),guide=require('./catalog.cjs');
assert.equal(d.frames.length,33);assert.equal(d.source.license,'CC BY 4.0');assert.equal(d.source.bpReference,1950);assert.equal(d.source.spatialDegrees,.25);assert.equal(d.processing.temporalInterpolation,false);
for(let y=-350000;y<=2026;y++)if(y){assert.equal(t.fromBP(t.toBP(y)),y);const i=t.frameIndex(y,d.frames);if(y<-78051){assert.equal(i,-1);assert.equal(t.coverage(y),'unavailable');}else{assert(i>=0);const delta=Math.abs(d.frames[i].bp-t.toBP(y));assert(delta<=1250);assert(!d.frames.some(f=>Math.abs(f.bp-t.toBP(y))<delta));assert.equal(t.coverage(y),y>1950?'reference':'reconstruction');}}
assert.equal(t.frameIndex(-551,d.frames),t.frameIndex(-550,d.frames),'No disappearance at the old arbitrary cutoff');
for(const y of [-201,1,609,610,700,701,1949,1950,1951,2026])assert(t.frameIndex(y,d.frames)>=0,'Missing physical base '+y);
assert.equal(d.frames[t.frameIndex(2026,d.frames)].year,1950);assert.equal(t.coverage(2026),'reference','Do not present the 1950 reference as a 2026 survey');
assert.equal(t.frameIndex(0,d.frames),-1);assert.equal(t.fromBP(20000),-18051);assert.equal(t.fromBP(2500),-551);
const snapshots=new Set();let rings=0;
for(const f of d.frames){assert.equal(t.fromBP(f.bp),f.year);assert(f.bp%2500===0);assert(!snapshots.has(f.year));snapshots.add(f.year);assert(f.land.length>50);assert(f.ice.length>10);for(const type of ['land','ice','shelf'])for(const poly of f[type])for(const ring of poly){rings++;assert(ring.length>=4);assert.deepEqual(ring[0],ring.at(-1));for(const [x,y]of ring)assert(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=180&&Math.abs(y)<=90);for(let j=1;j<ring.length;j++){const [a,b]=[ring[j-1],ring[j]];assert(Math.abs(a[0]-b[0])<=180||(Math.abs(a[1])>89.99&&Math.abs(b[1])>89.99&&a[1]*b[1]>0),'Antimeridian diagonal '+f.bp);}}}
const at=bp=>d.frames.find(f=>f.bp===bp);
assert(at(20000).probes['bering-strait'].land);assert(!at(0).probes['bering-strait'].land);
assert(at(20000).probes['torres-strait'].land);assert(!at(0).probes['torres-strait'].land);
assert(at(20000).probes['bass-strait'].land);assert(!at(0).probes['bass-strait'].land);
assert(at(10000).probes['north-sea'].land);assert(!at(5000).probes['north-sea'].land);
assert(at(20000).probes.chicago.ice);assert(!at(10000).probes.chicago.ice);
assert(at(20000).probes.stockholm.ice);assert(!at(7500).probes.stockholm.ice);
for(const f of d.frames){assert(!f.probes['wallacea-sea'].land,'Do not create a land route across Wallacea');assert(!f.probes['bering-strait'].ice,'Do not fill Beringia with an ice sheet');}
for(const r of guide.regions){assert(r.title.length===3&&r.text.length===3);assert(r.title.every(Boolean)&&r.text.every(Boolean));assert(r.sources.every(id=>guide.sources[id]?.urls.length));assert(r.exampleBP>=2500&&r.exampleBP<=80000);}
const root=path.resolve(__dirname,'../../..');if(!process.argv.includes('--data-only')){const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const file of ['runtime.js','timeline.js','style.css'])assert(html.includes(fs.readFileSync(path.join(__dirname,file),'utf8')),'Stale published '+file);const key='const ANCIENT_PALEOGEOGRAPHY=',start=html.indexOf(key)+key.length;assert(start>=key.length);assert.deepEqual(JSON.parse(html.slice(start,html.indexOf(';\n',start))),d);}
console.log(JSON.stringify({pass:true,paleoFrames:33,datedDisplayFrames:33,calendarYears:352026,validatedRings:rings,geographicControls:13,post1950ExplicitReference:true,noOlderExtrapolation:true,noInventedLandRoute:true}));
