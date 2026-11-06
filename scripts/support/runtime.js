// Support information only. Add a payment destination after the owner supplies it.
const supportButton=document.createElement('button');
supportButton.id='supportBtn';supportButton.type='button';supportButton.className='btn';
supportButton.textContent='Поддержать проект';
supportButton.title='Добровольный вклад в развитие проекта';
supportButton.setAttribute('aria-haspopup','dialog');supportButton.setAttribute('aria-controls','modal');
futureButton.after(supportButton);
supportButton.addEventListener('click',()=>{
 stopPlay();if(futureState.active)futureStop();
 $('modalBody').innerHTML='<div class="kicker">CHRONOGRAPH</div><h2>Поддержать проект</h2><p class="support-lead">Добровольный вклад в развитие проекта</p><p>Ваша поддержка поможет дополнять историческую карту, проверять источники и развивать версии на трёх языках.</p><p class="support-status">Приём переводов пока не подключён. Способ поддержки появится здесь после настройки.</p>';
 const box=$('modal').querySelector('.modal-box');if(box)box.scrollTop=0;
 localizePage();
 $('modal').setAttribute('aria-label',translate('Поддержать проект',language));
 $('modal').classList.add('show');
});
new MutationObserver(()=>{
 if(!$('modal').classList.contains('show'))$('modal').setAttribute('aria-label',translate('Историческая справка',language));
}).observe($('modal'),{attributes:true,attributeFilter:['class']});
localizePage();

// Contact uses the same server-side Resend flow as Concord House.
const contactButton=document.createElement('button');
contactButton.id='contactBtn';contactButton.type='button';contactButton.className='btn';
contactButton.textContent='Связаться';
contactButton.setAttribute('aria-haspopup','dialog');contactButton.setAttribute('aria-controls','modal');
supportButton.after(contactButton);
contactButton.addEventListener('click',()=>{
 stopPlay();if(futureState.active)futureStop();
 $('modalBody').innerHTML='<div class="kicker">CHRONOGRAPH</div><h2>Связаться</h2><p>Вопросы, предложения и уточнения к исторической карте:</p><form class="contact-form" action="/api/contact" method="POST"><label for="contactName">Ваше имя</label><input id="contactName" name="name" autocomplete="name" required maxlength="120"><label for="contactEmail">Ваш email для ответа</label><input id="contactEmail" name="email" type="email" autocomplete="email" required maxlength="254"><label for="contactMessage">Сообщение</label><textarea id="contactMessage" name="message" required minlength="10" maxlength="5000" rows="5"></textarea><input class="contact-honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="contact-note">Нажимая кнопку, вы отправляете имя, email и сообщение команде Хронографа на lfc@legacyfidelity.com для ответа на обращение.</p><button class="btn" type="submit">Отправить обращение</button><p class="contact-result" role="status" aria-live="polite"></p></form>';

 const form=$('modalBody').querySelector('.contact-form');
 const button=form.querySelector('button'),status=form.querySelector('.contact-result');
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(button.disabled||!form.reportValidity())return;
  button.disabled=true;form.setAttribute('aria-busy','true');status.textContent='';button.textContent=translate('Отправляем…',language);
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(20000)});
   const result=await response.json();if(!response.ok||!result.ok)throw new Error('send');
   form.reset();status.textContent=translate('Сообщение отправлено. Спасибо за обращение!',language);
  }catch{status.textContent=translate('Не удалось отправить сообщение. Текст сохранён в форме — попробуйте позже.',language);}
  finally{button.disabled=false;form.setAttribute('aria-busy','false');button.textContent=translate('Отправить обращение',language);}
 });
 form.addEventListener('input',()=>{status.textContent='';});
 $('modal').querySelector('.modal-box').scrollTop=0;
 localizePage();$('modal').setAttribute('aria-label',translate('Связаться',language));
 $('modal').classList.add('show');
});
localizePage();
