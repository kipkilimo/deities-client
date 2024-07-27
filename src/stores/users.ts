import { defineStore } from 'pinia';
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from 'graphql-tag';
// import { useRouter } from 'vue-router';

interface UserState {
  isLoggedIn: boolean;
  token?: string;
  username: string;
  // Other user data
}

export const useUserStore = defineStore('login', {
  state: (): UserState => ({
    isLoggedIn: false,
    token: undefined,
    username: ''
  }),
  actions: {

    async register(username: string, email: string, password: string) {
      const REGISTER_USER = gql`
        mutation registerUser($username: String!, $email: String!, $password: String!) {
          register(username: $username, email: $email, password: $password) {
            id
            username
            email
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: REGISTER_USER,
          variables: { username, email, password },
        });

        // Handle response
        console.log('Registration successful:', response.data?.register);

        return response.data?.register; // Return the registered user data if needed
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Registration failed'); // Optionally re-throw the error after logging it
      }
    }
    ,
    async login(username: string, password: string) {
      const loginMutation = gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            accessToken
            user {
              id
            }
          }
        }
      `;

      const response = await client.mutate({
        mutation: loginMutation,
        variables: { username, password },
      });

      const token = response.data?.login?.accessToken;
      if (token) {
        this.isLoggedIn = true;
        this.token = token;
        //  Store token in secure storage (optional)
      } else {
        throw new Error("Invalid username or password");
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.token = undefined;
      // Clear token from secure storage (optional)
    },
  },
});
