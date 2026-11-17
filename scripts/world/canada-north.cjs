'use strict';
const G=require('./cartography-geometry.cjs'),ref=require('./canada-north-reference.json');
module.exports=function(c,{source,revise,D,I,U}){
 const id='canadaNorthernTransfers';
 source(id,'Canadian Heritage. Historical boundaries of Canada: transfers of 1870 and 1880; provincial accessions of 1871, 1873 and 1949. Natural Earth, public-domain geographic reference.',[
  'https://www.canada.ca/en/canadian-heritage/services/historical-boundaries-canada.html',
  'https://www.naturalearthdata.com/about/terms-of-use/'
 ]);
 // Repair the missing north only. Keep dated BC/PEI accessions, Labrador,
 // Alaska's coastal strip and Indigenous cultural areas independent.
 const north=G.merge([ref.mainland,ref.islands]);
 const usa=U('United States of America');
 revise(['1789-canada'],1870,1871,'canada-northern-mainland-1870',id,p=>D(G.merge([p,ref.mainland1870]),usa));
 revise(['1789-canada'],1871,1880,'canada-british-columbia-1871',id,p=>D(G.merge([p,ref.mainland]),usa));
 revise(['1789-canada'],1880,1946,'canada-arctic-transfer-1880',id,p=>D(G.merge([p,north]),usa));
 // Before 1919 this catalogue renders the Dominion within the imperial
 // union. Britain's Arctic possessions precede their transfer to Canada.
 revise(['1789-great-britain'],1870,1919,'british-north-america-northern-extent',id,p=>D(G.merge([p,north]),usa));
 // Align the selectable Alaskan territory with the same US reference already
 // used by shared-frontiers for the parent country's coastal strip. This
 // retains the atlas's pre-1903 generalisation, not an adjudicated claim line.
 revise(['1914-alaska'],1867,1946,'alaska-regional-parent-common-edge','sharedNorthernFrontier',p=>I(p,usa));
 const H=require('./late-helpers.cjs')(c,{start:610,max:2026}),L=s=>s.split('|');
 source('canadaRupertBaffin','Attorney General of the Northwest Territories, Supreme Court of Canada, file 37398, intervenor factum, paragraph 1: Rupert’s Land and the North-Western Territory, including southwestern Baffin Island.',[
  'https://scc-csc.gc.ca/pdf/case-documents/37398/FM070_Intervener_Attorney-General-of-Northwest-Territories.pdf'
 ]);
 const rows=[
  [1870,[-114.37,62.45],'Передача северных материковых территорий Канаде|Northern mainland territories transferred to Canada|Түндүктөгү материктик аймактардын Канадага өткөрүлүшү','Земля Руперта и Северо-Западная территория включены в Канаду. Создана провинция Манитоба.|Rupert’s Land and the North-Western Territory enter Canada. The province of Manitoba is created.|Руперт жери жана Түндүк-Батыш аймагы Канадага кирет. Манитоба провинциясы түзүлөт.'],
  [1871,[-123,54],'Британская Колумбия входит в Канаду|British Columbia joins Canada|Британ Колумбиясы Канадага кошулат','Британская Колумбия становится провинцией Канадской конфедерации.|British Columbia becomes a province of the Canadian Confederation.|Британ Колумбиясы Канада конфедерациясынын провинциясы болот.'],
  [1873,[-63.13,46.24],'Остров Принца Эдуарда входит в Канаду|Prince Edward Island joins Canada|Принц Эдуард аралы Канадага кошулат','Островная колония присоединяется к Канадской конфедерации.|The island colony joins the Canadian Confederation.|Аралдагы колония Канада конфедерациясына кошулат.'],
  [1880,[-89,75],'Передача арктических владений Канаде|Arctic possessions transferred to Canada|Арктикадагы ээликтердин Канадага өткөрүлүшү','Британия передаёт Канаде оставшиеся арктические владения и права на острова.|Britain transfers its remaining Arctic possessions and rights to the islands to Canada.|Британия Арктикадагы калган ээликтерин жана аралдарга болгон укуктарын Канадага өткөрөт.'],
  [1949,[-53.7,47.6],'Ньюфаундленд входит в Канаду|Newfoundland joins Canada|Ньюфаундленд Канадага кошулат','Ньюфаундленд становится десятой провинцией Канады.|Newfoundland becomes Canada’s tenth province.|Ньюфаундленд Канаданын онунчу провинциясы болот.']
 ];
 for(const[y,p,title,text]of rows)H.event('canada-transfer-'+y,y,'1789-canada','politics',p,L(title),L(text),[id]);
 H.event('canada-rupert-baffin-1870',1870,'1789-canada','politics',[-76,65],L('Юго-запад Баффиновой Земли · Земля Руперта|Southwestern Baffin Island · Rupert’s Land|Баффин Жеринин түштүк-батышы · Руперт жери'),L('Юго-запад Баффиновой Земли относился к территориям, переданным Канаде в 1870 году вместе с Землёй Руперта.|Southwestern Baffin Island belonged to the territories transferred to Canada with Rupert’s Land in 1870.|Баффин Жеринин түштүк-батышы 1870-жылы Руперт жери менен бирге Канадага өткөрүлгөн аймактарга кирген.'),['canadaRupertBaffin']);
};
