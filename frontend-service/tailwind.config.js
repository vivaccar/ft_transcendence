/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bitcount: ['Bitcount', 'monospace'],
        silkscreen: ['Silkscreen', 'monospace'],
        pressStart2P: ['PressStart2P', 'monospace'],
        kronaOne: ['KronaOne', 'monospace'],
      },
    },
  },
  plugins: [],
}