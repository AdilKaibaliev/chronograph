'use strict';
const assert=require('node:assert/strict'),c=require('./calendar.js');
assert.equal(c.add(-1,1),1);assert.equal(c.add(1,-1),-1);
assert.equal(c.add(-3500,4109),610);assert.equal(c.add(609,1),610);
for(let y=-350000;y<=2026;y++)if(y){assert.equal(c.historical(c.ordinal(y)),y);assert.equal(c.add(c.add(y,1),-1),y);const [a,b]=c.centuryBounds(c.century(y));assert(y>=a&&y<=b);for(const l of ['ru','en','ky'])assert(!c.format(y,l).includes('-'+Math.abs(y)+' '));}
assert.deepEqual(c.centuryBounds(-1),[-100,-1]);assert.deepEqual(c.centuryBounds(1),[1,100]);
assert.equal(c.format(-201,'ru'),'201 до н. э.');assert.equal(c.format(610,'ru'),'610 н. э.');assert.equal(c.format(-201,'ky'),'б. з. ч. 201-жыл');
assert.equal(c.range(-221,-206,'en'),'221–206 BCE');assert.equal(c.range(-1,1,'ru'),'1 до н. э. — 1 н. э.');
for(const y of [0,NaN,Infinity,1.2])assert.throws(()=>c.format(y));
for(const s of ['0','-0','1.5','600x','1e3',''])assert.equal(c.parse(s),null);
assert.equal(c.parse('-3500'),-3500);assert.equal(c.parse('609'),609);
assert.equal(c.parse('-350000'),-350000);
console.log('PASS: 352,026 historical years; no year zero; BCE/CE arithmetic, periods, centuries and three languages.');
