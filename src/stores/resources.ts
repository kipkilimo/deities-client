import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { useAlertsStore } from "./alerts"; // Import alerts store

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

interface Option {
  label: string;
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
  participants: string;
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
    prediction: "",

    surveyLikertQuestion:
      "What is your take on NEMBio, 'The Hub for Interactive Life Sciences Research Tools.', after the introduction given?",
    surveyLikertOptions: [
      { label: "Waste of time" },
      { label: "Neutral" },
      { label: "Needs radical surgery" },
      {
        label:
          "Just minor modifications and it is good to go - These are my suggestions (write on provided paper).",
      },
      { label: "Excellent proposition. Can't wait to try it!" },
    ],
    exams: "",
    exam: "",
    tasks: "",
    task: "",
    resource: {} as Resource,
    resourceIsComputing: false,
    resources: [] as Resource[],
    filteredResources: [] as Resource[],
    sortBy: "title" as keyof Resource,
    filterByType: "" as string,
    showAddResourceCoverAndContentDialog: false,
    showCreateResourceDialog: false,
    showExamsDialog: false,
    showAssignmentsDialog: false,
  }),
  actions: {
    setQuestion(newQuestion: string) {
      this.surveyLikertQuestion = newQuestion;
    },

    setOptions(newOptions: Option[]) {
      this.surveyLikertOptions = newOptions;
    },

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
    async getAllTestResources(id: string) {
      const resourceQuery = gql`
        query ($id: ID!) {
          getResource(id: $id) {
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
                fullName
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
    async getAllTaskResources() {
      const GET_TASK_RESOURCES = gql`
        query {
          getAllTaskResources {
            id
            title
            description
            targetRegion
            targetCountry
            sessionId
            accessKey
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
          query: GET_TASK_RESOURCES,
        });

        const resources = response.data.getAllTaskResources;
        if (resources) {
          this.resources = resources;
        } else {
          throw new Error("Failed to fetch task resources");
        }
      } catch (error) {
        console.error("Error fetching task resources:", error);
      }
    },
    async getClinicalPrediction() {
      const CLINICAL_PREDICTION_MODEL = gql`
        query {
          getClinicalPrediction {
            id
            contentType
          }
        }
      `;

      try {
        const response = await client.query({
          query: CLINICAL_PREDICTION_MODEL,
        });

        const prediction = response.data.getClinicalPrediction;
        if (prediction) {
          this.prediction = prediction;
        } else {
          throw new Error("Failed to fetch prediction");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    },
    async getAllResources() {
      const RESOURCE_SUMMARY_QUERY = gql`
        query {
          getAllResources {
            id
            contentType
          }
        }
      `;

      try {
        const response = await client.query({ query: RESOURCE_SUMMARY_QUERY });

        const resources = response.data.getAllResources;
        if (resources) {
          this.resources = resources;
        } else {
          throw new Error("Failed to fetch resources");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    },
    async getAllSpecificTypeResources(resourceType: string) {
      const SPECIFIC_RESOURCE_TYPE = gql`
        query ($resourceType: String!) {
          getAllSpecificTypeResources(resourceType: $resourceType) {
            id
            title
            contentType
            viewsNumber
            likesNumber
            sharesNumber
            subject
            topic
            coverImage
            averageRating
          }
        }
      `;

      try {
        const response = await client.query({
          query: SPECIFIC_RESOURCE_TYPE,
          variables: { resourceType },
        });
        const resources = response.data?.getAllSpecificTypeResources;
        if (resources) {
          this.resources = resources;
        } else {
          throw new Error("Failed to fetch resources");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    },
    async getUserTasks(userId: string) {
      const GET_LATEST_TASKS = gql`
        query ($userId: String!) {
          getUserTasks(userId: $userId) {
            id
            title
            description
            content
            sessionId
            contentType
            accessKey
            coverImage
            isPublished
            createdBy {
              id

              personalInfo {
                username
                email
                scholarId
                fullName
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
          query: GET_LATEST_TASKS,
          variables: { userId },
        });

        const resources = response.data.getUserTasks;
        // @ts-ignore
        this.resources = resources;
      } catch (error) {
        this.resources = [];
        console.error("Error fetching resource:", error);
      }
    },
    async getPublisherLatestTasks(userId: string) {
      const GET_LATEST_TASKS = gql`
        query ($userId: String!) {
          getPublisherLatestTasks(userId: $userId) {
            assignmentType
            assignmentTitle
            assignmentDescription
            assignmentDuration
            assignmentDeadline
            assignmentAnswersKey
            assignmentTaskSet
            id
            title
            coverImage
            description
            subject
            topic
            createdBy {
              id
            }
            createdAt
            sessionId
            accessKey
            participants
          }
        }
      `;

      try {
        const response = await client.query({
          query: GET_LATEST_TASKS,
          variables: { userId },
        });

        const tasks = response.data.getPublisherLatestTasks;
        if (tasks) {
          this.tasks = JSON.stringify(tasks);
          this.showAssignmentsDialog = true;
        } else {
          throw new Error("Failed to fetch resource");
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    },
    async getCurrentExam(sessionId: string) {
      const GET_CURRENT_EXAM = gql`
        query ($sessionId: String!) {
          getCurrentExam(sessionId: $sessionId) {
            id
            title
            participants
            description
            examMetaInfo {
              examDate
              examStartTime
              examDuration
              examQuestionsSet
              # examAnswersKey
              examEndTime
              selectedTypes
              numberOfQuestions {
                SCQ
                MCQ
                ATF
                ETF
                VSAQ
                SAQ
                LEQ
              }
              testMeta {
                testType
                numberOfQuestions
              }
            }
            subject
            topic
            createdBy {
              id
            }
            createdAt
            sessionId
            accessKey
          }
        }
      `;

      try {
        const response = await client.query({
          query: GET_CURRENT_EXAM,
          variables: { sessionId },
        });

        const exam = response.data.getCurrentExam;
        if (exam) {
          this.exam = JSON.stringify(exam);
        } else {
          throw new Error("Failed to fetch resource");
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    },
    async getPublisherLatestExams(userId: string) {
      const GET_LATEST_EXAMS = gql`
        query ($userId: String!) {
          getPublisherLatestExams(userId: $userId) {
            id
            title
            participants
            description
            examMetaInfo {
              examDate
              examStartTime
              examDuration
              examEndTime
              selectedTypes
              numberOfQuestions {
                SCQ
                MCQ
                ATF
                ETF
                VSAQ
                SAQ
                LEQ
              }
              testMeta {
                testType
                numberOfQuestions
              }
            }
            subject
            topic
            createdBy {
              id
            }
            createdAt
            sessionId
            accessKey
          }
        }
      `;

      try {
        const response = await client.query({
          query: GET_LATEST_EXAMS,
          variables: { userId },
        });

        const exams = response.data.getPublisherLatestExams;
        if (exams) {
          this.exams = JSON.stringify(exams);
          this.showExamsDialog = true;
        } else {
          throw new Error("Failed to fetch resource");
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    },
    async getPublisherLatestPoll(userId: string) {
      const GET_LATEST_POLL = gql`
        query ($userId: String!) {
          getPublisherLatestPoll(userId: $userId) {
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
                fullName
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
          query: GET_LATEST_POLL,
          variables: { userId },
        });

        const resource = response.data.getPublisherLatestPoll;
        if (resource) {
          this.resource = resource;
        } else {
          throw new Error("Failed to fetch resource");
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    },
    // async GetPollDataAndResults($pollId: string) {

    async GetPollDataAndResults(pollId: string) {
      const GetPollDataAndResults = gql`
        query ($pollId: String!) {
          GetPollDataAndResults(pollId: $pollId) {
            responses
          }
        }
      `;

      try {
        const response = await client.query({
          query: GetPollDataAndResults,
          variables: { pollId },
        });

        const resource = response.data?.GetPollDataAndResults;
        if (resource) {
          this.resource = resource;
        } else {
          throw new Error("Failed to fetch resource");
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    },
    async fetchComputingResource(topicParams: string) {
      const FETCH_COMPUTING_RESOURCE = gql`
        query ($topicParams: String!) {
          fetchComputingResource(topicParams: $topicParams) {
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
                fullName
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
        this.resource = {
          id: "",
          title: "",
          description: "",
          content: "",
          targetRegion: "",
          targetCountry: "",
          slug: "",
          language: "",
          contentType: "",
          viewsNumber: 0,
          likesNumber: 0,
          sharesNumber: 0,
          subject: "",
          topic: "",
          rating: "",
          sessionId: "",
          accessKey: "",
          keywords: "",
          coverImage: "",
          isPublished: false,
          averageRating: 0,
          reviews: "",
          createdBy: "",
          createdAt: "",
          updatedAt: "",
        } as Resource;
        const response = await client.query({
          query: FETCH_COMPUTING_RESOURCE,
          variables: { topicParams },
        });

        const resource = response.data.fetchComputingResource;

        if (resource !== null) {
          this.resource = resource; // Clone the resource object
        } else {
          // If resource is null, initialize a new object with the desired contentType
          this.resource.contentType = "COMPUTING";
        }

        return;
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
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
            participants
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
                fullName
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
            sessionId
            accessKey
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
            contentType
            title
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: CREATE_RESOURCE,
          variables: resourceData,
        });

        const newResource = response.data.createResource;
        this.resource = newResource;
        this.resources.push(newResource);
        this.resources = this.resources;
      } catch (error) {
        console.error("Error creating resource:", error);
      }
    },
    //     //     addResourceFormContent(resourceDetails: String!): Resource!         // resourceContent,resourceId
    async addResourceFormContent(resourceDetails: { resourceDetails: string }) {
      const ADD_RESOURCE_FORM_INPUT = gql`
        mutation ($resourceDetails: String!) {
          addResourceFormContent(resourceDetails: $resourceDetails) {
            id
            contentType
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: ADD_RESOURCE_FORM_INPUT,
          variables: resourceDetails,
        });

        const newResource = response.data.addResourceFormContent;
        this.resource = newResource;
        this.resources.push(newResource);
        this.resources = this.resources;
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
            slug
            language
            contentType

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
          const index = this.resources.findIndex((res) => res.id === id);
          if (index !== -1) {
            this.resources[index] = updatedResource;
          }
          this.resource = updatedResource;
        } else {
          throw new Error("Failed to update resource");
        }
      } catch (error) {
        console.error("Error updating resource:", error);
      }
    },
  },
});
