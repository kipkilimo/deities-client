<
<template>
  <div v-if="alertsStore.alertMessage.length >= 5">
    <v-alert
      border="top"
      :type="alertsStore.alertType"
      variant="outlined"
      prominent
      class="ml-38 mt-4"
      width="72%"
    >
      {{ alertsStore.alertMessage }}
    </v-alert>
  </div>
</template>
<script setup lang="js">
import { useAlertsStore } from "@/stores/alerts";

// Initialize stores
const alertsStore = useAlertsStore();
setTimeout(() => {
  alertsStore.alertType = "";
  alertsStore.alertMessage = "";
}, 4500);
</script>
