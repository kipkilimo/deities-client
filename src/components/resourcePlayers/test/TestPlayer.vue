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
                      @click="answersStore.saveSCQAnswer, (scqSaved = true)"
                      class="mt-4"
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
                      @click="answersStore.saveMCQAnswer, (mcqSaved = true)"
                      :prepend-icon="
                        mcqSaved
                          ? 'mdi-book-check-outline'
                          : 'mdi-alert-outline'
                      "
                      :color="mcqSaved ? 'primary' : 'orange'"
                      class="mt-4"
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
                      @click="answersStore.saveATFAnswer, (atfSaved = true)"
                      class="mt-4"
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
                <v-card flat>
                  <v-card-title class="text-h6"
                    >ETF Questions Answer Input</v-card-title
                  >
                  <div>
                    <!-- Bind the ETFQuestions and handle answer updates -->
                    <ETFAnswersInput
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

                  <v-card-title class="text-h6"
                    >Submitted ETF String</v-card-title
                  >
                  <v-card-text>
                    {{ flattenedETFAnswers }}
                  </v-card-text>
                  <v-divider class="my-1"></v-divider>
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
                      @click="answersStore.saveETFAnswer, (etfSaved = true)"
                      class="mt-4"
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
                    v-model="userAnswers['VSAQ-' + index]"
                    :disabled="!showVSAQEditor"
                    @input="saveAnswer('VSAQ-' + index)"
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
                      >Expand Editor View</v-btn
                    >
                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="info"
                          icon="mdi-content-save-check-outline"
                          size="x-large"
                          @click="saveVSAQResponse"
                        ></v-btn>
                      </template>
                      <span>Save VSAQ Responses</span>
                    </v-tooltip>

                    <v-spacer />
                    <v-btn color="primary" @click="showVSAQUploader = true"
                      >Upload ANSWERS</v-btn
                    >

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
                    :disabled="!showSAQEditor"
                    v-model="userAnswers['SAQ-' + index]"
                    @input="saveAnswer('SAQ-' + index)"
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
                      >Expand Editor View</v-btn
                    >
                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="info"
                          icon="mdi-content-save-check-outline"
                          size="x-large"
                          @click="saveSAQInput"
                        ></v-btn>
                      </template>
                      <span>Save SAQ Responses</span>
                    </v-tooltip>

                    <v-spacer />
                    <v-btn color="primary" @click="showSAQUploader = true"
                      >Upload ANSWERS</v-btn
                    >

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
                    :disabled="!showLEQEditor"
                    v-model="userAnswers['LEQ-' + index]"
                    @input="saveAnswer('LEQ-' + index)"
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
                      >Expand Editor View</v-btn
                    >
                    <v-spacer />
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="info"
                          icon="mdi-content-save-check-outline"
                          size="x-large"
                          @click="saveLEQInput"
                        ></v-btn>
                      </template>
                      <span>Save LEQ Responses</span>
                    </v-tooltip>

                    <v-spacer />
                    <v-btn color="primary" @click="showLEQUploader = true"
                      >Upload ANSWERS</v-btn
                    >

                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>
            </v-col>
          </v-row>
          <v-card-actions style="position: relative">
            <v-spacer /><v-btn variant="outlined" @click="submitAllAnswers"
              >End Exam & Submit</v-btn
            >
            <v-spacer />
          </v-card-actions>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog v-model="showVSAQUploader" max-width="24%">
      <v-card>
        <VSAQResponseFileUploader
          v-model="userFiles['VSAQ-' + index]"
          @change="saveAnswer('VSAQ-' + index)"
        />
      </v-card>
    </v-dialog>

    <v-dialog v-model="showVSAQEditor" max-width="85%" persistent>
      <v-card>
        <RichTextEditor
          v-model="userFiles['VSAQ-' + index]"
          @change="saveAnswer('VSAQ-' + index)"
        />
        <v-card-actions>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                width="15rem"
                color="primary"
                variant="outlined"
                @click="saveVSAQResponse"
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
        <SAQResponseFileUploader
          v-model="userFiles['SAQ-' + index]"
          @change="saveAnswer('SAQ-' + index)"
        />
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSAQEditor" max-width="85%" persistent>
      <v-card>
        <RichTextEditor
          v-model="userFiles['SAQ-' + index]"
          @change="saveAnswer('SAQ-' + index)"
        />
        <v-card-actions>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                width="15rem"
                color="primary"
                variant="outlined"
                @click="saveSAQResponse"
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
        <LEQResponseFileUploader
          v-model="userFiles['LEQ-' + index]"
          @change="saveAnswer('LEQ-' + index)"
        />
      </v-card>
    </v-dialog>

    <v-dialog v-model="showLEQEditor" max-width="85%" persistent>
      <v-card>
        <RichTextEditor
          v-model="userFiles['LEQ-' + index]"
          @change="saveAnswer('LEQ-' + index)"
        />
        <v-card-actions>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                width="15rem"
                color="primary"
                variant="outlined"
                @click="saveLEQResponse"
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
      <v-spacer /><v-btn variant="outlined" @click="submitAllAnswers"
        >End Exam & Submit</v-btn
      >
      <v-spacer />
    </v-card-actions>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
import RichTextEditor from "@/components/commonResourceCreateItems/formItems/RichTextEditor.vue";
import { useAnswersStore } from "@/stores/answers";

// Use Pinia store
const answersStore = useAnswersStore();

// Resource store and route handling
const resourceStore = useResourceStore();
const route = useRoute();
const sessionId = ref(route.query.sessionId || route.params.sessionId); // Fetch sessionId from query or params
const userId = ref(localStorage.getItem("sessionId")); // Retrieve userId from local storage
const showVSAQUploader = ref(false);
const showVSAQEditor = ref(false);
const scqSaved = ref(false);
const mcqSaved = ref(false);
const atfSaved = ref(false);
const etfSaved = ref(false);

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
const submitAllAnswers = async () => {
  try {
    const payload = {
      sessionId: sessionId.value,
      userId: userId.value,
      answers: userAnswers.value,
      files: userFiles.value,
    };

    const response = await axios.post(`${apiUrl}/submitExam`, payload);
    if (response.status === 200) {
      alert("Exam submitted successfully!");
    }
  } catch (error) {
    console.error("Error submitting exam:", error);
    alert("There was an error submitting your exam.");
  }
};
</script>
