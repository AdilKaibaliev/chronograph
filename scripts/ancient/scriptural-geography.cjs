'use strict';
// Qur'anic names, scholarly geographical identifications and calendar evidence
// remain distinct. No dynasty is inferred from a prophet's name alone.
module.exports=({records,sources,places,q})=>{
 const L=(ru,en,ky)=>[ru,en,ky];
 for(const [id,ref]of [['ik-madyan','7:85'],['ik-nineveh','10:98'],['ik-ahqaf','46:21']])sources[id]={title:'Ибн Касир / Ibn Kathir / Ибн Касир. Тафсир аль-Куран аль-Азым, '+ref+'.',urls:['https://quran.com/'+ref+'/tafsirs/ar-tafsir-ibn-kathir']};
 sources['prophetic-chronology']={title:'Ислам: вопрос и ответ. № 225177. Мусульманская хронология древних пророков; Ибн Касир, Аль-Бидая ва-н-нихая, 1:237–238.',urls:['https://islamqa.info/ar/answers/225177']};
 sources['nineveh-place']={title:'Department of Antiquities and Heritage, Iraq. The Ancient City of Nineveh. UNESCO Tentative List, 1465.',urls:['https://whc.unesco.org/en/tentativelists/1465/']};
 places.nineveh={coord:[43.15,36.36],precision:'region',title:L('Ниневия · народ Юнуса','Nineveh · the people of Yunus','Ниневия · Юнус эли'),note:L('Ибн Касир связывает народ Юнуса с Ниневией. Показан район древнего города у Мосула; год миссии не установлен.','Ibn Kathir identifies Yunus’s people with Nineveh. The marker indicates the ancient city’s area near Mosul; the mission year is not established.','Ибн Касир Юнус элин Ниневия менен байланыштырат. Мосулдун жанындагы байыркы шаар аймагы көрсөтүлгөн; миссиянын жылы аныкталган эмес.'),sources:[q('10:98'),'ik-nineveh','nineveh-place']};
 places.madyan={coord:[35.7,30.2],precision:'region',title:L('Мадьян · ориентир по Ибн Касиру','Madyan · Ibn Kathir’s geographical reference','Мадян · Ибн Касирдин географиялык багыты'),note:L('В толковании 7:85 Мадьян помещён близ Маана, на пути в Хиджаз. Круг отмечает регион этого описания, а не установленный город или границу государства.','The commentary on 7:85 places Madyan near Ma‘an on the Hijaz road. The circle marks the region of that description, not an identified settlement or state boundary.','7:85 аяттын тафсиринде Мадян Маандын жанында, Хижаз жолунда жайгаштырылат. Тегерек ошол сүрөттөмөнүн аймагын көрсөтөт, аныкталган шаарды же мамлекеттик чекти эмес.'),sources:[q('7:85'),q('28:22'),'ik-madyan']};
 places.ahqaf={coord:[49.4,16.0],precision:'region',title:L('Аль-Ахкаф · юг Аравии','Al-Ahqaf · southern Arabia','Аль-Ахкаф · Арабиянын түштүгү'),note:L('Ибн Касир приводит локализации в Хадрамауте и аш-Шихре. Показан общий южноаравийский ориентир этих толкований; точные границы народа Ад неизвестны.','Ibn Kathir reports identifications in Hadramawt and al-Shihr. This is a broad southern Arabian reference for those interpretations; Ad’s precise boundaries are unknown.','Ибн Касир Хадрамаут жана аш-Шихр аймактарын атаган пикирлерди келтирет. Ошол тафсирлердин жалпы түштүк арабиялык багыты көрсөтүлгөн; Ад элинин так чек аралары белгисиз.'),sources:[q('46:21'),'ik-ahqaf']};
 for(const [id,place]of [['yunus','nineveh'],['shuayb','madyan'],['madyan','madyan'],['hud','ahqaf'],['ad','ahqaf']]){const r=records.find(r=>r.id===id);r.place=place;r.placeLabel=places[place].title;r.sources.push(...places[place].sources);}
 const audience={
  nuh:L('Народ Нуха','The people of Nuh','Нухтун эли'),hud:L('Ад','Ad','Ад'),salih:L('Самуд','Thamud','Самуд'),
  ibrahim:L('Его народ; рассказ также связан с Исмаилом и Лутом','His people; the account also concerns Ismail and Lut','Өз эли; баян Исмаил жана Лут менен да байланышат'),lut:L('Народ Лута','The people of Lut','Луттун эли'),
  shuayb:L('Мадьян','Madyan','Мадян'),musa:L('Сыны Исраиля; фараон и его окружение','Children of Israel; Pharaoh and his court','Исраил урпактары; фараон жана анын чөйрөсү'),harun:L('Сыны Исраиля; миссия вместе с Мусой','Children of Israel; mission with Musa','Исраил урпактары; Муса менен бирге миссия'),
  yunus:L('Народ Юнуса · Ниневия в тафсире Ибн Касира','The people of Yunus · Nineveh in Ibn Kathir’s tafsir','Юнус эли · Ибн Касирдин тафсиринде Ниневия'),isa:L('Сыны Исраиля','Children of Israel','Исраил урпактары'),muhammad:L('Все люди','All people','Бардык адамдар')
 };
 for(const r of records){r.dateStatus=r.id==='muhammad'?'historical-chronology':r.id==='isa'?'historical-era':'undated';if(audience[r.id])r.audience=audience[r.id];}
 records.find(r=>r.id==='muhammad').sources.push(q('7:158'));
 for(const id of ['musa','harun'])records.find(r=>r.id===id).sources.push(q('20:43'),q('20:47'));
 const relations=[
 ['nuh','hud','7:69',L('Ад после народа Нуха','Ad after the people of Nuh','Ад Нухтун элинен кийин')],
 ['hud','salih','7:74',L('Самуд после Ад','Thamud after Ad','Самуд Аддан кийин')],
 ['ibrahim','ismail','2:127',L('Ибрахим и Исмаил возводят основания Дома','Ibrahim and Ismail raise the foundations of the House','Ибрахим менен Исмаил Үйдүн пайдубалын көтөрөт')],
 ['ibrahim','lut','29:26',L('Лут уверовал Ибрахиму','Lut believed in Ibrahim','Лут Ибрахимге ыйман келтирген')],
 ['ishaq','yaqub','11:71',L('Весть об Исхаке и после него о Якубе','News of Ishaq and, after him, Yaqub','Исхак жана андан кийин Якуб тууралуу сүйүнчү')],
 ['musa','harun','19:53',L('Муса и Харун · братья и современники','Musa and Harun · brothers and contemporaries','Муса менен Харун · бир туугандар жана замандаштар')],
 ['dawud','sulayman','27:16',L('Сулейман наследует Дауду','Sulayman succeeds Dawud','Сулайман Дауддун мураскери болот')],
 ['zakariya','yahya','19:7',L('Закария получает весть о Яхье','Zakariya receives news of Yahya','Закария Яхья тууралуу сүйүнчү алат')],
 ['isa','muhammad','61:6',L('Иса возвещает о посланнике после него','Isa announces a messenger after him','Иса өзүнөн кийинки элчи тууралуу кабар берет')]
 ];
 for(const [a,b,ref,title]of relations){const relation={a,b,title,source:q(ref)};for(const id of [a,b]){const r=records.find(r=>r.id===id);(r.chronologyRelations??=[]).push(relation);}}
 // Do not turn traditional correlations into dates of birth or missions.
 records.find(r=>r.id==='muhammad').dateLabel=L('Начало откровения · 610 год н. э. в исторической хронологии','Beginning of revelation · 610 CE in historical chronology','Вахийдин башталышы · тарыхый хронологияда б. з. 610-жыл');
};
