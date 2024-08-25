<template>
  <v-container>
    <v-divider class="mb-2" />
    <v-row class="mt-2">
      <v-col cols="12">
        <v-text-field
          v-model="formData.title"
          label="Title"
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-textarea
          v-model="formData.description"
          label="Description"
          counter="350"
          :rules="[rules.required]"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          :items="resourceTypes"
          label="Resource Type"
          v-model="formData.resourceType"
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-select
          v-model="selectedSubject"
          :items="subjects"
          label="Select Subject"
          @change="resetLevelAndTopics"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedLevel"
          :items="complexityLevels"
          label="Select Level of Complexity"
          :disabled="!selectedSubject"
          @change="resetTopics"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedTopic"
          :items="filteredTopics"
          label="Select Topic"
          :disabled="!selectedLevel"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          :items="regions"
          label="Resource Target Region"
          v-model="formData.targetRegion"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-select
          :items="countriesList"
          label="Resource Target Country"
          v-model="formData.targetCountry"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          :items="languageRegions"
          label="Language Region Base"
          v-model="formData.targetLanguageRegion"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          :items="languagesList"
          label="Selected Language"
          v-model="formData.language"
          :disabled="!formData.targetLanguageRegion"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-combobox
          label="Keywords"
          v-model="formData.keywords"
          multiple
          chips
          deletable-chips
        />
      </v-col>
    </v-row>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="createResource" variant="outlined"
        >Create Resource</v-btn
      >
      <v-spacer />
      <v-btn
        variant="text"
        color="red"
        @click="resourceStore.showCreateResourceDialog = false"
        >CLOSE</v-btn
      >
    </v-card-actions>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useResourceStore } from "../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
import worldRegions from "../../data/languages";

// Define a type for the keys of the topics object
type Subject = "Epidemiology" | "Biostatistics" | "Research Methods";

// Define a type for the structure of the topics object
type TopicsStructure = {
  [K in Subject]: {
    "Core Concepts": string[];
    "Advanced Topics": string[];
    "Data Analysis"?: string[]; // Optional since not all subjects have it
    "Data Management"?: string[]; // Optional since not all subjects have it
  };
};

// Import your topics data
import rawTopics from "../../data/topics";

// Cast the imported topics to the appropriate type
const topics: TopicsStructure = rawTopics;

// Initialize refs with proper typing
// @ts-ignore
const selectedSubject = ref<Subject>(""); // Allow empty string as initial value
const selectedLevel = ref("");
const selectedTopic = ref("");

// Computed property to get the subjects for v-select
const subjects = computed(() => {
  return Object.keys(topics) as Subject[]; // Cast to Subject[]
});

// Computed property to get the levels of complexity based on the selected subject
const complexityLevels = computed(() => {
  if (selectedSubject.value) {
    const subjectTopics = topics[selectedSubject.value];
    return Object.keys(subjectTopics);
  }
  return [];
});

// Computed property to filter topics based on selected subject and level of complexity
const filteredTopics = computed(() => {
  if (selectedSubject.value && selectedLevel.value) {
    const subject = selectedSubject.value as Subject;
    const level = selectedLevel.value as keyof (typeof topics)[Subject];
    return topics[subject][level] || [];
  }
  return [];
});

// Methods to reset child selections when parent is changed
function resetLevelAndTopics() {
  selectedLevel.value = "";
  selectedTopic.value = "";
}

function resetTopics() {
  selectedTopic.value = "";
}

// Define ResourceType as a constant object
const ResourceType = {
  AUDIO: "🎵 AUDIO",
  VIDEO: "🎥 VIDEO",
  IMAGES: "🖼️ IMAGES",
  DOCUMENT: "📙 DOCUMENT", 
  PRESENTATION: "▶ PRESENTATION",
  EVENT: "🗓️ EVENT",
  DATASET: "⛁ DATASET",
  LINK: "⛓️ LINK",
  POLL: "🗣️📊 POLL",
  TEST: "🕖📋✍🏼 TEST",
  POSTER: "🎴 POSTER",
  ARTICLE: "📑 ARTICLE",
  JOB: "📁 JOB",
  TASK: "📚🎧☕ TASK",
  MODEL: "🎲 MODEL",
} as const;
 
const resourceTypes = Object.values(ResourceType);


// Define the form data
const formData = ref({
  title: "Poisson distribution",
  description: "In probability theory and statistics, the Poisson distribution is a discrete probability distribution that expresses the probability of a given number of events occurring in a fixed interval of time if these events occur with a known constant mean rate and independently of the time since the last event.",
  subject: "",
  topic: "",
  targetRegion: "",
  targetLanguageRegion: "",
  targetCountry: "",
  language: "",
  resourceType: "",
  keywords: [   'poisson','model','distributions','probability'] as string[],
  createdBy: "user-id", // Replace with dynamic user ID
});

// Computed property for `resourceTypeEnum`
// const resourceTypeEnum = computed(() => {
//   const value = formData.value.resourceType;
//   // @ts-ignore
//   return ResourceType[value]; // No need for explicit key lookup
// });
function getResourceTypeKey(value: string): keyof typeof ResourceType  {
  // @ts-ignore
  return Object.keys(ResourceType).find((key) => ResourceType[key as keyof typeof ResourceType] === value) as keyof typeof ResourceType 
}

const rules = {
  required: (value: string) => !!value || "Required.",
};

const regions = computed(() => {
  const regions = Object.keys(worldRegions);
  return regions.filter(
    (region) => region === "Global" || region.includes("Africa")
  );
});

const countriesList = computed(() => {
  const regionData = worldRegions[formData.value.targetRegion];
  return regionData ? regionData.countries : [];
});

watch(
  () => formData.value.targetRegion,
  () => {
    formData.value.targetCountry = "";
  }
);

const languageRegions = computed(() => {
  const regions = Object.keys(worldRegions);
  return regions.filter(
    (region) => region === "Global" || region.includes("Africa")
  );
});

const languagesList = computed(() => {
  const regionData = worldRegions[formData.value.targetLanguageRegion];
  return regionData
    ? regionData.languages.map((language) => language.name)
    : [];
});

watch(
  () => formData.value.targetLanguageRegion,
  () => {
    formData.value.language = "";
  }
);

const createResource = async () => {
  const storedUser = localStorage.getItem("sessionId") || "";

  const keywordsString = JSON.stringify(formData.value.keywords);
  try {
    await resourceStore.createResource({
      title: formData.value.title,
      description: formData.value.description,
      subject: selectedSubject.value,
      topic: selectedTopic.value,
      targetRegion: formData.value.targetRegion,
      targetCountry: formData.value.targetCountry,
      language: formData.value.language,
      contentType: getResourceTypeKey(formData.value.resourceType), // Use computed property
      keywords: keywordsString,
      createdBy: storedUser,
    });
    // Handle success (e.g., notify user, reset form, etc.)
    resourceStore.showAddResourceCoverAndContentDialog = true;
    resourceStore.showCreateResourceDialog = false;
  } catch (error) {
    console.error("Failed to create resource:", error);
    // Handle error (e.g., notify user)
  }
};
</script>
