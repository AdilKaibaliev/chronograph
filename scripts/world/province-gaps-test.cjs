'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs');
const c=JSON.parse(fs.readFileSync('index.html','utf8').match(/const WORLD_HISTORY=([^\n]+);/)[1]),h=require('./core.js').createWorldHistory(c),table=c.provinceGaps;
assert(table?.pairs>4000);let checks=0;
for(const [year,ids]of table.frames){const rows=h.mapAreasAt(year),map=new Map(rows.map(a=>[a.entry,a]));assert.equal(new Set(ids).size,ids.length);for(const id of ids){const a=map.get(id);assert(a?.sovereign&&!a.detachedProvince,id+' '+year);assert(map.has(a.sovereign));checks++;}}
function fill(year,point){const rows=h.mapAreasAt(year),ids=new Set(table.frames.filter(f=>f[0]<=year).at(-1)[1]);
 const covered=rows.some(a=>(!a.sovereign||a.detachedProvince)&&!a.cartographicOverlay&&['polity','influence'].includes(a.kind)&&G.covers(a.polygons,point));
 if(covered)return [];
 const frame=c.boundaryEvidence.frames[c.boundaryEvidence.timeline.unified.filter(f=>f[0]<=year).at(-1)[1]];
 if(frame.zones.some(([, ,i])=>G.covers(c.boundaryEvidence.shapes[i],point)))return [];
 const parent=id=>{const seen=new Set();while(rows.find(a=>a.entry===id)?.sovereign&&!seen.has(id)){seen.add(id);id=rows.find(a=>a.entry===id).sovereign;}return id;};
 return [...new Set(rows.filter(a=>ids.has(a.entry)&&['polity','influence','settlement'].includes(a.kind)&&G.covers(a.polygons,point)).map(a=>parent(a.sovereign)))];
}
for(const [point,owner]of [[[3.06,36.75],'late-france'],[[-8,12.65],'late-france'],[[15.05,12.12],'late-france'],[[13.23,-8.83],'late-portugal'],[[32.59,-25.96],'late-portugal']])assert.deepEqual(fill(1950,point),[owner],'Dated overseas province must remain visible '+point);
for(const point of [[2.35,48.86],[-.12,51.5],[-3.7,40.42],[31.24,30.04],[18.42,-33.93]])assert.deepEqual(fill(1950,point),[],'Do not repaint existing political land '+point);
assert.deepEqual(fill(1963,[3.06,36.75]),[],'Independent Algeria must not retain a French remainder');
assert.deepEqual(fill(1961,[-8,12.65]),[],'Independent Mali must not retain a French remainder');
assert.deepEqual(fill(1976,[13.23,-8.83]),[],'Independent Angola must not retain a Portuguese remainder');
const runtime=fs.readFileSync('scripts/world/territory-runtime.js','utf8');assert(runtime.includes("if(other.owner!==owner)mask.append"),'Do not assign overlaps between provincial reconstructions to the last painter');
console.log(JSON.stringify({pass:true,datedFrames:table.frames.length,referencedProvinces:checks,pairs:table.pairs,checks:'dated visibility, existing sovereignty preserved, independence transitions, neutral conflicting reconstructions'}));
