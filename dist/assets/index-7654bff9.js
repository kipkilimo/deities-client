import{_ as q}from"./EventPlayer-29398210.js";import{u as H}from"./resources-e1807ce6.js";import{A as J,r as i,y as Q,q as z,l as G,a,o as u,c as p,w as o,b as e,u as x,f as k,d as P,n as K,F as W,g as b,t as f}from"./index-6b729fcd.js";import{_ as j}from"./_plugin-vue_export-helper-c27b6911.js";import{b as T}from"./route-block-83d24a4e.js";import"./apolloClient-3b54e56b.js";const X=J({__name:"EventPlayerHandler",setup(R){const c=H(),v=c.resource.content,w=(v?JSON.parse(v):[])[0],N=i(["Title","Date Created","Subject"]),O=i(["Biostatistics","Probability Theory"]),y=i(""),d=i(""),m=i(""),A=i({}),g=i(!1),B=(s,t)=>s?s.length>t?s.substring(0,t)+"...":s:"",D=Q(()=>{let s=c.resources.filter(t=>{const r=t.title?t.title.toLowerCase().includes(y.value.toLowerCase()):!1,n=!m.value||t.subject===m.value;return r&&n});return d.value==="Title"?s=s.sort((t,r)=>t.title.localeCompare(r.title)):d.value==="Date Created"?s=s.sort((t,r)=>new Date(r.createdAt).getTime()-new Date(t.createdAt).getTime()):d.value==="Subject"&&(s=s.sort((t,r)=>t.subject.localeCompare(r.subject))),s}),h=async s=>{g.value=!1,await c.fetchResource(s.id),A.value=c.resource,g.value=!0};return z(async()=>{const s=[{resourceType:"EVENT",subject:"",topic:"",country:"",targetRegion:"",language:""}];await c.getAllSpecificTypeResources(JSON.stringify(s)),h(c.resources[0])}),G(()=>{}),(s,t)=>{const r=a("v-select"),n=a("v-col"),F=a("v-text-field"),_=a("v-row"),I=a("v-divider"),C=a("v-img"),V=a("v-card"),L=q,S=a("v-container"),M=a("v-card-title"),U=a("v-card-subtitle"),$=a("v-card-text");return u(),p(S,{style:{"font-family":'"Inter", "Noto Sans", sans-serif'},fluid:""},{default:o(()=>[e(_,null,{default:o(()=>[e(n,{cols:"12"},{default:o(()=>[e(_,{align:"center"},{default:o(()=>[e(n,{cols:"12",md:"4"},{default:o(()=>[e(r,{modelValue:d.value,"onUpdate:modelValue":t[0]||(t[0]=l=>d.value=l),items:N.value,label:"Sort by",dense:"",style:{"max-height":"67%"}},null,8,["modelValue","items"])]),_:1}),e(n,{cols:"12",md:"4"},{default:o(()=>[e(r,{modelValue:m.value,"onUpdate:modelValue":t[1]||(t[1]=l=>m.value=l),items:O.value,label:"Filter by",dense:"",style:{"max-height":"67%"}},null,8,["modelValue","items"])]),_:1}),e(n,{cols:"12",md:"4"},{default:o(()=>[e(F,{modelValue:y.value,"onUpdate:modelValue":t[2]||(t[2]=l=>y.value=l),label:"Search",clearable:"",dense:"","prepend-inner-icon":"mdi-file-search",style:{"max-height":"67%"}},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),e(I,{class:"mb-2"}),e(_,null,{default:o(()=>[e(n,{cols:"12",md:"10"},{default:o(()=>[x(w)?k("",!0):(u(),p(V,{key:0,fluid:"",onClick:t[3]||(t[3]=l=>h(x(c).resources[0])),height:"63vh",style:{display:"flex","align-items":"center","justify-content":"center",cursor:"pointer","border-radius":"5px 5px 0px 0px !important"}},{default:o(()=>[e(C,{height:"21vh",class:"mt-24 ma-4",style:{cursor:"pointer"},src:"https://cdn-icons-png.flaticon.com/512/907/907805.png"})]),_:1})),x(w)&&g.value?(u(),p(S,{key:1,fluid:""},{default:o(()=>[e(L)]),_:1})):k("",!0)]),_:1}),e(n,{cols:"12",md:"2"},{default:o(()=>[e(_,{class:"overflow-y-auto mt-1",style:{height:"400px","max-height":"400px"}},{default:o(()=>[(u(!0),P(W,null,K(D.value,(l,ee)=>(u(),p(n,{key:l.id,class:"pa-0"},{default:o(()=>[e(V,{fluid:"",class:"mb-2",height:"4.5rem",onClick:te=>h(l)},{default:o(()=>[e(_,{"no-gutters":""},{default:o(()=>[e(n,{cols:"4"},{default:o(()=>[e(C,{height:"4.5rem",src:l.coverImage},null,8,["src"])]),_:2},1024),e(n,{cols:"8"},{default:o(()=>[e(M,{style:{"font-weight":"700"}},{default:o(()=>[b(f(l.title),1)]),_:2},1024),e(U,{style:{"font-weight":"400"}},{default:o(()=>[b(f(l.subject)+" - "+f(l.topic),1)]),_:2},1024),e($,{style:{"font-weight":"400"}},{default:o(()=>[b(f(B(l.description,50)),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1032,["onClick"])]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})}}});const Y=j(X,[["__scopeId","data-v-1c242e65"]]);const E={__name:"index",setup(R){return(c,v)=>(u(),P("div",null,[e(Y)]))}};typeof T=="function"&&T(E);const ce=j(E,[["__scopeId","data-v-270dc600"]]);export{ce as default};
