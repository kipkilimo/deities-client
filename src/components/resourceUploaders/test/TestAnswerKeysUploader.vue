<template>
  <v-container>
    <v-file-input
      v-model="files"
      accept=".pdf, .jpg, .jpeg, .png, .webp"
      label="Upload PDF orr image Files"
      prepend-icon="mdi-note-check-outline"
      :multiple="true"
      :counter="true"
      :rules="fileRules"
      :chips="true"
      @change="validateFiles"
      show-size
    ></v-file-input>
    <v-btn @click="uploadFiles" :disabled="uploading">Upload</v-btn>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>
    <v-alert v-if="isUploadSuccessful" type="success">
      Files uploaded successfully!
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

// @ts-ignore
const apiUrl = import.meta.env.VITE_BASE_URL;

const files = ref([]);
const uploading = ref(false);
const isUploadSuccessful = ref(false);
const error = ref(null);

const maxItems = 1;
const maxTotalSizeMB = 12;

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
  loading.value = true;
  
  if (files.value.length === 0) {
    console.error("No files selected");
    error.value = "Please select files to upload.";
    loading.value = false;
    return;
  }

  const resourceId = resourceStore.resource.id; // Example value
  const resourceType = resourceStore.resource.contentType; // Example value
  const fileCreationStage = "CONTENT"; // Example value

  const formData = new FormData();
  files.value.forEach((file) => {
    formData.append("files", file);
  });

  const url = `${apiUrl}?resourceId=${encodeURIComponent(resourceId)}&resourceType=${encodeURIComponent(resourceType)}&fileCreationStage=${encodeURIComponent(fileCreationStage)}`;

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      const { message, updatedResource } = response.data;
      resourceStore.setResource(updatedResource);
      successMessage.value = message;
      isUploadSuccessful.value = true;
    }
  } catch (err) {
    console.error("Failed to upload files:", err);
    error.value = "Failed to upload files. Please try again.";
  } finally {
    loading.value = false;
  }
};

</script>
