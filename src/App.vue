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
    class="relative bg-black w-screen h-screen flex justify-center items-center gap-20"
  >
    <!-- map section -->
    <div id="map" class="flex justify-center items-center relative">
      <div v-for="(y, i) in map[game.level].x+2">
        <div
          v-for="(x, j) in map[game.level].y+2"
          class="cell relative size-16 box-border transition-all duration-500"
          :class="{
            // unreachable block and start after first move
            'bg-stone-950 border-12 border-t-stone-800/60 border-l-stone-800/60 border-b-black border-r-black shadow-xl shadow-black/70 z-10': isBlocked(i, j) && !(isStart(i, j) && game.init),
            // background like field
            'bg-transparent !border-none': isBackground(i, j),
            // lava trap
            'bg-lava animate-waft shadow-inner-lg shadow-black ': isTrap(i, j),
            // target and target glow
            'bg-yellow-500 border-12 border-stone-900/90': isTarget(i, j),
            'after:absolute after:size-full after:animate-glow': isTarget(i, j),
            // target reached
            'border-32': isTarget(i, j) && finished,
            // normal ground
            'bg-carbon border border-stone-900/50': isGround(i, j) || (isStart(i, j) && game.init),
          }"
          :style="{
            animationDelay: '-' + Math.floor((j+i) * 500) + 'ms'
          }"
        >
          <span v-if="debug" class="text-white">{{i}},{{j}}</span>
        </div>
      </div>
      <div ref="ball" class="absolute size-16 transition-all">
        <div
          class="
            absolute top-10 left-1/2 -translate-x-1/2 translate-y-1/4 size-10 rounded-full
            bg-gradient-to-br from-rose-500 to-rose-700
            animate-idle transition-all duration-300
          "
          :class="{ 'top-5 animate-none shadow !size-0 opacity-0': finished || trapped }"
        ></div>
      </div>
    </div>
    <!-- dashboard -->
    <div class="flex flex-col justify-center gap-8">
      <div class="flex flex-col items-center text-rose-600">
        <span class="text-3xl font-bungee">Lava</span>
        <span class="text-6xl font-bungee leading-10">Ball</span>
        <span>v{{ $version }}</span>
      </div>
      <div class="flex flex-col gap-4 p-8 bg-stone-900 text-center rounded">
        <div class="text-rose-600 text-center text-4xl font-bungee">
          Level {{ game.level }}
        </div>
        <div class="flex gap-2 justify-center text-rose-600">
          <div class="text-4xl font-bungee">{{ player.steps }}</div>
          <div class="uppercase tracking-widest">steps</div>
        </div>
        <button class="btn-block" @click="restart()">Restart Level</button>
        <button class="btn-block" v-if="debug" @click="next">Next Level</button>
      </div>
      <div class="flex flex-col gap-4 p-8 bg-stone-900 text-center rounded">
        <div class="text-rose-600 text-center text-4xl font-bungee">
          Total
        </div>
        <div class="flex gap-2 justify-center text-rose-600">
          <div class="text-4xl font-bungee">{{ game.score }}</div>
          <div class="uppercase tracking-widest">points</div>
        </div>
        <button class="btn-block" @click="reset">New Game</button>
      </div>
    </div>
    <!-- modal -->
    <modal :active="game.finished">
      <div class="text-center">
        <div v-if="!isLastLevel" class="text-5xl font-bungee">
          Level {{ game.level }} completed!
        </div>
        <div v-else class="text-5xl font-bungee">
          Game finished!
        </div>
        <div>
          <p v-if="!isLastLevel">You currently have {{ game.score }} points.</p>
          <p v-else>Congratulations! You finished the game with {{ game.score }} points.</p>
        </div>
        <div class="mt-8">
          <button class="mr-4" @click="restart(false)">Restart Level</button>
          <button-primary v-if="!isLastLevel" @click="next">Next Level</button-primary>
          <button-primary v-else @click="reset">New Game</button-primary>
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
import { reactive, ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonPrimary from "@/components/ButtonPrimary.vue";
import Modal from "@/components/Modal.vue";
// import Player from "@/components/Player.vue";
import level from './level';

const { t } = useI18n();

// fixed map configuration per level
const map = level;

// game configuration
const game = reactive({
  level: 1,
  init: true,
  finished: false,
  score: 0,
});
const board = ref(null);

// player configuration
const player = reactive({
  x:0, y:0,
  active: true,
  steps: 0,
});
const ball = ref(null);

// for development
const debug = ref(false);


// calculate if game is finished (player reached goal)
const finished = computed(() => {
  if (eq(map[game.level].target, player)) {
    game.score += player.steps;
    setTimeout(() => game.finished = true, 1500);
    return true;
  } else {
    return false;
  }
});

// calculate if player is trapped (player dies, level restarts)
const trapped = computed(() => {
  let trapped = false;
  map[game.level].trap.forEach(t => {
    if (eq(t, player)) {
      trapped = true;
    }
  });
  return trapped;
});

// calculate if current level is the last one
const isLastLevel = computed(() => {
  return game.level == Object.keys(map).length;
});

onMounted(() => {
  player.x = map[game.level].start.x;
  player.y = map[game.level].start.y;
  // initial position of player, one cell is 4x basic unit
  ball.value.style.left = 4*player.x + 'rem';
  ball.value.style.top = 4*player.y + 'rem';
  // set focus to game to handle key events
  board.value.focus();
});

// check if two given positions are equal
const eq = (a,b) => {
  return (a.x == b.x && a.y == b.y);
};

// check if given cell is blocked (not accessible by player)
const isBlocked = (x, y) => {
  if (x==0 || y==0 || x==map[game.level].x+1 || y==map[game.level].y+1) {
    return true;
  }
  for (let i = 0; i < map[game.level].blocked.length; i++) {
    const block = map[game.level].blocked[i];
    if (eq(block, {x:x,y:y})) {
      return true;
    }
  }
  return false;
};

// check if cell is background cell (not functional and not accessible due to completely surrounded by blocked cells)
const isBackground = (x, y) => {
  for (let i = 0; i < map[game.level].background.length; i++) {
    const b = map[game.level].background[i];
    if (eq(b, {x:x,y:y})) {
      return true;
    }
  }
  return false;
};

// check if given cell is a trap (player dies)
const isTrap = (x, y) => {
  for (let i = 0; i < map[game.level].trap.length; i++) {
    const trap = map[game.level].trap[i];
    if (eq(trap, {x:x,y:y})) {
      return true;
    }
  }
  return false;
};

// check if cell is level start
const isStart = (x, y) => {
  return eq(map[game.level].start, {x:x,y:y});
};

// check if cell is level goal
const isTarget = (x, y) => {
  return eq(map[game.level].target, {x:x,y:y});
};

// check if cell is normal ground
const isGround = (x, y) => {
  return !isBlocked(x, y) && !isBackground(x, y) && !isTrap(x, y) && !isTarget(x, y);
};

// restart level by setting player position to start and initialize level
const restart = (keepGameScore=true, keepLevelScore=false) => {
  player.x = map[game.level].start.x;
  player.y = map[game.level].start.y;
  if (!keepGameScore) {
    game.score -= player.steps;
  }
  if (!keepLevelScore) {
    player.steps = -1;
  }
  go(player.x, player.y)
  game.init = true;
  game.finished = false;
  board.value.focus();
};

// move player to given position, if game isn't already finished
const go = (x, y) => {
  // only move player if game is not finished
  if (!finished.value && !trapped.value) {
    game.init = false;
    player.x = x;
    player.y = y;
    player.steps++;
    ball.value.style.left = 4*x + 'rem';
    ball.value.style.top = 4*y + 'rem';
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
  if (!isBlocked(player.x+1, player.y) && player.x < map[game.level].x) {
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
  if (!isBlocked(player.x, player.y+1) && player.y < map[game.level].y) {
    go(player.x, player.y+1);
  }
};


// reset game and start on level 1
const reset = () => {
  game.level = 1;
  game.score = 0;
  restart();
};
// go to next level
const next = () => {
  if (!isLastLevel.value) {
    game.level++;
    restart();
  }
};
</script>
