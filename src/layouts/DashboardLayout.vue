<template>
  <v-app v-if="readyView" full-height>
    <v-layout full-height>


      <!-- App Bar -->
      <v-app-bar class="">

        <router-link :to="route.path.includes('computing') ? '/dashboard/services' : '/welcome'
          " class="px-8 flex items-center w-64">
          <v-img src="https://cloudclinic.me/ada/images/logo/cloud-clinic-logo-clean-new-1.png" width="180"
            @click="(drawer = true)" height="120" />
        </router-link>

        <v-btn icon @click="drawer = !drawer">
          <span class="i-iconoir-menu text-2xl"></span>
        </v-btn>

        <v-spacer />

        <!-- User Controls v-if="staffStore.staff && staffStore.staff.personalInfo.fullName"
v-if="staffStore.staff && staffStore.staff.personalInfo.fullName"
v-if="staffStore.staff && staffStore.staff.personalInfo.fullName" -->
        <v-text-field :disabled="patientStore.loading" v-model="searchQuery" label="Search by patient ID" size="small"
          variant="outlined" density="compact" rounded class="mt-7" max-width="21rem"
          append-inner-icon="mdi-magnify"></v-text-field>
        <v-progress-linear color="teal" indeterminate v-if="patientStore.loading"></v-progress-linear>
        <v-col cols="auto">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-if="staffStore.staff && staffStore.staff.role === 'ADMINISTRATIVE'" v-bind="props" icon rounded
                density="comfortable" @click="staffStore.addingStaff = true">
                <v-icon>mdi-account-box-plus-outline</v-icon>
              </v-btn>
            </template>
            <span>{{
  staffStore.staff && staffStore.staff.role === 'ADMINISTRATIVE'
    ? "Add a staff member"
    : "Add a staff | ⓘ Requires signing in"
}}
            </span>
          </v-tooltip>


          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="staffStore.staff && staffStore.staff.role === 'ADMINISTRATIVE' || staffStore.staff && staffStore.staff.role === 'RECORDS'"
                v-bind="props" icon rounded density="comfortable" @click="patientStore.addingPatient = true">
                <v-icon>mdi-account-injury-outline</v-icon>
              </v-btn>
            </template>
            <span> Add a new patient
            </span>
          </v-tooltip>

          <!-- 
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon rounded class="ml-2" density="comfortable" @click="fetchPresentersTasks">
                <v-icon>mdi-calendar-check-outline</v-icon>
              </v-btn>
            </template>
            <span>{{
              staffStore.staff && staffStore.staff.personalInfo.fullName
                ? "Manage my assignments"
                : "Manage my assignments | ⓘ Requires signing in"
            }}
            </span>
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon rounded class="ml-2" density="comfortable" @click="fetchPresentersExams">
                <v-icon>mdi-clock-edit-outline</v-icon>
              </v-btn>
            </template>
            <span>{{
              staffStore.staff && staffStore.staff.personalInfo.fullName
                ? "Manage my exams"
                : "Manage my exams | ⓘ Requires signing in"
            }}
            </span>
          </v-tooltip> -->

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon rounded class="ml-2" density="comfortable" @click="goToMyAccount">
                <v-icon>mdi-account-file-text-outline</v-icon>
              </v-btn>
            </template>
            <span>{{
              staffStore.staff && staffStore.staff.personalInfo.fullName
                ? "My account"
                : "My account | ⓘ Requires signing in"
            }}
            </span>
          </v-tooltip>
        </v-col>

        <LocaleToggler />
        <ThemeToggler />
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer rounded v-model="drawer" class="m-2 max-h-[calc(100%-82px)]" :rail="rail"
        :location="isRTL ? 'end' : 'start'">
        <template v-slot:prepend>
          <div class="p-2 flex" :class="{ 'justify-center': rail }">
            <v-btn icon size="sm" variant="text" @click="rail = !rail">
              <span :class="rail ? 'rotate-180' : 'rotate-0'"
                class="i-iconoir-fast-arrow-left text-xl rtl:transform rtl:rotate-180 transition-transform duration-300"></span>
            </v-btn>
          </div>
        </template>

        <v-list density="compact" nav>
          <v-list-item height="100" :prepend-avatar="staffStore.staff && staffStore.staff.personalInfo.fullName
            ? `https://ui-avatars.com/api/?name=${staffStore.staff.personalInfo.fullName}&background=0D8ABC&color=fff`
            : 'https://ui-avatars.com/api/?name=Guest&background=0D8ABC&color=fff'
  " :title="staffStore.staff && staffStore.staff.personalInfo.fullName
  ? staffStore.staff.personalInfo.fullName
  : 'Guest User'
  " :subtitle="staffStore.staff && staffStore.staff.personalInfo.emailAddress
  ? obfuscateEmail(staffStore.staff.personalInfo.emailAddress)
  : 'guest@nem.bio'
  " class="me-4" />

          <v-divider></v-divider>
          <!-- v-bind="props" activator="parent" -->
          <v-list>
            <v-list-item v-for="item in sidebarItems" :key="item.value" :value="item.value" :to="item.path">
              <v-tooltip location="bottom" class="custom-tooltip">
                <template v-slot:activator="{ props }" v-show="rail">
                  <div class="d-flex align-center">
                    <v-icon class="me-2">{{ item.iconClass }}</v-icon>
                    <v-list-item-title @click="reRouteRequest">{{ item.title }}</v-list-item-title>
                  </div>
                </template>
                <!-- <span class="custom-tooltip_content">{{
                  getTooltipHighlight(item.tooltip)
                }}</span> -->
              </v-tooltip>
            </v-list-item>

            <v-divider class="mt-2" />
            <h3 color="#777777" class="ml-2 mt-2 mb-2 text-left">
              {{ titlize(currentPartner.partnerType) }} Partner
            </h3>
            <v-divider class="mt-1" />

            <v-img class="bg-white ma-4 d-flex justify-left" :src="currentPartner.logo" max-width="85%" contain
              max-height="27.5vh"></v-img>
            <p class="text-center">
              {{ currentPartner.fullname }}
            </p>
            <div class="pa-2">
              <v-btn :block="!rail" :icon="rail" variant="outlined" :size="rail ? 'small' : undefined" @click="logout">
                <v-icon class="i-iconoir-log-out text-xl"></v-icon>
                <span v-show="!rail">{{ $t("dashboard.sidebar.logout") }}</span>
              </v-btn>
            </div>
          </v-list>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content Area -->
      <v-main class="text-slate-700 dark:text-slate-300">
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>

    <!-- Dialogs  -->
    <v-dialog v-model="staffStore.addingStaff" width="65%" persistent>
      <AddStaffMember />
    </v-dialog>
    <v-dialog v-model="patientStore.addingPatient" width="65%" persistent>
      <AddNewPatient />
    </v-dialog>

    <v-dialog v-model="visitStore.createNewVisit" width="65%" persistent>
      <AddNewVisit />
    </v-dialog>
    <v-dialog v-model="patientStore.noSearchMatch" width="65%">
      <NoSearchMatch />
    </v-dialog>
    <v-dialog v-model="invoiceStore.createNewInvoice" width="65%" persistent>
      <AddNewInvoice />
    </v-dialog>
    <!--  <v-dialog v-model="resourceStore.showAddStaffCoverAndContentDialog" width="85%" height="84vh" persistent>
      <v-card height="84vh" title="Add resource content">
        <StaffContentsHandler />
        <v-card-actions style="position: relative; padding: 0; margin: 0">
          <v-spacer />
          <v-btn variant="text" color="red" @click="resourceStore.showAddStaffCoverAndContentDialog = false"
            style="position: absolute; bottom: 0; right: 0; margin: 16px">
            CLOSE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="630" v-model="resourceStore.showExamsDialog">
      <PublisherExams />
    </v-dialog>

    <v-dialog width="630" v-model="resourceStore.showAssignmentsDialog">
      <PublisherAssignments />
    </v-dialog>-->
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useStaffStore } from "@/stores/staff";
import { usePatientStore } from "@/stores/patients";

