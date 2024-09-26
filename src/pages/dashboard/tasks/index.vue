<template>
  <div>
    <!-- Render the Child Component -->
    <MyAssignments />
  </div>
</template>

<script setup>
import MyAssignments from "../../../components/resourcePlayers/tasks/MyAssignments.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

  