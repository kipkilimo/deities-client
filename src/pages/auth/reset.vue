<template>
  <v-card class="reset-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center">
      <v-img src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg" />
      <h3 class="mt-4 mr-11" style="color: #777777">Password Reset</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitReset">
        <v-container>
          <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
            :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click:append="togglePassword"
            required />
          <v-text-field v-model="confirm" :type="showConfirmPassword ? 'text' : 'password'" label="Confirm Password"
            :append-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append="toggleConfirmPassword" required />
        </v-container>

        <div class="d-flex justify-space-between mt-4">
          <v-btn :disabled="password !== confirm" style="width: 10.5rem" type="submit" color="primary"
            :loading="resetLoading">
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Reset Password
          </v-btn>

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
      <v-alert :text="resetError" title="Reset error" type="error"></v-alert>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

import { useUserStore } from "../../stores/users";
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
const activationToken = ref(''); // Replace with your token capturing logic

const confirm = ref("");
const password = ref("");
const resetLoading = ref(false);
const resetError = ref(""); // To store reset error message
const showPassword = ref(false);
const showConfirmPassword = ref(false);
onMounted(() => {
  const token = route.query.token;
  activationToken.value = String(token);
  console.log({ token: activationToken.value })

});
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;

};
const submitReset = async () => {
  resetLoading.value = true; // Indicate reset in progress
  try {
    await userStore.resetPassword(activationToken.value, password.value);
    // Handle successful reset (e.g., redirect to home page)
    if (userStore.user.activatedAccount === false) {
      router.push("/auth/activate");
      return
    }
    router.push("/todo-app/todos");

    // You can use a router or state management solution like Vuex
  } catch (error) {
    // if (userStore.user.activatedAccount === false) {
    //   router.push("/auth/activate");
    // }
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
