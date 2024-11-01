<template>
  <!-- v-chip-group to render options and bind selected answer -->
  <v-chip-group
    v-model="selectedAnswer"
    column
    class="ma-4 mr-4 ml-9"
    :mandatory="true"
    active-class="primary--text"
    active-color="primary"
  >
    <!-- Loop through the options array passed as a prop -->
    <v-chip
      v-for="(option, oIndex) in options"
      :key="oIndex"
      :value="option.label"   
      outlined
      rounded="xl"
      size="x-large"
      color="primary"  
    
    >
      {{ option.label }}  <!-- Display the label inside the chip -->
    </v-chip>
  </v-chip-group>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

// Define props and emits
const props = defineProps({
  modelValue: String,       // Bind v-model value to selected answer
  options: Array,           // Array of options with { label: 'A', ... }
});

const emit = defineEmits(['update:modelValue']);

// Local state for selected answer
const selectedAnswer = ref(props.modelValue);

// Watch for changes in selectedAnswer and emit the updated value
watch(selectedAnswer, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
