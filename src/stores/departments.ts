// Import Apollo Client and GraphQL functions
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();
export const useDepartmentStore = defineStore("departmentStore", {
  state: () => ({
    departments: [] as any[],
    departmentObject: {} as Record<string, any>,
    department: {} as Record<string, any>,
  }),
  actions: {
    async handleDepartmentCreate(vals: {
      departmentId: string;
      name: string;
      parent_institution: string;
      phone_number: string;
      email_address: string;
      programs: string[];
      createdBy: string;
      members: string[];
    }) {
      const CREATE_DEPARTMENT = gql`
        mutation createADepartment(
          $departmentId: String
          $name: String!
          $parent_institution: String
          $phone_number: String
          $email_address: String
          $createdBy: ID!
          $members: [String!]!
        ) {
          createADepartment(
            departmentId: $departmentId
            name: $name
            parent_institution: $parent_institution
            phone_number: $phone_number
            email_address: $email_address
            createdBy: $createdBy
            members: $members
          ) {
            id
            name
          }
        }
      `;
      console.log({
        departmentId: vals.departmentId,
        name: vals.name,
        parent_institution: vals.parent_institution,
        phone_number: vals.phone_number,
        email_address: vals.email_address,
        program: vals.programs,
        createdBy: vals.createdBy,
        members: vals.members,
      });

      try {
        const result = await client.mutate({
          mutation: CREATE_DEPARTMENT,
          variables: {
            departmentId: vals.departmentId,
            name: vals.name,
            parent_institution: vals.parent_institution,
            phone_number: vals.phone_number,
            email_address: vals.email_address,
            program: vals.programs,
            createdBy: vals.createdBy,
            members: vals.members,
          },
        });

        console.log(result);
        setTimeout(() => {
          localStorage.removeItem("currentUser");
          window.location.href = "/auth/login";
        }, 1800);
      } catch (error) {
        console.error("Create Department error: ", error);
      }
    },
    async handleDepartmentUpdate(vals: {
      departmentId: string;
      name: string;
      parent_institution: string;
      phone_number: string;
      email_address: string;
      programs: string[];
      membershipUpdate: string;
      members: string[];
    }) {
      const UPDATE_DEPARTMENT = gql`
        mutation updateDepartment(
          $departmentId: String
          $name: String!
          $parent_institution: String
          $phone_number: String
          $email_address: String
          $membershipUpdate: String!
          $members: [String!]!
        ) {
          updateDepartment(
            departmentId: $departmentId
            name: $name
            parent_institution: $parent_institution
            phone_number: $phone_number
            email_address: $email_address
            membershipUpdate: $membershipUpdate
            members: $members
          ) {
            id
            name
          }
        }
      `;
      console.log({
        departmentId: vals.departmentId,
        name: vals.name,
        parent_institution: vals.parent_institution,
        phone_number: vals.phone_number,
        email_address: vals.email_address,
        membershipUpdate: vals.membershipUpdate,
        members: vals.members,
      });

      try {
        const result = await client.mutate({
          mutation: UPDATE_DEPARTMENT,
          variables: {
            departmentId: vals.departmentId,
            name: vals.name,
            parent_institution: vals.parent_institution,
            phone_number: vals.phone_number,
            email_address: vals.email_address,
            membershipUpdate: vals.membershipUpdate,
            members: vals.members,
          },
        });

        console.log(result);
        setTimeout(() => {
          localStorage.removeItem("currentUser");
          window.location.href = "/auth/login";
        }, 1800);
      } catch (error) {
        console.error("Create Department error: ", error);
      }
    },
  },
});
