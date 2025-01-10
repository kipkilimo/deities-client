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
    <v-card
      v-if="!showNewVisitForm"
      color="success"
      variant="tonal"
      class="mx-auto mb-2"
      width="96%"
    >
      <v-card-item>
        <div>
          <div class="text-overline mb-1">
            Patient ID : {{ patientStore.patient.personalInfo.patientId }}
          </div>
          <div class="text-h6 mb-1">
            Name: {{ patientStore.patient.personalInfo.fullName }}
          </div>
          <div class="text-caption">
            YOB: {{ patientStore.patient.personalInfo.yearOfBirth }} Gender:
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
            <v-select
              v-model="formInputs.visitType"
              :items="visitTypes"
              label="Visit Type*"
              :rules="[rules.required]"
              required
            ></v-select>
          </v-col>

          <v-col cols="12" md="6" sm="12">
            <v-select
              v-model="formInputs.doctor"
              :items="doctorsArray"
              label="Service point*"
              :rules="[rules.required]"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-select
              v-model="formInputs.reason"
              :items="departmentServicesArray"
              multiple
              label="Requested service(s)*"
              :rules="[rules.required]"
              required
            ></v-select>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*indicates required field</small>
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text="Close" variant="plain" @click="visitStore.createNewVisit = false"
        >Close</v-btn
      >
      <v-btn
        :disabled="!valid"
        color="primary"
        text="Save"
        variant="tonal"
        @click="handleSubmit"
        >Save</v-btn
      >
    </v-card-actions>
    <v-dialog v-model="showPrintVisitForm">
      <v-card with="81mm">
        <div
          id="pdf"
          style="
            font-family: monospace;
            font-size: 12px;
            max-width: 80mm;
            margin: 0 auto;
            text-align: left;
          "
        >
          <!-- Header Section -->
          <div style="text-align: center; margin-bottom: 10px">
            <img
              src="https://a2z-v0.s3.eu-central-1.amazonaws.com/Amane_Logo_Final.png"
              alt="Amane Logo"
              style="height: 50px; margin-bottom: 5px"
            />
            <h3 style="margin: 0; font-size: 14px">Amane Cottage Hospital</h3>
            <p style="margin: 0">PO BOX 61 Busia KE 50400</p>
            <p style="margin: 0">Tel: +254 713 412 265</p>
            <p style="margin: 0">amanecottagehospital@gmail.com</p>
          </div>

          <!-- Invoice Details -->
          <h4
            style="
              margin: 5px 0;
              text-align: center;
              text-transform: uppercase;
              font-size: 18px;
            "
          >
            {{ visitStore.currentVisit.visitNumber }}
          </h4>

          <p>Patient: {{ visitStore.currentVisit.patient.personalInfo.fullName }}</p>
          <p>ID: {{ visitStore.currentVisit.patient.personalInfo.patientId }}</p>
          <p>
            Date:{{
              new Intl.DateTimeFormat("en-GB", {
                weekday: "long", // Full weekday name (e.g., Tuesday)
                day: "2-digit", // Two-digit day (e.g., 10)
                month: "long", // Full month name (e.g., December)
                year: "numeric", // Full year (e.g., 2024)
                hour: "2-digit", // Two-digit hour (e.g., 05)
                minute: "2-digit", // Two-digit minute (e.g., 36)
                hour12: true, // Ensures 12-hour format with AM/PM
              }).format(new Date(visitStore.currentVisit.visitStartDateTime))
            }}
          </p>

          <!-- Invoice Table -->
          <v-footer class="footer">
            <v-row class="text-center">
              <v-col cols="12">
                <v-list density="compact" no-action>
                  <v-toolbar-title
                    color="#3d7187"
                    class="mb-1 font-weight-black text-left"
                    >Services of the Amane Hospital
                  </v-toolbar-title>
                  <v-list-item
                    no-action
                    v-for="(item, i) in objectives"
                    :key="i"
                    :value="item"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <v-icon :icon="item.icon"></v-icon>
                    </template>

                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-divider />
              <v-col cols="12">
                <div style="text-align: center; margin-top: 10px">
                  <p style="margin: 0">Pay bills only on MPESA prompt</p>
                  <p style="margin: 0">COUNTYSQUARE BUSINESS SOLUTIONS</p>
                  <p style="margin: 0">Feedback: +254700378241</p>
                </div>
                <p>
                  Burumba Estate, Busia,KE. 📞+254713412265 💬 0700378241 📧
                  amanecottagehospital@gmail.com
                </p>
              </v-col>
            </v-row>
          </v-footer>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useVisitStore } from "@/stores/visits"; // Import the visit store
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

