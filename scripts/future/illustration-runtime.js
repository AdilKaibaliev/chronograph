// One bounded player for the selected card. Card browsing and scene playback are separate.
const futureArt=createFutureIllustrationArt();
const futureSceneText={
 illustration:['Иллюстрация','Illustration','Көрсөтмө'],map:['Карта','Map','Карта'],
 heading:['Иллюстрация к хадису','Hadith illustration','Хадиске көрсөтмө'],
 play:['Воспроизвести','Play scene','Ойнотуу'],pause:['Пауза','Pause','Тыныгуу'],
 resume:['Продолжить','Continue','Улантуу'],replay:['Повторить','Replay','Кайталоо'],
 seek:['Положение анимации','Animation position','Анимациянын абалы'],
 finished:['Иллюстрация завершена','Illustration complete','Көрсөтмө аяктады'],
 view:['Вид события','Event view','Окуянын көрүнүшү'],
 empty:['Выберите событие','Select an event','Окуяны тандаңыз'],
 symbolic:['Символическая сцена','Symbolic scene','Шарттуу көрүнүш'],
 direction:['Направление · схема','Direction · schematic','Багыт · схема']
};
const fst=k=>futureSceneText[k][supportedLanguages.indexOf(language)];
const futureSceneState={id:'',progress:0,playing:false,frame:0,last:0,painted:0,view:stateParams.get('presentation')==='map'?'map':'illustration'};
const futureSceneSwitch=document.createElement('nav');futureSceneSwitch.id='futureSceneSwitch';futureSceneSwitch.dataset.localeOwned='true';futureSceneSwitch.hidden=true;
futureSceneSwitch.innerHTML='<button type="button" data-future-view="illustration"></button><button type="button" data-future-view="map"></button>';
const futureScene=document.createElement('section');futureScene.id='futureScene';futureScene.dataset.localeOwned='true';futureScene.hidden=true;
futureScene.innerHTML='<header class="future-scene-head"><div class="future-scene-kicker"></div><h2 id="futureSceneTitle"></h2><div id="futureScenePlaces"></div></header><div class="future-scene-canvas"><svg id="futureSceneArt" viewBox="0 0 760 420" role="img" preserveAspectRatio="xMidYMid meet"></svg></div><div class="future-scene-caption"><span id="futureSceneCaption"></span><small id="futureSceneKind"></small></div><footer class="future-scene-player"><button type="button" id="futureScenePlay"><span class="future-scene-play-symbol" aria-hidden="true">▶</span><span class="future-scene-play-label"></span></button><label class="future-scene-track"><span class="future-scene-track-head"><span id="futureSceneSeekLabel"></span><output id="futureScenePercent">0%</output></span><input id="futureSceneSeek" type="range" min="0" max="1000" step="1" value="0"></label></footer><span id="futureSceneStatus" class="future-scene-sr" role="status" aria-live="polite"></span>';
$('mapCard').append(futureSceneSwitch,futureScene);
$('futureScenePercent').setAttribute('aria-live','off');
function futureScenePaint(draw=true){
 const s=futureSceneState,spec=FUTURE_ILLUSTRATIONS[s.id];
 if(draw&&spec)$('futureSceneArt').innerHTML=futureArt.render(spec,s.progress);
 const percent=Math.round(s.progress*100);
 $('futureSceneSeek').value=String(Math.round(s.progress*1000));
 $('futureSceneSeek').setAttribute('aria-valuetext',percent+'%');
 $('futureScenePercent').textContent=percent+'%';
 const key=s.playing?'pause':s.progress>=1?'replay':s.progress>0?'resume':'play';
 $('futureScenePlay').querySelector('.future-scene-play-label').textContent=fst(key);
 $('futureScenePlay').querySelector('.future-scene-play-symbol').textContent=s.playing?'Ⅱ':s.progress>=1?'↻':'▶';
 $('futureScenePlay').setAttribute('aria-pressed',String(s.playing));
}
function futureSceneStop(){const s=futureSceneState;s.playing=false;cancelAnimationFrame(s.frame);s.last=0;futureScenePaint(false);}
function futureSceneTick(now){
 const s=futureSceneState;if(!s.playing)return;
 if(s.last)s.progress=Math.min(1,s.progress+(now-s.last)/14000);s.last=now;
 // Limit redraws to 30 fps; the elapsed clock remains frame-rate independent.
 if(now-s.painted>=32||s.progress>=1){futureScenePaint();s.painted=now;}
 if(s.progress>=1){futureSceneStop();$('futureSceneStatus').textContent=fst('finished');}
 else s.frame=requestAnimationFrame(futureSceneTick);
}
function futureSceneView(view,focus=false){
 futureSceneStop();futureSceneState.view=view==='map'?'map':'illustration';
 $('mapCard').dataset.futureView=futureSceneState.view;
 futureScene.hidden=!futureState.active||futureSceneState.view==='map'||!futureSceneState.id;
 futureSceneSwitch.hidden=!futureState.active;
 futureSceneSwitch.setAttribute('aria-label',fst('view'));
 for(const b of futureSceneSwitch.querySelectorAll('button')){b.textContent=fst(b.dataset.futureView);b.setAttribute('aria-pressed',String(b.dataset.futureView===futureSceneState.view));}
 if(focus&&futureSceneState.view==='map')futureMap(futureById.get(futureState.selected),true);
}
function futureSceneRender(event){
 const s=futureSceneState,id=event?.id||'';
 if(id!==s.id){futureSceneStop();s.id=id;s.progress=0;$('futureSceneStatus').textContent='';}
 // A locale change pauses the scene while preserving its frame.
 if(s.playing)futureSceneStop();
 futureScene.querySelector('.future-scene-kicker').textContent=fst('heading');
 $('futureSceneTitle').textContent=event?fl(event.title):fst('empty');
 $('futureSceneCaption').textContent=event?fl(FUTURE_ILLUSTRATIONS[id].caption):'';
 $('futureSceneKind').textContent=event&&FUTURE_ILLUSTRATIONS[id].type==='journey'?fst('direction'):fst('symbolic');
 $('futureSceneSeekLabel').textContent=fst('seek');$('futureSceneSeek').setAttribute('aria-label',fst('seek'));
 $('futureSceneArt').setAttribute('aria-label',event?fst('heading')+': '+fl(event.title):fst('empty'));
 $('futureScenePlay').disabled=!event;$('futureSceneSeek').disabled=!event;
 const places=$('futureScenePlaces');places.replaceChildren();
 if(event)for(const id of event.places.filter(id=>FUTURE_CATALOG.places[id].coord)){
  const b=document.createElement('button');b.type='button';b.textContent=fl(FUTURE_CATALOG.places[id].name).split(' · ')[0].split(' — ')[0];
  b.onclick=()=>{futureStop();futureSceneView('map');futureSetCamera([FUTURE_CATALOG.places[id].coord]);queueLocationSave();};places.append(b);
 }
 futureSceneView(s.view);futureScenePaint();
}
for(const b of futureSceneSwitch.querySelectorAll('button'))b.onclick=()=>{futureStop();futureSceneView(b.dataset.futureView,true);queueLocationSave();};
$('futureScenePlay').onclick=()=>{
 const s=futureSceneState;if(s.playing){futureSceneStop();return;}if(!s.id)return;
 futureStop();if(s.progress>=1)s.progress=0;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){s.progress=1;futureScenePaint();$('futureSceneStatus').textContent=fst('finished');return;}
 s.playing=true;s.last=0;s.painted=0;futureScenePaint(false);s.frame=requestAnimationFrame(futureSceneTick);
};
$('futureSceneSeek').oninput=e=>{const p=Number(e.target.value)/1000;futureStop();futureSceneStop();futureSceneState.progress=Math.max(0,Math.min(1,p));futureScenePaint();};
document.addEventListener('visibilitychange',()=>{if(document.hidden){futureSceneStop();futureStop();}});
