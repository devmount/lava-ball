import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import map from '@/map';

export const useGameStore = defineStore('game', () => {
  // persist game state in localStorage
  const core = useLocalStorage(
    'lavaball/core',
    {
      level: 1,
      unlocked: 1,
      init: true,
      started: false,
      finished: false,
      score: 0,
    },
  );

  // persist main character state in localStorage
  const char = useLocalStorage(
    'lavaball/char',
    {
      color: 1,
    },
  );

  // true if last level is reached
  const isLastLevel = computed(() => core.value.level == Object.keys(map).length);

  return { core, char, isLastLevel }
})
