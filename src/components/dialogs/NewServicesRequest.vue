<template>
    <v-container fluid class="py-5">
        <v-row class="justify-center">
            <!-- Select Service Point -->
            <v-col cols="4">
                <v-card-title class="text-h6 font-weight-bold text-center">
                    Choose Service Point
                </v-card-title>
                <v-card-text>
                    <v-select :items="amaneDepartments" v-model="sentToDepartment" density="comfortable"
                        label="Service Point"></v-select>
                </v-card-text>
            </v-col>

            <!-- Select Services -->
            <v-col cols="8">
                <v-card-title class="text-h6 font-weight-bold text-center">
                    Select Services
                </v-card-title>
                <v-card-text>
                    <v-select :items="departmentServicesArray.slice(1)" v-model="requestedServices"
                        density="comfortable" label="Available Services" multiple></v-select>
                </v-card-text>
            </v-col>

            <!-- Selected Services Display -->
            <v-col cols="12" class="text-center">
                <v-card outlined class="pa-4">
                    <v-card-text>
                        <v-chip v-for="(service, index) in requestedServices" :key="service" class="ma-2"
                            color="#0e234f" closable @click:close="removeService(service)" variant="outlined">
                            <v-icon icon="mdi-medical-bag" start></v-icon>
                            {{ service }}
                        </v-chip>


                    </v-card-text>
                </v-card>
            </v-col>
            <v-spacer />
            <v-spacer />
            <v-card-actions>
                <v-btn @click="submitExternalServices()" class="me-2 text-none" color="#009ee3"
                    prepend-icon="mdi-invoice-text-check-outline" variant="flat">
                    Submit services request
                    <v-spacer />
                </v-btn>
                <v-spacer />
                <v-btn color="red" @click="invoiceStore.createNewServiceList = false" density="compact"
                    icon="mdi-close"></v-btn>
            </v-card-actions>
        </v-row>
    </v-container>
</template>
<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount } from "vue";
import { useInvoiceStore } from "@/stores/invoices"; // Import the invoice store
import { useVisitStore } from "@/stores/visits"; // Import the invoice store
const sentToDepartment = ref("");
const requestedServices = ref([]);

const visitStore = useVisitStore();
const loading = ref(false);
// import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";

const invoiceStore = useInvoiceStore();
const wsUrl = import.meta.env.VITE_BASE_WS_URL; // Get the WebSocket URL from env 
// Define the method to remove a service by its value
function removeService(service) {
    const index = requestedServices.value.indexOf(service); // Find the index of the service
    if (index !== -1) {
        requestedServices.value.splice(index, 1); // Remove the service by index
    }
}
// WebSocket Instance
let ws = null;

// Function to initialize WebSocket
function initializeWebSocket() {
    // Ensure WebSocket is not already initialized
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("WebSocket is already connected.");
        return; // Exit if already connected
    }

    // Create a new WebSocket connection
    ws = new WebSocket(wsUrl);

    // When the connection is opened
    ws.onopen = () => {
        console.log("WebSocket connection established.");
        // Send an initial handshake message if needed
        ws.send(JSON.stringify({ type: "handshake" }));
    };

    // Handle incoming WebSocket messages
    ws.onmessage = async (event) => {
        try {
            const message = JSON.parse(event.data);
            console.log("WebSocket message received:", message);

            // Handle different message types
            if (message.type === "ADD_INVOICE") {
                // Call store method to handle the update
                await visitStore.handleGetAllActiveVisits(); // Example: Update visits
            }
        } catch (error) {
            console.error("Error handling WebSocket message:", error);
        }
    };

    // When the WebSocket connection is closed
    ws.onclose = () => {
        console.log("WebSocket connection closed.");
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

// Initialize WebSocket on component mount
onBeforeMount(() => {
    initializeWebSocket();
});

// Cleanup WebSocket on component unmount
onBeforeUnmount(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection.");
        ws.close();
    }
});
watch(loading, (val) => {
    if (!val) return;

    setTimeout(() => {
        loading.value = false;
    }, 2000);
});
import * as XLSX from "xlsx";

