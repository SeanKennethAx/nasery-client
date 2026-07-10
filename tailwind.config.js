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
        brand: {
          50: '#eef4f5',
          100: '#d7e6e8',
          200: '#a9c9cd',
          300: '#7bacb2',
          400: '#4d8f97',
          500: '#2b6777',
          600: '#24707d',
          700: '#1d5560',
          800: '#17454e',
          900: '#143b42',
        },
      },
    },
  },
  plugins: [],
}

