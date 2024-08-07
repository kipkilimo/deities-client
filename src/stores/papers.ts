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
  addedDate: string;
}
interface Paper {
  id: string;
  title: string;
  objective: string;
  url: string;
  sessionId: string;
  discussion: [Discussion];
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

    async getMostRecentPaper() {
      const getMostRecentPaper = gql`
        query {
          getMostRecentPaper {
            id
            title
            objective
            url
            sessionId
            discussion {
              pageNumber
              title
              content
              x
              y
              width
              height
              id
              username
              addedDate
            }
            createdDate
            createdBy {
              id
              username
              email
            }
          }
        }
      `;

      try {
        const response = await client.query({
          query: getMostRecentPaper,
        });

        const paper = response.data?.getMostRecentPaper;
        if (paper) {
          this.paper = paper;
          // this.setPapers(paper)
        } else {
          throw new Error("Failed to fetch paper");
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
    async saveDiscussionComment(val: string) {
      const CREATE_A_PAPER = gql`
        mutation createPaper($val: String!) {
          saveDiscussionComment(val: $val) {
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
        variables: { val },
      });

      const paper = response.data?.saveDiscussionComment;
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
