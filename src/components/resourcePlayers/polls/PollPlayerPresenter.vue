<template>
  <v-container fluid fill-height>
    <v-row align="left" justify="left">
      <!-- QR Code Section -->
      <v-col cols="9" class="text-left mb-1">
        <img
          style="height: 12rem; cursor: pointer"
          :src="qrCodeUrl"
          alt="QR Code"
          @click="showQRCodeDialog = true"
        />
        <!-- QR Code Dialog -->
        <v-dialog
          v-model="showQRCodeDialog"
          max-width="600"
          @click:outside="showQRCodeDialog = false"
        >
          <v-card>
            <v-card-title class="text-h5"
              >Join a NEMBio
              <span
                ><img
                  style="max-height: 1.5rem; cursor: pointer; z-index: -20"
                  class="mt-4"
                  src="https://media.tenor.com/3I5SoxI-DiYAAAAi/live.gif"
              /></span>
              Poll</v-card-title
            >

            <v-divider />
            <v-card-text>
              <v-img :src="qrCodeUrl" alt="QR Code" />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="showQRCodeDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="3" class="text-left mb-4">
        <router-link to="/welcome" class="flex items-center">
          <v-img
            src="https://www.hda-institute.com/wp-content/uploads/2021/05/hdai_logo_FINAL_horz-2lines_full-color_wo-tag.png"
            :width="100"
            :height="40"
          />
        </router-link>
        <div>
          <v-row>
            <v-col cols="9">
              <h1>Presenter</h1>
              <p>Session ID: {{ route.query.sessionId }}</p>
              <p>Access Key: {{ route.query.accessKey }}</p>
            </v-col>
            <v-col cols="3">
              <v-img
                style="cursor: pointer"
                height="3.6rem"
                @click="closePoll"
                src="https://cdn11.bigcommerce.com/s-3pbmh1zmv/images/stencil/760x760/products/1822/2093/2694-label__65712.1691921739.png?c=1"
              ></v-img>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- Poll Card Section -->
      <v-col cols="12" v-if="polls.length >= 1">
        <v-card min-height="75vh" max-height="75vh">
          <v-card-text>
            <span
              class="font-weight-black-lighten-2 text-h4"
              style="color: #55565a; font-family: Ubuntu"
            >
              {{ polls[currentIndex]?.type }} |
              <strong>{{ polls[currentIndex]?.question }}</strong>
            </span>
          </v-card-text>
          <v-divider />
          <br />
          <v-row>
            <v-col cols="4">
              <v-card
                flat
                class="custom-card d-flex flex-column"
                color="transparent"
                tile
              >
                <!-- Render the appropriate poll type -->
                <template v-if="polls[currentIndex]?.type === 'Single Choice'">
                  <v-radio-group v-model="polls[currentIndex].selectedAnswer">
                    <v-radio
                      v-for="option in polls[currentIndex].options"
                      :key="option"
                      :label="option"
                      :value="option"
                    ></v-radio>
                  </v-radio-group>
                </template>

                <template
                  v-else-if="polls[currentIndex]?.type === 'Multiple Choice'"
                >
                  <v-checkbox-group
                    v-model="polls[currentIndex].selectedAnswers"
                  >
                    <v-checkbox
                      v-for="option in polls[currentIndex].options"
                      :key="option"
                      :label="option"
                      :value="option"
                    ></v-checkbox>
                  </v-checkbox-group>
                </template>

                <template v-else-if="polls[currentIndex]?.type === 'Ranking'">
                  <v-select
                    class="ma-2"
                    compact
                    v-model="polls[currentIndex].ranking"
                    :items="polls[currentIndex].options"
                    label="Rank the options"
                    multiple
                  ></v-select>
                </template>

                <template
                  v-else-if="polls[currentIndex]?.type === 'Open-Ended'"
                >
                  <v-textarea
                    v-model="polls[currentIndex].answer"
                    label="Your response"
                  ></v-textarea>
                </template>

                <template v-else-if="polls[currentIndex]?.type === 'Rating'">
                  <div class="text-center">
                    <v-rating
                      v-model="polls[currentIndex].rating"
                      half-increments
                      :length="5"
                      background-color="#00a7ff"
                      hover
                    ></v-rating>
                    <pre>{{ polls[currentIndex].rating }}</pre>
                  </div>
                </template>

                <v-divider class="mt-auto" />

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    @click="prevQuestion"
                    :disabled="currentIndex === 0"
                    class="ma-2"
                  >
                    Previous
                  </v-btn>
                  <v-btn
                    @click="nextQuestion"
                    :disabled="currentIndex === polls.length - 1"
                    class="ma-2"
                  >
                    Next
                  </v-btn>
                  <v-spacer />
                  <v-img
                    style="cursor: pointer"
                    height="2.4rem"
                    @click="reRenderView"
                    src="https://cdn-icons-png.flaticon.com/128/10619/10619786.png"
                  ></v-img>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-divider vertical />
            <v-col cols="6">
              <live-results></live-results>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-btn
              color="deep-orange-lighten-2"
              text="RESET ALL RESPONSES"
              rounded="xs"
              border
              style="width: 32.8%"
              @click="resetUserInputs = true"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="resetUserInputs" width="24rem">
      <v-card>
        <v-card-title class="text-h6">Clear all Responses?</v-card-title>
        <v-card-subtitle>
          This erases all previous participant inputs.
        </v-card-subtitle>
        <br />
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="outlined"
            color="orange"
            @click="resetAllResponsesConfirmed, (resetUserInputs = false)"
            >Confirm and Clear</v-btn
          >
          <v-spacer />
          <v-btn @click="resetUserInputs = false" color="green">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import QRCode from "qrcode";
