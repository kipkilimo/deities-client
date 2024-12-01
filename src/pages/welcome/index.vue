<template>
  <v-container fluid fill-height class="main-content">
    <!-- Hero Section -->
    <v-row class="hero-section align-center" justify="center">
      <v-col cols="12" class="text-center">
        <v-img
          src="https://scitechdaily.com/images/DNA-Technology-Concept.gif"
          class="hero-image"
          cover
          :aspect-ratio="1"
        >
          <v-container class="hero-content">
            <h1 class="headline title-text">
              NEMB<span class="io-text"><i>io</i></span>
            </h1>
            <h2 class="headline subtitle-text">
              Advancing Life Sciences Research in Africa
            </h2>
            <v-btn
              class="cta-button"
              size="x-large"
              @click="scrollToCallToAction"
            >
              <v-icon>mdi-login</v-icon>
              Continue to the Application
            </v-btn>
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
              <v-img
                src="https://img.freepik.com/premium-vector/green-medical-seamless-pattern_74102-633.jpg"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-card-title class="text-center">
                About NEMB<span class="io-text"><i>io</i></span>
              </v-card-title>
              <v-card-subtitle class="text-center">
                Epidemiology | Biostatistics | Research Methods | Seminar Series
              </v-card-subtitle>
              <p class="pa-2">
                Welcome to the Nairobi Epidemiology and Biostatistical Methods
                Colloquium, a Life Sciences focused web application hub for
                learning Epidemiology, Biostatistics, and Research Methods.
                Developed to serve students, researchers, and professionals in
                medical and life sciences research.
              </p>
              <br />
              The NEMBio web app has been developed to serve medical and life
              sciences students,researchers and professionals who wish to learn
              more about biostatistics,epidemiology and research methods. The
              site contains carefully selected and reviewed training materials
              especially suited for a non-statistician audience. This site is
              being developed in close collaboration with members of the
              Biostatistics, Epidemiology and Research Methods faculty of the
              University of Nairobi, School of Public and Global Health.
              <br />
              <br />
              <p>
                This app is particularly useful for medical researchers who have
                little training in statistics and need a refresher on essential
                statistical tools and concepts. It offers accessible
                explanations of key statistical methods without being burdened
                by unnecessary formulas, equations, symbols, or technical
                jargon. Within these pages, researchers will find
                straightforward access to fundamental tools that are commonly
                applied in medical research with graded complexity. This easy
                access allows better understanding of statistical analyses and
                fostering accurate interpretation of research results.
              </p>
              <br />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Objectives Section -->
    <v-card>
      <v-row>
        <v-img
          src="https://t3.ftcdn.net/jpg/08/15/66/88/360_F_815668853_eK0a2dGY6OEbDD5joOPUD4GuYVGGiLj1.jpg"
        ></v-img>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="8">
          <v-list density="compact" no-action>
            <v-toolbar-title
              color="#3d7187"
              class="mb-1 font-weight-black text-left"
              >Objectives of the NEMBio Platform</v-toolbar-title
            >
            <v-list-item
              no-action
              v-for="(item, i) in objectives"
              :key="i"
              :value="item"
              color="primary"
            >
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
      <v-col
        v-for="(card, index) in researchCards"
        :key="index"
        cols="12"
        md="4"
      >
        <v-card class="research-card">
          <v-img :src="card.image" height="200px" cover />
          <v-card-title>{{ card.title }}</v-card-title>
          <v-card-subtitle>{{ card.subtitle }}</v-card-subtitle>
          <v-card-text>{{ card.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Partners Section -->
    <v-card
      class="mx-auto d-flex flex-column align-center justify-center"
      width="100%"
    >
      <v-carousel height="24rem" cycle :show-arrows="false" hide-delimiters>
        <v-carousel-item v-for="(partner, index) in partners" :key="index">
          <div class="d-flex justify-center align-center">
            <img
              :src="partner.logo"
              :alt="partner.fullname"
              class="partner-logo"
            />
          </div>
          <v-card-subtitle class="text-center">{{
            partner.fullname
          }}</v-card-subtitle>
        </v-carousel-item>
      </v-carousel>
    </v-card>

    <!-- Footer -->
    <v-footer class="footer">
      <v-row class="text-center">
        <v-col cols="12">
          <v-card-actions>
            <v-spacer />
            <v-btn @click="scrollToTop">
              <v-icon>mdi-arrow-up</v-icon> Back to Top
            </v-btn>
            <v-btn @click="scrollToCallToAction">
              <v-icon>mdi-login</v-icon> Continue to the Application
            </v-btn>
            <v-spacer />
          </v-card-actions>
          <p>
            &copy; {{ currentYear }} Nairobi Epidemiology and Biostatistical
            Methods Colloquium. All rights reserved.
          </p>
        </v-col>
      </v-row>
    </v-footer>

    <div class="text-caption" style="text-align: center">
      Concept, design & crafted by NKSM Creations.
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import partners from "../../data/partnersSponsors";
import { researchCards } from "@/data/researchCards";
const objectives = [
  {
    text: "Gain an introduction to the principles of epidemiology and biostatistics.",
    icon: "mdi-book-open-page-variant",
  },
  {
    text: "Learn to design, plan, and conduct research studies effectively.",
    icon: "mdi-pencil-ruler",
  },
  {
    text: "Master basic statistical methods for analyzing research data.",
    icon: "mdi-chart-bar-stacked",
  },
  {
    text: "Understand core concepts of study design and data collection.",
    icon: "mdi-database-outline",
  },
  {
    text: "Develop skills to present findings in conferences and publications.",
    icon: "mdi-presentation-play",
  },
  {
    text: "Foster Good Epidemiological Practice (GEP) in real-world settings.",
    icon: "mdi-check-circle-outline",
  },
];

const currentYear = ref(new Date().getFullYear());
const router = useRouter();

const scrollToCallToAction = () => {
  // @ts-ignore
  window.location = "/dashboard/library";
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
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  font-size: clamp(3rem, 5vw, 6rem);
}
.subtitle-text {
  color: #fff;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
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
