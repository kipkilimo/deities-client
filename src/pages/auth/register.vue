<template>
  <v-card class="login-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center">
      <v-img @click="goHome" style="height: 12rem;cursor: pointer"
        src="https://a2z-v0.s3.eu-central-1.amazonaws.com/Screenshot+from+2024-10-22+16-31-16.png" />
      <h5 class="mt-4 mr-11" style="color: #777777">
        Create Amane Hospital Account
      </h5>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitRegister">
        <v-row>
          <v-col cols="6">
            <v-text-field color="primary" v-model="firstName" label="Firstname" required autofocus /> </v-col><v-col
            cols="6">
            <v-text-field color="primary" v-model="lastName" label="Lastname" required autofocus />
          </v-col>
        </v-row>
        <v-text-field color="primary" v-model="email" label="Email" required autofocus />
        <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password" :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
          " @input="validatePassword" :rules="passwordRules" @click:append="togglePassword" required />
        <h4>
          Choose your favorite scientist to build your username (optional).
          <br />
          My favorite 👍 scientist:
          <strong color="indigo darken-3">
            {{
              userStore.username.length < 1 ? "None" : userStore.username
            }}</strong>
          <v-card-actions>
            <v-spacer />
            <v-btn class="mt-2" variant="text" @click="selectIcon = true">
              <v-icon class="mr-2">mdi-person</v-icon>Select A Scientist</v-btn>
            <v-spacer />
          </v-card-actions>
        </h4>
        <br />
        <v-divider />
        <v-row class="mt-1">
          <v-col cols="12" class="mt-2">
            <v-card-text class=""> By registering, I agree to </v-card-text>
            <v-btn variant="text" class="ml-2" size="x-small"
              @click="(agreeToTermsDialog = true), (agreeToTerms = false)">
              <v-icon class="mr-2">mdi-note-check</v-icon> Amane Hospital Terms of Use
              and Privacy Statement</v-btn>
          </v-col>
        </v-row>
        <v-divider />
        <div class="d-flex justify-space-between mt-2">
          <v-card-actions><v-spacer />
            <v-btn :disabled="
                isButtonDisabled1 || (isButtonDisabled2 && !agreeToTerms)
              " type="submit" color="primary" style="width: 13.5rem; background-color: #8fc0c5"
              :loading="registerLoading">
              <v-icon class="mr-sm">mdi-location-enter</v-icon> Register
            </v-btn>
            <v-spacer />

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" icon class="ml-7" height="30" variant="outlined" v-bind="props" to="/auth/login">
                  <v-icon>mdi-login-variant</v-icon>
                </v-btn>
              </template>
              <span>Registered? Signin.</span>
            </v-tooltip>
            <v-spacer />
          </v-card-actions>
        </div>
      </v-form> </v-card-text><v-divider />

    <div v-if="loginError">
      <v-alert :text="loginError" title="Registration error" type="error"></v-alert>
    </div>
    <v-dialog max-width="75%" auto-height v-model="selectIcon">
      <Scientists @closeScientists="closeScientists()" />
    </v-dialog>

    <v-dialog max-width="700" persistent v-model="agreeToTermsDialog"><v-card class="ma-2 ml-2">
        <Terms />
        <v-divider />
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="outlined" width="9rem" @click="(agreeToTermsDialog = false), (agreeToTerms = true)">
            <v-icon class="mr-4">mdi-note-check</v-icon> Agree
          </v-btn>

          <v-btn color="red" @click="leavePage"> Disagree and Leave </v-btn>
        </template>
      </v-card></v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useStaffStore } from "../../stores/staff";

const userStore = useStaffStore();

import { useRouter } from "vue-router";
import Scientists from "@/utilities/scientists.vue";
const selectIcon = ref(false);
const username = ref(userStore.username);
const agreeToTerms = ref(false); // agreeToTermsDialog
const agreeToTermsDialog = ref(false);
// Watch for changes in filters or sortOption
function closeScientists() {
  selectIcon.value = false;
}
watch(
  userStore,
  () => {
    // Trigger recomputation of filteredAndSortedFigures
    if (username.value.length > 1) {
      selectIcon.value = false;
    }
  },
  { deep: true }
);

const isButtonDisabled1 = computed(() => {
  return email.value === "" || password.value === "";
});

const router = useRouter();
const passwordRules = [
  (v: any) => !!v || "Password is required",
  (v: string | any[]) =>
    v.length >= 6 || "Password must be at least 6 characters long",
  (v: string | any[]) =>
    v.length <= 12 || "Password must be at most 12 characters long",
];
const firstName = ref("");
const lastName = ref("");

const password = ref("");
const email = ref("");
const registerLoading = ref(false);
const isButtonDisabled2 = ref(true);

const loginError = ref(""); // To store login error message
const showPassword = ref(false);
const validatePassword = () => {
  // Check if all rules pass
  const allRulesPass = passwordRules.every(
    (rule) => rule(password.value) === true
  );
  isButtonDisabled2.value = !allRulesPass;
};
function goHome() {
  router.push("/welcome");
}
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
const submitRegister = async () => {
  const fullName = `${firstName.value} ${lastName.value}`;
  registerLoading.value = true; // Indicate login in progress
  if (username.value === "") {
    username.value = fullName;
  }
  try {
    await userStore.register(
      username.value,
      fullName,
      email.value,
      password.value
    );
    // Handle successful login (e.g., redirect to home page)

    // You can use a router or state management solution like Vuex
  } catch (error) {
    loginError.value = "Failed to register new user."; // Set error message
    setTimeout(() => {
      window.location.reload();
    }, 420000);
  }
};
function leavePage() {
  // Check if the window object is available
  if (typeof window !== "undefined") {
    // Redirect to the home page
    window.location.href = "/welcome";
  }
}
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
