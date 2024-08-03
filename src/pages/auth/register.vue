<template>
    <v-card class="login-card mt-4 ml-2" elevation="4" outlined rounded>
        <v-card-title class="text-center">
            <v-img style="max-height:7.5rem;"
                src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg" />
            <h5 class="mt-4 mr-11" style="color: #777777">Create Opal Learning Account</h5>
        </v-card-title>
        <v-card-text>
            <v-form @submit.prevent="submitRegister">
                <v-text-field color="primary" v-model="email" label="Email" required autofocus />
                <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
                    :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @input="validatePassword"
                    :rules="passwordRules" @click:append="togglePassword" required />
                <h4> My favorite deity: <strong color="purple">
                        {{ userStore.username.length < 1 ? 'None' : userStore.username }}</strong>

                </h4>
                <Deities />


                <div class="d-flex justify-space-between mt-4">
                    <v-btn :disabled="isButtonDisabled1 || isButtonDisabled2" style="width: 9rem" type="submit"
                        color="primary" :loading="registerLoading">
                        <v-icon class="mr-sm">mdi-location-enter</v-icon> Register
                    </v-btn>

                    <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                            <v-btn color="primary" icon height="30" variant="outlined" v-bind="props" to="/home">
                                <v-icon>mdi-home-account</v-icon>
                            </v-btn>
                        </template>
                        <span> Home</span>
                    </v-tooltip>



                </div>
            </v-form>
        </v-card-text>
        <div v-if="loginError">
            <v-alert :text="loginError" title="Registration error" type="error"></v-alert>
        </div>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useUserStore } from "../../stores/users";

const userStore = useUserStore();

import { useRouter } from "vue-router";
const isButtonDisabled1 = computed(() => {
    return userStore.username === '' || email.value === '' || password.value === '';
});
const router = useRouter();
const passwordRules = [
    (v: any) => !!v || 'Password is required',
    (v: string | any[]) => v.length >= 6 || 'Password must be at least 6 characters long',
    (v: string | any[]) => v.length <= 12 || 'Password must be at most 12 characters long'
];
const username = ref("");
const password = ref("");
const email = ref('');
const registerLoading = ref(false);
const isButtonDisabled2 = ref(true);

const loginError = ref(""); // To store login error message
const showPassword = ref(false);
const validatePassword = () => {
    // Check if all rules pass
    const allRulesPass = passwordRules.every(rule => rule(password.value) === true);
    isButtonDisabled2.value = !allRulesPass;
}
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
const submitRegister = async () => {
    registerLoading.value = true; // Indicate login in progress
    try {
        await userStore.register(userStore.username, email.value, password.value);
        // Handle successful login (e.g., redirect to home page)
        router.push("/auth/activate");

        // You can use a router or state management solution like Vuex
    } catch (error) {
         loginError.value = "Failed to register new user."; // Set error message
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