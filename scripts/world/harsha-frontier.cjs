'use strict';
const G=require('./cartography-geometry.cjs');
// Constrain the old envelope using the southern arc of a dated regional
// reconstruction. This is not river survey geometry or a claim to annual
// acquisitions. Keep the northern envelope: the source omits Thanesar.
const reference=require('../../research/harsha-southern-reference.json');
const arc=reference.southernArc;
const south=G.union([[[70,0],[93,0],[93,arc[0][1]],...arc,[70,arc.at(-1)[1]]]]);
function apply(empires){
 const e=empires.find(e=>e.id==='harsha');if(!e)return;
 e.to=647;
 for(const f of e.keyframes)f.polys=G.difference(G.union(f.polys),south);
 const source='P. Bhaskar Reddy. Harshavardhana. Outlines of Indian History (INFLIBNET), sections 5–5.1; NCERT. Our Pasts I: New Empires and Kingdoms. Southern regional reference: Bennett et al. Cliopatria v0.2.1 (CC BY 4.0).';
 if(!e.source.includes(source))e.source+=' '+source;
}
module.exports={apply,south};
