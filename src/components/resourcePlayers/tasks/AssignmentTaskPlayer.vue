<template>
  <v-container>
    <v-row>
      <!-- PDF Viewer -->
      <v-col cols="10" v-if="pdfUrl" class="pdf-container">
        <vue-pdf-app
          class="pdf-viewer"
          :pdf="pdfUrl"
          :zoom="130"
          @open="openHandler"
          @error="handlePdfError"
        />
      </v-col>

      <!-- Assignment Meta Info -->
      <v-col cols="2">
        <h3>Assignment Task</h3>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            size="small"
            variant="outlined"
            class="action-button"
            @click="viewPdf(assignmentMeta.assignmentTaskSet)"
            color="primary"
          >
            View Task PDF
          </v-btn>

          <v-spacer />
        </v-card-actions>
        <h3>Answer Key</h3>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="
              timeLeft.days > 0 ||
              timeLeft.hours > 0 ||
              timeLeft.minutes > 0 ||
              timeLeft.seconds > 0
            "
            @click="viewPdf(assignmentMeta.assignmentAnswersKey)"
            color="primary"
          >
            View Answer Key
          </v-btn>
          <v-spacer />
        </v-card-actions>
        <p>Type: {{ assignmentMeta.assignmentType }}</p>

        <div class="ma-1">
          <p>Deadline: {{ assignmentMeta.assignmentDeadline }}</p>
          <p>
            Answer reveals in:<br />
            <strong>
              <span v-if="timeLeft.days > 0">{{ timeLeft.days }}d </span>
              <span v-if="timeLeft.hours > 0">{{ timeLeft.hours }}h </span>
              <span v-if="timeLeft.minutes > 0">{{ timeLeft.minutes }}m </span>
              <span v-if="timeLeft.seconds > 0">{{ timeLeft.seconds }}s</span>
              <span
                v-if="
                  !(
                    timeLeft.days > 0 ||
                    timeLeft.hours > 0 ||
                    timeLeft.minutes > 0 ||
                    timeLeft.seconds > 0
                  )
                "
                >Lapsed</span
              >
            </strong>
          </p>
        </div>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="ms-2"
            size="small"
            color="success"
            disabled
            text="SUBMIT TASK RESPONSE"
            variant="outlined"
            @click="showTaskResponseEditor = true"
          ></v-btn>
          <v-spacer />
        </v-card-actions>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDetails = true" color="primary" size="small">
            View task details
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-col>
    </v-row>

    <!-- Dialog for Details -->
    <v-dialog v-model="showDetails" width="630">
      <v-card class="mx-auto" prepend-icon="mdi-note-edit-outline" width="630">
        <template v-slot:title>
          <span class="font-weight-black">{{
            assignmentMeta.assignmentTitle
          }}</span>
        </template>

        <v-card-text class="bg-surface-light pt-4">
          {{ assignmentMeta.assignmentDescription }}
        </v-card-text>

        <v-divider />

        <div class="ma-4">
          <p class="text-overline ml-4">
            Deadline: {{ assignmentMeta.assignmentDeadline }}
          </p>
          <v-card-title color="grey">
            Answer reveals in:
            <strong>
              <span v-if="timeLeft.days > 0">{{ timeLeft.days }}d </span>
              <span v-if="timeLeft.hours > 0">{{ timeLeft.hours }}h </span>
              <span v-if="timeLeft.minutes > 0">{{ timeLeft.minutes }}m </span>
              <span v-if="timeLeft.seconds > 0">{{ timeLeft.seconds }}s</span>
              <span
                v-if="
                  !(
                    timeLeft.days > 0 ||
                    timeLeft.hours > 0 ||
                    timeLeft.minutes > 0 ||
                    timeLeft.seconds > 0
                  )
                "
                >Lapsed</span
              >
            </strong>
          </v-card-title>
        </div>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="ms-2"
            size="small"
            color="success"
            disabled
            text="SUBMIT TASK RESPONSE"
            variant="outlined"
            @click="showTaskResponseEditor = true"
          ></v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showTaskResponseEditor" max-width="85%" persistent>
      <v-card>
        <RichTextEditor v-model="typedTaskResponse" />
        <v-divider />
        <v-card-actions>
          <v-spacer /><v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                width="18rem"
                color="primary"
                variant="outlined"
                prepend-icon="mdi-cloud-upload-outline"
                @click="showTaskResponseUploader = true"
                >UPLOAD A FILE RESPONSE</v-btn
              >
            </template>
            <span
              >Only one response will be saved. Typed response will be
              dropped.</span
            >
          </v-tooltip>

          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                width="18rem"
                color="primary"
                prepend-icon="mdi-text-box-edit-outline"
                variant="outlined"
                @click="saveAssignmentDetail()"
                >SAVE ASSIGNMENT RESPONSE</v-btn
              >
            </template>
            <span
              >Only one response will be saved.Uploaded response will be
              dropped.</span
            >
          </v-tooltip>

          <v-spacer /><v-spacer /><v-spacer /> <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="error"
                icon="mdi-location-exit"
                size="x-large"
                @click="showTaskResponseEditor = false"
              ></v-btn>
            </template>
            <span>Exit response editor</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
      <v-dialog v-model="showTaskResponseUploader" max-width="24%">
        <v-card>
          <TaskResponseFileUploader />
        </v-card>
      </v-dialog>
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
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useResourceStore } from "@/stores/resources";
import "vue3-pdf-app/dist/icons/main.css";
import VuePdfApp from "vue3-pdf-app";
import TaskResponseFileUploader from "./TaskResponseFileUploader.vue";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_URL;
// Store and data setup
const resourceStore = useResourceStore();
const resource = resourceStore.resource;
const showDetails = ref(false);
const typedTaskResponse = ref("Wipe and type your response ...");
const showTaskResponseUploader = ref(false);
const showTaskResponseEditor = ref(false);
const userId = ref(localStorage.getItem("sessionId"));
const sessionId = ref(resource.sessionId);
const uploadProgress = ref(0);
const isUploadSuccessful = ref(false);
const error = ref(null);

