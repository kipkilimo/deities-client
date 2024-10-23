// Import Apollo Client and GraphQL functions
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();

export const useDiscusionGroupsStore = defineStore("discussionGroupStore", {
  state: () => ({
    discussionGroups: [] as any[],
    discussionGroupObject: {} as Record<string, any>,
    discussionGroup: {} as Record<string, any>,
  }),
  actions: {
    async handleDiscussionGroupCreate(vals: {
      discussionGroupId: string;
      name: string;
      program: string;
      createdBy: string;
      members: string[];
    }) {
      const CREATE_DISCUSSION_GROUP = gql`
        mutation createDiscussionGroup(
          $discussionGroupId: String
          $name: String!
          $program: String!
          $createdBy: ID!
          $members: [String!]!
        ) {
          createDiscussionGroup(
            discussionGroupId: $discussionGroupId
            name: $name
            program: $program
            createdBy: $createdBy
            members: $members
          ) {
            id
            name
            program
          }
        }
      `;
      console.log({
        discussionGroupId: vals.discussionGroupId,
        name: vals.name,
        program: vals.program,
        createdBy: vals.createdBy,
        members: vals.members,
      });
      try {
        const result = await client.mutate({
          mutation: CREATE_DISCUSSION_GROUP,
          variables: {
            discussionGroupId: vals.discussionGroupId,
            name: vals.name,
            program: vals.program,
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
        console.error("Create Discussion Group error: ", error);
      }
    },
    async handleDiscussionGroupUpdate(vals: {
      discussionGroupId: string;
      name: string;
      program: string;
      members: string[];
    }) {
      const UPDATE_DISCUSSION_GROUP = gql`
        mutation updateDiscussionGroup(
          $discussionGroupId: String!
          $name: String
          $program: String
          $members: [String!]!
        ) {
          updateDiscussionGroup(
            discussionGroupId: $discussionGroupId
            name: $name
            program: $program
            members: $members
          ) {
            id
            name
            program
          }
        }
      `;
      console.log({
        discussionGroupId: vals.discussionGroupId,
        name: vals.name,
        program: vals.program,
        members: vals.members,
      });
      try {
        const result = await client.mutate({
          mutation: UPDATE_DISCUSSION_GROUP,
          variables: {
            discussionGroupId: vals.discussionGroupId,
            name: vals.name,
            program: vals.program,
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
        console.error("Create Discussion Group error: ", error);
      }
    },
    // handleDiscussionGroupUpdate
  },
});
