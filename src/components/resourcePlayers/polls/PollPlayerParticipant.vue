<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" sm="9" class="text-left mb-4">
        <img
          style="width: 100%; max-height: 9rem; object-fit: cover"
          src="https://www.vevox.com/getmedia/d6e9e7d0-b98a-455b-b404-da9687ffd488/Live-polling_Hero_1166x523.png?width=1107"
          alt="Live Poll"
        />
      </v-col>
      <v-col cols="12" sm="3" class="text-left mb-4">
        <router-link to="/welcome" class="d-flex align-center">
          <v-img
            src="https://www.hda-institute.com/wp-content/uploads/2021/05/hdai_logo_FINAL_horz-2lines_full-color_wo-tag.png"
            width="100"
            height="40"
          />
        </router-link>
        <div class="mt-3">
          <v-row>
            <v-col cols="9">
              <h1 class="text-h6">Participant</h1>
              <p>Session ID: {{ route.query.sessionId }}</p>
              <p>Access Key: {{ route.query.accessKey }}</p>
            </v-col>
            <v-col cols="3">
              <v-img
                style="cursor: pointer"
                @click="reRenderView"
                height="3rem"
                src="https://cdn-icons-png.flaticon.com/128/10619/10619786.png"
              ></v-img>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-card
      style="height: 78vh"
      v-if="showPoll && currentPoll && currentPoll.question"
      class="pa-4"
    >
      <v-card-text>
        <span
          class="font-weight-black-lighten-2 text-h4"
          style="color: #55565a; font-family: Ubuntu"
        >
          {{ currentPoll.type }} |
          <strong> {{ currentPoll.question }}</strong>
        </span>
      </v-card-text>

      <v-divider />
      <br />
      <v-row>
        <v-col cols="12" sm="4">
          <v-card height="75vh" flat color="transparent">
            <br />
            <template v-if="currentPoll.type === 'Single Choice'">
              <v-radio-group v-model="formInputs.selectedAnswer" class="ml-4">
                <v-radio
                  v-for="option in currentPoll.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </v-radio-group>
            </template>
            <template v-else-if="currentPoll.type === 'Multiple Choice'">
              <v-select
                v-model="formInputs.selectedAnswers"
                :items="currentPoll.options"
                multiple
                label="Select multiple options"
                class="ml-4"
              />
            </template>

            <template v-else-if="currentPoll.type === 'Ranking'">
              <v-select
                v-model="formInputs.ranking"
                :items="currentPoll.options"
                multiple
                item-value="value"
                item-text="label"
                class="ml-4"
                label="Rank options"
              />
            </template>

            <template v-else-if="currentPoll.type === 'Open-Ended'">
              <v-textarea
                v-model="formInputs.answer"
                class="ml-4"
                label="Your answer"
                rows="3"
              />
            </template>

            <template v-else-if="currentPoll.type === 'Rating'">
              <div class="text-center">
                <v-rating
                  v-model="formInputs.rating"
                  half-increments
                  class="ml-4"
                  :length="5"
                  max="5"
                  icon="mdi-star"
                  background-color="#00a7ff"
                  hover
                ></v-rating>
                <pre>{{ formInputs.rating }}</pre>
              </div>
            </template>

            <v-card-actions>
              <v-btn
                @click="submitResponse"
                :disabled="!isResponseValid"
                class="ma-2"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-divider class="d-none d-sm-block" vertical min-height="76vh" />

        <v-col cols="12" sm="7">
          <LiveResults />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import LiveResults from "../../../components/resourcePlayers/polls/PollPlayerAnalysis.vue";
import { useResourceStore } from "@/stores/resources";
import { useRoute } from "vue-router";

const route = useRoute();
const wsUrl = import.meta.env.VITE_BASE_WS_URL;
const showPoll = ref(true);

// Initialize currentPoll with default values to avoid null errors during rendering
const currentPoll = ref({
  type: null,
  question: "",
  options: [],
  qstId: null,
});

// New object for form inputs
const formInputs = ref({
  selectedAnswer: null,
  selectedAnswers: [],
  ranking: [],
  answer: "",
  rating: null,
});

const resourceStore = useResourceStore();
const accessKey = route.query.accessKey;
const sessionId = route.query.sessionId;

let ws;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const isResponseValid = computed(() => {
  const poll = currentPoll.value;
  if (poll.type === "Single Choice") {
    return !!formInputs.value.selectedAnswer;
  } else if (poll.type === "Multiple Choice") {
    return !!formInputs.value.selectedAnswers;
  } else if (poll.type === "Ranking") {
    return formInputs.value.ranking?.length === poll.options.length;
  } else if (poll.type === "Open-Ended") {
    return !!formInputs.value.answer;
  } else if (poll.type === "Rating") {
    return !!formInputs.value.rating;
  }
  return false;
});

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

const initializeWebSocket = () => {
  ws = new WebSocket(`${wsUrl}/ws`);

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "fetch_poll",
        accessKey,
        sessionId,
      })
    );
    reconnectAttempts = 0;
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      resourceStore.resource = data.resource;
      localStorage.setItem("pollResource", JSON.stringify(data.resource));
      const resource = data.resource;
      const pollContent = JSON.parse(resource.content);
      const pollArray = pollContent.pollArray || [];
      const activeQuestionId = pollContent.activeQuestion.qstId;
      const activeQuestion = pollArray.find(
        (poll) => poll.qstId === activeQuestionId
      );
      currentPoll.value = activeQuestion;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(
        () => {
          reconnectAttempts++;
          initializeWebSocket();
        },
        Math.pow(2, reconnectAttempts) * 1000
      ); // Exponential backoff
    } else {
      console.error("Max reconnect attempts reached.");
    }
  };
};

onBeforeMount(() => {
  initializeWebSocket();
});

onBeforeUnmount(() => {
  if (ws) {
    ws.close();
  }
});

const submitResponse = async () => {
  const poll = currentPoll.value;
  if (!poll) return; // Ensure poll data is available

  let payload = {
    type: "submit_response_event",
    qstId: poll.qstId,
    accessKey,
    sessionId,
  };

  // Add poll response based on formInputs object
  if (poll.type === "Multiple Choice") {
    payload.selectedAnswers = formInputs.value.selectedAnswers;
  } else if (poll.type === "Single Choice") {
    payload.selectedAnswer = formInputs.value.selectedAnswer;
  } else if (poll.type === "Ranking") {
    payload.ranking = formInputs.value.ranking;
  } else if (poll.type === "Open-Ended") {
    payload.answer = formInputs.value.answer;
  } else if (poll.type === "Rating") {
    payload.rating = formInputs.value.rating;
  }

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
  formInputs.value = ref({
    selectedAnswer: null,
    selectedAnswers: [],
    ranking: [],
    answer: "",
    rating: null,
  });
};
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
@media (max-width: 600px) {
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h4,
  .text-h5,
  .text-h6 {
    font-size: 1.5rem; /* Adjust text size for mobile */
  }
}
</style>
