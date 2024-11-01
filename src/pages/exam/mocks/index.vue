<template>
  <div>
    <MockExams/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MockExams from '@/components/commonResourcePlayersHandler/MockExamsIterator.vue'
</script>
<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
