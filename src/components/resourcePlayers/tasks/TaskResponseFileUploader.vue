<template>
  <v-container>
    <v-card flat  style="z-index: 99999 !important">
      <v-alert
        border="top"
        type="warning"
        variant="outlined"
        prominent
        class="ma-4"
        style="z-index: 99999 !important"
        v-if="error"
      >
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
        border="top"
        type="success"
        class="ma-4"
        style="z-index: 99999 !important"
        variant="outlined"
        prominent
        v-if="isUploadSuccessful"
      >
        <h4>{{ isUploadSuccessful }}</h4>
        <h6>You can always upload a new response</h6>
      </v-alert>
    </v-card>
    <v-file-input
      v-model="files"
      accept=".jpg, .jpeg, .png, .pdf"
      label="Upload Assignment Responses"
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
          <v-icon class="mr-2">mdi-cloud-upload</v-icon>Upload TASK Response
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useResourceStore } from "../../../stores/resources";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_URL;
const uploadProgress = ref(0);
const isUploadSuccessful = ref(null);
const error = ref(null);

const resourceStore = useResourceStore();
const resource = resourceStore.resource;
const route = useRoute();
const router = useRouter();

const userId = ref(localStorage.getItem("sessionId"));
const sessionId = ref(resource.sessionId);

const files = ref([]);
const uploading = ref(false);

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

  const questionType = "TASK_UPLOAD";
  const url = `${apiUrl}/resources/uploads/task/response?userId=${encodeURIComponent(userId.value)}&sessionId=${encodeURIComponent(sessionId.value)}&questionType=${encodeURIComponent(questionType)}`;

  try {
    const response = await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total || 1; // Fallback to 1 to avoid division by zero
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / total);
      },
    });

    if (response.status === 200) {
      isUploadSuccessful.value = "Task response saved successfully";
      error.value = null;
      setTimeout(() => {
        window.location.href = "tasks";
      }, 4200);
    }
  } catch (err) {
    error.value = "Failed to upload files. Please try again.";
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
