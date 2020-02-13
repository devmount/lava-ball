<template>
  <div id="app" ref="game" tabindex="0" @keydown.left="left" @keydown.right="right" @keydown.up="up" @keydown.down="down">
    <div id="map">
      <div v-for="(y, i) in map.y" class="row">
        <div
          v-for="(x, j) in map.x"
          class="cell"
          :class="{ 'blocked': isBlocked(i, j), 'target': isTarget(i, j) }"
          @click="go(i, j)"
        ></div>
      </div>
      <div class="player" ref="p"></div>
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
      p: {x:0,y:9}
    }
  },
  mounted () {
    this.$refs.p.style.left = (this.p.x*52)+1 + 'px'
    this.$refs.p.style.top = (this.p.y*52)+1 + 'px'
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
      this.$refs.p.style.left = (x*52)+1 + 'px'
      this.$refs.p.style.top = (y*52)+1 + 'px'
    },
    left () {
      if (!this.isBlocked(this.p.x-1, this.p.y) && this.p.x > 0) {
        this.go(this.p.x-1, this.p.y)
      }
    },
    right () {
      if (!this.isBlocked(this.p.x+1, this.p.y) && this.p.x < this.map.x-1) {
        this.go(this.p.x+1, this.p.y)
      }
    },
    up () {
      if (!this.isBlocked(this.p.x, this.p.y-1) && this.p.y > 0) {
        this.go(this.p.x, this.p.y-1)
      }
    },
    down () {
      if (!this.isBlocked(this.p.x, this.p.y+1) && this.p.y < this.map.y-1) {
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

    .row
      justify-content center
      align-items center
      flex-direction column

      .cell
        background var(--available)
        width var(--unit)
        height var(--unit)
        border 1px solid

        &.blocked
          background var(--background)
        &.target
          background var(--target)

    .player
      position absolute
      width var(--unit)
      height var(--unit)
      background red
      transition left .1s, top .1s
</style>
