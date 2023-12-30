import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useGameStore = defineStore('game', () => {
  // const isLastLevel = computed(() => game.level == Object.keys(map).length);
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

  return { core, char }
})
