import colors from './src/theme/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: colors,
        yely: {
          gold: colors.gold.DEFAULT,
          goldLight: colors.gold.light,
          goldDark: colors.gold.dark,
          black: colors.surface.black,
          richBlack: colors.surface.richBlack,
          charcoal: colors.surface.charcoal,
          card: colors.surface.card,
          white: colors.text.white,
          offWhite: colors.text.offWhite,
          softGray: colors.text.softGray,
          muted: colors.text.muted,
          success: colors.status.success,
          warning: colors.status.warning,
          danger: colors.status.danger,
          info: colors.status.info,
        }
      }
    },
  },
  plugins: [],
};
