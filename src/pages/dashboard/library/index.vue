<template>
  <div>
    <div v-if="resourceStore.showingResourceTitles">
      <TopicsEntry />
    </div>
    <div v-else-if="resourceStore.showingResourceTitleItems">
      <ResourcesEntry />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useResourceStore } from "@/stores/patients";

const resourceStore = useResourceStore();

// Compute the boolean value (optional if you need combined logic elsewhere)
</script>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
