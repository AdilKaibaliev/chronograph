'use strict';
const fs=require('fs'),assert=require('assert/strict'),G=require('./cartography-geometry.cjs'),{I}=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c);
const at=(id,y)=>h.mapAreasAt(y).find(a=>a.entry===id)?.polygons||[];
let edges=0,controls=0;
for(let y=1062;y<1152;y++){
 const west=y<1147?'almoravid':'almohad';
 assert(Math.abs(I(at('hammadid',y),at(west,y)).reduce((n,r)=>n+G.signed(r),0))<.0001,'Overlapping Maghreb '+y);edges++;
 for(const p of [[5.07,36.75],[4.79,35.81]]){assert(G.covers(at('hammadid',y),p),'Hammadid centre '+y);assert(!G.covers(at(west,y),p),'Premature western conquest '+y);controls+=2;}
}
for(const [id,y,p,want]of [
 ['almoravid',1079,[-1.32,34.88],false],['almoravid',1080,[-1.32,34.88],true],
 ['almoravid',1080,[-.64,35.7],true],['almoravid',1080,[3.05,36.75],true],
 ['hammadid',1080,[3.05,36.75],false],['almohad',1151,[5.07,36.75],false],
 ['almohad',1152,[5.07,36.75],true],['almohad',1152,[4.79,35.81],true],
 ['almoravid',1062,[-7.98,31.63],true]
 ]){assert.equal(G.covers(at(id,y),p),want,id+'/'+y+'/'+p);controls++;}
assert.equal(at('hammadid',1152).length,0);assert.equal(c.maghrebFrontierReview.version,1);
console.log(JSON.stringify({pass:true,edges,controls}));
