'use strict';
const G=require('./cartography-geometry.cjs');
module.exports=function(c,{source,revise,D}){
 const id='vancouverIslandTransfers';
 source(id,'Treaty with Great Britain (Oregon Treaty), 15 June 1846, Article I; BC Laws, Pre-Confederation BC Statutes, explanatory note; Canadian Heritage, Historical boundaries of Canada.',[
  'https://www.govinfo.gov/content/pkg/STATUTE-9/pdf/STATUTE-9-Pg869.pdf',
  'https://www.bclaws.gov.bc.ca/civix/document/id/hstats/hstats/explanatory%20note%20pre-confederation%20bc%20statutes%201869',
  'https://www.canada.ca/en/canadian-heritage/services/historical-boundaries-canada.html'
 ]);
 // Use the atlas's shared Natural Earth coastline, including Victoria south
 // of 49N. The treaty leaves the whole island on the British side; it does
 // not partition it at the mainland parallel or settle Indigenous title.
 const ring=require('./land-coasts.json').find(r=>G.inside(r,[-125.5,49.5]));
 if(!ring||!G.inside(ring,[-123.4,48.43]))throw Error('Vancouver Island coastline missing');
 const island=G.union([ring]);
 revise(['1789-great-britain'],1846,1919,'vancouver-island-british-treaty-side',id,p=>G.merge([p,island]));
 revise(['1789-canada'],1871,2027,'vancouver-island-confederation-1871',id,p=>G.merge([p,island]));
 revise(['1789-usa','1848-oregon'],1846,2027,'vancouver-island-excluded-from-us-oregon',id,p=>D(p,island));
 const H=require('./late-helpers.cjs')(c,{start:610,max:2026}),L=s=>s.split('|');
 const rows=[
  [1846,'Орегонский договор · остров Ванкувер|Oregon Treaty · Vancouver Island|Орегон келишими · Ванкувер аралы','Договор от 15 июня проводит границу по 49-й параллели до проливов. Весь остров Ванкувер остаётся на британской стороне, включая его южную часть.|The treaty of 15 June extends the boundary along the 49th parallel to the straits. All of Vancouver Island remains on the British side, including its southern part.|15-июндагы келишим чек араны 49-параллель боюнча кысыктарга чейин өткөрөт. Ванкувер аралы толугу менен, анын ичинде түштүк бөлүгү да, Британия тарабында калат.'],
  [1849,'Колония острова Ванкувер|Colony of Vancouver Island|Ванкувер аралынын колониясы','Учреждена британская колония острова Ванкувер со столицей в Виктории.|The British colony of Vancouver Island is established, with its capital at Victoria.|Борбору Виктория болгон Британиянын Ванкувер аралындагы колониясы түзүлөт.'],
  [1866,'Объединение колоний Британской Колумбии|Union of the British Columbia colonies|Британ Колумбиясынын колонияларынын биригиши','Колонии острова Ванкувер и материковой Британской Колумбии объединяются. В 1868 году столицу объединённой колонии переносят из Нью-Уэстминстера в Викторию.|Vancouver Island and mainland British Columbia unite as one colony. In 1868 its capital moves from New Westminster to Victoria.|Ванкувер аралы менен материктеги Британ Колумбиясы бир колонияга биригет. 1868-жылы анын борбору Нью-Уэстминстерден Викторияга көчүрүлөт.']
 ];
 for(const[y,title,text]of rows)H.event('vancouver-island-'+y,y,'1789-great-britain','politics',[-123.4,48.43],L(title),L(text),[id],{region:'north'});
 const accession=c.events.find(e=>e.id==='canada-transfer-1871');
 accession.text=L('20 июля Британская Колумбия, включая остров Ванкувер, становится шестой провинцией Канады.|On 20 July British Columbia, including Vancouver Island, becomes Canada’s sixth province.|20-июлда Британ Колумбиясы, анын ичинде Ванкувер аралы, Канаданын алтынчы провинциясы болот.');
 accession.sources=[...new Set([...accession.sources,id])];
};
