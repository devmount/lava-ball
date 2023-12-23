export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      animation: {
        'wave-once': 'wave 1s both',
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
        }
      },
    },
  },
  plugins: [],
}
