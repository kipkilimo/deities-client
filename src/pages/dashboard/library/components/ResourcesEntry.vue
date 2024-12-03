<template>
  <v-container class="my-1">
    <!-- Progress bar shown while loading resources -->
    <v-progress-linear
      color="#08487f"
      v-if="settingUpLibrary"
      indeterminate
      class="mb-2"
    ></v-progress-linear>

    <v-row dense>
      <v-col>
        <h3>
          {{ resourceStore.currentSubjectArea }} >
          <span
            style="cursor: pointer; color: #08487f"
            @click="
              resourceStore.showingResourceTitles = true;
              resourceStore.showingResourceTitleItems = false;
            "
          >
            {{ resourceStore.activeTitle }}
          </span>
        </h3>
        <v-divider class="mt-1" />
        <v-alert
          variant="outlined"
          v-if="resourceStore.resources.length === 0"
          text="Please check back soon!"
          title="Resources being added..."
          type="info"
        ></v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div
          v-for="(resourcesByType, type) in groupedResources"
          :key="type"
          class="mb-4"
        > 
          <v-row class="d-flex overflow-x-auto" wrap align="center">
            <v-col v-for="(resource, index) in resourcesByType" :key="index">
              <v-card
                :disabled="loading"
                :loading="loading"
                max-width="24rem"
                class="transition hoverable"
                outlined
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
              > 
                <v-img
                  height="250"
                  :src="resource.coverImage"
                  class="cover-image"
                  cover
                  @click="goToResourceRenderer(resource)"
                  style="cursor: pointer"
                ></v-img>

                <v-card-item>
                  <v-card-title>{{ resource.topic }}</v-card-title>
                  <v-card-subtitle>
                    <span>{{ resource.contentType }}</span>
                    <v-icon
                      color="info"
                      class="mb-1"
                      :icon="getResourceIcon(resource.contentType)"
                      size="small"
                    ></v-icon>
                    <i>
                      Published on {{ formatShortDate(resource.createdAt) }}
                    </i>
                  </v-card-subtitle>
                </v-card-item>

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
                    <div class="text-grey ms-4">{{ resource.averageRating }}</div>
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

                  <div><v-card-subtitle>{{ resource.description }}</v-card-subtitle></div>
                </v-card-text>

                <v-divider class="mt-3" />
                <v-card-actions>
                  <v-btn
                    color="primary"
                    text
                    block
                    @click="goToResourceRenderer(resource)"
                  >
                    Explore Resource
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-divider class="mt-3" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useResourceStore } from "@/stores/resources";

const router = useRouter();
const resourceStore = useResourceStore();
const settingUpLibrary = ref(true);
const isHovered = ref(false);

// Dynamically group resources by their content type
const groupedResources = computed(() => {
  return resourceStore.resources.reduce((acc, resource) => {
    const type = resource.contentType || "Uncategorized";
    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);
    return acc;
  }, {});
});

// Define resource icons based on their content type
function getResourceIcon(contentType) {
  const resourceIcons = {
    AUDIO: "mdi-music",
    VIDEO: "mdi-video",
    DOCUMENT: "mdi-file-document-outline",
    MIXED: "mdi-file-multiple",
    TEXT: "mdi-file-document-edit-outline",
    PRESENTATION: "mdi-play-box-outline",
    ARTICLE: "mdi-newspaper",
    TASK: "mdi-check-circle-outline",
  };
  return resourceIcons[contentType] || "mdi-help-circle-outline";
}

// Format timestamps to a readable date
function formatShortDate(timestamp) {
  const date = new Date(Number(timestamp));
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formatter.format(date);
}

// Simulate loading effect
onMounted(() => {
  setTimeout(() => {
    settingUpLibrary.value = false;
  }, 1000);
});

// Navigation to the resource renderer
// Navigation and data-saving functions
function goToResourceRenderer(resource) {
  settingUpLibrary.value = true;
  console.log("Resource Type:", resource.contentType);
  localStorage.setItem("intialItemId", resource.id);
  localStorage.setItem(
    "queryParams",
    JSON.stringify([
      { ...[], resourceId: resource.id, resourceType: resource.contentType },
    ])
  );
  router.push(
    resource.contentType === "TEST" ? "/exam/mocks" : "/dashboard/player"
  );
  setTimeout(() => {
    settingUpLibrary.value = false;
  }, 1000);
}
</script>

<style>
.hoverable:hover {
  transform: scale(1.03);
  transition: transform 0.3s ease;
}
.cover-image {
  cursor: pointer;
}
</style>

<style scoped>
.resource-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
  padding-bottom: 3rem;
}
.resource-card:hover {
  transform: scale(1.0025);
  box-shadow: 0px 10px 20px rgba(26, 25, 25, 0.7);
}
.fixed-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
}
.resource-icon {
  font-size: 2.5rem;
}
.resource-name {
  font-size: 1.5rem;
  font-weight: 600;
}
.resource-description {
  font-size: 1.1rem;
  color: #555;
}
.v-btn {
  text-transform: uppercase;
  border-radius: 4px !important;
}
</style>
<style>
.sort-filter-select {
  margin: 8px 0;
}
</style>
<style scoped>
.no-scroll {
  overflow: hidden; /* Remove outer scrollbar */
  height: 100vh; /* Set full viewport height */
}

.scrollableList {
  overflow-y: auto; /* Enable scrolling only for the list */
  height: calc(
    100vh - 200px
  ); /* Adjust height dynamically, 200px for header, margins */
  padding-right: 8px; /* Add padding to avoid scroll bar overlap */
}
</style>
<style>
.carousel-container {
  overflow: hidden;
}
.flicking-panel {
  display: flex;
  justify-content: center;
  align-items: stretch;
}
.resource-card {
  width: 100%;
}
</style>
<style scoped>
.aesthetic-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.cover-image {
  max-height: 13.5rem; /* Adjust height as needed */
  width: 100%;
  background-position: center center;
  background-size: cover;
}

.info-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title-section {
  display: flex;
  flex-direction: column;
  color: #333; /* Adjust text color as needed */
}

.stats {
  display: flex;
  align-items: center;
  color: #888; /* Adjust stats color as needed */
  font-size: 0.8rem;
}

.stats > * {
  margin-right: 8px; /* Adjust spacing between stats */
}
</style>
<style scoped>
.v-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.v-card.hover {
  transform: scale(1.025); /* Increase size by 5% */
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3); /* Stronger shadow */
}
</style>
