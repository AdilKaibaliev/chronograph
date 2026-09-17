const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const runtime=fs.readFileSync(__dirname+'/../i18n/runtime.js','utf8');
const init=runtime.slice(runtime.indexOf('const supportedLanguages'),runtime.indexOf('const originalText'));
const future=fs.readFileSync(__dirname+'/../future/runtime.js','utf8');
const futureLabels=future.slice(future.indexOf('const futureText='),future.indexOf('const futureState='));
for(const [lang,label] of [['ru','Будущие события'],['en','Future events'],['ky','Келечектеги окуялар']]){
 const ctx={URLSearchParams,location:{search:'?lang='+lang},localStorage:{getItem(){return null}}};
 assert.equal(vm.runInNewContext(init+futureLabels+";ft('button')",ctx),label,'Future-mode language mapping');
}
for(const [query,saved,blocked,expected] of [['',null,false,'en'],['', 'ky',false,'ky'],['?lang=ru','en',false,'ru'],['?lang=en','ru',false,'en'],['?lang=xx','ky',false,'ky'],['','bad',false,'en'],['',null,true,'en']]){
 const ctx={URLSearchParams,location:{search:query},localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;}}};
 assert.equal(vm.runInNewContext(init+';language',ctx),expected);
}
const support=fs.readFileSync(__dirname+'/runtime.js','utf8');
let clicked,stopped=0,futureStopped=0,localized=0;const el={classList:{contains(){return false},add(){}},setAttribute(){},querySelector(){return {scrollTop:0}},addEventListener(n,fn){clicked=fn;}};
const body={innerHTML:''};
vm.runInNewContext(support,{document:{createElement:()=>el},futureButton:{after(){}},$:id=>id==='modalBody'?body:el,stopPlay(){stopped++},futureState:{active:true},futureStop(){futureStopped++},localizePage(){localized++},language:'en',translate:s=>s,MutationObserver:class{observe(){}}});
clicked();assert.equal(stopped,1);assert.equal(futureStopped,1);assert(localized>=2);assert(body.innerHTML.includes('Приём переводов пока не подключён'));
assert(!/https?:|href=|window.open|fetch\(/.test(support),'No invented payment destination');
const rows=require('../i18n/compiled-messages.json'),t=require('../i18n/core.js').createChronographTranslator(rows);
for(const [ru,en,ky] of require('./messages.json')){assert.equal(t(ru,'en'),en);assert.equal(t(ru,'ky'),ky);}
console.log('PASS: English default, URL priority, saved language, blocked storage, RU/EN/KY support copy, both timelines paused, no payment destination.');
