import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useGameStore = defineStore('game', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  // persist state in localStorage
  const store = useLocalStorage(
    'my-storage',
    {
      name: 'Apple',
      color: 'red',
    },
  );

  return { count, name, doubleCount, increment, store }
})
