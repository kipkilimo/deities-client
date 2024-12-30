<template>
    <v-card class="mx-auto" max-width="344" title="Insurance Bill Claim">
        <v-container>
            <v-text-field v-model="fullName" color="primary" label="Patient's fullname"
                variant="underlined"></v-text-field>

            <v-text-field v-model="patientNumber" color="primary" label="Patient's number"
                variant="underlined"></v-text-field>

            <v-text-field v-model="principalMemberInsuranceNumber" color="primary"
                label="Principal member insurance number" variant="underlined"></v-text-field>

            <v-text-field v-model="insuranceCompanyName" color="primary" label="Password"
                placeholder="Insurance company name" variant="underlined"></v-text-field>

            <v-checkbox v-model="terms" color="secondary"
                label="I confirm the patient is eligible for insurance cover."></v-checkbox>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="success" :disabled="terms === false">
                Complete Bill Claim

                <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref, onBeforeMount, onMounted, nextTick, reactive, watch } from "vue";

// Declare reactive state using ref
const fullName = ref(visitStore.currentVisit.patient.personalInfo.fullName);
const patientNumber = ref(visitStore.currentVisit.patient.personalInfo.patientNumber);
const principalMemberInsuranceNumber = ref("");
const insuranceCompanyName = ref("");
const terms = ref(false);
// import {mapActions} from "pinia";

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

import { useRouter } from "vue-router";
import { DateTime } from "luxon";
import MPESAInput from "./MPESABillPayment.vue";
// import {loadScript, Buttons} from "@paypal/paypal-js";

const activeInvoice = ref({})// activeInvoiceRaw[0]
const billItems = ref([])
const total = computed(() => {
    return billItems.value.reduce((sum, item) => sum + item["__EMPTY_1"], 0);
});

const billedAmount = ref(String(total.value));


onBeforeMount(async () => {
    console.log({ activeVisit: visitStore.currentVisit });

    // Filter unpaid invoices
    const activeInvoiceRaw = visitStore.currentVisit.invoices.filter((invoice) => {
        return invoice.paid === false;
    });

    // Check if there are any invoices
    if (visitStore.currentVisit.invoices.length > 0) {
        activeInvoice.value = activeInvoiceRaw[0];

        // Parse and set billItems as iterable
        try {
            const parsedItems = JSON.parse(activeInvoiceRaw[0].items);
            billItems.value = Array.isArray(parsedItems) ? parsedItems : [];
        } catch (error) {
            console.error('Error parsing invoice items:', error);
            billItems.value = [];
        }
    }

    console.log({ activeInvoice: activeInvoice.value, billItems: billItems.value });
});


</script>
