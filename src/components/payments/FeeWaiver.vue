<template>
  <div>
    <v-container>
      <v-alert border="top" type="warning" variant="outlined" class="mt-4" width="100%" v-if="error">
        {{ error }}
      </v-alert>

      <v-alert border="top" v-if="success" type="success" class="mt-4" width="100%" variant="outlined">
        {{ success }}
      </v-alert>
    </v-container>
    <v-card class="mx-auto pa-8 pb-4" elevation="8" max-width="448" rounded="lg">
      <!-- Error alert -->

      <!-- Image -->
      <v-img class="mx-auto my-2 mb-6" min-width="100%"
        src="https://www.providecover.com//wp-content/uploads/elementor/thumbs/AdobeStock_396551112-scaled-e1620904405571-q60rlre05yf37kzwokcdw2cfrxaa4oh8tj69rhjkb8.jpeg"
        alt="Invest"></v-img>

      <!-- Subtitle -->
      <div class="text-subtitle-1 ma-1 mb-1 text-medium-emphasis">
        Amane Hospital Publication Credits Waiver Request
      </div>

      <!-- Form -->
      <v-form v-model="isFormValid" lazy-validation>
        <v-row>
          <v-col cols="12" sm="12">
            <!-- Phone Number Input -->
            <v-text-field density="compact" placeholder="Enter discussion group ID" label="Discussion group ID"
              prepend-inner-icon="mdi-barcode-scan" variant="outlined" :disabled="isLoading" v-model="dgId"
              :rules="idRules"></v-text-field>

            <!-- WAIVER instructions -->
            <v-card class="mb-12" color="surface-variant" variant="tonal">
              <v-card-text class="text-medium-emphasis text-caption indigo-text">
                This process will initiate annual Amane Hospital Publication Credits Fee Waiver
                request.
                <p>
                  To ensure fair usage policy, you are allowed to create only
                  one discussion group of upto 15 members.
                </p>
              </v-card-text>
            </v-card>

            <!-- Submit Waiver Request Button -->
            <v-btn block rounded="4" variant="tonal" class="mb-8" color="#2c9933" size="large"
              :disabled="dgId.length !== 12 || isLoading" :loading="isLoading"
              @click="handlePublicationCreditsPaymentViaWaiver">
              Submit Waiver Request
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

import { useUserStore } from "@/stores/staff";
const userId = localStorage.getItem("sessionId");
const DOLLAR_RATE = import.meta.env.VITE_DOLLAR_RATE;

// Validation rules for phone number
const idRules = [
  (v) => !!v || "ID is required", // Ensure a value is provided
  (v) =>
    /^[A-Za-z0-9]{11}$/.test(v) ||
    "ID must be 11 characters long and alphanumeric", // Matches exactly 11 characters, upper/lowercase letters and digits
];

const dgId = ref(useUserStore().user.discussion_groups[0].discussionGroupId);
const success = ref(null);
const error = ref(null);
const isLoading = ref(false);
const isFormValid = ref(true);

const handlePublicationCreditsPaymentViaWaiver = async () => {
  const paymentsStore = usePaymentsStore();
  isLoading.value = true;
  try {
    const retrievedWaiverRequestDetails = JSON.parse(
      localStorage.getItem("creditWaiver RequestDetails") || "{}"
    );
    const dgId_full = dgId.value;
    const vals = {
      userId: userId,
      discussionGroupId: dgId_full,
    };

    await paymentsStore.handleMakeAccessPaymentViaWAIVER(vals);
    success.value = "Waiver Request successfully sent. Thank you!";
    setTimeout(() => {
      isLoading.value = false;
      window.location = "/";
    }, 1300000);
  } catch (err) {
    error.value = err.message.replace("GraphQL error:", "").trim();
    setTimeout(() => {
      isLoading.value = false;
      window.location = "/";
    }, 1300000);
  }
};
</script>
