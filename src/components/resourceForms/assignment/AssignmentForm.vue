<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="eventData.event_title"
        label="Event Title"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="eventData.event_start_date"
            label="Start Date"
            type="date"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="eventData.event_end_date"
            label="End Date"
            type="date"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="eventData.event_start_time"
            label="Start Time"
            type="time"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="eventData.event_end_time"
            label="End Time"
            type="time"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="eventData.event_online_platform"
        label="Online Platform"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-text-field
        v-model="eventData.event_online_link"
        label="Online Link"
        :rules="[rules.required, rules.url]"
        required
      ></v-text-field>

      <v-text-field
        v-model="eventData.event_activity_schedule_url"
        label="Activity Schedule URL"
        :rules="[rules.required, rules.url]"
        required
      ></v-text-field>

      <v-text-field
        v-model="eventData.event_cover_image_url"
        label="Cover Image URL"
        :rules="[rules.required, rules.url]"
        required
      ></v-text-field>

      <v-text-field
        v-model="eventData.event_venue"
        label="Venue"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-select
        v-model="eventData.event_mode"
        :items="['Online', 'In-Person', 'Hybrid']"
        label="Event Mode"
        :rules="[rules.required]"
        required
      ></v-select>

      <v-btn :disabled="!valid" color="primary" @click="submit"> Submit </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useResourceStore } from "../../../stores/patients"; //
const resourceStore = useResourceStore();

const valid = ref(false);
const form = ref(null);

const eventData = ref({
  event_title: "",
  event_start_time: "",
  event_end_time: "",
  event_start_date: "",
  event_end_date: "",
  event_online_platform: "",
  event_online_link: "",
  event_activity_schedule_url: "",
  event_cover_image_url: "",
  event_venue: "",
  event_mode: "",
});

const rules = {
  required: (value) => !!value || "Required.",
  url: (value) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return (!!value && pattern.test(value)) || "Invalid URL.";
  },
};

const submit = () => {
  if (form.value.validate()) {
    resourceStore.submitEvent(eventData.value); // Pass eventData to the store's submitEvent method
  }
};
</script>
