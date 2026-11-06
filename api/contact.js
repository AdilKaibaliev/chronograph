'use strict';
// Secrets stay in Vercel environment variables; the recipient is never client-controlled.
const limits={name:120,email:254,message:5000};
module.exports=async function contact(req,res){
 const reply=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 if(req.method!=='POST')return reply(405,{error:'method'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return reply(415,{error:'type'});
 if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return reply(403,{error:'origin'});}catch{return reply(403,{error:'origin'});}}
 let data;try{
  if(req.body!==undefined){const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw)>24000)return reply(413,{error:'size'});data=JSON.parse(raw);}
  else{let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>24000)return reply(413,{error:'size'});}data=JSON.parse(raw);}
 }catch{return reply(400,{error:'invalid'});}
 if(!data||typeof data!=='object'||Array.isArray(data))return reply(400,{error:'invalid'});
 if(data._honey)return reply(400,{error:'invalid'});
 for(const [key,max] of Object.entries(limits))if(typeof data[key]!=='string'||!data[key].trim()||data[key].length>max)return reply(400,{error:'invalid'});
 if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email.trim())||/[\r\n]/.test(data.name)||data.message.trim().length<10)return reply(400,{error:'invalid'});
 if(!process.env.RESEND_API_KEY||!process.env.CONTACT_FROM_EMAIL)return reply(503,{error:'unavailable'});
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:['lfc@legacyfidelity.com'],reply_to:data.email.trim(),subject:'Chronograph — новое обращение',text:Object.keys(limits).map(k=>k+': '+data[k].trim()).join('\n\n')}),signal:AbortSignal.timeout(15000)});
  const result=await response.json();if(!response.ok||!result.id)return reply(502,{error:'delivery'});
  return reply(200,{ok:true});
 }catch{return reply(502,{error:'delivery'});}
};
