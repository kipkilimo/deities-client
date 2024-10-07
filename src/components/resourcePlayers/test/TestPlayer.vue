<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <v-card style="height: 98vh; overflow-x: hidden !important">
          <vue-pdf-app
            :pdf="examUrl"
            :zoom="130"
            @open="openHandler"
          ></vue-pdf-app>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-container style="height: 98vh; overflow-x: hidden !important">
          <v-row>
            <v-col>
              <h3>Section A - Objective Questions</h3>

              <!-- SCQ Section -->
              <!-- Section for SCQ (Single Choice Questions) -->
              <div v-if="hasQuestionType('SCQ')">
                <div class="text-h5 font-weight-regular text-black">
                  Single Choice Questions (SCQ)
                </div>
                <v-card flat>
                  <div
                    v-for="(question, index) in SCQQuestions"
                    :key="'SCQ-' + index"
                    :style="{
                      backgroundColor: index % 2 === 0 ? '#dbdbdb' : 'white',
                      margin: '4px 0',
                    }"
                  >
                    <h4 class="ma-2 mr-6">
                      {{ question.questionText }} of {{ SCQQuestions.length }}
                    </h4>

                    <SCQAnswersInput
                      v-model="SCQAnswers[index]"
                      :options="question.options"
                      @click="scqSaved = false"
                    />

                    <v-divider class="my-2"></v-divider>
                  </div>
                  <!-- {{
                    getFirstNElements(
                      answersStore.SCQAnswers,
                      SCQQuestions.length
                    )
                  }} -->

                  <v-divider class="my-1"></v-divider>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      variant="outlined"
                      :prepend-icon="
                        scqSaved
                          ? 'mdi-book-check-outline'
                          : 'mdi-alert-outline'
                      "
                      :color="scqSaved ? 'primary' : 'orange'"
                      @click="saveAnswer(SCQAnswers, 'SCQ'), (scqSaved = true)"
                    >
                      {{ scqSaved ? "Saved SCQ Answers" : "Save SCQ Answers" }}
                    </v-btn>
                    <v-spacer /> <v-spacer /> <v-spacer /> <v-spacer />
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>

              <!-- MCQ Section -->
              <div v-if="hasQuestionType('MCQ')">
                <div class="text-h5 font-weight-regular text-black">
                  Multiple Choice Questions (MCQ)
                </div>
                <v-card flat>
                  <div
                    v-for="(question, index) in MCQQuestions"
                    :key="'MCQ-' + index"
                    :style="{
                      backgroundColor: index % 2 === 0 ? '#dbdbdb' : 'white',
                      margin: '4px 0',
                    }"
                  >
                    <h4 class="ma-2 mr-6">
                      {{ question.questionText }} of {{ MCQQuestions.length }}
                    </h4>

                    <MCQAnswersInput
                      v-model="answersStore.MCQAnswers[index]"
                      :options="question.options"
                      @click="mcqSaved = false"
                    />

                    <v-divider class="my-2"></v-divider>
                  </div>

                  <v-divider class="my-1"></v-divider>

                  <!-- {{
                    getFirstNElements(
                      answersStore.MCQAnswers,
                      MCQQuestions.length
                    )
                      .map((answers) => answers.join(","))
                      .join(" # ")
                  }} -->

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      variant="outlined"
                      :prepend-icon="
                        mcqSaved
                          ? 'mdi-book-check-outline'
                          : 'mdi-alert-outline'
                      "
                      @click="saveAnswer(MCQAnswers, 'MCQ'), (mcqSaved = true)"
                      :color="mcqSaved ? 'primary' : 'orange'"
                    >
                      {{ mcqSaved ? "Saved MCQ Answers" : "Save MCQ Answers" }}
                    </v-btn>
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>

              <!-- ATF Section -->
              <div v-if="hasQuestionType('ATF')">
                <div class="text-h5 font-weight-regular text-black">
                  Abbreviated True / False (ATF)
                </div>
                <v-card flat>
                  <div
                    v-for="(question, index) in ATFQuestions"
                    :key="'ATF-' + index"
                    :style="{
                      backgroundColor: index % 2 === 0 ? '#dbdbdb' : 'white',
                      margin: '4px 0',
                    }"
                  >
                    <h4 class="ma-2 mr-6">
                      {{ question.questionText }} of {{ ATFQuestions.length }}
                    </h4>

                    <ATFAnswersInput
                      v-model="ATFAnswers[index]"
                      :options="question.options"
                      @click="atfSaved = false"
                    />

                    <v-divider class="my-2"></v-divider>
                  </div>
                  <!-- {{
                    getFirstNElements(
                      answersStore.ATFAnswers,
                      ATFQuestions.length
                    )
                  }} -->

                  <v-divider class="my-1"></v-divider>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      variant="outlined"
                      :prepend-icon="
                        atfSaved
                          ? 'mdi-book-check-outline'
                          : 'mdi-alert-outline'
                      "
                      :color="atfSaved ? 'primary' : 'orange'"
                      @click="saveAnswer(ATFAnswers, 'ATF'), (atfSaved = true)"
                    >
                      {{ atfSaved ? "Saved ATF Answers" : "Save ATF Answers" }}
                    </v-btn>
                    <v-spacer /> <v-spacer /> <v-spacer /> <v-spacer />
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>

              <!-- ETF Section -->
              <div v-if="hasQuestionType('ETF')">
                <div class="text-h5 font-weight-regular text-black">
                  Extended True / False (ETF)
                </div>
                <!-- Pass down questions and options to the child -->
                <v-card flat full-width>
                  <v-card-title class="text-h6"
                    >ETF Questions Answer Input</v-card-title
                  >
                  <div>
                    <!-- Bind the ETFQuestions and handle answer updates -->
                    <ETFAnswersInput
                      style="min-width: 100% !important"
                      :ETFQuestions="ETFQuestions"
                      @updateAnswers="handleAnswerUpdate"
                      @click="etfSaved = false"
                    />
                    <div>
                      <h4>Submitted Answers</h4>
                      <p>{{ answerString }}</p>
                    </div>
                  </div>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      variant="outlined"
                      :prepend-icon="
                        etfSaved
                          ? 'mdi-book-check-outline'
                          : 'mdi-alert-outline'
                      "
                      :color="etfSaved ? 'primary' : 'orange'"
                      @click="
                        saveAnswer(answerString, 'ETF'), (etfSaved = true)
                      "
                    >
                      {{ etfSaved ? "Saved ETF Answers" : "Save ETF Answers" }}
                    </v-btn>
                    <v-spacer /> <v-spacer /> <v-spacer /> <v-spacer />
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <h3>Section B - Subjective Questions</h3>
              <!-- VSAQ Section -->
              <div v-if="hasQuestionType('VSAQ')">
                <div class="text-h6 font-weight-bold text-black">
                  Very Short Answer Questions (VSAQ -
                  {{ numberOfQuestions.VSAQ }}
                  {{ numberOfQuestions.VSAQ > 1 ? "Questions" : "Question" }})
                </div>
                <v-card>
                  <RichTextEditor
                    :rules="richTextRules"
                    v-model="vsaqTypedResponseMini"
                    :disabled="!showVSAQEditor"
                    @input="vsaqSaved = false"
                    @click="vsaqSaved = false"
                    :style="{
                      maxHeight: '240px',
                      overflowY: 'auto',
                    }"
                  />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="outlined"
                      @click="showVSAQEditor = true"
                      prepend-icon="mdi-fullscreen"
                      >Expand Editor View</v-btn
                    >
                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          size="x-large"
                          class="mb-2"
                          :disabled="!isFormValid"
                          @click="
                            saveAnswer(vsaqTypedResponseMini, 'VSAQ'),
                              (vsaqSaved = true)
                          "
                          :prepend-icon="
                            vsaqSaved
                              ? 'mdi-book-check-outline'
                              : 'mdi-alert-outline'
                          "
                          :color="vsaqSaved ? 'primary' : 'orange'"
                        >
                        </v-btn>
                      </template>
                      <span>{{
                        vsaqSaved
                          ? "Saved VSAQ Responses"
                          : "Save VSAQ Responses"
                      }}</span>
                    </v-tooltip>

                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          prepend-icon="mdi-cloud-upload"
                          color="primary"
                          @click="showVSAQUploader = true"
                          >VSAQ</v-btn
                        >
                      </template>
                      <span>Upload very short answer responses</span>
                    </v-tooltip>

                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>

              <!-- SAQ Section -->
              <div v-if="hasQuestionType('SAQ')">
                <div class="text-h6 font-weight-bold text-black">
                  Short Answer Questions (SAQ - {{ numberOfQuestions.SAQ }}
                  {{ numberOfQuestions.SAQ > 1 ? "Questions" : "Question" }})
                </div>
                <v-card>
                  <RichTextEditor
                    :rules="richTextRules"
                    :disabled="!showSAQEditor"
                    v-model="saqTypedResponseMini"
                    @input="saqSaved = false"
                    @click="saqSaved = false"
                    :style="{
                      maxHeight: '240px',
                      overflowY: 'auto',
                    }"
                  />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="outlined"
                      @click="showSAQEditor = true"
                      prepend-icon="mdi-fullscreen"
                      >Expand Editor View</v-btn
                    >
                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          size="x-large"
                          class="mb-2"
                          @click="
                            saveAnswer(saqTypedResponseMini, 'SAQ'),
                              (saqSaved = true)
                          "
                          :disabled="!isFormValid"
                          :prepend-icon="
                            saqSaved
                              ? 'mdi-book-check-outline'
                              : 'mdi-alert-outline'
                          "
                          :color="saqSaved ? 'primary' : 'orange'"
                        >
                        </v-btn>
                      </template>
                      <span>{{
                        saqSaved ? "Saved SAQ Responses" : "Save SAQ Responses"
                      }}</span>
                    </v-tooltip>

                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          prepend-icon="mdi-cloud-upload"
                          color="primary"
                          @click="showSAQUploader = true"
                          >SAQ</v-btn
                        >
                      </template>
                      <span>Upload short answer responses</span>
                    </v-tooltip>

                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>

              <!-- LEQ Section -->
              <div v-if="hasQuestionType('LEQ')">
                <div class="text-h6 font-weight-bold text-black">
                  Long Essay Question (LEQ - {{ numberOfQuestions.LEQ }}
                  {{ numberOfQuestions.LEQ > 1 ? "Questions" : "Question" }})
                </div>
                <v-card>
                  <RichTextEditor
                    :rules="richTextRules"
                    :disabled="!showLEQEditor"
                    v-model="leqTypedResponseMini"
                    @input="leqSaved = false"
                    @click="leqSaved = false"
                    :style="{
                      maxHeight: '240px',
                      overflowY: 'auto',
                    }"
                  />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="outlined"
                      @click="showLEQEditor = true"
                      prepend-icon="mdi-fullscreen"
                      >Expand Editor View</v-btn
                    >
                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          size="x-large"
                          class="mb-2"
                          :disabled="!isFormValid"
                          @click="
                            saveAnswer(leqTypedResponseMini, 'LEQ'),
                              (leqSaved = true)
                          "
                          :prepend-icon="
                            leqSaved
                              ? 'mdi-book-check-outline'
                              : 'mdi-alert-outline'
                          "
                          :color="leqSaved ? 'primary' : 'orange'"
                        >
                        </v-btn>
                      </template>
                      <span>{{
                        leqSaved ? "Saved LEQ Responses" : "Save LEQ Responses"
                      }}</span>
                    </v-tooltip>

                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          prepend-icon="mdi-cloud-upload"
                          color="primary"
                          @click="showLEQUploader = true"
                          >LEQ</v-btn
                        >
                      </template>
                      <span>Upload long essay response</span>
                    </v-tooltip>

                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>
            </v-col>
          </v-row>
          <v-card-actions style="position: relative">
            <v-spacer /><v-btn
              :disabled="!allAnswersSaved"
              variant="outlined"
              @click="submitAllAnswers"
              >Close Exam & Exit</v-btn
            >
            <v-spacer />
          </v-card-actions>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog v-model="showVSAQUploader" max-width="24%">
      <v-card>
        <VSAQResponseFileUploader />
      </v-card>
    </v-dialog>

    <v-dialog v-model="showVSAQEditor" max-width="85%" persistent>
      <v-card>
        <RichTextEditor
          :rules="richTextRules"
          v-model="vsaqTypedResponse"
          @change="vsaqSaved = false"
          @click="vsaqSaved = false"
        />
        <v-card-actions>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                width="15rem"
                color="primary"
                :disabled="!isFormValid"
                variant="outlined"
                @click="
                  saveAnswer(vsaqTypedResponse, 'VSAQ'), (vsaqSaved = true)
                "
                >SAVE VSAQ RESPONSES</v-btn
              >
            </template>
            <span>Close Expanded VSAQ Editor</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="info"
                icon="mdi-location-exit"
                size="x-large"
                @click="showVSAQEditor = false"
              ></v-btn>
            </template>
            <span>Exit VSAQ editor</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSAQUploader" max-width="24%">
      <v-card>
        <SAQResponseFileUploader />
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSAQEditor" max-width="85%" persistent>
      <v-card>
        <RichTextEditor
          :rules="richTextRules"
          v-model="saqTypedResponse"
          @change="saqSaved = false"
          @click="saqSaved = false"
        />
        <v-card-actions>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                width="15rem"
                color="primary"
                variant="outlined"
                :disabled="!isFormValid"
                @click="saveAnswer(saqTypedResponse, 'SAQ'), (saqSaved = true)"
                >SAVE SAQ RESPONSES</v-btn
              >
            </template>
            <span>Close Expanded SAQ Editor</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="info"
                icon="mdi-location-exit"
                size="x-large"
                @click="showSAQEditor = false"
              ></v-btn>
            </template>
            <span>Exit SAQ editor</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showLEQUploader" max-width="24%">
      <v-card>
        <LEQResponseFileUploader />
      </v-card>
    </v-dialog>

    <v-dialog v-model="showLEQEditor" max-width="85%" persistent>
      <v-card>
        <RichTextEditor
          :rules="richTextRules"
          v-model="leqTypedResponse"
          @change="leqSaved = false"
          @click="leqSaved = false"
        />
        <v-card-actions>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                width="15rem"
                color="primary"
                variant="outlined"
                :disabled="!isFormValid"
                @click="saveAnswer(leqTypedResponse, 'LEQ'), (leqSaved = true)"
                >SAVE LEQ RESPONSES</v-btn
              >
            </template>
            <span>Close Expanded LEQ Editor</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="info"
                icon="mdi-location-exit"
                size="x-large"
                @click="showLEQEditor = false"
              ></v-btn>
            </template>
            <span>Exit LEQ editor</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-divider />
    <v-card-actions style="position: fixed">
      <v-spacer /><v-btn
        :disabled="!allAnswersSaved"
        variant="outlined"
        @click="submitAllAnswers"
        >Close Exam & Exit</v-btn
      >
      <v-spacer />
    </v-card-actions>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useResourceStore } from "@/stores/resources";
