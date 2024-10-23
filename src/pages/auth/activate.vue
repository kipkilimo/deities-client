<template>
  <v-card class="activate-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center" style="color: #777777">
      <v-img style="height: 12rem"
        src="https://a2z-v0.s3.eu-central-1.amazonaws.com/Screenshot+from+2024-10-22+16-31-16.png" />
      <h3 class="mt-4 mr-11" style="color: #777777">Activation link sent.</h3>
      <h5 class="mt-4 mr-11"><i>Check all mailboxes.</i></h5>
      <p class="mt-4 mr-11">{{ userStore.user?.personalInfo.email }}</p>
    </v-card-title>
    <div class="">


    </div>
    <v-card-text>
      <v-form @submit.prevent="accountActivate">
        <!-- <v-text-field color="primary" v-model="token" label="Activation token" required autofocus />
 -->



        <div class="d-flex justify-space-between mt-4">
          <v-btn disabled style="width: 12.5rem" type="submit" color="primary" :loading="activateLoading">
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Activating ...
          </v-btn>
          <!-- <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" icon height="30" variant="outlined" v-bind="props" to="/auth/register">
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </template>
<span> Create an account</span>
</v-tooltip> -->
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" icon height="30" variant="outlined" v-bind="props" to="/welcome">
                <v-icon>mdi-home-account</v-icon>
              </v-btn>
            </template>
            <span> Home</span>
          </v-tooltip>

          <!-- <v-tooltip location="top">
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
    <v-progress-linear v-if="activateLoading" color="cyan" indeterminate></v-progress-linear>
        <div v-if="activateSuccess" class="custom-alert">
      <v-alert :text="activateSuccess" title="Reset request sent!" type="success" class="custom-alert">

      </v-alert>
    </div>
 
    <div v-if="activateError">
      <v-alert :text="activateError" title="Activation error" type="error"></v-alert>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

import { useUserStore } from "../../stores/users";

const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
import { useRoute } from 'vue-router';

const route = useRoute();
const activateLoading = ref(false);
const activateError = ref(""); // To store activate error message
const activateSuccess = ref(""); // To store activate error message

const activationToken = ref(''); // Replace with your token capturing logic

onMounted(() => {
  const token = route.query.token;
  console.log({token})
  activationToken.value = String(token);
   setTimeout(() => {
 
    accountActivate();
  }, 3600);
});
const accountActivate = async () => {
  activateLoading.value = true; // Indicate activate in progress
  try {
    await userStore.activate(activationToken.value);
    // Handle successful activate (e.g., redirect to home page)
    activateSuccess.value = "Successfully activated account.";
    setTimeout(() => {
      router.push("/dashboard/overview");
    }, 4200);
    // You can use a router or state management solution like Vuex
  } catch (error) {
     activateError.value = "Failed to activate account."; // Set error message
    setTimeout(() => {
      router.push("/auth/login");
    }, 12000);
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
