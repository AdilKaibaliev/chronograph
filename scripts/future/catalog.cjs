// Original concise paraphrases. References use the continuous numbering with variant suffixes.
const L=(ru,en,ky)=>({ru,en,ky});
const places={
 medina:{name:L('Медина','Medina','Медина'),coord:[39.61,24.47]},
 mecca:{name:L('Мекка · Кааба','Mecca · Kaaba','Мекке · Кааба'),coord:[39.83,21.42]},
 dabiq:{name:L('Дабик — одно из двух названных мест','Dabiq — one of two named places','Дабик — аталган эки жердин бири'),coord:[37.27,36.54]},
 amaq:{name:L('Аль-Амак — точка не установлена','Al-Amaq — location not fixed','Аль-Амак — так чекити аныкталган эмес'),coord:null},
 constantinople:{name:L('Константинополь','Constantinople','Константинополь'),coord:[28.98,41.01]},
 damascus:{name:L('К востоку от Дамаска','East of Damascus','Дамасктын чыгышында'),coord:[36.30,33.51],area:true},
 ludd:{name:L('Лудд','Ludd','Лудд'),coord:[34.89,31.95]},
 tiberias:{name:L('Тивериадское озеро','Lake Tiberias','Табария көлү'),coord:[35.58,32.83]},
 tur:{name:L('Ат-Тур — гора без установленной здесь точки','Al-Tur — mountain not pinpointed here','Ат-Тур — бул жерде так чекити көрсөтүлгөн эмес'),coord:null},
 sham:{name:L('Аш-Шам · область','Al-Sham · region','Аш-Шам · аймак'),coord:[36.4,33.6],area:true},
 syriairaq:{name:L('Между аш-Шамом и Ираком','Between al-Sham and Iraq','Аш-Шам менен Ирактын ортосунда'),coord:[40,34],area:true},
 euphrates:{name:L('Евфрат · участок не указан','Euphrates · stretch unspecified','Евфрат · так тилкеси айтылган эмес'),coord:[40.4,35.2],area:true},
 yemen:{name:L('Йемен · область','Yemen · region','Йемен · аймак'),coord:[45,15],area:true},
 aden:{name:L('Аден · область','Aden · area','Аден · аймак'),coord:[45.03,12.8],area:true},
 arabia:{name:L('Аравийский полуостров','Arabian Peninsula','Араб жарым аралы'),coord:[45,23],area:true},
 hijaz:{name:L('Хиджаз · область','Hijaz · region','Хижаз · аймак'),coord:[39.5,24],area:true},
 busra:{name:L('Бусра в аш-Шаме','Busra in al-Sham','Аш-Шамдагы Бусра'),coord:[36.48,32.52]},
 isfahan:{name:L('Исфахан · происхождение упомянутых последователей','Isfahan · origin of the followers mentioned','Исфахан · айтылган жолдоочулардын чыккан жери'),coord:[51.68,32.65]},
 jerusalem:{name:L('Байт аль-Макдис · Иерусалим','Bayt al-Maqdis · Jerusalem','Байт аль-Макдис · Иерусалим'),coord:[35.23,31.78]},
 hira:{name:L('Аль-Хира','Al-Hira','Аль-Хира'),coord:[44.4,31.88]},
 iraq:{name:L('Ирак · область','Iraq · region','Ирак · аймак'),coord:[44,33],area:true},
 egypt:{name:L('Египет · область','Egypt · region','Мисир · аймак'),coord:[30,27],area:true},
 bayda:{name:L('Аль-Байда — равнина, точка не установлена','Al-Bayda — plain not pinpointed','Аль-Байда — түздүктүн так чекити көрсөтүлгөн эмес'),coord:null},
 rawha:{name:L('Долина ар-Рауха','Valley of al-Rawha','Ар-Рауха өрөөнү'),coord:null},
 tabala:{name:L('Табала · Зу-ль-Халаса','Tabala · Dhu al-Khalasa','Табала · Зул-Халаса'),coord:null},
 baysan:{name:L('Байсан','Baysan','Байсан'),coord:[35.5,32.5]},
 island:{name:L('Остров в рассказе Тамима — не установлен','Island in Tamim’s account — unidentified','Тамимдин баянындагы арал — аныкталган эмес'),coord:null},
 east:{name:L('Восток — границы не названы','East — boundaries unspecified','Чыгыш — чектери айтылган эмес'),coord:null},
 west:{name:L('Запад — границы не названы','West — boundaries unspecified','Батыш — чектери айтылган эмес'),coord:null}
};
const events=[];
function add(id,group,refs,where,title,summary,extra={}){events.push({id,group,refs:refs.split(' '),places:where?where.split(' '):[],title:L(...title),summary:L(...summary),...extra});}
add('battle','expected','muslim:2897','dabiq amaq medina',
 ['Сражение у аль-Амака или Дабика','Battle at al-Amaq or Dabiq','Аль-Амакта же Дабикте болгон салгылаш'],
 ['В хадисе названо одно из двух мест. Из Медины выходит войско; после сражения победившая часть направляется к Константинополю.','The hadith names two alternative locations. An army comes from Medina; its victorious part proceeds to Constantinople.','Хадисте эки жердин бири аталат. Мединадан кошуун чыгат; жеңген бөлүгү Константинополго барат.']);
add('constantinople','expected','muslim:2897','constantinople',
 ['Взятие Константинополя','Taking of Constantinople','Константинополдун алынышы'],
 ['После победы сообщается о взятии города. Известие о Даджале сначала оказывается ложным; затем при возвращении в аш-Шам он появляется. Год не назван.','Victory is followed by taking the city. An initial report of the Dajjal is false; he appears upon the return to al-Sham. No year is given.','Жеңиштен кийин шаар алынат. Дажжал тууралуу алгачкы кабар жалган чыгат; аш-Шамга кайтып келгенде ал пайда болот. Жылы айтылган эмес.']);
