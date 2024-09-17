<template>
  <v-container
    v-if="currentPoll.type === 'Single Choice'"
    class="poll-container"
  >
 
    <canvas ref="singleChoiceChart"></canvas>
  </v-container>
  <v-container
    v-if="currentPoll.type === 'Multiple Choice'"
    class="poll-container"
  >
    <canvas ref="multipleChoiceChart"></canvas>
  </v-container>
  <v-container v-if="currentPoll.type === 'Rating'" class="poll-container">
    <canvas ref="ratingChart"></canvas>
  </v-container>
  <v-container v-if="currentPoll.type === 'Ranking'" class="poll-container">
    <canvas ref="rankingChart"></canvas>
  </v-container>
  <v-container v-if="currentPoll.type === 'Open-Ended'" class="poll-container">
    <v-row>
      <v-col>
        <vue-word-cloud
          class="ma-4"
          style="height: 45vh"
          :words="currentPoll.responses"
          :color="
            ([, weight]) =>
              weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'
          "
          font-family="Roboto"
        /> </v-col
    ></v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useResourceStore } from "@/stores/resources";
import { Chart, registerables } from "chart.js";
import VueWordCloud from "vuewordcloud";

Chart.register(...registerables);

const resourceStore = useResourceStore();
const route = useRoute();
const wsUrl = import.meta.env.VITE_BASE_WS_URL;

// Poll Data
const currentPoll = ref({
  value: { type: "", options: [], responses: [], correctResponse: "" },
});
const wordCloudCanvas = ref(null);

// Chart Refs and Instances
const singleChoiceChart = ref(null);
let singleChoiceChartInstance = null;
const multipleChoiceChart = ref(null);
let multipleChoiceChartInstance = null;
const ratingChart = ref(null);
let ratingChartInstance = null;
const rankingChart = ref(null);
let rankingChartInstance = null;

// WebSocket Instance
let ws = null;

// WebSocket Initialization
const initializeWebSocket = () => {
  ws = new WebSocket(`${wsUrl}/ws`);
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectIntervalMs = 2000;

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "fetch_poll",
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
      localStorage.setItem("pollResource", JSON.stringify(data.resource));
      const pollContent = JSON.parse(data.resource.content);
      const pollArray = pollContent.pollArray || [];
      const activeQuestionId = pollContent.activeQuestion.qstId;
      currentPoll.value = pollArray.find(
        (poll) => poll.qstId === activeQuestionId
      );

      // Dynamically update charts based on the new poll data
      updateCharts();
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onerror = (error) => console.error("WebSocket error:", error);

  ws.onclose = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        initializeWebSocket();
      }, reconnectIntervalMs);
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

// Utility Functions
const isCorrect = (option) => option === currentPoll.value.correctResponse;

const calculatePercentage = (option) => {
  const totalResponses = currentPoll.value.responses.length;
  const optionCount = currentPoll.value.responses.filter(
    (r) => r === option
  ).length;
  return totalResponses ? ((optionCount / totalResponses) * 100).toFixed(0) : 0;
};

const calculateAverageRating = () => {
  const ratings = currentPoll.value.responses;
  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  return (total / ratings.length).toFixed(1);
};

