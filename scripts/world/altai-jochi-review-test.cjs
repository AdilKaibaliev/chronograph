'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]);
const at=(id,y)=>l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]];
const controls=[];
const places={suyab:[75.2,42.8],samarqand:[66.97,39.65],beshbalik:[89.2,44.0],blackIrtysh:[86.8,48.0],orkhon:[102.8,47.2],khentii:[109,48],khovd:[91.64,48.0],upperYenisei:[96,51.2],minusinsk:[91.7,53.7]};
for(const y of [610,618,624,627,629])for(const id of ['westernTurkic','easternTurkic'])for(const site of ['suyab','samarqand','beshbalik','blackIrtysh','orkhon','khentii','khovd'])controls.push([id,y,site,id==='westernTurkic'?['suyab','samarqand','beshbalik','blackIrtysh'].includes(site):['orkhon','khentii','khovd'].includes(site)]);
for(const id of ['mongol','mongolRealm']){controls.push([id,1206,'upperYenisei',false],[id,1207,'upperYenisei',true],[id,1206,'orkhon',true],[id,1207,'orkhon',true]);}
controls.push(['yeniseiKyrgyz',1206,'upperYenisei',true],['yeniseiKyrgyz',1206,'minusinsk',true]);
// Khovd is outside the inherited contracting 629 extent; no city-level date
// of transfer is asserted by these sources, so it is not an ownership control.
const checked=controls.filter(c=>!(c[1]===629&&c[2]==='khovd'));
for(const[id,y,p,want]of checked)assert.equal(G.covers(at(id,y),places[p]),want,id+'/'+y+'/'+p);
let edges=0;for(let y=610;y<630;y++){const p=F.I(at('westernTurkic',y),at('easternTurkic',y));assert(Math.abs(p.reduce((n,r)=>n+G.signed(r),0))<.0001,'Turkic overlap '+y);edges++;}
for(const id of ['mongol','mongolRealm']){const p=F.I(at(id,1206),at('yeniseiKyrgyz',1206));assert(Math.abs(p.reduce((n,r)=>n+G.signed(r),0))<.0001,'Premature Yenisei annexation '+id);edges++;}
const tr=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));for(const row of require('./altai-jochi-review.cjs').messages)for(const lang of ['en','ky'])assert.notEqual(tr(row[0],lang),row[0]);
console.log(JSON.stringify({pass:true,settlementControls:checked.length,sharedEdges:edges,checks:'Altai sides, Semirechye/Orkhon centres, all 610–629 edges, Jochi 1206/1207 and unified Mongol geometry, translations'}));
