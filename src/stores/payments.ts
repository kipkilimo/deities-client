// Import Apollo Client and GraphQL functions
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();
export const usePaymentsStore = defineStore("paymentStore", {
  state: () => ({
    payments: [] as any[],
    paymentObject: {} as Record<string, any>,
    payment: {} as Record<string, any>,
  }),
  actions: {
    async handleMakeAccessPaymentViaWAIVER(vals: {
      userId: string;
      discussionGroupId: string;
    }) {
      const ACCESS_TOKEN_CHECKOUT_WAIVER = gql`
        mutation publicationCreditsPaymentViaWaiver(
          $userId: String!
          $discussionGroupId: String!
        ) {
          publicationCreditsPaymentViaWaiver(
            userId: $userId
            discussionGroupId: $discussionGroupId
          ) {
            _id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: ACCESS_TOKEN_CHECKOUT_WAIVER,
          variables: {
            userId: vals.userId,
            discussionGroupId: vals.discussionGroupId,
          },
        });
        console.log(result);
        setTimeout(() => {
          window.location.href = "/dashboard/library";
        }, 1800);
      } catch (error) {
        console.error("MPESA Payment error: ", error);
        setTimeout(() => {
          localStorage.removeItem("currentUser");
          const router = useRouter();

          window.location.href = "/dashboard/library";
        }, 1800);
      }
    },

    //handleDonationViaMpesa
    async handleDonationViaMpesa(vals: {
      userId: string;
      transactionReferenceNumber: string; // Ensure this field is present in vals
      paidAmount: string;
      transactionEntity: string; // Optional if not used in mutation
      departmentId: string; // Optional if not used in mutation
      discussionGroupId: string; // Optional if not used in mutation
      paymentPhoneNumber: string; // Ensure this field matches mutation processPaypalDonation
    }) {
      const RECEIVE_DONATION_MPESA = gql`
        mutation processMpesaDonation(
          $userId: String
          $paidAmount: String!
          $transactionReferenceNumber: String
          $paymentPhoneNumber: String!
          $transactionEntity: String
          $departmentId: String
          $discussionGroupId: String
        ) {
          processMpesaDonation(
            userId: $userId
            paidAmount: $paidAmount
            transactionReferenceNumber: $transactionReferenceNumber
            paymentPhoneNumber: $paymentPhoneNumber
            transactionEntity: $transactionEntity
            departmentId: $departmentId
            discussionGroupId: $discussionGroupId
          ) {
            _id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: RECEIVE_DONATION_MPESA,
          variables: {
            userId: vals.userId,
            paidAmount: String(vals.paidAmount),
            transactionReferenceNumber: vals.transactionReferenceNumber,
            paymentPhoneNumber: vals.paymentPhoneNumber, // Ensure this matches vals

            transactionEntity: vals.transactionEntity,
            departmentId: vals.departmentId,
            discussionGroupId: vals.discussionGroupId,
          },
        });

        window.location.href = "/dashboard/library";
      } catch (error) {
        console.error("MPESA Payment error: ", error);
      }
    },

    async handleMakeDonationViaPaypal(vals: {
      userId: string;
      transactionReferenceNumber: string; // Add this field if it's missing
      paidAmount: string;
      transactionEntity: string; // Add this field if it's missing
      departmentId: string; // Mark optional if not used in mutation
      discussionGroupId: string; // Mark optional if not used in mutation
    }) {
      const RECEIVE_DONATION_PAYPAL = gql`
        mutation processPaypalDonation(
          $userId: String
          $transactionReferenceNumber: String!
          $paidAmount: String!
          $transactionEntity: String
          $departmentId: String
          $discussionGroupId: String
        ) {
          processPaypalDonation(
            userId: $userId
            transactionReferenceNumber: $transactionReferenceNumber
            paidAmount: $paidAmount
            transactionEntity: $transactionEntity
            departmentId: $departmentId
            discussionGroupId: $discussionGroupId
          ) {
            _id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: RECEIVE_DONATION_PAYPAL,
          variables: {
            userId: vals.userId,
            transactionReferenceNumber: vals.transactionReferenceNumber, // Make sure this field is present in vals
            paidAmount: String(vals.paidAmount),
            transactionEntity: vals.transactionEntity, // Ensure this is present too
            departmentId: vals.departmentId,
            discussionGroupId: vals.discussionGroupId,
          },
        });
        console.log(result);
        setTimeout(() => {
          window.location.href = "/dashboard/library";
        }, 1800);
      } catch (error) {
        console.error("PayPal Payment error: ", error);
      }
    },
    // handleMakeDonationViaPaypal,

    async publicationCreditsPaymentViaMpesa(vals: {
      userId: string;
      transactionReferenceNumber: string; // Ensure this field is present in vals
      paidAmount: string;
      transactionEntity: string; // Optional if not used in mutation
      departmentId: string; // Optional if not used in mutation
      discussionGroupId: string; // Optional if not used in mutation
      paymentPhoneNumber: string; // Ensure this field matches mutation
    }) {
      const ACCESS_TOKEN_CHECKOUT_MPESA = gql`
        mutation publicationCreditsPaymentViaMpesa(
          $userId: String!
          $paidAmount: String!
          $transactionReferenceNumber: String
          $paymentPhoneNumber: String!
          $transactionEntity: String!
          $departmentId: String
          $discussionGroupId: String
        ) {
          publicationCreditsPaymentViaMpesa(
            userId: $userId
            paidAmount: $paidAmount
            transactionReferenceNumber: $transactionReferenceNumber
            paymentPhoneNumber: $paymentPhoneNumber
            transactionEntity: $transactionEntity
            departmentId: $departmentId
            discussionGroupId: $discussionGroupId
          ) {
            _id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: ACCESS_TOKEN_CHECKOUT_MPESA,
          variables: {
            userId: vals.userId,
            paidAmount: String(vals.paidAmount),
            transactionReferenceNumber: vals.transactionReferenceNumber,
            paymentPhoneNumber: vals.paymentPhoneNumber, // Ensure this matches vals

            transactionEntity: vals.transactionEntity,
            departmentId: vals.departmentId,
            discussionGroupId: vals.discussionGroupId,
          },
        });
        console.log(result);
        return result;
      } catch (error) {
        console.error("MPESA Payment error: ", error);
      }
    },

    async handleMakeAccessPaymentViaPaypal(vals: {
      userId: string;
      transactionReferenceNumber: string; // Add this field if it's missing
      paidAmount: string;
      transactionEntity: string; // Add this field if it's missing
      departmentId: string; // Mark optional if not used in mutation
      discussionGroupId: string; // Mark optional if not used in mutation
    }) {
      const ACCESS_TOKEN_CHECKOUT_PAYPAL = gql`
        mutation publicationCreditsPaymentViaPaypal(
          $userId: String!
          $transactionReferenceNumber: String!
          $paidAmount: String!
          $transactionEntity: String!
          $departmentId: String
          $discussionGroupId: String
        ) {
          publicationCreditsPaymentViaPaypal(
            userId: $userId
            transactionReferenceNumber: $transactionReferenceNumber
            paidAmount: $paidAmount
            transactionEntity: $transactionEntity
            departmentId: $departmentId
            discussionGroupId: $discussionGroupId
          ) {
            _id
          }
        }
      `;

      try {
        const result = await client.mutate({
          mutation: ACCESS_TOKEN_CHECKOUT_PAYPAL,
          variables: {
            userId: vals.userId,
            transactionReferenceNumber: vals.transactionReferenceNumber, // Make sure this field is present in vals
            paidAmount: String(vals.paidAmount),
            transactionEntity: vals.transactionEntity, // Ensure this is present too
            departmentId: vals.departmentId,
            discussionGroupId: vals.discussionGroupId,
          },
        });
        console.log(result);
        setTimeout(() => {
          window.location.href = "/dashboard/library";
        }, 1800);
      } catch (error) {
        console.error("PayPal Payment error: ", error);
      }
    },
  },
});
