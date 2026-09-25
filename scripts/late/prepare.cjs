// Extend interface bounds while retaining the original 610–1299 atlas data.
module.exports = html => {
  const replace=(from,to)=>{if(!html.includes(from))throw Error('Missing atlas integration point: '+from);html=html.replace(from,to);};
  replace('const TIMELINE_MIN=610,TIMELINE_MAX=1299;','let worldPlaybackYears=[];\nconst TIMELINE_MIN=610,TIMELINE_MAX=1789;');
  replace('const nextKey=KEY_YEARS.find(k=>k>y);','const nextKey=KEY_YEARS.concat(worldPlaybackYears).filter(k=>k>y).sort((a,b)=>a-b)[0];');
  replace('id="yearRange" min="610" max="1299"','id="yearRange" min="610" max="1789"');
  replace('const labels=[610,632,661,750,840,999,1071,1206,1258,1299];','const labels=[610,750,999,1206,1299,1453,1600,1648,1700,1750,1789];');
  replace('const EVENTS = {','let lateEventHook=null,lateSideHook=null;\nconst EVENTS = {');
  replace('function activeEvent(y){','function activeEvent(y){\n  if(y>=1300&&lateEventHook)return lateEventHook(y);\n  if(y===1299)return {...EVENTS[1299],type:"Формирование государства"};');
  replace('function renderSide(y,e){','function renderSide(y,e){\n  if(y>=1300&&lateSideHook){lateSideHook(y,e);return;}');
  replace('scope.hidden=y<1206;','scope.hidden=y<1206||y>1299;');
  replace("const d=kyrgyzHistoryForYear(y),r=d.route;if(!r)return;","const d=kyrgyzHistoryForYear(y),r=d.route;if(y>1299||!r)return;");
  replace('year=Number(y); const e=activeEvent(year);','year=clamp(Number(y),TIMELINE_MIN,TIMELINE_MAX); if(year>1299)selectedEmpire=null; const e=activeEvent(year);');
  replace("$('kyrgyzHistoryBtn').addEventListener('click',()=>{stopPlay();", "$('kyrgyzHistoryBtn').addEventListener('click',()=>{if(year>=1300){lateFocusKyrgyz();return;}stopPlay();");
  html=html.replaceAll('610–1299 годов','610–1789 годов').replaceAll('610–1299 · ранний исламский период сохранён в деталях · для дальних веков используйте кнопки эпох','610–1789 · выберите год или исторический рубеж');
  replace('Как меняется политическая структура Евразии','Государства и общества мира');
  replace('${p.name}</b><small>${p.kind}</small>', '${p.name}</b><small>${y>=1300?(id==="constantinople"&&y>=1453?"Османская столица":"Географический ориентир"):p.kind}</small>');
  return html;
};
