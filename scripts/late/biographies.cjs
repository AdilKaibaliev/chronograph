// Original summaries; dates and bibliography checked against the named TDV articles.
const L=(ru,en,ky)=>[ru,en,ky];
const person=(name,birth,death,era,article,text,options={})=>({name,birth,death,era,article,text,...options});
module.exports=[
person(L('Ибн Каййим аль-Джаузия','Ibn Qayyim al-Jawziyya','Ибн Каййим аль-Жавзия'),1292,1350,'691–751 г. х.','İBN KAYYİM el-CEVZİYYE',L(
 'Ханбалитский правовед и преподаватель из Дамаска, ученик Ибн Таймии. Писал о праве, хадисах и нравственном воспитании. Среди его сочинений — «Зад аль-маад» и «Мадаридж ас-саликин».',
 'A Hanbali jurist and teacher in Damascus, and a student of Ibn Taymiyya. He wrote on law, hadith and ethical cultivation. His works include Zad al-maad and Madarij al-salikin.',
 'Дамаскта иштеген ханбалий укук таануучу жана мугалим, Ибн Таймиянын шакирти. Укук, хадис жана адеп-ахлак тууралуу жазган. Эмгектеринин арасында «Зад аль-маад» жана «Мадаридж ас-саликин» бар.')),
person(L('Ибн Касир','Ibn Kathir','Ибн Касир'),1301,1373,'ок. 701–774 г. х.','İBN KESÎR, Ebü’l-Fidâ',L(
 'Шафиитский учёный, толкователь Корана и историк, работавший в Дамаске. Автор «Тафсир аль-Куран аль-азым» и исторического труда «Аль-Бидая ва-н-нихая». Обучался у аль-Миззи и других учёных своего времени. Родился около 1301 года.',
 'A Shafii scholar, Quran commentator and historian active in Damascus. He wrote Tafsir al-Quran al-azim and the history al-Bidaya wa-l-nihaya. He studied with al-Mizzi and other scholars of his time. He was born around 1301.',
 'Дамаскта иштеген шафиий аалым, Куранды чечмелөөчү жана тарыхчы. «Тафсир аль-Куран аль-азым» жана «Аль-Бидая ва-н-нихая» эмгектерин жазган. Аль-Миззи жана өз доорунун башка аалымдарынан билим алган. Болжол менен 1301-жылы туулган.'),{approxBirth:true}),
person(L('Ибн Халдун','Ibn Khaldun','Ибн Халдун'),1332,1406,'732–808 г. х.','İBN HALDÛN',L(
 'Историк и мыслитель из Туниса, служивший при дворах Магриба, позднее — маликитский судья в Каире. В «Мукаддиме» исследовал возникновение государств, общественную солидарность, хозяйство и проверку исторических сообщений. Она стала введением к его «Китаб аль-Ибар».',
 'A historian and thinker born in Tunis who served Maghrebi courts and later became a Maliki judge in Cairo. His Muqaddima examines the rise of states, social solidarity, economic life and the assessment of historical reports. It introduces his Kitab al-Ibar.',
 'Тунисте туулган тарыхчы жана ойчул. Магриб сарайларында кызмат кылып, кийин Каирде маликий казы болгон. «Мукаддимада» мамлекеттердин түзүлүшүн, коомдук ынтымакты, чарбаны жана тарыхый кабарларды текшерүүнү изилдеген. Ал «Китаб аль-Ибар» эмгегинин кириш сөзү.')),
person(L('аль-Макризи','al-Maqrizi','аль-Макризи'),1364,1442,'ок. 766–845 г. х.','MAKRÎZÎ',L(
 'Египетский историк из Каира, занимавший административные и преподавательские должности. Описывал города, памятники, цены и политическую жизнь Египта. «Аль-Хитат» посвящена его исторической топографии, а «Ас-Сулюк» — истории правителей.',
 'An Egyptian historian from Cairo who held administrative and teaching posts. He described Egypt’s towns, monuments, prices and political life. Al-Khitat addresses its historical topography; al-Suluk recounts the history of its rulers.',
 'Каирлик египет тарыхчысы, башкаруу жана окутуу кызматтарын аткарган. Египеттин шаарларын, эстеликтерин, бааларын жана саясий турмушун сүрөттөгөн. «Аль-Хитат» тарыхый топографияга, «Ас-Сулюк» башкаруучулардын тарыхына арналган.'),{approxBirth:true}),
person(L('Ибн Хаджар аль-Аскаляни','Ibn Hajar al-Asqalani','Ибн Хажар аль-Аскалани'),1372,1449,'773–852 г. х.','İBN HACER el-ASKALÂNÎ',L(
 'Египетский хадисовед и шафиитский судья. Учился у аль-Ираки, путешествовал ради знания, преподавал в Каире. Автор «Фатх аль-Бари» — комментария к «Сахиху» аль-Бухари, а также трудов о передатчиках хадисов и современниках.',
 'An Egyptian hadith scholar and Shafii judge. He studied with al-Iraqi, travelled in pursuit of learning and taught in Cairo. His Fath al-Bari comments on Sahih al-Bukhari; he also wrote works on hadith transmitters and his contemporaries.',
 'Египеттик хадис аалымы жана шафиий казы. Аль-Иракиден окуп, билим издеп сапарга чыккан, Каирде сабак берген. Аль-Бухаринин «Сахихине» жазылган «Фатх аль-Бари» түшүндүрмөсүнүн, хадис жеткирүүчүлөр жана замандаштар тууралуу эмгектердин автору.')),
person(L('ас-Сахави','al-Sakhawi','ас-Сахави'),1428,1497,'831–902 г. х.','SEHÂVÎ, Şemseddin',L(
 'Каирский хадисовед и историк, ученик Ибн Хаджара аль-Аскаляни. Посещал его занятия с детства, позднее путешествовал по Египту, Хиджазу и аш-Шаму. Автор биографического свода «Ад-Дау аль-лами», посвящённого людям IX века хиджры.',
 'A Cairo hadith scholar and historian, and a student of Ibn Hajar al-Asqalani. He attended his teacher’s lessons from childhood and later travelled through Egypt, the Hijaz and al-Sham. His al-Daw al-lami is a biographical collection for the ninth Hijri century.',
 'Каирлик хадис аалымы жана тарыхчы, Ибн Хажар аль-Аскаланинин шакирти. Бала кезинен анын сабактарына катышып, кийин Египет, Хижаз жана аш-Шамды кыдырган. Хижранын IX кылымындагы адамдарга арналган «Ад-Дау аль-лами» өмүр баяндар жыйнагынын автору.')),
person(L('ас-Суюти','al-Suyuti','ас-Суюти'),1445,1505,'849–911 г. х.','SÜYÛTÎ',L(
 'Каирский учёный, писавший о Коране, хадисах, арабском языке и истории. Продолжил начатый аль-Махалли «Тафсир аль-Джалалайн»; составил «Аль-Иткан» и «Тарих аль-хулафа».',
 'A Cairo scholar who wrote on the Quran, hadith, Arabic and history. He completed al-Mahalli’s Tafsir al-Jalalayn and compiled al-Itqan and Tarikh al-khulafa.',
 'Куран, хадис, араб тили жана тарых тууралуу жазган каирлик аалым. Аль-Махалли баштаган «Тафсир аль-Жалалайнды» аяктап, «Аль-Иткан» менен «Тарих аль-хулафаны» түзгөн.'))
];
