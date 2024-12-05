<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card>
          <v-card-title>Add Poll Questions</v-card-title>
          <v-card-text>
            <v-form ref="formRef" v-model="valid" lazy-validation>
              <!-- Poll Type Selector -->
              <v-select
                v-model="currentlyCreatingPollItem.type"
                :items="pollTypes"
                label="Poll Type"
                :rules="[rules.required]"
                required
              ></v-select>

              <!-- Poll Question -->
              <v-text-field
                v-model="currentlyCreatingPollItem.question"
                label="Poll Question"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <!-- Add Options (Single Choice, Multiple Choice, Ranking) -->
              <template
                v-if="['Single Choice', 'Multiple Choice', 'Ranking'].includes(currentlyCreatingPollItem.type)"
              >
                <v-text-field
                  v-model="newOption"
                  label="Add Options (separate with #)"
                  @paste="handlePaste"
                  @keyup.enter="parseOptions"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-btn @click="parseOptions" color="primary"> Add Options </v-btn>

                <!-- Render Options as v-chips in a horizontal row -->
                <v-row class="mt-4" dense>
                  <v-col
                    v-for="(option, index) in currentlyCreatingPollItem.options"
                    :key="index"
                    cols="auto"
                  >
                    <v-chip>
                      {{ option }}
                      <v-icon
                        small
                        class="ml-2"
                        @click="removeOption(option)"
                      >mdi-close</v-icon>
                    </v-chip>
                  </v-col>
                </v-row>

                <!-- Correct Response Field (if applicable) -->
                <v-text-field
                  v-if="['Single Choice', 'Multiple Choice'].includes(currentlyCreatingPollItem.type)"
                  v-model="currentlyCreatingPollItem.correctResponse"
                  label="Correct Response"
                  :rules="[rules.correctResponse]"
                  required
                ></v-text-field>
              </template>

              <!-- Open-Ended Question Instructions -->
              <v-textarea
                v-if="currentlyCreatingPollItem.type === 'Open-Ended'"
                v-model="currentlyCreatingPollItem.options"
                label="Instructions for open-ended response"
              ></v-textarea>

              <!-- Rating Question Slider -->
              <v-slider
                v-if="currentlyCreatingPollItem.type === 'Rating'"
                v-model="currentlyCreatingPollItem.correctResponse"
                min="1"
                max="5"
                ticks
                :labels="['1', '', '', '', '5']"
                thumb-label
              ></v-slider>

              <!-- Add Question Button -->
              <v-btn :disabled="!valid" color="primary" @click="addQuestion">
                Add Question
              </v-btn>

              <v-divider class="my-4"></v-divider>

              <!-- Poll Questions List -->
              <v-list>
                <v-list-item-group
                  v-for="(question, index) in pollArray"
                  :key="index"
                >
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ question.question }}</v-list-item-title>
                      <v-list-item-subtitle>Type: {{ question.type }}</v-list-item-subtitle>
                      <v-list-item-subtitle v-if="question.options.length">
                        Options: {{ getOptionDisplay(question.type, question.options) }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="question.correctResponse">
                        Correct Response: {{ question.correctResponse }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>

              <!-- Submit All Polls Button -->
              <v-btn :disabled="!valid" color="primary" @click="submitPolls">
                Submit All Polls
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useResourceStore } from "@/stores/patients";
import qstnIdGen from "../../../utilities/accessTokenGenerator";

const resourceStore = useResourceStore();
const pollTypes = [
  "Single Choice",
  "Multiple Choice",
  "Ranking",
  "Open-Ended",
  "Rating",
];

const rules = {
  required: (value) => !!value || "Required field",
  correctResponse: (value) =>
    ["Single Choice", "Multiple Choice"].includes(currentlyCreatingPollItem.type)
      ? !!value || "Required field"
      : undefined, // Only required for specific types
};

const questionId = ref(qstnIdGen(12));
const currentlyCreatingPollItem = reactive({
  question: "",
  type: "",
  correctResponse: "",
  qstId: questionId,
  options: [],
  responses: [],
});

const pollArray = ref([]);

const valid = ref(false);
const newOption = ref("");
const formRef = ref(null);

const handlePaste = (event) => {
  // Get pasted data
  const pasteData = event.clipboardData.getData('text');
  // Parse and update options
  currentlyCreatingPollItem.options = pasteData
    .split('#')
    .map(option => option.trim())
    .filter(option => option.length > 0); // Ensure no empty options are added
  // Prevent default paste action
  event.preventDefault();
};

const parseOptions = () => {
  if (newOption.value) {
    currentlyCreatingPollItem.options = newOption.value
      .split('#')
      .map(option => option.trim())
      .filter(option => option.length > 0); // Ensure no empty options are added
    newOption.value = ""; // Clear input field after parsing
  }
};

const addQuestion = () => {
  if (formRef.value.validate()) {
    pollArray.value.push({ ...currentlyCreatingPollItem }); // Spread to avoid reference Consultations
    currentlyCreatingPollItem.question = "";
    currentlyCreatingPollItem.type = "";
    questionId.value = qstnIdGen(12);
    currentlyCreatingPollItem.options = [];
    currentlyCreatingPollItem.correctResponse = ""; // Reset correct response
    formRef.value.resetValidation(); // Reset validation
  }
};

const submitPolls = async () => {
  try {
    const paramsObjRaw = [
      {
        resourceId: resourceStore.resource.id,
        resourceContent: JSON.stringify({
          pollArray: pollArray.value,
          activeQuestion: {
            qstId: pollArray.value[0].qstId,
            type: pollArray.value.type,
          },
        }),
      },
    ];

    console.log({ paramsObjRaw });

    const resourceDetails = JSON.stringify(paramsObjRaw);
    await resourceStore.addResourceFormContent({ resourceDetails });
    window.location.reload();
  } catch (error) {
    console.error("Error submitting polls:", error);
  }
};

const getOptionDisplay = (type, options) => {
  switch (type) {
    case "Single Choice":
    case "Multiple Choice":
      return options.join(", ");
    case "Ranking":
      return options
        .map((option, index) => `${index + 1}. ${option}`)
        .join(", ");
    default:
      return options.join(", "); // For Open-Ended and Rating, just join the options
  }
};

const removeOption = (option) => {
  const index = currentlyCreatingPollItem.options.indexOf(option);
  if (index !== -1) {
    currentlyCreatingPollItem.options.splice(index, 1);
  }
};
</script>
