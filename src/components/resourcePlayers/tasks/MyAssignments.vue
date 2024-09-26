<template>
  <v-container>
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
    <div class="" v-if="!isLoading && resourceStore.resources.length === 0">
      <v-alert
        border="top"
        type="info"
        class="ml-38 mt-4"
        width="72%"
        variant="outlined"
        prominent
      >
        <h4>You are not enrolled into any task.</h4>
        <h6>Check back later.</h6>
      </v-alert>
    </div>
    <v-row dense v-if="!isLoading && resourceStore.resources.length >= 1">
      <!-- Iterate over the cards array to generate the cards -->
      <v-col
        v-for="(card, index) in resourceStore.resources"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card color="">
          {{ card }}
          <v-card-actions>
            <v-btn variant="outlined"> View Task </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useResourceStore } from "../../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
const isLoading = ref(false);
const isError = ref("");
// Function to start the automatic toggle every 30 seconds
const getUserTasks = async () => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem("sessionId");
    //@ts-ignore
    await resourceStore.getUserTasks(storedUser);
    isLoading.value = false;
  } catch (error) {
    isError.value = `Failed to fetch task. ${error}`;

    isLoading.value = false;
  }
};

// Watcher to update the slide if images change

onMounted(() => {
  getUserTasks();
});

onUnmounted(() => {});
</script>
<style scoped>
/* Add any custom styles if needed */
</style>
