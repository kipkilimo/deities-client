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
            :prepend-icon="
              hasContentForUserId(resource.participants, userId)
                ? 'mdi-clipboard-text-clock-outline'
                : 'mdi-file-edit-outline'
            "
            :color="
              hasContentForUserId(resource.participants, userId)
                ? 'orange'
                : 'success'
            "
            :disabled="
              !(
                timeLeft.days > 0 ||
                timeLeft.hours > 0 ||
                timeLeft.minutes > 0 ||
                timeLeft.seconds > 0
              )
            "
            :text="
              hasContentForUserId(resource.participants, userId)
                ? 'RE-SUBMIT TASK RESPONSE'
                : 'SUBMIT TASK RESPONSE'
            "
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
          <v-spacer /> <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="medium"
                class="mb-0"
                variant="outlined"
                icon="mdi-arrow-left"
                @click="goBackToAssignments"
                color="info"
              >
              </v-btn>
            </template>
            <span>Go back to assignments</span>
          </v-tooltip>
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
            :prepend-icon="
              hasContentForUserId(resource.participants, userId)
                ? 'mdi-clipboard-text-clock-outline'
                : 'mdi-file-edit-outline'
            "
            :color="
              hasContentForUserId(resource.participants, userId)
                ? 'orange'
                : 'success'
            "
            :disabled="
              !(
                timeLeft.days > 0 ||
                timeLeft.hours > 0 ||
                timeLeft.minutes > 0 ||
                timeLeft.seconds > 0
              )
            "
            :text="
              hasContentForUserId(resource.participants, userId)
                ? 'RE-SUBMIT TASK RESPONSE'
                : 'SUBMIT TASK RESPONSE'
            "
            variant="outlined"
            @click="showTaskResponseEditor = true"
          ></v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showTaskResponseEditor" max-width="85%" persistent>
      <v-card flat style="z-index: 99999 !important">
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
          <h6>You can always overwrite existing response</h6>
        </v-alert>
      </v-card>
      <v-card>
        <!-- Error Alert -->

        <!-- Rich Text Editor -->
        <RichTextEditor
          counter
          v-model="typedTaskResponse"
          :rules="richTextRules"
        />

        <v-divider />

        <!-- Card Actions with buttons and tooltips -->
        <v-card-actions>
          <v-spacer />

          <!-- Upload Button with Tooltip -->
          <v-tooltip location="top">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                width="18rem"
                color="#022568"
                variant="outlined"
                prepend-icon="mdi-cloud-upload-outline"
                @click="showTaskResponseUploader = true"
              >
                UPLOAD A FILE RESPONSE
              </v-btn>
            </template>
            <span
              >You may submit both a typed and uploaded file. Refer to relevant
              instruction.</span
            >
          </v-tooltip>

          <v-spacer />

          <!-- Save Button with Tooltip -->
          <v-tooltip location="top">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                width="18rem"
                color="#05909f"
                variant="outlined"
                prepend-icon="mdi-text-box-edit-outline"
                @click="saveAssignmentDetail()"
                :disabled="!isFormValid"
              >
                SAVE ASSIGNMENT RESPONSE
              </v-btn>
            </template>
            <span
              >You may submit both a typed and uploaded file. Refer to relevant
              instruction..</span
            >
          </v-tooltip>

          <v-spacer />

          <!-- Exit Button with Tooltip -->
          <v-tooltip location="top">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
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

      <!-- Upload Dialog -->
      <v-dialog v-model="showTaskResponseUploader" max-width="27%">
        <v-card height="13.5rem">
          <TaskResponseFileUploader />
        </v-card>
      </v-dialog>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useResourceStore } from "@/stores/resources";
import "vue3-pdf-app/dist/icons/main.css";
import VuePdfApp from "vue3-pdf-app";
import { useRouter } from "vue-router"; // Import useRouter

const router = useRouter();
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
const isUploadSuccessful = ref(null);
const error = ref(null);
// Method to handle navigation
const goBackToAssignments = () => {
  // Get router instance

  router.push("tasks"); // Use absolute path for clarity
};

const uploading = ref(false);
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
// Validation rule to limit text length
// Define rich text rules as an array
const richTextRules = [
  (v) => v.length <= 5000 || "Maximum 5000 characters allowed.",
];
function hasContentForUserId(participantsJson, userId) {
  // Parse the JSON string
  const participants = JSON.parse(participantsJson);

  // Find the participant by userId
  const participant = participants.find(
    (participant) => participant.userId === userId
  );

  // If participant is found, check their resourceResponses
  if (participant && participant.resourceResponses) {
    // Check if any resourceResponse has a truthy questionResponse
    return participant.resourceResponses.some((response) =>
      Boolean(response.questionResponse)
    );
  }

  // Return false if participant is not found or has no resourceResponses
  return false;
}
// Computed property to check if the input is valid
const isFormValid = computed(() => {
  return richTextRules.every((rule) => rule(typedTaskResponse.value) === true);
});
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

  uploading.value = true;
  const formDataJson = JSON.stringify({
    questionType: "TASK_TEXT",
    questionResponse: typedTaskResponse.value,
    savedDate: Date.now(),
  });

  const url = `${apiUrl}/resources/uploads/task/response?userId=${encodeURIComponent(userId.value)}&sessionId=${encodeURIComponent(sessionId.value)}`;
  try {
    // Send the data using axios
    const response = await axios.post(
      url,
      formDataJson, // The body data to send
      {
        headers: {
          "Content-Type": "application/json", // Ensure content type is set to JSON
        },
      }
    );

    // Handle success response
    if (response) {
      isUploadSuccessful.value = "Task response saved successfully";
      uploading.value = false;
      setTimeout(() => {
        window.location.href = "tasks";
      }, 6300);
    }
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
