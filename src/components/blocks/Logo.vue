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
                <v-img src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Institut_Curie.jpg" />
            </div>
        </div>
    </div>
</template>
