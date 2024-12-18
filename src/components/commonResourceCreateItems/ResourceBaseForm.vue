<template>
  <v-container>
    <v-divider class="mb-2" />
    <v-row class="mt-2">
      <v-col cols="12">
        <v-text-field
          v-model="formData.title"
          label="Resource headline"
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
          :items="resourceEnums"
          :disabled="formData.resourceType === 'COMPUTING'"
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
          :disabled="formData.resourceType === 'COMPUTING'"
          @change="resetLevelAndTopics"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedLevel"
          :items="complexityLevels"
          label="Select Level of Complexity"
          :disabled="!selectedSubject || formData.resourceType === 'COMPUTING'"
          @change="resetTopics"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedTopic"
          :items="filteredTopics"
          label="Select Topic"
          :disabled="!selectedLevel || formData.resourceType === 'COMPUTING'"
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
    <!-- {{ useUserStore().user.personalInfo }} -->
    <v-dialog v-model="creditBalanceDialog" max-width="54rem" persistent>
      <v-card class="mx-auto" min-width="720" border flat>
        <v-list-item class="px-6" height="88">
          <template v-slot:prepend>
            <v-avatar color="surface-light" size="36">🧾</v-avatar>
          </template>

          <template v-slot:title> NEMBio publication credits </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-card-text class="text-medium-emphasis pa-3">
          <div class="text-h5 font-weight-black mb-2">
            My publication credits:
            {{ useUserStore().user?.personalInfo.publication_credits }}
          </div>

          <v-progress-linear
            bg-color="surface-variant"
            class="mb-6"
            color="primary"
            height="10"
            :model-value="useUserStore().user?.personalInfo.publication_credits"
            rounded="pill"
          ></v-progress-linear>

          <v-row>
            <v-col
              v-for="(publication, index) in publication_credit_charges"
              :key="index"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                class="pa-1"
                :style="{
                  border:
                    publication.type === formData.resourceType
                      ? '0.0025em solid #0098d6'
                      : 'none',
                }"
              >
                <v-card-subtitle>{{ publication.type }}</v-card-subtitle>
                <v-card-text
                  >Credit charge: {{ publication.credits }}</v-card-text
                >
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-alert border="top" class="ml-2 mb-1" width="98%" variant="outlined">
          <v-card-text class="text-h6 py-1" color="#0098d6"
            ><v-icon class="mr-2">mdi-information-outline</v-icon> USD 1 earns
            100 NEMBio Publication Credits spent as shown above.</v-card-text
          >
        </v-alert>
        <v-divider></v-divider>

        <v-card-actions class="justify-center px-2 py-1">
          <v-btn
            class="flex-grow-1 text-none"
            color="blue-darken-4"
            rounded="0"
            variant="plain"
            @click="creditBalanceDialog = false"
          >
            Cancel Publication Process
          </v-btn>

          <v-btn
            class="text-white flex-grow-1 text-none"
            color="pink"
            rounded="4"
            variant="flat"
            @click="(creditBalanceDialog = false), (paypalDialog = true)"
          >
            <v-icon class="mr-6">mdi-wallet-giftcard</v-icon> Purchase
            Publication Credits
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paypalDialog" max-width="75rem" persistent>
      <v-card min-width="75rem">
        <paypal />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, watch } from "vue";
import { useResourceStore } from "../../stores/resources"; // Replace with actual path
const userId = ref(localStorage.getItem("sessionId")); // Retrieve userId from local storage
const creditBalanceDialog = ref(false);
const paypalDialog = ref(false);

