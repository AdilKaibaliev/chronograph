'use strict';
module.exports=lessons=>{
 const narynCampaign=lessons.find(e=>e.id==='ky-school-kokand-naryn');
 narynCampaign.routes=[[[69.24,41.31],[69.59,42.32],[71.37,42.9],[74.6,42.87],[77.2,42.4]],[[74.5,41.3],[75.8,41.17],[76,41.43],[74.8,41.95],[75.76,42.21]]];
 narynCampaign.route=narynCampaign.routes[0];narynCampaign.geographyNote=['Два направления похода 1831 года: через Ташкент и Чуйскую долину к Иссык-Кулю; через Ак-Талаа, Ат-Башы, Нарын и Джумгал к Кочкору. Линии соединяют названные районы.','Two campaign directions in 1831: via Tashkent and Chuy to Issyk-Kul; via Ak-Talaa, At-Bashy, Naryn and Jumgal to Kochkor. Lines connect the named regions.','1831-жылкы жортуулдун эки багыты: Ташкент жана Чүй аркылуу Ысык-Көлгө; Ак-Талаа, Ат-Башы, Нарын жана Жумгал аркылуу Кочкорго. Сызыктар аталган аймактарды бириктирет.'];
 const return1917=lessons.find(e=>e.id==='ky-school-return-1917');
 return1917.route=[[80,42],[77.2,42.4]];return1917.geographyNote=['Возвращение из Синьцзяна в Прииссыккулье. Показано общее направление между районами; конкретный перевал в этом учебном изложении не указан.','Return from Xinjiang to the Issyk-Kul region. A regional direction is shown; this textbook account does not specify a pass.','Шинжаңдан Ысык-Көл аймагына кайтуу. Аймактардын ортосундагы жалпы багыт көрсөтүлдү; окуу китебинин бул баянында так ашуу аталган эмес.'];
};
