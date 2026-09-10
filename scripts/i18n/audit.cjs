const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const h=fs.readFileSync(fs.existsSync('src/atlas.html')?'index.html':'outputs/chronograph_1_1.html','utf8');
const rows=JSON.parse(fs.readFileSync(__dirname+'/compiled-messages.json','utf8'));
const t=require('./core.js').createChronographTranslator(rows);
function fn(name){const start=h.indexOf('function '+name+'(');assert(start>=0,name);for(let end=h.indexOf('}',start);end>=0;end=h.indexOf('}',end+1)){const s=h.slice(start,end+1);try{new vm.Script('('+s+')');return s}catch{}}throw Error(name);}
const remaining=new Set(),els=new Map();let checks=0;
function add(x){if(typeof x==='string'){for(const s of x.split(/<[^>]*>/)){const v=s.trim();if(!v||!/[А-Яа-яЁё]/.test(v))continue;checks++;const en=t(v,'en');if(/[А-Яа-яЁё]/.test(en))remaining.add(v);assert.equal(t(v,'ru'),v);assert(t(v,'ky').trim());}}}
function element(id){if(!els.has(id))els.set(id,new Proxy({classList:{add(){},remove(){},toggle(){}},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},setAttribute(k,v){add(v)}},{set(o,k,v){if(k==='innerHTML'||k==='textContent')add(v);o[k]=v;return true}}));return els.get(id);}
const ctx=vm.createContext({$:element,document:{querySelectorAll(){return []}},stopPlay(){},switchPanel(){},year:610});
const functions=['getCAHtml','getShiftText','caEraData','kyrgyzHistoryForYear','worldStateForYear','chinaStateForYear','ceToAHApprox','activeEvent','renderSide','renderCAEra','renderKyrgyzHistory','openAbout','openStar','starDates','starsLeadText','showModernKyrgyzCard','sourceMeta','sourceBundleHtml','layerConfidence','frameCaption','frameFor','selectEmpire'];
vm.runInContext(h.slice(h.indexOf('const S ='),h.indexOf('function resampleRing'))+h.slice(h.indexOf('const EVENTS = {'),h.indexOf('function ceToAHApprox'))+h.slice(h.indexOf('const ISLAM_STARS = ['),h.indexOf('function starsByGroupForYear'))+h.slice(h.indexOf('const SOURCE_LIBRARY='),h.indexOf('function sourceKindLabel'))+functions.filter(n=>!['openStar','starDates'].includes(n)).map(fn).join('\n')+'\nglobalThis.data={EMPIRES,EVENTS,PLACES,ISLAM_STARS,renderSide,activeEvent,openAbout,openStar,starDates,starsLeadText,showModernKyrgyzCard,selectEmpire};',ctx);
const d=ctx.data;
for(let y=610;y<=1299;y++){ctx.year=y;d.renderSide(y,d.activeEvent(y));add(d.starsLeadText(y));for(const emp of d.EMPIRES)if(y>=emp.from&&y<=emp.to)d.selectEmpire(emp.id);}
for(const p of d.ISLAM_STARS){d.openStar(p);add(d.starDates(p));}
d.openAbout();d.showModernKyrgyzCard();
for(const p of Object.values(d.PLACES)){add(p.name);add(p.kind);}
fs.writeFileSync(__dirname+'/audit-remaining.json',JSON.stringify([...remaining],null,2));
console.log(JSON.stringify({checks,years:690,empires:d.EMPIRES.length,stars:d.ISLAM_STARS.length,remaining:remaining.size}));
if(remaining.size)console.log([...remaining].slice(0,35));
process.exitCode=remaining.size?1:0;

