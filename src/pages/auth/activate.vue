<template>
  <v-card class="activate-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center" style="color: #777777">
      <v-img style="max-height:7.5rem;"
        src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg" />
      <h3 class="mt-4 mr-11" style="color: #777777">Activation link sent.</h3>
      <h5 class="mt-4 mr-11"><i>Check all mailboxes.</i></h5>
      <p class="mt-4 mr-11">{{ userStore.user.email }}</p>
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
              <v-btn color="primary" icon height="30" variant="outlined" v-bind="props" to="/home">
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
    <div v-if="activateSuccess">
      <v-alert :text="activateSuccess" title="Activation success" type="success"></v-alert>
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
  activationToken.value = String(token);
   setTimeout(() => {
    if (userStore.user.email.length < 5) {
      return;
    }
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
      router.push("/auth/register");
    }, 4200);
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

<route lang="yaml">
meta:
  layout: AuthLayout
</route>