import { useRouter, useRoute } from "vue-router";
import { useInvoiceStore } from "@/stores/invoices";
const invoiceStore = useInvoiceStore();

import partners from "@/data/partnersSponsors";
import { useVisitStore } from "@/stores/visits"; // Import the visit store

const visitStore = useVisitStore();

const staffStore = useStaffStore()
const patientStore = usePatientStore()
const isComputingRoute = ref(false);
const route = useRoute();
const router = useRouter();

const readyView = ref(false);
/**setCurrentSubjectArea(newSubject) */

// Method to check if the current route includes 'dashboard/computing'


const searchQuery = ref("");
// reRouteRequest
const reRouteRequest = () => {
  if (staffStore.staff && staffStore.staff.role !== 'ADMINISTRATIVE') {
    setTimeout(() => {
      router.push('/dashboard/services')
    }, 90);
    return true
  }

  return true
};
const handleInput = async () => {
  try {
    console.log("Finding patient with ID:", searchQuery.value);
    // Ensure `searchQuery` has a valid value before making the call
    if (searchQuery.value.length !== 6) {
      return;
    }
    // Call the backend through patientStore
    const result = await patientStore.handleGetPatientById(searchQuery.value);

    // Check if the result is valid and update the store
    if (result !== null) {
      visitStore.createNewVisit = true;
      patientStore.noSearchMatch = false; // Reset no-match flag
    } else {
      patientStore.noSearchMatch = true; // Set no-match flag
    }

    console.log("User paused. Search result:", result);
  } catch (error) {
    // Handle potential errors from the API or store method
    console.error("Error during patient search:", error);
    patientStore.noSearchMatch = true; // Treat as no match if there's an error
  }
};
// Watch for changes in `searchQuery` and trigger `handleInput` when it's exactly 6 chars
// Watch the `searchQuery` directly
watch(searchQuery, () => {
  if (searchQuery.value.length !== 6) {
    return;
  }
  if (searchQuery.value.length === 6) {
    handleInput();
    searchQuery.value = ""
  }
});
const currentIndex = ref(Math.floor(Math.random() * partners.length));

