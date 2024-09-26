<template>
  <div>
    <!-- Render the Child Component -->
    <PapersIterator />
  </div>
</template>

<script setup>
// import PaperPlayer from "../../../components/commonResourcePlayersHandler/PaperTextHighlighter.vue";
import PapersIterator from '@/components/paperdiveiterator/RecentPapers.vue'
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
