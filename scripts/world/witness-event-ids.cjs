'use strict';
// Events contributed by the source readings during atlas assembly.
module.exports=new Set(['tabuk-expedition-630',...require('./kyrgyz-witnesses.json')
 .filter(note=>note.place&&!note.background).map(note=>note.replacesEvent||'kyrgyz-witness-'+note.from)]);
