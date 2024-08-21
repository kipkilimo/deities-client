import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
// Define the ResourceType enum
export enum ResourceType {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  IMAGES = "IMAGES",
  DOCUMENT = "DOCUMENT",
  MIXED = "MIXED",
  TEXT = "TEXT",
  PRESENTATION = "PRESENTATION",
  EVENT = "EVENT",
  DATASET = "DATASET",
  LINK = "LINK",
  POLL = "POLL",
  TEST = "TEST",
  POSTER = "POSTER",
  ARTICLE = "ARTICLE",
  JOB = "JOB",
  TASK = "TASK",
}
type ID = string; // or type ID = number; based on your use case

interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  targetRegion: string;
  targetCountry: string;
  slug: string;
  language: string;
  contentType: string;
  viewsNumber: number;
  likesNumber: number;
  sharesNumber: number;
  subject: string;
  topic: string;
  rating: string;
  sessionId: string;
  accessKey: string;
  keywords: string;
  coverImage: string;
  isPublished: boolean;
  averageRating: number;
  reviews: string;
  createdBy: ID;
  createdAt: string;
  updatedAt: string;
}

export const useResourceStore = defineStore("resource", {
  state: () => ({
    resource: {} as Resource,
    resources: [] as Resource[],
    filteredResources: [] as Resource[],
    sortBy: "title" as keyof Resource,
    filterByType: "" as string,
    showAddResourceCoverAndContentDialog: false,
    showCreateResourceDialog: false,
  }),
  actions: {
    setResources(resources: Resource[]) {
      this.resources = resources;
      this.filteredResources = resources;
    },
    setResource(resource: Resource) {
      this.resource = resource;
    },
    sortResources() {
      this.filteredResources.sort((a, b) => {
        if (a[this.sortBy] < b[this.sortBy]) return -1;
        if (a[this.sortBy] > b[this.sortBy]) return 1;
        return 0;
      });
    },
    filterResources() {
      if (this.filterByType) {
        this.filteredResources = this.resources.filter(
          (resource) => resource.contentType === this.filterByType
        );
      } else {
        this.filteredResources = this.resources;
      }
      this.sortResources();
    },
    async fetchResource(id: string) {
      const resourceQuery = gql`
        query ($id: ID!) {
          getResource(id: $id) {
            id
            title
            description
            content
            targetRegion
            targetCountry
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            sessionId
            accessKey
            keywords
            coverImage
            isPublished
            averageRating
            reviews
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;

      try {
        const response = await client.query({
          query: resourceQuery,
          variables: { id },
        });

        const resource = response.data?.getResource;
        if (resource) {
          this.resource = resource;
        } else {
          throw new Error("Failed to fetch resource");
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    },
    async fetchResources(filters: any = {}) {
      const resourceQuery = gql`
        query (
          $title: String
          $contentType: ResourceType
          $targetRegion: String
          $language: String
          $subject: String
          $topic: String
        ) {
          getResources(
            title: $title
            contentType: $contentType
            targetRegion: $targetRegion
            language: $language
            subject: $subject
            topic: $topic
          ) {
            id
            title
            description
            targetRegion
            targetCountry
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            keywords
            coverImage
            averageRating
            createdBy {
              id

              personalInfo {
                username
              }
            }
            createdAt
            updatedAt
          }
        }
      `;

      try {
        const response = await client.query({
          query: resourceQuery,
          variables: filters,
        });

        const resources = response.data?.getResources;
        if (resources) {
          this.resources = resources;
          this.setResources(resources);
        } else {
          throw new Error("Failed to fetch resources");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    },
    async createResource(resourceData: {
      title: string;
      description: string;
      subject: string;
      topic: string;
      targetRegion: string;
      targetCountry: string;
      language: string;
      contentType: string;
      keywords?: string;
      createdBy?: ID;
    }) {
      const CREATE_RESOURCE = gql`
        mutation (
          $title: String!
          $description: String!
          $subject: String!
          $topic: String!
          $targetRegion: String
          $targetCountry: String
          $language: String
          $contentType: ResourceType!
          $keywords: String!
          $createdBy: ID!
        ) {
          createResource(
            title: $title
            description: $description
            subject: $subject
            topic: $topic
            targetRegion: $targetRegion
            targetCountry: $targetCountry
            language: $language
            contentType: $contentType
            keywords: $keywords
            createdBy: $createdBy
          ) {
            id
            title
            description  
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: CREATE_RESOURCE,
          variables: resourceData,
        });

        const newResource = response.data?.createResource;
        if (newResource) {
          this.resources.push(newResource);
          this.setResources(this.resources);
        } else {
          throw new Error("Failed to create resource");
        }
      } catch (error) {
        console.error("Error creating resource:", error);
      }
    },
    async updateResource(id: string, resourceData: Partial<Resource>) {
      const updateResourceMutation = gql`
        mutation (
          $id: ID!
          $title: String
          $description: String
          $content: String
          $targetRegion: String
          $targetCountry: String
          $slug: String
          $language: String
          $contentType: ResourceType
          $viewsNumber: Int
          $likesNumber: Int
          $sharesNumber: Int
          $rating: String
          $subject: String
          $topic: String
          $sessionId: String
          $accessKey: String
          $keywords: [String]
          $coverImage: String
          $isPublished: Boolean
          $averageRating: Float
          $reviews: [String]
        ) {
          updateResource(
            id: $id
            title: $title
            description: $description
            content: $content
            targetRegion: $targetRegion
            targetCountry: $targetCountry
            slug: $slug
            language: $language
            contentType: $contentType
            viewsNumber: $viewsNumber
            likesNumber: $likesNumber
            sharesNumber: $sharesNumber
            rating: $rating
            subject: $subject
            topic: $topic
            sessionId: $sessionId
            accessKey: $accessKey
            keywords: $keywords
            coverImage: $coverImage
            isPublished: $isPublished
            averageRating: $averageRating
            reviews: $reviews
          ) {
            id
            title
            description
            content
            targetRegion
            targetCountry
            slug
            language
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            rating
            sessionId
            accessKey
            keywords
            coverImage
            isPublished
            averageRating
            reviews
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                activationToken
                resetToken
                tokenExpiry
                activatedAccount
              }
              role
            }
            createdAt
            updatedAt
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: updateResourceMutation,
          variables: { id, ...resourceData },
        });

        const updatedResource = response.data?.updateResource;
        if (updatedResource) {
          const index = this.resources.findIndex((r) => r.id === id);
          if (index !== -1) {
            this.resources[index] = updatedResource;
            this.setResources(this.resources);
          }
        } else {
          throw new Error("Failed to update resource");
        }
      } catch (error) {
        console.error("Error updating resource:", error);
      }
    },

    // RESOURCE CONTENT ADDITIONS
    async submitEvent(id: string) {
      const submitResourceEvent = gql`
        mutation ($id: ID!) {
          submitResourceEvent(id: $id) {
            id
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: submitResourceEvent,
          variables: { id },
        });

        const submittedResourceId = response.data?.submitResourceEvent?.id;
        if (submittedResourceId) {
          this.resources = this.resources.filter(
            (r) => r.id !== submittedResourceId
          );
          this.setResources(this.resources);
        } else {
          throw new Error("Failed to delete resource");
        }
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    },

    async deleteResource(id: string) {
      const deleteResourceMutation = gql`
        mutation ($id: ID!) {
          deleteResource(id: $id) {
            id
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: deleteResourceMutation,
          variables: { id },
        });

        const deletedResourceId = response.data?.deleteResource?.id;
        if (deletedResourceId) {
          this.resources = this.resources.filter(
            (r) => r.id !== deletedResourceId
          );
          this.setResources(this.resources);
        } else {
          throw new Error("Failed to delete resource");
        }
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    },
  },
});
