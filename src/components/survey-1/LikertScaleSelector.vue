<template>
  <v-card>
    <div ref="canvasContainer" class="likert-container">
      <v-card-title>
        {{ resourceStore.surveyLikertQuestion }}
      </v-card-title>
      <div
        v-for="(option, index) in options"
        :key="index"
        class="likert-option"
        @click="selectOption(index)"
      >
        {{ option.label }}
      </div>
      <div class="pointer" ref="pointer"></div>
    </div>
    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="Submit response"
        block
        border
        icon="mdi-send-outline"
        @click="submitSelectedOption"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import * as THREE from "three";
import { useResourceStore } from "../../stores/resources"; // Replace with actual path
import { useUserStore } from "../../stores/users";

const resourceStore = useResourceStore();
const userStore = useUserStore();
const user = computed(() => userStore.user);

const options = ref(resourceStore.surveyLikertOptions);
const selectedOption = ref(0);
const canvasContainer = ref<HTMLElement | null>(null);
const pointer = ref<HTMLElement | null>(null);
const currentSelection = ref(2); // Default to 'Neutral'

const movePointer = (targetX: number) => {
  if (pointer.value) {
    pointer.value.style.transform = `translateX(${targetX}px)`;
  }
};

const selectOption = (index: number) => {
  currentSelection.value = index;
  selectedOption.value = currentSelection.value;
};
const submitSelectedOption = () => {
  const responseRaw = [
    {
      questionType: "LIKERT",
      response: selectedOption.value,
      respondent: `${userStore.user.personalInfo.username ? userStore.user.personalInfo.username : "Anonymous"}`,
    },
  ];
  const response =JSON.stringify(responseRaw)
  console.log({response})
};
onMounted(() => {
  if (!canvasContainer.value || !pointer.value) return;

  const containerWidth = canvasContainer.value.clientWidth;
  const optionWidth = containerWidth / options.value.length;

  // Position the pointer at the default selection
  const defaultX =
    optionWidth * currentSelection.value +
    optionWidth / 2 -
    pointer.value.clientWidth / 2;
  movePointer(defaultX);
});

watch(currentSelection, (newSelection) => {
  if (!canvasContainer.value || !pointer.value) return;

  const containerWidth = canvasContainer.value.clientWidth;
  const optionWidth = containerWidth / options.value.length;

  // Calculate the new position of the pointer
  const targetX =
    optionWidth * newSelection +
    optionWidth / 2 -
    pointer.value.clientWidth / 2;

  // Animate the pointer movement
  const tween = new THREE.Vector2(pointer.value.offsetLeft, 0);
  const target = new THREE.Vector2(targetX, 0);

  const animate = () => {
    if (tween.distanceTo(target) > 0.5) {
      tween.lerp(target, 0.2);
      movePointer(tween.x);
      requestAnimationFrame(animate);
    } else {
      movePointer(targetX);
    }
  };

  animate();
});
</script>

<style scoped>
.likert-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  padding: 20px;
}

.likert-option {
  flex: 1;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.pointer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  transition: transform 0.3s ease;
}
</style>
