<template>
    <v-container>
        <!-- Display the question text -->
        <h2>{{ question?.text }}</h2>

        <!-- Display the options dynamically -->
        <v-radio-group v-model="selectedOption">
            <v-radio v-for="option in question?.options" :key="option" :label="option" :value="option" />
        </v-radio-group>

        <!-- Button to submit the selected vote -->
        <v-btn @click="submitVote">Vote</v-btn>

        <!-- Display results -->
        <v-row>
            <v-col v-for="option in question?.options" :key="option">
                <v-progress-linear :value="optionPercentage(option)" :color="option === 'Yes' ? 'green' : 'red'">
                    <template v-slot:default>
                        <span>{{ option }}: {{ optionPercentage(option).toFixed(1) }}%</span>
                    </template>
                </v-progress-linear>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Question {
    id: number;
    text: string;
    options: string[];
}

const selectedOption = ref<string | null>(null);
const votes = ref<Record<string, number>>({});
const question = ref<Question | null>(null);

// Simulate fetching data from a database
const fetchQuestion = async () => {
    // Simulated API call to fetch question data
    // Replace this with your actual API call
    return new Promise<Question>((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                text: "Do you like Vue.js?",
                options: ['Yes', 'No']
            });
        }, 1000); // Simulate a 1 second delay
    });
};

// Submit the selected vote
const submitVote = () => {
    if (selectedOption.value && question.value) {
        if (!votes.value[selectedOption.value]) {
            votes.value[selectedOption.value] = 0;
        }
        votes.value[selectedOption.value]++;
        selectedOption.value = null; // Optionally reset after voting
    }
};

// Compute total number of votes
const totalVotes = computed(() =>
    Object.values(votes.value).reduce((a, b) => a + b, 0)
);

// Compute percentage of votes for an option
const optionPercentage = (option: string): number => {
    return totalVotes.value > 0
        ? (votes.value[option] / totalVotes.value) * 100
        : 0;
};

// Fetch question on component mount
onMounted(async () => {
    question.value = await fetchQuestion();
});
</script>