import axios from "axios";
import "vue3-pdf-app/dist/icons/main.css";
import VuePdfApp from "vue3-pdf-app";

// Import answer input components
import ATFAnswersInput from "./ATFAnswersInput.vue";
import ETFAnswersInput from "./ETFAnswersInput.vue";
import SCQAnswersInput from "./SCQAnswersInput.vue";
import MCQAnswersInput from "./MCQAnswersInput.vue";
import VSAQResponseFileUploader from "./VSAQResponseFileUploader.vue";
import SAQResponseFileUploader from "./SAQResponseFileUploader.vue";
import LEQResponseFileUploader from "./LEQResponseFileUploader.vue";
import { useAnswersStore } from "@/stores/answers";
const apiUrl = import.meta.env.VITE_BASE_URL;
const uploadProgress = ref(0);
const isUploadSuccessful = ref(false);
const error = ref(null);
const richTextRules = [
  (v) => v.length <= 5000 || "Maximum 5000 characters allowed.",
];

// Computed property to check if the input is valid
const isFormValid = computed(() => {
  return richTextRules.every((rule) => rule(typedTaskResponse.value) === true);
});
// Use Pinia store
const answersStore = useAnswersStore();

// Resource store and route handling
const resourceStore = useResourceStore();
const route = useRoute();
const sessionId = ref(route.query.sessionId || route.params.sessionId); // Fetch sessionId from query or params
const userId = ref(localStorage.getItem("sessionId")); // Retrieve userId from local storage
const showVSAQUploader = ref(false);
const showVSAQEditor = ref(false);
const uploading = ref(false);

