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
  >
    <!-- map section -->
    <div id="map">
      <div v-for="(y, i) in map.y+2" class="column">
        <div
          v-for="(x, j) in map.x+2"
          class="cell"
          :class="{
            'blocked': isBlocked(i, j),
            'background': isBackground(i, j),
            'start': isStart(i, j) && game.init,
            'target': isTarget(i, j),
            'target-closed': isTarget(i, j) && finished,
          }"
        >
        <!-- {{i}},{{j}} --><!--for debugging or map creation -->
        </div>
      </div>
      <div :class="'player ' + lastDirection + ' ' + (finished ? 'exit' : '')" ref="player"></div>
    </div>
    <!-- dashboard -->
    <div id="dashboard">
      <div class="number text-center">
        <span class="size-2x">{{ player.steps }}</span>
        <label>steps</label>
      </div>
      <button class="btn" @click="restart">Restart</button>
    </div>
    <!-- modal -->
    <div class="modal" :class="{ 'active': game.finished }">
      <div class="modal-content text-center">
        <div class="header">
          <h2>Level 1 finished!</h2>
        </div>
        <div class="body">
          <p>Congratulations! You finished level 1 with {{ player.steps }} steps.</p>
          <button class="btn" @click="restart">Restart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      // fixed map configuration per level
      map: {
        x: 10, y: 10,
        blocked: [{x:1,y:1}, {x:1,y:2}, {x:2,y:1}, {x:4,y:4}, {x:5,y:4}, {x:4,y:5}, {x:6,y:4}, {x:4,y:6}, {x:5,y:5}, {x:6,y:5}, {x:5,y:6}, {x:6,y:6}, {x:8,y:2}, {x:8,y:3}, {x:9,y:3}, {x:10,y:10}],
        background: [{x:0,y:0}, {x:0,y:1}, {x:1,y:0}, {x:5,y:5}, {x:11,y:11}],
        start: {x:0,y:10},
        target: {x:9,y:2}
      },
      // game configuration
      game: {
        init: true,
        finished: false,
      },
      // player configuration
      player: {
        x:0, y:10,
        active: true,
        steps: 0,
        lastDirection: 'right',
      }
    }
  },
  mounted () {
    // initial position of player, one cell is 4x basic unit
    this.$refs.player.style.left = 4*this.player.x + 'rem'
    this.$refs.player.style.top = 4*this.player.y + 'rem'
    // set focus to game to handle key events
    this.$refs.game.focus()
  },
  methods: {
    // check if given cell is blocked (not accessible by player)
    isBlocked (x, y) {
      for (let i = 0; i < this.map.blocked.length; i++) {
        const block = this.map.blocked[i]
        if (this.eq(block, {x:x,y:y}) || x==0 || y==0 || x==this.map.x+1 || y==this.map.y+1) {
          return true
        }
      }
      return false
    },
    // check if cell is background cell (not functional and not accessible due to completely surrounded by blocked cells)
    isBackground (x, y) {
      for (let i = 0; i < this.map.background.length; i++) {
        const b = this.map.background[i]
        if (this.eq(b, {x:x,y:y})) {
          return true
        }
      }
      return false
    },
    // check if cell is level start
    isStart (x, y) {
      return this.eq(this.map.start, {x:x,y:y})
    },
    // check if cell is level goal
    isTarget (x, y) {
      return this.eq(this.map.target, {x:x,y:y})
    },
    // move player to given position, if game isn't already finished
    go (x, y) {
      // if (!this.finished) {
        this.game.init = false
        this.player.x = x
        this.player.y = y
        this.player.steps++
        this.$refs.player.style.left = 4*x + 'rem'
        this.$refs.player.style.top = 4*y + 'rem'
      // }
    },
    // move player one cell left
    left () {
      this.lastDirection = 'left'
      if (!this.isBlocked(this.player.x-1, this.player.y) && this.player.x > 0) {
        this.go(this.player.x-1, this.player.y)
      }
    },
    // move player one cell right
    right () {
      this.lastDirection = 'right'
      if (!this.isBlocked(this.player.x+1, this.player.y) && this.player.x < this.map.x) {
        this.go(this.player.x+1, this.player.y)
      }
    },
    // move player one cell up
    up () {
      this.lastDirection = 'up'
      if (!this.isBlocked(this.player.x, this.player.y-1) && this.player.y > 0) {
        this.go(this.player.x, this.player.y-1)
      }
    },
    // move player one cell down
    down () {
      this.lastDirection = 'down'
      if (!this.isBlocked(this.player.x, this.player.y+1) && this.player.y < this.map.y) {
        this.go(this.player.x, this.player.y+1)
      }
    },
    // restart level by setting player position to start and initialize level
    restart () {
      this.player.x = this.map.start.x
      this.player.y = this.map.start.y
      this.player.steps = -1
      this.go(this.player.x, this.player.y)
      this.game.init = true
      this.game.finished = false
    },
    // check if two given positions are equal
    eq (a,b) {
      return (a.x == b.x && a.y == b.y)
    }
  },
  computed: {
    // calculate if game is finished (player reached goal)
    finished () {
      if (this.eq(this.map.target, this.player)) {
        let self = this
        setTimeout(function(){ self.game.finished = true}, 1500)
        return true
      } else {
        return false
      }
    },
  }
}
</script>

