'use strict';
const T=s=>s.split('|');
const places={};
function p(id,coord,n,scale=5){places[id]={coord,name:T(n),scale};}
p('moscow',[37.62,55.75],'Москва|Moscow|Москва');
p('bishkek',[74.6,42.87],'Бишкек|Bishkek|Бишкек',6);
p('kyiv',[30.52,50.45],'Киев|Kyiv|Киев');
p('zhanaozen',[52.86,43.34],'Жанаозен|Zhanaozen|Жаңыөзөн');
p('almaty',[76.94,43.24],'Алматы|Almaty|Алматы',6);
p('sarajevo',[18.41,43.86],'Сараево|Sarajevo|Сараево');
p('belgrade',[20.46,44.82],'Белград|Belgrade|Белград');
p('compiegne',[2.91,49.43],'Компьен|Compiègne|Компьен');
p('versailles',[2.12,48.8],'Версаль|Versailles|Версаль');
p('poland',[19,52],'Польша · театр военных действий|Poland · theatre of war|Польша · согуш аймагы',3);
p('ussr-west',[28,54],'Запад СССР · театр военных действий|Western USSR · theatre of war|СССРдин батышы · согуш аймагы',2.8);
p('normandy',[-.5,49.35],'Нормандия|Normandy|Нормандия',5);
p('berlin',[13.5,52.49],'Берлин|Berlin|Берлин');
p('tokyo-bay',[139.76,35.35],'Токийский залив|Tokyo Bay|Токио булуңу',5);
p('kumanovo',[21.72,42.13],'Куманово|Kumanovo|Куманово');
p('kosovo',[20.9,42.6],'Косово · район операции|Kosovo · operational area|Косово · операция аймагы',5);
p('kabul',[69.18,34.55],'Кабул|Kabul|Кабул');
p('afghanistan',[66,34],'Афганистан · район операции|Afghanistan · operational area|Афганистан · операция аймагы',3.5);
p('libya',[17,28],'Ливия · район операции|Libya · operational area|Ливия · операция аймагы',3);
const sources={
 loc:{title:'Library of Congress. Revelations from the Russian Archives: Internal Workings of the Soviet Union',url:'https://www.loc.gov/exhibits/archives/intn.html'},
 gkchp:{title:'Journal of Democracy. Documents on Democracy, October 1991: statements of 19–21 August',url:'https://www.journalofdemocracy.org/articles/documents-on-democracy-84/'},
 kg05:{title:'OSCE Magazine, July 2005. The OSCE responds to March events in Kyrgyzstan',url:'https://resources.osce.org/sites/default/files/f/documents/5/a/18847.pdf'},
 kg05resign:{title:'U.S. Department of State. Background Note: Kyrgyzstan, April 2005',url:'https://2009-2017.state.gov/outofdate/bgn/kyrgyzstan/47488.htm'},
 kg10:{title:'OSCE/ODIHR. Kyrgyz Republic: Constitutional Referendum, 27 June 2010. Final Report',url:'https://odihr.osce.org/sites/default/files/f/documents/0/3/70936.pdf'},
 kg20:{title:'OSCE/ODIHR. Kyrgyz Republic: Parliamentary Elections, 4 October 2020. Final Report',url:'https://odihr.osce.org/sites/default/files/f/documents/7/a/472461_0.pdf'},
 ua04:{title:'OSCE/ODIHR. Ukraine: Presidential Election, 31 October, 21 November and 26 December 2004',url:'https://odihr.osce.org/odihr/elections/ukraine/eoms/presidential_2004'},
 kz22:{title:'Krzysztof Strachota. Kazakhstan: the CSTO intervenes, the protests pacified. OSW, 10 January 2022',url:'https://www.osw.waw.pl/en/publikacje/analyses/2022-01-10/kazakhstan-csto-intervenes-protests-pacified'},
 csto:{title:'ОДКБ. Архив операции в Казахстане, 6–19 января 2022 года',url:'https://odkb-csto.org/mirotvorcheskaya-operatsiya-odkb-v-kazakhstane-6-19-yanvarya-2022-goda/'},
 wwi:{title:'Imperial War Museums. 4 August 1914: Factsheet',url:'https://www.iwm.org.uk/sites/default/files/press-release/4_August_1914_Factsheet.pdf'},
 armistice:{title:'National Army Museum. 1918: Year of victory',url:'https://www.nam.ac.uk/explore/1918-victory'},
 wwii:{title:'United States Holocaust Memorial Museum. World War II: Key Dates',url:'https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates'},
 bosnia:{title:'NATO. Operation Deliberate Force — ten years on, 30 August 2005; Canada, Department of National Defence. Operation Deliberate Force',url:'https://www.canada.ca/en/department-national-defence/services/military-history/history-heritage/past-operations/europe/deliberate-force.html'},
 kosovo:{title:'NATO. Kosovo air campaign, March–June 1999; Secretary General’s statement, 20 June 1999',url:'https://www.nato.int/en/what-we-do/operations-and-missions/kosovo-air-campaign-march-june-1999'},
 isaf:{title:'NATO. ISAF’s mission in Afghanistan, 2001–2014',url:'https://www.nato.int/en/what-we-do/operations-and-missions/isafs-mission-in-afghanistan-2001-2014'},
 libya:{title:'NATO. NATO and Libya, February–October 2011',url:'https://www.nato.int/en/what-we-do/operations-and-missions/nato-and-libya-february-october-2011'}
};
sources.kg20.url='https://www.osce.org/files/f/documents/7/a/472461_0.pdf';
sources.kg21={title:'OSCE/ODIHR. Kyrgyz Republic: Early Presidential Election, 10 January 2021. Final Report',url:'https://odihr.osce.org/sites/default/files/f/documents/7/0/488587_1.pdf'};
sources.tokayev={title:'Касым-Жомарт Токаев. Выступление на сессии Совета коллективной безопасности ОДКБ, 10 января 2022 года',url:'https://www.odkb-csto.org/session/2022/10-yanvarya-2022-goda-v-formate-videokonferentsii-sostoyalos-vneocherednaya-sessiya-soveta-kollektiv/'};
const stories=[];
function story(id,kind,title,summary,refs,steps){stories.push({id,kind,title:T(title),summary:T(summary),sources:refs,steps:steps.map(([date,place,title,text,kind])=>({date,place,title:T(title),text:T(text),...(kind?{kind}:{})}))});}
story('gkchp','attempt','ГКЧП · август 1991|August 1991 coup attempt|ГКЧП · 1991-жылдын августу',
 'Попытка отстранить Михаила Горбачёва и остановить подписание нового союзного договора.|An attempt to remove Mikhail Gorbachev and stop the signing of a new Union Treaty.|Михаил Горбачёвду бийликтен четтетүү жана жаңы союздук келишимге кол коюуну токтотуу аракети.', ['loc','gkchp'],[
 ['1991-08-19','moscow','Начало попытки|The attempt begins|Аракеттин башталышы','ГКЧП объявляет о переходе полномочий. В Москву вводят войска.|The State Emergency Committee claims authority. Troops enter Moscow.|ГКЧП ыйгарым укуктарды өзүнө алганын жарыялайт. Москвага аскер киргизилет.'],
 ['1991-08-20','moscow','Сопротивление ГКЧП|Resistance to the coup|ГКЧПга каршылык','Российское руководство и демонстранты противостоят ГКЧП в Москве.|Russian leaders and demonstrators oppose the committee in Moscow.|Россиянын жетекчилери жана демонстранттар Москвада ГКЧПга каршы чыгышат.'],
 ['1991-08-21','moscow','Провал попытки|The attempt fails|Аракеттин ишке ашпай калышы','ГКЧП теряет власть; попытка захвата управления страной проваливается.|The committee loses its grip; the attempted seizure of power fails.|ГКЧП бийлигин жоготот; өлкөнү башкарууну басып алуу аракети ишке ашпайт.']]);
