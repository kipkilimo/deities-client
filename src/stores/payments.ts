import { client } from "@/graphql/apolloClient";
import gql from "graphql-tag";
import { defineStore } from "pinia";

export const usePaymentsStore = defineStore("paymentStore", {
  state: () => ({
    payments: [] as any[],
  }),

  actions: {
    async handlePaymentViaWaiver(vals: {
      beneficiary: string;
      paidAmount: string;
      billingDepartment: string;
      billedItems: string;
      paymentPhoneNumber?: string;
      transactionReferenceNumber?: string;
      paymentMethod?: string;
    }) {
      const PAYMENT_VIA_WAIVER = gql`
        mutation amaneServicesPaymentViaWaiver(
          $beneficiary: String!
          $paidAmount: String!
          $billingDepartment: String!
          $billedItems: String!
          $paymentPhoneNumber: String
          $transactionReferenceNumber: String
          $paymentMethod: String
        ) {
          amaneServicesPaymentViaWaiver(
            beneficiary: $beneficiary
            paidAmount: $paidAmount
            billingDepartment: $billingDepartment
            billedItems: $billedItems
            paymentPhoneNumber: $paymentPhoneNumber
            transactionReferenceNumber: $transactionReferenceNumber
            paymentMethod: $paymentMethod
          ) {
            id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: PAYMENT_VIA_WAIVER,
          variables: { ...vals },
        });
        console.log("Payment via Waiver result:", result);

        window.location.href = "/dashboard/library";
      } catch (error) {
        console.error("Error with Waiver payment:", error);
      }
    },

    async handlePaymentViaMpesa(vals: {
      beneficiary: string;
      invoice: string;
      paidAmount: string;
      billingDepartment: string;
      billedItems: string;
      paymentPhoneNumber: string;
      transactionReferenceNumber?: string;
      paymentMethod?: string;
    }) {
      const PAYMENT_VIA_MPESA = gql`
        mutation amaneServicesPaymentViaMpesa(
          $beneficiary: String!
          $invoice: String!
          $paidAmount: String!
          $billingDepartment: String!
          $billedItems: String!
          $paymentPhoneNumber: String!
          $paymentMethod: String
        ) {
          amaneServicesPaymentViaMpesa(
            beneficiary: $beneficiary
            invoice: $invoice
            paidAmount: $paidAmount
            billingDepartment: $billingDepartment
            billedItems: $billedItems
            paymentPhoneNumber: $paymentPhoneNumber
            paymentMethod: $paymentMethod
          ) {
            id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: PAYMENT_VIA_MPESA,
          variables: { ...vals },
        });
        return result;
      } catch (error) {
        console.error("Error with MPESA payment:", error);
      }
    },

    async handlePaymentViaPaypal(vals: {
      beneficiary: string;
      invoice: string;
      paidAmount: string;
      billingDepartment: string;
      billedItems: string;
      paymentPhoneNumber?: string;
      transactionReferenceNumber?: string;
      paymentMethod?: string;
    }) {
      const PAYMENT_VIA_PAYPAL = gql`
        mutation amaneServicesPaymentViaPaypal(
          $beneficiary: String!
          $invoice: String!
          $paidAmount: String!
          $billingDepartment: String!
          $billedItems: String!
          $paymentPhoneNumber: String
          $transactionReferenceNumber: String
          $paymentMethod: String
        ) {
          amaneServicesPaymentViaPaypal(
            beneficiary: $beneficiary
            invoice: $invoice
            paidAmount: $paidAmount
            billingDepartment: $billingDepartment
            billedItems: $billedItems
            paymentPhoneNumber: $paymentPhoneNumber
            transactionReferenceNumber: $transactionReferenceNumber
            paymentMethod: $paymentMethod
          ) {
            id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: PAYMENT_VIA_PAYPAL,
          variables: { ...vals },
        });
        console.log("Payment via PayPal result:", result);

        window.location.href = "/dashboard/library";
      } catch (error) {
        console.error("Error with PayPal payment:", error);
      }
    },
    /*
    beneficiary: visitStore.currentVisit.patient.id,
    invoice: activeInvoice.value.id,
    paidAmount: paidAmount,
    billingDepartment: visitStore.currentVisit.doctor,
    billedItems: JSON.stringify(billItems.value),

    ///
      donor: String
      message: String
      paidAmount: String!
      paymentPhoneNumber: String!
      transactionReferenceNumber: String
      paymentMethod: String
      createdAt: String
    
    */
    async handleDonationViaMpesa(vals: {
      donor: string;
      message: string;
      paidAmount: string;
      paymentPhoneNumber: string;
      transactionReferenceNumber?: string;
      paymentMethod?: string;
    }) {
      const DONATION_VIA_MPESA = gql`
        mutation processAmaneMpesaDonation(
          $donor: String
          $message: String
          $paidAmount: String!
          $paymentPhoneNumber: String!
          $transactionReferenceNumber: String
          $paymentMethod: String
        ) {
          processAmaneMpesaDonation(
            donor: $donor
            message: $message
            paidAmount: $paidAmount
            paymentPhoneNumber: $paymentPhoneNumber
            transactionReferenceNumber: $transactionReferenceNumber
            paymentMethod: $paymentMethod
          ) {
            id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: DONATION_VIA_MPESA,
          variables: { ...vals },
        });
        console.log("Donation via MPESA result:", result);

        window.location.href = "/dashboard/library";
      } catch (error) {
        console.error("Error with MPESA donation:", error);
      }
    },

    async handleDonationViaPaypal(vals: {
      donor: string;
      message: string;
      paidAmount: string;
      paymentPhoneNumber?: string;
      transactionReferenceNumber?: string;
      paymentMethod?: string;
    }) {
      const DONATION_VIA_PAYPAL = gql`
        mutation processAmanePaypalDonation(
          $donor: String!
          $message: String!
          $paidAmount: String!
          $paymentPhoneNumber: String
          $transactionReferenceNumber: String
          $paymentMethod: String
        ) {
          processAmanePaypalDonation(
            donor: $donor
            message: $message
            paidAmount: $paidAmount
            paymentPhoneNumber: $paymentPhoneNumber
            transactionReferenceNumber: $transactionReferenceNumber
            paymentMethod: $paymentMethod
          ) {
            id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: DONATION_VIA_PAYPAL,
          variables: { ...vals },
        });
        console.log("Donation via PayPal result:", result);

        window.location.href = "/dashboard/library";
      } catch (error) {
        console.error("Error with PayPal donation:", error);
      }
    },
  },
});
