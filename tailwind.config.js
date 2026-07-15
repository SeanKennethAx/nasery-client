/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
    './app/plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary — teal, the app's main brand/action color (used for solid CTAs).
        primary: {
          DEFAULT: '#285F6b',
          25: '#f6fafb',
          50: '#eef4f5',
          100: '#d7e6e8',
          200: '#a9c9cd',
          300: '#7bacb2',
          400: '#4d8f97',
          500: '#417f88',
          600: '#346f7a',
          700: '#285F6b',
          800: '#1c4f5c',
          900: '#103f4d',
        },
      },
    },
  },
  plugins: [],
}

