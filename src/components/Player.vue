<template>
  <div ref="player" class="absolute size-16 transition-all">
    <div
      class="
        absolute top-10 left-1/2 -translate-x-1/2 translate-y-1/4 size-10 rounded-full
        bg-gradient-to-br from-rose-500 to-rose-700
        animate-idle transition-all
      "
      :class="{ 'top-4 animate-none shadow size-0 opacity-0': exit }"
    ></div>
  </div>
</template>

<script setup>
import { defineExpose, ref } from 'vue'
defineProps(['exit']);
const player = ref(null);
defineExpose({ player });
</script>
