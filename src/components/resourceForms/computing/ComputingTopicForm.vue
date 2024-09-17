<template>
  <div>
    <!-- <vuetify-tiptap
      v-model="content"
      label="Title"
      :config="config"
      :toolbar="toolbar"
      :dark="$vuetify.theme.dark"
      placeholder="Enter some text..."
      rounded
      :maxHeight="465"
    >
      <template #preview="{ attrs }">
        <v-dialog v-model="dialog" fullscreen hide-overlay>
          <template #activator="{ on, attrs: dialog }">
            <v-btn v-bind="{ ...attrs, ...dialog }" v-on="on">
              <v-icon>{{ mdiFileCodeOutline }}</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>$close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-container>
              <vuetify-viewer :value="content" />
            </v-container>
          </v-card>
        </v-dialog>
      </template>
    </vuetify-tiptap> -->
    <v-card min-height="54vh" max-height="54vh" max-width="95%">
      <RichTextEditor v-model="topicText" />
      <v-card-actions>
        <v-btn variant="outlined" @click="saveArticle">
          <v-icon class="mr-2">mdi-content-save-edit</v-icon>SAVE ARTICLE
        </v-btn>
      </v-card-actions>
    </v-card>
    <VuetifyViewer :value="topicText" />
    <v-dialog v-model="metaDialog" max-width="600">
      <v-card
        prepend-icon="mdi-edit-not-outline"
        title="Choose programming language"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-select
                :items="['R', 'Python', 'Julia']"
                density="compact"
                v-model="language"
                label="Select Programming Language"
              ></v-select>
            </v-col>
          </v-row>
          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="metaDialog = false">
            <v-icon class="mr-2">mdi-code</v-icon>SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import RichTextEditor from "@/components/commonResourceCreateItems/formItems/RichTextEditor.vue";

const topicText = ref<string>(
  `<h2 style="text-align: center">Wipe and add your article content here</h2>`
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
};
</script>
