<template>
  <v-container fluid fill-height class="main-content">
    <v-row class="hero-section align-center" justify="center">
      <v-col class="text-center" cols="12">
        <v-img
          src="https://scitechdaily.com/images/DNA-Technology-Concept.gif"
          class="hero-image"
          cover
          :aspect-ratio="1"
        >
          <v-container class="hero-content">
            <v-row>
              <v-col cols="12">
                <h1 class="headline mb-4 title-text">
                  NEMB<span class="io-text"><i>io</i></span>
                </h1>
                <h2 class="headline mb-4 subtitle-text">
                  Advancing Life Sciences Research through Collaboration
                </h2>

                <v-row class="text-center">
                  <v-col cols="12">
                    <v-spacer />
                    <v-spacer />
                    <v-btn
                      class="cta-button"
                      size="x-large"
                      @click="scrollToCallToAction"
                    >
                      <v-icon>mdi-login</v-icon>
                      Continue to the Application
                    </v-btn>
                    <v-spacer />
                    <v-spacer />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </v-col>
    </v-row>

    <v-row ref="callToAction" class="call-to-action">
      <v-col cols="12" md="12" class="text-center">
        <v-card max-height="28rem">
          <v-row>
            <v-col cols="12" md="4">
              <v-img
                src="https://img.freepik.com/premium-vector/green-medical-seamless-pattern_74102-633.jpg"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-card-title>
                <h1 class="title">
                  About NEMB<span class="io-text"><i>io</i></span>
                </h1>
              </v-card-title>
              <v-card-subtitle class="subheading">
                Epidemiology | Biostatistics | Research Methods | Seminar Series
                | Colloquia and Talks | Test Yourself | Fun Activities
              </v-card-subtitle>

              <p class="pa-2">
                Welcome to the Nairobi Epidemiology and Biostatistical Methods
                Colloquium, NEMBio, a Life Sciences focused a web application
                hub for learning Epidemiology , Biostatistics and Research
                Methods . It is a dynamic web environment dedicated to
                empowering higher level of learning students and members of the
                faculty in the fields of health and life sciences research. Our
                objective is to foster a fun , interactive and collaborative
                environment where life sciences researchers can find
                help,discuss scientific papers and exchange ideas as well best
                practices, and in the process advance groundbreaking research
                together.
                <br />
                <br />
                The NEMBio web app has been developed to serve medical and life
                sciences students,researchers and professionals who wish to
                learn more about biostatistics,epidemiology and research
                methods. The site contains carefully selected and reviewed
                training materials especially suited for a non-statistician
                audience. This site is being developed in close collaboration
                with members of the Biostatistics, Epidemiology and Research
                Methods faculty of the University of Nairobi, School of Public
                and Global Health.
                <br />
                <br />
                Become part of NEMBio's vibrant community and engage in
                collaborative research that explores the complex interplay
                between disease patterns, exposures, and health outcomes.
                Develop advanced biostatistical techniques and benefit from our
                comprehensive cloud based utilities, designed to support your
                academic and professional growth. Join us and be at the
                forefront of the next generation of health sciences scholaly
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- Cards Section -->
    <v-card
      class="mx-auto d-flex flex-column align-center justify-center"
      prepend-icon="mdi-bookmark-box-multiple-outline"
      color="transparent"
      subtitle="Discover our curated resources for Life Sciences research"
      flat
      width="100%"
    >
      <template v-slot:title>
        <span class="font-weight-black text-center"
          >NEMBio Features and Solutions</span
        >
      </template>
      <div class="text-overline mb-1 d-flex flex-wrap">
        <div
          v-for="(feature, index) in researchCards"
          :key="index"
          class="mr-2"
        >
          <v-chip rounded="xl" variant="text"
            >{{ index + 1 }}. {{ feature.title }}</v-chip
          >
        </div>
      </div>
    </v-card>

    <v-divider />
    <v-row class="py-5" justify="center">
      <v-col
        v-for="(card, index) in researchCards"
        :key="index"
        cols="12"
        md="4"
        sm="12"
      >
        <v-card class="research-card">
          <v-img
            :src="card.image"
            height="200px"
            class="card-image"
            cover
            :aspect-ratio="1"
          />
          <v-card-title>{{ card.title }}</v-card-title>
          <v-card-subtitle>{{ card.subtitle }}</v-card-subtitle>
          <v-card-text>{{ card.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card
      class="mx-auto d-flex flex-column align-center justify-center"
      prepend-icon="mdi-rocket-launch"
      color="transparent"
      subtitle="Join our mission to empower Life Sciences scholars"
      flat
      width="100%"
    >
      <template v-slot:title>
        <span class="font-weight-black text-center">Our partners</span>
      </template>
      <div class="ticker-content">
        <div class="chip-row">
          <v-chip
            v-for="(partner, index) in partners"
            :key="index"
            rounded="xl"
            variant="text"
            class="text-overline"
          >
            {{ partner.fullname }} |
          </v-chip>
          <div class="delay-element"></div>
        </div>
      </div>
    </v-card>

    <v-divider />

    <v-divider />

    <v-container>
      <v-carousel height="400" cycle :show-arrows="false" hide-delimiters>
        <v-carousel-item v-for="(partner, index) in partners" :key="index">
          <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2 d-flex flex-column align-center">
              <img
                :src="partner.logo"
                :alt="partner.fullname"
                class="partner-logo"
              />
              <v-card-subtitle class="text-center">{{
                partner.fullname
              }}</v-card-subtitle>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-container>

    <v-footer class="footer">
      <v-row class="text-center">
        <v-col cols="12">
          <p>
            &copy; {{ currentYear }} Nairobi Epidemiology and Biostatistical
            Methods Colloquium, NEMBio. All rights reserved.
          </p>
          <br />
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn class="mt-2" variant="outlined" @click="scrollToTop">
              <v-icon>mdi-arrow-up</v-icon> Back to Top
            </v-btn>
            <v-btn
              class="mt-2 mr-8 cta-button"
              variant="outlined"
              @click="scrollToCallToAction"
            >
              <v-icon>mdi-login</v-icon> Continue to the Application
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-col>
      </v-row>
    </v-footer>

    <div class="text-caption" style="text-align: center">
      Concept, design & crafting with ♡ by
      <a href="https://vuetifyjs.com/" target="_blank" rel="noopener noreferrer"
        >NVSMS</a
      >
      Creations.
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import partners from "../../data/partnersSponsors";
import { researchCards } from "@/data/researchCards";

const buttonBgColor = "#fcfcfc";
const currentYear = ref(new Date().getFullYear());
const router = useRouter();

const scrollToCallToAction = () => {
  const session = localStorage.getItem("sessionId");
  if (session) {
    router.push("/dashboard/overview");
  } else {
    router.push("/auth/login");
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
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
  color: #ffffff;
  text-shadow: 16px 16px 18px rgba(14, 35, 79, 0.9);
  font-weight: bold;
  font-size: clamp(3rem, 8vw, 8.1rem);
  line-height: 1.2;
  margin-bottom: 20px;
}
.subtitle-text {
  color: #ffffff;
  text-shadow: 16px 16px 18px rgba(14, 35, 79, 0.9);
  font-weight: bold;
  font-size: clamp(1.5rem, 4vw, 3.6rem);
  line-height: 1.2;
  margin-bottom: 20px;
}
.call-to-action {
  background-color: #f0f0f0;
  padding: 50px 0;
}
.research-card {
  margin: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.card-image {
  object-fit: cover;
}
.footer {
  background-color: #f0f0f0;
  padding: 20px 0;
}
.button-container {
  justify-content: center;
}
.cta-button {
  background-color: #fcfcfc;
  width: clamp(15rem, 30vw, 24rem);
}
</style>
<style scoped>
.io-text {
  font-family: "Monaco", "Courier New", Courier, monospace;
}
.ticker-content {
  overflow: hidden;
  white-space: nowrap;
}

.chip-row {
  display: inline-block;
  animation: scroll 30s linear infinite;
}

.v-chip {
  display: inline-block;
  margin-right: 1rem;
}

/* Continuous scrolling effect */
@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

</style>
