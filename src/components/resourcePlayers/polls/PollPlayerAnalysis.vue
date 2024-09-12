<template>
  <div v-if="currentPoll !== null" class="poll-analysis">
    
    <!-- Single Choice Poll Analysis -->
    <v-container v-if="currentPoll.type === 'Single Choice'" class="poll-container">
      <v-list class="ma-2">
        <v-list-item
          v-for="option in currentPoll.options"
          :key="option"
          :class="{ 'highlight-correct': isCorrect(option) }"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ option }}: {{ calculatePercentage(option) }}%
            </v-list-item-title>
            <v-progress-linear
              :value="calculatePercentage(option)"
              height="20"
              color="primary"
              class="mt-2"
            >
              <template v-slot:default="{ option }"> {{ option }}% </template>
            </v-progress-linear>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>

    <!-- Multiple Choice Poll Analysis -->
    <v-container v-else-if="currentPoll.type === 'Multiple Choice'" class="poll-container">
      <v-list class="ma-2">
        <v-list-item
          v-for="option in currentPoll.options"
          :key="option"
          :class="{ 'highlight-correct': isCorrect(option) }"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ option }}: {{ calculatePercentage(option) }}%
            </v-list-item-title>
            <v-progress-linear
              :value="calculatePercentage(option)"
              height="20"
              color="primary"
              class="mt-2"
            >
              <template v-slot:default="{ option }"> {{ option }}% </template>
            </v-progress-linear>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>

    <!-- Rating Poll Analysis -->
    <v-container v-else-if="currentPoll.type === 'Rating'" class="poll-container">
      <v-chip class="ma-2" color="primary" text-color="white">
        Average Rating: {{ calculateAverageRating() }}
      </v-chip>
    </v-container>

    <!-- Ranking Poll Analysis -->
    <v-container v-else-if="currentPoll.type === 'Ranking'" class="poll-container">
      <v-container elevation-1 text-color="#b3b3b3" class="ma-2 text-h2">
        Top Choice: {{ calculateTopChoice() }}
      </v-container>
    </v-container>

    <!-- Open-Ended Poll Analysis -->
    <v-container v-else-if="currentPoll.type === 'Open-Ended'" class="poll-container">
      <!-- Canvas element for the word cloud -->
      <canvas ref="wordCloudCanvas" width="500" height="500"></canvas>

      <!-- Display the responses in a list -->
      <v-list class="ma-2">
        <v-list-item
          v-for="response in currentPoll.responses"
          :key="response._id"
        >
          <v-list-item-content>
            <v-list-item-title>{{ response.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
    
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useResourceStore } from '@/stores/resources';
import WordCloud from 'wordcloud';

const resourceStore = useResourceStore();
const route = useRoute();
const wsUrl = import.meta.env.VITE_BASE_WS_URL;

const currentPoll = ref({ value: { type: '', options: [], responses: [], correctResponse: '' } });
const wordCloudCanvas = ref(null);

const generateWordCloud = async () => {
  // Wait for the next DOM update cycle
  await nextTick();

  if (!wordCloudCanvas.value) {
    console.error('WordCloud canvas element is not defined.');
    return;
  }

  const texts = currentPoll.value.responses.map((response) => response.text);
  if (texts.length === 0) {
    console.warn('No responses available for word cloud.');
    return;
  }

  const combinedText = texts.join(' ');
  const words = combinedText.split(/\s+/).map((word) => [word, 1]);

  WordCloud(wordCloudCanvas.value, {
    list: words,
    gridSize: 10,
    weightFactor: 5,
    color: 'random-light',
    backgroundColor: '#fff',
  });
};

watch(
  () => currentPoll.value.type,
  (newType) => {
    if (newType === 'Open-Ended') {
      generateWordCloud();
    }
  }
);

const initializeWebSocket = () => {
  let ws = new WebSocket(`${wsUrl}/ws`);
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectIntervalMs = 2000;

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: 'fetch_poll',
        accessKey: route.query.accessKey,
        sessionId: route.query.sessionId,
      })
    );
    reconnectAttempts = 0;
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      resourceStore.resource = data.resource;
      localStorage.setItem('pollResource', JSON.stringify(data.resource));
      const pollContent = JSON.parse(data.resource.content);
      const pollArray = pollContent.pollArray || [];
      const activeQuestionId = pollContent.activeQuestion.qstId;
      currentPoll.value = pollArray.find((poll) => poll.qstId === activeQuestionId);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => console.error('WebSocket error:', error);

  ws.onclose = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        initializeWebSocket();
      }, reconnectIntervalMs);
    } else {
      console.error('Max reconnect attempts reached.');
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

const isCorrect = (option) => option === currentPoll.value.correctResponse;

const calculatePercentage = (option) => {
  const totalResponses = currentPoll.value.responses.length;
  const optionCount = currentPoll.value.responses.filter((r) => r === option).length;
  return totalResponses ? ((optionCount / totalResponses) * 100).toFixed(0) : 0;
};

const calculateAverageRating = () => {
  const ratings = currentPoll.value.responses;
  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  return (total / ratings.length).toFixed(1);
};

const calculateTopChoice = () => {
  const { correctResponse, responses } = currentPoll.value;
  const responseStrings = responses.map(response => response.join('|'));
  const counts = responseStrings.reduce((acc, response) => {
    acc[response] = (acc[response] || 0) + 1;
    return acc;
  }, {});
  const topResponse = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  const mostCommonRank = topResponse.split('|');
  return JSON.stringify(mostCommonRank) === JSON.stringify(correctResponse);
};
</script>

<style scoped>
.poll-analysis {
  padding: 16px;
}
.poll-container {
  padding: 16px;
}
.highlight-correct {
  background-color: #e0f7fa;
}
</style>
