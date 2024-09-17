<template>
  <v-form v-model="isFormValid" @submit.prevent="handleSubmit">
    <v-stepper v-model="currentStep" linear>
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1"
          >Event Details</v-stepper-step
        >
        <v-stepper-step :complete="currentStep > 2" step="2"
          >Event Schedule</v-stepper-step
        >
        <v-stepper-step :complete="currentStep > 3" step="3"
          >Speakers & Facilitators</v-stepper-step
        >
        <v-stepper-step :complete="currentStep > 4" step="4"
          >Registration & Budget</v-stepper-step
        >
        <v-stepper-step :complete="currentStep > 5" step="5"
          >Additional Information</v-stepper-step
        >
      </v-stepper-header>

      <v-stepper-items>
        <!-- Step 1: Event Details -->
        <v-stepper-content step="1" v-if="currentStep === 1">
          <v-text-field
            label="Event Name"
            v-model="event.event_name"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-select
            label="Event Type"
            v-model="event.event_type"
            :items="eventTypes"
            :rules="[rules.required]"
            required
          ></v-select>
          <v-textarea
            label="Description"
            v-model="event.description" 
            required
          ></v-textarea>
          <v-text-field
            label="Target Audience"
            v-model="event.target_audience" 
            required
          ></v-text-field>
          <v-btn @click="nextStep" :disabled="!isStepValid(1)">Next</v-btn>
        </v-stepper-content>

        <!-- Step 2: Event Schedule -->
        <v-stepper-content step="2" v-if="currentStep === 2">
          <v-text-field
            label="Start Date & Time"
            v-model="event.date_and_time.start"
            :prepend-icon="'mdi-calendar-today'"
            type="datetime-local" 
            required
          ></v-text-field>
          <v-text-field
            label="End Date & Time"
            v-model="event.date_and_time.end"
            :prepend-icon="'mdi-calendar-today'"
            type="datetime-local" 
            required
          ></v-text-field>
          <v-text-field
            label="Location"
            v-model="event.location" 
            required
          ></v-text-field>
          <v-btn @click="prevStep" class="mr-4">Previous</v-btn>
          <v-btn @click="nextStep" :disabled="!isStepValid(2)">Next</v-btn>
        </v-stepper-content>

        <!-- Step 3: Speakers & Facilitators -->
        <v-stepper-content step="3" v-if="currentStep === 3">
          <v-text-field
            label="Keynote Speaker Name"
            v-model="event.keynote_speakers[0].name" 
            required
          ></v-text-field>
          <v-text-field
            label="Keynote Speaker Affiliation"
            v-model="event.keynote_speakers[0].affiliation" 
            required
          ></v-text-field>
          <v-text-field
            label="Keynote Speaker Expertise"
            v-model="event.keynote_speakers[0].expertise" 
            required
          ></v-text-field>
          <v-text-field
            label="Workshop Facilitator Name"
            v-model="event.workshop_facilitators[0].name" 
            required
          ></v-text-field>
          <v-text-field
            label="Workshop Facilitator Affiliation"
            v-model="event.workshop_facilitators[0].affiliation" 
            required
          ></v-text-field>
          <v-text-field
            label="Workshop Facilitator Expertise"
            v-model="event.workshop_facilitators[0].expertise" 
            required
          ></v-text-field>
          <v-btn @click="prevStep" class="mr-4">Previous</v-btn>
          <v-btn @click="nextStep" :disabled="!isStepValid(3)">Next</v-btn>
        </v-stepper-content>

        <!-- Step 4: Registration & Budget -->
        <v-stepper-content step="4" v-if="currentStep === 4">
          <v-text-field
            label="Registration Fee"
            v-model="event.registration.fee"
            type="number" 
            required
          ></v-text-field>
          <v-text-field
            label="Registration Deadline"
            v-model="event.registration.deadline"
            :prepend-icon="'mdi-calendar-today'"
            type="date" 
            required
          ></v-text-field>
          <v-combobox
            v-model="event.registration.payment_methods"
            label="Payment Methods"
            :items="paymentMethods"
            multiple
            chips
            clearable 
            required
          ></v-combobox>
          <v-text-field
            label="Registration Link"
            v-model="event.registration.registration_link" 
            required
          ></v-text-field>
          <v-btn @click="prevStep" class="mr-4">Previous</v-btn>
          <v-btn @click="nextStep" :disabled="!isStepValid(4)">Next</v-btn>
        </v-stepper-content>

        <!-- Step 5: Additional Information -->
        <v-stepper-content step="5" v-if="currentStep === 5">
          <v-combobox
            v-model="event.networking_events"
            label="Networking Events"
            multiple
            chips
            clearable 
            required
          ></v-combobox>
          <v-combobox
            v-model="event.accessibility.features"
            label="Accessibility Features"
            multiple
            chips
            clearable
            :items="accessibilityFeatures" 
            required
          ></v-combobox>
          <v-btn @click="prevStep" class="mr-4">Previous</v-btn>
          <v-btn type="submit" :disabled="!isFormValid">Submit Event</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";
