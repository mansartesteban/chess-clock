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
    displayMs: {
      type: Boolean,
      default: false,
    },
  });

  const formatTime = (time) => {
    console.log("time", time);
    let ret = [
      time.hours.toString().padStart(2, "0"),
      "h ",
      time.minutes.toString().padStart(2, "0"),
      "m ",
      time.seconds.toString().padStart(2, "0"),
    ];
    if (props.displayMs) {
      ret.push(".", time.milliseconds.toString().substring(0, 1));
    }
    ret.push("s");
    return ret.join("");
  };
</script>
