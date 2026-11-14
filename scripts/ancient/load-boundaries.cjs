'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
// The checked-in archive contains JSON data, never executable code.
module.exports=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.resolve(__dirname,'../../research/ancient-boundaries.json.gz'))));
