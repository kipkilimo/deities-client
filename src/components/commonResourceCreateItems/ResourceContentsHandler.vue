<template>
  <v-container>
    <v-row>
      <!-- Left Column: Image Upload -->
      <v-col cols="12" sm="6">
        <v-file-input
          v-if="!isImageUploaded"
          label="Upload Cover Image"
          accept="image/*"
          v-model="coverImage"
          @change="uploadCoverImage"
          :rules="[rules.required]"
        />
        <v-progress-linear
          v-if="uploading"
          indeterminate
          color="primary"
          class="mt-2"
        />
      </v-col>

      <!-- Right Column: Imported Component (visible after image upload) -->
      <v-col cols="12" sm="6" v-if="isImageUploaded">
        <v-container>
          <v-row>
            <!-- Right Column: Imported Component (visible after image upload) -->
            <v-col cols="12" sm="6" v-if="isImageUploaded && matchedComponent">
              <component :is="matchedComponent.uploader" />
              <component :is="matchedComponent.form" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup  lang="ts">
import { ref, computed } from "vue";
import { useResourceStore } from "../../stores/resources";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_BASE_URL;

const resourceStore = useResourceStore();

const ResourceType = {
  AUDIO: "🎵 AUDIO",
  VIDEO: "🎥 VIDEO",
  IMAGES: "🖼️ IMAGES",
  DOCUMENT: "📙 DOCUMENT",
  TEXT: "📃 TEXT",
  PRESENTATION: "▶ PRESENTATION",
  EVENT: "🗓️ EVENT",
  DATASET: "⛁ DATASET",
  LINK: "⛓️ LINK",
  POLL: "🗣️📊 POLL",
  TEST: "🕖📋 TEST",
  POSTER: "🎴 POSTER",
  ARTICLE: "📑 ARTICLE",
  JOB: "📁 JOB",
  TASK: "🗒️ TASK",
  MODEL: "🎲 MODEL",
};

const currentResourceType = ref(resourceStore.resource.contentType);

// Import the components
import VideoUploader from "../resourceUploaders/video/VideoUploader.vue";
import AudioUploader from "../resourceUploaders/audio/AudioUploader.vue";
import ImageUploader from "../resourceUploaders/images/ImageUploader.vue";
import DatasetUploader from "../resourceUploaders/datasets/DatasetUploader.vue";
import DocumentUploader from "../resourceUploaders/pdf/DocumentUploader.vue";
import SlidesUploader from "../resourceUploaders/presentation/SlidesUploader.vue";
import TaskUploader from "../resourceUploaders/tasks/TaskUploader.vue";
import TestUploader from "../resourceUploaders/test/TestUploader.vue";
import PosterUploader from "../resourceUploaders/posters/PosterUploader.vue";

import EventForm from "../resourceForms/events/EventForm.vue";
import ArticleForm from "../resourceForms/articles/ArticleForm.vue";
import PollForm from "../resourceForms/polls/PollForm.vue";
import JobForm from "../resourceForms/jobs/JobForm.vue";
import AssignmentForm from "../resourceForms/assignment/AssignmentForm.vue";
import LinksForm from "../resourceForms/links/LinksForm.vue";
import ModelForm from "../resourceForms/models/ModelForm.vue";
const coverImage = ref(null);
// Map resource types to their corresponding components
const resourceComponentMap = {
  [ResourceType.AUDIO]: { uploader: AudioUploader, form: null },
  [ResourceType.VIDEO]: { uploader: VideoUploader, form: null },
  [ResourceType.IMAGES]: { uploader: ImageUploader, form: null },
  [ResourceType.DOCUMENT]: { uploader: DocumentUploader, form: null },
  [ResourceType.PRESENTATION]: { uploader: SlidesUploader, form: null },
  [ResourceType.DATASET]: { uploader: DatasetUploader, form: null },
  [ResourceType.TASK]: { uploader: TaskUploader, form: AssignmentForm },
  [ResourceType.TEST]: { uploader: TestUploader, form: null },
  [ResourceType.POSTER]: { uploader: PosterUploader, form: null },
  [ResourceType.EVENT]: { uploader: null, form: EventForm },
  [ResourceType.ARTICLE]: { uploader: null, form: ArticleForm },
  [ResourceType.POLL]: { uploader: null, form: PollForm },
  [ResourceType.LINK]: { uploader: null, form: LinksForm },
  [ResourceType.JOB]: { uploader: null, form: JobForm },
  [ResourceType.MODEL]: { uploader: null, form: ModelForm },
};

// Computed property to find the matched component based on the current resource type
const matchedComponent = computed(() => {
  return resourceComponentMap[currentResourceType.value] || null;
});

const isImageUploaded = ref(false); // Example state, replace with your actual logic

const uploading = ref(false);

const rules = {
  required: (value: any) => !!value || "Cover image is required.",
};

const uploadCoverImage = async () => {
  const resourceId = resourceStore.resource.id; // Example value
  const resourceType = resourceStore.resource.contentType; // Example value
  const fileCreationStage = "COVER"; // Example value
  if (coverImage.value) {
    uploading.value = true;
    const formData = new FormData();
    formData.append("coverImage", coverImage.value);
    // Create the base URL
   
    // Add query parameters to the URL
    const url = `${apiUrl}?resourceId=${encodeURIComponent(resourceId)}&resourceType=${encodeURIComponent(resourceType)}&fileCreationStage=${encodeURIComponent(fileCreationStage)}`;

    try {
      const response = await axios.post("/resource-uploads/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Check if the upload was successful
      if (response.status === 200) {
        isImageUploaded.value = true;
      }
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      isImageUploaded.value = false;
    }  
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
