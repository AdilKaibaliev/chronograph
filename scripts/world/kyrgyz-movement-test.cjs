'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createKyrgyzStudy}=require('./kyrgyz-study-core.js'),html=fs.readFileSync('index.html','utf8'),catalog=JSON.parse(html.match(/const KYRGYZ_STUDY=([^\n]+);/)[1]);
class Node{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.dataset={};this.style={setProperty:(k,v)=>{this.style[k]=v;}};const classes=new Set();this.classList={contains:k=>classes.has(k),toggle:(k,on)=>{if(on)classes.add(k);else classes.delete(k);},add:k=>classes.add(k)};}
 setAttribute(k,v){this.attrs[k]=String(v);if(k==='class')for(const s of v.split(' '))this.classList.add(s);}getAttribute(k){return this.attrs[k];}
 append(...n){this.children.push(...n);}insertBefore(n){this.children.push(n);}replaceChildren(...n){this.children=n;}
 querySelectorAll(s){return this.children.flatMap(n=>[...(s.startsWith('.')&&n.classList.contains(s.slice(1))?[n]:[]),...n.querySelectorAll(s)]);}
 setPointerCapture(id){this.pointer=id;}hasPointerCapture(id){return this.pointer===id;}releasePointerCapture(){this.pointer=null;}
}
const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Node('div'));return nodes.get(id);},observers=[],frames=[],opened=[];let saves=0,views=0;
const context={year:1916,language:'ru',KYRGYZ_STUDY:catalog,createKyrgyzStudy,$:get,svg:{namespaceURI:'http://www.w3.org/2000/svg'},viewport:get('viewport'),routeLayer:get('routeLayer'),layerState:{routes:true},mapState:{tx:0,ty:0},wl:r=>r[0],we:(tag,cls,text)=>{const n=new Node(tag);if(cls)n.setAttribute('class',cls);n.textContent=text;return n;},document:{body:get('body'),createElementNS:(_,tag)=>new Node(tag),addEventListener(){},dispatchEvent(e){opened.push(e.detail.id);}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},matchMedia:()=>({matches:false}),localeSelect:{addEventListener(){}},requestAnimationFrame:fn=>frames.push(fn),MutationObserver:class{constructor(fn){this.fn=fn;}observe(target){observers.push({target,fn:this.fn});}},ResizeObserver:class{observe(){}},worldLabelMetrics:()=>({scale:2}),project:p=>p,screenPoint:(x,y)=>({x,y}),setViewport:()=>views++,queueLocationSave:()=>saves++};
vm.runInNewContext(fs.readFileSync('scripts/world/kyrgyz-movement-runtime.js','utf8'),context);
const flush=()=>{while(frames.length)frames.shift()();},change=target=>{observers.filter(o=>o.target===target).forEach(o=>o.fn());flush();};flush();
const layer=context.viewport.children.find(n=>n.id==='kyrgyzMovements'),key=get('mapCard').children.find(n=>n.id==='kyrgyzMovementKey');
const course=createKyrgyzStudy(catalog),years=[...new Set(catalog.lessons.filter(e=>e.route||e.routes).flatMap(e=>[e.from,e.to,e.to+1]))];
for(const y of years){context.year=y;change(get('timelineYear'));const expected=course.at(y).flatMap(e=>(e.routes||[e.route]).filter(r=>r?.length>1));assert.equal(layer.children.length,expected.length,'Route dates '+y);assert.equal(key.hidden,!expected.length,'Legend dates '+y);}
context.year=1916;change(get('timelineYear'));assert(layer.children.length);
context.layerState.routes=false;change(context.routeLayer);assert.equal(layer.children.length,0);assert(key.hidden,'Hidden routes retain their legend');context.layerState.routes=true;change(context.routeLayer);assert(layer.children.length,'Routes do not immediately return');
const hit=layer.querySelectorAll('.kyrgyz-movement-hit')[0],event=(x,y)=>({button:0,pointerId:1,clientX:x,clientY:y,preventDefault(){},stopPropagation(){}});
hit.onpointerdown(event(100,100));hit.onpointerup(event(100,100));hit.onclick({detail:1});assert.equal(opened.length,1,'Tap opens exactly once');
hit.onpointerdown(event(100,100));hit.onpointermove(event(125,118));hit.onpointerup(event(125,118));hit.onclick({detail:1});assert.equal(opened.length,1,'Dragging a route opens its lesson');assert.equal(context.mapState.tx,25);assert.equal(context.mapState.ty,18);assert.equal(saves,1);assert.equal(views,1);
hit.onpointerdown(event(100,100));hit.onpointercancel();hit.onpointerup(event(100,100));assert.equal(opened.length,1,'Cancelled gesture opens a lesson');
hit.onkeydown({key:'Enter',preventDefault(){},stopPropagation(){}});assert.equal(opened.length,2);
const toggle=key.children.find(n=>n.tag==='button');toggle.onclick();assert(layer.classList.contains('paused'));toggle.onclick();assert(!layer.classList.contains('paused'));
context.document.body.classList.add('future-mode');change(context.document.body);assert.equal(layer.children.length,0);assert(key.hidden);
assert(observers.some(o=>o.target===context.routeLayer),'Layer control is not observed');
console.log(JSON.stringify({pass:true,routeBoundaryYears:years.length,checks:'dated routes, layer toggle, tap once, drag, cancel, keyboard, pause, future mode'}));