import LiveResults from "../../../components/resourcePlayers/polls/PollPlayerAnalysis.vue";
import { useResourceStore } from "@/stores/resources";
import { useRoute, useRouter } from "vue-router";

const wsUrl = import.meta.env.VITE_BASE_WS_URL;
const showQRCodeDialog = ref(false);
const resetUserInputs = ref(false);

const apiUrl = import.meta.env.VITE_CLIENT_URL;
const resourceStore = useResourceStore();
const route = useRoute();
const router = useRouter();
const accessKey = route.query.accessKey;
const sessionId = route.query.sessionId;
const qrCodeUrl = ref("");
const polls = ref([]);
const currentIndex = ref(0);
const activeQuestion = ref({ qstId: "" }); // Tracking active question
// Function to fetch the latest poll and update the path
 
// WebSocket connection
let ws;

// Generate QR Code
const generateQRCode = async (data) => {
  try {
    const url = await QRCode.toDataURL(data, { type: "png" });
    qrCodeUrl.value = url;
  } catch (err) {
    console.error(err);
  }
};

// Initialize WebSocket and handle messages
const initWebSocket = () => {
  ws = new WebSocket(`${wsUrl}/ws`);

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "fetch_poll",
        accessKey,
        sessionId,
      })
    );
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      resourceStore.resource = data.resource;
      localStorage.setItem("pollResource", JSON.stringify(data.resource));
      // console.log("WebSocket message", data.resource);
      const resource = data.resource;
      const pollContent = JSON.parse(resource.content);
      const pollArray = pollContent.pollArray || [];
      polls.value = pollArray;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // Reset qstId when WebSocket closes
  ws.onclose = () => {
    ws.send(
      JSON.stringify({
        type: "update_active_question",
        qstId: "",
        accessKey,
        sessionId,
      })
    );
  };
};
function closePoll() {
  ws.close();
  router.push("/dashboard/overview");
  setTimeout(() => {
    window.location.reload();
  }, 900);
}
// Close WebSocket if the path does not include 'poll'
const checkRouteAndCloseWS = () => {
  ws.send(
    JSON.stringify({
      type: "update_active_question",
      qstId: "",
      accessKey,
      sessionId,
    })
  );
  ws.close();
  console.log("WebSocket closed due to route change");
};

// Watch for route changes
watch(
  () => route.path,
  (newPath) => {
    if (!newPath.includes("poll")) {
      ws.send(
        JSON.stringify({
          type: "update_active_question",
          qstId: "",
          accessKey,
          sessionId,
        })
      );
      checkRouteAndCloseWS();
    }
  }
);

// Component lifecycle hooks
onMounted(() => {
  const data = `${apiUrl}/poll/participant?sessionId=${sessionId}&accessKey=${accessKey}`;
  generateQRCode(data);
  initWebSocket();
});

onBeforeUnmount(async() => {
//  await fetchPoll()
  if (ws) {
    ws.close();
  }
});

// Navigation methods
const nextQuestion = async () => {
  if (polls.value.length && currentIndex.value < polls.value.length - 1) {
    currentIndex.value++;
    const nextQuestionId = polls.value[currentIndex.value].qstId;
    if (nextQuestionId) {
      activeQuestion.value.qstId = nextQuestionId; // Update active question
      console.log("Navigating to next question:", nextQuestionId);
      ws.send(
        JSON.stringify({
          type: "update_active_question",
          qstId: nextQuestionId,
          accessKey,
          sessionId,
        })
      );
    }
  }
};

const prevQuestion = async () => {
  if (polls.value.length && currentIndex.value > 0) {
    currentIndex.value--;
    const prevQuestionId = polls.value[currentIndex.value].qstId;
    if (prevQuestionId) {
      activeQuestion.value.qstId = prevQuestionId; // Update active question
      console.log("Navigating to previous question:", prevQuestionId);
      ws.send(
        JSON.stringify({
          type: "update_active_question",
          qstId: prevQuestionId,
          accessKey,
          sessionId,
        })
      );
    }
  }
};

function resetAllResponsesConfirmed() {
  //  true
  let payload = {
    type: "reset_all_responses",
    accessKey,
    sessionId,
  };

  // Add poll response based on formInputs object

  if (ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify(payload));
      console.log("Message sent to WebSocket server.");
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  } else {
    console.error(
      "WebSocket connection is not open. ReadyState:",
      ws.readyState
    );
  }
}
function reRenderView() {
  window.location.reload();
  return true;
  const resource = JSON.parse(localStorage.getItem("pollResource"));
  const pollContent = JSON.parse(resource.content);
  const pollArray = pollContent.pollArray || [];
  const activeQuestionId = pollContent.activeQuestion.qstId;
  const activeQuestion = pollArray.find(
    (poll) => poll.qstId === activeQuestionId
  );
  currentPoll.value = activeQuestion;
}
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.v-btn:disabled {
  background-color: #f5f5f5;
  color: #9e9e9e;
}
</style>
<style scoped>
.custom-card {
  display: flex;
  flex-direction: column;
  min-height: 95%; /* Adjust as necessary */
  max-height: 95%; /* Adjust as necessary */
}

.actions {
  margin-top: auto !important;
}
</style>
