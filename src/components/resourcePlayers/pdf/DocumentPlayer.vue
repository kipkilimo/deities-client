<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click="toggleFullscreen" icon>
          <v-icon>{{
            isFullscreen ? "mdiFullscreenExit" : "mdiFullscreen"
          }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-carousel
        v-model:currentIndex="currentIndex"
        :items="preloadedSlides"
        hide-delimiters
        hide-gutter
        show-arrows
        :cycle="true"
        :interval="5000"
        class="v-carousel--fullscreen"
      >
        <v-carousel-item v-for="(slide, index) in slides" :key="index">
          <v-img :src="slide" class="slide-img" contain></v-img>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// Slide URLs
const urls = [
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/978f2423-fa6a-4084-a1ad-145d1d38c013-page-000.jpg", 
];

// Sort the URLs
const sortedUrls = urls.sort((a, b) => {
  const matchA = a.match(/page-(\d+)\.jpg/);
  const matchB = b.match(/page-(\d+)\.jpg/);

  // Ensure matches are found and valid before accessing groups
  if (matchA && matchB) {
    const pageA = parseInt(matchA[1], 10);
    const pageB = parseInt(matchB[1], 10);
    return pageA - pageB;
  }

  // Handle cases where matches are not found
  // For example, if one or both of the matches are null, consider them equal or put null values at the end
  return 0; // or you can choose to return a default value based on your sorting requirements
});

const currentIndex = ref(0);
const isFullscreen = ref(false);

// Preload next 4 slides
const preloadCount = 4;
const preloadedSlides = ref(sortedUrls.slice(0, preloadCount + 1));

// Update preloaded slides based on current index
watch(currentIndex, (newIndex) => {
  const start = Math.max(newIndex, 0);
  const end = Math.min(newIndex + preloadCount, sortedUrls.length - 1);
  preloadedSlides.value = sortedUrls.slice(start, end + 1);
});

// Toggle fullscreen mode
const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
  isFullscreen.value = !isFullscreen.value;
};

// Slides data
const slides = ref(sortedUrls);
</script>

<style scoped>
.v-carousel--fullscreen {
  height: 100vh;
}

.slide-img {
  max-height: 100vh;
  max-width: 100vw;
}

.v-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-btn {
  color: white;
}
</style>
