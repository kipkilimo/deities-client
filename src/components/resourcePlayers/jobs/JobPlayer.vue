<template>
  <v-card
    class="pa-4"
    height="78vh" flat color="#ffffff"
    elevation="1"
 
  >
    <v-row>
      <v-col cols="4"
        ><v-img :src="resourceStore.resource.coverImage"></v-img
      ></v-col>
      <v-col cols="6">
        <v-card-title class="headline">Job Details</v-card-title>

        <v-card-subtitle class="mb-2">Title: {{ job.title }}</v-card-subtitle> 
        <v-card-subtitle class="mb-2"
          >Organization: {{ job.organization }}</v-card-subtitle
        >
        <v-card-subtitle class="mb-2"
          >Department: {{ job.department }}</v-card-subtitle
        >
       
      </v-col>
    </v-row>

    <v-divider class="mt-2"></v-divider>
<br>
    <v-card-subtitle class="mb-2"
      >Max Hours Per Week: {{ job.hoursPerWeek }}</v-card-subtitle
    >
    <v-card-subtitle class="mb-2">Pay Rate: {{ job.payRate }}</v-card-subtitle>
    <v-card-subtitle class="mb-2"
      >Start Date: {{ formatLongDateWithTime(job.startDate) }}</v-card-subtitle
    >
    <v-card-subtitle class="mb-2">End Date: {{ formatLongDateWithTime(job.endDate) }}</v-card-subtitle>
    <v-card-subtitle class="mb-2"
      >Application Deadline: {{ formatLongDateWithTime(job.applicationDeadline) }}</v-card-subtitle
    >

    <v-divider></v-divider>

<br>
    <v-card-text>
      <v-subheader>Description:</v-subheader>
      <v-divider></v-divider>
      <p>{{ job.description }}</p>

      <v-subheader>Requirements:</v-subheader>
      <v-divider></v-divider>
      <ul>
        <li v-for="(requirement, index) in job.requirements" :key="index">
          {{ requirement }}
        </li>
      </ul>

      <v-subheader>Preferred Qualifications:</v-subheader>
      <v-divider></v-divider>
      <ul>
        <li
          v-for="(qualification, index) in job.preferredQualifications"
          :key="index"
        >
          {{ qualification }}
        </li>
      </ul>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-icon>mdi-account</v-icon>
      <span>{{ job.contactInformation.name }}</span>
      <v-spacer></v-spacer>
      <v-icon>mdi-email</v-icon>
      <span>{{ job.contactInformation.email }}</span>
      <v-spacer></v-spacer>
      <v-icon>mdi-phone</v-icon>
      <span>{{ job.contactInformation.phoneNumber }}</span>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-card {
  border-radius: 10px;
}
</style>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useResourceStore } from "@/stores/resources";

const resourceStore = useResourceStore();

// Slide URLs
const retrievedParamsRaw = resourceStore.resource.content;

// Sort the URLs
// Assuming you have retrieved paramsObjRaw from storage or API
const retrievedParams = JSON.parse(retrievedParamsRaw);
const job = retrievedParams[0];
function formatLongDateWithTime(dateString: string | number | Date) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Change to false for 24-hour format
    timeZoneName: 'short'
  });
}

// Example usage
const formattedDate = formatLongDateWithTime('2024-09-28T21:00:00.000Z');
console.log(formattedDate);

</script>

<style scoped>
.v-carousel--fullscreen {
  height: 100vh;
}

.slide-img {
  max-height: 100vh;
  max-width: 100vw;
}

.v-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-btn {
  color: white;
}
</style>
