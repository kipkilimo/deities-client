
<template>
  <div>
    <component :is="RoleBasedComponent" />
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useStaffStore } from "@/stores/staff";

// Import role-specific components
import ClinicalComponent from "./components/Clinical.vue";
import RecordsComponent from "./components/Records.vue";
import AdministrativeComponent from "./components/Administrative.vue";

import AccountsComponent from "./components/CashOffice.vue";
import LaboratoryComponent from "./components/Laboratory.vue";
import NursingComponent from "./components/Nursing.vue";

// Access the staff store
const staffStore = useStaffStore();

// Map roles to their respective components
const roleToComponentMap = {
  CLINICAL: ClinicalComponent,
  RECORDS: RecordsComponent,
  ADMINISTRATIVE: AdministrativeComponent,
  ACCOUNTANT: AccountsComponent,
  LABORATORY: LaboratoryComponent,
  NURSING: NursingComponent,
};

// Dynamically compute the component to render based on the user's role
const RoleBasedComponent = computed(() => {
  const role = staffStore.staff.role || ""; // Adjust this if the role property is named differently
  return roleToComponentMap[role] || null; // Default to `null` if role is unrecognized
});
</script>

<route lang="yaml">
meta:
  layout: DashboardLayout
</route>
