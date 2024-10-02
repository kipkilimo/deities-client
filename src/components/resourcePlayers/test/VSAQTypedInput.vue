<template>
  <div>
    <v-card min-height="54vh" max-height="54vh" max-width="95%">
      <RichTextEditor v-model="topicText" />
      <v-card-actions>
        <v-btn variant="outlined" @click="saveArticle">
          <v-icon class="mr-2">mdi-content-save-edit</v-icon>SAVE ARTICLE
        </v-btn>
      </v-card-actions>
    </v-card>
    <VuetifyViewer :value="topicText" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import RichTextEditor from "@/components/commonResourceCreateItems/formItems/RichTextEditor.vue";

const topicText = ref<string>(
  `<h2 style="text-align: center">Wipe and add your answer content here</h2>`
);
import { useResourceStore } from "@/stores/resources";
const resourceStore = useResourceStore();
const metaDialog = ref(true);
const language = ref("");
const config: Ref<Partial<StarterKitOptions>> = ref<Partial<StarterKitOptions>>(
  {
    image: true, // Disable image functionality
  }
);

// Custom toolbar without the image option
const topicLanguage = localStorage.getItem("articleLanguage");
if (topicLanguage !== null && topicLanguage.length >= 1) {
  language.value = topicLanguage;
  metaDialog.value = false;
}
const saveArticle = async () => {
  const paramsObjRaw = [
    {
      resourceId: resourceStore.resource.id,
      resourceContent: JSON.stringify({
        topicContent: topicText.value, // Use the reactive reference here
        topic: localStorage.getItem("articleTopic"),
        language: language.value,
      }),
    },
  ];
  console.log({ paramsObjRaw });

  const resourceDetails = JSON.stringify(paramsObjRaw);
  await resourceStore.addResourceFormContent({ resourceDetails });
  localStorage.removeItem("articleTopic");
  window.location.reload();
};import { useRoute } from "vue-router";
 
const route = useRoute();
const sessionId = ref(route.query.sessionId || route.params.sessionId); // Fetch sessionId from query or params
const userId = ref(localStorage.getItem("sessionId")); // Retrieve userId from local storage

const questions = reactive([]); // Array to hold question data
const answers = reactive([]); // Array to hold selected answers for each question
// Get the exam meta info
const currentExamDetails = JSON.parse(resourceStore.exam);
const examMetaInfo = currentExamDetails.examMetaInfo;
const numberOfQuestions = examMetaInfo.numberOfQuestions;

 

// Function to process answers and convert them to a # separated string
 

// Initialize the questions when the component is mounted
 
</script>
