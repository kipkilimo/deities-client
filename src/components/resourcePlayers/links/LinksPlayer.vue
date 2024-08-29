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
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/3599d01f-fb8a-45a0-88ec-4bc5f87f768c-page-001.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/01543dda-d758-4d1a-85b9-56c27df9d2a0-page-002.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/1c56b055-c3d3-499a-aac8-09a299de6bee-page-003.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/ac932133-2cba-46c1-b302-8e102f9bef7f-page-004.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/ebaec5ad-5723-424e-a959-b38ee21bc0a0-page-005.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/b06941cc-5b30-49ce-a0f4-36c395bb51db-page-006.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/d3d0f008-8457-4446-a4a3-ff609ebe64c6-page-007.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/fae99192-c846-4391-881b-b2bad60c6641-page-008.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/b78aba32-fb56-43f3-aa44-de390165764b-page-009.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/8229ee9f-79e0-4156-a5dc-db2d7a290f8a-page-010.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/fb257b8a-e4cf-4255-86d2-9c6cd5683536-page-011.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/02bf02a1-7442-4896-a3c9-8001bb783808-page-012.jpg",
  "https://a2z-v0.s3.eu-central-1.amazonaws.com/3c59c106-93da-4b16-be0e-15ba70912ad8-page-013.jpg",
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