const scqSaved = ref(false);
const mcqSaved = ref(false);
const atfSaved = ref(false);
const etfSaved = ref(false);
const vsaqSaved = ref(false);
const saqSaved = ref(false);
const leqSaved = ref(false);

const vsaqTypedResponseMini = ref("Clear and add your VSAQ response here");
const saqTypedResponseMini = ref("Clear and add your SAQ response here");
const leqTypedResponseMini = ref("Clear and add your LEQ response here");

const vsaqTypedResponse = ref("Clear and add your VSAQ response here");
const saqTypedResponse = ref("Clear and add your SAQ response here");
const leqTypedResponse = ref("Clear and add your LEQ response here");

const showSAQUploader = ref(false);
const showSAQEditor = ref(false);

const showLEQUploader = ref(false);
const showLEQEditor = ref(false);

const examUrl = ref("");
const questionTypes = ref([]); // Holds the question metadata
const userAnswers = ref({}); // Store user answers
const userFiles = ref({}); // Store file uploads

// Get the exam meta info
const currentExamDetails = JSON.parse(resourceStore.exam);
const examMetaInfo = currentExamDetails.examMetaInfo;
const numberOfQuestions = examMetaInfo.numberOfQuestions;
const selectedOptions = ref([]);
// Props

const props = defineProps({
  question: Object,
  qIndex: Number,
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: Array,
  questionIndex: {
    type: Number,
    required: true,
  },
});
const SCQQuestions = ref([]);
const MCQQuestions = ref([]);
const ATFQuestions = ref([]);
const ETFQuestions = ref([]);
// Helper method to check if a question type exists
const hasQuestionType = (type) => {
  return questionTypes.value.some((question) => question.testType === type);
};

