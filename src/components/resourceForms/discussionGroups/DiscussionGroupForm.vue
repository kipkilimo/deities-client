<template>
  <v-card prepend-icon="mdi-account-group" title="Create Discussion Group">
    <v-card-text>
      <v-row dense>
        <!-- Discussion Group Name -->
        <v-col cols="12" md="5">
          <v-text-field
            label="Discussion Group Name*"
            v-model="form.name"
            required
            :rules="nameRules"
          ></v-text-field>
        </v-col>

        <!-- Discussion Group ID -->
        <v-col cols="12" md="7">
          <v-text-field
            label="Discussion description*"
            v-model="form.program"
            required
            :rules="nameRules"
          ></v-text-field>
        </v-col>

        <!-- Members (Autocomplete to select from existing users) -->

        <!-- Programs (Text field for program details) -->
        <v-col cols="12" sm="12">
          <v-textarea
            label="Provide at least 2 valid emails, separated by commas, up to a max of 20 emails*"
            v-model="form.members"
            item-text="email"
            multiple
            chips
            required
            :rules="emailValidation"
            hint="Add members to the group."
            persistent-hint
          ></v-textarea>
        </v-col>
      </v-row>

      <small class="text-caption text-medium-emphasis"
        >*indicates required field</small
      >
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text="Close" variant="plain" @click="$emit('closeDialog')"></v-btn>

      <v-btn
        color="primary"
        text="submit DG Details"
        rounded="2"
        prepend-icon="mdi-content-save-check-outline"
        width="12rem"
        variant="outlined"
        @click="saveDiscussionGroup"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useDiscusionGroupsStore } from "@/stores/reports";

const createdBy = localStorage.getItem("sessionId");
const emailValidation = (value) => {
  if (!value) return "Emails are required";

  // Split the string by commas and remove any empty spaces
  const emailArray = value.split(",").map((email) => email.trim());

  // Check if there are at least 2 emails
  if (emailArray.length < 2) return "At least 2 emails are required";

  // Check if there are more than 20 emails
  if (emailArray.length > 20) return "A maximum of 20 emails are allowed";

  // Validate each email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const email of emailArray) {
    if (!emailRegex.test(email)) return `${email} is not a valid email`;
  }

  return true;
};
const nameRules = [
  (v) => !!v || "Name is required",
  (v) => v.length >= 5 || "Name must be at least 5 characters",
  (v) => v.length <= 355 || "Name must be less than 355 characters",
];
const form = ref({
  program: "",
  name: "",
  members: [],
});
/*
            discussionGroupId: $discussionGroupId
            name: $name
            program: $program
            createdBy: $createdBy
            members: $members

*/

const saveDiscussionGroup = async function () {
  function processEmails(emailString) {
    // Split the string by commas, then further split any remaining spaces
    return emailString
      .split(/[,\s]+/) // Split by comma or any whitespace (handles both commas and spaces)
      .map((email) => email.trim()) // Trim whitespace around each email
      .filter((email) => email.length > 0 && validateEmail(email)); // Filter out invalid or empty emails
  }

  // Optional email validation function (basic regex check)
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Example usage
  const validEmails = processEmails(form.value.members);

  console.log(validEmails); // Output: ["cafenetpoint2016@gmail.com", "kipkilimo@gmail.com", "john.doe@example.com"]

  const store = useDiscusionGroupsStore();
  store.handleDiscussionGroupCreate({
    createdBy: createdBy,
    name: form.value.name,
    program: form.value.program,
    members: validEmails,
  }); // eslint-disable-next-line
  return 1;
};
</script>
