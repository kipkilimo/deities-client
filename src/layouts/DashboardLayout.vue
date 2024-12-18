<template>
  <v-app v-if="readyView" full-height>
    <v-layout full-height>
      <!-- App Bar -->
      <v-app-bar class="">
        <router-link to="/welcome" class="px-8 flex items-center w-64">
          <v-img
            src="https://a2z-v0.s3.eu-central-1.amazonaws.com/Screenshot+from+2024-10-22+16-31-16.png"
            width="180"
            @click="
              (drawer = true),
                (resourceStore.showingResourceTitles = true),
                (resourceStore.showingResourceTitleItems = false)
            "
            height="120"
          />
        </router-link>

        <v-btn icon @click="drawer = !drawer">
          <span class="i-iconoir-menu text-2xl"></span>
        </v-btn>

        <v-spacer />

        <!-- User Controls v-if="userStore.user && userStore.user.personalInfo.username"
v-if="userStore.user && userStore.user.personalInfo.username"
v-if="userStore.user && userStore.user.personalInfo.username" -->
        <v-text-field
          v-model="searchQuery"
          label="Search"
          size="small"
          variant="outlined"
          density="compact"
          rounded
          class="mt-7"
          max-width="21rem"
          clearable
          append-inner-icon="mdi-magnify"
          @input="handleInput"
        ></v-text-field>
        <v-col cols="auto">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                rounded
                density="comfortable"
                @click="goToRegister()"
              >
                <v-icon>mdi-note-plus-outline</v-icon>
              </v-btn>
            </template>
            <span
              >{{
                userStore.user && userStore.user.personalInfo.username
                  ? "Add a resource"
                  : "Add a resource | ⓘ Requires signing in"
              }}
            </span>
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                rounded
                class="ml-2"
                density="comfortable"
                @click="fetchPresentersTasks"
              >
                <v-icon>mdi-calendar-check-outline</v-icon>
              </v-btn>
            </template>
            <span
              >{{
                userStore.user && userStore.user.personalInfo.username
                  ? "Manage my assignments"
                  : "Manage my assignments | ⓘ Requires signing in"
              }}
            </span>
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                rounded
                class="ml-2"
                density="comfortable"
                @click="fetchPresentersExams"
              >
                <v-icon>mdi-clock-edit-outline</v-icon>
              </v-btn>
            </template>
            <span
              >{{
                userStore.user && userStore.user.personalInfo.username
                  ? "Manage my exams"
                  : "Manage my exams | ⓘ Requires signing in"
              }}
            </span>
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                rounded
                class="ml-2"
                density="comfortable"
                @click="goToMyAccount"
              >
                <v-icon>mdi-account-file-text-outline</v-icon>
              </v-btn>
            </template>
            <span
              >{{
                userStore.user && userStore.user.personalInfo.username
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
      <v-navigation-drawer
        rounded
        v-model="drawer"
        class="m-2 max-h-[calc(100%-82px)]"
        :rail="rail"
        :location="isRTL ? 'end' : 'start'"
      >
        <template v-slot:prepend>
          <div class="p-2 flex" :class="{ 'justify-center': rail }">
            <v-btn icon size="sm" variant="text" @click="rail = !rail">
              <span
                :class="rail ? 'rotate-180' : 'rotate-0'"
                class="i-iconoir-fast-arrow-left text-xl rtl:transform rtl:rotate-180 transition-transform duration-300"
              ></span>
            </v-btn>
          </div>
        </template>

        <v-list density="compact" nav>
          <v-list-item
            height="100"
            :prepend-avatar="
              userStore.user && userStore.user.personalInfo.username
                ? `https://ui-avatars.com/api/?name=${userStore.user.personalInfo.username}&background=0D8ABC&color=fff`
                : 'https://ui-avatars.com/api/?name=Guest&background=0D8ABC&color=fff'
            "
            :title="
              userStore.user && userStore.user.personalInfo.username
                ? userStore.user.personalInfo.username
                : 'Guest User'
            "
            :subtitle="
              userStore.user && userStore.user.personalInfo.email
                ? obfuscateEmail(userStore.user.personalInfo.email)
                : 'guest@nem.bio'
            "
            class="me-4"
          />

          <v-divider></v-divider>

          <v-list>
            <v-list-item
              v-for="item in sidebarItems"
              :key="item.value"
              :value="item.value"
              :to="item.path"
            >
              <v-tooltip
                activator="parent"
                location="bottom"
                class="custom-tooltip"
              >
                <template v-slot:activator="{ props }" v-show="rail">
                  <div
                    @click="checkRoute(item.title)"
                    v-bind="props"
                    class="d-flex align-center"
                  >
                    <v-icon class="me-2">{{ item.iconClass }}</v-icon>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </div>
                </template>
                <span class="custom-tooltip_content">{{
                  getTooltipHighlight(item.tooltip)
                }}</span>
              </v-tooltip>
            </v-list-item>

            <v-divider class="mt-2" />
            <h3 color="#777777" class="ml-2 mt-2 mb-2 text-left">
              {{ titlize(currentPartner.partnerType) }} Partner
            </h3>
            <v-divider class="mt-1" />

            <v-img
              class="bg-white ma-4 d-flex justify-left"
              :src="currentPartner.logo"
              max-width="85%"
              contain
              max-height="27.5vh"
            ></v-img>
            <p class="text-center">
              {{ currentPartner.fullname }}
            </p>
            <div class="pa-2">
              <v-btn
                :block="!rail"
                :icon="rail"
                variant="outlined"
                :size="rail ? 'small' : undefined"
                @click="logout"
              >
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

    <!-- Dialogs -->
    <v-dialog
      v-model="resourceStore.showCreateResourceDialog"
      width="85%"
      min-height="84vh"
      persistent
    >
      <v-card min-height="84vh" title="Add a new resource">
        <ResourceBaseForm />
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="resourceStore.showAddResourceCoverAndContentDialog"
      width="85%"
      height="84vh"
      persistent
    >
      <v-card height="84vh" title="Add resource content">
        <ResourceContentsHandler />
        <v-card-actions style="position: relative; padding: 0; margin: 0">
          <v-spacer />
          <v-btn
            variant="text"
            color="red"
            @click="resourceStore.showAddResourceCoverAndContentDialog = false"
            style="position: absolute; bottom: 0; right: 0; margin: 16px"
          >
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
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/users";
import { useRouter } from "vue-router";
import PublisherExams from "@/components/resourcePlayers/test/PublisherExams.vue";

import partners from "@/data/partnersSponsors";

import PublisherAssignments from "@/components/resourcePlayers/tasks/PublisherAssignments.vue";
import { useResourceStore } from "@/stores/resources";

const isComputingRoute = ref(false);
const route = useRoute();
const readyView = ref(false);
const userStore = useUserStore();
/**setCurrentSubjectArea(newSubject) */
const currentUserId = localStorage.getItem("sessionId");

const resourceStore = useResourceStore();
function setSubjectTopics(newSubject: string) {
  resourceStore.setCurrentSubjectArea(newSubject);
}
// Method to check if the current route includes 'dashboard/computing'
const checkRoute = (newSubject: string) => {
  resourceStore.showingResourceTitles = true;
  resourceStore.showingResourceTitleItems = false;

  if (route.path.includes("dashboard/library")) {
    resourceStore.setCurrentSubjectArea(newSubject);
  }
  if (route.path.includes("dashboard/computing")) {
    isComputingRoute.value = true;
    drawer.value = false;
  } else {
    isComputingRoute.value = false;
  }
};

const searchQuery = ref("");
let debounceTimer: string | number | NodeJS.Timeout | undefined;

const handleInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    onUserPaused(searchQuery.value);
  }, 300); // 300ms delay
};

