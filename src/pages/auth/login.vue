<template>
  <v-card class="login-card mt-4 ml-2" elevation="4" outlined rounded>
    <div v-if="loginError">
      <v-alert :text="loginError" title="Login error" type="error"></v-alert>
    </div>
    <v-card-title class="text-center">
      <v-img
        style="max-height: 7.5rem"
        src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg"
      />
      <h3 class="mt-4 mr-11" style="color: #777777">NEMBi Learning Login</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitLoginPathway">
        <v-text-field
          variant="outlined"
          color="primary"
          style="width: 90%"
          v-model="email"
          label="Registration email"
          required
          autofocus
        />
        <v-text-field
          variant="outlined"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          v-if="usingPassword"
          :append-icon="
            showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
          "
          @click:append="togglePassword"
          required
        />

        <v-text-field
          variant="outlined"
          v-model="accessKey"
          :type="showPassword ? 'text' : 'password'"
          label="Access Pin"
          hint="Enter access pin emailed to you."
          :append-icon="
            showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
          "
          v-if="!usingPassword"
          @click:append="togglePassword"
          required
        />
        <div class="d-flex justify-space-between mt-4">
          <v-btn
            :disabled="!canLogin"
            style="width: 7.5rem"
            type="submit"
            color="primary"
            :loading="loginLoading"
          >
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Login
          </v-btn>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                :disabled="!usingPassword || password.length >= 6"
                :color="isEmailValid ? 'green' : 'primary'"
                icon
                height="30"
                variant="outlined"
                v-bind="props"
                @click="sendOneTimeSignInKey"
              >
                <v-icon
                  >{{
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
              <v-btn
                v-bind="props"
                color="primary"
                icon
                height="30"
                variant="outlined"
                to="/auth/register"
              >
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </template>
            <span> Create an account</span>
          </v-tooltip>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                color="cyan"
                icon
                height="30"
                variant="outlined"
                v-bind="props"
                to="/auth/forgot"
              >
                <v-icon>mdi-head-lightbulb</v-icon>
              </v-btn>
            </template>
            <span>Forgot Password?</span>
          </v-tooltip>
        </div>
      </v-form>
    </v-card-text>
    <v-divider class="mt-2" />
    <h3 color="#777777" class="ml-2 mt-2 mb-2">Sponsors</h3>
    <v-img
      class="mt-3 "
      style="border-radius: 0px 0px 5px 5px"
      src="https://assets.bizclikmedia.net/580/d07c504f4f85d8f6a3c308c34edb7b93:b4ee3e25d34286c263ca95017d7fb60d/bro-3186903594-boehringeringelheim-dec2022.jpg"
    ></v-img>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useUserStore } from "../../stores/users";
import Cookies from "js-cookie";

import { useRouter } from "vue-router";
const router = useRouter();

const userStore = useUserStore();
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

const sendOneTimeSignInKey = async () => {
  loginLoading.value = true; // Indicate login in progress
  try {
    await userStore.singleSignInRequest(email.value);
    if (userStore.user.personalInfo.activatedAccount === false) {
      router.push("/auth/activate");
      return;
    }
    usingPassword.value = false;
    loginLoading.value = false;
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
    }, 81);
  }
};

function submitLoginPathway() {
  if (usingPassword.value === true) {
    submitLogin();
  }
  submitSingleSigninLogin();
}
const submitSingleSigninLogin = async () => {
  loginLoading.value = true; // Indicate login in progress
  try {
    await userStore.singleSigninLogin(accessKey.value);
    if (userStore.user.personalInfo.activatedAccount === false) {
      router.push("/auth/activate");
      return;
    }
    const token = userStore.token;
    // @ts-ignore
    // @ts-ignore

    // @ts-ignore
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    // @ts-ignore
    Cookies.set("authToken", token, { expires: expirationDate });

    router.push("/dashboard/overview");
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
    }, 42000);
  }
};

const submitLogin = async () => {
  loginLoading.value = true; // Indicate login in progress
  try {
    await userStore.login(email.value, password.value);
    if (userStore.user.personalInfo.activatedAccount === false) {
      router.push("/auth/activate");
      return;
    }
    const token = userStore.token;
    // @ts-ignore
    Cookies.set("authToken", token, { expires: 7 }); // Expires in 7 days

    router.push("/dashboard/overview");
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