add('dajjal','major','muslim:2937a muslim:2897','syriairaq',
 ['Появление Даджаля','Appearance of the Dajjal','Дажжалдын чыгышы'],
 ['Даджаль появляется между аш-Шамом и Ираком. В рассказе — сорок дней, из которых первые три необычной длительности. Календарная дата не дана.','The Dajjal appears between al-Sham and Iraq. The account gives forty days, the first three of unusual length; no calendar date.','Дажжал аш-Шам менен Ирактын ортосунда чыгат. Кырк күндүн алгачкы үчөө өзгөчө узак болот; календардык дата берилген эмес.'],{majorKey:'dajjal'});
add('medina-protected','expected','bukhari:7124 bukhari:7134 muslim:2943b','medina',
 ['Медина во время испытания Даджаля','Medina during the Dajjal’s trial','Дажжалдын сыноосу учурундагы Медина'],
 ['Даджаль не входит в Медину. Упомянуты его стоянка у аль-Джурфа, сотрясения города и выход лицемеров.','The Dajjal cannot enter Medina. Reports describe his camp at al-Jurf, the city shaking, and hypocrites leaving it.','Дажжал Мединага кире албайт. Аль-Журфта токтошу, шаардын силкиниши жана мунафыктардын чыгып кетиши айтылат.']);
add('mecca-protected','expected','muslim:2942a','mecca medina',
 ['Мекка и Медина закрыты для Даджаля','Mecca and Medina barred to the Dajjal','Мекке менен Мединага Дажжал кире албайт'],
 ['В рассказе Тамима ад-Дари названы два города, в которые Даджаль не сможет войти. Местоположение острова в этом рассказе не установлено.','Tamim al-Dari’s account names the two cities the Dajjal cannot enter. The island in that account is not identified.','Тамим ад-Даринин баянында Дажжал кире албаган эки шаар аталат. Баяндагы аралдын орду аныкталган эмес.']);
add('isfahan','expected','muslim:2944','isfahan',
 ['Упоминание Исфахана','Mention of Isfahan','Исфахандын аталышы'],
 ['В хадисе говорится о семидесяти тысячах иудеев Исфахана, следующих за Даджалем. Город указан как их происхождение, а не как место появления Даджаля.','The hadith describes seventy thousand Jews of Isfahan following the Dajjal. The city identifies their origin, not the Dajjal’s place of emergence.','Хадисте Дажжалды ээрчиген Исфахандын жетимиш миң жөөтү айтылат. Шаар алардын чыккан жери; Дажжал чыккан жер катары берилбейт.']);
add('believer','expected','bukhari:7132','medina',
 ['Верующий перед Даджалем','A believer confronts the Dajjal','Момундун Дажжалга каршы турушу'],
 ['Вне Медины верующий свидетельствует против Даджаля. Рассказ описывает убийство этого человека, возвращение его к жизни и невозможность убить его повторно.','Outside Medina a believer testifies against the Dajjal. The account describes his death, return to life, and the Dajjal’s inability to kill him again.','Мединанын сыртында момун Дажжалга каршы күбөлүк берет. Ал өлтүрүлүп, кайра тирилет; Дажжал аны экинчи жолу өлтүрө албайт.']);
add('isa','major','muslim:2937a','damascus',
 ['Нисхождение Исы, мир ему','Descent of Isa, peace be upon him','Исанын түшүшү, ага тынчтык болсун'],
 ['Иса нисходит у белого минарета к востоку от Дамаска и преследует Даджаля. Точка обозначает район города.','Isa descends by a white minaret east of Damascus and pursues the Dajjal. The marker indicates the city area.','Иса Дамасктын чыгышындагы ак мунаранын жанына түшүп, Дажжалдын артынан барат. Белги шаардын аймагын көрсөтөт.'],{majorKey:'isa'});
add('ludd','expected','muslim:2937a','ludd',
 ['Даджаль погибает у ворот Лудда','The Dajjal dies at the gate of Ludd','Дажжалдын Лудд дарбазасында өлүшү'],
 ['Иса настигает и убивает Даджаля у ворот Лудда.','Isa overtakes and kills the Dajjal at the gate of Ludd.','Иса Дажжалды Лудд дарбазасында кууп жетип өлтүрөт.']);
add('yajuj','major','muslim:2937a','tur tiberias',
 ['Выход Яджудж и Маджудж','Emergence of Yajuj and Majuj','Яжуж менен Мажуждун чыгышы'],
 ['После Даджаля Иса укрывает верующих на ат-Туре. Яджудж и Маджудж проходят у Тивериадского озера и выпивают его воду.','After the Dajjal, Isa shelters believers on al-Tur. Yajuj and Majuj pass Lake Tiberias and drink its water.','Дажжалдан кийин Иса момундарды ат-Турга алып чыгат. Яжуж менен Мажуж Табария көлүнүн суусун ичип бүтүшөт.'],{majorKey:'yajuj'});
add('yajuj-end','expected','muslim:2937a','tur',
 ['Гибель Яджудж и Маджудж','End of Yajuj and Majuj','Яжуж менен Мажуждун жок болушу'],
 ['После мольбы Исы и верующих Яджудж и Маджудж погибают. Земля очищается; наступает изобилие.','After Isa and the believers pray, Yajuj and Majuj perish. The earth is cleansed and abundance follows.','Иса менен момундардын дубасынан кийин Яжуж менен Мажуж өлөт. Жер тазаланып, молчулук келет.']);
add('peace','expected','muslim:2940a','',
 ['Мир после гибели Даджаля','Peace after the Dajjal’s death','Дажжал өлгөндөн кийинки тынчтык'],
 ['В этой передаче после гибели Даджаля упомянуты семь лет без вражды между людьми, затем холодный ветер.','This report mentions seven years without enmity after the Dajjal’s death, followed by a cold wind.','Бул риваятта Дажжал өлгөндөн кийин адамдардын ортосунда жети жыл кастык болбостугу, андан соң муздак шамал айтылат.']);
add('wind','expected','muslim:2940a muslim:117','sham yemen',
 ['Ветер забирает верующих','Wind takes the believers','Шамал момундардын жанын алат'],
 ['Ветер забирает людей с верой. В Муслиме 2940a назван аш-Шам, в 117 — Йемен: это две передачи, а не маршрут ветра.','A wind takes those with faith. Muslim 2940a names al-Sham; 117 names Yemen. These are two reports, not a wind route.','Шамал ыймандуулардын жанын алат. Муслим 2940aда аш-Шам, 117де Йемен аталат. Бул шамалдын багыты эмес, эки риваят.']);
