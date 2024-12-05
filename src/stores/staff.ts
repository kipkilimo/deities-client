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
  username: string;
  userStrObj: string;
  user?: User;
}

export const useUserStore = defineStore("login", {
  state: (): UserState => ({
    isLoggedIn: false,
    token: undefined,
    userStrObj: "",
    username: "",
    user: undefined,
  }),

  actions: {
    async register(
      email: string,
      username: string,
      fullName: string,
      password: string
    ) {
      const CREATE_NEW_USER = gql`
        mutation createUser(
          $username: String!
          $fullName: String!
          $email: String!
          $password: String!
        ) {
          createUser(
            email: $email
            username: $username
            fullName: $fullName
            password: $password
          ) {
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
      `;

      try {
        const response = await client.mutate({
          mutation: CREATE_NEW_USER,
          variables: { email, username, fullName, password },
        });

        const user = response.data.createUser;

        if (user) {
          this.user = user;

          // Navigate to login
        }
        // @ts-ignore
        window.location = "/auth/activate";
      } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Registration error");
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
    async handleAddResourceToRecents(userId: string, resourceId: string) {
      const ADD_TO_RECENTS = gql`
        mutation addResourceToRecents($userId: String!, $resourceId: String!) {
          addResourceToRecents(userId: $userId, resourceId: $resourceId) {
            id
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: ADD_TO_RECENTS,
          variables: { userId, resourceId },
        });

        const user = response.data.addResourceToRecents;

        if (user) {
          console.log("Resource added to recents:", user);
          return user;
        } else {
          throw new Error("Invalid request or data");
        }
      } catch (error) {
        console.error("Error while adding to recents:", error);
        throw new Error("Failed to add resource to recents");
      }
    },

    //addResourceToFavorites
    async handleAddResourceToFavorites(userId: string, resourceId: string) {
      const ADD_TO_FAVORITES = gql`
        mutation addResourceToFavorites(
          $userId: String!
          $resourceId: String!
        ) {
          addResourceToFavorites(userId: $userId, resourceId: $resourceId) {
            id
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: ADD_TO_FAVORITES,
          variables: { userId, resourceId },
        });

        const user = response.data.addResourceToFavorites;

        if (user) {
          console.log("Resource added to favorites:", user);
          return user;
        } else {
          throw new Error("Invalid request or data");
        }
      } catch (error) {
        console.error("Error while adding to favorites:", error);
        throw new Error("Failed to add resource to favorites");
      }
    },

    // rateReviewResources

    async handleRateReviewResources(
      userId: string,
      resourceId: string,
      reviewDetails: { rating: number; text: string }
    ) {
      const RATE_REVIEW_RESOURCE = gql`
        mutation rateReviewResources(
          $userId: String!
          $resourceId: String!
          $reviewDetails: ReviewInput!
        ) {
          rateReviewResources(
            userId: $userId
            resourceId: $resourceId
            reviewDetails: $reviewDetails
          ) {
            id
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: RATE_REVIEW_RESOURCE,
          variables: { userId, resourceId, reviewDetails },
        });

        const resource = response.data.rateReviewResources;

        if (resource) {
          return;
        } else {
          console.log("Response:", response);
          // throw new Error("Invalid request or data");
        }
      } catch (error) {
        console.error("Error while rating resource:", error);
        throw new Error("Rating resource failed");
      }
    },
    async activate(activationToken: string) {
      const ACTIVATE_ACCOUNT = gql`
        mutation ActivateAccount($activationToken: String!) {
          activate(activationToken: $activationToken) {
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
          mutation: ACTIVATE_ACCOUNT,
          variables: { activationToken },
        });

        const user = response.data?.activate?.user;
        const accessToken = response.data?.activate?.accessToken;

        if (user && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.user = user;
          localStorage.setItem("sessionId", user.id);
        } else {
          throw new Error("Invalid activation token");
        }
      } catch (error) {
        console.error("Activation error:", error);
        throw new Error("Account activation failed");
      }
    },
    async deleteUserByScholarId(scholarId: string) {
      const DELETE_USER_BY_SCHOLAR_ID = gql`
        mutation DeleteUserByScholarId($scholarId: String!) {
          deleteUserByScholarId(scholarId: $scholarId) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: DELETE_USER_BY_SCHOLAR_ID,
          variables: { scholarId },
        });

        const user = response.data?.deleteUserByScholarId;

        if (user) {
          this.user = user;
          return user; // Return deleted user information if needed
        } else {
          throw new Error("User not found or deletion failed");
        }
      } catch (error) {
        console.error("Delete user by scholar ID error:", error);
        throw new Error("User deletion failed");
      }
    },
    async singleSigninLogin(accessKey: string) {
      const SINGLE_SIGNIN_LOGIN = gql`
        mutation SingleSigninLogin($accessKey: String!) {
          singleSigninLogin(accessKey: $accessKey) {
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
          mutation: SINGLE_SIGNIN_LOGIN,
          variables: { accessKey },
        });

        const user = response.data?.singleSigninLogin?.user;
        const accessToken = response.data?.singleSigninLogin?.accessToken;

        if (user && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.user = user;
          localStorage.setItem("sessionId", user.id);
        } else {
          throw new Error("Invalid access key");
        }
      } catch (error) {
        console.error("Single sign-in login error:", error);
        throw new Error("Single sign-in login failed");
      }
    },
    async singleSignInRequest(email: string) {
      const SINGLE_SIGNIN_REQUEST = gql`
        mutation SingleSignInRequest($email: String!) {
          singleSignInRequest(email: $email) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: SINGLE_SIGNIN_REQUEST,
          variables: { email },
        });

        const user = response.data?.singleSignInRequest;

        if (user) {
          this.user = user;
          return user; // Return user information if needed
        } else {
          throw new Error("Single sign-in request failed or invalid email");
        }
      } catch (error) {
        console.error("Single sign-in request error:", error);
        throw new Error("Single sign-in request failed");
      }
    },
    async requestPasswordReset(email: string) {
      const REQUEST_PASSWORD_RESET = gql`
        mutation RequestPasswordReset($email: String!) {
          requestPasswordReset(email: $email) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: REQUEST_PASSWORD_RESET,
          variables: { email },
        });

        const user = response.data?.requestPasswordReset;

        if (user) {
          this.user = user;
          return user; // Return user information if needed
        } else {
          throw new Error("User not found or invalid email");
        }
      } catch (error) {
        console.error("Password reset request error:", error);
        throw new Error("Password reset request failed");
      }
    },
    async resetPassword(activationToken: string, password: string) {
      const RESET_PASSWORD = gql`
        mutation ResetPassword($activationToken: String!, $password: String!) {
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
          localStorage.setItem("sessionId", user.id);
        } else {
          throw new Error("Invalid reset token or password");
        }
      } catch (error) {
        console.error("Reset password error:", error);
        throw new Error("Password reset failed");
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
              members {
                role
                personalInfo {
                  email
                  fullName
                }
              }
            }
            departments {
              id
              departmentId
              name
              faculty {
                role
                personalInfo {
                  email
                  fullName
                }
              }
              students {
                role
                personalInfo {
                  email
                  fullName
                }
              }
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
