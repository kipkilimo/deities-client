<template>
  <!-- Display form to add journal -->
  <v-form
    ref="form"
    v-model="isFormValid"
    @submit.prevent="submitForm"
    v-if="creatingJournal && !isPaperCreated"
  >
    <br />
    <v-text-field
      style="max-width: 93%"
      class="mt-2 ml-sm"
      v-model="title"
      :rules="titleRules"
      label="Key discussion topic"
      hint="Key discussion topic"
    ></v-text-field>

    <v-textarea
      style="max-width: 93%"
      class="mt-1 ml-sm"
      variant="outlined"
      v-model="paperSummary"
      :rules="paperSummaryRules"
      hint="Key objectives for the journal club paper discussion:"
      label="Key objectives for the journal club paper discussion:"
    ></v-textarea>

    <v-card-text>Add journal club date and time</v-card-text>
    <DateTime />

    <v-btn
      style="width: 90%"
      class="mt-1 nb-2 ml-sm"
      align-center
      :disabled="!isFormValid"
      type="submit"
    >
      Submit
    </v-btn>
    <br />
    <br />
  </v-form>

  <!-- Show file upload after form submission -->
  <v-divider v-if="isPaperCreated"></v-divider>
  <br v-if="isPaperCreated" />
  
  <v-card
    v-if="isPaperCreated"
    :disabled="loading"
    style="max-width: 95%"
    class="ml-sm mb-lg dashed-border" 
  >
    <br />
    <v-file-input
      variant="outlined"
      v-model="pdfFile"
      accept="application/pdf"
      :rules="pdfRules"
      label="Upload PDF"
      truncate-length="15"
      show-size
      counter
      style="max-width: 93%"
      class="ma-md"
      prepend-icon="mdi-file-pdf-box"
      outlined
    ></v-file-input>

    <v-card-actions class="d-flex justify-center">
      <v-btn
        class="me-2 text-none"
        color="#196279"
        :disabled="!pdfFile"
        prepend-icon="mdi-cloud-upload-outline"
        variant="flat"
        @click="uploadJournalPaper"
      >
        Upload Paper
      </v-btn>
    </v-card-actions>

    <div v-if="loading">
      <v-progress-linear color="teal" indeterminate></v-progress-linear>
    </div>
  </v-card>
  <br v-if="isPaperCreated" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePaperStore } from "@/stores/papers";
import { useUserStore } from "@/stores/users";
import axios from "axios";
import DateTime from "@/components/commonResourceCreateItems/formItems/DateTimePicker.vue";

// Store and references
const userStore = useUserStore();
const paperStore = usePaperStore();
const user = computed(() => userStore.user);

// Refs and data
const creatingJournal = ref(true);  // Set to true to display form
const loading = ref(false);
const title = ref("");
const paperSummary = ref("");
const pdfFile = ref<File | null>(null);
const isPaperCreated = ref(false);  // Form shown by default
const isFormValid = ref(false);  // Vuetify validation state
const successMessage = ref("");
const errorMessage = ref("");

// Validation rules
const titleRules = [
  (v: string) => !!v || "Title is required",
  (v: string) => v.length >= 2 || "Title must be at least 2 characters",
  (v: string) => v.length <= 155 || "Title must be at most 150 characters",
];

const paperSummaryRules = [
  (v: string) => !!v || "Summary is required",
  (v: string) => v.length >= 2 || "Summary must be at least 2 characters",
  (v: string) => v.length <= 555 || "Summary must be at most 550 characters",
];

// File upload rules
const maxFileSize = 10 * 1024 * 1024; // 10MB
const pdfRules = [
  (value: File | null) => !!value || "File is required.",
  (value: File | null) => {
    if (!value) return "File is required.";
    if (value.size > maxFileSize) {
      return `File size should be less than ${maxFileSize / (1024 * 1024)} MB.`;
    }
    return true;
  },
  (value: File | null) => {
    if (!value) return true;
    const fileName = value.name.toLowerCase();
    return fileName.endsWith(".pdf") || "The file must have a .pdf extension.";
  },
];

// Submit form to create a paper
const submitForm = async () => {
  loading.value = true;

  try {
    await paperStore.createPaper(
      title.value,
      paperSummary.value,
      user.value.id
    );

    loading.value = false;
    isPaperCreated.value = true; // Mark paper as created
    successMessage.value = "Paper created successfully";
  } catch (error) {
    loading.value = false;
    errorMessage.value = "Error creating paper";
  }
};

// Upload journal PDF
const uploadJournalPaper = async () => {
  if (!pdfFile.value) {
    errorMessage.value = "No file selected";
    return;
  }

  const formData = new FormData();
  formData.append("file", pdfFile.value);

  try {
    loading.value = true;
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/upload?paperId=${paperStore.paper.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { message, updatedPaper } = response.data;
    paperStore.setPaper(updatedPaper);
    successMessage.value = message;
    loading.value = false;
    creatingJournal.value = false;
  } catch (error) {
    loading.value = false;
    errorMessage.value = "Error uploading file";
  }
};
</script>

<style scoped>
.dashed-border {
  border: 2px dashed #ddd;
  padding: 1rem;
}
</style>
