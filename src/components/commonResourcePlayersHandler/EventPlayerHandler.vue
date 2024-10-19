<template>
  <v-container
    style="font-family: &quot;Inter&quot;, &quot;Noto Sans&quot;, sans-serif"
  >
    <!-- Top Row: Sort, Filter, Search Strip -->
    <v-row>
      <v-col cols="12">
        <v-row align="center">
          <!-- Sort Dropdown -->
          <v-col cols="4">
            <v-select
              v-model="sortOption"
              :items="sortOptions"
              label="Sort by"
              dense
              style="
                max-height: 67%;
                font-family: &quot;Inter&quot;, sans-serif;
              "
            ></v-select>
          </v-col>

          <!-- Filter Dropdown -->
          <v-col cols="4">
            <v-select
              v-model="filterOption"
              :items="filterOptions"
              label="Filter by"
              dense
              style="
                max-height: 67%;
                font-family: &quot;Inter&quot;, sans-serif;
              "
            ></v-select>
          </v-col>

          <!-- Search Field -->
          <v-col cols="4">
            <v-text-field
              v-model="searchQuery"
              label="Search"
              clearable
              dense
              prepend-inner-icon="mdi-file-search"
              style="
                max-height: 67%;
                font-family: &quot;Inter&quot;, sans-serif;
              "
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="mb-2" />

    <!-- Bottom Row: Two Column Layout -->
    <v-row>
      <!-- Right Column: Selected Resource -->
      <v-col cols="10">
        <v-card
          fluid
          v-if="!resourceComponent"
          @click="selectResource(resourceStore.resources[0])"
          height="63vh"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 5px 5px 0px 0px !important;
            font-family: &quot;Noto Sans&quot;, sans-serif;
          "
        >
          <v-img
            height="21vh"
            class="mt-24 ma-4"
            style="cursor: pointer"
            src="https://cdn-icons-png.flaticon.com/512/907/907805.png"
          ></v-img>
        </v-card>

        <v-container fluid v-if="selectedResource && showMedia">
          <!-- Dynamic Resource Renderer -->
          <component :is="resourceComponent" :resource="selectedResource" />
        </v-container>
      </v-col>
      <!-- Left Column: Resource Iterator Cards -->
      <v-col cols="2">
        <!-- Container for vertical scrolling -->
        <v-row
          class="overflow-y-auto mt-1"
          style="height: 400px; max-height: 400px; overflow-y: auto"
        >
          <v-col
            v-for="(resource, index) in sortedAndFilteredResources"
            :key="resource.id"
            class="pa-0"
          >
            <v-card
              fluid
              class="mb-2"
              height="4.5rem"
              @click="selectResource(resource)"
              style="font-family: &quot;Noto Sans&quot;, sans-serif"
            >
              <v-row no-gutters>
                <!-- Left Column: Image -->
                <v-col cols="4">
                  <v-img height="4.5rem" :src="resource.coverImage"></v-img>
                </v-col>

                <!-- Right Column: Details -->
                <v-col cols="8">
                  <v-card-title style="font-weight: 700">
                    {{ resource.title }}
                  </v-card-title>
                  <v-card-subtitle style="font-weight: 400">
                    {{ resource.subject }} - {{ resource.topic }}
                  </v-card-subtitle>
                  <v-card-text style="font-weight: 400">
                    {{ truncateText(resource.description, 50) }}
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from "vue";
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
import PollPlayer from "../resourcePlayers/polls/PollPlayerParticipant.vue";
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

const sortOptions = ref(["Title", "Date Created", "Subject"]);
const filterOptions = ref(["Biostatistics", "Probability Theory"]);
const searchQuery = ref("");
const sortOption = ref("");
const filterOption = ref("");
const selectedResource = ref({});
const showMedia = ref(false);

const truncateText = (text: string | undefined, length: number) => {
  if (!text) {
    return ""; // or return a default value or an empty string
  }
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// Computed property to filter and sort resources
const sortedAndFilteredResources = computed(() => {
  let filtered = resourceStore.resources.filter((resource) => {
    const matchesSearch = resource.title
      ? resource.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      : false;

    const matchesFilter =
      !filterOption.value || resource.subject === filterOption.value;

    return matchesSearch && matchesFilter;
  });

  if (sortOption.value === "Title") {
    filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption.value === "Date Created") {
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortOption.value === "Subject") {
    filtered = filtered.sort((a, b) => a.subject.localeCompare(b.subject));
  }

  return filtered;
});

const selectResource = async (resource: any) => {
  showMedia.value = false;
  await resourceStore.fetchResource(resource.id);
  selectedResource.value = resourceStore.resource;
  showMedia.value = true;
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
const currentIndex = ref(0);

// Assuming resourceStore is already imported and used in your setup
const resources = ref(resourceStore.resources);

const updateIndex = () => {
  currentIndex.value = (currentIndex.value + 1) % (resources.value.length || 1);
};

onMounted(() => {
  const intervalId = setInterval(updateIndex, 15000); // Update every 15 seconds

  // Clean up the interval on component unmount
  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
});
// Fetch resources before mounting the component
onBeforeMount(async () => {
  const queryParams = [
    {
      resourceType: "EVENT",
      subject: "",
      topic: "",
      country: "",
      targetRegion: "",
      language: "",
    },
  ];
  await resourceStore.getAllSpecificTypeResources(JSON.stringify(queryParams));
  selectResource(resourceStore.resources[currentIndex.value]);
});
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Noto+Sans:wght@400;700&display=swap");

.v-container {
  font-family: "Inter", "Noto Sans", sans-serif;
}

.v-select,
.v-text-field,
.v-card {
  font-family: "Inter", sans-serif;
}

.v-card-title {
  font-weight: 700;
}

.v-card-subtitle,
.v-card-text {
  font-weight: 400;
}
</style>
