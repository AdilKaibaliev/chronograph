'use strict';
module.exports=function(c,{source,revise,split,visibleAt,D,I,box}){
 const G=require('./cartography-geometry.cjs'),H=require('./late-helpers.cjs')(c,{start:610,max:2026}),L=s=>s.split('|');
 source('vitebsk144','И. П. Шамякин (ред.). Витебск: энциклопедический справочник (1988); С. Ю. Житенёв. История русского православного паломничества в X–XVII веках, с. 137; Президентская библиотека. Андрусовское перемирие (1667).',[
  'https://heritage-institute.ru/wp-content/uploads/2016/07/zhitenyov-s.yu.-istoriya-russkogo-pravoslavnogo-palomnichestva-v-x-xvii-vekah.pdf',
  'https://www.prlib.ru/history/619017'
 ]);
 source('kirkuk144','Ahmet Gündüz. Kerkük; Sâmî es-Sakkâr. Erbil. TDV İslâm Ansiklopedisi; Halil Sahillioğlu (ed.). Dördüncü Murad’ın Bağdat Seferi Menzilnâmesi, Belgeler II/3–4 (1965), p. 25.',[
  'https://islamansiklopedisi.org.tr/kerkuk','https://islamansiklopedisi.org.tr/erbil'
 ]);
 source('zuhab144','Rhoads Murphey. Kasrışîrin Antlaşması. TDV İslâm Ansiklopedisi; Naîmâ, Târih III, pp. 420–429; Feridun Bey, Münşeât II, pp. 217–219.',[
  'https://islamansiklopedisi.org.tr/kasrisirin-antlasmasi'
 ]);
 source('salvador144','Constitución del Estado del Salvador (12 June 1824), Articles 4 and 6; Archivo Municipal de Santa Ana, Censo-Guía de Archivos; Universidad de El Salvador, Historia del departamento de Chalatenango.',[
  'https://www.cervantesvirtual.com/portales/constituciones_hispanoamericanas/obra-visor/constitucion-politica-de-la-republica-de-el-salvador-de-1824/html/9215c899-4b99-40cf-8960-f18fb644c894_2.html',
  'https://censoarchivos.cultura.gob.es/CensoGuia/imprimirDetalleArchivo.htm?id=49191',
  'https://repositorio.ues.edu.sv/bitstreams/eeb2b0f8-a36f-4cd7-bacd-c2fddad9912e/download'
 ]);
 // Reuse the already mapped Commonwealth edge around Vitebsk. Russian
 // campaigns in 1708 did not annex this territory; the transfer is in 1772.
 // This window excludes Livonia, Smolensk and the separate Kyiv enclave.
 const vitebsk=I(visibleAt('early-commonwealth',1710),box(28,54.5,32,55.9));
 revise(['early-russia','1789-russian-empire'],1710,1772,'vitebsk-before-first-partition','vitebsk144',p=>D(p,vitebsk));
 // Continue the existing dated Kirkuk regional envelope through 1629.
 // Do not confuse the 1625 recovery of Mosul with Kirkuk's recovery in 1630.
 const kirkuk=G.union([[[44.27,35.43],[44.36,35.36],[44.48,35.42],[44.50,35.51],[44.41,35.58],[44.30,35.54]]]);
 revise(['late-ottoman'],1625,1630,'kirkuk-before-husrev-recovery','kirkuk144',p=>D(p,kirkuk));
 revise(['early-safavid'],1625,1630,'kirkuk-held-until-1630','kirkuk144',p=>G.merge([p,kirkuk]));
 // The 1638 Ottoman campaign journal locates Erbil in the Ottoman itinerary.
 // Earlier contested campaign years are not inferred from that later record.
 const erbil=G.union([[[43.86,36.14],[43.99,36.08],[44.13,36.14],[44.16,36.23],[44.03,36.30],[43.89,36.25]]]);
 revise(['early-safavid'],1638,1639,'erbil-1638-campaign-journal','kirkuk144',p=>D(p,erbil));
 // These two masks are settlement interiors, not international frontiers.
 // Preserve all disputed northern sectors and subsequent treaty geometry.
 const interiors=[['1848-central-america',box(-89.62,13.94,-89.50,14.04)],['1848-honduras',box(-88.99,13.99,-88.88,14.08)]];
 for(const [loser,mask]of interiors){
  const cuts=[1838,1946,...c.areas.filter(a=>a.entry==='1848-el-salvador'&&a.to>1838&&a.from<1946).flatMap(a=>[a.from,a.to])].filter(y=>y>=1838&&y<=1946).sort((a,b)=>a-b);
  for(const [i,from]of cuts.entries()){const to=cuts[i+1];if(!(from<to))continue;
   const cut=I(mask,visibleAt('1848-el-salvador',from));
   if(cut.length)revise([loser],from,to,'salvador-confirmed-town-interior','salvador144',p=>I(p,cut).length?D(p,cut):p);
  }
 }
 // A treaty signed in May 1639 must not already describe the year 1638.
 const e=c.entries.find(e=>e.id==='early-safavid'),old=e.phases.find(p=>p.from===1638);
 if(!old||old.to!==1722)throw Error('Unexpected Safavid chronology');
 const rows=[
  [1638,1639,'Утрата Багдада|Loss of Baghdad|Багдаддын жоготулушу','В декабре 1638 года Мурад IV берёт Багдад. Сефевидское управление городом заканчивается; шах Сефи сохраняет власть в Иране.|Murad IV takes Baghdad in December 1638, ending Safavid rule there. Shah Safi retains his rule in Iran.|1638-жылдын декабрында Мурад IV Багдадды алат. Шаардагы Сефеви башкаруусу аяктайт; шах Сефи Иранда бийлигин сактайт.'],
  [1639,1722,'Иран после Зухабского мира|Iran after the Treaty of Zuhab|Зухаб тынчтыгынан кийинки Иран','17 мая 1639 года Османы и Сефевиды заключают Зухабский мир. Багдад, Басра и Шахразур остаются у Османов, Ереван — у Сефевидов.|The Ottomans and Safavids sign the Treaty of Zuhab on 17 May 1639. Baghdad, Basra and Shahrazur remain Ottoman; Yerevan remains Safavid.|1639-жылдын 17-майында Осмондор менен Сефевилер Зухаб тынчтык келишимине кол коёт. Багдад, Басра жана Шахразур Осмондордо, Ереван Сефевилерде калат.']
 ];
 e.phases=e.phases.filter(p=>p!==old).concat(rows.map(([from,to,title,text])=>({...old,from,to,period:H.phase(from,to,[],[],[],{approx:false}).period,title:L(title),text:L(text),sources:[...new Set([...old.sources,'zuhab144'])]}))).sort((a,b)=>a.from-b.from);
 for(const key of ['areas','outlines']){
  split(key,[e.id],[1639]);
  for(const a of c[key].filter(a=>a.entry===e.id&&a.from>=1638&&a.to<=1722)){const p=e.phases.find(p=>p.from<=a.from&&a.from<p.to);a.title=p.title;a.text=p.text;a.sources=[...new Set([...a.sources,'zuhab144'])];}
 }
 const events=[
  ['kirkuk-recovery-1630',1630,'late-ottoman',[44.39,35.47],'Возвращение Киркука под османскую власть|Ottoman recovery of Kirkuk|Киркуктун Осмон бийлигине кайтарылышы','Хюсрев-паша возвращает Киркук, занятый Сефевидами в 1624 году. Багдад остаётся под властью Сефевидов.|Hüsrev Pasha recovers Kirkuk, taken by the Safavids in 1624. Baghdad remains under Safavid rule.|Хүсрев-паша 1624-жылы Сефевилер алган Киркукту кайтарат. Багдад Сефевилердин бийлигинде калат.','kirkuk144','war']
 ];
 for(const [id,y,entry,coord,title,text,src,kind]of events)H.event(id,y,entry,kind,coord,L(title),L(text),[src],{frontierAdded:true});
};