// Save answer to localStorage
// Access SCQ answers from the store
const SCQAnswers = computed(() => answersStore.SCQAnswers);
const MCQAnswers = computed(() => answersStore.MCQAnswers);
const ATFAnswers = computed(() => answersStore.ATFAnswers);
const ETFAnswers = computed(() => answersStore.ETFAnswers);
const flattenedETFAnswers = ref(""); // Flattened string of answers

// Method to update flattenedETFAnswers whenever ETFAnswers changes
// State for tracking selected answers

// State to display the formatted answer string
const answerString = ref("");

// Method to handle the emitted answer updates
const handleAnswerUpdate = (updatedAnswers) => {
  selectedAnswers.value = updatedAnswers;

  // Build the answer string for all questions separated by '#'
  answerString.value = selectedAnswers.value
    .map((questionAnswers) =>
      questionAnswers
        .map((answer) => {
          if (answer === 1) return "T";
          if (answer === 2) return "F";
          if (answer === 3) return "DK";
          return "";
        })
        .join("")
    )
    .join("#");

  console.log("Updated Answers:", answerString.value); // Logs the updated answer string
};
const saveETFResponse = () => {
  flattenAnswers();
  // Handle saving the response (e.g., send to server)
  console.log("Submitted ETF String:", flattenedETFAnswers.value);
};
// auto

