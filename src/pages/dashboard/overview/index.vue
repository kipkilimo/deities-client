<template>
  <v-container>
    <v-progress-linear
      color="teal"
      indeterminate
      v-if="isLoading"
    ></v-progress-linear>

    <v-alert
      border="top"
      type="warning"
      v-if="isError"
      variant="outlined"
      prominent
    >
      {{ isError }}
    </v-alert>

    <div v-if="!isLoading && summary">
      
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="500">
            <v-card-text class="text-medium-emphasis pa-6">
              <div class="text-h6 mb-6">Audio / Podcasts</div></v-card-text
            >
            <v-divider></v-divider>
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col
                  class="d-flex align-center justify-center text-h2"
                  cols="9"
                >
                  <div
                    class="text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"
                  >
                    {{ summary.audioCount }}
                  </div>
                </v-col>

                <v-col class="text-right" cols="2">
                  <v-icon
                    color="info"
                    icon="mdi-music-box-multiple"
                    size="48"
                  ></v-icon>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="500">
            <v-card-text class="text-medium-emphasis pa-6"
              ><div class="text-h6 mb-6">
                Video / Screencast Recordings
              </div></v-card-text
            >
            <v-divider></v-divider>
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col
                  class="d-flex align-center justify-center text-h2"
                  cols="9"
                >
                  <div
                    class="text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"
                  >
                    {{ summary.videoCount }}
                  </div>
                </v-col>

                <v-col class="text-right" cols="2">
                  <v-icon
                    color="info"
                    icon="mdi-file-video-outline"
                    size="48"
                  ></v-icon>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="500">
            <v-card-text class="text-medium-emphasis pa-6"
              ><div class="text-h6 mb-6">Photo Galleries</div></v-card-text
            >
            <v-divider></v-divider>
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col
                  class="d-flex align-center justify-center text-h2"
                  cols="9"
                >
                  <div
                    class="text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"
                  >
                    {{ summary.imagesCount }}
                  </div>
                </v-col>

                <v-col class="text-right" cols="2">
                  <v-icon
                    color="info"
                    icon="mdi-view-gallery-outline"
                    size="48"
                  ></v-icon>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="500">
            <v-card-text class="text-medium-emphasis pa-6"
              ><div class="text-h6 mb-6">Blog Articles</div></v-card-text
            >
            <v-divider></v-divider>
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col
                  class="d-flex align-center justify-center text-h2"
                  cols="9"
                >
                  <div
                    class="text-medium-emphasis ma-5 text-h2 text-medium-emphasis font-weight-regular"
                  >
                    {{ summary.articleCount }}
                  </div>
                </v-col>

                <v-col class="text-right" cols="2">
                  <v-icon
                    color="info"
                    icon="mdi-view-gallery-outline"
                    size="48"
                  ></v-icon>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="500" height="12.8rem" border flat>
            <v-card-text class="text-medium-emphasis pa-5">
              <div class="text-h6 mb-6">Most Liked Resource</div>

              <v-row>
                <v-col cols="9">
                  <div class="text-h4 font-weight-black mb-1">
                    Likes: {{ summary.mostLikedResource.likesNumber }}
                  </div>
                </v-col>
                <v-icon color="info" icon="mdi-view-gallery-outline" size="48">
                </v-icon>
              </v-row>
              <v-divider></v-divider>
              <div>{{ summary.mostLikedResource.title }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="500" height="12.8rem" border flat>
            <v-card-text class="text-medium-emphasis pa-5">
              <div class="text-h6 mb-6">Most Requested Resource</div>

              <v-row>
                <v-col cols="9">
                  <div class="text-h4 font-weight-black mb-1">
                    Views:
                    {{ summary.mostRequestedResource.viewsNumber }}
                  </div>
                </v-col>
                <v-icon
                  color="info"
                  icon="mdi-view-gallery-outline"
                  size="48"
                ></v-icon>
              </v-row>

              <v-divider></v-divider>
              <div>{{ summary.mostRequestedResource.title }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Most Created Resource</v-card-title>
            <v-card-subtitle>{{
              summary.mostCreatedResource.title
            }}</v-card-subtitle>
            <v-card-text
              >Created At:
              {{
                formatDate(summary.mostCreatedResource.createdAt)
              }}</v-card-text
            >
          </v-card>
        </v-col> -->

        <v-col cols="12" md="12">
          <v-card>
            <v-card-title>Publication Trends</v-card-title>
            <v-card-text>
              <chart-lines :data="summary.publicationTrends" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
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
import ChartLines from "./ChartLines.vue";
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
