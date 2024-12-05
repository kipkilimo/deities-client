<template>
  <v-card
    prepend-icon="mdi-account-group"
    title="Manage Discussion Group Members"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            label="Discussion Group Name*"
            v-model="form.name"
            :rules="nameRules"
          ></v-text-field>
        </v-col>

        <!-- Discussion Group ID -->
        <v-col cols="12" md="7">
          <v-text-field
            label="Discussion description*"
            v-model="form.program"
            :rules="nameRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <br />
          <!-- Display member's email input -->
          <v-textarea
            v-model="form.members"
            v-if="showAddNewlDGMembersInput"
            label="Add new members by their emails"
            class="ml-2"
            :rules="emailRules"
            hint="Add new members emails separated by a comma."
            persistent-hint
            style="flex-grow: 1; max-width: 100%"
          ></v-textarea>
          <v-divider />
        </v-col>
        <!-- Members Section -->
        <v-col cols="12" sm="12">
          <v-card-title>
            <v-icon class="mr-2">mdi-account-group</v-icon> Current Discussion
            Group Members
          </v-card-title>
          <v-chip
            v-for="(member, index) in membersClone"
            :key="index"
            class="mr-2 mb-2"
            close
            rounded="2"
            variant="outlined"
            style="background-color: #e0f7fa; color: #00695c"
          >
            {{ member.personalInfo.fullName }} <br />
            <small class="text-caption text-medium-emphasis">
              {{ member.personalInfo.email }}
            </small>
            <v-divider vertical class="ml-2"></v-divider>
            <v-icon
              right
              class="ml-2"
              style="cursor: pointer"
              @dblclick="removeOnDblClick(index)"
              color="red"
            >
              mdi-delete
            </v-icon> </v-chip
          ><br />
          <small class="text-caption text-medium-emphasis">
            <v-icon right class="ml-2 mb-1" size="small" color="pink">
              mdi-lightbulb-on-outline
            </v-icon>
            HINT: Double click delete button to drop a member.
          </small>
          {{ form.members }}
        </v-col>
      </v-row>

      <v-divider />
      <v-card-actions style="justify-content: flex-start">
        <v-spacer />
        <v-spacer /> <v-spacer />
        <v-spacer />
        <v-btn
          color="green"
          text="Add new DG members"
          rounded="2"
          prepend-icon="mdi-account-multiple-plus-outline"
          @click="showAddNewlDGMembersInput = true"
        ></v-btn>
        <v-spacer />
        <v-btn
          color="red"
          text="Drop all members"
          rounded="2"
          prepend-icon="mdi-delete-alert-outline"
          width="12rem"
          @click="wipeAllDGMembers"
        ></v-btn>
        <v-spacer />
      </v-card-actions>
      <small class="text-caption text-medium-emphasis">
        *indicates required field
      </small>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions style="justify-content: flex-end">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text="Submit DG Update Details"
        rounded="2"
        :disabled="form.members.length < 2"
        prepend-icon="mdi-content-save-check-outline"
        variant="outlined"
        @click="saveDiscussionGroupManagement(form.members)"
      ></v-btn>
      <v-spacer />

      <v-btn
        text="CANCEL UPDATES"
        color="orange"
        prepend-icon="mdi-progress-close"
        variant="plain"
        @click="$emit('closeDialog')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useDiscusionGroupsStore } from "@/stores/reports";
import { useUserStore } from "@/stores/staff";

const form = ref({
  name: "",
  program: "",
  members: [],
});
const showAddNewlDGMembersInput = ref(false);
const createdBy = localStorage.getItem("sessionId");

const nameRules = [
  (v) => v.length <= 355 || "Name must be less than 355 characters",
];
const emailRules = [
  // Rule to ensure emails are provided
  (v) => !!v || "Emails are required",

  // Rule to ensure at least 2 emails are provided
  (v) =>
    v.split(",").map((email) => email.trim()).length >= 2 ||
    "At least 2 emails are required",

  // Rule to ensure no more than 20 emails
  (v) =>
    v.split(",").map((email) => email.trim()).length <= 20 ||
    "A maximum of 20 emails are allowed",

  // Rule to check for duplicate emails
  (v) => {
    const emailArray = v.split(",").map((email) => email.trim());
    const uniqueEmails = new Set(emailArray);
    return (
      uniqueEmails.size === emailArray.length ||
      "Duplicate emails are not allowed"
    );
  },

  // Rule to validate email format
  (v) => {
    const emailArray = v.split(",").map((email) => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emailArray) {
      if (!emailRegex.test(email)) return `${email} is not a valid email`;
    }
    return true;
  },
];

const membersClone = ref([...useUserStore().user.discussion_groups[0].members]);
function preFillMemberEmails() {
  // Function to validate email format
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Extract and filter only valid emails
  const validEmails = membersClone.value
    .map((member) => member.personalInfo.email)
    .filter(isValidEmail);

  // Pre-fill form with valid member emails
  form.value.members = [...form.value.members, ...validEmails];
}

onMounted(() => {
  preFillMemberEmails();
});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Watch form.members and debounce the update
const saveDiscussionGroupManagement = async () => {
  const convertAndValidateEmails = (data) => {
    // Function to validate email format
    const isValidEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email.trim());
    };

    // Convert the emails string to an array and filter out invalid emails
    const emailArray = data.split(",").map((email) => email.trim());
    const validEmails = emailArray.filter(isValidEmail);

    return validEmails;
  };

  // Function to validate email format

  const emails = convertAndValidateEmails(form.value.members);

  const emailList = emails;

  // Retrieve the discussion group store
  const store = useDiscusionGroupsStore();

  // Handle the discussion group update with valid emails
  store.handleDiscussionGroupUpdate({
    discussionGroupId:
      useUserStore().user.discussion_groups[0].discussionGroupId,
    name: form.value.name,
    program: form.value.program,
    members: emailList, // This should now include valid and unique emails
  });

  // Return 1 as indicated
  return 1;
};

// Function to remove a member from membersClone by index
const removeOnDblClick = (index) => {
  form.value.members.splice(index, 1);

  membersClone.value.splice(index, 1);
};

// Function to remove all members from the list
const wipeAllDGMembers = () => {
  form.value.members = [];
  membersClone.value = [];
};
</script>
