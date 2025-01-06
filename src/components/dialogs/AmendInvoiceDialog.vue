<template>
  <v-card prepend-icon="mdi-file-document-edit-outline" title="Amend Invoice">
    <v-card-title>Update Invoice Items</v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" v-for="(item, index) in billItems" :key="index">
          <v-chip
            class="my-2 py-2 px-3 d-flex align-center justify-space-between"
            color="blue lighten-4"
            text-color="blue darken-4"
            outlined
            size="x-large"
          >
            <span
              class="text-overline font-weight-medium"
              style="
                max-width: 80%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ item["__EMPTY"] }}
            </span>
            <v-btn
              icon
              size="x-small"
              variant="outlined"
              :disabled="billItems.length < 2"
              class="ml-4"
              color="red darken-1"
              @click="removeItem(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-chip>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-alert
        v-if="recentlyDeleted.length > 0"
        type="info"
        dismissible
        class="mt-4"
      >
        Items removed.
        <v-btn text color="blue" @click="restoreAllItems"> Restore All </v-btn>
      </v-alert>

      <v-divider class="mt-2"></v-divider>
      <v-row>
        <v-col cols="12" v-if="recentlyDeleted.length > 0">
          <v-chip
            v-for="(removedItem, index) in recentlyDeleted"
            :key="index"
            class="my-2 py-1 px-3"
            color="red lighten-4"
            text-color="red darken-4"
            outlined
            @click="restoreItem(index)"
            close
          >
            {{ removedItem["__EMPTY"] }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="me-2 text-none"
        color="#009ee3"
        prepend-icon="mdi-invoice-text-check-outline"
        variant="outlined"
        @click="handleInvoiceUpdateSubmit"
      >
        Submit update
      </v-btn>
      <v-btn
        text
        color="red"
        @click="invoiceStore.updatingCurrentInvoice = false"
        >Close</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useInvoiceStore } from "@/stores/invoices";
import { useVisitStore } from "@/stores/visits";

const invoiceStore = useInvoiceStore();
const visitStore = useVisitStore();

const billItems = ref([]);
const recentlyDeleted = ref([]); // Stack to store recently deleted items

async function buildServicesList() {
  const matchingElements = JSON.parse(invoiceStore.currentInvoice.items);
  billItems.value = matchingElements;
}

onMounted(() => {
  buildServicesList();
});

// Watch for total price updates
const total = ref(0);
watch(
  billItems,
  (newItems) => {
    total.value = newItems.reduce((sum, item) => sum + item["__EMPTY_1"], 0);
  },
  { deep: true }
);

// Remove an item and store it for undo
const removeItem = (index) => {
  const removedItem = billItems.value.splice(index, 1)[0];
  recentlyDeleted.value.push(removedItem);
};

// Restore the item that was removed
const restoreItem = (index) => {
  const restoredItem = recentlyDeleted.value.splice(index, 1)[0];
  billItems.value.push(restoredItem);
};

// Restore all removed items
const restoreAllItems = () => {
  while (recentlyDeleted.value.length > 0) {
    const restoredItem = recentlyDeleted.value.pop();
    billItems.value.push(restoredItem);
  }
};

// Submit updated invoice
const handleInvoiceUpdateSubmit = async () => {
  const payload = {
    items: JSON.stringify(billItems.value),
    totalAmount: total.value,
    invoiceId: invoiceStore.currentInvoice.id,
  };

  await invoiceStore.invoiceUpdateSubmit(payload);
  invoiceStore.createNewInvoice = false;
  window.location.reload();
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
