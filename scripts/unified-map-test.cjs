const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const h=fs.readFileSync('src/atlas.html','utf8');
function fn(name){const s=h.indexOf('function '+name+'(');for(let e=h.indexOf('}',s);e>=0;e=h.indexOf('}',e+1)){try{new vm.Script('('+h.slice(s,e+1)+')');return h.slice(s,e+1);}catch{}}throw Error(name);}
const ctx=vm.createContext({});vm.runInContext(h.slice(h.indexOf('const S ='),h.indexOf('function resampleRing'))+fn('frameFor')+';globalThis.api={EMPIRES,MONGOL_IDS,displayEmpiresForYear,mongolRealmForYear,empireStatesForYear};',ctx);const d=ctx.api;
for(let y=610;y<=1299;y++){
 const normal=d.empireStatesForYear(y),shown=d.displayEmpiresForYear(y),members=normal.filter(e=>d.MONGOL_IDS.includes(e.id));
 if(y<1206){assert(!shown.some(e=>e.id==='mongolRealm'));continue;}
 const realm=shown.find(e=>e.id==='mongolRealm');assert(realm);assert(!shown.some(e=>d.MONGOL_IDS.includes(e.id)),'Duplicate Mongol layers '+y);
 assert.equal(realm.polys.length,members.filter(e=>e.type!=='influence').reduce((n,e)=>n+e.polys.length,0));
 assert.equal(realm.dependentPolys.length,members.filter(e=>e.type==='influence').reduce((n,e)=>n+e.polys.length,0));
 for(const r of [...realm.polys,...realm.dependentPolys]){let a=0;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length];a+=p[0]*q[1]-q[0]*p[1];}assert(a>0,'Opposite ring winding causes false holes');}
 assert.equal(realm.name,y<1260?'Монгольская империя':'Монгольская империя и улусы');
}
vm.runInContext('showMongolUluses=true',ctx);assert(d.displayEmpiresForYear(1279).some(e=>e.id==='yuan'));assert(!d.displayEmpiresForYear(1279).some(e=>e.id==='mongolRealm'));
const k=d.EMPIRES.find(e=>e.id==='kyrgyzKhaganate');assert.equal(k.to,923);assert(k.corePolys.length);const ring=k.keyframes[0].polys[0];assert(Math.min(...ring.map(p=>p[0]))<=83);assert(Math.max(...ring.map(p=>p[0]))>=116);assert.equal(k.type,'influence');
assert(h.includes('.unified-mongol{stroke:none!important}'));assert(h.includes('body.future-mode #mongolScope'));assert(h.includes('fill-rule'));assert(h.includes('kyrgyz-core'));
const t=require('./i18n/core.js').createChronographTranslator(JSON.parse(fs.readFileSync('scripts/i18n/compiled-messages.json','utf8')));
for(const s of [d.mongolRealmForYear(1258),d.mongolRealmForYear(1279),k])for(const key of ['name','short','body','territories']){assert(!/[А-Яа-яЁё]/.test(t(s[key],'en')),key);assert(t(s[key],'ky'));}
console.log('PASS: unified/detailed modes across 690 years, dated extent preserved, consistent winding, no duplicate ulus paths, post-1260 label, Kyrgyz core/influence distinction, RU/EN/KY.');
