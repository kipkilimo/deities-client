<template>
  <div>
    <div class="images" v-viewer>
      <img v-for="src in images" :key="src" :src="src" />
    </div>
    <viewer :images="images">
      <img v-for="src in images" :key="src" :src="src" />
    </viewer>
    <button type="button" @click="show">Click to show</button>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import { api as viewerApi } from "v-viewer";
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useResourceStore } from "../../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
const images = ref(JSON.parse(resourceStore.resource.content));

const show = async () => {
  // Use async function for potential errors
  try {
    await viewerApi({
      images: images.value,
    });
  } catch (error) {
    console.error("Error showing viewer:", error);
  }
};
</script>
