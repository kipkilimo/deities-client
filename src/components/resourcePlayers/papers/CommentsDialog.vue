<!-- CommentDialog.vue -->
<template>
  <v-dialog v-model="dialogVisible" max-width="30rem" persistent>
    <v-card :disabled="paperStore.paper.discussion.length >= 30">
      <v-card-title>
        <span class="headline ml-2">{{ paperStore.paper.discussion.length >= 30 ? "Article discussion closed." : "Contribute to the discussion" }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form fast-fail @submit.prevent>
          <v-text-field v-model="title" :rules="titleRules" label="Title"></v-text-field>
          <v-textarea v-model="text" label="Discussion text" rows="3" :rules="textRules" required></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="primary" @click="saveComment" :disabled="!isButtonEnabled">
          <v-icon class="mr-1">mdi-content-save-check</v-icon> Save Comment
        </v-btn>
        <v-btn text color="orange" @click="cancelComment">Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      <br />
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps(['dialogVisible', 'paperStore', 'title', 'titleRules', 'text', 'textRules', 'isButtonEnabled', 'saveComment', 'cancelComment']);
</script>
