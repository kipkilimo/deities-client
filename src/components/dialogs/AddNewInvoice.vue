<template>
    <v-container class="pa-4" style="max-width: 80mm; font-family: Arial, sans-serif">
        <v-card width="27rem" style="font-family: Arial, sans-serif" class="ma-4" variant="flat">
            <div id="pdf"
                style="font-family: monospace; font-size: 12px; max-width: 80mm; margin: 0 auto; text-align: left;">
                <!-- Header Section -->
                <div style="text-align: center; margin-bottom: 10px;">
                    <img src="https://a2z-v0.s3.eu-central-1.amazonaws.com/Amane_Logo_Final.png" alt="Amane Logo"
                        style="height: 50px; margin-bottom: 5px;" />
                    <h3 style="margin: 0; font-size: 14px;">Amane Cottage Hospital</h3>
                    <p style="margin: 0;">PO BOX 61 Busia KE 50400</p>
                    <p style="margin: 0;">Tel: +254 713 412 265</p>
                    <p style="margin: 0;">amanecottagehospital@gmail.com</p>
                </div>

                <!-- Invoice Details -->
                <h4 style="margin: 5px 0; text-align: center; text-transform: uppercase; font-size: 14px;">
                    Invoice {{ visitStore.currentVisit.visitNumber }}
                </h4>
                <h5 style="margin: 5px 0; text-align: center;">Department: {{ visitStore.currentVisit.doctor }}</h5>

                <p>Patient: {{ visitStore.currentVisit.patient.personalInfo.fullName }}</p>
                <p>ID: {{ visitStore.currentVisit.patient.personalInfo.patientId }}</p>
                <p>Date: {{ new Date(Date.now()).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) }}</p>

                <!-- Invoice Table -->
                <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                    <thead>
                        <tr style="border-bottom: 1px solid black;">
                            <th style="text-align: left;">Item</th>
                            <th style="text-align: right;">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in billItems" :key="index" style="border-bottom: 1px solid #ddd;">
                            <td>{{ index + 1 }}. {{ item["__EMPTY"] }}</td>
                            <td style="text-align: right;">{{ item["__EMPTY_1"] }}</td>
                        </tr>
                    </tbody>
                </table>

                <h4 style="text-align: right; border-top: 1px solid black; padding-top: 5px;">
                    Total: KES {{ total.toFixed(2) }}
                </h4>

                <div style="text-align: center; margin-top: 10px;">
                    <p style="margin: 0;">Pay only on MPESA prompt</p>
                    <p style="margin: 0;">COUNTY SQUARE BUSINESS SOLUTIONS</p>
                    <p style="margin: 0;">Feedback: +254700378241</p>
                </div>
            </div>

            <!-- Update BillItems Button -->


            <!-- Print Invoice -->
            <v-divider class="my-2"></v-divider>
            <v-row class="text-center mt-3 mb-2">
                <v-col>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn class="ma-2" variant="text" :disabled="billItems.length === 1" color="secondary"
                            @click="openDialog">Edit
                            Items</v-btn><v-spacer />
                        <v-btn class="ma-2" variant="outlined" color="primary" @click="handleSubmit">Submit & Print
                            Invoice</v-btn>

                        <v-spacer /><v-spacer />
                    </v-card-actions>

                </v-col>
            </v-row>
        </v-card>

        <!-- Dialog to Update BillItems -->
        <v-dialog v-model="dialog" max-width="720px">
            <v-card>
                <v-card-title>Update Invoice Items</v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item v-for="(item, index) in billItems" :key="index">
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="9">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item["__EMPTY"] }}</v-list-item-title>
                                    </v-list-item-content>

                                </v-col>
                                <v-col cols="3">

                                    <v-list-item-action>
                                        <v-btn icon @click="removeItem(index)" :disabled="billItems.length <= 1">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount } from "vue";
import { useInvoiceStore } from "@/stores/invoices"; // Import the invoice store
import { useVisitStore } from "@/stores/visits"; // Import the invoice store

const visitStore = useVisitStore();
const loading = ref(false);
// import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";

const invoiceStore = useInvoiceStore();
const wsUrl = import.meta.env.VITE_BASE_WS_URL; // Get the WebSocket URL from env

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

const doctorsArray = ref([
    "Clinical",
    "Records",
    "Laboratory",
    "Nursing",
    "Accounts",
]);
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
    "PHARMARCY",
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
    const selectedDoctor = visitStore.currentVisit.doctor;
    if (!selectedDoctor) {
        departmentServicesArray.value = [];
        return;
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
    const servicePoint = getRoleByDepartment(selectedDoctor);
    const activeServices = getServicesByDepartment(allServices, servicePoint);
    const selectedServices = JSON.parse(visitStore.currentVisit.reason);

    const matchingElements = activeServices.filter((item) =>
        selectedServices.includes(item["__EMPTY"])
    );

    // console.log(selectedServices, matchingElements)
    billItems.value = matchingElements;
    // departmentServicesArray.value = (activeServices.map((service => service.__EMPTY))).shift(1)
    // invoiceItems
}
// Calculate the total price
const total = computed(() => {
    return billItems.value.reduce((sum, item) => sum + item["__EMPTY_1"], 0);
});
onMounted(() => {
    buildServicesList();
});
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
const handleSubmit = async () => {
    const payload = {
        date: new Date(Date.now()).toLocaleString(),
        items: JSON.stringify(billItems.value),
        totalAmount: total.value,
        beneficiary: visitStore.currentVisit.patient.id,
        visit: visitStore.currentVisit.id,
    };

    await invoiceStore.handleSubmit(payload)

    invoiceStore.createNewInvoice = false;
    setTimeout(() => {
        900
    }, window.location.reload());

};
const printPDF = async () => {
    await handleSubmit()
    const element = document.getElementById("pdf");

    const options = {
        margin: [5, 5],
        filename: `Invoice_${visitStore.currentVisit.patient.personalInfo.fullName}_${visitStore.currentVisit.visitNumber}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf()
        .set(options)
        .from(element)
        .save()
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

  th, td {
    padding: 8px; /* Adjust cell padding */
    border-bottom: 1px solid #ddd; /* Add thin border for table rows */
  }

  /* Invoice Total */
  h4 {
    margin: 0.5rem 0; /* Adjust spacing around total */
  }
</style>