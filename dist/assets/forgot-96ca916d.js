import{A as N,j as L,r as d,y as j,a as o,o as m,c as z,w as s,b as e,M as A,e as v,g as p,s as M,d as y,f as x,p as T,h as U}from"./index-6b729fcd.js";import{u as D}from"./users-6c6e41da.js";import{b as w}from"./route-block-83d24a4e.js";import{_ as H}from"./_plugin-vue_export-helper-c27b6911.js";import"./apolloClient-3b54e56b.js";const k=l=>(T("data-v-4ed8ebfb"),l=l(),U(),l),F=k(()=>v("h3",{class:"mt-4 mr-11",style:{color:"#777777"}},"Request password reset",-1)),G={class:"d-flex justify-space-between mt-4"},J=k(()=>v("span",null," Home",-1)),K={key:0,class:"custom-alert"},O={key:1},S=N({__name:"forgot",setup(l){const $=D();L();const a=d(""),u=d(!1),i=d("");function V(r){const[t,n]=r.split("@");return!t||!n?r:t.length<=2?`${t[0]}*@${n}`:`${`${t[0]}${"*".repeat(t.length-2)}${t[t.length-1]}`}@${n}`}const c=d(""),R=j(()=>!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.value)),B=async()=>{if(a.value!==""){u.value=!0;try{await $.requestPasswordReset(a.value),c.value=`A password reset link was sent to ${V(a.value)}`,u.value=!1,a.value=""}catch{i.value="Check your credentials.",setTimeout(()=>{window.location.reload()},27e4)}}};return(r,t)=>{const n=o("v-img"),f=o("v-card-title"),C=o("v-text-field"),b=o("v-icon"),h=o("v-btn"),P=o("v-tooltip"),q=o("v-form"),E=o("v-card-text"),g=o("v-alert"),I=o("v-card");return m(),z(I,{class:"reset-card mt-4 ml-2",elevation:"4",outlined:"",rounded:""},{default:s(()=>[e(f,{class:"text-center"},{default:s(()=>[e(n,{style:{height:"12rem"},src:"https://a2z-v0.s3.eu-central-1.amazonaws.com/Screenshot+from+2024-10-22+16-31-16.png"}),F]),_:1}),e(E,null,{default:s(()=>[e(q,{onSubmit:A(B,["prevent"])},{default:s(()=>[e(C,{disabled:c.value!=="",color:"primary",modelValue:a.value,"onUpdate:modelValue":t[0]||(t[0]=_=>a.value=_),label:"Enter registration email address",required:"",autofocus:""},null,8,["disabled","modelValue"]),v("div",G,[e(h,{disabled:R.value,style:{width:"17rem"},type:"submit",color:"primary",loading:u.value},{default:s(()=>[e(b,{class:"mr-sm"},{default:s(()=>[p("mdi-location-enter")]),_:1}),p(" Submit password reset ")]),_:1},8,["disabled","loading"]),e(P,{location:"top"},{activator:s(({props:_})=>[e(h,M({class:"ml-xs",color:"primary",icon:"",height:"30",variant:"outlined"},_,{to:"/welcome"}),{default:s(()=>[e(b,null,{default:s(()=>[p("mdi-home-account")]),_:1})]),_:2},1040)]),default:s(()=>[J]),_:1})])]),_:1})]),_:1}),c.value?(m(),y("div",K,[e(g,{text:c.value,title:"Reset request sent!",type:"success",class:"custom-alert"},null,8,["text"])])):x("",!0),i.value?(m(),y("div",O,[e(g,{text:i.value,title:"Reset error",type:"error"},null,8,["text"])])):x("",!0)]),_:1})}}});typeof w=="function"&&w(S);const ee=H(S,[["__scopeId","data-v-4ed8ebfb"]]);export{ee as default};
