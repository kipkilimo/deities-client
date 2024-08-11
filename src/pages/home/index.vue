<template>
  <v-container fluid fill-height class="main-content">
    <!-- Hero Section -->
    <v-row class="hero-section align-center" justify="center">
      <v-col class="text-center" cols="12">
        <v-img
          src="https://epidemiologist.io/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fc3zbgow3%2Fproduction%2Ff849d9459d9b1f2770d4642f3969913488f8baba-1792x1024.webp%3Fw%3D1792%26q%3D100%26auto%3Dformat&w=3840&q=100"
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
                    fontSize: '3.6rem', // Increase font size
                    lineHeight: '1.2', // Adjust line height for better readability
                    marginBottom: '20px', // Additional spacing
                  }"
                  class="headline mb-4"
                >
                  Advancing Research through collaboration
                </h1>

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
                    :style="{ backgroundColor: buttonBgColor, width: '21rem' }"
                    size="x-large"
                    class="mr-xl"
                    @click="scrollToCallToAction"
                  >
                    <v-icon>mdi-login</v-icon>
                    Continue to Platform
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
        <v-card class="pa-5">
          <v-card-title>
            <h2 class="title">Join the NEMBi Student Research Network</h2>
          </v-card-title>
          <v-card-subtitle class="subheading"
            >Be a part of NEMBi Journal Club and Schorlaly
            activities.</v-card-subtitle
          >
        </v-card>
      </v-col>
    </v-row>

    <!-- Cards Section -->
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
          <v-card-actions>
            <v-btn color="primary">Learn More</v-btn>
          </v-card-actions>
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
          <v-card-actions>
            <v-btn color="primary">Learn More</v-btn>
          </v-card-actions>
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
            will be collecting data.
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary">Explore Resources</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Footer -->
    <v-footer class="footer">
      <v-row class="text-center">
        <v-col cols="12">
          <p>
            &copy; {{ currentYear }} Nairobi Epidemiology and Biostatistical
            Methods Colloquium, NEMBi. All rights reserved.
          </p>
          <br />
          <v-divider />
          <v-btn class="mt-2" varianr="outlined" @click="scrollToTop"
            ><v-icon>mdi-arrow-up</v-icon>Back to Top</v-btn
          >
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const buttonBgColor = "#fcfcfc"; // Replace with your desired color code
const currentYear = ref(new Date().getFullYear());
import { useRouter } from "vue-router";
const router = useRouter();
const scrollToCallToAction = () => {
  const session = localStorage.getItem("sessionId");
  if (session) {
    router.push("/dashboard/overview");
  } else {
    router.push("/auth/login");
  }
};
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
