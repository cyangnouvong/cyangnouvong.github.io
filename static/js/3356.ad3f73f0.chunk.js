"use strict";(self.webpackChunkportfolio=self.webpackChunkportfolio||[]).push([[3356],{3356:(o,e,n)=>{n.d(e,{Collider:()=>i});var s=n(4864);async function t(o,e,s,t){switch(o.options.collisions.mode){case"absorb":{const{absorb:i}=await n.e(2696).then(n.bind(n,2696));i(o,e,s,t);break}case"bounce":{const{bounce:s}=await n.e(1787).then(n.bind(n,1787));s(o,e);break}case"destroy":{const{destroy:s}=await n.e(4744).then(n.bind(n,2364));s(o,e);break}}}class i extends s.Cm{constructor(o){super(o)}clear(){}init(){}async interact(o,e){if(o.destroyed||o.spawning)return;const n=this.container,i=o.getPosition(),a=o.getRadius(),c=n.particles.quadTree.queryCircle(i,2*a);for(const r of c){if(o===r||!r.options.collisions.enable||o.options.collisions.mode!==r.options.collisions.mode||r.destroyed||r.spawning)continue;const c=r.getPosition(),l=r.getRadius();if(Math.abs(Math.round(i.z)-Math.round(c.z))>a+l)continue;(0,s.c$)(i,c)>a+l||await t(o,r,e,n.retina.pixelRatio)}}isEnabled(o){return o.options.collisions.enable}reset(){}}}}]);
//# sourceMappingURL=3356.ad3f73f0.chunk.js.map