story('orange-2004','protest','Оранжевая революция · 2004|Orange Revolution · 2004|Кызгылт сары революция · 2004',
 'Политический кризис вокруг президентских выборов на Украине.|A political crisis surrounding Ukraine’s presidential election.|Украинадагы президенттик шайлоонун айланасындагы саясий кризис.', ['ua04'],[
 ['2004-11-21','kyiv','Спорный второй тур|Disputed second round|Талаштуу экинчи тур','Нарушения на выборах вызывают протесты; Киев становится центром противостояния.|Electoral irregularities trigger protests, centred in Kyiv.|Шайлоодогу мыйзам бузуулар нааразылык жаратат; Киев каршылыктын борборуна айланат.'],
 ['2004-12-03','kyiv','Решение Верховного суда|Supreme Court ruling|Жогорку соттун чечими','Суд отменяет постановление о результатах и требует повторного голосования.|The court invalidates the results decision and orders a repeat vote.|Сот жыйынтыктар тууралуу токтомду жокко чыгарып, кайра добуш берүүнү талап кылат.'],
 ['2004-12-26','kyiv','Повторное голосование|Repeat vote|Кайра добуш берүү','Проходит повторный второй тур президентских выборов.|The presidential election’s second round is repeated.|Президенттик шайлоонун экинчи туру кайра өткөрүлөт.']]);
