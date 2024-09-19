<template>
  <v-container>
    <v-row>
      <!-- Left 9 columns for Assignment Task -->
      <v-col cols="10" v-if="pdfUrl" style="height: 77vh;overflow-y: hidden !important;">
        <!-- Render the PDF using the built-in browser PDF viewer -->
        <vue-pdf-app
          style="height: 77vh;overflow-x: hidden !important;"
          :pdf="pdfUrl"
          :zoom="130"
          @open="openHandler"
        ></vue-pdf-app>
      </v-col>

      <!-- Right 3 columns for Answer Key and other metadata -->
      <v-col cols="2">
        <h3>Assignment Task</h3>
        <v-btn
          variant="outlined"
          width="10.9rem"
          @click="viewPdf(assignmentMeta.assignmentTaskSet)"
          color="primary"
        >
          View Task PDF
        </v-btn>
        <h3>Answer Key</h3>
        <v-btn
          :disabled="isBeforeDeadline"
          @click="viewPdf(assignmentMeta.assignmentAnswersKey)"
          color="primary"
        >
          View Answer Key
        </v-btn>

        <p>Type: {{ assignmentMeta.assignmentType }}</p>

        <div class="ma-1">
          <p>Deadline: {{ formattedDeadline }}</p>
          <p>
            Answer reveals in:
            <br />
            {{ countdown.months }} Months, {{ countdown.days }} Days <br />
            {{ countdown.hours }} : {{ countdown.minutes }} :
            {{ countdown.seconds }}
          </p>
        </div>
        <v-divider />
        <v-card-actions>
          <v-btn
            @click="showDetails = true"
            variant="outlined"
            color="primary"
            block
          >
            View details
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
    <v-dialog v-model="showDetails" width="630">
      <v-card
        class="mx-auto"
        prepend-icon="mdi-note-edit-outline"
        :subtitle="assignmentMeta.assignmentType"
        width="630"
      >
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
          <p class="text-overline ml-4">Deadline: {{ formattedDeadline }}</p>
          <v-card-title color="grey">
            Answer reveals in: {{ countdown.months }} Months,{{
              countdown.days
            }}
            Days, {{ countdown.hours }} : {{ countdown.minutes }} :
            {{ countdown.seconds }}
          </v-card-title>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useResourceStore } from "@/stores/resources"; // Replace with actual path
import "vue3-pdf-app/dist/icons/main.css";
import VuePdfApp from "vue3-pdf-app";

const resourceStore = useResourceStore();
const resource = resourceStore.resource;
const showDetails = ref(false);
// Parse the outer JSON
const content = JSON.parse(resource.content);

// Parse the nested JSON within the content
const assignmentMetaInfo = JSON.parse(content.assignmentMetaInfo);
const assignmentAnswersKey = JSON.parse(content.assignmentAnswersKey);
const assignmentTaskSet = JSON.parse(content.assignmentTaskSet);

const assignmentMeta = ref({
  assignmentType: assignmentMetaInfo.assignmentType,
  assignmentTitle: assignmentMetaInfo.assignmentTitle,
  assignmentDescription: assignmentMetaInfo.assignmentDescription,
  assignmentDuration: assignmentMetaInfo.assignmentDuration,
  assignmentDeadline: assignmentMetaInfo.assignmentDeadline,
  assignmentAnswersKey: assignmentAnswersKey[0],
  assignmentTaskSet: assignmentTaskSet[0],
});

// To store the PDF URL to be displayed
const pdfUrl = ref(null);
// Check if the current date is before the deadline
const isBeforeDeadline = computed(() => {
  return new Date() < new Date(assignmentMeta.value.assignmentDeadline);
});

// Function to view the PDF in an iframe
const viewPdf = (url) => {
  // Prevents downloading and shows the PDF in an iframe
  pdfUrl.value = `${url}`;
};
// Format the deadline to display in a readable way
const formattedDeadline = computed(() => {
  const deadlineDate = new Date(assignmentMeta.value.assignmentDeadline);
  return deadlineDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
});

// Target date
const targetDate = new Date(assignmentMeta.value.assignmentDeadline);
const now = ref(new Date());

const countdown = computed(() => {
  const timeDiff = targetDate.getTime() - now.value.getTime();

  // Create deep copies of target and current dates for calculations
  let currentDate = new Date(now.value.getTime());
  let futureDate = new Date(targetDate.getTime());

  // Calculate months and days
  let months = futureDate.getMonth() - currentDate.getMonth();
  let days = futureDate.getDate() - currentDate.getDate();

  if (futureDate < currentDate) {
    months += 12; // Adjust for previous year
  }

  if (days < 0) {
    // Adjust for previous month or same month, but previous day
    months -= 1;
    const lastDayOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    days += lastDayOfPreviousMonth;
  }

  // Calculate hours, minutes, and seconds from timeDiff
  const hours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
  const seconds = Math.floor(timeDiff / 1000) % 60;

  // Pad digits less than 10 with leading zeros
  const paddedMonths = months < 10 ? `0${months}` : months;
  const paddedDays = days < 10 ? `0${days}` : days;
  const paddedHours = hours < 10 ? `0${hours}` : hours;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return {
    months: paddedMonths,
    days: paddedDays,
    hours: paddedHours,
    minutes: paddedMinutes,
    seconds: paddedSeconds,
  };
});

// Update countdown every second
onMounted(() => {
  viewPdf(assignmentMeta.value.assignmentTaskSet);
  setInterval(() => {
    now.value = new Date();
  }, 1000);
});
</script>
