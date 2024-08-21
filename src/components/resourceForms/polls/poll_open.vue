<template>
    <v-container>
        <!-- Display the fetched question -->
        <v-row>
            <v-col>
                <h2>{{ question?.text }}</h2>
                <v-select v-model="selectedOption" :items="question?.options" label="Select an option"
                    item-value="value" item-text="text" />
            </v-col>
        </v-row>

        <!-- User response section -->
        <v-row>
            <v-col>
                <v-textarea v-model="userResponse" label="Your Response" />
                <v-btn @click="submitResponse">Submit</v-btn>
            </v-col>
        </v-row>

        <!-- Display responses -->
        <v-row>
            <v-col v-for="(response, index) in responses" :key="index">
                <v-card class="mb-3">
                    <v-card-text>{{ response }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import { AxiosResponse } from 'axios';
import axios from 'axios';
// Define types for the question
interface Option {
    value: string;
    text: string;
}

interface Question {
    text: string;
    options: Option[];
}


const question = ref<Question | null>(null);
const userResponse = ref<string>('');
const responses = ref<string[]>([]);
const selectedOption = ref<string | null>(null);

// Simulate fetching question from the database
const fetchQuestion = async () => {
    try {
        const response = await axios.get('/api/question'); // Replace with your API endpoint
        question.value = response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
    }
};

const submitResponse = () => {
    if (userResponse.value.trim()) {
        responses.value.push(userResponse.value.trim());
        userResponse.value = '';
    }
};

onMounted(() => {
    fetchQuestion();
});
</script>