story('kyrgyzstan-2005','protest','Кыргызстан · Тюльпановая революция|Kyrgyzstan · Tulip Revolution|Кыргызстан · Жоогазын революциясы',
 'Протесты после парламентских выборов приводят к смене власти.|Protests after parliamentary elections lead to a change of government.|Парламенттик шайлоодон кийинки нааразылык бийликтин алмашуусуна алып келет.', ['kg05','kg05resign'],[
 ['2005-03-13','bishkek','Второй тур выборов|Second round of elections|Шайлоонун экинчи туру','Споры о парламентских выборах усиливают политический кризис.|Disputes over parliamentary elections intensify the political crisis.|Парламенттик шайлоо тууралуу талаштар саясий кризисти күчөтөт.'],
 ['2005-03-24','bishkek','Смена власти|Change of government|Бийликтин алмашуусу','Протестующие занимают здание правительства; Аскар Акаев покидает страну.|Protesters occupy the government building; Askar Akayev leaves the country.|Демонстранттар өкмөт имаратын ээлейт; Аскар Акаев өлкөдөн чыгып кетет.'],
 ['2005-04-04','moscow','Заявление об отставке|Resignation letter|Отставка тууралуу арыз','Аскар Акаев подписывает заявление об отставке в Москве.|Askar Akayev signs his resignation in Moscow.|Аскар Акаев Москвада отставка тууралуу арызга кол коёт.']]);
story('kyrgyzstan-2010','protest','Кыргызстан · Апрельские события|Kyrgyzstan · April events|Кыргызстан · Апрель окуялары',
 'Апрельское восстание, временное правительство и конституционный референдум.|The April uprising, an interim government and a constitutional referendum.|Апрель көтөрүлүшү, Убактылуу өкмөт жана конституциялык референдум.', ['kg10'],[
 ['2010-04-07','bishkek','Кровопролитие в Бишкеке|Bloodshed in Bishkek|Бишкектеги кан төгүү','Столкновения сопровождаются гибелью людей; Курманбек Бакиев покидает столицу.|Clashes cause deaths; Kurmanbek Bakiyev leaves the capital.|Кагылышууларда адамдар каза болот; Курманбек Бакиев борбордон кетет.'],
 ['2010-04-08','bishkek','Временное правительство|Interim government|Убактылуу өкмөт','Власть переходит к временному правительству во главе с Розой Отунбаевой.|An interim government led by Roza Otunbayeva assumes power.|Роза Отунбаева баштаган Убактылуу өкмөт бийликти колго алат.'],
 ['2010-06-27','bishkek','Конституционный референдум|Constitutional referendum|Конституциялык референдум','Общенациональный референдум утверждает новую конституцию.|A nationwide referendum approves a new constitution.|Жалпы элдик референдум жаңы конституцияны кабыл алат.']]);
