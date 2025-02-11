<template>
    <v-container>
        <v-row class="mb-1">
            <v-col cols="8">
                <v-card height="34rem">
                    <v-carousel :show-arrows="false" show-arrows="hover" cycle hide-delimiter-background>
                        <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" fit></v-carousel-item>
                    </v-carousel>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card class="mx-auto" color="#f8fdfe" subtitle="Gift us any donation amount and kind support"
                    width="96%">
                    <template v-slot:title>
                        <span class="font-weight-black text-blue-darken-3"><span class="mr-4">💝</span> Donate to Amane
                            Cottage Hospital</span>
                    </template>

                    <v-card-text class="bg-surface-light pt-4">
                        <h8>
                            Support Amane Hospital, a medical facility in Burumba Estate, Busia,
                            dedicated to providing accessible, high-quality care that transforms lives. From
                            primary care and comprehensive maternity services to specialized surgeries and
                            preventive health education, our skilled team and modern technology empower individuals and
                            families to lead healthier lives. Your donation enables us to deliver exceptional
                            healthcare and build a thriving, healthier community.
                        </h8>
                    </v-card-text>

                    <!-- <v-card-item title="Recent donations">
            <template v-slot:subtitle>
              <v-icon
                class="me-1 pb-1"
                color="info"
                icon="mdi-information"
                size="18"
              ></v-icon>

              We process via M-PESA and Paypal channels
            </template>
          </v-card-item> -->

                    <v-card-text class="py-0">
                        <template v-if="newestPayment">
                            <v-row align="center" no-gutters>
                                <v-col class="text-h4 text-blue-darken-3" cols="12">
                                    <div>${{ convertToUSD(newestPayment) }} 🗳️</div>

                                    <v-row>
                                        <v-col cols="6">
                                            <v-select :items="selectItems" v-model="selectedAmount" density="compact"
                                                label="Select a donation amount"></v-select>
                                        </v-col>

                                        <v-col cols="6">
                                            <v-text-field v-model="inputAmount" density="compact" :rules="donationRules"
                                                label="Option 2: Enter donation amount"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </template>

                        <template v-else>
                            <v-row align="center" justify="center">
                                <v-col cols="12" class="text-center">
                                    <div class="text-subtitle-1 text-grey-darken-2">
                                        No recent payment information is available. Please select or enter a donation
                                        amount.
                                    </div>

                                    <v-row class="mt-4">
                                        <v-col cols="6">
                                            <v-select :items="selectItems" v-model="selectedAmount" density="compact"
                                                label="Select a donation amount"></v-select>
                                        </v-col>

                                        <v-col cols="6">
                                            <v-text-field v-model="inputAmount" density="compact" :rules="donationRules"
                                                label="Option 2: Enter donation amount"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-row justify="space-around" class="ma-1 ml-2">
                            <v-col cols="6" class="d-flex justify-space-between">
                                <!-- PayPal container -->

                                <!-- SSL logo -->

                                <!-- PayPal container will be rendered here -->

                                <!-- M-Pesa container -->

                                <v-img max-height="6rem" style="cursor: pointer" v-if="paidAmount < 1110"
                                    @click="showMpesaIcon"
                                    src="https://a2z-v0.s3.eu-central-1.amazonaws.com/1200px-M-PESA_LOGO-01.svg.png"
                                    alt="M-Pesa"></v-img>
                            </v-col>
                            <v-col cols="6" class="d-flex justify-space-between">
                                <v-container max-height="7rem" max-width="6rem" style="cursor: pointer">
                                    <div id="paypal-button-container" class="paypal-button-small mt-5 mb-5"></div>
                                </v-container></v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-card>
            <div class="">

            </div>
            <v-card-title class="text-overline">
                Progress

                <div class="text-blue-darken-3 text-h3 font-weight-bold">
                    {{ progressPercentage }}%
                </div>

                <div class="text-h6 text-medium-emphasis font-weight-regular">
                    ${{ (targetAmount - receivedDonations).toLocaleString("en-US") }} to
                    go
                </div>
            </v-card-title>
            <br />
            <v-card-text>
                <div class="position-absolute mt-n8 text-caption text-blue-darken-3">
                    Donations overview
                </div>
                <v-progress-linear color="#0570ba" height="22" :model-value="progressPercentage" rounded="lg">
                    <v-badge :style="`right: ${review}`" class="position-absolute" color="white" dot inline></v-badge>
                </v-progress-linear>

                <div class="d-flex justify-space-between py-3">
                    <span class="text-blue-darken-3 font-weight-medium">
                        ${{ (receivedDonations).toLocaleString("en-US") }} received
                    </span>

                    <span class="text-medium-emphasis">
                        $68,702.00 operations target
                    </span>
                </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-list-item append-icon="mdi-chevron-right" lines="two"
                subtitle="Support Amane Hospital, a medical facility in Burumba Estate, Busia," link></v-list-item>
        </v-card>

        <v-dialog v-model="MPESAInputDialog" persistent max-width="540">
            <MPESAInput />
        </v-dialog>
    </v-container>
</template>

