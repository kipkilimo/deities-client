<script setup lang="ts">
defineProps({
    width: {
        type: Number,
        default: 500,
    },
    height: {
        type: Number,
        default: 400,
    },
})
</script>

<template>
    <div class="">
        <div :width="width" :height="height" viewBox="0 0 432 384" fill="none" class="rotate">
            <div>
                <v-img src="https://a2z-v0.s3.eu-central-1.amazonaws.com/NEMBio+Logo+wide.png" />
            </div>
        </div>
    </div>
</template>
