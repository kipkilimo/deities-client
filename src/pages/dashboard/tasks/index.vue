<template>
  <v-container fluid>
    <!-- Progress bar when loading -->
    <v-progress-linear
      color="teal"
      v-if="isLoading"
      indeterminate
    ></v-progress-linear>

    <!-- Container for resources -->
   <v-row
    v-if="updatedResources"
    class="d-flex justify-left"
    style="max-height: 75vh; overflow-y: auto;" 
  >
      <h3 class="ml-4">NEMBio Assignment Tasks</h3>
      <v-divider class="mx-4 mb-1"></v-divider>
      <v-col
        v-for="(resource, index) in resourceStore.resources"
        :key="resource.id"
        cols="auto"
        xl="3"
        md="4"
        lg="4"
        sm="6"
        xs="12"
        class="pa-3"
      >
        <!-- Resource card --><v-card
          :disabled="isLoading"
          :loading="isLoading"
          class="mx-auto my-4"
          max-width="374"
        >
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
              :active="isActive"
              color="deep-purple"
              height="4"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img height="210" :src="resource.coverImage" cover></v-img>

          <v-card-item>
            <v-card-title>{{ resource.title }}</v-card-title>
            <v-card-subtitle>
              <span class="me-1 text-overline">{{ resource.subject }}</span>
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-row align="center" class="mx-0"> </v-row>

            <div class="my-1 text-subtitle-1">
              {{ resource.topic }} Assignment Task
            </div>

            <div>{{ truncateText(resource.description, 210) }}</div>
          </v-card-text>

          <v-divider class="mx-4 mb-1"></v-divider>

          <v-card-actions>
            <v-btn
              variant="outlined"
              @click="goToResourceRenderer(resource)"
              block
              color="teal"
              >VIEW ASSIGNMENT DETAILS</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useResourceStore } from "@/stores/resources";
import staticResourcesData from "@/data/staticResources";
const isLoading = ref(false);

const { resourceType, staticResources } = staticResourcesData;

console.log({ staticResources: staticResources.value });
import { useRouter } from "vue-router";
const router = useRouter();

// Initialize the resource store
const resourceStore = useResourceStore();

// Compute updated resources with details from the store
const updatedResources = ref(null);

function goToResourceRenderer(resource) {
  resourceStore.resource = resource
  localStorage.setItem("resourceType", "TASK");
  router.push("/dashboard/player");
}
function requestToParticipateInTask() {
  localStorage.setItem("resourceType", "TASK");
  router.push("/dashboard/player");
}

const truncateText = (text, length) => {
  if (!text) {
    return ""; // or return a default value or an empty string
  }
  return text.length > length ? text.substring(0, length) + "..." : text;
};
// Fetch resources from the store and update counts
const fetchAndUpdateResources = async () => {
  isLoading.value = true;
  await resourceStore.getAllTaskResources();
};
function getTaskResources() {
  const vals = resourceStore.resources.filter(
    (res) => res.contentType === "TASK"
  );
  updatedResources.value = vals;
}
// Fetch resources before mounting the component
onMounted(async () => {
  await fetchAndUpdateResources();
  getTaskResources();
  isLoading.value = false;
});
</script>

<style scoped>
/* Styles for the resource card */
.resource-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
  position: relative;
  padding-bottom: 3rem; /* Space reserved for buttons */
}

.resource-card:hover {
  transform: scale(1.0025); /* Slightly scale the card */
  box-shadow: 0px 10px 20px rgba(26, 25, 25, 0.7); /* Add pronounced shadow */
  cursor: pointer; /* Change cursor to pointer */
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

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
