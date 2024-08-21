import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { useRouter } from "vue-router";
const router = useRouter();
import Cookies from "js-cookie";

interface UserState {
  isLoggedIn: boolean;
  token?: string;
  username: string;
  userStrObj: string;
  user: {
    id: string;
    personalInfo: {
      username: string;
      email: string;
      activatedAccount: boolean;
    };
    role: string;
  };
}

export const useUserStore = defineStore("login", {
  state: (): UserState => ({
    isLoggedIn: false,
    username: "",
    token: undefined,
    userStrObj: "",
    user: {
      id: "",
      personalInfo: {
        username: "",
        email: "",
        activatedAccount: false,
      },
      role: "",
    },
  }),

  actions: {
    async resetPassword(activationToken: string, password: string) {
      const RESET_PASSWORD = gql`
        mutation resetPassword($activationToken: String!, $password: String!) {
          resetPassword(
            activationToken: $activationToken
            password: $password
          ) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
              }
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: RESET_PASSWORD,
          variables: { activationToken, password },
        });

        const user = response.data?.resetPassword?.user;
        const accessToken = response.data?.resetPassword?.accessToken;

        if (user && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
        } else {
          throw new Error("Reset failed");
        }
      } catch (error) {
        console.error("Reset password error:", error);
        throw new Error("Reset failed");
      }
    },

    async requestPasswordReset(email: string) {
      const REQUEST_RESET_PASSWORD = gql`
        mutation requestPasswordReset($email: String!) {
          requestPasswordReset(email: $email) {
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
              }
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: REQUEST_RESET_PASSWORD,
          variables: { email },
        });

        return response.data?.requestPasswordReset?.user;
      } catch (error) {
        console.error("Request password reset error:", error);
        throw new Error("Request failed");
      }
    },

    async activate(activationToken: string) {
      const ACTIVATE_ACCOUNT = gql`
        mutation activateUser($activationToken: String!) {
          activate(activationToken: $activationToken) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
              }
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: ACTIVATE_ACCOUNT,
          variables: { activationToken },
        });

        const user = response.data?.activate?.user;
        const accessToken = response.data?.activate?.accessToken;

        if (user && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
        } else {
          throw new Error("Activation failed");
        }
      } catch (error) {
        console.error("Activation error:", error);
        throw new Error("Activation failed");
      }
    },

    async register(
      username: string,
      fullName: string,
      email: string,
      password: string
    ) {
      const REGISTER_USER = gql`
        mutation createUser(
          $username: String!
          $fullName: String!
          $email: String!
          $password: String!
        ) {
          createUser(
            username: $username
            fullName: $fullName
            email: $email
            password: $password
          ) {
            id
            personalInfo {
              username
              email
              activatedAccount
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: REGISTER_USER,
          variables: { username, fullName, email, password },
        });
        const user = response.data?.createUser;

        if (user) {
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
        }
        return response.data?.createUser;
      } catch (error) {
        console.error("Registration error:", error);
        throw new Error("Registration failed");
      }
    },
    // ,
    async singleSignInRequest(email: string) {
      const REQUEST_ACCESS_KEY = gql`
        mutation singleSignInRequest($email: String!) {
          singleSignInRequest(email: $email) {
            id
            personalInfo {
              username
              email
              activatedAccount
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: REQUEST_ACCESS_KEY,
          variables: { email },
        });
        const user = response.data?.singleSignInRequest;

        this.user = {
          id: user.id,
          personalInfo: {
            username: user.personalInfo.username,
            email: user.personalInfo.email,
            activatedAccount: user.personalInfo.activatedAccount,
          },
          role: user.personalInfo.role,
        };
        return response.data?.singleSignInRequest;
      } catch (error) {
        console.error("Request password reset error:", error);
        throw new Error("Request failed");
      }
    },
    async singleSigninLogin(accessKey: string) {
      const LOGIN_USER = gql`
        mutation singleSigninLogin($accessKey: String!) {
          singleSigninLogin(accessKey: $accessKey) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
              }
              role
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: LOGIN_USER,
          variables: { accessKey },
        });

        const user = response.data?.singleSigninLogin?.user;
        const accessToken = response.data?.singleSigninLogin?.accessToken;

        if (user && accessToken == null) {
          this.isLoggedIn = false;
          this.token = "";
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
        }

        if (user && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
          localStorage.setItem("sessionId", this.user.id);
        } else {
          throw new Error("Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed");
      }
    },
    async login(email: string, password: string) {
      const LOGIN_USER = gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
              }
              role
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: LOGIN_USER,
          variables: { email, password },
        });

        const user = response.data?.login?.user;
        const accessToken = response.data?.login?.accessToken;

        if (user && accessToken == null) {
          this.isLoggedIn = false;
          this.token = "";
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
        }

        if (user && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
          localStorage.setItem("sessionId", this.user.id);
        } else {
          throw new Error("Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed");
      }
    },

    async getCurrentUser(sessionId: string) {
      const GET_CURRENT_USER = gql`
        query getCurrentUser($sessionId: String!) {
          getCurrentUser(sessionId: $sessionId) {
            id
            personalInfo {
              username
              email
              activatedAccount
            }
            role
          }
        }
      `;

      try {
        const response = await client.query({
          query: GET_CURRENT_USER,
          variables: { sessionId },
        });

        const user = response.data?.getCurrentUser;
        const userArrObj = [user];
        const userStrObj = JSON.stringify(userArrObj);

        if (user) {
          this.user = {
            id: user.id,
            personalInfo: {
              username: user.personalInfo.username,
              email: user.personalInfo.email,
              activatedAccount: user.personalInfo.activatedAccount,
            },
            role: user.personalInfo.role,
          };
          this.userStrObj = userStrObj;
        }
      } catch (error) {
        console.error("Fetch current user error:", error);
        throw new Error("Failed to fetch current user");
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.token = undefined;
      this.user = {
        id: "",
        personalInfo: {
          username: "",
          email: "",
          activatedAccount: false,
        },
        role: "",
      };
      localStorage.clear();
      Cookies.remove("authToken");
      window.location.href = "/";
    },
  },
});