import { useUserStore } from "@/stores/users";
const resourceStore = useResourceStore();
import worldRegions from "../../data/languages";
import staticResourcesData from "../../data/staticResources";
const publication_credit_charges = [
  { type: "▶ SLIDES PLAYER", key: "PRESENTATION", credits: 10 },
  { type: "📚🎧 ASSIGNMENT TASKS", key: "TASK", credits: 5 },
  { type: "📙 DOCUMENTS", key: "DOCUMENT", credits: 20 },
  { type: "🕖📋✍🏼 EXAM TESTS", key: "TEST", credits: 5 },
  { type: "📑 BLOG ARTICLES", key: "ARTICLE", credits: 5 },
  { type: "📹 RECORDINGS", key: "VIDEO", credits: 10 },
  { type: "🖼️ GALLERIES", key: "IMAGES", credits: 5 },
  { type: "🎵 PODCASTS", key: "AUDIO", credits: 10 },
  { type: "🗓️ EVENTS", key: "EVENT", credits: 100 },
  { type: "⛁⛁ DATASETS", key: "DATASET", credits: 20 },
  { type: "🗣️📊 LIVE POLLS", key: "POLL", credits: 50 },
  { type: "🖥👩🏻‍💻⌨ PROGRAMMING", key: "COMPUTING", credits: 1000 },
  { type: "🎴 ABSTRACT POSTERS", key: "POSTER", credits: 1000 },
  { type: "📁 WORK STUDY", key: "MIXED", credits: 225 },
  { type: "⛓️ RESOURCE LINKS", key: "LINK", credits: 5 },
  { type: "🎲 CLINICAL MODELS", key: "MODEL", credits: 10 },
];
// Function to get credits for a given publication type
const getCreditsByType = (type: string) => {
  const publication = publication_credit_charges.find(
    (pub) => pub.type === type
  );
  return publication ? publication.credits : null; // Return credits or null if not found
};

// Example usage

const { resourceType, staticResources } = staticResourcesData;
// Define a type for the keys of the topics
type Subject = "Epidemiology" | "Biostatistics" | "Research Methods";

const resourceEnums = Object.values(resourceType).map(
  (resource) => resource.name
);
onBeforeMount(async () => {
  const userStore = useUserStore();
  await userStore.getCurrentUser(userId.value || "");
});
// Define the form data
const formData = ref({
  title: "",
  description: "",
  subject: "",
  topic: "",
  targetRegion: "",
  targetLanguageRegion: "",
  targetCountry: "",
  language: "",
  resourceType: "",
  keywords: ["", "", "", ""] as string[],
  createdBy: "", // Replace with dynamic user ID
});
const user_credits = ref(
  // @ts-ignore
  Number(useUserStore().user.personalInfo.publication_credits)
);
//
onMounted(() => {
  // Run the same logic directly in `onMounted`

  const required_credits = 5;

  if (user_credits.value < required_credits) {
    creditBalanceDialog.value = true;
  } else {
    creditBalanceDialog.value = false;
  }
});
// Watch for changes in resourceType
watch(
  () => formData.value.resourceType,
  (newResourceType) => {
    if (!newResourceType) return;

    // Get the corresponding credit charge for the selected resourceType
    const required_credits = Number(
      getCreditsByType(formData.value.resourceType)
    );

    // Check if the user has enough credits
    if (user_credits.value < required_credits) {
      creditBalanceDialog.value = true;
      return false;
    } else {
      creditBalanceDialog.value = false;

      return true;
    }
  }
);
console.log({ resourceEnums });
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

const topicTitle = localStorage.getItem("articleTopic");
console.log({ topicTitle });
if (topicTitle !== null) {
  selectedSubject.value = "Biostatistics";
  selectedLevel.value = "Core Concepts";
  selectedTopic.value = "Computing and Statistical Software";
  formData.value.resourceType = "COMPUTING";
  formData.value.title = topicTitle;
  formData.value.subject = "Biostatistics";
  formData.value.topic = "Computing and Statistical Software";
}

function getResourceTypeKey(
  value: string
): keyof typeof resourceType | undefined {
  const entry = Object.entries(resourceType).find(
    ([key, val]) => val.icon === value || val.name === value
  );
  return entry ? (entry[0] as keyof typeof resourceType) : undefined;
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
  let contentType;
  contentType = getResourceTypeKey(formData.value.resourceType);
  if (!contentType) {
    contentType = "COMPUTING";
  }
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
      // @ts-ignore
      contentType: contentType, // Use computed property
      keywords: keywordsString,
      createdBy: storedUser,
    });
    // Handle success (e.g., notify user, reset form, etc.)
    resourceStore.showCreateResourceDialog = false;
    resourceStore.showAddResourceCoverAndContentDialog = true;
  } catch (error) {
    // Handle error (e.g., notify user)
  }
};
</script>
