<template>
  <div>
    <!-- Render the Child Component -->
    <PaperPlayer />
  </div>
</template>

<script setup>
import PaperPlayer from "../../../components/commonResourcePlayersHandler/PaperTextHighlighter.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
