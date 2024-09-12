<template>
  <v-sheet class="mx-auto" width="100%">
    <!-- Display success or error messages -->
    <div v-if="successMessage" class="custom-alert">
      <v-alert
        :text="successMessage"
        title="Success!"
        type="success"
        class="custom-alert"
      ></v-alert>
    </div>
    <div v-if="errorMessage">
      <v-alert :text="errorMessage" title="Error!" type="error"></v-alert>
    </div>

    <!-- Display form to add journal -->
    <v-form fast-fail @submit.prevent="submitForm" v-if="creatingJournal && !isPaperCreated">
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

    <!-- File Upload for PDF -->
    <v-divider></v-divider>
    <br />
    <v-card
      :disabled="loading"
      style="max-width: 95%"
      class="ml-sm mb-lg dashed-border"
      v-if="paperStore.paper.id && !paperStore.paper.url"
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
      <div class="" v-if="loading">
        <v-progress-linear color="teal" indeterminate></v-progress-linear>
      </div>
    </v-card>
    <br />
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePaperStore } from "../../../stores/papers";
import axios from "axios";
import DateTime from "../../../components/commonResourceCreateItems/formItems/DateTimePicker.vue";

const apiUrl = import.meta.env.VITE_BASE_URL;
const paperStore = usePaperStore();

const title = ref("");
const paperSummary = ref("");
const pdfFile = ref<File | null>(null);
const creatingJournal = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const loading = ref(false);
const isPaperCreated = ref(false);

const titleRules = [
  (v: string) => !!v || "Title is required",
  (v: string) => v.length >= 2 || "Title must be at least 2 characters",
  (v: string) => v.length <= 40 || "Title must be at most 40 characters",
];

const paperSummaryRules = [
  (v: string) => !!v || "Summary is required",
  (v: string) => v.length >= 2 || "Summary must be at least 2 characters",
  (v: string) => v.length <= 555 || "Summary must be at most 550 characters",
];

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

const isFormValid = computed(() => {
  return (
    titleRules.every((rule) =>
      typeof rule === "function" ? rule(title.value) === true : true
    ) &&
    paperSummaryRules.every((rule) =>
      typeof rule === "function" ? rule(paperSummary.value) === true : true
    )
  );
});

const submitForm = async () => {
  loading.value = true;
  try {
    await paperStore.createPaper(title.value, paperSummary.value);
    loading.value = false;
    isPaperCreated.value = true;
  } catch (error) {
    loading.value = false;
    errorMessage.value = "Error creating paper";
  }
};

const uploadJournalPaper = async () => {
  loading.value = true;
  if (!pdfFile.value) {
    console.error("No file selected");
    return;
  }
  const formData = new FormData();
  formData.append("file", pdfFile.value);

  try {
    const response = await axios.post(
      `${apiUrl}/api/upload?paperId=${paperStore.paper.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { message, url, updatedPaper } = response.data;
    paperStore.setPaper(updatedPaper);
    successMessage.value = message;
    creatingJournal.value = false;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    errorMessage.value = "Error uploading file";
  }
};
</script>

<style scoped>
.dashed-border {
  border: 2px dashed #14a9ee;
}
.custom-alert {
  background-color: #ffffff !important;
  padding: 20px;
  border-radius: 5px !important;
}
.custom-alert * {
  color: white !important;
}
</style>
