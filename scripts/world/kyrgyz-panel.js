function renderKyrgyzHistory(y){
 const d=kyrgyzHistoryForYear(y);
 const openSections=Array.from($('kyrgyzEraFacts').querySelectorAll('details')).map(el=>el.open);
 $('kyrgyzEraTitle').textContent=d.title;
 $('kyrgyzEraText').textContent=d.text;
 const key=y>=840&&y<924?'<div class="kyrgyz-map-key"><span><i class="domain"></i><span>Енисейско-Саянское ядро</span></span><span><i class="influence"></i><span>Военно-политический охват · IX век</span></span><span><i class="direction"></i><span>Направление похода или посольства</span></span></div>':'';
 $('kyrgyzEraFacts').innerHTML=key+'<label class="history-toggle"><input type="checkbox" id="kyrgyzContextToggle" '+(showKyrgyzContext?'checked':'')+'> <span>Расселение и направления</span></label><p class="kyrgyz-map-note">Контуры передают исторические области; точная линия средневековой границы неизвестна.</p><details><summary>Этапы кыргызской истории</summary><div class="history-stages">'+KYRGYZ_STAGES.map(s=>'<button type="button" data-history-year="'+s.year+'" aria-current="'+(s===d)+'">'+s.title+'</button>').join('')+'</div></details><details><summary>Тянь-Шань и дальнейшая история</summary><p>'+KYRGYZ_MIGRATION_NOTE+'</p></details><details><summary>Хозяйство и общество в китайских описаниях</summary><p>'+KYRGYZ_DEVELOPMENT+'</p><p>Xin Tang shu, juan 217.</p></details>';
 $('kyrgyzEraFacts').querySelectorAll('details').forEach((el,i)=>{el.open=!!openSections[i];});
 $('kyrgyzEraSource').textContent=d.source;
 const b=$('focusKyrgyzHistory');b.textContent='Показать на карте';b.onclick=()=>{showKyrgyzContext=true;renderYear(year);focusLonLat(...d.view);};
 $('kyrgyzContextToggle').onchange=e=>{showKyrgyzContext=e.target.checked;renderYear(year);};
 $('kyrgyzEraFacts').querySelectorAll('[data-history-year]').forEach(b=>b.onclick=()=>{stopPlay();showKyrgyzContext=true;renderYear(+b.dataset.historyYear);focusLonLat(...kyrgyzHistoryForYear(year).view);$('kyrgyzEraTitle').scrollIntoView({block:'nearest'});});
}
