<template>
  <v-card style="min-height: 90vh" color="transparent">
    <Highlighter />
  </v-card>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, onBeforeMount } from "vue";
import { usePaperStore } from "../../stores/papers";
import axios from "axios";
import { useRouter } from "vue-router";

// @ts-ignore
import Highlighter from "../../../src/components/resourcePlayers/papers/PaperDive.vue";
import { useUserStore } from "../../stores/users";
import DateTime from "../../../src/components/commonResourceCreateItems/formItems/DateTimePicker.vue";
const userStore = useUserStore();
const user = computed(() => userStore.user);
const paperStore = usePaperStore();
// @ts-ignore
const apiUrl = import.meta.env.VITE_BASE_URL;
const journalTask = ref(false);
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
// Filter comments for the current page
const goHome = () => {
  window.location.href = "/dashboard/overview"; // Redirect to the home page
};
function evalClosingDate(timestamp: string): string {
  // Convert the timestamp to an integer
  const originalDate = new Date(parseInt(timestamp, 10));

  // Add 30 days (30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const futureDate = new Date(
    originalDate.getTime() + 28 * 24 * 60 * 60 * 1000
  );

  // Format the date and time with full weekday and custom date-time style
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // Use toLocaleString to format the date and time
  const formattedDateTime = futureDate.toLocaleString("en-US", options);

  return formattedDateTime;
}

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
const isPastDue = computed(() => {
  return new Date(paperStore.paper.createdDate) < new Date();
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
  await paperStore.getMostRecentPapers();
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
<style scoped>
.scroll-container {
  display: flex;
  flex-direction: column; /* Change to 'row' if horizontal scrolling is desired */
  overflow-y: auto; /* Change to 'overflow-x' for horizontal scrolling */
  height: 1000vh; /* Set your desired maximum height */
}
.past-due {
  background-color: rgb(243, 39, 39);
  color: white;
}

.on-time {
  background-color: rgb(20, 155, 20);
  color: white;
}
</style>
<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
