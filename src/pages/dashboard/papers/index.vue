<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <!-- Display message if no paper URL exists -->
        <h3 v-if="!paperStore.paper.url">
          <v-alert border="top" type="info" variant="outlined" prominent>
            There is no paper to show at the moment. Check back later.
          </v-alert>
        </h3>

        <!-- Display the highlighter component if the paper URL exists -->
        <div v-if="paperStore.paper.url">
          <Highlighter />
        </div>
      </v-col>

      <v-col cols="3">
        <v-row>
          <v-col cols="9">
            <v-btn
              style="width: 70%"
              :disabled="
                !isAddArticleEnabled || creatingJournal || isPaperCreated
              "
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
              color="red-darken-3"
              :disabled="!creatingJournal"
              @click="cancelForm"
              class="text-none mt-1"
              icon="mdi-file-cancel"
              size="small"
            ></v-btn>
          </v-col>
        </v-row>

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
          <v-form
            fast-fail
            @submit.prevent="submitForm"
            v-if="creatingJournal && !isPaperCreated"
          >
            <br />
            <v-text-field
              style="max-width: 93%"
              class="mt-2 ml-sm"
              v-model="title"
              :rules="titleRules"
              label="Journal article title"
              hint="Journal article title"
            ></v-text-field>

            <v-textarea
              style="max-width: 93%"
              class="mt-1 ml-sm"
              variant="outlined"
              v-model="paperSummary"
              :rules="paperSummaryRules"
              hint="Key task / objectives for the journal club article:"
              label="Key task / objectives for the journal club article:"
            ></v-textarea>

            <v-btn
              style="width: 90%"
              class="mt-1 nb-2 ml-sm"
              align-centre
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, computed,nextTick, onBeforeMount } from "vue";
import { usePaperStore } from "../../../stores/papers";
import axios from "axios";
// @ts-ignore
import Highlighter from "../../../components/ArticleTextHighlighter.vue";

const paperStore = usePaperStore();
// @ts-ignore
const apiUrl = import.meta.env.VITE_BASE_URL;

const user = ref<any>(null);
const loading = ref(false);
const title = ref("");
const paperSummary = ref("");
const pdfFile = ref<File | null>(null);
const creatingJournal = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const isPaperCreated = ref(false);
const parentContainer = ref(null);
const pdfImage = ref(null);


// Validate the title and summary
const titleRules = [
  (v: string) => !!v || "Title is required",
  (v: string) => v.length >= 2 || "Title must be at least 2 characters",
  (v: string) => v.length <= 255 || "Title must be at most 250 characters",
];
const paperSummaryRules = [
  (v: string) => !!v || "Summary is required",
  (v: string) => v.length >= 2 || "Summary must be at least 2 characters",
  (v: string) => v.length <= 755 || "Summary must be at most 750 characters",
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

const isButtonDisabled = computed(() => {
  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

  const createdDateMs = Number(paperStore.paper.createdDate);
  const timeDiff = now - createdDateMs;

  return timeDiff > oneDayInMs || timeDiff < twoWeeksInMs;
});

const isAddArticleEnabled = computed(() => {
  const lastPublishedDate = paperStore.paper.createdDate;
  if (!lastPublishedDate) return true;
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  return new Date(lastPublishedDate) < fourteenDaysAgo;
});

const showSubmit = () => {
  creatingJournal.value = true;
};

const cancelForm = () => {
  creatingJournal.value = false;
  isPaperCreated.value = false;
};

const submitForm = async () => {
  loading.value = true;

  try {
    await paperStore.createPaper(
      title.value,
      paperSummary.value,
      user.value.id
    );

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

onBeforeMount(async () => {
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
  await paperStore.getMostRecentPaper();
});
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

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
