'use strict';
const fs=require('fs'),assert=require('assert/strict'),G=require('./cartography-geometry.cjs'),F=require('./legacy-frontiers.cjs');
const html=fs.readFileSync('index.html','utf8'),l=JSON.parse(html.match(/const LEGACY_CARTOGRAPHY=([^\n]+);/)[1]),es=JSON.parse(html.match(/const EMPIRES=([^\n]+);/)[1]);
const at=(id,y)=>l.shapes[l.frames[id].filter(f=>f[0]<=y).at(-1)[1]];
const places={chengdu:[104.07,30.67],hanzhong:[107.02,33.07],kaifeng:[114.31,34.8],xiangyang:[112.14,32.04],wuhan:[114.3,30.6],nanjing:[118.78,32.06],yangzhou:[119.42,32.39],shouzhou:[116.78,32.57],hangzhou:[120.15,30.27],tarsus:[34.89,36.92],ankara:[32.85,39.93],kayseri:[35.49,38.72],mosul:[43.13,36.34],baghdad:[44.36,33.31],malatya:[38.35,38.35]};
let controls=0,edges=0;
for(const y of [907,924,925,933,934,956,957,958,959])for(const site of ['chengdu','hanzhong','kaifeng','xiangyang','wuhan','nanjing','yangzhou','shouzhou','hangzhou']){
 const north=['kaifeng','xiangyang'].includes(site)||(['chengdu','hanzhong'].includes(site)&&y>=925&&y<934)||(site==='shouzhou'&&y>=957)||(site==='yangzhou'&&y>=958);
 for(const id of ['fiveDynasties','tenKingdoms']){assert.equal(G.covers(at(id,y),places[site]),id==='fiveDynasties'?north:!north,id+'/'+y+'/'+site);controls++;}
}
for(const [id,y,site,want]of [
 ['northernSong',960,'hanzhong',false],['tenKingdoms',960,'hanzhong',true],['northernSong',965,'hanzhong',true],
 ['northernSong',960,'yangzhou',true],['northernSong',960,'nanjing',false],['tenKingdoms',960,'nanjing',true],
 ...[788,800,821].flatMap(y=>[['abbasid',y,'tarsus',true],['medievalByzantine',y,'tarsus',false],['medievalByzantine',y,'ankara',true],['medievalByzantine',y,'kayseri',true]]),
 ...[750,800,868,900,936].flatMap(y=>[['abbasid',y,'mosul',true],['medievalByzantine',y,'mosul',false],['abbasid',y,'baghdad',true]]),
 ['medievalByzantine',933,'malatya',false],['medievalByzantine',934,'malatya',true],['medievalByzantine',964,'tarsus',false],['medievalByzantine',965,'tarsus',true]
 ]){assert.equal(G.covers(at(id,y),places[site]),want,id+'/'+y+'/'+site);controls++;}
for(const[a,b,from,to]of [['fiveDynasties','tenKingdoms',907,959],['abbasid','medievalByzantine',750,945]])for(let y=from;y<=to;y++){assert(Math.abs(F.I(at(a,y),at(b,y)).reduce((n,r)=>n+G.signed(r),0))<.0001,a+'/'+b+'/'+y);edges++;}
assert.equal(es.find(e=>e.id==='fiveDynasties').to,959);
const tr=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));for(const row of require('./taurus-china-review.cjs').messages)for(const lang of ['en','ky'])assert.notEqual(tr(row[0],lang),row[0]);
console.log(JSON.stringify({pass:true,controls,edges,checks:'Chinese city ownership, Shu 925/934, Shouzhou957, Huainan958, Song960, Cilician base788, Melitene934, Tarsus965; translations'}));
