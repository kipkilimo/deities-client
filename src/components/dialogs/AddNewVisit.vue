<template>
    <v-card prepend-icon="mdi-account-check-outline" title="Found a match!">
        <!-- Display success message -->
        <v-alert v-if="visitResponse.includes('Success')" type="success" class="mt-3">
            {{ visitResponse }}
        </v-alert>

        <!-- Display error message -->
        <v-alert v-if="visitResponse.includes('Error')" type="error" class="mt-3">
            {{ visitResponse }}
        </v-alert>
        <v-card v-if="!showNewVisitForm" color="success" variant="tonal" class="mx-auto mb-2" width="96%">
            <v-card-item>
                <div>
                    <div class="text-overline mb-1">
                        Patient ID : {{ patientStore.patient.personalInfo.patientId }}
                    </div>
                    <div class="text-h6 mb-1">
                        Name: {{ patientStore.patient.personalInfo.fullName }}
                    </div>
                    <div class="text-caption">YOB: {{ patientStore.patient.personalInfo.yearOfBirth }} Gender:
                        {{ patientStore.patient.personalInfo.gender }}
                    </div>
                </div>
            </v-card-item>
            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn @click="showNewVisitForm = true" variant="outlined" color="blue">
                    Create New Visit
                </v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
        <v-divider />
        <v-card-text v-if="showNewVisitForm">
            <v-form ref="form" v-model="valid">
                <v-row dense class="ma-2">
                    <!-- Visit Information -->

                    <v-col cols="12" md="6" sm="12">
                        <v-select v-model="formInputs.visitType" :items="visitTypes" label="Visit Type*"
                            :rules="[rules.required]" required></v-select>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-select v-model="formInputs.doctor" :items="doctorsArray" label="Service point*"
                            :rules="[rules.required]" required></v-select>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-select v-model="formInputs.reason" :items="departmentServicesArray" multiple
                            label="Requested service(s)*" :rules="[rules.required]" required></v-select>
                    </v-col>

                </v-row>

                <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="visitStore.createNewVisit = false">Close</v-btn>
            <v-btn :disabled="!valid" color="primary" text="Save" variant="tonal" @click="handleSubmit">Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useVisitStore } from "@/stores/visits"; // Import the visit store
import * as XLSX from "xlsx";

const visitStore = useVisitStore();
import { usePatientStore } from "@/stores/patients";

const doctorsArray = ref(["Clinical", "Records", "Laboratory", "Nursing", "Accounts"])
const departmentServicesArray = ref([])
const patientStore = usePatientStore()
const showNewVisitForm = ref(false)
// Reactive form inputs
/*
   visitType: VisitType! # In form input
    visitStartDateTime: Date!
    visitEndDateTime: Date
    visitStatus: VisitStatus
    doctor: String!  # In form input
    reason: String!  # In form input
*/
const formInputs = ref({
    visitNumber: "",
    visitStartDateTime: "",
    visitEndDateTime: "",
    visitType: "OUTPATIENT",
    doctor: "",
    reason: [],
});

// Visit type options
const visitTypes = ["OUTPATIENT"];

// Form validation rules
const rules = {
    required: (value) => !!value || "This field is required",
};

// Form validity
const valid = ref(false);
const form = ref(null);
const departments = doctorsArray.value;
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

// Map departments to roles
const departmentToRoleMap = {
    Clinical: "CLINICAL",
    Records: "RECORDS",
    Laboratory: "LABORATORY",
    Nursing: "NURSING",
    Accounts: "ACCOUNTANT",
};

// Function to get role by department
function getRoleByDepartment(department) {
    return departmentToRoleMap[department] || "OTHER"; // Default to "OTHER" if no match is found
}
// Fetch and process the Excel file
async function fetchServices() {
    try {
        const response = await fetch(
            "https://a2z-v0.s3.eu-central-1.amazonaws.com/amane_services.xlsx"
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Iterate through all sheets and fetch their data
        const allSheetsData = {};
        workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet);
            allSheetsData[sheetName] = sheetData; // Store each sheet's data under its name
        });

        // Return the parsed data from all sheets
        return allSheetsData;
    } catch (error) {
        console.error("Error fetching or parsing Excel file:", error);
        return {};
    }
}

// Watch for changes in the selected doctor and filter services
watch(
    () => formInputs.value.doctor,
    async (selectedDoctor) => {
        if (!selectedDoctor) {
            departmentServicesArray.value = [];
            return;
        }

        const allServices = await fetchServices();
        console.log(allServices)
        // Filter services matching the selected doctor and 'CLINICAL'
        function getServicesByDepartment(data, departmentName) {
            if (data[departmentName]) {
                return data[departmentName];
            } else {
                throw new Error(`Department '${departmentName}' not found.`);
            }
        }
        const servicePoint = getRoleByDepartment(formInputs.value.doctor)
        const activeServices = getServicesByDepartment(allServices, servicePoint);
        departmentServicesArray.value = activeServices.map((service => service.__EMPTY)).slice(1)


    }
);
const visitResponse = ref(""); // Variable to store response 
// Submit handler
const handleSubmit = async () => {
    if (form.value.validate()) {
        const payload = {
            createdBy: localStorage.getItem('sessionId') || "",
            visitNumber: formInputs.value.visitNumber,
            visitStartDateTime: formInputs.value.visitStartDateTime,
            visitEndDateTime: formInputs.value.visitEndDateTime,
            visitStatus: "PENDING",  // Default to PENDING
            visitType: formInputs.value.visitType,
            doctor: formInputs.value.doctor,
            reason: JSON.stringify(formInputs.value.reason),
            patientId: patientStore.patient.id, // Replace with dynamic patient ID if needed
        };

        await visitStore.createVisit(payload).then((result) => {
            visitResponse.value = result;
        });
        setTimeout(() => {
            900
        }, window.location.reload());

    }
};
</script>
