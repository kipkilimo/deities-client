<template>
    <div>
        <v-col class="text-left mt-4" cols="12">
            <h3>Select your favorite deity (To build your username!)</h3>
        </v-col>
        <v-row>
            <v-col cols="9">
                <input type="text" v-model="filterByLocality" placeholder="Filter by Locality" @input="applyFilter" />
            </v-col> <v-col cols="3">

                <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn color="info" @click="filteredDeities = deities, filterByLocality = ''" v-bind="props"
                            density="compact" icon="mdi-refresh">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </template>
                    <span>Clear filters</span>
                </v-tooltip>

            </v-col>
        </v-row>


        <select v-model="sortBy" @change="applySort">
            <option value="name">Name (A-Z)</option>
            <option value="locality">Locality</option>
            <option value="favs">Favs (High-Low)</option>
        </select>
        <div v-if="filteredDeities.length">
            <v-card class="fixed-height" max-height="15rem">

                <div v-if="filteredDeities.length" dense>

                    <v-chip size="large" v-for="deity in filteredDeities" :key="deity.id" color="lime" rounded
                        variant="outlined" class="chip" @click="handleChipClick(deity)">
                        {{ deity.name }} {{ deity.locality }} - Favs: {{ deity.favs }}
                    </v-chip>

                </div>
            </v-card>
        </div>
        <p v-else>No deities found.</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { onMounted } from 'vue';
import { useDeityStore } from '../../stores/deities';
import { storeToRefs } from 'pinia';
// Define interface for Deity
interface Deity {
    name: string;
    locality: string;
    parents: string[];
    description: string;
    siblings: string[];
    domain: string;
    gallery: string[];
    favs: number;
    rating: number;
    shared: number;
    children: string[];
    isMortal: boolean;
    id?: string; // Add optional id field
}
const filteredDeities = ref<Deity[]>([]); // Array of filtered deities
const filterByLocality = ref<string>(''); // Filter by locality
const deityStore = useDeityStore();
const { deities } = storeToRefs(deityStore);
const { fetchDeityNames, setDeities, sortDeities, filterDeities } = deityStore;
const sortBy = ref<keyof Deity>('name'); // Sorting criteria

import { useUserStore } from "../../stores/users";

const userStore = useUserStore();
function handleChipClick(deity) {
    userStore.username = deity.name
}
onMounted(async () => {
    await fetchDeityNames();
    setDeities(deities.value);
    applyFilter();
    applySort();
});

const applyFilter = () => {
    const filtered = deities.value.filter(deity =>
        deity.locality.toLowerCase().includes(filterByLocality.value.toLowerCase())
    );

    filteredDeities.value = filtered.sort((a, b) => {
        return (a[sortBy.value] ?? 0) - (b[sortBy.value] ?? 0);
    });
};


const applySort = () => {
    const sorted = [...filteredDeities.value].sort((a, b) => {
        if (sortBy.value === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy.value === 'locality') {
            return a.locality.localeCompare(b.locality);
        } else if (sortBy.value === 'favs') {
            return b.favs - a.favs;
        }
        return 0;
    });
    filteredDeities.value = sorted;
};

watch(filterByLocality, applyFilter);
watch(sortBy, applySort);
</script>

<style scoped>
  /* Add some styles for aesthetic if needed */
  input {
    margin-bottom: 10px;
    padding: 5px;
    width: 100%;
  }
  
  select {
    margin-bottom: 10px;
    padding: 5px;
    width: 100%;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }
  </style>
<style scoped>
.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Adjust gap between chips if needed */
  justify-content: center; /* Center chips horizontally */
}

.chip {
  border-radius: 16px; /* Make the chip rounded */
  cursor: pointer; /* Indicate that the chip is clickable */
  margin: 4px; /* Adjust margin as needed */
}
</style>
<style scoped>
.fixed-height {
  overflow-y: auto; /* Enable scrolling */
}
</style>