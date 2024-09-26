<!-- CommentsSidebar.vue -->
<template>
  <v-card class="mr-14" style="position: fixed; z-index: 1000; max-width: 27rem; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); max-height: 81vh;">
    <v-card-title @mousedown.stop="onMouseDown">
      <span class="headline">Page {{ currentPage }} Discussion Comments.</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div v-if="filteredSideComments.length === 0">
        <h5>No discussion comments.</h5>
      </div>
      <v-list>
        <v-list-item-group v-for="(comment, index) in reorderedComments" :key="index" :id="'card-' + index">
          <v-card flat elevation="1" :style="computedSideCardStyle(comment.id)" class="mr-3 hover-card" style="border: 1px solid #ccc">
            <div class="ma-4 text-h6">{{ comment.title }}</div>
            <div class="ma-4 text-h7"><i>{{ comment.text }}</i></div>
            <v-divider />
            <v-card-actions>
              <v-card-subtitle>Added {{ reactiveTimeAgo(Number(comment.timestamp)) }} by {{ comment.author }}</v-card-subtitle>
            </v-card-actions>
            <v-divider />
          </v-card>
          <br />
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps(['filteredSideComments', 'reorderedComments', 'computedSideCardStyle', 'reactiveTimeAgo', 'onMouseDown']);
</script>
