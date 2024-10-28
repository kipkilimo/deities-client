import{g as B,c as E}from"./apolloClient-3b54e56b.js";import{C as z,L as A,a as V,b as j,p as I}from"./chart-d498817c.js";import D from"./ChartLines-605bf59e.js";import{b as C}from"./route-block-83d24a4e.js";import{_ as M}from"./_plugin-vue_export-helper-c27b6911.js";import{r as x,l as P,a as i,o as v,c as g,w as t,f as y,g as w,t as n,d as F,b as e,e as a,p as U,h as G}from"./index-29b1d87f.js";const m=_=>(U("data-v-27c2c8b9"),_=_(),G(),_),O={key:2},Q=m(()=>a("div",{class:"text-h6 mb-6"},"Audio / Podcasts",-1)),Y={class:"text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"},H=m(()=>a("div",{class:"text-h6 mb-6"}," Video / Screencast Recordings ",-1)),J={class:"text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"},K=m(()=>a("div",{class:"text-h6 mb-6"},"Photo Galleries",-1)),W={class:"text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"},X=m(()=>a("div",{class:"text-h6 mb-6"},"Blog Articles",-1)),Z={class:"text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"},$=m(()=>a("div",{class:"text-h6 mb-6"},"Most Liked Resource",-1)),ee={class:"text-h4 font-weight-black mb-1"},te=m(()=>a("div",{class:"text-h6 mb-6"},"Most Requested Resource",-1)),se={class:"text-h4 font-weight-black mb-1"},R={__name:"index",setup(_){z.register(A,V,j,I);const f=x(!1),h=x(null),o=x(null),k=B`
  query ResourceTrends {
    fetchResourceSummaryByRoleAndType {
      audioCount
      videoCount
      imagesCount
      documentCount
      presentationCount
      eventCount
      datasetCount
      linkCount
      pollCount
      testCount
      modelCount
      posterCount
      articleCount
      jobCount
      taskCount
      mostLikedResource {
        title
        likesNumber
      }
      mostRequestedResource {
        title
        viewsNumber
      }
      mostCreatedResource {
        title
        createdAt
      }
      publicationTrends {
        month
        count
      }
    }
  }
`;async function S(){try{f.value=!0;const{data:p}=await E.query({query:k});if(p){const b=p.fetchResourceSummaryByRoleAndType;o.value=b[0]}else h.value="Failed to fetch resources summaries"}catch{h.value="Failed to fetch resources summaries"}finally{f.value=!1}}return P(()=>{S()}),(p,b)=>{const L=i("v-progress-linear"),N=i("v-alert"),l=i("v-card-text"),d=i("v-divider"),s=i("v-col"),r=i("v-icon"),c=i("v-row"),u=i("v-card"),q=i("v-card-title"),T=i("v-container");return v(),g(T,null,{default:t(()=>[f.value?(v(),g(L,{key:0,color:"teal",indeterminate:""})):y("",!0),h.value?(v(),g(N,{key:1,border:"top",type:"warning",variant:"outlined",prominent:""},{default:t(()=>[w(n(h.value),1)]),_:1})):y("",!0),!f.value&&o.value?(v(),F("div",O,[e(c,null,{default:t(()=>[e(s,{cols:"12",md:"4"},{default:t(()=>[e(u,{class:"mx-auto","max-width":"500"},{default:t(()=>[e(l,{class:"text-medium-emphasis pa-6"},{default:t(()=>[Q]),_:1}),e(d),e(l,{class:"py-0"},{default:t(()=>[e(c,{align:"center","no-gutters":""},{default:t(()=>[e(s,{class:"d-flex align-center justify-center text-h2",cols:"9"},{default:t(()=>[a("div",Y,n(o.value.audioCount),1)]),_:1}),e(s,{class:"text-right",cols:"2"},{default:t(()=>[e(r,{color:"info",icon:"mdi-music-box-multiple",size:"48"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(s,{cols:"12",md:"4"},{default:t(()=>[e(u,{class:"mx-auto","max-width":"500"},{default:t(()=>[e(l,{class:"text-medium-emphasis pa-6"},{default:t(()=>[H]),_:1}),e(d),e(l,{class:"py-0"},{default:t(()=>[e(c,{align:"center","no-gutters":""},{default:t(()=>[e(s,{class:"d-flex align-center justify-center text-h2",cols:"9"},{default:t(()=>[a("div",J,n(o.value.videoCount),1)]),_:1}),e(s,{class:"text-right",cols:"2"},{default:t(()=>[e(r,{color:"info",icon:"mdi-file-video-outline",size:"48"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(s,{cols:"12",md:"4"},{default:t(()=>[e(u,{class:"mx-auto","max-width":"500"},{default:t(()=>[e(l,{class:"text-medium-emphasis pa-6"},{default:t(()=>[K]),_:1}),e(d),e(l,{class:"py-0"},{default:t(()=>[e(c,{align:"center","no-gutters":""},{default:t(()=>[e(s,{class:"d-flex align-center justify-center text-h2",cols:"9"},{default:t(()=>[a("div",W,n(o.value.imagesCount),1)]),_:1}),e(s,{class:"text-right",cols:"2"},{default:t(()=>[e(r,{color:"info",icon:"mdi-view-gallery-outline",size:"48"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(c,null,{default:t(()=>[e(s,{cols:"12",md:"4"},{default:t(()=>[e(u,{class:"mx-auto","max-width":"500"},{default:t(()=>[e(l,{class:"text-medium-emphasis pa-6"},{default:t(()=>[X]),_:1}),e(d),e(l,{class:"py-0"},{default:t(()=>[e(c,{align:"center","no-gutters":""},{default:t(()=>[e(s,{class:"d-flex align-center justify-center text-h2",cols:"9"},{default:t(()=>[a("div",Z,n(o.value.articleCount),1)]),_:1}),e(s,{class:"text-right",cols:"2"},{default:t(()=>[e(r,{color:"info",icon:"mdi-view-gallery-outline",size:"48"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(s,{cols:"12",md:"4"},{default:t(()=>[e(u,{class:"mx-auto","max-width":"500",height:"12.8rem",border:"",flat:""},{default:t(()=>[e(l,{class:"text-medium-emphasis pa-5"},{default:t(()=>[$,e(c,null,{default:t(()=>[e(s,{cols:"9"},{default:t(()=>[a("div",ee," Likes: "+n(o.value.mostLikedResource.likesNumber),1)]),_:1}),e(r,{color:"info",icon:"mdi-view-gallery-outline",size:"48"})]),_:1}),e(d),a("div",null,n(o.value.mostLikedResource.title),1)]),_:1})]),_:1})]),_:1}),e(s,{cols:"12",md:"4"},{default:t(()=>[e(u,{class:"mx-auto","max-width":"500",height:"12.8rem",border:"",flat:""},{default:t(()=>[e(l,{class:"text-medium-emphasis pa-5"},{default:t(()=>[te,e(c,null,{default:t(()=>[e(s,{cols:"9"},{default:t(()=>[a("div",se," Views: "+n(o.value.mostRequestedResource.viewsNumber),1)]),_:1}),e(r,{color:"info",icon:"mdi-view-gallery-outline",size:"48"})]),_:1}),e(d),a("div",null,n(o.value.mostRequestedResource.title),1)]),_:1})]),_:1})]),_:1})]),_:1}),e(c,null,{default:t(()=>[e(s,{cols:"12",md:"12"},{default:t(()=>[e(u,null,{default:t(()=>[e(q,null,{default:t(()=>[w("Publication Trends")]),_:1}),e(l,null,{default:t(()=>[e(D,{data:o.value.publicationTrends},null,8,["data"])]),_:1})]),_:1})]),_:1})]),_:1})])):y("",!0)]),_:1})}}};typeof C=="function"&&C(R);const ue=M(R,[["__scopeId","data-v-27c2c8b9"]]);export{ue as default};
