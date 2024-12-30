<template>
  <v-card class="login-card mt-4 ml-2" elevation="4" outlined rounded>
    <div v-if="loginError">
      <v-alert :text="loginError" title="Login error" type="error"></v-alert>
    </div>
    <h3 class="mt-4 mr-11 ml-2" style="color: #777777">
      Amane Hospital Staff Login
    </h3>
    <v-divider />
    <v-card-title class="text-center mb-2">
      <v-img @click="goHome" style="height: 12rem; cursor: pointer"
        src="https://cloudclinic.me/ada/images/logo/cloud-clinic-logo-clean-new-1.png" />
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitLoginPathway">
        <v-text-field variant="outlined" color="primary" v-model="email" label="Registration email" required autofocus
          append-inner-icon="mdi-email-lock-outline" />

        <v-text-field variant="outlined" v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
          v-if="usingPassword" :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            " @click:append-inner="togglePassword" required />

        <v-text-field variant="outlined" v-model="accessKey" :type="showPassword ? 'text' : 'password'"
          label="Access Pin" hint="Enter access pin emailed to you." v-if="!usingPassword" :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            " @click:append-inner="togglePassword" required />

        <div class="d-flex justify-space-between mt-4">
          <v-btn :disabled="!canLogin" style="width: 12rem" type="submit" color="primary" :loading="loginLoading">
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Login
          </v-btn>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn disabled :color="isEmailValid ? 'green' : 'primary'" icon height="30" variant="outlined"
                v-bind="props">
                <v-icon>{{
  isEmailValid
    ? "mdi-send-variant-clock-outline"
    : "mdi-cloud-key-outline"
}}
                </v-icon>
              </v-btn>
            </template>
            <span>{{
              isEmailValid
                ? "Submit and get access pin in your mailbox"
                : "Provide the registration email to use a single signin pin"
            }}</span>
          </v-tooltip>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn disabled v-bind="props" color="primary" icon height="30" variant="outlined" to="/auth/register">
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
        <v-card class="mt-4" disabled style="
            width: 100%;
            cursor: pointer;
            border-radius: 5px;
            border: 1px solid #bfbfbf;
          ">
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-img v-bind="props" @click="orcIDAuthenticate"
                src="https://www.softimpact.net/newsimages/News-224-636632023302815635.png"
                style="height: 4.5rem; cursor: pointer" />
            </template>
            <span>Signin with your ORCID</span>
          </v-tooltip>
        </v-card>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useStaffStore } from "../../stores/staff";
import Cookies from "js-cookie";

import { useRouter } from "vue-router";
const router = useRouter();

const staffStore = useStaffStore();
const usingPassword = ref(true);

const email = ref("");
const password = ref("");
const accessKey = ref("");

const loginLoading = ref(false);
const loginError = ref(""); // To store login error message
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
function goHome() {
  router.push("/welcome");
}
// Computed property to validate email format
const isEmailValid = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.value);
});

// Computed property to check if the password is at least 6 characters long
const isPasswordValid = computed(
  () => password.value.length >= 6 || accessKey.value.length >= 6
);

// Computed property to enable or disable the login button
const canLogin = computed(() => isEmailValid.value && isPasswordValid.value);



function submitLoginPathway() {
  if (usingPassword.value === true) {
    submitLogin();
    return;
  }
}

const orcIDAuthenticate = async () => {
  loginLoading.value = true; // Indicate login in progress
  try {
    await staffStore.login(email.value, password.value);
    //@ts-ignore
    if (staffStore.user.personalInfo.activatedAccount === false) {
      router.push("/auth/activate");
      return;
    }
    const token = staffStore.token;
    // @ts-ignore
    Cookies.set("authToken", token, { expires: 7 }); // Expires in 7 days

    router.push("/dashboard/services");
  } catch (error) {
    loginError.value = "Check your credentials."; // Set error message
    let errorMessage = loginError.value;

    function isGraphQLError(
      err: unknown
    ): err is { graphQLErrors: Array<{ message: string }> } {
      return (
        typeof err === "object" &&
        err !== null &&
        "graphQLErrors" in err &&
        Array.isArray((err as any).graphQLErrors)
      );
    }

    if (isGraphQLError(error)) {
      if (error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      }
    } else if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }

    loginError.value = errorMessage;
    setTimeout(() => {
      window.location.reload();
    }, 420000);
  }
};
const submitLogin = async () => {
  loginLoading.value = true; // Indicate login in progress
  try {
    await staffStore.login(email.value, password.value);
    //@ts-ignore
    if (staffStore.token === null) {
      router.push("/welcome");
      return;
    }
    const token = staffStore.token;
    // @ts-ignore
    Cookies.set("authToken", token, { expires: 7 }); // Expires in 7 days

    router.push("/dashboard/services");
  } catch (error) {
    loginError.value = "Check your credentials."; // Set error message
    let errorMessage = loginError.value;

    function isGraphQLError(
      err: unknown
    ): err is { graphQLErrors: Array<{ message: string }> } {
      return (
        typeof err === "object" &&
        err !== null &&
        "graphQLErrors" in err &&
        Array.isArray((err as any).graphQLErrors)
      );
    }

    if (isGraphQLError(error)) {
      if (error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      }
    } else if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }

    loginError.value = errorMessage;
    setTimeout(() => {
      window.location.reload();
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