// Save function
const autoSave = async (type, value) => {
  switch (type) {
    case "VSAQ":
      vsaqTypedResponse.value = value;
      vsaqTypedResponseMini.value = value;
      vsaqSaved.value = true;
      break;
    case "SAQ":
      saqTypedResponse.value = value;
      saqTypedResponseMini.value = value;

      saqSaved.value = true;
      break;
    case "LEQ":
      leqTypedResponse.value = value;
      leqTypedResponseMini.value = value;

      leqSaved.value = true;
      break;
    default:
      console.error("Invalid response type provided:", type);
      return; // Exit if the type is invalid
  }

  // Example: Call an API to save the response
  // axios.post('/api/save-response', { response: value }).then(() => {
  const bodyJSON = JSON.stringify({
    questionType: type,
    questionResponse: value,
    savedDate: Date.now(),
  });

  const url = `${apiUrl}/resources/uploads/exam/text?userId=${encodeURIComponent(userId.value)}&sessionId=${encodeURIComponent(sessionId.value)}`;

  try {
    uploading.value = true;
    uploadProgress.value = 0;
    const response = await axios.post(url, bodyJSON, {
      headers: {
        "Content-Type": "application/json", // Ensure the content type is JSON
      },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total || 1; // Fallback to 1 to avoid division by zero
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / total);
      },
    });

    if (response.status === 200) {
      isUploadSuccessful.value = true;
      error.value = null;
    }
  } catch (err) {
    error.value = "Failed to upload files. Please try again.";
    console.error("Error uploading files:", err);
  } finally {
    uploading.value = false;
  }
  //   saved.value = true;
  // });
};

