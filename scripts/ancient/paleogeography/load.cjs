'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'../../../research/paleogeography');
const read=name=>JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,name))));
const {frameFiles,...header}=read('manifest.json.gz');
if(!frameFiles.every(n=>/^\d+\.json\.gz$/.test(n)))throw Error('Unexpected paleogeography frame name');
module.exports={...header,frames:frameFiles.map(read)};
