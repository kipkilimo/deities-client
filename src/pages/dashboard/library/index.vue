<template>
  <v-container class="my-5">
    <!-- Progress bar shown while loading resources -->
    <v-progress-linear
      color="#08487f"
      v-if="settingUpLibrary"
      indeterminate
    ></v-progress-linear>

    <v-row>
      <!-- Display each resource as a card -->
      <v-col :disabled="!settingUpLibrary===true"
        v-for="(resource, index) in updatedResources"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="mx-auto my-3 resource-card"
          max-width="540"
          height="13.5rem"
          :disabled="!resource?.resourceCount"
          outlined
        >
          <v-card-title
            class="d-flex align-center justify-space-between"
            :style="{
              cursor: resourceFilterOptionsSelected ? 'default' : 'pointer',
            }"
            color="#08487f"
            @click="
              resourceFilterOptionsSelected ||
                showFilterOptionsSelector(resource)
            "
          >
            <span class="resource-icon">{{ resource?.icon || "📘" }}</span>
            <span class="resource-name">
              {{ resource?.name || "Unknown Resource" }} ({{
                resource?.resourceCount || 0
              }})
              <v-card-text class="text-h11">{{
                resource?.type || "General"
              }}</v-card-text>
            </span>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Resource description -->
          <v-card-text class="resource-description text-h7 py-2">
            {{ resource?.description || "No description available" }}
          </v-card-text>

          <!-- Card actions with Explore button -->
          <v-card-actions class="fixed-actions mb-1">
            <v-btn
              append-icon="mdi-chevron-right"
              color="#08487f"
              variant="outlined"
              block
              @click="goToResourceRenderer(resource)"
              :disabled="!resource?.resourceCount"
            >
              Explore {{ resource?.name || " " }} resources
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Options Dialog -->
    <v-dialog width="87%" v-model="resourceSelected" style="overflow: hidden">
      <v-card flat height="13.5rem" class="ma-4" style="padding: 0">
        <h3 class="text-h10 mb-4 ml-44 mt-2" color="#b5b1b2">
          Specify resources to get started. Input values are optional.
        </h3>
        <v-divider />

        <!-- Filter fields row -->
        <v-row no-gutters>
          <v-col
            v-for="(field, key) in filterFields"
            :key="key"
            cols="2"
            style="padding: 0 8px"
          >
            <v-select
              v-model="formData[key]"
              :items="field.options"
              :label="field.label"
              :hint="field.hint"
              dense
              outlined
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <!-- Save button -->
        <v-card-actions class="fixed-actions mb-1">
          <v-btn
            append-icon="mdi-chevron-right"
            color="#08487f"
            variant="outlined"
            block
            @click="saveSelectedFields"
          >
            Save selections and get resources
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, computed, watch, onBeforeMount,onMounted } from "vue";
import { useRouter } from "vue-router";
import { useResourceStore } from "../../../stores/resources";
import staticResources from "../../../data/staticResources";
import worldRegions from "../../../data/languages";
import topicsData from "../../../data/topics";

const router = useRouter();
const resourceStore = useResourceStore();
const settingUpLibrary=ref(true)

// Reactive properties
const resourceSelected = ref(false);
const resourceFilterOptionsSelected = ref(false);
const subjects = ref(Object.keys(topicsData));
const formData = ref({
  selectedSubject: "",
  selectedTopicConcept: "",
  selectedTopic: "",
  selectedTargetRegion: "",
  selectedCountry: "",
  selectedLanguage: "",
}); 

const updatedResources = computed(() => {
  return staticResources.staticResources.value.map((resource) => {
    const matches = resourceStore.resources.filter(
      (res) => res.contentType === resource.type
    );
    return { ...resource, resourceCount: matches.length };
  });
});
onMounted(() => {
  setTimeout(() => {
    settingUpLibrary.value=false
  }, 900);
})
// Filter fields configuration
const filterFields = ref({
  selectedSubject: {
    label: "Subject",
    hint: "What do you want to study?",
    options: subjects.value,
  },
  selectedTopicConcept: {
    label: "Resource Level",
    hint: "Resource Level",
    options: ref([]),
  },
  selectedTopic: { label: "Topic", hint: "Topic to study", options: ref([]) },
  selectedTargetRegion: {
    label: "Region",
    hint: "Resource region",
    options: computed(() => Object.keys(worldRegions)),
  },
  selectedCountry: {
    label: "Country",
    hint: "Target country",
    options: ref([]),
  },
  selectedLanguage: {
    label: "Language",
    hint: "Resource language",
    options: ref([]),
  },
});

// Watchers for dynamic option changes
watch(
  () => formData.value.selectedSubject,
  (val) => {
    formData.value.selectedTopicConcept = "";
    filterFields.value.selectedTopicConcept.options = val
      ? Object.keys(topicsData[val])
      : [];
  }
);
watch(
  () => formData.value.selectedTopicConcept,
  (val) => {
    formData.value.selectedTopic = "";
    filterFields.value.selectedTopic.options = val
      ? topicsData[formData.value.selectedSubject][val]
      : [];
  }
);
watch(
  () => formData.value.selectedTargetRegion,
  (val) => {
    formData.value.selectedCountry = "";
    formData.value.selectedLanguage = "";
    filterFields.value.selectedCountry.options = val
      ? worldRegions[val].countries
      : [];
    filterFields.value.selectedLanguage.options = val
      ? worldRegions[val].languages.map((lang) => lang.name)
      : [];
  }
);

// Navigation and data-saving functions
function goToResourceRenderer(resource) {
  localStorage.setItem(
    "queryParams",
    JSON.stringify([{ ...formData.value, resourceType: resource.type }])
  );
  router.push(resource.type === "TEST" ? "/exam/mocks" : "/dashboard/player");
  resourceFilterOptionsSelected.value = false;
}

function saveSelectedFields() {
  resourceSelected.value = false;
  resourceFilterOptionsSelected.value = true;
  const targetResource = JSON.parse(
    localStorage.getItem("targetResource") || "[]"
  )[0];
  goToResourceRenderer(targetResource);
}

function showFilterOptionsSelector(resource) {
  localStorage.setItem("targetResource", JSON.stringify([resource]));
  resourceSelected.value = true;
}

// Fetch resources on load
onBeforeMount(async () => {
  await resourceStore.getAllResources();
});
</script>
<style scoped>
.resource-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
  padding-bottom: 3rem;
}
.resource-card:hover {
  transform: scale(1.0025);
  box-shadow: 0px 10px 20px rgba(26, 25, 25, 0.7);
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