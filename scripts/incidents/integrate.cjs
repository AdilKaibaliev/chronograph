'use strict';
// Convert the researched records into the atlas's ordinary event catalogue.
const catalogue=require('./catalog.cjs'),registry=require('./registry.json');
const labels={coup:['Переворот','Coup','Төңкөрүш'],attempt:['Попытка переворота','Coup attempt','Төңкөрүш аракети'],conspiracy:['Заговор','Conspiracy','Кутум']};
const regions={africa:'DZ AO BJ BF BI CM CF TD KM CG CI CD DJ EG GQ ER ET GA GM GH GN GW KE LS LR LY MG MW ML MR MA MZ NE NG RW ST SN SC SL SO SS SD SZ TZ TG TN UG ZM ZW',north:'US MX CA CR CU DM DO SV GD GT HT HN JM NI PA TT',south:'AR BO BR CL CO EC GY PY PE SR UY VE',oceania:'FJ PG SB VU'};
function region(iso){return Object.entries(regions).find(([,codes])=>codes.split(' ').includes(iso))?.[0]||'eurasia';}
const sources=Object.fromEntries(Object.entries(catalogue.sources).map(([id,s])=>['incident-'+id,{title:s.title}]));
sources['incident-cline']={title:registry.provenance.authors+'. '+registry.provenance.title+', v'+registry.provenance.version+' (2026). University of Illinois. '+registry.provenance.license+'. DOI: '+registry.provenance.doi};
const events=catalogue.stories.flatMap(story=>story.steps.map((step,index)=>{
 const place=catalogue.places[step.place],year=+step.date.slice(0,4);
 const referenceOnly=['poland','ussr-west','kosovo','afghanistan','libya'].includes(step.place)||['kyrgyzstan-2005:0','kyrgyzstan-2010:2','kyrgyzstan-2020:0'].includes(story.id+':'+index);
 return {id:'incident-'+story.id+'-'+index,from:year,to:year,year,date:step.date,region:step.place==='libya'?'africa':'eurasia',kind:['war','intervention'].includes(story.kind)?'war':'politics',incidentKind:step.kind||story.kind,coord:place.coord,place:place.name,title:step.title.map((t,i)=>story.title[i]+' · '+t),text:step.text,sources:story.sources.map(id=>'incident-'+id),approx:false,epicentre:!referenceOnly,referenceOnly};
}));
for(const record of registry.records){
 const country=registry.countries[record.country],year=+record.date.slice(0,4),label=labels[record.kind];
 events.push({id:'cline-'+record.id,from:year,to:year,year,date:record.date,region:region(country.iso),kind:'politics',incidentKind:record.kind,coord:country.coord,place:country.name,title:label.map((s,i)=>country.name[i]+' · '+s),text:[
  record.date+' · '+country.name[0]+'. Классификация Cline Center: '+label[0].toLowerCase()+'. Запись '+record.id+'. На карте указан ориентир страны; точное место в реестре не задано.',
  record.date+' · '+country.name[1]+'. Cline Center classification: '+label[1].toLowerCase()+'. Record '+record.id+'. The map locates the country; the registry does not specify an exact site.',
  record.date+' · '+country.name[2]+'. Cline Center классификациясы: '+label[2].toLowerCase()+'. Жазуу '+record.id+'. Картада өлкөнүн багыт белгиси берилген; реестрде так жер көрсөтүлгөн эмес.'
 ],sources:['incident-cline'],approx:false,referenceOnly:true,sourceRecord:record.id});
}
module.exports={events,sources,timelineMax:2026,politicalMax:2026};
