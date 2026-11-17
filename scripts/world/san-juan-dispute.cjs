'use strict';
const G=require('./cartography-geometry.cjs');
module.exports=function(c,{source,revise,D}){
 const src='sanJuanArbitration',id='review-san-juan',H=require('./late-helpers.cjs')(c,{start:610,max:2026}),L=s=>s.split('|');
 source(src,'National Park Service. San Juan Island National Historical Park: The Pig War; Treaty of Washington (1871), San Juan arbitration (1872); Natural Earth, coastline.', ['https://www.nps.gov/sajh/learn/historyculture/the-pig-war.htm']);
 const coast=require('./land-coasts.json'),points=[[-123.084,48.533],[-122.91,48.65],[-122.88,48.49]],rings=points.map(p=>coast.find(r=>G.inside(r,p)));
 if(rings.some(r=>!r))throw Error('San Juan island coast missing');
 const shape=G.union(rings),name=L('Сан-Хуан, Оркас и Лопес · спорные острова|San Juan, Orcas and Lopez · disputed islands|Сан-Хуан, Оркас жана Лопес · талаштуу аралдар');
 const rows=[
  [1846,1859,'Спор о границе в проливах|Dispute over the straits boundary|Кысыктардагы чек ара талашы','После Орегонского договора Великобритания и США по-разному толкуют линию границы между островом Ванкувер и материком. Обе стороны заявляют права на острова Сан-Хуан.|After the Oregon Treaty, Britain and the United States interpret the boundary channel between Vancouver Island and the mainland differently. Both claim the San Juan Islands.|Орегон келишиминен кийин Британия менен АКШ Ванкувер аралы менен материктин ортосундагы чек ара кысыгын ар башка чечмелейт. Эки тарап тең Сан-Хуан аралдарына доомат коёт.'],
  [1859,1860,'Кризис на острове Сан-Хуан|San Juan Island crisis|Сан-Хуан аралындагы кризис','В июле 1859 года американские войска высаживаются на Сан-Хуане. Британские корабли прибывают к острову; переговоры предотвращают сражение. В ноябре стороны соглашаются на совместную военную оккупацию.|US troops land on San Juan in July 1859. British ships arrive; negotiations avert a battle. In November the two sides agree to joint military occupation.|1859-жылдын июлунда АКШ аскерлери Сан-Хуанга түшөт. Аралга британ кемелери келет; сүйлөшүүлөр салгылашууну токтотот. Ноябрда эки тарап биргелешкен аскердик оккупацияга макул болот.'],
  [1860,1872,'Совместное военное присутствие на Сан-Хуане|Joint military presence on San Juan|Сан-Хуандагы биргелешкен аскердик катышуу','21 марта 1860 года британская морская пехота основывает Английский лагерь. На Сан-Хуане действуют британский и американский лагеря.|British Royal Marines establish English Camp on 21 March 1860. British and American camps operate on San Juan.|1860-жылдын 21-мартында британ деңиз жөө аскерлери Англия лагерин түзөт. Сан-Хуанда британ жана америкалык лагерлер иштейт.']
 ];
 H.entry(id,'north','region',points[0],name,rows.map(([from,to,title,text])=>H.phase(from,to,L(title),L(text),[src],{name,approx:false,frontierAdded:true})));
 for(const p of c.entries.find(e=>e.id===id).phases){const a=H.area(id,p.from,p.to,shape,{kind:'influence',name,title:p.title,text:p.text,color:'#a9a18c',sources:[src]});Object.assign(a,{frontierAdded:true,label:points[0],statusLabel:L('Спор Великобритании и США|British–US dispute|Британия менен АКШнын талашы')});c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(shape);}
 revise(['1789-usa','1848-oregon','1789-great-britain','1789-canada'],1846,1872,'san-juan-unsettled-sovereignty',src,p=>D(p,shape));
 revise(['1789-usa'],1872,2027,'san-juan-arbitration-1872',src,p=>G.merge([p,shape]));
 revise(['1789-great-britain','1789-canada'],1872,2027,'san-juan-outside-canada',src,p=>D(p,shape));
 for(const y of [1859,1860]){const r=rows.find(r=>r[0]===y);H.event('san-juan-'+y,y,id,'diplomacy',points[0],L(r[2]),L(r[3]),[src],{frontierAdded:true,region:'north'});}
 H.event('san-juan-1872',1872,'1789-usa','diplomacy',points[0],L('Арбитраж по островам Сан-Хуан|San Juan Islands arbitration|Сан-Хуан аралдары боюнча арбитраж'),L('21 октября 1872 года арбитраж определяет границу через пролив Харо в пользу США. Британская морская пехота покидает Сан-Хуан 25 ноября.|On 21 October 1872 arbitration places the boundary in Haro Strait in favour of the United States. British Royal Marines leave San Juan on 25 November.|1872-жылдын 21-октябрында арбитраж АКШнын пайдасына чек араны Харо кысыгы аркылуу өткөрөт. Британ деңиз жөө аскерлери Сан-Хуандан 25-ноябрда кетет.'),[src],{frontierAdded:true,region:'north'});
};

