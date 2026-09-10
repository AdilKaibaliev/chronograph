const fs=require('fs'),assert=require('assert/strict');
const {createChronographTranslator}=require('./core.js');
const rows=JSON.parse(fs.readFileSync(__dirname+'/compiled-messages.json','utf8'));
const t=createChronographTranslator(rows);
for(const [ru,en,ky] of rows){assert.equal(t(ru,'en'),en);assert.equal(t(ru,'ky'),ky);assert.equal(t(ru,'ru'),ru);assert.equal(t(' '+ru+' ','en'),' '+en+' ');}
assert.equal(t('23 г. х.','en'),'23 AH');
assert.equal(t('ок. 573–634 (ок. 51 до хиджры – 13 г. х.)','en'),'c. 573–634 (c. 51 BH – 13 AH)');
assert.equal(t('612–712 (10 до хиджры – 93 г. х.)','ky'),'612–712 (10 хижрага чейин – 93 х. ж.)');
assert.equal(t('Исламская история · 750 н. э.','en'),'Islamic history · 750 CE');
assert.equal(t('132 г. х. · Аббасидская революция','en'),'132 AH · Abbasid Revolution');
assert.equal(t('Сподвижники · 19','ky'),'Сахабалар · 19');
assert.equal(t('Непереведённая историческая справка','en'),'Непереведённая историческая справка');
assert.equal(t('Атлас','invalid'),'Атлас');
console.log('PASS: '+rows.length+' message pairs, Russian preservation, calendar and dynamic labels, explicit Russian fallback.');
