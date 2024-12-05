<template>
  <v-container class="my-5" v-if="resourceStore.showTopics">
    <!-- Progress bar shown while loading resources -->
    <v-progress-linear
      color="#08487f"
      v-if="settingUpLibrary"
      indeterminate
    ></v-progress-linear>
    <v-card-title primary-title>
      <h3>{{ resourceStore.currentSubjectArea }}</h3>
    </v-card-title>
    <!-- <v-row>
      <v-col cols="12">
        <v-row align="center" justify="space-between"> 
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
            <v-select
              v-model="sortOption"
              :items="sortOptions"
              label="Sort by"
              dense
              class="sort-filter-select"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
    <v-divider />
    <v-row class="mt-2" dense>
      <!-- Dynamic Topics Cards -->
      <v-col
        v-for="(titles, category) in topicCategories"
        :key="category"
        cols="12"
        md="4"
      >
        <v-card>
          <v-card-subtitle primary-title>
            <h3>
              {{
                category === "An introduction to specialised topics"
                  ? category +
                    " " +
                    "in" +
                    " " +
                    resourceStore.currentSubjectArea
                  : category
              }}
            </h3>
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-chip-group column>
            <v-chip
              class="ma-2"
              size="x-large"
              v-for="title in titles"
              :key="title"
              @click="handleGetAllTopicResources(title)"
            >
              <v-list-item-content>{{ title }}</v-list-item-content>
            </v-chip>
          </v-chip-group>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useResourceStore } from "@/stores/patients";
import titlesData from "@/data/topics";

const resourceStore = useResourceStore();
const settingUpLibrary = ref(true);

// Reactive variable for selected subject
const titles = titlesData;

// Define categories to loop through for dynamic rendering
const topicCategories = computed(() => {
  if (
    !resourceStore.currentSubjectArea ||
    !titles[resourceStore.currentSubjectArea]
  )
    return {};

  return {
    "Core Concepts":
      titles[resourceStore.currentSubjectArea]["Core Concepts"] || [],
    "An introduction to specialised topics":
      titles[resourceStore.currentSubjectArea][
        "An introduction to specialised topics"
      ] || [],
    "Specialised Data Collection & Management Methods":
      titles[resourceStore.currentSubjectArea][
        "Specialised Data Collection & Management Methods"
      ] || [],
  };
});

// Responsive design check
const isMobile = ref(false);
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 600;
};

// Set up the initial check and listen to resize events
onMounted(() => {
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);

  // Simulate loading delay
  setTimeout(() => {
    settingUpLibrary.value = false;
  }, 900);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIsMobile);
});
const router = useRouter();
const searchQuery = ref("");
const filterOption = ref(null);
const sortOption = ref(null);
onMounted(() => {
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIsMobile);
});

// Fetch resources on load
// onMounted(async () => {
//   await resourceStore.getAllResources();
//   setTimeout(() => {
//     settingUpLibrary.value = false;
//   }, 900);
// });

// Computed property for search, filter, and sort
const filteredSortedResources = computed(() => {
  let resources = staticResources.staticResources.value;

  // Filter by option if selected
  if (filterOption.value) {
    resources = resources.filter(
      (resource) => resource.type === filterOption.value
    );
  }

  // Search by query if entered
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    resources = resources.filter((resource) =>
      resource.name.toLowerCase().includes(query)
    );
  }

  // Sort resources by selected option
  if (sortOption.value) {
    resources = resources.slice().sort((a, b) => {
      if (sortOption.value === "Name") return a.name.localeCompare(b.name);
      if (sortOption.value === "Type") return a.type.localeCompare(b.type);
      return 0;
    });
  }

  return resources;
});
function handleGetAllTopicResources(title) {
  settingUpLibrary.value=true
  resourceStore.activeTitle = title;
  resourceStore.getAllTopicResourcesByTopic(title);
  setTimeout(() => {
     settingUpLibrary.value=false
  }, 450);
}
// Navigate to the resource renderer
function goToResourceRenderer(resource) {
  localStorage.setItem(
    "queryParams",
    JSON.stringify({ resourceType: resource.type })
  );
  router.push(resource.type === "TEST" ? "/exam/mocks" : "/dashboard/player");
}
</script>

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
