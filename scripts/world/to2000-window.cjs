'use strict';
// Regression-only projection. No replacement records and no regenerated hashes:
// retain exactly the records that existed by the end of the 1.18.1 date range.
module.exports=c=>({...c,
 entries:c.entries.map(e=>({...e,phases:e.phases.filter(p=>p.from<1992)})).filter(e=>e.phases.length),
 areas:c.areas.filter(a=>a.from<1992),outlines:c.outlines.filter(a=>a.from<1992),events:c.events.filter(a=>a.from<1992),
 sources:Object.fromEntries(Object.entries(c.sources).filter(([id])=>!id.startsWith('to2000')&&!id.startsWith('to2010'))),
 cartography:{...c.cartography,relations:c.cartography.relations.filter(r=>r.from<1992)}
});
