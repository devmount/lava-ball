export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      animation: {
        'wave-once': 'wave 1s both',
        'idle': 'idle 1s 0s infinite cubic-bezier(.65,.05,.36,1) alternate',
        'glow': 'glow 2s 0s infinite linear alternate',
      },
      fontFamily: {
        bungee: ["Bungee", "cursive"],
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scaleX(1)' },
          '10%, 20%': { transform: 'translate(-50%, -50%) scale3d(.9,.9,.9) rotate(-3deg)' },
          '30%, 60%, 90%': { transform: 'translate(-50%, -50%) scale3d(1.1,1.1,1.1) rotate(3deg)' },
          '45%, 75%': { transform: 'translate(-50%, -50%) scale3d(1.1,1.1,1.1) rotate(-3deg)' },
        },
        idle: {
          '0%': { top: '.5rem', boxShadow: '0 .6rem 2.4rem 0 #000' },
          '100%': { top: '0', boxShadow: '0 1.6rem 2.4rem 0 #000' },
        },
        glow: {
          '0%': { boxShadow: 'box-shadow 0 0 .8rem -.4rem gold' },
          '100%': { boxShadow: 'box-shadow 0 0 2rem -.4rem gold' },
        }
      },
    },
  },
  plugins: [],
}
