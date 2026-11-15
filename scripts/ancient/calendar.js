// Historical year numbers: -1 = 1 BCE, +1 = 1 CE. There is no year zero.
// Ordinals are internal arithmetic only; never display them to a visitor.
const ancientCalendar=(()=>{
 const valid=y=>Number.isSafeInteger(y)&&y!==0;
 function ordinal(y){if(!valid(y))throw new RangeError('Invalid historical year');return y<0?y+1:y;}
 function historical(n){if(!Number.isSafeInteger(n))throw new RangeError('Invalid year ordinal');return n<=0?n-1:n;}
 function add(y,n){if(!Number.isSafeInteger(n))throw new RangeError('Invalid year offset');return historical(ordinal(y)+n);}
 const eras={ru:['до н. э.','н. э.'],en:['BCE','CE'],ky:['б. з. ч.','б. з.']};
 function format(y,lang='en'){ordinal(y);const e=(eras[lang]||eras.en)[y<0?0:1];return lang==='ky'?e+' '+Math.abs(y)+'-жыл':Math.abs(y)+' '+e;}
 function range(a,b,lang='en'){ordinal(a);ordinal(b);if(a>b)throw new RangeError('Reversed period');if(a===b)return format(a,lang);if(Math.sign(a)!==Math.sign(b))return format(a,lang)+' — '+format(b,lang);const e=(eras[lang]||eras.en)[a<0?0:1];return lang==='ky'?e+' '+Math.abs(a)+'–'+Math.abs(b)+'-жылдар':Math.abs(a)+'–'+Math.abs(b)+' '+e;}
 function parse(value){const s=String(value).trim();if(!/^-?\d{1,6}$/.test(s))return null;const y=Number(s);return valid(y)?y:null;}
 function century(y){ordinal(y);return Math.sign(y)*Math.ceil(Math.abs(y)/100);}
 function centuryBounds(c){if(!valid(c))throw new RangeError('Invalid century');return c<0?[c*100,c*100+99]:[(c-1)*100+1,c*100];}
 return {valid,ordinal,historical,add,format,range,parse,century,centuryBounds};
})();
if(typeof module!=='undefined')module.exports=ancientCalendar;
