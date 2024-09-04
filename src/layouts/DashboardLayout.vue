<template>
  <v-app full-height>
    <v-layout full-height>
      <v-app-bar class="!fixed">
        <router-link to="/welcome" class="px-8 flex items-center w-64">
          <v-img
            src="https://www.hda-institute.com/wp-content/uploads/2021/05/hdai_logo_FINAL_horz-2lines_full-color_wo-tag.png"
            :width="100"
            :height="40"
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
              </v-btn></template
            >
            <span> Add a resource</span>
          </v-tooltip>
        </v-col>

        <v-btn icon variant="text" color="inherit">
          <span class="i-iconoir-bell text-2xl"></span>
        </v-btn>
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
            :prepend-avatar="`https://ui-avatars.com/api/?name=${user.personalInfo.username}&background=0D8ABC&color=fff`"
            :title="user.personalInfo.username"
            :subtitle="obfuscateEmail(user.personalInfo.email)"
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
                  <div
                    v-bind="props"
                    class="d-flex align-center"
                    @mouseover="() => onHover(item.path)"
                    @mouseleave="onLeave"
                  >
                    <v-icon class="me-2">{{ item.iconClass }}</v-icon>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </div>
                </template>
                <span class="custom-tooltip_content">{{
                  getTooltipHighlight(item.title)
                }}</span>
              </v-tooltip>
            </v-list-item>
            <v-divider class="mt-2" />
            <h3 color="#55565a" class="text-h10 mb-4">Sponsors</h3>
            <v-img
              class="mt-3"
              style="border-radius: 0px 0px 5px 5px"
              src="https://www.boehringer-ingelheim.com/sites/default/files/Innovation/open_innovation/open_innovation_at_boehringer_ingelheim.jpg"
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

    <!-- 
        <v-dialog v-model="showAddResourceContentDialog" width="85%" height="84vh">
      <v-card height="84vh" title="Add a new resource">
        <ResourceBaseForm />
      </v-card>
    </v-dialog> -->
  </v-app>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
// @ts-ignore
const { t, locale } = useI18n();
import { useUserStore } from "../stores/users";
import { useRouter } from "vue-router";
const router = useRouter();
import { useResourceStore } from "../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
onBeforeMount(async () => {
  if (typeof localStorage !== "undefined") {
    const storedUser = localStorage.getItem("sessionId");
    if (storedUser) {
      try {
        await userStore.getCurrentUser(storedUser);
      } catch (error) {
        router.push("/auth/login");
      }
    }
  }
});
function obfuscateEmail(email: { split: (arg0: string) => [any, any] }) {
  const [localPart, domainPart] = email.split("@");

  if (!localPart || !domainPart) {
    return email; // Return the original email if the format is incorrect
  }

  const obfuscatedLocal =
    localPart.slice(0, 4) + "*".repeat(Math.max(0, localPart.length - 2));

  const domainParts = domainPart.split(".");

  if (domainParts.length < 2) {
    return email; // Return the original email if the domain format is incorrect
  }

  const obfuscatedDomain =
    domainParts[0].slice(0, 1) +
    "*".repeat(Math.max(0, domainParts[0].length - 1)) +
    "." +
    domainParts.slice(1).join(".");

  return `${obfuscatedLocal}@${obfuscatedDomain}`;
}

const userStore = useUserStore();
const user = computed(() => userStore.user);

function logout() {
  userStore.logout();
}
// papers: Papers https://api.jsonserve.com/CHZMhR
// poster: Posters
// poll: Poll
// news: News
const drawer = ref(true);

const rail = ref(false);
const isRTL = computed(() => locale.value === "ar");
const sidebarItems = computed(() => [
  {
    title: t("dashboard.sidebar.dashboard-overview"),
    value: "dashboard-overview",
    iconClass: "i-iconoir-dashboard-speed me-4 text-xl",
    path: "/dashboard/overview",
  },
  {
    title: t("dashboard.sidebar.papers"),
    value: "papers",
    iconClass: "mdi-note-text-outline me-4 text-xl",
    path: "/dashboard/papers",
  },
  {
    title: t("dashboard.sidebar.poster"),
    value: "poster",
    iconClass: "mdi-image-frame me-4 text-xl",
    path: "/dashboard/poster",
  },
  {
    title: t("dashboard.sidebar.poll"),
    value: "poll",
    iconClass: "mdi-ballot-recount-outline me-4 text-xl",
    path: "/dashboard/poll",
  },
  {
    title: t("dashboard.sidebar.tasks"),
    value: "tasks",
    iconClass: "i-iconoir-doc-star me-4 text-xl",
    path: "/dashboard/tasks",
  },
  {
    title: t("dashboard.sidebar.events"),
    value: "events",
    iconClass: "mdi-calendar-multiple-check me-4 text-xl",
    path: "/dashboard/events",
  },
  {
    title: t("dashboard.sidebar.library"),
    value: "library",
    iconClass: "mdi-bookshelf me-4 text-xl",
    path: "/dashboard/library",
  },  {
    title: t("dashboard.sidebar.programming"),
    value: "programming",
    iconClass: "mdi-code-block-braces me-4 text-xl",
    path: "/dashboard/programming",
  },
  {
    title: t("dashboard.sidebar.consults"),
    value: "consults",
    iconClass: "mdi-timeline-question-outline me-4 text-xl",
    path: "/dashboard/consults",
  },
]);
function getTooltipHighlight(key: string): string {
  const tooltips: { [key: string]: string } = {
    Dashboard: "Get an overview of our milestones",
    "Paper Dive": "Contribute in a paper discussion!",
    Posters: "Share your abstract poster on NEMBi",
    "Live Poll": "Submit your opinion via NEMBi Live Polls",
    "Assignment Tasks": "View and attempt Assignment Tasks",
    "Computational Methods": "Learn programming methods for analyzing research data in the life sciences",
    "Research Consultation": "Personalized guidance and support to researchers at all stages",
    Events: "See upcoming NEMBi and external Events",
    "Resource Center":
      "Browse a wide range of resources at NEMBi Resource Center",
    "Research Counsel":
      "Request for a Professional Research Counselling session with NEMBi Mentor Scholars for all stages of your project!",
    Logout: "Logout",
  };

  return tooltips[key] || "Unknown";
}

// Example usage:
const hoverTimeout = ref(1);

const onHover = (title: any) => {
  // Start a timer to call a method after 2.1 seconds and pass the title as a parameter
  // @ts-ignore
  hoverTimeout.value = setTimeout(() => {
    handleHover(title);
  }, 1800); // 2100ms = 2.1 seconds
};

const onLeave = () => {
  // Clear the timeout if the user leaves the element before 2.1 seconds
  clearTimeout(hoverTimeout.value);
};

const handleHover = (title: any) => {
  // Your logic that runs after 2.1 seconds, using the title passed from onHover
  router.push(title);
  // Replace with any other method you want to call, using the passed parameter
};
</script>
