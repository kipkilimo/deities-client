<template>
  <v-card class="reset-card mt-4 ml-2" elevation="4" outlined rounded>
    <v-card-title class="text-center">
      <v-img
        style="max-height:7.5rem;"
        src="https://a2z-v0.s3.eu-central-1.amazonaws.com/NEMBio+Logo+wide.png"
      />
      <h3 class="mt-4 mr-11" style="color: #777777">Password Reset</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitReset">
        <v-container>
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append="togglePassword"
            :rules="passwordRules"
            required
          />
          <v-text-field
            v-model="confirm"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirm Password"
            :append-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append="toggleConfirmPassword"
            :rules="confirmRules"
            required
          />
        </v-container>

        <div class="d-flex justify-space-between mt-4">
          <v-btn
            :disabled="isFormInvalid"
            style="width: 15rem"
            type="submit"
            color="primary"
            :loading="resetLoading"
          >
            <v-icon class="mr-sm">mdi-location-enter</v-icon> Reset Password
          </v-btn>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn class="ml-xs" color="primary" icon height="30" variant="outlined" v-bind="props" to="/welcome">
                <v-icon>mdi-home-account</v-icon>
              </v-btn>
            </template>
            <span> Home</span>
          </v-tooltip>
        </div>
      </v-form>
    </v-card-text>
    <div v-if="resetError">
      <v-alert :text="resetError" title="Reset error" type="error"></v-alert>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/users";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const router = useRouter();

const activationToken = ref('');
const password = ref("");
const confirm = ref("");
const resetLoading = ref(false);
const resetError = ref(""); 
const showPassword = ref(false);
const showConfirmPassword = ref(false);

onMounted(() => {
  const token = route.query.token;
  activationToken.value = String(token);
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Password length validation rules
const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 6) || 'Password must be at least 6 characters long',
  (v: string) => (v && v.length <= 12) || 'Password must not exceed 12 characters'
];

// Confirm password validation rules
const confirmRules = [
  (v: string) => !!v || 'Confirm password is required',
  (v: string) => v === password.value || 'Passwords do not match'
];

const isFormInvalid = computed(() => {
  return !password.value || password.value.length < 6 || password.value.length > 12 || password.value !== confirm.value;
});

const submitReset = async () => {
  resetLoading.value = true;
  resetError.value = ""; 

  try {
    await userStore.resetPassword(activationToken.value, password.value);
    if (userStore.user.activatedAccount === false) {
      router.push("/auth/activate");
    } else {
      router.push("/dashboard/overview");
    }
  } catch (error) {
    resetError.value = "Failed to reset password.";
  } finally {
    resetLoading.value = false; 
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
