<template>
  <v-container>
    <v-toolbar>
      <v-btn icon="mdi-close" @click="visitStore.createPatientNotes = false"></v-btn>

      <v-toolbar-title
        ><h5 class="text-h5 font-weight-bold mb-4">
          Available Documents
        </h5></v-toolbar-title
      >
      <v-spacer>
        <v-btn
          @click="visitStore.createPatientNotes = false"
          class="mt-4 text-none"
          color="#009ee3"
          prepend-icon="mdi-home"
          variant="text"
        >
          BACK HOME
        </v-btn>
      </v-spacer>
    </v-toolbar>
    <v-row>
      <v-col cols="3" class="scrollable-container">
        <v-card full-width class="mb-1">
          <div>
            <v-row>
              <v-col
                v-for="(document, index) in currentStaffDocuments"
                :key="index"
                cols="12"
              >
                <v-chip
                  class=""
                  rounded
                  size="large"
                  color="primary"
                  text-color="white"
                  variant="outlined"
                  elevation="3"
                  @click="setActiveDocumentForm(document)"
                  style="width: 94%"
                >
                  <v-icon :icon="document.mdiIcon" start></v-icon>
                  {{ document.type }}
                </v-chip>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card> </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { useStaffStore } from "@/stores/staff";
import { useVisitStore } from "@/stores/visits"; // Import the visit store

// Access the staff store
const staffStore = useStaffStore();

// Staff role (e.g., "CLINICAL", "NURSING")
const currentStaffRole = ref(""); // Will be set dynamically on mount
const currentStaffDocuments = ref([]); // Holds documents based on staff role

// Access the visit store (if needed in the future)
const visitStore = useVisitStore();

