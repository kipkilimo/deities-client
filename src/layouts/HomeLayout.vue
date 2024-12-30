<template>
    <v-app>
        <RouterView />
        <!-- Footer -->
        <v-footer class="footer">
            <v-row class="text-center">
                <v-col cols="12">
                    <v-card-actions>
                        <v-spacer />
                        <v-btn @click="scrollToTop">
                            <v-icon>mdi-arrow-up</v-icon> Back to Top
                        </v-btn>
                        <v-btn @click="scrollToCallToAction" color="#c2529d">
                            <v-icon>mdi-cloud-lock-outline</v-icon> CloudClinic HMS Access
                        </v-btn>
                        <v-spacer />
                    </v-card-actions>
                    <p> Burumba Estate, Busia,KE. 📞+254713412265 💬 0700378241 📧 amanecottagehospital@gmail.com

                    </p>
                    <v-img @click="navigateToDonate" height="6rem" style="cursor:pointer;"
                        src="https://a2z-v0.s3.eu-central-1.amazonaws.com/Screenshot_from_2024-12-05_21-46-15-removebg-preview.png"></v-img>
                </v-col>
            </v-row>
        </v-footer>


        <div class="text-caption" style="text-align: center">
            &copy; {{ currentYear }} Amane Cottage Hospital. All rights reserved.
        </div>
    </v-app>
</template>
<script setup lang="js">

import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
function navigateToDonate() {
    router.push("/donate");
}

const currentYear = ref(new Date().getFullYear());

const scrollToCallToAction = () => {
    // @ts-ignore
    window.location = "/auth/login";
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
</script>
<style scoped></style>
