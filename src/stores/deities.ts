import { defineStore } from 'pinia';
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from 'graphql-tag';
// import { useRouter } from 'vue-router';

interface Deity {
  name: string;
  locality: string;
  parents: string[];
  description: string;
  siblings: string[];
  domain: string;
  gallery: string[];
  favs: number;
  rating: number;
  shared: number;
  children: string[];
  isMortal: boolean;
}

export const useDeityStore = defineStore('deity', {
  state: () => ({
    deity: {} as Deity,
    deities: [] as Deity[],
    filteredDeities: [] as Deity[],
    sortBy: 'name' as keyof Deity,
    filterByLocality: '' as string,
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
    setDeities(deities: Deity[]) {
      this.deities = deities;
      this.filteredDeities = deities;
    },
    sortDeities() {
      this.filteredDeities.sort((a, b) => {
        if (a[this.sortBy] < b[this.sortBy]) return -1;
        if (a[this.sortBy] > b[this.sortBy]) return 1;
        return 0;
      });
    },
    filterDeities() {
      if (this.filterByLocality) {
        this.filteredDeities = this.deities.filter(deity => deity.locality === this.filterByLocality);
      } else {
        this.filteredDeities = this.deities;
      }
      this.sortDeities();
    },
    async fetchDeityNames() {
      const deityQuery = gql`
        query {
          getDeities { 
            name
            locality
            domain
            favs 
          }
        }
      `;

      try {
        const response = await client.query({
          query: deityQuery,
        });

        const deities = response.data?.getDeities;
        if (deities) {
          this.deities = deities;
          this.setDeities(deities)
        } else {
          throw new Error('Failed to fetch deities');
        }
      } catch (error) {
        console.error('Error fetching deities:', error);
      }
    },
    async fetchDeities() {
      const deityQuery = gql`
        query {
          getDeities {
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
          query: deityQuery,
        });

        const deities = response.data?.getDeities;
        if (deities) {
          this.deities = deities;
        } else {
          throw new Error('Failed to fetch deities');
        }
      } catch (error) {
        console.error('Error fetching deities:', error);
      }
    },
    async deity(title: string, description: string, priority: string) {
      const todoMutation = gql`
        mutation useDeityStore($title: String!, $description: String!) {
          deity( title: $priority, description: $description,title: $priority) {
            deity
          }
        }
      `;

      const response = await client.mutate({
        mutation: todoMutation,
        variables: { title, description, priority },
      });

      const deity = response.data?.deity?.deity;
      if (deity) {
        this.deity = deity;
        //  Store deity in secure storage (optional)
      } else {
        throw new Error("Invalid username or password");
      }
    },

  },
});
