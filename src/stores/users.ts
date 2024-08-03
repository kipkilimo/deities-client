import { defineStore } from 'pinia';
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from 'graphql-tag';
// import { useRouter } from 'vue-router';

interface UserState {
  isLoggedIn: boolean;
  token?: string;
  username: string;
  user: {
    id: string,
    username: string,
    email: string,
    activatedAccount: boolean;
  }
  // Other user data
}

export const useUserStore = defineStore('login', {
  state: (): UserState => ({
    isLoggedIn: false,
    token: undefined,
    username: '',
    user: {
      id: '',
      username: '',
      email: '',
      activatedAccount: false
    }
  }),
  actions: {
    // activationToken
    async resetPassword(activationToken: string, password: string) {
      const RESET_PASSWORD = gql`
 mutation resetPassword($activationToken: String!, $password: String!) {
  resetPassword(activationToken: $activationToken, password: $password) {
    accessToken
    user {
      id
      username
      email
    }
  }
}
  `;

      try {
        const response = await client.mutate({
          mutation: RESET_PASSWORD,
          variables: { activationToken, password },
        });

        // Handle response 
        this.user = response.data?.resetPassword?.user
        const accessToken = response.data?.resetPassword?.accessToken;
        if (accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          //  Store token in secure storage (optional)
        } else {
          throw new Error("Invalid username or password");
        }
      } catch (error) {
        throw new Error('Reset failed'); // Optionally re-throw the error after logging it
      }
    },
    async requestPasswordReset(email: string) {
      const REQUEST_RESET_PASSWORD = gql`
    mutation requestPasswordReset( $email: String!) {
      requestPasswordReset( email: $email) {
        id
        username
        email
      } 
    }
  `;

      try {
        const response = await client.mutate({
          mutation: REQUEST_RESET_PASSWORD,
          variables: { email },
        });

        // Handle response

        return response.data?.requestPasswordReset; // Return the registered user data if needed
      } catch (error) {
        console.error('Activation error:', error);
        throw new Error('Activation failed'); // Optionally re-throw the error after logging it
      }
    },
    async activate(token: string) {
      const ACTIVATE_ACCOUNT = gql`
    mutation activateUser( $token: String!) {
      activate( token: $token) {
        accessToken
    user {
      id
      username
      email
    }
      }
    }
  `;

      try {
        const response = await client.mutate({
          mutation: ACTIVATE_ACCOUNT,
          variables: { token },
        });

        // Handle response
        this.user = response.data?.activate?.user
        const accessToken = response.data?.activate?.accessToken;
        if (accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          //  Store token in secure storage (optional)
        } else {
          throw new Error("Invalid username or password");
        }
      } catch (error) {
        console.error('Activation error:', error);
        throw new Error('Activation failed'); // Optionally re-throw the error after logging it
      }
    },
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
 
        return response.data?.register; // Return the registered user data if needed
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Registration failed'); // Optionally re-throw the error after logging it
      }
    }
    ,
    async login(email: string, password: string) {
      const loginMutation = gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            accessToken
    user {
      id
      username
      email 
              activatedAccount
            } 
          }
        }
      `;

      const response = await client.mutate({
        mutation: loginMutation,
        variables: { email, password },
      });
      this.user = response.data?.login?.user
      const userObjRaw = [this.user]
      const userObj = JSON.stringify(userObjRaw)
      const userDetail = userObj // JSON.stringify(userObjRaw)

      localStorage.setItem('user', userDetail)
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
      // Set logged-in state to false
      this.isLoggedIn = false;

      // Clear the token
      this.token = '';
      this.user = {} as UserState['user']; // Ensure user is an empty object of the correct type

      // Clear all items from localStorage
      localStorage.clear();

      // Redirect to the login page
      window.location.href = '/auth/login';

      // Optionally, clear token from secure storage if applicable
    }
  }

});
