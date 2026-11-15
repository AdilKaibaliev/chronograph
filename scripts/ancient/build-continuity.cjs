'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto');
const file=process.argv[2];if(!file)throw Error('Provide the reviewed Cliopatria v0.2.1 GeoJSON');
const bytes=fs.readFileSync(file),source=JSON.parse(bytes),review=require('./polity-review.cjs');
const ids=new Set(['pyu','teotihuacan','nobatia','maya','chenla','goguryeo','silla','baekje','avar','chalukya','zapotec']);
const aliases={silla:['Silla','Unified Silla'],maya:['Mayan City-States','Later Mayan City-States'],chenla:['Chenla','(Chenla)','Water Chenla','Land Chenla']};
const entities=review.filter(e=>ids.has(e.id)),records=[];
for(const e of entities)for(const f of source.features){const p=f.properties;if(!(aliases[e.id]||[e.sourceName]).includes(p.Name)||p.Type!=='POLITY'||p.ToYear<610||p.FromYear>=Math.min(e.to,1300))continue;
 const from=Math.max(e.from,p.FromYear),to=Math.min(e.to-1,p.ToYear,1299);if(from>to)continue;
 const geometry=(f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates).map(p=>p.map(r=>r.map(p=>p.map(n=>+n.toFixed(5)))));
 records.push({id:e.id,from,to,sourceFrom:p.FromYear,sourceTo:p.ToYear,geometry});
}
// Chenla denotes several centres; simultaneous northern/southern rows are one
// multi-centre grouping, not two competing independent copies of the same ID.
const clip=require('../vendor/polygon-clipping.cjs'),merged=[];
for(const e of entities){const rows=records.filter(r=>r.id===e.id),years=[...new Set(rows.flatMap(r=>[r.from,r.to+1]))].sort((a,b)=>a-b);for(let i=0;i<years.length-1;i++){const active=rows.filter(r=>r.from<=years[i]&&years[i]<=r.to);if(active.length)merged.push({...active[0],from:years[i],to:years[i+1]-1,sourceFrom:Math.max(...active.map(r=>r.sourceFrom)),sourceTo:Math.min(...active.map(r=>r.sourceTo)),geometry:active.length===1?active[0].geometry:clip.union(...active.map(r=>r.geometry))});}}
const result={source:require('./load-boundaries.cjs').source,upstreamSha256:crypto.createHash('sha256').update(bytes).digest('hex'),entities,records:merged};
fs.writeFileSync(path.join(__dirname,'../../research/ancient-continuity.json.gz'),zlib.gzipSync(Buffer.from(JSON.stringify(result)),{level:9}));
console.log(JSON.stringify({entities:entities.length,records:merged.length}));
