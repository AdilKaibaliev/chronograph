const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const data=require('./catalog.cjs'),scenes=require('./illustrations.cjs'),art=require('./illustration-art.js').createFutureIllustrationArt();
assert.deepEqual(Object.keys(scenes).sort(),data.events.map(e=>e.id).sort(),'All catalogue cards must have an explicit scene');
const types=new Set();let frames=0;
for(const event of data.events){
 const spec=scenes[event.id];types.add(spec.type);assert(art.types.includes(spec.type));
 for(const lang of ['ru','en','ky'])assert(spec.caption[lang]?.trim(),event.id+' '+lang);
 assert(!/[А-Яа-яЁё]/.test(spec.caption.en),event.id+' untranslated caption');
 assert(!('year' in spec||'coord' in spec||'places' in spec),'Illustrations cannot introduce chronology or geography');
 const states=[0,.18,.36,.54,.72,1].map(p=>art.render(spec,p));
 assert(states.every(s=>s.length>200&&!/NaN|undefined|Infinity/.test(s)),event.id+' invalid geometry');
 assert(new Set(states).size>1,event.id+' has no visual progression');
 for(const markup of states){
  assert(!/<(?:script|foreignObject|image|animate)|\bon\w+=|https?:|<text[^>]*>[^\d🐪\s]/u.test(markup),event.id+' unexpected active or textual content');
  for(const m of markup.matchAll(/(?:height|width|r|rx|ry)="(-?\d+(?:\.\d+)?)"/g))assert(+m[1]>=0,event.id+' negative dimension');
  frames++;
 }
}
for(let i=0;i<=100;i++){
 const h=art.heights(i/100);assert(h.every(n=>Number.isFinite(n)&&n>0));
 if(i){const previous=art.heights((i-1)/100);assert(h.every((n,j)=>n>=previous[j]),'Towers must grow, never shrink');}
}
const leaders=new Set([0,.2,.4,.55,.75,1].map(p=>{const h=art.heights(p);return h.indexOf(Math.max(...h));}));assert(leaders.size>=4,'Buildings must overtake each other');
assert.equal((art.render(scenes['women-men'],0).match(/data-person=/g)||[]).length,51,'50 women and one caretaker');
for(const progress of [0,1])assert.equal((art.render(scenes['women-men'],progress).match(/data-person=/g)||[]).length,51,'Seeking cannot change the stated count');
const html=fs.readFileSync('index.html','utf8');
for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
assert(html.includes('prefers-reduced-motion: reduce'));
assert(html.includes("document.addEventListener('visibilitychange'"));
assert.equal((html.match(/id='futureScene'/g)||[]).length,1,'Only one player may be mounted');
console.log(JSON.stringify({status:'PASS: complete multilingual scenes, animation frames, count, monotonic growth, syntax',events:Object.keys(scenes).length,sceneFamilies:types.size,frames}));
