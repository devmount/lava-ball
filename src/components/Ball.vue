<template>
  <div ref="el" class="absolute size-16 transition-all">
    <div
      class="
        absolute top-10 left-1/2 -translate-x-1/2 translate-y-1/4 size-10 rounded-full
        bg-gradient-to-br from-rose-500 to-rose-700
        animate-idle transition-all duration-300
      "
      :class="{ 'top-5 animate-none shadow !size-0 opacity-0': exit }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps(['exit']);

const el = ref(null);
defineExpose({ el });
</script>
