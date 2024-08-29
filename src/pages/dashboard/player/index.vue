<template>
  <div>
    <!-- Render the Child Component -->
    <ResourcePlayer />
  </div>
</template>

<script setup>
import ResourcePlayer from "../../../components/commonResourcePlayersHandler/ResourcesIterator.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
