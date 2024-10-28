import{P as u}from"./index-29b1d87f.js";import{g as i,c as a}from"./apolloClient-3b54e56b.js";u("alerts",{state:()=>({alertMessage:"",alertType:""}),actions:{setAlert(e,t){this.alertMessage=e,this.alertType=t}}});const y=u("resource",{state:()=>({prediction:"",surveyLikertQuestion:"What is your take on NEMBio, 'The Hub for Interactive Life Sciences Research Tools.', after the introduction given?",surveyLikertOptions:[{label:"Waste of time"},{label:"Neutral"},{label:"Needs radical surgery"},{label:"Just minor modifications and it is good to go - These are my suggestions (write on provided paper)."},{label:"Excellent proposition. Can't wait to try it!"}],exams:"",exam:"",tasks:"",task:"",resource:{},resourceIsComputing:!1,resources:[],filteredResources:[],sortBy:"title",filterByType:"",showAddResourceCoverAndContentDialog:!1,showCreateResourceDialog:!1,showExamsDialog:!1,showAssignmentsDialog:!1}),actions:{setQuestion(e){this.surveyLikertQuestion=e},setOptions(e){this.surveyLikertOptions=e},setResources(e){this.resources=e,this.filteredResources=e},setResource(e){this.resource=e},sortResources(){this.filteredResources.sort((e,t)=>e[this.sortBy]<t[this.sortBy]?-1:e[this.sortBy]>t[this.sortBy]?1:0)},filterResources(){this.filterByType?this.filteredResources=this.resources.filter(e=>e.contentType===this.filterByType):this.filteredResources=this.resources,this.sortResources()},async getAllTestResources(e){var r;const t=i`
        query ($id: ID!) {
          getResource(id: $id) {
            id
            title
            description
            targetRegion
            targetCountry
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            sessionId
            accessKey
            keywords
            coverImage
            isPublished
            averageRating
            reviews
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                fullName
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;try{const o=(r=(await a.query({query:t,variables:{id:e}})).data)==null?void 0:r.getResource;if(o)this.resource=o;else throw new Error("Failed to fetch resource")}catch(s){console.error("Error fetching resource:",s)}},async getAllTaskResources(){const e=i`
        query {
          getAllTaskResources {
            id
            title
            description
            targetRegion
            targetCountry
            sessionId
            accessKey
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            keywords
            coverImage
            averageRating
            createdBy {
              id

              personalInfo {
                username
              }
            }
            createdAt
            updatedAt
          }
        }
      `;try{const r=(await a.query({query:e})).data.getAllTaskResources;if(r)this.resources=r;else throw new Error("Failed to fetch task resources")}catch(t){console.error("Error fetching task resources:",t)}},async getClinicalPrediction(){const e=i`
        query {
          getClinicalPrediction {
            id
            contentType
          }
        }
      `;try{const r=(await a.query({query:e})).data.getClinicalPrediction;if(r)this.prediction=r;else throw new Error("Failed to fetch prediction")}catch(t){console.error("Error fetching resources:",t)}},async getAllResources(){const e=i`
        query {
          getAllResources {
            id
            contentType
          }
        }
      `;try{const r=(await a.query({query:e})).data.getAllResources;if(r)this.resources=r;else throw new Error("Failed to fetch resources")}catch(t){console.error("Error fetching resources:",t)}},async getAllSpecificTypeResources(e){var r;const t=i`
        query ($resourceType: String!) {
          getAllSpecificTypeResources(resourceType: $resourceType) {
            id
            title
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            coverImage
            averageRating
          }
        }
      `;try{const o=(r=(await a.query({query:t,variables:{resourceType:e}})).data)==null?void 0:r.getAllSpecificTypeResources;if(o)this.resources=o;else throw new Error("Failed to fetch resources")}catch(s){console.error("Error fetching resources:",s)}},async getUserTasks(e){const t=i`
        query ($userId: String!) {
          getUserTasks(userId: $userId) {
            id
            title
            description
            content
            sessionId
            contentType
            accessKey
            coverImage
            isPublished
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                fullName
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;try{const s=(await a.query({query:t,variables:{userId:e}})).data.getUserTasks;this.resources=s}catch(r){this.resources=[],console.error("Error fetching resource:",r)}},async getPublisherLatestTasks(e){const t=i`
        query ($userId: String!) {
          getPublisherLatestTasks(userId: $userId) {
            assignmentType
            assignmentTitle
            assignmentDescription
            assignmentDuration
            assignmentDeadline
            assignmentAnswersKey
            assignmentTaskSet
            id
            title
            coverImage
            description
            subject
            topic
            createdBy {
              id
            }
            createdAt
            sessionId
            accessKey
            participants
          }
        }
      `;try{const s=(await a.query({query:t,variables:{userId:e}})).data.getPublisherLatestTasks;if(s)this.tasks=JSON.stringify(s),this.showAssignmentsDialog=!0;else throw new Error("Failed to fetch resource")}catch(r){console.error("Error fetching resource:",r)}},async getCurrentExam(e){const t=i`
        query ($sessionId: String!) {
          getCurrentExam(sessionId: $sessionId) {
            id
            title
            participants
            description
            examMetaInfo {
              examDate
              examStartTime
              examDuration
              examQuestionsSet
              # examAnswersKey
              examEndTime
              selectedTypes
              numberOfQuestions {
                SCQ
                MCQ
                ATF
                ETF
                VSAQ
                SAQ
                LEQ
              }
              testMeta {
                testType
                numberOfQuestions
              }
            }
            subject
            topic
            createdBy {
              id
            }
            createdAt
            sessionId
            accessKey
          }
        }
      `;try{const s=(await a.query({query:t,variables:{sessionId:e}})).data.getCurrentExam;if(s)this.exam=JSON.stringify(s);else throw new Error("Failed to fetch resource")}catch(r){console.error("Error fetching resource:",r)}},async getPublisherLatestExams(e){const t=i`
        query ($userId: String!) {
          getPublisherLatestExams(userId: $userId) {
            id
            title
            participants
            description
            examMetaInfo {
              examDate
              examStartTime
              examDuration
              examEndTime
              selectedTypes
              numberOfQuestions {
                SCQ
                MCQ
                ATF
                ETF
                VSAQ
                SAQ
                LEQ
              }
              testMeta {
                testType
                numberOfQuestions
              }
            }
            subject
            topic
            createdBy {
              id
            }
            createdAt
            sessionId
            accessKey
          }
        }
      `;try{const s=(await a.query({query:t,variables:{userId:e}})).data.getPublisherLatestExams;if(s)this.exams=JSON.stringify(s),this.showExamsDialog=!0;else throw new Error("Failed to fetch resource")}catch(r){console.error("Error fetching resource:",r)}},async getPublisherLatestPoll(e){const t=i`
        query ($userId: String!) {
          getPublisherLatestPoll(userId: $userId) {
            id
            title
            description
            content
            targetRegion
            targetCountry
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            sessionId
            accessKey
            keywords
            coverImage
            isPublished
            averageRating
            reviews
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                fullName
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;try{const s=(await a.query({query:t,variables:{userId:e}})).data.getPublisherLatestPoll;if(s)this.resource=s;else throw new Error("Failed to fetch resource")}catch(r){console.error("Error fetching resource:",r)}},async GetPollDataAndResults(e){var r;const t=i`
        query ($pollId: String!) {
          GetPollDataAndResults(pollId: $pollId) {
            responses
          }
        }
      `;try{const o=(r=(await a.query({query:t,variables:{pollId:e}})).data)==null?void 0:r.GetPollDataAndResults;if(o)this.resource=o;else throw new Error("Failed to fetch resource")}catch(s){console.error("Error fetching resource:",s)}},async fetchComputingResource(e){const t=i`
        query ($topicParams: String!) {
          fetchComputingResource(topicParams: $topicParams) {
            id
            title
            description
            content
            targetRegion
            targetCountry
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            sessionId
            accessKey
            keywords
            coverImage
            isPublished
            averageRating
            reviews
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                fullName
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;try{this.resource={id:"",title:"",description:"",content:"",targetRegion:"",targetCountry:"",slug:"",language:"",contentType:"",viewsNumber:0,likesNumber:0,sharesNumber:0,subject:"",topic:"",rating:"",sessionId:"",accessKey:"",keywords:"",coverImage:"",isPublished:!1,averageRating:0,reviews:"",createdBy:"",createdAt:"",updatedAt:""};const s=(await a.query({query:t,variables:{topicParams:e}})).data.fetchComputingResource;s!==null?this.resource=s:this.resource.contentType="COMPUTING";return}catch(r){console.error("Error fetching resource:",r)}},async fetchResource(e){var r;const t=i`
        query ($id: ID!) {
          getResource(id: $id) {
            id
            title
            description
            content
            targetRegion
            targetCountry
            slug
            language
            contentType
            participants
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            sessionId
            accessKey
            keywords
            coverImage
            isPublished
            averageRating
            reviews
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                fullName
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;try{const o=(r=(await a.query({query:t,variables:{id:e}})).data)==null?void 0:r.getResource;if(o)this.resource=o;else throw new Error("Failed to fetch resource")}catch(s){console.error("Error fetching resource:",s)}},async fetchResources(e={}){var r;const t=i`
        query (
          $title: String
          $contentType: ResourceType
          $targetRegion: String
          $language: String
          $subject: String
          $topic: String
        ) {
          getResources(
            title: $title
            contentType: $contentType
            targetRegion: $targetRegion
            language: $language
            subject: $subject
            topic: $topic
          ) {
            id
            title
            description
            targetRegion
            targetCountry
            sessionId
            accessKey
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            keywords
            coverImage
            averageRating
            createdBy {
              id

              personalInfo {
                username
              }
            }
            createdAt
            updatedAt
          }
        }
      `;try{const o=(r=(await a.query({query:t,variables:e})).data)==null?void 0:r.getResources;if(o)this.resources=o,this.setResources(o);else throw new Error("Failed to fetch resources")}catch(s){console.error("Error fetching resources:",s)}},async createResource(e){const t=i`
        mutation (
          $title: String!
          $description: String!
          $subject: String!
          $topic: String!
          $targetRegion: String
          $targetCountry: String
          $language: String
          $contentType: ResourceType!
          $keywords: String!
          $createdBy: ID!
        ) {
          createResource(
            title: $title
            description: $description
            subject: $subject
            topic: $topic
            targetRegion: $targetRegion
            targetCountry: $targetCountry
            language: $language
            contentType: $contentType
            keywords: $keywords
            createdBy: $createdBy
          ) {
            id
            contentType
            title
          }
        }
      `;try{const s=(await a.mutate({mutation:t,variables:e})).data.createResource;this.resource=s,this.resources.push(s),this.resources=this.resources}catch(r){console.error("Error creating resource:",r)}},async addResourceFormContent(e){const t=i`
        mutation ($resourceDetails: String!) {
          addResourceFormContent(resourceDetails: $resourceDetails) {
            id
            contentType
          }
        }
      `;try{const s=(await a.mutate({mutation:t,variables:e})).data.addResourceFormContent;this.resource=s,this.resources.push(s),this.resources=this.resources}catch(r){console.error("Error creating resource:",r)}},async updateResource(e,t){var s;const r=i`
        mutation (
          $id: ID!
          $title: String
          $description: String
          $content: String
          $targetRegion: String
          $targetCountry: String
          $slug: String
          $language: String
          $contentType: ResourceType
          $viewsNumber: Int
          $likesNumber: Int
          $sharesNumber: Int
          $rating: String
          $subject: String
          $topic: String
          $sessionId: String
          $accessKey: String
          $keywords: [String]
          $coverImage: String
          $isPublished: Boolean
          $averageRating: Float
          $reviews: [String]
        ) {
          updateResource(
            id: $id
            title: $title
            description: $description
            content: $content
            targetRegion: $targetRegion
            targetCountry: $targetCountry
            slug: $slug
            language: $language
            contentType: $contentType
            viewsNumber: $viewsNumber
            likesNumber: $likesNumber
            sharesNumber: $sharesNumber
            rating: $rating
            subject: $subject
            topic: $topic
            sessionId: $sessionId
            accessKey: $accessKey
            keywords: $keywords
            coverImage: $coverImage
            isPublished: $isPublished
            averageRating: $averageRating
            reviews: $reviews
          ) {
            id
            title
            slug
            language
            contentType

            reviews
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;try{const n=(s=(await a.mutate({mutation:r,variables:{id:e,...t}})).data)==null?void 0:s.updateResource;if(n){const c=this.resources.findIndex(l=>l.id===e);c!==-1&&(this.resources[c]=n),this.resource=n}else throw new Error("Failed to update resource")}catch(o){console.error("Error updating resource:",o)}}}});export{y as u};