<style lang="stylus">
$background = #000
$available = #222
$target = gold
$primary = #a3533b
$light = #efefef
$unit = 16px // cell size is per default 4x $unit
$material-carbon = radial-gradient(black 15%, transparent 16%) 0 0, radial-gradient(black 15%, transparent 16%) 8px 8px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px

html, body
  padding 0
  margin 0
  font-size $unit

// layout
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  background $background
  height 100vh
  display flex
  justify-content center
  align-items center

  #map
    display flex
    justify-content center
    align-items center
    flex-direction row
    position relative

    .column
      justify-content center
      align-items center
      flex-direction column

      .cell
        background $material-carbon
        background-color #282828
        background-size 1rem 1rem
        position relative
        width 4rem
        height 4rem
        box-sizing border-box
        border 1px solid $available
        color white // for debug purposes
        transition all .5s

        &.blocked
          &:not(.start)
            background $background
            border none
          &:not(.start):not(.background)
            border-top .8rem solid #333
            border-left .8rem solid #333
            border-bottom .8rem solid #111
            border-right .8rem solid #111
        &.target
          background $available
        &.target::before, &.target::after
          content ''
          display block
          position absolute
          width 70%
          height 70%
          top 50%
          left 50%
          transform translate(-50%, -50%)
        &.target::after
          background $target
          transition width 1s .3s, height 1s .3s
          animation glow 2s 0s infinite linear alternate
        &.target-closed::before
          transition opacity 1s .5s
          background $background
          opacity 0
        &.target-closed::after
          width 0
          height 0

    .player
      position absolute
      width 4rem
      height 4rem
      transition left .2s, top .2s, transform .1s

      &::after
        content ''
        display inline-block
        position absolute
        top 2.4rem
        left 50%
        transform translate(-50%)
        width 2.4rem
        height 2.4rem
        border-radius 50%
        background-color $primary
        background-image linear-gradient(-45deg, rgba($background,.6) 0%, transparent 100%);
        box-shadow 0 1.6rem 2.4rem 1.2rem $background
        animation idle 1s 0s infinite cubic-bezier(.65,.05,.36,1) alternate
        transition height 1s, width 1s, opacity .5s
      &.exit::after
        top 1.2rem
        animation none
        box-shadow none
        width 0
        height 0
        opacity 0

      &.right
        // transform rotate(90deg)
      &.left
        // transform rotate(-90deg)
      &.up
        // transform rotate(0deg)
      &.down
        // transform rotate(180deg)
  #dashboard
    display flex
    justify-content center
    align-items center
    flex-direction column
    margin-left 8rem
    padding 2rem
    background $available

    & > *:not(:last-child)
      margin-bottom .5rem

// text
.size-2x
  font-size 2rem

.text-center
  text-align center

// buttons
.btn
  appearance none
  background $available
  border .04rem solid $primary
  border-radius 0
  color $primary
  cursor pointer
  display inline-block
  outline none
  padding .6rem .8rem
  text-decoration none
  transition background .2s, border .2s, box-shadow .2s, color .2s
  user-select none
  vertical-align middle
  white-space nowrap
  text-transform uppercase
  letter-spacing .2rem
  &:hover
    box-shadow 0 0 0 .4rem rgba($primary, .2)
  &:focus,
  &:hover
    background rgba($primary, .2)
    border-color $primary
    text-decoration none
  &:active,
  &.active
    background $primary
    border-color darken($primary, 5%)
    color $light
    text-decoration none

// featured numbers
.number
  background $available
  color $primary

  label
    display inline-block
    margin-left .5rem

// modal
.modal
  background $available
  color $light
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 50%
  height auto
  padding 2rem
  opacity 0
  visibility hidden
  box-shadow 0 0 100vw 100vw rgba(0,0,0,.5)
  box-sizing border-box
  transition all .4s ease-in-out

  &.active
    width 60%
    opacity 1
    visibility visible
    animation finished 1s both

// animations
@keyframes idle
  from
    top .6rem
    box-shadow 0 .6rem 2.4rem -.2rem $background
  to
    top 0
    box-shadow 0 1.6rem 2.4rem -.2rem $background

@keyframes glow
  from
    box-shadow 0 0 .8rem -.4rem $target
  to
    box-shadow 0 0 2rem -.4rem $target

@keyframes finished
  0%
    transform translate(-50%, -50%) scaleX(1);
  10%, 20%
    transform translate(-50%, -50%) scale3d(.9,.9,.9) rotate(-3deg);
  30%, 60%, 90%
    transform translate(-50%, -50%) scale3d(1.1,1.1,1.1) rotate(3deg);
  45%, 75%
    transform translate(-50%, -50%) scale3d(1.1,1.1,1.1) rotate(-3deg);
  100%
    transform translate(-50%, -50%) scaleX(1);
</style>
