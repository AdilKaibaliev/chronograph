'use strict';
// Reproducible import: Natural Earth 1:50m land, public domain. No country
// polygons or contemporary political boundaries enter historical geometry.
const fs=require('node:fs'),path=require('node:path'),G=require('./cartography-geometry.cjs');
const source=process.argv[2];if(!source)throw Error('Supply ne_50m_land.geojson');
const data=JSON.parse(fs.readFileSync(source,'utf8'));
const polygons=data.features.flatMap(f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates]);
const rings=G.merge(polygons.map(p=>p.map((r,i)=>{r=r.slice(0,-1);return (G.signed(r)>0)!==(i===0)?r.slice().reverse():r;})));
fs.writeFileSync(path.join(__dirname,'land-coasts.json'),JSON.stringify(rings));
console.log(JSON.stringify({polygons:polygons.length,rings:rings.length,vertices:rings.reduce((n,r)=>n+r.length,0)}));
