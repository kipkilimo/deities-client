<template>
  <div>
    <v-container flex>
      <v-row>
        <v-col cols="4">
          <v-card
            flat
            full-width
            style="background-color: white"
            cols="4"
            height="64vh"
          >
            <v-img
              cover
              src="https://data.unicef.org/wp-content/uploads/2020/11/UNI232328-1-2_1.jpg"
              height="160"
            >
            </v-img>
            <v-card-title> No. 1 African Non-profit Edtech</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p>
                Enzori Learning makes learning possible for students of all
                ages, from pre-school to graduate school. We also provide other
                educational services and complementary offerings like our shopping aggregation offering.
              </p>

              <p>
                Your donation helps our patners produce quality study materials, the servers run and continue to provide high
                smooth learning experience to all students.
              </p>
              <p>Go ahead and make your donation today.</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-row justify="space-around" class="ma-5 ml-7 mb-9">
              <v-col cols="12">
                <v-avatar size="92px" class="ml-7">
                  <v-img
                    src="https://www.investinothers.org/wp-content/uploads/2022/07/iio-awards-badge.png"
                    alt="Invest"
                  ></v-img>
                </v-avatar>

                <v-avatar size="92px" class="ml-11">
                  <v-img
                    src="https://cdn-icons-png.flaticon.com/512/6582/6582036.png"
                    alt="Education"
                  ></v-img>
                </v-avatar>
                <v-avatar size="92px" class="ml-7">
                  <v-img
                    src="https://icon-library.com/images/recognition-icon/recognition-icon-11.jpg"
                    alt="Invest"
                  ></v-img>
                </v-avatar>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="8">
          <!-- Second column -->
          <v-row>
            <v-col cols="12">
              <v-card
                flat
                full-width
                style="background-color: white"
                max-height="64vh"
                rounded="lg"
              >
                <v-toolbar flat dense>
                  <v-toolbar-title>
                    <span class="text-subheading"
                      >Donate to Enzori Learning Today</span
                    >
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    color="#ee161f"
                    icon="mdi-heart"
                  ></v-btn>
                </v-toolbar>

                <!-- Add other card content here -->
                <PaymentsSection />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import PaymentsSection from "./donation-paypal-input.vue";
</script>

<style></style>