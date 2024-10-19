<template>
  <div>
    <v-row>
      <v-col cols="12" sm="9">
        <h2 class="mb-2">NEMBio PaperDive Journal Articles</h2>
      </v-col>
      <v-col cols="12" sm="3">
        <v-btn
          color="#6a808b"
          variant="outlined"
          @click="paperStore.showCreatePaper = true"
          rounded
          style="display: inline-flex; align-items: center"
        >
          <v-icon size="32">mdi-format-list-group-plus</v-icon>Add article for
          discussion
        </v-btn>
      </v-col>
    </v-row>

    <v-divider />
    <div class="" v-if="!isLoading && paperStore.papers.length === 0">
      <v-card-item title="No papers to show">
        <template v-slot:subtitle>
          <v-icon
            class="me-1 pb-1"
            color="info"
            icon="mdi-information-variant-circle"
            size="24"
          ></v-icon>

          Create a paper discussion or join by invitation link
        </template>
      </v-card-item>
    </div>
    <div class="" v-if="isLoading">
      <v-progress-linear color="cyan" indeterminate></v-progress-linear>
    </div>
    <v-row
      v-if="!isLoading && paperStore.papers.length > 0"
      class="overflow-y-auto mt-1"
      style="height: 95vh; max-height: 95vh"
    >
      <v-col
        cols="12"
        sm="12"
        md="12"
        lg="6"
        v-for="(paper, index) in paperStore.papers"
        :key="index"
      >
        <v-card
          :disabled="loading"
          max-width="48rem"
          min-width="48rem"
          height="21rem"
          :loading="loading"
          class="mx-auto my-3"
          color="#f9f3b9"
          style="
            background-image: url(&quot;https://t3.ftcdn.net/jpg/02/81/21/10/360_F_281211036_24KPea5poawt4mXYlEjRUwsCgomtjoVc.jpg&quot;);
            background-size: cover;
            background-position: center;
          "
        >
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
              :active="isActive"
              color="deep-purple"
              height="4"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-card-item class="ma-2">
            <h6 class="text-h6 font-weight-black" color="#55565a">
              <span class="" color="#55565a">
                {{ paper.title }}
                <br />
              </span>
            </h6>

            <!-- 
            <h5
              style="
                white-space: transparent;
                overflow: visible;
                text-overflow: clip;
                background-color: transparent;
              "
            >
              <h5 style="margin: 0; white-space: transparent">
                {{
                  paper.title.length > 125
                    ? paper.title.substring(0, 125) + "..."
                    : paper.title + "\n"
                }}
                <span v-if="paper.title.length <= 125"><br /></span>
              </h5>
            </h5> -->

            <v-divider />
            <v-card-text>
              <strong><h5>Paper objective</h5></strong>
              {{
                paper.objective.length > 255
                  ? paper.objective.substring(0, 255) + "..."
                  : paper.objective
              }}
            </v-card-text>
          </v-card-item>

          <v-card-actions>
            <v-list-item class="w-100">
              <template v-slot:prepend>
                <v-avatar
                  color="grey-darken-3"
                  image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                ></v-avatar>
              </template>

              <v-list-item-title
                >By
                {{ paper.createdBy.personalInfo.username }}</v-list-item-title
              >

              <v-list-item-subtitle>{{
                paper.createdBy.role
              }}</v-list-item-subtitle>

              <template v-slot:append>
                <div class="justify-self-end">
                  <v-icon class="me-1" icon="mdi-chat-outline"></v-icon>
                  <span class="subheading me-2">{{
                    paper.discussion.length
                  }}</span>
                  <span class="me-1"> | </span>
                  <v-icon
                    class="me-1"
                    icon="mdi-clipboard-text-clock-outline"
                  ></v-icon>
                  <span class="subheading"
                    >Published on
                    {{ formatDateTime(Number(paper.createdDate) / 1000) }} ({{
                      timeAgo(Number(paper.createdDate))
                    }}).
                  </span>
                </div>
              </template>
            </v-list-item>
          </v-card-actions>
          <v-divider class="mx-1 mb-1"></v-divider>

          <v-card-actions
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
            "
          >
            <div style="display: flex; align-items: center">
              <v-btn @click="handleSetPaper(paper)" class="mr-2">
                <v-icon class="mr-2">mdi-dots-vertical</v-icon> About
              </v-btn>

              <v-btn color="#EB7082" text :href="paper.url" target="_blank">
                Read Paper
              </v-btn>
              <v-spacer />
              <v-btn
                variant="text"
                style="display: flex; color: #003c7b; align-items: center"
                color="#003c7b"
                @click="submitPaperData(paper)"
                >DISCUSS PAPER</v-btn
              >
            </div>

            <v-spacer /> 

            <div style="display: flex; align-items: center" 
                v-if="userId === paper.createdBy.id">
              <v-btn
                color="#0e234f"
                class="mr-4"
                v-if="userId === paper.createdBy.id"
                variant="outlined"
                @click="showPaperLinkInviteGenerator(paper)"
                rounded
                style="display: inline-flex; align-items: center"
              >
                <v-icon size="32">mdi-cloud-lock-open-outline</v-icon>MANAGE
                PARTICIPANTS
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      border="top"
      type="warning"
      variant="outlined"
      prominent
      class="ml-38 mt-4"
      width="72%"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </v-alert>

    <v-alert
      border="top"
      v-if="success"
      type="success"
      class="ml-38 mt-4"
      width="72%"
      variant="outlined"
      prominent
    >
      {{ success }}
    </v-alert>
    <v-dialog v-model="paperContributorsDialog">
      <v-card>
        <PaperInviteHandler />
      </v-card>
    </v-dialog>

    <v-dialog v-model="paperStore.showCreatePaper">
      <v-card width="720">
        <PaperForm />
      </v-card>
    </v-dialog>

    <v-dialog v-model="journalTask" width="auto">
      <v-card
        class="mx-auto"
        prepend-icon="mdi-checkbox-marked-circle-auto-outline"
        width="540"
      >
        <v-card-subtitle
          class="mb-1"
          color="green darken-2"
          :class="{ 'past-due': isPastDue, 'on-time': !isPastDue }"
          ><v-icon class="mr-1">mdi-clipboard-text-clock</v-icon>

          <span
            >Discussion open till
            <strong>{{ evalClosingDate(paperStore.paper.createdDate) }}</strong
            >.</span
          >
        </v-card-subtitle>
        <template
          v-slot:title
          prepend-icon="mdi-checkbox-marked-circle-auto-outline"
        >
          <span class="font-weight-black ml-0">{{
            paperStore.paper.title
          }}</span>
        </template>

        <v-card-text class="bg-surface-light pt-4">
          <strong>Objective(s):</strong> {{ paperStore.paper.objective }}
        </v-card-text>
        <p class="ml-sm">
          📚 INSTRUCTIONS <br />
          <i>
            <span
              >1. Discussion closes after 30 submitted comments (
              {{ paperStore.paper.discussion.length }} submitted )</span
            >
            <br />
            <span>2. Upto three (3) contributions per person per paper.</span
            ><br />
            <span
              >3. Be brief and stay within the journal club paper
              objectives.</span
            ></i
          >
        </p>
        <v-divider />
        <v-card-actions>
          <v-btn
            text="Close"
            variant="text"
            color="orange"
            @click="journalTask = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { usePaperStore } from "@/stores/papers";
const apiUrl = import.meta.env.VITE_BASE_URL;
import { useRouter } from "vue-router";
const router = useRouter();

const paperStore = usePaperStore();
const route = useRoute();
const sessionId = ref(paperStore.paper.sessionId); // ref(route.query.sessionId || route.params.sessionId); // Fetch sessionId from query or params
const userId = ref(localStorage.getItem("sessionId")); // Retrieve userId from local storage
const success = ref(null);
const isLoading = ref(false);
const journalTask = ref(false);

const paperContributorsDialog = ref(false);
const errorMessage = ref(null);

function handleSetPaper(paper) {
  paperStore.setPaper(paper);
  journalTask.value = true;
}
function evalClosingDate(timestamp) {
  // Convert the timestamp to an integer
  const originalDate = new Date(parseInt(timestamp, 10));

  // Add 30 days (30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const futureDate = new Date(
    originalDate.getTime() + 28 * 24 * 60 * 60 * 1000
  );

  // Format the date and time with full weekday and custom date-time style
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // Use toLocaleString to format the date and time
  const formattedDateTime = futureDate.toLocaleString("en-US", options);

  return formattedDateTime;
}
const getRecentPapers = async () => {
  isLoading.value = true;

  await paperStore.getMostRecentPapers(userId.value);
  isLoading.value = false;
};
onMounted(() => {
  getRecentPapers();
});

