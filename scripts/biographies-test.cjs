const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),h=fs.readFileSync(path.join(root,'index.html'),'utf8');
const rows=require('./i18n/compiled-messages.json'),t=require('./i18n/core.js').createChronographTranslator(rows);
let focused=0;const classes=new Set(),box={scrollTop:200},body={innerHTML:''};
const modal={classList:{contains:x=>classes.has(x),add:x=>classes.add(x)},querySelector:()=>box};
const els={modal,modalBody:body,modalClose:{focus(){focused++;}}};
const ctx=vm.createContext({$:id=>els[id],stopPlay(){},year:640});
vm.runInContext(h.slice(h.indexOf('const ISLAM_STARS = ['),h.indexOf('function starsByGroupForYear'))+';globalThis.data={ISLAM_STARS,STAR_DETAILS,openStar,starDates};',ctx);
const {ISLAM_STARS:people,STAR_DETAILS:details,openStar,starDates}=ctx.data;
const expectedCount=57+require('./late/biographies.cjs').length+require('./early/biographies.cjs').length+require('./to1789/biographies.cjs').length;
assert.equal(people.length,expectedCount);assert.equal(new Set(people.map(p=>p.name)).size,expectedCount);assert.equal(Object.keys(details).length,expectedCount);
for(const p of people){
 const d=details[p.name];assert(d.text.length>=70,p.name+' needs an individual biography');assert(d.source.includes('TDV İslâm Ansiklopedisi'),p.name+' source');
 for(const lang of ['ru','en','ky']){assert(t(d.text,lang).length>=50,p.name+lang);if(lang!=='ru')assert.notEqual(t(d.text,lang),d.text,p.name+lang);}
 ctx.year=Math.min(1789,Math.max(610,(p.birth??p.knownBy)+25));box.scrollTop=200;openStar(p);
 assert(body.innerHTML.includes(d.text)&&body.innerHTML.includes(d.source),p.name+' rendered');assert(body.innerHTML.includes(starDates(p)),p.name+' dates');
 assert(!/ещё не добавлена|undefined|<a\b|href=/.test(body.innerHTML),p.name+' placeholder');assert.equal(box.scrollTop,0);
 const indexes=[...body.innerHTML.matchAll(/data-bio-index="(\d+)"/g)].map(m=>+m[1]);
 const expected=people.flatMap((q,i)=>q!==p&&ctx.year>=(q.birth??q.knownBy)&&ctx.year<=q.death?[i]:[]);
 assert.equal(JSON.stringify(indexes),JSON.stringify(expected),p.name+' contemporary navigation');
}
classes.clear();focused=0;openStar(people[0]);assert.equal(focused,0,'Opening leaves original focus for modal observer to capture');openStar(people[1]);assert.equal(focused,1,'Navigating focuses stable close control');
for(const [name,birth] of [['ан-Насаи',830],['ан-Навави',1234],['Икрима, мауля Ибн Аббаса',642],['Малик ибн Анас',712],['Муджахид ибн Джабр',642],['Таус ибн Кайсан',653],['Саад ибн Абу Ваккас',592]])assert.equal(people.find(p=>p.name===name).birth,birth);
assert(h.includes("$('modalBody').addEventListener('click'"));
console.log('PASS: '+expectedCount+' individual biographies and plain-text sources in 3 languages; all contemporary buttons, dates, scroll reset and focus transitions.');
