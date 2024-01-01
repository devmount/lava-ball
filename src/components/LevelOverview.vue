<template>
  <div class="flex flex-col gap-8">
    <div class="text-stone-600 text-4xl font-bungee">{{ t('chooseLevel') }}</div>
    <div class="flex flex-wrap items-center gap-4">
      <div
        v-for="(level, key) in unlockedLevels"
        class="
          flex justify-center items-center outline outline-8 outline-transparent
          cursor-pointer hover:outline-stone-800
        "
        :class="{
          '!outline-stone-700': game.core.level == key,
        }"
        @click="setLevel(key)"
      >
        <div v-for="(_, x) in level.size[0]+2">
          <div
            v-for="(_, y) in level.size[1]+2"
            class="size-1"
            :class="{
              // unreachable block
              'bg-stone-950': game.isBlocked(x, y, key),
              // background like field
              '!bg-transparent': game.isBackground(x, y, key),
              // lava trap
              'bg-red-800 ': game.isTrap(x, y, key),
              // target and target glow
              'bg-yellow-500': game.isTarget(x, y, key),
              // normal ground
              'bg-stone-800': game.isGround(x, y, key),
            }"
          >
          </div>
        </div>
      </div>
      <div
        v-for="_ in lockedLevels"
        class="cursor-default size-8 flex justify-center items-center"
      >
        <div class="text-stone-600 text-xl font-bungee">?</div>
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

const unlockedLevels = Object.keys(map).reduce((r, e) => {
  if (e <= game.core.unlocked) r[e] = map[e];
  return r;
}, {});

const lockedLevels = Object.keys(map).reduce((r, e) => {
  if (e > game.core.unlocked) r[e] = map[e];
  return r;
}, {});

const setLevel = (key) => {
  if (key <= game.core.unlocked) {
    game.core.level = key;
  }
};
</script>
