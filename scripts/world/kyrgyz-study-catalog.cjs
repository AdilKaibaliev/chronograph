'use strict';
const additions=require('./kyrgyz-study-data.cjs');
const school=require('./kyrgyz-school-data.cjs');
module.exports=function kyrgyzStudyCatalog(world,witnesses,stages,ancient,textRow){
 const lessons=[];
 const add=e=>{if(!lessons.some(x=>x.id===e.id))lessons.push(e);};
 for(const n of witnesses){
  const record=world.events.find(e=>e.id===(n.replacesEvent||'kyrgyz-witness-'+n.from));
  add({id:'witness-'+n.from,year:n.from,from:n.periodFrom??n.from,to:n.to,kind:n.kind||'culture',title:n.title,text:n.text,periodLabel:n.periodLabel,coord:n.place,mapPlaces:n.places||[],route:n.route,geographyNote:n.geographyNote,mapScale:n.mapScale,sources:[n.source],background:!!n.background,
   ...(record?{eventId:record.id}:{}),...(n.from===1982?{transport:'flight'}:{})});
 }
 for(const s of stages){
  // The refined witness replaces this stage when the original date or location
  // needed a source correction. Do not revive the older account in the course.
  if(witnesses.some(n=>(n.from===s.year&&s.year!==1293)||n.replacesStage===s.year))continue;
  // World chronology also contains unrelated events in these years (610 is
  // the beginning of revelation in Mecca). Only reuse a Kyrgyz stage's event
  // when both its title and explicitly assigned source identify that stage.
  const event=world.events.find(e=>e.id==='atlas-'+s.year&&e.title?.[0]===s.title&&e.sources?.includes('kyrgyz-stage-'+s.year));
  add({id:'stage-'+s.year,year:s.year,from:s.year===924?900:s.year,to:s.year===924?1199:s.year===860?874:s.year,kind:[820,840,1218,1273,1293].includes(s.year)?'war':event?.kind||'politics',title:textRow(s.title),text:textRow(s.text),coord:event?.coord||s.view?.slice(0,2),regional:true,route:s.route?.points,mapScale:s.view?.[2]||5,sources:[s.source],eventId:event?.id,
   ...(s.year===820?{periodLabel:['Около 820 года','Around 820','Болжол менен 820-жыл']}:s.year===924?{periodLabel:['X–XII века','10th–12th centuries','X–XII кылымдар']}:s.year===860?{periodLabel:['860–874 годы','860–874','860–874-жылдар']}:{})});
 }
 for(const r of ancient.records.filter(r=>r.kyrgyz))add({id:r.id,year:r.from,from:r.from,to:r.to-1,kind:'culture',title:r.title,text:r.text,periodLabel:r.dateLabel,coord:r.coord,
  mapPlaces:(r.geographicReferences||[]).map(p=>[p.coord,p.label||p.title]),regional:true,geographyNote:r.geographyCaption,mapScale:5,sources:r.sources.map(id=>ancient.sources[id].title)});
 for(const e of additions.events)add({...e,eventId:e.id,sources:e.sources.map(id=>additions.sources[id].title)});
 for(const e of school.events)add({...e});
 // Add modern political chapters already reviewed in the general atlas.
 for(const entry of world.entries.filter(e=>e.kyrgyzHistory))for(const p of entry.phases.filter(p=>p.from>=1300))add({id:'state-'+entry.id+'-'+p.from,year:p.from,from:p.from,to:p.to-1,kind:'politics',coord:p.coord||entry.coord,title:p.title,text:p.text,sources:p.sources.map(id=>world.sources[id].title),mapScale:8,background:true});
 for(const e of lessons){
  e.mapPlaces??=[];if(!e.mapPlaces.length&&e.coord)e.mapPlaces=[[e.coord,e.title]];
  e.sources=e.sources.filter(Boolean);
 }
 // Enrich older public cards without changing their reviewed chronology.
 const find=y=>lessons.find(e=>e.id==='witness-'+y);
 const overview610=lessons.find(e=>e.id==='stage-610');
 overview610.mapPlaces=[[[92,54],['Саяно-Енисейский регион · кыргызские земли','Sayan–Yenisei region · Kyrgyz lands','Саян–Энесай аймагы · кыргыз жерлери']]];
 const campaign840=lessons.find(e=>e.id==='stage-840');
 campaign840.mapPlaces=[[[92.5,53.6],['Верхний Енисей · район исхода','Upper Yenisei · departure region','Жогорку Энесай · жортуул башталган аймак']],[[102.66,47.43],['Орду-Балык · уйгурская столица','Ordu-Baliq · Uyghur capital','Орду-Балык · уйгур борбору']]];
 campaign840.coord=[102.66,47.43];
 find(1916).mapPlaces=[[[78.39,42.49],['Каракол · район исхода','Karakol · departure region','Каракол · көч башталган аймак']],[[78.41,41.41],['Перевал Бедель','Bedel pass','Бедел ашуусу']],[[79.23,41.22],['Учтурпан','Uch Turfan','Үч-Турпан']]];
 find(1978).mapPlaces=[[[74.2,37.2],['Малый Памир · Афганистан','Little Pamir · Afghanistan','Кичи Памир · Афганстан']],[[74.31,35.92],['Гилгит · Пакистан','Gilgit · Pakistan','Гилгит · Пакистан']]];
 find(1982).mapPlaces=[[[74.31,35.92],['Гилгит · прежнее убежище','Gilgit · former refuge','Гилгит · мурда баш калкалаган жер']],[[35.32,37],['Адана · прибытие самолётами','Adana · arrival by air','Адана · учак менен келүү']]];
 find(1982).geographyNote=['Воздушное переселение. Дуга связывает район убежища и город прибытия, а не воспроизводит авиамаршрут или наземный переход.','Relocation by air. The arc connects the refuge region and arrival city; it is not the aircraft’s flight path or an overland route.','Учак менен көчүү. Жаа баш калкалаган аймакты жана келген шаарды байланыштырат; ал учактын так каттамы же кургактагы жол эмес.'];
 find(1987).mapPlaces=[[[43.284,39.193],['Улу-Памир · район Эрджиш, провинция Ван','Ulupamir · Erciş district, Van province','Улупамир · Эржиш району, Ван облусу']]];
 find(1987).mapScale=16;
 lessons.sort((a,b)=>a.year-b.year||(a.to-a.from)-(b.to-b.from)||a.id.localeCompare(b.id));
 const chapter=(id,title,intro,filter,question,answer)=>({id,title,intro,lessons:lessons.filter(filter).map(e=>e.id),question,answer});
 const chapters=[
  chapter('all',['Вся история кыргызов','All Kyrgyz history','Кыргыз тарыхы толугу менен'],['Свидетельства, общества и события на общей шкале времени.','Accounts, communities and events on the common timeline.','Жалпы убакыт тилкесиндеги маалыматтар, коомдор жана окуялар.'],()=>true),
  chapter('school-middle',['Тянь-Шань · IX–XVIII века','Tian Shan · 9th–18th centuries','Теңир-Тоо · IX–XVIII кылымдар'],['Города, правители, общества и переселения.','Cities, rulers, communities and movements.','Шаарлар, башкаруучулар, коомдор жана көчүүлөр.'],e=>e.year>=801&&e.year<=1800),
  chapter('school-empire',['XIX век и 1916 год','19th century and 1916','XIX кылым жана 1916-жыл'],['Коканд, местные правители, Российская империя, восстания и Үркүн.','Kokand, local rulers, the Russian Empire, uprisings and Ürkün.','Кокон, жергиликтүү башкаруучулар, Орусия империясы, көтөрүлүштөр жана Үркүн.'],e=>e.year>=1801&&e.year<=1916),
  chapter('school-modern',['1917 год — современность','1917 to the present','1917-жылдан бүгүнкү күнгө чейин'],['Государственность, общество, культура и расселение.','Statehood, society, culture and settlement.','Мамлекеттүүлүк, коом, маданият жана жайгашуу.'],e=>e.year>=1917),
  chapter('early',['Ранние свидетельства','Early accounts','Алгачкы маалыматтар'],['Китайские хроники и география ранних упоминаний.','Chinese chronicles and the geography of early references.','Кытай жылнаамалары жана алгачкы маалыматтардын географиясы.'],e=>e.year<840,
   ['Означает ли первое упоминание дату появления народа?','Does the first written reference date the birth of a people?','Элдин алгачкы эскерилиши анын пайда болгон датасын билдиреби?'],['Нет. Это дата сохранившегося свидетельства; происхождение народа и местоположение ранних групп исследуются отдельно.','No. It dates a surviving account; the people’s origins and the location of early groups are separate research questions.','Жок. Бул — сакталып калган маалыматтын датасы; элдин теги жана алгачкы топтор жашаган жерлер өзүнчө изилденет.']),
  chapter('yenisei',['Енисей и Тянь-Шань','Yenisei and Tian Shan','Энесай жана Теңир-Тоо'],['Каганат, письменные свидетельства, походы и сообщества Тянь-Шаня.','The khaganate, written accounts, campaigns and Tian Shan communities.','Каганат, жазма маалыматтар, жортуулдар жана Теңир-Тоодогу жамааттар.'],e=>e.year>=840&&e.year<=1765,
   ['Какие стрелки обозначают переселение, а какие — поход или торговую дорогу?','Which arrows show relocation, and which show a campaign or a trade route?','Кайсы жебе көчүүнү, кайсысы жортуулду же соода жолун көрсөтөт?'],['Тип каждого эпизода указан над заголовком. Посольство, торговая дорога и военный поход сами по себе не доказывают переселение населения.','Each episode is labelled by type. An embassy, trade road or military campaign does not by itself establish a population migration.','Ар бир окуянын түрү аталыштын үстүндө көрсөтүлгөн. Элчилик, соода жолу же аскердик жортуул өзүнөн-өзү калктын көчкөнүн далилдебейт.']),
  chapter('china',['Кыргызы в Китае','Kyrgyz in China','Кытайдагы кыргыздар'],['Средневековые переселения, Цинские документы, Үркүн и культурные традиции.','Medieval relocations, Qing documents, Ürkün and cultural traditions.','Орто кылымдагы көчүүлөр, Цин документтери, Үркүн жана маданий салттар.'],e=>[648,843,844,863,866,984,1265,1270,1271,1293,1295,1508,1518,1733,1757,1758,1759,1760,1762,1765,1878,1916,1948,1950,1983,2009,2023].includes(e.year)&&!e.id.startsWith('state-'),
   ['Являются ли все восточные переселения одним событием?','Were all eastward relocations a single event?','Чыгышка көчүүлөрдүн баары бир эле окуябы?'],['Нет. Переселения при Юань, перемещения XVIII века и бегство 1916 года происходили в разных условиях и в разные районы.','No. Yuan-era relocations, eighteenth-century movements and the flight of 1916 occurred under different conditions and reached different regions.','Жок. Юань доорундагы көчүрүүлөр, XVIII кылымдагы көчүүлөр жана 1916-жылдагы качуу ар башка шарттарда, ар башка аймактарга болгон.']),
  chapter('pamir',['Памир → Пакистан → Улу-Памир','Pamir → Pakistan → Ulupamir','Памир → Пакистан → Улупамир'],['Афганский и китайский Памир, исход, возвращение части семей и жизнь в Турции.','The Afghan and Chinese Pamir, exile, returning families and life in Turkey.','Афган жана Кытай Памири, көч, айрым үй-бүлөлөрдүн кайтышы жана Түркиядагы турмуш.'],e=>e.id==='ky-study-tribe-pamir-tribes'||e.id.startsWith('ky-study-pamir-')||e.id==='ky-study-turkey-temporary-1982'||['witness-1978','witness-1982','witness-1987'].includes(e.id),
   ['Почему маршрут после 1978 года разветвляется?','Why does the route branch after 1978?','Эмне үчүн 1978-жылдан кийинки жол бутакталат?'],['В 1979 году часть семей вернулась в Малый Памир. Другая группа переехала в Турцию в 1982 году и позднее поселилась в Улу-Памире.','Some families returned to the Little Pamir in 1979. Another group moved to Turkey in 1982 and later settled at Ulupamir.','1979-жылы үй-бүлөлөрдүн бир бөлүгү Кичи Памирге кайткан. Башка топ 1982-жылы Түркияга көчүп, кийин Улупамирге отурукташкан.']),
  chapter('tribes',['Племена и места проживания','Tribes and places of residence','Уруулар жана жашаган жерлер'],['Районы кочевий и поселений в датированных описаниях.','Pasture and settlement regions in dated accounts.','Даталанган баяндардагы жайыттар жана конуш аймактары.'],e=>e.tribal||e.id==='witness-1760'||e.id==='ky-study-pamir-pastures-2006',
   ['Почему у племён показаны районы, а не государственные границы?','Why are tribes shown as regions rather than state borders?','Эмне үчүн уруулар мамлекеттик чек аралар менен эмес, аймактар менен көрсөтүлгөн?'],['Источники называют долины, горы и сезонные пастбища. В одном районе могли жить разные группы, а кочевья менялись со временем.','Sources name valleys, mountains and seasonal pastures. Several groups could share a region, and their movements changed over time.','Булактар өрөөндөрдү, тоолорду жана мезгилдик жайыттарды атайт. Бир аймакта ар башка топтор жашап, көчүп-конуу убакыт өткөн сайын өзгөргөн.']),
  chapter('battles',['Сражения и походы','Battles and campaigns','Салгылаштар жана жортуулдар'],['Места столкновений, участники и результаты.','Encounter locations, participants and outcomes.','Кагылышуу жерлери, катышуучулар жана жыйынтыктар.'],e=>e.kind==='war'),
  chapter('culture',['Хозяйство, связи и культура','Livelihoods, connections and culture','Чарба, байланыштар жана маданият'],['Караванные дороги, посольства, скотоводство и эпос.','Caravan roads, embassies, pastoralism and epic traditions.','Кербен жолдору, элчиликтер, мал чарбачылыгы жана эпос.'],e=>['economy','diplomacy','culture'].includes(e.kind)&&!e.tribal)
 ];
 return {version:1,chapters,lessons};
};
