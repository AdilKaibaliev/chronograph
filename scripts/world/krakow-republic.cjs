'use strict';
const G=require('./cartography-geometry.cjs'),ref=require('../../research/krakow-1815-reference.json');
module.exports=function(c,{source,revise,D}){
 const src='krakowRepublic1815',id='review-krakow-republic',L=s=>s.split('|'),H=require('./late-helpers.cjs')(c,{start:610,max:2026});
 source(src,'Final Act of the Congress of Vienna (1815), Articles VI–IX; Archiwum Narodowe w Krakowie, Wolne Miasto Kraków 1815–1846; Konstanty Żmigrodzki, Mapa Rzeczpospolitej Krakowskiej od roku 1815 do 1846, Witebsk 1908; Kraków, Historyczne widoki i plany Krakowa; Most Podgórski.',[
  'https://www.hlrn.org/img/documents/final_congress_viennageneral_treaty1815.pdf',
  'https://ank.gov.pl/wystawy/wolne-miasto-krakow-1815-1846-materialy-z-zasobu-krakowskiego-archiwum/',
  'https://www.wbc.poznan.pl/dlibra/publication/19633/edition/32166/',
  'https://www.krakow.pl/instcbi/35902/inst/11887/1081/Most-Podgorski.html'
 ]);
 const name=L('Вольный город Краков|Free City of Kraków|Эркин Краков шаары');
 const text=L('В 1815 году Краков и его округ становятся свободной республикой под совместным покровительством Австрии, Пруссии и России. Округ включает Хшанув, Тшебиню, Нову-Гуру и сельские общины на левом берегу Вислы. Подгуже на правом берегу остаётся австрийским.|In 1815 Kraków and its district become a free republic under the joint protection of Austria, Prussia and Russia. The district includes Chrzanów, Trzebinia, Nowa Góra and rural communes on the left bank of the Vistula. Podgórze on the right bank remains Austrian.|1815-жылы Краков жана анын округу Австрия, Пруссия жана Орусиянын биргелешкен камкордугунда эркин республика болуп түзүлөт. Округга Хшанув, Тшебиня, Нова-Гура жана Висланын сол жээгиндеги айылдык жамааттар кирет. Оң жээктеги Подгуже Австрияда калат.');
 H.entry(id,'eurasia','state',[19.938,50.061],name,[H.phase(1815,1846,name,text,[src],{name,approx:false,frontierAdded:true})]);
 const a=H.area(id,1815,1846,ref.shape,{name,title:name,text,kind:'polity',color:'#b6a578',sources:[src]});
 Object.assign(a,{frontierAdded:true,geometry:'source-based-regional-reconstruction',approx:true,label:[19.938,50.061]});
 c.cartography.areas[a.id]=c.cartography.shapes.length;c.cartography.shapes.push(ref.shape);
 // Protection by three powers is not annexation by any of them.
 revise(['1815-warsaw','1789-russian-empire','1789-prussia','early-austria'],1815,1846,'free-krakow-exclusion',src,p=>D(p,ref.shape));
 revise(['1815-warsaw','1789-russian-empire','1789-prussia'],1846,1918,'austrian-krakow-exclusion',src,p=>D(p,ref.shape));
 revise(['early-austria'],1846,1918,'krakow-annexation-1846',src,p=>G.merge([p,ref.shape]));
 H.event('krakow-republic-1815',1815,id,'diplomacy',[19.938,50.061],name,text,[src],{frontierAdded:true});
 H.event('krakow-annexation-1846',1846,'early-austria','politics',[19.938,50.061],L('Краков включён в Австрийскую империю|Kraków incorporated into the Austrian Empire|Краков Австрия империясына кошулду'),L('После Краковского восстания Австрия присоединяет Вольный город и его округ в ноябре 1846 года. Республика прекращает существование.|Following the Kraków uprising, Austria annexes the Free City and its district in November 1846. The republic ceases to exist.|Краков көтөрүлүшүнөн кийин Австрия 1846-жылдын ноябрында Эркин шаарды жана анын округун өзүнө кошот. Республика жоюлат.'),[src],{frontierAdded:true,region:'eurasia'});
};
