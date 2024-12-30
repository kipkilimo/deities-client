<template>
    <v-card prepend-icon="mdi-account" title="Add Staff Member">
        <v-divider />
        <v-card-text>
            <v-form ref="form" v-model="valid">
                <v-row dense class="ma-2">
                    <!-- Full Name -->
                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.fullName" label="Full Name*" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>

                    <!-- Email Address -->
                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.emailAddress" label="Email*"
                            :rules="[rules.required, rules.email]" required></v-text-field>
                    </v-col>

                    <!-- Phone Number -->
                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.phoneNumber" label="Phone Number*" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>

                    <!-- Year of Birth -->
                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.yearOfBirth" label="Year of Birth*" type="number"
                            :rules="[rules.required, rules.validYear]" required></v-text-field>
                    </v-col>

                    <!-- Department -->
                    <v-col cols="12" md="6" sm="12">
                        <v-select v-model="formInputs.department" :items="departments" label="Department*"
                            :rules="[rules.required]" required></v-select>
                    </v-col>

                    <!-- Role -->
                    <v-col cols="12" md="6" sm="12">
                        <v-select v-model="formInputs.role" :items="roles" label="Role*" :rules="[rules.required]"
                            required></v-select>
                    </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="staffStore.addingStaff = false">Close</v-btn>
            <v-btn :disabled="!valid" color="primary" text="Save" variant="tonal" @click="handleSubmit">Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useStaffStore } from "@/stores/staff";
import { useRouter, useRoute } from "vue-router";

const staffStore = useStaffStore()

// Reactive form inputs
const formInputs = ref({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    yearOfBirth: null,
    department: "",
    role: "",
});

// Departments and roles
const departments = ["Clinical", "Records", "Laboratory", "Nursing", "Accounts"];
const roles = [

    "DOCTOR",
    "NURSING",
    "ADMINISTRATIVE",
    "LAB_TECHNICIAN",
    "PHARMACIST",
    "SURGEON",
    "RECORDS",
    "CLINICAL",
    " PHARMARCY",
    "LABORATORY",
    "ACCOUNTANT",
    "SUPPORT_STAFF",
    "OTHER",
];

// Form validation rules
const rules = {
    required: (value) => !!value || "This field is required",
    email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
    validYear: (value) =>
        (value && value > 1900 && value <= new Date().getFullYear()) || "Enter a valid year",
};

// Form validity
const valid = ref(false);
const form = ref(null);

// Submit handler
const handleSubmit = async () => {
    const yobString = `${String(formInputs.value.yearOfBirth)}`
    if (form.value.validate()) {
        await staffStore.addStaffMember(
            String(formInputs.value.fullName), // Ensure it's a string
            String(formInputs.value.emailAddress), // Ensure it's a string
            String(formInputs.value.phoneNumber), // Ensure it's a string
            String(yobString), // Convert to string
            String(formInputs.value.department), // Ensure it's a string
            String(formInputs.value.role), // Ensure it's a string
        );
        staffStore.addingStaff = false
    }
};

</script>
