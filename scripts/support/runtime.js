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
