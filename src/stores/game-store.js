import { computed } from 'vue';
import { defineStore } from 'pinia';
import { eq } from "@/helper";
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

  // check if given cell is blocked (not accessible by player)
  const isBlocked = (x, y, level=core.value.level) => {
    if (x==0 || y==0 || x==map[level].size[0]+1 || y==map[level].size[1]+1) {
      return true;
    }
    for (let i = 0; i < map[level].blocked.length; i++) {
      const block = map[level].blocked[i];
      if (eq(block, [x,y])) {
        return true;
      }
    }
    return false;
  };

  // check if cell is background cell
  // (not functional and not accessible due to completely surrounded by blocked cells)
  const isBackground = (x, y, level=core.value.level) => {
    for (let i = 0; i < map[level].background.length; i++) {
      const b = map[level].background[i];
      if (eq(b, [x,y])) {
        return true;
      }
    }
    return false;
  };

  // check if given cell is a trap (player dies)
  const isTrap = (x, y, level=core.value.level) => {
    for (let i = 0; i < map[level].trap.length; i++) {
      const trap = map[level].trap[i];
      if (eq(trap, [x,y])) {
        return true;
      }
    }
    return false;
  };

  // check if cell is level start
  const isStart = (x, y, level=core.value.level) => {
    return eq(map[level].start, [x,y]);
  };

  // check if cell is level goal
  const isTarget = (x, y, level=core.value.level) => {
    return eq(map[level].target, [x,y]);
  };

  // check if cell is normal ground
  const isGround = (x, y, level=core.value.level) => {
    return !isBlocked(x, y, level) && !isBackground(x, y, level) && !isTrap(x, y, level) && !isTarget(x, y, level);
  };

  return {
    core,
    char,
    isLastLevel,
    isBlocked,
    isBackground,
    isTrap,
    isStart,
    isTarget,
    isGround,
  }
})
