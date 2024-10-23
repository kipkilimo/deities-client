<template>
  <v-container class="my-5">
    <v-progress-linear
      color="#212121"
      v-if="resourceFilterOptionsSelected"
      indeterminate
    ></v-progress-linear>
    <v-row>
      <v-col
        v-for="(resource, index) in updatedResources"
        :key="index"
        cols="12"
        md="6"
        lg="4"
        xl="4"
      >
        <v-card
          class="mx-auto my-3 resource-card"
          max-width="540"
          height="13.5rem"
          :disabled="resource.resourceCount === 0"
          outlined
        >
          <v-card-title
            style="cursor: pointer"
            :disabled="resourceFilterOptionsSelected"
            @click="showFilterOptionsSelector(resource)"
            color="#08487f"
            class="d-flex align-center justify-space-between"
          >
            <span class="resource-icon">{{ resource.icon }}</span>
            <span class="resource-name">
              {{ resource.name }} ({{ resource.resourceCount }})
              <v-card-text class="text-h11">
                {{ resource.type }}
              </v-card-text>
            </span>
          </v-card-title>

          <v-divider></v-divider>
          <v-card-text class="resource-description text-h7 py-2">
            {{ resource.description }}
          </v-card-text>
          <v-card-actions class="fixed-actions mb-1">
            <v-btn
              append-icon="mdi-chevron-right"
              color="#08487f"
              variant="outlined"
              block
              @click="goToResourceRenderer(resource)"
              :disabled="!resourceFilterOptionsSelected"
            >
              Explore {{ resource.name }} resources
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Existing Filter Dialog -->
    <v-dialog width="87%" v-model="resourceSelected" style="overflow: hidden">
      <v-card flat height="13.5rem" class="ma-4" style="padding: 0">
        <h3 color="#b5b1b2" class="text-h10 mb-4 ml-44 mt-2">
          Specify the resources to get started. The input values are optional.
        </h3>
        <v-divider />
        <br />
        <v-row no-gutters>
          <v-col cols="2" style="padding: 0 8px">
            <v-select
              v-model="formData.selectedSubject"
              :items="subjects"
              label="Subject"
              dense
              outlined
              hint="What do you want to study?"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="2" style="padding: 0 8px">
            <v-select
              v-model="formData.selectedTopicConcept"
              :items="allSubjectConcepts"
              label="Resource Level"
              hint="Resource Level"
              dense
              outlined
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="2" style="padding: 0 8px">
            <v-select
              v-model="formData.selectedTopic"
              :items="allSubjectTopics"
              label="Topic to study"
              hint="Topic to study"
              dense
              outlined
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="2" style="padding: 0 8px">
            <v-select
              v-model="formData.selectedTargetRegion"
              :items="regions"
              label="Resource target Region"
              hint="Resource target Region"
              dense
              outlined
              hide-details
            ></v-select>
          </v-col>

          <v-col cols="2" style="padding: 0 8px">
            <v-select
              v-model="formData.selectedCountry"
              :items="countriesList"
              label="Select country"
              hint="Resource target country"
              dense
              outlined
              hide-details
            ></v-select
          ></v-col>
          <v-col cols="2" style="padding: 0 8px">
            <v-select
              v-model="formData.selectedLanguage"
              :items="languagesList"
              label="Language"
              hint="Resource Language"
              dense
              outlined
              hide-details
            ></v-select
          ></v-col>
        </v-row>
        <br /><br />
        <v-card-actions class="fixed-actions mb-1">
          <v-btn
            append-icon="mdi-chevron-right"
            color="#08487f"
            variant="outlined"
            block
            @click="saveSelectedFilelds"
          >
            Save selections and get resources
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from "vue";
import { useResourceStore } from "../../../stores/resources";
import staticResourcesData from "@/data/staticResources";

const { resourceType, staticResources } = staticResourcesData;

console.log({ staticResourcesTypes: staticResources.value });
import { useRouter } from "vue-router";
import worldRegions from "../../../data/languages";
import topicsData from "../../../data/topics";

const router = useRouter();

const subjects = ref(Object.keys(topicsData));

const resourceSelected = ref(false);
const resourceFilterOptionsSelected = ref(false);

const formData = ref({
  selectedSubject: "",
  selectedTopicConcept: "",
  selectedTopic: "",
  selectedTargetRegion: "",
  selectedCountry: "",
  selectedLanguage: "",
});

const allSubjectConcepts = ref([]);
const allSubjectTopics = ref([]);
const countriesList = ref([]);
const languagesList = ref([]);