add('idols','expected','muslim:2907a muslim:2940a','',
 ['Возвращение к поклонению идолам','Return to idol worship','Буттарга сыйынуунун кайтышы'],
 ['После ухода верующих оставшиеся люди возвращаются к идолопоклонству. В отдельной передаче названы аль-Лат и аль-Узза.','After believers are taken, those remaining return to idol worship. A separate report names al-Lat and al-Uzza.','Момундар кеткенден кийин калгандар буттарга сыйынууга кайтышат. Өзүнчө риваятта аль-Лат менен аль-Узза аталат.']);
add('hour','expected','muslim:2940a bukhari:6506','',
 ['Наступление Часа','Arrival of the Hour','Кыямат саатынын келиши'],
 ['Час застаёт оставшихся людей внезапно, среди обычных занятий. Календарная дата и точка на карте не названы.','The Hour catches the remaining people suddenly during ordinary activities. No calendar date or map location is given.','Кыямат калгандарга күнүмдүк иштеринде күтүүсүз келет. Календардык дата жана картадагы жер айтылган эмес.']);
add('smoke','major','muslim:2901a','',
 ['Дым','Smoke','Түтүн'],
 ['Дым назван среди десяти признаков. В этом перечне не указаны место и положение дыма относительно каждого другого признака.','Smoke is listed among the ten signs. This list gives neither its location nor its position relative to every other sign.','Түтүн он белгинин арасында аталат. Тизмеде анын жери жана башка бардык белгилерге карата кезеги айтылган эмес.'],{majorKey:'smoke'});
add('beast','major','muslim:2901a muslim:2941a','',
 ['Выход Зверя','Emergence of the Beast','Жерден жаныбардын чыгышы'],
 ['Выход Зверя и восход солнца с запада следуют близко друг за другом; какой из двух признаков будет первым, здесь не установлено.','The Beast and the sun rising from the west follow closely upon one another; which comes first is not fixed here.','Жаныбардын чыгышы менен күндүн батыштан чыгышы бири-бирине жакын болот; кайсынысы биринчи экени бул жерде аныкталган эмес.'],{majorKey:'beast'});
add('sun','major','bukhari:6506 muslim:2941a','',
 ['Восход солнца с запада','Sun rising from the west','Күндүн батыштан чыгышы'],
 ['После этого знамения новая вера уже не приносит пользы тому, кто прежде не уверовал. Географическая точка не требуется: речь о небесном явлении.','After this sign, newly professed faith no longer benefits those who did not believe before. This is a celestial event, without a map point.','Бул белгиден кийин мурда ишенбегенге жаңыдан ыйман келтирүү пайда бербейт. Бул асмандагы көрүнүш; картада чекити жок.'],{majorKey:'sun'});
for(const [id,p,ru,en,ky] of [['east-sinking','east','на востоке','in the east','чыгышта'],['west-sinking','west','на западе','in the west','батышта'],['arabia-sinking','arabia','на Аравийском полуострове','in the Arabian Peninsula','Араб жарым аралында']])add(id,'major','muslim:2901a',p,
 ['Провал земли '+ru,'Sinking of the earth '+en,'Жердин чөгүшү — '+ky],
 ['Один из трёх провалов земли в перечне десяти признаков. Конкретный город и взаимный порядок трёх провалов не названы.','One of three sinkings in the list of ten signs. No specific city or order among the three is named.','Он белгинин тизмесиндеги үч чөгүүнүн бири. Так шаар жана үчөөнүн өз ара кезеги айтылган эмес.'],{majorKey:id});
add('fire-gathering','major','muslim:2901a muslim:2901b','yemen aden',
 ['Огонь, собирающий людей','Fire gathering people','Адамдарды чогулткан от'],
 ['Огонь из Йемена гонит людей к месту сбора; другая передача называет окрестности Адена. В 2901a он назван последним из перечисленного.','Fire from Yemen drives people to their gathering; another report names the area of Aden. In 2901a it is called the last of those listed.','Йеменден чыккан от адамдарды жыйналчу жерге айдайт; башка риваятта Аден аймагы аталат. 2901aда тизмедегилердин акыркысы деп айтылат.'],{majorKey:'fire'});
add('bayda','expected','muslim:2882a muslim:2884','bayda mecca',
 ['Провал войска на аль-Байда','Army swallowed at al-Bayda','Аль-Байдада кошуунду жер жутушу'],
 ['Войско направляется к человеку, укрывшемуся у Каабы, и проваливается на равнине аль-Байда. Это сообщение не отождествлено с тремя великими провалами.','An army heading towards someone taking refuge at the Kaaba is swallowed at al-Bayda. This account is not equated here with the three great sinkings.','Каабада баш калкалаган адамга бараткан кошуунду аль-Байдада жер жутат. Бул окуя үч чоң чөгүү менен бириктирилген эмес.']);
add('euphrates','expected','bukhari:7119 muslim:2894a','euphrates',
 ['Евфрат открывает гору золота','Euphrates uncovers a mountain of gold','Евфрат алтын тоону ачат'],
 ['Вокруг золота происходит смертоносная борьба. В хадисе предписано не брать из него. Место на реке и дата не указаны.','Deadly fighting surrounds the gold. The hadith instructs those present not to take it. No stretch of river or date is specified.','Алтын үчүн кыргын болот. Хадисте андан албоо айтылат. Дарыянын так жери жана дата берилген эмес.']);
add('arabia-green','minor','muslim:157c','arabia',
 ['Луга и реки Аравии','Meadows and rivers in Arabia','Аравиядагы шалбаалар жана дарыялар'],
 ['Земля арабов снова становится лугами и реками. Хадис не называет отдельную страну, современный проект или календарный год.','The land of the Arabs returns to meadows and rivers. The hadith names no individual country, modern project, or calendar year.','Арабдардын жери кайра шалбааларга жана дарыяларга айланат. Өзүнчө өлкө, азыркы долбоор же календардык жыл аталбайт.']);
