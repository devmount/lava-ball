<template>
  <div id="app" ref="game" tabindex="0" @keydown.left="left" @keydown.right="right" @keydown.up="up" @keydown.down="down">
    <div id="map">
      <div v-for="(y, i) in map.y+2" class="column">
        <div
          v-for="(x, j) in map.x+2"
          class="cell"
          :class="{
            'blocked': isBlocked(i, j),
            'background': isBackground(i, j),
            'target': isTarget(i, j),
          }"
        >
        <!-- {{i}},{{j}} -->
        </div>
      </div>
      <div :class="'player ' + lastDirection + ' ' + isFinished" ref="p"></div>
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
      map: {
        x: 10, y: 10,
        blocked: [{x:1,y:1}, {x:1,y:2}, {x:2,y:1}, {x:4,y:4}, {x:5,y:4}, {x:4,y:5}, {x:6,y:4}, {x:4,y:6}, {x:5,y:5}, {x:6,y:5}, {x:5,y:6}, {x:6,y:6}, {x:8,y:2}, {x:8,y:3}, {x:9,y:3}, {x:10,y:10}],
        background: [{x:0,y:0}, {x:0,y:1}, {x:1,y:0}, {x:5,y:5}, {x:11,y:11}],
        target: {x:9,y:2}
      },
      p: {x:1,y:10},
      lastDirection: 'right'
    }
  },
  mounted () {
    this.$refs.p.style.left = (this.p.x*64) + 'px'
    this.$refs.p.style.top = (this.p.y*64) + 'px'
    this.$refs.game.focus()
  },
  methods: {
    isBlocked (x, y) {
      for (let i = 0; i < this.map.blocked.length; i++) {
        const block = this.map.blocked[i]
        if (JSON.stringify(block) === JSON.stringify({x:x,y:y}) || x==0 || y==0 || x==this.map.x+1 || y==this.map.y+1) {
          return true
        }
      }
      return false
    },
    isBackground (x, y) {
      for (let i = 0; i < this.map.background.length; i++) {
        const b = this.map.background[i]
        if (JSON.stringify(b) === JSON.stringify({x:x,y:y})) {
          return true
        }
      }
      return false
    },
    isTarget (x, y) {
      return JSON.stringify(this.map.target) === JSON.stringify({x:x,y:y}) 
    },
    go (x, y) {
      this.p.x = x
      this.p.y = y
      this.$refs.p.style.left = (x*64) + 'px'
      this.$refs.p.style.top = (y*64) + 'px'
    },
    left () {
      this.lastDirection = 'left'
      if (!this.isBlocked(this.p.x-1, this.p.y) && this.p.x > 0) {
        this.go(this.p.x-1, this.p.y)
      }
    },
    right () {
      this.lastDirection = 'right'
      if (!this.isBlocked(this.p.x+1, this.p.y) && this.p.x < this.map.x) {
        this.go(this.p.x+1, this.p.y)
      }
    },
    up () {
      this.lastDirection = 'up'
      if (!this.isBlocked(this.p.x, this.p.y-1) && this.p.y > 0) {
        this.go(this.p.x, this.p.y-1)
      }
    },
    down () {
      this.lastDirection = 'down'
      if (!this.isBlocked(this.p.x, this.p.y+1) && this.p.y < this.map.y) {
        this.go(this.p.x, this.p.y+1)
      }
    }
  },
  computed: {
    isFinished () {
      if (JSON.stringify(this.map.target) === JSON.stringify(this.p)) {
        return 'exit'
      } else {
        return ''
      }
    },
  }
}
</script>

<style lang="stylus">
:root
  --background #000
  --available #222
  --target gold
  --unit 64px

html, body
  padding 0
  margin 0
  font-size var(--unit)

#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  background var(--background)
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
        background radial-gradient(black 15%, transparent 16%) 0 0, radial-gradient(black 15%, transparent 16%) 8px 8px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px
        background-color #282828
        background-size 16px 16px
        width 1rem
        height 1rem
        box-sizing border-box
        border 1px solid var(--available)
        font-size 16px // for debug purposes
        color white // for debug purposes

        &.blocked
          background var(--background)
          border-top .2rem solid #333
          border-left .2rem solid #333
          border-bottom .2rem solid #111
          border-right .2rem solid #111
          &.background
            border none
        &.target
          background var(--target)

    .player
      position absolute
      width 1rem
      height 1rem
      transition left .2s, top .2s, transform .1s

      &::after
        content ''
        display inline-block
        position absolute
        top 0
        left 50%
        transform translate(-50%)
        width .6rem
        height .6rem
        border-radius 50%
        background-color #3b4ba3
        background-image linear-gradient(-45deg, rgba(0,0,0,.5) 0%, transparent 100%);
        box-shadow 0 0.4rem 0.6rem .3rem var(--background)
        animation idle 1s 0s infinite ease-in-out alternate
        transition height 1s, width 1s, opacity .5s
      &.exit::after
        top .2rem
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

@keyframes idle
  from { top: 0;      box-shadow 0 0.4rem 0.6rem -0.05rem var(--background); }
  to   { top: .15rem; box-shadow 0 0.15rem 0.6rem -0.05rem var(--background); }

</style>
