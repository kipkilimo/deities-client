<template>
  <v-container>
    <v-toolbar>
      <v-btn icon="mdi-close" @click="visitStore.writeServiceReport = false"></v-btn>

      <v-toolbar-title
        ><h5 class="text-h5 font-weight-bold mb-4">
          Available Templates
        </h5></v-toolbar-title
      >
      <v-spacer>
        <v-btn
          @click="visitStore.writeServiceReport = false"
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
                v-for="(document, index) in currentStaffTemplates"
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
        <v-card>
          {{ currentVisit.reason }}
        </v-card>
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
const currentStaffTemplates = ref([]); // Holds documents based on staff role

// Access the visit store (if needed in the future)
const visitStore = useVisitStore();

const currentVisit = visitStore.currentVisit;
// Define note types by department
const noteTypesByDepartment = [
  {
    specialty: "CLINICAL",
    documents: [
      {
        type: "Consultation Notes",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-file-document-edit-outline",
      },
      {
        type: "Daily Ward Round Notes",
        category: "Inpatient",
        templateText: "",
        mdiIcon: "mdi-hospital-box-outline",
      },
      {
        type: "Patient Follow-Up Notes",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-file-check-outline",
      },
      {
        type: "Patient Referral Letter",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-email-outline",
      },
    ],
  },

  {
    specialty: "NURSING",
    documents: [
      {
        templateText: "",
        type: "Nursing Care Plan",
        category: "Inpatient",
        mdiIcon: "mdi-nurse",
      },
      {
        templateText: "",
        type: "Vital Signs Chart",
        category: "Inpatient",
        mdiIcon: "mdi-heart-pulse",
      },
      {
        type: "Medication Administration Record",
        category: "Inpatient",
        templateText: "",
        mdiIcon: "mdi-pill",
      },
      {
        type: "Patient Discharge Checklist",
        category: "Inpatient",
        templateText: "",
        mdiIcon: "mdi-clipboard-check-outline",
      },
      {
        type: "Daily Nursing Notes",
        category: "Inpatient",
        templateText: "",
        mdiIcon: "mdi-notebook-check-outline",
      },
    ],
  },
  {
    specialty: "LABORATORY",
    documents: [
      {
        type: "BS for MPs",
        category: "Outpatient",
        templateText:
          "Report findings for malaria parasites (Plasmodium spp.). Fields: Parasites per µL (e.g., 0/µL), Species (e.g., P. falciparum).",
        mdiIcon: "mdi-microscope",
      },
      {
        type: "Malaria MRDT",
        category: "Outpatient",
        templateText:
          "Report results for malaria rapid diagnostic test. Fields: Test Line (Positive/Negative), Control Line (Valid/Invalid).",
        mdiIcon: "mdi-led-strip",
      },
      {
        type: "Full Blood Count (FBC)",
        category: "Outpatient",
        templateText:
          "Fields: Hemoglobin (g/dL), White Blood Cell Count (×10⁹/L), Platelets (×10⁹/L), Red Blood Cell Count (×10¹²/L), Hematocrit (%), Mean Cell Volume (fL).",
        mdiIcon: "mdi-blood-bag",
      },
      {
        type: "Urinalysis",
        category: "Outpatient",
        templateText:
          "Fields: Color (e.g., Yellow), pH (e.g., 5.0-8.0), Specific Gravity (1.005-1.030), Protein (mg/dL), Glucose (mg/dL), Ketones (mg/dL).",
        mdiIcon: "mdi-flask-outline",
      },
      {
        type: "Stool Analysis",
        category: "Outpatient",
        templateText:
          "Fields: Color (e.g., Brown), Consistency (e.g., Formed/Loose), Microscopy (e.g., Ova/Cysts/Trophozoites), Occult Blood (Positive/Negative).",
        mdiIcon: "mdi-toilet",
      },
      {
        type: "HIV Test",
        category: "Outpatient",
        templateText:
          "Fields: Test Result (Positive/Negative), Test Line (Present/Absent), Control Line (Valid/Invalid).",
        mdiIcon: "mdi-virus",
      },
      {
        type: "Blood Grouping",
        category: "Outpatient",
        templateText:
          "Fields: Blood Group (A/B/AB/O), Rhesus Factor (Positive/Negative).",
        mdiIcon: "mdi-water",
      },
      {
        type: "HbA1c Test",
        category: "Outpatient",
        templateText: "Fields: HbA1c (%) (e.g., <6.5 for good glycemic control).",
        mdiIcon: "mdi-diabetes",
      },
      {
        type: "Liver Function Test (LFT)",
        category: "Outpatient",
        templateText:
          "Fields: ALT (U/L), AST (U/L), ALP (U/L), Bilirubin (mg/dL), Albumin (g/dL), Total Protein (g/dL).",
        mdiIcon: "mdi-test-tube",
      },
      {
        type: "Kidney Function Test (KFT)",
        category: "Outpatient",
        templateText:
          "Fields: Creatinine (mg/dL), Urea (mg/dL), Uric Acid (mg/dL), GFR (mL/min/1.73m²).",
        mdiIcon: "mdi-test-tube",
      },
      {
        type: "Typhoid Test (Widal Test)",
        category: "Outpatient",
        templateText:
          "Fields: S. typhi O (1:X dilution), S. typhi H (1:X dilution), Interpretation (Reactive/Non-reactive).",
        mdiIcon: "mdi-test-tube",
      },
      {
        type: "H. Pylori Test",
        category: "Outpatient",
        templateText:
          "Fields: Test Result (Positive/Negative), Method (e.g., Stool Antigen/Serology).",
        mdiIcon: "mdi-test-tube",
      },
      {
        type: "Other Unspecified Test",
        category: "Outpatient",
        templateText:
          "Fields: Test Result (Positive/Negative), Method (e.g., Stool Antigen/Serology).",
        mdiIcon: "mdi-test-tube",
      },
    ],
  },
  {
    specialty: "PHARMACY",
    documents: [
      {
        templateText: "",
        type: "Prescription",
        category: "Outpatient",
        mdiIcon: "mdi-pill",
      },
      {
        type: "Pharmacy Requisition Form",
        category: "Inpatient",
        templateText: "",
        mdiIcon: "mdi-file-document-outline",
      },
      {
        type: "Medication Dispensing Log",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-notebook-outline",
      },
      {
        type: "Drug Interaction Report",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-alert-circle-outline",
      },
      {
        type: "Controlled Drug Register",
        category: "Inpatient",
        templateText: "",
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
        templateText: "",
        mdiIcon: "mdi-file-document-multiple-outline",
      },
      {
        type: "Discharge Summary",
        category: "Inpatient",
        templateText: "",
        mdiIcon: "mdi-file-export-outline",
      },
      {
        type: "Medical History Form",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-folder-history-outline",
      },
      {
        type: "Patient Identification Label",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-barcode-scan",
      },
      {
        type: "Health Insurance Claim Form",
        category: "Outpatient",
        templateText: "",
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
        templateText: "",
        mdiIcon: "mdi-arm-flex-outline",
      },
      {
        type: "Rehabilitation Progress Notes",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-run-fast",
      },
      {
        templateText: "",
        type: "Exercise Plan",
        category: "Outpatient",
        mdiIcon: "mdi-dumbbell",
      },
      {
        type: "Patient Education Leaflet",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-school-outline",
      },
      {
        type: "Treatment Completion Certificate",
        category: "Outpatient",
        templateText: "",
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
        templateText: "",
        mdiIcon: "mdi-food-apple-outline",
      },
      {
        templateText: "",
        type: "Meal Plan",
        category: "Outpatient",
        mdiIcon: "mdi-silverware-fork-knife",
      },
      {
        type: "Nutritional Status Report",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-chart-bar",
      },
      {
        type: "Health Education Leaflet",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-school-outline",
      },
      {
        type: "Food Allergy Record",
        category: "Outpatient",
        templateText: "",
        mdiIcon: "mdi-alert-circle-outline",
      },
    ],
  },
];

// Function to get selected test names based on allowed types
function getSelectedTestNames(documents, allowedTypes) {
  if (!Array.isArray(documents) || !Array.isArray(allowedTypes)) {
    return []; // Return an empty array if inputs are not valid arrays
  }

  // Convert allowed types to uppercase for case-insensitive comparison
  const allowedTypesUpper = allowedTypes.map((type) => type.toUpperCase());

  // Filter and map the documents
  return documents
    .filter((doc) => allowedTypesUpper.includes(doc.type.toUpperCase()))
    .map((doc) => doc.type.toUpperCase());
}

// Function to populate templates based on the current staff role
const populateTemplatesForRole = () => {
  // Find the department based on the current staff role
  const department = noteTypesByDepartment.find(
    (dept) => dept.specialty === currentStaffRole.value
  );

  // Populate the current staff templates if department and reason exist
  currentStaffTemplates.value = department ? department.documents : [];
};

// Populate documents when the component is mounted
onBeforeMount(() => {
  currentStaffRole.value = staffStore.staff.role; // Set the staff role (e.g., "NURSING")
  populateTemplatesForRole(); // Populate the documents for the current role
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
