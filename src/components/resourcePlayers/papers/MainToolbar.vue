<!-- Toolbar.vue -->
<template>
  <v-toolbar
    style="border-radius: 5px 5px 0 0; box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.9); z-index: 1500; color: #e7f2fb;"
  >
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title color="grey">{{ title }}</v-toolbar-title>
    <v-btn fab variant="outlined" color="grey" @click="goHome">
      <v-icon large style="font-size: 28px; cursor: pointer">mdi-home</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn variant="text" color="grey" flat class="mr-2" @mousedown="startLongPress('decrement')" @mouseup="stopLongPress" @mouseleave="stopLongPress" @click="handleDecrementClick">
      <v-icon>mdi-menu-left</v-icon> Previous Page
    </v-btn>
    <v-btn color="grey" flat class="mr-2">Page {{ currentPage }} of {{ totalPages }}</v-btn>
    <v-btn density="default" icon="mdi-file-rotate-right" @click="rotatePage"></v-btn>
    <v-btn color="grey" flat @mousedown="startLongPress('increment')" @mouseup="stopLongPress" @mouseleave="stopLongPress" @click="handleIncrementClick">
      <v-icon>mdi-menu-right</v-icon> Next Page
    </v-btn>
  </v-toolbar>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps(['title', 'currentPage', 'totalPages', 'goHome', 'rotatePage', 'handleDecrementClick', 'handleIncrementClick', 'startLongPress', 'stopLongPress']);
</script>