story('kyrgyzstan-2020','protest','Кыргызстан · Октябрьские события|Kyrgyzstan · October events|Кыргызстан · Октябрь окуялары',
 'После парламентских выборов протесты вызывают новый политический кризис.|Protests following parliamentary elections trigger another political crisis.|Парламенттик шайлоодон кийинки нааразылыктар жаңы саясий кризиске алып келет.', ['kg20'],[
 ['2020-10-04','bishkek','Парламентские выборы|Parliamentary elections|Парламенттик шайлоо','Состоялись выборы депутатов Жогорку Кенеша.|Elections to the Jogorku Kenesh take place.|Жогорку Кеңештин депутаттарын шайлоо өткөрүлөт.'],
 ['2020-10-05','bishkek','Протесты|Protests|Нааразылык акциялары','В Бишкеке начинаются массовые выступления против результатов голосования.|Mass protests against the election results begin in Bishkek.|Бишкекте шайлоонун жыйынтыгына каршы массалык нааразылык башталат.'],
 ['2020-10-06','bishkek','Результаты отменены|Results annulled|Жыйынтыктар жокко чыгарылды','ЦИК признаёт результаты парламентских выборов недействительными.|The Central Election Commission annuls the parliamentary election results.|Борбордук шайлоо комиссиясы парламенттик шайлоонун жыйынтыктарын жараксыз деп табат.'],
 ['2020-10-15','bishkek','Отставка президента|President resigns|Президенттин отставкасы','Сооронбай Жээнбеков объявляет об отставке.|Sooronbay Jeenbekov announces his resignation.|Сооронбай Жээнбеков отставкасын жарыялайт.']]);
story('kazakhstan-2022','protest','Казахстан · январь 2022 и ОДКБ|Kazakhstan · January 2022 and the CSTO|Казакстан · 2022-жылдын январы жана ЖККУ',
 'Протесты, вооружённое насилие и операция ОДКБ показаны отдельными этапами.|Protests, armed violence and the CSTO operation appear as distinct stages.|Нааразылыктар, куралдуу зомбулук жана ЖККУ операциясы өзүнчө баскычтарда көрсөтүлөт.', ['kz22','csto'],[
 ['2022-01-02','zhanaozen','Начало протестов|Protests begin|Нааразылыктын башталышы','Повышение цен на сжиженный газ вызывает протесты в Жанаозене.|An LPG price increase triggers protests in Zhanaozen.|Суюлтулган газдын кымбатташы Жаңыөзөндө нааразылык жаратат.'],
 ['2022-01-05','almaty','Насилие в Алматы|Violence in Almaty|Алматыдагы зомбулук','Нападения на общественные здания и столкновения резко обостряют кризис.|Attacks on public buildings and clashes escalate the crisis.|Коомдук имараттарга кол салуулар жана кагылышуулар кризисти курчутат.'],
 ['2022-01-06','almaty','Ввод сил ОДКБ|CSTO deployment|ЖККУ күчтөрүнүн киргизилиши','По запросу президента Казахстана начинается ввод контингентов ОДКБ.|CSTO contingents begin deployment at the Kazakh president’s request.|Казакстандын президентинин өтүнүчү менен ЖККУ контингенттери киргизиле баштайт.','intervention'],
 ['2022-01-13','almaty','Начало вывода|Withdrawal begins|Чыгаруунун башталышы','После церемонии завершения операции начинается вывод сил ОДКБ.|CSTO withdrawal begins following the operation’s closing ceremony.|Операцияны аяктоо аземинен кийин ЖККУ күчтөрүн чыгаруу башталат.','intervention'],
 ['2022-01-19','almaty','Вывод завершён|Withdrawal completed|Чыгаруу аяктады','ОДКБ сообщает о завершении вывода контингентов из Казахстана.|The CSTO reports the completion of its withdrawal from Kazakhstan.|ЖККУ контингенттеринин Казакстандан чыгарылышы аяктаганын билдирет.','intervention']]);
story('wwi','war','Первая мировая война|First World War|Биринчи дүйнөлүк согуш',
 'От июльского кризиса до перемирия на Западном фронте.|From the July Crisis to the armistice on the Western Front.|Июль кризисинен Батыш фронтундагы элдешүүгө чейин.', ['wwi','armistice'],[
 ['1914-06-28','sarajevo','Сараевское убийство|Sarajevo assassination|Сараеводогу киши өлтүрүү','Убийство Франца Фердинанда запускает июльский дипломатический кризис.|The assassination of Franz Ferdinand triggers the July diplomatic crisis.|Франц Фердинанддын өлтүрүлүшү июлдагы дипломатиялык кризиске түрткү болот.'],
 ['1914-07-28','belgrade','Объявление войны Сербии|War declared on Serbia|Сербияга согуш жарыялоо','Австро-Венгрия объявляет войну Сербии; конфликт расширяется.|Austria-Hungary declares war on Serbia; the conflict expands.|Австро-Венгрия Сербияга согуш жарыялайт; жаңжал кеңейет.'],
 ['1918-11-11','compiegne','Компьенское перемирие|Compiègne armistice|Компьендеги элдешүү','Перемирие с Германией прекращает боевые действия на Западном фронте.|The armistice with Germany ends fighting on the Western Front.|Германия менен элдешүү Батыш фронтундагы салгылашууларды токтотот.']]);
