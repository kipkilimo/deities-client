import{P as c}from"./index-6b729fcd.js";import{g as o,c as i}from"./apolloClient-3b54e56b.js";const u=c("paper",{state:()=>({paper:{},papers:[],showCreatePaper:!1,filteredPapers:[],sortBy:"name",filterByLocality:""}),actions:{async getMostRecentPapers(r){var s;const t=o`
        query ($userId: ID!) {
          getMostRecentPapers(userId: $userId) {
            id
            title
            objective
            url
            participants
            sessionId
            discussion {
              page
              title
              text
              x
              y
              width
              height
              id
              author
              timestamp
            }
            createdDate
            createdBy {
              id
              role
              personalInfo {
                username
              }
            }
          }
        }
      `;try{const a=(s=(await i.query({query:t,variables:{userId:r}})).data)==null?void 0:s.getMostRecentPapers;if(a)this.papers=a;else throw new Error("Failed to fetch papers")}catch(e){console.error("Error fetching papers:",e)}},setPaper(r){this.paper=r},async addPaperDiscussion(r){var a;const t=o`
        mutation addPaperDiscussion($discussionItem: String!) {
          addPaperDiscussion(discussionItem: $discussionItem) {
            id
            title
            objective
            url
            sessionId
            createdDate
          }
        }
      `,e=(a=(await i.mutate({mutation:t,variables:{discussionItem:r}})).data)==null?void 0:a.addPaperDiscussion;if(e)this.paper=e;else throw new Error("Could not add journal club material.")},async createPaper(r,t,s){var p;const e=o`
        mutation createPaper(
          $title: String!
          $objective: String!
          $createdBy: ID!
        ) {
          createPaper(
            title: $title
            objective: $objective
            createdBy: $createdBy
          ) {
            id
            title
            objective
            url
            sessionId
            createdDate
          }
        }
      `,n=(p=(await i.mutate({mutation:e,variables:{title:r,objective:t,createdBy:s}})).data)==null?void 0:p.createPaper;if(n)this.paper=n;else throw new Error("Could not add journal club material.")},async fetchPaperNames(){var t;const r=o`
        query {
          getPapers {
            name
            locality
            domain
            favs
          }
        }
      `;try{const e=(t=(await i.query({query:r})).data)==null?void 0:t.getPapers;if(e)this.papers=e;else throw new Error("Failed to fetch papers")}catch(s){console.error("Error fetching papers:",s)}},async fetchPapers(){var t;const r=o`
        query {
          getPapers {
            id
            name
            locality
            parents
            description
            siblings
            domain
            gallery
            favs
            rating
            shared
            children
            isMortal
          }
        }
      `;try{const e=(t=(await i.query({query:r})).data)==null?void 0:t.getPapers;if(e)this.papers=e;else throw new Error("Failed to fetch papers")}catch(s){console.error("Error fetching papers:",s)}}}});export{u};
