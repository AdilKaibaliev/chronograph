const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const d=require('./catalog.cjs'),ids=new Set(),refs=new Set(),keys=new Set();
for(const e of d.events){
 assert(!ids.has(e.id),'Duplicate event '+e.id);ids.add(e.id);
 assert(['major','minor','expected','historical'].includes(e.group));
 for(const language of ['ru','en','ky'])for(const field of ['title','summary'])assert(e[field][language]?.trim(),e.id+' '+field+' '+language);
 assert(!/[А-Яа-яЁё]/.test(e.title.en+e.summary.en),'Russian text in English event '+e.id);
 assert(e.refs.length);for(const ref of e.refs){assert(/^(bukhari|muslim|abudawud):\d+[a-z]?$/.test(ref),ref);refs.add(ref);}
 for(const p of e.places)assert(d.places[p],p);
 assert(!('year' in e)&&!('hijriYear' in e),'Future event has an invented date');
 if(e.majorKey){assert(!keys.has(e.majorKey));keys.add(e.majorKey);assert.equal(e.group,'major');}
}
assert.equal(d.events.filter(e=>e.group==='major').length,10);assert.equal(keys.size,10);
assert.equal(d.events.find(e=>e.id==='mahdi').places.length,0,'Mahdi report must not inherit a place from a weak report');
assert(!d.events.some(e=>e.refs.some(r=>/tirmidhi:2269|ibnmajah:4084|abudawud:4286/.test(r))),'Weak reports must stay outside the event sequence');
for(const [id,route] of Object.entries(d.routes)){assert(ids.has(id));assert(route.every(p=>d.places[p]?.coord));assert.equal(route.length,2);}
assert(!d.routes['truce-breach'],'Unnamed meadow must not receive an invented route');
assert.deepEqual(d.sequences.find(s=>s.id==='sham').ids.slice(0,4),['battle','constantinople','return-sham','dajjal']);
assert(d.events.every(e=>['ru','en','ky'].every(l=>e.grade[l])));
for(const p of Object.values(d.places)){for(const lang of ['ru','en','ky'])assert(p.name[lang]);if(p.coord){assert.equal(p.coord.length,2);assert(p.coord.every(Number.isFinite));assert(Math.abs(p.coord[0])<=180&&Math.abs(p.coord[1])<=90);}}
for(const p of ['island','tur','east','west','amaq','bayda'])assert.equal(d.places[p].coord,null,'Uncertain location received a point: '+p);
const graph=new Map();for(const seq of d.sequences){assert(seq.refs.length);assert.equal(new Set(seq.ids).size,seq.ids.length);seq.ids.forEach((id,i)=>{assert(ids.has(id));if(i){if(!graph.has(seq.ids[i-1]))graph.set(seq.ids[i-1],new Set());graph.get(seq.ids[i-1]).add(id);}});}
const visiting=new Set(),done=new Set();function visit(id){assert(!visiting.has(id),'Contradictory sequence cycle');if(done.has(id))return;visiting.add(id);for(const next of graph.get(id)||[])visit(next);visiting.delete(id);done.add(id);}ids.forEach(visit);
assert(!graph.has('sun')&&!graph.has('beast'),'Uncertain pair forced into a sequence');
const runtime=fs.readFileSync(__dirname+'/runtime.js','utf8');
const sandbox={FUTURE_CATALOG:d,fl:x=>x.en,futureState:{filter:'major',query:'',selected:'dajjal'},futureById:new Map(d.events.map(e=>[e.id,e]))};
vm.createContext(sandbox);vm.runInContext(runtime.slice(runtime.indexOf('function futureSequence'),runtime.indexOf('function futureRef')),sandbox);
assert.equal(sandbox.futureItems().length,10);sandbox.futureState.filter='historical';assert(sandbox.futureItems().every(e=>e.group==='historical'));
sandbox.futureState.filter='all';sandbox.futureState.query='Tiberias';assert(sandbox.futureItems().some(e=>e.id==='yajuj'));sandbox.futureState.query='__NO_MATCH__';assert.equal(sandbox.futureItems().length,0);
sandbox.futureState.filter='seq:isa';sandbox.futureState.query='';assert.equal(sandbox.futureItems().map(e=>e.id).join(','),'dajjal,isa,ludd,yajuj,yajuj-end,wind');
const html=fs.readFileSync('index.html','utf8');for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
assert(html.includes("document.body.classList.contains('future-mode') || e.defaultPrevented"));assert(html.includes('if(cameraVersion!==cameraAnimationVersion)return;'));assert(!/<a(?=\s|>)|\bhref=|window\.open\(/.test(html.replace(/<link rel="icon"[^>]*>/g,'').replace(/<a class="contact-email" href="mailto:lfc@legacyfidelity\.com\?subject=Chronograph">lfc@legacyfidelity\.com<\/a>/g,'')));
const translate=require('../i18n/core.js').createChronographTranslator(require('../i18n/compiled-messages.json'));
for(const lang of ['en','ky']){const result=translate('≈699 г. х. · Осман I · традиционная точка начала Османского государства',lang);assert(!result.includes('традиционная'),result);}
console.log(JSON.stringify({events:ids.size,majorSigns:keys.size,references:refs.size,places:Object.keys(d.places).length,sequences:d.sequences.length,status:'PASS: schema, translations, sequence graph, filters, uncertain places, calendar preservation, syntax, sources'}));

assert(!('review' in d));assert(!html.includes('futureReview'));assert(!/2269|4084|4286/.test(JSON.stringify(d)));assert(d.events.find(e=>e.id==='battle').title.ru.includes('Аль-Мальхама'));

for(const ref of refs){const t=d.hadithTexts[ref];assert(t&&t.arabic.length>100,'Missing original: '+ref);assert(!/[A-Za-z]|||…/.test(t.arabic),'Contaminated original: '+ref);assert(t.source.startsWith('https://sunnah.com/'));}assert.equal(Object.keys(d.hadithTexts).length,refs.size);
for(const event of d.events){const q=event.quote;assert(q&&event.refs.includes(q.ref),'Missing quote '+event.id);assert(d.hadithTexts[q.ref].arabic.includes(q.arabic),'Quote differs from original '+event.id);for(const lang of ['ru','en','ky'])assert(q.translation[lang]?.trim(),'Missing meaning '+event.id+' '+lang);assert(!/[А-Яа-я]/.test(q.translation.en),'Untranslated English '+event.id);}
assert(!runtime.includes('const context='));assert(!html.includes('Шаги соединены по указанному хадису'));
assert(runtime.indexOf("quote.className='future-quote'")<runtime.indexOf("where.className='future-places'"),'Quotation must lead the card');
assert(runtime.includes("const quote=document.createElement('section')"),'Quotation cannot be hidden in a disclosure');
