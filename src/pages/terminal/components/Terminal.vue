<template>
  <v-container
    fluid
    max-height="99.6vh"
    class="mt-6"
    style="overflow: hidden; padding: 0; margin: 0; box-sizing: border-box"
  >
    <v-row>
      <!-- Placeholder v-sheet while visits are being fetched -->
      <v-col
        cols="3"
        v-if="visitStore.visits.length === 0"
        class="d-flex align-center justify-center"
      >
        <v-sheet
          width="100%"
          height="66vh"
          style="background-color: #d5edee; border-radius: 8px; padding: 0px"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            class="me-2"
          ></v-progress-circular>
          Fetching visits...
        </v-sheet>
      </v-col>

      <v-col cols="3" class="mt-1" v-if="visitStore.visits.length > 0">
        <v-col
          v-for="(visit, index) in mostRecentVisits"
          :key="index"
          cols="12"
          class="mt-2"
          height="66vh"
          :style="{
            backgroundColor: '#d5edee',
            borderRadius: '8px',
            padding: '0px',
          }"
        >
          <v-card
            outlined
            class="elevation-0 mt-2 ml-4"
            width="96%"
            :color="visit.patient.personalInfo.gender === 'Male' ? '#34495e' : '#34495e'"
            style="color: white; position: relative; overflow: hidden; height: 12.6rem"
          >
            <v-card-title class="text-h4 mt-4" style="font-family: 'Orbitron', monospace">
              {{ visit.visitNumber }}
            </v-card-title>
            <v-divider />
            <v-row class="ma-1">
              <v-col cols="12">
                <v-icon small class="me-2" style="color: white"
                  >mdi-calendar-clock</v-icon
                >
                {{
                  new Intl.DateTimeFormat("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }).format(new Date(visit.visitStartDateTime))
                }}
              </v-col>
              <v-col cols="12">
                <v-icon small style="color: white">mdi-doctor</v-icon>
                {{ visit.doctor }}
                <v-chip
                  small
                  color="primary"
                  class="mt-0 ml-2"
                  variant="outlined"
                  style="color: white; border-color: white"
                >
                  {{ visit.visitStatus }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-col>

      <v-col cols="9" height="66vh">
        <v-card
          max-height="100%"
          class="mr-1"
          color="#ddfdfd"
          style="
            width: 100%;
            height: 73vh;
            object-fit: cover;
            overflow: hidden;
            border-radius: 8px;
          "
        >
          <video-player
            :src="videoUrls[currentVideoIndex]"
            poster="https://videosolutions.pro/wp-content/uploads/2023/08/play-button-background-video-solutions.svg"
            :volume="0.225"
            :loop="false"
            :autoplay="true"
            controls
            style="width: 100%; height: 73vh; object-fit: cover"
            @ended="playNextVideo"
          ></video-player>
        </v-card>
      </v-col>
    </v-row>

    <v-row
      align="center"
      justify="space-between"
      class="mt-4"
      :style="{
        backgroundColor: '#ddfdfd',
        borderRadius: '8px',
        padding: '0px',
      }"
      max-height="8.4rem"
    >
      <v-col cols="3">
        <v-card
          v-if="mostRecentVisits.length > 0 && showActiveVisitCard"
          outlined
          class="elevation-0 mt-2 ml-2"
          width="100%"
          :color="
            currentPatientVisit.patient.personalInfo.gender === 'Male'
              ? '#00a0b8'
              : '#00a0b8'
          "
          style="color: white; position: relative; overflow: hidden; height: 12.6rem"
        >
          <div
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 200%;
              height: 200%;
              background: radial-gradient(
                circle,
                rgba(255, 255, 255, 0.6) 10%,
                rgba(255, 255, 255, 0) 70%
              );
              animation: sunburst 4s linear infinite;
              pointer-events: none;
              z-index: -1;
            "
          ></div>

          <v-row>
            <v-col cols="10">
              <v-card-subtitle
                align-center
                class="text-h5 mt-2 text-white"
                style="font-family: mono; color: #000000 !important"
              >
                <strong>{{ currentTime }}</strong>
              </v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-img
                class="mt-2"
                max-height="2.1rem"
                src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-11-849_512.gif"
              ></v-img>
            </v-col>
          </v-row>
          <v-divider />

          <v-row>
            <v-col cols="4">
              <v-card-text
                v-if="isVisible"
                class="text-h5 mt-1 ml-2"
                style="font-family: 'Orbitron', monospace"
              >
                {{ currentPatientVisit.visitNumber }}
              </v-card-text>
            </v-col>
            <v-col cols="8">
              <p class="text-h5 mt-4 ml-0">| Added {{ timeAgo }}.</p>
            </v-col>
          </v-row>

          <v-divider />
          <v-row class="ma-1" style="display: flex; flex-direction: column">
            <v-col cols="9" style="color: white">
              <v-icon small style="color: white">mdi-doctor</v-icon>
              <span v-if="currentPatientVisit.doctor">
                {{ currentPatientVisit.doctor }}</span
              >
              <v-chip
                small
                color="primary"
                class="mt-0 ml-2"
                variant="outlined"
                style="color: white; border-color: white"
              >
                {{ currentPatientVisit.visitStatus }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="9">
        <v-row>
          <v-col
            v-for="(service, index) in currentServices"
            :key="index"
            cols="12"
            md="3"
            lg="3"
          >
            <v-card
              outlined
              class="elevation-0 mt-2 mr-1"
              width="100%"
              height="12.6rem"
              :color="departmentColors[activeDepartmentIndex]"
              style="color: white"
            >
              <v-list-item class="mb-2">
                <template v-slot:prepend>
                  <v-avatar color="surface-light" size="32">
                    <v-icon>{{ service.icon }}</v-icon>
                  </v-avatar>
                </template>

                <template v-slot:title>
                  <div class="text-h6 mb-2">{{ service.department }}</div>
                </template>
              </v-list-item>

              <v-divider></v-divider>
              <v-card-item>
                <v-card-title class="me-1 mb-3">
                  {{ service.service }}
                </v-card-title>
                <v-card-subtitle class="me-1 mt-5">
                  <span class="me-1 mt-5"> KES {{ service.price.toLocaleString() }}</span>
                  <v-icon color="success" icon="mdi-medical-bag" size="small"></v-icon>
                </v-card-subtitle>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeMount } from "vue";
import { useVisitStore } from "@/stores/visits";
import * as XLSX from "xlsx";
// import { VideoPlayer } from '@videojs-player/vue'
// import 'video.js/dist/video-js.css'
const visitStore = useVisitStore();
const videoUrls = ref([
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/Cervical+screening+awareness+animated+video.mp4",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/How+can+we+protect+pregnant+women+from+malaria%EF%BC%9F.mp4",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/Importance+of+Vaccines.mp4",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/Road+Safety+for+Kids!+%EF%BD%9C+Crossing+the+Road+%EF%BD%9C+Road+Safety.mp4",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/Antimicrobial+resistance+(AMR)+-+What+does+it+mean+and+why+it+matters.mp4",
]);

const currentVideoIndex = ref(0);
const videoUrl = ref(videoUrls.value[currentVideoIndex.value]);

function checkVideoEnd(event) {
  const video = event.target;
  if (video.currentTime >= video.duration - 0.1) {
    // Trigger next video if it's almost finished
    playNextVideo();
  }
}

function playNextVideo() {
  if (currentVideoIndex.value < videoUrls.value.length - 1) {
    currentVideoIndex.value = currentVideoIndex.value + 1;
  } else {
    currentVideoIndex.value = 0; // Restart the playlist
  }
}

const currentIndex = ref(0);

const allAmaneServices = ref([]);
// Reactive variable to store the real-time formatted date
const currentTime = ref("");

function formatTime(date) {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM formatting
  };

  // Format the date and make AM/PM uppercase
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate.replace(/(AM|PM)/, (match) => match.toUpperCase());
}

