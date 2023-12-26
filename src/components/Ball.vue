<template>
  <div ref="el" class="absolute size-16 transition-all z-20">
    <div
      class="
        absolute top-10 left-1/2 -translate-x-1/2 translate-y-1/4 size-10 rounded-full
        bg-gradient-to-br animate-idle transition-all duration-300
      "
      :class="{
        'from-rose-500 to-rose-700': color === 1,
        'from-green-500 to-green-700': color === 2,
        'from-violet-500 to-violet-700': color === 3,
        'top-5 animate-none shadow !size-0 opacity-0': exit,
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps(['color', 'exit']);

const el = ref(null);
defineExpose({ el });
</script>
