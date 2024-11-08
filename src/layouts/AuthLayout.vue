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
          max-height="27.5vh"
          contain
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
      "https://researchweek.uonbi.ac.ke/wp-content/uploads/2024/04/RW-Website-Banner-2-3-1024x272.png",
    organizerName: "University of Nairobi",
  },
  {
    posterUrl:
      "https://pbs.twimg.com/media/GIY2xwCW4AAvJjO?format=jpg&name=4096x4096",
    organizerName: "KNH Research",
  },
  {
    posterUrl:
      "https://scontent.fnuu2-1.fna.fbcdn.net/v/t1.6435-9/67443204_2874234642650088_6613907305471672320_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGC8vDQ_TzPjNmjaMgwKM8qVx9PoaSfa9FXH0-hpJ9r0VPFXJOaPilqz7bmjGACnXKOo3Rllen5iiVz_-rfprgV&_nc_ohc=XYmvs-Z0b5wQ7kNvgFl8_yf&_nc_zt=23&_nc_ht=scontent.fnuu2-1.fna&_nc_gid=AixG3K9gus7f6AwvE0blBvI&oh=00_AYClojqI0gJ93DdoZZG7aroB3ybZCXp0FLngrZJyRh2tIA&oe=6754896F",
    organizerName: "KNH Research",
  },
  {
    posterUrl:
      "https://scontent.fnuu2-1.fna.fbcdn.net/v/t39.30808-6/465271248_1110773457717833_815875845610763619_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHfKwP5tf3Q-qYJK0g8osWHbhAhlBuszQxuECGUG6zNDGM0Fey3wLBCNU7joe1cH_6kQQ7yT6NyJTr1vJqHy_4q&_nc_ohc=N1_scrZZEtAQ7kNvgFWmIOI&_nc_zt=23&_nc_ht=scontent.fnuu2-1.fna&_nc_gid=A8tZNGrOnZNGFg9QLvgyBCn&oh=00_AYBc_s-y2NpZN3U8sFJH3nZmw5XbW0doRABk0JZ1-CesGA&oe=67330139",
    organizerName: "KESHO",
  },
  {
    posterUrl:
      "https://scontent.fnuu2-1.fna.fbcdn.net/v/t39.30808-6/319844893_1246171142607256_5388616207296651138_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFyY8iLdHcXKArQ56qtOHYqOp2YOQ7D0fw6nZg5DsPR_ARUP-3Z7VQ7iFmUidsN2Oc2wgeIU9M0ii6yxlbbCOV5&_nc_ohc=fPYALr4Tx5kQ7kNvgGjKm6Z&_nc_zt=23&_nc_ht=scontent.fnuu2-1.fna&_nc_gid=AweUO8H8V444Ev5ljvQNjO5&oh=00_AYBS-Cy6y0lpnoKGLRI9MAL32kNcltEnd7H1NTz5MUBT-A&oe=67332247",
    organizerName: "PSK",
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
