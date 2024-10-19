<template>
  <v-app full-height v-if="readyView===true">
    <v-layout full-height>
      <v-app-bar class="!fixed">
        <router-link to="/welcome" class="px-8 flex items-center w-64">
          <v-img
            src="https://a2z-v0.s3.eu-central-1.amazonaws.com/NEMBio+Logo+wide.png"
            :width="120"
            :height="70"
          />
        </router-link>

        <v-btn icon @click="drawer = !drawer">
          <span class="i-iconoir-menu text-2xl"></span>
        </v-btn>

        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                rounded
                density="comfortable"
                @click="resourceStore.showCreateResourceDialog = true"
              >
                <v-icon>mdi-note-plus-outline</v-icon>
              </v-btn>
            </template>
            <span> Add a resource</span>
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
            <span> Manage my assignments</span>
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
            <span> Manage my exams</span>
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
            <span>My account</span>
          </v-tooltip>
        </v-col>

        <LocaleToggler />
        <ThemeToggler />
      </v-app-bar>

      <v-navigation-drawer
        rounded
        v-model="drawer"
        class="m-2 max-h-[calc(100%-82px)] !fixed"
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
            :prepend-avatar="`https://ui-avatars.com/api/?name=${userStore.user.personalInfo.username}&background=0D8ABC&color=fff`"
            :title="userStore.user.personalInfo.username"
            :subtitle="obfuscateEmail(userStore.user.personalInfo.email)"
            class="me-4"
          ></v-list-item>

          <v-divider></v-divider>
          <v-list-item-group>
            <v-list-item
              v-for="item in sidebarItems"
              :key="item.value"
              :value="item.value"
              :to="item.path"
            >
              <v-tooltip
                activator="parent"
                location="top"
                class="custom-tooltip"
              >
                <template v-slot:activator="{ props }" v-show="rail">
                  <div v-bind="props" class="d-flex align-center">
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
            <h3 color="#55565a" class="text-h10 mb-4">Partners</h3>
            <v-img
              class="mt-3"
              style="border-radius: 0px 0px 5px 5px"
              src="https://assets.bizclikmedia.net/580/d07c504f4f85d8f6a3c308c34edb7b93:b4ee3e25d34286c263ca95017d7fb60d/bro-3186903594-boehringeringelheim-dec2022.jpg"
            ></v-img>
          </v-list-item-group>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn
              :block="!rail"
              :icon="rail"
              :size="rail ? 'small' : undefined"
              @click="logout"
            >
              <v-icon class="i-iconoir-log-out text-xl"></v-icon>
              <span v-show="!rail">
                {{ $t("dashboard.sidebar.logout") }}
              </span>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

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

import PublisherAssignments from "@/components/resourcePlayers/tasks/PublisherAssignments.vue";
import { useResourceStore } from "@/stores/resources";
const isComputingRoute = ref(false);
const route = useRoute();
const readyView=ref(false)
// Method to check if the current route includes 'dashboard/computing'
const checkRoute = () => {
  if (route.path.includes("dashboard/computing")) {
    isComputingRoute.value = true;
    drawer.value = false;
  } else {
    isComputingRoute.value = false;
  }
};

// Optionally, watch for route changes to automatically toggle
watch(route, (newRoute) => {
  checkRoute();
  isComputingRoute.value = newRoute.path.includes("dashboard/computing");
});
const resourceStore = useResourceStore();
const addingComputing = ref(false);
const topicTitle = localStorage.getItem("articleTopic");
if (topicTitle !== null && topicTitle.length > 5) {
  addingComputing.value = true;
}
onBeforeMount(async () => {
  localStorage.removeItem("articleLanguage");
  localStorage.removeItem("articleTopic");

  if (typeof localStorage !== "undefined") {
    const storedUser = localStorage.getItem("sessionId");
    if (storedUser) {
      try {
        await userStore.getCurrentUser(storedUser);
        readyView.value=true
      } catch (error) {
        router.push("/auth/login");
      }
    }
  }
});
onMounted(async () => {
  await fetchPoll();
});
const { t, locale } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const drawer = ref(true);
const rail = ref(false);
const isRTL = computed(() => locale.value === "ar");
 

const evalPollPath = ref("/poll/participant");

// Function to fetch the latest poll and update the path
const fetchPoll = async () => {
  const userId = localStorage.getItem("sessionId");
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
    title: t("dashboard.sidebar.dashboard-overview"),
    tooltip: "Glance at an overview of the resources added to NEMBio",
    value: "dashboard-overview",
    iconClass: "i-iconoir-dashboard-speed me-4 text-xl",
    path: "/dashboard/overview",
  },
  {
    title: t("dashboard.sidebar.library"),
    tooltip: "Access the digital library",
    value: "library",
    iconClass: "mdi-bookshelf me-4 text-xl",
    path: "/dashboard/library",
  },
  {
    title: t("dashboard.sidebar.tasks"),
    tooltip: "Manage and track your assignments",
    value: "tasks",
    iconClass: "i-iconoir-doc-star me-4 text-xl",
    path: "/dashboard/tasks",
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
    title: t("dashboard.sidebar.analysis"),
    tooltip: "We collect, analyze and generate reports from data",
    value: "analysis",
    iconClass: "mdi-database-refresh-outline me-4 text-xl",
    path: "/dashboard/analysis",
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
  //@ts-ignore
  await resourceStore.getPublisherLatestExams(userId);

  // Check if user is creator
  //@ts-ignore
}
async function fetchPresentersTasks() {
  const userId = localStorage.getItem("sessionId");
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
