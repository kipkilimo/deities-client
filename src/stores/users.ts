import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { useRouter } from "vue-router";
const router = useRouter();
import Cookies from "js-cookie";

interface PersonalInfo {
  username: string;
  email: string;
  activatedAccount: boolean;
  fullName: string;
  publication_credits: string;
}

interface AcademicInfo {
  // Add relevant fields for academic info if needed
}

interface AccountSettings {
  // Add relevant fields for account settings if needed
}

interface ActivityInfo {
  // Add relevant fields for activity info if needed
}

interface DiscussionGroup {
  id: string;
}

interface Department {
  id: string;
}

interface Resource {
  id: string;
  title: string;
  // Add other relevant fields
}

interface User {
  id: string;
  personalInfo: PersonalInfo;
  academicInfo?: AcademicInfo;
  accountSettings?: AccountSettings;
  activityInfo?: ActivityInfo;
  role: string;
  discussion_group?: DiscussionGroup;
  department?: Department;
  favorite_resources?: Resource[];
  recent_resources?: Resource[];
  suggested_resources?: Resource[];
}

interface UserState {
  isLoggedIn: boolean;
  token?: string;
  userStrObj: string;
  user?: User;
}

export const useUserStore = defineStore("login", {
  state: (): UserState => ({
    isLoggedIn: false,
    token: undefined,
    userStrObj: "",
    user: undefined,
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
                fullName
                publication_credits
              }
              role
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
          this.user = user;
        } else {
          throw new Error("Reset failed");
        }
      } catch (error) {
        console.error("Reset password error:", error);
        throw new Error("Reset failed");
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
                fullName
                publication_credits
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

        if (user && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.user = user;
          localStorage.setItem("sessionId", user.id);
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
              fullName
              publication_credits
            }
            role
            discussion_groups {
              id
              discussionGroupId
              name
            }
            departments {
              id
              departmentId
              name
            }
            favorite_resources {
              id
              title
            }
            recent_resources {
              id
              title
            }
            suggested_resources {
              id
              title
            }
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
          this.user = user;
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
      this.user = undefined;
      localStorage.clear();
      Cookies.remove("authToken");
      window.location.href = "/";
    },
  },
});
