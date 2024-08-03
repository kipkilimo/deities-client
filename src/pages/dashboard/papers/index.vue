<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <div class="content-box">Column 1 (9/12)</div>
      </v-col>
      <v-col cols="3">
        <v-row>
          <v-col cols="9">
            <v-btn
              style="width: 70%"
              :disabled="creatingJournal === true"
              class="text-none mb-4"
              color="blue-darken-3"
              size="large"
              block
              prepend-icon="mdi-format-list-group-plus"
              variant="text"
              border
              @click="showSubmit"
            >
              Add Journal Club Paper
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              variant="outlined"
              color="blue-darken-3"
              :disabled="creatingJournal === false"
              @click="creatingJournal = false"
              class="text-none mt-2"
              icon="mdi-refresh"
              size="x-small"
            ></v-btn>
          </v-col>
        </v-row>
        <v-sheet class="mx-auto" width="100%" v-if="creatingJournal">
          <v-form fast-fail @submit.prevent="submitForm" v-if="isPaperEmpty">
            <v-text-field
              style="max-width: 96%"
              class="mt-2 ml-sm"
              v-model="title"
              :rules="titleRules"
              label="Journal article title"
              hint="Journal article title"
            ></v-text-field>

            <v-textarea
              style="max-width: 96%"
              class="mt-2 ml-sm"
              variant="outlined"
              v-model="paperSummary"
              :rules="paperSummaryRules"
              hint="Key task / objectives for the journal club article:"
              label="Key task / objectives for the journal club article:"
            ></v-textarea>

            <v-btn
              style="width: 90%"
              class="mt-2 ml-sm"
              align-centre
              :disabled="!isFormValid"
              type="submit"
              >Submit</v-btn
            >
          </v-form>
          <!-- File Upload for PDF -->
          <br />
          <v-divider></v-divider>
          <br />

          <v-card class="ma-md dashed-border" v-if="!isPaperEmpty">
            <v-file-input
              variant="outlined"
              v-model="pdfFile"
              accept="application/pdf"
              :rules="pdfRules"
              label="Upload PDF"
              truncate-length="15"
              show-size
              counter
              prepend-icon="mdi-file-pdf-box"
              outlined
            ></v-file-input>
            <v-card-actions>
              <v-btn
                class="me-2 text-none"
                color="#4f545c"
                :disabled="!pdfFile"
                prepend-icon="mdi-cloud-upload"
                variant="flat"
                @click="uploadJournalPaper"
              >
                Upload Paper
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { usePaperStore } from "../../../stores/papers";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_URL;

const user = ref<any>(null);
onBeforeMount(() => {
  if (typeof localStorage !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        user.value = parsedUser && parsedUser[0] ? parsedUser[0] : {};
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }
});

const paperStore = usePaperStore();
// Reactive state variables
// Computed property to check if the paper object is empty
const isPaperEmpty = computed(() => {
  const paper = paperStore.paper;
  return (
    paper && Object.keys(paper).length === 0 && paper.constructor === Object
  );
});
const loading = ref(false);
const title = ref("");
const paperSummary = ref("");
const pdfFile = ref<File | null>(null);
const creatingJournal = ref(false);
// Validation rules
const titleRules = [
  (v: string) => !!v || "Title is required",
  (v: string) => v.length >= 2 || "Title must be at least 2 characters",
  (v: string) => v.length <= 155 || "Title must be at most 150 characters",
];
const paperSummaryRules = [
  (v: string) => !!v || "Task is required",
  (v: string) => v.length >= 2 || "Task must be at least 2 characters",
  (v: string) => v.length <= 555 || "Task must be at most 550 characters",
];
const pdfRules = [
  (v: File | null) => !!v || "PDF file is required",
  (v: File | null) =>
    !v || v.type === "application/pdf" || "File must be a PDF",
];
// Computed property to determine if the form is valid
const isFormValid = computed(() => {
  // Validate title
  const titleErrors = titleRules
    .map((rule) => rule(title.value))
    .filter((error) => error !== true);
  if (titleErrors.length > 0) return false;

  // Validate paper summary
  const paperSummaryErrors = paperSummaryRules
    .map((rule) => rule(paperSummary.value))
    .filter((error) => error !== true);
  if (paperSummaryErrors.length > 0) return false;

  return true;
});
const showSubmit = () => {
  // Implement form submission logic here
  creatingJournal.value = true;
};
// Form submission handler
const submitForm = async () => {
  try {
    // Assuming that paperStore.createPaper is an asynchronous function that returns a promise
    await paperStore.createPaper(
      title.value,
      paperSummary.value,
      user.value.id
    );

    // Optionally, handle the success (e.g., showing a success message, clearing the form)
    console.log("Paper successfully created");
  } catch (error) {
    // Handle errors during paper creation
    console.error("Error creating paper:", error);
  }
};
const uploadJournalPaper = async function () {
  if (!pdfFile.value) {
    console.error("No file selected");
    return;
  }
  // Create a FormData object to hold the file data
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

    // Handle success response
    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    // Handle error response
    console.error("Error uploading file:", error);
  }
};
</script>

<style scoped>
.content-box {
  border: 1px solid #ccc;
  padding: 16px;
  text-align: center;
}
</style>
<style scoped>
.dashed-border {
  border: 2px dashed #14a9ee; /* Customize the color and width as needed */
}
</style>
<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
