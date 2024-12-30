<template>
    <v-card prepend-icon="mdi-account" title="Add New Patient">
        <v-divider />
        <v-card-text>
            <v-form ref="form" v-model="valid">
                <v-row dense class="ma-2">
                    <!-- Personal Information -->
                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.personalInfo.fullName" label="Full Name*"
                            :rules="[rules.required]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.personalInfo.emailAddress" label="Email Address*"
                            :rules="[rules.required, rules.email]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.personalInfo.phoneNumber" label="Phone Number*"
                            :rules="[rules.required]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.personalInfo.yearOfBirth" label="Year of Birth*"
                            :rules="[rules.required, rules.validYear]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-select v-model="formInputs.personalInfo.gender" :items="genders" label="Gender*"
                            :rules="[rules.required]" required></v-select>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.personalInfo.insuranceRegNumber"
                            label="Insurance Registration Number"></v-text-field>
                    </v-col>

                    <!-- Next of Kin Information -->
                    <v-divider class="mt-4 mb-4"></v-divider>
                    <v-col cols="12" class="mb-2">
                        <h6>Next of Kin Information</h6>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.nextOfKin.fullName" label="Full Name*"
                            :rules="[rules.required]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.nextOfKin.relationSpecify" label="Relationship*"
                            :rules="[rules.required]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.nextOfKin.phoneNumber" label="Phone Number*"
                            :rules="[rules.required]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="formInputs.nextOfKin.emailAddress" label="Email Address"
                            :rules="[rules.email]"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-textarea v-model="formInputs.nextOfKin.homeAddress" label="Home Address*"
                            :rules="[rules.required]" required></v-textarea>
                    </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="patientStore.addingPatient = false">Close</v-btn>
            <v-btn :disabled="!valid" color="primary" text="Save" variant="tonal" @click="handleSubmit">Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from "vue";
import { usePatientStore } from "@/stores/patients";


const patientStore = usePatientStore()
// Reactive form inputs
const formInputs = ref({
    personalInfo: {
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        yearOfBirth: "",
        gender: "",
        insuranceRegNumber: "",
    },
    nextOfKin: {
        fullName: "",
        relationSpecify: "",
        phoneNumber: "",
        emailAddress: "",
        homeAddress: "",
    },
});

// Gender options
const genders = ["Male", "Female"];

// Form validation rules
const rules = {
    required: (value) => !!value || "This field is required",
    email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
    validYear: (value) => {
        const year = parseInt(value, 10); // Convert the string to an integer
        return (year && year > 1900 && year <= new Date().getFullYear()) || "Enter a valid year";
    },

};

// Form validity
const valid = ref(false);
const form = ref(null);

// Cancel form handler
const cancelForm = () => {
    // Reset form inputs or close modal logic
};

// Submit handler
const handleSubmit = async () => {
    if (form.value.validate()) {
        const payload = {
            personalInfo: { ...formInputs.value.personalInfo },
            nextOfKin: { ...formInputs.value.nextOfKin },
        };
        await patientStore.addPatient(payload.personalInfo, payload.nextOfKin)
        // Logic to send payload to GraphQL server
        patientStore.addingPatient = false;
        visitStore.createNewVisit = true
    }
};
</script>
