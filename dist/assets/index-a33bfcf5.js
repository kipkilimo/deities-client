import{g as m,c as p}from"./apolloClient-3b54e56b.js";import{C as _,L as d,a as f,b as C,p as y}from"./chart-d498817c.js";import v from"./AccountSummary-da8b68ac.js";import{b as r}from"./route-block-83d24a4e.js";import{_ as R}from"./_plugin-vue_export-helper-c27b6911.js";import{r as t,l as g,a as h,o as b,c as x,w as S,b as k}from"./index-6b729fcd.js";import"./users-6c6e41da.js";import"./_commonjsHelpers-de833af9.js";import"./___vite-browser-external_commonjs-proxy-698e55bb.js";const s={__name:"index",setup(E){_.register(d,f,C,y);const o=t(!1),a=t(null),u=t(null),c=m`
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
`;async function i(){try{o.value=!0;const{data:e}=await p.query({query:c});if(e){const n=e.fetchResourceSummaryByRoleAndType;u.value=n[0]}else a.value="Failed to fetch resources summaries"}catch{a.value="Failed to fetch resources summaries"}finally{o.value=!1}}return g(()=>{i()}),(e,n)=>{const l=h("v-container");return b(),x(l,null,{default:S(()=>[k(v)]),_:1})}}};typeof r=="function"&&r(s);const U=R(s,[["__scopeId","data-v-18373010"]]);export{U as default};