// Function to handle saving after debounce
const createDebouncedWatcher = (typedResponseRef, savedRef, type) => {
  let saveTimeout = null;

  watch(typedResponseRef, (newVal) => {
    clearTimeout(saveTimeout); // Clear any previous timeout

    // Set up a new timeout to auto-save after 3.6 seconds
    saveTimeout = setTimeout(() => {
      autoSave(type, newVal);
    }, 5600); // 3600 milliseconds = 3.6 seconds
  });
};

// Create debounced watchers for each typed response
createDebouncedWatcher(vsaqTypedResponseMini, vsaqSaved, "VSAQ");
createDebouncedWatcher(saqTypedResponseMini, saqSaved, "SAQ");
createDebouncedWatcher(leqTypedResponseMini, leqSaved, "LEQ");

createDebouncedWatcher(vsaqTypedResponse, vsaqSaved, "VSAQ");
createDebouncedWatcher(saqTypedResponse, saqSaved, "SAQ");
createDebouncedWatcher(leqTypedResponse, leqSaved, "LEQ");

const saveAnswer = async (data, type) => {
  // Handle saving the response (e.g., send to server)
  console.log("Submitted Section B response:", data, type);

  // Set the analogous typed responses based on the `type`
  switch (type) {
    case "VSAQ":
      vsaqTypedResponse.value = data;
      vsaqTypedResponseMini.value = data;
      break;
    case "SAQ":
      saqTypedResponse.value = data;
      saqTypedResponseMini.value = data;
      break;
    case "LEQ":
      leqTypedResponse.value = data;
      leqTypedResponseMini.value = data;
      break;
    default:
      console.error("Invalid response type provided:", type);
      return; // Exit if the type is invalid
  }

  const bodyJSON = JSON.stringify({
    questionType: type,
    questionResponse: data,
    savedDate: Date.now(),
  });

  const url = `${apiUrl}/resources/uploads/exam/text?userId=${encodeURIComponent(userId.value)}&sessionId=${encodeURIComponent(sessionId.value)}`;

  try {
    uploading.value = true;
    uploadProgress.value = 0;
    const response = await axios.post(url, bodyJSON, {
      headers: {
        "Content-Type": "application/json", // Ensure the content type is JSON
      },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total || 1; // Fallback to 1 to avoid division by zero
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / total);
      },
    });

    if (response.status === 200) {
      isUploadSuccessful.value = true;
      error.value = null;
    }
  } catch (err) {
    error.value = "Failed to upload files. Please try again.";
    console.error("Error uploading files:", err);
  } finally {
    uploading.value = false;
  }
};

