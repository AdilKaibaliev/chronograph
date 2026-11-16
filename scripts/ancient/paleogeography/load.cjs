'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'../../../research/paleogeography');
const read=name=>JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,name))));
const {frameFiles,...header}=read('manifest.json.gz');
if(!frameFiles.every(n=>/^\d+\.json\.gz$/.test(n)))throw Error('Unexpected paleogeography frame name');
const older=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'../paleogeography-older/manifest.json.gz'))));
const olderFrames=older.frames.map(f=>({bp:f.bp,year:f.year,source:'krapp2021',asset:'/assets/landscape-'+f.bp+'.'+f.sha256.slice(0,16)+'.json'}));
module.exports={...header,olderSource:older.source,olderProcessing:older.processing,frames:[...olderFrames,...frameFiles.map(n=>({...read(n),source:'paleomist'}))]};
