'use strict';
// Original short biographies; dates and works checked against the named TDV articles.
const L=(ru,en,ky)=>[ru,en,ky];
const P=(name,birth,death,era,article,text,options={})=>({name,birth,death,era,article,text,...options});
module.exports=[
P(L('Кятиб Челеби','Kâtib Çelebi','Катиб Челеби'),1609,1657,'1017–1067 г. х.','KÂTİB ÇELEBİ',L(
 'Османский историк, географ и библиограф из Стамбула. Служил писцом, участвовал в походах, затем посвятил себя изучению книг. Составил библиографический свод «Кашф аз-зунун» и географический труд «Джиханнюма», сопоставляя восточные и европейские сведения.',
 'An Ottoman historian, geographer and bibliographer from Istanbul. After working as a clerk and joining campaigns, he devoted himself to scholarship. His works include the bibliography Kashf al-zunun and the geography Cihannüma, comparing eastern and European knowledge.',
 'Стамбулдук Осмон тарыхчысы, географ жана библиограф. Катчы болуп иштеп, жортуулдарга катышкандан кийин китеп изилдөөгө берилген. Чыгыш жана Европа маалыматтарын салыштырып, «Кашф аз-зунун» библиографиялык жыйнагын жана «Жиханнума» географиялык эмгегин түзгөн.')),
P(L('Абд аль-Гани ан-Набулуси','Abd al-Ghani al-Nabulusi','Абд аль-Гани ан-Набулуси'),1641,1731,'1050–1143 г. х.','NABLUSÎ, Abdülganî b. İsmâil',L(
 'Дамасский ханафитский учёный, поэт и суфийский наставник. Преподавал, писал о праве, богословии и духовной жизни. Оставил описания путешествий по аш-Шаму, Египту и Хиджазу, содержащие сведения о городах и обществах Османской эпохи.',
 'A Damascene Hanafi scholar, poet and Sufi teacher. He taught and wrote on law, theology and spiritual life. Accounts of his travels through al-Sham, Egypt and the Hijaz preserve observations of Ottoman cities and societies.',
 'Дамасктык ханафий аалым, акын жана суфий насаатчы. Укук, теология жана руханий жашоо тууралуу жазып, сабак берген. Аш-Шам, Египет жана Хижаздагы саякаттарынын баяндары Осмон доорунун шаарлары менен коомдору тууралуу маалымат сактайт.')),
P(L('Исмаил Хаккы Бурсеви','Ismail Hakki Bursevi','Исмаил Хаккы Бурсеви'),1653,1725,'1063–1137 г. х.','İSMÂİL HAKKI BURSEVÎ',L(
 'Османский толкователь Корана, проповедник и поэт, долго живший в Бурсе. Принадлежал к джалватийской суфийской традиции. Его «Рух аль-баян» вырос из последовательного толкования Корана на проповедях; писал на арабском и турецком языках.',
 'An Ottoman Quran commentator, preacher and poet who lived for many years in Bursa. He belonged to the Jalwati Sufi tradition. His Ruh al-bayan developed from sequential Quran exposition in sermons; he wrote in Arabic and Turkish.',
 'Бурсада узак жашаган Осмон Куран чечмелөөчүсү, дааватчы жана акын. Жалватий суфий салтына таандык болгон. «Рух аль-баян» эмгеги Куранды баяндарда иреттүү чечмелөөдөн жаралган; арабча жана түркчө жазган.')),
P(L('Мустафа Наима','Mustafa Naima','Мустафа Наима'),1655,1716,'ок. 1065–1128 г. х.','NAÎMÂ',L(
 'Османский историк, родившийся около 1655 года в Халебе. Служил в канцеляриях и стал официальным хронистом. Его «История Наимы» соединяет более ранние записи с анализом государственных дел, войн и общественных противоречий.',
 'An Ottoman historian born around 1655 in Aleppo. He served in government offices and became an official chronicler. His History of Naima combines earlier records with analysis of government, warfare and social tensions.',
 'Болжол менен 1655-жылы Халебде туулган Осмон тарыхчысы. Кеңселерде иштеп, расмий жылнаамачы болгон. «Наима тарыхы» мурдагы жазууларды мамлекеттик иштердин, согуштардын жана коомдук карама-каршылыктардын талдоосу менен бириктирет.'),{approxBirth:true}),
P(L('Шах Валиуллах ад-Дихлави','Shah Wali Allah al-Dihlawi','Шах Валиуллах ад-Дихлави'),1703,1762,'1114–1176 г. х.','ŞAH VELİYYULLAH',L(
 'Индийский учёный, хадисовед и преподаватель медресе Рахимийя в Дели. Учился также в Хиджазе. Перевёл Коран на персидский язык и написал «Худжжат Аллах аль-балига», рассматривая смысл религиозных установлений и устройство общественной жизни.',
 'An Indian scholar, hadith specialist and teacher at Delhi’s Rahimiyya madrasa who also studied in the Hijaz. He translated the Quran into Persian and wrote Hujjat Allah al-baligha on the purposes of religious prescriptions and social life.',
 'Индиялык аалым, хадис таануучу жана Делидеги Рахимийя медресесинин мугалими. Хижазда да билим алган. Куранды перс тилине которуп, диний көрсөтмөлөрдүн мааниси жана коомдук жашоо тууралуу «Хужжат Аллах аль-балига» эмгегин жазган.')),
P(L('Ахмад ад-Дардир','Ahmad al-Dardir','Ахмад ад-Дардир'),1715,1786,'1127–1201 г. х.','DERDÎR',L(
 'Египетский маликитский правовед и преподаватель аль-Азхара. Руководил обучением маликитов, писал о праве и вероучении. Среди его трудов — «Акраб аль-масалик». Выступал в защиту жителей Каира от злоупотреблений местных правителей.',
 'An Egyptian Maliki jurist and teacher at al-Azhar. He led Maliki instruction and wrote on law and belief, including Aqrab al-masalik. He also defended Cairo’s inhabitants against abuses by local rulers.',
 'Египеттик маликий укук таануучу жана аль-Азхардын мугалими. Маликий окутууну жетектеп, укук жана ишеним тууралуу жазган. Эмгектеринин бири — «Акраб аль-масалик». Каир тургундарын жергиликтүү башкаруучулардын кыянаттыгынан коргогон.')),
P(L('Муртада аз-Забиди','Murtada al-Zabidi','Муртада аз-Забиди'),1732,1791,'1145–1205 г. х.','ZEBÎDÎ, Muhammed Murtazâ',L(
 'Лексикограф и хадисовед, родившийся в Бильграме в Индии. Учился в Йемене и Хиджазе, затем жил и преподавал в Каире. Создал обширный арабский словарь «Тадж аль-арус» и комментарий к «Ихья улюм ад-дин» аль-Газали.',
 'A lexicographer and hadith scholar born in Bilgram, India. He studied in Yemen and the Hijaz before settling and teaching in Cairo. He compiled the extensive Arabic dictionary Taj al-arus and a commentary on al-Ghazali’s Ihya ulum al-din.',
 'Индиянын Бильграм шаарында туулган сөздүк түзүүчү жана хадис аалымы. Йеменде жана Хижазда окуп, кийин Каирде жашап, сабак берген. Кеңири араб сөздүгү «Таж аль-арусту» жана аль-Газалинин «Ихья улюм ад-дин» эмгегине түшүндүрмө жазган.')),
P(L('Шах Абд аль-Азиз ад-Дихлави','Shah Abd al-Aziz al-Dihlawi','Шах Абд аль-Азиз ад-Дихлави'),1746,1824,'1159–1239 г. х.','ABDÜLAZÎZ ed-DİHLEVÎ',L(
 'Учёный из Дели, сын и ученик Шаха Валиуллаха. После смерти отца в 1762 году продолжил преподавание в медресе Рахимийя. Занимался толкованием Корана, хадисами и правовыми вопросами; его ученики продолжили традицию религиозного образования в Индии.',
 'A Delhi scholar, son and student of Shah Wali Allah. After his father’s death in 1762, he continued teaching at the Rahimiyya madrasa. His work covered Quran commentary, hadith and legal questions; his students carried on religious education in India.',
 'Делилик аалым, Шах Валиуллахтын уулу жана шакирти. Атасы 1762-жылы каза болгондон кийин Рахимийя медресесинде сабак берүүнү уланткан. Куран чечмелөө, хадис жана укук маселелери менен иштеген; шакирттери Индияда диний билим берүү салтын улантышкан.'))
];
