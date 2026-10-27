'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'public'),origin='https://www.chronographatlas.com';
const copy=require('./content.cjs'),langs=['en','ru','ky'],idx={en:1,ru:0,ky:2},esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
// Only this generated output directory may be replaced; source files stay intact.
assert.equal(path.dirname(out),root);if(fs.existsSync(out))fs.rmSync(out,{recursive:true});fs.mkdirSync(path.join(out,'assets'),{recursive:true});
function write(p,s){const f=path.join(out,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s);return '/'+p;}
const assets=[];function asset(name,s,ext='js'){if(ext==='js')new vm.Script(s);const p=write('assets/'+name+'.'+hash(s).slice(0,16)+'.'+ext,s);assets.push({url:p,bytes:Buffer.byteLength(s),sha256:hash(s)});return p;}
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const icon=decodeURIComponent(html.match(/href="data:image\/svg\+xml,([^"]+)"/)[1]);write('icon.svg',icon);write('logo.svg',icon);
const verification=JSON.parse(fs.readFileSync(path.join(__dirname,'verification.json'),'utf8'));
const verificationTags=Object.entries(verification).map(([name,value])=>'<meta name="'+esc(name)+'" content="'+esc(value)+'">').join('');
const c=JSON.parse(html.match(/const WORLD_HISTORY=([^\n]+);/)[1]);
const originals={};let assignments=['window.CHRONOGRAPH_DATA={};'],bytes=32,parts=[];
function add(s){if(bytes+Buffer.byteLength(s)>900000&&assignments.length){parts.push(assignments.join('\n'));assignments=[];bytes=0;}assignments.push(s);bytes+=Buffer.byteLength(s);}
function split(target,value){const json=JSON.stringify(value);if(Buffer.byteLength(json)<880000){add(target+'='+json+';');return;}add(target+'='+(Array.isArray(value)?'[]':'{}')+';');for(const [k,v]of Object.entries(value))split(target+'['+JSON.stringify(k)+']',v);}
html=html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g,(_,script)=>{
 script=script.replace(/^const ([A-Z][A-Z_]+)=(.+);$/gm,(line,key,json)=>{if(Buffer.byteLength(line)<100000)return line;let value;try{value=JSON.parse(json);}catch{return line;}originals[key]=value;split('window.CHRONOGRAPH_DATA.'+key,value);return 'const '+key+'=window.CHRONOGRAPH_DATA.'+key+';';});
 const p=asset('atlas-script',script);return '<script defer src="'+p+'"></script>';
});
if(assignments.length)parts.push(assignments.join('\n'));
const dataAssets=parts.map((s,i)=>asset('atlas-data-'+String(i).padStart(3,'0'),s));
html=html.replace(/<script defer/,dataAssets.map(p=>'<script defer src="'+p+'"></script>').join('\n')+'\n<script defer');
// Prove that chunking did not discard or change even one historical coordinate.
const context={window:{}};vm.createContext(context);for(const s of parts)vm.runInContext(s,context);assert.equal(JSON.stringify(context.window.CHRONOGRAPH_DATA),JSON.stringify(originals));
html=html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/g,(_,css)=>'<link rel="stylesheet" href="'+asset('atlas',css,'css')+'">');
const style=`:root{color-scheme:dark;font-family:Georgia,serif;background:#1e1c17;color:#ece3d0}*{box-sizing:border-box}body{margin:0}a{color:#ddbd7d;text-underline-offset:4px}a:hover{color:#fff}a:focus-visible{outline:2px solid #ddbd7d;outline-offset:5px}header,main,footer{max-width:1080px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #62543a;flex-wrap:wrap}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-size:24px}.brand img{width:52px;height:52px}nav{display:flex;gap:16px;flex-wrap:wrap;font:15px system-ui}h1{font-size:clamp(30px,5vw,54px);line-height:1.12;max-width:850px}h2{font-size:27px;margin-top:42px}h3{font-size:22px}p,li{font-size:18px;line-height:1.65;max-width:900px}.eyebrow{font:13px system-ui;letter-spacing:.1em;color:#c5a76c}.cta{display:inline-block;background:#c5a76c;color:#1e1c17;padding:13px 20px;text-decoration:none;border-radius:8px;font:600 16px system-ui}.cta:hover{background:#dfc58c;color:#1e1c17}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}.tile,article{padding:22px;border:1px solid #514833;border-radius:12px;background:#25221b}.tile h3{margin:0 0 10px}.tile p{font-size:16px}article{margin:18px 0}article p{margin:12px 0}.source{font:14px/1.6 system-ui;color:#bdb299}.back{font:15px system-ui}footer{font:14px/1.6 system-ui;border-top:1px solid #514833;margin-top:30px}.skip{position:absolute;left:-9999px}.skip:focus{left:12px;top:12px;background:#1e1c17;padding:10px}@media(max-width:500px){header,main,footer{padding:18px}header nav{gap:12px}p,li{font-size:17px}}`;
const css=asset('guide',style,'css');
const guide=l=>'/'+l+'/guide',region=(l,id)=>'/'+l+'/history/'+id;
const nav=(l,alternates=Object.fromEntries(Object.keys(copy).map(k=>[k,guide(k)])))=>Object.keys(alternates).map(k=>'<a lang="'+k+'" hreflang="'+k+'" href="'+alternates[k]+'"'+(k===l?' aria-current="page"':'')+'>'+({en:'English',ru:'Русский',ky:'Кыргызча',zh:'中文'})[k]+'</a>').join('');
const website={'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Chronograph Atlas',alternateName:['Chronograph','Хронограф','Хронограф — Тарыхый атлас','Chronograph 世界历史地图集'],inLanguage:langs,description:copy.en.description};
function meta(l,title,description,url,alternates,type='CollectionPage'){
 return `${verificationTags}<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${origin+url}">${Object.entries(alternates).map(([k,p])=>`<link rel="alternate" hreflang="${k}" href="${origin+p}">`).join('')}<link rel="alternate" hreflang="x-default" href="${origin+alternates.en}"><meta property="og:type" content="website"><meta property="og:site_name" content="Chronograph Atlas"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin+url}"><meta property="og:image" content="${origin}/social-card.png"><meta property="og:image:alt" content="Chronograph Atlas — World history on a map"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[website,{'@type':type,'@id':origin+url+'#page',url:origin+url,name:title,description,inLanguage:l,isPartOf:{'@id':origin+'/#website'}}]}).replace(/</g,'\\u003c')}</script>`;
}
const urls=['/'];
function page(l,url,title,description,body,alts){const t=copy[l];urls.push(url);write(url.slice(1)+'.html',`<!doctype html><html lang="${l}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${meta(l,title,description,url,alts)}<link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="${css}"></head><body><a class="skip" href="#main">${l==='ru'?'К содержанию':l==='ky'?'Мазмунга өтүү':l==='zh'?'跳转到内容':'Skip to content'}</a><header><a class="brand" href="${guide(l)}"><img src="/logo.svg" alt="" width="52" height="52">${esc(t.brand)}</a><nav aria-label="${t.languages}">${nav(l,alts)}</nav></header><main id="main">${body}</main><footer>${esc(t.footer)}<br>${esc(t.updated)} · <a href="mailto:lfc@legacyfidelity.com?subject=Chronograph">${t.contact}</a></footer></body></html>`);}
for(const l of Object.keys(copy)){
 const t=copy[l],i=idx[l]??1;
 const tiles=c.regions.map(r=>`<div class="tile"><h3><a href="${region(l==='zh'?'en':l,r.id)}">${esc(r.name[i])}</a></h3><p>${esc(r.scope[i])}</p></div>`).join('');
 page(l,guide(l),t.title,t.description,`<p class="eyebrow">CHRONOGRAPH ATLAS · 610–2026</p><h1>${t.heading}</h1><p>${t.intro}</p><p><a class="cta" href="/?lang=${l==='zh'?'en':l}">${t.open}</a></p><h2>${t.regions}</h2><div class="grid">${tiles}</div><h2>${t.how}</h2><ol>${t.steps.map(x=>'<li>'+esc(x)+'</li>').join('')}</ol><h2>${t.method}</h2><p>${t.note}</p><p>${t.scope}</p>`,Object.fromEntries(Object.keys(copy).map(k=>[k,guide(k)])));
}
// Curated sampling across chronological bands: no mass-generated thin entry pages.
for(const r of c.regions){
 const entries=c.entries.filter(e=>e.region===r.id);const chosen=[];const used=new Set();
 for(const [from,to]of [[610,1000],[1000,1300],[1300,1600],[1600,1800],[1800,1914],[1914,1946],[1946,1992],[1992,2011]]){
  const candidates=entries.flatMap(e=>e.phases.filter(p=>p.from>=from&&p.from<to&&p.text?.every(Boolean)).map(p=>({e,p}))).sort((a,b)=>a.p.from-b.p.from||a.e.id.localeCompare(b.e.id));
  for(const x of candidates.filter(x=>!used.has(x.e.id)).slice(0,3)){chosen.push(x);used.add(x.e.id);}
 }
 if(chosen.length<3)for(const e of entries){if(used.has(e.id))continue;const p=e.phases.find(p=>p.to>610&&p.from<=2010);if(p){chosen.push({e,p});used.add(e.id);}}
 assert(chosen.length>0,r.id);
 for(const l of langs){const t=copy[l],i=idx[l],name=r.name[i],title=name+' — '+t.brand+' · 610–2026',desc=name+'. '+r.scope[i]+'. '+t.regionIntro;
 const articles=chosen.sort((a,b)=>a.p.from-b.p.from).map(({e,p})=>{const y=Math.max(610,p.from),last=Math.min(2026,p.to-1);return `<article><p class="eyebrow">${esc(p.period?.[i]||String(y)+(last>y?'–'+last:''))}</p><h3>${esc(e.name[i])} · ${esc(p.title[i])}</h3><p>${esc(p.text[i])}</p>${Object.values(p.learning||{}).filter(v=>Array.isArray(v)&&v[i]).map(v=>'<p>'+esc(v[i])+'</p>').join('')}<p class="source">${t.sources}: ${(p.sources||[]).map(k=>esc(c.sources[k]?.title||k)).join('; ')}</p><a href="/?lang=${l}&amp;year=${y}&amp;tab=compare&amp;world=${r.id}&amp;wplace=${encodeURIComponent(e.id)}">${t.map}: ${esc(e.name[i])}, ${y}</a></article>`;}).join('');
 page(l,region(l,r.id),title,desc,`<a class="back" href="${guide(l)}">← ${t.back}</a><h1>${esc(name)}</h1><p>${esc(r.scope[i])}. ${t.regionIntro}</p><p><a class="cta" href="/?lang=${l}&amp;year=1000&amp;tab=compare&amp;world=${r.id}">${t.open}</a></p><h2>${t.period}</h2>${articles}<h2>${t.method}</h2><p>${t.note}</p>`,Object.fromEntries(langs.map(k=>[k,region(k,r.id)])));
 }
}
html=html.replace(/<title>[\s\S]*?<\/title>/,meta('en',copy.en.title,copy.en.description,'/',{en:'/'},'WebPage'));
html=html.replace('<div class="brand">','<a class="brand" id="atlasGuideLink" href="/en/guide" aria-label="About Chronograph Atlas">').replace(/(<div class="brand-sub"[^>]*>[^<]*<\/div><\/div>\s*)<\/div>/,'$1</a>');
html=html.replace('</head>','<style>.brand{text-decoration:none;color:inherit}.brand:focus-visible{outline:2px solid #c5a76c;outline-offset:4px}</style></head>');
html=html.replace('<body>','<body><noscript><section style="padding:24px;background:#1e1c17;color:#eee"><h1>Chronograph Atlas</h1><p>Explore world history from 610 to 2026. Enable JavaScript for the interactive map or read our historical guides.</p><nav>'+nav('en')+'</nav></section></noscript>');
write('index.html',html);assert(Buffer.byteLength(html)<1000000,'Atlas HTML must stay below crawler limits');
// Preserve previously published downloadable releases when building from GitHub.
if(fs.existsSync(path.join(root,'downloads')))fs.cpSync(path.join(root,'downloads'),path.join(out,'downloads'),{recursive:true});
const key='chronograph-atlas-7f39d2c6e0184b5ba96017cd4328fe10';write(key+'.txt',key);
write('robots.txt','User-agent: *\nAllow: /\n\nSitemap: '+origin+'/sitemap.xml\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(p=>'<url><loc>'+origin+p+'</loc></url>').join('')+'</urlset>');
write('404.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found — Chronograph Atlas</title></head><body><h1>Page not found</h1><p><a href="/">Open the atlas</a> · <a href="/en/guide">Read the guide</a></p></body></html>');
write('social-card.png',Buffer.from(fs.readFileSync(path.join(__dirname,'social-card.base64'),'utf8').trim(),'base64'));
const manifest={version:'1.28.0',sourceSha256:hash(fs.readFileSync(path.join(root,'index.html'))),htmlSha256:hash(html),htmlBytes:Buffer.byteLength(html),assets,urls,indexNowKey:key,dataRoundTrip:true};
fs.writeFileSync(path.join(root,'verification-seo-build.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({pass:true,htmlBytes:manifest.htmlBytes,pages:urls.length,assets:assets.length,largestAsset:Math.max(...assets.map(a=>a.bytes)),dataRoundTrip:true}));
