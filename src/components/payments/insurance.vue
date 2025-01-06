<template>
  <v-container>
    <!-- -->
    <v-alert
      v-if="showAlert"
      type="error"
      dismissible
      @click:close="showAlert = false"
      class="d-flex align-center"
      style="
        margin-bottom: 20px;
        background-color: #fdecea;
        color: #d32f2f;
        border: 1px solid #f5c6cb;
      "
    >
      <v-icon style="margin-right: 8px; color: #d32f2f">mdi-alert</v-icon>
      <span style="font-weight: 500">{{ alertMessage }}</span>
    </v-alert>

    
    <v-alert
      border="top"
      type="warning"
      variant="outlined"
      prominent
      class="ml-38 mt-4"
      width="72%"
      v-if="error"
    >
      {{ error }}
    </v-alert>

    <v-alert
      border="top"
      v-if="success"
      type="success"
      class="ml-38 mt-4"
      width="72%"
      variant="outlined"
      prominent
    >
      {{ success }}
    </v-alert>
    <!-- <div v-if="error">
      <v-alert type="warning">
        {{ error }}
      </v-alert>
    </div>

    <div v-if="success">
      <v-alert type="success">
        {{ success }}
      </v-alert>
    </div> -->

    <v-row>
      <v-col cols="2"><v-icon>mdi-calendar-outline</v-icon> {{ createdAt() }} </v-col>
      <v-col cols="10">
        <v-row>
          <v-col cols="5">
            <v-text-field
              required
              label="Principal's Fullname"
              v-model="principalMemberFullname"
              :rules="[(value) => !!value || 'Full name is required']"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field
              required
              label="Principal ID Number"
              v-model="principalMemberIDNumber"
              readonly
              :rules="[(value) => !!value || 'ID number is required']"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              required
              label="Insurance Number"
              v-model="principalMemberInsuranceNumber"
              readonly
              :rules="[(value) => !!value || 'Insurance number is required']"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-container v-if="billItems && billItems.length > 0">
      <v-row class="align-center">
        <!-- Label for Invoice Amount -->
        <v-col cols="2">
          <v-card-title>Bill Ksh {{ total }}</v-card-title>
        </v-col>

        <!-- Text Input for Partial Amount   :rules="[validatePartialAmount]"-->
        <v-col cols="3">
          <v-text-field
            v-model="partialAmount"
            label="Invoice Insurance Claim"
            @input="processPartialAmount"
          ></v-text-field>
        </v-col>
        <!-- Button to Claim Full Amount -->
        <v-col cols="3">
          <v-btn
            @click="claimFullAmount"
            prepend-icon="mdi-pac-man"
            color="primary"
            variant="outlined"
            >Claim Full Amount</v-btn
          >
        </v-col>

        <!-- Balance to be Paid by Client -->
        <v-col cols="4">
          <v-chip rounded variant="outlined"
            >Claim: Ksh {{ partialAmount }} | Client Copay: Ksh {{ balance }}</v-chip
          >
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <br />
    <v-row>
      <v-col cols="6" v-if="showPayment === true">
        <v-card outlined>
          <v-card-title class="text-h6 font-weight-bold">
            {{ currentPaidVisit.patient.personalInfo.fullName }}
          </v-card-title>
          <v-card-subtitle>
            <strong>Patient ID:</strong>
            {{ currentPaidVisit.patient.personalInfo.patientId }}
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
                  {{ currentPaidVisit.patient.personalInfo.gender }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <strong>Year of Birth:</strong>
                  {{ currentPaidVisit.patient.personalInfo.yearOfBirth }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-email</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <strong>Email Address:</strong>
                  {{ currentPaidVisit.patient.personalInfo.emailAddress }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <strong>Phone Number:</strong>
                  {{ currentPaidVisit.patient.personalInfo.phoneNumber }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-heart</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <strong>Next of Kin:</strong>
                  {{ currentPaidVisit.patient.nextOfKin.fullName }} ({{
                    currentPaidVisit.patient.nextOfKin.relationSpecify
                  }})
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <strong>Home Address:</strong>
                  {{ currentPaidVisit.patient.nextOfKin.homeAddress }}
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-tie</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <strong>Doctor:</strong> {{ currentPaidVisit.doctor }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-divider max-length="4rem" vertical></v-divider>
      <v-col cols="6">
        <v-card class="mx-auto pa-2" max-width="96%">
          <div v-if="billItems && billItems.length > 0">
            <v-list>
              <v-list-subheader>BILLED ITEMS</v-list-subheader>
              <v-list-item
                v-for="(item, i) in billItems"
                :key="i"
                :value="item"
                color="primary"
                rounded="xl"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-invoice-list-outline"></v-icon>
                </template>
                <v-list-item-title>
                  {{ i + 1 }}. {{ item.__EMPTY }} ----------- {{ item.__EMPTY_1 }}/=
                </v-list-item-title>
              </v-list-item>
              <v-divider />
              <h4
                style="text-align: right; border-top: 1px solid black; padding-top: 5px"
              >
                Total: KES {{ total.toFixed(2) }}
              </h4>
            </v-list>
          </div>

          <div v-else>No billed items available.</div>
        </v-card>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card-actions>
      <v-row justify="space-around" class="ma-1 ml-2">
        <v-col align-right cols="3"> </v-col>

        <v-col cols="6" class="d-flex justify-space-between">
          <!-- PayPal container -->

          <!-- SSL logo -->
          <v-img
            @click="showMpesaIcon"
            max-height="3rem"
            class="mt-8"
            src="https://a2z-v0.s3.eu-central-1.amazonaws.com/csq_media/images/ssl.png"
            alt="SSL"
          ></v-img>

          <!-- Secure Payment with PayPal -->
          <v-img
            @click="showMpesaIcon"
            max-height="5.4rem"
            class="mt-3"
            src="https://a2z-v0.s3.eu-central-1.amazonaws.com/secure-payment-with-paypal.png"
            alt="Secure Payment"
          ></v-img>
          <!-- PayPal container will be rendered here -->

          <!-- M-Pesa container -->

          <v-img
            max-height="7.2rem"
            class="ml-11"
            style="cursor: pointer"
            v-if="balance < 150000 && balance >= 50"
            src="https://a2z-v0.s3.eu-central-1.amazonaws.com/1200px-M-PESA_LOGO-01.svg.png"
            alt="M-Pesa"
          ></v-img>
          <v-btn
            class="text-none mt-5 ml-3"
            :color="balance >= 50 ? '#56c700' : '#002870'"
            prepend-icon="mdi-cash-clock"
            variant="flat"
            @click="processClaimPathway"
            style="color: white"
          >
            {{
              balance >= 50
                ? "Initiate MPESA Copayment & Save Insurance Claim"
                : "Save Insurance Claim  & Close Invoice"
            }}
          </v-btn>

          <!--<v-img showMpesaIcon
            max-height="7.2rem"
            style="cursor: pointer"
            @click="mockPaypal"
            src="https://elfsight.com/wp-content/uploads/2023/09/PayPal-Button-Example-1.jpg"
            alt="M-Pesa"
          ></v-img> -->
        </v-col>
        <v-col v-show="1 < 0" cols="3" class="d-flex justify-space-between">
          <v-container
            v-show="1 < 0"
            max-height="7.2rem"
            max-width="6rem"
            style="cursor: pointer"
          >
            <div
              v-show="1 < 0"
              id="paypal-button-container"
              class="paypal-button-small mt-5 mb-5"
            ></div> </v-container
        ></v-col>
      </v-row>
    </v-card-actions>
    <v-dialog v-model="MPESAInputDialog" persistent max-width="540">
      <MPESABillPayment />
    </v-dialog>

    <v-dialog v-model="requestDGWaiverDialog" max-width="75rem" persistent>
      <FeeWaiver />
    </v-dialog>
  </v-container>
</template>
<script setup>
// import { mapActions } from "pinia";
import { ref, onBeforeMount, onMounted, nextTick, reactive, watch } from "vue";
import { usePaymentsStore } from "@/stores/payments";
// import axios from "axios";
import { useStaffStore } from "@/stores/staff";
import { useInvoiceStore } from "@/stores/invoices";
const invoiceStore = useInvoiceStore();
import html2pdf from "html2pdf.js";

const staffStore = useStaffStore();
import { useVisitStore } from "@/stores/visits"; // Import the visit store

const visitStore = useVisitStore();
const requestDGWaiverDialog = ref(false);

const currentPaidVisit = ref(null);

const showPayment = ref(false);

import { useRouter } from "vue-router";
import { DateTime } from "luxon";
import MPESAInput from "./MPESABillPayment.vue";
// import { loadScript, Buttons } from "@paypal/paypal-js";

const activeInvoice = ref({}); // activeInvoiceRaw[0]
const billItems = ref([]);
const total = ref(0);

const partialAmount = ref(""); // Partial claim amount
const balance = ref(0); // Balance owed by the client

// Function to claim the full amount while ensuring minimum balance
function claimFullAmount() {
  partialAmount.value = total.value; // Claim the full amount
  balance.value = 0; // No balance for the client
}

// Watcher for partialAmount to ensure it doesn't exceed total
watch(partialAmount, (newClaim) => {
  if (newClaim > total.value) {
    partialAmount.value = total.value; // Cap the claim to the total amount
    balance.value = 0;
    return;
  }
});

function processPartialAmount() {
  const claim = parseInt(partialAmount.value) || 0; // Parse claim as integer

  // Calculate the client's share
  const clientShare = total.value - claim;

  // Ensure claim does not exceed the total amount
  if (partialAmount.value > total.value) {
    partialAmount.value = total.value;
    balance.value = 0; // No balance if claim equals total
    return;
  }

  // Ensure no balance if full claim is made
  if (claim === total.value) {
    partialAmount.value = total.value;
    balance.value = 0; // No balance to pay
    return;
  }

  // Ensure minimum client payment is 50 if there is a balance
  if (clientShare < 50) {
    balance.value = 50; // Minimum balance
    return;
  }

  // Set the calculated balance if it meets the criteria
  balance.value = clientShare;
}

// Watch for changes to partialAmount and update balance dynamically
// watch(partialAmount, (newClaim) => {

// Validation rule for the partial claim amount
const validatePartialAmount = (value) => {
  if (!value) return true; // Allow empty input
  const calculatedBalance = total.value - value;
  if (calculatedBalance < 50) return "Client balance must be at least 50";
  return value <= total.value || "Claim amount exceeds invoice total";
};

// principalMemberFullname  principalMemberIDInsuranceNumber
const principalMemberFullname = ref("");
const principalMemberIDNumber = ref("");
const principalMemberInsuranceNumber = ref("");

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const slider = ref(null);
const selectNow = ref(null);
const isFormValid = ref(true);
const userId = localStorage.getItem("sessionId");
const selectedItem = ref(1);
const transactionEntity = ref("INDIVIDUAL");
const departmentId = ref("");
const paidAmount = ref(String(total.value));
const success = ref(null);
const error = ref(null);
const isLoading = ref(false);
const MPESAInputDialog = ref(false);
const activeOption = ref(0);
const sliderActive = ref(false);
const selectedAmount = ref(String(total.value));
const selectItems = ["1", "2", "5", "10", "20", "50", "100", "200"];
//  const store = usePaymentsStore();
const nameRules = [(value) => !!value || "Name is required"];
const uuidRules = [
  (value) => {
    if (!value) return true; // If no value is provided, it's valid (optional)
    return /^[A-Za-z0-9]{12}$/.test(value) || "Department ID must be a valid identifier.";
  },
];
function setPaidForVisit() {
  currentPaidVisit.value = visitStore.currentVisit;

  showPayment.value = true;
}
onBeforeMount(async () => {
  // console.log({ activeVisit: visitStore.currentVisit });

  // Filter unpaid invoices

  // Check if there are any invoices
  if (visitStore.currentVisit.invoices.length > 0) {
    activeInvoice.value = invoiceStore.currentInvoice;

    // Parse and set billItems as iterable
    try {
      const parsedItems = JSON.parse(invoiceStore.currentInvoice.items);
      billItems.value = Array.isArray(parsedItems) ? parsedItems : [];
    } catch (error) {
      console.error("Error parsing invoice items:", error);
      billItems.value = [];
    }
  }
  setPaidForVisit();
});
watch(
  billItems,
  (newItems) => {
    total.value = newItems.reduce((sum, item) => sum + item["__EMPTY_1"], 0);
  },
  { deep: true } // Deep watch to detect changes in nested objects
);
// const savedItem = ref(localStorage.getItem('item') || '');
watch(departmentId, (newValue) => {
  if (newValue.length === 12) {
    transactionEntity.value = "DEPARTMENT";
    selectedAmount.value = "250";
  } else {
    transactionEntity.value = "INDIVIDUAL";
  }
});
const saveItems = () => {
  const paidAmount = String(balance.value);

  // Save the items as an object to localStorage
  const itemsObject = {
    beneficiary: visitStore.currentVisit.patient.id,
    invoice: activeInvoice.value.id,
    paidAmount: paidAmount,
    paymentMethod: `INSURANCE,${principalMemberFullname.value},${principalMemberIDNumber.value},${principalMemberInsuranceNumber.value},${partialAmount.value}`,
    billingDepartment: visitStore.currentVisit.doctor,
    billedItems: JSON.stringify(billItems.value),
  };
  localStorage.setItem("creditPurchaseDetails", JSON.stringify(itemsObject));
};
// LNMPO
const showMpesaIcon = function () {
  saveItems();
  MPESAInputDialog.value = true;
};
// Add a ref for alert control
const showAlert = ref(false);
const alertMessage = ref("");

const handleFullInsuranceClaimSubmit = async () => {
  // Validate principalMemberDetails fields
  if (
    !principalMemberFullname.value ||
    !principalMemberIDNumber.value ||
    !principalMemberInsuranceNumber.value ||
    !partialAmount.value
  ) {
    showAlert.value = true; // Show the alert
    alertMessage.value =
      "Please ensure all Principal Member details are filled before submitting.";
    return; // Stop execution
  }

  const payload = {
    invoiceId: activeInvoice.value.id,
    principalMemberDetails: `INSURANCE,${principalMemberFullname.value},${principalMemberIDNumber.value},${principalMemberInsuranceNumber.value},${partialAmount.value}`,
    items: JSON.stringify(billItems.value),
    doctor: activeInvoice.value.doctor,
    totalAmount: total.value,
    claimedAmount: partialAmount.value,
    beneficiary: visitStore.currentVisit.patient.id,
    visit: visitStore.currentVisit.id,
  };

  try {
    await invoiceStore.invoiceSettleViaInsuranceSubmit(payload);
    window.location.reload();
  } catch (error) {
    // Handle any errors here if needed
    console.error("Error submitting invoice:", error);
  }
};
function processClaimPathway() {
  // save other insurance details to db

  if (balance.value < 50) {
    handleFullInsuranceClaimSubmit();
  }
  //claim balance via mpesa
  if (balance.value >= 50) {
    showMpesaIcon();
  }
}
const decrement = function () {
  if (selectedAmount.value == 1) {
    selectedAmount.value = 1;
    activeOption.value = 1;
    sliderActive.value = true;
    return;
  }
  selectedAmount.value--;
  activeOption.value = 1;

  sliderActive.value = true;
  onSliderChange();
  //  activeOption.value = 1;
};
const increment = function () {
  if (selectedAmount.value == 2000) {
    selectedAmount.value = 2000;
    activeOption.value = 1;
    sliderActive.value = true;
    return;
  }
  activeOption.value = 1;

  selectedAmount.value++;
  sliderActive.value = true;

  onSliderChange();
  activeOption.value = 1;
};
const onSelectChange = function () {
  activeOption.value = 0;
};
const onSliderChange = function () {
  activeOption.value = 1;
  sliderActive.value = true;
};
const createdAt = function () {
  const dateraw = DateTime.fromMillis(parseInt(Date.now()));
  const date = DateTime.fromISO(dateraw);
  const humanReadable = date.toLocaleString(DateTime.DATETIME_MED);
  return humanReadable;
};

// const paypalButtonContainer = ref(null);
const mockPaypal = async function () {
  console.log({
    userId: userId,
    departmentId: departmentId.value,
    transactionEntity: transactionEntity.value,
    paidAmount: selectedAmount.value,
    transactionReferenceNumber: "MOCK_PAYPAL",
  });
  const store = usePaymentsStore();
  store.handleMakeAccessPaymentViaPaypal({
    userId: userId,
    departmentId: departmentId.value,
    transactionEntity: transactionEntity.value,
    paidAmount: selectedAmount.value,
    transactionReferenceNumber: "MOCK_PAYPAL",
  }); // eslint-disable-next-line
  return 1;
};
// const paypal = ref(null);

onMounted(async () => {
  partialAmount.value = String(total.value);
  const store = usePaymentsStore();

  const router = useRouter();
  const setLoaded = async function () {
    this.loaded = true;
    await window.paypal
      .Buttons({
        style: {
          layout: "horizontal",
          size: "large", // Set the size of the button to small
          tagline: "false",
        },
        createOrder: (data, actions) => {
          let paidAmount = "";
          if (activeOption.value == 0) {
            paidAmount = selectedAmount.value;
          }
          if (activeOption.value == 1) {
            paidAmount = selectedAmount.value;
          }
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: "Amane Hospital Publication Credits",
                amount: {
                  currency_code: "USD",
                  value: paidAmount,
                },
              },
            ],
          });
        },

        onApprove: (data, actions) => {
          // Implement your onApprove function here
          // Implement your onApprove function here
          this.loadingsquares = true;

          return actions.order
            .capture()
            .then(async (details) => {
              this.success = `Done! Payment completed successfully`;

              this.loadingsquares = false;
              const amount = details.purchase_units[0].amount.value;
              // this.handlePaypalPaymentOption()
              // eslint-disable-next-line
              const txnReference = details.id;
              // eslint-disable-next-line
              const argParams = { amount, txnReference };
              return argParams;
            }) // eslint-disable-next-line
            .then((argParams) => {
              this.success = `Done! Payment completed successfully`;
              this.paymentComplete = true;
              store
                .handleMakeAccessPaymentViaPaypal({
                  userId: userId,
                  departmentId: departmentId.value,
                  transactionEntity: transactionEntity.value,
                  paidAmount: selectedAmount.value,
                  transactionReferenceNumber: argParams.txnReference,
                }) // eslint-disable-next-line
                .then((response) => {
                  window.location.href = "https://nem.bio/dashboard";
                })
                // eslint-disable-next-line
                .catch((error) => {
                  this.isLoading = false;
                  this.error = JSON.stringify(error.message)
                    .replace("GraphQL error:", "")
                    .trim();
                  setTimeout(() => {
                    this.error = null;
                    router.go("currentRoute");
                  }, 4500);
                });
            });
        },
      })
      .render("#paypal-button-container");
  };
  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`;
  document.body.appendChild(script);
  script.addEventListener("load", setLoaded);
});
</script>

<style scoped>
.invoice-box {
  background-color: rgba(253, 255, 255, 0.555);
  width: 100%;
  margin: auto;
  max-height: 45rem;
  padding: 10px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(n + 2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: rgb(240, 247, 244);
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.item input {
  padding-left: 5px;
}

.invoice-box table tr.item td:first-child input {
  margin-left: -5px;
  width: 100%;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

.invoice-box input[type="number"] {
  width: 60px;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: left;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: left;
  }
}

/** RTL **/
.rtl {
  direction: rtl;
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
}

.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}
.divider {
  width: 4em;
  height: auto;
  display: inline-block;
}
</style>
<style>
/* Custom styles */
.paypal-button-small {
  width: 120; /* Set your desired width */
  height: 30px; /* Set your desired height */
}
</style>
