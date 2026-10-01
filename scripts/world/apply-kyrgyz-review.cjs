'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'../..'),file=path.join(root,'src/atlas.html');
let html=fs.readFileSync(file,'utf8');
const d=vm.runInNewContext(html.slice(html.indexOf('const S ='),html.indexOf('function resampleRing'))+';({EMPIRES,KYRGYZ_STAGES})');
const review=require('./kyrgyz-review.cjs'),result=review.revise(d.EMPIRES,d.KYRGYZ_STAGES);
for(const [name,value] of [['EMPIRES',result.empires],['KYRGYZ_STAGES',result.stages],['KYRGYZ_MIGRATION_NOTE',result.migration],['KYRGYZ_DEVELOPMENT',result.development]]){
 const expression=new RegExp('const '+name+'\\s*=[^\\n]+');
 if(!expression.test(html))throw Error('Missing '+name);
 html=html.replace(expression,()=>`const ${name}=${JSON.stringify(value)};`);
}
function replaceFunction(name,body){const start=html.indexOf('function '+name+'(');for(let end=html.indexOf('}',start);end>=0;end=html.indexOf('}',end+1)){try{new vm.Script('('+html.slice(start,end+1)+')');}catch{continue;}html=html.slice(0,start)+body.trimEnd()+html.slice(end+1);return;}throw Error(name);}
replaceFunction('renderKyrgyzHistory',fs.readFileSync(path.join(__dirname,'kyrgyz-panel.js'),'utf8'));
const pointerCode=fs.readFileSync(path.join(__dirname,'kyrgyz-pointer.js'),'utf8');
if(html.includes('function bindKyrgyzPointer('))replaceFunction('bindKyrgyzPointer',pointerCode);
else html=html.replace('function renderEmpires(',()=>pointerCode+'\nfunction renderEmpires(');
if(!html.includes('p.dataset.empire=emp.id;bindKyrgyzPointer(p,emp);'))html=html.replace('p.dataset.empire=emp.id;','p.dataset.empire=emp.id;bindKyrgyzPointer(p,emp);');
if(!html.includes('dep.dataset.empire=emp.id;bindKyrgyzPointer(dep,emp);'))html=html.replace('dep.dataset.empire=emp.id;','dep.dataset.empire=emp.id;bindKyrgyzPointer(dep,emp);');
// Keep the full reach readable at normal zoom; scope the stronger styling to
// this reconstruction and preserve the global opacity control.
html=html.replace("dep.setAttribute('fill-opacity',Math.min(.2,overlayOpacity*.5));", "dep.setAttribute('fill-opacity',emp.id==='kyrgyzKhaganate'?Math.min(.36,overlayOpacity*.72):Math.min(.2,overlayOpacity*.5));");
html=html.replace("p.dataset.empire=emp.id;bindKyrgyzPointer(p,emp);", "p.dataset.empire=emp.id;bindKyrgyzPointer(p,emp);"+(html.includes("p.classList.add('kyrgyz-heartland')")?'':"if(emp.id==='kyrgyzKhaganate')p.classList.add('kyrgyz-heartland');"));
if(!html.includes('id="kyrgyzScope"'))html=html.replace('<div id="mongolScope"', '<div id="kyrgyzScope" hidden><strong>Расцвет IX века · реконструкция</strong><span><i class="core"></i>Енисейско-Саянское ядро</span><span><i></i>Военно-политический охват · IX век</span></div><div id="mongolScope"');
if(!html.includes("$('kyrgyzScope').hidden="))html=html.replace("const scope=$('mongolScope');", "$('kyrgyzScope').hidden=y<840||y>=924||!layerState.empires;\n  const scope=$('mongolScope');");
if(!html.includes("$('kyrgyzScope').hidden=year<840"))html=html.replace("empireLayer.classList.toggle('hidden-layer',!layerState.empires);", "$('kyrgyzScope').hidden=year<840||year>=924||!layerState.empires;\n  empireLayer.classList.toggle('hidden-layer',!layerState.empires);");
if(!html.includes("if(emp.id==='kyrgyzKhaganate'&&y>=840&&y<924)return"))html=html.replace('function frameCaption(emp,y){', "function frameCaption(emp,y){\n  if(emp.id==='kyrgyzKhaganate'&&y>=840&&y<924)return 'Внешний контур: обобщённый военно-политический охват расцвета IX века; сопоставлен с реконструкцией около 860 года.';");
html=html.replace('if(doFocus){ const [lon,lat,z]=emp.focus; focusLonLat(lon,lat,z); }\n}', 'if(doFocus){ const [lon,lat,z]=emp.focus; focusLonLat(lon,lat,z); }\n  updateKyrgyzSymbols();\n}');
const symbols=fs.readFileSync(path.join(__dirname,'kyrgyz-symbols.js'),'utf8');
if(html.includes('function updateKyrgyzSymbols('))replaceFunction('updateKyrgyzSymbols',symbols);
else html=html.replace('function renderKyrgyzRoutes(',()=>symbols+'\nfunction renderKyrgyzRoutes(');
if(!html.includes("svg.classList.toggle('city-mode',mapState.scale>=2.05);\n  updateKyrgyzSymbols();"))html=html.replace("svg.classList.toggle('city-mode',mapState.scale>=2.05);","svg.classList.toggle('city-mode',mapState.scale>=2.05);\n  updateKyrgyzSymbols();");
// Routes are schematic and period-limited. They must not become permanent
// migrations, and the campaign endpoint is the known site of Ordu-Baliq.
html=html.replace('r=d.route;if(!r)return;','r=d.route;if(!r || (r.to && y>r.to))return;');
html=html.replace('yeniseiKyrgyz:[0,-12],kyrgyzKhaganate:[0,-16],kyrgyzMongol:[0,-14]','yeniseiKyrgyz:[0,0],kyrgyzKhaganate:[0,0],kyrgyzMongol:[0,0]');
html=html.replace("switchPanel('regions');renderYear(year);focusLonLat(...kyrgyzHistoryForYear(year).view);", "switchPanel('regions');renderYear(year);$('panel-regions').scrollTop=0;focusLonLat(...kyrgyzHistoryForYear(year).view);");
html=html.replace('t.textContent=d.title;g.appendChild(t);','t.textContent=r.label||d.title;g.appendChild(t);\n if(r.endLabel){const end=t.cloneNode(),b=pts.at(-1);end.setAttribute("x",b[0]);end.setAttribute("y",b[1]+12);end.textContent=r.endLabel;g.appendChild(end);}');
html=html.replace("t.textContent=r.label||d.title;g.appendChild(t);","t.textContent=r.label||d.title;t.dataset.baseY=a[1];t.dataset.offset=-30;g.appendChild(t);");
html=html.replace('end.textContent=r.endLabel;g.appendChild(end);','end.textContent=r.endLabel;end.dataset.baseY=b[1];end.dataset.offset=20;g.appendChild(end);');
html=html.replace('t.dataset.offset=-30;g.appendChild(t);',"t.dataset.offset=-30;t.setAttribute('visibility',r.endLabel?'hidden':'visible');g.appendChild(t);");
html=html.replace('end.dataset.offset=20;g.appendChild(end);',"end.dataset.offset=20;end.setAttribute('visibility','visible');g.appendChild(end);");
if(!html.includes('renderKyrgyzRoutes(year); updateKyrgyzSymbols();'))html=html.replace('renderKyrgyzRoutes(year);','renderKyrgyzRoutes(year); updateKyrgyzSymbols();');
html=html.replace("kyrgyzMongol:['yuanShi']","kyrgyzMongol:['yuanShi','rashid']");
html=html.replace("work:'Juan 17, 18, 58, 63, 87, 128'","work:'Juan 17, 18, 58, 63, 87, 128, 167'");
// Keep the event panel and map banner in sync with the regional history cards.
const es=html.indexOf('const EVENTS = {'),ee=html.indexOf('function ceToAHApprox');
const eventData=vm.runInNewContext(html.slice(es,ee)+';({EVENTS,PEOPLE,PLACES})'),events=eventData.EVENTS;
const titles=JSON.parse(fs.readFileSync(path.join(root,'scripts/i18n/events.json'),'utf8'));
const descriptions=JSON.parse(fs.readFileSync(path.join(root,'scripts/i18n/event-descriptions.json'),'utf8'));
const dictionary=[...review.messages,...require('../i18n/history-messages.json')];
for(const s of result.stages.filter(s=>[840,847,860,1207,1218,1270,1273,1293].includes(s.year))){
 const prior=events[s.year]||{ah:'≈'+Math.round((s.year-622)*33/32)+' г. х.',type:'Мировой контекст',place:'Саяно-Енисейский регион',world:[]};
 events[s.year]={...prior,title:s.title,desc:s.text,coord:s.year===840?[102.66,47.43]:s.year===860?[108.94,34.34]:[92.5,53.6],zoom:4.2};
 titles[s.year]=[...dictionary.find(r=>r[0]===s.title).slice(1),...dictionary.find(r=>r[0]===s.text).slice(1)];
 delete descriptions[s.year];
}
html=html.slice(0,es)+'const EVENTS = '+JSON.stringify(events)+';\nconst PEOPLE = '+JSON.stringify(eventData.PEOPLE)+';\nconst PLACES = '+JSON.stringify(eventData.PLACES)+';\n\n'+html.slice(ee);
fs.writeFileSync(path.join(root,'scripts/i18n/events.json'),JSON.stringify(titles,null,2)+'\n');
fs.writeFileSync(path.join(root,'scripts/i18n/event-descriptions.json'),JSON.stringify(descriptions,null,2)+'\n');
fs.writeFileSync(file,html);
fs.writeFileSync(path.join(root,'scripts/i18n/kyrgyz-messages.json'),JSON.stringify(review.messages,null,2)+'\n');
console.log(JSON.stringify({reviewed:['yeniseiKyrgyz','kyrgyzKhaganate','kyrgyzMongol'],stages:result.stages.length,messages:review.messages.length}));