const visitStore = useVisitStore();
import { usePatientStore } from "@/stores/patients";
const objectives = [
  {
    text: "Provide compassionate primary care for individuals and families.",
    icon: "mdi-heart-outline",
  },
  {
    text: "Deliver comprehensive OB/GYN services for women's health.",
    icon: "mdi-human-female",
  },
  {
    text: "Perform safe and specialized surgical procedures.",
    icon: "mdi-bandage",
  },
  {
    text: "Offer community health screenings for early disease detection.",
    icon: "mdi-hospital-box-outline",
  },
  {
    text: "Promote wellness through preventive care and education.",
    icon: "mdi-school-outline",
  },
  {
    text: "Build lasting relationships to enhance community health.",
    icon: "mdi-account-group-outline",
  },
];
const doctorsArray = ref(["Clinical", "Records", "Laboratory", "Nursing", "Accounts"]);
const departmentServicesArray = ref([]);
const patientStore = usePatientStore();
const showNewVisitForm = ref(false);
const showPrintVisitForm = ref(false);
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
  "PHARMARCY",
  "LABORATORY",
  "ACCOUNTANT",
  "SUPPORT_STAFF",
  "OTHER_STAFF",
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
  return departmentToRoleMap[department] || "OTHER_STAFF"; // Default to "OTHER_STAFF" if no match is found
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
    console.log(allServices);
    // Filter services matching the selected doctor and 'CLINICAL'
    function getServicesByDepartment(data, departmentName) {
      if (data[departmentName]) {
        return data[departmentName];
      } else {
        throw new Error(`Department '${departmentName}' not found.`);
      }
    }
    const servicePoint = getRoleByDepartment(formInputs.value.doctor);
    const activeServices = getServicesByDepartment(allServices, servicePoint);
    departmentServicesArray.value = activeServices
      .map((service) => service.__EMPTY)
      .slice(1);
  }
);
const visitResponse = ref(""); // Variable to store response
// Submit handler
const handleSubmit = async () => {
  if (form.value.validate()) {
    const payload = {
      createdBy: localStorage.getItem("sessionId") || "",
      visitNumber: formInputs.value.visitNumber,
      visitStartDateTime: formInputs.value.visitStartDateTime,
      visitEndDateTime: formInputs.value.visitEndDateTime,
      visitStatus: "PENDING", // Default to PENDING
      visitType: formInputs.value.visitType,
      doctor: formInputs.value.doctor,
      reason: JSON.stringify(formInputs.value.reason),
      patientId: patientStore.patient.id, // Replace with dynamic patient ID if needed
    };

    await visitStore.createVisit(payload).then((result) => {
      visitResponse.value = result;
      if (result.includes("Success")) {
        // print visit details
        printReceiptPDF();
        setTimeout(() => {
          6300;
        }, window.location.reload());
      }
    });
  }
};
const printReceiptPDF = async () => {
  const element = document.getElementById("pdf");

  const options = {
    margin: [5, 5],
    filename: `Amane Outpatient Visit ${
      visitStore.currentVisit.patient.personalInfo.fullName
    }_${new Date(Date.now())}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(options).from(element).save();
};
</script>
