import{V as F,A as G,_ as q,D as H,a as Q,S as z,P as W,b as X,J as Y,c as Z,d as ee}from"./ModelPlayer-015f1fbc.js";import{_ as te}from"./TestPlayer-01003adc.js";import{_ as oe}from"./EventPlayer-29398210.js";import{P as le}from"./PollPlayerParticipant-4c65d471.js";import{T as ae}from"./AssignmentTaskPlayer-7c90886e.js";import{u as se}from"./resources-e1807ce6.js";import{A as ne,r as u,y as x,l as re,m as ce,q as ue,a as r,o as m,c as f,w as o,b as e,u as ie,f as D,D as me,d as C,n as de,F as _e,g as O,t as T}from"./index-6b729fcd.js";import{b as I}from"./route-block-83d24a4e.js";import{_ as pe}from"./_plugin-vue_export-helper-c27b6911.js";import"./_commonjsHelpers-de833af9.js";import"./___vite-browser-external_commonjs-proxy-698e55bb.js";import"./axios-78cd9fea.js";import"./timezoneConverter-e392b03d.js";import"./style.css_vue_type_style_index_0_src_true_lang-92238eb5.js";import"./vue3-pdf-app.umd-2f762628.js";import"./answers-4911ad33.js";import"./PollPlayerAnalysis-3395ca3e.js";import"./chart-d498817c.js";import"./TaskResponseFileUploader-20e7f299.js";import"./apolloClient-3b54e56b.js";const fe=ne({__name:"PostersPlayersHandler",setup(N){const i=se(),a={AUDIO:"AUDIO",VIDEO:"VIDEO",IMAGES:"IMAGES",DOCUMENT:"DOCUMENT",PRESENTATION:"PRESENTATION",EVENT:"EVENT",DATASET:"DATASET",LINK:"LINK",POLL:"POLL",TEST:"TEST",POSTER:"POSTER",ARTICLE:"ARTICLE",JOB:"JOB",TASK:"TASK",MODEL:"MODEL"},L=u(["Title","Date Created","Subject"]),R=u(["Biostatistics","Probability Theory"]),y=u(""),d=u(""),v=u(""),_=u({}),E=u(!1),M=(l,t)=>l?l.length>t?l.substring(0,t)+"...":l:"",w=x(()=>{let l=i.resources.filter(t=>{const c=t.title?t.title.toLowerCase().includes(y.value.toLowerCase()):!1,n=!v.value||t.subject===v.value;return c&&n});return d.value==="Title"?l=l.sort((t,c)=>t.title.localeCompare(c.title)):d.value==="Date Created"?l=l.sort((t,c)=>new Date(c.createdAt).getTime()-new Date(t.createdAt).getTime()):d.value==="Subject"&&(l=l.sort((t,c)=>t.subject.localeCompare(c.subject))),l}),g=async l=>{E.value=!1,await i.fetchResource(l.id),_.value=i.resource,E.value=!0},A=x(()=>_.value?{[a.VIDEO]:F,[a.AUDIO]:G,[a.IMAGES]:q,[a.DATASET]:H,[a.DOCUMENT]:Q,[a.PRESENTATION]:z,[a.TEST]:te,[a.POSTER]:W,[a.EVENT]:oe,[a.ARTICLE]:X,[a.POLL]:le,[a.JOB]:Y,[a.TASK]:ae,[a.LINK]:Z,[a.MODEL]:ee}[_.value.contentType]:null),S=u(0),k=u(i.resources),U=()=>{S.value=(S.value+1)%(k.value.length||1)};return re(()=>{const l=setInterval(U,15e3);ce(()=>{clearInterval(l)})}),ue(async()=>{const l=[{resourceType:"POSTER",subject:"",topic:"",country:"",targetRegion:"",language:""}];await i.getAllSpecificTypeResources(JSON.stringify(l)),g(i.resources[S.value])}),(l,t)=>{const c=r("v-select"),n=r("v-col"),B=r("v-text-field"),p=r("v-row"),j=r("v-divider"),b=r("v-img"),P=r("v-card"),h=r("v-container"),$=r("v-card-title"),J=r("v-card-subtitle"),K=r("v-card-text");return m(),f(h,null,{default:o(()=>[e(p,null,{default:o(()=>[e(n,{cols:"12"},{default:o(()=>[e(p,{align:"center"},{default:o(()=>[e(n,{cols:"4"},{default:o(()=>[e(c,{modelValue:d.value,"onUpdate:modelValue":t[0]||(t[0]=s=>d.value=s),items:L.value,label:"Sort by",dense:"",style:{"max-height":"67%"}},null,8,["modelValue","items"])]),_:1}),e(n,{cols:"4"},{default:o(()=>[e(c,{modelValue:v.value,"onUpdate:modelValue":t[1]||(t[1]=s=>v.value=s),items:R.value,label:"Filter by",dense:"",style:{"max-height":"67%"}},null,8,["modelValue","items"])]),_:1}),e(n,{cols:"4"},{default:o(()=>[e(B,{modelValue:y.value,"onUpdate:modelValue":t[2]||(t[2]=s=>y.value=s),label:"Search",clearable:"",dense:"","prepend-inner-icon":"mdi-file-search",style:{"max-height":"67%"}},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),e(j,{class:"mb-2"}),e(p,null,{default:o(()=>[e(n,{cols:"10"},{default:o(()=>[A.value?D("",!0):(m(),f(P,{key:0,fluid:"",onClick:t[3]||(t[3]=s=>g(ie(i).resources[0])),height:"63vh",style:{display:"flex","align-items":"center","justify-content":"center",cursor:"pointer","border-radius":"5px 5px 0px 0px !important"}},{default:o(()=>[e(b,{height:"21vh",class:"mt-24 ma-4",style:{cursor:"pointer"},src:"https://cdn-icons-png.flaticon.com/512/907/907805.png"})]),_:1})),_.value&&E.value?(m(),f(h,{key:1,fluid:""},{default:o(()=>[(m(),f(me(A.value),{resource:_.value},null,8,["resource"]))]),_:1})):D("",!0)]),_:1}),e(n,{cols:"2",class:"pr-2"},{default:o(()=>[e(p,{class:"overflow-y-auto mt-1",style:{height:"400px","max-height":"400px","overflow-y":"auto"}},{default:o(()=>[(m(!0),C(_e,null,de(w.value,(s,ve)=>(m(),f(n,{key:s.id,class:"pa-0"},{default:o(()=>[e(P,{fluid:"",class:"mb-2",height:"4.5rem",onClick:Te=>g(s)},{default:o(()=>[e(p,{"no-gutters":""},{default:o(()=>[e(n,{cols:"4"},{default:o(()=>[e(b,{height:"4.5rem",src:s.coverImage},null,8,["src"])]),_:2},1024),e(n,{cols:"8"},{default:o(()=>[e($,null,{default:o(()=>[O(T(s.title),1)]),_:2},1024),e(J,null,{default:o(()=>[O(T(s.subject)+" - "+T(s.topic),1)]),_:2},1024),e(K,null,{default:o(()=>[O(T(M(s.description,50)),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1032,["onClick"])]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})}}});const V={__name:"index",setup(N){return(i,a)=>(m(),C("div",null,[e(fe)]))}};typeof I=="function"&&I(V);const Ue=pe(V,[["__scopeId","data-v-c30c76b4"]]);export{Ue as default};
