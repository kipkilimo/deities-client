<template>
  <v-container class="my-5">
    <v-row>
      <v-col
        v-for="(resource, index) in updatedResources"
        :key="index"
        cols="12"
        md="6"
        lg="4"
        xl="4"
      >
        <v-card
          class="mx-auto my-3 resource-card"
          max-width="540"
          height="13.5rem"
          :disabled="resource.resourceCount === 0"
          outlined
          @click="goToResourceRenderer(resource)"
        >
          <v-card-title
            color="#08487f"
            class="d-flex align-center justify-space-between"
          >
            <span class="resource-icon">{{ resource.icon }}</span>
            <span class="resource-name">
              {{ resource.name }} ({{ resource.resourceCount }})<v-card-text
                class="text-h11"
              >
                {{ resource.type }}
              </v-card-text>
            </span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="resource-description text-h7 py-2">
            {{ resource.description }}
          </v-card-text>
          <v-card-actions class="fixed-actions mb-1">
            <v-btn
              append-icon="mdi-chevron-right"
              color="#08487f"
              variant="outlined"
              block
              :disabled="resource.resourceCount === 0"
            >
              Explore {{ resource.name }} resources
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useResourceStore } from "../../../stores/patients";
import staticResources from "../../../data/staticResources";

import { useRouter } from "vue-router";
const router = useRouter();

// Initialize the resource store
const resourceStore = useResourceStore();

// Compute updated resources with details from the store
const updatedResources = computed(() => {
  return staticResources.value.map((resource) => {
    const matchingResources = resourceStore.resources.filter(
      (res) => res.contentType === resource.type
    );
    return {
      ...resource,
      resourceCount: matchingResources.length,
    };
  });
});

function goToResourceRenderer(resource) {
  // console.log({resource})
  localStorage.setItem("resourceType", resource.type);
  router.push("/dashboard/player");
  // Update the staticResources with the fetched data
}
// Fetch resources from the store and update counts
const fetchAndUpdateResources = async () => {
  await resourceStore.getAllResources();
  // Update the staticResources with the fetched data
  staticResources.value = updatedResources.value;
};
// Fetch resources before mounting the component
onBeforeMount(() => {
  fetchAndUpdateResources();
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
