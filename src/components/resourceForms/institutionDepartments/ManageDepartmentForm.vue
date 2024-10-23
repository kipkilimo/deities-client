<template>
  <v-card
    prepend-icon="mdi-account-group"
    :title="`Manage ${department.name} Deprtment Members`"
  >
    <v-divider />
    <!-- Role Toggle -->
    <v-col cols="12" md="12">
      <v-btn-toggle color="info" v-model="activeRole" mandatory>
        <v-btn value="FACULTY">Faculty</v-btn>
        <v-btn value="ASSISTANT">Assistant</v-btn>
        <v-btn value="STUDENT">Student</v-btn>
      </v-btn-toggle>
    </v-col>

    <v-divider />
    <v-card-text>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            class="ma-1"
            v-model="form.name"
            :rules="nameRules"
            label="Department Name (*optional)"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="7">
          <v-text-field
            class="ma-1"
            v-model="form.parent_institution"
            :rules="nameRules"
            label="Parent Institution (*optional)"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            class="ma-1"
            v-model="form.phone_number"
            :rules="phoneRules"
            label="Phone Number (*optional)"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="7">
          <v-text-field
            class="ma-1"
            v-model="form.email_address"
            :rules="emailValidationRules"
            label="Department email Address (*optional)"
          ></v-text-field>
        </v-col>

        <!-- Add New Members Input -->
        <v-col cols="12" md="12">
          <v-textarea
            v-model="form.members"
            v-if="
              showAddNewlDeprtmentMembersInput || currentMembers.length === 0
            "
            :label="`Add new department ${titleCase(activeRole) === 'FACULTY' ? 'FACULTY MEMBERS' : titleCase(activeRole) + 's'} by their emails `"
            class="ml-2"
            :rules="emailRules"
            :hint="`Add new  department ${titleCase(activeRole) === 'FACULTY' ? 'FACULTY MEMBERS' : titleCase(activeRole) + 's'} by registration emails.`"
            persistent-hint
            style="flex-grow: 1; max-width: 100%"
          ></v-textarea>
        </v-col>

        <!-- Members Section -->
        <v-col cols="12" sm="12">
          <v-card-title v-if="currentMembers.length >= 1">
            <v-icon class="mr-2">mdi-account-group</v-icon> Current Deprtment
            {{ titleCase(activeRole)
            }}{{ activeRole === "FACULTY" ? "" : "s" }} :
            {{ currentMembers.length }}
          </v-card-title>

          <v-chip
            v-for="(member, index) in currentMembers"
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
          <small
            v-if="currentMembers.length >= 1"
            class="text-caption text-medium-emphasis"
          >
            <v-icon right class="ml-2 mb-1" size="small" color="pink">
              mdi-lightbulb-on-outline
            </v-icon>
            HINT: Double click delete button to drop a member.
          </small>
        </v-col>
      </v-row>

      <v-divider />
      <v-card-actions style="justify-content: flex-start">
        <v-spacer />
        <v-btn
          color="green"
          :disabled="form.members.length > 100"
          :text="`Add new Departmet ${activeRole === 'FACULTY' ? 'FACULTY MEMBERS' : activeRole + 'S'}`"
          rounded="2"
          prepend-icon="mdi-account-multiple-plus-outline"
          @click="showAddNewlDeprtmentMembersInput = true"
        ></v-btn>
        <v-spacer />
        <v-btn
          color="red"
          :disabled="currentMembers.length === 0"
          :text="`Drop all  ${activeRole === 'FACULTY' ? 'FACULTY MEMBERS' : activeRole + 'S'}`"
          rounded="2"
          prepend-icon="mdi-delete-alert-outline"
          width="12rem"
          @click="wipeAllDeprtmentMembersMembers"
        ></v-btn>
        <v-spacer />
      </v-card-actions>
      <small class="text-caption text-medium-emphasis"
        >*indicates required field</small
      >
    </v-card-text>

    <v-card-actions style="justify-content: flex-end">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text="Submit Departmet Update Details"
        rounded="2"
        :disabled="form.members.length < 1"
        prepend-icon="mdi-content-save-check-outline"
        variant="outlined"
        @click="saveDepartmentManagement()"
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
import { ref, onMounted, computed } from "vue";
import { useDepartmentStore } from "@/stores/departments";
import { useUserStore } from "@/stores/users";
const emailValidation = (value) => {
  const emailArray = value.split(",").map((email) => email.trim());

  if (emailArray.length > 20) return "A maximum of 20 emails are allowed";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const email of emailArray) {
    if (!emailRegex.test(email)) return `${email} is not a valid email`;
  }

  return true;
};

const emailValidationRules = [
  (v) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v) || "Email must be valid";
  },
];
const emailRules = [
  (v) =>
    v.split(",").map((email) => email.trim()).length <= 80 ||
    "A maximum of 80 emails are allowed",
  (v) => {
    const emailArray = v.split(",").map((email) => email.trim());
    const uniqueEmails = new Set(emailArray);
    return (
      uniqueEmails.size === emailArray.length ||
      "Duplicate emails are not allowed"
    );
  },
  (v) => {
    const emailArray = v.split(",").map((email) => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emailArray) {
      if (!emailRegex.test(email)) return `${email} is not a valid email`;
    }
    return true;
  },
];
const nameRules = [
  (v) => (v && v.length <= 355) || "Name must be less than 355 characters",
];

const phoneRules = [
  (v) => /^\+?[0-9\s-]+$/.test(v) || "Phone number must be valid",
];

// Active role toggle
const activeRole = ref("STUDENT");
const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
// Form data
const form = ref({
  name: "",
  parent_institution: "",
  phone_number: "",
  email_address: "",
  members: [],
});

// Show new department member input
const showAddNewlDeprtmentMembersInput = ref(false);

// Department data from store
const department = useUserStore().user.departments[0];

// Separate members by role
const facultyMembers = ref(
  department.faculty.filter((member) => member.role === "FACULTY")
);
const assistantMembers = ref(
  department.faculty.filter((member) => member.role === "ASSISTANT")
);
const studentMembers = ref(department.students);

// Computed array for current role members
const currentMembers = computed(() => {
  if (activeRole.value === "FACULTY") return facultyMembers.value;
  if (activeRole.value === "ASSISTANT") return assistantMembers.value;
  return studentMembers.value;
});

// Remove a member by index
const removeOnDblClick = (index) => {
  form.value.members.splice(index, 1);
};

// Wipe all members
const wipeAllDeprtmentMembersMembers = () => {
  form.value.members = [];
};

// Pre-fill form with valid member emails on mount
const preFillMemberEmails = () => {
  const validEmails = currentMembers.value
    .map((member) => member.personalInfo.email)
    .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  form.value.members = [...form.value.members, ...validEmails];
};
const saveDepartmentManagement = async () => {
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
    await store.handleDepartmentUpdate({
      departmentId: department.departmentId,
      name: form.value.name,
      membershipUpdate: activeRole.value,
      parent_institution: form.value.parent_institution,
      phone_number: form.value.phone_number,
      email_address: form.value.email_address,
      members: validEmails,
    });
  } catch (error) {
    console.error("Failed to create department:", error);
  }
};
onMounted(() => {
  preFillMemberEmails();
});
</script>
