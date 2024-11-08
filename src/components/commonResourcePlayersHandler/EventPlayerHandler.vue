<template>
  <v-container
    style="font-family: &quot;Inter&quot;, &quot;Noto Sans&quot;, sans-serif"
    fluid
  >
    <!-- Top Row: Sort, Filter, Search Strip -->
 

    <v-divider class="mb-2" />

    <!-- Bottom Row: Two Column Layout -->
    <v-row>
      <!-- Right Column: Selected Resource -->
      <v-col cols="12" md="10">
        <v-card
          v-if="!currentEvent"
          fluid
          @click="selectResource(resourceStore.resources[0])"
          height="63vh"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 5px 5px 0px 0px !important;
          "
        >
          <v-img
            height="21vh"
            class="mt-24 ma-4"
            style="cursor: pointer"
            src="https://cdn-icons-png.flaticon.com/512/907/907805.png"
          ></v-img>
        </v-card>

        <v-container fluid v-if="currentEvent && showMedia">
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
              class="mb-2"
              height="4.5rem"
              @click="selectResource(resource)"
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
import {
  ref,
  watch,
  computed,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
// Import your components and store as needed
import { useResourceStore } from "../../stores/resources"; // Adjust the path as necessary
const resourceStore = useResourceStore();
const retrievedParamsRaw = resourceStore.resource.content;

// Sort the URLs
// Assuming you have retrieved paramsObjRaw from storage or API
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
  if (!text) {
    return ""; // Default return value
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
};
// Function to select the first resource and show media
const selectFirstResource = () => {
  selectResource(resourceStore.resources[0]);
  showMedia.value = true;
};

// Watch for changes in currentEvent
watch(currentEvent, (newValue) => {
  if (newValue) {
    // Add any conditions here based on newValue if needed
    setTimeout(selectFirstResource, 300); // Delay action by 300ms
  }
});

// Run once on component mount
onMounted(() => {
  // Initial setup logic if necessary
  setTimeout(selectFirstResource, 300);
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
  //
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

/* Add media queries for more specific styling adjustments if needed */
@media (max-width: 600px) {
  .v-card {
    height: auto; /* Adjust card height on smaller screens */
  }
  .v-row {
    flex-direction: column; /* Stack rows on smaller screens */
  }
}
</style>
