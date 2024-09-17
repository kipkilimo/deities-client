<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3">
        <v-app-bar color="white" flat>
          <v-list-item class="text-h6 ml-2">
            <template v-slot:title>
              <h4 class="bbc-subtitle">
                Computational Methods in Epidemiology and Biostatistics
              </h4>
            </template>
            <template v-slot:subtitle>
              {{ languages[selectedLanguageIndex] }} Resources by NEMBio
              Contributors
            </template>
          </v-list-item>
        </v-app-bar>

        <v-navigation-drawer
          app
          permanent
          width="330"
          class="elevation-1"
          :mini-variant.sync="isMobile"
          stateless
        >
          <v-list dense nav>
            <v-list-item-group>
              <v-list-item
                v-for="category in Object.keys(topics)"
                :key="category"
              >
                <v-list-item-title class="text-h6 font-weight-bold">
                  {{ category }}
                </v-list-item-title>
                <v-list-item no-action>
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

      <v-col cols="12">
        <v-tabs background-color="primary" grow>
          <v-tab
            v-for="(lang, index) in languages"
            :key="lang"
            @click="setLanguage(lang, index)"
          >
            <v-img
              max-height="1.2rem"
              :src="getIconForLanguage(lang)"
              alt="Language Icon"
              class="icon"
            />
            <h6>{{ lang }}</h6>
          </v-tab>
        </v-tabs>

        <v-progress-linear
          color="teal"
          indeterminate
          v-if="showMediaLoading"
        ></v-progress-linear>

        <v-tabs-items v-model="languages[selectedLanguageIndex]">
          <v-tab-item
            v-for="lang in fetchedLanguages"
            :key="lang"
            :value="lang"
          >
            <div
              v-if="
                (isComputingRoute &&
                  resourceStore.resource.contentType !== 'COMPUTING') ||
                resourceStore.resource.content.length === ''
              "
              style="
                max-width: 75%;
                overflow-y: auto;
                position: fixed;
                background-color: #fff9eb !important;
                align-items: left;
              "
              class="bbc-content ml-4"
            >
              <PlaceHolder />
            </div>

            <div
              v-if="
                lang === languages[selectedLanguageIndex] &&
                topicBlogLanguage === languages[selectedLanguageIndex]
              "
            >
              <!-- v-html="topicBlogArticle" -->
              <div
                v-if="
                  resourceStore.resource.contentType === 'COMPUTING' &&
                  resourceStore.resource.content.length < 10
                "
              >
                <v-card
                  class="mt-4"
                  prepend-icon="mdi-article"
                  subtitle="Contents for this chapter have not been added. Check back soon!"
                  min-width="100%"
                >
                  <template v-slot:title>
                    <span class="font-weight-black bbc-title mt-2">{{
                      selectedSubtopic
                    }}</span>
                    <br />
                  </template>
                  <br />
                  <v-divider />
                  <v-card-actions>
                    <v-avatar size="56" class="mr-2 ml-2">
                      <v-img
                        :src="getRandomAvatarUrl()"
                        :alt="languages[selectedLanguageIndex]"
                      />
                    </v-avatar>
                    <v-spacer />
                    <v-btn
                      variant="outlined"
                      color="grey"
                      @click="publishTopicContent(selectedSubtopic)"
                      >Publish Chapter in {{ languages[selectedLanguageIndex] }}</v-btn
                    >
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>

              <!-- Render realcomputing article -->
              <div
                v-if="
                  resourceStore.resource.contentType === 'COMPUTING' &&
                  resourceStore.resource.content.length > 10
                "
              >
                <v-card
                  min-width="99%"
                  style="background-color: #fffff9 !important"
                  flat
                  class="scrollable-content ml-4"
                >
                  <v-img
                    :src="resourceStore.resource.coverImage"
                    style="border-radius: 5px 5px 0px 0px"
                    class="mb-4 ml-4"
                    height="45vh"
                    cover
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
                        <v-img
                          :src="getRandomAvatarUrl()"
                          alt="Author Profile Picture"
                        />
                      </v-avatar>
                      <v-card-subtitle class="bbc-meta">
                        <strong>
                          Author:
                          {{
                            resourceStore.resource.createdBy.personalInfo
                              .fullName
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
                            timezoneConverter(
                              Number(resourceStore.resource.createdAt)
                            )
                          )
                        }}
                        |
                        {{ elapsedTime(resourceStore.resource.createdAt) }}
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-divider />

                  <div
                    style="
                      max-width: 81% !important;
                      padding-left: 2.4rem;
                      align-items: left;
                    "
                    v-html="topicBlogArticle"
                    class="bbc-content ml-8 ma-3"
                  ></div>

                  <v-divider />
                  <div
                    class="d-flex flex-column align-center"
                    style="align-items: center"
                  >
                    <v-divider />
                    <v-btn
                      class="mt-4 mb-2"
                      variant="outlined"
                      @click="scrollToTop"
                    >
                      <v-icon>mdi-arrow-up</v-icon>Back to Top
                    </v-btn>
                    <br />
                  </div>
                </v-card>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-dialog
      v-model="metaDialog"
      max-width="450"
      max-height="15rem"
      style="overflow: hidden"
      peristent
    >
      <v-card
        min-height="15rem"
        min-width="450"
        style="overflow: hidden"
        prepend-icon="mdi-edit-not-outline"
        title="Set your programming language"
      >
        <v-divider></v-divider>
        <v-row background-color="primary" justify="center" class="pa-4">
          <v-col
            cols="auto"
            v-for="(lang, index) in languages"
            :key="lang"
            class="d-flex justify-center"
          >
            <v-card
              color="#efefef"
              min-width="120"
              max-width="120"
              @click="setLanguage(lang, index), (metaDialog = false)"
              :elevation="hoveredIndex === index ? 8 : 1"
              @mouseover="hoveredIndex = index"
              @mouseleave="hoveredIndex = -1"
              class="pa-4 text-center"
              style="cursor: pointer; transition: elevation 0.2s"
            >
              <v-img
                max-height="50"
                :src="getIconForLanguage(lang)"
                alt="Language Icon"
                class="icon mb-2"
              />
              <h6>{{ lang }}</h6>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { topics as biostatTopics } from "@/data/biostatisticsComputingTopics";
