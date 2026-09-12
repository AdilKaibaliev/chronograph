const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname;
const repositoryBuild=fs.existsSync('src/atlas.html');
const source=fs.readFileSync(repositoryBuild?'src/atlas.html':'publish/index.html','utf8');
const events=vm.runInNewContext(source.slice(source.indexOf('const EVENTS = {'),source.indexOf('function ceToAHApprox'))+';EVENTS');
const empires=vm.runInNewContext(source.slice(source.indexOf('const S ='),source.indexOf('function resampleRing'))+';EMPIRES');
const rows=JSON.parse(fs.readFileSync(root+'/messages.json','utf8'));
rows.push(...Object.entries(JSON.parse(fs.readFileSync(root+'/names.json','utf8'))).map(([ru,en])=>[ru,en,ru]));
rows.push(['Праведные халифы','Rashidun caliphs','Туура жолдогу халифтер'],['Осман I','Osman I','Осмон I'],['Звезды Ислама','Stars of Islam','Ислам жылдыздары']);
const empireTexts={...JSON.parse(fs.readFileSync(root+'/empires-1.json','utf8')),...JSON.parse(fs.readFileSync(root+'/empires-2.json','utf8'))};
for(const empire of empires){const d=empireTexts[empire.id];assert(d&&d.length===8,empire.id);['name','short','body','territories'].forEach((field,i)=>rows.push([empire[field],d[i*2],d[i*2+1]]));}
const translatedEvents=JSON.parse(fs.readFileSync(root+'/events.json','utf8'));
const additionalDescriptions=JSON.parse(fs.readFileSync(root+'/event-descriptions.json','utf8'));
for(const [year,descriptions] of Object.entries(additionalDescriptions))translatedEvents[year]=[...translatedEvents[year].slice(0,2),...descriptions];
for(const [year,event] of Object.entries(events)){
 const entry=translatedEvents[year];assert(entry,'Missing event title '+year);
 rows.push([event.title,entry[0],entry[1]]);
 if(entry.length===4)rows.push([event.desc,entry[2],entry[3]]);
}
const remaining=JSON.parse(fs.readFileSync(root+'/remaining-base.json','utf8'));
for(const file of ['remaining-0.txt','remaining-1.txt','remaining-2.txt'])for(const line of fs.readFileSync(root+'/'+file,'utf8').trim().split(/\r?\n/)){const [i,en,ky]=line.split('|');assert(remaining[+i]&&en&&ky,line);rows.push([remaining[+i],en,ky]);}
rows.push(...JSON.parse(fs.readFileSync(root+'/supplement.json','utf8')));
const auditBase=JSON.parse(fs.readFileSync(root+'/audit-base.json','utf8'));
for(const [i,pair] of Object.entries(JSON.parse(fs.readFileSync(root+'/audit-translations.json','utf8'))))rows.push([auditBase[+i],...pair]);
for(const row of rows)row[2]=row[2].replaceAll('Енисей','Энесай').replaceAll('енисей','энесай');
const biographies=require('../biographies.cjs');
const details=vm.runInNewContext(source.slice(source.indexOf('const STAR_DETAILS='),source.indexOf('const STAR_GROUP_HELP='))+';STAR_DETAILS');
const stars=vm.runInNewContext(source.slice(source.indexOf('const ISLAM_STARS = ['),source.indexOf('const STAR_DETAILS='))+';ISLAM_STARS');
for(const [name,article,ru,en,ky] of biographies){
 assert(stars.some(p=>p.name===name),'Unknown biography '+name);
 assert(ru&&en&&ky&&article,'Incomplete biography '+name);
 const sourceText='TDV İslâm Ansiklopedisi, статья «'+article+'».';
 details[name]={...details[name],text:ru,source:sourceText};
 rows.push([ru,en,ky],[sourceText,'TDV İslâm Ansiklopedisi, article “'+article+'”.','TDV İslâm Ansiklopedisi, «'+article+'» макаласы.']);
}
for(const row of require('../biography-notes.cjs')){details[row[0]].note=row[1];rows.push(row.slice(1));}
assert.equal(new Set(biographies.map(r=>r[0])).size,biographies.length,'Duplicate biography');
assert.equal(Object.keys(details).length,stars.length);
for(const p of stars)assert(details[p.name]?.text&&details[p.name]?.source,'Missing biography '+p.name);
const {createChronographTranslator}=require('./core.js');createChronographTranslator(rows);
let html=source.replaceAll('CHRONOGRAPH 1.0 RC3.8','CHRONOGRAPH 1.3');
html=html.slice(0,html.indexOf('const STAR_DETAILS='))+'const STAR_DETAILS='+JSON.stringify(details).replaceAll('<','\\u003c')+';\n'+html.slice(html.indexOf('const STAR_GROUP_HELP='));
html=html.replace("$('compareWorld').textContent=(e.world||[]).map(w=>`${w[1]}: ${w[2]}`).join(' ')","$('compareWorld').innerHTML=(e.world||[]).map(w=>`<span>${w[1]}</span>: <span>${w[2]}</span>`).join(' ')");
html=html.replace("getShiftText(y).replace(/<[^>]+>/g,'')","getShiftText(y)");
html=html.replace('${frameCaption(emp,year)} Прямая власть, дань и политическое влияние показаны разными типами слоёв.','<span>${frameCaption(emp,year)}</span> <span>Прямая власть, дань и политическое влияние показаны разными типами слоёв.</span>');
html=html.replace('<div class="top-actions">','<div class="top-actions"><select id="languageSelect" aria-label="Язык сайта"><option value="ru" lang="ru">Русский</option><option value="en" lang="en">English</option><option value="ky" lang="ky">Кыргызча</option></select>');
html=html.replace('</style>',`\n#languageSelect{font:inherit;color:#eadbc1;background:#252218;border:1px solid #675b40;border-radius:8px;max-width:112px;padding:6px}#languageSelect:focus-visible{outline:2px solid #dfbe79}#translationNotice{flex:none;margin:0;padding:5px 12px;font-size:10px;line-height:1.3;color:#e3c994;background:#302a1e}html[lang=en] .brand-sub,html[lang=ky] .brand-sub{font-size:9px}@media(max-width:700px){.top-actions{gap:3px}#languageSelect{max-width:87px;padding:4px;font-size:10px}.top-actions .btn{font-size:9px;padding:5px 7px}#translationNotice{font-size:9px;padding:3px 10px}}\n</style>`);
const core=fs.readFileSync(root+'/core.js','utf8').replace("if(typeof module!=='undefined')module.exports={createChronographTranslator};",'');
html=html.replace('// Init\n',core+'\nconst CHRONOGRAPH_MESSAGES='+JSON.stringify(rows).replaceAll('<','\\u003c')+';\n// Init\n');
const ending=html.lastIndexOf('})();');assert(ending>0);
const future=require('../future/catalog.cjs');
html=html.slice(0,ending)+'let futureLocationHook=null;\n'+fs.readFileSync(root+'/runtime.js','utf8')+'\nconst FUTURE_CATALOG='+JSON.stringify(future).replaceAll('<','\\u003c')+';\n'+fs.readFileSync(root+'/../future/runtime.js','utf8')+'\n'+html.slice(ending);
html=html.replace('</style>',fs.readFileSync(root+'/../future/style.css','utf8')+'\n</style>');
html=html.replace('function animateCamera(target, duration=700){','let cameraAnimationVersion=0;\nfunction animateCamera(target, duration=700){\n  const cameraVersion=++cameraAnimationVersion;');
html=html.replace('function frame(now){','function frame(now){\n    if(cameraVersion!==cameraAnimationVersion)return;');
html=html.replace("if(e.defaultPrevented || $('modal').classList.contains('show') || e.target.closest('input,button,a,summary", "if(document.body.classList.contains('future-mode') || e.defaultPrevented || $('modal').classList.contains('show') || e.target.closest('input,select,button,a,summary");
for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
assert(html.includes('const CHRONOGRAPH_MESSAGES='));assert(!/<a(?=\s|>)|\bhref=|window\.open\(/.test(html));
fs.writeFileSync(repositoryBuild?'index.html':'outputs/chronograph_1_1.html',html);
fs.writeFileSync(root+'/compiled-messages.json',JSON.stringify(rows,null,2));
console.log(JSON.stringify({messages:rows.length,eventTitles:Object.keys(translatedEvents).length,eventDescriptions:Object.values(translatedEvents).filter(x=>x.length===4).length,bytes:Buffer.byteLength(html)}));