// Update the time every second
function updateTime() {
  currentTime.value = formatTime(new Date());
}

onMounted(() => {
  updateTime(); // Set the initial time
  setInterval(updateTime, 1000); // Update the time every second
});

const createdAt = ref("2024-12-07T14:00:00Z"); // Example ISO timestamp, replace with your own value
// Computed property to get the most recent 4 items

// Method to calculate time ago
function calculateTimeAgo(timestamp) {
  const now = new Date();
  const createdDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now - createdDate) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}
async function fetchServices() {
  try {
    const response = await fetch(
      "https://a2z-v0.s3.eu-central-1.amazonaws.com/amane_services.xlsx"
    );
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const allSheetsData = {};
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet);
      allSheetsData[sheetName] = sheetData;
    });

    return allSheetsData;
  } catch (error) {
    console.error("Error fetching or parsing Excel file:", error);
    return [];
  }
}

const iconMap = {
  CLINICAL: "mdi-stethoscope",
  RECORDS: "mdi-folder",
  LABORATORY: "mdi-microscope",
  NURSING: "mdi-medical-cotton-swab",
  ACCOUNTS: "mdi-cash-register",
  PHARMARCY: "mdi-pill",
};

const unwrapCatalogWithIcons = (catalog, iconMap) => {
  return Object.entries(catalog).map(([department, data]) => {
    const services = data.slice(1).map((item) => ({
      department: department,
      service: item["__EMPTY"],
      price: item["__EMPTY_1"],
      icon: iconMap[item["__EMPTY"]] || iconMap[department] || "mdi-help-circle",
    }));
    return { department, services };
  });
};

