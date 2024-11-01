<template>
  <v-container>
    <v-file-input
      v-model="files"
      accept=".jpg, .jpeg, .png, .pdf"
      label="Upload SAQ Responses"
      prepend-icon="mdi-file-upload"
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
          <v-icon class="mr-2">mdi-cloud-upload</v-icon>Upload SAQ Response
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>

    <v-progress-linear
      v-if="uploading"
      :value="uploadProgress"
      height="6"
      color="green darken-2"
      class="mt-4"
    ></v-progress-linear>

    <v-alert
      v-if="isUploadSuccessful"
      type="success"
      class="mt-4 custom-alert"
      text
    >
      Files uploaded successfully!
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useResourceStore } from "../../../stores/resources";
import { useRouter, useRoute } from "vue-router";

const resourceStore = useResourceStore();
const apiUrl = import.meta.env.VITE_BASE_URL;
const route = useRoute();
const router = useRouter();

const userId = ref(localStorage.getItem("sessionId"));
const sessionId = ref(route.query.sessionId || route.params.sessionId);

const files = ref([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const isUploadSuccessful = ref(false);
const error = ref(null);

const maxItems = 1; // Maximum number of files
const maxTotalSizeMB = 32; // Maximum total file size

const totalFileSizeMB = computed(() =>
  files.value
    .reduce((total, file) => total + file.size / 1024 / 1024, 0)
    .toFixed(2)
);

const fileRules = computed(() => [
  () =>
    files.value.length <= maxItems || `You can upload up to ${maxItems} files.`,
  () =>
    totalFileSizeMB.value <= maxTotalSizeMB ||
    `Total file size must be under ${maxTotalSizeMB} MB.`,
]);

const validateFiles = () => {
  error.value = null;

  if (files.value.length > maxItems) {
    error.value = `You can upload only one file.`;
    files.value = []; // Reset files
  } else if (totalFileSizeMB.value > maxTotalSizeMB) {
    error.value = `Total file size must not exceed ${maxTotalSizeMB} MB.`;
    files.value = []; // Reset files
  }
};

const uploadFiles = async () => {
  uploading.value = true;
  uploadProgress.value = 0;
  error.value = "";

  if (files.value.length === 0) {
    error.value = "Please select files to upload.";
    uploading.value = false;
    return;
  }

  const formData = new FormData();
  files.value.forEach((file) => {
    formData.append("files", file);
  });

  const questionType = "SAQ";
  const url = `${apiUrl}/resources/uploads/exam/attempt?userId=${encodeURIComponent(userId.value)}&sessionId=${encodeURIComponent(sessionId.value)}&questionType=${encodeURIComponent(questionType)}`;

  try {
    const response = await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });

    if (response.status === 200) {
      isUploadSuccessful.value = true;
      error.value = null;
    }
  } catch (err) {
    error.value = "Failed to upload files. Please try again.";
    console.error("Error uploading files:", err);
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.custom-alert {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
}
</style>
