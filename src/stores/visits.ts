import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
// import { useRouter } from 'vue-router';
/*

createPaper(_: any, {
            title,
            objective,
            publisherId,
            */
interface Discussion {
  pageNumber: number;
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  username: string;
  timestamp: string;
}
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}
interface Paper {
  id: string;
  title: string;
  objective: string;
  url: string;
  sessionId: string;
  discussion: [Discussion];
  createdDate: string;
  createdBy: User;
}

export const usePaperStore = defineStore("paper", {
  state: () => ({
    paper: {} as Paper,
    papers: [] as Paper[],
    showCreatePaper: false,
    filteredPapers: [] as Paper[],
    sortBy: "name" as keyof Paper,
    filterByLocality: "" as string,
  }),
  actions: {
    /** 
             id: ID!
        title: String!
        description: String!
        priority: String!
    
        completed: Boolean!
        userId: ID!
         */

    // createPaper(_: any, {
    //     title,
    //     objective,
    //     publisherId,

    async getMostRecentPapers(userId: string) {
      const getMostRecentPapers = gql`
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
      `;

      try {
        const response = await client.query({
          query: getMostRecentPapers,
          variables: { userId },
        });

        const papers = response.data?.getMostRecentPapers;
        if (papers) {
          this.papers = papers;
          // this.setPapers(papers)
        } else {
          throw new Error("Failed to fetch papers");
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    },
    //: Paper
    setPaper(updatedPaper: Paper) {
      this.paper = updatedPaper;
    },

    // SAVE PAPER DISCUSSION TO DISCUSSION ARRAY
    async addPaperDiscussion(discussionItem: string) {
      const ADD_PAPER_DISCUSSION = gql`
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
      `;

      const response = await client.mutate({
        mutation: ADD_PAPER_DISCUSSION,
        variables: { discussionItem },
      });

      const paper = response.data?.addPaperDiscussion;
      if (paper) {
        this.paper = paper;
        //  Store paper in secure storage (optional)
      } else {
        throw new Error("Could not add journal club material.");
      }
    },

    async createPaper(title: string, objective: string, createdBy: string) {
      const CREATE_A_PAPER = gql`
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
      `;

      const response = await client.mutate({
        mutation: CREATE_A_PAPER,
        variables: { title, objective, createdBy },
      });

      const paper = response.data?.createPaper;
      if (paper) {
        this.paper = paper;
        //  Store paper in secure storage (optional)
      } else {
        throw new Error("Could not add journal club material.");
      }
    },

    // setPapers(papers: Paper[]) {
    //     this.papers = papers;
    //     this.filteredPapers = papers;
    // },
    // sortPapers() {
    //     this.filteredPapers.sort((a, b) => {
    //         if (a[this.sortBy] < b[this.sortBy]) return -1;
    //         if (a[this.sortBy] > b[this.sortBy]) return 1;
    //         return 0;
    //     });
    // },
    // filterPapers() {
    //     if (this.filterByLocality) {
    //         this.filteredPapers = this.papers.filter(paper => paper.locality === this.filterByLocality);
    //     } else {
    //         this.filteredPapers = this.papers;
    //     }
    //     this.sortPapers();
    // },
    async fetchPaperNames() {
      const paperQuery = gql`
        query {
          getPapers {
            name
            locality
            domain
            favs
          }
        }
      `;

      try {
        const response = await client.query({
          query: paperQuery,
        });

        const papers = response.data?.getPapers;
        if (papers) {
          this.papers = papers;
          // this.setPapers(papers)
        } else {
          throw new Error("Failed to fetch papers");
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    },
    async fetchPapers() {
      const paperQuery = gql`
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
      `;

      try {
        const response = await client.query({
          query: paperQuery,
        });

        const papers = response.data?.getPapers;
        if (papers) {
          this.papers = papers;
        } else {
          throw new Error("Failed to fetch papers");
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    },
  },
});
