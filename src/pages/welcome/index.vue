<template>
  <v-container fluid fill-height class="main-content">
    <!-- Hero Section -->
    <v-row class="hero-section align-center" justify="center">
      <v-col class="text-center" cols="12">
        <v-img
          src="https://scitechdaily.com/images/DNA-Technology-Concept.gif"
          style="height: 70vh"
          class="hero-image"
          cover
          :aspect-ratio="1"
        >
          <v-container class="hero-content">
            <v-row>
              <v-col cols="12">
                <h1
                  :style="{
                    color: '#ffffff', // White text for better contrast
                    textShadow: '16px 16px 18px rgba(14, 35, 79, 0.9)', // Stronger shadow for more definition
                    fontWeight: 'bold', // Make the font weight bold
                    fontSize: '8.1rem', // Increase font size
                    lineHeight: '1.2', // Adjust line height for better readability
                    marginBottom: '20px', // Additional spacing
                  }"
                  class="headline mb-4"
                >
                  NEMB<span style="font-size: 7.5rem; font-family: Monaco"
                    ><i>io</i></span
                  >
                </h1>
                <br />
                <br />
                <br />
                <h2
                  :style="{
                    color: '#ffffff', // White text for better contrast
                    textShadow: '16px 16px 18px rgba(14, 35, 79, 0.9)', // Stronger shadow for more definition
                    fontWeight: 'bold', // Make the font weight bold
                    fontSize: '3.6rem', // Increase font size
                    lineHeight: '1.2', // Adjust line height for better readability
                    marginBottom: '20px', // Additional spacing
                  }"
                  class="headline mb-4"
                >
                  Advancing Life Sciences Research through Collaboration
                </h2>

                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div class="button-container">
                  <v-btn
                    :style="{ backgroundColor: buttonBgColor, width: '24rem' }"
                    size="x-large"
                    class="mr-xl"
                    @click="scrollToCallToAction"
                  >
                    <v-icon>mdi-login</v-icon>
                    Continue to the Application
                  </v-btn>

                  <!-- <v-btn
                    :style="{ backgroundColor: buttonBgColor, width: '200px' }"
                    large
                    variant="outlined"
                    class="ml-xl"
                    @click="scrollToCallToAction2"
                  >
                    <v-icon left>mdi-account-search</v-icon>
                    Guest Explore
                  </v-btn> -->
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </v-col>
    </v-row>

    <!-- Call to Action -->
    <v-row ref="callToAction" class="call-to-action">
      <v-col cols="12" md="12" class="text-center">
        <v-card max-height="28rem">
          <v-row>
            <v-col cols="4">
              <v-img
                src="https://img.freepik.com/premium-vector/green-medical-seamless-pattern_74102-633.jpg"
              ></v-img>
            </v-col>

            <v-col cols="8">
              <v-card-title>
                <h1 class="title">
                  About NEMB<span style="font-size: 2.1rem; font-family: Monaco"
                    ><i>io</i></span
                  >
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
        <span class="font-weight-black text-center">NEMBio Features and Solutions</span>
      </template>
      <div class="text-overline mb-1 d-flex flex-wrap">
        <div
          v-for="(feature, index) in researchCards"
          :key="index"
          class="mr-2"
        >
          <v-chip rounded="xl" variant="text">{{ index+1 }}. {{ feature.title }}</v-chip>
        </div>
      </div>
    </v-card>

    <v-divider />
    <v-row class="py-5" justify="center">
      <v-col cols="12" md="4">
        <v-card class="research-card">
          <v-img
            src="https://www.ohsu.edu/sites/default/files/2019-01/clin-epiicon.jpg"
            height="200px"
            class="card-image"
            cover
            :aspect-ratio="1"
          />
          <v-card-title
            >Epidemiology: Patterns of disease and exposure</v-card-title
          >
          <v-card-subtitle
            >How often diseases occur in different groups of people and why?
          </v-card-subtitle>
          <v-card-text>
            Epidemiology is the study of the patterns, causes, and effects of
            health and disease in patient populations and the relationships
            between exposures or treatments and health outcomes.
          </v-card-text>
          <!-- <v-card-actions>
            <v-btn color="primary">Learn More</v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="research-card">
          <v-img
            src="https://sph.umich.edu/biostat/biostat-virtual-admitted-day-experience/images/rshbanner.jpg"
            height="200px"
            class="card-image"
            cover
            :aspect-ratio="1"
          />
          <v-card-title>Biostatistical Methods & Data Analysis</v-card-title>
          <v-card-subtitle
            >Explore the art and science of collecting, analyzing, and
            interpreting data.</v-card-subtitle
          >
          <v-card-text>
            Biostatistics is the application of statistical techniques to
            scientific research in health-related fields, including medicine,
            biology, and public health, and the development of new tools to
            study these areas.
          </v-card-text>
          <!-- <v-card-actions>
            <v-btn color="primary">Learn More</v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="research-card">
          <v-img
            src="https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/03/28214113/Types-of-Research-Design.jpg"
            class="card-image"
            cover
            :aspect-ratio="1"
          />
          <v-card-title>Research Methods</v-card-title>
          <v-card-subtitle
            >Expand your knowledge in research methods.</v-card-subtitle
          >
          <v-card-text>
            The best method for your project largely depends on your topic, the
            type of data you will need, and the people or items from which you
            will be collecting data, including considerations for data accuracy
            and relevance.
          </v-card-text>

          <!-- <v-card-actions>
            <v-btn color="primary">Explore Resources</v-btn>
          </v-card-actions> -->
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
      <div class="text-overline mb-1 d-flex flex-wrap">
        <div v-for="(partner, index) in partners" :key="index" class="mr-2">
          <v-chip rounded="xl" variant="text">{{
            partner.fullname
          }} | </v-chip>
        </div>
      </div>
    </v-card>

    <v-divider />

    <v-container>
      <v-carousel height="400" cycle :show-arrows="false" hide-delimiters>
        <v-carousel-item v-for="(partner, index) in partners" :key="index">
          <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2 d-flex flex-column align-center">
              <img
                :src="partner.logo"
                :alt="partner.fullname"
                style="height: 13.5rem"
              />
              <v-card-subtitle class="text-center">{{
                partner.fullname
              }}</v-card-subtitle>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-container>
    <!-- Footer -->
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
            <v-btn class="mt-2" varianr="outlined" @click="scrollToTop"
              ><v-icon>mdi-arrow-up</v-icon>Back to Top</v-btn
            >
            <v-btn
              :style="{ backgroundColor: buttonBgColor, width: '24rem' }"
              class="mt-2 mr-8"
              varianr="outlined"
              @click="scrollToCallToAction"
            >
              <v-icon>mdi-login</v-icon>
              Continue to the Application
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
const buttonBgColor = "#fcfcfc"; // Replace with your desired color code
const currentYear = ref(new Date().getFullYear());
import { useRouter } from "vue-router";
// @ts-ignore
import partners from "../../data/partnersSponsors";
import { researchCards } from "@/data/researchCards";
const router = useRouter();
const scrollToCallToAction = () => {
  const session = localStorage.getItem("sessionId");
  if (session) {
    router.push("/dashboard/overview");
  } else {
    router.push("/auth/login");
  }
};
const hoveredPartner = ref("");

const scrollToCallToAction2 = () => {
  const el = document.querySelector('v-row.ref="callToAction"');
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const signUp = () => {
  alert("Sign Up clicked!");
};
</script>

<style scoped>
.main-content {
  font-family: Roboto, sans-serif;
  color: #333;
}

.hero-section {
  position: relative;
  background-color: #f5f5f5;
}

.hero-image {
  width: 100%;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
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
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.footer {
  background-color: #f0f0f0;
  padding: 20px 0;
}
</style>

<style scoped>
.underline {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background-color: blue;
  margin-top: 5px; /* Adjust margin as needed */
}
</style>

<style scoped>
.button-container {
  justify-content: space-between;
}

.v-btn {
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.logo-strip {
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
