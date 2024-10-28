<template>
  <v-row>
    <v-col cols="12" md="4">
      <div><router-view /></div>

      <h3 color="#777777" class="ml-2 mt-2 mb-2 text-left">
        {{ titlize(currentPartner.partnerType) }} Partner
      </h3>

      <v-divider class="mt-1" />
      <div class="ma-4 d-flex justify-center">
        <v-img
          class="bg-white"
          :src="currentPartner.logo"
          max-width="85%"
          contain
          max-height="27.5vh"
          cover
        ></v-img>
      </div>

      <p class="text-center">
        <i> {{ currentPartner.fullname }}</i>
      </p>
    </v-col>

    <v-col cols="12" md="8">
      <v-img
        class="ma-sm"
        :src="currentEvent.posterUrl"
        width="100%"
        max-height="95vh"
      />
      <v-card-subtitle class="text-center mt-2">
        <i>An example event by {{ currentEvent.organizerName }}</i>
      </v-card-subtitle>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import partners from "@/data/partnersSponsors";

const currentEvents = [
  {
    posterUrl:
      "https://cdn-az.allevents.in/events5/banners/2e587573ad3830fda503d5e7cd8816e9f74bb07689d23cba6c48dce1252a2a49-rimg-w1200-h600-dc6bc8cd-gmir.jpg",
    organizerName: "AllEvents",
  },
  {
    posterUrl:
      "https://media.licdn.com/dms/image/v2/D4E10AQEiLte9W_5fGw/image-shrink_1280/image-shrink_1280/0/1728407714063?e=1730217600&v=beta&t=l6Yj3CfhkDprh8dIs_8YavMecdf2qthbgepYane6t3k",
    organizerName: "Fierce Biotech",
  },
  {
    posterUrl:
      "https://medall-prod-assets.s3.eu-west-2.amazonaws.com/uploads/organisation_event/image/ae8d528e-a71a-4ada-8908-fb6e912b5572/932ff6e046.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATF6O5WPBDCOEPEFD%2F20241022%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241022T151903Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=009947183d6da8787a4170fc0fccaae07257c82714c8f51c0b1658d42735ac27",
    organizerName: "Global Surgery",
  },
  {
    posterUrl:
      "https://scontent.fnuu2-1.fna.fbcdn.net/v/t39.30808-6/398193494_1044255920330534_6286505808141889138_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGO9_9-fFV0AAQbNwcB-I12wHvDC0tYejPAe8MLS1h6MxyCRtnSdfpZ_yEuVJioFCGGyeZqd1ustnood5O-wmeP&_nc_ohc=B3vljSVP-ncQ7kNvgG8eJla&_nc_zt=23&_nc_ht=scontent.fnuu2-1.fna&_nc_gid=A8E7gDkv9oQIXKzxHsD8ZT3&oh=00_AYB6RKAka8kumBVQi8pLFB7eeZsYReryEZR5l6JB8T-92g&oe=671D9D01",
    organizerName: "Global Health Equity",
  },
  {
    posterUrl:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F872281769%2F2089964232253%2F1%2Foriginal.20241011-112435?h=740&w=1200&auto=format%2Ccompress&q=75&sharp=10&s=dba2946d954064ef4cf8e868cc9aebab",
    organizerName: "British Association of Black Surgeons",
  },
];

// Initialize currentIndex and currentEventIndex to a random value
const currentEventIndex = ref(Math.floor(Math.random() * currentEvents.length));
const currentIndex = ref(Math.floor(Math.random() * partners.length));

// Set the current partner and event based on the random index
const currentPartner = ref(partners[currentIndex.value]);
const currentEvent = ref(currentEvents[currentEventIndex.value]);

function changePartner() {
  let newIndex = currentIndex.value;
  while (newIndex === currentIndex.value) {
    newIndex = Math.floor(Math.random() * partners.length);
  }
  currentIndex.value = newIndex;
  currentPartner.value = partners[newIndex];
}

function changeEvent() {
  let newIndex = currentEventIndex.value;
  while (newIndex === currentEventIndex.value) {
    newIndex = Math.floor(Math.random() * currentEvents.length);
  }
  currentEvent.value = currentEvents[newIndex];
  currentEventIndex.value = newIndex;
}

function titlize(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

onMounted(() => {
  const intervalId = setInterval(() => {
    changePartner();
  }, 5000);

  const intervalId2 = setInterval(() => {
    changeEvent();
  }, 36150);

  onBeforeUnmount(() => {
    clearInterval(intervalId);
    clearInterval(intervalId2);
  });
});
</script>

<style scoped>
/* Additional mobile-specific styles can go here */
</style>
