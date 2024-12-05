<template>
  <v-container fluid>
    <!-- Top Row: Sort, Filter, Search Strip 
-->
    <v-row align="center" justify="space-between">
      <v-col cols="12" style="width: 100%; padding: 2px">
        <v-row align="center" style="flex-wrap: wrap; margin: 0">
          <v-col
            :cols="isMobile ? 6 : 4"
            class="mt-4"
            style="padding: 0 2px; min-width: 250px"
          >
            <v-text-field
              v-model="searchQuery"
              label="Search"
              clearable
              dense
              prepend-inner-icon="mdi-file-search"
              class="sort-filter-select"
            ></v-text-field>
          </v-col>
          <v-col
            v-for="(field, key) in filterFields"
            :key="key"
            :cols="isMobile ? 6 : 2"
            style="padding: 0 2px; min-width: 100px"
          >
            <v-select
              v-model="formData[key]"
              :items="field.options"
              :label="field.label"
              :hint="field.hint"
              dense
              outlined
              hide-details
              style="width: 100%"
            ></v-select>
          </v-col>
          <v-col
            :cols="isMobile ? 6 : 2"
            class="mt-4"
            style="padding: 0 2px; min-width: 100px"
          >
            <v-select
              dense
              v-model="sortOption"
              :items="sortOptionText"
              label="Sort By"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

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
                class="mx-auto"
                href=""
                max-width="344"
                :prepend-icon="getResourceIcon(resource.contentType)"
                rel="noopener"
                :subtitle="truncateText(resource.description, 50)"
                target="_blank"
                :title="resource.title"
                @click="selectResource(resource)"
              ></v-card>
            </v-col>
          </v-row>
        </v-col>
      </template>

      <!-- For desktop, show selected resource on left and resource list on right -->
      <template v-else>
        <v-col cols="10">
          <v-card
            v-if="!resourceComponent"
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
            style="height: 96vh; max-height: 96vh; overflow-y: auto"
          >
            <v-col
              v-for="(resource, index) in sortedAndFilteredResources"
              :key="resource.id"
              class="pa-0"
              cols="12"
            >
              <v-card
                class="mx-auto mb-2"
                href=""
                width="100%"
                :prepend-icon="getResourceIcon(resource.contentType)"
                style="height: 15rem; max-height: 15rem"
                color="#fff1dd"
                rel="noopener"
                target="_blank"
                :sub-title="resource.title"
                @click="selectResource(resource)"
              >
                <v-img
                  width="100%"
                  :src="resource.coverImage"
                  height="40%"
                  cover
                ></v-img>
                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :model-value="resource.averageRating"
                      color="amber"
                      density="compact"
                      size="small"
                      half-increments
                      readonly
                    ></v-rating>
                    <div class="text-grey ms-4">
                      {{ resource.averageRating }}
                    </div>
                  </v-row>

                  <div class="my-4 text-subtitle-1">
                    <v-chip-group multiple column>
                      <v-chip
                        v-for="(keyword, index) in JSON.parse(
                          resource.keywords
                        )"
                        :key="index"
                        class="ma-1"
                        color="primary"
                        text-color="white"
                        size="x-small"
                        outlined
                      >
                        {{ keyword }}
                      </v-chip>
                    </v-chip-group>
                  </div>
                </v-card-text>
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
import {
  ref,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onUnmounted,
} from "vue";
import { useRouter } from "vue-router";
import { useResourceStore } from "@/stores/resources";
import staticResources from "@/data/staticResources";
import worldRegions from "@/data/languages";
import topicsData from "@/data/topics";
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
import { useUserStore } from "@/stores/users";
const userId = localStorage.getItem("sessionId");