add('hajj-isa','expected','muslim:1252a','rawha',
 ['Тальбия Исы в долине ар-Рауха','Isa’s talbiyah in al-Rawha','Ар-Раухада Исанын талбия айтуусу'],
 ['Иса произносит тальбию для хаджа, умры или обоих обрядов. Место этого сообщения относительно остальных событий здесь не установлено.','Isa recites the talbiyah for Hajj, Umrah, or both. This account is not assigned a position among the other events here.','Иса ажылык, умра же экөө үчүн талбия айтат. Бул окуянын башка окуяларга карата кезеги бул жерде белгиленген эмес.']);
add('hajj-continues','expected','bukhari:1593','mecca',
 ['Паломничество после Яджудж и Маджудж','Pilgrimage after Yajuj and Majuj','Яжуж менен Мажуждан кийинки зыярат'],
 ['Хадж и умра продолжаются после выхода Яджудж и Маджудж. Та же глава передаёт, что Час не наступит до прекращения хаджа.','Hajj and Umrah continue after Yajuj and Majuj emerge. The same chapter reports that the Hour will not come before Hajj ceases.','Яжуж менен Мажуж чыккандан кийин ажылык жана умра уланат. Ошол бөлүмдө ажылык токтомоюнча Кыямат келбестиги айтылат.']);
add('kaaba','expected','bukhari:1591','mecca',
 ['Разрушение Каабы','Destruction of the Kaaba','Каабанын бузулушу'],
 ['Каабу разрушает Зу-с-Сувайкатайн из аль-Хабаши. Аль-Хабаша обозначает его происхождение; дата и место в общей последовательности не названы.','Dhu al-Suwayqatayn from al-Habasha destroys the Kaaba. Al-Habasha identifies his origin; no date or place in an overall sequence is given.','Каабаны аль-Хабашадан чыккан Зус-Сувайкатайн бузат. Аль-Хабаша анын чыккан жерин билдирет; дата жана жалпы кезеги айтылган эмес.']);
add('medina-empty','expected','bukhari:1874','medina',
 ['Опустевшая Медина','Deserted Medina','Ээн калган Медина'],
 ['Люди оставляют Медину, и она становится обиталищем зверей и птиц. В рассказе также названы два пастуха из Музайны и Санийят аль-Вада.','People leave Medina, which becomes home to animals and birds. The account also names two shepherds of Muzayna and Thaniyyat al-Wada.','Адамдар Мединадан кетип, аны жаныбарлар менен куштар мекендейт. Музайнадан эки койчу жана Санийят аль-Вада да аталат.']);
add('hijaz-fire','minor','bukhari:7118 muslim:2902','hijaz busra',
 ['Огонь Хиджаза','Fire of the Hijaz','Хижаздын оту'],
 ['Огонь в Хиджазе освещает шеи верблюдов в Бусре в аш-Шаме. Это отдельный хадис, не огонь сбора из Йемена. Историческая датировка в тексте отсутствует.','A fire in the Hijaz lights camel necks in Busra, al-Sham. This is distinct from Yemen’s gathering fire. The text supplies no historical date.','Хижаздагы от аш-Шамдын Бусрасындагы төөлөрдүн моюндарын жарык кылат. Бул Йеменден чогултуучу оттон өзүнчө хадис. Текстте тарыхый дата жок.']);
add('du-khalasa','expected','bukhari:7116 muslim:2906','tabala',
 ['Возвращение поклонения Зу-ль-Халасе','Renewed worship of Dhu al-Khalasa','Зул-Халасага сыйынуунун кайтышы'],
 ['Сообщение описывает возвращение части племени Даус к поклонению Зу-ль-Халасе. В передаче Муслима названа Табала.','The report describes a return among the tribe of Daws to worship of Dhu al-Khalasa. Muslim’s transmission names Tabala.','Баянда Даус уруусунун бир бөлүгү Зул-Халасага сыйынууга кайтары айтылат. Муслимдин риваятында Табала аталат.']);
add('payments','minor','muslim:2896','iraq sham egypt',
 ['Прекращение поступлений из областей','Withheld payments from regions','Аймактардан төлөмдөрдүн токтошу'],
 ['Названы Ирак, аш-Шам и Египет с их денежными и натуральными поступлениями. Современные санкции или государства к этому сообщению не привязаны.','Iraq, al-Sham and Egypt are named with their monetary and produce payments. This account is not tied to modern sanctions or states.','Ирак, аш-Шам жана Мисир акчалай жана азык төлөмдөрү менен аталат. Баян азыркы санкцияларга же мамлекеттерге байланыштырылган эмес.']);
add('romans','expected','muslim:2898a','',
 ['Численность ар-Рум','Numbers of al-Rum','Ар-Румдун саны'],
 ['В хадисе ар-Рум названы самыми многочисленными людьми при наступлении Часа. Точная территория и современные народы не определены.','The hadith describes al-Rum as the most numerous people when the Hour comes. No precise territory or modern peoples are identified.','Хадисте Кыямат келгенде ар-Рум эң көп сандуу болору айтылат. Так аймак жана азыркы элдер аныкталган эмес.']);
add('qahtan','expected','bukhari:7117','',
 ['Правитель из Кахтана','Ruler from Qahtan','Кахтандан чыккан башкаруучу'],
 ['Назван человек из Кахтана, ведущий людей своим посохом. Племенное происхождение не задаёт место появления на карте.','A man from Qahtan leads people with his staff. Tribal ancestry does not specify a place of emergence on the map.','Кахтандан чыккан адам элди таягы менен башкарат. Уруулук теги картадагы чыгуу жерин аныктабайт.']);
add('jahjah','expected','muslim:2911','',
 ['Правитель Джахджах','Ruler Jahjah','Жахжах аттуу башкаруучу'],
 ['В хадисе назван человек по имени Джахджах, который получит власть. Место и дата не сообщаются.','The hadith names a man called Jahjah who will gain power. No place or date is given.','Хадисте бийликке келе турган Жахжах аттуу адам аталат. Жер жана дата айтылган эмес.']);
