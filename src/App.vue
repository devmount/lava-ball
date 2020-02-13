<template>
  <div id="app" ref="game" tabindex="0" @keydown.left="left" @keydown.right="right" @keydown.up="up" @keydown.down="down">
    <div id="map">
      <div v-for="(y, i) in map.y" class="column">
        <div
          v-for="(x, j) in map.x"
          class="cell"
          :class="{ 'blocked': isBlocked(i, j), 'target': isTarget(i, j) }"
        ></div>
      </div>
      <div class="player" :class="lastDirection" ref="p">A</div>
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
        blocked: [{x:0,y:0}, {x:0,y:1}, {x:1,y:0}, {x:4,y:4}, {x:5,y:4}, {x:4,y:5}, {x:5,y:5}, {x:9,y:9}],
        target: {x:8,y:1}
      },
      p: {x:0,y:9},
      lastDirection: 'right'
    }
  },
  mounted () {
    this.$refs.p.style.left = (this.p.x*50) + 'px'
    this.$refs.p.style.top = (this.p.y*50) + 'px'
    this.$refs.game.focus()
  },
  methods: {
    isBlocked (x, y) {
      for (let i = 0; i < this.map.blocked.length; i++) {
        const element = this.map.blocked[i]
        if (JSON.stringify(element) === JSON.stringify({x:x,y:y}) ) {
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
      this.$refs.p.style.left = (x*50) + 'px'
      this.$refs.p.style.top = (y*50) + 'px'
    },
    left () {
      if (!this.isBlocked(this.p.x-1, this.p.y) && this.p.x > 0) {
        this.lastDirection = 'left'
        this.go(this.p.x-1, this.p.y)
      }
    },
    right () {
      if (!this.isBlocked(this.p.x+1, this.p.y) && this.p.x < this.map.x-1) {
        this.lastDirection = 'right'
        this.go(this.p.x+1, this.p.y)
      }
    },
    up () {
      if (!this.isBlocked(this.p.x, this.p.y-1) && this.p.y > 0) {
        this.lastDirection = 'up'
        this.go(this.p.x, this.p.y-1)
      }
    },
    down () {
      if (!this.isBlocked(this.p.x, this.p.y+1) && this.p.y < this.map.y-1) {
        this.lastDirection = 'down'
        this.go(this.p.x, this.p.y+1)
      }
    }
  },
}
</script>

<style lang="stylus">
:root
  --background #000
  --available #444
  --target gold
  --unit 50px

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
        background var(--available)
        width 1rem
        height 1rem

        &.blocked
          background var(--background)
        &.target
          background var(--target)

    .player
      position absolute
      width 1rem
      height 1rem
      background #aaa
      transition left .2s, top .2s, transform .1s

      &.right
        transform rotate(90deg)
      &.left
        transform rotate(-90deg)
      &.up
        transform rotate(0deg)
      &.down
        transform rotate(180deg)
</style>