story('wwii','war','Вторая мировая война|Second World War|Экинчи дүйнөлүк согуш',
 'Ключевые рубежи войны в Европе и её завершение в Азии.|Key milestones in Europe and the war’s conclusion in Asia.|Европадагы согуштун негизги учурлары жана анын Азияда аякташы.', ['wwii'],[
 ['1939-09-01','poland','Вторжение Германии в Польшу|Germany invades Poland|Германиянын Польшага басып кириши','Начало Второй мировой войны в Европе.|The Second World War begins in Europe.|Европада Экинчи дүйнөлүк согуш башталат.'],
 ['1939-09-17','poland','Вступление советских войск|Soviet invasion|Советтик аскерлердин кириши','Советские войска вторгаются в восточную Польшу.|Soviet forces invade eastern Poland.|Советтик аскерлер чыгыш Польшага басып кирет.'],
 ['1941-06-22','ussr-west','Нападение на СССР|Invasion of the USSR|СССРге кол салуу','Германия и её союзники начинают вторжение в СССР.|Germany and its allies invade the USSR.|Германия жана анын союздаштары СССРге басып кирет.'],
 ['1944-06-06','normandy','Высадка в Нормандии|Normandy landings|Нормандияга десант түшүрүү','Союзники высаживаются на побережье Нормандии.|Allied forces land on the Normandy coast.|Союздаш аскерлер Нормандиянын жээгине түшөт.'],
 ['1945-05-08','berlin','Капитуляция Германии|German surrender|Германиянын багынышы','Капитуляция вступает в силу 8 мая; в Москве уже 9 мая.|Surrender takes effect on 8 May; in Moscow it is already 9 May.|Багынуу 8-майда күчүнө кирет; Москвада 9-май болуп калган.'],
 ['1945-09-02','tokyo-bay','Капитуляция Японии|Japanese surrender|Япониянын багынышы','Акт о капитуляции Японии подписан в Токийском заливе.|Japan’s surrender is signed in Tokyo Bay.|Япониянын багынуу актысына Токио булуңунда кол коюлат.']]);
story('nato-bosnia','intervention','НАТО · Босния, 1995|NATO · Bosnia, 1995|НАТО · Босния, 1995',
 'Воздушная операция Deliberate Force против военных объектов боснийских сербов.|Operation Deliberate Force targeted Bosnian Serb military facilities.|Deliberate Force аба операциясы босниялык сербдердин аскердик объектилерине багытталган.', ['bosnia'],[
 ['1995-08-30','sarajevo','Начало воздушной кампании|Air campaign begins|Аба өнөктүгүнүн башталышы','НАТО начинает наносить удары в Боснии и Герцеговине.|NATO begins air strikes in Bosnia and Herzegovina.|НАТО Босния жана Герцеговинада абадан сокку ура баштайт.'],
 ['1995-09-20','sarajevo','Завершение операции|Operation ends|Операциянын аякташы','Командование ООН и НАТО объявляет операцию завершённой.|UN and NATO commanders terminate the operation.|БУУ менен НАТОнун командачылыгы операцияны аяктайт.']]);
