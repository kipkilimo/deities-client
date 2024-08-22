<template>
  <v-container>
    <v-file-input
      v-model="files"
      accept=".mp4"
      label="Upload MP4 Files"
      prepend-icon="mdi-video"
      :multiple="true"
      :counter="true"
      :rules="fileRules"
      :chips="true"
      @change="validateFiles"
      show-size
    ></v-file-input>

    <v-row justify="center" class="mt-4">
      <v-col cols="auto">
        <v-btn @click="uploadFiles" :disabled="files.length === 0 || uploading">
          <v-icon class="mr-2">mdi-cloud-upload</v-icon>Upload
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>

        <div v-if="isUploadSuccessful" class="custom-alert">
      <v-alert :text="isUploadSuccessful" title="Files uploaded successfully!" type="success" class="custom-alert">

      </v-alert>
    </div>
    
  </v-container>
</template>
<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useResourceStore } from "../../../stores/resources";

import { useRouter } from "vue-router";

const resourceStore = useResourceStore();
// @ts-ignore
const apiUrl = import.meta.env.VITE_BASE_URL;

const router = useRouter(); // Use Vue Router to handle navigation

const files = ref([]);
const uploading = ref(false);
const isUploadSuccessful = ref(false);
const error = ref(null);

const maxItems = 12;
const maxTotalSizeMB = 960;

const fileRules = computed(() => [
  () =>
    files.value.length <= maxItems || `You can upload up to ${maxItems} files.`,
  () =>
    totalFileSizeMB.value <= maxTotalSizeMB ||
    `Total file size must be under ${maxTotalSizeMB} MB.`,
]);

const totalFileSizeMB = computed(() =>
  files.value
    .reduce((total, file) => total + file.size / 1024 / 1024, 0)
    .toFixed(2)
);

const validateFiles = () => {
  error.value = null;

  if (files.value.length > maxItems) {
    error.value = `You can upload a maximum of ${maxItems} files.`;
    files.value = [];
  } else if (totalFileSizeMB.value > maxTotalSizeMB) {
    error.value = `Total file size must not exceed ${maxTotalSizeMB} MB.`;
    files.value = [];
  }
};

const uploadFiles = async () => {
  uploading.value = true;

  if (files.value.length === 0) {
    console.error("No files selected");
    error.value = "Please select files to upload.";
    uploading.value = false;
    return;
  }

  // Example values, replace with actual logic if necessary
  const resourceId = resourceStore.resource.id;
  const resourceType = resourceStore.resource.contentType;
  const fileCreationStage = "CONTENT";

  const formData = new FormData();
  files.value.forEach((file) => {
    formData.append("files", file);
  });

  const url = `${apiUrl}/resources/uploads?resourceId=${encodeURIComponent(resourceId)}&resourceType=${encodeURIComponent(resourceType)}&fileCreationStage=${encodeURIComponent(fileCreationStage)}`;

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      const { message } = response.data; 
      isUploadSuccessful.value = true;
      window.location.href = 'dashboard/overview';
    }
  } catch (err) {
    console.error("Failed to upload files:", err);
    error.value = "Failed to upload files. Please try again.";
  }
};
</script>
<style scoped>
.custom-alert {
  background-color: #ffffff; /* Dark background */
  padding: 20px;
  border-radius: 5px;
}

.custom-alert * {
  color: white !important;
}
</style>