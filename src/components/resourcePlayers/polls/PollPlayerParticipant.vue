<template>
  <v-container fluid fill-height>
    <v-row align="left" justify="left">
      <v-col cols="9" class="text-left mb-4">
        <img
          style="height: 9rem"
          src="https://www.vevox.com/getmedia/d6e9e7d0-b98a-455b-b404-da9687ffd488/Live-polling_Hero_1166x523.png?width=1107"
          alt="Live Poll"
        />
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
              <h1>Participant Page</h1>
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

    <v-card height="74vh" v-if="showPoll && currentPoll">
      <v-card-text>
        <span
          class="font-weight-black-lighten-2 text-h4 ml-4"
          style="color: #55565a; font-family: Ubuntu"
        >
          {{ currentPoll.question }}
        </span>
      </v-card-text>

<v-divider/>
<br>
      <v-row>
        <v-col cols="4">
          <v-card flat color="transparent" >
            <br />
            <template v-if="currentPoll.type === 'Single Choice'">
              <v-radio-group v-model="currentPoll.selectedAnswer" class="ml-4">
                <v-radio
                  v-for="option in currentPoll.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </v-radio-group>
            </template>
            <template v-else-if="currentPoll.type === 'Multiple Choice'">
              <v-checkbox-group
                v-model="currentPoll.selectedAnswers"
                class="ml-4"
              >
                <v-checkbox
                  v-for="option in currentPoll.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </v-checkbox-group>
            </template>
            <template v-else-if="currentPoll.type === 'Ranking'">
              <v-select
                v-model="currentPoll.ranking"
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
                v-model="currentPoll.answer"
                class="ml-4"
                label="Your answer"
                rows="3"
              />
            </template>
            <template v-else-if="currentPoll.type === 'Rating'">
              <v-rating
                v-model="currentPoll.rating"
                class="ml-4"
                max="5"
                icon="mdi-star"
              />
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

        <v-divider class="mt-34" vertical min-height="76vh" />

        <v-col cols="7">
          <LiveResults />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import axios from "axios";
import LiveResults from "../../../components/resourcePlayers/polls/PollPlayerAnalysis.vue";
import { useResourceStore } from "@/stores/resources";
import { useRoute } from "vue-router";

const route = useRoute();
const wsUrl = import.meta.env.VITE_BASE_WS_URL;
const showPoll = ref(true);
const currentPoll = ref(null);
const resourceStore = useResourceStore();
const accessKey = route.query.accessKey;
const sessionId = route.query.sessionId;

let ws;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const isResponseValid = computed(() => {
  const poll = currentPoll.value;
  if (poll?.type === "Single Choice") {
    return !!poll.selectedAnswer;
  } else if (poll?.type === "Multiple Choice") {
    return poll.selectedAnswers?.length > 0;
  } else if (poll?.type === "Ranking") {
    return poll.ranking?.length === poll.options.length;
  } else if (poll?.type === "Open-Ended") {
    return !!poll.answer;
  } else if (poll?.type === "Rating") {
    return !!poll.rating;
  }
  return false;
});

function reRenderView() {
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
      // console.log("WebSocket message", data.resource);
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
  let payload = {
    type: "submit_response_event",
    qstId: poll.qstId,
    accessKey,
    sessionId,
  };

  // Add appropriate poll response based on poll type
  if (poll.type === "Multiple Choice") {
    payload.selectedAnswers = poll.selectedAnswers;
  } else if (poll.type === "Single Choice") {
    payload.selectedAnswer = poll.selectedAnswer;
  } else if (poll.type === "Ranking") {
    payload.ranking = poll.ranking;
  } else if (poll.type === "Open-Ended") {
    payload.answer = poll.answer;
  } else if (poll.type === "Rating") {
    payload.rating = poll.rating;
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
