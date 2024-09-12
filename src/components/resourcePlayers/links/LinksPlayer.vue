<template>
  <div class="links" v-viewer>
    <v-card-text class="text-medium-emphasis pa-6">
      <div class="text-h6 mb-6">{{ resourceStore.resource.title }}</div>
    </v-card-text>
    <v-row
      ><v-col v-for="src in links" :key="src" :src="src">
        <v-card color="#e5e5e5">
          <v-card-title class="text-h5">
            {{ resourceStore.resource.topic }}
          </v-card-title>
          <v-card-title class="text-overline" >
            {{ resourceStore.resource.subject }}
          </v-card-title>
          <v-card-subtitle color="#000000">
            {{ src }}
          </v-card-subtitle>

          <v-card-actions>
            <v-btn
              class="ms-2"
              size="small"
              color="blue"
              @click="openUrlInNewTab(src)"
              variant="outlined"
              ><v-icon class="mr-2">mdi-open-in-new</v-icon>Open resource
              Link</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col></v-row
    >
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import { api as viewerApi } from "v-viewer";
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useResourceStore } from "../../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
const links = ref(JSON.parse(resourceStore.resource.content));

const show = async () => {
  // Use async function for potential errors
  try {
    await viewerApi({
      links: links.value,
    });
  } catch (error) {
    console.error("Error showing viewer:", error);
  }
};
function openUrlInNewTab(url) {
  // Open the URL in a new tab
  const newTab = window.open(url, "_blank");

  // Focus on the new tab (if it's allowed by the browser)
  if (newTab) {
    newTab.focus();
  } else {
    alert("Pop-up blocked. Please allow pop-ups for this website.");
  }
}
</script>
