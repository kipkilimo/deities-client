<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Real-time information</h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-stepper v-model="currentStep" vertical>
        <v-stepper-header>
          <v-stepper-step
            :key="station.name"
            v-for="station in stations"
            :active="isActiveStep(station)"
          >
            {{ station.name }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content v-for="(station, index) in visibleStations" :key="index">
            <v-card :class="{ 'current-station': isActiveStep(station) }">
              <v-card-title class="headline">{{ station.time }}</v-card-title>
              <v-card-subtitle>{{ station.name }}</v-card-subtitle>
              <v-card-text>{{ station.platform }}</v-card-text>
              <v-card-actions>
                <v-btn>Real-time information</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Station {
  time: string;
  name: string;
  platform: string;
}

const stations: Station[] = [
  { time: "21:10", name: "Berlin-Spandau", platform: "Eq. 5" },
  { time: "21:22", name: "Berlin-Spandau", platform: "Eq. 5" },
  { time: "21:27", name: "Berlin Central Station", platform: "Eq. 1" },
  { time: "21:31", name: "Berlin Central Station", platform: "Eq. 1" },
  { time: "21:33", name: "Berlin Südkreuz", platform: "Eq. 3" },
  { time: "22:11", name: "Berlin Südkreuz", platform: "Eq. 3" },
  { time: "22:12", name: "Lutherstadt Wittenberg Central Station", platform: "Eq. 2" },
  { time: "22:28", name: "Lutherstadt Wittenberg Central Station", platform: "Eq. 2" },
  { time: "22:29", name: "Bitterfeld", platform: "" },
];

const currentStep = ref(4); // Initial step index

const visibleStations = computed(() => {
  const start = Math.max(0, currentStep.value - 2);
  const end = Math.min(stations.length, currentStep.value + 3);
  return stations.slice(start, end);
});

const isActiveStep = (station: Station) => {
  return station.name === visibleStations.value[currentStep.value]?.name;
};
</script>

<style scoped>
.current-station {
  background-color: #f5f5f5;
}
</style>
