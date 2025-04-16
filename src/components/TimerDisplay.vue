<template>
  <div
    class="flex-1 flex items-center justify-center text-4xl font-semibold cursor-pointer"
  >
    {{ formatTime(timer.timeRemaining) }}
  </div>
</template>

<script setup>
  const props = defineProps({
    timer: {
      type: Object,
      required: true,
    },
  });

  const formatTime = (time) => {
    console.log("time", time);
    return [
      time.hours.toString().padStart(2, "0"),
      "h ",
      time.minutes.toString().padStart(2, "0"),
      "m ",
      time.seconds.toString().padStart(2, "0"),
      "s",
    ].join("");
  };
</script>