const onUserPaused = (query: string) => {
  console.log("User paused. Searching for:", query);
  // Add your logic here, e.g., API call, filtering, etc.
};
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
  }, 45000);

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
router.push("/dashboard/library")
  drawer.value = true;
  resourceStore.showingResourceTitles = true;
  resourceStore.showingResourceTitleItems = false;
  if (typeof localStorage !== "undefined") {
    const storedUser = localStorage.getItem("sessionId");
    if (storedUser === null || storedUser === "GUEST ACCESS" || !storedUser) {
      localStorage.setItem("sessionId", "GUEST ACCESS");
      readyView.value = true;
      return;
    }
    await userStore.getCurrentUser(storedUser);
    readyView.value = true;
  }

});
onMounted(async () => {
  await fetchPoll();
});
const { t, locale } = useI18n();
const router = useRouter();

const drawer = ref(true);
const rail = ref(false);
const isRTL = computed(() => locale.value === "ar");

const evalPollPath = ref("/poll/participant");

// Function to fetch the latest poll and update the path
const fetchPoll = async () => {
  const userId = localStorage.getItem("sessionId");
  if (userId === null || userId === "GUEST ACCESS" || !userId) {
    localStorage.setItem("sessionId", "GUEST ACCESS");
    return 0;
  }
  //@ts-ignore
  await resourceStore.getPublisherLatestPoll(userId);

  // Check if user is creator
  //@ts-ignore
  if (resourceStore.resource.createdBy.id === userId) {
    evalPollPath.value = `/poll/presenter?sessionId=${resourceStore.resource.sessionId}&accessKey=${resourceStore.resource.accessKey}`;
  } else {
    evalPollPath.value = `/poll/participant?sessionId=${resourceStore.resource.sessionId}&accessKey=${resourceStore.resource.accessKey}`;
  }
};