import { usePatientStore } from "@/stores/patients";
import { useStaffStore } from "@/stores/staff";

const doctorsArray = ref(["Clinical", "Records", "Laboratory", "Nursing", "Accounts"]);
const departmentServicesArray = ref([]);
const patientStore = usePatientStore();
const showNewVisitForm = ref(false);
// Reactive form inputs
/*
   invoiceType: VisitType! # In form input
    invoiceStartDateTime: Date!
    invoiceEndDateTime: Date
    invoiceStatus: VisitStatus
    doctor: String!  # In form input
    reason: String!  # In form input
*/
const formInputs = ref({
    invoiceNumber: "",
    invoiceStartDateTime: "",
    invoiceEndDateTime: "",
    invoiceType: "OUTPATIENT",
    doctor: "",
    reason: [],
});

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
const amaneDepartments = ["LABORATORY", "NURSING", "PHARMARCY", "CLINICAL", "RECORDS"];
// Function to get role by department
function getRoleByDepartment(department) {
    return departmentToRoleMap[department] || "OTHER"; // Default to "OTHER" if no match is found
}
// Visit type options

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

const billItems = ref([]);
async function buildServicesList() {
    if (useStaffStore().staff.role === sentToDepartment.value) {
        departmentServicesArray.value = [];
        return 0;
    }
    const allServices = await fetchServices();
    // Filter services matching the selected doctor and 'CLINICAL'
    function getServicesByDepartment(data, departmentName) {
        if (data[departmentName]) {
            return data[departmentName];
        } else {
            throw new Error(`Department '${departmentName}' not found.`);
        }
    }
    const servicePoint = sentToDepartment.value; //getRoleByDepartment(selectedDoctor);
    const activeServices = getServicesByDepartment(allServices, servicePoint);
    const finalVals = activeServices.map((service) => service.__EMPTY);

    departmentServicesArray.value = finalVals;
}
watch(sentToDepartment, (newVal, oldVal) => {
    if (newVal) {
        requestedServices.value = [];
        buildServicesList();
    }
});
// Calculate the total price

const total = computed(() => {
    return billItems.value.reduce((sum, item) => sum + item["__EMPTY_1"], 0);
});
onMounted(() => { });
const invoiceResponse = ref(""); // Variable to store response
// Print functionality
// Print functionality
const dialog = ref(false);

const openDialog = () => {
    dialog.value = true;
};

// Submit handler
/*
    date: new Date(Date.now()).toLocaleString(),
    items: JSON.stringigy(billItems.value),
    totalAmount: total.value, 
    beneficiary: visitStore.currentVisit.patient.id,
    visit: visitStore.currentVisit.id,
*/
const submitExternalServices = async () => {
    const payload = {
        date: new Date(Date.now()).toLocaleString(),
        items: JSON.stringify(billItems.value),
        totalAmount: total.value,
        beneficiary: visitStore.currentVisit.patient.id,
        visit: visitStore.currentVisit.id,
    };

    await invoiceStore.handleSubmit(payload);

    invoiceStore.createNewInvoice = false;
    setTimeout(() => {
        900;
    }, window.location.reload());
};
const printPDF = async () => {
    await handleSubmit();
    const element = document.getElementById("pdf");

    const options = {
        margin: [5, 5],
        filename: `Invoice_${visitStore.currentVisit.patient.personalInfo.fullName}_${visitStore.currentVisit.visitNumber}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(element).save();
};
</script>
<style scoped>
/* Invoice Container */
.v-container {
  padding: 1rem; /* Adjust padding for margins */
}

/* Invoice Header */
.v-card__title {
  font-size: 1.2rem; /* Adjust header size */
  font-weight: bold;
}

/* Invoice Table */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem; /* Adjust font size for table content */
}

th,
td {
  padding: 8px; /* Adjust cell padding */
  border-bottom: 1px solid #ddd; /* Add thin border for table rows */
}

/* Invoice Total */
h4 {
  margin: 0.5rem 0; /* Adjust spacing around total */
}
</style>
<style scoped>
.text-center {
  text-align: center;
}
</style>
