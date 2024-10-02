import { defineStore } from "pinia";
import { ref } from "vue";

export const useAnswersStore = defineStore("answers", () => {
  // State for different question types
  const SCQAnswers = ref<Array<string | null>>([]); // Single Choice Questions
  const MCQAnswers = ref<Array<Array<string | null>>>([]); // Multiple Choice Questions
  const ATFAnswers = ref<Array<string | null>>([]); // All True/False Questions
  const ETFAnswers = ref<Array<Array<string | null>>>([]); // Each True/False Questions

  // Utility function to load answers from local storage
  const loadFromLocalStorage = (
    key: string,
    parser: (value: string) => any
  ) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? parser(storedValue) : [];
  };

  // Load answers from local storage on initialization
  const loadAnswersFromLocalStorage = () => {
    SCQAnswers.value = loadFromLocalStorage("SCQAnswers", (value) =>
      value.split("")
    );
    MCQAnswers.value = loadFromLocalStorage("MCQAnswers", (value) =>
      value.split("#").map((str) => str.split(""))
    );
    ATFAnswers.value = loadFromLocalStorage("ATFAnswers", (value) =>
      value.split("")
    );
    ETFAnswers.value = loadFromLocalStorage("ETFAnswers", (value) =>
      value.split("#").map((str) => str.split(""))
    );
  };

  // Utility function to save a specific answer to local storage
  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, value);
  };

  // Method to save each answer separately
  const saveSCQAnswer = (index: number) => {
    saveToLocalStorage("SCQAnswers", SCQAnswers.value.join(""));
  };

  const saveMCQAnswer = (index: number) => {
    const flattenedAnswers = MCQAnswers.value
      .map((answers) => answers.join(","))
      .join(" # ");
    saveToLocalStorage("SCQAnswers", flattenedAnswers);
  };

  const saveATFAnswer = (index: number) => {
    saveToLocalStorage("ATFAnswers", ATFAnswers.value.join(""));
  };

  const saveETFAnswer = (index: number) => {
    saveToLocalStorage(
      "ETFAnswers",
      ETFAnswers.value.map((group) => group.join("")).join("#")
    );
  };

  // Initialize by loading answers from local storage
  loadAnswersFromLocalStorage();

  // Methods to manage specific types of answers
  const setSCQAnswer = (index: number, answer: string | null) => {
    SCQAnswers.value[index] = answer;
    saveSCQAnswer(index); // Save immediately on change
  };

  const setMCQAnswer = (questionIndex: string | number, answers: any) => {
    // @ts-ignore
    MCQAnswers.value[questionIndex] = answers;
  };
  const setATFAnswer = (index: number, answer: string | null) => {
    ATFAnswers.value[index] = answer;
    saveATFAnswer(index); // Save immediately on change
  };

  const setETFAnswer = (index: number, answer: Array<string | null>) => {
    ETFAnswers.value[index] = answer;
    saveETFAnswer(index); // Save immediately on change
  };

  return {
    SCQAnswers,
    MCQAnswers,
    ATFAnswers,
    ETFAnswers,
    saveSCQAnswer,
    saveMCQAnswer,
    saveATFAnswer,
    saveETFAnswer,
    loadAnswersFromLocalStorage,
    setSCQAnswer,
    setMCQAnswer,
    setATFAnswer,
    setETFAnswer,
  };
});
