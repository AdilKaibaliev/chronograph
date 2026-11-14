'use strict';
// Local review build only. Does not overwrite index.html or change production bounds.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),input=path.join(root,'index.html');
let html=fs.readFileSync(input,'utf8');
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex'),baseline=sha256(html);
const start=html.indexOf('const WORLD_HISTORY=')+'const WORLD_HISTORY='.length,end=html.indexOf(';\n',start);
assert(start>20&&end>start);const world=JSON.parse(html.slice(start,end));
const catalog=require('./prepare.cjs')(world,require('../../research/kyrgyz-pre610.json'));
function replace(a,b){assert(html.includes(a),'Missing integration point: '+a);html=html.replace(a,b);}
if(!html.includes('const ANCIENT_BOUNDARIES=')){
replace('const TIMELINE_MIN=610,TIMELINE_MAX=2026;','const TIMELINE_MIN=-7000,TIMELINE_MAX=2026;');
replace('id="yearRange" min="610"','id="yearRange" min="-7000"');
// The old playback arithmetic cannot cross BCE/CE. All entry points call the
// runtime wrapper below; the unchanged renderer remains the sole owner of 610+.
const publicCatalog={...catalog,sources:Object.fromEntries(Object.entries(catalog.sources).map(([id,s])=>[id,{title:s.title}]))};
const boundaries=require('./load-boundaries.cjs');
const injected=fs.readFileSync(path.join(__dirname,'calendar.js'),'utf8')+'\nconst ANCIENT_PREVIEW='+JSON.stringify(publicCatalog).replaceAll('<','\\u003c')+';\nconst ANCIENT_BOUNDARIES='+JSON.stringify(boundaries).replaceAll('<','\\u003c')+';\n'+fs.readFileSync(path.join(__dirname,'preview-runtime.js'),'utf8');
const ending=html.lastIndexOf('})();');assert(ending>0);html=html.slice(0,ending)+'\n'+injected+'\n'+html.slice(ending);
replace('</style>',fs.readFileSync(path.join(__dirname,'preview-style.css'),'utf8')+'\n</style>');
}
replace('</head>','<meta name="robots" content="noindex,nofollow"><meta name="chronograph-build" content="ancient-local-review">\n</head>');
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(m[1].trim()&&!m[0].includes('application/ld+json'))new vm.Script(m[1]);
const output=path.resolve(process.argv[2]||path.join(root,'../../../outputs/chronograph-ancient-preview.html'));
assert(path.basename(output)!=='index.html','Preview cannot replace a publication entry point');
assert(!output.startsWith(root+path.sep),'Keep unfinished previews outside the publication project');
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,html);
fs.writeFileSync(path.join(path.dirname(output),'ancient-preview-manifest.json'),JSON.stringify({status:'local-review-only',baselineSha256:baseline,previewSha256:sha256(html),range:catalog.range,coverage:catalog.coverage,records:catalog.records.map(r=>({id:r.id,from:r.from,to:r.to,coord:r.coord,sources:r.sources})),sources:catalog.sources},null,2));
assert.equal(sha256(fs.readFileSync(input)),baseline,'Published build was modified');
console.log(JSON.stringify({output,bytes:Buffer.byteLength(html),...catalog.coverage,productionUnchanged:true}));
