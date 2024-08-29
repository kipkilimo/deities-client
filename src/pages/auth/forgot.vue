<template>
  <v-card class="reset-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center">
      <v-img style="max-height:7.5rem;"
        src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg" />
      <h3 class="mt-4 mr-11" style="color: #777777">Request password reset</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitReset">
        <v-text-field :disabled="resetSuccess !== ''" color="primary" v-model="email"
          label="Enter registration email address" required autofocus />


        <div class="d-flex justify-space-between mt-4">
          <v-btn :disabled="isButtonDisabled" style="width: 17rem" type="submit" color="primary"
            :loading="resetLoading">
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Submit password reset
          </v-btn>


          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn class="ml-xs" color="primary" icon height="30" variant="outlined" v-bind="props" to="/welcome">
                <v-icon>mdi-home-account</v-icon>
              </v-btn>
            </template>
            <span> Home</span>
          </v-tooltip>
          <!-- <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" icon height="30" variant="outlined" v-bind="props" to="/auth/register">
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </template>
<span> Create an account</span>
</v-tooltip>


<v-tooltip location="top">
  <template v-slot:activator="{ props }">
              <v-btn color="cyan" icon height="30" variant="outlined" v-bind="props" to="/auth/forgot">
                <v-icon>mdi-head-lightbulb</v-icon>
              </v-btn>
            </template>
  <span>Forgot Password?</span>
</v-tooltip> -->
        </div>
      </v-form>
    </v-card-text>
    <div v-if="resetSuccess" class="custom-alert">
      <v-alert :text="resetSuccess" title="Reset request sent!" type="success" class="custom-alert">

      </v-alert>
    </div>
    <div v-if="resetError">

      <v-alert :text="resetError" title="Reset error" type="error"></v-alert>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

import { useUserStore } from "../../stores/users";

const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();

const email = ref("");
const resetLoading = ref(false);
const resetError = ref(""); // To store reset error message

function maskEmail(email: string): string {
  // Split the email into local part and domain
  const [localPart, domain] = email.split('@');

  // Return the email unmodified if it doesn't contain a valid structure
  if (!localPart || !domain) {
    return email;
  }

  // Handle cases where the local part is too short to mask properly
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }

  // Mask the local part: first character, then asterisks, then last character
  const maskedLocalPart = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;

  // Combine masked local part with the domain
  return `${maskedLocalPart}@${domain}`;
}
const resetSuccess = ref(""); // To store reset error message
// Define the computed property for button state
const isButtonDisabled = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
  return !regex.test(email.value); // Disable button if email does not match pattern
});
const submitReset = async () => {
  resetLoading.value = true; // Indicate reset in progress
  try {
    await userStore.requestPasswordReset(email.value);
    // Handle successful reset (e.g., redirect to home page)
    resetSuccess.value = `A password reset link was sent to ${maskEmail(email.value)}`;
    resetLoading.value = false; // Indicate reset in progress

    email.value = ''
    // You can use a router or state management solution like Vuex
  } catch (error) {
     resetError.value = "Check your credentials."; // Set error message
    setTimeout(() => {
      window.location.reload();
    }, 2700);
  }
};
</script>

<style scoped>
.reset-card {
  max-width: 98%;
  margin: auto;
  padding: 24px;
}
</style>
<style scoped>
.custom-alert {
  background-color: #ffffff; /* Dark background */
  padding: 20px;
  border-radius: 5px;
}

.custom-alert * {
  color: white !important;
}
</style>
<route lang="yaml">
meta:
  layout: AuthLayout
</route>
