<template>
  <div class="w-screen h-screen flex flex-col">
    <TimerDisplay
      v-if="timers[0]"
      :timer="timers[0]"
      :displayMs="timers[0].timeRemaining.total < 50000"
      class="rotate-180"
      :class="{ 'bg-green-800 text-white': activePlayer === 0 }"
      @click="changePlayer(0)"
    ></TimerDisplay>
    <div class="flex p-8 bg-gray-800 justify-center items-center gap-4">
      <button
        class="cursor-pointer"
        @click="pauseTimer"
      >
        <PlayIcon
          v-if="isPaused"
          class="h-10 w-10 text-white"
        />
        <PauseIcon
          v-else
          class="h-10 w-10 text-white"
        />
      </button>
      <Select
        v-model="selectedTiming"
        :options="timings"
        label=""
      ></Select>
    </div>
    <TimerDisplay
      v-if="timers[1]"
      :timer="timers[1]"
      :displayMs="timers[1].timeRemaining.total < 50000"
      :class="{ 'bg-green-800 text-white': activePlayer === 1 }"
      @click="changePlayer(1)"
    ></TimerDisplay>
  </div>
</template>

<script setup>
  import { PlayIcon, PauseIcon } from "@heroicons/vue/24/solid";
  import { watch } from "vue";

  const isPaused = ref(true);

  class Timer {
    duration = 0;

    constructor(
      durationMinutes,
      updateUnit = "second",
      onUpdate = () => {},
      onComplete = () => {}
    ) {
      this.duration = durationMinutes * 60 * 1000; // en millisecondes
      this.updateUnit = updateUnit;
      this.onUpdate = onUpdate;
      this.onComplete = onComplete;

      this._elapsed = 0;
      this._startTime = null;
      this._timer = null;
      this._isRunning = false;

      this.getRemainingTime();
    }

    _getUpdateInterval() {
      switch (this.updateUnit) {
        case "hour":
          return 3600000;
        case "minute":
          return 60000;
        case "second":
          return 1000;
        case "millisecond":
          return 100;
        default:
          throw new Error("Unité inconnue : " + this.updateUnit);
      }
    }

    getRemainingTime() {
      const remaining = Math.max(this.duration - this._elapsed, 0);
      this.timeRemaining = this._formatTime(remaining);
      return remaining;
    }
    _tick() {
      const now = performance.now();
      const delta = now - this._startTime;
      this._elapsed += delta;
      this._startTime = now;

      const remaining = this.getRemainingTime();
      this.onUpdate(this._formatTime(remaining));

      if (remaining <= 0) {
        this._isRunning = false;
        this.onComplete();
      } else {
        this._timer = setTimeout(() => this._tick(), this._getUpdateInterval());
      }
    }

    start() {
      if (this._isRunning) return;
      this._isRunning = true;
      this._startTime = performance.now();
      this._tick();
    }

    pause() {
      if (!this._isRunning) return;
      clearTimeout(this._timer);
      const now = performance.now();
      this._elapsed += now - this._startTime;
      this._isRunning = false;
    }

    resume() {
      if (this._isRunning) return;
      if (this._elapsed >= this.duration) return; // déjà terminé
      this._isRunning = true;
      this._startTime = performance.now();
      this._tick();
    }

    reset() {
      clearTimeout(this._timer);
      this._elapsed = 0;
      this._isRunning = false;
    }

    _formatTime(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const milliseconds = ms % 1000;
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      return {
        hours,
        minutes,
        seconds,
        milliseconds: Math.floor(milliseconds),
        total: ms,
      };
    }

    isRunning() {
      return this._isRunning;
    }
  }

  const timings = [
    { label: "1 minutes", value: 1, additionalTime: 0 },
    { label: "1 minutes + 1s", value: 1, additionalTime: 1 },
    { label: "1 minutes + 2s", value: 1, additionalTime: 2 },
    { label: "2 minutes", value: 2, additionalTime: 0 },
    { label: "2 minutes + 1s", value: 2, additionalTime: 1 },
    { label: "2 minutes + 2s", value: 2, additionalTime: 2 },
    { label: "3 minutes", value: 3, additionalTime: 0 },
    { label: "3 minutes + 1s", value: 3, additionalTime: 1 },
    { label: "3 minutes + 2s", value: 3, additionalTime: 2 },
    { label: "5 minutes", value: 5, additionalTime: 0 },
    { label: "5 minutes + 5s", value: 5, additionalTime: 5 },
    { label: "10 minutes", value: 10, additionalTime: 0 },
    { label: "15 minutes", value: 15, additionalTime: 0 },
    { label: "15 minutes + 10s", value: 15, additionalTime: 10 },
    { label: "20 minutes", value: 20, additionalTime: 0 },
    { label: "30 minutes", value: 30, additionalTime: 0 },
    { label: "60 minutes", value: 60, additionalTime: 0 },
  ];
  const selectedTiming = ref(null);
  const started = ref(false);

  watch(selectedTiming, (v) => {
    timers.value.forEach((timer) => {
      timer.duration = v * 60 * 1000;
      timer.getRemainingTime();
    });
  });

  let activePlayer = ref(-1);
  let timers = ref([
    new Timer(30, "millisecond"),
    new Timer(30, "millisecond"),
  ]);

  const pauseTimer = () => {
    timers.value.forEach((timer) => timer.pause());
    isPaused.value = !isPaused.value;
    if (!isPaused.value) {
      timers.value[activePlayer.value].start();
    }
  };

  const changePlayer = (i) => {
    if (activePlayer.value === -1) {
      activePlayer.value = (i + 1) % 2;
    } else {
      if (activePlayer.value === i) {
        if (started.value) {
          timers.value[i].duration += 2000;
          timers.value[i].getRemainingTime();
        }
        activePlayer.value = (activePlayer.value + 1) % 2;
      }
    }

    isPaused.value = false;

    timers.value[i].pause();
    timers.value[activePlayer.value].start();

    started.value = true;
  };
</script>
