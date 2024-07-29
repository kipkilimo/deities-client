<template>
  <v-card class="login-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center">
      <v-img src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg" />
      <h3 class="mt-4 mr-11" style="color: #777777">Opal Learning Login</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitLogin">
        <v-text-field color="primary" v-model="username" label="Username" required autofocus />
        <v-text-field color="primary" v-model="password" label="Password" type="password" required />




        <div class="d-flex justify-space-between mt-4">
          <v-btn style="width: 7.5rem" type="submit" color="primary" :loading="loginLoading">
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Login
          </v-btn>

          <v-tooltip location="top">
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
          </v-tooltip>
        </div>
      </v-form>
    </v-card-text>
    <div v-if="loginError">
      <v-alert :text="loginError" title="Login error" type="error"></v-alert>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useUserStore } from "../../stores/users";

const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const loginLoading = ref(false);
const loginError = ref(""); // To store login error message

const submitLogin = async () => {
  loginLoading.value = true; // Indicate login in progress
  try {
    await userStore.login(username.value, password.value);
    // Handle successful login (e.g., redirect to home page)
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
    loginError.value = "Check your credentials."; // Set error message
    setTimeout(() => {
      window.location.reload();
    }, 4200);
  }
};
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: auto;
  padding: 24px;
}
</style>

<route lang="yaml">
  meta:
    layout: AuthLayout
  </route>
