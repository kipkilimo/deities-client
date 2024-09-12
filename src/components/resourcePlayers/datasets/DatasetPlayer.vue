<template>
  <v-container>
    <v-alert
      v-if="copyAlert.length > 1"
      max-height="4.5rem"
      :title="copyAlert"
      :text="dataset[currentIndex]"
      color="#34e0a2"
      class="custom-alert"
    >
    </v-alert>
    <v-overlay :value="isFullscreen" absolute>
      <v-img :src="dataset[currentIndex]" class="fullscreen-image"></v-img>
      <v-btn @click="toggleFullscreen" class="fullscreen-close" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>

    <div
      class="carousel-wrapper"
      ref="carouselWrapper"
      :class="{ fullscreen: isFullscreen }"
      @click="handleClick"
    >
      <img
        class="nav-btn left-btn"
        @click.stop="prev"
        style="height: 1.2rem; cursor: pointer"
        src="@/assets/resources/Chevron-Left.512.png"
        alt="Previous"
      />

      <v-card class="dataset-card" flat prepend-icon="mdi-database-outline">
        <template v-slot:title>
          <span class="font-weight-black">{{
            resourceStore.resource.title
          }} - {{
            resourceStore.resource.contentType
          }}</span>
        </template>
        <v-card-subtitle>{{ resourceStore.resource.subject }}</v-card-subtitle>

        <v-card-text class="pt-4">
          {{ resourceStore.resource.description }}
        </v-card-text>
        <v-divider/>
        <v-container
          :src="dataset[currentIndex]"
          style="max-height: 36vh; object-fit: cover"
        />
        <v-container
          class="summary-container"
          style="color: #050505; max-height: 36vh; overflow-y: auto"
        >
          <pre>{{ summary }}</pre>
        </v-container>
        <v-divider/>
        <v-card-text>{{ dataset[currentIndex] }}</v-card-text> 
        <v-chip
          @click="copyToClipboard(dataset[currentIndex])"
          color="success"
          variant="outlined"
          size="x-large"
          class=" ma-1" width="95%"
        >
          Copy Dataset URL
        </v-chip>
      </v-card>

      <img
        class="nav-btn right-btn"
        @click.stop="next"
        style="height: 1.2rem; cursor: pointer"
        src="@/assets/resources/Chevron-Right.512.png"
        alt="Next"
      />
    </div>

    <p :style="pStyle">{{ currentIndex + 1 }} / {{ dataset.length }}</p>
    <v-divider></v-divider>

    <v-row class="mt-3 thumbnails-row">
      <v-col v-for="(image, index) in dataset" :key="index" cols="1">
        <v-img
          :src="image"
          class="thumbnail"
          @click="setActiveImage(index)"
          :class="{ 'active-thumbnail': index === currentIndex }"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useResourceStore } from "@/stores/resources";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";

const resourceStore = useResourceStore();
const dataset = ref(JSON.parse(resourceStore.resource.content));
const currentIndex = ref(0);
const isFullscreen = ref(false);
const carouselWrapper = ref<HTMLElement | null>(null);
const summary = ref("");
const copyAlert = ref("");
const setActiveImage = (index: number) => {
  currentIndex.value = index;
  generateSummary(dataset.value[currentIndex.value]);
};

const fetchDataAndGenerateSummary = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    generateSummary(data);
  } catch (error) {
    summary.value = `Error fetching data: ${error.message}`;
  }
};

const generateSummary = (data: any) => {
  if (Array.isArray(data)) {
    summary.value = `Number of records: ${data.length}\nFields: ${Object.keys(data[0] || {}).join(", ")}`;
  } else if (typeof data === "object") {
    summary.value = `Fields: ${Object.keys(data).join(", ")}`;
  } else {
    summary.value = `Data: ${data}`;
  }
};
watch(currentIndex, () => {
  fetchDataAndGenerateSummary(dataset.value[currentIndex.value]);
});
const parseData = (fileContent: string | ArrayBuffer, fileType: string) => {
  if (fileType === "csv") {
    return Papa.parse(fileContent as string, {
      header: true,
      dynamicTyping: true,
    }).data;
  } else if (fileType === "json") {
    return JSON.parse(fileContent as string);
  } else if (fileType === "xlsx") {
    const workbook = XLSX.read(fileContent, { type: "array" });
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  }
};

const copyToClipboard = (data) => {
  navigator.clipboard.writeText(data).then(() => {
    copyAlert.value = "Dataset URL copied to clipboard!";
    setTimeout(() => {
      copyAlert.value = "";
    }, 2700);
  });
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    generateSummary(dataset.value[currentIndex.value]);
  }
};

const next = () => {
  if (currentIndex.value < dataset.value.length - 1) {
    currentIndex.value++;
    generateSummary(dataset.value[currentIndex.value]);
  }
};

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen().then(() => (isFullscreen.value = false));
  } else if (carouselWrapper.value) {
    carouselWrapper.value
      .requestFullscreen()
      .then(() => (isFullscreen.value = true));
  }
};

const handleFullscreenChange = () => {
  if (!document.fullscreenElement) {
    window.location.reload();
  }
};

const handleKeyboardNavigation = (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") prev();
  if (event.key === "ArrowRight") next();
};

const handleClick = (event: MouseEvent) => {
  if (isFullscreen.value || !carouselWrapper.value) return;
  const { clientX, offsetWidth } = event;
  if (clientX <= offsetWidth * 0.1) prev();
  if (clientX >= offsetWidth * 0.9) next();
};

onMounted(() => {
  fetchDataAndGenerateSummary(dataset.value[currentIndex.value]);
  window.addEventListener("keydown", handleKeyboardNavigation);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyboardNavigation);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});

const pStyle = {
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)",
  margin: "0",
  backgroundColor: "#bfbfbf",
  color: "#ffffff",
  fontSize: "14px",
  textAlign: "center",
};
</script>

<style scoped>
.thumbnail {
  cursor: pointer;
  border: 2px solid transparent;
}

.thumbnail.active-thumbnail {
  border: 2px solid rgb(187, 207, 201);
}

.fullscreen-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.fullscreen-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 67vh;
  transition:
    width 0.3s,
    height 0.3s;
}

.carousel-wrapper.fullscreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}

.dataset-card {
  position: relative;
  max-width: 90%;
  margin: 0 auto;
}

.summary-container {
  color: #efefef;
  background-color: transparent;
}

.thumbnails-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.thumbnails-row::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
<style scoped>
.custom-alert {
  background-color: #ffffff; /* Dark background */
  padding: 20px;
  z-index: 9000;
  border-radius: 5px;
}

.custom-alert * {
  color: white !important;
}
</style>
<style>
.dataset-card {
  display: inline-block; /* Inline display for card */
  width: auto; /* Adjust width as needed */
}

.summary-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
