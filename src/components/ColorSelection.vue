<template>
  <div class="flex flex-col gap-8">
    <div class="text-stone-600 text-4xl font-bungee">{{ t('chooseColor') }}</div>
    <div class="flex justify-start items-center gap-4">
      <div
        class="
          cursor-pointer transition-all size-10 border-4 outline outline-8 outline-transparent
          border-rose-700 bg-rose-500 hover:outline-stone-800
        "
        :class="{ '!outline-stone-700': game.char.color === 1 }"
        @click="game.char.color = 1"
      ></div>
      <div
        class="
          cursor-pointer transition-all size-10 border-4 outline outline-8 outline-transparent
          border-green-700 bg-green-500 hover:outline-stone-800
        "
        :class="{ '!outline-stone-700': game.char.color === 2 }"
        @click="game.char.color = 2"
      ></div>
      <div
        class="
          cursor-pointer transition-all size-10 border-4 outline outline-8 outline-transparent
          border-violet-700 bg-violet-500 hover:outline-stone-800
        "
        :class="{ '!outline-stone-700': game.char.color === 3 }"
        @click="game.char.color = 3"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useGameStore } from '@/stores/game-store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const game = useGameStore();
</script>