add('caliph','expected','muslim:2913a muslim:2914','',
 ['Халиф, щедро раздающий богатство','Caliph distributing abundant wealth','Байлыкты мол тараткан халиф'],
 ['Халиф раздаёт богатство, не считая. В арабском тексте этих передач его имя не названо; подпись «Махди» не добавлена.','A caliph distributes wealth without counting it. These Arabic reports do not name him; the label “Mahdi” has not been added.','Халиф байлыкты эсептебестен таратат. Бул арабча риваяттарда аты аталбайт; «Махди» деген ат кошулган эмес.']);
add('truce','expected','bukhari:3176','',
 ['Перемирие и его нарушение','Truce and its breach','Келишим жана анын бузулушу'],
 ['После перемирия с бану аль-Асфар сообщается о нарушении договора и войске под восемьюдесятью знамёнами. Место не названо.','A truce with Banu al-Asfar is followed by its breach and an army under eighty banners. No location is named.','Бану аль-Асфар менен келишимден кийин анын бузулушу жана сексен туу алдындагы кошуун айтылат. Жери аталган эмес.']);
add('conflict','minor','muslim:2922','',
 ['Сообщение о столкновении перед Часом','Account of a conflict before the Hour','Кыяматка чейинки кагылышуу тууралуу баян'],
 ['Хадис описывает будущее сражение мусульман и иудеев и речь камней и деревьев. Место не названо; связи с современными войнами здесь не проводятся.','The hadith describes a future battle between Muslims and Jews and speech by stones and trees. No place is named; no connection to current wars is made here.','Хадисте мусулмандар менен жөөттөрдүн болочок салгылашы жана таштардын, дарактардын сүйлөшү баяндалат. Жери аталбайт; азыркы согуштарга байланыштырылбайт.']);
const social=[
 ['false-prophets','bukhari:7121',['Лжепророки','False prophets','Жалган пайгамбарлар'],['Около тридцати лжецов заявляют о пророчестве. Отдельные даты и места не перечислены.','About thirty liars claim prophethood. Individual dates and places are not listed.','Отуздай жалганчы пайгамбарлыкты доомат кылат. Өзүнчө даталар жана жерлер саналган эмес.']],
 ['knowledge','bukhari:80',['Уход знания и распространение невежества','Loss of knowledge and spread of ignorance','Билимдин азайышы жана наадандыктын жайылышы'],['Упомянуты исчезновение знания, невежество, распространение вина и прелюбодеяния.','Loss of knowledge, ignorance, widespread wine drinking and adultery are mentioned.','Билимдин жоголушу, наадандык, шарап ичүүнүн жана зынанын жайылышы аталат.']],
 ['women-men','bukhari:81',['Изменение соотношения женщин и мужчин','Changed ratio of women and men','Аялдар менен эркектердин санынын өзгөрүшү'],['Названо множество женщин при малом числе мужчин: пятьдесят женщин на одного попечителя. Причина здесь не указана.','Many women and few men are described: fifty women for one caretaker. The cause is not given here.','Аялдар көп, эркектер аз болору: бир камкорчуга элүү аял туура келери айтылат. Себеби бул жерде берилбейт.']],
 ['trust','bukhari:59 bukhari:7086',['Утрата доверия','Loss of trust','Аманаттын жоголушу'],['Ответственные дела поручают неподходящим людям. Другой рассказ описывает постепенное исчезновение надёжности в отношениях.','Responsibilities are entrusted to unsuitable people. Another account describes trustworthiness gradually disappearing from dealings.','Жооптуу иштер ылайыксыз адамдарга берилет. Башка баянда мамилелердеги ишенимдүүлүктүн акырындап жоголушу сүрөттөлөт.']],
 ['buildings','bukhari:50',['Состязание в высоте построек','Competition in tall buildings','Бийик имарат курууда жарышуу'],['Бедные пастухи состязаются в строительстве высоких зданий. Хадис не называет современные города.','Poor shepherds compete in constructing tall buildings. The hadith does not name modern cities.','Кедей малчылар бийик имараттарды курууда жарышат. Хадисте азыркы шаарлар аталбайт.']],
 ['slave','bukhari:50',['Рабыня рождает своего господина','A slave woman bears her master','Күңдүн өз кожоюнун төрөшү'],['Знамение названо в ответе о признаках Часа. Его толкования не превращены здесь в отдельные датированные события.','This sign is named in an answer about the Hour. Interpretations are not turned into separate dated events here.','Бул белги Кыямат тууралуу жоопто аталат. Анын чечмелөөлөрү өзүнчө даталуу окуяларга айландырылган эмес.']],
 ['earthquakes','bukhari:7121',['Умножение землетрясений','Increase in earthquakes','Жер титирөөлөрдүн көбөйүшү'],['Землетрясения учащаются. Страны, конкретные катастрофы и годы не перечислены.','Earthquakes increase. Countries, individual disasters and years are not listed.','Жер титирөөлөр көбөйөт. Өлкөлөр, өзүнчө кырсыктар жана жылдар саналбайт.']],
 ['time','bukhari:7061',['Сближение времени','Time drawing close','Убакыттын жакындашы'],['Упомянуты сближение времени, уменьшение добрых дел и скупость. Современные технологии в тексте не названы.','Time drawing close, fewer good deeds and miserliness are mentioned. Modern technologies are not named in the text.','Убакыттын жакындашы, жакшы иштердин азайышы жана сараңдык айтылат. Текстте азыркы технологиялар аталбайт.']],
 ['killing','bukhari:7061 bukhari:7121',['Умножение смут и убийств','Increase in turmoil and killing','Бүлгүндөрдүн жана өлтүрүүлөрдүн көбөйүшү'],['Перед Часом умножаются смуты и убийства. Географическая привязка не дана.','Turmoil and killing increase before the Hour. No geographical location is given.','Кыяматтын алдында бүлгүндөр жана өлтүрүүлөр көбөйөт. Географиялык жер берилген эмес.']],
 ['wealth','bukhari:7121 muslim:157c',['Изобилие имущества','Abundance of wealth','Байлыктын мол болушу'],['Имущества становится столько, что трудно найти человека, принимающего милостыню.','Wealth becomes so abundant that finding someone to accept charity is difficult.','Байлык ушунчалык мол болуп, садака ала турган адам табуу кыйын болот.']],
 ['grave','bukhari:7121',['Желание оказаться на месте умершего','Wishing to be in a deceased person’s place','Өлгөн адамдын ордунда болууну каалоо'],['Проходящий мимо могилы желает оказаться на месте лежащего в ней. Это описание испытаний, а не призыв.','A person passing a grave wishes to be in its occupant’s place. This describes hardship rather than an instruction.','Мүрзөдөн өткөн адам андагы кишинин ордунда болууну каалайт. Бул чакырык эмес, сыноонун сүрөттөлүшү.']],
 ['rain','muslim:2904',['Дождь без урожая','Rain without crops','Түшүмсүз жаан'],['Голод описан как обильный дождь, после которого земля ничего не выращивает.','Famine is described as plentiful rain after which the earth produces nothing.','Ачарчылык мол жаандан кийин жер эч нерсе өстүрбөгөн абал катары сүрөттөлөт.']],
 ['harshness','muslim:2128b',['Насилие и внешний облик','Violence and appearance','Зомбулук жана сырткы көрүнүш'],['В сообщении о ещё не виденных людях названы избивающие плетьми и женщины, одетые, но обнажённые. Место не названо.','An account of people not yet seen mentions flogging with whips and women clothed yet naked. No place is named.','Али көрүлбөгөн адамдар тууралуу баянда камчы менен сабагандар жана кийинсе да жылаңач аялдар айтылат. Жер аталбайт.']],
 ['prohibitions','bukhari:5590',['Объявление запретного дозволенным','Treating prohibitions as permissible','Арамды адал деп эсептөө'],['Сообщается о людях общины, считающих дозволенными прелюбодеяние, шёлк, вино и музыкальные инструменты; далее описано наказание.','The report describes people of the community treating adultery, silk, wine and musical instruments as permissible, followed by punishment.','Баянда үммөттөгү кээ бирлер зынаны, жибекти, шарапты жана музыкалык аспаптарды адал эсептери, андан кийин жаза айтылат.']]
];
for(const [id,refs,title,summary] of social)add(id,'minor',refs,'',title,summary);
add('east-fitna','minor','bukhari:7094 muslim:2905a','east',
 ['Смута с востока','Turmoil from the east','Чыгыштан чыккан бүлгүн'],
 ['В передаче указано направление на восток. Границы и современная политическая принадлежность не заданы.','The report points east. Boundaries and modern political affiliations are not specified.','Риваятта чыгыш тарап көрсөтүлөт. Чектери жана азыркы саясий таандыгы берилбейт.']);
