<template>
  <div>
    <v-card
      min-width="99%"
      style="background-color: #ffffff"
      flat
      class="scrollable-content ml-4"
    >
      <v-img
        :src="resourceStore.resource.coverImage"
        style="border-radius: 5px 5px 0px 0px"
        class="mb-4 ml-4"
        cover
        max-height="45vh"
        width="100%"
      ></v-img>
      <h1 class="bbc-title ma-4">
        {{ resourceStore.resource.title }}
      </h1>
      <v-card-subtitle class="grey--text bbc-subtitle">
        {{ topic }}
      </v-card-subtitle>

      <v-row class="d-flex align-center mb-1 ml-2">
        <v-col cols="auto" class="d-flex align-center">
          <v-avatar size="42" class="mr-2 ml-2">
            <v-img :src="getRandomAvatarUrl()" alt="Author Profile Picture" />
          </v-avatar>
          <v-card-subtitle class="bbc-meta">
            <strong>
              Author:
              {{
                resourceStore.resource.createdBy.personalInfo.fullName
              }}</strong
            >
          </v-card-subtitle>
        </v-col>
        <v-col cols="auto" class="d-flex align-center">
          <v-card-text class="bbc-meta">
            <v-icon left>mdi-clock-outline</v-icon>
            {{ readDuration }} min read
          </v-card-text>
          <v-card-text class="bbc-meta">
            <v-icon left>mdi-calendar</v-icon>
            Published
            {{
              formatDateWithTimeZone(
                timezoneConverter(Number(resourceStore.resource.createdAt))
              )
            }}
            |
            {{ elapsedTime(resourceStore.resource.createdAt) }}
          </v-card-text>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center mb-1">
        <v-col cols="auto" class="d-flex align-center" gap="16">
          <div class="d-flex align-center">
            <v-icon
              @click="handleClap"
              :style="{ transform: `rotate(${rotation}deg)` }"
              >mdi-hand-clap</v-icon
            >
            <span>{{ claps }}</span>
            <ConfettiExplosion v-if="exploding" />
          </div>
          <div class="d-flex align-center">
            <v-icon @click="handleLike">mdi-thumb-up-outline</v-icon>
            <span>{{ likes }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon @click="handleRate">mdi-star-outline</v-icon>
            <span>{{ rates }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon @click="handleShare">mdi-share-variant</v-icon>
            <span>{{ shares }}</span>
          </div>
        </v-col>
      </v-row>
      <v-divider />

      <div
        style="max-width: 81% !important; align-items: center"
        v-html="resourceStore.resource.content"
        class="bbc-content ml-8 ma-3"
      ></div>
      <v-divider />
      <div class="d-flex flex-column align-center" style="align-items: center">
        <v-divider />
        <v-btn class="mt-4 mb-2" variant="outlined" @click="scrollToTop">
          <v-icon>mdi-arrow-up</v-icon>Back to Top
        </v-btn>
        <br />
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useResourceStore } from "../../../stores/resources";
import timezoneConverter from "../../../utilities/timezoneConverter";
import ConfettiExplosion from "vue-confetti-explosion";

const resourceStore = useResourceStore();

const readDuration = computed(() => {
  const words = resourceStore.resource.content
    .replace(/<\/?[^>]+(>|$)/g, "")
    .split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
});
const claps = ref(0);
const likes = ref(0);
const rates = ref(0);
const exploding = ref(false);
const handleClap = () => {
  if (exploding.value === true) {
    return;
  }
  exploding.value = true;
  animate();
  claps.value++;
  setTimeout(() => {
    cancelAnimationFrame(animationId);
  }, 90);
  setTimeout(() => {
    exploding.value = false;
    rotation.value = 0; // Reset rotation to default
  }, 360); // Adjust the delay as needed
};

const rotation = ref(360); // Initialize with a random value
let animationId = null;

const animate = () => {
  animationId = requestAnimationFrame(() => {
    rotation.value += 10; // Adjust the rotation angle as needed
    if (rotation.value >= 360) {
      rotation.value = 0;
    }
    animate();
  });
};

const handleLike = () => {
  likes.value++;
  console.log("Post rated");
};
const handleRate = () => {
  rates.value++;
  console.log("Post rated");
};

const handleShare = () => {
  console.log("Share post");
};

function elapsedTime(millis) {
  const millisTime = Date.now() - Number(millis);
  const seconds = Math.floor(millisTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years + " year" + (years > 1 ? "s" : "") + " ago";
  } else if (days > 0) {
    return days + " day" + (days > 1 ? "s" : "") + " ago";
  } else if (hours > 0) {
    return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
  } else if (minutes > 0) {
    return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
  } else {
    return seconds + " second" + (seconds > 1 ? "s" : "") + " ago";
  }
}

const scrollToTop = () => {
  const scrollableContent = document.querySelector(".scrollable-content");
  if (scrollableContent) {
    scrollableContent.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

function formatDateWithTimeZone(isoString) {
  const options = {
    weekday: "long", // Saturday
    year: "numeric", // 2024
    month: "short", // Sep
    day: "numeric", // 7
    hour: "2-digit", // 15 (24-hour format)
    minute: "2-digit", // 00
    timeZoneName: "short", // Time zone abbreviation (e.g., "GMT", "PST")
  };
  const date = new Date(isoString);
  return date.toLocaleString(undefined, options);
}
function getRandomAvatarUrl() {
  const randomNumber = Math.floor(Math.random() * 1000); // Generates a random number between 0 and 999
  return `https://picsum.photos/200/200?random=${randomNumber}`;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
.v-card {
  max-width: 800px;
  margin: auto;
  padding: 16px; /* Add padding for better spacing */
}

.v-img {
  border-radius: 8px;
}

.scrollable-content {
  max-height: 81vh;
  overflow-y: auto;
}

.bbc-title {
  font-family: "Cormorant Garamond", serif;
  font-size: 3rem; /* Responsive font size */
  font-weight: 700;
  line-height: 1.3;
  color: #222;
  margin-bottom: 1rem;
}

.bbc-subtitle {
  font-family: "Cormorant Garamond", serif;
  font-size: 2rem; /* Responsive font size */
  color: #3f3d3d;
  margin-bottom: 1rem;
}

.bbc-meta {
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem; /* Responsive font size */
  color: #3f3d3d;
  margin-right: 0.5rem;
}

.bbc-content {
  font-family: "Cormorant Garamond", serif;
  font-size: 1.75rem; /* Responsive font size */
  line-height: 1.6;
  color: #242424;
  font-weight: 500; /* Slightly increased font weight */
}

@media (max-width: 85%) {
  .bbc-title {
    font-size: 2rem; /* Smaller font size on small screens */
  }
  .bbc-subtitle {
    font-size: 1.25rem; /* Smaller font size on small screens */
  }
  .bbc-meta {
    font-size: 0.9rem; /* Smaller font size on small screens */
  }
  .bbc-content {
    font-size: 1rem; /* Smaller font size on small screens */
  }
}

.confetti {
  position: absolute;
  width: 5px;
  height: 5px;
  background: #ffd700;
  border-radius: 50%;
  animation: confetti-fall 1.5s ease-in-out;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(-50px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(50px) scale(0);
  }
}
</style>

