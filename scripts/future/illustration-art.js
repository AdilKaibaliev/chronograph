// Deterministic, seekable vector scenes. Coordinates here describe a stage, never geography.
function createFutureIllustrationArt(){
 const C={gold:'#ddc38a',light:'#f1ddb0',olive:'#849172',dark:'#1c2a23',muted:'#727963',water:'#71928b',earth:'#777050'};
 const clamp=n=>Math.max(0,Math.min(1,n)),num=n=>Number(n.toFixed(3));
 const ease=p=>p*p*(3-2*p);
 const attrs=o=>Object.entries(o).map(([k,v])=>` ${k}="${typeof v==='number'?num(v):v}"`).join('');
 const tag=(name,a={},content='')=>`<${name}${attrs(a)}>${content}</${name}>`;
 const g=(a,s)=>tag('g',a,s),rect=(x,y,width,height,fill,extra={})=>tag('rect',{x,y,width,height,fill,...extra});
 const circle=(cx,cy,r,fill,extra={})=>tag('circle',{cx,cy,r,fill,...extra});
 const path=(d,stroke=C.gold,fill='none',extra={})=>tag('path',{d,stroke,fill,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round',...extra});
 const line=(x1,y1,x2,y2,stroke=C.gold,extra={})=>tag('line',{x1,y1,x2,y2,stroke,'stroke-width':2,...extra});
 const many=(n,fn)=>Array.from({length:n},(_,i)=>fn(i)).join('');
 const person=(x,y,s=1,opacity=1,tone=C.gold)=>g({transform:`translate(${num(x)} ${num(y)}) scale(${s})`,opacity,'data-person':''},circle(0,-14,6,'none',{stroke:tone,'stroke-width':1.7})+path('M-11 9V4C-11-8 11-8 11 4V9',tone));
 const pennant=(x,y,flip=false)=>g({transform:`translate(${num(x)} ${num(y)}) scale(${flip?-1:1} 1)`},line(0,0,0,-52,C.light)+path('M1-51L31-44L1-35',C.gold,C.olive));
 const book=(x,y,s=1)=>g({transform:`translate(${x} ${y}) scale(${s})`},path('M0-21Q-21-34-48-24V29Q-22 19 0 31Q23 19 48 29V-24Q20-34 0-21Z',C.gold,'#343f2a')+line(0,-21,0,31)+many(4,i=>line(10,-13+i*9,36,-16+i*9,C.gold,{opacity:.35}))+many(4,i=>line(-36,-16+i*9,-10,-13+i*9,C.gold,{opacity:.35})));
 const palm=(x,y,s=1,p=0)=>g({transform:`translate(${x} ${y}) scale(${s})`},path('M0 0Q12-44 2-88',C.earth,'none',{'stroke-width':9})+many(7,i=>path(`M3-85Q${(i-3)*18} ${-115+(i%2)*8} ${(i-3)*25} ${-78-Math.abs(i-3)*2}`,C.olive,'none',{'stroke-width':6}))+circle(-6,-73,6,C.gold,{opacity:1-p})+circle(10,-73,6,C.gold,{opacity:1-p}));
 const floor=()=>path('M20 339Q165 297 319 334T740 327V420H20Z','none','#42482e')+path('M20 373Q265 330 740 371','none','#8e815326');
 const hills=()=>path('M0 287L100 189L193 280L309 142L433 286L575 178L760 286V370H0Z','none','#394b37')+path('M0 310L150 247L290 320L474 231L648 292L760 257V390H0Z','none','#566048');
 const coin=(x,y,s=1,color=C.gold)=>g({transform:`translate(${num(x)} ${num(y)}) scale(${s})`},tag('ellipse',{cx:0,cy:0,rx:17,ry:7,fill:color,stroke:'#827044','stroke-width':1.2})+path('M-17 0V6C-17 14 17 14 17 6V0',C.earth,'none'));
 const city=(p,variant='city')=>{
  let s=many(9,i=>{const h=47+(i*37)%64,x=64+i*71;return rect(x,325-h,53,h,'#5c654a',{opacity:.62})+path(`M${x} ${325-h}l26-18 27 18`,C.olive,'#71775a');});
  s+=rect(94,252,572,79,'url(#fi-stone)')+many(23,i=>rect(95+i*25,240,14,21,C.earth));
  s+=rect(285,188,190,153,'url(#fi-stone)')+many(7,i=>rect(285+i*27,174,17,24,C.earth));
  s+=path('M334 339V265a46 46 0 0 1 92 0V339',C.gold,C.dark);
  const opening=['gates','jerusalem'].includes(variant)?ease(p)*36:0;
  s+=g({transform:`translate(${-opening} 0)`},path('M337 337V265a43 43 0 0 1 43-43V337Z','#bc9b60','#5a5437'));
  s+=g({transform:`translate(${opening} 0)`},path('M423 337V265a43 43 0 0 0-43-43V337Z','#bc9b60','#5a5437'));
  if(variant==='empty')s+=many(8,i=>person(160+i*62,348,1,1-.94*p));
  if(['rain','unrest'].includes(variant))s+=many(24,i=>circle(72+(i*71)%627,115+(i*43+p*130)%160,3,C.gold,{opacity:.12+.6*p}));
  if(variant==='ludd')s+=circle(380,302,30,'url(#fi-glow)',{opacity:1-p});
  return s;
 };
 const kaaba=(x,y,s=1)=>g({transform:`translate(${x} ${y}) scale(${s})`},path('M-58-90L7-111L70-87L7-64Z','#a39063','#514e36')+path('M-58-90L7-64V40L-58 16Z','#a39063','#252b24')+path('M7-64L70-87V17L7 40Z','#a39063','#30352a')+path('M-58-67L7-43L70-64',C.gold,'none',{'stroke-width':10})+rect(30,-18,19,38,'#a78e58'));
 const waterlines=(p,y=302)=>many(7,i=>path(`M35 ${y+i*12}Q170 ${y-15+i*12} 330 ${y+i*12}T725 ${y+i*12}`,C.water,'none',{opacity:.55-i*.045,transform:`translate(${Math.sin(p*5+i)*8} 0)`}));
 const stars=()=>many(24,i=>circle(45+(i*127)%684,30+(i*71)%200,i%3===0?1.8:1,C.gold,{opacity:.18+i%4*.09}));
 const towerFrames=[[150,176,137,160,143],[198,186,160,175,162],[208,201,232,198,212],[229,257,245,233,241],[251,266,260,287,273],[276,286,294,310,340]];
 const heights=p=>{const j=Math.min(4,Math.floor(p*5)),t=ease(p*5-j);return towerFrames[j].map((h,i)=>h+(towerFrames[j+1][i]-h)*t);};
 const renderers={
  towers(p,v){
   const h=heights(p),leader=h.indexOf(Math.max(...h));
   let s=many(9,i=>rect(30+i*83,325-(45+i*29%83),48,45+i*29%83,'#74795a',{opacity:.35}));
   s+=many(v==='medina'?9:5,i=>{const ht=v==='medina'?30+65*clamp(p*2-i*.14):h[i]*.78,x=v==='medina'?70+i*70:157+i*91,w=v==='medina'?48:64;return g({'data-building':i},rect(x,337-ht,w,ht,i===leader?'url(#fi-gold)':'url(#fi-stone)')+path(`M${x} ${337-ht}l8-8h${w}l-8 8Z`,'none','#d2bc80')+path(`M${x+w} ${337-ht}l8-8v${ht}l-8 8Z`,'none','#354d3c')+rect(x+7,346-ht,w-14,Math.max(8,ht-16),'url(#fi-windows)'));});
   s+=floor();
   if(v==='competition')s+=g({transform:'translate(80 388)'},person(0,-4,1.2)+tag('text',{x:35,y:0,'font-size':53,filter:'url(#fi-black)','aria-hidden':'true'},'🐪 🐪'));
   return s;
  },
  knowledge(p,v){
   return many(6,i=>{const a=1-clamp(p*1.7-i*.14)*.9,x=112+i*107;return line(x,120,380,276,C.gold,{opacity:a*.6})+circle(x,100,37,'url(#fi-glow)',{opacity:a})+circle(x,100,23,'none',{stroke:C.gold,opacity:a*.7})+person(x,105,1.2,a);})+g({opacity:1-p*.6},book(380,270,1.15))+many(v==='morals'?3:1,i=>g({opacity:.35+.65*p},rect(200+i*130,350,100,44,'#35402c',{rx:8})+(i===0?book(250+i*130,370,.32):i===1?path('M370 362H390L388 375Q380 383 372 375ZM380 380V389M372 389H388'):path('M515 368C505 350 492 370 503 381L515 392L527 381C539 369 525 351 515 368M516 370L510 378L520 382'))));
  },
  people(p,v){
   if(v==='fifty')return many(50,i=>{const x=124+(i%10)*57,y=65+Math.floor(i/10)*45,a=.45+.55*clamp(p*2-i/50);return circle(x,y,17,'#d9bd8518',{opacity:a})+person(x,y+4,.87,a);})+path('M100 288V299Q100 313 115 313H644Q659 313 659 299V288M380 314V343',C.gold)+circle(380,371,30,'url(#fi-gold)')+person(380,376,1.25,1,C.dark)+tag('text',{x:93,y:371,fill:C.light,'font-family':'Georgia,serif','font-size':40},'50')+tag('text',{x:465,y:383,fill:C.light,'font-family':'Georgia,serif','font-size':40},'1');
   return many(64,i=>{const x=80+i%16*40,y=125+Math.floor(i/16)*50,a=v==='loss'?1-clamp(p*1.6-i*.017)*.86:.25+.75*clamp(p*2-i*.015);return person(x,y,.95,a);})+floor();
  },
  armies(p,v){
   const alliance=v==='alliance',advance=75*ease(p),gap=alliance?130:260-advance;
   let s=hills()+floor();
   for(const side of [-1,1]){const cx=380+side*gap+(alliance?advance:0);s+=g({transform:`translate(${cx} 0)`},many(18,i=>circle((i%6-2.5)*15,274+Math.floor(i/6)*16,4,side<0?C.gold:C.olive,{opacity:.9}))+pennant(-18,261,side>0)+pennant(20,280,side>0));}
   if(v==='trees')s+=palm(65,317,.8)+palm(698,322,.8);
   if(v==='unrest')s+=many(8,i=>path(`M${100+i*80} 340l12-20-4-20`,C.gold,'none',{opacity:.1+.65*p}));
   return s;
  },
  city(p,v){return floor()+city(p,v);},
  sanctuary(p,v){
   let s=floor();
   if(v==='medina'||v==='pair')s+=g({transform:v==='pair'?'translate(310 100) scale(.5)':'translate(0 0)'},city(0,'city'));
   if(v!=='medina')s+=g({opacity:v==='destruction'?1-p*.8:1,transform:v==='destruction'?`translate(0 ${45*p})`:''},kaaba(v==='pair'?235:380,283,1.35));
   if(['medina','pair'].includes(v))s+=path('M90 320V233a290 218 0 0 1 580 0V320',C.gold,'none',{'stroke-width':3,opacity:.2+p*.8})+many(8,i=>circle(126+i*73,345,4,C.gold,{opacity:.15+.85*p}));
   if(v==='pilgrimage')s+=many(26,i=>{const a=i/26*Math.PI*2+p*.65;return circle(380+Math.cos(a)*186,294+Math.sin(a)*65,4,C.gold);});
   if(v==='destruction')s+=many(14,i=>rect(275+(i*41)%215,335+(i%3)*12,13,8,C.earth,{opacity:p}));
   return s;
  },
  minaret(p){return hills()+floor()+g({opacity:.5+.5*p},path('M362 324L368 126H395L403 324Z',C.light,'url(#fi-stone)')+rect(357,122,48,12,C.light)+path('M365 122L381 91L399 122Z',C.gold,'#d4c695')+rect(354,174,55,10,C.light))+path('M220 15L331 328H448L548 15Z','none','url(#fi-light)',{opacity:.1+.65*ease(p)});},
  land(p,v){let s=hills()+floor();if(v==='peace')s+=many(7,i=>palm(105+i*88,350,.55,p*0))+path('M90 372Q360 320 680 372',C.water,'none',{'stroke-width':5,opacity:p});if(['multitude','stillness'].includes(v))s+=many(75,i=>circle(70+(i*41)%625,270+Math.floor(i/25)*27,3,C.gold,{opacity:v==='stillness'?1-p*.95:.25+.75*p,transform:`translate(${v==='multitude'?p*45:0} 0)`}));if(v==='grave')s+=path('M279 352Q380 295 481 352','none','#6f7152')+rect(288,275,29,66,'url(#fi-stone)',{rx:6})+person(517-p*30,339,1.7);return s;},
  wind(p){return hills()+floor()+many(11,i=>path(`M${-120+p*260+(i%3)*30} ${80+i*23}q170-45 340-3t420-5`,C.gold,'none',{opacity:.12+(i%3)*.09,'stroke-width':i%3+1}))+many(12,i=>circle(65+(i*61+p*210)%647,130+(i*31)%170,3,C.light,{opacity:1-p*.88}));},
  sky(p,v){let s=stars()+floor();if(v==='sun')s+=circle(154,310-p*210,47,'url(#fi-gold)')+circle(154,310-p*210,87,'url(#fi-glow)');if(v==='moon')s+=g({transform:`translate(${-p*45} 0)`},path('M380 69A91 91 0 0 0 380 251Z',C.light,'#dbd3b4'))+g({transform:`translate(${p*45} 0)`},path('M380 69A91 91 0 0 1 380 251Z',C.light,'#c2bea3'));if(v==='smoke')s+=many(12,i=>tag('ellipse',{cx:120+(i%4)*173+(p*26),cy:80+Math.floor(i/4)*86,rx:107,ry:48,fill:'#a8ac9a',opacity:.05+p*.16}));if(v==='hour')s+=circle(380,241,190,'url(#fi-glow)',{opacity:.2+p*.8})+path('M20 334Q380 300 740 334',C.light,'none',{'stroke-width':1+3*p});return s;},
  earth(p,v){const a=ease(p);let s=hills();s+=g({transform:`translate(${-a*25} 0)`},path('M15 294L329 286L352 310L330 331L352 355L330 392H15Z',C.earth,'#737150'));s+=g({transform:`translate(${a*25} 0)`},path('M745 294L407 286L380 310L404 331L380 355L405 392H745Z',C.earth,'#737150'));s+=path('M329 286L352 310L330 331L352 355L330 392H405L380 355L404 331L380 310L407 286Z','none','#111e18',{opacity:.3+.7*a});if(v==='army')s+=g({transform:`translate(0 ${p*61})`,opacity:1-p},many(18,i=>circle(276+(i%9)*26,266+Math.floor(i/9)*15,4,C.gold))+pennant(373,261));if(v==='quakes')s+=many(3,i=>path(`M${140+i*228} 274q-27-37 0-73m17 69q-18-29 0-56`,C.gold,'none',{opacity:p*.6}));return s;},
  fire(p,v){let s=hills()+floor();s+=many(11,i=>{const x=55+i*34,y=337,h=40+p*70+(i*19)%45;return path(`M${x-20} ${y}Q${x-34} ${y-h*.45} ${x} ${y-h}Q${x-6} ${y-h*.25} ${x+20} ${y-40}Q${x+30} ${y} ${x-20} ${y}Z`,'none','url(#fi-fire)',{opacity:.5+.5*p});});if(v==='gathering')s+=many(16,i=>person(430+i%8*27+p*40,285+Math.floor(i/8)*43,.65));else s+=path('M180 302L650 102L702 304Z','none','url(#fi-light)',{opacity:.25+.7*p});return s;},
  water(p,v){
   let s=hills()+floor();
   if(v==='gold')s+=path(`M160 350L380 ${320-150*p}L586 350Z`,'#ddc992','url(#fi-gold)')+g({opacity:1-p*.9},waterlines(p));
   if(v==='green')s+=path('M350 192Q250 258 428 303T486 407',C.water,'none',{'stroke-width':8+18*p,opacity:.3+.7*p})+many(55,i=>path(`M${48+(i*61)%660} ${302+(i*37)%96}l-5-${5+15*p}m5 ${5+15*p}l8-${5+10*p}`,C.olive,'none',{opacity:.15+.85*p,'stroke-width':2}));
   if(v==='barren')s+=many(62,i=>{const x=38+(i*41)%690,y=25+(i*73+p*160)%262;return line(x,y,x-6,y+16,C.water,{opacity:.2+p*.6});})+many(6,i=>path(`M${90+i*106} 357l12-8-7-11 14-8`,C.dark));
   if(v==='palms')s+=many(5,i=>palm(153+i*115,345,1.1,p));
   return s;
  },
  journey(p,v){
   if(v==='island')return waterlines(p,267)+path('M200 286Q380 132 560 286Z','none','#616b49')+palm(383,257,.6)+g({transform:`translate(${90+p*86} 270)`},path('M-41 0L-21 20H35L50 0Z',C.gold,'#706c49')+line(5,0,5,-74)+path('M3-72L-33-10H3Z',C.gold,'#c5b888'));
   let s=hills()+floor()+path('M100 310C260 166 482 414 656 219',C.gold,'none',{'stroke-dasharray':'5 9',opacity:.5});
   s+=circle(100,310,9,C.gold)+circle(656,219,9,C.gold);
   const q=1-p,x=q*q*q*100+3*q*q*p*260+3*q*p*p*482+p*p*p*656,y=q*q*q*310+3*q*q*p*166+3*q*p*p*414+p*p*p*219;
   s+=circle(x,y,17,'url(#fi-glow)')+circle(x,y,5,C.light);
   if(v==='safe')s+=kaaba(652,181,.48);
   if(v==='return')s+=g({transform:'translate(-55 25) scale(.36)'},city(0));
   return s;
  },
  wealth(p,v){let s=floor();if(v==='kisra')s+=path('M146 326V99H614V326H473V197a93 93 0 0 0-186 0V326Z',C.earth,'url(#fi-stone)');if(v==='earth')s+=many(6,i=>rect(183+i*69,324-(70+100*p)*(i%2?1:.85),42,(70+100*p)*(i%2?1:.85),i%2?'#c0c3ad':'url(#fi-gold)'));else s+=many(42,i=>{const row=Math.floor(i/7),x=267+i%7*31,y=329-row*10,shift=v==='giving'?(i%2?-1:1)*120*p:0;return g({opacity:v==='giving'?1:.2+.8*clamp(p*1.7-i*.017)},coin(x+shift,y,.9,C.gold));});if(v==='giving')s+=person(130,342,1.7)+person(630,342,1.7);if(v==='abundance')s+=many(5,i=>coin(133+i*121,365,.95,C.gold));return s;},
  treaty(p,v){const peace=v==='peace';let s=floor()+pennant(125+(peace?70*p:0),296)+pennant(635-(peace?70*p:0),296,true);s+=g({transform:`translate(${-(!peace?p*19:0)} 0)`},rect(264,120,113,162,'#b9ac80',{rx:5})+many(6,i=>line(282,148+i*20,358,148+i*20,'#6e704c')));s+=g({transform:`translate(${!peace?p*19:0} 0)`},rect(382,120,113,162,'#cbbc90',{rx:5})+many(6,i=>line(400,148+i*20,475,148+i*20,'#6e704c')));s+=path('M379 114L370 156L385 185L372 219L383 247L378 286',peace?C.light:C.dark,'none',{'stroke-width':peace?3:2+5*p,opacity:peace?p:1});if(peace)s+=path('M184 309Q380 232 576 309',C.gold,'none',{'stroke-width':2,opacity:p});if(v==='meadow')s=hills()+s;return s;},
  balance(p,v){let s=floor()+line(380,145,380,321,C.gold,{'stroke-width':7})+path('M329 328H431',C.gold,'none',{'stroke-width':10});s+=g({transform:`rotate(${p*16} 380 160)`},line(207,160,553,160,C.gold,{'stroke-width':4})+line(235,160,210,244)+line(235,160,260,244)+path('M194 245Q235 293 276 245Z',C.gold,'#576146')+line(525,160,500,244)+line(525,160,550,244)+path('M484 245Q525 293 566 245Z',C.gold,'#576146'));if(v==='earnings')s+=coin(227,240,.8)+coin(525,285,.8);else s+=book(241,230,.42);return s;},
  time(p,v){if(v==='adjacent')return floor()+rect(324,94,42,235,'url(#fi-gold)',{rx:20,opacity:.35+.65*p})+rect(375,94,42,235,'url(#fi-stone)',{rx:20,opacity:.35+.65*p})+path('M331 352H410',C.gold,'none',{'stroke-width':2,opacity:.2+.8*p});const spacing=88-59*p;return stars()+floor()+many(7,i=>rect(380+(i-3)*spacing-8,107,16,194,'url(#fi-gold)',{rx:8,opacity:.3+i*.1}))+path('M80 334H680',C.olive);},
  wall(p){return floor()+rect(106,108,548,235,'url(#fi-stone)')+many(7,i=>line(106,119+i*33,654,119+i*33,'#303e2e'))+many(28,i=>line(126+i%7*82,108+Math.floor(i/7)*66,126+i%7*82,141+Math.floor(i/7)*66,'#303e2e'))+circle(380,222,15+29*p,C.dark,{stroke:C.gold,'stroke-width':3});},
  relation(p,v){if(v==='mother')return floor()+path('M263 210H497',C.gold,'none',{opacity:.4+.6*p})+person(249,215,2)+person(511,218,1.3)+circle(511,205,34,'none',{stroke:C.gold,opacity:.3+p*.7});return floor()+path('M249 167H511M380 168V293',C.gold,'none',{opacity:.4+.6*p})+circle(249,168,40,'none',{stroke:C.gold,'stroke-width':2})+circle(511,168,40,'none',{stroke:C.gold,'stroke-width':2})+circle(380,293,40,'url(#fi-glow)',{stroke:C.gold});},
  authority(p,v){return floor()+g({transform:`translate(${v==='staff'?p*24:0} 0)`},path('M348 324V133Q348 96 385 98',C.gold,'none',{'stroke-width':8})+many(8,i=>person(193+i*49,313,.9,.45+p*.55)))+(v==='interests'?many(7,i=>coin(312+i*21,357,.75)):v==='young'?path('M265 373l69-9-13-9 53-5 30 17 78 3',C.dark):'');},
  trial(p,v){let s=stars()+floor();if(v==='steadfast')s+=circle(380,209,62,'none',{stroke:C.gold,'stroke-width':2})+circle(380,209,23,'url(#fi-glow)')+person(380,223,2);else s+=rect(98,81,260,242,'#172922',{rx:130})+rect(404,81,260,242,'url(#fi-light)',{rx:130,opacity:.22+p*.4});s+=many(6,i=>path(`M40 ${120+i*31}Q380 ${30+i*47} 720 ${145+i*28}`,C.olive,'none',{opacity:.15+p*.2,transform:`translate(${(v==='east'?-1:1)*p*15} 0)`}));return s;},
  trade(p){return floor()+many(3,i=>{const x=168+i*214;return rect(x-38,164,76,65,'url(#fi-stone)',{rx:6})+many(3,j=>coin(x-20+j*19,238,.6))+path(`M${x} 275L380 354`,C.gold,'none',{'stroke-dasharray':'4 8',opacity:1-p*.9});});},
  voices(p){return floor()+many(30,i=>{const x=150+i%10*51,y=125+Math.floor(i/10)*68;return g({opacity:.25+.75*clamp(p*2-i*.028)},rect(x-16,y-17,32,25,'#586147',{rx:7})+path(`M${x-7} ${y+8}l-4 9 12-9`,C.gold)+circle(x,y-5,2,C.light));});},
  idols(p){return hills()+floor()+many(3,i=>g({opacity:.25+.75*p},rect(226+i*113,173,68,153,'url(#fi-stone)',{rx:25})+rect(216+i*113,327,89,19,C.earth)));},
  emergence(p){return floor()+path('M283 330Q380 291 477 330',C.gold)+circle(380,244,35+57*p,'url(#fi-glow)',{opacity:.25+p*.5})+path('M316 310Q380 290 444 310',C.gold,'none',{opacity:p});},
  memorial(p){return stars()+floor()+path('M280 326V189a100 100 0 0 1 200 0V326',C.gold,'none',{'stroke-width':2})+circle(380,239,80,'url(#fi-glow)',{opacity:.4+.5*p})+book(380,254,.9);},
  conduct(p,v){return floor()+many(v==='prohibitions'?4:2,i=>{const n=v==='prohibitions'?4:2,x=380+(i-(n-1)/2)*136;let s=rect(x-50,133,100,154,'#36402d',{rx:12,stroke:'#7b7d56'});if(v==='harshness')s+=i===0?path(`M${x-17} 166L${x+7} 193Q${x+43} 226 ${x-13} 253`,C.gold,'none',{'stroke-width':3}):path(`M${x-15} 163L${x-32} 183L${x-20} 197L${x-13} 186V251H${x+17}V186L${x+24} 197L${x+35} 182L${x+15} 163Q${x} 179 ${x-15} 163Z`,C.gold);else if(i===2)s+=path(`M${x-22} 166H${x+22}L${x+16} 196Q${x} 214 ${x-16} 196ZM${x} 207V251M${x-18} 251H${x+18}`,C.gold);else if(i===3)s+=path(`M${x-8} 243V176L${x+22} 168V230M${x-8} 180L${x+22} 172`,C.gold)+circle(x-17,245,10,'none',{stroke:C.gold})+circle(x+13,233,10,'none',{stroke:C.gold});else if(i===1)s+=path(`M${x-26} 166Q${x} 183 ${x+26} 166V253Q${x} 235 ${x-26} 253Z`,C.gold);else s+=path(`M${x} 190C${x-30} 149 ${x-48} 202 ${x} 232C${x+48} 202 ${x+30} 149 ${x} 190Z`,C.gold);return s+path(`M${x-29} 270L${x+30} 148`,C.gold,'none',{opacity:.3+.7*p});});},
  sequence(p){return floor()+path('M119 218H642',C.olive,'none',{'stroke-dasharray':'5 8'})+many(4,i=>circle(140+i*160,217,36,'#34432d',{stroke:C.gold,'stroke-width':2,opacity:.35+.65*clamp(p*4-i+1)})+tag('text',{x:140+i*160,y:227,'text-anchor':'middle',fill:C.light,'font-family':'Georgia,serif','font-size':30},String(i+1)));}
 };
 const defs='<defs><linearGradient id="fi-gold"><stop stop-color="#a89a67"/><stop offset=".5" stop-color="#ead299"/><stop offset="1" stop-color="#a69967"/></linearGradient><linearGradient id="fi-stone"><stop stop-color="#647454"/><stop offset=".5" stop-color="#a3a781"/><stop offset="1" stop-color="#768766"/></linearGradient><linearGradient id="fi-light" x2="0" y2="1"><stop stop-color="#e7d19b" stop-opacity=".04"/><stop offset="1" stop-color="#e7d19b" stop-opacity=".65"/></linearGradient><linearGradient id="fi-fire" x2="0" y2="1"><stop stop-color="#e5c37b"/><stop offset="1" stop-color="#92704a"/></linearGradient><radialGradient id="fi-glow"><stop stop-color="#ecd499" stop-opacity=".8"/><stop offset="1" stop-color="#d4bd83" stop-opacity="0"/></radialGradient><pattern id="fi-windows" width="10" height="13" patternUnits="userSpaceOnUse"><path d="M7 0V13M0 10H10" fill="none" stroke="#294436" stroke-opacity=".6" stroke-width="3"/></pattern><filter id="fi-black"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".08"/><feFuncG type="linear" slope=".08"/><feFuncB type="linear" slope=".08"/></feComponentTransfer></filter></defs>';
 function render(spec,progress){if(!renderers[spec.type])throw Error('Unknown illustration '+spec.type);return defs+renderers[spec.type](clamp(Number(progress)||0),spec.variant);}
 return {render,types:Object.keys(renderers),heights};
}
if(typeof module!=='undefined')module.exports={createFutureIllustrationArt};
