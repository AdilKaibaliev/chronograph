// Original brief summaries, verified against the named TDV articles.
const L=(ru,en,ky)=>[ru,en,ky];
const P=(name,birth,death,era,article,text,options={})=>({name,birth,death,era,article,text,...options});
module.exports=[
P(L('Закария аль-Ансари','Zakariyya al-Ansari','Закария аль-Ансари'),1421,1520,'ок. 824–926 г. х.','ZEKERİYYÂ el-ENSÂRÎ',L(
 'Египетский шафиитский правовед, преподаватель и главный судья. Обучал нескольких поколений учёных Каира, писал о праве, хадисах и логике. Год рождения передаётся по-разному: около 1421 года.',
 'An Egyptian Shafii jurist, teacher and chief judge. He taught generations of Cairo scholars and wrote on law, hadith and logic. Accounts differ on his birth year, placed here around 1421.',
 'Египеттик шафиий укук таануучу, мугалим жана башкы казы. Каир аалымдарынын бир нече муунун окутуп, укук, хадис жана логика боюнча жазган. Туулган жылы ар башка берилет: бул жерде болжол менен 1421-жыл.'),{approxBirth:true}),
P(L('Ибн Хаджар аль-Хайтами','Ibn Hajar al-Haytami','Ибн Хажар аль-Хайтами'),1504,1567,'ок. 909–974 г. х.','İBN HACER el-HEYTEMÎ',L(
 'Шафиитский правовед, родившийся в Египте и работавший в Мекке. Автор правовых сочинений и ответов на вопросы, в том числе «Тухфат аль-мухтадж». Его следует отличать от хадисоведа Ибн Хаджара аль-Аскаляни, умершего в 1449 году.',
 'A Shafii jurist born in Egypt and active in Mecca. He wrote legal works and responses, including Tuhfat al-muhtaj. He is distinct from the hadith scholar Ibn Hajar al-Asqalani, who died in 1449.',
 'Египетте туулуп, Меккеде иштеген шафиий укук таануучу. Укуктук эмгектерди жана суроолорго жоопторду, анын ичинде «Тухфат аль-мухтажды» жазган. Ал 1449-жылы каза болгон хадис аалымы Ибн Хажар аль-Аскаланиден башка адам.'),{approxBirth:true}),
P(L('Эбуссууд-эфенди','Ebussuud Efendi','Эбуссууд эфенди'),1490,1574,'896–982 г. х.','EBÜSSUÛD EFENDİ',L(
 'Османский ханафитский правовед и толкователь Корана. С 1545 года занимал должность шейх-уль-ислама. Его фетвы и работа с султанскими установлениями влияли на правовую практику; написал тафсир «Иршад аль-акль ас-салим».',
 'An Ottoman Hanafi jurist and Quran commentator, serving as chief mufti from 1545. His legal opinions and work with sultanic regulations shaped legal practice. He wrote the commentary Irshad al-aql al-salim.',
 'Осмондук ханафий укук таануучу жана Куран чечмелөөчүсү. 1545-жылдан шейх-уль-ислам болгон. Фатвалары жана султандын эрежелери менен иштөөсү укуктук тажрыйбага таасир эткен. «Иршад аль-акль ас-салим» тафсирин жазган.')),
P(L('Ташкёпрюзаде Ахмед','Taşköprizade Ahmed','Ташкөпүрүзаде Ахмед'),1495,1561,'901–968 г. х.','TAŞKÖPRİZÂDE AHMED EFENDİ',L(
 'Османский учёный, преподаватель и судья. В «Аш-Шакаик ан-нуманийя» собрал биографии османских учёных, а в «Мифтах ас-саада» систематизировал отрасли знания. Писал также о богословии, языке и логике.',
 'An Ottoman scholar, teacher and judge. Al-Shaqaiq al-numaniyya collects biographies of Ottoman scholars, while Miftah al-saada classifies branches of learning. He also wrote on theology, language and logic.',
 'Осмондук аалым, мугалим жана казы. «Аш-Шакаик ан-нуманийяда» Осмон аалымдарынын өмүр баяндарын чогултуп, «Мифтах ас-саадада» билим тармактарын иреттеген. Теология, тил жана логика тууралуу да жазган.')),
P(L('Зайн ад-Дин Ибн Нуджайм','Zayn al-Din Ibn Nujaym','Зайн ад-Дин Ибн Нужайм'),1520,1563,'926–970 г. х.','İBN NÜCEYM, Zeynüddin',L(
 'Ханафитский правовед из Каира. Преподавал и составлял правовые труды. «Аль-Бахр ар-раик» — его комментарий к правовому своду ан-Насафи; «Аль-Ашбах ва-н-назаир» рассматривает общие правила и связанные правовые случаи.',
 'A Hanafi jurist from Cairo who taught and compiled legal works. Al-Bahr al-raiq comments on al-Nasafi’s legal compendium; al-Ashbah wa-l-nazair examines general legal rules and related cases.',
 'Каирлик ханафий укук таануучу. Сабак берип, укуктук эмгектерди түзгөн. «Аль-Бахр ар-раик» ан-Насафинин укук жыйнагына түшүндүрмө берет; «Аль-Ашбах ва-н-назаир» жалпы укуктук эрежелерди жана байланышкан учурларды карайт.')),
P(L('Абд аль-Хакк ад-Дихлави','Abd al-Haqq al-Dihlawi','Абд аль-Хакк ад-Дихлави'),1551,1642,'958–1052 г. х.','DİHLEVÎ, Abdülhak b. Seyfeddin',L(
 'Хадисовед из Дели. Учился в Индии и Хиджазе, затем преподавал в Дели. Его труды и ученики способствовали распространению изучения хадисов в Южной Азии; писал на арабском и персидском языках.',
 'A hadith scholar from Delhi. He studied in India and the Hijaz, then taught in Delhi. His writings and students helped expand hadith scholarship in South Asia. He wrote in Arabic and Persian.',
 'Делилик хадис аалымы. Индияда жана Хижазда окуп, кийин Делиде сабак берген. Эмгектери менен шакирттери Түштүк Азияда хадис илимин жайылтууга салым кошкон. Арабча жана персче жазган.')),
P(L('Ахмад Баба ат-Тимбукти','Ahmad Baba al-Timbukti','Ахмад Баба ат-Тимбукти'),1556,1627,'963–1036 г. х.','AHMED BÂBÂ et-TİNBÜKTÎ',L(
 'Маликитский правовед и биограф учёных из Тимбукту. После марокканского завоевания был увезён в Марракеш, где продолжал преподавать и писать. Его сочинения сохраняют сведения об учёных Западной Африки и Магриба.',
 'A Maliki jurist and biographer of scholars from Timbuktu. After the Moroccan conquest he was taken to Marrakesh, where he continued teaching and writing. His works preserve accounts of scholars in West Africa and the Maghreb.',
 'Тимбуктулук маликий укук таануучу жана аалымдардын өмүр баянын жазуучу. Марокко басып алгандан кийин Марракешке алып кетилип, ал жерде окутуп, жазууну уланткан. Эмгектери Батыш Африка жана Магриб аалымдары тууралуу маалымат сактайт.')),
P(L('Ахмад Сирхинди','Ahmad Sirhindi','Ахмад Сирхинди'),1564,1624,'971–1034 г. х.','İMÂM-ı RABBÂNÎ',L(
 'Индийский ханафитский учёный и наставник накшбандийской традиции из Сирхинда. Учился у отца и других преподавателей, писал о богословии и духовном воспитании. Его письма собраны в «Мактубат»; значительная часть деятельности относится к XVII веку.',
 'An Indian Hanafi scholar and Naqshbandi teacher from Sirhind. He studied with his father and other teachers and wrote on theology and spiritual education. His letters form the Maktubat; much of his activity belongs to the seventeenth century.',
 'Сирхиндден чыккан индиялык ханафий аалым жана накшбандий насаатчы. Атасы жана башка мугалимдерден билим алып, теология жана руханий тарбия тууралуу жазган. Каттары «Мактубатка» жыйналган; ишмердигинин кыйла бөлүгү XVII кылымга таандык.'))
];
