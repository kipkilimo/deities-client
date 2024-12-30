import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

// Define the Visit and VisitInput types
interface Visit {
  id: string;
  visitNumber: string;
  visitStartDateTime: string; // Use a string for Date, or you can use a Date object if needed
  visitEndDateTime?: string; // Optional end time
  visitStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
  visitType: "INPATIENT" | "OUTPATIENT";
  doctor: string;
  reason: string;
  prescriptions: string[];
  invoices: any[]; // Define an appropriate type for invoices
  payments: any[]; // Define an appropriate type for payments
  reports: any[]; // Define an appropriate type for reports
  notes: any[]; // Define an appropriate type for notes
  patient: any; // Define an appropriate type for Patient (or import it if needed)
}

interface VisitInput {
  visitNumber: string;
  visitStartDateTime: string;
  visitEndDateTime?: string;
  visitStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
  visitType: "INPATIENT" | "OUTPATIENT";
  doctor: string;
  reason: string;
  patientId: string; // Link to the Patient schema (or import Patient type if needed)
}

const router = useRouter();

export const useVisitStore = defineStore("visit", {
  state: () => ({
    fetchingVisits: false,
    createNewVisit: false,
    createNewDocumentation: false,
    visits: [] as Visit[], // Store all visits
    currentVisit: null as Visit | null,
  }),
  actions: {
    // Fetch all visits for a particular patient
    // getAllActiveVisits
    setActiveVisit(
      visit: {
        id: string;
        visitNumber: string;
        visitStartDateTime: string;
        visitEndDateTime?: string | undefined;
        visitStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
        visitType: "INPATIENT" | "OUTPATIENT";
        doctor: string;
        reason: string;
        prescriptions: string[];
        invoices: any[];
        payments: any[];
        reports: any[];
        notes: any[];
        patient: any;
      } | null
    ) {
      this.currentVisit = visit;
      let visitId = "";
      if (visit) {
        visitId = visit.id;
      }
      this.getCurrentVisit(visitId);
    },
    async handleGetAllActiveVisits() {
      this.fetchingVisits = true;
      this.visits = [];
      const GET_ACTIVE_VISITS = gql`
        query getAllActiveVisits {
          getAllActiveVisits {
            id
            visitNumber
            visitStartDateTime
            visitEndDateTime
            visitStatus
            visitType
            doctor
            reason
            prescriptions
            invoices {
              id
              totalAmount
              paid
              items
              date
            }
            payments {
              id
              paidAmount
              createdAt
              invoice {
                id
              }
              transactionReferenceNumber
            }
            reports {
              id
              title
              description
              fileUrl
            }
            notes {
              id
              content
            }
            patient {
              id
              personalInfo {
                patientId
                fullName
                emailAddress
                phoneNumber
                yearOfBirth
                gender
                profilePicture
                address {
                  city
                  state
                  country
                }
                bio
                registrationDate
                insuranceRegNumber
              }
              nextOfKin {
                fullName
                relationSpecify
                phoneNumber
                emailAddress
                homeAddress
                areaChief
                nearestSchool
              }
            }
          }
        }
      `;

      try {
        const response = await client.query({
          query: GET_ACTIVE_VISITS,
        });

        const visits = response.data.getAllActiveVisits;
        if (visits) {
          this.visits = visits; // Assign visits to the state
          this.fetchingVisits = false;
        } else {
          console.warn("No active visits found.");
        }
      } catch (error: any) {
        console.error("Fetch visits error:", error);
        // Optional: Handle error more gracefully (e.g., save it to state for UI display)
        return (
          error.message || "Failed to fetch visits. Please try again later."
        );
      }
    },
    async getCurrentVisit(visitId: string) {
      const GET_CURRENT_VISIT = gql`
        query GetCurrentVisit($visitId: String!) {
          getCurrentVisit(visitId: $visitId) {
            id
            visitNumber
            visitStartDateTime
            visitEndDateTime
            visitStatus
            visitType
            doctor
            reason
            prescriptions
            invoices {
              id
              totalAmount
              paid
            }
            payments {
              id
              paidAmount
              createdAt
              invoice {
                id
              }
              transactionReferenceNumber
            }
            reports {
              id
              title
              description
              fileUrl
            }
            notes {
              id
              content
            }
            patient {
              id
              personalInfo {
                fullName
              }
            }
          }
        }
      `;

      try {
        const response = await client.query({
          query: GET_CURRENT_VISIT,
          variables: { visitId },
          fetchPolicy: "network-only", // Ensure fresh data is fetched
        });

        const currentVisit = response.data?.getCurrentVisit;
        if (currentVisit) {
          this.currentVisit = currentVisit;
        }
      } catch (error) {
        console.error("Fetch current visit error:", error);
      }
    },

    async getVisitsByPatient(patientId: string) {
      const GET_VISITS_BY_PATIENT = gql`
        query GetVisitsByPatient($patientId: ID!) {
          getVisitsByPatient(patientId: $patientId) {
            id
            visitNumber
            visitStartDateTime
            visitEndDateTime
            visitStatus
            visitType
            doctor
            reason
            prescriptions
            invoices {
              id
              totalAmount
              paid
            }
            payments {
              id
              paidAmount
              createdAt
              invoice {
                id
              }
              transactionReferenceNumber
            }
            reports {
              id
              title
              description
              fileUrl
            }
            notes {
              id
              content
            }
            patient {
              id
              personalInfo {
                fullName
              }
            }
          }
        }
      `;

      try {
        const response = await client.query({
          query: GET_VISITS_BY_PATIENT,
          variables: { patientId },
        });

        const visits = response.data?.getVisitsByPatient;
        if (visits) {
          this.visits = visits;
        }
      } catch (error) {
        console.error("Fetch visits error:", error);
      }
    },

    // Create a new visit
    async createVisit(input: VisitInput) {
      const CREATE_VISIT = gql`
        mutation CreateVisit($input: VisitInput!) {
          createVisit(input: $input) {
            id
            visitNumber
            visitStartDateTime
            visitEndDateTime
            visitStatus
            visitType
            doctor
            reason
            prescriptions
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: CREATE_VISIT,
          variables: { input },
        });

        const createdVisit = response.data.createVisit;
        if (createdVisit) {
          this.currentVisit = createdVisit;
          this.visits.push(createdVisit); // Add new visit to the state
          this.createNewVisit = false;
          return "Success, patient added to queue.";
        } else {
          this.createNewVisit = false;
          return "Error! Close active queue first!";
        }
      } catch (error: any) {
        // Log the error for debugging (optional)
        console.error("CreateVisit Error:", error);

        // Handle and return the error
        this.createNewVisit = false;
        throw new Error(
          error.message || "An error occurred while creating the visit."
        );
      }
    },
    // Update a visit
    async updateVisit(id: string, input: VisitInput) {
      const UPDATE_VISIT = gql`
        mutation UpdateVisit($id: ID!, $input: VisitInput!) {
          updateVisit(id: $id, input: $input) {
            id
            visitNumber
            visitStartDateTime
            visitEndDateTime
            visitStatus
            visitType
            doctor
            reason
            prescriptions
            invoices {
              id
              totalAmount
              paid
            }
            payments {
              id
              paidAmount
              createdAt
              invoice {
                id
              }
              transactionReferenceNumber
            }
            reports {
              id
              title
              description
              fileUrl
            }
            notes {
              id
              content
            }
            patient {
              id
              personalInfo {
                fullName
              }
            }
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: UPDATE_VISIT,
          variables: { id, input },
        });

        const updatedVisit = response.data?.updateVisit;
        if (updatedVisit) {
          // Update the visit in the state
          const index = this.visits.findIndex((v) => v.id === id);
          if (index !== -1) {
            this.visits[index] = updatedVisit;
          }
        }
      } catch (error) {
        console.error("Update visit error:", error);
      }
    },

    // Delete a visit
    async deleteVisit(id: string) {
      const DELETE_VISIT = gql`
        mutation DeleteVisit($id: ID!) {
          deleteVisit(id: $id) {
            id
          }
        }
      `;

      try {
        const response = await client.mutate({
          mutation: DELETE_VISIT,
          variables: { id },
        });

        const deletedVisit = response.data?.deleteVisit;
        if (deletedVisit) {
          // Remove the visit from the state
          this.visits = this.visits.filter((visit) => visit.id !== id);
        }
      } catch (error) {
        console.error("Delete visit error:", error);
      }
    },
  },
});