add('mission','historical','bukhari:6504','',
 ['Миссия Пророка ﷺ и близость Часа','The Prophet’s ﷺ mission and the Hour’s nearness','Пайгамбардын ﷺ миссиясы жана Кыяматтын жакындыгы'],
 ['Миссия Пророка Мухаммада, да благословит его Аллах и приветствует, и Час сопоставлены с двумя соседними пальцами. Это сообщение о прошлом.','The mission of Prophet Muhammad, peace and blessings be upon him, and the Hour are compared to two adjacent fingers. This concerns the past.','Мухаммад пайгамбардын, ага Аллахтын салам-салаваты болсун, миссиясы менен Кыямат жанаша эки манжага салыштырылат. Бул өткөнгө тиешелүү.']);
add('moon','historical','bukhari:4864','',
 ['Раскалывание луны','Splitting of the moon','Айдын бөлүнүшү'],
 ['Сообщается о раскалывании луны при жизни Пророка ﷺ. Оно не показано как повторное будущее событие.','The moon’s splitting is reported during the Prophet’s ﷺ lifetime. It is not shown as a future repetition.','Айдын бөлүнүшү Пайгамбардын ﷺ өмүрүндө болгону айтылат. Келечекте кайталана турган окуя катары көрсөтүлбөйт.']);
add('death-prophet','historical','bukhari:3176','',
 ['Смерть Пророка ﷺ','Death of the Prophet ﷺ','Пайгамбардын ﷺ дүйнөдөн кайтышы'],
 ['Первым из шести перечисленных сообщений названа смерть Пророка ﷺ. Это уже произошедшее событие; место в этом хадисе не указано.','The Prophet’s ﷺ death is first in a list of six reports. This is a past event; this hadith does not name its location.','Алты кабардын биринчиси — Пайгамбардын ﷺ дүйнөдөн кайтышы. Бул болуп өткөн окуя; ушул хадисте жери айтылбайт.']);
add('jerusalem','historical','bukhari:3176','jerusalem',
 ['Взятие Байт аль-Макдиса','Taking of Bayt al-Maqdis','Байт аль-Макдистин алынышы'],
 ['Байт аль-Макдис назван в перечне шести сообщений. Карточка относится к историческому контексту, без назначения нового будущего завоевания.','Bayt al-Maqdis appears in the list of six reports. This card provides historical context without assigning a new future conquest.','Байт аль-Макдис алты кабардын тизмесинде аталат. Карточка тарыхый маалымат берет; жаңы болочок басып алуу белгиленбейт.']);
add('plague','minor','bukhari:3176','',
 ['Массовая смертность, подобная болезни овец','Mass mortality compared to a sheep disease','Кой оорусуна салыштырылган массалык өлүм'],
 ['Один из шести признаков описан сравнением с болезнью овец. Название эпидемии, место и дата в хадисе не указаны.','One of the six signs is described through a comparison with a sheep disease. The hadith gives no epidemic name, place or date.','Алты белгинин бири кой оорусуна салыштырылып сүрөттөлөт. Хадисте эпидемиянын аты, жери жана датасы берилбейт.']);
