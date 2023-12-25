<template>
  <div
    id="app"
    ref="game"
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
          class="cell"
          :class="{
            blocked: isBlocked(i, j),
            background: isBackground(i, j),
            trap: isTrap(i, j),
            start: isStart(i, j) && game.init,
            target: isTarget(i, j),
            targetClosed: isTarget(i, j) && finished,
          }"
        >
          <span v-if="debug">{{i}},{{j}}</span>
        </div>
      </div>
      <div ref="player" class="absolute w-16 h-16 transition-all">
        <div
          class="
            absolute top-10 left-1/2 -translate-x-1/2 translate-y-1/4 w-10 h-10 rounded-full
            bg-gradient-to-br from-rose-500 to-rose-700
            animate-idle transition-all
          "
          :class="{ 'top-4 animate-none shadow w-0 h-0 opacity-0': finished || trapped }"
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

<script>
import { defineComponent } from 'vue';
import ButtonPrimary from "@/components/ButtonPrimary.vue";
import Modal from "@/components/Modal.vue";
// import Player from "@/components/Player.vue";
import level from './level';

export default defineComponent({
  name: 'App',
  components: {
    ButtonPrimary,
    Modal,
    // Player,
  },
  data () {
    return {
      // fixed map configuration per level
      map: level,
      // game configuration
      game: {
        level: 1,
        init: true,
        finished: false,
        score: 0,
      },
      // player configuration
      player: {
        x:0, y:0,
        active: true,
        steps: 0,
      },
      // for development
      debug: false
    }
  },
  mounted () {
    this.player.x = this.map[this.game.level].start.x
    this.player.y = this.map[this.game.level].start.y
    // initial position of player, one cell is 4x basic unit
    this.$refs.player.style.left = 4*this.player.x + 'rem'
    this.$refs.player.style.top = 4*this.player.y + 'rem'
    // set focus to game to handle key events
    this.$refs.game.focus()
  },
  methods: {
    // check if given cell is blocked (not accessible by player)
    isBlocked (x, y) {
      if (x==0 || y==0 || x==this.map[this.game.level].x+1 || y==this.map[this.game.level].y+1) {
        return true
      }
      for (let i = 0; i < this.map[this.game.level].blocked.length; i++) {
        const block = this.map[this.game.level].blocked[i]
        if (this.eq(block, {x:x,y:y})) {
          return true
        }
      }
      return false
    },
    // check if cell is background cell (not functional and not accessible due to completely surrounded by blocked cells)
    isBackground (x, y) {
      for (let i = 0; i < this.map[this.game.level].background.length; i++) {
        const b = this.map[this.game.level].background[i]
        if (this.eq(b, {x:x,y:y})) {
          return true
        }
      }
      return false
    },
    // check if given cell is a trap (player dies)
    isTrap (x, y) {
      for (let i = 0; i < this.map[this.game.level].trap.length; i++) {
        const trap = this.map[this.game.level].trap[i]
        if (this.eq(trap, {x:x,y:y})) {
          return true
        }
      }
      return false
    },
    // check if cell is level start
    isStart (x, y) {
      return this.eq(this.map[this.game.level].start, {x:x,y:y})
    },
    // check if cell is level goal
    isTarget (x, y) {
      return this.eq(this.map[this.game.level].target, {x:x,y:y})
    },
    // move player to given position, if game isn't already finished
    go (x, y) {
      // only move player if game is not finished
      if (!this.finished && !this.trapped) {
        this.game.init = false
        this.player.x = x
        this.player.y = y
        this.player.steps++
        this.$refs.player.style.left = 4*x + 'rem'
        this.$refs.player.style.top = 4*y + 'rem'
        // player dies if trapped, level restart by keeping score
        if (this.trapped) {
          let self = this
          setTimeout(function(){ self.restart(true, true) }, 1000)
        }
      }
    },
    // move player one cell left
    left () {
      if (!this.isBlocked(this.player.x-1, this.player.y) && this.player.x > 0) {
        this.go(this.player.x-1, this.player.y)
      }
    },
    // move player one cell right
    right () {
      if (!this.isBlocked(this.player.x+1, this.player.y) && this.player.x < this.map[this.game.level].x) {
        this.go(this.player.x+1, this.player.y)
      }
    },
    // move player one cell up
    up () {
      if (!this.isBlocked(this.player.x, this.player.y-1) && this.player.y > 0) {
        this.go(this.player.x, this.player.y-1)
      }
    },
    // move player one cell down
    down () {
      if (!this.isBlocked(this.player.x, this.player.y+1) && this.player.y < this.map[this.game.level].y) {
        this.go(this.player.x, this.player.y+1)
      }
    },
    // restart level by setting player position to start and initialize level
    restart (keepGameScore=true, keepLevelScore=false) {
      this.player.x = this.map[this.game.level].start.x
      this.player.y = this.map[this.game.level].start.y
      if (!keepGameScore) {
        this.game.score -= this.player.steps
      }
      if (!keepLevelScore) {
        this.player.steps = -1
      }
      this.go(this.player.x, this.player.y)
      this.game.init = true
      this.game.finished = false
      this.$refs.game.focus()
    },
    // reset game and start on level 1
    reset () {
      this.game.level = 1
      this.game.score = 0
      this.restart()
    },
    // go to next level
    next () {
      if (!this.isLastLevel) {
        this.game.level++
        this.restart()
      }
    },
    // check if two given positions are equal
    eq (a,b) {
      return (a.x == b.x && a.y == b.y)
    }
  },
  computed: {
    // calculate if game is finished (player reached goal)
    finished () {
      if (this.eq(this.map[this.game.level].target, this.player)) {
        this.game.score += this.player.steps
        let self = this
        setTimeout(function(){ self.game.finished = true}, 1500)
        return true
      } else {
        return false
      }
    },
    // calculate if player is trapped (player dies, level restarts)
    trapped () {
      let trapped = false
      this.map[this.game.level].trap.forEach(t => {
        if (this.eq(t, this.player)) {
          trapped = true
        }
      })
      return trapped
    },
    // calculate if current level is the last one
    isLastLevel () {
      return this.game.level == Object.keys(this.map).length
    },
  }
});
</script>

<style lang="stylus">
@import "assets/global"
</style>