const transformedCatalog = ref([]);
const departmentColors = ref([
  "#3d85c6",
  "#189ab4",
  "#db318a",
  "#2c3e50",
  "#9b59b6",
  "#db318a",
  "#189ab4",
  "#3d85c6",
  "#2c3e50",
  "#9b59b6",
]);
const activeDepartmentIndex = ref(0);
const currentServices = computed(() => {
  const department = transformedCatalog.value[activeDepartmentIndex.value]; // Get the current department
  if (!department) return []; // Return empty if no department is found
  const services = department.services || []; // Get the services of the current department

  // Calculate the slice of services for the current cycle (up to 4 items)
  const currentCycleServices = services.slice(currentIndex.value, currentIndex.value + 4);

  // If the current cycle has fewer than 4 items, fetch the necessary number of items from the previous cycle
  if (currentCycleServices.length < 4) {
    const previousCycleIndex = currentIndex.value - (4 - currentCycleServices.length); // Calculate how many items to fetch from the previous cycle
    const previousCycleServices = services.slice(previousCycleIndex, currentIndex.value);
    // Combine services from the previous cycle with the remaining services from the current cycle
    return [...previousCycleServices, ...currentCycleServices];
  }

  return currentCycleServices; // Return the 4 items from the current cycle
});
// State to manage visibility
const mostRecentVisits = ref([]);
const showActiveVisitCard = ref(false);

const currentPatientVisit = ref(null);
watch(
  () => visitStore.visits,
  (newVisits) => {
    if (!newVisits || newVisits.length === 0) {
      mostRecentVisits.value = [];
      return;
    }

    // Sort and take the most recent 4 visits
    mostRecentVisits.value = newVisits
      .slice() // Create a shallow copy to avoid mutating the original
      .sort((a, b) => new Date(b.visitStartDateTime) - new Date(a.visitStartDateTime)) // Sort by date
      .slice(0, 4); // Take the first 4 items
    showActiveVisitCard.value = true;
    currentPatientVisit.value = mostRecentVisits.value[0];
  },
  { immediate: true } // Populate immediately on load
);

// Computed property to dynamically update "time ago"
const timeAgo = computed(() =>
  calculateTimeAgo(currentPatientVisit.value.visitStartDateTime)
);
let timerId = null;

// WebSocket setup
const wsBaseUrl = import.meta.env.VITE_BASE_SOCKET_URL || "ws://localhost:4000";
const wsPath = "/terminal";
const wsUrl = `${wsBaseUrl}${wsPath}`;
// Path to the notification sound
const notificationSound = new Audio("/notification-1.mp3");

const ws = new WebSocket(wsUrl);

// Handle WebSocket open, message, and close events
ws.onopen = () => {
  console.log(`[DEBUG] WebSocket connection established to ${wsUrl}`);
};

ws.onmessage = (event) => {
  console.log(`[DEBUG] WebSocket message received: ${event.data}`);

  try {
    const data = JSON.parse(event.data);
    console.log(`[DEBUG] Parsed WebSocket message:`, data);

    if (data.event === "CALL") {
      console.log(`[DEBUG] 'CALL' event received with data:`, data.data);
      showActiveVisitCard.value = false;
      currentPatientVisit.value = data.data;

      // Play the notification sound
      notificationSound.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
      console.log(`[DEBUG] Updated currentPatientVisit:`, currentPatientVisit.value);

      showActiveVisitCard.value = true;
      console.log(`[DEBUG] Set isVisible to true.`);
    } else {
      console.warn(`[DEBUG] Unhandled WebSocket event: ${data.event}`);
    }
  } catch (error) {
    console.error(`[DEBUG] Error parsing WebSocket message:`, error);
  }
};