// Set the current partner and event based on the random index
const currentPartner = ref(partners[currentIndex.value]);
function changePartner() {
  let newIndex = currentIndex.value;

  // Ensure the new index is different from the current one
  while (newIndex === currentIndex.value) {
    newIndex = Math.floor(Math.random() * partners.length);
  }

  // Update the currentIndex and currentPartner
  currentIndex.value = newIndex;
  currentPartner.value = partners[newIndex];
}

function titlize(str: string) {
  return str
    .toLowerCase() // Convert the whole string to lowercase first
    .split(" ") // Split the string into an array of words
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the array back into a single string
}

onMounted(() => {
  // Set an interval to change the partner and event every 12 seconds
  const intervalId = setInterval(() => {
    changePartner();
  }, 15000);

  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
});
// Optionally, watch for route changes to automatically toggle
watch(route, (newRoute) => {
  isComputingRoute.value = newRoute.path.includes("dashboard/computing");
  if (route.path.includes("dashboard/computing")) {
    isComputingRoute.value = true;
    drawer.value = false;
  }
});
const addingComputing = ref(false);
const topicTitle = localStorage.getItem("articleTopic");
if (topicTitle !== null && topicTitle.length > 5) {
  addingComputing.value = true;
}

onBeforeMount(async () => {
  localStorage.removeItem("articleLanguage");
  localStorage.removeItem("articleTopic");
  drawer.value = true;
  if (typeof localStorage !== "undefined") {
    const storedUser = localStorage.getItem("sessionId");
    if (storedUser === null || storedUser === "GUEST ACCESS" || !storedUser) {
      localStorage.setItem("sessionId", "GUEST ACCESS");
      readyView.value = true;
      return;
    }
    await staffStore.getCurrentUser(storedUser);
    readyView.value = true;
  }
});
onMounted(async () => {
  // await fetchPoll();
});
const { t, locale } = useI18n();

const drawer = ref(true);
const rail = ref(false);
const isRTL = computed(() => locale.value === "ar");

const evalPollPath = ref("/poll/participant");


// Fetch poll on setup