import { useResourceStore } from "../../../stores/resources"; // Replace with actual path

const resourceStore = useResourceStore();
// Stepper and form state
const isFormValid = ref(false);
const currentStep = ref(1);

// Reference to start date and time
const startDateTime = ref(new Date(Date.now() + 7 * 86400000));

// Event form data
const event = ref({
  event_name: "",
  event_type: "",
  description: "",
  date_and_time: { start: startDateTime, end: startDateTime.value },
  location: "",
  target_audience: "",
  keynote_speakers: [{ name: "", affiliation: "", expertise: "" }],
  workshop_facilitators: [{ name: "", affiliation: "", expertise: "" }],
  registration: {
    fee: "0",
    deadline: new Date(Date.now() + 7 * 86400000 * 3),
    payment_methods: [],
    registration_link: "",
  },
  networking_events: [],
  accessibility: { features: [] },
});

// Watcher for start date and time
watch(
  () => event.value.date_and_time.start,
  (newVal) => {
    event.value.date_and_time.end = newVal; // Update 'end' as well
    event.value.registration.deadline = newVal; // Update 'end' as well
  }
);

// Example function to update startDateTime and see the effect
// function updateStartDateTime(newStart) {
//   startDateTime.value = newStart;
// }
// Dropdown options
const eventTypes = ["Workshop", "Conference", "Seminar", "Webinar"];
const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer"];
const accessibilityFeatures = [
  "Wheelchair Access",
  "Sign Language Interpreter",
  "Assistive Listening Devices",
];

// Form validation rules
const rules = {
  required: (value) => !!value || "This field is required",
  number: (value) => !isNaN(value) || "Must be a number",
  url: (value) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return pattern.test(value) || "Invalid URL";
  },
};

// Navigation between steps
const nextStep = () => {
  if (currentStep.value < 5) {
    currentStep.value += 1;
  }
};
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value -= 1;
  }
};

// Check if the current step is valid
const isStepValid = (step) => {
  switch (step) {
    case 1:
      return (
        !!event.value.event_name &&
        !!event.value.event_type &&
        !!event.value.description &&
        !!event.value.target_audience
      );
    case 2:
      return (
        !!event.value.date_and_time.start &&
        !!event.value.date_and_time.end &&
        !!event.value.location
      );
    case 3:
      return (
        !!event.value.keynote_speakers[0].name &&
        !!event.value.keynote_speakers[0].affiliation &&
        !!event.value.keynote_speakers[0].expertise &&
        !!event.value.workshop_facilitators[0].name &&
        !!event.value.workshop_facilitators[0].affiliation &&
        !!event.value.workshop_facilitators[0].expertise
      );
    case 4:
      return (
        !!event.value.registration.fee &&
        !!event.value.registration.deadline &&
        event.value.registration.payment_methods.length > 0 &&
        !!event.value.registration.registration_link
      );
    case 5:
      return (
        event.value.networking_events.length > 0 &&
        event.value.accessibility.features.length > 0
      );
    default:
      return false;
  }
};

// Handle form submission
const handleSubmit = async () => {
  // Validate and submit form data
  if (isFormValid.value) {
    const resourceContent = [
      {
        resourceId: resourceStore.resource.id,
        resourceContent: JSON.stringify([event.value]),
      },
    ];
    // You can also call your store method here to save the event
    await resourceStore.addResourceFormContent({
      resourceDetails: JSON.stringify(resourceContent),
    });

    window.location.reload();
  }
};
</script>

<style scoped>
.v-stepper__header {
  overflow-x: auto;
}
</style>
