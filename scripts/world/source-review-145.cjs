'use strict';
module.exports=function(c,{source,revise,D}){
 const G=require('./cartography-geometry.cjs'),H=require('./late-helpers.cjs')(c,{start:610,max:2026}),L=s=>s.split('|');
 source('northRestitution145','К. А. Кочегаров. Речь Посполитая и Россия в 1680–1686 годах. Заключение договора о Вечном мире (2008), с. 48–49; Российская национальная библиотека. Вся Россия: Невельский, Себежский и Велижский уезды; Giovanni Antonio Rizzi-Zannoni. Carte de la Pologne (1772), листы 3 и 8.',[
  'https://inslav.ru/images/stories/pdf/2008_Kochegarov.pdf',
  'https://nlr.ru/allrussia/RA10701/uezd?id=1515',
  'https://nlr.ru/allrussia/RA10701/uezd?id=1565',
  'https://nlr.ru/allrussia/RA10701/uezd?id=1404',
  'https://www.loc.gov/item/2021668473/',
  'https://www.lithuanianmaps.com/Maps1771-75.html',
  'https://doi.org/10.5281/zenodo.13363121'
 ]);
 c.sources.northRestitution145.title+=' Bennett et al. Cliopatria v0.2.1, CC BY 4.0; regional geometry adapted and corrected against Rizzi-Zannoni.';
 // The 1678 settlement returned three border districts. It did not wait
 // until the Eternal Peace of 1686, and it did not transfer Smolensk.
 // A common regional edge is added to one owner and removed from the other.
 // The 1772 partition remains the existing, independently dated transition.
 const mask=require('./source-review-145-geometry.json').polygons;
 revise(['early-russia','1789-russian-empire'],1678,1772,'northern-districts-returned-in-1678','northRestitution145',p=>D(p,mask));
 revise(['early-commonwealth'],1678,1772,'northern-districts-returned-in-1678','northRestitution145',p=>G.merge([p,mask]));
 const rows=[
  ['nevel', [29.93,56.02], 'Невель|Nevel|Невель'],
  ['sebezh',[28.48,56.29], 'Себеж|Sebezh|Себеж'],
  ['velizh',[31.2,55.6], 'Велиж|Velizh|Велиж']
 ];
 for(const [id,coord,n]of rows){const names=L(n);
  H.event(id+'-restitution-1678',1678,'early-commonwealth','politics',coord,
   [`${names[0]}: возвращение Речи Посполитой`,`${names[1]} returns to the Commonwealth`,`${names[2]} Речь Посполитага кайтарылат`],
   L('Московский договор 1678 года предусматривает передачу Невеля, Себежа и Велижа с их округами Речи Посполитой. Эти земли входят в Российскую империю при первом разделе Речи Посполитой в 1772 году.|The Moscow agreement of 1678 provides for the return of Nevel, Sebezh and Velizh with their districts to the Polish–Lithuanian Commonwealth. They become part of the Russian Empire in the first partition of 1772.|1678-жылдагы Москва келишими боюнча Невель, Себеж жана Велиж өз округдары менен Речь Посполитага кайтарылат. Бул жерлер 1772-жылдагы биринчи бөлүштүрүүдө Россия империясынын курамына кирет.'),
   ['northRestitution145'],{frontierAdded:true});
 }
};
