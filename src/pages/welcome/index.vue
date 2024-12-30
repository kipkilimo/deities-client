<template>
  <v-container fluid fill-height class="main-content">
    <!-- Hero Section -->
    <v-row class="hero-section align-center" justify="center">
      <v-col cols="12" class="text-center">
        <v-img
          src="https://cdn.dribbble.com/users/1129235/screenshots/10762000/media/ace6e95b814e602a1b5a0527a54af10f.gif"
          class="hero-image" cover :aspect-ratio="1">
          <v-container class="hero-content">
            <h1 style="color:#1fcaff;" class="headline title-text">
              Amane<span class="io-text"><i>Hospital</i></span>
            </h1>
            <h2 style="color:#63bb45;" class="headline subtitle-text">
              Accessible Care, Healthier Communities
            </h2>
            <v-img @click="navigateToDonate" height="6rem" style="cursor:pointer;"
              src="https://a2z-v0.s3.eu-central-1.amazonaws.com/Screenshot_from_2024-12-05_21-46-15-removebg-preview.png"></v-img>
            <!-- <v-btn class="cta-button" color="#c2529d" size="x-large" @click="scrollToCallToAction">
              <v-icon>mdi-cloud-lock-outline</v-icon>
              CloudClinic HMS Access
            </v-btn> -->
          </v-container>
        </v-img>
      </v-col>
    </v-row>

    <!-- About Section -->
    <v-row ref="callToAction" class="call-to-action">
      <v-col cols="12">
        <v-card max-height="28rem">
          <v-row>
            <v-col cols="12" md="4">
              <v-img src="https://www.health.gov.lk/wp-content/uploads/2022/11/hospital.png" />
            </v-col>
            <v-col cols="12" md="8">
              <v-card-title class="text-center">
                About Amane<span class="io-text"><i>Hospital</i></span>
              </v-card-title>
              <v-card-subtitle class="text-center">
                Outpatient Care | Inpatient Services | Mother & Baby | Surgical Services
              </v-card-subtitle>
              <div class="section">
                <p>
                  Amane Hospital is a state-of-the-art healthcare facility nestled in the heart of Burumba Estate,
                  Busia. Our mission is to deliver accessible, high-quality healthcare that empowers individuals to lead
                  healthier, more fulfilling lives. From preventive screenings to specialized care, Amane Hospital is
                  equipped with modern medical technology and staffed by a team of highly skilled doctors, nurses, and
                  healthcare professionals committed to excellence in patient care.
                </p>
                <br />
                <p>
                  In the area of primary care, our dedicated team offers personalized services that prioritize patient
                  wellness through routine check-ups, chronic disease management, and health education. Our OB/GYN
                  department provides a full spectrum of women's health services, including prenatal care,
                  family planning, and treatment for gynecological conditions, ensuring that women at every stage of
                  life receive the specialized care they deserve.
                </p>
                <br />
                <p>
                  For patients requiring surgical intervention, Amane
                  Hospital offers a range of general and specialized
                  surgical procedures performed in a safe and sterile environment. Our surgical team combines expertise
                  with compassion, ensuring that every patient feels supported throughout their journey to recovery.


                  At Amane Hospital, we believe in building lasting relationships with our patients and the community we
                  serve. Together, we strive to create a healthier, thriving Burumba Estate. Whether you need a routine
                  check-up, specialized care, or advice on maintaining a healthy lifestyle, Amane Hospital is here to
                  serve you. Welcome to your partner in health and well-being.
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Objectives Section -->
    <v-card>
      <v-row>
        <v-img
          src="https://thumbs.dreamstime.com/b/health-care-abstract-design-icon-background-eps-vector-52199756.jpg"></v-img>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="8">
          <v-list density="compact" no-action>
            <v-toolbar-title color="#3d7187" class="mb-1 font-weight-black text-left">Focus Services of the Amane
              Hospital
            </v-toolbar-title>
            <v-list-item no-action v-for="(item, i) in objectives" :key="i" :value="item" color="primary">
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>

              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>

    <!-- Research Cards Section -->
    <v-row class="py-5" justify="center">
      <v-col v-for="(card, index) in hospitalCards" :key="index" cols="12" md="4">
        <v-card class="research-card">
          <v-img :src="card.image" height="200px" cover />
          <v-card-title>{{ card.title }}</v-card-title>
          <v-card-subtitle>{{ card.subtitle }}</v-card-subtitle>
          <v-card-text>{{ card.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Partners Section -->
    <v-card class="mx-auto d-flex flex-column align-center justify-center" width="100%">
      <v-carousel height="24rem" cycle :show-arrows="false" hide-delimiters>
        <v-carousel-item v-for="(partner, index) in partners" :key="index">
          <div class="d-flex justify-center align-center">
            <img style="height:18rem;" :src="partner.logo" :alt="partner.fullname" class="partner-logo" />
          </div>
          <v-card-subtitle class="text-center mt-4">{{
            partner.fullname
          }}</v-card-subtitle>
        </v-carousel-item>
      </v-carousel>
    </v-card>


  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import partners from "../../data/partnersSponsors";
import { hospitalCards } from "@/data/researchCards";
const router = useRouter()
function navigateToDonate() {
  router.push("/donate");
}

const currentYear = ref(new Date().getFullYear());  

const objectives = [
  {
    text: "Provide compassionate primary care for individuals and families.",
    icon: "mdi-heart-outline",
  },
  {
    text: "Deliver comprehensive OB/GYN services for women's health.",
    icon: "mdi-human-female",
  },
  {
    text: "Perform safe and specialized surgical procedures.",
    icon: "mdi-bandage",
  },
  {
    text: "Offer community health screenings for early disease detection.",
    icon: "mdi-hospital-box-outline",
  },
  {
    text: "Promote wellness through preventive care and education.",
    icon: "mdi-school-outline",
  },
  {
    text: "Build lasting relationships to enhance community health.",
    icon: "mdi-account-group-outline",
  },
];


const scrollToCallToAction = () => {
  // @ts-ignore
  window.location = "/auth/login";
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
</script>

<style scoped>
.hero-section {
  background-color: #f5f5f5;
}
.hero-image {
  width: 100%;
  height: 70vh;
}
.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.title-text {
  color: #fff;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  font-size: clamp(3rem, 5vw, 6rem);
}
.subtitle-text {
  color: #fff;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
}
.call-to-action {
  background-color: #f0f0f0;
  padding: 3rem 0;
}
.research-card {
  margin: 20px;
}
.footer {
  padding: 2rem 0;
  background-color: #f5f5f5;
}
</style>