add('arab-fitna','minor','bukhari:3176','arabia',
 ['Смута, затрагивающая каждый арабский дом','Turmoil reaching every Arab household','Ар бир араб үйүнө жеткен бүлгүн'],
 ['В перечне шести сообщений названа смута, которая войдёт в каждый арабский дом. Определённая современная война не указана.','The six reports include turmoil entering every Arab household. No specific modern war is identified.','Алты кабарда ар бир араб үйүнө кирген бүлгүн аталат. Белгилүү азыркы согуш көрсөтүлбөйт.']);
add('hira-safety','historical','bukhari:3595','hira mecca',
 ['Безопасный путь от аль-Хиры к Каабе','Safe journey from al-Hira to the Kaaba','Аль-Хирадан Каабага коопсуз жол'],
 ['Ади ибн Хатим передаёт обещание безопасного пути женщины и сообщает, что увидел его исполнение. Точки показывают начало и конец, не точный маршрут.','Adi ibn Hatim reports a promise of a woman’s safe journey and says he witnessed its fulfilment. Points show endpoints, not an exact route.','Ади ибн Хатим аялдын коопсуз сапары тууралуу кабарды айтып, анын аткарылганын көргөнүн билдирет. Белгилер так жолду эмес, башы менен аягын көрсөтөт.']);
add('kisra','historical','bukhari:3595 muslim:2919b','',
 ['Сокровища Кисры','Treasures of Kisra','Кисранын казынасы'],
 ['В сообщении Ади ибн Хатима названы сокровища Кисры; передатчик говорит о своём участии в их получении.','Adi ibn Hatim’s account names the treasures of Kisra; the narrator says he participated in obtaining them.','Ади ибн Хатимдин баянында Кисранын казынасы аталат; риваятчы аны алууга катышканын айтат.']);
add('barrier','historical','bukhari:7135 muslim:2880a','',
 ['Отверстие в преграде Яджудж и Маджудж','Opening in the barrier of Yajuj and Majuj','Яжуж менен Мажуждун тосмосундагы тешик'],
 ['Пророк ﷺ сообщает об отверстии, открывшемся «сегодня». Это сообщение его времени; расположение преграды не указано.','The Prophet ﷺ reports an opening made “today”. This concerns his own time; the barrier’s location is not given.','Пайгамбар ﷺ «бүгүн» ачылган тешик тууралуу айтат. Бул анын дооруна тиешелүү; тосмонун орду берилбейт.']);
add('tamim','historical','muslim:2942a','island baysan tiberias',
 ['Рассказ Тамима ад-Дари','Account of Tamim al-Dari','Тамим ад-Даринин баяны'],
 ['В рассказе о Даджале названы пальмы Байсана, вода Тивериадского озера и источник Зугар. Остров не установлен; аль-Джассаса не отождествлена со Зверем.','The Dajjal account names Baysan’s palms, Lake Tiberias and the spring of Zughar. The island is unidentified; al-Jassasa is not equated with the Beast.','Дажжал тууралуу баянда Байсандын курмалары, Табария көлү жана Зугар булагы аталат. Арал аныкталган эмес; аль-Жассаса Жер жаныбарына теңелбейт.']);
add('baysan','expected','muslim:2942a','baysan',
 ['Пальмы Байсана','Palms of Baysan','Байсандын курмалары'],
 ['В рассказе Тамима приведены слова Даджаля о том, что пальмы перестанут плодоносить. Это речь персонажа внутри переданного рассказа.','Tamim’s account quotes the Dajjal saying that the palms will cease bearing fruit. This is a character’s speech within the transmitted narrative.','Тамимдин баянында Дажжал курмалар мөмө бербей калары тууралуу айтат. Бул жеткирилген баяндын ичиндеги каармандын сөзү.']);
add('two-armies','minor','bukhari:7121','',
 ['Сражение двух больших групп','Battle between two large groups','Эки чоң топтун салгылашы'],
 ['Две большие группы с одним религиозным притязанием сражаются с многочисленными жертвами. Место и дата в тексте не названы.','Two large groups making the same religious claim fight with many casualties. The text gives no place or date.','Бирдей диний дооматы бар эки чоң топ көп жоготуу менен салгылашат. Текстте жер жана дата аталбайт.']);
add('turks','minor','muslim:2912d','',
 ['Сообщение о сражениях с тюрками','Account of fighting with Turks','Түрктөр менен салгылаштар тууралуу баян'],
 ['В хадисе названы тюрки и описан их облик. Историческое название не приравнено к конкретному современному государству; дата не названа.','The hadith names Turks and describes their appearance. The historical designation is not equated with a particular modern state; no date is given.','Хадисте түрктөр аталып, келбети сүрөттөлөт. Тарыхый аталыш белгилүү азыркы мамлекетке теңелбейт; дата берилбейт.']);
add('treasures','expected','muslim:1013','',
 ['Земля открывает сокровища','Earth brings out treasures','Жер казыналарды чыгарат'],
 ['Земля открывает золото и серебро, подобные столбам. Люди вспоминают преступления ради богатства и оставляют его. Это не отождествлено с золотом Евфрата.','The earth brings out gold and silver like columns. People recall crimes committed for wealth and leave it. This is not equated with the Euphrates gold.','Жер мамылардай алтын-күмүш чыгарат. Адамдар байлык үчүн кылган кылмыштарын эстеп, аны ташташат. Бул Евфраттын алтынына теңелбейт.']);
add('faith-trial','minor','muslim:118','',
 ['Испытания веры','Trials of faith','Ыймандын сыноолору'],
 ['Смуты уподоблены тёмной ночи: человек меняет веру между утром и вечером, продавая её за мирские блага.','Turmoil is compared to a dark night: a person changes faith between morning and evening, selling it for worldly gain.','Бүлгүн караңгы түнгө салыштырылат: адам эртең менен кечтин ортосунда ыйманын өзгөртүп, дүйнөлүк пайдага сатат.']);
add('earnings','minor','bukhari:2083','',
 ['Безразличие к происхождению дохода','Indifference to the source of earnings','Кирешенин булагына кайдыгерлик'],
 ['Люди перестают заботиться о том, дозволенным или запретным путём получено имущество.','People cease caring whether wealth was acquired by lawful or unlawful means.','Адамдар байлык адал же арам жол менен табылганына көңүл бурбай калышат.']);