const resourceStore = useResourceStore();
const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
};

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
  OPPORTUNITY: "OPPORTUNITY",
  TASK: "TASK",
  MODEL: "MODEL",
} as const;

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
  const resourceParamsRaw = localStorage.getItem("queryParams") || "";

  const resourceParams = JSON.parse(resourceParamsRaw);
  const vals = resourceStore.resources;
  console.log({ filtered1Types: resourceParams[0], allItems: vals });
  let filtered1 = vals.filter(
    (resource) => resource.contentType === resourceParams[0].resourceType
  );
  console.log({ filtered1 });

  return filtered1;
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
  console.log({ resource, userId });
  showMedia.value = false;
  await resourceStore.fetchResource(resource.id);
  showMedia.value = true;
  const userStore = useUserStore();
  const resourceId = resource.id;
  // @ts-ignore
  await userStore.handleAddResourceToRecents(
    // @ts-ignore
    userId,
    resourceId
  );
};
// Run check on component mount
onMounted(async () => {
  checkIsMobile;
  // @ts-ignore
  //handleAddResourceToRecents
});
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
    [ResourceType.OPPORTUNITY]: JobPlayer,
    [ResourceType.TASK]: AssignmentTaskPlayer,
    [ResourceType.LINK]: LinksPlayer,
    [ResourceType.MODEL]: ModelPlayer,
  };
  // @ts-ignore
  return componentMap[selectedResource.value.contentType];
});
// Filter fields configuration
const formData = ref({
  selectedSubject: "",
  selectedTopicConcept: "",
  selectedTopic: "",
  selectedTargetRegion: "",
  selectedCountry: "",
  selectedLanguage: "",
});
// selectedSubject: {
//   label: "Subject",
//   hint: "What do you want to study?",
//   options: subjects.value,
// },
// selectedTopicConcept: {
//   label: "Resource Level",
//   hint: "Resource Level",
//   options: ref([]),
// },
// selectedTopic: { label: "Topic", hint: "Topic to study", options: ref([]) },
function getResourceIcon(contentType: string | number) {
  const resourceIcons = {
    AUDIO: "mdi-music",
    VIDEO: "mdi-video",
    IMAGES: "mdi-image",
    DOCUMENT: "mdi-file-document-outline",
    MIXED: "mdi-file-multiple",
    TEXT: "mdi-file-document-edit-outline",
    PRESENTATION: "mdi-play-box-outline",
    EVENT: "mdi-calendar",
    DATASET: "mdi-database",
    LINK: "mdi-link-variant",
    POLL: "mdi-poll",
    TEST: "mdi-clipboard-text",
    MODEL: "mdi-cube-outline",
    POSTER: "mdi-poster-outline",
    ARTICLE: "mdi-newspaper",
    OPPORTUNITY: "mdi-briefcase",
    TASK: "mdi-check-circle-outline",
    COMPUTING: "mdi-server",
  };

  // Return the matched icon or a default icon if not found
  return resourceIcons[contentType] || "mdi-help-circle-outline";
}
const sortOptions = ref([
  { text: "Name (A-Z)", value: "name-asc" },
  { text: "Name (Z-A)", value: "name-desc" },
  { text: "Field (A-Z)", value: "field-asc" },
  { text: "Field (Z-A)", value: "field-desc" },
  { text: "Years (Oldest to Newest)", value: "years-asc" },
  { text: "Years (Newest to Oldest)", value: "years-desc" },
]);
const filterFields = ref({
  selectedTargetRegion: {
    label: "Region",
    hint: "Resource region",
    options: computed(() => Object.keys(worldRegions)),
  },
  selectedCountry: {
    label: "Country",
    hint: "Target country",
    options: ref([]),
  },
  selectedLanguage: {
    label: "Language",
    hint: "Resource language",
    options: ref([]),
  },
});

const sortOptionText = sortOptions.value.map((option) => option.text);
// Watchers for dynamic option changes
watch(
  () => formData.value.selectedSubject,
  (val) => {
    formData.value.selectedTopicConcept = "";
    filterFields.value.selectedTopicConcept.options = val
      ? Object.keys(topicsData[val])
      : [];
  }
);
watch(
  () => formData.value.selectedTopicConcept,
  (val) => {
    formData.value.selectedTopic = "";
    filterFields.value.selectedTopic.options = val
      ? topicsData[formData.value.selectedSubject][val]
      : [];
  }
);
const unLanguages = [
  {
    number: 1,
    isUNLanguage: true,
    name: "Arabic",
    speakers_million: 100,
    trends: "Stable with growth in modern usage and digital communication.",
  },
  {
    number: 2,
    isUNLanguage: true,
    name: "Chinese",
    speakers_million: 1100,
    trends: "Rapid expansion due to global trade and cultural exchange.",
  },
  {
    number: 3,
    isUNLanguage: true,
    name: "English",
    speakers_million: 1500,
    trends:
      "Widely used as a global lingua franca and in international diplomacy.",
  },
  {
    number: 4,
    isUNLanguage: true,
    name: "French",
    speakers_million: 300,
    trends:
      "Steady growth, especially in Africa, with significant cultural influence.",
  },
  {
    number: 5,
    isUNLanguage: true,
    name: "Russian",
    speakers_million: 260,
    trends:
      "Stable, with regional influence in post-Soviet states and global institutions.",
  },
  {
    number: 6,
    isUNLanguage: true,
    name: "Spanish",
    speakers_million: 500,
    trends:
      "Increasing influence due to population growth in Latin America and the U.S.",
  },
];

watch(
  () => formData.value.selectedTargetRegion,
  (val) => {
    formData.value.selectedCountry = "";
    formData.value.selectedLanguage = "";

    filterFields.value.selectedCountry.options = val
      ? worldRegions[val].countries
      : [];

    filterFields.value.selectedLanguage.options = val
      ? [
          ...worldRegions[val].languages.map((lang) => lang.name),
          ...unLanguages.map((lang) => lang.name),
        ]
      : unLanguages.map((lang) => lang.name);
  }
);
// Fetch resources before mounting the component
onBeforeMount(async () => {
  const taskType = localStorage.getItem("resourceType");

  const intialItemId = localStorage.getItem("intialItemId");
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

  // selectResource(resourceStore.resources[0]);
  const intialItem = resourceStore.resources.filter(
    (resource) => resource.id === intialItemId
  );
  await resourceStore.fetchResource(intialItem[0].id);
  selectedResource.value = resourceStore.resource;
  showMedia.value = true;
  const userStore = useUserStore();
  const resourceId = intialItem[0].id;
  // @ts-ignore
  await userStore.handleAddResourceToRecents(
    // @ts-ignore
    userId,
    resourceId
  );
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
