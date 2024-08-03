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
interface Paper {
  id: string;
  title: string;
  objective: string;
  url: string;
  sessionId: string;
  discussion: [string];
  createdDate: string;
  createdBy: string;
}

export const usePaperStore = defineStore("paper", {
  state: () => ({
    paper: {} as Paper,
    papers: [] as Paper[],
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
    async createPaper(title: string, objective: string, createdBy: string) {
      const CREATE_A_PAPER = gql`
        mutation usePaperStore(
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
            discussion {
              title
            }
            createdDate
            createdBy {
              username
            }
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
