/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E8F0F8',
          100: '#C5D9ED',
          200: '#9FBFDE',
          300: '#79A5CF',
          400: '#538BC0',
          500: '#2E75B6',
          600: '#1F4E79',
          700: '#193D5E',
          800: '#132D44',
          900: '#0D1D2A',
        },
      },
    },
  },
  plugins: [],
};
