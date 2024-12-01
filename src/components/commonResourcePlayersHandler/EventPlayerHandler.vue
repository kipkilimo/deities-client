<template>
  <v-container
    style="font-family: &quot;Inter&quot;, &quot;Noto Sans&quot;, sans-serif"
    fluid
  >
    <!-- Top Row: Sort, Filter, Search Strip -->
    <!-- Add your sort, filter, and search components here -->

    <v-divider class="mb-2" />

    <!-- Bottom Row: Two Column Layout -->
    <v-row>
      <!-- Right Column: Selected Resource -->
      <v-col cols="12" md="10">
        <v-card
          v-if="sortedAndFilteredResources.length === 0"
          fluid
          @click="selectResource(resourceStore.resources[0])"
          height="63vh"
          class="center-content cursor-pointer rounded-top"
        >
          <v-img
            height="21vh"
            class="mt-24 ma-4 cursor-pointer"
            src="https://cdn-icons-png.flaticon.com/512/907/907805.png"
          ></v-img>
        </v-card>

        <v-container fluid v-if="sortedAndFilteredResources.length >=1">
          <!-- Dynamic Resource Renderer -->
          <EventPlayer />
        </v-container>
      </v-col>

      <!-- Left Column: Resource Iterator Cards -->
      <v-col cols="12" md="2">
        <!-- Container for vertical scrolling -->
        <v-row
          class="overflow-y-auto mt-9"
          style="height: 400px; max-height: 400px"
        >
          <v-col
            v-for="(resource, index) in sortedAndFilteredResources"
            :key="resource.id"
            class="pa-0"
          >
            <v-card
              fluid
              class="mb-2 resource-card cursor-pointer"
              height="4.5rem"
              @click="selectResource(resource)"
            >
              <v-row no-gutters>
                <!-- Left Column: Image -->
                <v-col cols="4">
                  <v-img height="4.5rem" :src="resource.coverImage" />
                </v-col>

                <!-- Right Column: Details -->
                <v-col cols="8">
                  <v-card-title class="resource-title">{{
                    resource.title
                  }}</v-card-title>
                  <v-card-subtitle class="resource-subtitle">
                    {{ resource.subject }} - {{ resource.topic }}
                  </v-card-subtitle>
                  <v-card-text class="resource-text">
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
import { ref, watch, computed, onMounted, onBeforeMount } from "vue";
import { useResourceStore } from "../../stores/resources";

const resourceStore = useResourceStore();
const retrievedParamsRaw = resourceStore.resource.content;
const retrievedParams = retrievedParamsRaw
  ? JSON.parse(retrievedParamsRaw)
  : [];
const currentEvent = retrievedParams[0];

const sortOptions = ref(["Title", "Date Created", "Subject"]);
const filterOptions = ref(["Biostatistics", "Probability Theory"]);
const searchQuery = ref("");
const sortOption = ref("");
const filterOption = ref("");
const selectedResource = ref({});
const showMedia = ref(false);

const truncateText = (text: string | undefined, length: number) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

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

const selectResource = async (resource: { id: string; title: string; description: string; content: string; targetRegion: string; targetCountry: string; slug: string; language: string; contentType: string; viewsNumber: number; likesNumber: number; sharesNumber: number; subject: string; topic: string; rating: string; participants: string; sessionId: string; accessKey: string; keywords: string; coverImage: string; isPublished: boolean; averageRating: number; reviews: string; createdBy: string; createdAt: string; updatedAt: string; }) => {
  showMedia.value = false;
  await resourceStore.fetchResource(resource.id);
  selectedResource.value = resourceStore.resource;
};

const selectFirstResource = () => {
  selectResource(resourceStore.resources[0]);
  showMedia.value = true;
};

watch(currentEvent, (newValue) => {
  if (newValue) selectFirstResource;
});
 
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
  selectResource(resourceStore.resources[0])

  showMedia.value = true;
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

.resource-card {
  border-radius: 5px;
  overflow: hidden;
}

.resource-title {
  font-weight: 700;
}

.resource-subtitle,
.resource-text {
  font-weight: 400;
}

.center-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor-pointer {
  cursor: pointer;
}

.rounded-top {
  border-radius: 5px 5px 0 0 !important;
}

@media (max-width: 600px) {
  .v-card {
    height: auto;
  }
  .v-row {
    flex-direction: column;
  }
}
</style>
