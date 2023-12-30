<template>
  <div
    id="app"
    ref="board"
    tabindex="0"
    @keydown.left="left"
    @keydown.right="right"
    @keydown.up="up"
    @keydown.down="down"
    @keydown.escape="restart"
    @keydown.enter="next"
    @keydown.1="game.char.color = 1"
    @keydown.2="game.char.color = 2"
    @keydown.3="game.char.color = 3"
    class="relative bg-black w-screen h-screen flex justify-center items-center gap-20"
  >
    <!-- start section -->
    <div
      v-if="!game.core.started"
      class="absolute z-50 size-full bg-black flex flex-col justify-center items-center gap-8"
    >
      <brand />
      <div class="block w-1/2 p-16 flex justify-center items-center gap-16">
        <div class="flex flex-col gap-8">
          <div class="text-stone-600 text-4xl font-bungee">{{ t('chooseColor') }}</div>
          <div class="flex justify-center items-center gap-4">
            <div
              class="cursor-pointer transition-all size-10 border-4 border-rose-700 bg-rose-500"
              :class="{ 'outline outline-8 outline-stone-800': game.char.color === 1 }"
              @click="game.char.color = 1"
            ></div>
            <div
              class="cursor-pointer transition-all size-10 border-4 border-green-700 bg-green-500"
              :class="{ 'outline outline-8 outline-stone-800': game.char.color === 2 }"
              @click="game.char.color = 2"
            ></div>
            <div
              class="cursor-pointer transition-all size-10 border-4 border-violet-700 bg-violet-500"
              :class="{ 'outline outline-8 outline-stone-800': game.char.color === 3 }"
              @click="game.char.color = 3"
            ></div>
            <button @click="start()" class="ml-4">
              {{ t('startGame') }}
            </button>
          </div>
        </div>
        <div
          class="size-44 shrink-0 rounded-full bg-gradient-to-br animate-bounce"
          :class="{
            'from-rose-500 to-rose-700': game.char.color === 1,
            'from-green-500 to-green-700': game.char.color === 2,
            'from-violet-500 to-violet-700': game.char.color === 3,
          }"
        ></div>
      </div>
    </div>
    <!-- map section -->
    <div id="map" class="flex justify-center items-center relative">
      <div v-for="(_, x) in map[game.core.level].size[0]+2">
        <div
          v-for="(_, y) in map[game.core.level].size[1]+2"
          class="cell relative size-16 box-border transition-all duration-500"
          :class="{
            // unreachable block and start after first move
            'block z-10': isBlocked(x, y) && !(isStart(x, y) && game.core.init),
            // background like field
            '!bg-transparent !border-none': isBackground(x, y),
            // lava trap
            'bg-lava animate-waft shadow-inner-lg shadow-black ': isTrap(x, y),
            // target and target glow
            'bg-carbon gold': isTarget(x, y),
            // target reached
            'bg-carbon after:!size-0 after:!border-0 after:top-8 after:left-8': isTarget(x, y) && finished,
            // normal ground
            'bg-carbon border border-stone-900/50': isGround(x, y) || (isStart(x, y) && game.core.init),
          }"
          :style="{
            animationDelay: '-' + Math.floor((y+x) * 500) + 'ms'
          }"
        >
          <span v-if="debug" class="text-white">{{x}},{{y}}</span>
        </div>
      </div>
      <ball ref="ball" :color="game.char.color" :exit="finished || trapped" />
    </div>
    <!-- dashboard -->
    <dashboard :level="game.core.level" :steps="player.steps" :score="game.core.score" :debug="debug" />
    <!-- modal -->
    <modal :active="game.core.finished">
      <div class="text-center">
        <div v-if="!isLastLevel" class="text-5xl font-bungee">
          {{ t('levelCompleted', [game.core.level]) }}
        </div>
        <div v-else class="text-5xl font-bungee">
          {{ t('gameFinished') }}
        </div>
        <div>
          <p v-if="!isLastLevel">{{ t('youHavePoints', [game.core.score]) }}</p>
          <p v-else>{{ t('youFinishedWithPoints', [game.core.score]) }}</p>
        </div>
        <div class="mt-8">
          <button class="mr-4" @click="restart(false)">{{ t('restartLevel') }}</button>
          <button-primary v-if="!isLastLevel" @click="next">{{ t('nextLevel') }}</button-primary>
          <button-primary v-else @click="reset">{{ t('newGame') }}</button-primary>
        </div>
      </div>
    </modal>
    <!-- footer -->
    <footer>
      <div class="cursor-pointer fixed bottom-2 right-2" @click="debug = !debug">
        Debug Mode
        <span v-show="debug">On</span>
        <span v-show="!debug">Off</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, provide } from 'vue';
import { useGameStore } from '@/stores/game-store';
import { useI18n } from 'vue-i18n';
import Ball from "@/components/Ball.vue";
import Brand from "@/components/Brand.vue";
import ButtonPrimary from "@/components/ButtonPrimary.vue";
import Dashboard from "@/components/Dashboard.vue";
import level from '@/level';
import Modal from "@/components/Modal.vue";

