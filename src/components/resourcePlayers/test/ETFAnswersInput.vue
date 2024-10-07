<template>
  <v-card-text>
    <!-- Generate the table for each question -->
    <div v-for="(question, qIndex) in ETFQuestions" :key="qIndex">
      <h3>ETF Question {{ qIndex + 1 }}  of {{ ETFQuestions.length }}</h3>
      <v-table class="striped-table" style="min-width:100% !important;">
        <thead>
          <tr>
            <th>Options</th>
            <th>TRUE</th>
            <th>FALSE</th>
            <th>DON'T KNOW</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(option, index) in question.options" :key="index" :class="{ 'striped': index % 2 === 0 }">
            <td>{{ option }}</td>
            <td>
              <v-radio
                :value="1"
                v-model="selectedOptions[qIndex][index]"
                @change="updateSelectedOption(qIndex, index, 1)"
                hide-details
              ></v-radio>
            </td>
            <td>
              <v-radio
                :value="2"
                v-model="selectedOptions[qIndex][index]"
                @change="updateSelectedOption(qIndex, index, 2)"
                hide-details
              ></v-radio>
            </td>
            <td>
              <v-radio
                :value="3"
                v-model="selectedOptions[qIndex][index]"
                @change="updateSelectedOption(qIndex, index, 3)"
                hide-details
              ></v-radio>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-card-text>
</template>

<script setup>
import { reactive } from "vue";

// Props
const props = defineProps({
  ETFQuestions: Array, // List of questions passed from the parent
});

// Emit
const emit = defineEmits(['updateAnswers']);

// Initialize selected options as a reactive array of arrays for each question
const selectedOptions = reactive(props.ETFQuestions.map(() => []));

// Method to update selected option
const updateSelectedOption = (qIndex, index, value) => {
  selectedOptions[qIndex][index] = value;
  emit('updateAnswers', selectedOptions); // Emit the updated answers to parent
};
</script>

<style scoped>
.striped-table {
  width: 75%;
  border-collapse: collapse; /* Ensures borders are collapsed */
}

.striped-table tbody tr.striped {
  background-color: #dbdbdb !important; /* Light grey for even rows */
}

.striped-table th {
  background-color: #f8f8f8; /* Change header background */
  color: rgb(61, 58, 58); /* Change header text color */
}

.striped-table th, .striped-table td {
  padding: 5px; /* Add padding for better spacing */
  text-align: left; /* Align text to the left */
}
</style>
