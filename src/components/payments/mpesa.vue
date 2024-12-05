<template>
  <div>
    <v-card
      class="mx-auto pa-8 pb-4"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <!-- Error alert -->
      <v-container>
        <v-alert
          border="top"
          type="warning"
          variant="outlined"
          prominent
          class="mt-4"
          width="100%"
          v-if="error"
        >
          {{ error }}
        </v-alert>

        <v-alert
          border="top"
          v-if="success"
          type="success"
          class="mt-4"
          width="100%"
          variant="outlined"
          prominent
        >
          {{ success }}
        </v-alert>
      </v-container>

      <!-- Image -->
      <v-img
        class="mx-auto my-2 mb-6"
        max-width="18rem"
        src="https://a2z-v0.s3.eu-central-1.amazonaws.com/0019616_lipanampesa-removebg-preview+(1).png"
        alt="Invest"
      ></v-img>

      <!-- Subtitle -->
      <div class="text-subtitle-1 text-medium-emphasis">Purchase Via MPESA</div>

      <!-- Form -->
      <v-form v-model="isFormValid" lazy-validation>
        <v-row>
          <v-col cols="12" sm="12">
            <!-- Phone Number Input -->
            <v-text-field
              density="compact"
              placeholder="Safaricom mobile phone number"
              label="MPESA phone number"
              prepend-inner-icon="mdi-cellphone-text"
              variant="outlined"
              :disabled="isLoading"
              v-model="phone_number"
              :rules="phonenumberRules"
            ></v-text-field>

            <!-- MPESA instructions -->
            <v-card class="mb-12" color="surface-variant" variant="tonal">
              <v-card-text
                class="text-medium-emphasis text-caption indigo-text"
              >
                This process will initiate an MPESA transaction.
                <p>
                  When prompted on your phone, enter your MPESA PIN and submit.
                </p>
              </v-card-text>
            </v-card>

            <!-- Initiate Purchase Button -->
            <v-btn
              block
              rounded="4"
              variant="tonal"
              class="mb-8"
              color="#2c9933"
              size="large"
              :disabled="phone_number.length < 9 || isLoading"
              :loading="isLoading"
              @click="handlePublicationCreditsPaymentViaMpesa"
            >
              Initiate Purchase
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { usePaymentsStore } from "@/stores/payments";
import { ref } from "vue";
import { DateTime } from "luxon";

const userId = localStorage.getItem("sessionId");
const DOLLAR_RATE = import.meta.env.VITE_DOLLAR_RATE;

// Validation rules for phone number
const phonenumberRules = [
  (v) => !!v || "Mobile phone number is required",
  (v) =>
    /^(?:254|\+254|0)?((?:7|1)(?:(?:[123456789][0-9])|(?:0[0-8])|(9[0-2]))[0-9]{6})$/.test(
      v
    ) || "Please add a valid mobile phone number",
  (v) => (v && v.length <= 13) || "Phone number too long",
  (v) => (v && v.length >= 9) || "Phone number too short",
];

const phone_number = ref("");
const success = ref(null);
const error = ref(null);
const isLoading = ref(false);
const isFormValid = ref(true);
const handlePublicationCreditsPaymentViaMpesa = async () => {
  const paymentsStore = usePaymentsStore();
  isLoading.value = true;
  try {
    const retrievedPurchaseDetails = JSON.parse(
      localStorage.getItem("creditPurchaseDetails") || "{}"
    );
    console.log({ retrievedPurchaseDetails });
    var lastNine = phone_number.value.slice(-9);
    const phone_number_full = `254${lastNine}`;
    const vals = {
      userId: userId,
      paymentPhoneNumber: phone_number_full,
      paidAmount: String(
        (Number(retrievedDonationDetails.paidAmount) * DOLLAR_RATE).toFixed(0)
      ),
      departmentId: retrievedPurchaseDetails.departmentId,
      transactionEntity: retrievedPurchaseDetails.payersName,
    };

    const response =
      await paymentsStore.publicationCreditsPaymentViaMpesa(vals);
    console.log({ paymentResponse: response });
    if (response.transactionReferenceNumber.length === 12) {
      success.value = "Success. Publication credits have been updated.";
    }
    setTimeout(() => {
      isLoading.value = false;

      window.location.href = "/dashboard/services";
      success.value = null;
    }, 4200);
  } catch (err) {
    error.value = err.message.replace("GraphQL error:", "").trim();
    isLoading.value = false;
  }
};
</script>