const pdfUrl = ref(null);
const { assignmentMetaInfo, assignmentAnswersKey, assignmentTaskSet } =
  JSON.parse(resource.content);
const taskData = JSON.parse(assignmentMetaInfo);
const assignmentMeta = ref({
  assignmentType: taskData.assignmentType,
  assignmentTitle: taskData.assignmentTitle,
  assignmentDescription: taskData.assignmentDescription,
  assignmentDuration: taskData.assignmentDuration,
  assignmentDeadline: taskData.assignmentDeadline,
  assignmentAnswersKey: JSON.parse(assignmentAnswersKey)[0],
  assignmentTaskSet: JSON.parse(assignmentTaskSet)[0],
});

const timezoneOffHours = ref(0);

// Convert deadline to UTC milliseconds
function getUtcMillis(dateString) {
  // Extract the timezone offset (e.g., GMT+3) from the string
  const timezoneMatch = dateString.match(/GMT([+-]\d+)/);

  // Default to GMT+0 if no timezone is provided
  let timezoneOffsetHours = 0;
  if (timezoneMatch && timezoneMatch[1]) {
    timezoneOffsetHours = parseInt(timezoneMatch[1], 10); // Convert the timezone offset to a number
    timezoneOffHours.value = timezoneOffsetHours;
  }

  // Convert the date string to a standard format
  const standardFormat = dateString
    .replace(
      /(Friday|Saturday|Sunday|Monday|Tuesday|Wednesday|Thursday),?\s*/,
      ""
    ) // Remove the day name
    .replace(/ at /, " ") // Replace " at " with a space
    .replace(/GMT/, "GMT"); // Ensure "GMT" remains

  // Create a new Date object from the standard format
  const localDate = new Date(standardFormat);

  // Check if the date is valid
  if (isNaN(localDate.getTime())) {
    return null; // Or handle the error as you see fit
  }

  // Get the UTC milliseconds from the date
  const utcMillis = localDate.getTime();

  // Convert the timezone offset to milliseconds
  const timezoneOffsetMillis = timezoneOffsetHours * 60 * 60 * 1000;

  // Adjust for the timezone offset
  return utcMillis - timezoneOffsetMillis;
}

// Example usage
const dateString = assignmentMeta.value.assignmentDeadline;
const utcMillis = getUtcMillis(dateString);

// Calculate the time left for the countdown
// Assuming utcMillis is set correctly
const deadlineUtcMillis = getUtcMillis(assignmentMeta.value.assignmentDeadline); // Call your function to get UTC milliseconds

// Check if the deadline is in the future
const isFuture = computed(() => deadlineUtcMillis > Date.now());

// Calculate the time left for the countdown
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const updateTimeLeft = () => {
  const now = Date.now(); // Get the current time in UTC milliseconds
  const diff =
    deadlineUtcMillis - now + 1000 * 60 * 60 * timezoneOffHours.value; // Calculate the difference in milliseconds

  if (diff > 0) {
    timeLeft.value = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)), // Calculate remaining days
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24), // Calculate remaining hours
      minutes: Math.floor((diff / (1000 * 60)) % 60), // Calculate remaining minutes
      seconds: Math.floor((diff / 1000) % 60), // Calculate remaining seconds
    };
  } else {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Reset to zero if the deadline has passed
  }
};

// Start the countdown and update every second
let countdownInterval;

onMounted(() => {
  updateTimeLeft();
  countdownInterval = setInterval(updateTimeLeft, 1000);
  viewPdf(assignmentMeta.value.assignmentTaskSet); // Load the PDF when mounted
});

onUnmounted(() => {
  clearInterval(countdownInterval); // Clear the interval when the component is destroyed
});

// Function to view the PDF
const viewPdf = (url) => {
  pdfUrl.value = url;
};

// Handle PDF errors
const handlePdfError = (error) => {
  alert("Error loading PDF. Please try again later.");
};

// Save Assignment Details
async function saveAssignmentDetail() {
  // Handle task detail submission logic here
  // Example usage

  const formDataJson = JSON.stringify({
    questionType: "TASK_TEXT",
    questionResponse: typedTaskResponse.value,
    savedDate: Date.now(),
  });

  const url = `${apiUrl}/resources/uploads/task/response?userId=${encodeURIComponent(userId.value)}&sessionId=${encodeURIComponent(sessionId.value)}`;
  try {
    // Send the data using axios
    await axios.post(
      url,
      formDataJson, // The body data to send
      {
        headers: {
          "Content-Type": "application/json", // Ensure content type is set to JSON
        },
      }
    );

    // Handle success response
    success.value = "Assignment updated successfully.";
    setTimeout(() => {
      window.location.reload();
    }, 4200);
  } catch (error) {
    // Handle error
    errorMessage.value = "Error updating task:";
  }
}
</script>

<style scoped>
.pdf-container {
  height: 90vh;
  overflow-y: hidden;
}

.pdf-viewer {
  height: 90vh;
  overflow-x: hidden;
}

.action-button {
  width: 11rem;
}
</style>
