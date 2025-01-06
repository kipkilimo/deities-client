<template>
  <div class="text-center pa-4">
    <v-card
      max-width="400"
      prepend-icon="mdi-exit-to-app"
      text="Your about to close the current patient visit."
      title="Confirm visit close and complete?"
    >
      <v-divider />
      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="xl"
          text="Cancel"
          color="grey"
          @click="visitStore.closeCurrentVisitAlert = false"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="xl"
          prepend-icon="mdi-exit-to-app"
          text="Complete and Close"
          variant="outlined"
          @click="confirmedVisitCloseAction"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import { useStaffStore } from "@/stores/staff";
import { useInvoiceStore } from "@/stores/invoices";

import { useVisitStore } from "@/stores/visits";
const visitStore = useVisitStore();

const invoiceStore = useInvoiceStore();
</script>
