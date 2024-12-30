<template>
  <div>
    <Terminal />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useStaffStore } from "@/stores/staff";

const staffStore = useStaffStore();

// Compute the boolean value (optional if you need combined logic elsewhere)
</script>

<route lang="yaml">
meta:
  layout: TerminalLayout
</route>
