<template>
    <v-container v-if="question !== null">
        <v-row>
            <v-col>
                <!-- Display the fetched question -->
                <h2>{{ question.text }}</h2>
                <!-- Render draggable list of options -->
                <draggable v-model="items">
                    <div v-for="(item) in items" :key="item">
                        <v-card class="mb-3">
                            <v-card-text>{{ item }}</v-card-text>
                        </v-card>
                    </div>
                </draggable>
                <v-btn @click="submitRanking">Submit Ranking</v-btn>
            </v-col>
        </v-row>

        <v-row>
            <!-- Display sorted items based on average rank -->
            <v-col v-for="(item) in sortedItems" :key="item.name">
                <v-card class="mb-3">
                    <v-card-text>{{ item.name }} (Avg Rank: {{ item.avgRank.toFixed(1) }})</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import draggable from 'vuedraggable';

interface Question {
    id: number;
    text: string;
    options: string[];
}

const question = ref<Question | null>(null);
const items = ref<string[]>([]);
const rankings = ref<string[][]>([]);

// Simulate fetching a question from a database
const fetchQuestion = async () => {
    // Simulated API call to fetch question data
    return new Promise<Question>((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                text: 'Rank the following items:',
                options: ['Item 1', 'Item 2', 'Item 3', 'Item 4']
            });
        }, 1000); // Simulate a 1-second delay
    });
};

const submitRanking = () => {
    rankings.value.push([...items.value]);
};

const totalRankings = computed(() => rankings.value.length);

const sortedItems = computed(() => {
    const itemRankSum: { [key: string]: number } = {};
    const itemCount: { [key: string]: number } = {};

    rankings.value.forEach(ranking => {
        ranking.forEach((item, index) => {
            if (!itemRankSum[item]) {
                itemRankSum[item] = 0;
                itemCount[item] = 0;
            }
            itemRankSum[item] += index + 1;
            itemCount[item]++;
        });
    });

    return items.value.map(item => ({
        name: item,
        avgRank: itemCount[item] ? itemRankSum[item] / itemCount[item] : 0
    })).sort((a, b) => a.avgRank - b.avgRank);
});

onMounted(async () => {
    const fetchedQuestion = await fetchQuestion();
    question.value = fetchedQuestion;
    items.value = fetchedQuestion.options;
});
</script>

<style scoped>
/* Add styling as needed */
</style>
