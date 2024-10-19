<template>
  <v-container>
    <!-- Top Row: Sort, Filter, Search Strip -->
    <v-row>
      <v-col cols="12">
        <!-- Display resource data based on response type -->
        <div v-if="showMedia">
          <div v-for="(response, index) in taskParticipants" :key="index">
            <div v-if="response.questionType === 'TASK_TEXT'">
              <!-- Check if it's graded -->
              <component
                :is="isGraded(response) ? HTMLPlayer : HTMLAnnotate"
                :content="response.questionResponse"
              />
            </div>

            <div
              v-else-if="
                response.questionType === 'TASK_UPLOAD' &&
                isImage(response.questionResponse)
              "
            >
              <!-- Image Viewer -->
              <ImageAnnotate />
            </div>

            <div
              v-else-if="
                response.questionType === 'TASK_UPLOAD' &&
                isPDF(response.questionResponse)
              "
            >
              <!-- PDF Viewer -->
              <PDFAnnotate />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import PDFAnnotate from "./PDFAnnotator.vue";
import ImageAnnotate from "./ImageAnnotator.vue";
import HTMLAnnotate from "./HTMLAnnotator.vue";
import HTMLPlayer from "./HTMLGradedRenderer.vue";
import { useResourceStore } from "@/stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
const resource = resourceStore.resource;
const taskParticipants = JSON.parse(resource.participants);
const selectedResource = ref({});
const showMedia = ref(false);

// Check if the response is graded
const isGraded = (response: any) => {
  // Logic to check if the response is graded
  // Assuming graded responses have some specific flag
  return !!response.isGraded; // Replace with actual condition
};

// Utility function to check if the uploaded file is an image
const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif)$/i.test(url);
};

// Utility function to check if the uploaded file is a PDF
const isPDF = (url: string) => {
  return /\.pdf$/i.test(url);
};

// Select the resource and prepare the responses
const selectResource = async (resource: any) => {
  showMedia.value = false;
  await resourceStore.fetchResource(resource.id);
  selectedResource.value = resourceStore.resource;
  showMedia.value = true;
};

onBeforeMount(async () => {
  const queryParams = [
    {
      resourceType: "TASK",
      subject: "",
      topic: "",
      country: "",
      targetRegion: "",
      language: "",
    },
  ];
  await resourceStore.getAllSpecificTypeResources(JSON.stringify(queryParams));
  selectResource(resourceStore.resources[0]); // Assuming you select the first resource
});
</script>
