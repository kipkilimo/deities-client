<template>
  <v-container fluid>
    <!-- Top Row: Sort, Filter, Search Strip -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-row align="center">
          <!-- Sort Dropdown -->
          <v-col cols="4">
            <v-select
              v-model="sortOption"
              :items="sortOptions"
              label="Sort by"
              dense
            ></v-select>
          </v-col>

          <!-- Filter Dropdown -->
          <v-col cols="4">
            <v-select
              v-model="filterOption"
              :items="filterOptions"
              label="Filter by"
              dense
            ></v-select>
          </v-col>

          <!-- Search Field -->
          <v-col cols="4">
            <v-text-field
              v-model="searchQuery"
              label="Search"
              clearable
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Bottom Row: Two Column Layout -->
    <v-row>
      <!-- Left Column: Resource Iterator Cards -->
      <v-col cols="3" class="pr-2">
        <v-sheet height="400" class="overflow-y-auto">
          <v-card
            v-for="resource in filteredResources"
            :key="resource.id"
            class="mb-2"
            @click="selectResource(resource)"
          >
            <v-row>
              <!-- Left Column: Image -->
              <v-col cols="3">
                <v-img :src="resource.coverImage" class="cover-image"></v-img>
              </v-col>

              <!-- Right Column: Details -->
              <v-col cols="9">
                <v-card-title>{{ resource.title }}</v-card-title>
                <v-card-subtitle>
                  {{ resource.subject }} - {{ resource.topic }}
                </v-card-subtitle>
                <v-card-text>
                  {{ truncateText(resource.description, 50) }}
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-sheet>
      </v-col>

      <!-- Right Column: Selected Resource -->
      <v-col cols="9">
        <v-card v-if="selectedResource">
          <!-- Dynamic Resource Renderer -->
          <component :is="resourceComponent" :resource="selectedResource" />

          <!-- Lower Strip with Action Buttons -->
          <v-divider></v-divider>
          <v-card-actions>
            <!-- Left Button Group -->
            <v-row no-gutters>
              <v-col cols="auto">
                <v-btn icon @click="skipPrev">
                  <v-icon>mdi-skip-previous</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn icon @click="prev">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn icon @click="next">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn icon @click="skipNext">
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Right Button Group -->
            <v-row>
              <v-col cols="6">
                <v-btn icon @click="fullWidth">
                  <v-icon>mdi-rectangle-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn icon @click="fullScreen">
                  <v-icon>mdi-fullscreen</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VideoPlayer from "../resourcePlayers/video/VideoPlayer.vue";
import AudioPlayer from "../resourcePlayers/audio/AudioPlayer.vue";
import ImagePlayer from "../resourcePlayers/images/ImagePlayer.vue";
import DatasetPlayer from "../resourcePlayers/datasets/DatasetPlayer.vue";
import DocumentPlayer from "../resourcePlayers/pdf/DocumentPlayer.vue";
import SlidesPlayer from "../resourcePlayers/presentation/SlidesPlayer.vue";
import TestPlayer from "../resourcePlayers/test/TestPlayer.vue";
import PosterPlayer from "../resourcePlayers/posters/PosterPlayer.vue";
import EventPlayer from "../resourcePlayers/events/EventPlayer.vue";
import ArticlePlayer from "../resourcePlayers/articles/ArticlePlayer.vue";
import PollPlayer from "../resourcePlayers/polls/PollPlayer.vue";
import JobPlayer from "../resourcePlayers/jobs/JobPlayer.vue";
import AssignmentTaskPlayer from "../resourcePlayers/tasks/AssignmentTaskPlayer.vue";
import LinksPlayer from "../resourcePlayers/links/LinksPlayer.vue";
import ModelPlayer from "../resourcePlayers/models/ModelPlayer.vue";
import { useResourceStore } from "../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
// Define ResourceType as a constant object with keys
const ResourceType = {
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  IMAGES: "IMAGES",
  DOCUMENT: "DOCUMENT",
  PRESENTATION: "PRESENTATION",
  EVENT: "EVENT",
  DATASET: "DATASET",
  LINK: "LINK",
  POLL: "POLL",
  TEST: "TEST",
  POSTER: "POSTER",
  ARTICLE: "ARTICLE",
  JOB: "JOB",
  TASK: "TASK",
  MODEL: "MODEL",
} as const;

const getResources = ref([
  {
    id: "66c768cc0a18b25cc8c357f2",
    title: "Poisson distribution",
    coverImage:
      "https://a2z-v0.s3.eu-central-1.amazonaws.com/290ef771-5d29-49bd-866e-318fe1a621ea-Poisson-Distribution.webp",
    description:
      "In probability theory and statistics, the Poisson distribution is a discrete probability distribution that expresses the probability of a given number of events occurring in a fixed interval of time if these events occur with a known constant mean rate and independently of the time since the last event.",
    contentType: ResourceType.VIDEO, // Using the key from ResourceType
    content: [
      "https://a2z-v0.s3.eu-central-1.amazonaws.com/0ff292c6-6fdb-4878-bfea-d6701012176e-An Introduction to the Poisson Distribution.mp4",
    ],
    subject: "Biostatistics",
    topic: "Probability Theory",
    keywords: '["poisson","model","distributions","probability"]',
    createdBy: {
      personalInfo: {
        username: "kipkilimo-snow",
      },
    },
  },
  // More resource objects can go here...
]);

const sortOptions = ref(["Title", "Date Created", "Subject"]);
const filterOptions = ref(["Biostatistics", "Probability Theory"]);
const searchQuery = ref("");
const sortOption = ref("");
const filterOption = ref("");
const selectedResource = ref(null);

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const filteredResources = computed(() => {
  return getResources.value.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesFilter = filterOption.value
      ? resource.subject === filterOption.value
      : true;
    return matchesSearch && matchesFilter;
  });
});

const selectResource = (resource: any) => {
  selectedResource.value = resource;
  resourceStore.resource = resource;
};

const resourceComponent = computed(() => {
  if (!selectedResource.value) return null;

  const componentMap = {
    [ResourceType.VIDEO]: VideoPlayer,
    [ResourceType.AUDIO]: AudioPlayer,
    [ResourceType.IMAGES]: ImagePlayer,
    [ResourceType.DATASET]: DatasetPlayer,
    [ResourceType.DOCUMENT]: DocumentPlayer,
    [ResourceType.PRESENTATION]: SlidesPlayer,
    [ResourceType.TEST]: TestPlayer,
    [ResourceType.POSTER]: PosterPlayer,
    [ResourceType.EVENT]: EventPlayer,
    [ResourceType.ARTICLE]: ArticlePlayer,
    [ResourceType.POLL]: PollPlayer,
    [ResourceType.JOB]: JobPlayer,
    [ResourceType.TASK]: AssignmentTaskPlayer,
    [ResourceType.LINK]: LinksPlayer,
    [ResourceType.MODEL]: ModelPlayer,
  };
  // @ts-ignore
  return componentMap[selectedResource.value.contentType];
});

// Button click handler methods
const skipPrev = () => {
  // Handle skip previous action
  console.log("Skip Previous clicked");
};

const prev = () => {
  // Handle previous action
  console.log("Previous clicked");
};

const next = () => {
  // Handle next action
  console.log("Next clicked");
};

const skipNext = () => {
  // Handle skip next action
  console.log("Skip Next clicked");
};

const fullWidth = () => {
  // Handle full width action
  console.log("Full Width clicked");
};

const fullScreen = () => {
  // Handle full screen action
  console.log("Full Screen clicked");
};
</script>
