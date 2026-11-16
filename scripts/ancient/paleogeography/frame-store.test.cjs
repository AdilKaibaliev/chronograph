'use strict';
const assert=require('node:assert/strict'),create=require('./frame-store.js');
(async()=>{
 const calls=[],resolvers=new Map(),meta=n=>({asset:'/'+n,bp:n,year:1949-n,source:'krapp2021'}),value=f=>({...f,land:[],ice:[],shelf:[]});
 const store=create(url=>{calls.push(url);return new Promise((resolve,reject)=>resolvers.set(url,{resolve,reject}));},2);
 const a=meta(100000),b=meta(101000),c=meta(102000);
 const pa=store.request(a),again=store.request(a),pb=store.request(b);assert.equal(pa,again);await Promise.resolve();assert.deepEqual(calls,[a.asset,b.asset]);
 resolvers.get(b.asset).resolve(value(b));await pb;assert.equal(store.get(b).bp,b.bp);assert.equal(store.get(a),null);
 resolvers.get(a.asset).resolve(value(a));await pa;assert.equal(store.get(b).bp,b.bp,'A late older response must not overwrite another frame');
 const pc=store.request(c);await Promise.resolve();resolvers.get(c.asset).reject(Error('offline'));await assert.rejects(pc,/offline/);assert.equal(store.get(c),null);
 const retry=store.request(c);await Promise.resolve();resolvers.get(c.asset).resolve(value(c));await retry;assert.equal(store.size(),2);assert.equal(store.get(a),null,'Least recently used frame is evicted');assert.equal(store.get(b).bp,b.bp);
 const wrong=store.request(a);await Promise.resolve();resolvers.get(a.asset).resolve(value(c));await assert.rejects(wrong,/Unexpected/);assert.equal(store.get(a),null);
 const inline=value(meta(0));assert.equal(store.get(inline),inline);assert.equal(await store.request(inline),inline);
 console.log(JSON.stringify({pass:true,landscapeCache:'deduplication, out-of-order responses, retry, identity, LRU'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
