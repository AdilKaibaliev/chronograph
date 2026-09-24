// Short, source-backed teaching notes. The phase supplies the chronology and bibliography.
const L=(ru,en,ky)=>[ru,en,ky];
module.exports=c=>{
 const entry=id=>c.entries.find(e=>e.id===id);
 const mesa=entry('mesa');
 for(const p of mesa.phases)p.learning={
  economy:L('Земледельцы выращивали кукурузу и другие культуры.','Farmers cultivated maize and other crops.','Дыйкандар жүгөрү жана башка өсүмдүктөрдү өстүрүшкөн.'),
  society:p.from<750?L('Семьи жили в полуземлянках на плато.','Families lived in partly sunken houses on the mesa.','Үй-бүлөлөр бөксө тоодо жарым жер төлө үйлөрдө жашашкан.'):p.from<1180?L('Надземные многокомнатные дома сменялись каменными селениями; общины обменивались товарами и знаниями.','Above-ground room blocks developed into stone villages; communities exchanged goods and knowledge.','Жер үстүндөгү көп бөлмөлүү үйлөр таш айылдарга айланган; жамааттар товар жана билим алмашкан.'):L('Скальные навесы защищали дома от непогоды; рядом находились источники воды.','Cliff alcoves sheltered homes from weather; springs supplied water nearby.','Аска көңдөйлөрү үйлөрдү аба ырайынан коргогон; жакын жерде булактар болгон.')
 };
 for(const p of entry('chaco').phases)p.learning={
  government:p.from<1050?L('Многолетнее строительство больших домов требовало согласованной работы общин.','Great-house construction required coordinated community work over many years.','Чоң үйлөрдү куруу жамааттардын көп жылдык биргелешкен эмгегин талап кылган.'):L('К середине XI века Чако стал административным и обрядовым центром бассейна Сан-Хуан.','By the mid-eleventh century Chaco was an administrative and ceremonial centre of the San Juan Basin.','XI кылымдын ортосунда Чако Сан-Хуан алабынын башкаруу жана жөрөлгө борбору болгон.'),
  economy:L('Обмен связывал большие дома с удалёнными поселениями.','Exchange linked great houses and distant settlements.','Алмашуу чоң үйлөрдү алыскы конуштар менен байланыштырган.'),
  society:L('Каменные комплексы служили местами собраний и церемоний.','Stone complexes provided settings for gatherings and ceremonies.','Таш комплекстер жыйындар жана жөрөлгөлөр үчүн колдонулган.')
 };
 entry('cahokia').phases[1].learning={
  government:L('Иерархия вождей организовывала труд, земледелие и обмен.','A chiefly hierarchy organised labour, farming and exchange.','Башчылардын иерархиясы эмгекти, дыйканчылыкты жана алмашууну уюштурган.'),
  economy:L('Город опирался на земледельческие поселения вокруг него.','The city depended on surrounding farming settlements.','Шаар тегеректеги дыйкан конуштарына таянган.'),
  society:L('В период расцвета, около 1050–1150 годов, здесь могло жить 10–20 тысяч человек.','At its peak around 1050–1150, the city may have housed 10,000–20,000 people.','Болжол менен 1050–1150-жылдардагы гүлдөгөн мезгилинде шаарда 10–20 миң адам жашаган болушу мүмкүн.')
 };
 entry('moundville').phases[1].learning={
  government:L('Знать занимала дома на крупных насыпях вокруг общей площади.','Elite residences stood on large mounds around a central plaza.','Ак сөөктөрдүн үйлөрү борбордук аянттын айланасындагы чоң дөбөлөрдө турган.'),
  society:L('Около 1200 года общественные постройки и деревянная стена преобразили поселение.','Around 1200, public buildings and a wooden palisade reshaped the settlement.','Болжол менен 1200-жылы коомдук имараттар жана жыгач коргон конуштун көрүнүшүн өзгөрткөн.')
 };
 return c;
};
