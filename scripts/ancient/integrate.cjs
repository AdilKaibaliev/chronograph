'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
module.exports=function integrateAncient(html){
 const key='const WORLD_HISTORY=',start=html.indexOf(key)+key.length;assert(start>key.length);
 const world=JSON.parse(html.slice(start,html.indexOf(';\n',start)));
 const catalog=require('./prepare.cjs')(world,require('../../research/kyrgyz-pre610.json'));
 const boundaries=require('./load-boundaries.cjs');
 assert(catalog.releaseReady&&boundaries.releaseReady,'Ancient overview has not passed release review');
 const publicCatalog={...catalog,sources:Object.fromEntries(Object.entries(catalog.sources).map(([id,s])=>[id,{title:s.title}])),scriptural:{...catalog.scriptural,sources:Object.fromEntries(Object.entries(catalog.scriptural.sources).map(([id,s])=>[id,{title:s.title}]))}};
 function replace(a,b){assert(html.includes(a),'Missing ancient integration point: '+a);html=html.replace(a,b);}
 replace('const TIMELINE_MIN=610,TIMELINE_MAX=2026;','const TIMELINE_MIN=-350000,TIMELINE_MAX=2026;');
 replace('id="yearRange" min="610"','id="yearRange" min="-350000"');
 const encode=x=>JSON.stringify(x).replaceAll('<','\\u003c');
 const script=fs.readFileSync(path.join(__dirname,'calendar.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'time-scale.js'),'utf8')+'\nconst ANCIENT_PREVIEW='+encode(publicCatalog)+';\nconst ANCIENT_BOUNDARIES='+encode(boundaries)+';\n'+fs.readFileSync(path.join(__dirname,'preview-runtime.js'),'utf8');
 const end=html.lastIndexOf('})();');assert(end>0);html=html.slice(0,end)+'\n'+script+'\n'+html.slice(end);
 replace('</style>',fs.readFileSync(path.join(__dirname,'preview-style.css'),'utf8')+'\n</style>');
 return html;
};