import { useResourceStore } from "../../../stores/resources";
import PlaceHolder from "./PlaceHolder.vue";
import { useRoute } from "vue-router";
const isMobile = ref(false);
const detectMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  detectMobile(); // Initial check
  window.addEventListener("resize", detectMobile); // Attach listener
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", detectMobile); // Clean up on unmount
});
const route = useRoute();
const isComputingRoute = computed(() => route.path.endsWith("/computing"));
const resourceStore = useResourceStore();
const showMediaLoading = ref(false);
const metaDialog = ref(false);

// Data setup
const topics = ref(biostatTopics);
const selectedSubtopic = ref(null);
const selectedLanguageIndex = ref(0); // Use index instead of direct language
const fetchedLanguages = ref([]);
const languages = ["R", "Python", "Julia"];

const fetchLanguages = async () => {
  // Fetch languages (example hardcoded)
  fetchedLanguages.value = ["R", "Python", "Julia"];
};

watch(fetchLanguages, () => {}, { immediate: true });

// Helper to get the icon for a language
const getIconForLanguage = (lang) => {
  const icons = {
    R: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/R_logo.svg/724px-R_logo.svg.png",
    Python:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
    Julia: "https://numfocus.org/wp-content/uploads/2016/07/julia-logo-300.png",
  };
  return icons[lang];
};
function publishTopicContent(selectedSubtopic) {
  // languages[selectedLanguageIndex.value]
  //

  localStorage.setItem("articleTopic", selectedSubtopic);
  localStorage.setItem(
    "articleLanguage",
    languages[selectedLanguageIndex.value]
  );
  resourceStore.showCreateResourceDialog = true;
}
// Set the language and fetch resources for the active language
const setLanguage = (lang, index) => {
  console.log(lang, index);
  selectedLanguageIndex.value = index;
  topicBlogLanguage.value = lang;
  fetchResourceForLanguage(index);
};
const topicBlogTopic = ref("");
const topicBlogArticle = ref("");
const topicBlogLanguage = ref("");
// Fetch resources for the selected language
const fetchResourceForLanguage = async () => {
  if (selectedSubtopic.value === null) {
    return 0;
  }
  showMediaLoading.value = true;
  const reqParams = {
    language: languages[selectedLanguageIndex.value],
    topic: selectedSubtopic.value,
  };

  try {
    await resourceStore.fetchComputingResource(JSON.stringify(reqParams));
    if (resourceStore.resource.content.length > 10) {
      const articleContent = JSON.parse(resourceStore.resource.content);
      topicBlogTopic.value = articleContent.topic;
      topicBlogArticle.value = articleContent.topicContent;
      topicBlogLanguage.value = articleContent.language;
      showMediaLoading.value = false;
    } else {
      resourceStore.resource.contentType = "COMPUTING";
      showMediaLoading.value = false;
    }
  } catch (error) {
    console.error("Error fetching resource:", error);
    showMediaLoading.value = false;
  }
};

// Handle subtopic click
const setActiveSubtopic = async (subtopic) => {
  selectedSubtopic.value = subtopic;
  fetchResourceForLanguage(selectedLanguageIndex.value);
};

import timezoneConverter from "../../../utilities/timezoneConverter";

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
  return getIconForLanguage(topicBlogLanguage.value);
}
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

.v-img.icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
</style>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap");

.v-card {
  max-width: 800px;
  margin: auto;
}

.v-img {
  border-radius: 8px;
}

.scrollable-content {
  max-height: 81vh;
  overflow-y: auto;

  font-size: 21px;
}

.bbc-title {
  font-family: "Cormorant Garamond", serif;
  font-size: 54px;
  font-weight: 700;
  line-height: 1.3;
  color: #222;
}

.bbc-subtitle {
  font-family: "Cormorant Garamond", serif;
  font-size: 21px;
  color: #3f3d3d;
  margin-bottom: 1rem;
}

.bbc-meta {
  font-family: "Cormorant Garamond", serif;
  font-size: 14px;
  color: #3f3d3d;
  margin-right: 1.5rem;
}

.bbc-content {
  font-family: "Cormorant Garamond", serif;
  font-size: 21px;
  line-height: 1.6;
  color: #333;
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