// Chart Rendering Functions with Dynamic Updates
const renderSingleChoiceChart = () => {
  if (!singleChoiceChart.value) {
    console.error("singleChoiceChart canvas element is not available.");
    return;
  }

  const ctx = singleChoiceChart.value.getContext("2d");
  const optionCounts = currentPoll.value.options.map((option) => ({
    option,
    count: currentPoll.value.responses.filter((response) => response === option)
      .length,
  }));

  const data = {
    labels: optionCounts.map((item) => `${item.option} (${item.count})`),
    datasets: [
      {
        label: "Poll Results",
        data: optionCounts.map((item) => item.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  if (singleChoiceChartInstance) {
    singleChoiceChartInstance.data = data;
    singleChoiceChartInstance.update();
  } else {
    singleChoiceChartInstance = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const label = tooltipItem.label || "";
                const value = tooltipItem.raw || 0;
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    });
  }
};

const renderMultipleChoiceChart = () => {
  if (!multipleChoiceChart.value) {
    console.error("multipleChoiceChart canvas element is not available.");
    return;
  }

  // Trim options and responses
  const trimmedOptions = currentPoll.value.options.map((option) =>
    option.trim()
  );
  const trimmedResponses = currentPoll.value.responses.map((response) =>
    response.trim()
  );

  // Split and trim correct responses
  const correctResponses = currentPoll.value.correctResponse
    .split(",")
    .map((resp) => resp.trim());

  // Calculate the number of correct and incorrect responses for each option
  const responseCounts = trimmedOptions.map((option) => {
    const totalCount = trimmedResponses.filter(
      (response) => response === option
    ).length;
    const correctCount = correctResponses.includes(option) ? totalCount : 0;
    return {
      total: totalCount,
      correct: correctCount,
    };
  });

  // Prepare data for the chart
  const ctx = multipleChoiceChart.value.getContext("2d");
  const data = {
    labels: trimmedOptions,
    datasets: [
      {
        label: "Total Responses",
        data: responseCounts.map((item) => item.total),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Correct Responses",
        data: responseCounts.map((item) => item.correct),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  // Update or create the chart
  if (multipleChoiceChartInstance) {
    multipleChoiceChartInstance.data = data;
    multipleChoiceChartInstance.update();
  } else {
    multipleChoiceChartInstance = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
};

const renderRatingChart = () => {
  if (!ratingChart.value) {
    console.error("ratingChart canvas element is not available.");
    return;
  }

  const ctx = ratingChart.value.getContext("2d");
  const data = {
    labels: ["Rating"],
    datasets: [
      {
        data: [calculateAverageRating(), 5 - calculateAverageRating()],
        backgroundColor: ["#FFCE56", "#DDDDDD"],
      },
    ],
  };

  if (ratingChartInstance) {
    ratingChartInstance.data = data;
    ratingChartInstance.update();
  } else {
    ratingChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: data,
    });
  }
};

const renderRankingChart = () => {
  if (!rankingChart.value) {
    console.error("rankingChart canvas element is not available.");
    return;
  }

  const ctx = rankingChart.value.getContext("2d");
  const data = {
    labels: currentPoll.value.options,
    datasets: [
      {
        label: "Ranking",
        data: currentPoll.value.responses.map(
          (response) => currentPoll.value.responses.indexOf(response) + 1
        ),
        backgroundColor: "#FF6384",
      },
    ],
  };

  if (rankingChartInstance) {
    rankingChartInstance.data = data;
    rankingChartInstance.update();
  } else {
    rankingChartInstance = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
};

// Update Charts Dynamically
const updateCharts = async () => {
  await nextTick(); // Ensure DOM is updated before rendering charts

  if (currentPoll.value.type === "Single Choice") {
    renderSingleChoiceChart();
  } else if (currentPoll.value.type === "Multiple Choice") {
    renderMultipleChoiceChart();
  } else if (currentPoll.value.type === "Rating") {
    renderRatingChart();
  } else if (currentPoll.value.type === "Ranking") {
    renderRankingChart();
  } else if (currentPoll.value.type === "Open-Ended") {
    generateWordCloud();
  }
};

// Word Cloud Generation
const generateWordCloud = async () => {
  await nextTick();

  if (!wordCloudCanvas.value) {
    console.error("WordCloud canvas element is not defined.");
    return;
  }

  const texts = currentPoll.value.responses.map((response) => response.text);
  if (texts.length === 0) {
    console.warn("No responses available for word cloud.");
    return;
  }

  const combinedText = texts.join(" ");
  const words = combinedText.split(/\s+/).map((word) => [word, 1]);

  WordCloud(wordCloudCanvas.value, {
    list: words,
    gridSize: 10,
    weightFactor: 5,
    color: "random-light",
    backgroundColor: "#fff",
  });
};
</script>

<style scoped>
.poll-container {
  padding: 16px;
}
.poll-container {
  max-height: 63vh;
  overflow: hidden;
}

.poll-container canvas {
  width: 100%;
  height: 100%;
}
</style>
