/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yely: {
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          goldDark: '#AA8C2C',
          black: '#000000',
          richBlack: '#0A0A0A',
          charcoal: '#121212',
          white: '#FFFFFF',
          offWhite: '#F8F9FA',
          softGray: '#E9ECEF',
          success: '#27AE60',
          danger: '#C0392B',
        }
      }
    },
  },
  plugins: [],
}