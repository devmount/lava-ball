<template>
  <div
    class="z-50 block text-stone-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 p-8 opacity-0 invisible box-border transition-all !shadow-[0_0_100vw_100vw_rgba(0,0,0,.75)]"
    :class="{ '!w-3/5 !opacity-100 !visible animate-wave-once': active }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps(['active']);
</script>
