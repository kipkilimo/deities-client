<template>
  <v-container>
    <div v-if="isLoading">
      <v-progress-linear color="teal" indeterminate></v-progress-linear>
    </div>
    <div v-if="!isLoading">
      <v-alert
        border="top"
        type="warning"
        variant="outlined"
        prominent
        class="ml-38 mt-4"
        width="72%"
        v-if="isError"
      >
        {{ isError }}
      </v-alert>

      <v-alert
        border="top"
        type="info"
        class="ml-38 mt-4"
        width="72%"
        variant="outlined"
        prominent
        v-if="!isLoading && parsedAssignments[0].id.length === 0"
      >
        <h4>You are not enrolled in any tasks.</h4>
        <h6>Check back later.</h6>
      </v-alert>
      <v-row
        class="overflow-y-auto mt-1"
        style="height: 400px; max-height: 400px; overflow-y: auto"
        v-if="!isLoading && parsedAssignments[0].id.length > 5"
      >
        <v-col
          v-for="(item, index) in parsedAssignments"
          :key="index"
          cols="12"
          sm="12"
          md="6"
          lg="6"
        >
          <v-card
            class="mx-auto my-2"
            style="
              background-image: url(&quot;https://slidechef.net/wp-content/uploads/2023/10/Math-Background.jpg&quot;);
              background-size: cover;
              background-position: center;
            "
          >
            <!-- {{ item.assignmentTaskSet[0] }} src="item.coverImage"-->
            <v-row>
              <!-- <v-col cols="3"> <v-img height="13.5rem"></v-img>  </v-col>-->

              <v-col cols="12">
                <!-- Display Assignment Title and Meta Information -->
                <v-card-title class="headline text-h4 text-black">{{
                  item.title
                }}</v-card-title>
                <v-card-subtitle class="text-overline text-black"
                  >ASSIGNMENT {{ item.contentType }}</v-card-subtitle
                >

                <v-divider />

                <!-- Assignment Details -->
                <v-card-subtitle class="text-black">
                  <strong>Duration:</strong>
                  {{ item.assignmentDuration }}<br />
                  <strong>Deadline:</strong>
                  {{ item.assignmentDeadline }} <br />
                  <strong>Due in: {{ item.remainingTimeNew }}</strong>
                  <br />
                </v-card-subtitle>

                <v-card-text class="bg-surface-light pt-4">{{
                  item.description || "None"
                }}</v-card-text>

                <v-divider />
              </v-col>
            </v-row>
            <!-- Assignment Actions -->
            <v-card-actions>
              <v-spacer />
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    color="#212121"
                    prepend-icon="mdi-file-edit-outline"
                    size="large"
                    block
                    rounded="x-small"
                    variant="outlined"
                    @click="attemptTask(item)"
                    >View Assignment Task
                  </v-btn>
                </template>
                <span>View Assignment Task</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useResourceStore } from "../../../stores/resources"; // Replace with actual path
import { DateTime } from "luxon";
import { useRouter } from "vue-router";
const router = useRouter();

// State variables
const parsedAssignments = ref([
  {
    assignmentType: "",
    assignmentTitle: "",
    assignmentDescription: "",
    assignmentDuration: { hours: 0, minutes: 0 },
    assignmentDeadline: "",
    remainingTimeNew: "",
    assignmentAnswersKey: [],
    assignmentTaskSet: [],
    id: "",
    contentType: "",
    title: "",
    coverImage: "",
    description: "",
    subject: "",
    topic: "",
    createdBy: { id: "", username: "", role: "" },
    createdAt: "",
    sessionId: "",
    accessKey: "",
  },
]); // Hold transformed assignments
const isLoading = ref(false); // Loading state
const isError = ref(""); // Error state

// Resource store
const resourceStore = useResourceStore();

// Fetch and process assignments
const handleGetUserTasks = async () => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem("sessionId");
    await resourceStore.getUserTasks(storedUser || ""); // Safely handle null sessionId
    if (resourceStore.resources.length >= 1) {
      // Map and transform the assignments
      parsedAssignments.value = resourceStore.resources.map((task) =>
        transformAssignment(task)
      );
    }

    isLoading.value = false;
  } catch (error) {
    isError.value = `Failed to fetch tasks: ${error}`;
    isLoading.value = false;
  }
};

function formatDate(targetTime: string): string {
  const now = DateTime.local();

  // Get the current time in milliseconds (epoch time)
  const currentMillis = now.toMillis(); // Get user's timezone// Parse the target time string into a Date object
  const targetDate = DateTime.fromFormat(
    targetTime,
    "cccc, LLLL d, yyyy 'at' h:mm a 'GMT'Z"
  );
  //new Date(targetTime);
 
  // Get the current time in milliseconds
  const currentTime = currentMillis;

  // Get the target time in milliseconds
  const targetDeadlineTime = targetDate.toMillis();

  // Compare the current time with the target time
  
  // Calculate the difference in milliseconds
  const diff = targetDeadlineTime - currentTime;

  // If the target time has already passed
  if (diff <= 0) {
    return "Lapsed.";
  }

  // Calculate time components
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  // Construct the return message
  const result: string[] = [];
  if (days > 0) result.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0 || result.length === 0)
    result.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  return result.join(", ");
}

const transformAssignment = (assignment: {
  id: string;
  title: string;
  description: string;
  content: string;
  targetRegion: string;
  targetCountry: string;
  slug: string;
  language: string;
  contentType: string;
  viewsNumber: number;
  likesNumber: number;
  sharesNumber: number;
  subject: string;
  topic: string;
  rating: string;
  sessionId: string;
  accessKey: string;
  keywords: string;
  coverImage: string;
  isPublished: boolean;
  averageRating: number;
  reviews: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}) => {
  const content = JSON.parse(assignment.content || "{}");
  const assignmentMetaInfo = JSON.parse(content.assignmentMetaInfo || "{}");
  const remainingTimeNew = formatDate(assignmentMetaInfo.assignmentDeadline);

  return {
    ...assignmentMetaInfo,
    assignmentAnswersKey: JSON.parse(content.assignmentAnswersKey || "[]"),
    assignmentTaskSet: JSON.parse(content.assignmentTaskSet || "[]"),
    id: assignment.id,
    remainingTimeNew,
    contentType: assignment.contentType,
    title: assignment.title,
    description: assignment.description,
    createdBy: {
      id: assignment.createdBy.id,
      username: assignment.createdBy?.personalInfo?.username || "Unknown",
      role: assignment.createdBy.role,
    },
    createdAt: new Date(Number(assignment.createdAt)).toISOString(),
  };
};

onMounted(async () => {
  // Fetch user tasks once the component is mounted
  await handleGetUserTasks();

  // Start the interval after fetching tasks
  const intervalId = setInterval(() => {
    // Check if there are any resources available
    if (resourceStore.resources.length >= 1) {
      // Map and transform the assignments
      parsedAssignments.value = resourceStore.resources.map((task) =>
        transformAssignment(task)
      );
    }
  }, 1000);

  // Clean up the interval when the component is unmounted
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
async function attemptTask(item: any) { 
  const resourceId = item.id;
  await resourceStore.fetchResource(resourceId);
  router.push("task");
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