<script setup>
import {
    ref,
    computed,
    onMounted,
    onBeforeMount,
    nextTick,
    reactive,
    watch,
} from "vue";
import { usePaymentsStore } from "@/stores/payments";
const amaneDonations = ref([]);
const store = usePaymentsStore();
const MPESAInputDialog = ref(false);
// Data and reactive properties
const items = ref([
    { src: "https://a2z-v0.s3.eu-central-1.amazonaws.com/Amane_Logo_Final.png" },
    {
        src: "https://www.shutterstock.com/image-photo/energy-bill-paper-forms-on-260nw-1393818824.jpg",
    },
    { src: "https://a2z-v0.s3.eu-central-1.amazonaws.com/Amane_Logo_Final.png" },
    {
        src: "https://cdni.iconscout.com/illustration/premium/thumb/medicines-illustration-download-in-svg-png-gif-file-formats--drugs-medicine-pills-tablets-lifestyle-during-coronavirus-pack-healthcare-medical-illustrations-2532586.png?f=webp",
    },
    { src: "https://a2z-v0.s3.eu-central-1.amazonaws.com/Amane_Logo_Final.png" },
    { src: "https://img.freepik.com/premium-vector/worker-repair-washing-machine_24911-67069.jpg" },
]);
const targetAmount = ref(68702.0);
const receivedDonations = ref(0);

const newestPayment = ref({});
onBeforeMount(async () => {
    await store.fetchDonations();
    amaneDonations.value = store.payments;
    newestPayment.value = amaneDonations.value.sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt)
    )[0];
    receivedDonations.value = getTotalAmountInUSD(amaneDonations.value);
});

function convertToUSD(payment) {
    if (payment.paymentMethod === "MPESA") {
        const paidAmountUSD = parseFloat(payment.paidAmount) / 131;
        return paidAmountUSD.toFixed(2); // Returns as a string formatted to 2 decimal places
    }
    return payment.paidAmount; // Return null or handle differently if not MPESA
}
function getTotalAmountInUSD(payments) {
    // Calculate total amount in USD for MPESA payments
    const totalInUSD = payments.reduce((total, payment) => {
        if (payment.paymentMethod === "MPESA") {
            return total + parseFloat(payment.paidAmount) / 131;
        }
        return total; // Ignore non-MPESA payments
    }, 0);

    // Return total rounded to 2 decimal places
    return totalInUSD.toFixed(2);
}
const progressPercentage = computed(() => {
    return (
        ((targetAmount.value - (targetAmount.value - receivedDonations.value)) /
            targetAmount.value) *
        100
    ).toFixed(0);
});

const review = computed(() => {
    return `${String(100 - progressPercentage.value)}%`;
});

// import axios from "axios"; 

import { useRouter } from "vue-router";
import { DateTime } from "luxon";
import MPESAInput from "../../components/payments/mpesaDonation.vue";
// import { loadScript, Buttons } from "@paypal/paypal-js";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const slider = ref(null);
const selectNow = ref(null);
const isFormValid = ref(true);
const userId = localStorage.getItem("sessionId");
const selectedItem = ref(1);
const transactionEntity = ref("INDIVIDUAL");
const departmentId = ref("");
const paidAmount = ref("1");
const success = ref(null);
const error = ref(null);
const isLoading = ref(false);
const activeOption = ref(0);
const selectionIsActive = ref(true);
const selectedAmount = ref("1");
const selectItems = ["1", "2", "5", "10", "20", "50", "100", "200"];
const inputAmount = ref("1");
//  const store = usePaymentsStore();const

const donationRules = [
    (value) =>
        /^[1-9]\d{0,5}(\.\d{1})?$/.test(value) ||
        "Donation amount must be a number between 1 and 999,999 with up to 1 decimal place",
];

const uuidRules = [
    (value) => {
        if (!value) return true; // If no value is provided, it's valid (optional)
        return (
            /^[A-Za-z0-9]{12}$/.test(value) ||
            "Department ID must be a valid identifier."
        );
    },
];

const emailRules = [
    (value) => !!value || "Email is required",
    (value) => /.+@.+\..+/.test(value) || "Email must be valid",
];
// const savedItem = ref(localStorage.getItem('item') || '');
watch(selectedAmount, (newValue) => {
    if (newValue) {
        selectionIsActive.value = true;
        saveItems();
    }
});

watch(inputAmount, (newValue) => {
    if (newValue) {
        selectionIsActive.value = false;
        saveItems();
    }
});
const saveItems = () => {
    if (selectionIsActive.value === true) {
        paidAmount.value = String(selectedAmount.value);
    } else {
        paidAmount.value = String(inputAmount.value);
    }
    // Save the items as an object to localStorage
    const itemsObject = {
        payersName: transactionEntity.value,
        payersEmail: departmentId.value,
        paidAmount: paidAmount.value,
        departmentId: departmentId.value,
    };
    localStorage.setItem("creditPurchaseDetails", JSON.stringify(itemsObject));
};
// LNMPO
const showMpesaIcon = function () {
    saveItems();
    MPESAInputDialog.value = true;
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
    store.handleMakeDonationViaPaypal({
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
    saveItems();
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
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                reference_id: "NEMBio Donation",
                                amount: {
                                    currency_code: "USD",
                                    value: paidAmount.value,
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
                                .handleMakeDonationViaPaypal({
                                    userId: userId,
                                    departmentId: departmentId.value,
                                    transactionEntity: transactionEntity.value,
                                    paidAmount: selectedAmount.value,
                                    transactionReferenceNumber: argParams.txnReference,
                                }) // eslint-disable-next-line
                                .then((response) => {
                                    window.location.href = "https://amanehospital.org/welcome";
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
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
    sans-serif;
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
  width: 130 !important; /* Set your desired width */
  height: 30px !important; /* Set your desired height */
}
</style>

<style scoped>
/* Add your parent component styles here */
</style>

<route lang="yaml">
meta:
  layout: HomeLayout
</route>