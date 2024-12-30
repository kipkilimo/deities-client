import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const router = useRouter();

interface Location {
  city?: string;
  state?: string;
  country?: string;
}

interface PersonalInfo {
  staffId: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  yearOfBirth: string;
  gender?: string;
  department: string;
  profilePicture?: string;
  address?: Location;
  bio?: string;
  employmentDate: string;
}

interface Staff {
  id: string;
  personalInfo: PersonalInfo;
  accountSettings: {
    accountStatus: string;
    notificationPreferences: string[];
  };
  activityInfo: {
    lastLogin?: string;
    accountCreationDate: string;
  };
  role: string;
}

export const useStaffStore = defineStore("auth", {
  state: () => ({
    addingStaff: false,
    staff: null as Staff | null,
    isLoggedIn: false,
    token: null as string | null,
    staffStrObj: "" as string,
  }),
  actions: {
    async login(emailAddress: string, password: string) {
      const LOGIN = gql`
        mutation Login($emailAddress: String!, $password: String!) {
          login(emailAddress: $emailAddress, password: $password) {
            staff {
              id
              personalInfo {
                staffId
                fullName
                emailAddress
                phoneNumber
                yearOfBirth
                department
                profilePicture
                address {
                  city
                  state
                  country
                }
                bio
                employmentDate
              }
              accountSettings {
                accountStatus
                notificationPreferences
              }
              activityInfo {
                lastLogin
                accountCreationDate
              }
              role
            }
            accessToken
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: LOGIN,
          variables: { emailAddress, password },
        });

        const staff = response.data?.login?.staff;
        const accessToken = response.data?.login?.accessToken;

        if (staff && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.staff = staff;
          localStorage.setItem("sessionId", staff.id);
        } else {
          throw new Error("Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed");
      }
    },
    async addStaffMember(
      fullName: string,
      emailAddress: string,
      phoneNumber: string,
      yearOfBirth: string,
      department: string,
      role: string
    ) {
      const ADD_STAFF_MEMBER = gql`
        mutation AddStaffMember(
          $fullName: String!
          $emailAddress: String!
          $phoneNumber: String!
          $yearOfBirth: String!
          $department: String!
          $role: Role!
        ) {
          createStaff(
            fullName: $fullName
            emailAddress: $emailAddress
            phoneNumber: $phoneNumber
            yearOfBirth: $yearOfBirth
            department: $department
            role: $role
          ) {
            id
            personalInfo {
              fullName
              emailAddress
              phoneNumber
              yearOfBirth
              department
            }
            role
          }
        }
      `;

      try {
        // Execute the GraphQL mutation
        const response = await client.mutate({
          mutation: ADD_STAFF_MEMBER,
          variables: {
            fullName,
            emailAddress,
            phoneNumber,
            yearOfBirth,
            department,
            role,
          },
        });

        // Extract data from the response
        const createdStaff = response.data?.createStaff;

        if (createdStaff) {
          console.log("Staff member created successfully:", createdStaff);
          return createdStaff; // Return the created staff details
        } else {
          throw new Error("Failed to create staff member");
        }
      } catch (error) {
        console.error("Add Staff Member error:", error);
        throw new Error("Failed to create staff member. Please try again.");
      }
    },

    async requestPasswordReset(emailAddress: string) {
      const REQUEST_PASSWORD_RESET = gql`
        mutation RequestPasswordReset($emailAddress: String!) {
          requestPasswordReset(emailAddress: $emailAddress) {
            accessToken
            staff {
              id
              personalInfo {
                staffId
                fullName
                emailAddress
                phoneNumber
                yearOfBirth
                department
                profilePicture
                address {
                  city
                  state
                  country
                }
                bio
                employmentDate
              }
              accountSettings {
                accountStatus
                notificationPreferences
              }
              activityInfo {
                lastLogin
                accountCreationDate
              }
              role
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: REQUEST_PASSWORD_RESET,
          variables: { emailAddress },
        });

        const staff = response.data?.requestPasswordReset?.staff;
        const accessToken = response.data?.requestPasswordReset?.accessToken;

        if (staff && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.staff = staff;
          localStorage.setItem("sessionId", staff.id);
        } else {
          throw new Error("Invalid reset token or password");
        }
      } catch (error) {
        console.error("Reset password error:", error);
        throw new Error("Password reset failed");
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
            staff {
              id
              personalInfo {
                staffId
                fullName
                emailAddress
                phoneNumber
                yearOfBirth
                department
                profilePicture
                address {
                  city
                  state
                  country
                }
                bio
                employmentDate
              }
              accountSettings {
                accountStatus
                notificationPreferences
              }
              activityInfo {
                lastLogin
                accountCreationDate
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

        const staff = response.data?.resetPassword?.staff;
        const accessToken = response.data?.resetPassword?.accessToken;

        if (staff && accessToken) {
          this.isLoggedIn = true;
          this.token = accessToken;
          this.staff = staff;
          localStorage.setItem("sessionId", staff.id);
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
        query GetCurrentUser($sessionId: String!) {
          getCurrentStaff(sessionId: $sessionId) {
            id
            personalInfo {
              staffId
              fullName
              emailAddress
              phoneNumber
              yearOfBirth
              department
              profilePicture
              address {
                city
                state
                country
              }
              bio
              employmentDate
            }
            accountSettings {
              accountStatus
              notificationPreferences
            }
            activityInfo {
              lastLogin
              accountCreationDate
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

        const staff = response.data?.getCurrentStaff;
        const staffStrObj = JSON.stringify(staff);

        if (staff) {
          this.staff = staff;
          this.staffStrObj = staffStrObj;
        }
      } catch (error) {
        console.error("Fetch current staff error:", error);
        throw new Error("Failed to fetch current staff");
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.token = null;
      this.staff = null;
      localStorage.clear();
      Cookies.remove("authToken");
      window.location.href = "/";
    },
  },
});
