<template>
  <div>
    <!-- Render the Child Component -->
    <EventsPlayer />
  </div>
</template>

<script setup>
import EventsPlayer from "../../../components/commonResourcePlayersHandler/EventPlayerHandler.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