// Watch for changes in selectedSubject to reset related fields
watch(
  () => formData.value.selectedSubject,
  (newValue) => {
    formData.value.selectedTopicConcept = "";
    formData.value.selectedTopic = "";
    allSubjectConcepts.value = newValue
      ? extractSubelements(newValue, topicsData)
      : [];
  }
);

// Watch for changes in selectedTopicConcept to reset related fields
watch(
  () => formData.value.selectedTopicConcept,
  (newValue) => {
    formData.value.selectedTopic = "";
    allSubjectTopics.value = newValue
      ? getTopicsArray(formData.value.selectedSubject, newValue, topicsData)
      : [];
  }
);

// Watch for changes in selectedTopic to handle any specific logic if needed
watch(
  () => formData.value.selectedTopic,
  (newValue) => {
    // Add logic if needed when selectedTopic changes
  }
);

// Watch for changes in selectedTargetRegion to reset related fields
watch(
  () => formData.value.selectedTargetRegion,
  (newValue) => {
    formData.value.selectedCountry = "";
    formData.value.selectedLanguage = "";
    countriesList.value = newValue ? getCountriesByRegion(newValue) : [];
    languagesList.value = newValue ? getLanguagesByRegion(newValue) : [];
  }
);

// Function to extract sub-elements based on the subject
function extractSubelements(subject: string, schema: { [key: string]: any }) {
  if (!schema.hasOwnProperty(subject)) {
    throw new Error(`Subject ${subject} not found in schema.`);
  }
  return Object.keys(schema[subject]);
}

// Function to get topics array based on subject and concept
function getTopicsArray(
  subject: string,
  concept: string,
  schema: { [key: string]: any }
) {
  if (!schema.hasOwnProperty(subject)) {
    throw new Error(`Subject "${subject}" not found in schema.`);
  }
  if (!schema[subject].hasOwnProperty(concept)) {
    throw new Error(`Concept "${concept}" not found in subject "${subject}".`);
  }
  return schema[subject][concept];
}

// Function to get countries by region
function getCountriesByRegion(region: string): string[] | undefined {
  const regionData = worldRegions[region];
  return regionData ? regionData.countries : undefined;
}

// Function to get languages by region
function getLanguagesByRegion(region: string): string[] | undefined {
  const regionData = worldRegions[region];
  return regionData
    ? regionData.languages.map((language) => language.name)
    : undefined;
}

const regions = computed(() => {
  return Object.keys(worldRegions).filter(
    (region) => region === "Global" || region.includes("Africa")
  );
});

const resourceStore = useResourceStore();
const updatedResources = computed(() => {
  return staticResources.value.map((resource) => {
    const matchingResources = resourceStore.resources.filter(
      (res) => res.contentType === resource.type
    );
    return {
      ...resource,
      resourceCount: matchingResources.length,
    };
  });
});

function goToResourceRenderer(resource: { type: string }) {
  const fetchParams = [
    {
      resourceType: resource.type,
      selectedSubject: formData.value.selectedSubject,
      selectedTopicConcept: formData.value.selectedTopicConcept,
      selectedTopic: formData.value.selectedTopic,
      selectedTargetRegion: formData.value.selectedTargetRegion,
      selectedCountry: formData.value.selectedCountry,
      selectedLanguage: formData.value.selectedLanguage,
    },
  ];
  localStorage.setItem("queryParams", JSON.stringify(fetchParams));
  router.push("/dashboard/player");
  resourceFilterOptionsSelected.value = false;
}

function saveSelectedFilelds() {
  resourceSelected.value = false;
  resourceFilterOptionsSelected.value = true;
  let rawResource = localStorage.getItem("targetResource");
  rawResource = JSON.parse(rawResource)[0];
  goToResourceRenderer(rawResource);
}

function showFilterOptionsSelector(resource: any) {
  let resRaw = [resource];
  resRaw = JSON.stringify(resRaw);
  localStorage.setItem("targetResource", resRaw);
  resourceSelected.value = true;
}

onBeforeMount(() => {
  resourceStore.getAllResources();
});
</script>

<style scoped>
/* Styles for the resource card */
.resource-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
  position: relative;
  padding-bottom: 3rem; /* Space reserved for buttons */
}

.resource-card:hover {
  transform: scale(1.0025); /* Slightly scale the card */
  box-shadow: 0px 10px 20px rgba(26, 25, 25, 0.7); /* Add pronounced shadow */
}

.fixed-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
}

.resource-icon {
  font-size: 2.5rem;
}

.resource-name {
  font-size: 1.5rem;
  font-weight: 600;
}

.resource-description {
  font-size: 1.1rem;
  color: #555;
}

.v-btn {
  text-transform: uppercase;
  border-radius: 4px !important;
}
</style>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
