<template>
  <v-chip-group
    v-model="selectedAnswers"
    column
    class="ma-4 mr-4 ml-9"
    :mandatory="true"
    multiple
    active-class="primary--text"
    active-color="primary"
  >
    <v-chip
      v-for="(option, oIndex) in options"
      :key="oIndex"
      :value="option.label"
      outlined
      rounded="xl"
      size="x-large"
      color="primary"
    >
      {{ option.label }}  </v-chip>
  </v-chip-group>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

// Define props and emits
const props = defineProps({
  modelValue: Array,       // Bind v-model value to selected answers (array)
  options: Array,           // Array of options with { label: 'A', ... }
});

const emit = defineEmits(['update:modelValue']);

// Local state for selected answers (array)
const selectedAnswers = ref([...props.modelValue]);

// Watch for changes in selectedAnswers and emit the updated value
watch(selectedAnswers, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>