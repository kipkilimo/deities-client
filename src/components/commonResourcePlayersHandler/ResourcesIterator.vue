<template>
  <v-container fluid>
    <!-- Top Row: Sort, Filter, Search Strip 
    <v-row>
      <v-col cols="12">
        <v-row align="center" justify="space-between"> 
          <v-col :cols="isMobile ? 12 : 4">
            <v-select
              v-model="sortOption"
              :items="sortOptions"
              label="Sort by"
              dense
              class="sort-filter-select"
            ></v-select>
          </v-col> 
          <v-col :cols="isMobile ? 12 : 4">
            <v-select
              v-model="filterOption"
              :items="filterOptions"
              label="Filter by"
              dense
              class="sort-filter-select"
            ></v-select>
          </v-col> 
          <v-col :cols="isMobile ? 12 : 4">
            <v-text-field
              v-model="searchQuery"
              label="Search"
              clearable
              dense
              prepend-inner-icon="mdi-file-search"
              class="sort-filter-select"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-2" />
-->

    <!-- Resource List and Selected Resource Display -->
    <v-row>
      <!-- For mobile, display only resource list -->
      <template v-if="isMobile">
        <v-col cols="12" class="pr-2">
          <v-row
            class="overflow-y-auto mt-1"
            style="max-height: 70vh; overflow-y: auto"
          >
            <v-col
              v-for="(resource, index) in sortedAndFilteredResources"
              :key="resource.id"
              class="pa-0"
            >
              <v-card
                class="mb-2 px-2 py-2"
                height="8rem"
                @click="selectResource(resource)"
                elevation="2"
              >
                <v-row no-gutters>
                  <v-col cols="3">
                    <v-img
                      height="4rem"
                      width="4rem"
                      :src="resource.coverImage"
                      class="rounded"
                    ></v-img>
                  </v-col>

                  <v-col cols="9" class="pl-2">
                    <v-card-title
                      class="text-body-1 font-weight-medium mb-1"
                      style="font-size: 1rem"
                    >
                      {{ resource.title }}
                    </v-card-title>
                    <p class="text-caption font-weight-light">
                      {{ truncateText(resource.description, 50) }}
                    </p>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </template>

      <!-- For desktop, show selected resource on left and resource list on right -->
      <template v-else>
        <v-col cols="10">
          <v-card
            v-if="!resourceComponent"
            @click="selectResource(resourceStore.resources[0])"
            class="d-flex align-center justify-center resource-placeholder"
          >
            <v-img
              height="21vh"
              class="mt-24 ma-4"
              src="https://cdn-icons-png.flaticon.com/512/907/907805.png"
            ></v-img>
          </v-card>

          <v-container fluid v-if="selectedResource && showMedia">
            <!-- Dynamic Resource Renderer -->
            <component :is="resourceComponent" :resource="selectedResource" />
          </v-container>
        </v-col>

        <v-col cols="2" class="pr-2">
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
                class="mb-2 px-2 py-2"
                @click="selectResource(resource)"
                elevation="2"
              >
                <v-row>
                  <v-col>
                    <img
                      width="32%"
                      height="100%"
                      :src="resource.coverImage"
                      class="rounded"
                    />
                  </v-col>
                  <!-- 
                   -->

                  <v-col cols="9">
                    <h4
                      class="text-body-2 font-weight-medium mb-1"
                      style="font-size: 0.9rem; color: #333; line-height: 1.2"
                    >
                      {{ resource.title }}
                    </h4>
                    <p
                      class="text-caption font-weight-light"
                      style="font-size: 0.8rem; color: #666"
                    >
                      {{ truncateText(resource.description, 50) }}
                    </p>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
.sort-filter-select {
  max-height: 67%;
}
.resource-placeholder {
  cursor: pointer;
  border-radius: 5px 5px 0px 0px !important;
}
.text-caption {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted } from "vue";
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
const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
};

// Run check on component mount
onMounted(checkIsMobile);
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

// Fetch resources before mounting the component
onBeforeMount(async () => {
  const taskType = localStorage.getItem("resourceType");
  const testype = localStorage.getItem("resourceType");
  const accessKey = ref("");
  if (testype !== null) {
    await resourceStore.getAllTestResources(accessKey.value);
    localStorage.removeItem("resourceType");
  } else if (taskType !== null) {
    await resourceStore.getAllTaskResources();
    localStorage.removeItem("resourceType");
  } else {
    const queryParams = localStorage.getItem("queryParams") || "";
    await resourceStore.getAllSpecificTypeResources(queryParams);
  }

  selectResource(resourceStore.resources[0]);
});
</script>

<style scoped>
.v-row {
  padding: 0 10px;
}
.v-card {
  transition: transform 0.3s;
}

.v-card:hover {
  transform: scale(1.02);
}

.text-caption {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
