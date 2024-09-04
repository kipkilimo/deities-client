<template>
  <div>
    <!-- Render the Child Component -->
    <AuthVendors />
  </div>
</template>

<script setup>
import AuthVendors from "../../../../src/components/vendors/AuthVendors.vue";
</script>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: HomeLayout
</route>
