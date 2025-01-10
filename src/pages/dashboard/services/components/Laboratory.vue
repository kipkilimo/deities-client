<template>
  <v-container>
    <v-progress-linear
      color="teal"
      v-if="visitStore.fetchingVisits"
      indeterminate
    ></v-progress-linear>
    <v-container v-if="!visitStore.fetchingVisits">
      <v-row v-if="canShowVisits && visitStore.visits.length > 0">
        <!-- Left Column: List of Visits -->
        <v-col
          cols="8"
          v-for="(visit, index) in visitStore.visits.filter(
            (visit) => visit.doctor === 'Laboratory'
          )"
          :key="visit.id"
        >
          <v-card
            :color="visit.patient.personalInfo.gender === 'Male' ? 'info' : 'pink'"
            variant="tonal"
            class="mb-4"
            outlined
            :class="{ 'bg-light-blue': selectedVisitIndex === index }"
          >
            <v-row no-gutters>
              <v-col cols="3">
                <v-img
                  @click="selectVisit(visit)"
                  style="cursor: pointer"
                  src="https://www.svgrepo.com/show/532380/user-plus-alt.svg"
                  alt="Profile Picture"
                  aspect-ratio="1"
                  class="rounded-circle"
                  height="6rem"
                ></v-img>
              </v-col>
              <v-col cols="6">
                <v-card-title>
                  {{ visit.patient.personalInfo.fullName }} | Patient ID
                  {{ visit.patient.personalInfo.patientId }}
                </v-card-title>
                <v-card-subtitle>
                  <span class="text-body-2">Visit #{{ visit.visitNumber }}</span>
                  <v-divider vertical class="mx-2"></v-divider>
                  <span class="text-caption">{{ visit.visitType }}</span>
                </v-card-subtitle>
              </v-col>
              <v-col cols="3">
                <v-card-text>Visit Number</v-card-text>
                <v-card-title
                  class="text-h3 mt-4"
                  style="font-family: 'Orbitron', monospace"
                >
                  {{ visit.visitNumber }}
                </v-card-title>
              </v-col>
            </v-row>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-icon small class="me-2">mdi-calendar-clock</v-icon>
                  {{ new Date(visit.visitStartDateTime).toLocaleString() }}
                </v-col>
                <v-col>
                  <v-icon small class="me-2">mdi-doctor</v-icon>
                  {{ visit.doctor }}
                </v-col>
              </v-row>
              <v-chip small color="primary" class="mt-2">{{ visit.visitStatus }}</v-chip>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <div class="pa-2 d-flex align-center">
                <v-spacer></v-spacer>
                <v-icon color="disabled" icon="mdi-crosshairs-gps" start></v-icon>

                <v-icon
                  :disabled="billItems.length === 0"
                  color="#949cf7"
                  icon="mdi-invoice-list-outline"
                  @click="selectVisit(visit, 'INVOICE')"
                  size="medium"
                ></v-icon>

                <span class="text-caption text-medium-emphasis ms-1 font-weight-light">
                  View requested services
                </span>
                <v-btn
                  :disabled="billItems.length === 0"
                  class="mr-11"
                  icon="mdi-invoice-list-outline"
                  variant="text"
                  @click="selectVisit(visit, 'INVOICE')"
                ></v-btn>

                <v-spacer></v-spacer>

                <!-- <span class="text-caption text-h2-emphasis ms-1 font-weight-regular"
                                    v-if="visit.invoices.length && visit.invoices.some(invoice => invoice.paid === true)">
                                    Print receipt
                                </span>
                                <v-btn
                                    v-if="visit.invoices.length && visit.invoices.some(invoice => invoice.paid === true)"
                                    class="mr-11" icon="mdi-printer-outline" variant="text"
                                    @click="selectVisit(visit, 'RECEIPT')"></v-btn>  visitStore.setActiveVisit(visit) -->

                <v-spacer></v-spacer>

                <v-btn
                  class="me-2 text-none"
                  color="#009ee3"
                  prepend-icon="mdi-invoice-text-check-outline"
                  variant="outlined"
                  @click="visitStore.setActiveVisit(visit), selectVisit(visit, '')"
                  v-if="
                    visit.invoices.some((invoice) => invoice.paid === true) &&
                    visit.status !== 'COMPLETED'
                  "
                >
                  Call Patient
                </v-btn>

                <!-- <v-btn class="me-2 text-none" color="#ff0079"
                                    prepend-icon="mdi-invoice-text-check-outline" variant="flat"
                                    @click="selectVisit(visit, ''), showInsuranceClaimDialog = true"
                                    v-if="visit.invoices.length && visit.invoices.some(invoice => invoice.paid === false)">
                                    Debit Insurance
                                </v-btn> -->

                <v-btn
                  disabled
                  color="red"
                  class="text-none"
                  prepend-icon="mdi-account-cancel"
                  variant="text"
                  v-if="
                    (staffStore.staff && staffStore.staff.role === 'ADMINISTRATIVE') ||
                    (staffStore.staff && staffStore.staff.role === 'RECORDS')
                  "
                  border
                >
                  Close Visit
                </v-btn>
                <v-spacer></v-spacer>
              </div>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Right Column: Details of Selected Visit  @click="selectVisit(visit)"-->
        <v-col cols="4">
          <v-card
            outlined
            style="height: 85vh; overflow-y: auto"
            :disabled="inactiveCard === false"
          >
            <v-card-subtitle>
              <v-row>
                <v-col cols="8">
                  <v-card-title class="text-h6 font-weight-bold">
                    {{ selectedVisit.patient.personalInfo.fullName }}
                  </v-card-title>
                  <v-card-subtitle>
                    <strong>Patient ID:</strong>
                    {{ selectedVisit.patient.personalInfo.patientId }}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    @click="requestExternalServices(selectedVisit)"
                    class="mt-4 text"
                    color="#009ee3"
                    prepend-icon="mdi-invoice-text-check-outline"
                    variant="text"
                  >
                    View Records
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-divider class="my-2"></v-divider>
            <v-card-text>
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-gender-male-female</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Gender:</strong>
                    {{ selectedVisit.patient.personalInfo.gender }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Year of Birth:</strong>
                    {{ selectedVisit.patient.personalInfo.yearOfBirth }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-email</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Email Address:</strong>
                    {{ selectedVisit.patient.personalInfo.emailAddress }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-phone</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Phone Number:</strong>
                    {{ selectedVisit.patient.personalInfo.phoneNumber }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-heart</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Next of Kin:</strong>
                    {{ selectedVisit.patient.nextOfKin.fullName }} ({{
                      selectedVisit.patient.nextOfKin.relationSpecify
                    }})
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Home Address:</strong>
                    {{ selectedVisit.patient.nextOfKin.homeAddress }}
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-if="
                    selectedVisit.reason && JSON.parse(selectedVisit.reason).length > 0
                  "
                >
                  <v-list-item-icon>
                    <v-icon>mdi-stethoscope</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Services requested ({{ selectedVisit.doctor }}):</strong>

                    <v-col
                      cols="12"
                      v-for="(items, department) in groupedItemsByDepartment"
                      :key="department"
                    >
                      <v-list dense>
                        <v-list-item v-for="(item, index) in items" :key="index">
                          <v-list-item-content>
                            <div class="text-caption text--secondary">
                              {{ index + 1 }}. {{ item.description }}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-clock</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Visit Start:</strong>
                    {{ new Date(selectedVisit.visitStartDateTime).toLocaleString() }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="selectedVisit.visitEndDateTime">
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-clock</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Visit End:</strong>
                    {{ new Date(selectedVisit.visitEndDateTime).toLocaleString() }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-file-check-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Status:</strong> {{ selectedVisit.visitStatus }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-tie</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Doctor:</strong> {{ selectedVisit.doctor }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-divider class="mb-8" />
            <v-card-actions style="position: absolute">
              <v-spacer></v-spacer>
              <!-- <div class="pa-2 d-flex  align-center">
                            </div> -->
              <v-icon color="disabled" icon="mdi-crosshairs-gps" start></v-icon>

              <v-icon color="#949cf7" icon="mdi-bell-ring" size="x-small"></v-icon>

              <span class="text-caption text-medium-emphasis ms-1 font-weight-light">
                active
              </span>

              <v-spacer></v-spacer>
              <v-tooltip location="bottom">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    disabled
                    @click="requestExternalServices(selectedVisit)"
                    icon="mdi-invoice-text-check-outline "
                    variant="text"
                  ></v-btn>
                </template>
                <span>Request Services</span>
              </v-tooltip>

              <v-spacer></v-spacer>
              <v-spacer></v-spacer>

              <v-btn
                class="me-2 text-none"
                :disabled="selectedVisit.invoices.some((invoice) => !invoice.paid)"
                color="#009ee3"
                @click="writeReport(selectedVisit)"
                prepend-icon="mdi-card-account-details-outline"
                variant="flat"
              >
                {{
                  selectedVisit.invoices.some((invoice) => !invoice.paid)
                    ? "Awaiting bill payment"
                    : "Write service reports"
                }}
              </v-btn>

              <v-btn
                @click="doSomething(selectedVisit)"
                color="red"
                class="text-none"
                prepend-icon="mdi-account-cancel"
                variant="text"
                v-if="
                  (staffStore.staff && staffStore.staff.role === 'CLINICAL') ||
                  (staffStore.staff && staffStore.staff.role === 'DOCTOR')
                "
                border
              >
                End Session
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="printingReceiptNow" width="27rem">
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
              font-size: 14px;
            "
          >
            Visit {{ visitStore.currentVisit.visitNumber }}
          </h4>
          <h5 style="margin: 5px 0; text-align: center">
            Service point: {{ visitStore.currentVisit.doctor }}
          </h5>

          <p>Patient: {{ visitStore.currentVisit.patient.personalInfo.fullName }}</p>
          <p>Receipt Number: {{ activePayment.transactionReferenceNumber }}</p>
          <p>
            Date:
            {{
              new Intl.DateTimeFormat("en-GB", {
                weekday: "short", // Abbreviated weekday name (e.g., Tue)
                day: "numeric", // Single digit day (e.g., 6)
                month: "short", // Abbreviated month name (e.g., Aug)
                year: "numeric", // Full year (e.g., 2014)
                hour: "numeric", // Hour without leading zero (e.g., 1)
                minute: "2-digit", // Two-digit minute (e.g., 07)
                second: "2-digit", // Two-digit second (e.g., 04)
                hour12: true, // 12-hour format with AM/PM
              }).format(new Date(Number(activePayment.createdAt)))
            }}
          </p>

          <!-- Invoice Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0">
            <thead>
              <tr style="border-bottom: 1px solid black">
                <th style="text-align: left">Item</th>
                <th style="text-align: right">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in JSON.parse(activeInvoice.items)"
                :key="index"
                style="border-bottom: 1px solid #ddd"
              >
                <td>{{ index + 1 }}. {{ item["__EMPTY"] }}</td>
                <td style="text-align: right">{{ item["__EMPTY_1"] }}</td>
              </tr>
            </tbody>
          </table>

          <h4 style="text-align: right; border-top: 1px solid black; padding-top: 5px">
            Total Paid: KES {{ Number(activePayment.paidAmount).toFixed(2) }}
          </h4>

          <div style="text-align: center; margin-top: 10px">
            <p style="margin: 0">Thank you for your payment.</p>
            <p style="margin: 0">COUNTY SQUARE BUSINESS SOLUTIONS</p>
            <p style="margin: 0">Feedback: +254700378241</p>
          </div>
        </div>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="pa-2 d-flex align-center">
            <v-spacer></v-spacer>
            <v-icon color="disabled" icon="mdi-crosshairs-gps" start></v-icon>

            <v-icon
              color="#949cf7"
              icon="mdi-printer-outline"
              @click="printReceiptPDF(visitStore.currentVisit)"
              size="x-small"
            ></v-icon>

            <span class="text-caption text-medium-emphasis ms-1 font-weight-light">
              Print receipt
            </span>
            <v-btn
              class="mr-11"
              icon="mdi-printer-outline"
              variant="text"
              @click="printReceiptPDF(visitStore.currentVisit)"
            ></v-btn>

            <v-spacer></v-spacer>
          </div>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="printingNow" width="27rem">
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
              font-size: 14px;
            "
          >
            Invoice {{ visitStore.currentVisit.visitNumber }}
          </h4>
          <h5 style="margin: 5px 0; text-align: center">
            Department: {{ visitStore.currentVisit.doctor }}
          </h5>

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
              }).format(new Date(activeInvoice.date))
            }}
          </p>

          <!-- Invoice Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0">
            <thead>
              <tr style="border-bottom: 1px solid black">
                <th style="text-align: left">Item</th>
                <th style="text-align: right">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in billItems"
                :key="index"
                style="border-bottom: 1px solid #ddd"
              >
                <td>{{ index + 1 }}. {{ item["__EMPTY"] }}</td>
                <td style="text-align: right">{{ item["__EMPTY_1"] }}</td>
              </tr>
            </tbody>
          </table>

          <h4 style="text-align: right; border-top: 1px solid black; padding-top: 5px">
            Total: KES {{ total.toFixed(2) }}
          </h4>

          <div style="text-align: center; margin-top: 10px">
            <p style="margin: 0">Pay only on MPESA prompt</p>
            <p style="margin: 0">COUNTY SQUARE BUSINESS SOLUTIONS</p>
            <p style="margin: 0">Feedback: +254700378241</p>
          </div>
        </div>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="pa-2 d-flex align-center">
            <v-spacer></v-spacer>
            <v-icon color="disabled" icon="mdi-crosshairs-gps" start></v-icon>

            <v-icon
              color="#949cf7"
              icon="mdi-printer-outline"
              @click="printPDF(visitStore.currentVisit)"
              size="x-small"
            ></v-icon>

            <span class="text-caption text-medium-emphasis ms-1 font-weight-light">
              Print invoice
            </span>
            <v-btn
              class="mr-11"
              icon="mdi-printer-outline"
              variant="text"
              @click="printPDF(visitStore.currentVisit)"
            ></v-btn>

            <v-spacer></v-spacer>
          </div>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showPaymentsDialog" width="65%" persistent>
      <v-card>
        <paypal />
      </v-card>
    </v-dialog>
    <v-dialog v-model="showInsuranceClaimDialog" width="65%" persistent>
      <v-card>
        <insurance />
      </v-card>
    </v-dialog>
    <v-dialog v-model="invoiceStore.createNewServiceList" width="65%" persistent>
      <v-card>
        <NewServicesRequest />
      </v-card>
    </v-dialog>
    <v-dialog v-model="visitStore.createPatientNotes" width="65%" persistent>
      <v-card>
        <CreateNewDocumentation />
      </v-card>
    </v-dialog>
    <v-dialog v-model="visitStore.writeServiceReport" fullscreen persistent>
      <v-card>
        <WriteServiceReport />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, watch, onMounted } from "vue";
import { useStaffStore } from "@/stores/staff";
import { useInvoiceStore } from "@/stores/invoices";
const invoiceStore = useInvoiceStore();
import html2pdf from "html2pdf.js";

const staffStore = useStaffStore();
import { useVisitStore } from "@/stores/visits"; // Import the visit store
import WriteServiceReport from "@/components/dialogs/WriteServiceReport.vue";

const visitStore = useVisitStore();
const canShowVisits = ref(false); //computed(() => visitStore.canShowVisits);
const inactiveCard = ref(false);
const printingNow = ref(false); //computed(() => visitStore.canShowVisits); printingReceiptNow
const showPaymentsDialog = ref(false);
const showInsuranceClaimDialog = ref(false);
const printingReceiptNow = ref(false); //computed(() => visitStore.canShowVisits); printingReceiptNow

const selectedVisit = ref({});
const activePayment = ref({}); // activeInvoiceRaw[0]

const activeInvoice = ref({}); // activeInvoiceRaw[0]
const billItems = ref([]);
const total = ref(null); // Initialize total as a ref with null

function getDepartmentInvoices() {
  console.log({ selectedVisit: selectedVisit.value });

  // Filter invoices for the "Laboratory" doctor
  const labInvoices = selectedVisit.value.invoices.filter((invoice) => {
    return invoice.doctor === "Laboratory";
  });

  if (labInvoices.length === 0) {
    console.warn("No Laboratory invoices found.");
    return;
  }

  // Find the latest invoice
  const latestInvoice = labInvoices.reduce((latest, current) => {
    const latestDate = new Date(latest.createdAt);
    const currentDate = new Date(current.createdAt);
    return currentDate > latestDate ? current : latest;
  });

  if (latestInvoice) {
    // Set the latest invoice to activeInvoice and parse its items
    activeInvoice.value = latestInvoice;

    try {
      billItems.value = JSON.parse(latestInvoice.items);
    } catch (error) {
      console.error("Failed to parse invoice items:", error);
      billItems.value = []; // Reset to an empty array on error
    }
  } else {
    console.warn("Could not determine the latest invoice.");
  }
}

watch(selectedVisit, (newVal, oldVal) => {
  if (newVal) {
    getDepartmentInvoices();
  }
});
// Watch billItems and recalculate total whenever it changes
watch(
  billItems,
  (newItems) => {
    total.value = newItems.reduce((sum, item) => sum + item["__EMPTY_1"], 0);
  },
  { deep: true } // Deep watch to detect changes in nested objects
);

onMounted(() => {});

function requestExternalServices(visit) {
  // add new invoice actually
  selectedVisit.value = visit;
  visitStore.setActiveVisit(visit);
  invoiceStore.createNewServiceList = true;
}

function writeReport(visit) {
  // add new invoice actually writeServiceReport
  selectedVisit.value = visit;
  visitStore.setActiveVisit(visit);
  visitStore. writeServiceReport = true;
}
function doSomething(visit) {
  // to do
  return 1;
}
onBeforeMount(async () => {
  canShowVisits.value = false;
  await visitStore.handleGetAllActiveVisits();
  const labVisits = visitStore.visits.filter((visit) => visit.doctor === "Laboratory");
  selectedVisit.value = labVisits[0];

  console.log({ visit: labVisits[0] });

  const latestInvoice = labVisits[0].invoices.reduce((latest, current) => {
    return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
  });

  if (latestInvoice) {
    activeInvoice.value = latestInvoice;
    billItems.value = JSON.parse(latestInvoice.items);
  }

  canShowVisits.value = true;
});
// Extract and group items by department
// Extract and group items by department
const groupedItemsByDepartment = computed(() => {
  const departmentMap = {};

  selectedVisit.value.invoices.forEach((invoice) => {
    invoice.items.forEach((itemString) => {
      const parsedItems = JSON.parse(itemString); // Parse the JSON string

      parsedItems.forEach((item) => {
        const keys = Object.keys(item);
        const department = keys[0]; // The first key is the department
        const description = item["__EMPTY"]; // The value associated with the department
        const cost = item["__EMPTY_1"];

        if (!departmentMap[department]) {
          departmentMap[department] = [];
        }

        departmentMap[department].push({ description, cost });
      });
    });
  });

  return departmentMap;
});
async function selectVisit(visit, type) {
  selectedVisit.value = visit;
  inactiveCard.value = true;
  visitStore.setActiveVisit(visit);
  // const printVisit = visit;
  // const visitPayments = printVisit.payments
  // // Find the last created payment
  // const lastCreatedPayment = visitPayments.reduce((latest, current) => {
  //     return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
  // });
  // activePayment.value = lastCreatedPayment
  // activeInvoice.value = printVisit.invoices.find(
  //     invoice => invoice.id === activePayment.value.invoice.id
  // );
  // billItems.value = JSON.parse(activeInvoice.value.items)
  if (type === "") {
    return;
  }
  if (type === "RECEIPT") {
    printingReceiptNow.value = true;
    return;
  }
  printingNow.value = true;
}
const printPDF = async (visit) => {
  return 1;
  // visitStore.setActiveVisit(visit);
  const element = document.getElementById("pdf");

  const options = {
    margin: [5, 5],
    filename: `Invoice_${visitStore.currentVisit.patient.personalInfo.fullName}_${visitStore.currentVisit.visitNumber}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(options).from(element).save();
};

const printReceiptPDF = async () => {
  return 1;

  const element = document.getElementById("pdf");

  const options = {
    margin: [5, 5],
    filename: `Receipt${visitStore.currentVisit.patient.personalInfo.fullName}_${activePayment.value.transactionReferenceNumber}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(options).from(element).save();
};
</script>
<style>
@font-face {
  font-family: "Orbitron";
  src: url("/public/Orbitron-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
</style>
