<template>
  <div class="flex flex-col gap-8">
    <div class="text-stone-600 text-4xl font-bungee">{{ t('unlocked') }}</div>
    <div class="grid grid-cols-6 justify-center items-center gap-2">
      <div v-for="level in map" class="flex justify-center items-center">
        <div v-for="(_, x) in level.size[0]+2">
        <div
          v-for="(_, y) in level.size[1]+2"
          class="size-1"
          :class="{
            // unreachable block
            'bg-stone-950': game.isBlocked(x, y),
            // background like field
            '!bg-transparent': game.isBackground(x, y),
            // lava trap
            'bg-red-600 ': game.isTrap(x, y),
            // target and target glow
            'bg-yellow-600': game.isTarget(x, y),
            // normal ground
            'bg-stone-800': game.isGround(x, y),
          }"
        >
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/game-store';
import { useI18n } from 'vue-i18n';
import map from '@/map';

const { t } = useI18n();
const game = useGameStore();
</script>
