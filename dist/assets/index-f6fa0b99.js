import{u as E}from"./resources-c352f549.js";import{s as F}from"./staticResources-a247f3d6.js";import{r as I,j as P,x as z,z as L,a as o,o as s,c as r,w as e,d as x,n as y,F as g,f as w,b as n,e as b,t as a,g as l}from"./index-29b1d87f.js";import{b as k}from"./route-block-83d24a4e.js";import{_ as M}from"./_plugin-vue_export-helper-c27b6911.js";import"./apolloClient-3b54e56b.js";const U={class:"resource-icon"},$={class:"resource-name"},C={__name:"index",setup(q){I(!1);const{resourceType:G,staticResources:i}=F,R=P(),u=E(),p=z(()=>i.value.map(c=>{const m=u.resources.filter(_=>_.contentType===c.type);return{...c,resourceCount:m.length}}));function D(c){localStorage.setItem("resourceType",c.type),R.push("/dashboard/player")}const T=async()=>{await u.getAllResources(),i.value=p.value};return L(()=>{T()}),(c,m)=>{const _=o("v-img"),f=o("v-col"),v=o("v-row"),h=o("v-card-text"),B=o("v-card-title"),S=o("v-divider"),N=o("v-btn"),V=o("v-card-actions"),j=o("v-card"),A=o("v-container");return s(),r(A,{class:"my-5"},{default:e(()=>[Date.now()<Date.now()+864e5*365?(s(),r(v,{key:0},{default:e(()=>[(s(),x(g,null,y(1,(t,d)=>n(f,{key:d,cols:"12"},{default:e(()=>[n(_,{src:"https://slideuplift.com/wp-content/uploads/2022/07/Coming-Soon-PowerPoint-Template-0944.jpg",fit:"","min-width":"100%",height:"81vh"})]),_:2},1024)),64))]),_:1})):w("",!0),Date.now()>Date.now()+864e5*365?(s(),r(v,{key:1},{default:e(()=>[(s(!0),x(g,null,y(p.value,(t,d)=>(s(),r(f,{key:d,cols:"12",sm:"12",md:"4",lg:"3",xl:"3"},{default:e(()=>[n(j,{class:"mx-auto my-3 resource-card","max-width":"540",height:"13.5rem",disabled:t.resourceCount===0,outlined:"",onClick:H=>D(t)},{default:e(()=>[n(B,{color:"#08487f",class:"d-flex align-center justify-space-between"},{default:e(()=>[b("span",U,a(t.icon),1),b("span",$,[l(a(t.name)+" ("+a(t.resourceCount)+")",1),n(h,{class:"text-h11"},{default:e(()=>[l(a(t.type),1)]),_:2},1024)])]),_:2},1024),n(S),n(h,{class:"resource-description text-h7 py-2"},{default:e(()=>[l(a(t.description),1)]),_:2},1024),n(V,{class:"fixed-actions mb-1"},{default:e(()=>[n(N,{"append-icon":"mdi-chevron-right",color:"#08487f",variant:"outlined",block:"",disabled:t.resourceCount===0},{default:e(()=>[l(" Explore "+a(t.name)+" resources ",1)]),_:2},1032,["disabled"])]),_:2},1024)]),_:2},1032,["disabled","onClick"])]),_:2},1024))),128))]),_:1})):w("",!0)]),_:1})}}};typeof k=="function"&&k(C);const Y=M(C,[["__scopeId","data-v-ca597155"]]);export{Y as default};