const showPaperLinkInviteGenerator = (paper) => {
  paperStore.setPaper(paper); // Correctly update the Pinia store via the action
  paperContributorsDialog.value = true; // Open the dialog
};
function formatDateTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds

  // Get individual date components
  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
  const month = date.toLocaleString("en-US", { month: "short" }); // Short month name, e.g. 'Sep'
  const year = date.getFullYear();

  // Get time in 24-hour format
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Get the timezone abbreviation (EAT for East Africa Time)
  const timeZone = date
    .toLocaleTimeString("en-US", { timeZoneName: "short" })
    .split(" ")[2];

  return `${day} ${month} ${year}, ${hours}:${minutes} ${timeZone}`;
}
function timeAgo(createdMillis) {
  const now = Date.now();
  const secondsPast = Math.floor((now - createdMillis) / 1000);

  if (secondsPast < 60) {
    return secondsPast === 1
      ? `${secondsPast} second ago`
      : `${secondsPast} seconds ago`;
  }
  const minutesPast = Math.floor(secondsPast / 60);
  if (minutesPast < 60) {
    return minutesPast === 1
      ? `${minutesPast} minute ago`
      : `${minutesPast} minutes ago`;
  }
  const hoursPast = Math.floor(minutesPast / 60);
  if (hoursPast < 24) {
    return hoursPast === 1 ? `${hoursPast} hour ago` : `${hoursPast} hours ago`;
  }
  const daysPast = Math.floor(hoursPast / 24);
  if (daysPast < 30) {
    return daysPast === 1 ? `${daysPast} day ago` : `${daysPast} days ago`;
  }
  const monthsPast = Math.floor(daysPast / 30);
  if (monthsPast < 12) {
    return monthsPast === 1
      ? `${monthsPast} month ago`
      : `${monthsPast} months ago`;
  }
  const yearsPast = Math.floor(monthsPast / 12);
  return yearsPast === 1 ? `${yearsPast} year ago` : `${yearsPast} years ago`;
}
const submitPaperData = (paper) => {
  try {
    paperStore.paper = paper;
    router.push("/dashboard/paper");
  } catch (error) {
    console.error("Error submitting paper data:", error);
  }
};
</script>
