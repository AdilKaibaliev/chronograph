'use strict';
module.exports=function({page,esc,langs,idx,copy,world}){
 const c=require('../ancient/prepare.cjs')(world,require('../../research/kyrgyz-pre610.json'));
 const cal=require('../ancient/calendar.js');
 const titles=['Древний мир: 7000 до н. э. — 610 н. э.','Ancient world: 7000 BCE–610 CE','Байыркы дүйнө: б. з. ч. 7000 — б. з. 610'];
 const intros=['Общества, города и государства древнего мира, ранние свидетельства о кыргызах и изменения природной среды. На карте показаны выбранные территориальные реконструкции и памятники; современные берега служат ориентиром.','Ancient societies, cities and states, early evidence concerning the Kyrgyz, and environmental change. The map presents selected territorial reconstructions and sites, using modern coastlines as a reference.','Байыркы коомдор, шаарлар жана мамлекеттер, кыргыздар тууралуу алгачкы маалыматтар жана табигый чөйрөнүн өзгөрүшү. Картада тандалган аймактык реконструкциялар жана эстеликтер көрсөтүлөт; азыркы жээктер багыт катары колдонулат.'];
 const alts=Object.fromEntries(langs.map(l=>[l,'/'+l+'/history/ancient']));
 for(const l of langs){const i=idx[l];
  const cards=c.records.map(r=>`<article id="${esc(r.id)}"><p class="eyebrow">${esc(r.dateLabel?.[i]||cal.range(r.from,r.kind==='event'?r.from:r.to,l))}</p><h2>${esc(r.title[i])}</h2><p>${esc(r.text[i])}</p><p class="source">${esc(r.sources.map(id=>c.sources[id].title).join('; '))}</p><a href="/?lang=${l}&amp;year=${Math.max(c.range.min,r.from)}&amp;tab=events">${esc(copy[l].open)}</a></article>`).join('');
  page(l,alts[l],titles[i]+' — '+copy[l].brand,intros[i],`<p class="eyebrow">CHRONOGRAPH ATLAS</p><h1>${esc(titles[i])}</h1><p>${esc(intros[i])}</p><p><a class="cta" href="/?lang=${l}&amp;year=-7000&amp;tab=events">${esc(copy[l].open)}</a></p>${cards}`,alts);
 }
};
