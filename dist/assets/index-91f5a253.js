import{u as ee}from"./resources-c352f549.js";import{s as te}from"./staticResources-a247f3d6.js";import{q as oe,j as le,r as d,k as f,x as $,z as se,a as n,o as y,c as h,w as a,f as ae,b as l,d as ne,n as ce,F as de,g as v,p as ue,h as re,e as p,t as i}from"./index-29b1d87f.js";import{t as S,w as T}from"./topics-a056943b.js";import{b as D}from"./route-block-83d24a4e.js";import{_ as ie}from"./_plugin-vue_export-helper-c27b6911.js";import"./apolloClient-3b54e56b.js";const b=g=>(ue("data-v-0af9fa75"),g=g(),re(),g),pe={class:"resource-icon"},me={class:"resource-name"},ve=b(()=>p("h3",{color:"#b5b1b2",class:"text-h10 mb-4 ml-44 mt-2"}," Specify the resources to get started. The input values are optional. ",-1)),ge=b(()=>p("br",null,null,-1)),_e=b(()=>p("br",null,null,-1)),fe=b(()=>p("br",null,null,-1)),E=oe({__name:"index",setup(g){const{resourceType:ye,staticResources:R}=te;console.log({staticResourcesTypes:R.value});const F=le(),P=d(Object.keys(S)),_=d(!1),m=d(!1),o=d({selectedSubject:"",selectedTopicConcept:"",selectedTopic:"",selectedTargetRegion:"",selectedCountry:"",selectedLanguage:""}),x=d([]),C=d([]),w=d([]),V=d([]);f(()=>o.value.selectedSubject,e=>{o.value.selectedTopicConcept="",o.value.selectedTopic="",x.value=e?A(e,S):[]}),f(()=>o.value.selectedTopicConcept,e=>{o.value.selectedTopic="",C.value=e?J(o.value.selectedSubject,e,S):[]}),f(()=>o.value.selectedTopic,e=>{}),f(()=>o.value.selectedTargetRegion,e=>{o.value.selectedCountry="",o.value.selectedLanguage="",w.value=e?q(e):[],V.value=e?z(e):[]});function A(e,t){if(!t.hasOwnProperty(e))throw new Error(`Subject ${e} not found in schema.`);return Object.keys(t[e])}function J(e,t,c){if(!c.hasOwnProperty(e))throw new Error(`Subject "${e}" not found in schema.`);if(!c[e].hasOwnProperty(t))throw new Error(`Concept "${t}" not found in subject "${e}".`);return c[e][t]}function q(e){const t=T[e];return t?t.countries:void 0}function z(e){const t=T[e];return t?t.languages.map(c=>c.name):void 0}const G=$(()=>Object.keys(T).filter(e=>e==="Global"||e.includes("Africa"))),k=ee(),M=$(()=>R.value.map(e=>{const t=k.resources.filter(c=>c.contentType===e.type);return{...e,resourceCount:t.length}}));function L(e){const t=[{resourceType:e.type,selectedSubject:o.value.selectedSubject,selectedTopicConcept:o.value.selectedTopicConcept,selectedTopic:o.value.selectedTopic,selectedTargetRegion:o.value.selectedTargetRegion,selectedCountry:o.value.selectedCountry,selectedLanguage:o.value.selectedLanguage}];localStorage.setItem("queryParams",JSON.stringify(t)),F.push("/dashboard/player"),m.value=!1}function W(){_.value=!1,m.value=!0;let e=localStorage.getItem("targetResource");e=JSON.parse(e)[0],L(e)}function H(e){let t=[e];t=JSON.stringify(t),localStorage.setItem("targetResource",t),_.value=!0}return se(()=>{k.getAllResources()}),(e,t)=>{const c=n("v-progress-linear"),j=n("v-card-text"),K=n("v-card-title"),O=n("v-divider"),B=n("v-btn"),I=n("v-card-actions"),N=n("v-card"),u=n("v-col"),U=n("v-row"),r=n("v-select"),Q=n("v-dialog"),X=n("v-container");return y(),h(X,{class:"my-5"},{default:a(()=>[m.value?(y(),h(c,{key:0,color:"#212121",indeterminate:""})):ae("",!0),l(U,null,{default:a(()=>[(y(!0),ne(de,null,ce(M.value,(s,Y)=>(y(),h(u,{key:Y,cols:"12",md:"6",lg:"4",xl:"4"},{default:a(()=>[l(N,{class:"mx-auto my-3 resource-card","max-width":"540",height:"13.5rem",disabled:s.resourceCount===0,outlined:""},{default:a(()=>[l(K,{style:{cursor:"pointer"},disabled:m.value,onClick:Z=>H(s),color:"#08487f",class:"d-flex align-center justify-space-between"},{default:a(()=>[p("span",pe,i(s.icon),1),p("span",me,[v(i(s.name)+" ("+i(s.resourceCount)+") ",1),l(j,{class:"text-h11"},{default:a(()=>[v(i(s.type),1)]),_:2},1024)])]),_:2},1032,["disabled","onClick"]),l(O),l(j,{class:"resource-description text-h7 py-2"},{default:a(()=>[v(i(s.description),1)]),_:2},1024),l(I,{class:"fixed-actions mb-1"},{default:a(()=>[l(B,{"append-icon":"mdi-chevron-right",color:"#08487f",variant:"outlined",block:"",onClick:Z=>L(s),disabled:!m.value},{default:a(()=>[v(" Explore "+i(s.name)+" resources ",1)]),_:2},1032,["onClick","disabled"])]),_:2},1024)]),_:2},1032,["disabled"])]),_:2},1024))),128))]),_:1}),l(Q,{width:"87%",modelValue:_.value,"onUpdate:modelValue":t[6]||(t[6]=s=>_.value=s),style:{overflow:"hidden"}},{default:a(()=>[l(N,{flat:"",height:"13.5rem",class:"ma-4",style:{padding:"0"}},{default:a(()=>[ve,l(O),ge,l(U,{"no-gutters":""},{default:a(()=>[l(u,{cols:"2",style:{padding:"0 8px"}},{default:a(()=>[l(r,{modelValue:o.value.selectedSubject,"onUpdate:modelValue":t[0]||(t[0]=s=>o.value.selectedSubject=s),items:P.value,label:"Subject",dense:"",outlined:"",hint:"What do you want to study?","hide-details":""},null,8,["modelValue","items"])]),_:1}),l(u,{cols:"2",style:{padding:"0 8px"}},{default:a(()=>[l(r,{modelValue:o.value.selectedTopicConcept,"onUpdate:modelValue":t[1]||(t[1]=s=>o.value.selectedTopicConcept=s),items:x.value,label:"Resource Level",hint:"Resource Level",dense:"",outlined:"","hide-details":""},null,8,["modelValue","items"])]),_:1}),l(u,{cols:"2",style:{padding:"0 8px"}},{default:a(()=>[l(r,{modelValue:o.value.selectedTopic,"onUpdate:modelValue":t[2]||(t[2]=s=>o.value.selectedTopic=s),items:C.value,label:"Topic to study",hint:"Topic to study",dense:"",outlined:"","hide-details":""},null,8,["modelValue","items"])]),_:1}),l(u,{cols:"2",style:{padding:"0 8px"}},{default:a(()=>[l(r,{modelValue:o.value.selectedTargetRegion,"onUpdate:modelValue":t[3]||(t[3]=s=>o.value.selectedTargetRegion=s),items:G.value,label:"Resource target Region",hint:"Resource target Region",dense:"",outlined:"","hide-details":""},null,8,["modelValue","items"])]),_:1}),l(u,{cols:"2",style:{padding:"0 8px"}},{default:a(()=>[l(r,{modelValue:o.value.selectedCountry,"onUpdate:modelValue":t[4]||(t[4]=s=>o.value.selectedCountry=s),items:w.value,label:"Select country",hint:"Resource target country",dense:"",outlined:"","hide-details":""},null,8,["modelValue","items"])]),_:1}),l(u,{cols:"2",style:{padding:"0 8px"}},{default:a(()=>[l(r,{modelValue:o.value.selectedLanguage,"onUpdate:modelValue":t[5]||(t[5]=s=>o.value.selectedLanguage=s),items:V.value,label:"Language",hint:"Resource Language",dense:"",outlined:"","hide-details":""},null,8,["modelValue","items"])]),_:1})]),_:1}),_e,fe,l(I,{class:"fixed-actions mb-1"},{default:a(()=>[l(B,{"append-icon":"mdi-chevron-right",color:"#08487f",variant:"outlined",block:"",onClick:W},{default:a(()=>[v(" Save selections and get resources ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}}});typeof D=="function"&&D(E);const we=ie(E,[["__scopeId","data-v-0af9fa75"]]);export{we as default};
