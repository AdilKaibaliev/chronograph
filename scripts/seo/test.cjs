'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const m=JSON.parse(fs.readFileSync('verification-seo-build.json')),base='https://www.chronographatlas.com';
const html=fs.readFileSync('public/index.html','utf8');
assert(m.dataRoundTrip);assert(m.htmlBytes<1000000);assert.equal(m.sourceSha256,crypto.createHash('sha256').update(fs.readFileSync('index.html')).digest('hex'));
const resolve=url=>{const u=new URL(url,base);if(u.origin!==base)return null;let p='public'+u.pathname;if(u.pathname==='/')p+='index.html';else if(!path.extname(p))p+='.html';return p;};
let links=0,pages=0;
for(const url of m.urls){const p=resolve(url),s=fs.readFileSync(p,'utf8');pages++;assert(Buffer.byteLength(s)<1000000,p);assert(s.includes('rel="canonical" href="'+base+url+'"'),p);assert(s.includes('name="description"'),p);assert(s.includes('application/ld+json'),p);assert(!/noindex/.test(s),p);
 for(const j of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(j[1]);
 for(const a of s.matchAll(/(?:href|src)="([^"]+)"/g)){let target=a[1].replaceAll('&amp;','&');if(/^(data:|mailto:|#)/.test(target))continue;const f=resolve(target);if(f){assert(fs.existsSync(f),p+' broken link '+target);links++;}}
 if(url!=='/'){assert.equal((s.match(/<h1[ >]/g)||[]).length,1,p);assert(s.includes('hreflang="x-default"'),p);assert(!s.includes('[object Object]'),p);}
}
for(const a of m.assets){const b=fs.readFileSync('public'+a.url);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),a.sha256);assert(b.length<1000000);if(a.url.endsWith('.js'))new vm.Script(b.toString());}
const scripts=[...html.matchAll(/<script defer src="([^"]+)"/g)].map(x=>x[1]);const firstRuntime=scripts.findIndex(x=>x.includes('/atlas-script.'));assert(firstRuntime>0);assert(scripts.slice(0,firstRuntime).every(x=>x.includes('/atlas-data-')));
assert(fs.readFileSync('public/robots.txt','utf8').includes('Sitemap: '+base+'/sitemap.xml'));const sitemap=fs.readFileSync('public/sitemap.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,m.urls.length);assert(!/<loc>[^<]*[?]/.test(sitemap));
assert.equal(fs.readFileSync('public/'+m.indexNowKey+'.txt','utf8'),m.indexNowKey);assert(fs.readFileSync('public/social-card.png').subarray(1,4).equals(Buffer.from('PNG')));
assert.equal(JSON.parse(fs.readFileSync('vercel.json')).outputDirectory,'public');
console.log(JSON.stringify({pass:true,pages,internalLinks:links,htmlBytes:m.htmlBytes,cachedAssets:m.assets.length,checks:'metadata, canonical URLs, language alternates, real internal links, sitemap, robots, ordered scripts, data integrity, social image'}));