// Define note types by department
const noteTypesByDepartment = [
  {
    specialty: "CLINICAL",
    documents: [
      {
        type: "Consultation Notes",
        category: "Outpatient",
        mdiIcon: "mdi-file-document-edit-outline",
      },
      {
        type: "Daily Ward Round Notes",
        category: "Inpatient",
        mdiIcon: "mdi-hospital-box-outline",
      },
      {
        type: "Patient Follow-Up Notes",
        category: "Outpatient",
        mdiIcon: "mdi-file-check-outline",
      },
      {
        type: "Patient Referral Letter",
        category: "Outpatient",
        mdiIcon: "mdi-email-outline",
      },

      { type: "Prescription", category: "Outpatient", mdiIcon: "mdi-pill" },

      {
        type: "Informed Consent Form",
        category: "Inpatient",
        mdiIcon: "mdi-pencil-box-outline",
      },
      {
        type: "Preoperative Assessment Form",
        category: "Inpatient",
        mdiIcon: "mdi-clipboard-text-outline",
      },
      {
        type: "Anesthesia Consent Form",
        category: "Inpatient",
        mdiIcon: "mdi-pencil-box-outline",
      },
      {
        type: "Anesthesia Notes and Care Plan",
        category: "Inpatient",
        mdiIcon: "mdi-notebook-check-outline",
      },
      {
        type: "Surgical Safety Checklist",
        category: "Inpatient",
        mdiIcon: "mdi-clipboard-list-outline",
      },
      {
        type: "Operative Notes and Care Plan",
        category: "Inpatient",
        mdiIcon: "mdi-notebook-check-outline",
      },
      {
        type: "Follow-Up Notes",
        category: "Outpatient",
        mdiIcon: "mdi-notebook-check-outline",
      },

      {
        type: "Discharge Summary",
        category: "Inpatient",
        mdiIcon: "mdi-file-export-outline",
      },
      { type: "Observation Chart", category: "Inpatient", mdiIcon: "mdi-chart-line" },
      // { type: "Operative Notes", category: "Inpatient", mdiIcon: "mdi-scalpel" },
      // { type: "ECG Report", category: "Outpatient", mdiIcon: "mdi-heart-pulse" },
      // { type: "Stress Test Report", category: "Outpatient", mdiIcon: "mdi-run-fast" },
      // { type: "Immunization Record", category: "Outpatient", mdiIcon: "mdi-syringe" },
      // {
      //   type: "Growth Monitoring Chart",
      //   category: "Outpatient",
      //   mdiIcon: "mdi-chart-areaspline",
      // },
      // {
      //   type: "Daily Ward Notes (Pediatrics)",
      //   category: "Inpatient",
      //   mdiIcon: "mdi-hospital-box-outline",
      // },
      // {
      //   type: "Laboratory Test Results",
      //   category: "Outpatient",
      //   mdiIcon: "mdi-test-tube",
      // },
      // {
      //   type: "Radiology Report",
      //   category: "Outpatient",
      //   mdiIcon: "mdi-radiology-box-outline",
      // },
      // { type: "Nursing Care Plan", category: "Inpatient", mdiIcon: "mdi-nurse" },
      // {
      //   type: "Physical Therapy Notes",
      //   category: "Outpatient",
      //   mdiIcon: "mdi-arm-flex-outline",
      // },
      // { type: "Pathology Report", category: "Outpatient", mdiIcon: "mdi-microscope" },
      // {
      //   type: "Health Education Leaflet",
      //   category: "Outpatient",
      //   mdiIcon: "mdi-school-outline",
      // },
      // {
      //   type: "Dietary Assessment Form",
      //   category: "Outpatient",
      //   mdiIcon: "mdi-food-apple-outline",
      // },
      // {
      //   type: "Patient Transfer Form",
      //   category: "Inpatient",
      //   mdiIcon: "mdi-transfer-right",
      // },
      // {
      //   type: "Blood Transfusion Consent",
      //   category: "Inpatient",
      //   mdiIcon: "mdi-water-plus-outline",
      // },
    ],
  },

  {
    specialty: "NURSING",
    documents: [
      { type: "Nursing Care Plan", category: "Inpatient", mdiIcon: "mdi-nurse" },
      { type: "Vital Signs Chart", category: "Inpatient", mdiIcon: "mdi-heart-pulse" },
      {
        type: "Medication Administration Record",
        category: "Inpatient",
        mdiIcon: "mdi-pill",
      },
      {
        type: "Patient Discharge Checklist",
        category: "Inpatient",
        mdiIcon: "mdi-clipboard-check-outline",
      },
      {
        type: "Daily Nursing Notes",
        category: "Inpatient",
        mdiIcon: "mdi-notebook-check-outline",
      },
    ],
  },
  {
    specialty: "LABORATORY",
    documents: [
      {
        type: "Laboratory Test Request Form",
        category: "Outpatient",
        mdiIcon: "mdi-test-tube",
      },
      { type: "Pathology Report", category: "Outpatient", mdiIcon: "mdi-microscope" },
      {
        type: "Blood Test Results",
        category: "Outpatient",
        mdiIcon: "mdi-water-outline",
      },
      {
        type: "Urinalysis Report",
        category: "Outpatient",
        mdiIcon: "mdi-beaker-outline",
      },
      {
        type: "Culture and Sensitivity Report",
        category: "Outpatient",
        mdiIcon: "mdi-flask-outline",
      },
    ],
  },
  {
    specialty: "PHARMACY",
    documents: [
      { type: "Prescription", category: "Outpatient", mdiIcon: "mdi-pill" },
      {
        type: "Pharmacy Requisition Form",
        category: "Inpatient",
        mdiIcon: "mdi-file-document-outline",
      },
      {
        type: "Medication Dispensing Log",
        category: "Outpatient",
        mdiIcon: "mdi-notebook-outline",
      },
      {
        type: "Drug Interaction Report",
        category: "Outpatient",
        mdiIcon: "mdi-alert-circle-outline",
      },
      {
        type: "Controlled Drug Register",
        category: "Inpatient",
        mdiIcon: "mdi-lock-outline",
      },
    ],
  },
  {
    specialty: "RECORDS",
    documents: [
      {
        type: "Patient Admission Form",
        category: "Inpatient",
        mdiIcon: "mdi-file-document-multiple-outline",
      },
      {
        type: "Discharge Summary",
        category: "Inpatient",
        mdiIcon: "mdi-file-export-outline",
      },
      {
        type: "Medical History Form",
        category: "Outpatient",
        mdiIcon: "mdi-folder-history-outline",
      },
      {
        type: "Patient Identification Label",
        category: "Outpatient",
        mdiIcon: "mdi-barcode-scan",
      },
      {
        type: "Health Insurance Claim Form",
        category: "Outpatient",
        mdiIcon: "mdi-cash-register",
      },
    ],
  },
  {
    specialty: "PHYSIOTHERAPY",
    documents: [
      {
        type: "Physical Therapy Assessment Form",
        category: "Outpatient",
        mdiIcon: "mdi-arm-flex-outline",
      },
      {
        type: "Rehabilitation Progress Notes",
        category: "Outpatient",
        mdiIcon: "mdi-run-fast",
      },
      { type: "Exercise Plan", category: "Outpatient", mdiIcon: "mdi-dumbbell" },
      {
        type: "Patient Education Leaflet",
        category: "Outpatient",
        mdiIcon: "mdi-school-outline",
      },
      {
        type: "Treatment Completion Certificate",
        category: "Outpatient",
        mdiIcon: "mdi-certificate-outline",
      },
    ],
  },
  {
    specialty: "NUTRITION",
    documents: [
      {
        type: "Dietary Assessment Form",
        category: "Outpatient",
        mdiIcon: "mdi-food-apple-outline",
      },
      { type: "Meal Plan", category: "Outpatient", mdiIcon: "mdi-silverware-fork-knife" },
      {
        type: "Nutritional Status Report",
        category: "Outpatient",
        mdiIcon: "mdi-chart-bar",
      },
      {
        type: "Health Education Leaflet",
        category: "Outpatient",
        mdiIcon: "mdi-school-outline",
      },
      {
        type: "Food Allergy Record",
        category: "Outpatient",
        mdiIcon: "mdi-alert-circle-outline",
      },
    ],
  },
];

// Function to populate documents based on staff role
const populateDocumentsForRole = () => {
  const department = noteTypesByDepartment.find(
    (dept) => dept.specialty === currentStaffRole.value
  );
  currentStaffDocuments.value = department ? department.documents : [];
};

// Populate documents when the component is mounted
onBeforeMount(() => {
  currentStaffRole.value = staffStore.staff.role; // Set the staff role (e.g., "NURSING")
  populateDocumentsForRole(); // Populate the documents for the current role
});
</script>
<style scoped>
.scrollable-container {
  max-height: 93vh; /* Adjust height as needed */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ddd; /* Optional: Add a border for better visual separation */
  border-radius: 8px; /* Optional: Rounded corners for a pleasant look */
  background-color: #f9f9f9; /* Optional: Light background for contrast */
}
</style>
