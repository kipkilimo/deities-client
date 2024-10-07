<template>
  <div>
    <!-- Render the Child Component -->
    <MyAssignment />
  </div>
</template>

<script setup>
import MyAssignment from "../../../components/resourcePlayers/tasks/MyAssignment.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

  