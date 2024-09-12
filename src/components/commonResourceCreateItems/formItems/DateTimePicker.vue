<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Month"
          dense
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedDate"
          :items="dates"
          label="Date"
          dense
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedHour"
          :items="hours"
          label="Hour"
          dense
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedMinute"
          :items="minutes"
          label="Minute"
          dense
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedPeriod"
          :items="periods"
          label="AM/PM"
          dense
        ></v-select>
      </v-col>
    </v-row>
    <!-- <v-btn @click="convertToTimestamp">Convert to Timestamp</v-btn> -->
    <v-alert v-if="timestamp" type="success">
      Timestamp: {{ timestamp }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dates = ref([]);
const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : i));
const periods = ["AM", "PM"];

const selectedMonth = ref(null);
const selectedDate = ref(null);
const selectedHour = ref(null);
const selectedMinute = ref(null);
const selectedPeriod = ref("AM");
const timestamp = ref(null);

// Watch selectedMonth to update the number of dates available
watch(selectedMonth, (newMonth) => {
  dates.value = getDatesForMonth(newMonth);
  if (selectedDate.value && !dates.value.includes(selectedDate.value)) {
    selectedDate.value = null; // Reset date if it's not valid for the new month
  }
});
// Watch selectedMonth to update the number of dates available
watch(selectedMinute, (newPeriod) => {
  dates.value = getDatesForMonth(newPeriod);
  if (selectedDate.value && !dates.value.includes(selectedDate.value)) {
   convertToTimestamp()
  }
});
function getDatesForMonth(month) {
  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) return [];

  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

function convertToTimestamp() {
  if (
    !selectedMonth.value ||
    !selectedDate.value ||
    !selectedHour.value ||
    !selectedMinute.value ||
    !selectedPeriod.value
  ) {
    return;
  }

  const monthIndex = months.indexOf(selectedMonth.value);
  const year = new Date().getFullYear();
  let hour = parseInt(selectedHour.value, 10);
  if (selectedPeriod.value === "PM" && hour < 12) {
    hour += 12;
  }
  if (selectedPeriod.value === "AM" && hour === 12) {
    hour = 0;
  }

  const date = new Date(
    year,
    monthIndex,
    parseInt(selectedDate.value, 10),
    hour,
    parseInt(selectedMinute.value, 10)
  );
  timestamp.value = date.getTime();
}
</script>

<style scoped>
/* Add any specific styles you want here */
</style>
