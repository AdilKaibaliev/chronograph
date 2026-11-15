'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
require('./calendar-test.cjs');
require('./deep-test.cjs');
const root=path.resolve(__dirname,'../..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function data(key){const start=html.indexOf(key)+key.length;assert(start>=key.length);return JSON.parse(html.slice(start,html.indexOf(';\n',start)));}
const world=data('const WORLD_HISTORY='),legacy=data('const EMPIRES='),cartography=data('const LEGACY_CARTOGRAPHY='),cal=require('./calendar.js');
const baseline=JSON.stringify(world),kyrgyz=require('../../research/kyrgyz-pre610.json'),c=require('./prepare.cjs')(world,kyrgyz);
assert.equal(JSON.stringify(world),baseline,'The ancient adapter mutated published data');assert.equal(c.releaseReady,true);
assert.equal(c.range.min,-350000);assert.equal(c.range.cutoff,610);
const built=data('const ANCIENT_PREVIEW=');
assert(html.includes(fs.readFileSync(path.join(__dirname,'preview-runtime.js'),'utf8')),'Built runtime differs from source');
assert.deepEqual(built.records,c.records,'Built ancient cards differ from reviewed data');
assert.deepEqual(built.scriptural.records,c.scriptural.records,'Built textual evidence differs from reviewed records');
assert.deepEqual(built.trails,c.trails,'Reading trails differ from reviewed sequence');
assert.deepEqual(built.movements,c.movements,'Migration connectors differ from reviewed data');
assert.deepEqual(built.peoplesTrail,c.peoplesTrail,'States and migration navigation differs');
assert.deepEqual(built.chinaTrail,c.chinaTrail,'China navigation differs');
for(const id of c.chinaTrail)assert(c.records.some(r=>r.id===id),'Missing China card '+id);
assert.deepEqual(built.chinaReference,c.chinaReference,'Reference map differs');
assert(c.chinaReference.svg.startsWith('<svg')&&!/<script|foreignObject|\bon\w+=|(?:href|src)=/i.test(c.chinaReference.svg),'Reference SVG must remain inert');
for(const id of ['qin-xianyang','qi-linzi-restored','yan-ji','zhao-handan','wei-daliang','han-xinzheng','chu-juyang'])assert(c.records.some(r=>r.id===id&&r.from<=-250&&r.to>-250&&r.coord),'Missing contemporary state centre '+id);
for(const [year,activeId,inactiveId]of [[-284,'qi-ju','qi-linzi'],[-279,'qi-linzi-restored','qi-ju'],[-278,'chu-chen','chu-ying'],[-253,'chu-juyang','chu-chen'],[-241,'chu-shouchun','chu-juyang']]){const current=c.records.filter(r=>r.from<=year&&year<r.to);assert(current.some(r=>r.id===activeId));assert(!current.some(r=>r.id===inactiveId),'Stale capital '+inactiveId+' in '+year);}
assert.equal(c.records.find(r=>r.id==='western-zhou').to,c.records.find(r=>r.id==='spring-autumn').from);
assert.equal(c.records.find(r=>r.id==='spring-autumn').to,c.records.find(r=>r.id==='warring-states').from);
for(const m of c.movements){assert(c.records.some(r=>r.id===m.record&&r.movementId===m.id));assert(m.sources.every(id=>c.sources[id]));}
assert.deepEqual(built.milestones,c.milestones,'Built playback omits reviewed change dates');
assert.equal(built.releaseReady,true);
assert.deepEqual(data('const ANCIENT_BOUNDARIES='),require('./load-boundaries.cjs'),'Built territorial reconstruction differs from reviewed archive');
for(const r of require('./load-boundaries.cjs').records)assert(c.milestones.includes(r.from),'Playback misses territorial transition '+r.id+' '+r.from);
const ids=new Set();for(const r of c.records){assert(!ids.has(r.id));ids.add(r.id);assert(cal.valid(r.from)&&cal.valid(r.to)&&r.from<r.to,r.id);assert(r.from<610);assert.equal(r.title.length,3);assert.equal(r.text.length,3);assert(r.title.every(Boolean)&&r.text.every(Boolean));assert(r.sources.length&&r.sources.every(id=>c.sources[id]?.title),r.id);if(r.coord){assert.equal(r.coord.length,2);assert(r.coord.every(Number.isFinite));assert(Math.abs(r.coord[0])<=180&&Math.abs(r.coord[1])<=90);}assert(!r.polygons&&!r.route,'Unreviewed geometry cannot enter the preview');}
for(const r of c.records.filter(r=>r.kyrgyz)){assert.equal(r.coord,null);assert(r.dateLabel.every(Boolean));assert(r.geographyReview);}
assert.equal(c.records.filter(r=>r.kyrgyz).length,5);
assert.equal(c.records.find(r=>r.id==='ky-tashtyk-context').to,701,'VII-century context must not end in 609');
assert.deepEqual(c.records.find(r=>r.id==='ky-qigu-muqan').dateLabel,kyrgyz.cards.find(r=>r.id==='qigu-muqan').dateLabel);
assert(!c.records.some(r=>r.id.includes('tang')),'Tang must not be backdated before 618');
assert.equal(c.records.find(r=>r.id==='western-han').to,9);assert.equal(c.records.find(r=>r.id==='eastern-han').from,25,'Do not erase Xin and the restoration interval');
const continuity=[];for(const r of c.records.filter(r=>r.continuity)){
 const e=world.entries.find(e=>e.id===r.continuity.entry),p=e.phases.find(p=>p.from===r.from);
 assert.deepEqual(r.text,p.text);assert.equal(r.to,p.to);assert.equal(r.from,p.from);assert.deepEqual(r.coord,p.coord||e.coord);
 continuity.push({entry:e.id,from:r.from,to:r.to,phaseUnchanged:true,territoryBackdated:false});
}
const queue=legacy.filter(e=>e.from<=610&&e.to>=610&&e.id!=='westernRomanRef').map(e=>({id:e.id,name:e.name,publishedStart:e.from,firstGeometryYear:cartography.frames[e.id]?.[0]?.[0]??null,status:'legacy-entry-at-610',action:'Ancient overview uses its own reviewed entities. No automatic backdating of this polygon.'}));
assert(queue.length>10);assert(queue.some(e=>e.id==='sui'));assert(queue.some(e=>e.id==='yeniseiKyrgyz'));
const result={status:'PASS-selected-ancient-overview',releaseReady:true,minimumYear:-350000,maximumPublishedYear:2026,records:c.records.length,kyrgyzCards:5,calendarYearsTested:352026,
 localBuildSha256:crypto.createHash('sha256').update(html).digest('hex'),continuity,legacyTransitionInventory:queue,
 remainingResearch:c.coverage.remainingResearch,notClaimed:['Complete world coverage','Survey-grade ancient state boundaries','Identical spatial resolution across 609/610']};
const output=path.join(root,'verification-ancient.json');fs.writeFileSync(output,JSON.stringify(result,null,2));
console.log(JSON.stringify({status:result.status,records:result.records,kyrgyz:5,unchangedPhaseContinuities:continuity.length,legacyEntriesInventoried:queue.length,existingPhaseDataUnchanged:true}));