// Fetch poll on setup

const sidebarItems = computed(() => [
  {
    title: t("dashboard.sidebar.epidemiology"),
    tooltip: "Explore epidemiology resources",
    value: "epidemiology",
    iconClass: "mdi-account-multiple-outline",
    path: "/dashboard/library",
  },
  {
    title: t("dashboard.sidebar.biostatistics"),
    tooltip: "Access biostatistics tools and resources",
    value: "biostatistics",
    iconClass: "mdi-chart-histogram me-4 text-xl",
    path: "/dashboard/library",
  },
  {
    title: t("dashboard.sidebar.research-methods"),
    tooltip: "Learn about research methodologies",
    value: "research-methods",
    iconClass: "mdi-bookshelf me-4 text-xl",
    path: "/dashboard/library",
  },

  {
    title: t("dashboard.sidebar.papers"),
    tooltip: "Read and participate in interactive journal papers discussion",
    value: "papers",
    iconClass: "mdi-note-text-outline me-4 text-xl",
    path: "/dashboard/papers",
  },
  {
    title: t("dashboard.sidebar.poster"),
    tooltip: "Create and share your posters for presentations",
    value: "poster",
    iconClass: "mdi-image-frame me-4 text-xl",
    path: "/dashboard/poster",
  },
  {
    title: t("dashboard.sidebar.poll"),
    tooltip: "Create and participate in LIVE polls",
    value: "poll",
    iconClass: "mdi-ballot-recount-outline me-4 text-xl",
    path: evalPollPath.value, // Use the dynamic path here
  },
  {
    title: t("dashboard.sidebar.events"),
    tooltip: "View and schedule events",
    value: "events",
    iconClass: "mdi-calendar-multiple-check me-4 text-xl",
    path: "/dashboard/events",
  },

  {
    title: t("dashboard.sidebar.programming"),
    tooltip: "Learn and practice programming",
    value: "programming",
    iconClass: "mdi-code-block-braces me-4 text-xl",
    path: "/dashboard/computing",
  },
  {
    title: t("dashboard.sidebar.consults"),
    tooltip: "Consult experts and get advice at all stages of your study",
    value: "consults",
    iconClass: "mdi-timeline-question-outline me-4 text-xl",
    path: "/dashboard/consults",
  },
  {
    title: t("dashboard.sidebar.donate"),
    tooltip: "Support the life sciences—donate to share knowledge!",
    value: "donate",
    iconClass: "mdi-wallet-giftcard me-4 text-xl",
    path: "/donate",
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
function goToRegister() {
  const userId = localStorage.getItem("sessionId");
  if (userId === null || userId === "GUEST ACCESS" || !userId) {
    localStorage.setItem("sessionId", "GUEST ACCESS");
    router.push("/auth/register");
    return;
  }
  resourceStore.showCreateResourceDialog = true;
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

    // await userStore.logout();
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
