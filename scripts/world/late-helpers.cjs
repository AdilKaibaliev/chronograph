'use strict';
const assert = require('node:assert/strict');
const L = (ru,en,ky) => [ru,en,ky];
module.exports = (c,{start=1300,max=1453}={}) => {
  const lookup = id => { const e=c.entries.find(e=>e.id===id); assert(e,'Unknown entry '+id); return e; };
  const H = {
    L,
    source(id,title,urls) { c.sources[id]={title,urls:Array.isArray(urls)?urls:[urls]}; },
    phase(from,to,title,text,sources,options={}) {
      const prefix=options.approx===false?['','','']:['ок. ','c. ','болж. '];
      const end=Math.min(to-1,max);
      const period=options.period||prefix.map(p=>p+from+(from===end?'':'–'+end));
      const phase={from,to,title,text,sources,period,...options};
      if(!phase.learning||!Object.keys(phase.learning).length)delete phase.learning;
      return phase;
    },
    entry(id,region,kind,coord,name,phases) {
      assert(!c.entries.some(e=>e.id===id),'Duplicate entry '+id);
      const entry={id,region,kind,coord,name,phases}; c.entries.push(entry); return entry;
    },
    continueEntry(id,phases) {
      assert(phases.length&&phases[0].from>=start,'Continuation must start at or after '+start+': '+id);
      const e=lookup(id);
      e.phases=e.phases.filter(p=>p.from<start).map(p=>p.to>start?{...p,to:start}:p).concat(phases);
      return e;
    },
    area(id,from,to,polygons,options={}) {
      const entry=lookup(id),phase=entry.phases.find(p=>from>=p.from&&from<p.to);
      assert(phase,'Missing phase for area '+id+' '+from);
      const previous=c.areas.filter(a=>a.entry===id&&a.from<from).sort((a,b)=>b.from-a.from)[0];
      if(polygons==='previous'){assert(previous,'No previous geometry '+id);polygons=structuredClone(previous.polygons);}
      assert(Array.isArray(polygons)&&polygons.length,'No polygons '+id);
      // The public renderer expects an array of rings; accept a single ring too.
      if(typeof polygons[0][0]==='number')polygons=[polygons];
      const a={id:id+'-'+from,entry:id,from,to,kind:options.kind||previous?.kind||'polity',color:options.color||previous?.color||'#8a8564',polygons,points:polygons[0],name:options.name||entry.name,title:options.title||phase.title,text:options.text||phase.text,sources:options.sources||phase.sources,approx:true,geometry:'schematic-regional-outline'};
      assert(!c.areas.some(x=>x.id===a.id),'Duplicate area '+a.id);c.areas.push(a);return a;
    },
    event(id,year,entryId,kind,coord,title,text,sources,options={}) {
      const entry=lookup(entryId);
      assert(!c.events.some(e=>e.id===id),'Duplicate event '+id);
      const event={id,from:year,to:options.to??year,year,entry:entryId,region:entry.region,kind,coord,title,text,sources,approx:options.approx??false,...options};
      c.events.push(event);return event;
    }
  };
  return H;
};
