<template>
  <v-container v-if="resourceStore.resource.contentType.length > 1">
    <v-row>
      <!-- Image upload and cropping section -->
      <v-col cols="4" v-if="coverUploaded === false">
        <v-card
          >{{ resourceStore.resource.content }}
          <v-row>
            <!-- File input for selecting the image -->
            <v-col cols="12">
              <v-file-input
                class="ma-3"
                label="Pick resource cover image"
                accept="image/png, image/jpeg, image/webp"
                @change="onFileChange"
                outlined
                v-model="coverImage"
              ></v-file-input>
            </v-col>
            <!-- Cropper component -->
            <v-col cols="12" v-if="imageUrl">
              <Cropper
                :src="imageUrl"
                ref="cropper"
                :stencil-props="{
                  aspectRatio: 5 / 3,
                }"
                @change="onCropChange"
              />
            </v-col>
            <!-- Crop and upload button -->
            <v-divider />
            <v-col cols="12">
              <v-btn
                class="ml-46 mb-1"
                color="primary"
                variant="outlined"
                v-if="imageUrl"
                :loading="loading"
                size="small"
                :disabled="coverUploaded === true"
                @click="uploadCroppedImage"
                >Crop & Upload</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Other content -->
      <v-divider v-if="coverUploaded === false" vertical />
      <v-col :cols="coverUploaded === false ? '7' : '12'">
        <v-card flat color="transparent" :disabled="coverUploaded === false">
          <component
            v-if="matchedComponent.uploader"
            :is="matchedComponent.uploader"
          />
          <component v-if="matchedComponent.form" :is="matchedComponent.form" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick, watch, onBeforeUnmount } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import axios from "axios";
import { useResourceStore } from "../../stores/resources";

const resourceStore = useResourceStore();
// Define the API base URL
const apiUrl = import.meta.env.VITE_BASE_URL;

const loading = ref(false);
// Import other components for different resource types
import VideoUploader from "../resourceUploaders/video/VideoUploader.vue";
import AudioUploader from "../resourceUploaders/audio/AudioUploader.vue";
import ImageUploader from "../resourceUploaders/images/ImageUploader.vue";
import DatasetUploader from "../resourceUploaders/datasets/DatasetUploader.vue";
import DocumentUploader from "../resourceUploaders/pdf/DocumentUploader.vue";
import SlidesUploader from "../resourceUploaders/presentation/SlidesUploader.vue";
import TaskUploader from "../resourceUploaders/tasks/TaskUploader.vue";
import TestUploader from "../resourceUploaders/test/TestMetaForm.vue";
import PosterUploader from "../resourceUploaders/posters/PosterUploader.vue";
import EventForm from "../resourceForms/events/EventForm.vue";
import ArticleForm from "../resourceForms/articles/ArticleForm.vue";
import PollForm from "../resourceForms/polls/PollForm.vue";
import JobForm from "../resourceForms/jobs/JobForm.vue";

import TaskMetaForm from "../resourceUploaders/tasks/TaskMetaForm.vue";
import LinksForm from "../resourceForms/links/LinksForm.vue";
import ModelForm from "../resourceForms/models/ModelForm.vue";
import ComputingTopicForm from "../resourceForms/computing/ComputingTopicForm.vue";
import TestMetaForm from "../resourceUploaders/test/TestMetaForm.vue";

// Access the resource store
const currentResourceType = ref(resourceStore.resource.contentType);

// State for the cover image and cropper
const coverImage = ref(null);
const imageUrl = ref(null);
const imageFile = ref(null);
const cropper = ref(null);
const coverUploaded = ref(false);

// Handle file change for cropping
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
    imageFile.value = file;
    console.log({ imageUrl: imageUrl.value });
  }
};

// Handle crop changes
const onCropChange = ({ coordinates, canvas }) => {
  cropper.value = canvas; // Capture the canvas for cropping
};

// Function to crop the image and upload it
const uploadCroppedImage = async () => {
  loading.value = true;
  if (!cropper.value) {
    console.error("Cropper not initialized");
    loading.value = false;
    return;
  }

  cropper.value.toBlob(async (blob) => {
    loading.value = true;
    if (!blob) {
      console.error("Failed to get cropped blob");
      loading.value = false;
      return;
    }

    const formData = new FormData();
    formData.append("file", blob, imageFile.value.name);

    const resourceId = resourceStore.resource.id;
    const resourceType = resourceStore.resource.contentType;
    const fileCreationStage = "COVER";
    const url = `${apiUrl}/resources/uploads?resourceId=${encodeURIComponent(resourceId)}&resourceType=${encodeURIComponent(resourceType)}&fileCreationStage=${encodeURIComponent(fileCreationStage)}`;

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { message } = response.data;
      console.log("Upload successful:", message);
      coverUploaded.value = true;
      loading.value = false;
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      coverUploaded.value = false;
      loading.value = false;
    }
  });
};

// Map resource types to their corresponding components
const ResourceType = {
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  IMAGES: "IMAGES",
  DOCUMENT: "DOCUMENT",
  TEXT: "TEXT",
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
  COMPUTING: "COMPUTING",
};

const resourceComponentMap = {
  [ResourceType.AUDIO]: { uploader: AudioUploader, form: null },
  [ResourceType.VIDEO]: { uploader: VideoUploader, form: null },
  [ResourceType.IMAGES]: { uploader: ImageUploader, form: null },
  [ResourceType.DOCUMENT]: { uploader: DocumentUploader, form: null },
  [ResourceType.PRESENTATION]: { uploader: SlidesUploader, form: null },
  [ResourceType.DATASET]: { uploader: DatasetUploader, form: null },
  [ResourceType.TASK]: { uploader: null, form: TaskMetaForm },
  [ResourceType.TEST]: { uploader: null, form: TestMetaForm },
  [ResourceType.POSTER]: { uploader: PosterUploader, form: null },
  [ResourceType.EVENT]: { uploader: null, form: EventForm },
  [ResourceType.ARTICLE]: { uploader: null, form: ArticleForm },
  [ResourceType.POLL]: { uploader: null, form: PollForm },
  [ResourceType.LINK]: { uploader: null, form: LinksForm },
  [ResourceType.JOB]: { uploader: null, form: JobForm },
  [ResourceType.MODEL]: { uploader: null, form: ModelForm }, //
  [ResourceType.COMPUTING]: { uploader: null, form: ComputingTopicForm },
};

// Computed property to get the matched component based on the current resource type
const matchedComponent = computed(() => {
  return (
    resourceComponentMap[resourceStore.resource.contentType] || {
      uploader: null,
      form: null,
    }
  );
});
</script>

<style scoped>
.cropper {
  max-width: 100%;
  max-height: 400px;
  z-index: 9000 !important;
}
</style>
