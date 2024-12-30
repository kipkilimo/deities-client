<template>
    <v-app>
        <RouterView />
        <!-- Footer -->
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
