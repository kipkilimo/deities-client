<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h3>{{ question?.text }}</h3>
            </v-col>
        </v-row>
        <v-radio-group v-model="selectedOption">
            <v-radio v-for="option in options" :key="option" :label="option" :value="option" />
        </v-radio-group>
        <v-btn @click="submitVote">Vote</v-btn>

        <v-row>
            <v-col v-for="option in options" :key="option">
                <v-progress-linear :value="optionPercentage(option)" color="blue">
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
    text: string;
    options: string[];
}

const question = ref<Question | null>(null);
const selectedOption = ref<string | null>(null);
const options = ref<string[]>([]);
const votes = ref<Record<string, number>>({});

const fetchQuestion = async () => {
    // Simulate an API call to fetch the question
    const fetchedQuestion = await new Promise<Question>((resolve) =>
        setTimeout(() => {
            resolve({
                text: 'What is your favorite color?',
                options: ['Red', 'Green', 'Blue', 'Yellow'],
            });
        }, 1000)
    );

    question.value = fetchedQuestion;
    options.value = fetchedQuestion.options;

    // Initialize votes with zeros for each option
    fetchedQuestion.options.forEach(option => {
        votes.value[option] = 0;
    });
};

const submitVote = () => {
    if (selectedOption.value) {
        votes.value[selectedOption.value]++;
        selectedOption.value = null; // Reset the selection if desired
    }
};

const totalVotes = computed(() =>
    Object.values(votes.value).reduce((a, b) => a + b, 0)
);

const optionPercentage = (option: string): number => {
    return totalVotes.value > 0
        ? (votes.value[option] / totalVotes.value) * 100
        : 0;
};

onMounted(() => {
    fetchQuestion();
});
</script>
