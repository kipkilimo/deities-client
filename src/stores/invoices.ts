import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Your Apollo Client instance
import gql from "graphql-tag";

export const useInvoiceStore = defineStore("invoices", {
  state: () => ({
    createNewInvoice: false,
    createNewServiceList: false,
    invoices: [] as Invoice[], // Stores fetched invoices
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async handleSubmit(invoiceInput: InvoiceInput) {
      const ADD_INVOICE_TO_VISIT = gql`
        mutation AddInvoiceToVisit($invoiceInput: InvoiceInput!) {
          addInvoiceToVisit(invoiceInput: $invoiceInput) {
            id
            date
            items
            totalAmount
            paid
          }
        }
      `;

      try {
        this.loading = true;
        const response = await client.mutate({
          mutation: ADD_INVOICE_TO_VISIT,
          variables: { invoiceInput },
        });

        const addedInvoice = response.data?.addInvoiceToVisit;
        if (addedInvoice) {
          this.invoices.push(addedInvoice); // Update state with the new invoice
          return addedInvoice; // Return the newly added invoice
        } else {
          throw new Error("Failed to add invoice");
        }
      } catch (error) {
        console.error("Add Invoice Error:", error);
        this.error = "Failed to add invoice. Please try again.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchInvoices() {
      const GET_INVOICES = gql`
        query GetInvoices {
          invoices {
            id
            date
            items
            totalAmount
            paid
            beneficiary {
              id
              fullName
            }
            visit {
              id
              reasonForVisit
            }
          }
        }
      `;

      try {
        this.loading = true;
        const response = await client.query({
          query: GET_INVOICES,
        });

        const invoices = response.data?.invoices;
        if (invoices) {
          this.invoices = invoices;
        } else {
          throw new Error("Failed to fetch invoices");
        }
      } catch (error) {
        console.error("Fetch Invoices Error:", error);
        this.error = "Failed to fetch invoices. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    resetError() {
      this.error = null;
    },
  },
});

// Interfaces for TypeScript
interface Invoice {
  id: string;
  date: string; // Use `Date` if you convert strings to dates
  items: string[];
  totalAmount: number;
  paid: boolean;
  beneficiary: {
    id: string;
    fullName: string;
  };
  visit: {
    id: string;
    reasonForVisit: string;
  };
}

interface InvoiceInput {
  date: string; // Use `Date` if sending actual date objects
  items: string[];
  totalAmount: number;
  paid: boolean;
  beneficiary: string; // Patient ID
  visit: string; // Visit ID
}
