import{_ as ye}from"./style.css_vue_type_style_index_0_src_true_lang-b904ba3d.js";import{u as ge}from"./resources-c352f549.js";import{V as he}from"./vue3-pdf-app.umd-5c7002a6.js";import{j as ke,r as c,x as Z,l as Te,s as Se,a as m,o as u,c as D,w as n,b as e,u as b,f as r,g as y,e as i,t as d,d as _,v as I,y as B,p as we,h as be}from"./index-29b1d87f.js";import{T as xe}from"./TaskResponseFileUploader-09e529a5.js";import{a as Ee}from"./axios-78cd9fea.js";import{_ as te}from"./_plugin-vue_export-helper-c27b6911.js";import{b as ee}from"./route-block-83d24a4e.js";import"./apolloClient-3b54e56b.js";import"./_commonjsHelpers-de833af9.js";const g=M=>(we("data-v-2bbd8356"),M=M(),be(),M),De=g(()=>i("h3",null,"Assignment Task",-1)),Ie=g(()=>i("h3",null,"Answer Key",-1)),Me={class:"ma-1"},Re=g(()=>i("br",null,null,-1)),Ae={key:0},Ve={key:1},Ne={key:2},Ue={key:3},Ce={key:4},Oe=g(()=>i("span",null,"Grade submitted responses",-1)),ze=g(()=>i("span",null,"Go back to assignments",-1)),$e={class:"font-weight-black"},Pe={class:"ma-4"},Be={class:"text-overline ml-4"},Ke={key:0},Ge={key:1},Fe={key:2},Je={key:3},Le={key:4},He=g(()=>i("span",null,"Grade submitted responses",-1)),qe=g(()=>i("h6",null,"You can always overwrite existing response",-1)),Ye=g(()=>i("span",null,"You may submit both a typed and uploaded file. Refer to relevant instruction.",-1)),je=g(()=>i("span",null,"You may submit both a typed and uploaded file. Refer to relevant instruction..",-1)),We=g(()=>i("span",null,"Exit response editor",-1)),Xe={__name:"MyAssignment",setup(M){const K=ke(),G="https://nem.bio:4000",k=ge().resource,U=c(!1),V=c("Wipe and type your response ..."),C=c(!1),R=c(!1),S=c(localStorage.getItem("sessionId")),ne=c(k.sessionId);c(0);const O=c(null),F=c(null),oe=()=>{K.push("tasks")},J=c(!1),z=c(null),{assignmentMetaInfo:ae,assignmentAnswersKey:le,assignmentTaskSet:ie}=JSON.parse(k.content),A=JSON.parse(ae),f=c({assignmentType:A.assignmentType,assignmentTitle:A.assignmentTitle,assignmentDescription:A.assignmentDescription,assignmentDuration:A.assignmentDuration,assignmentDeadline:A.assignmentDeadline,assignmentAnswersKey:JSON.parse(le)[0],assignmentTaskSet:JSON.parse(ie)[0]}),L=c(0),H=[l=>l.length<=5e3||"Maximum 5000 characters allowed."];function x(l,s){const v=JSON.parse(l).find(a=>a.userId===s);return v&&v.resourceResponses?v.resourceResponses.some(a=>!!a.questionResponse):!1}const ue=Z(()=>H.every(l=>l(V.value)===!0));function q(l){const s=l.match(/GMT([+-]\d+)/);let h=0;s&&s[1]&&(h=parseInt(s[1],10),L.value=h);const v=l.replace(/(Friday|Saturday|Sunday|Monday|Tuesday|Wednesday|Thursday),?\s*/,"").replace(/ at /," ").replace(/GMT/,"GMT"),a=new Date(v);if(isNaN(a.getTime()))return null;const p=a.getTime(),T=h*60*60*1e3;return p-T}const re=f.value.assignmentDeadline;q(re);const Y=q(f.value.assignmentDeadline);Z(()=>Y>Date.now());const t=c({days:0,hours:0,minutes:0,seconds:0}),j=()=>{const l=Date.now(),s=Y-l+1e3*60*60*L.value;s>0?t.value={days:Math.floor(s/(1e3*60*60*24)),hours:Math.floor(s/(1e3*60*60)%24),minutes:Math.floor(s/(1e3*60)%60),seconds:Math.floor(s/1e3%60)}:t.value={days:0,hours:0,minutes:0,seconds:0}};let W;Te(()=>{j(),W=setInterval(j,1e3),$(f.value.assignmentTaskSet)}),Se(()=>{clearInterval(W)});const $=l=>{z.value=l},de=l=>{alert("Error loading PDF. Please try again later.",l)};async function ce(){J.value=!0;const l=JSON.stringify({questionType:"TASK_TEXT",questionResponse:V.value,savedDate:Date.now()}),s=`${G}/resources/uploads/task/response?userId=${encodeURIComponent(S.value)}&sessionId=${encodeURIComponent(ne.value)}`;try{await Ee.post(s,l,{headers:{"Content-Type":"application/json"}})&&(O.value="Task response saved successfully",J.value=!1,setTimeout(()=>{window.location.href="tasks"},6300))}catch{errorMessage.value="Error updating task:"}}return(l,s)=>{const h=m("v-col"),v=m("v-divider"),a=m("v-spacer"),p=m("v-btn"),T=m("v-card-actions"),E=m("v-tooltip"),pe=m("v-row"),me=m("v-card-text"),ve=m("v-card-title"),N=m("v-card"),P=m("v-dialog"),X=m("v-alert"),_e=ye,fe=m("v-container");return u(),D(fe,null,{default:n(()=>[e(pe,null,{default:n(()=>[z.value?(u(),D(h,{key:0,cols:"10",class:"pdf-container"},{default:n(()=>[e(b(he),{class:"pdf-viewer",pdf:z.value,zoom:130,onOpen:l.openHandler,onError:de},null,8,["pdf","onOpen"])]),_:1})):r("",!0),e(h,{cols:"2"},{default:n(()=>[De,e(v),e(T,null,{default:n(()=>[e(a),e(p,{size:"small",variant:"outlined",class:"action-button",onClick:s[0]||(s[0]=o=>$(f.value.assignmentTaskSet)),color:"primary"},{default:n(()=>[y(" View Task PDF ")]),_:1}),e(a)]),_:1}),Ie,e(T,null,{default:n(()=>[e(a),e(p,{disabled:t.value.days>0||t.value.hours>0||t.value.minutes>0||t.value.seconds>0,onClick:s[1]||(s[1]=o=>$(f.value.assignmentAnswersKey)),color:"primary"},{default:n(()=>[y(" View Answer Key ")]),_:1},8,["disabled"]),e(a)]),_:1}),i("p",null,"Type: "+d(f.value.assignmentType),1),i("div",Me,[i("p",null,"Deadline: "+d(f.value.assignmentDeadline),1),i("p",null,[y(" Answer reveals in:"),Re,i("strong",null,[t.value.days>0?(u(),_("span",Ae,d(t.value.days)+"d ",1)):r("",!0),t.value.hours>0?(u(),_("span",Ve,d(t.value.hours)+"h ",1)):r("",!0),t.value.minutes>0?(u(),_("span",Ne,d(t.value.minutes)+"m ",1)):r("",!0),t.value.seconds>0?(u(),_("span",Ue,d(t.value.seconds)+"s",1)):r("",!0),t.value.days>0||t.value.hours>0||t.value.minutes>0||t.value.seconds>0?r("",!0):(u(),_("span",Ce,"Lapsed"))])])]),e(v),e(T,null,{default:n(()=>[e(a),e(p,{class:"ms-2",size:"small","prepend-icon":x(b(k).participants,S.value)?"mdi-clipboard-text-clock-outline":"mdi-file-edit-outline",color:x(b(k).participants,S.value)?"orange":"success",disabled:!(t.value.days>0||t.value.hours>0||t.value.minutes>0||t.value.seconds>0),text:x(b(k).participants,S.value)?"RE-SUBMIT TASK RESPONSE":"SUBMIT TASK RESPONSE",variant:"outlined",onClick:s[2]||(s[2]=o=>R.value=!0)},null,8,["prepend-icon","color","disabled","text"]),e(a)]),_:1}),e(v),e(T,null,{default:n(()=>[e(a),e(p,{onClick:s[3]||(s[3]=o=>U.value=!0),color:"primary",size:"small"},{default:n(()=>[y(" View task details ")]),_:1}),e(a),y(),e(a),e(E,{location:"top"},{activator:n(({props:o})=>[t.value.days>0||t.value.hours>0||t.value.minutes>0||t.value.seconds>0?r("",!0):(u(),D(p,I({key:0},o,{color:"red",icon:"mdi-note-check-outline",size:"large",onClick:s[4]||(s[4]=w=>l.showExamGrader=!0)}),null,16))]),default:n(()=>[Oe]),_:1}),e(E,{location:"top"},{activator:n(({props:o})=>[e(p,I(o,{size:"medium",class:"mb-0",variant:"outlined",icon:"mdi-arrow-left",onClick:oe,color:"info"}),null,16)]),default:n(()=>[ze]),_:1})]),_:1})]),_:1})]),_:1}),e(P,{modelValue:U.value,"onUpdate:modelValue":s[7]||(s[7]=o=>U.value=o),width:"630"},{default:n(()=>[e(N,{class:"mx-auto","prepend-icon":"mdi-note-edit-outline",width:"630"},{title:n(()=>[i("span",$e,d(f.value.assignmentTitle),1)]),default:n(()=>[e(me,{class:"bg-surface-light pt-4"},{default:n(()=>[y(d(f.value.assignmentDescription),1)]),_:1}),e(v),i("div",Pe,[i("p",Be," Deadline: "+d(f.value.assignmentDeadline),1),e(ve,{color:"grey"},{default:n(()=>[y(" Answer reveals in: "),i("strong",null,[t.value.days>0?(u(),_("span",Ke,d(t.value.days)+"d ",1)):r("",!0),t.value.hours>0?(u(),_("span",Ge,d(t.value.hours)+"h ",1)):r("",!0),t.value.minutes>0?(u(),_("span",Fe,d(t.value.minutes)+"m ",1)):r("",!0),t.value.seconds>0?(u(),_("span",Je,d(t.value.seconds)+"s",1)):r("",!0),t.value.days>0||t.value.hours>0||t.value.minutes>0||t.value.seconds>0?r("",!0):(u(),_("span",Le,"Lapsed"))])]),_:1})]),e(v),e(T,null,{default:n(()=>[e(a),e(E,{location:"top"},{activator:n(({props:o})=>[t.value.days>0||t.value.hours>0||t.value.minutes>0||t.value.seconds>0?r("",!0):(u(),D(p,I({key:0},o,{color:"red",icon:"mdi-note-check-outline",size:"large",onClick:s[5]||(s[5]=w=>l.showExamGrader=!0)}),null,16))]),default:n(()=>[He]),_:1}),e(p,{class:"ms-2",size:"small","prepend-icon":x(b(k).participants,S.value)?"mdi-clipboard-text-clock-outline":"mdi-file-edit-outline",color:x(b(k).participants,S.value)?"orange":"success",disabled:!(t.value.days>0||t.value.hours>0||t.value.minutes>0||t.value.seconds>0),text:x(b(k).participants,S.value)?"RE-SUBMIT TASK RESPONSE":"SUBMIT TASK RESPONSE",variant:"outlined",onClick:s[6]||(s[6]=o=>R.value=!0)},null,8,["prepend-icon","color","disabled","text"]),e(a)]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(P,{modelValue:R.value,"onUpdate:modelValue":s[13]||(s[13]=o=>R.value=o),"max-width":"85%",persistent:""},{default:n(()=>[e(N,{flat:"",style:{"z-index":"99999 !important"}},{default:n(()=>[F.value?(u(),D(X,{key:0,border:"top",type:"warning",variant:"outlined",prominent:"",class:"ma-4",style:{"z-index":"99999 !important"}},{default:n(()=>[y(d(F.value),1)]),_:1})):r("",!0),O.value?(u(),D(X,{key:1,border:"top",type:"success",class:"ma-4",style:{"z-index":"99999 !important"},variant:"outlined",prominent:""},{default:n(()=>[i("h4",null,d(O.value),1),qe]),_:1})):r("",!0)]),_:1}),e(N,null,{default:n(()=>[e(_e,{counter:"",modelValue:V.value,"onUpdate:modelValue":s[8]||(s[8]=o=>V.value=o),rules:H},null,8,["modelValue"]),e(v),e(T,null,{default:n(()=>[e(a),e(E,{location:"top"},{activator:n(({on:o,attrs:w})=>[e(p,I(w,B(o),{width:"18rem",color:"#022568",variant:"outlined","prepend-icon":"mdi-cloud-upload-outline",onClick:s[9]||(s[9]=Q=>C.value=!0)}),{default:n(()=>[y(" UPLOAD A FILE RESPONSE ")]),_:2},1040)]),default:n(()=>[Ye]),_:1}),e(a),e(E,{location:"top"},{activator:n(({on:o,attrs:w})=>[e(p,I(w,B(o),{width:"18rem",color:"#05909f",variant:"outlined","prepend-icon":"mdi-text-box-edit-outline",onClick:s[10]||(s[10]=Q=>ce()),disabled:!ue.value}),{default:n(()=>[y(" SAVE ASSIGNMENT RESPONSE ")]),_:2},1040,["disabled"])]),default:n(()=>[je]),_:1}),e(a),e(E,{location:"top"},{activator:n(({on:o,attrs:w})=>[e(p,I(w,B(o),{color:"error",icon:"mdi-location-exit",size:"x-large",onClick:s[11]||(s[11]=Q=>R.value=!1)}),null,16)]),default:n(()=>[We]),_:1})]),_:1})]),_:1}),e(P,{modelValue:C.value,"onUpdate:modelValue":s[12]||(s[12]=o=>C.value=o),"max-width":"27%"},{default:n(()=>[e(N,{height:"13.5rem"},{default:n(()=>[e(xe)]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["modelValue"])]),_:1})}}},Qe=te(Xe,[["__scopeId","data-v-2bbd8356"]]);const se={__name:"index",setup(M){return(K,G)=>(u(),_("div",null,[e(Qe)]))}};typeof ee=="function"&&ee(se);const dt=te(se,[["__scopeId","data-v-06a35893"]]);export{dt as default};
