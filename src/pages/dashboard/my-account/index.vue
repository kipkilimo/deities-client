<template>
  <v-container>
    <AccountSummary />
  </v-container>
</template>
<script setup>
import { ref, onMounted } from "vue";
import gql from "graphql-tag";
import { client } from "@/graphql/apolloClient";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import AccountSummary from "./AccountSummary.vue";
// Register chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, Title);

// State variables
const isLoading = ref(false);
const isError = ref(null);
const summary = ref(null);

// GraphQL query to fetch resource summaries
const RESOURCE_TRENDS_QUERY = gql`
  query ResourceTrends {
    fetchResourceSummaryByRoleAndType {
      audioCount
      videoCount
      imagesCount
      documentCount
      presentationCount
      eventCount
      datasetCount
      linkCount
      pollCount
      testCount
      modelCount
      posterCount
      articleCount
      jobCount
      taskCount
      mostLikedResource {
        title
        likesNumber
      }
      mostRequestedResource {
        title
        viewsNumber
      }
      mostCreatedResource {
        title
        createdAt
      }
      publicationTrends {
        month
        count
      }
    }
  }
`;

async function getAllResourcesSummary() {
  try {
    isLoading.value = true;
    const { data } = await client.query({ query: RESOURCE_TRENDS_QUERY });
    if (data) {
      const rawData = data.fetchResourceSummaryByRoleAndType;
      summary.value = rawData[0];
    } else {
      isError.value = "Failed to fetch resources summaries";
    }
  } catch (error) {
    isError.value = "Failed to fetch resources summaries";
  } finally {
    isLoading.value = false;
  }
}

function formatDate(dateString) {
  // Assuming dateString is in ISO format, adjust as needed
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Customize as needed
}

onMounted(() => {
  getAllResourcesSummary();
});
</script>
<style scoped>
.v-container {
  padding: 24px;
}
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
