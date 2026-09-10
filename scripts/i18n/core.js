function createChronographTranslator(rows) {
  const dictionaries = {ru: new Map(), en: new Map(), ky: new Map()};
  for (const [ru, en, ky] of rows) {
    for (const [lang, value] of [['en', en], ['ky', ky]]) {
      if (typeof value !== 'string') throw new Error('Missing '+lang+' translation: '+ru);
      if (dictionaries[lang].has(ru) && dictionaries[lang].get(ru) !== value) throw new Error('Conflicting translation: '+ru);
      dictionaries[lang].set(ru,value);
    }
  }
  return function translate(input, lang='ru') {
    const source=String(input), value=source.trim();
    if (lang==='ru' || !dictionaries[lang] || !value) return source;
    const dict=dictionaries[lang], pick=(en,ky)=>lang==='en'?en:ky;
    let out;
    if (dict.has(value)) out=dict.get(value);
    else if (value.startsWith('Источник: ')) out=pick('Source: ','Булак: ')+translate(value.slice(10),lang);
    else if (value.startsWith('тип слоя: ')) out=pick('Layer type: ','Катмар түрү: ')+translate(value.slice(10),lang);
    else if (value.startsWith('граница: ')) out=pick('Boundary: ','Чек ара: ')+translate(value.slice(9),lang);
    else if (/^Контур: исторический срез \d+ года\.$/.test(value)) {const n=value.match(/\d+/)[0];out=pick('Boundary snapshot: '+n+' CE.', 'Чек аранын тарыхый кесими: '+n+'-жыл.');}
    else if (/^Контур: последний доступный срез/.test(value)) {const [f,y]=value.match(/\d+/g);out=pick('Latest available boundary snapshot: '+f+' CE; selected year: '+y+' CE. Changes between snapshots have not been reconstructed.','Акыркы жеткиликтүү чек ара кесими: '+f+'-жыл; тандалган жыл: '+y+'. Кесимдердин ортосундагы өзгөрүүлөр калыбына келтирилген эмес.');}
    else if (value.startsWith('Ближайшее предшествующее событие — ')) {
      const m=value.match(/^Ближайшее предшествующее событие — (\d+) год: (.*?) Следующий рубеж — (\d+) год: «(.*?)»\. Ниже показаны государства и процессы, относящиеся к выбранному году\.$/);
      if(m)out=pick('Previous milestone — '+m[1]+' CE: '+translate(m[2],lang)+' Next milestone — '+m[3]+' CE: “'+translate(m[4],lang)+'”. The states and developments below relate to the selected year.','Мурунку маанилүү окуя — '+m[1]+'-жыл: '+translate(m[2],lang)+' Кийинки маанилүү окуя — '+m[3]+'-жыл: «'+translate(m[4],lang)+'». Төмөндө тандалган жылга тиешелүү мамлекеттер жана процесстер көрсөтүлгөн.');
    }
    else if (/^≈\d+ г\. х\.$/.test(value)) out=value.replace('г. х.',pick('AH','х. ж.'));
    else if (/^\d+ год$/.test(value)) out=value.replace(' год',pick(' CE','-жыл'));
    else if (/^Исламская история · \d+ н\. э\.$/.test(value)) out=value.replace('Исламская история',dict.get('Исламская история')).replace('н. э.',pick('CE','б. з.'));
    else if (/^Синхронно с \d+ н\. э\.$/.test(value)) out=value.replace('Синхронно с',pick('In the same year:','Ошол эле жыл:')).replace('н. э.',pick('CE','б. з.'));
    else if (/^Все \d+ современников из подборки/.test(value)) {
      const n=value.match(/\d+/)[0];
      out=pick('All '+n+' contemporaries in this collection · select a name. Dates: Gregorian (Hijri).','Топтомдогу бардык '+n+' замандаш · ысымды тандаңыз. Даталар: Григориан календары (хижрий).');
    } else if (/^Современники в \d+ году$/.test(value)) {
      const n=value.match(/\d+/)[0];out=pick('Contemporaries in '+n,n+'-жылдагы замандаштар');
    } else if (/^Эпоха: /.test(value)) out=pick('Era: ','Доор: ')+translate(value.slice('Эпоха: '.length),lang);
    else if (!value.includes(' · ') && (value.includes(' / ') || value.includes(' → ') || value.includes(' ↔ '))) {
      const separator=value.includes(' / ')?' / ':value.includes(' → ')?' → ':' ↔ ';
      const chunks=value.split(separator),converted=chunks.map(part=>translate(part,lang));
      if(converted.every((part,i)=>part!==chunks[i]||!/[А-Яа-я]/.test(part)))out=converted.join(separator);
    }
    else if (value.includes(' · ')) {
      const chunks=value.split(' · '), converted=chunks.map(part=>translate(part,lang));
      if (converted.some((part,i)=>part!==chunks[i])) out=converted.join(' · ');
    }
    // Only calendar strings are transformed here; untranslated prose stays intact.
    if (out===undefined && /^(?:ок\. )?[?\d][\d\s?–—\-()/.,]*|^до хиджры$/.test(value) && !/[А-Яа-я]/.test(value.replace(/рождение неизвестно|до хиджры|г\. х\.|н\. э\.|ок\.|прибл\./g,''))) {
      out=value.replaceAll('рождение неизвестно',pick('birth unknown','туулган жылы белгисиз')).replaceAll('до хиджры',pick('BH','хижрага чейин')).replaceAll('г. х.',pick('AH','х. ж.')).replaceAll('н. э.',pick('CE','б. з.')).replaceAll('ок.',pick('c.','болж.')).replaceAll('прибл.',pick('approx.','болж.'));
    }
    if(out===undefined)return source;
    return source.slice(0,source.indexOf(value))+out+source.slice(source.indexOf(value)+value.length);
  };
}
if(typeof module!=='undefined')module.exports={createChronographTranslator};