ws.onclose = () => {
  console.log(`[DEBUG] WebSocket connection to ${wsUrl} closed.`);
};

// Calculate "time ago" for the patient

watch(
  currentPatientVisit,
  (newPatient) => {
    if (newPatient) {
      showActiveVisitCard.value = false;

      const now = new Date();
      const visitStart = new Date(newPatient.visitStartDateTime);
      const diffInMinutes = Math.floor((now - visitStart) / 60000);

      if (diffInMinutes < 60) {
        timeAgo.value = `${diffInMinutes} minutes ago`;
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        timeAgo.value = `${diffInHours} hours ago`;
      }

      setTimeout(() => {
        showActiveVisitCard.value = true;
      }, 900);
    }
  },
  { immediate: true }
);
// Setup and cleanup
onMounted(() => {
  timerId = setInterval(updateTime, 60000);
  setTimeout(() => {
    showActiveVisitCard.value = true;
  }, 900);
});

onUnmounted(() => {
  ws.off("CALL");
  clearInterval(timerId);
});

// State to manage visibility
const isVisible = ref(true);

// Duration settings
const flickerDuration = 7500; // Flicker for  5 seconds
const showDuration = 14000; // Stay visible for 15 seconds

// Function to handle the visibility toggle
function toggleVisibility() {
  isVisible.value = !isVisible.value;
}

onMounted(() => {
  const cycle = () => {
    // Flicker at 1 Hz for 5 seconds
    const flickerInterval = setInterval(() => {
      toggleVisibility();
    }, 750); // 1 Hz flicker (500ms interval)

    // After 5 seconds, stop flickering and show for 7.5 seconds
    setTimeout(() => {
      clearInterval(flickerInterval); // Stop flickering
      isVisible.value = true; // Ensure the text stays visible

      // After 7.5 seconds, restart the cycle
      setTimeout(cycle, showDuration);
    }, flickerDuration);
  };

  // Start the cycle initially
  cycle();
});

onUnmounted(() => {
  // Cleanup: clear any ongoing intervals/timeouts when the component is unmounted
  clearInterval();
  clearTimeout();
});

onUnmounted(() => {
  // Clean up the intervals and timeouts to avoid memory leaks
  clearInterval(interval);
});

onBeforeMount(async () => {
  await visitStore.handleGetAllActiveVisits();
  allAmaneServices.value = await fetchServices();
  transformedCatalog.value = unwrapCatalogWithIcons(allAmaneServices.value, iconMap);

  // Rotate services every 7.5 seconds (4 services at a time)
  setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 4) % transformedCatalog.value[0].services.length;
  }, 5400); // 7.5 seconds (for rotating services)

  // Rotate departments every 2 minutes (120 seconds)
  setInterval(() => {
    activeDepartmentIndex.value =
      (activeDepartmentIndex.value + 1) % transformedCatalog.value.length;
  }, 45000); // 120 seconds (2 minutes)
});
</script>

<style scoped>
.lobby-container {
  height: 100vh;
  background-color: #f4f9f9;
  overflow: hidden;
}

.lobby-row {
  height: 100%;
  display: flex;
}

.placeholder-sheet {
  width: 100%;
  height: 66vh;
  background-color: #d5edee;
  border-radius: 8px;
  padding: 0;
}

.visit-card-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.visit-card {
  color: white;
  width: 100%;
  border-radius: 8px;
}

.visit-title {
  font-family: mono;
  font-size: 1.5rem;
}

.visit-icon {
  color: white;
}

.video-col {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.info-row {
  padding: 1rem 0;
  background-color: #ddfdfd;
  border-radius: 8px;
}

.info-col {
  display: flex;
  justify-content: center;
}

.info-card {
  width: 100%;
  border-radius: 8px;
}
</style>
<style scoped>
@keyframes sunburst {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.7;
  }
  50% {
    transform: translate(50%, -50%) scale(1);
    opacity: 0.4;
  }
  100% {
    transform: translate(150%, -50%) scale(1.5);
    opacity: 0;
  }
}
</style>
<style>
@font-face {
  font-family: "Orbitron";
  src: url("/public/Orbitron-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
</style>
