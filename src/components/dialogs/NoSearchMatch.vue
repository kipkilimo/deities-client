<template>
    <v-card>

        <v-banner color="warning" icon="mdi-alert-circle-outline" lines="one">
            <template v-slot:text>
                No Matching Patient
            </template>

            <template v-slot:actions>
                <v-btn variant="outlined" @click="patientStore.noSearchMatch = false">
                    Dismiss
                </v-btn>


            </template>
        </v-banner>
    </v-card>
</template>
<script setup>
import { ref } from "vue";
import { useVisitStore } from "@/stores/visits";
import { usePatientStore } from "@/stores/patients";


const patientStore = usePatientStore()
const visitStore = useVisitStore();




</script>