const sidebarItems = computed(() => [
  {
    title: t("dashboard.sidebar.patients"),
    tooltip: "Manage and view patient records",
    value: "patients",
    iconClass: "mdi-account-outline me-4 text-xl",
    path: "/dashboard/patients",
  },
  {
    title: t("dashboard.sidebar.appointments"),
    tooltip: "Schedule and manage patient appointments",
    value: "appointments",
    iconClass: "mdi-calendar-clock-outline me-4 text-xl",
    path: "/dashboard/appointments",
  },
  {
    title: t("dashboard.sidebar.doctors"),
    tooltip: "View and manage doctor directory",
    value: "doctors",
    iconClass: "mdi-doctor me-4 text-xl",
    path: "/dashboard/doctors",
  },

  {
    title: t("dashboard.sidebar.diagnostics"),
    tooltip: "Access diagnostics and lab results",
    value: "diagnostics",
    iconClass: "mdi-flask-outline me-4 text-xl",
    path: "/dashboard/diagnostics",
  },
  {
    title: t("dashboard.sidebar.pharmacy"),
    tooltip: "Manage pharmacy inventory and prescriptions",
    value: "pharmacy",
    iconClass: "mdi-pill me-4 text-xl",
    path: "/dashboard/pharmacy",
  },
  {
    title: t("dashboard.sidebar.billing"),
    tooltip: "Handle patient billing and payments",
    value: "billing",
    iconClass: "mdi-cash-register me-4 text-xl",
    path: "/dashboard/billing",
  },
  {
    title: t("dashboard.sidebar.staff"),
    tooltip: "View and manage staff details",
    value: "staff",
    iconClass: "mdi-account-group-outline me-4 text-xl",
    path: "/dashboard/staff",
  },
  {
    title: t("dashboard.sidebar.reports"),
    tooltip: "Generate and view hospital reports",
    value: "reports",
    iconClass: "mdi-chart-line me-4 text-xl",
    path: "/dashboard/reports",
  },

  {
    title: t("dashboard.sidebar.emergency"),
    tooltip: "Track and manage emergency cases",
    value: "emergency",
    iconClass: "mdi-alert-circle-outline me-4 text-xl",
    path: "/dashboard/emergency",
  },


  {
    title: t("dashboard.sidebar.logout"),
    tooltip: "Log out of your account",
    value: "logout",
    iconClass: "mdi-logout me-4 text-xl",
    path: "/logout",
  },
]);


function obfuscateEmail(email: string) {
  const [localPart, domainPart] = email.split("@");

  if (!localPart || !domainPart) {
    return email; // Return the original email if the format is incorrect
  }

  const obfuscatedLocal = localPart.slice(0, 1) + "****" + localPart.slice(-1);
  return `${obfuscatedLocal}@${domainPart}`;
}

function getTooltipHighlight(title: string) {
  // Function to return highlighted tooltip content based on the title
  return title;
}
async function fetchPresentersExams() {
  const userId = localStorage.getItem("sessionId");
  if (userId === null || userId === "GUEST ACCESS" || !userId) {
    localStorage.setItem("sessionId", "GUEST ACCESS");
    router.push("/auth/register");
    return;
  }
  //@ts-ignore
  await resourceStore.getPublisherLatestExams(userId);

  // Check if user is creator
  //@ts-ignore
}

async function fetchPresentersTasks() {
  const userId = localStorage.getItem("sessionId");
  if (userId === null || userId === "GUEST ACCESS" || !userId) {
    localStorage.setItem("sessionId", "GUEST ACCESS");
    router.push("/auth/register");
    return;
  }
  //@ts-ignore
  await resourceStore.getPublisherLatestTasks(userId);

  // Check if user is creator
  //@ts-ignore
}
// Clear local storage

// Clear cookies
function clearCookies() {
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  });
}
function wipeStorage() {
  // Wipe local storage
  localStorage.clear();

  // Wipe cookies
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const equalsIndex = cookie.indexOf("=");
    const name = cookie.substr(0, equalsIndex);
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Wipe session storage
  sessionStorage.clear();
}
clearCookies();
function logout() {
  try {
    wipeStorage();

    // await staffStore.logout();
    router.push("/auth/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
const goToMyAccount = () => {
  const userId = localStorage.getItem("sessionId");
  if (userId === null || userId === "GUEST ACCESS" || !userId) {
    localStorage.setItem("sessionId", "GUEST ACCESS");
    router.push("/auth/register");
    return;
  }
  router.push("my-account"); // Navigates to /my-account
};
</script>

<style scoped>
.custom-tooltip .v-tooltip__content {
  font-size: 14px;
  color: #333;
}

.custom-tooltip {
  padding: 8px;
}
</style>