add('pledges','minor','bukhari:2651','',
 ['Ненадёжные свидетельства и обеты','Unreliable testimony and vows','Ишенимсиз күбөлүктөр жана убадалар'],
 ['После лучших поколений описаны ненадёжные люди, свидетельства без просьбы и неисполненные обеты; также упомянута тучность.','After the best generations, the account describes untrustworthy people, unrequested testimony and unfulfilled vows; corpulence is also mentioned.','Эң жакшы муундардан кийин ишенимсиз адамдар, суралбаган күбөлүктөр жана аткарылбаган убадалар сүрөттөлөт; семирүү да аталат.']);
add('scholars','minor','bukhari:100','',
 ['Уход учёных и невежественные руководители','Loss of scholars and ignorant leaders','Аалымдардын кетиши жана билимсиз жетекчилер'],
 ['Знание уходит со смертью учёных. Люди обращаются к невежественным руководителям, которые отвечают без знания.','Knowledge is lost through the death of scholars. People turn to ignorant leaders who give answers without knowledge.','Билим аалымдардын өлүмү менен кетет. Адамдар билими жок жооп берген наадан жетекчилерге кайрылышат.']);
add('medina-growth','minor','muslim:2903','medina',
 ['Расширение застройки Медины','Expansion of Medina’s buildings','Мединанын курулуштарынын кеңейиши'],
 ['Застройка достигает Ихаба или Яхаба. Точная конечная точка в каталоге не установлена; отмечен только город.','Buildings reach Ihab or Yahab. The catalogue does not fix the exact endpoint; only the city is marked.','Курулуштар Ихабга же Яхабга жетет. Каталогдо акыркы так чекит аныкталган эмес; шаар гана белгиленет.']);
add('medina-fitna','minor','bukhari:7060 muslim:2885a','medina',
 ['Смуты среди домов Медины','Turmoil among Medina’s houses','Мединанын үйлөрүндөгү бүлгүндөр'],
 ['Смуты среди домов Медины уподоблены местам падения дождевых капель. В хадисе нет календарной даты.','Turmoil among Medina’s houses is likened to the places where raindrops fall. The hadith gives no calendar date.','Мединанын үйлөрүндөгү бүлгүндөр жаан тамчылары түшкөн жерлерге салыштырылат. Хадисте календардык дата жок.']);
add('rulers','minor','bukhari:7052','',
 ['Предпочтение правителями собственных интересов','Rulers favouring their own interests','Башкаруучулардын өз кызыкчылыгын артык көрүшү'],
 ['Сообщается о предпочтении собственных интересов и делах, вызывающих неодобрение. Определённый будущий правитель не назван.','The report mentions self-preference and objectionable conduct. No particular future ruler is named.','Баянда өз кызыкчылыгын артык көрүү жана жактырылбаган иштер айтылат. Белгилүү болочок башкаруучу аталбайт.']);
add('young-rulers','minor','bukhari:7058','',
 ['Разрушительные действия юных правителей','Destructive actions of young rulers','Жаш башкаруучулардын кыйратуучу иштери'],
 ['В сообщении названы юные люди из курайшитов, через которых придёт бедствие общине. Дата и место не даны.','The account names young men of Quraysh through whom calamity will come to the community. No date or place is given.','Баянда үммөткө кырсык алып келе турган курайштык жаштар аталат. Дата жана жер берилбейт.']);
add('hasan','historical','bukhari:7109','',
 ['Примирение через аль-Хасана','Reconciliation through al-Hasan','Аль-Хасан аркылуу жарашуу'],
 ['Аль-Хасан назван тем, через кого Аллах примирит две большие группы мусульман. В передаче описано состоявшееся примирение.','Al-Hasan is named as the one through whom Allah will reconcile two large Muslim groups. The transmission describes the reconciliation taking place.','Аль-Хасан аркылуу Аллах мусулмандардын эки чоң тобун жараштырары айтылат. Риваятта жарашуунун болгондугу баяндалат.']);
add('ammar','historical','muslim:2915a','',
 ['Гибель Аммара','Death of Ammar','Аммардын өлүмү'],
 ['Аммару сообщено, что его убьёт мятежная группа. Это историческое сообщение; место в данном тексте не названо.','Ammar is told that a rebellious group will kill him. This is a historical account; this text does not name the place.','Аммарга аны козголоңчу топ өлтүрөрү айтылат. Бул тарыхый баян; ушул текстте жери аталбайт.']);
add('conquests','minor','muslim:2900','arabia',
 ['Аравия, Персия, ар-Рум и Даджаль','Arabia, Persia, al-Rum and the Dajjal','Аравия, Персия, ар-Рум жана Дажжал'],
 ['В передаче названы последовательно Аравия, Персия, ар-Рум и Даджаль. Этот рассказ охватывает разные этапы; ар-Рум не заменён точкой современного Рима.','The report names Arabia, Persia, al-Rum and the Dajjal in sequence. It spans different stages; al-Rum is not replaced with a pin on modern Rome.','Риваятта кезеги менен Аравия, Персия, ар-Рум жана Дажжал аталат. Ал ар түрдүү этаптарды камтыйт; ар-Рум азыркы Римдин чекити менен алмаштырылбайт.']);
const sequences=[
 {id:'sham',title:L('Аль-Амак / Дабик → Даджаль','Al-Amaq / Dabiq → Dajjal','Аль-Амак / Дабик → Дажжал'),refs:['muslim:2897'],ids:['battle','constantinople','dajjal','isa','ludd']},
 {id:'isa',title:L('Даджаль → Иса → Яджудж и Маджудж','Dajjal → Isa → Yajuj and Majuj','Дажжал → Иса → Яжуж жана Мажуж'),refs:['muslim:2937a'],ids:['dajjal','isa','ludd','yajuj','yajuj-end','wind']},
 {id:'wind',title:L('Мир → ветер → наступление Часа','Peace → wind → the Hour','Тынчтык → шамал → Кыямат'),refs:['muslim:2940a'],ids:['ludd','peace','wind','idols','hour']}
];
module.exports=require('./journey.cjs')({version:1,places,events,sequences});
