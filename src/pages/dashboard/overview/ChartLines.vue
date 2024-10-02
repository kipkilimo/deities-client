<template>
  <v-container>
    <v-row>
      <v-col>
        <canvas ref="lineChart" width="400" style="max-height:15rem;"></canvas>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

// Define the props
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const lineChart = ref(null);

// Function to format data for the chart
const formatData = (trends) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // Current month (0-indexed)
  const lastMonth = (currentMonth - 1 + 12) % 12; // Last month (0-indexed)

  const labels = [
    `${new Date(currentDate.getFullYear(), lastMonth).toLocaleString('default', { month: 'short' })} '${currentDate.getFullYear() % 100}`,
    `${currentDate.toLocaleString('default', { month: 'short' })} '${currentDate.getFullYear() % 100}`
  ];

  // Assuming the trends array has counts for last month and current month
  const data = trends.map((trend) => trend.count); // Make sure this matches your data structure
  return { labels, data };
};

const { labels, data } = formatData(props.data);

onMounted(() => {
  const ctx = lineChart.value.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Publications",
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Months",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Publication Count",
          },
        },
      },
    },
  });
});

// Watch for prop changes and update the chart if needed
watch(
  () => props.data,
  (newValue) => {
    const { labels, data } = formatData(newValue);
    if (lineChart.value) {
      const ctx = lineChart.value.getContext("2d");
      // Update chart data
      const chart = Chart.getChart(ctx);
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.update();
    }
  },
  { deep: true }
);
</script>

<style scoped>
/* Add any additional styles here */
</style>