onMounted(() => {
  // Initialize selectedOptions as an empty array for each question
  ETFQuestions.value.forEach(() => {
    selectedOptions.value.push([]);
  });
});
// Mock questions or fetch from a store/resource
const initializeQuestions = () => {
  // Initialize SCQ questions (Single Choice Questions)
  for (let i = 0; i < Number(numberOfQuestions.SCQ); i++) {
    SCQQuestions.value.push({
      questionText: `SCQ Question ${i + 1}`,
      options: [
        { label: "A" },
        { label: "B" },
        { label: "C" },
        { label: "D" },
        { label: "E" },
      ],
    });
    answersStore.SCQAnswers.push(null); // Initialize with null for single-select answers
  }

  // Initialize MCQ questions (Multiple Choice Questions)
  for (let i = 0; i < Number(numberOfQuestions.MCQ); i++) {
    MCQQuestions.value.push({
      questionText: `MCQ Question ${i + 1}`,
      options: [
        { label: "A" },
        { label: "B" },
        { label: "C" },
        { label: "D" },
        { label: "E" },
      ],
    });
    answersStore.MCQAnswers.push([]); // Initialize with empty arrays for multiple-select answers
  }

  // Initialize ATF questions (All True/False Questions)
  for (let i = 0; i < Number(numberOfQuestions.ATF); i++) {
    ATFQuestions.value.push({
      questionText: `TF Question ${i + 1}`,
      options: [{ label: "TRUE" }, { label: "FALSE" }],
    });
    answersStore.ATFAnswers.push(null); // Initialize with null for true/false answers
  }

  // Initialize ETF questions (Each True/False Questions)
  for (let i = 0; i < Number(numberOfQuestions.ETF); i++) {
    // Create an array of sub-options labeled A-E
    const subOptions = ["A", "B", "C", "D", "E"].map((label) => ({
      label: label,
    }));

    // Add each question with sub-options to the ETFQuestions array
    ETFQuestions.value.push({
      questionText: `ETF Question ${i + 1}`, // Dynamic question text
      id: `${i + 1}`,
      options: ["A", "B", "C", "D", "E"],
    });

    // Initialize the corresponding answers for this question with empty arrays
    answersStore.ETFAnswers.push(Array(subOptions.length).fill(null)); // Array for A-E answers
  }
};
// Function to process and save ETF answers

// On mount, fetch the exam details
onMounted(async () => {
  await initializeQuestions();
  // Get the current exam details
  const currentExamDetailsRaw = JSON.parse(resourceStore.exam);

  // Function to extract the exam URL
  function getExamSetUrl(examInfo) {
    if (examInfo.examMetaInfo && examInfo.examMetaInfo.examQuestionsSet) {
      return examInfo.examMetaInfo.examQuestionsSet[0];
    }
    return null;
  }

  // Set exam URL
  examUrl.value = getExamSetUrl(currentExamDetailsRaw);

  // Set question types metadata
  questionTypes.value = currentExamDetailsRaw.examMetaInfo.testMeta;

  // Load existing answers from localStorage
  const storedAnswers = JSON.parse(
    localStorage.getItem(sessionId.value + "_answers") || "{}"
  );
  userAnswers.value = storedAnswers;
});

function saveSCQResponse() {
  console.log(1);
}

const emit = defineEmits(["update:modelValue"]);

const selectedAnswers = ref([...props.modelValue]);
const selectedETFAnswers = ref([...props.modelValue]);

const updateSelectedAnswers = (value) => {
  selectedAnswers.value = value;
  emit("update:modelValue", selectedAnswers.value);
  answersStore.setMCQAnswer(props.questionIndex, selectedAnswers.value);
};

watch(
  () => props.modelValue,
  (newValue) => {
    selectedAnswers.value = Array.isArray(newValue) ? [...newValue] : [];
  }
);

// Submit all answers to the database when the exam session ends
const allAnswersSaved = computed(() => {
  return (
    scqSaved.value &&
    mcqSaved.value &&
    atfSaved.value &&
    etfSaved.value &&
    vsaqSaved.value &&
    saqSaved.value &&
    leqSaved.value
  );
});
const submitAllAnswers = async () => {
  try {
    // Your submit logic here, if any
    // For example, await sending data to the server

    // Clear local storage
    localStorage.clear();

    // Navigate to '/' and force a full page reload
    window.location.href = "/";
  } catch (error) {
    console.error("Error submitting answers:", error);
    // Handle errors if necessary
  }
};
</script>
