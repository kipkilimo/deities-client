<template>
  <v-container fluid class="no-margin-top">
    <v-row>
      <!-- Sidebar Column -->
      <v-col cols="3">
        <!-- App Bar -->
        <v-app-bar color="white" flat>
          <v-list-item class="text-h6">
            <template v-slot:title>
              <h2>Computational Methods in Epidemiology and Biostatistics</h2>
            </template>
            <template v-slot:subtitle
              >Resources by NEMBio Contributors</template
            >
          </v-list-item>
        </v-app-bar>

        <!-- Navigation Drawer -->
        <v-navigation-drawer app permanent width="330" class="elevation-1">
          <v-list dense nav>
            <v-list-item-group>
              <v-list-item
                v-for="category in Object.keys(topics)"
                :key="category"
              >
                <!-- Category Title -->
                <v-list-item-title class="text-h6 mb-4 font-weight-bold">
                  {{ category }}
                </v-list-item-title>
                <v-list-item no-action>
                  <!-- Subtopics within each Category -->
                  <div
                    v-for="topic in Object.values(topics[category])"
                    :key="topic.condensed"
                    class="pl-4"
                  >
                    <v-list-item
                      v-for="topic in topic.topics"
                      :key="topic"
                      @click="setActiveSubtopic(topic)"
                      class="text-body-2"
                    >
                      {{ topic }}
                    </v-list-item>
                  </div>
                </v-list-item>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>

      <!-- Content Column -->
      <v-col cols="12"  class="no-margin-top">
        <v-tabs
          v-model="selectedLanguage"
          background-color="primary"
          dark
          grow
          class="no-margin-top"
        >
          <v-tab v-for="lang in languages" :key="lang">
            <img
              :src="getIconForLanguage(lang)"
              alt="Language Icon"
              style="width: 24px; height: 24px; margin-right: 8px"
            />
            {{ lang }}
          </v-tab>
        </v-tabs>

        <!-- Tab Content -->
        <v-tabs-items v-model="selectedLanguage">
          <v-tab-item v-for="lang in languages" :key="lang">
            <!-- Card for Selected Subtopic -->
            <v-card v-if="selectedSubtopic" outlined class="">
              <v-card-title class="text-h5">{{
                selectedSubtopic
              }}</v-card-title>
              <v-card-text>
                <div v-html="topicBlog"></div>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { topics as biostatTopics } from "../../data/biostatisticsComputingTopics.js";

// Data setup
const topics = ref(biostatTopics);
const selectedSubtopic = ref(null);

// Set the active subtopic when clicked
const setActiveSubtopic = (subtopic) => {
  selectedSubtopic.value = subtopic;
};
const selectedLanguage = ref("");
const languages = ref(["R", "Python", "Julia"]);

const getIconForLanguage = (lang) => {
  const icons = {
    R: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/R_logo.svg/724px-R_logo.svg.png",
    Python:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
    Julia: "https://numfocus.org/wp-content/uploads/2016/07/julia-logo-300.png",
  };
  return icons[lang] || "path/to/default-icon.png"; // Fallback icon
};
// Simulated content for topicBlog
const topicBlog = ref(
  `Here is the blog content. You can format it in different ways for different subtopics.`
);
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #f4f4f4;
}

.v-list-item-title {
  font-weight: bold;
}

.v-card-title {
  color: #333;
  font-weight: bold;
}

.v-card-text {
  font-size: 16px;
  line-height: 1.5;
  color: #444;
}

.v-tabs .v-tab {
  text-transform: none;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.no-margin-top {
  margin-top: 0 !important;
}

</style>
