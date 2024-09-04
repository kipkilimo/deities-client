<template>
  <div>
    <!-- Render the Child Component -->
    <CheckRedeem />
  </div>
</template>

<script setup>
import CheckRedeem from "../../../src/components/vendors/CheckRedeem.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: HomeLayout
</route>
