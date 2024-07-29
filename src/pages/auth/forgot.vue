<template>
  <v-card class="reset-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center">
      <v-img src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg" />
      <h3 class="mt-4 mr-11" style="color: #777777">Reset password request</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitReset">
        <v-text-field color="primary" v-model="email" label="Enter registration email address" required autofocus />


        <div class="d-flex justify-space-between mt-4">
          <v-btn style="width: 15rem" type="submit" color="primary" :loading="resetLoading">
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Request reset
          </v-btn>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" icon height="30" variant="outlined" v-bind="props" to="/home">
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
    <div v-if="resetError">
      <div v-if="resetSuccess">
        <v-alert :text="resetSuccess" title="Reset request sent!" type="success"></v-alert>
      </div>
      <v-alert :text="resetError" title="Reset error" type="error"></v-alert>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useUserStore } from "../../stores/users";

const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const resetLoading = ref(false);
const resetError = ref(""); // To store reset error message

const resetSuccess = ref(""); // To store reset error message

const submitReset = async () => {
  resetLoading.value = true; // Indicate reset in progress
  try {
    await userStore.resetPassword(email.value);
    // Handle successful reset (e.g., redirect to home page)
    resetSuccess.value = `A password reset link was sent to ${email.value}`;


    // You can use a router or state management solution like Vuex
  } catch (error) {
    console.log({ error })
    resetError.value = "Check your credentials."; // Set error message
    setTimeout(() => {
      window.location.reload();
    }, 4200);
  }
};
</script>

<style scoped>
.reset-card {
  max-width: 400px;
  margin: auto;
  padding: 24px;
}
</style>

<route lang="yaml">
meta:
  layout: AuthLayout
</route>
