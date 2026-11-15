'use strict';
// Geographic reference symbols, not reconstructed state boundaries or capitals.
// The first Shiji attestation gives a northern direction, not coordinates.
module.exports={
 sources:{'ky-china-minorities':{
  title:'中国少数民族 (Национальные меньшинства Китая), раздел о кыргызах. Исторический обзор Государственного комитета КНР по делам национальностей.',
  urls:['https://www.neac.gov.cn/seac/ztzl/kekzz/lsyg.shtml']
 }},
 records:{
  'ky-gegun-modu':{
   sources:['ky-china-minorities'],
   caption:[
    'Гэгунь — раннее название, связываемое с кыргызами. «Ши цзи» указывает северное направление от хунну. Китайский исторический обзор называет район Хяргас-Нуур и Енисея–Абакана. Пунктирные отметки показывают эти географические ориентиры; точные границы владения около 201 года до н. э. не установлены.',
    'Gekun is an early name associated with the Kyrgyz. The Shiji places the campaign north of the Xiongnu. A Chinese historical overview names the Khyargas Nuur and Yenisei–Abakan regions. Dashed symbols locate these geographic references; exact boundaries around 201 BCE are not established.',
    'Гэгунь — кыргыздар менен байланыштырылган байыркы аталыш. «Ши цзи» хуннулардан түндүктөгү багытты көрсөтөт. Кытай тарыхый баяндамасында Хяргас-Нуур жана Энесай–Абакан аймактары аталат. Үзүк сызыктуу белгилер ушул географиялык багыттарды көрсөтөт; б. з. ч. болжол менен 201-жылдагы ээликтин так чек аралары аныкталган эмес.'
   ],
   places:[
    {id:'yenisei-abakan',coord:[92.5,53.5],precision:'regional-reference',title:['Енисей–Абакан · географический ориентир','Yenisei–Abakan · geographic reference','Энесай–Абакан · географиялык багыт'],label:['Гэгунь · Енисей–Абакан','Gekun · Yenisei–Abakan','Гэгунь · Энесай–Абакан']},
    {id:'khyargas-nuur',coord:[93.3,49.15],precision:'regional-reference',title:['Хяргас-Нуур · географический ориентир','Khyargas Nuur · geographic reference','Хяргас-Нуур · географиялык багыт'],label:['Гэгунь · Хяргас-Нуур','Gekun · Khyargas Nuur','Гэгунь · Хяргас-Нуур']}
   ]
  },
  'ky-qigu-muqan':{
   sources:['ky-savinov1994'],
   caption:[
    'Кигу связывают с кыргызами Енисейско-Абаканского региона. Отметка обозначает область научной локализации. «Чжоу шу» не называет место сражения или точный контур владения.',
    'Qigu is associated with the Kyrgyz of the Yenisei–Abakan region. The symbol identifies the scholarly regional location. The Zhoushu does not specify a battlefield or an exact territorial outline.',
    'Кигулар Энесай–Абакан аймагындагы кыргыздар менен байланыштырылат. Белги илимий изилдөөлөрдө көрсөтүлгөн аймакты билдирет. «Чжоу шу» салгылашуунун ордун же ээликтин так контурун атабайт.'
   ],
   places:[{id:'qigu-yenisei',coord:[92.5,53.5],precision:'regional-reference',title:['Енисей–Абакан · область локализации кигу','Yenisei–Abakan · regional location of Qigu','Энесай–Абакан · кигулар жайгашкан аймак'],label:['Кигу · ранние кыргызы','Qigu · early Kyrgyz','Кигу · байыркы кыргыздар']}]
  }
 }
};
