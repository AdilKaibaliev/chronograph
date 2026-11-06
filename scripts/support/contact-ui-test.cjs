const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/runtime.js','utf8');
async function scenario(mode){
 const buttons=[],events={},status={},send={disabled:false},form={resets:0,querySelector(s){return s==='button'?send:status},addEventListener(n,fn){events[n]=fn},reportValidity(){return mode!=='invalid'},setAttribute(){},reset(){this.resets++}};
 const modal={querySelector(){return {scrollTop:0}},setAttribute(){},classList:{contains(){return false},add(){}}};
 const body={innerHTML:'',querySelector(){return form}};let requests=0,resolve;
 const context={document:{createElement(){const b={setAttribute(){},after(){},addEventListener(n,fn){b.click=fn}};buttons.push(b);return b}},futureButton:{after(){}},$:id=>id==='modalBody'?body:modal,stopPlay(){},futureStop(){},futureState:{active:false},localizePage(){},translate:s=>s,language:'ru',MutationObserver:class{observe(){}},FormData:class{*[Symbol.iterator](){yield ['name','Visitor'];yield ['email','visitor@example.com'];yield ['message','A map correction'];}},AbortSignal,fetch:async(url,options)=>{requests++;assert.equal(url,'/api/contact');assert.equal(JSON.parse(options.body).name,'Visitor');if(mode==='pending')await new Promise(r=>resolve=r);if(mode==='network')throw Error('offline');return {ok:mode!=='failure',json:async()=>({ok:mode!=='failure'})}}};
 vm.runInNewContext(source,context);buttons[1].click();const pending=events.submit({preventDefault(){}});
 if(mode==='pending'){assert(send.disabled);await events.submit({preventDefault(){}});assert.equal(requests,1);resolve();}
 await pending;assert.equal(send.disabled,false);
 if(mode==='invalid'){assert.equal(requests,0);return;}
 if(['failure','network'].includes(mode)){assert.equal(form.resets,0);assert(status.textContent.includes('Текст сохранён'));}else{assert.equal(form.resets,1);assert(status.textContent.includes('Сообщение отправлено'));}
}
(async()=>{for(const mode of ['invalid','success','failure','network','pending'])await scenario(mode);console.log('PASS: contact UI validates, prevents duplicate submissions, preserves failed drafts and resets only on success.');})().catch(e=>{console.error(e);process.exitCode=1});
