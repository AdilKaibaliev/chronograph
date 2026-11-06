const assert=require('node:assert/strict'),{Readable}=require('node:stream');
const handler=require('../../api/contact');
const valid={name:'Visitor',email:'visitor@example.com',message:'A correction to the historical map.',_honey:''};
async function call(body=valid,method='POST',headers={},stream=false){
 const req=Readable.from([typeof body==='string'?body:JSON.stringify(body)]);req.method=method;req.headers={'content-type':'application/json',host:'www.chronographatlas.com',origin:'https://www.chronographatlas.com',...headers};if(!stream)req.body=body;
 let status,result;await handler(req,{writeHead(s){status=s},end(s){result=JSON.parse(s)}});return {status,...result};
}
(async()=>{
 delete process.env.RESEND_API_KEY;delete process.env.CONTACT_FROM_EMAIL;
 assert.equal((await call()).status,503);
 assert.equal((await call(valid,'GET')).status,405);
 assert.equal((await call(valid,'POST',{'content-type':'text/plain'})).status,415);
 assert.equal((await call(valid,'POST',{origin:'https://other.example'})).status,403);
 for(const data of [null,[],{}, {...valid,email:'bad'}, {...valid,message:'short'}, {...valid,name:'a\nb'}, {...valid,_honey:'bot'}])assert.equal((await call(data)).status,400);
 assert.equal((await call('!')).status,400);
 assert.equal((await call('x'.repeat(25000))).status,413);
 assert.equal((await call('x'.repeat(25000),'POST',{},true)).status,413);
 process.env.RESEND_API_KEY='test-only';process.env.CONTACT_FROM_EMAIL='Chronograph <contact@example.com>';
 let count=0;global.fetch=async(url,options)=>{count++;assert.equal(url,'https://api.resend.com/emails');const data=JSON.parse(options.body);assert.deepEqual(data.to,['lfc@legacyfidelity.com']);assert.equal(data.reply_to,valid.email);assert(data.text.includes(valid.message));assert(!data.html);return {ok:true,json:async()=>({id:'test'})}};
 assert.equal((await call({...valid,to:'attacker@example.com'})).ok,true);assert.equal((await call(valid,'POST',{},true)).ok,true);assert.equal(count,2);
 global.fetch=async()=>({ok:false,json:async()=>({error:'provider'})});assert.equal((await call()).status,502);
 global.fetch=async()=>{throw Error('timeout')};assert.equal((await call()).status,502);
 console.log('PASS: contact validation, origin, bounded body, honeypot, fixed recipient, reply-to, success, provider failure and timeout. No real email sent.');
})().catch(e=>{console.error(e);process.exitCode=1});
