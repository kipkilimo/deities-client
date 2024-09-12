<template>
  <div>
    <!-- Render the Child Component -->
    <PostersPlayer />
  </div>
</template>

<script setup>
import PostersPlayer from "../../../components/commonResourcePlayersHandler/PostersPlayersHandler.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
