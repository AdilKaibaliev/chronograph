// Presentation-only localization: all IDs, dates and map data remain shared.
const translate=createChronographTranslator(CHRONOGRAPH_MESSAGES);
const supportedLanguages=['ru','en','ky'];
const stateParams=new URLSearchParams(location.search);
const languageStorageKey='chronograph.language';
let savedLanguage=null;
try{savedLanguage=localStorage.getItem(languageStorageKey);}catch{/* Storage may be unavailable in private browsing. */}
let language=supportedLanguages.includes(stateParams.get('lang'))?stateParams.get('lang'):(supportedLanguages.includes(savedLanguage)?savedLanguage:'en');
const originalText=new WeakMap(),originalAttributes=new WeakMap();
const localeSelect=$('languageSelect');
localeSelect.value=language;
const attributes=['aria-label','aria-valuetext','title'];
let translationQueued=false;
const pendingTranslations=new Set();
function translateValue(current,record){
  const source=record&&current===record.output?record.source:current;
  return {source,output:translate(source,language)};
}
function localizePage(){
  observer.disconnect();
  pendingTranslations.clear();
  document.documentElement.lang=language;
  const brand=({ru:['Хронограф','Исторический атлас'],en:['Chronograph','Historical Atlas'],ky:['Хронограф','Тарыхый атлас']})[language];
  document.title=brand.join(' — ');
  document.querySelector('.brand-title').textContent=brand[0];
  document.querySelector('.brand-sub').textContent=brand[1];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const node=walker.currentNode,parent=node.parentElement;
    if(!parent||parent.closest('script,style,#languageSelect,[data-locale-owned]'))continue;
    const record=translateValue(node.nodeValue,originalText.get(node));
    originalText.set(node,record);
    if(node.nodeValue!==record.output)node.nodeValue=record.output;
    if(language!=='ru'&&record.source===record.output&&/[А-Яа-яЁё]/.test(record.source)&&record.source.trim())pendingTranslations.add(record.source.trim());
  }
  for(const el of document.querySelectorAll('[aria-label],[aria-valuetext],[title]')){
    if(el.closest('#languageSelect,[data-locale-owned]'))continue;
    const saved=originalAttributes.get(el)||{};
    for(const key of attributes){if(!el.hasAttribute(key))continue;const record=translateValue(el.getAttribute(key),saved[key]);saved[key]=record;if(record.output!==el.getAttribute(key))el.setAttribute(key,record.output);}
    originalAttributes.set(el,saved);
  }
  localeSelect.setAttribute('aria-label',({ru:'Язык сайта',en:'Site language',ky:'Сайттын тили'})[language]);
  observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:attributes});
}
const observer=new MutationObserver(records=>{
  // Self-localized scenes update frequently; they never require an atlas-wide text walk.
  if(records.every(record=>{const el=record.target.nodeType===Node.ELEMENT_NODE?record.target:record.target.parentElement;return el?.closest('[data-locale-owned]');}))return;
  if(translationQueued)return;translationQueued=true;
  queueMicrotask(()=>{translationQueued=false;localizePage();});
});
function saveLocation(){
  const url=new URL(location.href);
  url.searchParams.set('lang',language);url.searchParams.set('year',year);
  url.searchParams.set('view',[mapState.scale,mapState.tx,mapState.ty].map(n=>n.toFixed(3)).join(','));
  const tab=document.querySelector('.side-tabs [aria-selected="true"]');
  if(tab)url.searchParams.set('tab',tab.id.replace('tab-',''));
  if(worldLocationHook)worldLocationHook(url);
  if(futureLocationHook)futureLocationHook(url);
  try{history.replaceState(null,'',url);}catch{/* Local file browsers may restrict URL replacement. */}
}
let saveTimer;
function queueLocationSave(){clearTimeout(saveTimer);saveTimer=setTimeout(saveLocation,850);}
localeSelect.addEventListener('change',()=>{
  language=supportedLanguages.includes(localeSelect.value)?localeSelect.value:'en';
  try{localStorage.setItem(languageStorageKey,language);}catch{/* The current page still changes language without storage. */}
  localizePage();saveLocation();
});
// Restore only validated display state from a shared address.
const initialYear=stateParams.get('year');
if(initialYear!==null&&/^\d{3,4}$/.test(initialYear)&&+initialYear>=610&&+initialYear<=TIMELINE_MAX)renderYear(+initialYear);
const initialView=(stateParams.get('view')||'').split(',').map(Number);
if(initialView.length===3&&initialView.every(Number.isFinite)&&initialView[0]>=.75&&initialView[0]<=24&&Math.abs(initialView[1])<=40000&&Math.abs(initialView[2])<=40000){[mapState.scale,mapState.tx,mapState.ty]=initialView;setViewport();}
const initialPanel=stateParams.get('tab');
if(['events','regions','compare','sources','selection'].includes(initialPanel))switchPanel(initialPanel);
localizePage();
document.addEventListener('pointerup',queueLocationSave);
document.addEventListener('keyup',queueLocationSave);
document.addEventListener('wheel',queueLocationSave,{passive:true});
document.addEventListener('input',queueLocationSave);
document.addEventListener('click',queueLocationSave);
