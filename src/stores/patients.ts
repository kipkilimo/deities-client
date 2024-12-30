import { defineStore } from "pinia";
import { client } from "@/graphql/apolloClient"; // Replace with your Apollo Client instance
import gql from "graphql-tag";

interface Location {
  city?: string;
  state?: string;
  country?: string;
}

interface NextOfKin {
  fullName: string;
  relationSpecify: string;
  phoneNumber: string;
  emailAddress?: string;
  homeAddress: string;
  areaChief?: string;
  nearestSchool?: string;
}

interface PatientPersonalInfo {
  id: string;
  patientId: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  yearOfBirth: string;
  gender?: string;
  profilePicture?: string;
  address?: Location;
  bio?: string;
  registrationDate: string;
  insuranceRegNumber?: string;
}

interface Patient {
  id: string;
  personalInfo: PatientPersonalInfo;
  nextOfKin: NextOfKin;
}

export const usePatientStore = defineStore("patient", {
  state: () => ({
    noSearchMatch: false,
    addingPatient: false,
    patients: [] as Patient[],
    patient: null as Patient | null,
    loading: false,
  }),
  actions: {
    async fetchAllPatients() {
      const GET_ALL_PATIENTS = gql`
        query {
          getAllPatients {
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
      `;

      try {
        this.loading = true;
        const response = await client.query({ query: GET_ALL_PATIENTS });
        this.patients = response.data?.getAllPatients || [];
      } catch (error) {
        console.error("Error fetching patients:", error);
        throw new Error("Failed to fetch patients.");
      } finally {
        this.loading = false;
      }
    },
    async handleGetPatientById(patientId: string) {
      const GET_PATIENT_BY_ID = gql`
    query getPatientById($patientId: String!) {
      getPatientById(patientId: $patientId) {
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
  `;

      this.loading = true; // Start loading

      try {
        const { data } = await client.query({
          query: GET_PATIENT_BY_ID,
          variables: { patientId },
        });

        this.patient = data.getPatientById || null;
        return this.patient; // Return the patient data if successful
      } catch (error) {
        console.error("Error fetching patient by ID:", error);
        throw new Error("Failed to fetch patient.");
      } finally {
        this.loading = false; // Ensure loading is stopped in both success and failure cases
      }
    }

    ,

    async addPatient(
      personalInfo,
      nextOfKin
    ) {
      const ADD_PATIENT = gql`
    mutation AddPatient(
      $personalInfo: PatientPersonalInfoInput!
      $nextOfKin: NextOfKinInput!
    ) {
      createPatient(
        personalInfo: $personalInfo
        nextOfKin: $nextOfKin
      ) {
        id
        personalInfo {
          fullName
          emailAddress
          phoneNumber
          yearOfBirth
          gender
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
  `;

      try {
        // Execute the GraphQL mutation
        const response = await client.mutate({
          mutation: ADD_PATIENT,
          variables: {
            personalInfo,
            nextOfKin,
          },
        });

        // Extract data from the response
        const createdPatient = response.data?.createPatient;

        if (createdPatient) {
          console.log("Patient created successfully:", createdPatient);
          return createdPatient; // Return the created patient details
        } else {
          throw new Error("Failed to create patient");
        }
      } catch (error) {
        console.error("Add Patient error:", error);
        throw new Error("Failed to create patient. Please try again.");
      }
    }
    ,

    async updatePatient(patientId: string, input: { personalInfo: PatientPersonalInfo; nextOfKin: NextOfKin }) {
      const UPDATE_PATIENT = gql`
        mutation UpdatePatient($patientId: String!, $input: UpdatePatientInput!) {
          updatePatient(patientId: $patientId, input: $input) {
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
      `;

      try {
        this.loading = true;
        const response = await client.mutate({
          mutation: UPDATE_PATIENT,
          variables: { patientId, input },
        });
        const updatedPatient = response.data?.updatePatient;
        if (updatedPatient) {
          const index = this.patients.findIndex((p) => p.id === patientId);
          if (index !== -1) this.patients[index] = updatedPatient;
          console.log("Patient updated successfully:", updatedPatient);
        }
      } catch (error) {
        console.error("Error updating patient:", error);
        throw new Error("Failed to update patient.");
      } finally {
        this.loading = false;
      }
    },

    async deletePatient(patientId: string) {
      const DELETE_PATIENT = gql`
        mutation DeletePatientById($patientId: String!) {
          deletePatientById(patientId: $patientId) {
            id
          }
        }
      `;

      try {
        this.loading = true;
        const response = await client.mutate({
          mutation: DELETE_PATIENT,
          variables: { patientId },
        });
        const deletedPatientId = response.data?.deletePatientById?.id;
        if (deletedPatientId) {
          this.patients = this.patients.filter((p) => p.id !== deletedPatientId);
          console.log("Patient deleted successfully:", deletedPatientId);
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        throw new Error("Failed to delete patient.");
      } finally {
        this.loading = false;
      }
    },
  },
});
