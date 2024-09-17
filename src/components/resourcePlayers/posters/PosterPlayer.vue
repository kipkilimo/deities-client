<template>
  <div style="cursor:pointer !important;">
    <!-- Fullscreen Toggle Button --> 
    <v-btn type="button" variant="outlined" class="mb-2" color="#9dc9dc" @click="toggleFullscreen">
      Toggle Fullscreen
    </v-btn>
    <!-- Carousel Slideshow -->
    <v-carousel
      v-if="images.length"
      ref="carousel"
      height="500"
      cycle
      v-model="currentSlide"
      :show-arrows="false"
      hide-delimiters
      class="carousel-container"
    >
      <v-carousel-item
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        @click="toggleFullscreen"
      ></v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useResourceStore } from "../../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
const images = ref<string[]>(JSON.parse(resourceStore.resource.content));
const carousel = ref(null);
const currentSlide = ref(0);
const currentResource = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;
const otherPosters = resourceStore.resources; // Assuming 'resources' contains other resources/posters

// Function to toggle fullscreen mode
const toggleFullscreen = () => {
  // @ts-ignore
  const elem = carousel.value.$el;
  if (elem) {
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err: { message: any }) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
};

// Function to start the automatic toggle every 30 seconds
const startAutoToggle = () => {
  intervalId = setInterval(() => {
    currentResource.value = (currentResource.value + 1) % otherPosters.length; // Loop through resources
    // Update the images with the content of the new resource
    images.value = JSON.parse(otherPosters[currentResource.value].content);
  }, 30000); // 30 seconds interval
};

// Function to stop the auto toggle
const stopAutoToggle = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// Watcher to update the slide if images change
watch(images, () => {
  currentSlide.value = 0; // Reset to first slide when the images change
});

onMounted(() => {
  startAutoToggle();
});

onUnmounted(() => {
  stopAutoToggle();
});
</script>

<style scoped>
.carousel-container {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}

/* Hide bottom bar icons */
.v-carousel__controls__item {
  display: none;
}
</style>
