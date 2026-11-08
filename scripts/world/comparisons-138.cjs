'use strict';
// Each frame describes the map at the end of the selected calendar year.
// Coordinates mark places to compare, never the extent of an uncertain state.
const glatz=[[16.66,50.435],['Клодзко','Kłodzko','Клодзко']],opava=[[17.90,49.94],['Опава','Opava','Опава']];
const tacna=[[-70.25,-18.01],['Такна','Tacna','Такна']],arica=[[-70.31,-18.48],['Арика','Arica','Арика']],iquique=[[-70.14,-20.22],['Икике','Iquique','Икике']];
const pacific=[
 [1878,['Такна, Арика и Икике входят в Перу.','Tacna, Arica and Iquique are in Peru.','Такна, Арика жана Икике Перуга карайт.']],
 [1879,['Икике занято чилийскими войсками. Такна и Арика ещё под управлением Перу.','Chilean troops occupy Iquique. Peru still administers Tacna and Arica.','Чили аскерлери Икикени ээлеген. Такна менен Ариканы Перу башкарып жатат.']],
 [1880,['Чилийские войска занимают также Такну и Арику. Заливка показывает военный контроль.','Chilean forces also take Tacna and Arica. The fill shows military control.','Чили аскерлери Такна менен Ариканы да ээлешкен. Түс аскердик көзөмөлдү көрсөтөт.']],
 [1883,['Договор подписан. Все три города остаются под управлением Чили.','The treaty has been signed. Chile continues to administer all three cities.','Келишимге кол коюлган. Үч шаарды тең Чили башкарып жатат.']],
 [1884,['Тарапака с Икике передана Чили. Окончательная принадлежность Такны и Арики ещё не решена.','Tarapacá, including Iquique, has been ceded to Chile. The final status of Tacna and Arica remains open.','Икике жайгашкан Тарапака Чилиге берилген. Такна менен Ариканын биротоло кимге караары али чечиле элек.']],
 [1928,['Такну и Арику по-прежнему администрирует Чили.','Chile still administers both Tacna and Arica.','Такна менен Ариканы дагы эле Чили башкарат.']],
 [1929,['Такна возвращена Перу, Арика остаётся в Чили.','Tacna returns to Peru. Arica remains in Chile.','Такна Перуга кайтарылган. Арика Чилиде калган.']]
];
function lesson(question,places,frames,scale=16){return {question,places,frames,scale};}
module.exports={
 'survey138-glatz':lesson(['Как изменилось положение Клодзко и Опавы?','Which city changed hands, Kłodzko or Opava?','Клодзко менен Опаванын кайсынысы башка бийликке өттү?'],[glatz,opava],[
  [1740,['В начале войны оба города находятся во владениях Габсбургов.','At the start of the war both cities are in Habsburg lands.','Согуштун башында эки шаар тең Габсбургдардын ээлигинде.']],
  [1742,['Клодзко переходит к Пруссии. Опава остаётся у Габсбургов.','Kłodzko passes to Prussia. Opava remains under Habsburg rule.','Клодзко Пруссияга өттү. Опава Габсбургдарда калды.']]]),
 'survey138-niger':lesson(['В каком порядке менялась власть в городах на Нигере?','In what order did control of these Niger valley towns change?','Нигер өрөөнүндөгү шаарларда бийлик кандай иретте алмашты?'],[[[-6.26,13.43],['Сегу','Ségou','Сегу']],[[-4.555,13.907],['Дженне','Djenné','Женне']]],[
  [1889,['Ахмаду правит в Сегу. Французские войска ещё не заняли ни один из этих городов.','Ahmadu rules at Ségou. French troops have yet to take either town.','Сегуну Ахмаду башкарат. Француз аскерлери бул эки шаарды ээлей элек.']],
  [1890,['Французские войска заняли Сегу. Дженне всё ещё вне французского управления.','French troops have taken Ségou. Djenné remains outside French administration.','Француз аскерлери Сегуну ээлешти. Женне али француз башкаруусуна өтө элек.']],
  [1893,['Оба города вошли в систему французского колониального управления.','Both towns are now under French colonial rule.','Эки шаар тең Франциянын колониялык башкаруусуна өттү.']]]),
 'survey138-ancon':lesson(['Когда изменился военный контроль и когда вступил в силу договор?','When did military control change, and when did the treaty take effect?','Аскердик көзөмөл качан өзгөргөн жана келишим качан күчүнө кирген?'],[tacna,arica,iquique],pacific.slice(0,5)),
 'survey138-tacna':lesson(['Какой из двух городов сменил государство в 1929 году?','Which of the two cities changed hands in 1929?','1929-жылы эки шаардын кайсынысы башка мамлекетке өттү?'],[tacna,arica],pacific.slice(5),22),
 'survey137-palanga':lesson(['Когда Паланга перешла под управление Литвы?','When did Lithuania take over Palanga?','Паланга качан Литванын башкаруусуна өткөн?'],[[[21.06,55.92],['Паланга','Palanga','Паланга']]],[[1920,['Палангой управляет Латвия.','Latvia administers Palanga.','Паланганы Латвия башкарат.']],[1921,['После арбитража город передан Литве.','The town passes to Lithuania after arbitration.','Арбитраждан кийин шаар Литвага өткөрүлгөн.']]]),
 'survey137-bay':lesson(['Кто управлял островом Роатан до и после передачи?','Who administered Roatán before and after the handover?','Роатан аралын өткөрүп бергенге чейин жана андан кийин ким башкарган?'],[[[-86.53,16.33],['Роатан','Roatán','Роатан']]],[[1860,['Остров входит в британскую колонию Бей-Айлендс.','Roatán belongs to the British Bay Islands colony.','Роатан Британиянын Бей-Айлендс колониясына карайт.']],[1861,['Власть на островах передана Гондурасу.','Administration of the islands passes to Honduras.','Аралдардын башкаруусу Гондураска өткөн.']]]),
 'survey136-solomons':lesson(['Что изменилось на Шуазёле и Санта-Исабель?','How did the status of Choiseul and Santa Isabel change?','Шуазёль менен Санта-Исабелдин макамы кандай өзгөрдү?'],[[[156.98,-7.08],['Шуазёль','Choiseul','Шуазёль']],[[159.30,-8.05],['Санта-Исабель','Santa Isabel','Санта-Исабель']]],[[1899,['Острова находятся в германской сфере управления.','The islands are in the German colonial sphere.','Аралдар Германиянын колониялык таасир чөйрөсүндө.']],[1900,['Острова перешли в британский протекторат.','The islands pass to the British protectorate.','Аралдар Британиянын протекторатына өткөн.']]])
};
