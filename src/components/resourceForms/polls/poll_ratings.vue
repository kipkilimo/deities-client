<template>
    <v-container v-if="question">
        <v-row>
            <v-col>
                <h2>{{ question.text }}</h2>
                <v-rating v-model="userRating" />
                <v-btn @click="submitRating">Submit Rating</v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <h3>Average Rating</h3>
                <v-rating :value="averageRating" readonly />
                <span>{{ averageRating.toFixed(1) }} / 5</span>
                <p>Total Votes: {{ totalVotes }}</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Question {
    id: number;
    text: string;
}

const userRating = ref<number>(0);
const ratings = ref<number[]>([]);
const question = ref<Question | null>(null);

// Simulate fetching data from a database
const fetchQuestion = async () => {
    // Simulated API call to fetch question data
    // In a real scenario, you would use something like axios or fetch to get data from a backend
    return new Promise<Question>((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                text: "How would you rate your experience?",
            });
        }, 1000); // Simulate a 1 second delay
    });
};

const submitRating = () => {
    if (userRating.value > 0) {
        ratings.value.push(userRating.value);
        userRating.value = 0;
    }
};

const totalVotes = computed(() => ratings.value.length);

const averageRating = computed(() => {
    if (totalVotes.value === 0) return 0;
    const sum = ratings.value.reduce((a, b) => a + b, 0);
    return sum / totalVotes.value;
});

onMounted(async () => {
    question.value = await fetchQuestion();
});
</script>
