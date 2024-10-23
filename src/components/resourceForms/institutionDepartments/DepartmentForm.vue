<template>
  <v-card
    prepend-icon="mdi-account-group"
    title="Create a Department"
    class="ma-2"
    flat
  >
    <v-divider />
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="5">
          <v-text-field
            class="ma-1"
            v-model="form.name"
            :rules="nameRules"
            label="Department Name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="7">
          <v-text-field
            class="ma-1"
            v-model="form.parent_institution"
            :rules="nameRules"
            label="Parent Institution"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            class="ma-1"
            v-model="form.phone_number"
            :rules="phoneRules"
            label="Phone Number"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="7">
          <v-text-field
            class="ma-1"
            v-model="form.email_address"
            :rules="emailValidationRules"
            label="Email Address"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea
            class="ma-1"
            label="Add faculty members (comma-separated emails), up to 20 pax*"
            v-model="form.members"
            item-text="email"
            multiple
            chips
            required
            :rules="[emailValidation]"
            hint="Add faculty members (comma-separated emails), up to 20 pax"
            persistent-hint
          ></v-textarea>
        </v-col>

        <small class="text-caption text-medium-emphasis">
          *indicates required field
        </small>
      </v-row>
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        @click="saveDepartment"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-content-save-check-outline"
        :disabled="!isFormValid"
      >
        Save Department
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDepartmentStore } from "@/stores/departments"; // Assuming store is set up

const createdBy = localStorage.getItem("sessionId"); // Retrieve user ID or session ID from storage

const emailValidation = (value) => {
  if (!value) return "Emails are required";

  const emailArray = value.split(",").map((email) => email.trim());

  if (emailArray.length < 2) return "At least 2 emails are required";
  if (emailArray.length > 20) return "A maximum of 20 emails are allowed";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const email of emailArray) {
    if (!emailRegex.test(email)) return `${email} is not a valid email`;
  }

  return true;
};

const emailValidationRules = [
  (v) => !!v || "Email is required",
  (v) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v) || "Email must be valid";
  },
];

const nameRules = [
  (v) => !!v || "Name is required",
  (v) => (v && v.length >= 5) || "Name must be at least 5 characters",
  (v) => (v && v.length <= 355) || "Name must be less than 355 characters",
];

const phoneRules = [
  (v) => !!v || "Phone number is required",
  (v) => /^\+?[0-9\s-]+$/.test(v) || "Phone number must be valid",
];

const form = ref({
  name: "",
  parent_institution: "",
  phone_number: "",
  email_address: "",
  members: "",
});

// Computed property to check form validity
const isFormValid = computed(() => {
  return (
    nameRules.every((rule) => rule(form.value.name) === true) &&
    nameRules.every((rule) => rule(form.value.parent_institution) === true) &&
    phoneRules.every((rule) => rule(form.value.phone_number) === true) &&
    emailValidationRules.every(
      (rule) => rule(form.value.email_address) === true
    ) &&
    emailValidation(form.value.members) === true
  );
});

const saveDepartment = async () => {
  trimInputs();
  try {
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function processEmails(emailString) {
      return emailString
        .split(/[,\s]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0 && validateEmail(email));
    }

    const validEmails = processEmails(form.value.members);

    const store = useDepartmentStore();
    await store.handleDepartmentCreate({
      createdBy,
      departmentId: generateUniqueCode(12),
      name: form.value.name,
      parent_institution: form.value.parent_institution,
      phone_number: form.value.phone_number,
      email_address: form.value.email_address,
      members: validEmails,
    });
  } catch (error) {
    console.error("Failed to create department:", error);
  }
};
const trimInputs = () => {
  form.value.name = form.value.name.trim();
  form.value.parent_institution = form.value.parent_institution.trim();
  form.value.phone_number = form.value.phone_number.trim();
  form.value.email_address = form.value.email_address.trim();
  form.value.members = form.value.members.trim();
};

function generateUniqueCode(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
</script>

<style scoped>
/* Add any styles you need for the component here */
</style>
