<template>
  <div
        style="cursor:pointer !important;">
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
import { ref, onMounted, onUnmounted } from "vue";
import { useResourceStore } from "../../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
const images = ref<string[]>(JSON.parse(resourceStore.resource.content));
const carousel = ref(null);
const currentSlide = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

const toggleFullscreen = () => {

  // @ts-ignore
  const elem = carousel.value.$el;
  if (elem) {
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err: { message: any; }) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
};

const startAutoToggle = () => {
  intervalId = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % images.value.length;
  }, 30000); // 30 seconds
};

const stopAutoToggle = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

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
