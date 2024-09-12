
<template>
  <v-container id="app">
    <VContainer>
      <VuetifyTiptap
        v-model="content"
        :label="resourceStore.resource.title"
        rounded
        min-height="54vh"
        max-height="54vh"
        max-width="95%"
        :extensions="extensions"
      />
      <v-card-actions>
        <v-btn variant="outlined" @click="saveArticle">
          <v-icon class="mr-2">mdi-content-save-edit</v-icon>SAVE ARTICLE
        </v-btn>
      </v-card-actions>
      <VuetifyViewer :value="content" />
    </VContainer>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  BaseKit,
  Bold,
  Color,
  Fullscreen,
  Heading,
  Highlight,
  History,
  Image,
  Italic,
  Link,
  Strike,
  Table,
  Underline,
  Video,
  VuetifyTiptap,
  VuetifyViewer,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";
import { useResourceStore } from "@/stores/resources";

const resourceStore = useResourceStore();

const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: "Enter some text...",
    },
  }),
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  Highlight,
  Heading,
  Link,
  Image,
  Video,
  Table,
  Fullscreen,
  History,
];

const content = ref("");
const saveArticle = async () => {
  const paramsObjRaw = [
    {
      resourceId: resourceStore.resource.id,
      resourceContent: content.value, // Use the reactive reference here
    },
  ];
  console.log({ paramsObjRaw });

  const resourceDetails = JSON.stringify(paramsObjRaw);
  await resourceStore.addResourceFormContent({ resourceDetails });
  window.location.reload()
};
</script>

