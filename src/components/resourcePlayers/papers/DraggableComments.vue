<template>
  <v-card class="draggable-comments">
    <v-card-title>Page {{ currentPage }} Discussion Comments.</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div v-if="comments.length === 0"><h5>No discussion comments.</h5></div>
      <v-list>
        <v-list-item-group v-for="(comment, index) in comments" :key="index">
          <v-card flat>
            <div>{{ comment.title }}</div>
            <div><i>{{ comment.text }}</i></div>
            <v-card-subtitle>Added {{ reactiveTimeAgo(comment.timestamp) }} by {{ comment.author }}</v-card-subtitle>
          </v-card>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps(['comments']);
</script>
