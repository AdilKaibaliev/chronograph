const fs=require('fs'),assert=require('node:assert/strict');
// Keep original spelling and vocalization. Normalization is only a search aid.
function searchable(text){
 let normalized='',positions=[];
 for(let i=0;i<text.length;i++){
  const c=text[i];if(/[\u064b-\u065f\u0670\u200e\u200f]/.test(c))continue;
  if(/\s/.test(c)){if(normalized.endsWith(' '))continue;normalized+=' ';}else normalized+=c;
  positions.push(i);
 }
 return {normalized,positions};
}
module.exports=function attachQuotes(catalog){
 const byId=new Map(catalog.events.map(e=>[e.id,e])),seen=new Set();
 for(const line of fs.readFileSync(__dirname+'/quotes.tsv','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#'))){
  const parts=line.split('|');assert.equal(parts.length,6,'Invalid quote row: '+parts[0]);
  const [ids,ref,match,ru,en,ky]=parts;const source=catalog.hadithTexts[ref]?.arabic;assert(source,'Unknown source '+ref);
  const {normalized,positions}=searchable(source),needle=searchable(match).normalized;
  const start=normalized.indexOf(needle);assert(start>=0,'Arabic excerpt does not match source: '+ids);
  let end=positions[start+needle.length-1]+1;while(end<source.length&&/[\u064b-\u065f\u0670]/.test(source[end]))end++;
  const arabic=source.slice(positions[start],end);
  for(const id of ids.split(',')){
   const event=byId.get(id);assert(event,'Unknown event '+id);assert(!seen.has(id),'Duplicate quote '+id);
   assert(event.refs.includes(ref),'Quote not in event sources: '+id);assert(ru&&en&&ky,'Missing translation '+id);
   event.quote={ref,arabic,translation:{ru,en,ky}};seen.add(id);
  }
 }
 assert.equal(seen.size,byId.size,'Missing event quotes: '+[...byId.keys()].filter(k=>!seen.has(k)).join(', '));
 return catalog;
};
