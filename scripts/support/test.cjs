const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const runtime=fs.readFileSync(__dirname+'/../i18n/runtime.js','utf8');
const init=runtime.slice(runtime.indexOf('const supportedLanguages'),runtime.indexOf('const originalText'));
const future=fs.readFileSync(__dirname+'/../future/runtime.js','utf8');
const futureLabels=future.slice(future.indexOf('const futureText='),future.indexOf('const futureState='));
for(const [lang,label] of [['ru','Будущие события'],['en','Future events'],['ky','Келечектеги окуялар']]){
 const ctx={URLSearchParams,location:{search:'?lang='+lang},localStorage:{getItem(){return null}}};
 assert.equal(vm.runInNewContext(init+futureLabels+";ft('button')",ctx),label,'Future-mode language mapping');
}
const atlasLocale=require('../../api/atlas-locale.js');
function regionScript(country,method='GET',handler=atlasLocale){
 let status,headers,body;
 handler({method,headers:{'x-vercel-ip-country':country}},{writeHead(s,h){status=s;headers=h;},end(s){body=s;}});
 assert.equal(headers['Cache-Control'],'private, no-store');assert.equal(headers.Vary,'X-Vercel-IP-Country');
 return {status,headers,body};
}
for(const [country,expected] of [['KG','ky'],...['AM','AZ','BY','KZ','RU','TJ','TM','UZ'].map(code=>[code,'ru']),...['US','CN','DE','GE','UA',undefined,'XX','ZZ";alert(1)'].map(code=>[code,'en'])]){
 const {status,body}=regionScript(country);assert.equal(status,200);
 assert.equal(vm.runInNewContext(body+'chronographRegionalLanguage'),expected,country);
}
const handlerCode=fs.readFileSync(require.resolve('../../api/atlas-locale.js'),'utf8');
for(const [when,expected] of [['2027-04-07T23:59:59Z','ru'],['2027-04-08T00:00:00Z','en']]){
 const context={module:{},Date:class extends Date{static now(){return Date.parse(when);}}};
 vm.runInNewContext(handlerCode,context);assert.equal(vm.runInNewContext(regionScript('MD','GET',context.module.exports).body+'chronographRegionalLanguage'),expected);
}
assert.equal(regionScript('KG','HEAD').body,undefined);assert.equal(regionScript('RU','POST').status,405);
for(const [query,saved,blocked,regional,expected] of [['',null,false,undefined,'en'],['','ky',false,'ru','ky'],['?lang=ru','en',false,'ky','ru'],['?lang=en','ru',false,'ky','en'],['?lang=xx','ky',false,'en','ky'],['','bad',false,'ky','ky'],['',null,true,'ru','ru'],['',null,true,'xx','en'],['?year=1475&tab=compare',null,false,'ky','ky'],['?lang=xx',null,false,'ru','ru']]){
 const ctx={URLSearchParams,chronographRegionalLanguage:regional,location:{search:query},localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;}}};
 assert.equal(vm.runInNewContext(init+';language',ctx),expected);
}
const support=fs.readFileSync(__dirname+'/runtime.js','utf8');
let stopped=0,futureStopped=0,localized=0;const clicks=[];const el={classList:{contains(){return false},add(){}},after(){},setAttribute(){},querySelector(){return {scrollTop:0}},addEventListener(n,fn){clicks.push(fn);}};
const body={innerHTML:'',querySelector(){return {querySelector(){return {}},addEventListener(){}}}};
vm.runInNewContext(support,{document:{createElement:()=>el},futureButton:{after(){}},$:id=>id==='modalBody'?body:el,stopPlay(){stopped++},futureState:{active:true},futureStop(){futureStopped++},localizePage(){localized++},language:'en',translate:s=>s,MutationObserver:class{observe(){}}});
clicks[0]();assert.equal(stopped,1);assert.equal(futureStopped,1);assert(localized>=2);assert(body.innerHTML.includes('Приём переводов пока не подключён'));
assert(!/https?:|href=|window.open|fetch\(/.test(support.split('// Contact uses')[0]),'No invented payment destination');
clicks[1]();assert.equal(stopped,2);assert.equal(futureStopped,2);
assert(body.innerHTML.includes('action="/api/contact" method="POST"'));
for(const field of ['name="name"','name="email" type="email"','name="message" required','name="_honey"'])assert(body.innerHTML.includes(field));
assert(!body.innerHTML.includes('mailto:'));assert(!body.innerHTML.includes('name="_captcha"'));
const rows=require('../i18n/compiled-messages.json'),t=require('../i18n/core.js').createChronographTranslator(rows);
for(const [ru,en,ky] of require('./messages.json')){assert.equal(t(ru,'en'),en);assert.equal(t(ru,'ky'),ky);}
console.log('PASS: regional language defaults, URL and saved choice priority, blocked storage, RU/EN/KY support copy, both timelines paused, no payment destination.');