const game = useGameStore();
const { t } = useI18n();

// fixed map configuration per level
const map = level;

// define board for focus for hotkey support
const board = ref(null);

// player configuration
const player = reactive({
  x:0,
  y:0,
  steps: 0,
});
const ball = ref(null);

// for development
const debug = ref(false);

// check if two given positions are equal
const eq = (a,b) => {
  return (a[0] == b[0] && a[1] == b[1]);
};

// calculate if game is finished (player reached goal)
const finished = computed(() => {
  if (eq(map[game.core.level].target, [player.x, player.y])) {
    game.core.score += player.steps;
    game.core.unlocked = Math.max(game.core.level, game.core.unlocked);
    setTimeout(() => game.core.finished = true, 1000);
    return true;
  } else {
    return false;
  }
});

// calculate if player is trapped (player dies, level restarts)
const trapped = computed(() => {
  let trapped = false;
  map[game.core.level].trap.forEach(t => {
    if (eq(t, [player.x, player.y])) {
      trapped = true;
    }
  });
  return trapped;
});

// calculate if current level is the last one
const isLastLevel = computed(() => {
  return game.core.level == Object.keys(map).length;
});

onMounted(() => {
  player.x = map[game.core.level].start[0];
  player.y = map[game.core.level].start[1];
  game.core.init = true;
  // initial position of player, one cell is 4x basic unit
  ball.value.el.style.left = 4*player.x + 'rem';
  ball.value.el.style.top = 4*player.y + 'rem';
  // set focus to game to handle key events
  board.value.focus();
});

const start = () => {
  game.core.started = true;
  board.value.focus();
};

// check if given cell is blocked (not accessible by player)
const isBlocked = (x, y) => {
  if (x==0 || y==0 || x==map[game.core.level].size[0]+1 || y==map[game.core.level].size[1]+1) {
    return true;
  }
  for (let i = 0; i < map[game.core.level].blocked.length; i++) {
    const block = map[game.core.level].blocked[i];
    if (eq(block, [x,y])) {
      return true;
    }
  }
  return false;
};

// check if cell is background cell
// (not functional and not accessible due to completely surrounded by blocked cells)
const isBackground = (x, y) => {
  for (let i = 0; i < map[game.core.level].background.length; i++) {
    const b = map[game.core.level].background[i];
    if (eq(b, [x,y])) {
      return true;
    }
  }
  return false;
};

// check if given cell is a trap (player dies)
const isTrap = (x, y) => {
  for (let i = 0; i < map[game.core.level].trap.length; i++) {
    const trap = map[game.core.level].trap[i];
    if (eq(trap, [x,y])) {
      return true;
    }
  }
  return false;
};

// check if cell is level start
const isStart = (x, y) => {
  return eq(map[game.core.level].start, [x,y]);
};

// check if cell is level goal
const isTarget = (x, y) => {
  return eq(map[game.core.level].target, [x,y]);
};

// check if cell is normal ground
const isGround = (x, y) => {
  return !isBlocked(x, y) && !isBackground(x, y) && !isTrap(x, y) && !isTarget(x, y);
};

// restart level by setting player position to start and initialize level
const restart = (keepGameScore=true, keepLevelScore=false) => {
  player.x = map[game.core.level].start[0];
  player.y = map[game.core.level].start[1];
  if (!keepGameScore) {
    game.core.score -= player.steps;
  }
  if (!keepLevelScore) {
    player.steps = -1;
  }
  go(player.x, player.y)
  game.core.init = true;
  game.core.finished = false;
  board.value.focus();
};
provide('restart', restart);

// move player to given position, if game isn't already finished
const go = (x, y) => {
  // only move player if game is not finished
  if (!finished.value && !trapped.value) {
    game.core.init = false;
    player.x = x;
    player.y = y;
    player.steps++;
    ball.value.el.style.left = 4*x + 'rem';
    ball.value.el.style.top = 4*y + 'rem';
    // player dies if trapped, level restart by keeping score
    if (trapped.value) {
      setTimeout(() => restart(true, true), 1000);
    }
  }
};

// move player one cell left
const left = () => {
  if (!isBlocked(player.x-1, player.y) && player.x > 0) {
    go(player.x-1, player.y);
  }
};
// move player one cell right
const right = () => {
  if (!isBlocked(player.x+1, player.y) && player.x < map[game.core.level].size[0]) {
    go(player.x+1, player.y);
  }
};
// move player one cell up
const up = () => {
  if (!isBlocked(player.x, player.y-1) && player.y > 0) {
    go(player.x, player.y-1);
  }
};
// move player one cell down
const down = () => {
  if (!isBlocked(player.x, player.y+1) && player.y < map[game.core.level].size[1]) {
    go(player.x, player.y+1);
  }
};


// reset game and start on level 1
const reset = () => {
  game.core.level = 1;
  game.core.score = 0;
  game.core.started = false;
  restart();
};
provide('reset', reset);

// go to next level
const next = () => {
  if (!game.core.started) {
    start();
  }
  if (!isLastLevel.value && finished.value || debug.value) {
    game.core.level++;
    restart();
  }
};
provide('next', next);

</script>
