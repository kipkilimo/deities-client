<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <!-- Model Type Selection -->
      <v-select
        v-model="selectedModel"
        :items="modelOptions"
        label="Select Model Type"
        required
      ></v-select>

      <!-- Formula Field -->
      <v-text-field
        v-if="selectedModel"
        v-model="formula"
        label="Enter Formula"
        :placeholder="formulaPlaceholder"
        outlined
      ></v-text-field>

      <!-- Render dynamic fields -->
      <v-container>
        <v-row>
          <v-col v-for="(field, index) in formFields" :key="index">
            <v-text-field
              v-model="form[field.key]"
              :label="field.label"
              :type="field.type"
              :placeholder="field.placeholder"
              outlined
              required
            >
            </v-text-field>
            <v-btn @click="removeField(index)" color="red">Remove</v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- Button to add new fields -->
      <v-btn @click="addField" color="primary">Add Field</v-btn>
      <v-btn type="submit" color="success">Submit</v-btn>
    </v-form>

    <!-- Display results -->
    <v-alert v-if="score !== null" type="success">
      <p>Score: {{ score }}</p>
      <p>Feedback: {{ feedback }}</p>
    </v-alert>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Define the type of form fields
interface Field {
  label: string;
  key: string;
  type: string;
  placeholder?: string;
}

// Initialize state for form fields, form data, and model options
const formFields = ref<Field[]>([]);
const form = ref<{ [key: string]: any }>({});
const selectedModel = ref<string | null>(null);
const formula = ref<string>('');
const modelOptions = ref<string[]>(['Linear', 'Regression']);
const formulaPlaceholder = ref('Enter formula for selected model');

// Function to load fields from an external source (e.g., API)
const loadFields = async () => {
  try {
    const response = await axios.get<Field[]>('http://localhost:3000/fields'); // Endpoint to get dynamic fields
    formFields.value = response.data;

    // Initialize form data based on loaded fields
    form.value = formFields.value.reduce((acc: { [key: string]: any }, field: Field) => {
      acc[field.key] = ''; // Initialize each field's value
      return acc;
    }, {});
  } catch (error) {
    console.error('Error loading fields:', error);
  }
};

// Call loadFields on component mount
onMounted(() => {
  loadFields();
});

// Function to handle form submission
const submitForm = async () => {
  try {
    const response = await axios.post('http://localhost:3000/predict', {
      ...form.value,
      modelType: selectedModel.value,
      formula: formula.value
    });
    score.value = response.data.score;
    feedback.value = response.data.feedback;
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

// Function to add a new field (for demonstration, modify as needed)
const addField = () => {
  const newIndex = formFields.value.length;
  const newKey = `newField${newIndex}`;
  formFields.value.push({
    label: `New Field ${newIndex + 1}`,
    key: newKey,
    type: 'text',
    placeholder: `Enter value for new field ${newIndex + 1}`
  });
  form.value[newKey] = '';
};

// Function to remove a field
const removeField = (index: number) => {
  const keyToRemove = formFields.value[index].key;
  formFields.value.splice(index, 1);
  delete form.value[keyToRemove];
};

// States for score and feedback
const score = ref<number | null>(null);
const feedback = ref<string>('');
</script>