story('nato-yugoslavia','intervention','НАТО · Югославия, 1999|NATO · Yugoslavia, 1999|НАТО · Югославия, 1999',
 'Воздушная кампания Allied Force и переход к присутствию KFOR.|The Allied Force air campaign and the transition to KFOR’s presence.|Allied Force аба өнөктүгү жана KFOR күчтөрүнүн жайгашуусуна өтүү.', ['kosovo'],[
 ['1999-03-24','belgrade','Начало бомбардировок|Bombing begins|Бомбалоонун башталышы','НАТО начинает воздушные удары по Союзной Республике Югославии.|NATO starts air strikes against the Federal Republic of Yugoslavia.|НАТО Югославия Союздук Республикасына абадан сокку ура баштайт.'],
 ['1999-06-09','kumanovo','Военно-техническое соглашение|Military Technical Agreement|Аскердик-техникалык келишим','Подписано соглашение о выводе югославских сил из Косово.|An agreement provides for Yugoslav forces to withdraw from Kosovo.|Югославия күчтөрүн Косоводон чыгаруу жөнүндө келишимге кол коюлат.'],
 ['1999-06-10','kosovo','Удары приостановлены|Air strikes suspended|Аба соккулары токтотулду','НАТО приостанавливает воздушные удары.|NATO suspends the air strikes.|НАТО аба соккуларын токтотот.'],
 ['1999-06-20','kosovo','Кампания завершена|Campaign terminated|Өнөктүк аяктады','НАТО официально прекращает воздушную кампанию.|NATO formally terminates the air campaign.|НАТО аба өнөктүгүн расмий аяктайт.']]);
story('nato-afghanistan','intervention','НАТО · ISAF в Афганистане|NATO · ISAF in Afghanistan|НАТО · Афганистандагы ISAF',
 'НАТО принимает командование ISAF в 2003 году; сама миссия создана в 2001 году.|NATO takes command of ISAF in 2003; the mission itself was established in 2001.|НАТО ISAFты башкарууну 2003-жылы кабыл алат; миссия 2001-жылы түзүлгөн.', ['isaf'],[
 ['2003-08-11','kabul','Командование НАТО|NATO takes command|НАТО башкарууну кабыл алат','НАТО принимает руководство международными силами ISAF.|NATO assumes leadership of the international ISAF force.|НАТО эл аралык ISAF күчтөрүнүн жетекчилигин кабыл алат.'],
 ['2013-06-18','afghanistan','Передача ведущей роли|Afghan forces take the lead|Негизги ролду өткөрүп берүү','Афганские силы принимают ведущую роль в обеспечении безопасности по всей стране.|Afghan forces take the lead for security throughout the country.|Афган күчтөрү өлкө боюнча коопсуздукта негизги ролду өзүнө алат.'],
 ['2014-12-31','afghanistan','Завершение ISAF|ISAF concludes|ISAFтын аякташы','Миссия ISAF завершается; с 1 января действует новая миссия Resolute Support.|ISAF concludes; Resolute Support begins on 1 January.|ISAF аяктайт; 1-январдан Resolute Support жаңы миссиясы башталат.']]);
story('nato-libya','intervention','НАТО · Ливия, 2011|NATO · Libya, 2011|НАТО · Ливия, 2011',
 'Операция Unified Protector под командованием НАТО.|Operation Unified Protector under NATO command.|НАТО башкарган Unified Protector операциясы.', ['libya'],[
 ['2011-03-31','libya','НАТО принимает командование|NATO assumes full command|НАТО толук башкарууну кабыл алат','Все международные военные действия в рамках операции переходят под командование НАТО.|NATO takes sole command of the international military operation.|Эл аралык аскердик операцияны толук башкаруу НАТОго өтөт.'],
 ['2011-10-31','libya','Завершение операции|Operation ends|Операциянын аякташы','НАТО завершает операцию Unified Protector.|NATO ends Operation Unified Protector.|НАТО Unified Protector операциясын аяктайт.']]);
stories.find(s=>s.id==='kyrgyzstan-2020').sources.push('kg21');
const kz=stories.find(s=>s.id==='kazakhstan-2022');kz.sources.push('tokayev');
kz.summary=T('Протесты, вооружённое насилие и операция ОДКБ показаны отдельными этапами. 10 января Токаев охарактеризовал кризис как попытку государственного переворота.|Protests, armed violence and the CSTO operation appear as distinct stages. On 10 January, Tokayev described the crisis as an attempted coup.|Нааразылыктар, куралдуу зомбулук жана ЖККУ операциясы өзүнчө баскычтарда көрсөтүлөт. 10-январда Токаев кризисти мамлекеттик төңкөрүш аракети деп мүнөздөгөн.');
module.exports={places,sources,stories};
