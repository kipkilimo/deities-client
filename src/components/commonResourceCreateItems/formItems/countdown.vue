<template>
  <div>
    <p v-if="timeLeft">
      {{ timeLeft.days }} Days {{ timeLeft.hours }} Hours {{ timeLeft.minutes }} Minutes {{ timeLeft.seconds }} Seconds
    </p>
    <p v-else>Time is up!</p>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { DateTime } from 'luxon';

export default {
  props: {
    targetDate: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const timeLeft = ref(null);

const calculateTimeLeft = () => {
  console.log("Target Date String:", props.targetDate); // Debug log
  if (!props.targetDate || typeof props.targetDate !== 'string') {
    console.error("Invalid targetDate prop:", props.targetDate);
    timeLeft.value = false;
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const now = DateTime.local(); // Get current local time
  const target = DateTime.fromFormat(
    props.targetDate,
    "cccc, LLLL d, yyyy 'at' h:mm a ZZZZ", // Updated format string
    { setZone: true }
  );

  // Check if target is valid
  if (!target.isValid) {
    console.error("Invalid target date format:", props.targetDate);
    timeLeft.value = false;
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const difference = target - now; // Calculate the difference in milliseconds
  if (difference <= 0) {
    timeLeft.value = false; // Set to false if target date has passed
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};


    const updateCountdown = () => {
      timeLeft.value = calculateTimeLeft();
    };

    let intervalId;

    onMounted(() => {
      updateCountdown(); // Initial call
      intervalId = setInterval(updateCountdown, 1000); // Update every second
    });

    onBeforeUnmount(() => {
      clearInterval(intervalId); // Clear the interval when component is unmounted
    });

    return {
      timeLeft,
    };
  },
};
</script>
